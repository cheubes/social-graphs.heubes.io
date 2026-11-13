# social-graphs.heubes.io

A site presenting "universes" (the characters of a novel, a TV series, a historical period, etc.) as interactive graphs of characters and their relationships. Static, multilingual (French / English) site.

## Status

Specifications are complete in [`specs/`](specs/); implementation follows [`BUILD-PLAN.md`](BUILD-PLAN.md)'s incremental steps (✅ 12/12).

- [`CLAUDE.md`](CLAUDE.md): how the specs are organized and how to use them.
- [`BUILD-PLAN.md`](BUILD-PLAN.md): the incremental implementation plan, with a ready-to-use prompt per step.

## Stack

Static site generated with Jekyll and hosted on GitHub Pages. Bootstrap for layout and components, D3.js for the interactive graph, vanilla JS elsewhere, no backend, no database. Full details in [`specs/technical-specifications.md`](specs/technical-specifications.md).

## License

The code and the content of this site (universes, characters, relationships, descriptions, AI-generated images) are dedicated to the public domain under [CC0 1.0 Universal](LICENSE).

Third-party images (photographs and reproductions of artworks, mostly from Wikimedia Commons) are not covered by this dedication: each keeps its own license, credited in its embedded metadata and in `_data/<universe>/image-credits.yml`.
