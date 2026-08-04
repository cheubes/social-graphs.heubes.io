document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("sg-search-filter");
  if (!root) return;

  const storageKey = "sg-search-filter:" + (root.dataset.universe || "");
  const searchInput = document.getElementById("sg-search-input");
  const checkboxes = Array.from(document.querySelectorAll(".sg-filter-checkbox"));
  const emptyMessage = document.getElementById("sg-search-filter-empty");
  const characterGrid = document.querySelector(".sg-character-grid");
  const graphContainer = document.getElementById("sg-graph");

  // Static sets (Jekyll-rendered for Mosaic view, D3 rendering already done for
  // Graph view since graph.js runs before this script): only classes get toggled
  // on them afterward, no element is ever added or removed.
  const characterCards = characterGrid ? Array.from(characterGrid.querySelectorAll(".sg-character-link")) : [];
  const graphNodes = graphContainer ? Array.from(graphContainer.querySelectorAll(".sg-graph-node")) : [];
  const graphLinks = graphContainer ? Array.from(graphContainer.querySelectorAll(".sg-graph-link")) : [];

  function loadState() {
    try {
      const raw = sessionStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveState(query, disabledTypes) {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ query, disabledTypes }));
    } catch (error) {
      // sessionStorage unavailable (private browsing, etc.): filtering stays
      // functional, only persistence between the two views is lost.
    }
  }

  function currentDisabledTypes() {
    return checkboxes.filter((checkbox) => !checkbox.checked).map((checkbox) => checkbox.value);
  }

  // Mosaic view: hides cards whose character-name doesn't match the search query.
  // No type filter here: cards don't display any relation, so a type filter
  // wouldn't have a visually justified effect (see search-filter.md).
  function applyMosaicFilters(query) {
    let visibleCount = 0;
    characterCards.forEach((card) => {
      const name = (card.dataset.characterName || "").toLowerCase();
      const visible = query === "" || name.includes(query);
      const item = card.closest(".col");
      if (item) item.classList.toggle("d-none", !visible);
      if (visible) visibleCount++;
    });
    return visibleCount;
  }

  // Graph view: the search highlights/dims nodes without removing any of them;
  // the type filter hides edges of the disabled type, nodes stay displayed.
  // Returns null when the search is empty: the "empty" state doesn't apply then,
  // since there's no active search to fail to match.
  function applyGraphFilters(query, disabledTypes) {
    let matchCount = 0;
    graphNodes.forEach((node) => {
      const name = (node.dataset.name || "").toLowerCase();
      const matches = query === "" || name.includes(query);
      node.classList.toggle("sg-graph-node-dimmed", query !== "" && !matches);
      if (matches) matchCount++;
    });
    graphLinks.forEach((link) => {
      link.classList.toggle("sg-graph-link-filtered", disabledTypes.includes(link.dataset.type));
    });
    return query === "" ? null : matchCount;
  }

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const disabledTypes = currentDisabledTypes();
    saveState(query, disabledTypes);

    const visibleCount = characterGrid ? applyMosaicFilters(query) : applyGraphFilters(query, disabledTypes);
    if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
  }

  const stored = loadState();
  if (stored) {
    searchInput.value = stored.query || "";
    const disabledTypes = stored.disabledTypes || [];
    checkboxes.forEach((checkbox) => {
      checkbox.checked = !disabledTypes.includes(checkbox.value);
    });
  }

  searchInput.addEventListener("input", applyFilters);
  checkboxes.forEach((checkbox) => checkbox.addEventListener("change", applyFilters));

  applyFilters();
});
