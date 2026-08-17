# Écran : accueil du site

## Objectif

Permettre au visiteur de découvrir les univers disponibles et d'accéder à celui qui l'intéresse.

## Contenu et structure

- En-tête : logo et tagline du site, sélecteur de langue (voir `functional-specifications.md` et `style-guide.md`).
- Une section par type de source (voir "Type de source" dans `data-model.md`) ayant au moins un univers disponible dans la langue courante, titrée avec le `label` de ce type dans la langue courante ; une section sans univers disponible dans cette langue n'apparaît pas.
  - Ordre des sections : ordre de déclaration des types de source dans `_data/source-types.yml`, pas un tri alphabétique (qui varierait d'une langue à l'autre selon le `label`).
  - À l'intérieur d'une section, mosaïque de tuiles, une tuile par univers de ce type de source disponible dans la langue courante (un univers non traduit dans cette langue n'apparaît pas, voir "Multilingue" dans `functional-specifications.md`).
- Chaque tuile affiche l'image de couverture, le `title`, la `description` de l'univers, et une mention de crédit de la couverture si `cover-source` est renseigné (voir `data-model.md`).
  - Toutes les tuiles ont exactement la même hauteur (voir `style-guide.md`). Le `title` et la `description` ne sont pas tronqués : si leur contenu dépasse la hauteur disponible sous la couverture, cette zone devient défilable, la couverture restant fixe.
  - Le crédit de la couverture, si renseigné, s'affiche en fin de contenu de la tuile, aligné à droite (voir `style-guide.md`) : un lien qui ouvre `cover-source` dans un nouvel onglet si c'est une URL, ou une mention indiquant que la couverture est générée par IA si `cover-source` vaut `ai-generated` (voir "Univers" dans `data-model.md`).
  - L'image de couverture se charge en lazy loading (chargée uniquement à l'approche de la zone visible de l'écran), pour limiter le poids initial de la page ; son traitement précis relève de `technical-specifications.md`.
- Dans chaque section, les tuiles sont triées par ordre alphabétique de `title`, dans la langue courante.
- Pied de page : badge Creative Commons et mention de réalisation, communs à toutes les pages (voir `style-guide.md`).

## Interactions

- Clic sur une tuile : navigue vers la page d'accueil de l'univers correspondant.
- Changement de langue via le sélecteur : réaffiche la mosaïque dans la langue choisie, avec les sections, le tri et la liste d'univers recalculés pour cette langue.

## États (chargement, erreur, vide)

- Vide : aucun univers disponible dans la langue courante (aucune section à afficher). Un message l'indique ; s'il existe des univers dans l'autre langue, le message invite à changer de langue.
- Erreur : image de couverture manquante ou en échec de chargement pour une tuile → image de remplacement générique, le reste de la tuile s'affiche normalement.
- Chargement : la liste des univers elle-même n'a pas d'état de chargement propre si la page est générée statiquement (à revoir si `technical-specifications.md` retient un rendu dynamique) ; les images de couverture, elles, se chargent individuellement en lazy loading, indépendamment du mode de rendu de la page.

## Responsive

Au sein de chaque section, la mosaïque s'adapte à la largeur de l'écran (une colonne sur mobile, plusieurs colonnes au-delà), sans nombre de colonnes fixe imposé ici.
