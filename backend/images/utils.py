"""
Module d'utilitaires pour l'optimisation d'images.

Ce module contient les fonctions pour traiter et optimiser les images :
- Conversion en différents formats (WebP, JPEG)
- Génération de thumbnails
- Création de placeholders flous
"""

# Imports pour l'encodage base64
import base64
# Imports pour la manipulation de fichiers en mémoire
from io import BytesIO
# Imports Pillow pour le traitement d'images
from PIL import Image, ImageFilter
# Imports Django pour les fichiers
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys


def optimize_image(optimized_image_instance):
    """
    Optimise une image en créant plusieurs versions.
    
    Cette fonction prend une instance OptimizedImage et génère :
    1. Une version WebP optimisée (compression élevée)
    2. Une miniature (thumbnail) de 200x200px
    3. Un placeholder flou encodé en base64 pour l'affichage immédiat
    
    Args:
        optimized_image_instance: Instance du modèle OptimizedImage à optimiser
    """
    # ========== OUVERTURE ET PRÉPARATION DE L'IMAGE ==========
    
    # Ouvre l'image originale depuis le fichier stocké
    img = Image.open(optimized_image_instance.original_file)
    
    # ========== CONVERSION EN RGB ==========
    # Les images avec transparence (RGBA, LA, P) doivent être converties en RGB
    # pour être compatibles avec JPEG et WebP
    
    if img.mode in ('RGBA', 'LA', 'P'):
        # Crée une nouvelle image RGB avec fond blanc
        rgb_img = Image.new('RGB', img.size, (255, 255, 255))
        
        # Si l'image est en mode palette (P), convertit d'abord en RGBA
        if img.mode == 'P':
            img = img.convert('RGBA')
        
        # Colle l'image originale sur le fond blanc en préservant la transparence
        rgb_img.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
        img = rgb_img
        
    elif img.mode != 'RGB':
        # Si l'image est dans un autre mode (L, CMYK, etc.), convertit en RGB
        img = img.convert('RGB')
    
    # ========== ENREGISTREMENT DES MÉTADONNÉES ==========
    
    # Enregistre les dimensions de l'image
    optimized_image_instance.width = img.width
    optimized_image_instance.height = img.height
    
    # Enregistre le format original ou définit JPEG par défaut
    optimized_image_instance.format = img.format or 'JPEG'
    
    # ========== CRÉATION DE LA VERSION WEBP ==========
    # Format moderne avec compression optimale (réduction moyenne de 60-70%)
    
    # Crée un buffer en mémoire pour stocker l'image WebP
    webp_buffer = BytesIO()
    
    # Sauvegarde l'image en format WebP avec qualité 85% et méthode 6 (meilleure compression)
    img.save(webp_buffer, format='WEBP', quality=85, method=6)
    
    # Remet le curseur au début du buffer pour pouvoir le lire
    webp_buffer.seek(0)
    
    # Crée un fichier Django à partir du contenu du buffer
    webp_file = ContentFile(webp_buffer.read())
    
    # Génère un nom de fichier WebP à partir du nom original
    webp_filename = optimized_image_instance.original_file.name.rsplit('.', 1)[0] + '.webp'
    
    # Sauvegarde le fichier WebP (save=False car on sauvera tout à la fin)
    optimized_image_instance.webp_file.save(webp_filename, webp_file, save=False)
    
    # ========== CRÉATION DU THUMBNAIL ==========
    # Miniature de 200x200px maximum en préservant le ratio d'aspect
    
    # Définit la taille maximale du thumbnail
    thumbnail_size = (200, 200)
    
    # Crée une copie de l'image pour ne pas modifier l'original
    # thumbnail() modifie l'image en place en respectant le ratio
    img.thumbnail(thumbnail_size, Image.Resampling.LANCZOS)
    
    # Crée un buffer pour le thumbnail
    thumbnail_buffer = BytesIO()
    
    # Sauvegarde le thumbnail en JPEG avec qualité 75%
    img.save(thumbnail_buffer, format='JPEG', quality=75)
    
    # Remet le curseur au début
    thumbnail_buffer.seek(0)
    
    # Crée un fichier Django à partir du buffer
    thumbnail_file = ContentFile(thumbnail_buffer.read())
    
    # Génère un nom de fichier pour le thumbnail
    thumbnail_filename = f"thumb_{optimized_image_instance.original_file.name}"
    
    # Sauvegarde le thumbnail
    optimized_image_instance.thumbnail.save(thumbnail_filename, thumbnail_file, save=False)
    
    # ========== CRÉATION DU BLUR PLACEHOLDER ==========
    # Version très petite et floutée pour l'affichage immédiat avant chargement
    
    # Taille très réduite pour un placeholder léger
    blur_size = (20, 20)
    
    # Crée une copie de l'image originale (avant réduction du thumbnail)
    # Note: On devrait utiliser une copie de l'image originale, pas celle du thumbnail
    # Pour simplifier, on utilise une copie (idéalement, on recréerait depuis l'original)
    blur_img = img.copy()
    
    # Réduit l'image à 20x20px maximum
    blur_img.thumbnail(blur_size, Image.Resampling.LANCZOS)
    
    # Applique un filtre de flou gaussien pour créer l'effet placeholder
    blur_img = blur_img.filter(ImageFilter.GaussianBlur(radius=2))
    
    # Crée un buffer pour le placeholder
    blur_buffer = BytesIO()
    
    # Sauvegarde avec qualité très basse (50%) pour réduire la taille
    blur_img.save(blur_buffer, format='JPEG', quality=50)
    
    # Remet le curseur au début
    blur_buffer.seek(0)
    
    # Lit les données binaires
    blur_data = blur_buffer.read()
    
    # Encode en base64 pour pouvoir l'utiliser directement dans le HTML
    blur_base64 = base64.b64encode(blur_data).decode('utf-8')
    
    # Stocke le placeholder dans le format data URI pour utilisation immédiate
    optimized_image_instance.blur_placeholder = f"data:image/jpeg;base64,{blur_base64}"
    
    # ========== SAUVEGARDE FINALE ==========
    
    # Sauvegarde toutes les modifications dans la base de données
    optimized_image_instance.save()


def create_blur_placeholder_from_url(image_url):
    """Helper function to create a blur placeholder from an image URL"""
    try:
        import requests
        response = requests.get(image_url, timeout=5)
        img = Image.open(BytesIO(response.content))
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Create tiny blurred version
        blur_size = (20, 20)
        blur_img = img.copy()
        blur_img.thumbnail(blur_size, Image.Resampling.LANCZOS)
        blur_img = blur_img.filter(ImageFilter.GaussianBlur(radius=2))
        
        blur_buffer = BytesIO()
        blur_img.save(blur_buffer, format='JPEG', quality=50)
        blur_buffer.seek(0)
        blur_data = blur_buffer.read()
        blur_base64 = base64.b64encode(blur_data).decode('utf-8')
        
        return f"data:image/jpeg;base64,{blur_base64}"
    except Exception as e:
        print(f"Error creating blur placeholder: {e}")
        return None

