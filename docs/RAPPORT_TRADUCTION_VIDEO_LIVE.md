# Rapport : traduction instantanée de vidéos live sur téléphone

*Date : 21 octobre 2026. Source : session Claude Code (cloud), à fusionner avec la mémoire locale de l'ordi.*

## Le besoin

- Écouter des **vidéos live** sur le **téléphone** et les comprendre en français.
- Plateformes : **Kajabi**, sites web de certains **fournisseurs** (lecteurs vidéo variés, souvent dans le navigateur).
- Les traducteurs instantanés physiques coûtent **400-500 $**. On veut une solution gratuite ou presque.
- Contexte : on a déjà des projets de traduction vidéo **préenregistrée** qui marchent bien (transcriptions et traductions Letterly, contenus jiu-jitsu). Ici, il s'agit du **direct**.

## État de la recherche dans cette session

- Aucune trace d'une discussion antérieure sur ce sujet dans Google Drive, Letterly ou ce dépôt GitHub.
- `COWORK_CONFIG_MEMO.md` est absent de ce dépôt.
- **À faire sur l'ordi** : vérifier dans la mémoire locale (D:\DIGITAL_GARDEN / notes ZED) si une solution avait déjà été trouvée, puis comparer avec les options ci-dessous.

## Options

### 1. Sous-titres instantanés traduits, intégrés au téléphone (gratuit, le plus simple)

| Plateforme | Fonction | Ce que ça fait | Limite |
|---|---|---|---|
| **Android : Pixel 6+ et certains Samsung Galaxy récents** | *Live Caption* (sous-titres instantanés) avec traduction | Sous-titre en français **tout son joué par le téléphone**, peu importe l'app ou le site, Kajabi inclus. Traitement sur l'appareil, gratuit. | Selon le modèle et les langues offertes |
| **iPhone** | Sous-titres instantanés (Accessibilité) | Transcrit l'audio du téléphone | **Ne traduit pas.** La traduction en direct d'iOS 26 avec AirPods sert aux conversations face à face, pas à l'audio d'une app. |

**C'est l'option qui colle le mieux au besoin si le téléphone est un Android compatible.**

### 2. Le truc des deux appareils (gratuit, marche partout)

- L'appareil A joue la vidéo (téléphone, tablette, ordi).
- Le téléphone B fait tourner **Google Traduction** en mode *Transcription*, ou **Microsoft Translator** en mode conversation, et écoute par le micro.
- Résultat : un sous-titre traduit en continu sur B.
- Moins élégant, mais compatible avec **n'importe quelle plateforme** et avec iPhone.

### 3. Sur ordinateur

- **Chrome** offre des sous-titres en direct avec traduction (Paramètres > Accessibilité > Sous-titres instantanés).
- Gratuit et efficace pour les lives Kajabi suivis à l'ordi.

### 4. Construire notre propre outil (quelques sous de l'heure)

- Une petite **app web (PWA)** qui capte l'audio par le micro et l'envoie à une API de traduction en temps réel (OpenAI Realtime, Gemini Live, Deepgram + traduction, etc.).
- Sortie possible : sous-titres français à l'écran et/ou **voix française dans les écouteurs**.
- Coût estimé : quelques cents à environ 1 $ de l'heure selon l'API (à confirmer au moment de construire).
- **Limite technique** :
  - **iPhone** : une app ne peut pas capter l'audio d'une autre app, donc il faut le micro, donc le truc des deux appareils (option 2).
  - **Android** : la capture de l'audio interne est possible (Android 10+, MediaProjection), mais certaines apps la bloquent. C'est plus complexe à développer.

## Comparatif rapide

| Option | Coût | Effort | Marche avec Kajabi sur le téléphone même |
|---|---|---|---|
| 1. Live Caption Android | 0 $ | Aucun | Oui (si appareil compatible) |
| 1. iPhone natif | 0 $ | Aucun | Non (pas de traduction) |
| 2. Deux appareils | 0 $ | Faible | Oui (via un 2e appareil) |
| 3. Chrome sur ordi | 0 $ | Aucun | Non (ordi seulement) |
| 4. Outil maison | ~cents/heure | Moyen à élevé | iPhone : avec 2e appareil. Android : possible |
| Traducteur physique | 400-500 $ | Aucun | Oui |

## Question déterminante

**Quel téléphone : iPhone ou Android, et quel modèle ?**

- **Pixel ou Samsung récent** : l'option 1 règle probablement tout, gratuitement.
- **iPhone** : l'option 2 dépanne immédiatement. Ensuite, voir l'option 4 pour plus de confort (sous-titres plus propres, voix française).

## Prochaines étapes

1. Croiser ce rapport avec la mémoire locale de l'ordi (solution déjà trouvée ?).
2. Confirmer le modèle de téléphone.
3. Tester l'option 1 ou l'option 2 sur un vrai live Kajabi.
4. Si ce n'est pas satisfaisant, lancer le prototype de l'option 4.
