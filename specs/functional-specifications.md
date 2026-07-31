# Spécifications fonctionnelles générales

## Contexte et objectifs

Le site présente des "univers" : des groupes de personnages, ou de personnes réelles, et les relations qui les lient, sous forme de graphe interactif. Un univers peut être les personnages d'un roman, d'une série, un groupe d'artistes, une période historique, etc.

L'objectif est de permettre à un visiteur d'explorer visuellement le réseau de relations d'un univers : parcourir les personnages, comprendre qui est lié à qui et de quelle façon, et approfondir un personnage ou une relation en particulier.

## Périmètre du projet

Dans le périmètre :

- Consultation de la liste des univers disponibles, depuis la page d'accueil du site.
- Consultation, pour chaque univers, de sa page de présentation et de son graphe interactif de personnages et relations.
- Consultation de la fiche détaillée d'un personnage.
- Recherche et filtrage des personnages et relations au sein d'un univers.
- Site multilingue (français, anglais pour commencer).

Voir aussi "Hors périmètre" ci-dessous.

## Utilisateurs cibles

Le site s'adresse à des visiteurs qui souhaitent découvrir ou explorer un univers de personnages : lecteurs, spectateurs, curieux d'histoire, etc. Il n'y a pas de distinction de rôle côté visiteur : pas de compte, pas d'espace personnel, pas de contenu personnalisé.

Le contenu (univers, personnages, relations) est produit par l'auteur du site directement dans les fichiers sources (voir `data-model.md`), pas via une interface d'administration.

## Parcours utilisateurs principaux

1. Un visiteur arrive sur la page d'accueil du site, parcourt la mosaïque d'univers, et choisit celui qui l'intéresse.
2. Il arrive sur la page d'accueil de cet univers (Vue Mosaïque), qui le présente ainsi que ses personnages, et peut basculer vers la Vue Graphe pour une exploration plus visuelle des relations.
3. Depuis l'une ou l'autre de ces vues, il repère un personnage qui l'intéresse et ouvre sa fiche détaillée, affichée en superposition sans quitter la vue courante.
4. Depuis la fiche personnage, il peut naviguer vers les personnages liés par une relation.
5. À tout moment dans un univers, il peut rechercher ou filtrer les personnages et relations affichés.
6. Un visiteur peut aussi arriver directement sur la page d'un univers ou d'un personnage via un lien partagé, sans passer par l'accueil.

## Règles transverses

### Multilingue

- Le site est disponible en français et en anglais.
- Au premier accès, la langue est déterminée par celle du navigateur ; si le navigateur indique une autre langue que le français ou l'anglais, le site démarre en français. Un changement manuel de langue via le sélecteur est mémorisé pour les visites suivantes.
- Un sélecteur de langue, accessible depuis toutes les pages, permet de basculer d'une langue à l'autre. Il conserve le contexte de navigation quand le contenu existe dans l'autre langue ; sinon, la page affiche un message indiquant que ce contenu n'est pas encore disponible dans cette langue.
- Un univers non traduit dans la langue courante n'apparaît pas dans la mosaïque d'accueil de cette langue.
- Un personnage non traduit dans la langue courante n'apparaît pas dans le graphe, les listes ni la recherche de cette langue ; les relations qui le concernent sont masquées avec lui.

### Navigation

- Chaque page permet de revenir à l'accueil du site et à l'accueil de l'univers courant (quand applicable).

## Hors périmètre

- Comptes utilisateurs, authentification.
- Édition de contenu via une interface web : le contenu est créé et modifié directement dans les fichiers sources (voir `data-model.md`).
- Contenu généré par les visiteurs (commentaires, notes, contributions).
- Recherche globale inter-univers : la recherche est limitée à un univers (voir `search-filter.md`).
