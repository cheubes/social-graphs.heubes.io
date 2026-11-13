# Technical specifications

## Tech stack

### Site generation

- **Jekyll**: layouts, includes, front matter, `_data/`, pages (no collections, see "Architecture").
- No Jekyll plugins unsupported by GitHub Pages.
- **Ruby**: besides Jekyll, used for `scripts/validate.rb` (see "Data validation"). No additional toolchain (no Node.js, no Python) for this script.

### CSS / UI

- **Bootstrap 5.3** (jsDelivr CDN, pinned version): grid, cards, modal (character sheet), form components (search/filter).
- **Font Awesome Free 7.3** (jsDelivr CDN, pinned version): icons (modal close, search, Creative Commons badge). Major version jump from 6.x; check during implementation that the icons used still exist under the same name. The language selector uses flag emoji, not a Font Awesome icon (see `style-guide.md`).
- Native CSS with custom properties (no SASS, no LESS).
- Design values (colors, typography, spacing) are defined in `style-guide.md`, not here.

### JavaScript

- **Vanilla JS** for global interactions (language selector, preference detection and storage).
- **D3.js v7** for the interactive graph (nodes, edges, zoom, panning), loaded only on Graph view pages.
- The modal JS (Bootstrap) for the character sheet.
- No JS framework (no React, Vue, Angular).

### What we don't use

- Node.js at runtime (Jekyll at build time only).
- Database.
- Backend or custom API.
- Cookies or tracking. The language preference (see "Multilingual" in `functional-specifications.md`) is stored via `localStorage`: storage local to the browser, no data sent to a server, it is not a cookie.

---

## Hosting and deployment

- **Host:** GitHub Pages
- **Repository:** `https://github.com/cheubes/social-graphs.heubes.io`
- **Domain:** `social-graphs.heubes.io` (`CNAME` file at the root)
- **Deployment:** manual, on push to the `gh-pages` branch
- **Generator:** Jekyll (native GitHub Pages integration, no GitHub Actions needed)

---

## CDN dependencies (pinned versions)

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

<!-- Font: see style-guide.md for the choice, with rel="preconnect" on Google Fonts if selected -->

<!-- D3.js v7.9.0 (loaded only on Graph view pages) -->
<script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js" defer></script>
```

Versions checked as the latest stable ones available on jsDelivr at the time of writing; to be reconfirmed at implementation time.

---

## File structure

```
/
├── _config.yml
├── CNAME
├── 404.md                        # unavailability message, see "Architecture"
├── index.fr.md                   # site home (FR)
├── index.en.md                   # site home (EN)
│
├── _layouts/
│   ├── default.html             # base layout: <head>, header, footer
│   ├── home.html                # site home (mosaic of universes)
│   ├── universe.html            # Mosaic view of a universe
│   ├── universe-graph.html      # Graph view of a universe
│   └── character.html           # character sheet (direct access): reuses universe.html + open modal
│
├── _includes/
│   ├── head.html
│   ├── header.html               # site or universe identity, switcher, language selector
│   ├── footer.html
│   ├── universe-card.html        # universe card (site home)
│   ├── character-card.html       # character card (Mosaic view)
│   ├── character-modal.html      # content of the character sheet modal
│   ├── view-switcher.html        # Mosaic view / Graph view switcher
│   └── search-filter.html        # search bar / filters
│
├── _data/
│   ├── relation-types.yml        # common relation type taxonomy
│   ├── source-types.yml          # common source type taxonomy
│   ├── ui.fr.yml                 # UI strings in FR (labels, messages, including the unavailability message)
│   ├── ui.en.yml                 # UI strings in EN (labels, messages, including the unavailability message)
│   └── <slug-universe>/
│       ├── universe.yml                    # non-localized attribute of the universe (source-type)
│       ├── characters.yml                  # non-localized attributes of the characters
│       ├── relations.yml
│       ├── additional-relation-types.yml   # optional
│       └── groups.yml                      # optional
│
├── <slug-universe>/
│   ├── cover.jpg
│   ├── mosaic.fr.md              # Mosaic view
│   ├── mosaic.en.md
│   ├── graph.fr.md               # Graph view
│   ├── graph.en.md
│   ├── groups/                   # group logos, optional
│   │   └── <slug-group>.png
│   └── characters/               # character sheets
│       ├── <slug-character>.fr.md
│       ├── <slug-character>.en.md
│       └── <slug-character>.jpg
│
├── assets/
│   ├── css/
│   │   └── main.css
│   ├── js/
│   │   ├── main.js                # language selector, shared utilities
│   │   ├── graph.js               # D3 rendering of the interactive graph
│   │   ├── character-modal.js     # modal open/close, URL sync
│   │   └── search-filter.js       # search and filters
│   └── img/                       # images for the interface (not universe content)
│
└── scripts/
    └── validate.rb                # content validation, see "Data validation"
