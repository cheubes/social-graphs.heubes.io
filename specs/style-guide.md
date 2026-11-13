# Style guide

## Colors

### Brand palette

| Role | Variable | Hex |
|---|---|---|
| Primary color, header, strong accents | `--sg-blue` | `#2C374C` |
| Secondary accents, hovers, highlighting | `--sg-gold` | `#C7B299` |
| Borders, decorative elements (no text, insufficient contrast: see `technical-specifications.md` § Accessibility) | `--sg-light-grey` | `#ACB2B8` |
| Regular body text | `--sg-grey` | `#666666` |
| Headings, strong text | `--sg-dark-grey` | `#444444` |
| General background | `--sg-white` | `#FFFFFF` |

```css
:root {
  --sg-blue: #2C374C;
  --sg-gold: #C7B299;
  --sg-light-grey: #ACB2B8;
  --sg-grey: #666666;
  --sg-dark-grey: #444444;
  --sg-white: #FFFFFF;
}
```

`--sg-` prefix, echoing the `.sg-` class prefix (see `technical-specifications.md`), so as not to be confused with Bootstrap's `--bs-*` variables.

### Graph palette (relation types)

The brand palette is not meant to encode categories: `--sg-blue` and `--sg-gold` are the only two accents, and the greys are designed for text and borders. The graph therefore uses a dedicated categorical palette, separate from the style guide, chosen to remain readable for colorblind users rather than assembled by eye.

| Order | Hue | Hex |
|---|---|---|
| 1 | Blue | `#2a78d6` |
| 2 | Orange | `#eb6834` |
| 3 | Turquoise | `#1baf7a` |
| 4 | Yellow | `#eda100` |
| 5 | Magenta | `#e87ba4` |
| 6 | Green | `#008300` |
| 7 | Purple | `#4a3aa7` |
| 8 | Red | `#e34948` |

Colors are assigned to relation types per universe (since the available taxonomy is not the same everywhere), in alphabetical order of the type's `slug`, for a stable and reproducible result from one render to the next.

This palette is validated for colorblind reading when the colors appear in a fixed order and only neighbors touch (e.g. a legend, a stack). A graph with a dynamic layout has no such order: two edges of any color can cross anywhere. In this stricter case, only the first three hues (blue, orange, turquoise) remain guaranteed pairwise distinguishable. Beyond three types displayed at once, distinction also relies on:

- a color → type legend, permanently displayed on the Graph view: it is the list of relation type filters from `search-filter.md`, each filter already carrying its type's color (see `graph-view.md`);
- hovering or clicking an edge, which already displays its type in full (see `graph-view.md`);
- the visual direction (arrow or not) of directed types, independent of color;
- the type filter from `search-filter.md`, which isolates one type at a time.

Figures established with the dataviz skill's method and reference palette (surface `#fcfcfb`). Checked against our `#FFFFFF` background: turquoise, yellow and magenta (hues 3, 4, 5) fall below 3:1 as a plain thin stroke on white, whereas they passed against a greyer surface. A slightly thicker stroke than normal for these three hues in particular partly compensates; the legend and hover (above) remain the main readability guarantee, regardless of stroke thickness.

### Group color

The color of a character group (see "Group" in `data-model.md`) is content data, not a style guide ingredient: like images, it is chosen freely when adding content, specific to each group, with no imposed palette and no guaranteed contrast constraint. It is only used as a decorative border (card, graph node, modal; see "Cards" and "Modal" below), never as a text background.

## Typography

- **Font**: Ubuntu (Google Fonts), weights 300 / 400 / 500 / 700.
- `font-family: "Ubuntu", sans-serif;` on `body`.

| Usage | Weight | Color |
|---|---|---|
| Headings (`h1`-`h3`) | 700 | `--sg-dark-grey` |
| Subheadings, strong labels | 500 | `--sg-dark-grey` |
| Body text | 400 | `--sg-grey` |
| Secondary text, captions, metadata | 300 | `--sg-grey` |

The size scale (`h1` to `h6`, body, small text) uses Bootstrap's default, without overrides, to stay consistent with the rest of the components.

## Spacing and grid

No custom grid or spacing scale: Bootstrap 5.3's grid and spacing utility classes (`container`, `row`/`col-*`, `m-*`/`p-*`) are used as is (see `technical-specifications.md`).

## Basic UI components

### Header

- **Home and generic pages** (e.g. unavailability message):
  - **Left**: logo (`assets/img/logo.png`, see "Images"), then the site tagline on the home page.
  - **Right**: language selector.
