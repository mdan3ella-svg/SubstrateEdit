# Wall Polyline — v2.7

1. Select **Wall Polyline** in Plan. Click the first vertex, then each successive vertex. Each click commits one wall segment to the BIM document with a stable ID, a shared `pathId` and a `pathIndex`.
2. Orthogonal tracking aligns each new segment with the previous vertex along X or Y; Shift allows angled segments. Grid, existing endpoints, midpoints and intersections use the app snap settings.
3. Press **Enter** or **Finish Wall** to finish. Escape cancels the pending cursor preview but preserves committed segments. Undo removes the last committed segment.
4. The Plan view draws joined path segments as one thickness-aware polygon, with mitered 90-degree corners. Hosted openings remain associated with individual wall segment IDs.
5. The 3D view and quantities still operate on individual wall segments and their restricted prismatic CSG. Full solid-union/watertight validation for arbitrary wall joins is **not** implemented.
6. Moving vertices with the existing Vertex Edit tool operates on one segment and does not yet propagate across the entire path; rerun junction cleanup or edit neighboring endpoints individually.

Tests: `node tests/wall_polyline_test.mjs` and `python tests/static_audit.py`.
