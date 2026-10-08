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

test('confirmation views consume the receipt during render, so the bridge precedes their renderer', () => {
  // confirmation-family-render.js resolveRoute() calls AHV_LEAD_RECEIPT.consume() only if the bridge
  // already exists; a view rendered before Next's beforeInteractive copy runs keeps the marker unread.
  for (const variant of ['desktop', 'mobile']) {
    const view = JSON.parse(fs.readFileSync(new URL(`../public/ahv/views/ahv-page-confirmation-${variant}.json`, import.meta.url)));
    const sources = orderedRuntimeScripts(view, cfg, false).map(x => x.src);
    const renderer = sources.findIndex(src => src.endsWith('/confirmation-family-render.js'));
    assert.ok(renderer > 0, variant);
    assert.equal(sources[1], '/design/lead-receipt.js', variant);
    assert.equal(sources.at(-1), '/support.js', variant);
    assert.equal(orderedRuntimeScripts(view, cfg, true).some(x => x.src === '/design/lead-receipt.js'), false, variant);
  }
  const localized = { file: 'ahv-page-confirmation-mobile.html', logic: 'class Component {}', scripts: ['/ahv/l10n/de/assets/confirmation-family-data.js', '/ahv/l10n/de/assets/confirmation-family-render.js'] };
  assert.equal(orderedRuntimeScripts(localized, cfg, false)[1].src, '/design/lead-receipt.js');
});

test('views without the state dependency keep their original loading sequence', () => {
  assert.deepEqual(orderedRuntimeScripts({ file: 'home.html', logic: 'class Component {}', scripts: ['/home.js'] }, cfg, false),
    [{ src: '/preview.js', view: 'home.html' }, { src: '/home.js' }, { src: '/support.js' }]);
});
