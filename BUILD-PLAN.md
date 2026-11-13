# Incremental build plan

Twelve steps, each one demonstrable in a browser before moving on to the next. See `CLAUDE.md` for the structure of `specs/` and the rules for using the specifications.

Each step has a ready-to-use prompt to start it.

## 1. Jekyll skeleton + shared chrome ✅

`_config.yml`, `Gemfile`, `default.html` layout with a sticky header and a fixed footer (colors, font, CC badge, emoji language selector) on any empty page. See `technical-specifications.md` (File structure, Configuration) and `style-guide.md` (Header, Footer).

**Criterion:** `bundle exec jekyll serve` runs, the header/footer follow the style guide, with nothing dynamic yet.

**Prompt:**
```
Implement step 1 of the build plan (BUILD-PLAN.md): Jekyll skeleton and shared chrome.

Create _config.yml and Gemfile (see "File structure" and "Configuration" in
technical-specifications.md), then the _layouts/default.html layout with a sticky header
and a fixed footer matching style-guide.md (colors, Ubuntu font, Creative Commons badge,
flag emoji language selector: not functional yet, visual only).
Include Bootstrap and Font Awesome via CDN (versions and SRI hashes in technical-specifications.md).

Create a minimal test page to check the rendering. Do not build any feature beyond this
step (no universe content, no JS).

Done when: bundle exec jekyll serve runs, and the header and footer render correctly in
the style guide colors on this test page.
```

## 2. First content universe + validation script ✅

Create the "french-renaissance-aristocracy" universe (already the illustrative example in `data-model.md`) with two or three characters and a few relations, following the documented format to the letter. Write `scripts/validate.rb` alongside, testing it against this real content. See `data-model.md` (File organization, Examples) and `technical-specifications.md` (Data validation).

**Criterion:** the script passes on this content, and detects an error when one is introduced on purpose (e.g. a relation `type` that does not exist).

**Prompt:**
```
Implement step 2 of the build plan (BUILD-PLAN.md): first content universe and
validation script.

Create the "french-renaissance-aristocracy" universe with two or three characters and a few
relations, following the format of data-model.md exactly ("File organization" and
"Examples" sections; reuse the illustrative example already there: Catherine de' Medici,
Henri III). Both languages (fr/en) from the start.

Then write scripts/validate.rb, following the list of rules in the "Data validation"
section of technical-specifications.md, and test it against this real content.

Done when: the script passes without errors on this content; introduce an error on purpose
(e.g. a nonexistent relation type) and check that the script detects it, then remove it.
```

## 3. Site home ✅

Mosaic of universes, grouped by source type, sorted alphabetically within each section, lazy loading, empty/error states. See `screens/home.md` and "Source type" in `data-model.md`.

**Criterion:** the test universe's card is displayed and leads to its page.

**Prompt:**
```
Implement step 3 of the build plan (BUILD-PLAN.md): site home.

Build index.fr.md / index.en.md and the home.html layout, following screens/home.md:
mosaic of universes (just "french-renaissance-aristocracy" for now), alphabetical sort
by title, lazy loading of the cover image, empty and error states.

Done when: the test universe's card is displayed on the home page (in both languages)
and leads to its page.
```

## 4. Mosaic view of a universe ✅

Universe presentation and mosaic of characters sorted by number of relations. The switcher is visible but may point to a Graph view that does not exist yet. See `screens/universe-home.md`.

**Criterion:** the character cards are displayed, in the right order.

**Prompt:**
```
Implement step 4 of the build plan (BUILD-PLAN.md): Mosaic view of a universe.

Build mosaic.fr.md / mosaic.en.md and the universe.html layout, following
screens/universe-home.md: universe presentation, mosaic of characters sorted by
descending number of relations (computed from _data/<slug>/relations.yml), visible
switcher (it may point to a Graph view that does not exist yet at this stage).

Done when: the test universe's character cards are displayed, in the right order.
```

## 5. Character sheet in a modal ✅

Bootstrap modal, `fetch()` of the already generated character page, URL synchronization, navigation between related characters. See `screens/character-sheet.md`.

**Criterion:** a click opens the modal without a reload, the URL updates, and a direct link to that URL opens the modal on top of the Mosaic view.

**Prompt:**
```
Implement step 5 of the build plan (BUILD-PLAN.md): character sheet in a modal.

Build the characters/<slug>.fr.md / .en.md files for each character (if not already
done in step 2), the character.html layout, the character-modal.html include and
assets/js/character-modal.js, following screens/character-sheet.md: Bootstrap modal,
fetch() of the already generated character page, URL synchronization via pushState,
navigation to a related character without closing the modal.

Done when: a click on a character card (step 4) opens the modal without a reload, the
URL updates, and visiting that URL directly opens the modal on top of the Mosaic view.
```

## 6. Graph view ✅

D3 rendering (nodes, colored edges, arrows for directed types, zoom/pan), click on a node reusing the modal from step 5. See `screens/graph-view.md`.

**Criterion:** the switcher works both ways; the test universe's graph reads correctly.

**Prompt:**
```
Implement step 6 of the build plan (BUILD-PLAN.md): Graph view.

Build graph.fr.md / graph.en.md, the universe-graph.html layout and assets/js/graph.js,
following screens/graph-view.md: D3 rendering of nodes (portrait + name) and edges (color
by type from the categorical palette in style-guide.md, arrow for directed types),
zoom and pan, click on a node reusing the modal from step 5.

Done when: the Mosaic view / Graph view switcher works both ways, and the test
universe's graph reads correctly (nodes, edges, colors, arrow directions).
```

