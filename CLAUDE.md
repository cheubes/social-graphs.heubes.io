# social-graphs.heubes.io

Site presenting "universes" (the characters of a work, a historical group, etc.) as interactive graphs of characters and their relations. Static, multilingual site (French / English), generated with Jekyll and hosted on GitHub Pages.

## Project status

Implementation follows `BUILD-PLAN.md`, which defines the order in incremental steps. `specs/` remains the source of truth for any design decision: before writing or modifying code, read the spec files relevant to the task.

## Structure of `specs/`

- **`functional-specifications.md`**: project scope, target users, user journeys, cross-cutting rules (multilingual, navigation), out of scope.
- **`data-model.md`**: entities (Universe, Character, Relation, Relation type), their attributes, and the format of the files that hold them (Jekyll organization, naming conventions, validation constraints).
- **`technical-specifications.md`**: tech stack, hosting/deployment, architecture (rendering, routing), performance, accessibility, SEO.
- **`style-guide.md`**: visual identity (colors, typography, spacing), basic UI components (header, footer, cards, modal...), iconography.
- **`screens/`**: one functional specification per screen (goal, content, interactions, states, responsive):
  - `home.md`: site home (universe mosaic)
  - `universe-home.md`: universe home (Mosaic view of its characters)
  - `graph-view.md`: interactive Graph view of a universe
  - `character-sheet.md`: character sheet (modal)
  - `search-filter.md`: search and filtering

## When and how to use these specs

- **Before any implementation**, read the file or files relevant to the task. The four cross-cutting specs (`functional-specifications.md`, `data-model.md`, `technical-specifications.md`, `style-guide.md`) apply to all screens; each file in `screens/` adds what is specific to that screen.
- **Files constantly reference each other** ("see `X.md`") rather than duplicating information. Follow these references rather than guessing: if a screen mentions a rule defined elsewhere (the multilingual behavior, a color from the style guide...), the source of truth is the referenced file, not the screen citing it.
- **When modifying a spec**, look for the other files that reference it (`grep` the file name in `specs/`) and check that they stay consistent with the change. This is the most frequent source of inconsistency in this project.
- **When in doubt, or when the specs are silent** on a point needed for implementation, ask rather than assume: these are design choices, not implementation details left open.
- **In case of contradiction** between the code (existing or being written) and a spec, the spec prevails; if the implementation reveals that a spec must change, update the spec and explain why, rather than silently diverging from it in the code.

## Before each commit

- **Check all files in `specs/`** for consistency, not only those directly modified by this commit.
- **If one or more specs need adjusting** (to stay consistent with each other, or with the change in progress), block the commit: propose the necessary updates and wait for approval before applying them, then commit.
- **Update `BUILD-PLAN.md`** if needed (progress status).
- **Update `README.md`** if needed.

## Established conventions

- All project content is in English, including `specs/`, `BUILD-PLAN.md`, this file, `README.md`, code and comments. The only exception is the site's French-locale content (`.fr.md` files, `fr:` values in `_data/`, `_data/ui.fr.yml`), which stays in French since the site is multilingual.
- File names, folders, data attributes, CSS classes and technical identifiers are in English, in kebab-case (e.g. `source-type`, `additional-relation-types.yml`, `.sg-card`).
- The style guide's colors and components are defined only once, in `style-guide.md`: do not introduce new color values or new component styles elsewhere without adding them there first.
