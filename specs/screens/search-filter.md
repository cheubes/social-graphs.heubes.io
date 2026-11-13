# Screen: search / filter

## Goal

Let the visitor quickly find a character by name, in the Mosaic view as well as in the Graph view (see `universe-home.md` and `graph-view.md`), filter the displayed characters by group in both views, filter the displayed relations by type in the Graph view, and sort the characters displayed in the Mosaic view.

## Content and structure

- Text search bar ("Filter by name..."), searching among the `character-name` of the universe's characters, in the current language. Present on both views.
- Sort buttons, to the right of the search bar, on the same line (see `style-guide.md`): one button per criterion (`character-name` and number of relations), each independently clickable to activate it or, if already active, reverse its direction. Present only in the Mosaic view, since the Graph view does not display an ordered list. Default: number of relations descending, which matches the Mosaic view's historical sort (see `universe-home.md`). Activating a previously inactive criterion applies its default direction (`character-name`: ascending; number of relations: descending) rather than keeping the direction previously displayed on the other criterion. For an equal number of relations, the secondary sort always remains by `character-name` ascending, whatever the chosen direction, for a stable order.
- List of group filters, on its own line, below the search bar (see `style-guide.md`), one per group present in the universe (see "Group" in `data-model.md`), each independently toggleable. All groups are active by default. Present on both views. A character without a group is not affected by any of these filters: they stay displayed whatever their state, in the same way that a character without relations is not affected by any relation type filter.
- List of relation type filters, displayed as a separate block below the graph rather than next to the search bar (see exact location in `graph-view.md`), one per type present in the universe (common taxonomy and local extensions, see "Relation type" in `data-model.md`), each independently toggleable. All types are active by default. Present only in the Graph view: the Mosaic view displays no relation on its cards, so a type filter would have no visually justified effect there (see `universe-home.md`).
- Search state shared between the Mosaic view and the Graph view: it is not reset when switching from one to the other via the switcher. The state of the group filters, shared in the same way between both views, that of the type filters, specific to the Graph view, and that of the sort, specific to the Mosaic view, persist in the same way. No dedicated reset control (see `style-guide.md`).

## Interactions

- Click on a sort button, in the Mosaic view: activates its criterion (in its default direction) if it was not already active, or reverses its direction if it was; reorders the displayed cards accordingly.
- Typing in the search bar, in the Mosaic view: hides the cards of characters whose `character-name` does not match.
- Typing in the search bar, in the Graph view: highlights the matching nodes, dims the others without removing them from the graph.
- Disabling a group filter, in the Mosaic view: hides the cards of that group's characters.
- Disabling a group filter, in the Graph view: hides the nodes of that group's characters, along with their associated edges (unlike a relation type filter, which only hides edges and leaves the nodes displayed).
- Disabling a relation type, in the Graph view: hides the edges of that type; nodes stay displayed even without a visible edge.

## States (loading, error, empty)

- Empty: no character matches the search and active filters (group, and relation type in the Graph view) → message saying so.
- Loading and error: not applicable, the search operates on the data already loaded by the current view.

## Responsive

The search bar, sort buttons and filters stay directly displayed on small screens, with no collapsing or dedicated control: the layout remains the one described above, which already adapts to the available width.
