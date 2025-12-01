/**
 * Composant ImageUploader - Upload d'images avec drag & drop
 * 
 * Ce composant permet de :
 * - Sélectionner des fichiers images via un input file
 * - Glisser-déposer des images dans une zone dédiée
 * - Afficher la progression de l'upload
 * - Uploader plusieurs images simultanément
 */

// Imports React pour gérer l'état
import React, { useState } from 'react';
// Import axios pour faire des requêtes HTTP
import axios from 'axios';
// Import des styles CSS du composant
import './ImageUploader.css';

/**
 * Composant ImageUploader
 * 
 * @param {Function} onUploadSuccess - Callback appelé après un upload réussi
 *                                     Reçoit l'objet image créé par l'API
 */
const ImageUploader = ({ onUploadSuccess }) => {
  // ========== ÉTATS DU COMPOSANT ==========
  
  /**
   * État : Liste des fichiers sélectionnés mais pas encore uploadés
   * Chaque élément est un objet File du DOM
   */
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  /**
   * État : Indique si un upload est en cours
   */
  const [uploading, setUploading] = useState(false);
  
  /**
   * État : Progression de l'upload pour chaque fichier
   * Format : { "nom-du-fichier.jpg": 45 } = 45% uploadé
   */
  const [uploadProgress, setUploadProgress] = useState({});
  
  /**
   * État : Indique si une zone de drag & drop est active (souris dessus)
   */
  const [dragActive, setDragActive] = useState(false);

  // ========== FONCTIONS UTILITAIRES ==========
  
  /**
   * Filtre et sélectionne les fichiers images
   * 
   * Cette fonction prend une FileList, filtre uniquement les images,
   * et met à jour l'état avec les fichiers sélectionnés.
   * 
   * @param {FileList} files - Liste de fichiers du DOM
   */
  const handleFileSelect = (files) => {
    // Convertit FileList en tableau et filtre uniquement les images
    const fileArray = Array.from(files).filter(file => 
      file.type.startsWith('image/')  // Vérifie que le type MIME commence par "image/"
    );
    // Met à jour l'état avec les fichiers filtrés
    setSelectedFiles(fileArray);
  };

  // ========== GESTIONNAIRES DRAG & DROP ==========
  
  /**
   * Gère les événements de drag (entrée, survol, sortie)
   * 
   * Change l'apparence de la zone de drop quand la souris entre/sort
   * 
   * @param {DragEvent} e - Événement de drag du DOM
   */
  const handleDrag = (e) => {
    // Empêche le comportement par défaut (ouvrir le fichier dans le navigateur)
    e.preventDefault();
    e.stopPropagation();
    
    // Si la souris entre ou survole la zone
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } 
    // Si la souris sort de la zone
    else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  /**
   * Gère le dépôt de fichiers (drop)
   * 
   * Récupère les fichiers déposés et les ajoute à la sélection
   * 
   * @param {DragEvent} e - Événement de drop du DOM
   */
  const handleDrop = (e) => {
    // Empêche le comportement par défaut
    e.preventDefault();
    e.stopPropagation();
    // Désactive l'état de drag
    setDragActive(false);
    
    // Vérifie que des fichiers ont été déposés
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Sélectionne les fichiers déposés
      handleFileSelect(e.dataTransfer.files);
    }
  };

  /**
   * Gère le changement de sélection via l'input file
   * 
   * @param {ChangeEvent} e - Événement de changement du DOM
   */
  const handleInputChange = (e) => {
    // Vérifie que des fichiers ont été sélectionnés
    if (e.target.files && e.target.files.length > 0) {
      // Sélectionne les fichiers
      handleFileSelect(e.target.files);
    }
  };

  // ========== FONCTION D'UPLOAD ==========
  
  /**
   * Upload tous les fichiers sélectionnés vers l'API backend
   * 
   * Pour chaque fichier :
   * 1. Crée un FormData avec le fichier
   * 2. Envoie une requête POST à l'API
   * 3. Affiche la progression
   * 4. Notifie le parent en cas de succès
   */
  const handleUpload = async () => {
    // Ne fait rien si aucun fichier sélectionné
    if (selectedFiles.length === 0) return;

    // Active l'état d'upload
    setUploading(true);
    
    // Parcourt chaque fichier sélectionné
    for (const file of selectedFiles) {
      // Crée un FormData pour envoyer le fichier
      const formData = new FormData();
      // Ajoute le fichier avec la clé "image" (attendu par l'API)
      formData.append('image', file);

      try {
        // Initialise la progression à 0% pour ce fichier
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        // Envoie la requête POST à l'endpoint d'upload
        const response = await axios.post(
          'http://localhost:8000/api/images/upload/',
          formData,
          {
            // Headers pour indiquer qu'on envoie un fichier
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            // Callback pour suivre la progression de l'upload
            onUploadProgress: (progressEvent) => {
              // Calcule le pourcentage uploadé
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              // Met à jour la progression pour ce fichier
              setUploadProgress(prev => ({
                ...prev,
                [file.name]: percentCompleted
              }));
            },
          }
        );

        // Si le callback est défini, notifie le parent du succès
        if (onUploadSuccess) {
          onUploadSuccess(response.data);
        }
      } catch (error) {
        // En cas d'erreur, affiche un message à l'utilisateur
        console.error(`Error uploading ${file.name}:`, error);
        alert(`Erreur lors de l'upload de ${file.name}: ${error.response?.data?.error || error.message}`);
      }
    }

    // Réinitialise l'état après l'upload
    setSelectedFiles([]);
    setUploadProgress({});
    setUploading(false);
  };

  /**
   * Retire un fichier de la sélection
   * 
   * @param {string} fileName - Nom du fichier à retirer
   */
  const removeFile = (fileName) => {
    // Filtre la liste pour retirer le fichier
    setSelectedFiles(selectedFiles.filter(file => file.name !== fileName));
  };

  // ========== RENDU DU COMPOSANT ==========
  
  return (
    <div className="image-uploader">
      {/* ========== ZONE DE DROP ========== */}
      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Input file caché (styled via label) */}
        <input
          type="file"
          id="file-input"
          multiple          // Permet la sélection multiple
          accept="image/*"  // Accepte uniquement les images
          onChange={handleInputChange}
          className="file-input"
        />
        
        {/* Label qui sert de bouton pour déclencher l'input */}
        <label htmlFor="file-input" className="upload-label">
          <div className="upload-icon">📁</div>
          <p className="upload-text">
            Glissez vos images ici ou <span className="upload-link">cliquez pour sélectionner</span>
          </p>
          <p className="upload-hint">Formats acceptés: JPG, PNG, WebP, GIF</p>
        </label>
      </div>

      {/* ========== LISTE DES FICHIERS SÉLECTIONNÉS ========== */}
      {/* Affiche la liste uniquement si des fichiers sont sélectionnés */}
      {selectedFiles.length > 0 && (
        <div className="selected-files">
          <h3>Fichiers sélectionnés ({selectedFiles.length})</h3>
          
          {/* Liste des fichiers avec leur progression */}
          <div className="file-list">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-item">
                {/* Nom du fichier */}
                <span className="file-name">{file.name}</span>
                
                {/* Taille du fichier (convertie en MB) */}
                <span className="file-size">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
                
                {/* Barre de progression (si upload en cours) */}
                {uploadProgress[file.name] !== undefined && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress[file.name]}%` }}
                    />
                  </div>
                )}
                
                {/* Bouton pour retirer le fichier (si pas en upload) */}
                {!uploading && (
                  <button
                    className="remove-file-btn"
                    onClick={() => removeFile(file.name)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Bouton d'upload */}
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={uploading}  // Désactivé pendant l'upload
          >
            {uploading ? 'Upload en cours...' : `Uploader ${selectedFiles.length} image(s)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
