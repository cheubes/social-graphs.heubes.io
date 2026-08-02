# Écran : recherche / filtre

## Objectif

Permettre au visiteur de retrouver rapidement un personnage par son nom, et de filtrer les relations affichées par type, dans la Vue Mosaïque comme dans la Vue Graphe (voir `universe-home.md` et `graph-view.md`).

## Contenu et structure

- Barre de recherche texte, cherchant parmi les `character-name` des personnages de l'univers, dans la langue courante.
- Liste de filtres par type de relation, un par type présent dans l'univers (taxonomie commune et extensions locales, voir "Type de relation" dans `data-model.md`), chacun activable/désactivable indépendamment. Tous les types sont actifs par défaut.
- Contrôle de réinitialisation, qui vide la recherche et réactive tous les types de relation.
- État de recherche et de filtre partagé entre la Vue Mosaïque et la Vue Graphe : il n'est pas réinitialisé en basculant de l'une à l'autre via le switcher.

## Interactions

- Saisie dans la barre de recherche, en Vue Mosaïque : masque les tuiles des personnages dont le `character-name` ne correspond pas.
- Saisie dans la barre de recherche, en Vue Graphe : met en évidence les nœuds correspondants, atténue les autres sans les retirer du graphe.
- Désactivation d'un type de relation, en Vue Graphe : masque les arêtes de ce type ; les nœuds restent affichés même sans arête visible.
- Désactivation d'un type de relation, en Vue Mosaïque : masque les tuiles des personnages n'ayant aucune relation d'un type resté actif.
- Clic sur le contrôle de réinitialisation : vide la recherche et réaffiche tous les personnages et toutes les relations.

## États (chargement, erreur, vide)

- Vide : aucun personnage ne correspond à la recherche ou aux filtres actifs → message l'indiquant, avec une invitation à réinitialiser.
- Chargement et erreur : sans objet, la recherche et le filtre opèrent sur les données déjà chargées de la vue courante.

## Responsive

La barre de recherche et les filtres se replient dans un panneau accessible via un contrôle dédié sur petit écran, pour ne pas réduire l'espace disponible au contenu principal (mosaïque ou graphe).
