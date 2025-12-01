# 🏗️ Architecture du Projet ImageBoost

## Vue d'Ensemble

ImageBoost est une application full-stack séparée en deux parties distinctes :

- **Backend** : API REST Django pour l'optimisation d'images
- **Frontend** : Interface React pour l'interaction utilisateur

## Structure Complète

```
defi/
│
├── 📁 backend/                    # Backend Django - API REST
│   ├── 📁 imageBoost/            # Configuration Django
│   │   ├── __init__.py
│   │   ├── settings.py          # ⚙️ Configuration principale
│   │   ├── urls.py              # 🔗 Routes principales
│   │   ├── wsgi.py              # 🌐 Configuration WSGI
│   │   └── asgi.py              # 🌐 Configuration ASGI
│   │
│   ├── 📁 images/                # Application Django - Gestion d'images
│   │   ├── __init__.py
│   │   ├── models.py            # 🗄️ Modèle OptimizedImage
│   │   ├── views.py             # 👁️ Vues API (upload, list, delete)
│   │   ├── serializers.py       # 📦 Sérialiseurs REST
│   │   ├── utils.py             # 🔧 Utilitaires d'optimisation
│   │   ├── urls.py              # 🔗 Routes de l'app
│   │   ├── admin.py             # 👨‍💼 Configuration admin
│   │   └── apps.py              # 📱 Configuration app
│   │
│   ├── 📁 media/                 # 📸 Images uploadées (généré auto)
│   │   ├── originals/           # Images originales
│   │   ├── webp/                # Versions WebP optimisées
│   │   └── thumbnails/          # Miniatures 200x200px
│   │
│   ├── manage.py                 # 🛠️ Script de gestion Django
│   ├── requirements.txt          # 📦 Dépendances Python
│   ├── README.md                 # 📖 Guide backend
│   └── .gitignore               # 🚫 Fichiers ignorés
│
├── 📁 frontend/                   # Frontend React - Interface Utilisateur
│   ├── 📁 public/
│   │   └── index.html           # 📄 HTML principal
│   │
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── SmartImage.js    # 🖼️ Composant avec lazy loading
│   │   │   ├── SmartImage.css
│   │   │   ├── ImageUploader.js # 📤 Composant d'upload
│   │   │   ├── ImageUploader.css
│   │   │   ├── ImageGallery.js  # 🖼️ Composant galerie
│   │   │   └── ImageGallery.css
│   │   │
│   │   ├── App.js               # ⚛️ Composant principal
│   │   ├── App.css              # 🎨 Styles principaux
│   │   ├── index.js             # 🚀 Point d'entrée React
│   │   └── index.css            # 🎨 Styles globaux
│   │
│   ├── package.json              # 📦 Dépendances Node.js
│   ├── README.md                 # 📖 Guide frontend
│   └── .gitignore               # 🚫 Fichiers ignorés
│
├── 📁 venv/                      # 🐍 Environnement virtuel Python
│
├── README.md                      # 📖 Documentation principale
├── ARCHITECTURE.md               # 🏗️ Ce fichier
└── .gitignore                    # 🚫 Fichiers ignorés (global)
```

## Flux de Données

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ HTTP Requests
       │ (GET, POST, DELETE)
       ▼
┌─────────────────────────────────────┐
│         Frontend React              │
│  ┌───────────────────────────────┐  │
│  │  ImageUploader Component      │  │
│  │  - Drag & Drop                │  │
│  │  - File Selection             │  │
│  └──────────────┬────────────────┘  │
│                 │                    │
│  ┌──────────────▼────────────────┐  │
│  │  ImageGallery Component       │  │
│  │  - Display Images             │  │
│  │  - Delete Actions             │  │
│  └──────────────┬────────────────┘  │
│                 │                    │
│  ┌──────────────▼────────────────┐  │
│  │  SmartImage Component         │  │
│  │  - Lazy Loading               │  │
│  │  - Blur Placeholders          │  │
│  └──────────────┬────────────────┘  │
└─────────────────┼───────────────────┘
                  │
                  │ Axios / Fetch
                  │
                  ▼
