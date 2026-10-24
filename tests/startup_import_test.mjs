// Regression: the complete application module must link without an ES module SyntaxError.
// Node has no browser DOM, so a document-related ReferenceError is expected after linking.
import assert from 'node:assert/strict';
let error;
try { await import('../src/app.js'); } catch (e) { error=e; }
assert.ok(error, 'Expected missing DOM error under Node');
assert.equal(error.name, 'ReferenceError', `Application module failed to link: ${error}`);
assert.match(error.message, /document is not defined/);
console.log('Application module imports link successfully (DOM runtime requires browser)');
