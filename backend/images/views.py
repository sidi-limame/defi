"""
Module de vues Django REST Framework pour l'API des images.

Ce module contient toutes les vues API pour :
- Upload d'images
- Liste des images
- Détails d'une image
- Suppression d'images
"""

# Imports Django REST Framework pour créer l'API
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

# Imports locaux : modèles, sérialiseurs et utilitaires
from .models import OptimizedImage
from .serializers import OptimizedImageSerializer
from .utils import optimize_image


class ImageUploadView(APIView):
    """
    Vue API pour l'upload et l'optimisation d'images.
    
    Cette classe gère les requêtes POST pour uploader une image.
    Elle valide le fichier, le sauvegarde et génère les versions optimisées.
    """
    # Définit les parsers autorisés pour recevoir des fichiers
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        """
        Gère la requête POST pour uploader une image.
        
        Processus :
        1. Vérifie qu'un fichier image est fourni
        2. Valide le type de fichier
        3. Crée une instance OptimizedImage
        4. Optimise l'image (WebP, thumbnail, blur)
        5. Retourne les données de l'image optimisée
        
        Args:
            request: Objet requête HTTP contenant le fichier dans request.FILES
            
        Returns:
            Response: Réponse JSON avec les données de l'image ou une erreur
        """
        # ========== VALIDATION DU FICHIER ==========
        
        # Vérifie qu'un fichier nommé 'image' est présent dans la requête
        if 'image' not in request.FILES:
            return Response(
                {'error': 'No image file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Récupère le fichier uploadé
        uploaded_file = request.FILES['image']
        
        # ========== VALIDATION DU TYPE DE FICHIER ==========
        
        # Liste des types MIME acceptés
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        
        # Vérifie que le type du fichier est dans la liste autorisée
        if uploaded_file.content_type not in allowed_types:
            return Response(
                {'error': f'Invalid file type. Allowed: {", ".join(allowed_types)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # ========== CRÉATION DE L'INSTANCE ==========
        
        # Crée une nouvelle instance OptimizedImage avec les données du fichier
        optimized_image = OptimizedImage(
            original_name=uploaded_file.name,  # Nom original
            original_file=uploaded_file        # Fichier lui-même
        )
        
        # Enregistre la taille du fichier original en octets
        optimized_image.original_size = uploaded_file.size
        
        # Sauvegarde l'instance dans la base de données
        # (le fichier est automatiquement uploadé grâce à upload_to dans le modèle)
        optimized_image.save()
        
        # ========== OPTIMISATION DE L'IMAGE ==========
        
        try:
            # Génère les versions optimisées (WebP, thumbnail, blur placeholder)
            optimize_image(optimized_image)
            
            # Rafraîchit l'instance depuis la DB pour avoir toutes les données
            optimized_image.refresh_from_db()
            
        except Exception as e:
            # En cas d'erreur lors de l'optimisation, supprime l'instance créée
            optimized_image.delete()
            
            # Retourne une erreur avec le message
            return Response(
                {'error': f'Error optimizing image: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # ========== RETOUR DE LA RÉPONSE ==========
        
        # Sérialise l'image optimisée en JSON
        serializer = OptimizedImageSerializer(optimized_image, context={'request': request})
        
        # Retourne les données avec le code HTTP 201 (Created)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def image_list(request):
    """
    Vue API pour lister toutes les images optimisées.
    
    Cette fonction retourne la liste complète de toutes les images
    stockées dans la base de données, triées par date de création.
    
    Args:
        request: Objet requête HTTP
        
    Returns:
        Response: Réponse JSON avec la liste des images
    """
    # Récupère toutes les images de la base de données
    # (triées par date décroissante grâce à ordering dans Meta du modèle)
    images = OptimizedImage.objects.all()
    
    # Sérialise toutes les images (many=True pour plusieurs objets)
    serializer = OptimizedImageSerializer(images, many=True, context={'request': request})
    
    # Retourne les données sérialisées
    return Response(serializer.data)


@api_view(['GET'])
def image_detail(request, pk):
    """
    Vue API pour obtenir les détails d'une image spécifique.
    
    Cette fonction retourne les informations détaillées d'une image
    identifiée par son ID (primary key).
    
    Args:
        request: Objet requête HTTP
        pk: Primary key (ID) de l'image à récupérer
        
    Returns:
        Response: Réponse JSON avec les détails de l'image ou erreur 404
    """
    try:
        # Essaie de récupérer l'image avec l'ID fourni
        image = OptimizedImage.objects.get(pk=pk)
        
        # Sérialise l'image
        serializer = OptimizedImageSerializer(image, context={'request': request})
        
        # Retourne les données
        return Response(serializer.data)
        
    except OptimizedImage.DoesNotExist:
        # Si l'image n'existe pas, retourne une erreur 404
        return Response(
            {'error': 'Image not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['DELETE'])
def image_delete(request, pk):
    """
    Vue API pour supprimer une image.
    
    Cette fonction supprime une image et tous ses fichiers associés
    (original, WebP, thumbnail) de la base de données et du système de fichiers.
    
    Args:
        request: Objet requête HTTP
        pk: Primary key (ID) de l'image à supprimer
        
    Returns:
        Response: Réponse vide (204 No Content) ou erreur 404
    """
    try:
        # Essaie de récupérer l'image avec l'ID fourni
        image = OptimizedImage.objects.get(pk=pk)
        
        # Supprime l'image (les fichiers sont aussi supprimés automatiquement
        # grâce à la configuration Django)
        image.delete()
        
        # Retourne une réponse vide avec le code 204 (No Content)
        # qui indique que la suppression a réussi
        return Response(status=status.HTTP_204_NO_CONTENT)
        
    except OptimizedImage.DoesNotExist:
        # Si l'image n'existe pas, retourne une erreur 404
        return Response(
            {'error': 'Image not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