┌─────────────────────────────────────┐
│      Backend Django API             │
│  ┌───────────────────────────────┐  │
│  │  REST API Endpoints           │  │
│  │  - GET /api/images/           │  │
│  │  - POST /api/images/upload/   │  │
│  │  - DELETE /api/images/<id>/   │  │
│  └──────────────┬────────────────┘  │
│                 │                    │
│  ┌──────────────▼────────────────┐  │
│  │  Views (API Views)            │  │
│  │  - ImageUploadView            │  │
│  │  - image_list                 │  │
│  │  - image_delete               │  │
│  └──────────────┬────────────────┘  │
│                 │                    │
│  ┌──────────────▼────────────────┐  │
│  │  Utils (Image Optimization)   │  │
│  │  - optimize_image()           │  │
│  │  - Generate WebP              │  │
│  │  - Generate Thumbnail         │  │
│  │  - Generate Blur Placeholder  │  │
│  └──────────────┬────────────────┘  │
│                 │                    │
│  ┌──────────────▼────────────────┐  │
│  │  Models (Database)            │  │
│  │  - OptimizedImage Model       │  │
│  └──────────────┬────────────────┘  │
└─────────────────┼───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│      Storage                        │
│  ┌──────────────┐  ┌──────────────┐ │
│  │ SQLite DB    │  │ Media Files  │ │
│  │ (Metadata)   │  │ (Images)     │ │
│  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────┘
```

## Technologies par Couche

### Backend (Django)
- **Framework** : Django 5.2.8
- **API** : Django REST Framework
- **Image Processing** : Pillow
- **Database** : SQLite (dev) / PostgreSQL (production)
- **CORS** : django-cors-headers

### Frontend (React)
- **Framework** : React 18
- **HTTP Client** : Axios
- **Lazy Loading** : IntersectionObserver API
- **Build Tool** : Create React App

## Communication Backend-Frontend

### Format des Données

**Upload (POST)** :
```javascript
FormData {
  image: File
}
```

**Response (GET/POST)** :
```json
{
  "id": 1,
  "original_name": "photo.jpg",
  "original_size": 2048576,
  "width": 1920,
  "height": 1080,
  "format": "JPEG",
  "created_at": "2025-11-30T21:00:00Z",
  "original_url": "http://localhost:8000/media/originals/...",
  "webp_url": "http://localhost:8000/media/webp/...",
  "thumbnail_url": "http://localhost:8000/media/thumbnails/...",
  "blur_placeholder": "data:image/jpeg;base64,...",
  "size_reduction": 65.5
}
```

### Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/images/` | Liste toutes les images |
| POST | `/api/images/upload/` | Upload une nouvelle image |
| GET | `/api/images/<id>/` | Détails d'une image |
| DELETE | `/api/images/<id>/delete/` | Supprime une image |

## Optimisations Implémentées

### Backend
- ✅ Compression WebP (qualité 85%)
- ✅ Génération de thumbnails (200x200px)
- ✅ Placeholders flous (20x20px, base64)
- ✅ Validation des types de fichiers
- ✅ Stockage organisé par type

### Frontend
- ✅ Lazy loading avec IntersectionObserver
- ✅ Placeholders flous pendant le chargement
- ✅ Progressive loading (transition fluide)
- ✅ Upload multiple
- ✅ Drag & drop

## Ports par Défaut

- **Backend** : `http://localhost:8000`
- **Frontend** : `http://localhost:3000`

## Fichiers Clés

### Backend
- `backend/imageBoost/settings.py` : Configuration Django
- `backend/images/utils.py` : Logique d'optimisation
- `backend/images/models.py` : Modèle de données
- `backend/images/views.py` : Endpoints API

### Frontend
- `frontend/src/components/SmartImage.js` : Composant d'affichage intelligent
- `frontend/src/components/ImageUploader.js` : Composant d'upload
- `frontend/src/App.js` : Composant principal

## Prochaines Étapes (Améliorations Possibles)

- [ ] Cache des images optimisées
- [ ] Compression progressive (JPEG progressive)
- [ ] Support de plusieurs formats (AVIF)
- [ ] CDN intégration
- [ ] WebSocket pour upload en temps réel
- [ ] Tests unitaires et d'intégration
- [ ] Authentification utilisateur
- [ ] Limites de quota par utilisateur

---

Pour plus de détails, consultez :
- [README.md](README.md) - Documentation principale
- [backend/README.md](backend/README.md) - Guide backend
- [frontend/README.md](frontend/README.md) - Guide frontend

