# SUBSTRATE PRO v2.8 — Coordinated wall geometry

## Delivered
- A shared polyline corner is edited transactionally, propagating its new coordinates to every matching segment of the same `pathId`.
- When changing a shared orthogonal corner, the adjacent endpoint is adjusted as needed to preserve vertical/horizontal wall orientation.
- In orthographic and isometric projected 3D views, adjacent orthogonal wall segments without hosted openings and with matching height/elevation are combined into one boundary mesh via `unionOrthogonalWalls`.
- The assembly preview is drawn from indexed 3D mesh triangles, not from independently overlapping wall prisms.
- Existing individual wall rendering remains for hosted openings and unsupported join conditions. The engine is a browser-native Canvas projection, **not** WebGL or OpenCascade.

## Exactness and manifold scope
The union computes volumes and outer faces of axis-aligned boxes. It is not a general exact B-rep kernel. Individual coplanar faces are tessellated from coordinate partitions and can contain T-junctions. Mesh topology is **not certified watertight**. For a hosted door/window, per-segment openings continue to be rendered; full union-with-voids remains pending. Arbitrarily rotated wall joints remain unsupported by the union kernel.

## QA
Source syntax, existing unit suites, and linked-vertex / union tests pass. The sandbox blocked local HTTP navigation in Chromium, so no interactive viewport acceptance claim is made.

## Suggested hosted acceptance
1. Create an L-shaped wall with three successive clicks and press Enter.
2. Switch to 3D Iso. The orthogonal L should appear as a unified exterior rather than two overlapping prisms.
3. Return to Plan; select a segment, choose Vertex Edit and drag the shared corner.
4. Switch to 3D Iso again. Both connected segments should reflect the edit.
5. Save and reopen; verify the corner and connected path persist.
6. Add a door opening; verify its cut preview, while noting the joined mesh falls back to individual segments for openings.
