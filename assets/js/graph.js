document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("sg-graph");
  const dataScript = document.getElementById("sg-graph-data");
  if (!container || !dataScript || typeof d3 === "undefined") return;

  const graphData = JSON.parse(dataScript.textContent);
  const placeholderSrc = graphData.placeholder;
  const nodesData = graphData.nodes;
  const nodeById = new Map(nodesData.map((node) => [node.slug, node]));
  const edgesData = graphData.edges.filter(
    (edge) => nodeById.has(edge.source) && nodeById.has(edge.target)
  );

  const NODE_RADIUS = 24;
  const CURVE_SPACING = 24;
  const MIN_ZOOM = 0.2;
  const MAX_ZOOM = 4;
  const FIT_MAX_ZOOM = 1.5;
  const ZOOM_STEP = 1.3;

  computeParallelEdgeOffsets(edgesData);

  renderLegend(graphData.legend);
  if (edgesData.length === 0) {
    showEmptyMessage();
  }

  container.innerHTML = "";
  const width = container.clientWidth || 600;
  const height = container.clientHeight || 500;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("class", "sg-graph-svg")
    .attr("viewBox", [0, 0, width, height]);

  const zoomLayer = svg.append("g");
  const zoom = d3.zoom().scaleExtent([MIN_ZOOM, MAX_ZOOM]).on("zoom", (event) => {
    zoomLayer.attr("transform", event.transform);
  });
  svg.call(zoom);

  const zoomInBtn = document.getElementById("sg-graph-zoom-in");
  const zoomOutBtn = document.getElementById("sg-graph-zoom-out");
  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      svg.transition().duration(200).call(zoom.scaleBy, ZOOM_STEP);
    });
  }
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      svg.transition().duration(200).call(zoom.scaleBy, 1 / ZOOM_STEP);
    });
  }

  const directedColorIndices = [...new Set(edgesData.filter((edge) => edge.directed).map((edge) => edge.colorIndex))];

  const defs = svg.append("defs");
  directedColorIndices.forEach((colorIndex) => {
    defs
      .append("marker")
      .attr("id", "sg-graph-arrow-" + colorIndex)
      .attr("markerUnits", "userSpaceOnUse")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 9)
      .attr("refY", 0)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("fill", `var(--sg-graph-color-${colorIndex})`);
  });

  const simulation = d3
    .forceSimulation(nodesData)
    .force("link", d3.forceLink(edgesData).id((d) => d.slug).distance(120))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(NODE_RADIUS + 16))
    // forceCenter only re-centers the average position of all nodes; it does not pull a
    // disconnected component (a character with no relation to the rest) back toward the
    // others, so charge repulsion alone pushes it away indefinitely. These add a gentle,
    // per-node pull toward the center to keep disconnected clusters close to the main one.
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05))
    .stop();

  // Settle the layout synchronously before the first paint, instead of animating nodes
  // flying in from the center: avoids the initial frame where most of them sit off-screen.
  simulation.tick(300);

  const link = zoomLayer
    .append("g")
    .attr("class", "sg-graph-links")
    .selectAll("path")
    .data(edgesData)
    .join("path")
    .attr("class", "sg-graph-link")
    .attr("data-color-index", (d) => d.colorIndex)
    .style("stroke", (d) => d.color)
    .attr("marker-end", (d) => (d.directed ? `url(#sg-graph-arrow-${d.colorIndex})` : null))
    .on("mouseenter", (event, d) => {
      if (!pinned) showEdgeTooltip(event, d);
    })
    .on("mouseleave", () => {
      if (!pinned) hideTooltip();
    })
    .on("click", (event, d) => {
      event.stopPropagation();
      pinned = true;
      showEdgeTooltip(event, d);
    });

  const node = zoomLayer
    .append("g")
    .attr("class", "sg-graph-nodes")
    .selectAll("g")
    .data(nodesData)
    .join("g")
    .attr("class", "sg-graph-node")
    .call(drag(simulation))
    .on("click", (event, d) => {
      event.stopPropagation();
      pinned = false;
      hideTooltip();
      if (window.sgCharacterModal) window.sgCharacterModal.open(d.url, true);
    });

  node.append("title").text((d) => d.name);

  node
    .append("clipPath")
    .attr("id", (d) => "sg-graph-clip-" + d.slug)
    .append("circle")
    .attr("r", NODE_RADIUS);

  node
    .append("circle")
    .attr("class", "sg-graph-node-ring")
    .attr("r", NODE_RADIUS);

  node
    .append("image")
    .attr("class", "sg-graph-node-portrait")
    .attr("x", -NODE_RADIUS)
    .attr("y", -NODE_RADIUS)
    .attr("width", NODE_RADIUS * 2)
    .attr("height", NODE_RADIUS * 2)
    .attr("preserveAspectRatio", "xMidYMid slice")
    .attr("clip-path", (d) => `url(#sg-graph-clip-${d.slug})`)
    .attr("href", (d) => d.portrait)
    .on("error", function () {
      d3.select(this).attr("href", placeholderSrc);
    });

  const label = node.append("g").attr("class", "sg-graph-node-label");

  const labelText = label
    .append("text")
    .attr("class", "sg-graph-node-label-text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .text((d) => d.name);

  labelText.each(function () {
    const padding = 3;
    const bbox = this.getBBox();
    d3.select(this.parentNode)
      .insert("rect", "text")
      .attr("class", "sg-graph-node-label-bg")
      .attr("x", bbox.x - padding)
      .attr("y", bbox.y - padding)
      .attr("width", bbox.width + padding * 2)
      .attr("height", bbox.height + padding * 2);
  });

  function draw() {
    link.attr("d", edgePath);
    node.attr("transform", (d) => `translate(${d.x},${d.y})`);
  }

  draw();
  fitToView();
  simulation.on("tick", draw);

  function fitToView() {
    const padding = NODE_RADIUS + 20;
    const [minX, maxX] = d3.extent(nodesData, (d) => d.x);
    const [minY, maxY] = d3.extent(nodesData, (d) => d.y);
    const graphWidth = maxX - minX + padding * 2;
    const graphHeight = maxY - minY + padding * 2;
    if (!(graphWidth > 0) || !(graphHeight > 0)) return;

    // Floor matches scaleExtent's minimum: zoom.transform() below applies the transform as-is,
    // unlike scaleBy/scaleTo which constrain to scaleExtent themselves, so a lower scale here
    // would make the first scaleBy-driven click (zoom button or wheel) snap back into range
    // instead of adjusting smoothly. Capped well under scaleExtent's max so a small/sparse
    // graph isn't blown up to fill the view on load.
    const rawScale = Math.min(width / graphWidth, height / graphHeight);
    const scale = Math.min(FIT_MAX_ZOOM, Math.max(MIN_ZOOM, rawScale));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const transform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(scale)
      .translate(-centerX, -centerY);

    svg.call(zoom.transform, transform);
  }

  svg.on("click", () => {
    pinned = false;
    hideTooltip();
  });

  function computeParallelEdgeOffsets(edges) {
    const pairGroups = new Map();
    edges.forEach((edge) => {
      const pairSlugs = [edge.source, edge.target].sort();
      edge.pairMinSlug = pairSlugs[0];
      edge.pairMaxSlug = pairSlugs[1];
      const key = pairSlugs.join("|");
      if (!pairGroups.has(key)) pairGroups.set(key, []);
      pairGroups.get(key).push(edge);
    });
    pairGroups.forEach((group) => {
      group.forEach((edge, index) => {
        edge.linkIndex = index;
        edge.linkCount = group.length;
      });
    });
  }

  function shortenedPoint(source, target) {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    const offset = NODE_RADIUS + 2;
    return {
      x: target.x - (dx / distance) * offset,
      y: target.y - (dy / distance) * offset,
    };
  }

  function edgePath(d) {
    const source = d.source;
    const target = shortenedPoint(d.source, d.target);

    if (d.linkCount <= 1) {
      return `M${source.x},${source.y} L${target.x},${target.y}`;
    }

    // Direction based on the pair's canonical (alphabetical) order, not this edge's own
    // source/target, so that two edges stored in opposite directions curve to opposite
    // sides instead of cancelling each other out.
    const pairSource = nodeById.get(d.pairMinSlug);
    const pairTarget = nodeById.get(d.pairMaxSlug);
    const dx = pairTarget.x - pairSource.x;
    const dy = pairTarget.y - pairSource.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    const normalX = -dy / distance;
    const normalY = dx / distance;
    const centeredIndex = d.linkIndex - (d.linkCount - 1) / 2;
    const offset = centeredIndex * CURVE_SPACING;
    const controlX = (source.x + target.x) / 2 + normalX * offset;
    const controlY = (source.y + target.y) / 2 + normalY * offset;

    return `M${source.x},${source.y} Q${controlX},${controlY} ${target.x},${target.y}`;
  }

  function drag(sim) {
    function dragstarted(event, d) {
      if (!event.active) sim.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event, d) {
      if (!event.active) sim.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
  }

  let pinned = false;
  const tooltip = document.createElement("div");
  tooltip.className = "sg-graph-tooltip";
  tooltip.hidden = true;
  container.appendChild(tooltip);

  function showEdgeTooltip(event, d) {
    tooltip.textContent = "";
    const strong = document.createElement("strong");
    strong.textContent = `${d.source.name} ${d.label} ${d.target.name}`;
    tooltip.appendChild(strong);
    if (d.description) {
      const description = document.createElement("p");
      description.textContent = d.description;
      tooltip.appendChild(description);
    }
    tooltip.hidden = false;
    positionTooltip(event);
  }

  function positionTooltip(event) {
    const rect = container.getBoundingClientRect();
    tooltip.style.left = event.clientX - rect.left + 12 + "px";
    tooltip.style.top = event.clientY - rect.top + 12 + "px";
  }

  function hideTooltip() {
    tooltip.hidden = true;
  }

  function renderLegend(legend) {
    const list = document.getElementById("sg-graph-legend-list");
    if (!list) return;
    legend.forEach((entry) => {
      const item = document.createElement("li");
      item.className = "sg-legend-item";

      const swatch = document.createElement("span");
      swatch.className = "sg-legend-swatch";
      swatch.style.backgroundColor = entry.color;

      const label = document.createElement("span");
      label.textContent = entry.label;

      item.appendChild(swatch);
      item.appendChild(label);
      list.appendChild(item);
    });
  }

  function showEmptyMessage() {
    const message = document.createElement("p");
    message.className = "sg-graph-empty";
    message.textContent = container.dataset.emptyText || "";
    container.insertAdjacentElement("afterend", message);
  }
});
