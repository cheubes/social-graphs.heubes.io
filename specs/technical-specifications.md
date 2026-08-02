# Spécifications techniques

## Stack technique

### Génération de site

- **Jekyll** : layouts, includes, front matter, `_data/`, pages (pas de collections, voir "Architecture").
- Pas de plugins Jekyll non supportés par GitHub Pages.
- **Ruby** : en plus de Jekyll, utilisé pour `scripts/validate.rb` (voir "Validation des données"). Aucun toolchain supplémentaire (pas de Node.js, pas de Python) pour ce script.

### CSS / UI

- **Bootstrap 5.3** (CDN jsDelivr, version figée) : grille, cartes (tuiles), modale (fiche personnage), composants de formulaire (recherche/filtre).
- **Font Awesome Free 7.3** (CDN jsDelivr, version figée) : icônes (fermeture de modale, recherche, badge Creative Commons). Saut de version majeure par rapport à la 6.x ; à vérifier lors de l'implémentation que les icônes utilisées existent toujours sous le même nom. Le sélecteur de langue utilise des emoji drapeaux, pas d'icône Font Awesome (voir `style-guide.md`).
- CSS natif avec variables custom (pas de SASS, pas de LESS).
- Les valeurs de design (couleurs, typographie, espacements) sont définies dans `style-guide.md`, pas ici.

### JavaScript

- **Vanilla JS** pour les interactions globales (sélecteur de langue, détection et mémorisation de la préférence).
- **D3.js v7** pour le graphe interactif (nœuds, arêtes, zoom, déplacement), chargé uniquement sur les pages Vue Graphe.
- Le JS de la modale (Bootstrap) pour la fiche personnage.
- Pas de framework JS (pas de React, Vue, Angular).

### Ce qu'on n'utilise pas

- Node.js en runtime (Jekyll uniquement en build).
- Base de données.
- Backend ou API propre.
- Cookies ou tracking. La préférence de langue (voir "Multilingue" dans `functional-specifications.md`) est mémorisée via `localStorage` : stockage local au navigateur, aucune donnée envoyée à un serveur, ce n'est pas un cookie.

---

## Hébergement et déploiement

- **Hébergeur :** GitHub Pages
- **Repository :** `https://github.com/cheubes/social-graphs.heubes.io`
- **Domaine :** `social-graphs.heubes.io` (fichier `CNAME` à la racine)
- **Déploiement :** manuel, sur push sur la branche `gh-pages`
- **Générateur :** Jekyll (intégration native GitHub Pages, pas de GitHub Actions nécessaire)

---

## Dépendances CDN (versions figées)

```html
<!-- Bootstrap 5.3.8 -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
  integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
  crossorigin="anonymous">
<script
  src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
  integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
  crossorigin="anonymous"
  defer></script>

<!-- Font Awesome Free 7.3.1 -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.3.1/css/all.min.css"
  integrity="sha384-qrALq7+6jBOZIQsNnT6xGkMDru64qD6uTlDra39xrt2SoXl4pO3FX6Roz/RpR/BS"
  crossorigin="anonymous">

<!-- Police de caractères : voir style-guide.md pour le choix, avec rel="preconnect" sur Google Fonts si retenu -->

<!-- D3.js v7.9.0 (chargé uniquement sur les pages Vue Graphe) -->
<script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js" defer></script>
```

Versions vérifiées comme les dernières stables disponibles sur jsDelivr à la date de rédaction ; à reconfirmer au moment de l'implémentation.

---

## Structure des fichiers

