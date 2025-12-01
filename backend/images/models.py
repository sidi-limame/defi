"""
Module de modèles Django pour la gestion des images optimisées.

Ce module contient le modèle OptimizedImage qui stocke les informations
sur les images uploadées et leurs versions optimisées.
"""

# Imports Django pour les modèles et utilitaires
from django.db import models
from django.utils import timezone
import os
import uuid


def upload_path(instance, filename):
    """
    Génère un chemin unique pour les images uploadées.
    
    Cette fonction est utilisée par le champ ImageField pour déterminer
    où stocker les fichiers. Elle crée un nom unique avec UUID pour éviter
    les conflits de noms.
    
    Args:
        instance: Instance du modèle OptimizedImage
        filename: Nom original du fichier
        
    Returns:
        str: Chemin relatif où stocker l'image (ex: "originals/uuid.jpg")
    """
    # Extrait l'extension du fichier original
    ext = filename.split('.')[-1]
    # Crée un nom unique avec UUID pour éviter les collisions
    filename = f"{uuid.uuid4()}.{ext}"
    # Stocke dans le dossier "originals"
    return f"originals/{filename}"


class OptimizedImage(models.Model):
    """
    Modèle Django pour stocker les informations sur les images optimisées.
    
    Ce modèle stocke :
    - L'image originale uploadée
    - Les versions optimisées (WebP, thumbnail, blur placeholder)
    - Les métadonnées (dimensions, format, taille)
    - Les timestamps de création/modification
    """
    
    # ========== INFORMATIONS SUR L'IMAGE ORIGINALE ==========
    
    original_name = models.CharField(
        max_length=255,
        help_text="Nom original du fichier uploadé"
    )
    
    original_file = models.ImageField(
        upload_to=upload_path,
        help_text="Fichier image original stocké sur le serveur"
    )
    
    original_size = models.PositiveIntegerField(
        help_text="Taille du fichier original en octets"
    )
    
    # ========== VERSIONS OPTIMISÉES ==========
    
    webp_file = models.ImageField(
        upload_to='webp/',
        null=True,
        blank=True,
        help_text="Version optimisée au format WebP (compression élevée)"
    )
    
    thumbnail = models.ImageField(
        upload_to='thumbnails/',
        null=True,
        blank=True,
        help_text="Miniature de l'image (200x200px max)"
    )
    
    blur_placeholder = models.TextField(
        blank=True,
        help_text="Version très légère floutée encodée en base64 pour l'affichage immédiat"
    )
    
    # ========== MÉTADONNÉES DE L'IMAGE ==========
    
    width = models.PositiveIntegerField(
        default=0,
        help_text="Largeur de l'image en pixels"
    )
    
    height = models.PositiveIntegerField(
        default=0,
        help_text="Hauteur de l'image en pixels"
    )
    
    format = models.CharField(
        max_length=10,
        default='JPEG',
        help_text="Format de l'image original (JPEG, PNG, etc.)"
    )
    
    # ========== TIMESTAMPS ==========
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Date et heure de création de l'enregistrement"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Date et heure de dernière modification"
    )
    
    class Meta:
        """
        Classe Meta pour configurer le modèle.
        
        ordering : Trie les images par date de création décroissante
        (les plus récentes en premier)
        """
        ordering = ['-created_at']
    
    def __str__(self):
        """
        Représentation en string du modèle.
        
        Utile pour l'administration Django et le débogage.
        """
        return f"{self.original_name} ({self.original_size} bytes)"
    
    def get_size_reduction(self):
        """
        Calcule le pourcentage de réduction de taille entre l'original et le WebP.
        
        Cette méthode compare la taille du fichier original avec la version
        WebP optimisée pour donner un pourcentage de réduction.
        
        Returns:
            float: Pourcentage de réduction (ex: 65.5 pour 65.5%)
            Retourne 0 si la version WebP n'existe pas ou en cas d'erreur
        """
        # Vérifie si la version WebP existe
        if self.webp_file:
            try:
                # Récupère la taille du fichier WebP
                webp_size = self.webp_file.size
                # Calcule le pourcentage de réduction
                if self.original_size > 0:
                    reduction = ((self.original_size - webp_size) / self.original_size) * 100
                    # Arrondit à 2 décimales
                    return round(reduction, 2)
            except:
                # En cas d'erreur (fichier non accessible, etc.), retourne 0
                pass
        return 0

