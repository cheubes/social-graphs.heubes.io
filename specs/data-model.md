# Data model

## Entities

### Universe

A universe groups a set of characters and the relations that link them. It maps to a dedicated URL on the site (`/universe-x/`).

| Attribute | Localized | Description |
|---|---|---|
| `slug` | No | Unique identifier, built from the English name, used in the URL (e.g. `renaissance-artists`) |
| `lang` | No | Language of this document (`fr` or `en`); used to pair the two documents of the same universe |
| `title` | Yes | Displayed name of the universe |
| `description` | Yes | Introduction text, displayed on the home card (see `home.md`); not displayed on the universe's own pages (see `universe-home.md`) |
| `source-type` | No | slug referencing a source type (see "Source type" below), used to group universes on the site home (see `home.md`). Does not vary from one language to another: like `gender`, `group` and `portrait-source` for a character, it is not carried by the frontmatter of `mosaic.fr.md`/`mosaic.en.md` but by `_data/<slug-universe>/universe.yml` (see "File organization") |
| `cover-source` | No | Either an optional URL to the source of the cover image (e.g. the image's Wikipedia page), or the special value `ai-generated` when the cover is AI-generated for lack of a real source to credit; displayed as a credit on the home card (see `home.md`). Distinct from `source-type` despite the similar name: one is the universe's category, the other the source of its image. Like `source-type`, does not vary from one language to another: carried by `_data/<slug-universe>/universe.yml`, not by the frontmatter. Also distinct from `image-credits.yml` (see "Images" and "File organization"), which carries the structured credit details rather than a simple link to the source |
| `characters` | - | List of the universe's characters |
| `relations` | - | List of the relations between these characters |
| `additional-relation-types` | - | Local extensions to the common taxonomy (see "Relation type") |
| `groups` | - | List of the universe's character groups, optional (see "Group") |

The cover image is not an attribute: it is associated with the universe by naming convention (see "Images"). Its source, if provided, is carried by the `cover-source` attribute.

### Source type

Indicative category of a universe (history, art history, fiction, other), used to group universes on the site home (see `home.md`). Unlike the Group, a common base is shared by all universes, with no local extension: the number of categories is deliberately kept small.

| Attribute | Localized | Description |
|---|---|---|
| `slug` | No | Stable identifier, referenced from a universe's `source-type` attribute |
| `label` | Yes | Displayed label, notably as a section title on the site home (see `home.md`) |

Carried by `_data/source-types.yml` (see "File organization"). The declaration order in this file determines the order of the sections on the site home (see `home.md`), not an alphabetical sort.

### Character

| Attribute | Localized | Description |
|---|---|---|
| `slug` | No | Unique identifier within the universe, built from the English name, used in the character sheet URL (can be reused from one universe to another) |
| `lang` | No | Language of this document (`fr` or `en`); used to pair the two documents of the same character |
| `character-name` | Yes | Displayed name. Named `character-name` rather than `name`: the latter is a reserved attribute of Jekyll's `Page` class (like `content`, `dir`, `excerpt`, `path`, `url`), always rewritten by Jekyll before template access, which makes a front matter attribute of the same name unreadable from Liquid (verified empirically) |
| `gender` | No | Grammatical gender of the character: `masculine` or `feminine`. Used to agree relation labels at display time (see "Relation type"). Optional: when absent, labels fall back to their `masculine` form. Carried by `_data/<slug-universe>/characters.yml`, not by the front matter (see "File organization") |
| `group` | No | Optional slug of the group the character belongs to within the universe (see "Group" below); optional, a character belongs to at most one group. Carried by `_data/<slug-universe>/characters.yml` |
| `description` | Yes | Biographical text displayed on the character sheet, structured in several paragraphs (background and origins, path and role in the universe, legacy or end of life) rather than a simple one- or two-sentence summary; on the Mosaic view card, where space is limited, it is truncated at a word boundary (see "Cards" in `style-guide.md`) |
| `metadata` | Depends on the field | Optional free fields depending on the universe (e.g. birth/death dates for a historical character). Each key used must be declared in the metadata key taxonomy (see "Metadata key"), which carries its displayed label and states whether the key is localized. The value of a non-localized key (the default case) is carried by `_data/<slug-universe>/characters.yml`; the value of an explicitly localized key stays in the character's front matter |
| `external-link` | Yes | Optional URL, can differ by language (e.g. French or English Wikipedia page) |
| `portrait-source` | No | Either an optional URL to the source of the portrait (e.g. the image's Wikipedia page), or the special value `ai-generated` when the portrait is AI-generated for lack of a real source to credit (see "Modal (character sheet)" in `style-guide.md`). Since the portrait is a single file shared by all languages (see "Images"), its source does not vary either: single value, carried by `_data/<slug-universe>/characters.yml`. Distinct from `external-link`: the portrait's source is not necessarily the same page as the character's external link. Also distinct from `image-credits.yml` (see "Images" and "File organization"), which carries the structured credit details rather than a simple link to the source |

The portrait (the image) is not an attribute: it is associated with the character by naming convention (see "Images"). Its source, if provided, is carried by the `portrait-source` attribute.

The `gender`, `group`, `portrait-source` attributes and the non-localized `metadata` keys do not vary from one language to another for the same character: rather than being repeated identically in `.fr.md` and `.en.md`, they are carried once by `_data/<slug-universe>/characters.yml` (see "File organization"). A character's front matter therefore only carries its truly localized attributes (`character-name`, `external-link`) and, where applicable, its explicitly localized metadata keys.

### Group

A grouping of characters within a universe: faction, political group, nationality, species, etc. Unlike relation types or metadata keys, there is no common base of groups shared between universes: each universe declares its own, specific to its context.

| Attribute | Localized | Description |
|---|---|---|
| `slug` | No | Stable identifier of the group, built from its English name, referenced from a character's `group` attribute; unique within the universe |
| `name` | Yes | Displayed name of the group |
| `color` | No | Color associated with the group, free hexadecimal value chosen when adding the content; like images, it is not part of the style guide and is not subject to any imposed palette (see "Group color" in `style-guide.md`) |

The group logo is not an attribute: like other content images, it is associated with the group by naming convention (see "Images").

### Relation

A link between two characters of the same universe.

| Attribute | Localized | Description |
|---|---|---|
| `source-character` | No | slug of the origin character |
| `target-character` | No | slug of the linked character |
| `type` | No | Reference to the `slug` of a relation type (see below) |
| `description` | Yes | Optional text giving the context of the link (e.g. "met during the siege of ...") |

Whether the relation is directed or not is not carried by the relation itself but by its type.

### Relation type

| Attribute | Localized | Description |
|---|---|---|
| `slug` | No | Stable identifier of the relation type, built from its English name, referenced from a relation's `type` attribute |
| `label` | Yes | Label displayed when the described character is the source of the relation, declined in three forms per language: `masculine` and `feminine`, agreed with the character's gender (see "Gender agreement" below), and `neutral`, used outside of a character context |
| `reverse-label` | Yes | Label displayed when the described character is the target of the relation, declined in two forms per language, `masculine` and `feminine`; provided only if `directed` is true |
| `directed` | No | Whether the link is directed (source → target) or undirected (symmetric) |

A relation is entered only once, in a single direction (see `Relation`). For a directed type, the reverse direction (e.g. "Daughter of" from "Father of"/"Mother of") is not a separate relation: it is automatically derived from the type's `reverse-label` at display time, when the described character is the target rather than the source. For an undirected type, the `label` is used in both directions and `reverse-label` is not provided.

**Gender agreement.** The label displayed on a character's sheet (`label` if they are the source, `reverse-label` if they are the target, or `label` for an undirected type) agrees with the gender of that character, the one whose sheet is being described, never with that of the other character in the relation. So, on Henri III's sheet, the relation with Catherine de' Medici displays "Son of" ("Fils de" in French; agreed with the gender of Henri III, the target) and not a form agreed with Catherine. If the described character has no `gender` provided, the `masculine` form is used by default. In a context not tied to any particular character (Graph view legend, filters, see `graph-view.md` and `search-filter.md`), the `neutral` form of the `label` is used. This neutral form only exists for `label`: `reverse-label` never appears outside of a character context, and therefore does not need to define one.

A base of common types is shared by all universes; a universe can declare additional types specific to its context.

Examples of common types (list to be refined, given here for illustration):

| Slug | FR label (masc. / fem. / neutral) | EN label (masc. / fem. / neutral) | FR reverse (masc. / fem.) | EN reverse (masc. / fem.) | Directed | Example |
|---|---|---|---|---|---|---|
| `parent-of` | Père de / Mère de / Parent de | Father of / Mother of / Parent of | Fils de / Fille de | Son of / Daughter of | Yes | Catherine de' Medici → Henri III |
| `married-to` | Marié à / Mariée à / Marié•e à | Married to | - | - | No | Henri III ↔ Louise of Lorraine |
| `friend-of` | Ami de / Amie de / Ami•e de | Friend of | - | - | No | - |
| `rival-of` | Rival de / Rivale de / Rival•e de | Rival of | - | - | No | - |
| `ally-of` | Allié de / Alliée de / Allié•e de | Ally of | - | - | No | - |

In English, the `masculine` and `feminine` forms are most often identical, and `neutral` then takes the same value; they are nonetheless all repeated as is in the data file (see "Data file formats and conventions" below), the per-language structure being systematic.

### Metadata key

| Attribute | Localized | Description |
|---|---|---|
| `slug` | No | Stable identifier of the key, referenced from the keys of a character's `metadata` attribute |
| `label` | Yes | Label displayed next to the value, on the character sheet |
| `localized` | No | Whether the value of this key, for a given character, can differ from one language to another. `false` by default (attribute omitted): the value is then single, carried by `_data/<slug-universe>/characters.yml` (see "File organization"). When `true`, it is carried by the front matter of each of the character's language files, like its other localized attributes |

A base of common keys is shared by all universes; a universe can declare additional keys specific to its context. Unlike a relation type's `label`, a metadata key's label is not declined by gender: these are field names (e.g. "Born"), which do not agree with the character's gender.

Examples of common keys (list to be refined, given here for illustration):

| Slug | Label (FR) | Label (EN) |
|---|---|---|
| `birth` | Naissance | Born |
| `death` | Décès | Died |

## Data file formats and conventions

### General conventions

- Attribute names (frontmatter keys and YAML file keys) are in English.
- Keys use hyphens (`-`) rather than underscores (`_`): kebab-case.
- YAML files use the `.yml` extension.
- Slugs (universe, character, relation type identifiers) are built from the entity's English name.
- A slug is lowercase ASCII, with no accents or spaces, words separated by hyphens (e.g. `renaissance-artists`, not `Renaissance_Artists` or `renaissance artists`).
- The site is multilingual (French and English to begin with). An entity's `slug` is shared between languages: only its translation varies, not its URL.

### Images

Images are not carried by attributes: they are associated with their entity by naming and location convention, alongside the content files, rather than referenced in a frontmatter.

- Cover image of a universe: `<slug-universe>/cover.jpg`.
- Portrait of a character: `<slug-universe>/characters/<slug-character>.jpg`.
- Logo of a group: `<slug-universe>/groups/<slug-group>.png`. PNG format rather than `.jpg` like the other content images, to preserve transparency: the logo is overlaid on other elements (thumbnail, graph node, modal) rather than displayed alone (see the relevant screens and `style-guide.md`).

A single image file per entity, shared by all its languages (no per-locale variant). Recommended format, dimensions and ratios: see "Images" in `style-guide.md`.

Covers and portraits (not group logos) carry EXIF/XMP credit metadata embedded in the file itself: `Title`, `Creator`/`By-line`, `CopyrightNotice`, `Rights`, `Credit`, `Source`, `WebStatement`, `UsageTerms`, `Marked`, `Description`/`Caption-Abstract`. Two value policies depending on the origin of the image:

- AI-generated (`cover-source`/`portrait-source` set to `ai-generated`): Creator/By-line/Credit = "Christophe Heubès", CopyrightNotice = "CC0 Christophe Heubès", Rights = "Christophe Heubès - CC0 1.0", UsageTerms = "CC0 1.0", WebStatement = `https://creativecommons.org/publicdomain/zero/1.0/deed.fr`, Marked = "False" (public domain dedication), Source = "AI generated".
- Real external source: Creator = the identified author (or "Unknown"/"Unknown artist" if it cannot be established with certainty), Rights/UsageTerms reflect the license actually found on the consulted page (plain public domain, or a CC license with Credit naming the photographer when the reproduction carries its own license distinct from the artwork), Source/WebStatement = the URL of the specific page consulted (Wikimedia Commons or equivalent), not necessarily that of `portrait-source`/`cover-source`.

This metadata is duplicated in `_data/<slug-universe>/image-credits.yml` (see "File organization") for reuse in JSON-LD; the image file's EXIF/XMP remains the source of truth, `image-credits.yml` is an export of it.

### File organization

The site is generated with Jekyll (see `technical-specifications.md`). Each universe has its own folder at the site root (`/<slug-universe>/`), which groups all of its text content and images; structured data (YAML) lives separately, in `_data/`.

- `/<slug-universe>/mosaic.fr.md`, `mosaic.en.md`: introduction of the universe (Mosaic view), one file per language. Frontmatter: `lang`, `title`. Body text: `description`.
- `/<slug-universe>/graph.fr.md`, `graph.en.md`: Graph view, one file per language. Reuses the introduction data from the `mosaic.*.md` in the same folder rather than duplicating it.
- `/<slug-universe>/cover.jpg`: cover image (see "Images").
- `/<slug-universe>/groups/`, optional: a subfolder containing the logo of each group declared by the universe (`<slug-group>.png`, see "Images").
- `/<slug-universe>/characters/`: a subfolder containing, for each character, `<slug-character>.fr.md`, `<slug-character>.en.md` (frontmatter: `lang`, `character-name`, `external-link`, and the explicitly localized `metadata` keys where applicable; body text: `description`) and its portrait `<slug-character>.jpg` (see "Images"). The subfolder itself associates each character with its universe; no attribute carries this reference.
- `_data/<slug-universe>/universe.yml`: the non-localized attributes specific to the universe itself (`source-type`, `cover-source`), on the same principle as `characters.yml` for a character's non-localized attributes.
- `_data/<slug-universe>/image-credits.yml`: the credit metadata (author, credit line, copyright, license) of the cover and of each portrait of the universe, one entry per image identified by its character slug (or `cover`). Mirrors the EXIF/XMP metadata embedded in the image files themselves (source of truth), used to enrich the JSON-LD (see "SEO" in `technical-specifications.md`).
- `_data/<slug-universe>/characters.yml`: the non-localized attributes of each character of the universe (`gender`, `group`, `portrait-source`, and the `metadata` keys that are not explicitly localized), one entry per character identified by its `slug`.
- `_data/<slug-universe>/relations.yml`: all the relations of the universe; the localized field (`description`) is carried there by keys nested by language, rather than by separate files.
- `_data/<slug-universe>/additional-relation-types.yml`, optional: the additional relation types specific to the universe, with the same structure as the common taxonomy (keys nested by language then by grammatical gender for `label` and `reverse-label`, see "Relation type").
- `_data/relation-types.yml`: the base taxonomy of relation types, shared by all universes.
- `_data/<slug-universe>/additional-metadata-keys.yml`, optional: the additional metadata keys specific to the universe, with the same structure as the common taxonomy (keys nested by language for `label`, see "Metadata key").
- `_data/metadata-keys.yml`: the base taxonomy of metadata keys, shared by all universes.
- `_data/<slug-universe>/groups.yml`, optional: the character groups specific to the universe, with their localized `name` (keys nested by language) and their `color` (see "Group"). Unlike relation types and metadata keys, there is no common taxonomy file: groups are always specific to a universe.
- `_data/source-types.yml`: the taxonomy of source types (see "Source type"), with their localized `label`, shared by all universes, with no possible local extension.

### Examples

**Folder structure** (excerpt):

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
  source-types.yml
  french-renaissance-aristocracy/
    universe.yml
    characters.yml
    relations.yml
    additional-relation-types.yml
    groups.yml
```

**Universe** (`french-renaissance-aristocracy/mosaic.fr.md`):

```yaml
---
lang: fr
title: "Les aristocrates français à l'époque de Catherine de Médicis"
---

À la cour des Valois, alliances, rivalités et intrigues nouent les grandes familles du royaume de France.
```

**Universe, non-localized attributes** (`_data/french-renaissance-aristocracy/universe.yml`):

```yaml
source-type: history
cover-source: ai-generated
```

**Additional relation types** (`_data/french-renaissance-aristocracy/additional-relation-types.yml`):

```yaml
- slug: vassal-of
  label:
    fr:
      masculine: "Vassal de"
      feminine: "Vassale de"
      neutral: "Vassal•e de"
    en:
      masculine: "Vassal of"
      feminine: "Vassal of"
      neutral: "Vassal of"
  reverse-label:
    fr:
      masculine: "Suzerain de"
      feminine: "Suzeraine de"
    en:
      masculine: "Overlord of"
      feminine: "Overlord of"
  directed: true

- slug: superior-of
  label:
    fr:
      masculine: "Supérieur hiérarchique de"
      feminine: "Supérieure hiérarchique de"
      neutral: "Supérieur•e hiérarchique de"
    en:
      masculine: "Superior of"
      feminine: "Superior of"
      neutral: "Superior of"
  reverse-label:
    fr:
      masculine: "Subalterne de"
      feminine: "Subalterne de"
    en:
      masculine: "Subordinate of"
      feminine: "Subordinate of"
  directed: true
```

**Groups** (`_data/french-renaissance-aristocracy/groups.yml`):

```yaml
- slug: house-of-valois
  name:
    fr: "Maison de Valois"
    en: "House of Valois"
  color: "#7a1f2b"
```

This group's logo is its image associated by naming convention: `french-renaissance-aristocracy/groups/house-of-valois.png`.

**Character** (`french-renaissance-aristocracy/characters/catherine-de-medici.fr.md`):

```yaml
---
lang: fr
character-name: "Catherine de Médicis"
external-link: "https://fr.wikipedia.org/wiki/Catherine_de_M%C3%A9dicis"
---

Reine de France par son mariage avec Henri II, elle exerce une influence considérable sur la politique du royaume comme régente puis reine mère.
```

**Character, non-localized attributes** (`_data/french-renaissance-aristocracy/characters.yml`):

```yaml
- slug: catherine-de-medici
  gender: feminine
  group: house-of-valois
  portrait-source: "https://en.wikipedia.org/wiki/Catherine_de%27_Medici"
  metadata:
    birth: "1519"
    death: "1589"
```

**Relations** (`_data/french-renaissance-aristocracy/relations.yml`):

```yaml
relations:
  - source-character: catherine-de-medici
    target-character: henri-iii
    type: parent-of
    description:
      fr: "Catherine de Médicis est la mère d'Henri III."
      en: "Catherine de' Medici is Henri III's mother."
```

**Relation type taxonomy** (`_data/relation-types.yml`):

```yaml
- slug: parent-of
  label:
    fr:
      masculine: "Père de"
      feminine: "Mère de"
      neutral: "Parent de"
    en:
      masculine: "Father of"
      feminine: "Mother of"
      neutral: "Parent of"
  reverse-label:
    fr:
      masculine: "Fils de"
      feminine: "Fille de"
    en:
      masculine: "Son of"
      feminine: "Daughter of"
  directed: true
```

**Metadata key taxonomy** (`_data/metadata-keys.yml`):

```yaml
- slug: birth
  label:
    fr: "Naissance"
    en: "Born"
```

**Source type taxonomy** (`_data/source-types.yml`):

```yaml
- slug: history
  label:
    fr: "Histoire"
    en: "History"

- slug: art-history
  label:
    fr: "Histoire de l'Art"
    en: "Art History"

- slug: fiction
  label:
    fr: "Fiction"
    en: "Fiction"

- slug: other
  label:
    fr: "Autre"
    en: "Other"
```

### Workflow for adding a universe

1. Choose the universe's `slug` (built from its English name) and create its `/<slug>/` folder.
2. Create `mosaic.fr.md` and `mosaic.en.md`, then `graph.fr.md` and `graph.en.md`, and declare its `source-type` in `_data/<slug>/universe.yml` (see "Source type").
3. Add the cover image (`cover.jpg`).
4. Declare, if needed, the additional relation types and metadata keys (`_data/<slug>/additional-relation-types.yml`, `_data/<slug>/additional-metadata-keys.yml`), as well as the universe's groups (`_data/<slug>/groups.yml` and their logos in `<slug>/groups/`).
5. Create, in `characters/`, each character's files (markdown and portrait) for each language, and declare their non-localized attributes in `_data/<slug>/characters.yml`.
6. List the relations in `_data/<slug>/relations.yml`, with their localized descriptions, reusing the common types or the declared additional types.
7. Validate the data (see the data model constraints).
8. Publish.

## Validation constraints and rules

- An entity's `slug` (universe, character, relation type) is identical for all its translations.
- A character `slug` is unique within its universe (it can be reused from one universe to another).
- Each character has exactly one entry in its universe's `characters.yml`, identified by its `slug`, which must match an existing character (`characters/<slug>.*.md` files).
- A relation type `slug` is globally unique: a universe cannot declare an additional type whose slug already exists in the common taxonomy or in another universe's extensions.
- A relation references two existing characters of the same universe (no cross-universe relation).
- A character cannot be in a relation with themselves.
- A relation's `type` must exist in the common taxonomy or in the extensions declared by the universe.
- A directed relation type (`directed: true`) must define a `reverse-label`; an undirected type does not define one.
- A `label`, when provided, declines the three forms `masculine`, `feminine` and `neutral` for each language of the site, even when some forms are identical; a `reverse-label` declines the two forms `masculine` and `feminine` (see "Gender agreement" in "Relation type").
- Two characters cannot be linked twice by the same relation type (but can be by several different types, e.g. "friend of" and "rival of"). For an undirected type, `(A, B, type)` and `(B, A, type)` count as the same relation and cannot coexist.
- A `metadata` key provided in a character's front matter must be declared `localized: true` in the taxonomy (common or local extension); a non-localized key (`localized` absent or `false`) must only appear in `characters.yml`, never in the front matter.
- A metadata key slug is globally unique: a universe cannot declare an additional key whose slug already exists in the common taxonomy or in another universe's extensions.
- Each key of a character's `metadata` attribute (in `characters.yml` or in the front matter, depending on its `localized`) must exist in the common metadata key taxonomy or in the extensions declared by the universe.
- A character's `gender` attribute, in `characters.yml`, when provided, is `masculine` or `feminine`.
- A character's `portrait-source` attribute, in `characters.yml`, when provided, is either `ai-generated` or a URL.
- A universe's `cover-source` attribute, in `universe.yml`, when provided, is either `ai-generated` or a URL.
- The `lang` attribute of a universe or character file must match the language suffix of its file name (`.fr.md` → `fr`, `.en.md` → `en`).
- For a given language, `mosaic.<lang>.md` and `graph.<lang>.md` exist together or not at all: a universe cannot be available, in a language, on only one of its two views.
- A group `slug` is unique within its universe (two different universes can reuse the same group slug, unlike relation types and metadata keys).
- A character's `group` attribute, in `characters.yml`, when provided, must reference an existing group in its universe's `groups.yml`.
- A group's `name` defines a value for each language declared by the universe.
- A source type `slug` is unique in `_data/source-types.yml` (no local extension per universe, unlike relation types and metadata keys).
- A universe's `source-type`, in `_data/<slug-universe>/universe.yml`, must reference an existing source type in `_data/source-types.yml`.
- A source type's `label` defines a value for each language declared by the site.
