import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const defaultViews = join(dirname(fileURLToPath(import.meta.url)), '../public/ahv/views');
const views = process.env.AHV_TEST_VIEWS_DIR || defaultViews;
const site = join(dirname(fileURLToPath(import.meta.url)), '..');

// History: this file pinned the home views' "10% OFF" exit popup as HELD (design preview only, no fields) while its
// offer and copy awaited approval. Owner decision, 14 Oct 2026 (direct chat, structured question): "10% offer popup"
// chosen over the no-discount help popup and over keeping popups off — go live with a real form. The live offer is
// /design/exit-offer.js (one sitewide dialog, all 13 locales, posting to /api/lead/ as "exit-intent"; see
// test/exit-offer.test.mjs). The view's own mock therefore stays a design preview that never opens by itself, so a
// visitor can never get two offer dialogs, and the view keeps no collection fields of its own.

for (const filename of ['home-hi-fi-v4.json', 'home-mobile.json']) {
  test(`${filename}: the view's offer mock stays a design preview; the live offer is /design/exit-offer.js`, () => {
    const payload = JSON.parse(readFileSync(join(views, filename), 'utf8'));
    const documentEvents = [];
    const timers = [];
    const windowStub = {
      innerWidth: 390,
      scrollY: 0,
      addEventListener() {},
      removeEventListener() {},
      matchMedia() { return { matches: true }; },
    };
    const documentStub = {
      addEventListener(name) { documentEvents.push(name); },
      removeEventListener() {},
      querySelectorAll() { return []; },
    };
    class DCLogic {
      setState(update) {
        const value = typeof update === 'function' ? update(this.state) : update;
        this.state = { ...this.state, ...value };
      }
    }
    const Component = vm.runInNewContext(`${payload.logic}\nComponent`, {
      DCLogic,
      window: windowStub,
      document: documentStub,
      localStorage: { getItem() { return null; }, setItem() {} },
      setTimeout(fn, ms) { timers.push(ms); return 1; },
      clearTimeout() {},
      setInterval() { return 1; },
      clearInterval() {},
      IntersectionObserver: class { observe() {} unobserve() {} },
    });
    const component = new Component();
    component.props = {};
    component.componentDidMount();
    assert.equal(documentEvents.includes('mouseout'), false, 'no exit-intent mouse trigger');
    assert.equal(timers.includes(45000), false, 'no mobile delayed trigger');
    assert.equal(component.renderVals().showExit, false, 'the view mock never opens for a visitor (exit-offer.js does)');

    component.props.previewExitPopup = true;
    assert.equal(component.renderVals().showExit, true, 'explicit design preview can inspect offer');
    component.renderVals().closeExit();
    assert.equal(component.renderVals().showExit, false, 'preview close works');

    const popup = payload.template.slice(payload.template.indexOf('<sc-if value="{{ showExit }}"'));
    assert.equal(component.renderVals().pop.cta, 'Claim Your Offer Now!');
    assert.doesNotMatch(popup, /<input\b/i, 'the mock has no collection fields; the one real form is in exit-offer.js');
  });
}

test('the live exit offer replaces the hold: loaded sitewide with real fields and the approved headline', () => {
  const doc = readFileSync(join(site, 'app/(english)/_families/site-document.tsx'), 'utf8');
  assert.match(doc, /<script defer src="\/design\/exit-offer\.js" \/>/);
  const offer = readFileSync(join(site, 'public/design/exit-offer.js'), 'utf8');
  assert.match(offer, /OFFER_SUBJECT = 'Get 10% OFF on all Treatment Packages'/);
  for (const name of ['full_name', 'countrycode', 'phone', 'email', 'consent']) assert.match(offer, new RegExp(`name: '${name}'|'name', '${name}'`), name);
  assert.match(offer, /form: 'exit-intent'/);
});
