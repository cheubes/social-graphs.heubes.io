# Écran : fiche personnage

## Objectif

Présenter le détail d'un personnage (biographie, informations complémentaires, relations) et permettre au visiteur de naviguer vers les personnages qui lui sont liés, sans quitter la Vue Mosaïque ou la Vue Graphe sur laquelle il se trouvait.

## Contenu et structure

Modale superposée à la Vue Mosaïque ou à la Vue Graphe (voir `universe-home.md` et `graph-view.md`), qui reste visible en arrière-plan.

- Portrait et `character-name` du personnage.
- `portrait-source`, si renseigné : mention de la source du portrait, en légende sous l'image (voir `style-guide.md`).
- `description` (texte biographique).
- `metadata`, si renseigné : affiché en liste clé/valeur ; les clés sont des champs libres définis par l'auteur du contenu (voir `data-model.md`), affichées telles quelles faute de dictionnaire de traduction dédié.
- `external-link`, si renseigné : lien sortant vers une source externe.
- Liste des relations de ce personnage, regroupées par type : chaque groupe est identifié par le libellé accordé au genre de ce personnage (`label` si ce personnage est la source, `reverse-label` s'il est la cible, ou `label` pour un type non dirigé ; voir "Accord de genre" dans "Type de relation" de `data-model.md`). Un type dirigé pour lequel ce personnage est à la fois source de certaines relations et cible d'autres forme deux groupes distincts, l'un sous `label`, l'autre sous `reverse-label`. Les groupes sont ordonnés selon l'ordre de déclaration de leur type dans la taxonomie (types communs de `relation-types.yml`, puis extensions locales de l'univers) plutôt qu'alphabétiquement : le libellé variant avec le genre du personnage affiché, un tri alphabétique changerait d'ordre d'un personnage à l'autre. Dans chaque groupe, un personnage lié par ligne, triés par ordre alphabétique de leur `character-name`, avec la `description` de la relation si renseignée. Cette liste est complète : elle n'est pas affectée par la recherche ou les filtres actifs de la vue sous-jacente (voir `search-filter.md`).
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

Sur petit écran, la modale occupe l'écran sous l'en-tête, qui reste visible et accessible (notamment pour le sélecteur de langue, voir `style-guide.md`), plutôt qu'une fenêtre superposée partielle.
