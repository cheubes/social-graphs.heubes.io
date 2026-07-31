# Modèle de données

## Entités

### Univers

Un univers regroupe un ensemble de personnages et les relations qui les lient. Il correspond à une URL dédiée du site (`/univers-x/`).

| Attribut | Localisé | Description |
|---|---|---|
| `slug` | Non | Identifiant unique, construit à partir du nom anglais, utilisé dans l'URL (ex : `renaissance-artists`) |
| `lang` | Non | Langue de ce document (`fr` ou `en`) ; permet d'associer les deux documents d'un même univers |
| `title` | Oui | Nom affiché de l'univers |
| `description` | Oui | Texte de présentation, affiché sur la tuile d'accueil et la page d'accueil de l'univers |
| `source-type` | Oui | Catégorie libre indicative (roman, série, période historique, autre) |
| `characters` | — | Liste des personnages de l'univers |
| `relations` | — | Liste des relations entre ces personnages |
| `additional-relation-types` | — | Extensions locales à la taxonomie commune (voir "Type de relation") |

L'image de couverture n'est pas un attribut : elle est associée à l'univers par convention de nommage (voir "Images").

### Personnage

| Attribut | Localisé | Description |
|---|---|---|
| `slug` | Non | Identifiant unique au sein de l'univers, construit à partir du nom anglais, utilisé dans l'URL de la fiche personnage (peut être réutilisé d'un univers à l'autre) |
| `lang` | Non | Langue de ce document (`fr` ou `en`) ; permet d'associer les deux documents d'un même personnage |
| `name` | Oui | Nom affiché |
| `description` | Oui | Texte biographique court, affiché sur la fiche personnage |
| `metadata` | Selon le champ | Champs libres optionnels selon l'univers (ex : dates de naissance/mort pour un personnage historique) |
| `external-link` | Oui | URL optionnelle, peut différer par langue (ex : page Wikipédia FR ou EN) |

Le portrait n'est pas un attribut : il est associé au personnage par convention de nommage (voir "Images").

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
| `label` | Oui | Libellé affiché quand le personnage décrit est la source de la relation |
| `reverse-label` | Oui | Libellé affiché quand le personnage décrit est la cible de la relation ; renseigné uniquement si `directed` est vrai |
| `directed` | Non | Indique si le lien est dirigé (source → cible) ou non dirigé (symétrique) |

Une relation n'est saisie qu'une fois, dans un seul sens (voir `Relation`). Pour un type dirigé, le sens retour (ex : "Enfant de" à partir de "Parent de") n'est pas une relation distincte : il est dérivé automatiquement du `reverse-label` du type au moment de l'affichage, quand le personnage décrit est la cible plutôt que la source. Pour un type non dirigé, le `label` est utilisé dans les deux sens et `reverse-label` n'est pas renseigné.

Un socle de types communs est partagé par tous les univers ; un univers peut déclarer des types additionnels propres à son contexte.

