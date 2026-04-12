// Elementum — Detail Panel Module
// Slide-in panel showing full element information on cell click

(function () {

  // ─── Quantum number helpers ───────────────────────────────────────────────

  // Returns the quantum numbers of the last electron in the ground state config
  function getLastElectronQN(el) {
    // Parse electronConfig to find the outermost orbital
    // We match patterns like 4f¹⁴, 3d⁵, 2p⁶, 1s²
    const superscriptMap = {
      '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4',
      '⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9',
    };

    function parseSuperscript(str) {
      return parseInt([...str].map(c => superscriptMap[c] || c).join("")) || 1;
    }

    const orbitalRegex = /(\d+)([spdf])([\u00B9\u00B2\u00B3\u2074-\u2079\u00B9\u00B2\u00B3\u2070-\u2079]+)?/g;
    const matches = [];
    let m;
    const config = el.electronConfig.replace(/\[.*?\]/g, "");
    while ((m = orbitalRegex.exec(config)) !== null) {
      const n = parseInt(m[1]);
      const subshell = m[2];
      const electrons = m[3] ? parseSuperscript(m[3]) : 1;
      matches.push({ n, subshell, electrons });
    }

    if (matches.length === 0) return null;

    // The last orbital entry
    const last = matches[matches.length - 1];
    const lMap = { s: 0, p: 1, d: 2, f: 3 };
    const l = lMap[last.subshell];

    // ml ranges from -l to +l; fill sequentially (Hund's rule simplified)
    // Total slots = 2*(2l+1)
    const maxSlots = 2 * (2 * l + 1);
    const e = last.electrons;

    // ml of the last electron: fill +l first down to -l (simplified)
    // First half: spin up, ml = l, l-1, ..., -l
    // Second half: spin down, ml = l, l-1, ..., -l
    let ml, ms;
    if (e <= (2 * l + 1)) {
      // Spin-up phase
      ml = l - (e - 1);
      ms = "+½";
    } else {
      // Spin-down phase (pairing)
      const pairedIndex = e - (2 * l + 1) - 1;
      ml = l - pairedIndex;
      ms = "–½";
    }

    return { n: last.n, l, ml, ms, subshell: last.subshell };
  }

  // ─── Bond explanations ────────────────────────────────────────────────────

  const BOND_EXPLANATIONS = {
    "iónico": "Se produce cuando la diferencia de electronegatividad es ≥ 1.7. Un átomo cede electrones al otro, formando iones de carga opuesta que se atraen electrostáticamente.",
    "covalente": "Ocurre entre no metales con electronegatividades similares. Ambos átomos comparten electrones de forma aproximadamente equitativa. Un caso especial es el enlace covalente dativo o coordinado, donde un solo átomo aporta ambos electrones del par compartido (ej: NH₃ + H⁺ → NH₄⁺).",
    "covalente polar": "Se da cuando dos no metales comparten electrones pero con diferencia de electronegatividad entre 0.5 y 1.7, creando un dipolo parcial (δ⁺/δ⁻).",
    "metálico": "Los metales ceden sus electrones de valencia a una «nube» o «mar» de electrones deslocalizados, que genera conductividad eléctrica y maleabilidad.",
    "ninguno": "Los gases nobles tienen configuración electrónica completa (octeto o dueto para He) y no forman enlaces en condiciones normales.",
  };

  // ─── Category labels ──────────────────────────────────────────────────────

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

  const BLOCK_LABELS = { s: "Bloque s", p: "Bloque p", d: "Bloque d", f: "Bloque f" };

  const L_LABELS = ["s (l=0)", "p (l=1)", "d (l=2)", "f (l=3)"];

  // ─── Render detail panel ──────────────────────────────────────────────────

  function fmt(val, unit = "", quality = null) {
    if (val === null || val === undefined) return '<span class="na">N/D</span>';
    const badge = quality
      ? `<span class="data-quality-badge data-quality-${quality}">${quality}</span>`
      : "";
    return `${val}${unit}${badge}`;
  }

  function renderPanel(el) {
    const qn = getLastElectronQN(el);

    let qnSection = '<p class="na-note">Configuración no analizable automáticamente.</p>';
    if (qn) {
      qnSection = `
        <table class="detail-table">
          <tr><th>Número</th><th>Símbolo</th><th>Valor</th><th>Descripción</th></tr>
          <tr>
            <td>Principal</td><td><em>n</em></td><td>${qn.n}</td>
            <td>Nivel de energía (capa). n = ${qn.n} → capa ${qn.n}.</td>
          </tr>
          <tr>
            <td>Azimutal</td><td><em>l</em></td><td>${qn.l}</td>
            <td>Forma del orbital: ${L_LABELS[qn.l] || qn.subshell}.</td>
          </tr>
          <tr>
            <td>Magnético</td><td><em>m<sub>l</sub></em></td><td>${qn.ml}</td>
            <td>Orientación espacial del orbital (de –l a +l).</td>
          </tr>
          <tr>
            <td>Espín</td><td><em>m<sub>s</sub></em></td><td>${qn.ms}</td>
            <td>${qn.ms === "+½" ? "Espín hacia arriba (↑), primer electrón en ese orbital." : "Espín hacia abajo (↓), segundo electrón emparejado."}</td>
          </tr>
        </table>
      `;
    }

    return `
      <!-- 1. Header -->
      <div class="panel-header">
        <div class="panel-symbol-block">
          <span class="panel-symbol">${el.symbol}</span>
          <div class="panel-meta">
            <span class="panel-name">${el.name}</span>
            <span class="panel-category">${CATEGORY_LABELS[el.category] || el.category}</span>
          </div>
        </div>
        <div class="panel-zm">
          <div class="panel-zm-item"><span class="panel-zm-label">Z</span><span class="panel-zm-value">${el.z}</span></div>
          <div class="panel-zm-item"><span class="panel-zm-label">Masa</span><span class="panel-zm-value">${el.mass} u</span></div>
        </div>
      </div>

      <!-- 2. Estructura atómica -->
      <section class="panel-section">
        <h3>Estructura Atómica</h3>
        <div class="config-box">${el.electronConfig}</div>
        <table class="detail-table">
          <tr><td>Electrones de valencia</td><td>${el.valenceElectrons}</td></tr>
          <tr><td>Bloque</td><td>${BLOCK_LABELS[el.block]}</td></tr>
          <tr><td>Grupo</td><td>${el.group !== null ? el.group : "—"}</td></tr>
          <tr><td>Período</td><td>${el.period}</td></tr>
        </table>
      </section>

      <!-- 3. Números cuánticos -->
      <section class="panel-section">
        <h3>Números Cuánticos (último electrón)</h3>
        ${qnSection}
      </section>

      <!-- 4. Propiedades periódicas -->
      <section class="panel-section">
        <h3>Propiedades Periódicas</h3>
        <table class="detail-table">
          <tr><th>Propiedad</th><th>Valor</th></tr>
          <tr><td>Electronegatividad (Pauling)</td><td>${fmt(el.electronegativity)}</td></tr>
          <tr><td>Radio atómico</td><td>${fmt(el.atomicRadius, " pm")}</td></tr>
          <tr><td>Volumen atómico</td><td>${fmt(el.atomicVolume, " cm³/mol", el.dataQuality?.atomicVolume ?? null)}</td></tr>
          <tr><td>Energía de ionización</td><td>${fmt(el.ionizationEnergy, " kJ/mol")}</td></tr>
          <tr><td>Afinidad electrónica</td><td>${fmt(el.electronAffinity, " kJ/mol", el.dataQuality?.electronAffinity ?? null)}</td></tr>
        </table>
      </section>

      <!-- 5. Enlace químico -->
      <section class="panel-section">
        <h3>Enlace Químico</h3>
        <div class="bond-tag bond-${el.typicalBond.replace(/\s+/g, '-')}">${el.typicalBond.charAt(0).toUpperCase() + el.typicalBond.slice(1)}</div>
        ${el.electronegativity !== null ? `
        <div class="delta-en-box">
          <strong>ΔEN del elemento: ${el.electronegativity}</strong> (escala Pauling)<br>
          Regla: ΔEN entre átomos enlazados determina el tipo de enlace<br>
          0 = apolar · 0–1.7 = polar · ≥1.7 = iónico
        </div>` : ""}
        <p class="bond-explanation">${BOND_EXPLANATIONS[el.typicalBond] || ""}</p>
      </section>
    `;
  }

  // ─── Panel open/close ─────────────────────────────────────────────────────

  function openPanel(el) {
    const panel = document.getElementById("detail-panel");
    const content = document.getElementById("panel-content");
    if (!panel || !content) return;

    content.innerHTML = renderPanel(el);
    panel.classList.add("open");
  }

  function closePanel() {
    const panel = document.getElementById("detail-panel");
    if (panel) panel.classList.remove("open");
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.getElementById("panel-close");
    if (closeBtn) closeBtn.addEventListener("click", closePanel);

    // Close on outside click
    document.addEventListener("click", e => {
      const panel = document.getElementById("detail-panel");
      if (!panel) return;
      if (panel.classList.contains("open") &&
          !panel.contains(e.target) &&
          !e.target.closest(".element-cell")) {
        closePanel();
      }
    });
  });

  // Expose to render.js
  window.__showElementDetail = openPanel;
})();
