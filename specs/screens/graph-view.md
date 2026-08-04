# Écran : vue graphe interactif

## Objectif

Permettre au visiteur d'explorer visuellement le réseau de personnages d'un univers et leurs relations : repérer les personnages centraux, comprendre qui est lié à qui et de quelle façon, et accéder au détail d'un personnage ou d'une relation.

## Contenu et structure

Cette vue partage l'en-tête (dont le switcher "Vue Mosaïque" / "Vue Graphe", voir `style-guide.md`) et le pied de page avec `universe-home.md` ; seul le contenu principal ci-dessous lui est propre.

- Graphe interactif :
  - Un nœud par personnage disponible dans la langue courante (même règle de masquage que pour les univers non traduits, voir "Multilingue" dans `functional-specifications.md`), affichant son portrait et son `character-name`, ainsi qu'une bordure de la couleur de son groupe d'appartenance si renseigné (voir "Groupe" dans `data-model.md`), blanche sinon, et le logo de ce groupe, si renseigné, en bas à droite du nœud.
  - Une arête par relation entre deux personnages affichés. Quand deux personnages sont liés par plusieurs relations de types différents, chacune est une arête distincte.
  - Une arête d'un type dirigé est représentée avec un sens visuel (ex : flèche) ; une arête d'un type non dirigé n'en a pas.
  - Chaque type de relation a une couleur distincte, définie dans `style-guide.md` (ce n'est pas un attribut de données, voir `data-model.md`).
- Légende couleur → type de relation, affichée en permanence sur cette vue (voir `style-guide.md` : la distinction par couleur seule n'est pas garantie au-delà de trois types affichés simultanément). Chaque entrée affiche la couleur du type et son `label` (forme `masculine`, aucun personnage particulier n'étant associé à cette légende, voir "Accord de genre" dans "Type de relation" de `data-model.md`). Elle ne duplique pas les filtres de type de relation de `search-filter.md` : c'est la même liste, au même emplacement (entre le switcher et le graphe, voir `universe-home.md`), chaque filtre affichant déjà la couleur de son type (voir `style-guide.md`).
- Barre de recherche et filtres de groupe (persistants sur cette vue et sur la Vue Mosaïque), et filtres de type de relation, propres à cette vue (voir `search-filter.md` pour leur contenu et leur comportement détaillés). Sur cette vue, la recherche met en évidence ou masque les nœuds correspondants, les filtres de type masquent les arêtes des types désactivés, et les filtres de groupe masquent les nœuds (et les arêtes qui leur sont associées) des personnages du groupe désactivé. Ces filtres, affichant chacun le logo du groupe concerné, servent aussi de légende bordure/logo → groupe, sur le même principe que la légende couleur → type de relation ci-dessus.

## Interactions

- Clic sur un nœud : ouvre la fiche de ce personnage en modale, superposée à la vue courante, sans navigation vers une nouvelle page (voir `character-sheet.md`), comme pour une tuile en Vue Mosaïque.
- Survol ou clic sur une arête : affiche le détail de la relation (le libellé dans le bon sens selon l'extrémité concernée, et sa `description` si renseignée ; voir "Type de relation" dans `data-model.md`).
- Zoom et déplacement (pan) dans le graphe.
- Recherche/filtre : met en évidence ou masque les éléments correspondants (détail dans `search-filter.md`).
- Clic sur le switcher "Vue Mosaïque" : retourne à la vue mosaïque de cet univers (voir `universe-home.md`), seul l'état actif du switcher change dans l'en-tête, le reste restant inchangé.
- Changement de langue via le sélecteur : réaffiche la vue dans la langue choisie si elle existe (voir "Multilingue" dans `functional-specifications.md`), sinon affiche le message d'indisponibilité.

## États (chargement, erreur, vide, indisponible)

- Indisponible : l'univers n'est pas traduit dans la langue courante → message d'indisponibilité, même comportement que `universe-home.md`.
- Vide : l'univers n'a aucune relation dans la langue courante → les nœuds des personnages s'affichent sans arête, avec un message le signalant.
- Erreur : portrait manquant ou en échec de chargement pour un nœud → image de remplacement générique.
- Chargement : le graphe étant interactif, un état de chargement est probable le temps de son initialisation ; son traitement précis relève de `technical-specifications.md`.

## Responsive

Le graphe reste utilisable au doigt sur petit écran (zoom, déplacement, sélection d'un nœud ou d'une arête) ; la barre de recherche/filtre (dont la légende, voir ci-dessus), le switcher et le pied de page fixe (voir `style-guide.md`) restent accessibles sans recouvrir le graphe.