Exemples de types communs (liste à affiner, donnée ici à titre d'illustration) :

| Slug | Label (FR) | Label (EN) | Sens inverse (FR) | Sens inverse (EN) | Dirigé | Exemple |
|---|---|---|---|---|---|---|
| `parent-of` | Parent de | Parent of | Enfant de | Child of | Oui | Catherine de Médicis → Henri III |
| `married-to` | Marié à | Married to | — | — | Non | Henri III ↔ Louise de Lorraine |
| `friend-of` | Ami de | Friend of | — | — | Non | — |
| `rival-of` | Rival de | Rival of | — | — | Non | — |
| `superior-of` | Supérieur hiérarchique de | Superior of | Subalterne de | Subordinate of | Oui | — |
| `ally-of` | Allié de | Ally of | — | — | Non | — |

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

Un seul fichier image par entité, partagé par toutes ses langues (pas de déclinaison par locale).

### Organisation des fichiers

Le site est généré avec Jekyll (voir `technical-specifications.md`). Chaque univers a son propre dossier à la racine du site (`/<slug-universe>/`), qui regroupe l'ensemble de son contenu textuel et de ses images ; les données structurées (YAML) vivent à part, dans `_data/`.

- `/<slug-universe>/mosaic.fr.md`, `mosaic.en.md` : présentation de l'univers (Vue Mosaïque), un fichier par langue. Frontmatter : `lang`, `title`, `source-type`. Corps de texte : `description`.
- `/<slug-universe>/graph.fr.md`, `graph.en.md` : Vue Graphe, un fichier par langue. Réutilise les données de présentation du `mosaic.*.md` du même dossier plutôt que de les dupliquer.
- `/<slug-universe>/cover.jpg` : image de couverture (voir "Images").
- `/<slug-universe>/characters/` : un sous-dossier contenant, pour chaque personnage, `<slug-character>.fr.md`, `<slug-character>.en.md` (frontmatter : `lang`, `name`, `metadata`, `external-link` ; corps de texte : `description`) et son portrait `<slug-character>.jpg` (voir "Images"). Le sous-dossier lui-même associe chaque personnage à son univers ; aucun attribut ne porte cette référence.
- `_data/<slug-universe>/relations.yml` : l'ensemble des relations de l'univers ; le champ localisé (`description`) y est porté par des clés imbriquées par langue, plutôt que par des fichiers séparés.
- `_data/<slug-universe>/additional-relation-types.yml`, optionnel : les types de relations additionnels propres à l'univers, avec la même structure que la taxonomie commune (clés imbriquées par langue pour `label` et `reverse-label`, voir "Type de relation").
- `_data/relation-types.yml` : la taxonomie de base des types de relations, partagée par tous les univers.

### Exemples

**Structure de dossier** (extrait) :

```
french-renaissance-aristocracy/
  mosaic.en.md
  mosaic.fr.md
  graph.en.md
  graph.fr.md
  cover.jpg
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
```

**Univers** (`french-renaissance-aristocracy/mosaic.fr.md`) :

```yaml
---
lang: fr
title: "Les aristocrates français du vivant de Catherine de Médicis"
source-type: "période historique"
---

À la cour des Valois, alliances, rivalités et intrigues nouent les grandes familles du royaume de France sous le règne de Catherine de Médicis.
```

**Types de relations additionnels** (`_data/french-renaissance-aristocracy/additional-relation-types.yml`) :

```yaml
- slug: vassal-of
  label:
    fr: "Vassal de"
    en: "Vassal of"
  reverse-label:
    fr: "Suzerain de"
    en: "Overlord of"
  directed: true
```

**Personnage** (`french-renaissance-aristocracy/characters/catherine-de-medici.fr.md`) :

```yaml
---
lang: fr
name: "Catherine de Médicis"
metadata:
  birth: "1519"
  death: "1589"
external-link: "https://fr.wikipedia.org/wiki/Catherine_de_M%C3%A9dicis"
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
    fr: "Parent de"
    en: "Parent of"
  reverse-label:
    fr: "Enfant de"
    en: "Child of"
  directed: true
```

### Workflow d'ajout d'un univers

1. Choisir le `slug` de l'univers (construit à partir de son nom anglais) et créer son dossier `/<slug>/`.
2. Créer `mosaic.fr.md` et `mosaic.en.md`, puis `graph.fr.md` et `graph.en.md`.
3. Ajouter l'image de couverture (`cover.jpg`).
4. Déclarer, si besoin, les types de relations additionnels dans `_data/<slug>/additional-relation-types.yml`.
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
- Deux personnages ne peuvent pas être reliés deux fois par le même type de relation (mais peuvent l'être par plusieurs types différents, ex : "frère de" et "rival de"). Pour un type non dirigé, `(A, B, type)` et `(B, A, type)` comptent comme la même relation et ne peuvent pas coexister.
- Les champs non localisés de `metadata` doivent avoir la même valeur dans tous les fichiers de langue d'un personnage ; ses champs explicitement localisés peuvent différer.
- L'attribut `lang` d'un fichier d'univers ou de personnage doit correspondre au suffixe de langue de son nom de fichier (`.fr.md` → `fr`, `.en.md` → `en`).
- Pour une langue donnée, `mosaic.<lang>.md` et `graph.<lang>.md` existent ensemble ou pas du tout : un univers ne peut pas être disponible, dans une langue, sur une seule de ses deux vues.
