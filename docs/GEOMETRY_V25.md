# SUBSTRATE PRO v2.5 geometry scope and acceptance

Implemented:
- Orthogonal wall union computes one polyhedral boundary and net union volume for axis-aligned wall boxes, suppressing shared/internal surfaces. Can be measured with `unionOrthogonalWalls`. Not applied as a universal rendered solid for hosted openings.
- Slab voids now cut rectilinear solid partitions in all Z, and projected isometric display uses corresponding missing slab cells. Model volume uses same holes.
- Fillet is stored as mathematically circular arc definition (`arc` radius, center, start angle and sweep); display and extrusion use finite straight segments. **Not an OpenCascade B-rep fillet**.
- Gizmo handle hit-testing and on-screen target previews for pointer dragging in plan; value changes are transactional with rollback on failure. Not a 3-axis 3D transform gizmo.

Not implemented or certified:
- General B-rep fillets, arbitrary rotated wall solid unions, topologically certified watertight joint and slab union assemblies, curved solid Booleans, IFC round trip, construction-ready shop drawings.
- Per-document live browser acceptance testing is needed before release.

Hosting: all app imports are relative ES modules, no npm resolution required. Serve index.html and src files over HTTPS.

In the Iso viewport, choose Move for a selected element and drag a visible X, Y or Z axis handle. Movement is restricted to that axis and optionally quantized to the grid interval. A failed transaction restores the previous model. Use Plan for endpoint Vertex editing.

Browser acceptance: a Chromium navigation test was attempted, but local HTTP requests were blocked by the environment. The static and Node geometry tests are not a substitute for live hosted interaction tests.