## 7. Search and filter ✅

Search bar and type filters on both views, with the graph legend that derives from them. See `screens/search-filter.md`.

**Criterion:** typing a name isolates the right elements; disabling a relation type hides the right edges.

**Prompt:**
```
Implement step 7 of the build plan (BUILD-PLAN.md): search and filter.

Build the search-filter.html include and assets/js/search-filter.js, following
screens/search-filter.md: search bar by name, filters by relation type (with a color
swatch, see style-guide.md), on both views (Mosaic and Graph), with the graph legend
that derives from them.

Done when: typing a name hides/isolates the right elements in both views; disabling
a relation type hides the right edges in the Graph view and the right cards in the Mosaic view.
```

## 8. Full multilingual support ✅

Language detection on first visit, `localStorage` persistence, `/fr/` prefix, unavailability message (`404.md`), translation of the test content. See "Multilingual" in `functional-specifications.md` and "Architecture" in `technical-specifications.md`.

**Criterion:** switching language keeps the context when the translation exists, and shows the message otherwise.

**Prompt:**
```
Implement step 8 of the build plan (BUILD-PLAN.md): full multilingual support.

Build assets/js/main.js (browser language detection on first visit, fallback to
English, persistence via localStorage) and 404.md (unavailability message localized
according to the /fr/ prefix), following "Multilingual" in functional-specifications.md and
"Architecture" in technical-specifications.md. Finish the French translation of the test
content created in step 2 if needed.

Done when: switching language via the selector keeps the navigation context when the
translation exists, and shows the unavailability message otherwise.
```

## 9. Character groups ✅

Adds the notion of group (faction, nationality, species...) to the data model, with its
visual treatment on the three screens involved (border and logo on the card, the graph
node and the modal) and its filters on both views. See "Group" in `data-model.md`,
the "Cards", "Modal" and "Search bar / filters" sections of `style-guide.md`, as well
as `universe-home.md`, `graph-view.md`, `character-sheet.md` and `search-filter.md`.

**Criterion:** a character from a given group has the right border and the right logo on its three
representations (card, node, modal); unchecking a group filter hides the right elements
in both views.

**Prompt:**
```
Implement step 9 of the build plan (BUILD-PLAN.md): character groups.

Add groups to french-renaissance-aristocracy (_data/french-renaissance-aristocracy/groups.yml,
logos in french-renaissance-aristocracy/groups/), following "Group" in data-model.md, and
assign a group to some of the test characters. Apply the visual treatment on the
three screens involved (5px top border + bottom-right logo on the character-card.html card;
border + bottom-right logo on the node in graph.js; 5px top border + top-left logo in
the character-modal.html modal), following the "Cards", "Modal" and "Images" sections of
style-guide.md, universe-home.md, graph-view.md and character-sheet.md. Add the group
filters in search-filter.html / search-filter.js, present on both views, following
search-filter.md.

Done when: on the test universe, a character from a group shows the right border and
the right logo on its card, its node and its modal; a character without a group shows a white
border and no logo; unchecking a group filter hides the right cards in the Mosaic view and
the right nodes (and their edges) in the Graph view.
```

## 10. SEO and polish ✅

`jekyll-seo-tag`, `jekyll-sitemap`, hreflang, then a manual check (keyboard, screen reader, actual on-screen contrast, not just the values computed in `style-guide.md`). See "SEO" and "Accessibility" in `technical-specifications.md`.

**Prompt:**
```
Implement step 10 of the build plan (BUILD-PLAN.md): SEO and polish.

Enable jekyll-seo-tag and jekyll-sitemap, add hreflang links between the FR/EN versions
of a same page, following "SEO" in technical-specifications.md. Then do a
manual check in the browser: keyboard navigation (especially the
modal), screen reader if possible, actual on-screen contrast (the values in
style-guide.md were computed, not visually tested).

Done when: sitemap.xml is generated, meta tags are present, and the modal closes and
reopens correctly with the keyboard.
```

## 11. Second universe ✅

A universe genuinely different from the first one, without any code change: the best proof that nothing is hard-coded for a single case.

**Prompt:**
```
Implement step 11 of the build plan (BUILD-PLAN.md): second universe.

Add a universe genuinely different from the first one (not a mere copy), following the
workflow in data-model.md ("Workflow for adding a universe"), without changing the code of
the previous steps.

Done when: the new universe works end to end (home, Mosaic view, Graph
view, character sheet, search/filter) only by adding content, without any code
change. If that is not the case, a previous step hard-coded assumptions
specific to the first universe: fix that before continuing.
```

## 12. Validation CI ✅

GitHub Actions workflow running `scripts/validate.rb` on every push/PR, without touching the native GitHub Pages deployment. See "Data validation" in `technical-specifications.md`.

**Criterion:** CI red on an intentional error, green otherwise.

**Prompt:**
```
Implement step 12 of the build plan (BUILD-PLAN.md): validation CI.

Create .github/workflows/validate.yml, which runs scripts/validate.rb on every push and
pull request, following "Data validation" in technical-specifications.md. Do not
touch the native GitHub Pages deployment.

Done when: CI fails on an intentionally introduced content error, and passes
once fixed.
```

---

Each step is a natural commit point. Before committing, check that the whole of `specs/` stays consistent with what was just implemented (see "Before each commit" in `CLAUDE.md`); if the implementation reveals that a spec must change, flag it before applying the update.
