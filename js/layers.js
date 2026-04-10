// Elementum — Layers Module
// Manages color layers toggled via the pill button bar

(function () {
  // ─── Layer definitions ────────────────────────────────────────────────────

  const LAYERS = [
    {
      id: "default",
      label: "Categorías",
      type: "category",
      legend: categoryLegend,
      apply: applyCategory,
    },
    {
      id: "clasificacion",
      label: "Clasificación",
      type: "classification",
      legend: classificationLegend,
      apply: applyClassification,
    },
    {
      id: "bloques",
      label: "Bloques",
      type: "block",
      legend: blockLegend,
      apply: applyBlock,
    },
    {
      id: "familias",
      label: "Familias",
      type: "family",
      legend: familyLegend,
      apply: applyFamily,
    },
    {
      id: "electronegatividad",
      label: "Electronegatividad",
      type: "gradient",
      legend: enLegend,
      apply: applyEN,
    },
    {
      id: "radio",
      label: "Radio Atómico",
      type: "gradient",
      legend: radiusLegend,
      apply: applyRadius,
    },
    {
      id: "ionizacion",
      label: "Energía de Ionización",
      type: "gradient",
      legend: ionizationLegend,
      apply: applyIonization,
    },
    {
      id: "enlace",
      label: "Tipo de Enlace",
      type: "bond",
      legend: bondLegend,
      apply: applyBond,
    },
  ];

  // ─── Color maps ───────────────────────────────────────────────────────────

  const CATEGORY_COLORS = {
    "metal-alcalino":       "#ef4444",
    "metal-alcalinoterreo": "#f97316",
    "metal-transicion":     "#eab308",
    "metal-post-transicion":"#84cc16",
    "metaloide":            "#14b8a6",
    "no-metal":             "#22d3ee",
    "halogeno":             "#a855f7",
    "gas-noble":            "#ec4899",
    "lantanido":            "#f59e0b",
    "actinido":             "#78716c",
  };

  const CATEGORY_LABELS = {
    "metal-alcalino":       "Metal alcalino",
    "metal-alcalinoterreo": "Metal alcalinoterreo",
    "metal-transicion":     "Metal de transición",
    "metal-post-transicion":"Metal post-transición",
    "metaloide":            "Metaloide",
    "no-metal":             "No metal",
    "halogeno":             "Halógeno",
    "gas-noble":            "Gas noble",
    "lantanido":            "Lantánido",
    "actinido":             "Actínido",
  };

  const BLOCK_COLORS = {
    "s": "#7c3aed",
    "p": "#0ea5e9",
    "d": "#10b981",
    "f": "#f59e0b",
  };

  const FAMILY_COLORS = {
    1:  "#ef4444",
    2:  "#f97316",
    3:  "#f59e0b",
    4:  "#eab308",
    5:  "#84cc16",
    6:  "#22c55e",
    7:  "#10b981",
    8:  "#14b8a6",
    9:  "#06b6d4",
    10: "#0ea5e9",
    11: "#3b82f6",
    12: "#6366f1",
    13: "#8b5cf6",
    14: "#a855f7",
    15: "#d946ef",
    16: "#ec4899",
    17: "#f43f5e",
    18: "#94a3b8",
  };

  const BOND_COLORS = {
    "iónico":        "#ef4444",
    "covalente":     "#22d3ee",
    "covalente polar":"#a855f7",
    "metálico":      "#eab308",
    "ninguno":       "#475569",
  };

  const BOND_LABELS = {
    "iónico":        "Iónico",
    "covalente":     "Covalente",
    "covalente polar":"Covalente polar",
    "metálico":      "Metálico",
    "ninguno":       "Sin enlace",
  };

  // ─── Gradient helpers ─────────────────────────────────────────────────────

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function gradientColor(value, min, max, colorA, colorB) {
    if (value === null || value === undefined) return "#1f2937";
    const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const aR = parseInt(colorA.slice(1, 3), 16);
    const aG = parseInt(colorA.slice(3, 5), 16);
    const aB = parseInt(colorA.slice(5, 7), 16);
    const bR = parseInt(colorB.slice(1, 3), 16);
    const bG = parseInt(colorB.slice(3, 5), 16);
    const bB = parseInt(colorB.slice(5, 7), 16);
    const r = Math.round(lerp(aR, bR, t));
    const g = Math.round(lerp(aG, bG, t));
    const b = Math.round(lerp(aB, bB, t));
    return `rgb(${r},${g},${b})`;
  }

  // ─── Apply functions ──────────────────────────────────────────────────────

  function applyCategory(cells) {
    cells.forEach(cell => {
      const el = getElement(cell);
      if (!el) return;
      cell.style.backgroundColor = CATEGORY_COLORS[el.category] || "#1f2937";
    });
  }

  function applyClassification(cells) {
    const map = {
      "metal-alcalino":       "#3b82f6",
      "metal-alcalinoterreo": "#3b82f6",
      "metal-transicion":     "#3b82f6",
      "metal-post-transicion":"#3b82f6",
      "lantanido":            "#3b82f6",
      "actinido":             "#3b82f6",
      "metaloide":            "#10b981",
      "no-metal":             "#f97316",
      "halogeno":             "#f97316",
      "gas-noble":            "#f97316",
    };
    cells.forEach(cell => {
      const el = getElement(cell);
      if (!el) return;
      cell.style.backgroundColor = map[el.category] || "#1f2937";
    });
  }

  function applyBlock(cells) {
    cells.forEach(cell => {
      const el = getElement(cell);
      if (!el) return;
      cell.style.backgroundColor = BLOCK_COLORS[el.block] || "#1f2937";
    });
  }

  function applyFamily(cells) {
    cells.forEach(cell => {
      const el = getElement(cell);
      if (!el) return;
      cell.style.backgroundColor = el.group ? (FAMILY_COLORS[el.group] || "#78716c") : "#78716c";
    });
  }

  function applyEN(cells) {
    const values = ELEMENTS.map(e => e.electronegativity).filter(v => v !== null);
    const min = Math.min(...values);
    const max = Math.max(...values);
    cells.forEach(cell => {
      const el = getElement(cell);
      if (!el) return;
      cell.style.backgroundColor = gradientColor(el.electronegativity, min, max, "#1e3a5f", "#00d4ff");
    });
  }

  function applyRadius(cells) {
    const values = ELEMENTS.map(e => e.atomicRadius).filter(v => v !== null);
    const min = Math.min(...values);
    const max = Math.max(...values);
    cells.forEach(cell => {
      const el = getElement(cell);
      if (!el) return;
      cell.style.backgroundColor = gradientColor(el.atomicRadius, min, max, "#0c4a6e", "#7dd3fc");
    });
  }

  function applyIonization(cells) {
    const values = ELEMENTS.map(e => e.ionizationEnergy).filter(v => v !== null);
    const min = Math.min(...values);
    const max = Math.max(...values);
    cells.forEach(cell => {
      const el = getElement(cell);
      if (!el) return;
      cell.style.backgroundColor = gradientColor(el.ionizationEnergy, min, max, "#14532d", "#fca5a5");
    });
  }

  function applyBond(cells) {
    cells.forEach(cell => {
      const el = getElement(cell);
      if (!el) return;
      cell.style.backgroundColor = BOND_COLORS[el.typicalBond] || "#1f2937";
    });
  }

  // ─── Legend builders ──────────────────────────────────────────────────────

  function makeLegendItems(items) {
    return items.map(([color, label]) =>
      `<div class="legend-item"><span class="legend-swatch" style="background:${color}"></span><span>${label}</span></div>`
    ).join("");
  }

  function makeGradientLegend(colorA, colorB, labelLow, labelHigh) {
    return `
      <div class="legend-gradient-bar" style="background:linear-gradient(to right,${colorA},${colorB})"></div>
      <div class="legend-gradient-labels">
        <span>${labelLow}</span><span>${labelHigh}</span>
      </div>
      <div class="legend-item"><span class="legend-swatch" style="background:#1f2937"></span><span>Sin datos</span></div>
    `;
  }

  function categoryLegend() {
    return makeLegendItems(Object.entries(CATEGORY_COLORS).map(([k, v]) => [v, CATEGORY_LABELS[k]]));
  }

  function classificationLegend() {
    return makeLegendItems([
      ["#3b82f6", "Metal"],
      ["#10b981", "Metaloide"],
      ["#f97316", "No metal / Gas noble"],
    ]);
  }

  function blockLegend() {
    return makeLegendItems([
      [BLOCK_COLORS.s, "Bloque s"],
      [BLOCK_COLORS.p, "Bloque p"],
      [BLOCK_COLORS.d, "Bloque d"],
      [BLOCK_COLORS.f, "Bloque f"],
    ]);
  }

  function familyLegend() {
    return makeLegendItems(
      Object.entries(FAMILY_COLORS).map(([g, c]) => [c, `Grupo ${g}`])
    );
  }

  function enLegend() {
    return makeGradientLegend("#1e3a5f", "#00d4ff", "Baja EN (0.7)", "Alta EN (3.98)");
  }

  function radiusLegend() {
    return makeGradientLegend("#0c4a6e", "#7dd3fc", "Pequeño (31 pm)", "Grande (298 pm)");
  }

  function ionizationLegend() {
    return makeGradientLegend("#14532d", "#fca5a5", "Baja (376 kJ/mol)", "Alta (2372 kJ/mol)");
  }

  function bondLegend() {
    return makeLegendItems(Object.entries(BOND_COLORS).map(([k, v]) => [v, BOND_LABELS[k]]));
  }

  // ─── Utility ──────────────────────────────────────────────────────────────

  function getElement(cell) {
    const z = parseInt(cell.dataset.z);
    return ELEMENTS.find(e => e.z === z) || null;
  }

  function getAllElementCells() {
    return Array.from(document.querySelectorAll(".element-cell[data-z]"));
  }

  function resetCellColors(cells) {
    cells.forEach(cell => {
      cell.style.backgroundColor = "";
    });
  }

  // ─── Active layer state ───────────────────────────────────────────────────

  let activeLayerId = "default";

  function activateLayer(layerId) {
    const layer = LAYERS.find(l => l.id === layerId);
    if (!layer) return;

    activeLayerId = layerId;

    // Update buttons
    document.querySelectorAll(".layer-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.layer === layerId);
    });

    const cells = getAllElementCells();
    resetCellColors(cells);

    // Small timeout so CSS transition sees the reset
    requestAnimationFrame(() => {
      layer.apply(cells);
      updateLegend(layer);
    });
  }

  function updateLegend(layer) {
    const legend = document.getElementById("legend-panel");
    if (!legend) return;
    legend.innerHTML = `<div class="legend-title">${layer.label}</div>` + layer.legend();
  }

  // ─── Build layer bar ──────────────────────────────────────────────────────

  function buildLayerBar() {
    const bar = document.getElementById("layer-bar");
    if (!bar) return;

    LAYERS.forEach(layer => {
      const btn = document.createElement("button");
      btn.className = "layer-btn";
      btn.dataset.layer = layer.id;
      btn.textContent = layer.label;
      btn.addEventListener("click", () => activateLayer(layer.id));
      bar.appendChild(btn);
    });
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  document.addEventListener("DOMContentLoaded", () => {
    buildLayerBar();
    // Activate default after render.js has built cells
    setTimeout(() => activateLayer("default"), 50);
  });
})();
