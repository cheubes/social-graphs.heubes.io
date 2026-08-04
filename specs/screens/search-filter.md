# Écran : recherche / filtre

## Objectif

Permettre au visiteur de retrouver rapidement un personnage par son nom, dans la Vue Mosaïque comme dans la Vue Graphe (voir `universe-home.md` et `graph-view.md`), et de filtrer les relations affichées par type dans la Vue Graphe.

## Contenu et structure

- Barre de recherche texte ("Filtrer par nom..."), cherchant parmi les `character-name` des personnages de l'univers, dans la langue courante. Présente sur les deux vues.
- Liste de filtres par type de relation, directement à droite de la barre de recherche (retour à la ligne si l'espace manque, voir `style-guide.md`), un par type présent dans l'univers (taxonomie commune et extensions locales, voir "Type de relation" dans `data-model.md`), chacun activable/désactivable indépendamment. Tous les types sont actifs par défaut. Présente uniquement en Vue Graphe : la Vue Mosaïque n'affiche aucune relation sur ses tuiles, un filtre par type n'y aurait pas d'effet visuellement justifié (voir `universe-home.md`).
- État de recherche partagé entre la Vue Mosaïque et la Vue Graphe : il n'est pas réinitialisé en basculant de l'une à l'autre via le switcher. L'état des filtres de type, propre à la Vue Graphe, persiste de la même façon. Pas de contrôle de réinitialisation dédié (voir `style-guide.md`).

## Interactions

- Saisie dans la barre de recherche, en Vue Mosaïque : masque les tuiles des personnages dont le `character-name` ne correspond pas.
- Saisie dans la barre de recherche, en Vue Graphe : met en évidence les nœuds correspondants, atténue les autres sans les retirer du graphe.
- Désactivation d'un type de relation, en Vue Graphe : masque les arêtes de ce type ; les nœuds restent affichés même sans arête visible.

## États (chargement, erreur, vide)

- Vide : aucun personnage ne correspond à la recherche → message l'indiquant.
- Chargement et erreur : sans objet, la recherche opère sur les données déjà chargées de la vue courante.

## Responsive

La barre de recherche et les filtres restent directement affichés sur petit écran, sans repli ni contrôle dédié : la disposition reste celle décrite ci-dessus, qui s'adapte déjà à la largeur disponible.
