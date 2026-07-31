# Écran : accueil d'un univers

## Objectif

Présenter l'univers au visiteur (de quoi s'agit-il, quel est son contexte), et lui permettre de basculer entre une vue mosaïque de ses personnages et une vue graphe interactif de ses relations (voir `graph-view.md`) : deux vues au contenu principal différent, mais partageant la même structure de page.

## Contenu et structure

- En-tête : identité du site, sélecteur de langue, lien de retour vers l'accueil du site.
- Image de couverture de l'univers.
- `title` et `description` de l'univers (voir `data-model.md`).
- `source-type`, affiché comme indication de contexte (ex : "période historique").
- Switcher "Vue Mosaïque" / "Vue Graphe" : bascule le contenu principal ci-dessous entre les deux vues, sans changer l'en-tête ni la présentation de l'univers au-dessus. Présent et identique dans les deux vues ; chaque vue reste une page à part entière, l'URL diffère entre les deux (voir `technical-specifications.md`), mais la bascule se comporte comme un changement d'onglet plutôt que comme une navigation vers un contenu différent.
- Barre de recherche/filtre, présente et identique dans les deux vues (voir `search-filter.md` pour son contenu et son comportement détaillés).
- Contenu principal, en Vue Mosaïque : mosaïque des personnages de l'univers, une tuile par personnage disponible dans la langue courante (même règle de masquage que pour les univers non traduits, voir "Multilingue" dans `functional-specifications.md`). Chaque tuile affiche le portrait, le `name` et la `description` du personnage.
  - La `description` est tronquée (avec une marque de troncature, ex : "...") au-delà d'une certaine longueur ; la valeur précise relève du design (voir `style-guide.md`).
  - Le portrait se charge en lazy loading, même principe que pour l'image de couverture des univers sur `home.md`.
  - Tri par nombre de relations décroissant (le nombre de relations d'un personnage, entrantes et sortantes confondues, est calculé à partir de `relations.yaml`, ce n'est pas un attribut stocké). À nombre égal, tri secondaire par `name` alphabétique, pour un ordre stable. Ce tri reste basé sur l'ensemble des relations du personnage, indépendamment de la recherche ou des filtres actifs (voir `search-filter.md`).
- Le contenu principal de la Vue Graphe est documenté dans `graph-view.md`.

## Interactions

- Clic sur le switcher "Vue Graphe" : bascule vers la vue graphe interactif de cet univers (voir `graph-view.md`), l'en-tête et la présentation de l'univers restant inchangés.
- Clic sur une tuile de personnage : ouvre la fiche de ce personnage en modale, superposée à la vue courante, sans navigation vers une nouvelle page (voir `character-sheet.md`).
- Changement de langue via le sélecteur : réaffiche la page dans la langue choisie si elle existe (voir "Multilingue" dans `functional-specifications.md`), sinon affiche le message d'indisponibilité.
- Clic sur le lien de retour : navigue vers l'accueil du site.

## États (chargement, erreur, vide, indisponible)

- Indisponible : l'univers n'est pas traduit dans la langue courante, que ce soit par accès direct ou par changement de langue → message d'indisponibilité, aucun contenu de l'univers affiché.
- Vide : l'univers est traduit dans la langue courante mais n'a aucun personnage disponible dans cette langue (Vue Mosaïque) → message l'indiquant, avec une invitation à changer de langue s'il en existe dans l'autre.
- Erreur : image de couverture ou portrait manquant ou en échec de chargement → image de remplacement générique.
- Chargement : le contenu de la page lui-même n'a pas d'état de chargement propre si elle est générée statiquement (à revoir si `technical-specifications.md` retient un rendu dynamique) ; l'image de couverture et les portraits, eux, se chargent individuellement en lazy loading, indépendamment du mode de rendu de la page.

## Responsive

Le contenu (image, titre, description, switcher) s'empile verticalement sur les petits écrans. La mosaïque de personnages s'adapte à la largeur de l'écran (une colonne sur mobile, plusieurs colonnes au-delà), comme celle des univers sur l'accueil du site.
