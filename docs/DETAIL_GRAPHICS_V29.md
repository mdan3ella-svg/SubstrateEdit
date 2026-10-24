# SUBSTRATE PRO v2.9 — 2D assembly drafting graphics

This is a focused graphics and plot improvement built on v2.8. Material-dependent hatch symbols include concrete, masonry, steel, timber, insulation, glass and a generic pattern. Pattern selection reads `element.material` and is used in scaled SVG sheets; no hatch scale changes the semantic model geometry.

Door plans now display a door leaf, hinge and quarter-circle swing; windows display two frame lines, end jambs and center glazing. Both read the existing `hostId`, normalized `u`, `width` and host-wall direction, and automatically follow changes to host coordinates and opening dimensions. The same symbol geometry is generated for on-screen plan display and SVG plot output.

Plot output preserves prior paper dimensions, scale selection, object/cut/annotation stroke settings, and existing associative annotation placement. The model and host/opening logic are unchanged. Detail geometry is schematic and intended for conceptual to developed-design documentation, not manufacturer-specific fabrication detail or independently certified ISO construction documentation. Lineweight and hatch legibility should be reviewed at target plot scale and with a physical/PDF proof.

Run `node tests/detail_graphics_v29_test.mjs` and the existing module tests. Static checks don't replace live browser validation.
