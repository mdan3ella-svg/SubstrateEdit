# SUBSTRATE PRO — Functional AEC Detail Studio

A compact, dependency-free **conceptual AEC modeler**, re-engineered using the workflow patterns supplied in the two SketchBIM and Surreal Interactive HTML references. Branding: SUBSTRATE PRO | Vertascan.

## Hosting
Upload `index.html` and the complete `src/` folder together to GitHub Pages, Cloudflare Pages, or Netlify. No npm install, Vite build, CDN, or server-side dependencies are needed. A local development server is recommended (`python -m http.server 8000`).

## Real implemented features
- One coordinate model (millimetres), persistent IDs, levels, material metadata, selection, property editing, history transactions.
- Plan drawing: walls, slabs, columns, beams, hosted doors/windows, lines, and dimensions. Grid and endpoint snapping. Orthogonal wall lock; Shift allows diagonal wall drawing.
- Axis-aligned and angled wall segments with projected 3D openings for hosted components; generated plan and elevation projections.
- Select/move, duplicate, delete, zoom, pan; isometric orbit using left mouse drag in Iso; top/front/right/left/rear camera presets.
- Local save/open `.substratepro` JSON, plan SVG export, PNG export, browser printing, 4-view review sheet, conceptual quantities and audit.
- Status display explains this is a **parametric conceptual geometry engine**, not a verified OpenCascade solid kernel.

## Limitations — explicit
- This edition has **no OpenCascade WASM exact B-rep**, IFC import/export, true 3D GPU renderer, freeform NURBS, full construction-document associative annotations, or certified quantity/code schedules. These are deliberately excluded rather than represented as working controls.
- 3D views are rendered using canvas projections, not WebGL. Hosted wall voids are deterministic segmented preview solids rather than certified B-rep subtract operations.
- Separate geometry-kernel integration must be tested and bundled before those capabilities may be stated as active.

## Acceptance steps
1. Click Sample: 6 objects should appear.
2. Choose Plan > Wall; click two points. Model count increases.
3. Select Door/Window; click close to an existing wall. A host link is created.
4. Select geometry, edit properties, Apply. Undo and Redo.
5. Switch to 3D Iso, orbit using left drag; switch to Front and Right.
6. Open Quantities and 4 Ortho Sheet; save then reopen project.

## QA
`node --check src/app.js` checks executable JavaScript syntax. `python tests/static_audit.py` checks referenced controls and module paths. Live interaction smoke test is in `tests/smoke.py` but the provided sandbox browser policy may block local navigation.
