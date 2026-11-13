# Screen: universe home

## Goal

Present the universe to the visitor (what it is about, what its context is), and let them switch between a mosaic view of its characters and an interactive graph view of its relations (see `graph-view.md`): two views with different main content, but sharing the same page structure.

## Content and structure

- Header: cover and `title` of the current universe (see `data-model.md`), "Mosaic view" / "Graph view" switcher below the title, site logo as a link back to the home page, language selector (see `style-guide.md`). Neither the universe's `source-type` nor its `description` is displayed there.
- "Mosaic view" / "Graph view" switcher: switches the main content below between the two views, without changing the rest of the header (cover, title, logo, language selector). Present and identical in both views, only its active state differs; each view remains a page in its own right, the URL differs between the two (see `technical-specifications.md`), but switching behaves like changing tabs rather than navigating to different content.
- Search bar and group filters, present on both views. The relation type filters, specific to the Graph view, are not displayed here: see their location, below the graph, in `graph-view.md` (detailed content and behavior in `search-filter.md`).
- Main content, in the Mosaic view: mosaic of the universe's characters, one card per character available in the current language (same hiding rule as for untranslated universes, see "Multilingual" in `functional-specifications.md`). Each card displays the character's portrait, `character-name` and `description`, along with, if the character belongs to a group (see "Group" in `data-model.md`), that group's logo at the bottom right of the portrait and a thick border between the portrait and the name, in that group's color (white for a character without a group; see "Cards" in `style-guide.md`). All cards have exactly the same height (see `style-guide.md`).
  - The `description` is truncated (with a truncation mark, e.g. "...") beyond a certain length; the exact value belongs to the design (see `style-guide.md`).
  - The portrait is lazy loaded, same principle as for the universes' cover image on `home.md`.
  - Character sort, changeable by the user via the sort buttons placed next to the search bar (see `search-filter.md`). Default: sort by number of relations descending (a character's number of relations, incoming and outgoing combined, is computed from `relations.yaml`, it is not a stored attribute), with ties broken by `character-name` ascending, for a stable order. This sort remains based on all of the character's relations, regardless of the active search or filters.
- The Graph view's main content is documented in `graph-view.md`.
- Footer: Creative Commons badge and authorship credit, common to all pages (see `style-guide.md`).

## Interactions

- Click on the "Graph view" switcher: switches to this universe's interactive graph view (see `graph-view.md`), only the switcher's active state changes in the header, the rest remaining unchanged.
- Click on a character card: opens that character's sheet in a modal, overlaid on the current view, without navigating to a new page (see `character-sheet.md`).
- Language change via the selector: redisplays the page in the chosen language if it exists (see "Multilingual" in `functional-specifications.md`), otherwise displays the unavailability message.
- Click on the back link: navigates to the site home page.

## States (loading, error, empty, unavailable)

- Unavailable: the universe is not translated into the current language, whether through direct access or a language change → unavailability message, no universe content displayed.
- Empty: the universe is translated into the current language but has no character available in that language (Mosaic view) → message saying so, with an invitation to switch language if some exist in the other one.
- Error: cover image or portrait missing or failing to load → generic placeholder image.
- Loading: the page's content itself has no loading state of its own if it is statically generated (to be revisited if `technical-specifications.md` opts for dynamic rendering); the cover image and the portraits, however, are lazy loaded individually, regardless of the page's rendering mode.

## Responsive

The responsive behavior of the header (cover, title, switcher, logo, language selector) is defined in `style-guide.md`. The main content (character mosaic) adapts to the screen width (one column on mobile, several columns beyond), like the universe mosaic on the site home page.
