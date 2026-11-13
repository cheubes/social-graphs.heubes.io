# General functional specifications

## Context and goals

The site presents "universes": groups of characters, or of real people, and the relations that connect them, as an interactive graph. A universe can be the characters of a novel, of a TV series, a group of artists, a historical period, etc.

The goal is to let a visitor visually explore the relation network of a universe: browse the characters, understand who is connected to whom and how, and dig deeper into a specific character or relation.

## Project scope

In scope:

- Browsing the list of available universes, from the site home page.
- Browsing, for each universe, its presentation page and its interactive graph of characters and relations.
- Browsing the detailed sheet of a character.
- Searching and filtering characters and relations within a universe.
- Multilingual site (French and English to begin with).

See also "Out of scope" below.

## Target users

The site is aimed at visitors who want to discover or explore a universe of characters: readers, viewers, history enthusiasts, etc. There is no role distinction on the visitor side: no account, no personal space, no personalized content.

The content (universes, characters, relations) is produced by the site author directly in the source files (see `data-model.md`), not through an administration interface.

## Main user journeys

1. A visitor lands on the site home page, browses the universe mosaic, and picks the one they are interested in.
2. They land on the home page of that universe (Mosaic view), which presents it along with its characters, and can switch to the Graph view for a more visual exploration of the relations.
3. From either of these views, they spot a character they are interested in and open its detailed sheet, displayed as an overlay without leaving the current view.
4. From the character sheet, they can navigate to the characters connected by a relation.
5. At any time within a universe, they can search or filter the displayed characters and relations.
6. A visitor can also land directly on the page of a universe or of a character through a shared link, without going through the home page.

## Cross-cutting rules

### Multilingual

- The site is available in French and English.
- On first visit, the language is determined by the browser's; if the browser reports a language other than French or English, the site starts in English. A manual language change through the selector is remembered for subsequent visits.
- A language selector, available from every page, lets the visitor switch from one language to the other. It keeps the navigation context when the content exists in the other language; otherwise, the page displays a message stating that this content is not yet available in that language.
- A universe not translated into the current language does not appear in the home mosaic for that language.
- A character not translated into the current language does not appear in the graph, the lists or the search for that language; the relations involving it are hidden along with it.

### Navigation

- Every page lets the visitor go back to the site home page and to the home page of the current universe (when applicable).

## Out of scope

- User accounts, authentication.
- Content editing through a web interface: content is created and edited directly in the source files (see `data-model.md`).
- Visitor-generated content (comments, ratings, contributions).
- Global cross-universe search: search is limited to one universe (see `search-filter.md`).
