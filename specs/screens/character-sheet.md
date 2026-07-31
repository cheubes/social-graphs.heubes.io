# Écran : fiche personnage

## Objectif

Présenter le détail d'un personnage (biographie, informations complémentaires, relations) et permettre au visiteur de naviguer vers les personnages qui lui sont liés, sans quitter la Vue Mosaïque ou la Vue Graphe sur laquelle il se trouvait.

## Contenu et structure

Modale superposée à la Vue Mosaïque ou à la Vue Graphe (voir `universe-home.md` et `graph-view.md`), qui reste visible en arrière-plan.

- Portrait et `name` du personnage.
- `description` (texte biographique).
- `metadata`, si renseigné : affiché en liste clé/valeur ; les clés sont des champs libres définis par l'auteur du contenu (voir `data-model.md`), affichées telles quelles faute de dictionnaire de traduction dédié.
- `external-link`, si renseigné : lien sortant vers une source externe.
- Liste des relations de ce personnage : pour chacune, le libellé dans le bon sens (`label` si ce personnage est la source, `reverse-label` s'il est la cible, ou le `label` du type non dirigé, voir "Type de relation" dans `data-model.md`), le nom du personnage lié, et la `description` de la relation si renseignée. Triée par ordre alphabétique du `name` du personnage lié. Cette liste est complète : elle n'est pas affectée par la recherche ou les filtres actifs de la vue sous-jacente (voir `search-filter.md`).
- Bouton de fermeture.

L'ouverture de la modale, quelle que soit son origine (clic sur une tuile, un nœud, ou accès direct), met à jour l'URL pour refléter le personnage affiché ; cette URL reste partageable telle quelle (voir le parcours "lien partagé" dans `functional-specifications.md`).

## Interactions

- Clic sur le bouton de fermeture, sur l'arrière-plan, ou touche Échap : ferme la modale, retour à la vue sous-jacente inchangée.
- Clic sur un personnage lié, dans la liste des relations : remplace le contenu de la modale par la fiche de ce personnage, sans fermer/rouvrir la modale ni changer la vue sous-jacente.
- Accès direct par lien partagé : ouvre la modale par-dessus la Vue Mosaïque de l'univers concerné (voir `universe-home.md`).
- Changement de langue via le sélecteur : si le personnage existe dans l'autre langue, réaffiche sa fiche dans cette langue ; sinon, affiche le message d'indisponibilité (voir "Multilingue" dans `functional-specifications.md`).

## États (chargement, erreur, vide, indisponible)

- Indisponible : le personnage n'est pas traduit dans la langue courante, que ce soit par accès direct ou par changement de langue → message d'indisponibilité, aucun contenu du personnage affiché.
- Vide : le personnage n'a aucune relation dans l'univers → la liste des relations est absente, le reste de la fiche s'affiche normalement.
- Erreur : portrait manquant ou en échec de chargement → image de remplacement générique.
- Chargement : possible le temps de charger le contenu du personnage dans la modale ; son traitement précis relève de `technical-specifications.md`.

## Responsive

Sur petit écran, la modale occupe l'ensemble de l'écran plutôt qu'une fenêtre superposée partielle.
