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

### Entraînement (Haltères)
Pour le pratiquant de jiu-jitsu qui s'entraîne aux haltères, utilisable au téléphone :

**Nouvelle séance**
- Choix de la durée (5, 10, 15, 20, 30 ou 45 minutes)
- Zones travaillées : tout le corps, ou une combinaison de Haut du corps, Bas du corps, Dos, Gainage, Corps entier (plusieurs zones alternent)
- Séries par exercice (3 par défaut) et répétitions par série (8 par défaut), l'appli ajuste le nombre d'exercices
- Niveau : Débutant, Intermédiaire, Avancé
- Format : Séries (répétitions avec repos chronométré), Circuit (stations au temps), Mixte
- Tempo personnalisable (5 s / 5 s recommandé pour protéger tendons et ligaments, 3 s / 3 s, 2 s / 4 s)
- Options : « J'ai un banc ou une marche solide » (6 exercices additionnels), « Inclure les mouvements explosifs »
- Réglages mémorisés

**Séance proposée**
- Génération automatique des exercices avec variation des zones et groupes musculaires
- Calcul de l'échauffement, séries, répétitions, repos et retour au calme
- Image de chaque exercice (vignette du poster « Dumbbell Workouts »)
- Points d'attention et intérêt pour le jiu-jitsu
- Boutons : Remplacer (autre exercice de la même zone), Regénérer, Lancer la séance

**Séance guidée (plein écran)**
- Échauffement articulaire guidé
- Pour chaque série : compte à rebours « Préparez-vous », métronome avec MONTE / DESCENDS
- Affichage des secondes et comptage des répétitions automatique
- Côté droit puis côté gauche pour les exercices unilatéraux
- Bips de montée / descente, cloche de fin de série
- Repos chronométré avec aperçu de l'exercice suivant et bouton « +15 s »
- Boutons Pause, Précédent, Suivant, « Série terminée », « Passer l'exercice »
- Saisie du poids utilisé
- Retour au calme avec étirements guidés
- Écran de fin avec récapitulatif
- L'écran reste allumé pendant la séance (si le navigateur le permet)
- Reprise de séance après rechargement de page

**Historique**
- Chaque séance enregistrée : date, durée réelle et prévue
- Par exercice : séries faites, temps passé, poids
- Statistiques : nombre de séances, temps total, 7 derniers jours
- Suppression possible
- Sauvegarde dans le navigateur

**Bibliothèque**
- Les 40 exercices du poster classés par zone
- Image, muscles, matériel, niveau, points d'attention
- Bouton « Voir le poster complet »

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

### Lancer les tests
```bash
npm test
```

Les tests unitaires couvrent le générateur de séances et la machine à étapes de la séance guidée.

## Mettre en ligne (GitHub Pages)

Le workflow `.github/workflows/pages.yml` construit l'application à chaque push de la
branche de travail et publie le résultat sur la branche `gh-pages`. Une seule
activation manuelle est nécessaire, une fois : dans GitHub, « Settings » → « Pages » →
« Build and deployment » → Source « Deploy from a branch », branche `gh-pages`,
dossier `/ (root)`, puis « Save ». Adresse du site :
https://cbas1974-projet.github.io/App-de-Gestion-de-pool-de-combat/

## Mettre en ligne (Netlify)

Le build est portable (chemins relatifs) et `netlify.toml` contient les réglages.

- **Sans installation** : `npm run build`, puis déposer le contenu du dossier `dist/`
  sur https://app.netlify.com/drop. Renommer ensuite le site dans
  « Site configuration » → « Change site name ».
- **Automatique** : dans Netlify, « Add new site » → « Import an existing project »,
  choisir ce dépôt GitHub et la branche. Chaque push redéploie le site.

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

### 6. S'entraîner (Onglet Entraînement)
1. Accédez à l'onglet "Entraînement"
2. Dans "Nouvelle séance":
   - Choisissez la durée (5 à 45 minutes)
   - Choisissez les zones à travailler, une ou plusieurs
   - Indiquez votre niveau (Débutant, Intermédiaire, Avancé)
   - Choisissez le format (Séries, Circuit ou Mixte)
   - Réglez le tempo recommandé (5 s / 5 s pour protéger vos tendons)
   - Cochez les options si vous avez un banc ou voulez des mouvements explosifs
