# SUBSTRATE PRO — Functional Core QA

Test date: 2026-10-24

Reference inputs reviewed:
- `index(20261024-123620).html`: SketchBIM-inspired CAD / BIM discipline layout, model editing, layers, technical documentation.
- `index(20261024-123644).html`: Surreal Interactive presentation and review patterns.

Implementation principles: one document model, one renderer, observable event handlers, persistent IDs, no bare npm imports, no dependencies at startup.

## Passed checks
- `node --check src/app.js`
- `tests/static_audit.py`: unique IDs; DOM controls; files/links; syntax
- `tests/inmemory_smoke.py`: browser startup, sample project, two-click wall, undo, redo, 4-view sheet, zero JavaScript errors
- `tests/acceptance.py`: sample, wall-hosted window, segmented wall preview with opening, model audit, schedule, undo/redo, four-view sheet, zero JavaScript errors

The browser runs used isolated in-memory document injection to bypass sandbox navigation restrictions. They are meaningful DOM interaction checks but are not a test of a deployed hosting environment.

## Outside validated scope
- No OpenCascade exact B-rep / WASM; no production WebGL engine; no IFC write/read; no construction-certified schedules or detailing.
- Additional manual verification recommended for every material and property edit, local save/open file dialog, print dialogs, and mobile interactions.
