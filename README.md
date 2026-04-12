# Elementum — Tabla Periódica Interactiva

**Herramienta de estudio visual para Química General**  

🔗 **[Abrir Elementum](https://juangrunge.github.io/elementum/)**

---

## ¿Qué es Elementum?

Elementum es una tabla periódica interactiva que permite explorar los 118 elementos químicos a través de distintas capas de visualización. Cada capa colorea la tabla según una propiedad diferente, permitiendo identificar patrones y tendencias periódicas de forma visual e inmediata.

Está pensada para estudiantes y docentes de química que necesiten una referencia rápida, visual y confiable — tanto en computador como en dispositivos móviles.

---

## Capas de visualización

Cada botón en la barra superior activa una forma distinta de ver la tabla.

### Capas estructurales

| Capa | Qué muestra |
|---|---|
| **Categorías** | Clasificación por tipo: metales alcalinos, gases nobles, halógenos, etc. |
| **Clasificación** | Agrupación en tres grandes familias: metales, metaloides y no metales |
| **Bloques** | Bloque s, p, d o f según el último orbital que se llena |
| **Familias** | Grupos del 1 al 18, con igual número de electrones de valencia |
| **Períodos** | Filas del 1 al 7, con igual número de capas electrónicas |

### Capas de propiedades periódicas

Estas capas usan un gradiente de color: los tonos más claros o intensos indican valores más altos.

| Capa | Qué muestra | Unidad |
|---|---|---|
| **Radio Atómico** | Distancia del núcleo al electrón más externo | pm |
| **Volumen Atómico** | Cociente entre masa molar y densidad | cm³/mol |
| **Energía de Ionización** | Energía para arrancar un electrón de valencia | kJ/mol |
| **Electroafinidad** | Energía liberada o absorbida al captar un electrón | kJ/mol |
| **Electronegatividad** | Capacidad de atraer electrones en un enlace (escala Pauling) | — |
| **Tipo de Enlace** | Enlace típico del elemento: iónico, covalente, metálico o polar | — |

### Panel de detalle

Al hacer clic sobre cualquier elemento se abre un panel lateral con:

- Número atómico, masa y configuración electrónica
- Números cuánticos del último electrón (n, l, m, s)
- Propiedades periódicas con sus valores y unidades
- Tipo de enlace con explicación de la regla ΔEN

---

## Sobre los datos

Los valores provienen de fuentes de referencia estándar en química:

- **NIST WebBook** — base de datos oficial del Instituto Nacional de Estándares de EE.UU.
- **CRC Handbook of Chemistry and Physics** — referencia estándar en química aplicada
- **Fricke & Waber (1971)** — estimaciones teóricas para elementos transuránidos

### Calidad de los datos

Algunos elementos, especialmente actínidos y elementos sintéticos, tienen datos que no han podido ser medidos directamente en laboratorio. Para estos casos, el panel de detalle muestra un badge junto al valor:

| Badge | Significado |
|---|---|
| `experimental` | Valor medido directamente en laboratorio |
| `estimado` | Valor derivado de modelos teóricos o interpolación |

Los elementos Z=104–118 (superpesados sintéticos) no tienen datos de volumen atómico ni electroafinidad — esto es correcto e intencional, ya que no existen mediciones válidas para ellos.

---

## Compatibilidad

Elementum funciona directamente en el navegador, sin instalación. Compatible con Chrome, Firefox, Safari y Edge en versiones modernas. Optimizado para uso en escritorio y móvil.

---

## Créditos

Desarrollado por **Juan Cruz Muñoz**  
Ingeniería Civil en Ciencia de Datos · UTEM 2026  
Como herramienta de apoyo para QUIC0001 Química General