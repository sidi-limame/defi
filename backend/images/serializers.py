"""
Module de sérialiseurs Django REST Framework.

Ce module contient les sérialiseurs qui convertissent les modèles Django
en format JSON pour l'API REST.
"""

# Import du sérialiseur de base de Django REST Framework
from rest_framework import serializers
# Import du modèle à sérialiser
from .models import OptimizedImage


class OptimizedImageSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour le modèle OptimizedImage.
    
    Ce sérialiseur convertit les instances OptimizedImage en JSON.
    Il ajoute des champs calculés (URLs complètes, réduction de taille)
    qui ne sont pas directement dans le modèle.
    """
    
    # ========== CHAMPS CALCULÉS ==========
    # Ces champs sont générés dynamiquement par des méthodes
    
    original_url = serializers.SerializerMethodField(
        help_text="URL complète de l'image originale"
    )
    
    webp_url = serializers.SerializerMethodField(
        help_text="URL complète de la version WebP optimisée"
    )
    
    thumbnail_url = serializers.SerializerMethodField(
        help_text="URL complète de la miniature"
    )
    
    size_reduction = serializers.SerializerMethodField(
        help_text="Pourcentage de réduction de taille entre original et WebP"
    )
    
    class Meta:
        """
        Configuration du sérialiseur.
        
        model: Modèle Django à sérialiser
        fields: Liste des champs à inclure dans la sérialisation
        read_only_fields: Champs en lecture seule (générés automatiquement)
        """
        model = OptimizedImage
        
        # Liste de tous les champs à inclure dans le JSON
        fields = [
            'id',                    # ID unique de l'image
            'original_name',         # Nom original du fichier
            'original_size',         # Taille en octets
            'width',                 # Largeur en pixels
            'height',                # Hauteur en pixels
            'format',                # Format de l'image (JPEG, PNG, etc.)
            'created_at',            # Date de création
            'original_url',          # URL complète (calculée)
            'webp_url',              # URL WebP (calculée)
            'thumbnail_url',         # URL thumbnail (calculée)
            'blur_placeholder',      # Placeholder flou en base64
            'size_reduction'         # % de réduction (calculé)
        ]
        
        # Champs qui ne peuvent pas être modifiés via l'API
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_original_url(self, obj):
        """
        Génère l'URL complète de l'image originale.
        
        Cette méthode construit l'URL absolue en incluant le domaine
        du serveur, ce qui permet au frontend d'accéder à l'image.
        
        Args:
            obj: Instance du modèle OptimizedImage
            
        Returns:
            str: URL complète de l'image ou None si inexistante
        """
        if obj.original_file:
            # Récupère la requête depuis le contexte pour obtenir le domaine
            request = self.context.get('request')
            if request:
                # Construit l'URL absolue (ex: http://localhost:8000/media/originals/...)
                return request.build_absolute_uri(obj.original_file.url)
            # Si pas de requête, retourne l'URL relative
            return obj.original_file.url
        return None
    
    def get_webp_url(self, obj):
        """
        Génère l'URL complète de la version WebP.
        
        Args:
            obj: Instance du modèle OptimizedImage
            
        Returns:
            str: URL complète de la version WebP ou None si inexistante
        """
        if obj.webp_file:
            request = self.context.get('request')
            if request:
                # Construit l'URL absolue (ex: http://localhost:8000/media/webp/...)
                return request.build_absolute_uri(obj.webp_file.url)
            return obj.webp_file.url
        return None
    
    def get_thumbnail_url(self, obj):
        """
        Génère l'URL complète de la miniature.
        
        Args:
            obj: Instance du modèle OptimizedImage
            
        Returns:
            str: URL complète de la miniature ou None si inexistante
        """
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                # Construit l'URL absolue (ex: http://localhost:8000/media/thumbnails/...)
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None
    
    def get_size_reduction(self, obj):
        """
        Calcule le pourcentage de réduction de taille.
        
        Utilise la méthode du modèle pour calculer la réduction.
        
        Args:
            obj: Instance du modèle OptimizedImage
            
        Returns:
            float: Pourcentage de réduction (ex: 65.5)
        """
        return obj.get_size_reduction()

