# social-graphs.heubes.io

A site presenting "universes" (the characters of a novel, a TV series, a historical period, etc.) as interactive graphs of characters and their relationships. Static, multilingual (French / English) site.

## Status

Specifications are complete in [`specs/`](specs/); implementation is underway following [`BUILD-PLAN.md`](BUILD-PLAN.md)'s incremental steps (✅ 4/11 — universe mosaic view).

- [`CLAUDE.md`](CLAUDE.md) — how the specs are organized and how to use them.
- [`BUILD-PLAN.md`](BUILD-PLAN.md) — the incremental implementation plan, with a ready-to-use prompt per step.

## Stack

Static site generated with Jekyll and hosted on GitHub Pages. Bootstrap for layout and components, D3.js for the interactive graph, vanilla JS elsewhere, no backend, no database. Full details in [`specs/technical-specifications.md`](specs/technical-specifications.md).

## License

Universe content (characters, relationships, descriptions) is licensed under [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). No license has been chosen yet for the code itself.