```
/
├── _config.yml
├── CNAME
├── 404.md                        # message d'indisponibilité, voir "Architecture"
├── index.fr.md                   # accueil du site (FR)
├── index.en.md                   # accueil du site (EN)
│
├── _layouts/
│   ├── default.html             # layout de base : <head>, header, footer
│   ├── home.html                # accueil du site (mosaïque d'univers)
│   ├── universe.html            # Vue Mosaïque d'un univers
│   ├── universe-graph.html      # Vue Graphe d'un univers
│   └── character.html           # fiche personnage (accès direct) : réutilise universe.html + modale ouverte
│
├── _includes/
│   ├── head.html
│   ├── header.html               # identité du site, sélecteur de langue
│   ├── footer.html
│   ├── universe-card.html        # tuile univers (accueil du site)
│   ├── character-card.html       # tuile personnage (Vue Mosaïque)
│   ├── character-modal.html      # contenu de la modale fiche personnage
│   ├── view-switcher.html        # switcher Vue Mosaïque / Vue Graphe
│   └── search-filter.html        # barre de recherche / filtres
│
├── _data/
│   ├── relation-types.yml        # taxonomie commune des types de relation
│   ├── ui.fr.yml                 # textes d'interface en FR (labels, messages, dont le message d'indisponibilité)
│   ├── ui.en.yml                 # textes d'interface en EN (labels, messages, dont le message d'indisponibilité)
│   └── <slug-universe>/
│       ├── relations.yml
│       └── additional-relation-types.yml   # optionnel
│
├── <slug-universe>/
│   ├── cover.jpg
│   ├── mosaic.fr.md              # Vue Mosaïque
│   ├── mosaic.en.md
│   ├── graph.fr.md               # Vue Graphe
│   ├── graph.en.md
│   └── characters/               # fiches personnage
│       ├── <slug-character>.fr.md
│       ├── <slug-character>.en.md
│       └── <slug-character>.jpg
│
├── assets/
│   ├── css/
│   │   └── main.css
│   ├── js/
│   │   ├── main.js                # sélecteur de langue, utilitaires partagés
│   │   ├── graph.js               # rendu D3 du graphe interactif
│   │   ├── character-modal.js     # ouverture/fermeture de la modale, synchronisation d'URL
│   │   └── search-filter.js       # recherche et filtres
│   └── img/                       # images pour l'interface (pas le contenu des univers)
│
└── scripts/
    └── validate.rb                # validation du contenu, voir "Validation des données"
```

### Configuration (`_config.yml`)

```yaml
title: "Social Graphs"          # à ajuster avec la tagline retenue (voir "En-tête" dans style-guide.md)
description: "Explore the characters of a universe and their relationships as an interactive graph."
url: "https://social-graphs.heubes.io"
baseurl: ""
lang: en                        # valeur de repli ; chaque page définit son propre lang (voir data-model.md), qui prime dans le layout
markdown: kramdown
permalink: pretty                # filet de sécurité ; en pratique, chaque page a son propre permalink explicite (voir "Génération des pages")
plugins:
  - jekyll-seo-tag
  - jekyll-sitemap
exclude:
  - specs/
  - scripts/
  - CLAUDE.md
  - BUILD-PLAN.md
  - README.md
  - Gemfile
  - Gemfile.lock
```

`specs/`, `scripts/`, `CLAUDE.md` et `BUILD-PLAN.md` doivent être exclus du build : ce sont des fichiers de travail du dépôt, pas du contenu du site, et Jekyll les publierait sinon tels quels sous `_site/`.

---

## Architecture (rendu, routing)

### Rendu

Le site est entièrement statique, généré au build par Jekyll. Aucun rendu dynamique côté serveur, aucune API propre (cohérent avec GitHub Pages).

### Structure des URLs

- `/` : accueil du site (anglais, langue par défaut)
- `/fr/` : accueil du site (français)
- `/<slug-universe>/` : Vue Mosaïque d'un univers (EN)
- `/fr/<slug-universe>/` : Vue Mosaïque (FR)
- `/<slug-universe>/graph/` : Vue Graphe d'un univers (EN)
- `/fr/<slug-universe>/graph/` : Vue Graphe (FR)
- `/<slug-universe>/characters/<slug-character>/` : fiche personnage, pour l'accès direct (EN)
- `/fr/<slug-universe>/characters/<slug-character>/` : idem (FR)

L'anglais, langue par défaut, n'a pas de préfixe ; le français est préfixé par `/fr/`.

### Génération des pages

Chaque univers vit dans son propre dossier à la racine du site (`/<slug-universe>/`) et ses pages sont des pages Jekyll classiques (pas de collection), chacune avec un permalink explicite en frontmatter pour appliquer le préfixe de langue.

- `mosaic.fr.md` / `mosaic.en.md` génèrent la Vue Mosaïque (`/fr/<slug-universe>/` en FR, `/<slug-universe>/` en EN).
- `graph.fr.md` / `graph.en.md` génèrent la Vue Graphe (`/fr/<slug-universe>/graph/` en FR, `/<slug-universe>/graph/` en EN). Leur layout réutilise les données de présentation du `mosaic.*.md` du même dossier (même `lang`) plutôt que de les dupliquer.
- Chaque fichier de `characters/<slug-character>.fr.md` / `.en.md` génère la page de fiche personnage (`/<slug-universe>/characters/<slug-character>/`) ; son layout affiche la Vue Mosaïque de son univers avec la modale de ce personnage ouverte au chargement (voir `character-sheet.md`).
- Un univers ou personnage non traduit dans une langue n'a tout simplement pas de fichier pour cette langue, donc pas de page générée à cette URL.

### Switcher Vue Mosaïque / Vue Graphe

