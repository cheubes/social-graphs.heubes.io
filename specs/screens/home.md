# Screen: site home

## Goal

Let the visitor discover the available universes and access the one that interests them.

## Content and structure

- Header: site logo and tagline, language selector (see `functional-specifications.md` and `style-guide.md`).
- One section per source type (see "Source type" in `data-model.md`) having at least one universe available in the current language, titled with that type's `label` in the current language; a section with no universe available in that language does not appear.
  - Section order: declaration order of the source types in `_data/source-types.yml`, not an alphabetical sort (which would vary from one language to another depending on the `label`).
  - Within a section, a mosaic of cards, one card per universe of that source type available in the current language (a universe not translated into that language does not appear, see "Multilingual" in `functional-specifications.md`).
- Each card displays the universe's cover image, `title`, `description`, and a credit for the cover if `cover-source` is set (see `data-model.md`).
  - All cards have exactly the same height (see `style-guide.md`). The `title` and `description` are not truncated: if their content exceeds the height available below the cover, that area becomes scrollable, the cover staying fixed.
  - The cover credit, if set, is displayed at the end of the card's content, right-aligned (see `style-guide.md`): a link that opens `cover-source` in a new tab if it is a URL, or a note stating that the cover is AI-generated if `cover-source` is `ai-generated` (see "Universe" in `data-model.md`).
  - The cover image is lazy loaded (loaded only when approaching the visible area of the screen), to limit the page's initial weight; its exact handling belongs to `technical-specifications.md`.
- Within each section, cards are sorted alphabetically by `title`, in the current language.
- Footer: Creative Commons badge and authorship credit, common to all pages (see `style-guide.md`).

## Interactions

- Click on a card: navigates to the home page of the corresponding universe.
- Language change via the selector: redisplays the mosaic in the chosen language, with the sections, sort and list of universes recomputed for that language.

## States (loading, error, empty)

- Empty: no universe available in the current language (no section to display). A message says so; if universes exist in the other language, the message invites the visitor to switch language.
- Error: cover image missing or failing to load for a card → generic placeholder image, the rest of the card displays normally.
- Loading: the list of universes itself has no loading state of its own if the page is statically generated (to be revisited if `technical-specifications.md` opts for dynamic rendering); the cover images, however, are lazy loaded individually, regardless of the page's rendering mode.

## Responsive

Within each section, the mosaic adapts to the screen width (one column on mobile, several columns beyond), with no fixed number of columns imposed here.
