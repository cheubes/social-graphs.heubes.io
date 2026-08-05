# Modèle de données

## Entités

### Univers

Un univers regroupe un ensemble de personnages et les relations qui les lient. Il correspond à une URL dédiée du site (`/univers-x/`).

| Attribut | Localisé | Description |
|---|---|---|
| `slug` | Non | Identifiant unique, construit à partir du nom anglais, utilisé dans l'URL (ex : `renaissance-artists`) |
| `lang` | Non | Langue de ce document (`fr` ou `en`) ; permet d'associer les deux documents d'un même univers |
| `title` | Oui | Nom affiché de l'univers |
| `description` | Oui | Texte de présentation, affiché sur la tuile d'accueil (voir `home.md`) ; non affiché sur les pages de l'univers lui-même (voir `universe-home.md`) |
| `source-type` | Oui | Catégorie libre indicative (roman, série, période historique, autre) |
| `characters` | — | Liste des personnages de l'univers |
| `relations` | — | Liste des relations entre ces personnages |
| `additional-relation-types` | — | Extensions locales à la taxonomie commune (voir "Type de relation") |
| `groups` | — | Liste des groupes de personnages de l'univers, facultatif (voir "Groupe") |

L'image de couverture n'est pas un attribut : elle est associée à l'univers par convention de nommage (voir "Images").

### Personnage

