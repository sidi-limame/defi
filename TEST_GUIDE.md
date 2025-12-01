# 🧪 Guide de Test du Projet ImageBoost

Ce guide vous aide à tester le projet étape par étape.

## ✅ Vérifications Préalables

### 1. Vérifier Python
```bash
python --version
# Doit afficher Python 3.8 ou supérieur
```

### 2. Vérifier Node.js
```bash
node --version
npm --version
# Node.js 14+ et npm requis
```

## 🔧 Installation et Configuration

### Backend (Django)

#### Étape 1 : Installer les dépendances

**Option A - Avec environnement virtuel (Recommandé)**
```bash
# Depuis la racine du projet (defi/)
python -m venv venv

# Activer l'environnement virtuel
# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# Installer les dépendances
cd backend
pip install -r requirements.txt
```

**Option B - Installation globale**
```bash
cd backend
pip install -r requirements.txt
```

#### Étape 2 : Créer les migrations
```bash
cd backend
python manage.py makemigrations
```

#### Étape 3 : Appliquer les migrations
```bash
python manage.py migrate
```

#### Étape 4 : Vérifier la configuration
```bash
python manage.py check
```

#### Étape 5 : Lancer le serveur
```bash
python manage.py runserver
```

**✅ Le backend devrait être accessible sur : http://localhost:8000**

### Frontend (React)

#### Étape 1 : Installer les dépendances
```bash
cd frontend
npm install
```

#### Étape 2 : Lancer le serveur de développement
```bash
npm start
```

**✅ Le frontend devrait être accessible sur : http://localhost:3000**

## 🧪 Tests à Effectuer

### Test 1 : Backend - API Endpoints

#### Test 1.1 : Liste des images (vide au début)
```bash
# Dans un nouveau terminal
curl http://localhost:8000/api/images/
```

**Résultat attendu** : `[]` (liste vide en JSON)

#### Test 1.2 : Upload d'une image
```bash
curl -X POST http://localhost:8000/api/images/upload/ \
  -F "image=@chemin/vers/votre/image.jpg"
```

**Résultat attendu** : JSON avec les informations de l'image optimisée

#### Test 1.3 : Vérifier les fichiers générés
Vérifiez que les dossiers suivants existent dans `backend/` :
- `media/originals/` - Images originales
- `media/webp/` - Versions WebP
- `media/thumbnails/` - Miniatures

### Test 2 : Frontend - Interface Web

#### Test 2.1 : Accéder à l'application
1. Ouvrez votre navigateur
2. Allez sur `http://localhost:3000`
3. Vous devriez voir :
   - Le titre "🚀 ImageBoost"
   - Une zone de drag & drop
   - Un message "Aucune image pour le moment"

#### Test 2.2 : Upload d'une image
1. Cliquez sur "cliquez pour sélectionner" ou glissez une image
2. Sélectionnez une image (JPG, PNG, WebP, ou GIF)
3. Cliquez sur "Uploader X image(s)"
4. Vérifiez la barre de progression
5. L'image devrait apparaître dans la galerie

#### Test 2.3 : Vérifier l'affichage
1. Vérifiez que l'image s'affiche avec le blur placeholder
2. Vérifiez que les statistiques s'affichent :
   - Dimensions
   - Taille originale
   - Réduction de taille
   - Format

#### Test 2.4 : Actions sur l'image
1. Cliquez sur "👁️ Voir" - L'image devrait s'ouvrir dans un nouvel onglet
2. Cliquez sur "🗑️ Supprimer" - Confirmez la suppression
3. L'image devrait disparaître de la galerie

### Test 3 : Fonctionnalités Avancées

#### Test 3.1 : Lazy Loading
1. Uploadez plusieurs images (5-10)
2. Faites défiler la page
3. Observez que les images ne se chargent que quand elles entrent dans le viewport

#### Test 3.2 : Blur Placeholder
1. Uploadez une grande image
2. Observez qu'un placeholder flou apparaît d'abord
3. L'image nette apparaît progressivement

#### Test 3.3 : Upload Multiple
1. Sélectionnez plusieurs images en même temps
2. Vérifiez que toutes s'affichent dans la liste
3. Uploadez toutes en une fois

#### Test 3.4 : Drag & Drop
1. Glissez une image depuis votre explorateur de fichiers
2. Déposez-la dans la zone de drop
3. Vérifiez que la zone devient active (couleur change)
4. L'image devrait être sélectionnée

## 🐛 Dépannage

### Problème : ModuleNotFoundError: No module named 'rest_framework'

**Solution** :
```bash
# Vérifiez que vous êtes dans l'environnement virtuel
# Réinstallez les dépendances
cd backend
pip install -r requirements.txt
```

### Problème : Port 8000 déjà utilisé

**Solution** :
```bash
# Utilisez un autre port
python manage.py runserver 8001

# Puis mettez à jour l'URL dans les composants React
```

### Problème : Port 3000 déjà utilisé

**Solution** :
```bash
# Windows PowerShell
$env:PORT=3001; npm start

# Linux/Mac
PORT=3001 npm start
```

### Problème : CORS Error dans le navigateur

**Solution** :
1. Vérifiez que le backend est lancé
2. Vérifiez les URLs dans les composants React
3. Vérifiez `backend/imageBoost/settings.py` - CORS_ALLOWED_ORIGINS

### Problème : Les images ne s'affichent pas

**Solution** :
1. Vérifiez que le dossier `backend/media/` existe
2. Vérifiez les permissions du dossier
3. Vérifiez la console du navigateur pour les erreurs

### Problème : Pillow ne s'installe pas

**Solution Windows** :
```bash
pip install --upgrade pip
pip install Pillow
```

**Solution Linux** :
```bash
sudo apt-get install python3-dev libjpeg-dev zlib1g-dev
pip install Pillow
```

## ✅ Checklist de Validation

- [ ] Backend démarre sans erreur sur http://localhost:8000
- [ ] Frontend démarre sans erreur sur http://localhost:3000
- [ ] L'API répond : `curl http://localhost:8000/api/images/` retourne `[]`
- [ ] Upload d'image fonctionne
- [ ] Les fichiers sont créés dans `backend/media/`
- [ ] L'image s'affiche dans la galerie frontend
- [ ] Le blur placeholder fonctionne
- [ ] Le lazy loading fonctionne
- [ ] La suppression d'image fonctionne
- [ ] Les statistiques s'affichent correctement
- [ ] Le drag & drop fonctionne
- [ ] L'upload multiple fonctionne

## 📊 Test de Performance

### Test 1 : Taille des fichiers
1. Uploadez une image de 5 MB
2. Vérifiez la réduction de taille affichée
3. Vérifiez que la version WebP est bien plus petite

### Test 2 : Qualité visuelle
1. Uploadez une image haute qualité
2. Ouvrez la version WebP
3. Comparez visuellement avec l'original

## 🎯 Tests Automatisés (Optionnel)

Pour créer des tests automatisés plus tard :

### Backend - Tests Django
```bash
cd backend
python manage.py test
```

### Frontend - Tests React
```bash
cd frontend
npm test
```

---

**🎉 Si tous les tests passent, votre projet ImageBoost fonctionne correctement !**

