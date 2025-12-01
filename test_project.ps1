# Script de test pour ImageBoost
# Ce script vérifie et teste le projet étape par étape

Write-Host "🧪 Test du Projet ImageBoost" -ForegroundColor Cyan
Write-Host ""

# ========== VÉRIFICATION DES PRÉREQUIS ==========
Write-Host "📋 Vérification des prérequis..." -ForegroundColor Yellow

# Vérifier Python
Write-Host "  → Vérification de Python..."
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "    ✅ Python trouvé: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "    ❌ Python non trouvé!" -ForegroundColor Red
    exit 1
}

# Vérifier Node.js
Write-Host "  → Vérification de Node.js..."
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "    ✅ Node.js trouvé: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "    ❌ Node.js non trouvé!" -ForegroundColor Red
    exit 1
}

# Vérifier npm
Write-Host "  → Vérification de npm..."
$npmVersion = npm --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "    ✅ npm trouvé: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "    ❌ npm non trouvé!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ========== INSTALLATION DES DÉPENDANCES BACKEND ==========
Write-Host "🔧 Installation des dépendances backend..." -ForegroundColor Yellow

Write-Host "  → Installation des packages Python..."
pip install -r backend/requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "    ✅ Dépendances backend installées" -ForegroundColor Green
} else {
    Write-Host "    ⚠️  Erreur lors de l'installation des dépendances" -ForegroundColor Yellow
}

Write-Host ""

# ========== VÉRIFICATION DU BACKEND ==========
Write-Host "🔍 Vérification du backend Django..." -ForegroundColor Yellow

Write-Host "  → Vérification de la configuration..."
python backend/manage.py check 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "    ✅ Configuration Django OK" -ForegroundColor Green
} else {
    Write-Host "    ⚠️  Problème de configuration détecté" -ForegroundColor Yellow
    Write-Host "       Vérifiez que toutes les dépendances sont installées" -ForegroundColor Yellow
}

Write-Host "  → Création des migrations..."
python backend/manage.py makemigrations 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "    ✅ Migrations créées" -ForegroundColor Green
} else {
    Write-Host "    ⚠️  Erreur lors de la création des migrations" -ForegroundColor Yellow
}

Write-Host "  → Application des migrations..."
python backend/manage.py migrate 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "    ✅ Migrations appliquées" -ForegroundColor Green
} else {
    Write-Host "    ⚠️  Erreur lors de l'application des migrations" -ForegroundColor Yellow
}

Write-Host ""

# ========== VÉRIFICATION DU FRONTEND ==========
Write-Host "🔍 Vérification du frontend React..." -ForegroundColor Yellow

if (Test-Path "frontend/node_modules") {
    Write-Host "    ✅ node_modules existe" -ForegroundColor Green
} else {
    Write-Host "    → Installation des dépendances frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm install 2>&1 | Out-Null
    Set-Location ..
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✅ Dépendances frontend installées" -ForegroundColor Green
    } else {
        Write-Host "    ⚠️  Erreur lors de l'installation" -ForegroundColor Yellow
    }
}

Write-Host ""

# ========== RÉSUMÉ ==========
Write-Host "✅ Vérifications terminées!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "  1. Lancer le backend:"
Write-Host "     cd backend"
Write-Host "     python manage.py runserver"
Write-Host ""
Write-Host "  2. Dans un nouveau terminal, lancer le frontend:"
Write-Host "     cd frontend"
Write-Host "     npm start"
Write-Host ""
Write-Host "  3. Ouvrir http://localhost:3000 dans votre navigateur"
Write-Host ""

