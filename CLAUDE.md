# social-graphs.heubes.io

Site présentant des "univers" (les personnages d'une œuvre, un groupe historique, etc.) sous forme de graphes interactifs de personnages et de leurs relations. Site statique, multilingue (français / anglais), généré avec Jekyll et hébergé sur GitHub Pages.

## État du projet

Le projet en est au stade des spécifications : tout est documenté dans `specs/`, aucune implémentation n'existe encore. Avant d'écrire du code, lire les fichiers de specs concernés par la tâche, ainsi que `BUILD-PLAN.md`, qui définit l'ordre d'implémentation en étapes incrémentales.

## Structure de `specs/`

- **`functional-specifications.md`** : périmètre du projet, utilisateurs cibles, parcours utilisateurs, règles transverses (multilingue, navigation), hors périmètre.
- **`data-model.md`** : entités (Univers, Personnage, Relation, Type de relation), leurs attributs, et le format des fichiers qui les portent (organisation Jekyll, conventions de nommage, contraintes de validation).
- **`technical-specifications.md`** : stack technique, hébergement/déploiement, architecture (rendu, routing), performance, accessibilité, SEO.
- **`style-guide.md`** : charte graphique (couleurs, typographie, espacements), composants UI de base (en-tête, pied de page, tuiles, modale...), iconographie.
- **`screens/`** : une spécification fonctionnelle par écran (objectif, contenu, interactions, états, responsive) :
  - `home.md` — accueil du site (mosaïque d'univers)
  - `universe-home.md` — accueil d'un univers (Vue Mosaïque de ses personnages)
  - `graph-view.md` — Vue Graphe interactif d'un univers
  - `character-sheet.md` — fiche personnage (modale)
  - `search-filter.md` — recherche et filtrage

## Quand et comment utiliser ces specs

- **Avant toute implémentation**, lire le ou les fichiers concernés par la tâche. Les quatre specs transverses (`functional-specifications.md`, `data-model.md`, `technical-specifications.md`, `style-guide.md`) s'appliquent à tous les écrans ; chaque fichier de `screens/` complète avec ce qui est propre à cet écran.
- **Les fichiers se référencent constamment entre eux** ("voir `X.md`") plutôt que de dupliquer l'information. Suivre ces renvois plutôt que de deviner : si un écran mentionne une règle définie ailleurs (le comportement multilingue, une couleur de la charte...), la source de vérité est le fichier référencé, pas l'écran qui le cite.
- **En cas de modification d'une spec**, chercher les autres fichiers qui la référencent (`grep` du nom de fichier dans `specs/`) et vérifier qu'ils restent cohérents avec le changement. C'est la source la plus fréquente d'incohérence dans ce projet.
- **En cas de doute ou de silence des specs** sur un point nécessaire à l'implémentation, demander plutôt que de supposer : ce sont des choix de conception, pas des détails d'implémentation libres.
- **En cas de contradiction** entre le code (existant ou en cours d'écriture) et une spec, la spec fait foi ; si l'implémentation révèle qu'une spec doit changer, mettre à jour la spec et expliquer pourquoi, plutôt que de s'en écarter silencieusement dans le code.

## Avant chaque commit

L'ensemble des fichiers de `specs/` doit être vérifié pour cohérence avant chaque commit, pas seulement les fichiers directement modifiés par ce commit.

Si cette vérification montre qu'une ou plusieurs specs doivent être ajustées (pour rester cohérentes entre elles, ou avec le changement en cours), **le commit doit être bloqué** : proposer les mises à jour nécessaires et attendre validation avant de les appliquer, puis de committer.

## Conventions établies

- Le contenu des specs, et plus généralement toute prose ou documentation, est en français.
- Les noms de fichiers, dossiers, attributs de données, classes CSS et identifiants techniques sont en anglais, en kebab-case (ex : `source-type`, `additional-relation-types.yml`, `.sg-card`).
- Les couleurs et composants de la charte graphique sont définis une seule fois, dans `style-guide.md` : ne pas introduire de nouvelles valeurs de couleur ou de nouveaux styles de composants ailleurs sans les y ajouter d'abord.