```

### Configuration (`_config.yml`)

```yaml
title: "Social Graphs"          # to adjust with the chosen tagline (see "Header" in style-guide.md)
description: "Explore the characters of a universe and their relationships as an interactive graph."
url: "https://social-graphs.heubes.io"
baseurl: ""
lang: en                        # fallback value; each page defines its own lang (see data-model.md), which takes precedence in the layout
markdown: kramdown
permalink: pretty                # safety net; in practice, each page has its own explicit permalink (see "Page generation")
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

`specs/`, `scripts/`, `CLAUDE.md` and `BUILD-PLAN.md` must be excluded from the build: they are repository working files, not site content, and Jekyll would otherwise publish them as is under `_site/`.

---

## Architecture (rendering, routing)

### Rendering

The site is fully static, generated at build time by Jekyll. No dynamic server-side rendering, no custom API (consistent with GitHub Pages).

### URL structure

- `/`: site home (English, default language)
- `/fr/`: site home (French)
- `/<slug-universe>/`: Mosaic view of a universe (EN)
- `/fr/<slug-universe>/`: Mosaic view (FR)
- `/<slug-universe>/graph/`: Graph view of a universe (EN)
- `/fr/<slug-universe>/graph/`: Graph view (FR)
- `/<slug-universe>/characters/<slug-character>/`: character sheet, for direct access (EN)
- `/fr/<slug-universe>/characters/<slug-character>/`: same (FR)

English, the default language, has no prefix; French is prefixed with `/fr/`.

### Page generation

Each universe lives in its own folder at the site root (`/<slug-universe>/`) and its pages are regular Jekyll pages (no collection), each with an explicit permalink in the front matter to apply the language prefix.

- `mosaic.fr.md` / `mosaic.en.md` generate the Mosaic view (`/fr/<slug-universe>/` in FR, `/<slug-universe>/` in EN).
- `graph.fr.md` / `graph.en.md` generate the Graph view (`/fr/<slug-universe>/graph/` in FR, `/<slug-universe>/graph/` in EN). Their layout reuses the presentation data from the `mosaic.*.md` in the same folder (same `lang`) rather than duplicating it.
- Each `characters/<slug-character>.fr.md` / `.en.md` file generates the character sheet page (`/<slug-universe>/characters/<slug-character>/`); its layout displays the Mosaic view of its universe with that character's modal open on load (see `character-sheet.md`).
- A universe or character not translated into a language simply has no file for that language, so no page is generated at that URL.

### Mosaic view / Graph view switcher

The switcher (see `universe-home.md`, `graph-view.md`) is a link between two distinct static pages, not a JavaScript toggle without reload: each click is a full navigation, consistent with the choice of two separate pages. The identical page structure between the two views (same header) limits the visual change perceived on reload.

### Character sheet modal and URL sync

A character's portrait, `character-name` and truncated `description` are already present on the Mosaic view (card) and Graph view (node) page of its universe, for their own display. Clicking a card or a node (see `universe-home.md`, `graph-view.md`) triggers a `fetch()` of the already generated character sheet URL (`/<slug-universe>/characters/<slug-character>/`), whose missing content (full description, metadata, external link, list of relations) is injected into the modal, without navigation or page reload; the URL is updated to that page's URL via the browser History API (`pushState`). Closing the modal restores the URL of the underlying view via `pushState`, also without reload.

Direct access to a character sheet URL (shared link, or page reload) loads its generated page, which directly displays the Mosaic view with the modal already open.

### Untranslated content ("unavailability message")

Since a language without a translation generates no page, accessing an untranslated URL (universe or character) triggers the native GitHub Pages 404 mechanism. A custom `404.md` file, at the site root, serves as the "unavailability message" (see "Multilingual" in `functional-specifications.md`): it detects the language from the prefix of the requested URL (`/fr/...` or not) to display the message in the right language, rather than the generic GitHub Pages 404 page.

### UI strings