Le switcher (voir `universe-home.md`, `graph-view.md`) est un lien entre deux pages statiques distinctes, pas une bascule en JavaScript sans rechargement : chaque clic est une navigation complète, cohérente avec le choix de deux pages séparées. La structure de page identique entre les deux vues (même en-tête, même présentation de l'univers) limite le changement visuel perçu au rechargement.

### Modale fiche personnage et synchronisation d'URL

Le portrait, le `character-name` et la `description` tronquée d'un personnage sont déjà présents sur la page Vue Mosaïque (tuile) et Vue Graphe (nœud) de son univers, pour leur propre affichage. Le clic sur une tuile ou un nœud (voir `universe-home.md`, `graph-view.md`) déclenche un `fetch()` de l'URL déjà générée de la fiche personnage (`/<slug-universe>/characters/<slug-character>/`), dont le contenu manquant (description complète, métadonnées, lien externe, liste des relations) est injecté dans la modale, sans navigation ni rechargement de page ; l'URL est mise à jour vers celle de cette page via l'API History du navigateur (`pushState`). La fermeture de la modale restaure l'URL de la vue sous-jacente via `pushState`, sans rechargement non plus.

L'accès direct à l'URL d'une fiche personnage (lien partagé, ou rechargement de la page) charge sa page générée, qui affiche directement la Vue Mosaïque avec la modale déjà ouverte.

### Contenu non traduit ("message d'indisponibilité")

Puisqu'une langue sans traduction ne génère pas de page, l'accès à une URL non traduite (univers ou personnage) déclenche le mécanisme de 404 natif de GitHub Pages. Un fichier `404.md` personnalisé, à la racine du site, sert de "message d'indisponibilité" (voir "Multilingue" dans `functional-specifications.md`) : il détecte la langue depuis le préfixe de l'URL demandée (`/fr/...` ou non) pour afficher le message dans la bonne langue, plutôt que la page 404 générique de GitHub Pages.

### Textes d'interface

Les textes d'interface (labels, messages dont le message d'indisponibilité, placeholder de recherche) sont centralisés dans `_data/ui.fr.yml` et `_data/ui.en.yml`. Ils sont distincts du contenu des univers et personnages, qui suit le format documenté dans `data-model.md`.

---

## Validation des données

Un script vérifie, avant publication, que le contenu de tous les univers respecte les contraintes de validation de `data-model.md`. Il ne modifie rien : il rapporte les problèmes trouvés et échoue s'il y a au moins une erreur.

- **Langage :** Ruby, déjà une dépendance du projet via Jekyll (pas de nouveau toolchain), et son parseur YAML natif (`require 'yaml'`, aucune gem supplémentaire).
- **Emplacement :** `scripts/validate.rb`, exclu du build Jekyll (voir "Configuration").
- **Invocation manuelle :** `ruby scripts/validate.rb`.
- **Invocation en CI :** un workflow GitHub Actions (`.github/workflows/validate.yml`), déclenché sur chaque push et pull request, exécute le script et fait échouer la CI en cas d'erreur. Il ne remplace ni ne modifie le déploiement GitHub Pages natif (voir "Hébergement et déploiement"), qui reste inchangé : cette CI ne sert qu'à la validation.
- **Sortie :** liste des problèmes trouvés (fichier concerné, règle, détail), classés en erreurs et avertissements. Code de sortie non nul s'il y a au moins une erreur ; les avertissements seuls ne le font pas échouer.

Règles vérifiées, dans l'ordre de "Contraintes et règles de validation" de `data-model.md`, plus une règle de format issue de ses "Conventions générales" :

- *Format d'un slug* (Conventions générales) : erreur si un `slug` (nom de dossier d'univers, de fichier personnage ou de type de relation) contient autre chose que des minuscules ASCII et des tirets.
- *Slug identique pour toutes les traductions d'une entité* et *slug de personnage unique au sein de son univers* : rien à vérifier, garanti par construction (le slug est le nom de fichier ; deux fichiers ne peuvent pas porter le même nom dans le même dossier).
- *Slug de type de relation unique globalement* : erreur si un même slug apparaît plus d'une fois entre `_data/relation-types.yml` et l'ensemble des `_data/<slug-universe>/additional-relation-types.yml`.
- *Relation référence deux personnages existants du même univers* : erreur si `source-character` ou `target-character` ne correspond à aucun fichier de `characters/` dans cet univers.
- *Personnage pas en relation avec lui-même* : erreur si `source-character` = `target-character`.
- *Type de relation existant* : erreur si le `type` d'une relation n'est ni dans `relation-types.yml` ni dans le `additional-relation-types.yml` de l'univers.
- *`reverse-label` cohérent avec `directed`* : erreur si absent alors que `directed: true`, ou présent alors que `directed: false`.
- *Pas de relation dupliquée* : erreur si deux entrées partagent le même triplet (source, cible, type) ; pour un type non dirigé, `(A, B)` et `(B, A)` comptent comme la même paire.
- *`lang` cohérent avec le nom de fichier* : erreur si `.fr.md` ne porte pas `lang: fr`, ou `.en.md` `lang: en`.
- *`mosaic`/`graph` présents ensemble par langue* : erreur si l'un existe sans l'autre, pour une langue donnée d'un univers.
- *Champs non localisés de `metadata` identiques entre langues* : limite connue, `metadata` étant libre (voir `data-model.md`), le script ne peut pas savoir quels champs sont censés être localisés. Toute clé dont la valeur diffère entre les fichiers `fr`/`en` d'un personnage est donc un **avertissement**, à confirmer manuellement plutôt qu'une erreur bloquante.

