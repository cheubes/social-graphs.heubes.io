document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("sg-search-filter");
  if (!root) return;

  const storageKey = "sg-search-filter:" + (root.dataset.universe || "");
  const searchInput = document.getElementById("sg-search-input");
  const checkboxes = Array.from(document.querySelectorAll(".sg-filter-checkbox"));
  const emptyMessage = document.getElementById("sg-search-filter-empty");
  const characterGrid = document.querySelector(".sg-character-grid");
  const graphContainer = document.getElementById("sg-graph");

  // Ensembles statiques (rendu Jekyll pour la Mosaïque, rendu D3 déjà terminé pour le
  // Graphe puisque graph.js s'exécute avant ce script) : seules des classes sont
  // togglées dessus par la suite, aucun élément n'est ajouté ou retiré.
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
      // sessionStorage indisponible (navigation privée, etc.) : le filtrage reste
      // fonctionnel, seule la persistance entre les deux vues est perdue.
    }
  }

  function currentDisabledTypes() {
    return checkboxes.filter((checkbox) => !checkbox.checked).map((checkbox) => checkbox.value);
  }

  // Vue Mosaïque : masque les tuiles dont le character-name ne correspond pas à la
  // recherche. Pas de filtre par type ici : les tuiles n'affichent aucune relation,
  // un filtre par type n'y aurait pas d'effet visuellement justifié (voir search-filter.md).
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

  // Vue Graphe : la recherche met en évidence/atténue les nœuds sans en retirer aucun ;
  // le filtre de type masque les arêtes du type désactivé, les nœuds restant affichés.
  // Retourne null quand la recherche est vide : l'état "vide" ne s'applique alors pas,
  // faute de recherche active à ne satisfaire.
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
