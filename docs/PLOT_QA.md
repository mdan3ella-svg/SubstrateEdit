# SUBSTRATE PRO v2.1 — Plot QA

**Verified (static / Node):** Script syntax; paper sizes; portrait/landscape dimensions; one/four view layouts; deterministic 1:N scales; standard auto scale; SVG physical size; title block; lineweight value; previous application ID wiring.

**Not verified in a hosted browser:** Actual print dialog / PDF driver, exact physical output after printer scaling, GUI interaction, PDF preview pagination. Local Chromium loopback navigation is blocked in this execution environment.

## Acceptance steps on hosted site
1. Load Sample; choose Plot / Sheet Setup.
2. Select A3 landscape, auto scale; verify page 420 × 297 mm and the four views.
3. Change to A2 portrait and one Plan; verify the preview and format change.
4. Change to 1:50 and adjust X/Y shifts; verify geometry visibly repositions without affecting the model.
5. Set cut lineweight 0.70 mm; export SVG and inspect stroke-width 0.7.
6. Print/PDF at 100% / no margins, save PDF; verify physical dimensions and no duplicate pages.
7. Close sheet, return to Plan, create a wall, regenerate sheet; verify that updated geometry appears.