- **Universe pages** (Mosaic view, Graph view, character sheet):
  - **Left**: cover of the current universe (rounded corners, see "Images"), then its `title` with the Mosaic view / Graph view switcher (see below) just underneath. Neither the universe's `source-type` nor its `description` is shown in the header.
  - **Right**: site logo, linking to the home page, then language selector.
- Language selector: two flags 🇫🇷 / 🇬🇧, each with an explicit `aria-label` ("Français" / "English") since an emoji alone is not always reliably announced by a screen reader.
- `--sg-blue` background, `--sg-white` text, `--sg-gold` bottom border.
- Sticky header (`position: sticky`) at the top of the page, to remain accessible on long pages (Mosaic view, Graph view), echoing the fixed footer.
- Stays above the character sheet modal (see `character-sheet.md`) in the visual stacking order, so that the language selector remains usable while the modal is open.

### Footer

- Fixed (`position: fixed`, bottom of the screen): a height must therefore be reserved at the bottom of every page so that nothing is covered, including the Graph view (see `graph-view.md`). Height carried by a variable, e.g. `--sg-footer-height`.
- **Left**: Creative Commons badge. Four Font Awesome Brands icons (`fa-creative-commons`, `fa-creative-commons-by`, `fa-creative-commons-nc-eu`, `fa-creative-commons-sa`) followed by the text "CC BY-NC-SA 4.0", linking to `https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr` or `.../deed.en` depending on the current language.
- **Right**: credit "Réalisée par Christophe Heubès" (FR) / "Created by Christophe Heubès" (EN), the name linking to `https://christophe.heubes.org`.
- `--sg-dark-grey` background, `--sg-white` text, `--sg-light-grey` top border, links in `--sg-gold` on hover.

### Section title (home)

- One title per home page section (see "Source type" in `data-model.md` and `home.md`), above the card mosaic of the corresponding source type.
- `h2`, style taken from the standard typographic scale (see "Typography" above), with no specific color or weight override.

### Cards (mosaics)

- Bootstrap card: image (cover or portrait) lazy-loaded (see `home.md`, `universe-home.md`), `title`/`character-name` as heading, `description` as body (truncated, except for the home page universe card, see below).
- `--sg-white` background, `--sg-dark-grey` heading, justified `--sg-grey` text, `--sg-light-grey` border.
- Hover: slight elevation (shadow) and `--sg-gold` border.
- Universe card (home page, see `home.md`) only: fixed height, identical for all cards (cover sized to its fixed ratio, see "Images", followed by a fixed-height text area for the `title` and the `description`). The `title` stays fixed at the top of this area; below it, only the `description` (with the cover credit, see below) scrolls if its content exceeds the available height. The cover above also stays fixed, outside the scrolling. Cover credit (`cover-source`, if set, see `data-model.md`): italic secondary text at the end of this area's content, right-aligned (same treatment as the portrait source credit of the character sheet, see "Modal" below); if it is a URL, a link follows the modal's link rule; if it is the special value `ai-generated`, plain text with no link.
- Character card (see `universe-home.md`) only: fixed height, identical for all cards (portrait sized to its fixed ratio, see "Images", followed by a fixed-height text area for the `character-name` and the `description`). Unlike the universe card above, this area does not scroll: the `description` is truncated as soon as its content exceeds the available height, at a word boundary (never mid-word), the truncation mark ("...") being preceded by a non-breaking space. 10px border between the portrait and the card body (name, description), in the color of the character's group if set (see "Group" in `data-model.md`), white otherwise; that group's logo, if set, displayed in the bottom-right corner of the card.

### Graph node

- Size proportional to the character's number of connections (see `graph-view.md`), to make the universe's main characters stand out: five tiers (quintiles), computed over the distribution of the number of connections of all displayed characters, at the 20th, 40th, 60th and 80th percentiles.

| Tier | Percentile | Radius |
|---|---|---|
| 1 | 0-20 | 16px |
| 2 | 20-40 | 20px |
| 3 | 40-60 | 24px |
| 4 | 60-80 | 30px |
| 5 | 80-100 | 38px |

- Below 15 displayed characters, the sample is too small for reliable percentiles (empty tiers or merged thresholds): all nodes then share a fixed 24px radius.
- The group logo (see "Group color" above and "Group" in `data-model.md`), displayed at the bottom right of the node, keeps its current proportions relative to the node (radius and offset from the center) regardless of the tier.

### Modal (character sheet)

