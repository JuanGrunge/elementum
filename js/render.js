// Elementum — Render Module
// Builds the CSS Grid periodic table from ELEMENTS data

(function () {
  const GRID_COLS = 18;
  const GRID_ROWS = 7;

  // Map of [period, group] → element for quick lookup
  const byPosition = new Map();
  const lanthanides = [];
  const actinides = [];

  ELEMENTS.forEach(el => {
    if (el.group === null) {
      if (el.category === "lantanido") lanthanides.push(el);
      else actinides.push(el);
    } else {
      byPosition.set(`${el.period},${el.group}`, el);
    }
  });

  // Lanthanides: period 6, groups 3-17 (f-block slot)
  // Actinides:   period 7, groups 3-17 (f-block slot)
  // Sorted by Z
  lanthanides.sort((a, b) => a.z - b.z);
  actinides.sort((a, b) => a.z - b.z);

  function createCell(el) {
    const cell = document.createElement("div");
    cell.className = `element-cell category-${el.category} block-${el.block}`;
    cell.dataset.z = el.z;
    cell.setAttribute("title", el.name);

    cell.innerHTML = `
      <span class="cell-z">${el.z}</span>
      <span class="cell-symbol">${el.symbol}</span>
      <span class="cell-name">${el.name}</span>
      <span class="cell-mass">${formatMass(el.mass)}</span>
    `;

    cell.addEventListener("click", () => {
      window.__showElementDetail(el);
    });

    return cell;
  }

  function formatMass(mass) {
    // Show integer in parentheses for synthetic elements (no stable isotope)
    if (Number.isInteger(mass)) return `(${mass})`;
    return mass.toFixed(3);
  }

  function createEmptyCell(col, row) {
    const cell = document.createElement("div");
    cell.className = "element-cell empty";
    cell.style.gridColumn = col;
    cell.style.gridRow = row;
    return cell;
  }

  function renderMainTable() {
    const grid = document.getElementById("main-table");
    if (!grid) return;

    for (let period = 1; period <= GRID_ROWS; period++) {
      for (let group = 1; group <= GRID_COLS; group++) {
        const key = `${period},${group}`;
        const el = byPosition.get(key);

        if (el) {
          const cell = createCell(el);
          cell.style.gridColumn = group;
          cell.style.gridRow = period;
          grid.appendChild(cell);
        } else {
          // Lanthanide/actinide placeholder stub in period 6/7, col 3
          if ((period === 6 && group === 3) || (period === 7 && group === 3)) {
            const stub = document.createElement("div");
            stub.className = "element-cell placeholder-stub";
            stub.style.gridColumn = group;
            stub.style.gridRow = period;
            const label = period === 6 ? "57–71" : "89–103";
            const seriesLabel = period === 6 ? "La–Lu" : "Ac–Lr";
            stub.innerHTML = `<span class="stub-range">${label}</span><span class="stub-label">${seriesLabel}</span>`;
            grid.appendChild(stub);
          }
          // other empty cells are implicit in CSS grid auto-placement with explicit positioning
        }
      }
    }
  }

  function renderFBlock(container, elements, seriesLabel) {
    const wrapper = document.createElement("div");
    wrapper.className = "fblock-row";

    const label = document.createElement("div");
    label.className = "fblock-label";
    label.textContent = seriesLabel;
    wrapper.appendChild(label);

    const cells = document.createElement("div");
    cells.className = "fblock-cells";

    elements.forEach(el => {
      cells.appendChild(createCell(el));
    });

    wrapper.appendChild(cells);
    container.appendChild(wrapper);
  }

  function render() {
    renderMainTable();

    const fbContainer = document.getElementById("fblock-container");
    if (!fbContainer) return;
    renderFBlock(fbContainer, lanthanides, "Lantánidos");
    renderFBlock(fbContainer, actinides, "Actínidos");
  }

  // Expose render function
  document.addEventListener("DOMContentLoaded", render);
})();
