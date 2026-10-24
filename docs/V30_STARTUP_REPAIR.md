# SUBSTRATE PRO v3.0.1 — startup repair

## Root cause
`src/app.js` imported two separate exports named `validateAssembly` from `assembly-catalog.mjs` and `solid-kernel.mjs`. The duplicate binding causes `SyntaxError: Identifier 'validateAssembly' has already been declared` during ES-module linking, preventing ALL application controls from initializing.

## Correction
The catalog validation import is now aliased as `validateProductAssembly`; the solid geometry audit retains `validateAssembly`. The LOD profile checker calls the catalog validator, and geometry audit calls the solid validator.

## Verified
All existing Node module tests plus `startup_import_test.mjs` pass; all source JavaScript files pass `node --check`. The application module successfully links in Node before encountering the expected absence of browser `document`.

## Not verified
Interactive browser operation cannot be certified from this environment; Chromium navigation was blocked. This patch corrects the demonstrated fatal startup failure but does not certify the app's advanced modeling features or all controls.

## Deploy
Upload the contents of `SUBSTRATE_PRO` to your site's published root, replacing old files, then refresh bypassing cache. Check developer console for any additional errors. No npm build needed.