3. Dans "Séance proposée":
   - L'application génère les exercices
   - Consultez les points d'attention et l'intérêt pour le jiu-jitsu
   - Utilisez "Remplacer" pour changer un exercice, "Regénérer" pour une nouvelle combinaison
   - Cliquez sur "Lancer la séance"
4. Pendant la "Séance guidée":
   - L'application guide votre tempo avec un métronome
   - Suivez les affichages MONTE / DESCENDS
   - Utilisez les boutons Pause, Précédent, Suivant
   - Saisissez le poids utilisé à chaque exercice
   - Terminez par les étirements de retour au calme
5. L'historique enregistre automatiquement votre séance avec les détails (durée, poids, séries)
6. Consultez la "Bibliothèque" pour explorer les 40 exercices avec leurs images et détails

## Technologies Utilisées

- **React 19** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **TailwindCSS 4** - Framework CSS
- **Vitest** - Tests unitaires
- **Web Audio API** - Génération de sons
- **LocalStorage** - Sauvegarde des données

## Structure du Projet

```
src/
├── components/                    # Composants React
│   ├── FighterManager.tsx        # Gestion des combattants
│   ├── PoolManager.tsx           # Gestion d'un pool
│   ├── Timer.tsx                 # Timer de combat
│   ├── Entrainement.tsx          # Onglet entraînement
│   ├── SeanceGuidee.tsx          # Séance guidée (plein écran)
│   ├── FicheExercice.tsx         # Fiche détail d'un exercice
│   ├── HistoriqueEntrainement.tsx # Historique des séances
│   └── BibliothequeExercices.tsx # Bibliothèque des 40 exercices
├── data/                         # Données statiques
│   ├── exercices.ts             # Les 40 exercices du poster
│   └── parametres.ts            # Durées, tempos, niveaux, formats
├── utils/                        # Utilitaires
│   ├── storage.ts               # Sauvegarde locale
│   ├── validation.ts            # Validation des combattants
│   ├── sounds.ts                # Génération de sons
│   ├── generateurSeance.ts      # Génération de séances d'entraînement
│   ├── etapesSeance.ts          # Étapes de la séance guidée
│   └── formatage.ts             # Formatage (dates, durées, etc.)
├── hooks/                        # Hooks React
│   ├── useMoteurEtapes.ts       # Moteur de temps de la séance guidée
│   └── useVerrouEcran.ts        # Garde l’écran allumé pendant la séance
├── types.ts                      # Types TypeScript
├── App.tsx                       # Composant principal
└── index.css                     # Styles globaux

public/
├── exercices/                    # Images des exercices
│   ├── hammer-curl.png
│   ├── [37 autres exercices]
│   ├── woodchop.png
│   └── _poster.jpg              # Poster complet

scripts/
└── decouper_poster.py           # Script de découpe du poster
```

## Images des Exercices

Les images des 40 exercices proviennent d'un poster du commerce « Dumbbell Workouts » et sont découpées automatiquement à partir d'une photo ou d'un scan.

### Découper le poster
Pour générer les vignettes à partir d'une image du poster :

**Dépendances :**
```bash
pip install pillow
```

**Utilisation :**
```bash
python3 scripts/decouper_poster.py <image_du_poster> [--sortie public/exercices] [--debug]
```

Exemple :
```bash
python3 scripts/decouper_poster.py photo_du_poster.jpg --sortie public/exercices
```

Le script :
1. Repère les bandes bleues du poster (titre, en-têtes, pied)
2. En déduit la grille de 5 colonnes
3. Découpe chaque case et retire le libellé anglais
4. Enregistre les PNG des 40 exercices (nommés selon `src/data/exercices.ts`)
5. Enregistre aussi le poster complet recadré (`_poster.jpg`)

### Améliorer la résolution
Pour des vignettes plus nettes, relancez simplement le script avec une image de meilleure résolution (photo de meilleure qualité ou scan plus précis). Les fichiers existants seront remplacés et l'application les prendra en compte au prochain lancement.

### Remplacer une image
Vous pouvez également remplacer directement un fichier PNG par votre propre photo en gardant le nom de fichier (ex. : `public/exercices/hammer-curl.png`).

## Licence

MIT
