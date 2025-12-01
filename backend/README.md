# 🚀 Backend ImageBoost - Guide Complet

Backend Django avec API REST pour l'optimisation intelligente d'images.

## 📋 Table des Matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Endpoints](#api-endpoints)
- [Structure](#structure)
- [Fonctionnalités](#fonctionnalités)
- [Dépannage](#dépannage)

## 📦 Installation

### 1. Prérequis

- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)

### 2. Environnement Virtuel

Depuis la racine du projet (`defi/`), activez l'environnement virtuel :

```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

Si l'environnement virtuel n'existe pas, créez-le :

```bash
# Depuis la racine du projet
python -m venv venv
```

### 3. Installation des Dépendances

```bash
cd backend
pip install -r requirements.txt
```

Les packages installés :
- Django 5.2.8
- Django REST Framework 3.15.2
- django-cors-headers 4.6.0
- Pillow 11.0.0

### 4. Migrations de la Base de Données

```bash
# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate
```

Cela créera la base de données SQLite (`db.sqlite3`) et les tables nécessaires.

### 5. (Optionnel) Créer un Superutilisateur

Pour accéder à l'interface d'administration Django :

```bash
python manage.py createsuperuser
```

Suivez les instructions pour créer un compte administrateur.

## 🚀 Utilisation

### Lancer le Serveur de Développement

```bash
python manage.py runserver
```

Le serveur sera accessible sur : **http://localhost:8000**

### Vérifier que le Backend Fonctionne

1. Accédez à `http://localhost:8000/api/images/`
   - Vous devriez voir `[]` (liste vide en JSON)

2. Accédez à `http://localhost:8000/admin/`
   - Connectez-vous avec votre superutilisateur pour gérer les images

## 📍 API Endpoints

### Liste des Images

```
GET /api/images/
```

Retourne la liste de toutes les images optimisées.

**Réponse** :
```json
[
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
]
```

### Upload d'une Image

```
POST /api/images/upload/
Content-Type: multipart/form-data
```

**Corps de la requête** :
- `image` : Fichier image (JPEG, PNG, WebP, GIF)

**Réponse** :
```json
{
  "id": 1,
  "original_name": "photo.jpg",
  ...
}
```

**Exemple avec curl** :
```bash
curl -X POST http://localhost:8000/api/images/upload/ \
  -F "image=@/chemin/vers/image.jpg"
```

### Détails d'une Image

```
GET /api/images/<id>/
```

Retourne les détails d'une image spécifique.

### Supprimer une Image

```
DELETE /api/images/<id>/delete/
```

Supprime une image et tous ses fichiers associés.

## 🗂️ Structure du Backend

```
backend/
├── imageBoost/           # Configuration du projet Django
│   ├── __init__.py
│   ├── settings.py       # Paramètres Django (CORS, REST, média)
│   ├── urls.py          # Routes principales
│   ├── wsgi.py          # Configuration WSGI
│   └── asgi.py          # Configuration ASGI
│
├── images/              # Application de gestion d'images
│   ├── __init__.py
│   ├── admin.py         # Configuration admin Django
│   ├── apps.py          # Configuration de l'application
│   ├── models.py        # Modèle OptimizedImage
│   ├── views.py         # Vues API (upload, list, detail, delete)
│   ├── serializers.py   # Sérialiseurs REST Framework
│   ├── utils.py         # Fonctions d'optimisation d'images
│   └── urls.py          # Routes de l'application
│
├── media/               # Images uploadées (créé automatiquement)
│   ├── originals/       # Images originales
│   ├── webp/            # Versions WebP optimisées
│   └── thumbnails/      # Miniatures (200x200px)
│
├── manage.py            # Script de gestion Django
├── requirements.txt     # Dépendances Python
├── .gitignore          # Fichiers à ignorer
└── README.md           # Ce fichier
```

## 🔧 Fonctionnalités

### Optimisation Automatique des Images

Lorsqu'une image est uploadée, le backend génère automatiquement :

1. **Version WebP** 
   - Format moderne avec compression optimale
   - Qualité : 85%
   - Réduction moyenne : 60-70% de la taille originale

2. **Thumbnail**
   - Version réduite : 200x200px maximum
   - Maintien du ratio d'aspect
   - Format JPEG, qualité 75%

3. **Blur Placeholder**
   - Version très légère (20x20px)
   - Flou gaussien appliqué
   - Encodée en base64 pour affichage immédiat

### Validation

- **Types acceptés** : JPEG, PNG, WebP, GIF
- **Taille maximale** : 10 MB par défaut
- **Validation automatique** du type MIME

### Stockage

- Images stockées dans `backend/media/`
- Structure organisée par type (originals, webp, thumbnails)
- Noms de fichiers uniques avec UUID

## ⚙️ Configuration

### Paramètres Principaux

Fichier : `backend/imageBoost/settings.py`

```python
# Stockage des fichiers média
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Taille maximale d'upload
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10 MB

# CORS (Cross-Origin Resource Sharing)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Frontend React
    "http://127.0.0.1:3000",
]
```

### Personnalisation

Pour modifier la qualité WebP ou la taille des thumbnails, éditez `backend/images/utils.py` :

```python
# Qualité WebP (ligne ~30)
img.save(webp_buffer, format='WEBP', quality=85, method=6)

# Taille thumbnail (ligne ~35)
thumbnail_size = (200, 200)
```

## 🐛 Dépannage

### Erreur : "Module not found"

**Solution** :
```bash
# Vérifiez que vous êtes dans l'environnement virtuel
# Réinstallez les dépendances
pip install -r requirements.txt
```

### Erreur : "No such table: images_optimizedimage"

**Solution** :
```bash
# Réappliquez les migrations
python manage.py makemigrations
python manage.py migrate
```

### Erreur : "Pillow not found" ou erreur d'installation Pillow

**Solution** :
```bash
# Mettez à jour pip
pip install --upgrade pip

# Sur Windows, vous pourriez avoir besoin de :
# Télécharger les binaires pré-compilés ou installer Visual C++
pip install Pillow

# Sur Linux/Mac
sudo apt-get install libjpeg-dev zlib1g-dev  # Debian/Ubuntu
# ou
brew install libjpeg zlib  # macOS
```

### Erreur : Port 8000 déjà utilisé

**Solution** :
```bash
# Utilisez un autre port
python manage.py runserver 8001
```

### Les images ne s'affichent pas

**Solution** :
1. Vérifiez que `MEDIA_ROOT` pointe vers le bon dossier
2. Vérifiez les permissions du dossier `media/`
3. En production, configurez un serveur web pour servir les fichiers média

## 📝 Notes Importantes

- Le dossier `media/` est créé automatiquement lors du premier upload
- La base de données SQLite (`db.sqlite3`) est créée après les migrations
- En développement, Django sert les fichiers média directement
- En production, configurez un serveur web (Nginx, Apache) pour servir les fichiers média

## ✅ Tests

Pour tester que tout fonctionne :

1. **Test de l'API** :
```bash
curl http://localhost:8000/api/images/
```

2. **Test d'upload** :
```bash
curl -X POST http://localhost:8000/api/images/upload/ \
  -F "image=@/chemin/vers/test.jpg"
```

3. **Vérification des fichiers** :
   - Vérifiez que les dossiers `media/originals/`, `media/webp/`, `media/thumbnails/` sont créés
   - Vérifiez que les fichiers sont présents

## 🔒 Sécurité (Production)

Pour un déploiement en production :

1. Changez `SECRET_KEY` dans `settings.py`
2. Définissez `DEBUG = False`
3. Configurez `ALLOWED_HOSTS`
4. Utilisez une base de données PostgreSQL ou MySQL
5. Configurez un serveur web pour servir les fichiers statiques et média
6. Activez HTTPS
7. Configurez les permissions de fichiers

---

Le backend est maintenant prêt ! 🎉 Consultez [../README.md](../README.md) pour le guide complet du projet.