| Attribut | Localisé | Description |
|---|---|---|
| `slug` | Non | Identifiant unique au sein de l'univers, construit à partir du nom anglais, utilisé dans l'URL de la fiche personnage (peut être réutilisé d'un univers à l'autre) |
| `lang` | Non | Langue de ce document (`fr` ou `en`) ; permet d'associer les deux documents d'un même personnage |
| `character-name` | Oui | Nom affiché. Nommé `character-name` plutôt que `name` : ce dernier est un attribut réservé de la classe `Page` de Jekyll (au même titre que `content`, `dir`, `excerpt`, `path`, `url`), toujours réécrit par Jekyll avant l'accès en template, ce qui rend un attribut de front matter du même nom illisible depuis Liquid (vérifié empiriquement) |
| `gender` | Non | Genre grammatical du personnage : `masculine` ou `feminine`. Utilisé pour accorder les libellés de relation à l'affichage (voir "Type de relation"). Optionnel : en son absence, les libellés retombent sur leur forme `masculine` |
| `group` | Non | slug optionnel du groupe d'appartenance du personnage au sein de l'univers (voir "Groupe" ci-dessous) ; facultatif, un personnage n'appartient qu'à un seul groupe au plus |
| `description` | Oui | Texte biographique court, affiché sur la fiche personnage |
| `metadata` | Selon le champ | Champs libres optionnels selon l'univers (ex : dates de naissance/mort pour un personnage historique). Chaque clé utilisée doit être déclarée dans la taxonomie des clés de metadata (voir "Clé de metadata"), qui porte son libellé affiché |
| `external-link` | Oui | URL optionnelle, peut différer par langue (ex : page Wikipédia FR ou EN) |
| `portrait-source` | Oui | URL optionnelle vers la source du portrait (ex : page Wikipédia de l'image), peut différer par langue. Distinct d'`external-link` : la source du portrait n'est pas nécessairement la même page que le lien externe du personnage |

Le portrait (l'image) n'est pas un attribut : il est associé au personnage par convention de nommage (voir "Images"). Sa source, si renseignée, est portée par l'attribut `portrait-source`.

### Groupe

Un regroupement de personnages au sein d'un univers : faction, groupe politique, nationalité, espèce, etc. Contrairement aux types de relation ou aux clés de metadata, il n'existe pas de socle commun de groupes partagé entre univers : chaque univers déclare les siens, propres à son contexte.

| Attribut | Localisé | Description |
|---|---|---|
| `slug` | Non | Identifiant stable du groupe, construit à partir de son nom anglais, référencé depuis l'attribut `group` d'un personnage ; unique au sein de l'univers |
| `name` | Oui | Nom affiché du groupe |
| `color` | Non | Couleur associée au groupe, valeur hexadécimale libre choisie à l'ajout du contenu ; comme les images, elle n'appartient pas à la charte graphique et n'est soumise à aucune palette imposée (voir "Couleur de groupe" dans `style-guide.md`) |

Le logo du groupe n'est pas un attribut : comme les autres images de contenu, il est associé au groupe par convention de nommage (voir "Images").

### Relation

Un lien entre deux personnages d'un même univers.

| Attribut | Localisé | Description |
|---|---|---|
| `source-character` | Non | slug du personnage d'origine |
| `target-character` | Non | slug du personnage lié |
| `type` | Non | Référence au `slug` d'un type de relation (voir ci-dessous) |
| `description` | Oui | Texte optionnel précisant le contexte du lien (ex : "se sont rencontrés lors du siège de ...") |

Le caractère dirigé ou non de la relation n'est pas porté par la relation elle-même mais par son type.

### Type de relation

| Attribut | Localisé | Description |
|---|---|---|
| `slug` | Non | Identifiant stable du type de relation, construit à partir de son nom anglais, référencé depuis l'attribut `type` d'une relation |
| `label` | Oui | Libellé affiché quand le personnage décrit est la source de la relation, décliné en deux formes grammaticales par langue, `masculine` et `feminine` (voir "Accord de genre" ci-dessous) |
| `reverse-label` | Oui | Libellé affiché quand le personnage décrit est la cible de la relation, décliné de la même façon ; renseigné uniquement si `directed` est vrai |
| `directed` | Non | Indique si le lien est dirigé (source → cible) ou non dirigé (symétrique) |

Une relation n'est saisie qu'une fois, dans un seul sens (voir `Relation`). Pour un type dirigé, le sens retour (ex : "Fille de" à partir de "Père de"/"Mère de") n'est pas une relation distincte : il est dérivé automatiquement du `reverse-label` du type au moment de l'affichage, quand le personnage décrit est la cible plutôt que la source. Pour un type non dirigé, le `label` est utilisé dans les deux sens et `reverse-label` n'est pas renseigné.

**Accord de genre.** Le libellé affiché sur la fiche d'un personnage (`label` s'il est la source, `reverse-label` s'il est la cible, ou `label` pour un type non dirigé) est accordé au genre de ce personnage, celui dont on décrit la fiche, jamais à celui de l'autre personnage de la relation. Ainsi, à la fiche d'Henri III, la relation avec Catherine de Médicis affiche "Fils de" (accordé au genre d'Henri III, la cible) et non une forme accordée à Catherine. Si le personnage décrit n'a pas de `gender` renseigné, la forme `masculine` est utilisée par défaut. Dans un contexte qui n'est rattaché à aucun personnage particulier (légende de la Vue Graphe, filtres, voir `graph-view.md` et `search-filter.md`), c'est également la forme `masculine` qui sert de forme générique.

Un socle de types communs est partagé par tous les univers ; un univers peut déclarer des types additionnels propres à son contexte.

Exemples de types communs (liste à affiner, donnée ici à titre d'illustration) :

| Slug | Label FR (masc. / fém.) | Label EN (masc. / fém.) | Sens inverse FR (masc. / fém.) | Sens inverse EN (masc. / fém.) | Dirigé | Exemple |
|---|---|---|---|---|---|---|
| `parent-of` | Père de / Mère de | Father of / Mother of | Fils de / Fille de | Son of / Daughter of | Oui | Catherine de Médicis → Henri III |
| `married-to` | Marié à / Mariée à | Married to | — | — | Non | Henri III ↔ Louise de Lorraine |
| `friend-of` | Ami de / Amie de | Friend of | — | — | Non | — |
| `rival-of` | Rival de / Rivale de | Rival of | — | — | Non | — |
| `superior-of` | Supérieur hiérarchique de / Supérieure hiérarchique de | Superior of | Subalterne de / Subalterne de | Subordinate of | Oui | — |
| `ally-of` | Allié de / Alliée de | Ally of | — | — | Non | — |

En anglais, les deux formes sont le plus souvent identiques ; elles sont néanmoins répétées telles quelles dans le fichier de données (voir "Formats et conventions des fichiers de données" ci-dessous), la structure `masculine`/`feminine` par langue étant systématique.

### Clé de metadata

| Attribut | Localisé | Description |
|---|---|---|
| `slug` | Non | Identifiant stable de la clé, référencé depuis les clés de l'attribut `metadata` d'un personnage |
| `label` | Oui | Libellé affiché en regard de la valeur, sur la fiche personnage |

Un socle de clés communes est partagé par tous les univers ; un univers peut déclarer des clés additionnelles propres à son contexte. Contrairement au `label` d'un type de relation, celui d'une clé de metadata n'est pas décliné par genre : ce sont des noms de champs (ex : "Naissance"), qui ne s'accordent pas au genre du personnage.

Exemples de clés communes (liste à affiner, donnée ici à titre d'illustration) :

| Slug | Label (FR) | Label (EN) |
|---|---|---|
| `birth` | Naissance | Born |
| `death` | Décès | Died |

## Formats et conventions des fichiers de données

### Conventions générales

- Les noms d'attributs (clés de frontmatter et de fichiers YAML) sont en anglais.
- Les clés utilisent des tirets (`-`) plutôt que des underscores (`_`) : kebab-case.
- Les fichiers YAML utilisent l'extension `.yml`.
- Les slugs (identifiants d'univers, de personnage, de type de relation) sont construits à partir du nom anglais de l'entité.
- Un slug est en minuscules ASCII, sans accents ni espaces, mots séparés par des tirets (ex : `renaissance-artists`, pas `Renaissance_Artists` ni `renaissance artists`).
- Le site est multilingue (français et anglais pour commencer). Le `slug` d'une entité est partagé entre les langues : seule sa traduction varie, pas son URL.

### Images

Les images ne sont pas portées par des attributs : elles sont associées à leur entité par convention de nommage et d'emplacement, aux côtés des fichiers de contenu, plutôt que référencées dans un frontmatter.

- Image de couverture d'un univers : `<slug-universe>/cover.jpg`.
- Portrait d'un personnage : `<slug-universe>/characters/<slug-character>.jpg`.
- Logo d'un groupe : `<slug-universe>/groups/<slug-group>.png`. Format PNG plutôt que `.jpg` comme les autres images de contenu, pour conserver la transparence : le logo est superposé à d'autres éléments (vignette, nœud du graphe, modale) plutôt qu'affiché seul (voir les écrans concernés et `style-guide.md`).

Un seul fichier image par entité, partagé par toutes ses langues (pas de déclinaison par locale). Format, dimensions et ratios recommandés : voir "Images" dans `style-guide.md`.

### Organisation des fichiers

Le site est généré avec Jekyll (voir `technical-specifications.md`). Chaque univers a son propre dossier à la racine du site (`/<slug-universe>/`), qui regroupe l'ensemble de son contenu textuel et de ses images ; les données structurées (YAML) vivent à part, dans `_data/`.

- `/<slug-universe>/mosaic.fr.md`, `mosaic.en.md` : présentation de l'univers (Vue Mosaïque), un fichier par langue. Frontmatter : `lang`, `title`, `source-type`. Corps de texte : `description`.
- `/<slug-universe>/graph.fr.md`, `graph.en.md` : Vue Graphe, un fichier par langue. Réutilise les données de présentation du `mosaic.*.md` du même dossier plutôt que de les dupliquer.
- `/<slug-universe>/cover.jpg` : image de couverture (voir "Images").
- `/<slug-universe>/groups/`, optionnel : un sous-dossier contenant le logo de chaque groupe déclaré par l'univers (`<slug-group>.png`, voir "Images").
- `/<slug-universe>/characters/` : un sous-dossier contenant, pour chaque personnage, `<slug-character>.fr.md`, `<slug-character>.en.md` (frontmatter : `lang`, `character-name`, `gender`, `group`, `metadata`, `external-link`, `portrait-source` ; corps de texte : `description`) et son portrait `<slug-character>.jpg` (voir "Images"). Le sous-dossier lui-même associe chaque personnage à son univers ; aucun attribut ne porte cette référence.
- `_data/<slug-universe>/relations.yml` : l'ensemble des relations de l'univers ; le champ localisé (`description`) y est porté par des clés imbriquées par langue, plutôt que par des fichiers séparés.
- `_data/<slug-universe>/additional-relation-types.yml`, optionnel : les types de relations additionnels propres à l'univers, avec la même structure que la taxonomie commune (clés imbriquées par langue puis par genre grammatical pour `label` et `reverse-label`, voir "Type de relation").
- `_data/relation-types.yml` : la taxonomie de base des types de relations, partagée par tous les univers.
- `_data/<slug-universe>/additional-metadata-keys.yml`, optionnel : les clés de metadata additionnelles propres à l'univers, avec la même structure que la taxonomie commune (clés imbriquées par langue pour `label`, voir "Clé de metadata").
- `_data/metadata-keys.yml` : la taxonomie de base des clés de metadata, partagée par tous les univers.
- `_data/<slug-universe>/groups.yml`, optionnel : les groupes de personnages propres à l'univers, avec leur `name` localisé (clés imbriquées par langue) et leur `color` (voir "Groupe"). Contrairement aux types de relation et aux clés de metadata, il n'existe pas de fichier de taxonomie commune : les groupes sont toujours propres à un univers.

### Exemples

**Structure de dossier** (extrait) :

```
french-renaissance-aristocracy/
  mosaic.en.md
  mosaic.fr.md
  graph.en.md
  graph.fr.md
  cover.jpg
  groups/
    house-of-valois.png
  characters/
    catherine-de-medici.en.md
    catherine-de-medici.fr.md
    catherine-de-medici.jpg
    henri-iii.en.md
    henri-iii.fr.md
    henri-iii.jpg
_data/
  relation-types.yml
  french-renaissance-aristocracy/
    relations.yml
    additional-relation-types.yml
    groups.yml
```

**Univers** (`french-renaissance-aristocracy/mosaic.fr.md`) :

```yaml
---
lang: fr
title: "Les aristocrates français à l'époque de Catherine de Médicis"
source-type: "période historique"
---

À la cour des Valois, alliances, rivalités et intrigues nouent les grandes familles du royaume de France.
```

**Types de relations additionnels** (`_data/french-renaissance-aristocracy/additional-relation-types.yml`) :

```yaml
- slug: vassal-of
  label:
    fr:
      masculine: "Vassal de"
      feminine: "Vassale de"
    en:
      masculine: "Vassal of"
      feminine: "Vassal of"
  reverse-label:
    fr:
      masculine: "Suzerain de"
      feminine: "Suzeraine de"
    en:
      masculine: "Overlord of"
      feminine: "Overlord of"
  directed: true
```

**Groupes** (`_data/french-renaissance-aristocracy/groups.yml`) :

```yaml
- slug: house-of-valois
  name:
    fr: "Maison de Valois"
    en: "House of Valois"
  color: "#7a1f2b"
```

Le logo de ce groupe est son image associée par convention de nommage : `french-renaissance-aristocracy/groups/house-of-valois.png`.

**Personnage** (`french-renaissance-aristocracy/characters/catherine-de-medici.fr.md`) :

```yaml
---
lang: fr
character-name: "Catherine de Médicis"
gender: feminine
group: house-of-valois
metadata:
  birth: "1519"
  death: "1589"
external-link: "https://fr.wikipedia.org/wiki/Catherine_de_M%C3%A9dicis"
portrait-source: "https://fr.wikipedia.org/wiki/Catherine_de_M%C3%A9dicis"
---

Reine de France par son mariage avec Henri II, elle exerce une influence considérable sur la politique du royaume comme régente puis reine mère.
```

**Relations** (`_data/french-renaissance-aristocracy/relations.yml`) :

```yaml
relations:
  - source-character: catherine-de-medici
    target-character: henri-iii
    type: parent-of
    description:
      fr: "Catherine de Médicis est la mère d'Henri III."
      en: "Catherine de Médicis is Henri III's mother."
```

**Taxonomie des types de relation** (`_data/relation-types.yml`) :

```yaml
- slug: parent-of
  label:
    fr:
      masculine: "Père de"
      feminine: "Mère de"
    en:
      masculine: "Father of"
      feminine: "Mother of"
  reverse-label:
    fr:
      masculine: "Fils de"
      feminine: "Fille de"
    en:
      masculine: "Son of"
      feminine: "Daughter of"
  directed: true
```

**Taxonomie des clés de metadata** (`_data/metadata-keys.yml`) :

```yaml
- slug: birth
  label:
    fr: "Naissance"
    en: "Born"
```

### Workflow d'ajout d'un univers

1. Choisir le `slug` de l'univers (construit à partir de son nom anglais) et créer son dossier `/<slug>/`.
2. Créer `mosaic.fr.md` et `mosaic.en.md`, puis `graph.fr.md` et `graph.en.md`.
3. Ajouter l'image de couverture (`cover.jpg`).
4. Déclarer, si besoin, les types de relations et les clés de metadata additionnels (`_data/<slug>/additional-relation-types.yml`, `_data/<slug>/additional-metadata-keys.yml`), ainsi que les groupes de l'univers (`_data/<slug>/groups.yml` et leurs logos dans `<slug>/groups/`).
5. Créer, dans `characters/`, les fichiers de chaque personnage (markdown et portrait) pour chaque langue.
6. Lister les relations dans `_data/<slug>/relations.yml`, avec leurs descriptions localisées, en réutilisant les types communs ou les types additionnels déclarés.
7. Valider les données (voir les contraintes du modèle de données).
8. Publier.

## Contraintes et règles de validation

- Le `slug` d'une entité (univers, personnage, type de relation) est identique pour toutes ses traductions.
- Un `slug` de personnage est unique au sein de son univers (il peut être réutilisé d'un univers à l'autre).
- Un `slug` de type de relation est unique globalement : un univers ne peut pas déclarer un type additionnel dont le slug existe déjà dans la taxonomie commune ou dans les extensions d'un autre univers.
- Une relation référence deux personnages existants du même univers (pas de relation inter-univers).
- Un personnage ne peut pas être en relation avec lui-même.
- Le `type` d'une relation doit exister dans la taxonomie commune ou dans les extensions déclarées par l'univers.
- Un type de relation dirigé (`directed: true`) doit définir un `reverse-label` ; un type non dirigé n'en définit pas.
- Un `label` et un `reverse-label`, quand ils sont renseignés, déclinent les deux formes `masculine` et `feminine` pour chaque langue du site, même quand les deux formes sont identiques (voir "Accord de genre" dans "Type de relation").
- Deux personnages ne peuvent pas être reliés deux fois par le même type de relation (mais peuvent l'être par plusieurs types différents, ex : "ami de" et "rival de"). Pour un type non dirigé, `(A, B, type)` et `(B, A, type)` comptent comme la même relation et ne peuvent pas coexister.
- Les champs non localisés de `metadata` doivent avoir la même valeur dans tous les fichiers de langue d'un personnage ; ses champs explicitement localisés peuvent différer.
- Un slug de clé de metadata est unique globalement : un univers ne peut pas déclarer une clé additionnelle dont le slug existe déjà dans la taxonomie commune ou dans les extensions d'un autre univers.
- Chaque clé de l'attribut `metadata` d'un personnage doit exister dans la taxonomie commune des clés de metadata ou dans les extensions déclarées par l'univers.
- L'attribut `gender` d'un personnage, quand il est renseigné, vaut `masculine` ou `feminine`, et a la même valeur dans tous ses fichiers de langue.
- L'attribut `lang` d'un fichier d'univers ou de personnage doit correspondre au suffixe de langue de son nom de fichier (`.fr.md` → `fr`, `.en.md` → `en`).
- Pour une langue donnée, `mosaic.<lang>.md` et `graph.<lang>.md` existent ensemble ou pas du tout : un univers ne peut pas être disponible, dans une langue, sur une seule de ses deux vues.
- Un `slug` de groupe est unique au sein de son univers (deux univers différents peuvent réutiliser le même slug de groupe, à la différence des types de relation et des clés de metadata).
- L'attribut `group` d'un personnage, quand il est renseigné, doit référencer un groupe existant dans `groups.yml` de son univers.
- Le `name` d'un groupe définit une valeur pour chaque langue déclarée par l'univers.
