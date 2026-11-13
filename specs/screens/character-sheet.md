# Screen: character sheet

## Goal

Present the details of a character (biography, additional information, relations) and let the visitor navigate to the characters linked to them, without leaving the Mosaic view or Graph view they were on.

## Content and structure

Modal overlaid on the Mosaic view or the Graph view (see `universe-home.md` and `graph-view.md`), which remains visible in the background.

- Portrait and `character-name` of the character.
- Logo of the character's group, if set, displayed in the top-left corner of the modal; top border of the modal in that group's color, white otherwise (see "Group" in `data-model.md` and `style-guide.md`).
- `description` (biographical text).
- `metadata`, if set: displayed as a key/value list; each key displays its localized label (see "Metadata key" in `data-model.md`), not the raw key.
- `external-link`, if set: outbound link to an external source.
- List of this character's relations, grouped by type: each group is identified by the label matching this character's gender (`label` if this character is the source, `reverse-label` if they are the target, or `label` for an undirected type; see "Gender agreement" in "Relation type" of `data-model.md`). A directed type for which this character is both the source of some relations and the target of others forms two separate groups, one under `label`, the other under `reverse-label`. Groups are ordered by the declaration order of their type in the taxonomy (common types from `relation-types.yml`, then the universe's local extensions) rather than alphabetically: since the label varies with the displayed character's gender, an alphabetical sort would change order from one character to another. Within each group, one linked character per line, sorted alphabetically by their `character-name`, with the relation's `description` if set. This list is complete: it is not affected by the search or active filters of the underlying view (see `search-filter.md`).
- `portrait-source`, if set: credit for the portrait's source (or, for the special value `ai-generated`, a note stating that the portrait is AI-generated), at the end of the sheet, right-aligned (see `style-guide.md` and "Character" in `data-model.md`).
- Close button.

Opening the modal, whatever its origin (click on a card, on a node, or direct access), updates the URL to reflect the displayed character; this URL remains shareable as is (see the "shared link" journey in `functional-specifications.md`).

## Interactions

- Click on the close button, on the backdrop, or Escape key: closes the modal, returns to the unchanged underlying view.
- Click on a linked character, in the relations list: replaces the modal's content with that character's sheet, without closing/reopening the modal or changing the underlying view.
- Direct access via shared link: opens the modal over the Mosaic view of the universe concerned (see `universe-home.md`).
- Language change via the selector: if the character exists in the other language, redisplays their sheet in that language; otherwise, displays the unavailability message (see "Multilingual" in `functional-specifications.md`).

## States (loading, error, empty, unavailable)

- Unavailable: the character is not translated into the current language, whether through direct access or a language change → unavailability message, no character content displayed.
- Empty: the character has no relation in the universe → the relations list is absent, the rest of the sheet displays normally.
- Error: portrait missing or failing to load → generic placeholder image.
- Loading: possible while the character's content loads into the modal; its exact handling belongs to `technical-specifications.md`.

## Responsive

On small screens, the modal fills the screen below the header, which remains visible and accessible (notably for the language selector, see `style-guide.md`), rather than a partial overlay window.
