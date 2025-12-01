/**
 * Composant ImageGallery - Galerie d'affichage des images optimisées
 * 
 * Ce composant affiche toutes les images optimisées dans une grille responsive.
 * Pour chaque image, il affiche :
 * - L'image avec lazy loading et blur placeholder
 * - Les métadonnées (dimensions, taille, format, réduction)
 * - Les actions (voir, supprimer)
 */

// Imports React
import React from 'react';
// Import axios pour les requêtes HTTP
import axios from 'axios';
// Import du composant SmartImage pour l'affichage optimisé
import SmartImage from './SmartImage';
// Import des styles CSS
import './ImageGallery.css';

/**
 * Composant ImageGallery
 * 
 * @param {Array} images - Liste des objets images à afficher
 * @param {Function} onImageDeleted - Callback appelé après suppression d'une image
 */
const ImageGallery = ({ images, onImageDeleted }) => {
  
  // ========== FONCTIONS ==========
  
  /**
   * Supprime une image via l'API backend
   * 
   * 1. Demande confirmation à l'utilisateur
   * 2. Envoie une requête DELETE à l'API
   * 3. Notifie le parent pour mettre à jour la liste
   * 
   * @param {number} imageId - ID de l'image à supprimer
   */
  const handleDelete = async (imageId) => {
    // Demande confirmation avant suppression
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      return;
    }

    try {
      // Envoie une requête DELETE à l'endpoint de suppression
      const response = await axios.delete(
        `http://localhost:8000/api/images/${imageId}/delete/`
      );
      
      // Code 204 = No Content = suppression réussie
      if (response.status === 204) {
        // Si le callback est défini, notifie le parent
        if (onImageDeleted) {
          onImageDeleted(imageId);
        }
      }
    } catch (error) {
      // En cas d'erreur, affiche un message
      console.error('Error deleting image:', error);
      alert('Erreur lors de la suppression de l\'image');
    }
  };

  /**
   * Formate une taille en octets en format lisible (KB, MB, GB)
   * 
   * Exemple : 2048576 octets → "2 MB"
   * 
   * @param {number} bytes - Taille en octets
   * @returns {string} Taille formatée (ex: "2.5 MB")
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    // Facteur de conversion (binaire)
    const k = 1024;
    // Unités de taille
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    // Calcule l'index de l'unité appropriée (logarithme)
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    // Calcule la taille dans l'unité appropriée et arrondit à 2 décimales
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // ========== RENDU CONDITIONNEL : ÉTAT VIDE ==========
  
  /**
   * Affiche un message si aucune image n'est disponible
   */
  if (images.length === 0) {
    return (
      <div className="image-gallery empty">
        <p>Aucune image pour le moment. Téléchargez votre première image !</p>
      </div>
    );
  }

  // ========== RENDU PRINCIPAL ==========
  
  return (
    <div className="image-gallery">
      {/* Titre avec compteur */}
      <h2>Galerie d'Images Optimisées ({images.length})</h2>
      
      {/* Grille responsive des images */}
      <div className="gallery-grid">
        {/* Parcourt chaque image et crée une carte */}
        {images.map((image) => (
          <div key={image.id} className="gallery-item">
            
            {/* ========== CONTENEUR D'IMAGE ========== */}
            <div className="image-wrapper">
              {/* Composant SmartImage pour affichage optimisé avec lazy loading */}
              <SmartImage
                src={image.webp_url || image.original_url}  // Utilise WebP si disponible, sinon original
                blurPlaceholder={image.blur_placeholder}     // Placeholder flou pour chargement
                alt={image.original_name}                    // Texte alternatif
                thumbnailUrl={image.thumbnail_url}           // URL de la miniature (fallback)
                className="gallery-image"
              />
            </div>
            
            {/* ========== INFORMATIONS DE L'IMAGE ========== */}
            <div className="image-info">
              {/* Nom de l'image */}
              <h3 className="image-title">{image.original_name}</h3>
              
              {/* Statistiques de l'image */}
              <div className="image-stats">
                {/* Dimensions */}
                <div className="stat-item">
                  <span className="stat-label">Dimensions:</span>
                  <span className="stat-value">{image.width} × {image.height}px</span>
                </div>
                
                {/* Taille originale */}
                <div className="stat-item">
                  <span className="stat-label">Taille originale:</span>
                  <span className="stat-value">{formatFileSize(image.original_size)}</span>
                </div>
                
                {/* Réduction de taille (affiché seulement si > 0) */}
                {image.size_reduction > 0 && (
                  <div className="stat-item reduction">
                    <span className="stat-label">Réduction:</span>
                    <span className="stat-value">-{image.size_reduction}%</span>
                  </div>
                )}
                
                {/* Format de l'image */}
                <div className="stat-item">
                  <span className="stat-label">Format:</span>
                  <span className="stat-value">{image.format}</span>
                </div>
              </div>
              
              {/* ========== ACTIONS ========== */}
              <div className="image-actions">
                {/* Bouton pour voir l'image en grand */}
                <a
                  href={image.webp_url || image.original_url}
                  target="_blank"           // Ouvre dans un nouvel onglet
                  rel="noopener noreferrer" // Sécurité : empêche l'accès à window.opener
                  className="action-btn view-btn"
                >
                  👁️ Voir
                </a>
                
                {/* Bouton pour supprimer l'image */}
                <button
                  onClick={() => handleDelete(image.id)}
                  className="action-btn delete-btn"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
