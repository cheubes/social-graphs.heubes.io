# Écran : accueil d'un univers

## Objectif

Présenter l'univers au visiteur (de quoi s'agit-il, quel est son contexte), et lui permettre de basculer entre une vue mosaïque de ses personnages et une vue graphe interactif de ses relations (voir `graph-view.md`) : deux vues au contenu principal différent, mais partageant la même structure de page.

## Contenu et structure

- En-tête : couverture et `title` de l'univers courant (voir `data-model.md`), switcher "Vue Mosaïque" / "Vue Graphe" sous le titre, logo du site en lien de retour vers l'accueil, sélecteur de langue (voir `style-guide.md`). Ni `source-type` ni `description` de l'univers n'y sont affichés.
- Switcher "Vue Mosaïque" / "Vue Graphe" : bascule le contenu principal ci-dessous entre les deux vues, sans changer le reste de l'en-tête (couverture, titre, logo, sélecteur de langue). Présent et identique dans les deux vues, seul son état actif diffère ; chaque vue reste une page à part entière, l'URL diffère entre les deux (voir `technical-specifications.md`), mais la bascule se comporte comme un changement d'onglet plutôt que comme une navigation vers un contenu différent.
- Barre de recherche et filtres de groupe, présents sur les deux vues. Les filtres de type de relation, propres à la Vue Graphe, ne sont pas affichés ici : voir leur emplacement, sous le graphe, dans `graph-view.md` (contenu et comportement détaillés dans `search-filter.md`).
- Contenu principal, en Vue Mosaïque : mosaïque des personnages de l'univers, une tuile par personnage disponible dans la langue courante (même règle de masquage que pour les univers non traduits, voir "Multilingue" dans `functional-specifications.md`). Chaque tuile affiche le portrait, le `character-name` et la `description` du personnage, ainsi que, si le personnage appartient à un groupe (voir "Groupe" dans `data-model.md`), le logo de ce groupe en bas à droite du portrait et une bordure épaisse entre le portrait et le nom, de la couleur de ce groupe (blanche pour un personnage sans groupe ; voir "Tuiles" dans `style-guide.md`). Toutes les tuiles ont exactement la même hauteur (voir `style-guide.md`).
  - La `description` est tronquée (avec une marque de troncature, ex : "...") au-delà d'une certaine longueur ; la valeur précise relève du design (voir `style-guide.md`).
  - Le portrait se charge en lazy loading, même principe que pour l'image de couverture des univers sur `home.md`.
  - Tri des personnages, modifiable par l'utilisateur via les boutons de tri placés à côté de la barre de recherche (voir `search-filter.md`). Par défaut, tri par nombre de relations décroissant (le nombre de relations d'un personnage, entrantes et sortantes confondues, est calculé à partir de `relations.yaml`, ce n'est pas un attribut stocké), à nombre égal par `character-name` croissant, pour un ordre stable. Ce tri reste basé sur l'ensemble des relations du personnage, indépendamment de la recherche ou des filtres actifs.
- Le contenu principal de la Vue Graphe est documenté dans `graph-view.md`.
- Pied de page : badge Creative Commons et mention de réalisation, communs à toutes les pages (voir `style-guide.md`).

## Interactions

- Clic sur le switcher "Vue Graphe" : bascule vers la vue graphe interactif de cet univers (voir `graph-view.md`), seul l'état actif du switcher change dans l'en-tête, le reste restant inchangé.
- Clic sur une tuile de personnage : ouvre la fiche de ce personnage en modale, superposée à la vue courante, sans navigation vers une nouvelle page (voir `character-sheet.md`).
- Changement de langue via le sélecteur : réaffiche la page dans la langue choisie si elle existe (voir "Multilingue" dans `functional-specifications.md`), sinon affiche le message d'indisponibilité.
- Clic sur le lien de retour : navigue vers l'accueil du site.

## États (chargement, erreur, vide, indisponible)

- Indisponible : l'univers n'est pas traduit dans la langue courante, que ce soit par accès direct ou par changement de langue → message d'indisponibilité, aucun contenu de l'univers affiché.
- Vide : l'univers est traduit dans la langue courante mais n'a aucun personnage disponible dans cette langue (Vue Mosaïque) → message l'indiquant, avec une invitation à changer de langue s'il en existe dans l'autre.
- Erreur : image de couverture ou portrait manquant ou en échec de chargement → image de remplacement générique.
- Chargement : le contenu de la page lui-même n'a pas d'état de chargement propre si elle est générée statiquement (à revoir si `technical-specifications.md` retient un rendu dynamique) ; l'image de couverture et les portraits, eux, se chargent individuellement en lazy loading, indépendamment du mode de rendu de la page.

## Responsive

Le comportement responsive de l'en-tête (couverture, titre, switcher, logo, sélecteur de langue) est défini dans `style-guide.md`. Le contenu principal (mosaïque de personnages) s'adapte à la largeur de l'écran (une colonne sur mobile, plusieurs colonnes au-delà), comme celle des univers sur l'accueil du site.
