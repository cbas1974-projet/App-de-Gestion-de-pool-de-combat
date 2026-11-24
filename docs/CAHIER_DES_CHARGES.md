# Cahier des charges — Module de pools de combat (Jeux Martiaux)

Rédigé le 2026-11-24 à partir des échanges avec l'organisateur. Les points encore ouverts sont listés à la fin (section 12).

## 1. But

Remplacer Smoothcomp par des tableaux de combat faits maison :

- former les pools à partir des inscrits payés ;
- gérer la pesée du jour même ;
- produire un horaire connu d'avance (chaque participant sait à quelle heure il combat) ;
- saisir les résultats tapis par tapis ;
- publier l'avancement aux parents pour qu'ils n'aient pas à rester sur place.

Premier événement visé : **Jeux Martiaux, samedi 19 juin 2027**. La dernière édition comptait environ 66 participants.

## 2. Architecture

- **Pile technique** : Flask, SQLite et JavaScript simple sans framework, comme l'outil d'inscription.
  - La page parents est pensée pour le téléphone (390 px). L'écran de l'organisateur est pensé pour un ordinateur portable.
  - Le code React actuel de ce repo sera remplacé. Il reste dans l'historique git.
- **Calculs côté serveur** : la formation des pools, l'horaire et le classement sont des fonctions Python pures, testées avec pytest. Les pages se contentent d'afficher et d'envoyer les actions.
- **Hébergement** : sur le VPS Hostinger, avec l'inscription. Internet est fiable sur place.
- **Un ordinateur par tapis** : chaque poste est un navigateur connecté au même serveur, donc aux mêmes données.
- **Séparation d'avec l'inscription** : le module ne modifie jamais le code ni la base de l'inscription. Il lit le CSV des payés, ou une copie de la base. À terme, le module sera intégré à la même application.
- **Sécurité** :
  - données fictives seulement pendant le développement ;
  - aucune clé en clair ;
  - on ne lit jamais le fichier `.env`.

## 3. Données d'entrée (contrat avec l'inscription)

**Source** : le CSV des payés, à l'adresse `/api/admin/payes.csv` (protégée par la clé admin).

- **Format** : séparateur `;`, encodage UTF-8 avec BOM, fins de ligne CRLF, virgule décimale.
- **Une ligne = un participant dans une discipline.** Un enfant inscrit à 2 disciplines occupe donc 2 lignes.

| Colonne | Usage dans le module |
|---|---|
| `choix` | Code de discipline (voir la section 4) |
| `choix_libelle` | Affichage |
| `prenom`, `nom` | Identité et affichage |
| `age` | Ignoré : l'âge est recalculé à partir de `date_naissance` à la date de l'événement |
| `date_naissance` | 1er critère (âge) |
| `poids_lb` | Poids déclaré. Le module travaille en **lbs** partout |
| `poids_kg` | Ignoré (affichage seulement) |
| `grade`, `grade_rang` | 3e critère (BJJ). `grade_rang` sert à ordonner les grades ; son sens est à confirmer dans `grade_cellule.py` |
| `ecole` | Affichage seulement, aucune contrainte de club |
| `etat` | Seules les lignes payées sont importées |
| `inscription` | Fait partie de l'identifiant |
| `sexe` *(à venir)* | Séparation à partir de 13 ans. Sera ajouté au formulaire d'inscription |

**Identifiant d'un participant** : `inscription` + `prenom` + `nom` + `date_naissance`, normalisés (minuscules, sans accents ni espaces superflus). Le même enfant inscrit dans deux disciplines est reconnu comme une seule personne pour l'horaire.

**Import** :

1. Première version : téléversement du fichier CSV.
2. Plus tard : lecture directe de l'adresse, avec la clé stockée côté serveur.

**Réimport** : l'app produit un rapport de différences (nouveaux inscrits, modifications, retraits). Elle n'écrase jamais rien en silence. Les pools touchées par un changement sont signalées.

## 4. Disciplines

| Code | Pools ? | Critères | Remarques |
|---|---|---|---|
| `bjj` | Oui | Âge, poids, grade | Les soumissions donnent des points et le combat continue : on ne gagne jamais par soumission |
| `sparring_n1_mt_kb` | Oui | Âge, poids | Niveau 1 (débutant) : techniques linéaires (direct, coup de pied direct), au corps seulement |
| `sparring_n2_mt_kb` *(à ajouter)* | Oui | Âge, poids | Niveau 2 : ajoute les crochets et les coups de pied circulaires, au corps seulement |
| `sparring_n3_mt_kb` *(à ajouter)* | Oui | Âge, poids | Niveau 3 : ajoute le clinch et les genoux, au corps seulement |
| `demo_jj_can_ryu` | Non | — | Démonstration sans combat, ignorée par le module |