---

## Performance

- Images de couverture et portraits en lazy loading (voir `home.md`, `universe-home.md`) via l'attribut natif `loading="lazy"`, sans bibliothèque dédiée.
- D3.js chargé uniquement sur les pages Vue Graphe qui en ont besoin.
- JavaScript non bloquant (`defer` sur tous les scripts).
- Images optimisées (WebP si possible).
- `rel="preconnect"` sur Google Fonts, si une police externe est retenue dans `style-guide.md`.
- Pas de cookies, pas de tracking, pas d'analytics.

---

## Accessibilité

- **Navigateurs cibles :** dernières versions stables de Chrome, Firefox, Safari, Edge. Pas de support IE.
- Couples texte/fond conformes au contraste WCAG AA (4,5:1 pour le texte courant, 3:1 pour le grand texte et les éléments d'UI), y compris pour les couples de la palette de marque : c'est pour cette raison que `--sg-light-grey` est réservé aux bordures dans `style-guide.md`, son contraste sur blanc ne le permettant pas comme texte.
- Modale (fiche personnage) : focus piégé à l'intérieur pendant son ouverture, fermeture au clavier (touche Échap, voir `character-sheet.md`), attributs ARIA de dialogue (`role="dialog"`, `aria-modal`), portés nativement par le composant modale de Bootstrap.
- Texte alternatif sur les images (portraits, couvertures).
- HTML sémantique pour la structure des pages et des listes (mosaïques, listes de relations).
- Limite connue : le graphe interactif (SVG généré par D3.js) n'est pas nativement navigable au clavier ni par lecteur d'écran ; ce point reste à traiter spécifiquement si besoin, au-delà de cette version du site.

---

## SEO

- Rendu statique : chaque page existe indépendamment au moment du crawl, sans dépendre de JavaScript pour son contenu principal (à l'exception du graphe interactif lui-même et de la modale).
- Chaque univers et chaque personnage a sa propre URL indexable (voir "Structure des URLs").
- Liens `hreflang` / alternate entre les versions FR et EN d'une même page.
- `jekyll-seo-tag` (plugin supporté nativement par GitHub Pages) pour les balises meta et Open Graph de base.
- `jekyll-sitemap` (plugin supporté nativement par GitHub Pages) pour un `sitemap.xml` généré automatiquement, utile vu le nombre de pages générées (univers, personnages, deux langues).

---

## Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Slugs (univers, personnage, type de relation) | kebab-case anglais | `renaissance-artists`, `parent-of` |
| Fichiers | kebab-case | `graph.js`, `main.css` |
| Classes CSS custom | `.sg-` + kebab-case | `.sg-card`, `.sg-modal` |
| Variables JS | camelCase | `loadGraph()`, `characterModal` |
| Constantes JS | UPPER_SNAKE_CASE | `DEFAULT_LANG` |

---

## CSS : conventions

- Préfixe `.sg-` pour toutes les classes custom.
- Un seul fichier global `assets/css/main.css`.
- Variables CSS custom pour les valeurs de design (couleurs, typographie, espacements), définies dans `style-guide.md`.
- Pas de SASS, pas de LESS.

---

## JavaScript : conventions

- Vanilla JS ES6+, `defer` sur tous les scripts.
- `main.js` : sélecteur de langue (détection initiale, mémorisation via `localStorage`), utilitaires partagés.
- `graph.js` : rendu D3 du graphe interactif, chargé uniquement sur les pages Vue Graphe.
- `character-modal.js` : ouverture/fermeture de la modale fiche personnage, synchronisation d'URL.
- `search-filter.js` : recherche et filtres, chargé sur les pages Vue Mosaïque et Vue Graphe.
- Nommage :
  - Variables et fonctions : `camelCase`
  - Constantes : `UPPER_SNAKE_CASE`
  - Fichiers : `kebab-case`
