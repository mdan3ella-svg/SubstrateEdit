# SUBSTRATE PRO v3.0 — Assembly profiles and on-screen hatches

See `docs/LOD400_DETAIL_V30.md`. Manufacturer details are user-authored, not pre-certified or imported from vendors.

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

## Paper-space plot composer (v2.1)

Use **Plot / Sheet Setup** (top toolbar) or **Sheet Composer / PDF** (Documentation).

- ISO A0–A4, ANSI A/B, ARCH D. Portrait or landscape; SVG dimensions are millimetres.
- Auto fit chooses a standard 1:N drawing scale from the model bounds, or select an explicit scale. Orthographic projections are drawn at 1:N; isometric is marked NTS.
- View placement is centered by default with manual shift X/Y (paper millimetres). Viewport content clips to the drawing box, protecting other views and title block.
- Adjustable page margin, lineweight assignments in mm, preliminary hatch graphics, four-view or single-view arrangement, revision/title/number/date/issuer title block.
- Export Scaled SVG for vector plotting; Print/PDF uses CSS @page matching the selected paper size. Set browser print scaling to **100%**, margins **None**, and disable headers/footers; verify a known dimension with a physical ruler or PDF measurement before issuing.

**Limitations:** This is a conceptual plotting workflow, not a certified ISO 19650/ISO 128 drawing standards implementation. An exact PDF printer driver, CTB/STB pen mapping, multi-sheet sets, professionally annotated dimension strings, true section clipping and specialist discipline symbols are not included. Printed results can vary by browser/driver; the SVG is the authoritative scaled vector deliverable.

Run plotting tests: `node tests/plot_test.mjs` and `python tests/static_audit.py`.

## v2.2 — Associative auto-authoring

- **Auto Author / Publish** produces a model-derived assembly register with preliminary net volume and hosted opening associations. The authoring controls also export a CSV schedule and open the scaled sheet composer.
- **Auto tags + dimensions on plots** adds assembly material leaders and wall/beam length callouts onto plan and elevation paper-space views. Values are recalculated from model fields each time sheets are generated; editing the source geometry and rebuilding updates the annotations. Tags may be manually overridden using **Assembly Tag** under properties.
- Opening data remains hosted by a wall element ID. Preliminary volume accounts for rectangular hosted cuts, and all quantities are explicitly non-certified.
- This is **not** a complete IFC/OCCT kernel, fabrication document generator, clash detection service, code checker or standards certification. It does not invent specifications absent from the model. Annotation collisions are reduced with a simple spacing rule, but not globally optimized.
- Static tests: `node tests/author_test.mjs` and `node tests/plot_test.mjs`.


## v2.3 precision upgrades
- Verified bounded rectilinear CSG solid partition kernel (NOT OpenCascade or general B-rep). Click **Verify Solids** to run volume validation and generate host-opening solids.
- Global paper-space label collision avoidance, stable labels and overflow reporting.
- Drawing, authoring, paper-space plotting and native save/open retain their existing browser-native startup; no npm dependencies required.
- `node tests/v23_test.mjs` checks real Boolean cut volumes, rotated-host volumes and label collision avoidance.
- Limits: no NURBS, generic solid intersection, industrial B-rep topology certification or exact assembly fusion.


See docs/GEOMETRY_V25.md for upgraded operations and their verified scope.

## v2.6 — BIM coordination and code-basis review
- **Grids & Levels** edits project datum elevations and structural grid positions (millimetres). Plan shows grid lines and identifiers; elevation views show story datums. Existing level-hosted geometry follows the edited level elevation, including openings assigned to that level.
- **IBC / OBC Review** records jurisdiction, code edition/amendments, occupancy, construction type, fire-rating basis and responsible reviewer. The checklist reports missing data and explicitly defers substantive code determinations to qualified reviewers.
- These records persist in `.substratepro` native JSON files. Model Audit includes level references, elevation deviations, and grid definition errors. Geometry and drawing tests run with Node and require no npm dependencies.
- **NOT PROVIDED:** OpenCascade WASM B-rep, geometric fillet topology, general B-rep Boolean joining, manifold/watertight certification, IFC schema conformance, or IBC/OBC compliance certification. Those require a compiled exact kernel, topological verification and appropriate professional review. The bounded CSG model is not presented as interchangeable with those capabilities.

## v2.7 Wall Polyline
Continuous clicks create connected orthogonal wall paths with mitered plan outlines. See `docs/WALL_POLYLINE.md` for controls and geometry limitations.

## v2.8 connected wall engine
The orthogonal polyline wall preview now uses a unified 3D mesh boundary when matching elevations, heights, and no hosted cuts allow. Shared-corner edits propagate to the linked path. See `docs/COORDINATED_WALL_3D.md` for capability limits; this is not OpenCascade, GPU WebGL, or certified watertight B-rep geometry.

## v2.9 2D detail graphics

Enhanced hosted door/window graphics in Plan and SVG plotting, plus material-dependent ISO-inspired hatches. See `docs/DETAIL_GRAPHICS_V29.md`. The new `src/detail-graphics.mjs` is imported by `src/app.js` and `src/plot.mjs`; deploy all files together and keep the same relative directory structure. This is an intentionally scoped drafting-LOD improvement, not manufacturer-specific LOD 400 detailing.
