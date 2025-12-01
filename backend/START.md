# 🚀 Guide de Démarrage Rapide - Backend ImageBoost

## Installation et Configuration

### 1. Activer l'environnement virtuel

```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Installer les dépendances

```bash
pip install -r requirements.txt
```

Les packages installés seront :
- Django 5.2.8
- Django REST Framework 3.15.2
- django-cors-headers 4.6.0
- Pillow 11.0.0 (pour le traitement d'images)

### 3. Créer les migrations

```bash
python manage.py makemigrations
```

### 4. Appliquer les migrations

```bash
python manage.py migrate
```

Cela créera les tables dans la base de données SQLite.

### 5. (Optionnel) Créer un superutilisateur pour l'admin Django

```bash
python manage.py createsuperuser
```

### 6. Lancer le serveur de développement

```bash
python manage.py runserver
```

Le backend sera accessible sur : **http://localhost:8000**

## 📍 Endpoints API Disponibles

Une fois le serveur lancé, vous pouvez accéder à :

- **API Images** : `http://localhost:8000/api/images/`
  - `GET /api/images/` - Liste toutes les images
  - `POST /api/images/upload/` - Upload une nouvelle image
  - `GET /api/images/<id>/` - Détails d'une image
  - `DELETE /api/images/<id>/delete/` - Supprime une image

- **Admin Django** : `http://localhost:8000/admin/`
  - Interface d'administration pour gérer les images

## 🗂️ Structure du Backend

```
imageBoost/
├── imageBoost/           # Configuration du projet
│   ├── settings.py       # Paramètres Django
│   └── urls.py          # Routes principales
│
├── images/              # Application de gestion d'images
│   ├── models.py        # Modèle OptimizedImage
│   ├── views.py         # Vues API (upload, list, delete)
│   ├── serializers.py   # Sérialiseurs REST
│   ├── utils.py         # Fonctions d'optimisation
│   └── urls.py          # Routes de l'app
│
├── media/               # Images uploadées (généré automatiquement)
│   ├── originals/       # Images originales
│   ├── webp/            # Versions WebP optimisées
│   └── thumbnails/      # Miniatures
│
└── manage.py            # Script de gestion Django
```

## 🔧 Fonctionnalités du Backend

### Optimisation Automatique des Images

Lorsqu'une image est uploadée, le backend génère automatiquement :

1. **Version WebP** : Format moderne avec compression optimale (qualité 85%)
2. **Thumbnail** : Version réduite (200x200px max)
3. **Blur Placeholder** : Version très légère encodée en base64 pour l'affichage immédiat

### Validation

- Types d'images acceptés : JPEG, PNG, WebP, GIF
- Taille maximale par défaut : 10 MB
- Validation automatique du type de fichier

## 🐛 Dépannage

### Erreur : "Module not found"
```bash
# Vérifiez que vous êtes dans l'environnement virtuel
pip install -r requirements.txt
```

### Erreur : "No such table"
```bash
# Réappliquez les migrations
python manage.py migrate
```

### Erreur : "Pillow not found"
```bash
# Sur Windows, vous pourriez avoir besoin de :
pip install --upgrade pip
pip install Pillow
```

## 📝 Notes Importantes

- Le dossier `media/` sera créé automatiquement lors du premier upload
- La base de données SQLite (`db.sqlite3`) sera créée après les migrations
- En développement, les fichiers média sont servis directement par Django

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. Accédez à `http://localhost:8000/api/images/`
   - Vous devriez voir une liste vide `[]` (JSON)

2. Testez l'upload avec curl :
```bash
curl -X POST http://localhost:8000/api/images/upload/ \
  -F "image=@chemin/vers/votre/image.jpg"
```

Le backend est maintenant prêt ! 🎉

