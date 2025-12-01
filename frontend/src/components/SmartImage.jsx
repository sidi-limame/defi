/**
 * Composant SmartImage - Affichage intelligent d'images avec lazy loading
 * 
 * Ce composant implémente plusieurs optimisations pour améliorer les performances :
 * - Lazy loading : Charge l'image uniquement quand elle entre dans le viewport
 * - Blur placeholder : Affiche une version floue pendant le chargement
 * - Progressive loading : Transition fluide vers l'image finale
 * - Gestion d'erreurs : Affiche un message si le chargement échoue
 */

// Imports React pour les hooks (état, effets, références)
import React, { useState, useEffect, useRef } from 'react';
// Import des styles CSS du composant
import './SmartImage.css';

/**
 * Composant SmartImage
 * 
 * @param {string} src - URL de l'image principale à afficher
 * @param {string} blurPlaceholder - Image floue encodée en base64 pour placeholder
 * @param {string} alt - Texte alternatif pour l'accessibilité
 * @param {string} className - Classes CSS supplémentaires
 * @param {number} width - Largeur de l'image (optionnel)
 * @param {number} height - Hauteur de l'image (optionnel)
 * @param {string} thumbnailUrl - URL de la miniature (fallback)
 */
const SmartImage = ({ 
  src, 
  blurPlaceholder, 
  alt = '', 
  className = '',
  width,
  height,
  thumbnailUrl 
}) => {
  // ========== ÉTATS DU COMPOSANT ==========
  
  // État : indique si l'image principale est complètement chargée
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // État : indique si l'image est visible dans le viewport (pour lazy loading)
  const [inView, setInView] = useState(false);
  
  // État : indique si une erreur s'est produite lors du chargement
  const [error, setError] = useState(false);
  
  // ========== RÉFÉRENCES DOM ==========
  
  // Référence vers l'élément <img> pour accès direct au DOM
  const imgRef = useRef(null);
  
  // Référence vers le conteneur pour observer sa visibilité
  const containerRef = useRef(null);

  // ========== EFFET : LAZY LOADING AVEC INTERSECTION OBSERVER ==========
  
  useEffect(() => {
    /**
     * Crée un IntersectionObserver pour détecter quand l'image entre dans le viewport.
     * Cela permet de charger l'image uniquement quand elle est visible,
     * économisant ainsi de la bande passante et améliorant les performances.
     */
    
    // Crée l'observer avec une fonction callback
    const observer = new IntersectionObserver(
      (entries) => {
        // Pour chaque élément observé
        entries.forEach((entry) => {
          // Si l'élément est visible (entre dans le viewport)
          if (entry.isIntersecting) {
            // Active le chargement de l'image
            setInView(true);
            // Déconnecte l'observer car on n'a plus besoin de l'observer
            observer.disconnect();
          }
        });
      },
      {
        // Commence à charger 50px avant que l'image soit visible
        // Cela donne un préchargement pour une expérience plus fluide
        rootMargin: '50px',
      }
    );

    // Si le conteneur existe, commence à l'observer
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Fonction de nettoyage : se désabonne quand le composant est démonté
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []); // Tableau de dépendances vide = s'exécute une seule fois au montage

  // ========== GESTIONNAIRES D'ÉVÉNEMENTS ==========
  
  /**
   * Gestionnaire appelé quand l'image est complètement chargée
   */
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  /**
   * Gestionnaire appelé si une erreur survient lors du chargement
   */
  const handleImageError = () => {
    setError(true);
    // Marque comme "chargé" pour arrêter les tentatives de chargement
    setImageLoaded(true);
  };

  // ========== LOGIQUE DE DÉCISION ==========
  
  // Détermine quelle image utiliser (lazy loading)
  // Si l'image est dans le viewport, utilise src ou thumbnailUrl
  // Sinon, null = pas de chargement
  const imageSrc = inView ? (src || thumbnailUrl) : null;
  
  // Détermine si on doit afficher le blur placeholder
  // Affiche uniquement si : placeholder disponible, image pas encore chargée, pas d'erreur
  const showBlur = blurPlaceholder && !imageLoaded && !error;

  // ========== RENDU DU COMPOSANT ==========
  
  return (
    <div 
      ref={containerRef}
      className={`smart-image-container ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || 'auto',
        aspectRatio: width && height ? `${width}/${height}` : 'auto'
      }}
    >
      {/* ========== PLACEHOLDER FLOU ========== */}
      {/* Affiche une version floue de l'image pendant le chargement */}
      {showBlur && (
        <div 
          className="smart-image-blur"
          style={{
            backgroundImage: `url(${blurPlaceholder})`,
          }}
        />
      )}

      {/* ========== IMAGE PRINCIPALE ========== */}
      {/* Affiche l'image réelle une fois qu'elle est dans le viewport */}
      {imageSrc && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          className={`smart-image ${imageLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy" // Attribut HTML natif pour lazy loading (bonus)
          style={{
            opacity: imageLoaded ? 1 : 0, // Transition d'opacité
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      )}

      {/* ========== ÉTAT D'ERREUR ========== */}
      {/* Affiche un message si le chargement échoue */}
      {error && (
        <div className="smart-image-error">
          <span>⚠️ Erreur de chargement</span>
        </div>
      )}

      {/* ========== SPINNER DE CHARGEMENT ========== */}
      {/* Affiche un spinner si : pas encore chargé, pas d'erreur, dans le viewport, pas de blur */}
      {!imageLoaded && !error && inView && !showBlur && (
        <div className="smart-image-spinner">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default SmartImage;

