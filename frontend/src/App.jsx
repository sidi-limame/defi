/**
 * Composant principal de l'application ImageBoost
 * 
 * Ce composant orchestre l'ensemble de l'application :
 * - Gère l'état global des images
 * - Charge les images depuis l'API au démarrage
 * - Coordonne les composants d'upload et de galerie
 */

// Imports React pour les hooks d'état et d'effets
import React, { useState, useEffect } from 'react';
// Import des styles CSS de l'application
import './App.css';

// Imports des composants enfants
import ImageUploader from './components/ImageUploader';  // Composant pour uploader des images
import ImageGallery from './components/ImageGallery';    // Composant pour afficher la galerie
// Note: SmartImage est importé mais non utilisé directement ici (utilisé dans ImageGallery)

/**
 * Composant App - Point d'entrée de l'application
 * 
 * Structure :
 * - Header avec titre
 * - Composant d'upload
 * - Galerie d'images
 */
function App() {
  // ========== ÉTATS DU COMPOSANT ==========
  
  /**
   * État : Liste de toutes les images optimisées
   * Chaque image contient : id, original_name, webp_url, thumbnail_url, etc.
   */
  const [images, setImages] = useState([]);
  
  /**
   * État : Indique si les images sont en cours de chargement depuis l'API
   */
  const [loading, setLoading] = useState(false);

  // ========== EFFET : CHARGEMENT INITIAL ==========
  
  /**
   * Effet qui s'exécute au montage du composant (une seule fois)
   * Charge la liste des images depuis l'API backend
   */
  useEffect(() => {
    fetchImages();
  }, []); // Tableau vide = s'exécute uniquement au montage

  // ========== FONCTIONS ==========
  
  /**
   * Charge la liste des images depuis l'API backend
   * 
   * Cette fonction fait une requête GET vers l'endpoint /api/images/
   * pour récupérer toutes les images optimisées stockées.
   */
  const fetchImages = async () => {
    try {
      // Active l'indicateur de chargement
      setLoading(true);
      
      // Fait une requête GET vers l'API Django
      const response = await fetch('http://localhost:8000/api/images/');
      
      // Vérifie que la réponse est OK (status 200)
      if (response.ok) {
        // Parse la réponse JSON
        const data = await response.json();
        // Met à jour l'état avec les images reçues
        setImages(data);
      }
    } catch (error) {
      // En cas d'erreur (réseau, serveur, etc.), affiche dans la console
      console.error('Error fetching images:', error);
    } finally {
      // Désactive l'indicateur de chargement dans tous les cas
      setLoading(false);
    }
  };

  /**
   * Gestionnaire appelé après un upload réussi d'image
   * 
   * Ajoute la nouvelle image en haut de la liste (plus récente en premier)
   * 
   * @param {Object} newImage - Objet image retourné par l'API après upload
   */
  const handleImageUploaded = (newImage) => {
    // Ajoute la nouvelle image au début du tableau
    setImages([newImage, ...images]);
  };

  /**
   * Gestionnaire appelé après la suppression d'une image
   * 
   * Retire l'image supprimée de la liste affichée
   * 
   * @param {number} imageId - ID de l'image supprimée
   */
  const handleImageDeleted = (imageId) => {
    // Filtre la liste pour retirer l'image avec l'ID donné
    setImages(images.filter(img => img.id !== imageId));
  };

  // ========== RENDU DU COMPOSANT ==========
  
  return (
    <div className="App">
      {/* ========== EN-TÊTE ========== */}
      <header className="App-header">
        <h1>🚀 ImageBoost</h1>
        <p>Optimisation Intelligente des Images pour le Web</p>
      </header>

      {/* ========== CONTENU PRINCIPAL ========== */}
      <main className="App-main">
        {/* Composant pour uploader des images */}
        {/* onUploadSuccess : callback appelé après un upload réussi */}
        <ImageUploader onUploadSuccess={handleImageUploaded} />
        
        {/* Affichage conditionnel selon l'état de chargement */}
        {loading ? (
          // Affiche un message pendant le chargement
          <div className="loading">Chargement des images...</div>
        ) : (
          // Affiche la galerie d'images une fois chargées
          <ImageGallery 
            images={images}              // Liste des images à afficher
            onImageDeleted={handleImageDeleted}  // Callback appelé après suppression
          />
        )}
      </main>
    </div>
  );
}

export default App;

