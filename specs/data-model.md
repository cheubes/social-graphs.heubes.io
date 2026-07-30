# Modèle de données

## Entités

### Univers

Un univers regroupe un ensemble de personnages et les relations qui les lient. Il correspond à un sous-dossier du site (`/univers-x/`).

| Attribut | Localisé | Description |
|---|---|---|
| `slug` | Non | Identifiant unique, construit à partir du nom anglais, utilisé comme nom de dossier et dans l'URL (ex : `renaissance-artists`) |
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
- Les slugs (identifiants d'univers, de personnage, de type de relation) sont construits à partir du nom anglais de l'entité.
- Un slug est en minuscules ASCII, sans accents ni espaces, mots séparés par des tirets (ex : `renaissance-artists`, pas `Renaissance_Artists` ni `renaissance artists`).
- Le site est multilingue (français et anglais pour commencer). Le `slug` d'une entité est partagé entre les langues : seule sa traduction varie, pas son URL.

### Images

Les images ne sont pas portées par des attributs : elles sont associées à leur entité par convention de nommage plutôt que référencées dans un frontmatter.

- Image de couverture d'un univers : `cover.jpg`, à la racine du dossier de l'univers.
- Portrait d'un personnage : `characters/<slug>.jpg`, `<slug>` étant celui du personnage.

Un seul fichier image par entité, partagé par toutes ses langues (pas de déclinaison par locale).

### Structure par univers

Chaque univers correspond à un sous-dossier du site (`/univers-x/`), contenant :

- Un fichier markdown par langue décrivant l'univers (ex : `index.en.md`, `index.fr.md`) : les attributs localisés (`title`, `description`, `source-type`) propres à chaque fichier.
- Une image de couverture (voir "Images").
- Un fichier YAML optionnel, `additional-relation-types.yaml`, déclarant les types de relations additionnels de l'univers, avec la même structure que la taxonomie commune (clés imbriquées par langue pour `label` et `reverse-label`, voir "Type de relation").
- Un sous-dossier `characters/`, contenant pour chaque personnage : un fichier markdown par langue (ex : `characters/jane-doe.en.md`, `characters/jane-doe.fr.md`, le nom de fichier hors suffixe de langue faisant office de `slug`) avec les attributs localisés (`name`, `description`, `external-link`) propres à chaque fichier et l'attribut `metadata` (champs non localisés identiques dans chaque fichier, champs localisés propres à chaque fichier), ainsi que son portrait (voir "Images").
- Un fichier YAML listant l'ensemble des relations de l'univers (`relations.yaml`) : le champ localisé (`description`) est porté par des clés imbriquées par langue au sein du même fichier, plutôt que par des fichiers séparés.

Un fichier partagé, `/relation-types.yaml` à la racine du site, porte la taxonomie de base des types de relations (le `label` de chaque type étant porté par des clés imbriquées par langue) ; les types additionnels propres à un univers sont déclarés de la même façon dans son propre `additional-relation-types.yaml`.

### Exemples

**Structure de dossier** :

```
/french-renaissance-aristocracy/
  index.en.md
  index.fr.md
  cover.jpg
  relations.yaml
  additional-relation-types.yaml
  characters/
    catherine-de-medici.en.md
    catherine-de-medici.fr.md
    catherine-de-medici.jpg
    henri-iii.en.md
    henri-iii.fr.md
    henri-iii.jpg
```

**Univers** (`/french-renaissance-aristocracy/index.fr.md`) :

```yaml
---
title: "Les aristocrates français du vivant de Catherine de Médicis"
source-type: "période historique"
---

À la cour des Valois, alliances, rivalités et intrigues nouent les grandes familles du royaume de France sous le règne de Catherine de Médicis.
```

**Types de relations additionnels** (`/french-renaissance-aristocracy/additional-relation-types.yaml`) :

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

**Personnage** (`/french-renaissance-aristocracy/characters/catherine-de-medici.fr.md`) :

```yaml
---
name: "Catherine de Médicis"
metadata:
  birth: "1519"
  death: "1589"
external-link: "https://fr.wikipedia.org/wiki/Catherine_de_M%C3%A9dicis"
---

Reine de France par son mariage avec Henri II, elle exerce une influence considérable sur la politique du royaume comme régente puis reine mère.
```

**Relations** (`/french-renaissance-aristocracy/relations.yaml`) :

```yaml
relations:
  - source-character: catherine-de-medici
    target-character: henri-iii
    type: parent-of
    description:
      fr: "Catherine de Médicis est la mère d'Henri III."
      en: "Catherine de Médicis is Henri III's mother."
```

**Taxonomie des types de relation** (`/relation-types.yaml`, fichier partagé) :

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

1. Créer le dossier de l'univers, nommé d'après son `slug` (construit à partir du nom anglais de l'univers).
2. Créer le fichier markdown décrivant l'univers pour chaque langue.
3. Déclarer, si besoin, les types de relations additionnels de l'univers dans `additional-relation-types.yaml`.
4. Créer, dans le dossier `characters/`, un fichier markdown par personnage et par langue, nommé d'après le `slug` du personnage (construit à partir de son nom anglais).
5. Lister les relations dans le fichier YAML, avec leurs descriptions localisées, en réutilisant les types communs ou les types additionnels déclarés.
6. Valider les données (voir les contraintes du modèle de données).
7. Publier.

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
