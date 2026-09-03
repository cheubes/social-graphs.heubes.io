# Écran : recherche / filtre

## Objectif

Permettre au visiteur de retrouver rapidement un personnage par son nom, dans la Vue Mosaïque comme dans la Vue Graphe (voir `universe-home.md` et `graph-view.md`), de filtrer les personnages affichés par groupe d'appartenance dans les deux vues, de filtrer les relations affichées par type dans la Vue Graphe, et de trier les personnages affichés en Vue Mosaïque.

## Contenu et structure

- Barre de recherche texte ("Filtrer par nom..."), cherchant parmi les `character-name` des personnages de l'univers, dans la langue courante. Présente sur les deux vues.
- Boutons de tri, à droite de la barre de recherche, sur la même ligne (voir `style-guide.md`) : un bouton par critère (`character-name` et nombre de relations), chacun cliquable indépendamment pour l'activer ou, s'il est déjà actif, en inverser le sens. Présents uniquement en Vue Mosaïque, la Vue Graphe n'affichant pas de liste ordonnée. Par défaut : nombre de relations décroissant, ce qui reprend le tri historique de la Vue Mosaïque (voir `universe-home.md`). Activer un critère jusque-là inactif applique son sens par défaut (`character-name` : croissant ; nombre de relations : décroissant) plutôt que de conserver le sens précédemment affiché sur l'autre critère. À nombre de relations égal, le tri secondaire reste toujours par `character-name` croissant, quel que soit le sens choisi, pour un ordre stable.
- Liste de filtres par groupe, sur sa propre ligne, en dessous de la barre de recherche (voir `style-guide.md`), un par groupe présent dans l'univers (voir "Groupe" dans `data-model.md`), chacun activable/désactivable indépendamment. Tous les groupes sont actifs par défaut. Présente sur les deux vues. Un personnage sans groupe n'est concerné par aucun de ces filtres : il reste affiché quel que soit leur état, de la même façon qu'un personnage sans relation n'est concerné par aucun filtre de type de relation.
- Liste de filtres par type de relation, affichée en bloc séparé sous le graphe plutôt qu'aux côtés de la barre de recherche (voir emplacement exact dans `graph-view.md`), un par type présent dans l'univers (taxonomie commune et extensions locales, voir "Type de relation" dans `data-model.md`), chacun activable/désactivable indépendamment. Tous les types sont actifs par défaut. Présente uniquement en Vue Graphe : la Vue Mosaïque n'affiche aucune relation sur ses tuiles, un filtre par type n'y aurait pas d'effet visuellement justifié (voir `universe-home.md`).
- État de recherche partagé entre la Vue Mosaïque et la Vue Graphe : il n'est pas réinitialisé en basculant de l'une à l'autre via le switcher. L'état des filtres de groupe, partagé de la même façon entre les deux vues, celui des filtres de type, propre à la Vue Graphe, et celui du tri, propre à la Vue Mosaïque, persistent de la même façon. Pas de contrôle de réinitialisation dédié (voir `style-guide.md`).

## Interactions

- Clic sur un bouton de tri, en Vue Mosaïque : active son critère (à son sens par défaut) s'il ne l'était pas déjà, ou inverse son sens s'il l'était déjà ; réordonne les tuiles affichées en conséquence.
- Saisie dans la barre de recherche, en Vue Mosaïque : masque les tuiles des personnages dont le `character-name` ne correspond pas.
- Saisie dans la barre de recherche, en Vue Graphe : met en évidence les nœuds correspondants, atténue les autres sans les retirer du graphe.
- Désactivation d'un filtre de groupe, en Vue Mosaïque : masque les tuiles des personnages de ce groupe.
- Désactivation d'un filtre de groupe, en Vue Graphe : masque les nœuds des personnages de ce groupe, ainsi que les arêtes qui leur sont associées (à la différence d'un filtre de type de relation, qui ne masque que des arêtes en laissant les nœuds affichés).
- Désactivation d'un type de relation, en Vue Graphe : masque les arêtes de ce type ; les nœuds restent affichés même sans arête visible.

## États (chargement, erreur, vide)

- Vide : aucun personnage ne correspond à la recherche et aux filtres actifs (groupe, et type de relation en Vue Graphe) → message l'indiquant.
- Chargement et erreur : sans objet, la recherche opère sur les données déjà chargées de la vue courante.

## Responsive

La barre de recherche, les boutons de tri et les filtres restent directement affichés sur petit écran, sans repli ni contrôle dédié : la disposition reste celle décrite ci-dessus, qui s'adapte déjà à la largeur disponible.
