# 🎨 Frontend ImageBoost - Guide Complet

Frontend React avec interface moderne pour l'optimisation d'images.

## 📋 Table des Matières

- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure](#structure)
- [Composants](#composants)
- [Configuration](#configuration)
- [Dépannage](#dépannage)

## 📦 Installation

### 1. Prérequis

- Node.js 14 ou supérieur
- npm ou yarn

Vérifiez votre version :
```bash
node --version
npm --version
```

### 2. Installation des Dépendances

```bash
cd frontend
npm install
```

Les packages installés :
- React 18.2.0
- React DOM 18.2.0
- Axios 1.6.0
- React Scripts 5.0.1

### 3. Lancer le Serveur de Développement

```bash
npm start
```

Le serveur sera accessible sur : **http://localhost:3000**

L'application s'ouvrira automatiquement dans votre navigateur.

## 🎯 Utilisation

### Démarrage

1. **Assurez-vous que le backend est lancé** :
   - Le backend Django doit tourner sur `http://localhost:8000`
   - Si le backend est sur un autre port, modifiez les URLs dans les composants

2. **Lancez le frontend** :
   ```bash
   npm start
   ```

3. **Utilisez l'application** :
   - **Upload d'images** : Glissez-déposez ou cliquez pour sélectionner
   - **Visualisation** : Les images optimisées s'affichent automatiquement
   - **Actions** : Voir en grand, supprimer

### Fonctionnalités

- ✅ Upload multiple d'images
- ✅ Glisser-déposer
- ✅ Prévisualisation avant upload
- ✅ Affichage avec lazy loading
- ✅ Placeholders flous pendant le chargement
- ✅ Statistiques de réduction de taille
- ✅ Suppression d'images

## 🗂️ Structure du Frontend

```
frontend/
├── public/
│   └── index.html        # HTML principal
│
├── src/
│   ├── components/
│   │   ├── SmartImage.js       # Composant avec lazy loading
│   │   ├── SmartImage.css      # Styles du composant SmartImage
│   │   ├── ImageUploader.js    # Composant d'upload
│   │   ├── ImageUploader.css   # Styles du composant Uploader
│   │   ├── ImageGallery.js     # Composant de galerie
│   │   └── ImageGallery.css    # Styles de la galerie
│   │
│   ├── App.js            # Composant principal
│   ├── App.css           # Styles principaux
│   ├── index.js          # Point d'entrée React
│   └── index.css         # Styles globaux
│
├── package.json          # Dépendances et scripts
├── .gitignore           # Fichiers à ignorer
└── README.md            # Ce fichier
```

## 🧩 Composants

### SmartImage

Composant intelligent pour l'affichage d'images avec :

- **Lazy Loading** : Chargement uniquement quand l'image entre dans le viewport
- **Blur Placeholder** : Affichage d'une version floue pendant le chargement
- **Progressive Loading** : Transition fluide vers l'image finale
- **Gestion d'erreurs** : Message d'erreur si le chargement échoue

**Utilisation** :
```jsx
<SmartImage
  src={image.webp_url}
  blurPlaceholder={image.blur_placeholder}
  alt={image.original_name}
  thumbnailUrl={image.thumbnail_url}
/>
```

**Props** :
- `src` : URL de l'image principale (WebP ou originale)
- `blurPlaceholder` : String base64 pour le placeholder flou
- `alt` : Texte alternatif
- `thumbnailUrl` : URL de la miniature (optionnel)
- `width`, `height` : Dimensions (optionnel)
- `className` : Classes CSS supplémentaires

### ImageUploader

Composant pour l'upload d'images avec :

- Support du glisser-déposer
- Upload multiple
- Barre de progression
- Prévisualisation des fichiers

**Utilisation** :
```jsx
<ImageUploader onUploadSuccess={handleImageUploaded} />
```

**Props** :
- `onUploadSuccess` : Callback appelé après un upload réussi

### ImageGallery

Composant pour afficher la galerie d'images avec :

- Grille responsive
- Statistiques pour chaque image
- Actions (voir, supprimer)
- Affichage optimisé avec SmartImage

**Utilisation** :
```jsx
<ImageGallery 
  images={images} 
  onImageDeleted={handleImageDeleted}
/>
```

**Props** :
- `images` : Tableau d'objets image
- `onImageDeleted` : Callback appelé après suppression

## ⚙️ Configuration

### URL de l'API Backend

L'URL de l'API est configurée dans les composants. Par défaut : `http://localhost:8000/api/images/`

Pour modifier l'URL, éditez :

1. **ImageUploader.js** (ligne ~60) :
```javascript
const response = await axios.post(
  'http://localhost:8000/api/images/upload/',
  formData,
  ...
);
```

2. **ImageGallery.js** (ligne ~10 et ~20) :
```javascript
const response = await fetch('http://localhost:8000/api/images/');
// et
const response = await axios.delete(
  `http://localhost:8000/api/images/${imageId}/delete/`
);
```

3. **App.js** (ligne ~17) :
```javascript
const response = await fetch('http://localhost:8000/api/images/');
```

### Proxy (Alternative)

Vous pouvez aussi configurer un proxy dans `package.json` :

```json
{
  "proxy": "http://localhost:8000"
}
```

Ensuite, utilisez des URLs relatives :
```javascript
const response = await fetch('/api/images/');
```

## 🎨 Personnalisation

### Styles

Les styles sont dans :
- `src/index.css` : Styles globaux
- `src/App.css` : Styles de l'application principale
- `src/components/*.css` : Styles de chaque composant

### Thème

Pour modifier les couleurs principales, éditez `App.css` :

```css
/* Couleur principale */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Couleurs des boutons */
background: #667eea;
```

## 🐛 Dépannage

### Erreur : "Cannot find module"

**Solution** :
```bash
# Réinstallez les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur : Port 3000 déjà utilisé

**Solution** :
```bash
# Utilisez un autre port
PORT=3001 npm start

# Ou définissez dans .env
echo "PORT=3001" > .env
```

### Erreur : "Network Error" ou "CORS Error"

**Solution** :
1. Vérifiez que le backend est lancé sur `http://localhost:8000`
2. Vérifiez que CORS est configuré dans le backend
3. Vérifiez les URLs dans les composants

### Les images ne se chargent pas

**Solution** :
1. Vérifiez que le backend sert correctement les fichiers média
2. Vérifiez la console du navigateur pour les erreurs
3. Vérifiez que les URLs des images sont correctes

### Lazy loading ne fonctionne pas

**Solution** :
1. Vérifiez que votre navigateur supporte IntersectionObserver
2. Vérifiez la console pour les erreurs JavaScript
3. Testez dans un autre navigateur

## 📦 Build de Production

Pour créer une version de production :

```bash
npm run build
```

Cela créera un dossier `build/` avec les fichiers optimisés.

Pour servir la version de production :

```bash
# Avec serve (installer d'abord : npm install -g serve)
serve -s build

# Ou avec Python
cd build
python -m http.server 3000
```

## 🔧 Scripts Disponibles

- `npm start` : Lance le serveur de développement
- `npm run build` : Crée une version de production
- `npm test` : Lance les tests (si configurés)
- `npm run eject` : Éjecte la configuration Create React App (irréversible)

## 📝 Notes Importantes

- Le frontend communique avec le backend via des requêtes HTTP
- Les images sont affichées avec lazy loading pour optimiser les performances
- Les placeholders flous sont chargés immédiatement pour une meilleure UX
- L'application est responsive et fonctionne sur mobile

## ✅ Tests

Pour vérifier que tout fonctionne :

1. **Lancez le backend** sur `http://localhost:8000`
2. **Lancez le frontend** avec `npm start`
3. **Ouvrez** `http://localhost:3000`
4. **Testez l'upload** d'une image
5. **Vérifiez** que l'image apparaît dans la galerie

---

Le frontend est maintenant prêt ! 🎉 Consultez [../README.md](../README.md) pour le guide complet du projet.

