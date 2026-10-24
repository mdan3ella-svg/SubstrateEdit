# SUBSTRATE PRO 2.6 — BIM coordination scope

Implemented: editable X/Y structural grids; persistent grid labels; editable level elevations; associated assembly elevation updates; persistent code-basis fields; missing-data/code-reference audit; plan grid and orthographic elevation story-datum graphics. Level definitions are part of the native model document.

Rules: lengths and elevations stored in millimetres; unique level IDs; duplicate grids rejected; changes to level elevations update model elements with that level. Directly edited per-element elevations may be flagged for manual review.

Code references: International Building Code (IBC), Ontario Building Code (OBC), and ISO drawing/documentation standards require jurisdiction- and edition-specific interpretation. The built-in review is only a documentation checklist. No automated egress, loading, fire-resistance, accessibility or building-code determination is claimed.

Exact modeling: current source uses bounded prismatic coordinate-partition geometry, not OpenCascade. It cannot attest to certified watertight topology or true NURBS fillet topology. An actual OCCT integration requires WASM loading, shape serialization, robust face/edge selection, solid validation (e.g. BRepCheck_Analyzer and closure checks), tessellation, regression fixtures and human acceptance.

Tests: `node tests/coordination_test.mjs`; existing tests in `tests/`.
