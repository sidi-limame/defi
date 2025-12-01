# 🚀 ImageBoost - Optimisation Intelligente des Images pour le Web

ImageBoost est une plateforme moderne permettant d'optimiser automatiquement les images pour le web avec compression intelligente, génération de formats multiples (WebP, thumbnails) et chargement optimisé.

## ✨ Fonctionnalités

- **Compression automatique** : Réduction de la taille des images tout en conservant une qualité optimale
- **Formats multiples** : Génération automatique de WebP, thumbnails et placeholders flous
- **Lazy Loading** : Chargement intelligent des images avec IntersectionObserver
- **Blur Placeholders** : Affichage d'une version floue pendant le chargement pour une meilleure UX
- **Interface moderne** : Design responsive et intuitif avec React
- **API REST** : Backend Django avec Django REST Framework

## 🏗️ Architecture du Projet

```
defi/
├── backend/              # Backend Django (API REST)
│   ├── imageBoost/      # Configuration Django
│   ├── images/          # App de gestion d'images
│   ├── manage.py        # Script de gestion Django
│   ├── requirements.txt # Dépendances Python
│   └── README.md        # Guide de démarrage backend
│
├── frontend/            # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── SmartImage.js      # Composant avec lazy loading
│   │   │   ├── ImageUploader.js   # Composant d'upload
│   │   │   └── ImageGallery.js    # Galerie d'images
│   │   └── App.js
│   ├── package.json     # Dépendances Node.js
│   └── README.md        # Guide de démarrage frontend
│
├── venv/                # Environnement virtuel Python (optionnel)
└── README.md           # Ce fichier
```

## 🛠️ Technologies Utilisées

### Backend
- **Django 5.2.8** : Framework web Python
- **Django REST Framework** : API REST
- **Pillow** : Traitement et optimisation d'images
- **django-cors-headers** : Gestion CORS pour le frontend

### Frontend
- **React 18** : Bibliothèque UI
- **Axios** : Client HTTP
- **IntersectionObserver API** : Lazy loading

## 🚀 Démarrage Rapide

### Prérequis
- Python 3.8+
- Node.js 14+
- npm ou yarn

### Installation Complète

1. **Cloner le projet** (ou télécharger)

2. **Backend - Suivez le guide détaillé** :
   ```bash
   cd backend
   ```
   Consultez [backend/README.md](backend/README.md) pour les instructions complètes.

   En résumé :
   ```bash
   # Activer l'environnement virtuel (depuis la racine)
   venv\Scripts\activate  # Windows
   # ou
   source venv/bin/activate  # Linux/Mac
   
   # Installer les dépendances
   cd backend
   pip install -r requirements.txt
   
   # Créer et appliquer les migrations
   python manage.py makemigrations
   python manage.py migrate
   
   # Lancer le serveur
   python manage.py runserver
   ```
   Backend accessible sur : `http://localhost:8000`

3. **Frontend - Suivez le guide détaillé** :
   ```bash
   cd frontend
   ```
   Consultez [frontend/README.md](frontend/README.md) pour les instructions complètes.

   En résumé :
   ```bash
   # Installer les dépendances
   npm install
   
   # Lancer le serveur de développement
   npm start
   ```
   Frontend accessible sur : `http://localhost:3000`

## 🎯 Utilisation

1. **Lancez le backend** : Le serveur Django doit tourner sur le port 8000
2. **Lancez le frontend** : Le serveur React doit tourner sur le port 3000
3. **Ouvrez votre navigateur** : Accédez à `http://localhost:3000`
4. **Uploadez des images** :
   - Glissez-déposez une ou plusieurs images
   - Ou cliquez pour sélectionner des fichiers
   - Formats acceptés : JPG, PNG, WebP, GIF

## 📝 API Endpoints

Une fois le backend lancé :

- `GET /api/images/` : Liste toutes les images optimisées
- `POST /api/images/upload/` : Upload une nouvelle image
- `GET /api/images/<id>/` : Détails d'une image
- `DELETE /api/images/<id>/delete/` : Supprime une image

## 🔧 Configuration

### Backend
- Configuration dans `backend/imageBoost/settings.py`
- `MEDIA_ROOT` : Dossier de stockage des images
- `FILE_UPLOAD_MAX_MEMORY_SIZE` : Taille maximale (10 MB par défaut)
- `CORS_ALLOWED_ORIGINS` : Origines autorisées pour CORS

### Frontend
- URL de l'API configurée dans les composants : `http://localhost:8000/api/images/`

## 🚀 Fonctionnalités Avancées

### SmartImage Component

Le composant `SmartImage` implémente :
- **Lazy Loading** : Chargement uniquement quand l'image entre dans le viewport
- **Blur Placeholder** : Affichage d'une version floue pendant le chargement
- **Progressive Loading** : Transition fluide vers l'image finale
- **Gestion d'erreurs** : Affichage d'un message en cas d'échec

### Optimisation d'Images

Le backend génère automatiquement :
- **Version WebP** : Format moderne avec compression optimale (qualité 85%)
- **Thumbnail** : Version réduite (200x200px max)
- **Blur Placeholder** : Version très légère encodée en base64 pour l'affichage immédiat

## 📚 Documentation

- **[Backend - Guide complet](backend/README.md)** : Installation, configuration et utilisation du backend
- **[Frontend - Guide complet](frontend/README.md)** : Installation et utilisation du frontend

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence MIT.

## 🙏 Remerciements

Développé avec ❤️ pour améliorer l'expérience web grâce à l'optimisation d'images.
