# Screen: interactive graph view

## Goal

Let the visitor visually explore the network of characters of a universe and their relations: spot the central characters, understand who is linked to whom and how, and access the details of a character or a relation.

## Content and structure

This view shares the header (including the "Mosaic view" / "Graph view" switcher, see `style-guide.md`) and the footer with `universe-home.md`; only the main content below is specific to it.

- Interactive graph:
  - One node per character available in the current language (same hiding rule as for untranslated universes, see "Multilingual" in `functional-specifications.md`), displaying their portrait and `character-name`, along with a border in the color of their group if set (see "Group" in `data-model.md`), white otherwise, and that group's logo, if set, at the bottom right of the node.
  - Node size proportional to the character's number of connections (number of edges incident to them, each relation counting as one edge even between the same two characters, see below), to bring out the universe's main characters; distribution and exact values in "Graph node" of `style-guide.md`. This number of connections is computed once on the universe's full graph and stays stable whatever the active search or filters: only node visibility changes with them (see below), never their size.
  - One edge per relation between two displayed characters. When two characters are linked by several relations of different types, each is a separate edge.
  - An edge of a directed type is shown with a visual direction (e.g. an arrow); an edge of an undirected type has none.
  - Each relation type has a distinct color, defined in `style-guide.md` (it is not a data attribute, see `data-model.md`).
- Color → relation type legend, permanently displayed on this view, below the graph (see `style-guide.md`: distinction by color alone is not guaranteed beyond three types displayed simultaneously). Each entry displays the type's color and its `label` (`neutral` form, since no particular character is associated with this legend, see "Gender agreement" in "Relation type" of `data-model.md`). It does not duplicate the relation type filters of `search-filter.md`: it is the same list, at the same location, each filter already displaying its type's color (see `style-guide.md`).
- Search bar and group filters (persistent on this view and on the Mosaic view), between the switcher and the graph as on the Mosaic view (see `universe-home.md`). The relation type filters, specific to this view, are displayed separately, below the graph (see `search-filter.md` for their detailed content and behavior). On this view, the search highlights or hides the matching nodes, the type filters hide the edges of disabled types, and the group filters hide the nodes (and their associated edges) of the characters of the disabled group. These filters, each displaying the logo of the group concerned, also serve as a border/logo → group legend, on the same principle as the color → relation type legend above.

## Interactions

- Click on a node: opens that character's sheet in a modal, overlaid on the current view, without navigating to a new page (see `character-sheet.md`), as for a card in the Mosaic view.
- Hover or click on an edge: displays the relation's details (the label in the right direction depending on the end concerned, and its `description` if set; see "Relation type" in `data-model.md`).
- Zoom and pan in the graph.
- Search/filter: highlights or hides the matching elements (details in `search-filter.md`).
- Click on the "Mosaic view" switcher: returns to this universe's mosaic view (see `universe-home.md`), only the switcher's active state changes in the header, the rest remaining unchanged.
- Language change via the selector: redisplays the view in the chosen language if it exists (see "Multilingual" in `functional-specifications.md`), otherwise displays the unavailability message.

## States (loading, error, empty, unavailable)

- Unavailable: the universe is not translated into the current language → unavailability message, same behavior as `universe-home.md`.
- Empty: the universe has no relation in the current language → the characters' nodes are displayed without edges, with a message pointing it out.
- Error: portrait missing or failing to load for a node → generic placeholder image.
- Loading: since the graph is interactive, a loading state is likely while it initializes; its exact handling belongs to `technical-specifications.md`.

## Responsive

The graph remains usable by touch on small screens (zoom, pan, selecting a node or an edge); the search/filter bar (including the legend, see above), the switcher and the fixed footer (see `style-guide.md`) remain accessible without covering the graph.