- Standard Bootstrap modal. `--sg-white` background, `character-name` as a `--sg-dark-grey` heading, justified `--sg-grey` body, `--sg-blue` relation labels.
- Sheet links (related character, external link, portrait source): `--sg-gold` by default, `--sg-grey` on hover, never underlined. The external link includes its icon (see "Iconography").
- Portrait source credit (`portrait-source`, if set): italic secondary text at the end of the sheet, right-aligned (weight 300, `--sg-grey`, see "Typography"); if it is a URL, a link follows the rule above; if it is the special value `ai-generated` (see `data-model.md`), plain text with no link.
- 10px top border, in the color of the character's group if set (see "Group" in `data-model.md`), white otherwise; that group's logo, if set, displayed in the top-left corner of the modal.
- Close button: Font Awesome icon (`fa-xmark`).

### Mosaic view / Graph view switcher

- Group of two buttons (Bootstrap `btn-group`), placed in the header under the universe's `title` (see "Header" above): its colors are therefore designed for the header's `--sg-blue` background, not for a white background. Active view: `--sg-gold` background, `--sg-blue` text. Inactive view: `--sg-white` text, transparent background, dimmed white border; on hover, `--sg-gold` text and border.

### Search bar / filters

- Standard Bootstrap search field, `fa-magnifying-glass` icon.
- Sort buttons (Mosaic view only, see `search-filter.md`): one button per criterion, `fa-sort` icon preceding its label. Inactive criterion button: `--sg-grey` border, `--sg-dark-grey` text and icon (same treatment as `sg-btn-outline-neutral`, see "Buttons" below). Active criterion button: `--sg-gold` border, `--sg-blue` text and icon (same treatment as button hover, but as a stable state; `--sg-gold` is never used as a text or icon color, as its contrast on white does not allow it, see "Brand palette" above), icon replaced by `fa-sort-up` (ascending) or `fa-sort-down` (descending) depending on the active direction.
- Group filters: checkboxes or "chips" with a neutral background (`--sg-white`) and `--sg-grey`/`--sg-dark-grey` text, each preceded by the group's logo rather than a color dot, since the logo is already the group's visual identifier (see "Group" in `data-model.md`).
- Relation type filters: same principle, each preceded by a dot in its type's color from the graph palette (see above). The color remains a visual cue next to the text, never the text background: no single text color passes AA contrast on all eight hues of this palette at once (checked).
- Layout: sort buttons to the right of the search field, on the same row, in the Mosaic view; group filters on their own row, below, in both views. In the Graph view, the relation type filters form a separate block below the graph rather than accompanying the search field (see exact placement in `graph-view.md`); like the group filters, the sort buttons and group filters wrap onto several rows (one or more items move to the next row) when space runs out, rather than the block as a whole.
- No dedicated reset button: clearing the search field, re-checking the boxes and clicking the default sort again is done directly on these controls.

### Buttons

- Primary: `--sg-blue` background, `--sg-white` text; on hover, `--sg-gold` background and `--sg-blue` text (`--sg-white` on `--sg-gold` does not pass minimum contrast: 2.05:1, checked).
- Secondary: `--sg-grey` border, `--sg-dark-grey` text, transparent background.

## Images

`.jpg` format (see `data-model.md`) for content images (covers, portraits). Recommended dimensions and ratios when adding content; `object-fit: cover` in CSS to absorb discrepancies rather than imposing strict cropping.

| Image | Ratio | Minimum dimensions |
|---|---|---|
| Universe cover | 16:9 | 1200 × 675 px |
| Character portrait | 1:1 (square) | 600 × 600 px |
| Group logo | 1:1 (square) | 128 × 128 px |

The portrait is square so that it remains correct once cropped into a circle (graph node, see `graph-view.md`), in a card (see `universe-home.md`) or in the modal (see `character-sheet.md`), with no different treatment depending on the display context.

A group's logo is in PNG format rather than `.jpg`, to preserve transparency: it is overlaid on other elements (card, graph node, modal) rather than displayed on its own (see "Images" in `data-model.md`).

The site logo (`assets/img/logo.png`, PNG, 256 × 256 px) is an interface asset separate from universe content: displayed 48px high in the header, and reused as is as the favicon (no generation of variants or `.ico` format).

## Iconography

- Font Awesome Free 7.3 (see `technical-specifications.md`), Brands subset for the Creative Commons icons.
- Language selector: flag emojis 🇫🇷 / 🇬🇧, no Font Awesome icon.
- Modal close: `fa-xmark`.
- Search: `fa-magnifying-glass`.
- External link (a character's `external-link`): `fa-arrow-up-right-from-square`, before the label.
- Creative Commons: `fa-creative-commons`, `fa-creative-commons-by`, `fa-creative-commons-nc-eu`, `fa-creative-commons-sa`.
