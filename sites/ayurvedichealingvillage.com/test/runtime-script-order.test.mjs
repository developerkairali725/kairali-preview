import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { orderedRuntimeScripts } from '../app/(english)/_families/runtime-script-order.mjs';
const cfg = { previewSrc: '/preview.js', supportSrc: '/support.js' };

test('enquiry state dependencies precede family scripts and runtime compilation', () => {
  const view = JSON.parse(fs.readFileSync(new URL('../public/ahv/views/ahv-page-enquiry-mobile.json', import.meta.url)));
  const sources = orderedRuntimeScripts(view, cfg, false).map(x => x.src);
  assert.equal(sources[1], '/design/lead-receipt.js');
  assert.equal(sources.at(-1), '/support.js');
  assert.ok(sources.indexOf('/design/lead-receipt.js') < sources.indexOf(view.scripts[0]));
  assert.equal(orderedRuntimeScripts(view, cfg, true).some(x => x.src === '/design/lead-receipt.js'), false);
});

test('views without the state dependency keep their original loading sequence', () => {
  assert.deepEqual(orderedRuntimeScripts({ file: 'home.html', logic: 'class Component {}', scripts: ['/home.js'] }, cfg, false),
    [{ src: '/preview.js', view: 'home.html' }, { src: '/home.js' }, { src: '/support.js' }]);
});
