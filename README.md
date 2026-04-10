# Elementum — Tabla Periódica Interactiva

Herramienta de estudio visual para Química General (QUIC0001, UTEM).  
Abre `index.html` directamente en Chrome — sin servidor, sin instalación.

---

## Propósito

Funciona como hoja de referencia interactiva que cubre:

- Configuración electrónica y modelos atómicos
- Propiedades periódicas (electronegatividad, radio, energía de ionización, afinidad electrónica)
- Números cuánticos del último electrón
- Tipos de enlace químico
- Bloques s / p / d / f y familias de grupos

---

## Estructura de archivos

```
elementum/
├── index.html          Punto de entrada — carga fuentes, estilos y scripts
├── css/
│   ├── base.css        Variables CSS, header, layer-bar, footer, scrollbar
│   ├── table.css       Grid de la tabla, celdas, panel lateral, leyenda
│   └── layers.css      Clases de color por categoría y animaciones
└── js/
    ├── data.js         Array ELEMENTS con los 118 elementos
    ├── render.js       Construye el grid CSS y las filas f-block
    ├── layers.js       Lógica de capas de color y barra de botones
    └── tooltip.js      Panel de detalle con números cuánticos y propiedades
```

---

## Cómo editar datos de un elemento

Abre `js/data.js`. Cada elemento es un objeto JS. Busca por símbolo o Z:

```js
{ z: 6, symbol: "C", name: "Carbono", mass: 12.011, period: 2, group: 14,
  block: "p", category: "no-metal", electronegativity: 2.55,
  atomicRadius: 67, ionizationEnergy: 1086, electronAffinity: 121.8,
  electronConfig: "1s² 2s² 2p²", valenceElectrons: 4,
  typicalBond: "covalente" }
```

Campos editables:

| Campo | Tipo | Notas |
|---|---|---|
| `mass` | number | Usa decimales; entero → se muestra entre paréntesis (sintético) |
| `electronegativity` | number\|null | Escala de Pauling |
| `atomicRadius` | number\|null | en picómetros |
| `ionizationEnergy` | number\|null | en kJ/mol |
| `electronAffinity` | number\|null | en kJ/mol |
| `electronConfig` | string | Usa caracteres Unicode superíndice (⁰¹²³…) |
| `typicalBond` | string | Uno de: `"iónico"`, `"covalente"`, `"covalente polar"`, `"metálico"`, `"ninguno"` |

---

## Cómo agregar una nueva capa de color

1. **Define la función `apply`** en `js/layers.js`:

```js
function applyMiCapa(cells) {
  cells.forEach(cell => {
    const el = getElement(cell);
    if (!el) return;
    cell.style.backgroundColor = miColorParaEl(el);
  });
}
```

2. **Define la función `legend`** que retorna HTML de `<div class="legend-item">…</div>`.

3. **Agrega la entrada** al array `LAYERS` dentro de `layers.js`:

```js
{
  id: "mi-capa",
  label: "Mi Capa",
  type: "gradient",
  legend: miLeyenda,
  apply: applyMiCapa,
}
```

La barra de botones se genera automáticamente a partir del array.

---

## Capas disponibles

| Capa | Descripción |
|---|---|
| Categorías | Color por tipo de elemento (metal alcalino, gas noble, etc.) |
| Clasificación | Metal / Metaloide / No metal |
| Bloques | Bloque s, p, d, f |
| Familias | Color por número de grupo (1–18) |
| Electronegatividad | Gradiente frío→cálido según escala Pauling |
| Radio Atómico | Gradiente por tamaño en pm |
| Energía de Ionización | Gradiente verde→rojo en kJ/mol |
| Tipo de Enlace | Iónico / Covalente / Metálico / Polar |

---

## Créditos

**Juan Cruz Muñoz** — UTEM 2026  
Desarrollado como herramienta de apoyo para QUIC0001 Química General.