- **Aucun coup à la tête**, quel que soit le niveau de sparring.
- **Les niveaux de sparring ne se mélangent jamais**, puisque les techniques permises diffèrent. Chaque niveau est une discipline à part. Pour ajouter les niveaux 2 et 3, il suffit de les déclarer dans `v4-jeux-2027.json`, sans changer le code de l'inscription.
- **Mêmes règles de podium** (1re, 2e, 3e) pour toutes les disciplines.

## 5. Formation des pools

### 5.1 Critères, par ordre de priorité

1. **Âge**, à partir de la date de naissance. L'écart se mesure entre le plus vieux et le plus jeune de la pool. On ne compare pas seulement des voisins, sinon la pool dérive.
2. **Poids**. L'écart maximum est un **pourcentage du poids du plus léger** de la pool.
3. **Grade** (BJJ seulement). C'est une préférence, jamais un blocage. Il sert à couper un gros groupe.

Autres règles :

- **Gars et filles** : ensemble, puis séparés à partir de 13 ans (réglable par tranche).
- **Clubs et écoles** : aucune contrainte.

### 5.2 Réglages par discipline et par tranche d'âge

Chaque tranche a ses propres réglages. **Changer une tranche ne recalcule que cette tranche** : par exemple, passer les ados à 12 % ne touche pas aux pools des tout-petits.

Valeurs de départ pour le BJJ (toutes réglables) :

| Tranche | Écart d'âge max | Écart de poids max | Gars/filles | Combat (1 round) |
|---|---|---|---|---|
| 3-5 ans | 1 an | 10 % | ensemble | 1 min (règles simplifiées) |
| 6-7 ans | 1 an | 10 % | ensemble | 1 min 30 |
| 8-10 ans | 1,5 an | 10 % | ensemble | 2 min |
| 11-12 ans | 2 ans | 10 % | ensemble | 2 min 30 |
| 13 ans | 2 ans | 12 % | séparés | 2 min 30 |
| 14-17 ans | 2 ans | 12 % | séparés | 3 min |

Valeurs de départ pour le sparring Muay Thai / Kickboxing (3 rounds) :

| Tranche | Round | Repos entre les rounds |
|---|---|---|
| Plus jeunes (≤ 8 ans, à confirmer) | 1 min 30 | 1 min (à confirmer) |
| Plus vieux (9-11 ans, à confirmer) | 2 min | 1 min (à confirmer) |
| Ados (12 ans et plus) | 3 min | 1 min (à confirmer) |

Quand une pool chevauche deux tranches, **c'est la durée du plus jeune qui s'applique**.

### 5.3 Fonctionnement

1. **Partition stricte** : par discipline (et niveau de sparring), puis par sexe si la tranche l'exige.
2. **Regroupement** :
   - L'app met ensemble tous les participants proches qui respectent les limites, même s'ils sont 7.
   - Pour chaque groupe de 5 ou plus, elle **propose** une coupe en pools de 3 (puis de 2 ou 4 au besoin), selon le grade puis le poids.
   - L'organisateur accepte la proposition, ou coupe autrement selon le grade ou la dynamique des jeunes.
3. **Compteur en direct**, par exemple « 22 pools : 18 de 3, 3 de 2, 1 de 4, 1 seul ».
4. **Tri** : les pools sont triées par âge puis par poids, et renumérotées.
5. **Personnes seules** : l'app affiche les 3 pools les plus proches, avec le dépassement exact (par exemple « +1 an, +2 lbs hors limite »). Deux actions :
   - **Jumeler** : surclassement dans une pool existante.
   - **Exhibition** : combat à genoux en catégorie libre, hors classement, où tout le monde va contre elle.
6. **Cadenas** :
   - Toute pool modifiée à la main (jumelage, déplacement, coupe) est verrouillée.
   - Un recalcul ne touche jamais une pool verrouillée.
   - Si une pool verrouillée ne respecte plus les réglages, elle s'affiche en orange, mais elle n'est jamais défaite.
7. **Annuler / rétablir** pour toutes les actions manuelles.

## 6. Formats de pool

| Taille | Format | Combats | Combats par personne | Médailles |
|---|---|---|---|---|
| 1 | Jumelage (surclassement) ou exhibition | — | — | — |
| 2 | 2 de 3 (la plage du 3e combat est réservée) | 2-3 | 2-3 | 1re, 2e |
| 3 | Chacun contre chacun | 3 | 2 | 1re, 2e, 3e |
| 4 | Demi-finales (les 2 plus légers ensemble, les 2 plus lourds ensemble), puis finale et combat pour le bronze | 4 | 2 | 1re, 2e, 3e |
| 5 et plus | À éviter : l'app propose de couper. Si la pool est gardée, chacun fait 2 combats contre ses voisins de poids (en zigzag), puis finale. Le 3e est le 3e au classement | n + 1 | 2-3 | 1re, 2e, 3e |

