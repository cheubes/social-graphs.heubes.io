# Écran : accueil du site

## Objectif

Permettre au visiteur de découvrir les univers disponibles et d'accéder à celui qui l'intéresse.

## Contenu et structure

- En-tête : identité du site, sélecteur de langue (voir `functional-specifications.md`).
- Mosaïque de tuiles, une tuile par univers disponible dans la langue courante (un univers non traduit dans cette langue n'apparaît pas, voir "Multilingue" dans `functional-specifications.md`).
- Chaque tuile affiche l'image de couverture, le `title` et la `description` de l'univers (voir `data-model.md`).
  - La `description` est tronquée (avec une marque de troncature, ex : "...") au-delà d'une certaine longueur ; la valeur précise relève du design (voir `style-guide.md`).
  - L'image de couverture se charge en lazy loading (chargée uniquement à l'approche de la zone visible de l'écran), pour limiter le poids initial de la page ; son traitement précis relève de `technical-specifications.md`.
- Les tuiles sont triées par ordre alphabétique de `title`, dans la langue courante.

## Interactions

- Clic sur une tuile : navigue vers la page d'accueil de l'univers correspondant.
- Changement de langue via le sélecteur : réaffiche la mosaïque dans la langue choisie, avec le tri et la liste d'univers recalculés pour cette langue.

## États (chargement, erreur, vide)

- Vide : aucun univers disponible dans la langue courante. Un message l'indique ; s'il existe des univers dans l'autre langue, le message invite à changer de langue.
- Erreur : image de couverture manquante ou en échec de chargement pour une tuile → image de remplacement générique, le reste de la tuile s'affiche normalement.
- Chargement : la liste des univers elle-même n'a pas d'état de chargement propre si la page est générée statiquement (à revoir si `technical-specifications.md` retient un rendu dynamique) ; les images de couverture, elles, se chargent individuellement en lazy loading, indépendamment du mode de rendu de la page.

## Responsive

La mosaïque s'adapte à la largeur de l'écran (une colonne sur mobile, plusieurs colonnes au-delà), sans nombre de colonnes fixe imposé ici.
