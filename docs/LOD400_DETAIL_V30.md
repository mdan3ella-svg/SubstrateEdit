# SUBSTRATE PRO v3.0 — Assembly detailing and hatch parity

## What is implemented

- Interactive plan uses clipped canvas hatching according to the same material-to-hatch classification as SVG plotting: concrete, masonry, metal, timber, insulation, glazing and general.
- Connected wall polylines retain their continuous plan outline, with hatches clipped to the resulting outline.
- Door/window symbols derive from host-wall location and contain multiple frame/glazing lines, hinge and leaf geometry. Profile fields parameterize glazing pane count, leaf thickness and component dimensions where supported.
- Hosted openings have editable assembly metadata: manufacturer, product, SKU, revision, source URL, frame section, glazing count/thickness, tolerances, fire rating, hardware, fasteners and installation notes. Saved in the native project data.
- Plotting uses the same material categories with vector hatch definitions, including slab cut hatch.

## LOD 400 boundary

LOD 400 is fabrication/installation-level information specific to an assembly and supported by trustworthy manufacturer/shop-drawing records. This app provides **authoring fields and schematics**, but does not include authenticated manufacturer families, detailed fabrication joinery, certified tolerances, fastener engineering, or verified product performance. A record marked `manufacturer-document` means a user selected that state, not that the software validated its URL or certified the product. Do not issue shop drawings as manufacturer-approved without independent review.

## Hatches

Interactive screen hatches use pixel spacing designed for legibility at varying zoom; vector plotted hatch spacing is in physical paper millimeters. Both choose the same material categories but they are **not pixel-identical or guaranteed ISO-conformant**. Drawing-scale and physical plot review are required.

## Verification

Run `node tests/lod400_hatch_v30_test.mjs` and all previous `.mjs` tests. These are module checks, not independently certified LOD approval. Live interaction and printing acceptance remain mandatory prior to production deployment.
