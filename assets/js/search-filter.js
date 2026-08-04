document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("sg-search-filter");
  if (!root) return;

  const storageKey = "sg-search-filter:" + (root.dataset.universe || "");
  const searchInput = document.getElementById("sg-search-input");
  const checkboxes = Array.from(document.querySelectorAll(".sg-filter-checkbox"));
  const groupCheckboxes = Array.from(document.querySelectorAll(".sg-group-filter-checkbox"));
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

  function saveState(query, disabledTypes, disabledGroups) {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ query, disabledTypes, disabledGroups }));
    } catch (error) {
      // sessionStorage unavailable (private browsing, etc.): filtering stays
      // functional, only persistence between the two views is lost.
    }
  }

  function currentDisabledValues(checkboxList) {
    return checkboxList.filter((checkbox) => !checkbox.checked).map((checkbox) => checkbox.value);
  }

  // Mosaic view: hides cards whose character-name doesn't match the search query,
  // or whose group is disabled. A character with no group is never hidden by a
  // group filter, the same way a character with no relation is never hidden by a
  // type filter (see search-filter.md).
  function applyMosaicFilters(query, disabledGroups) {
    let visibleCount = 0;
    characterCards.forEach((card) => {
      const name = (card.dataset.characterName || "").toLowerCase();
      const group = card.dataset.group || "";
      const matchesSearch = query === "" || name.includes(query);
      const hiddenByGroup = group !== "" && disabledGroups.includes(group);
      const visible = matchesSearch && !hiddenByGroup;
      const item = card.closest(".col");
      if (item) item.classList.toggle("d-none", !visible);
      if (visible) visibleCount++;
    });
    return visibleCount;
  }

  // Graph view: the search highlights/dims matching nodes without removing any of
  // them; the type filter hides edges of the disabled type, nodes stay displayed;
  // the group filter hides the nodes of the disabled group outright, along with
  // the edges attached to them (an edge can't stay visible with a hidden endpoint),
  // unlike the type filter which only ever hides edges (see search-filter.md).
  function applyGraphFilters(query, disabledTypes, disabledGroups) {
    let visibleCount = 0;
    const hiddenSlugs = new Set();
    graphNodes.forEach((node) => {
      const name = (node.dataset.name || "").toLowerCase();
      const group = node.dataset.group || "";
      const matchesSearch = query === "" || name.includes(query);
      const hiddenByGroup = group !== "" && disabledGroups.includes(group);
      node.classList.toggle("sg-graph-node-hidden", hiddenByGroup);
      node.classList.toggle("sg-graph-node-dimmed", !hiddenByGroup && query !== "" && !matchesSearch);
      if (hiddenByGroup) {
        hiddenSlugs.add(node.dataset.slug);
      } else if (matchesSearch) {
        visibleCount++;
      }
    });
    graphLinks.forEach((link) => {
      const hiddenByType = disabledTypes.includes(link.dataset.type);
      const hiddenByGroup = hiddenSlugs.has(link.dataset.source) || hiddenSlugs.has(link.dataset.target);
      link.classList.toggle("sg-graph-link-filtered", hiddenByType || hiddenByGroup);
    });
    return visibleCount;
  }

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const disabledTypes = currentDisabledValues(checkboxes);
    const disabledGroups = currentDisabledValues(groupCheckboxes);
    saveState(query, disabledTypes, disabledGroups);

    const visibleCount = characterGrid
      ? applyMosaicFilters(query, disabledGroups)
      : applyGraphFilters(query, disabledTypes, disabledGroups);
    if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
  }

  const stored = loadState();
  if (stored) {
    searchInput.value = stored.query || "";
    const disabledTypes = stored.disabledTypes || [];
    const disabledGroups = stored.disabledGroups || [];
    checkboxes.forEach((checkbox) => {
      checkbox.checked = !disabledTypes.includes(checkbox.value);
    });
    groupCheckboxes.forEach((checkbox) => {
      checkbox.checked = !disabledGroups.includes(checkbox.value);
    });
  }

  searchInput.addEventListener("input", applyFilters);
  checkboxes.forEach((checkbox) => checkbox.addEventListener("change", applyFilters));
  groupCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", applyFilters));

  applyFilters();
});