**Classement** (pools de 3, et phase de groupe des pools de 5 et plus), dans l'ordre :

1. nombre de victoires ;
2. points marqués au total ;
3. points reçus (le moins) ;
4. décision de l'organisateur, sur un indicateur « égalité à trancher ».

Le cas typique est la pool de 3 qui tourne en rond (A bat B, B bat C, C bat A). Il est rare, mais possible.

- **Pas de petite finale**, sauf dans la pool de 4, où le combat pour le bronze garantit 2 combats à chacun.
- **Le classement est recalculé à partir des résultats.** Corriger un résultat met donc le podium à jour.

## 7. Combats et résultats

- **Pas de match nul.** En cas d'égalité, on ajoute 1 minute. Si c'est encore égal, la décision va à celui qui a fait le plus de tentatives d'attaque. Pour le sparring, la règle d'égalité est à confirmer.
- **Saisie en première version** : le gagnant, le score final et le type de fin (temps réglementaire, prolongation ou décision).
- **Plus tard** : un tableau de pointage en direct (points et chrono affichés à l'écran).
- **Chronomètre du tapis** : rounds, repos entre les rounds, bouton « prolongation 1 min » et cloche.

## 8. Horaire

- **Connu d'avance** : chaque combat a un tapis et une heure prévue. Les finales et les combats pour le bronze ont aussi leur plage horaire ; seuls les adversaires restent à déterminer.
- **Alternance** : sur un tapis, 2 ou 3 pools alternent. Un combattant ne combat jamais deux fois de suite ; on vise au moins 1 combat de repos, idéalement 2.
- **Surfaces** : 1 ou 2 (réglable). Le sparring dure 3 à 4 fois plus longtemps par combat que le BJJ, donc il aura probablement sa propre surface.
- **Durée d'une plage** : durée du combat selon la tranche, plus 1 minute de changement, plus une petite marge pour les prolongations.
- **Enfant inscrit dans deux disciplines** : jamais deux combats en même temps, et du repos entre les deux.
- **Horaire final** : il est arrêté après la pesée. Pendant la journée, les heures prévues sont recalculées en direct si on prend de l'avance ou du retard.
- **Ordre de grandeur** : environ 70 combats de BJJ pour 66 participants, soit à peu près 4 h sur un tapis ou 2 h sur deux.

## 9. Jour du tournoi

- **Préparation** : les pools sont préparées d'avance avec le poids déclaré.
- **Écran de pesée** : le poids officiel remplace le poids déclaré. Les pools qui ne respectent plus les limites sont signalées, et l'organisateur décide sur place : déplacer, jumeler ou passer en exhibition.
- **Absents et forfaits** : on les marque, et la pool touchée est signalée.
- **Poste de tapis** : la liste des combats dans l'ordre, le chronomètre et la saisie des résultats.
- **Poste de l'organisateur** : une vue d'ensemble de tous les tapis.

## 10. Page parents

- **Accès** : page téléphone (390 px), envoyée par lien aux familles inscrites et non indexée par les moteurs de recherche.
- **Confidentialité** : les participants sont mineurs. On affiche le prénom et l'initiale du nom.
- **Contenu** :
  - pour chaque tapis, où il est rendu (combat en cours) ;
  - pour chaque enfant, ses prochains combats, avec l'heure estimée mise à jour en direct ;
  - les résultats et les podiums.
- **Mise à jour** : rafraîchissement automatique (toutes les 15 à 30 s).

## 11. Étapes de réalisation

1. **Squelette** : Flask, SQLite, import du CSV avec des données fictives et liste des participants.
2. **Formation des pools** : réglages par tranche, compteur, personnes seules, jumelage, cadenas et tri.
3. **Formats et classement.**
4. **Horaire** sur plusieurs tapis.
5. **Jour du tournoi** : pesée, poste de tapis (chrono et résultats), absents.
6. **Page parents.**
7. **Lecture directe** du CSV depuis l'inscription, puis intégration à l'application d'inscription.

Les étapes 1 et 2 couvrent déjà le travail de préparation des pools (régler, jumeler, verrouiller).

## 12. Points ouverts

- **Sparring** :
  - âges limites exacts des 3 durées ;
  - repos entre les rounds ;
  - règle en cas d'égalité.
- **Adultes** : combattent-ils ? Si oui, avec quels réglages ?
- **`grade_rang`** : sens exact, à confirmer dans `grade_cellule.py`.
- **Noms exacts** des codes de sparring niveaux 2 et 3, et de la future colonne `sexe`.
- **CSV de test** avec des données fictives, pour le développement.
- **Exhibitions** : bloc à la fin de l'horaire du tapis, ou intercalées ?
