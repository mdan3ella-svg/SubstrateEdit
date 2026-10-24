# SUBSTRATE PRO v2.3 — Geometry and annotation contract

The supplied source integrates a standalone, fully testable **rectilinear coordinate-partition CSG** engine for walls, beams, rectangular slabs and columns. Wall axes may rotate in the plan, and door/window cuts remain rectangular in each host's local coordinates. The engine produces an explicit triangle boundary and a numerically exact volume from partitions. Surface tessellation is not certified watertight where neighboring faces have T-junctions. It is **not OpenCascade and not a general NURBS/B-rep kernel**.

The global annotation solver sorts labels deterministically and searches collision-free paper-space candidates across one viewport, reporting labels it cannot place. It does not claim collision freedom between dimensions and all architectural linework.

Run `node tests/v23_test.mjs`; do not advertise exact OCCT until an independently installed OpenCascade WASM runtime passes Boolean and topology tests in a browser.