UI strings (labels, messages including the unavailability message, search placeholder) are centralized in `_data/ui.fr.yml` and `_data/ui.en.yml`. They are distinct from universe and character content, which follows the format documented in `data-model.md`.

---

## Data validation

A script checks, before publication, that the content of all universes complies with the validation constraints of `data-model.md`. It modifies nothing: it reports the problems found and fails if there is at least one error.

- **Language:** Ruby, already a project dependency through Jekyll (no new toolchain), and its native YAML parser (`require 'yaml'`, no additional gem).
- **Location:** `scripts/validate.rb`, excluded from the Jekyll build (see "Configuration").
- **Manual invocation:** `ruby scripts/validate.rb`.
- **CI invocation:** a GitHub Actions workflow (`.github/workflows/validate.yml`), triggered on every push and pull request, runs the script and fails the CI on error. It neither replaces nor modifies the native GitHub Pages deployment (see "Hosting and deployment"), which remains unchanged: this CI is only used for validation.
- **Output:** list of problems found (file concerned, rule, detail), classified as errors and warnings. Non-zero exit code if there is at least one error; warnings alone do not make it fail.

Rules checked, in the order of "Validation constraints and rules" in `data-model.md`, plus a format rule from its "General conventions":

- *Slug format* (General conventions): error if a `slug` (universe folder name, character file name or relation type name) contains anything other than lowercase ASCII letters and hyphens.
- *Same slug for all translations of an entity* and *character slug unique within its universe*: nothing to check, guaranteed by construction (the slug is the file name; two files cannot have the same name in the same folder).
- *Character present in `characters.yml`*: error if a character (`characters/<slug>.*.md` files) has no matching entry in its universe's `characters.yml`, or if `characters.yml` contains an entry whose slug matches no character.
- *Relation type slug globally unique*: error if the same slug appears more than once across `_data/relation-types.yml` and all `_data/<slug-universe>/additional-relation-types.yml` files.
- *Relation references two existing characters of the same universe*: error if `source-character` or `target-character` matches no file in `characters/` in that universe.
- *Character not related to itself*: error if `source-character` = `target-character`.
- *Existing relation type*: error if a relation's `type` is neither in `relation-types.yml` nor in the universe's `additional-relation-types.yml`.
- *`reverse-label` consistent with `directed`*: error if missing while `directed: true`, or present while `directed: false`.
- *Complete `label`/`reverse-label` forms*: error if a `label` (common taxonomy or local extension) does not define its three forms (`masculine`, `feminine`, `neutral`) for a declared language, or if a `reverse-label` does not define its two forms (`masculine`, `feminine`).
- *No duplicate relation*: error if two entries share the same (source, target, type) triplet; for an undirected type, `(A, B)` and `(B, A)` count as the same pair.
- *`lang` consistent with the file name*: error if `.fr.md` does not have `lang: fr`, or `.en.md` `lang: en`.
- *`mosaic`/`graph` present together per language*: error if one exists without the other, for a given language of a universe.
- *`metadata` localization consistent with the taxonomy*: error if a key in a character's front matter is not declared `localized: true` in `metadata-keys.yml` or the universe's `additional-metadata-keys.yml`, or if a key declared `localized: true` appears in `characters.yml` instead of the front matter (and conversely for a non-localized key).
- *Metadata key slug globally unique*: error if the same slug appears more than once across `_data/metadata-keys.yml` and all `_data/<slug-universe>/additional-metadata-keys.yml` files.
- *Existing metadata key*: error if a key of a character's `metadata` attribute (in `characters.yml` or the front matter) is neither in `metadata-keys.yml` nor in the universe's `additional-metadata-keys.yml`.
- *Complete `label` for a metadata key*: error if the `label` of a metadata key (common taxonomy or local extension) does not define a value for a declared language.
- *Valid `gender`*: error if a character's `gender` attribute, in `characters.yml`, when set, is neither `masculine` nor `feminine`.
- *Group slug unique within the universe*: error if the same slug appears more than once in `_data/<slug-universe>/groups.yml`.
- *Existing group*: error if a character's `group` attribute, in `characters.yml`, matches no slug declared in its universe's `groups.yml`.
- *Complete `name` for a group*: error if a group's `name` does not define a value for a language declared by the universe.
- *Source type slug unique*: error if the same slug appears more than once in `_data/source-types.yml`.
- *Existing `source-type`*: error if a universe's `source-type`, in `_data/<slug-universe>/universe.yml`, matches no slug declared in `_data/source-types.yml`.
- *Complete `label` for a source type*: error if a source type's `label` does not define a value for a language declared by the site.

