# Application de Gestion de Pool de Combat

Application de bureau pour la gestion de compétitions de combat avec système de pools, timer de combat et attribution de médailles.

## Fonctionnalités

### Gestion des Combattants
- Ajout et suppression de combattants
- Informations: nom, âge, poids, grade
- Validation automatique avec alertes:
  - Alerte si l'âge dépasse le maximum configuré
  - Alerte si le poids dépasse le maximum configuré
  - Alerte si le grade n'est pas autorisé
- Sauvegarde automatique des données

### Système de Pools
- Création de pools de combat
- Choix du nombre minimum de combats: 2, 3 ou 4
- Génération automatique des matchs
- Vérification de compatibilité entre combattants (âge, poids)
- Gestion de 2 pools simultanés pour permettre des pauses entre combats
- Attribution automatique des médailles:
  - 🥇 Or
  - 🥈 Argent
  - 🥉 Bronze

### Timer de Combat
- Timer avec rounds configurables
- Durée de round et de repos personnalisables
- Cloche de boxe (sons générés):
  - Cloche de début de round
  - Triple cloche de fin de round
  - Bip de compte à rebours (10 dernières secondes)
- Affichage visuel du temps restant
- Indication du round actuel
- Distinction visuelle combat/repos

### Interface
- Design minimaliste et moderne
- Navigation par onglets
- Interface responsive
- Sauvegarde automatique dans le navigateur

## 🚀 Lancement Rapide (Recommandé)

### Pour Windows
1. **Première fois:** Double-cliquez sur `INSTALLER.bat`
2. **Ensuite:** Double-cliquez simplement sur `LANCER.bat`

### Pour Linux/Mac
1. Ouvrez un terminal dans ce dossier
2. Lancez: `./lancer.sh`

L'application s'ouvrira automatiquement dans votre navigateur !

📖 **Instructions détaillées:** Consultez le fichier `LISEZMOI.txt`

---

## Installation et Lancement (Méthode Avancée)

### Prérequis
- Node.js 16+ et npm (téléchargez sur https://nodejs.org)

### Installation des dépendances
```bash
npm install
```

### Lancement en mode développement
```bash
npm run dev
```

L'application sera accessible à l'adresse: `http://localhost:5173`

### Build pour production
```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

## Créer une Application PC de Bureau

Pour transformer cette application web en application PC de bureau, vous pouvez utiliser Electron:

### Installation d'Electron
```bash
npm install --save-dev electron electron-builder
```

### Créer un fichier electron/main.js
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // En développement
  // win.loadURL('http://localhost:5173');

  // En production
  win.loadFile(path.join(__dirname, '../dist/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

### Ajouter dans package.json
```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron:dev": "electron .",
    "electron:build": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.combatpool.manager",
    "productName": "Gestion Pool Combat",
    "files": ["dist/**/*", "electron/**/*"],
    "directories": {
      "buildResources": "assets"
    },
    "win": {
      "target": "nsis"
    },
    "mac": {
      "target": "dmg"
    },
    "linux": {
      "target": "AppImage"
    }
  }
}
```

### Build de l'application de bureau
```bash
npm run build
npm run electron:build
```

Cela créera un exécutable pour votre système d'exploitation dans le dossier `dist/`.

## Utilisation

### 1. Ajouter des Combattants
1. Allez dans l'onglet "Combattants"
2. Remplissez le formulaire avec les informations du combattant
3. Cliquez sur "Ajouter"
4. Les alertes de validation apparaîtront si nécessaire

### 2. Configurer les Règles de Validation
Dans l'onglet "Combattants", vous pouvez modifier:
- L'âge maximum autorisé
- Le poids maximum autorisé
- Les grades autorisés (dans le code)

### 3. Créer un Pool de Combat
1. Ajoutez au moins 2 combattants
2. Allez dans l'onglet "Pools de Combat"
3. Cliquez sur "Créer un Pool"
4. Configurez le nombre minimum de combats (2, 3 ou 4)
5. Ajoutez des combattants au pool
6. Cliquez sur "Générer les combats"

### 4. Gérer les Combats
1. Activez le pool (max 2 pools actifs simultanément)
2. Le premier combat s'affiche automatiquement
3. Utilisez le timer pour chronométrer les rounds
4. Cliquez sur le nom du gagnant à la fin du combat
5. Le prochain combat démarre automatiquement

### 5. Consulter les Résultats
Une fois tous les combats terminés, le podium s'affiche avec:
- Médaille d'or pour le premier
- Médaille d'argent pour le deuxième
- Médaille de bronze pour le troisième

## Technologies Utilisées

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **TailwindCSS** - Framework CSS
- **Web Audio API** - Génération de sons
- **LocalStorage** - Sauvegarde des données

## Structure du Projet

```
src/
├── components/          # Composants React
│   ├── FighterManager.tsx  # Gestion des combattants
│   ├── PoolManager.tsx     # Gestion d'un pool
│   └── Timer.tsx           # Timer de combat
├── utils/              # Utilitaires
│   ├── storage.ts         # Sauvegarde locale
│   ├── validation.ts      # Validation des combattants
│   └── sounds.ts          # Génération de sons
├── types.ts            # Types TypeScript
├── App.tsx             # Composant principal
└── index.css           # Styles globaux
```

## Licence

MIT