---

## Performance

- Cover images and portraits lazy loaded (see `home.md`, `universe-home.md`) via the native `loading="lazy"` attribute, without a dedicated library.
- D3.js loaded only on the Graph view pages that need it.
- Non-blocking JavaScript (`defer` on all scripts).
- Images optimized when adding content: JPEG encoded in 4:2:0 (standard web chroma subsampling), quality ~82, progressive, optimized Huffman table; PNG losslessly recompressed. Dimensions as close as possible to the recommended minimums in `style-guide.md` rather than delivered oversized relative to their actual use (e.g. a group logo is never displayed at more than a few dozen pixels). No WebP: the JPEG/PNG format is required by `data-model.md` and `style-guide.md`.
- `rel="preconnect"` on Google Fonts, if an external font is selected in `style-guide.md`.
- No cookies, no tracking, no analytics.

---

## Accessibility

- **Target browsers:** latest stable versions of Chrome, Firefox, Safari, Edge. No IE support.
- Text/background pairs compliant with WCAG AA contrast (4.5:1 for body text, 3:1 for large text and UI elements), including for brand palette pairs: this is why `--sg-light-grey` is reserved for borders in `style-guide.md`, as its contrast on white does not allow it as text.
- Modal (character sheet): focus trapped inside while it is open, keyboard close (Escape key, see `character-sheet.md`), dialog ARIA attributes (`role="dialog"`, `aria-modal`), natively provided by the Bootstrap modal component.
- Alternative text on images (portraits, covers).
- Semantic HTML for the structure of pages and lists (mosaics, relation lists).
- Known limitation: the interactive graph (SVG generated by D3.js) is not natively navigable by keyboard or screen reader; this point remains to be addressed specifically if needed, beyond this version of the site.

---

## SEO

- Static rendering: each page exists independently at crawl time, without depending on JavaScript for its main content (except for the interactive graph itself and the modal).
- Each universe and each character has its own indexable URL (see "URL structure").
- `hreflang` / alternate links between the FR and EN versions of the same page.
- `jekyll-seo-tag` (plugin natively supported by GitHub Pages) for basic meta and Open Graph tags.
- `jekyll-sitemap` (plugin natively supported by GitHub Pages) for an automatically generated `sitemap.xml`, useful given the number of generated pages (universes, characters, two languages). Since the plugin does not allow adding per-URL `hreflang` alternates, a project-specific `sitemap.xml` (repository root) replaces the plugin's one (native plugin mechanism, which only generates its own when no file exists) to include them; the plugin remains active for `robots.txt`.
- The sitemap includes, via the Google Image extension (`xmlns:image`), the cover of each Mosaic view page, the portrait of each character sheet, and the site logo on the home page. Group logos and the cover placeholder are excluded.
- A JSON-LD `ImageObject` block (distinct from the one generated by `jekyll-seo-tag`) is added on these same pages, enriched with the image's author, credit text, copyright and license (see `_data/<slug-universe>/image-credits.yml` in `data-model.md`).

---

## Naming conventions

| Element | Convention | Example |
|---|---|---|
| Slugs (universe, character, relation type) | English kebab-case | `renaissance-artists`, `parent-of` |
| Files | kebab-case | `graph.js`, `main.css` |
| Custom CSS classes | `.sg-` + kebab-case | `.sg-card`, `.sg-modal` |
| JS variables | camelCase | `loadGraph()`, `characterModal` |
| JS constants | UPPER_SNAKE_CASE | `DEFAULT_LANG` |

---

## CSS: conventions

- `.sg-` prefix for all custom classes.
- A single global file `assets/css/main.css`.
- Custom CSS properties for design values (colors, typography, spacing), defined in `style-guide.md`.
- No SASS, no LESS.

---

## JavaScript: conventions

- Vanilla JS ES6+, `defer` on all scripts.
- `main.js`: language selector (initial detection, storage via `localStorage`), shared utilities.
- `graph.js`: D3 rendering of the interactive graph, loaded only on Graph view pages.
- `character-modal.js`: open/close of the character sheet modal, URL sync.
- `search-filter.js`: search and filters, loaded on Mosaic view and Graph view pages.
- Naming:
  - Variables and functions: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Files: `kebab-case`
