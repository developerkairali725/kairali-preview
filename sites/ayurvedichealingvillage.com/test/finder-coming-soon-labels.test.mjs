// Coming Soon finder cards in every locale (9 Oct 2026): the card's purpose and action must reach the extractor as
// display text and take the approved catalogue translations. Literals under the internal `fw`/`action` keys stayed
// English beside translated cards in all twelve locales.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { applyUnits } from '../tools/l10n/lib.mjs';
import { parseFile } from '../tools/l10n/sources.mjs';

const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const approved = new Map(read('english-candidate/catalogue-locales.json').units.map((u) => [u.source, u.translations]));
const LOCALES = ['hi', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'ru', 'ar', 'zh-Hans', 'ja', 'ko'];
const PURPOSES = { '/yoga-meditation-program/': 'Personal practice', '/new-to-yoga-teacher-training/': 'Professional teacher training' };
const ENGLISH = /Coming Soon|View details|Personal yoga practice|Professional teacher training/;

const comingSoonCards = (logic) => {
  const ctx = { window: {}, DCLogic: class { setState(s) { Object.assign(this.state, s); } } };
  vm.runInNewContext(logic + ';globalThis.Instance=Component;', ctx);
  const instance = new ctx.Instance();
  instance.state.availability = 'coming_soon';
  // JSON round trip: arrays made inside the vm realm never deep-equal host arrays
  return JSON.parse(JSON.stringify(instance.renderVals().list.map((p) => ({ route: p.h.replace(/^https:\/\/ayurvedichealingvillage\.com/, ''), purpose: p.fw, action: p.action, canEnquire: p.canEnquire }))));
};

test('Coming Soon purposes are the approved units on the forthcoming pages, translated in all twelve locales', () => {
  for (const [route, purpose] of Object.entries(PURPOSES)) {
    const page = read(`public/ahv/views/ahv-page-${route.slice(1, -1)}-desktop.json`);
    assert.ok(page.template.includes(`<h2>${purpose}</h2>`), route);
  }
  for (const source of [...Object.values(PURPOSES), 'View details']) for (const loc of LOCALES) assert.ok(approved.get(source)?.[loc]?.trim(), `${loc} ${source}`);
});

for (const slug of ['all-programs', 'training-programs']) for (const side of ['desktop', 'mobile'])
  test(`${side} ${slug}: Coming Soon card purpose and action are translated in every locale`, () => {
    const file = `public/ahv/views/ahv-page-${slug}-${side}.json`;
    const logic = parseFile(file, fs.readFileSync(file, 'utf8')).parts.find((p) => p.field === 'logic');
    for (const loc of LOCALES) {
      const local = comingSoonCards(applyUnits(logic.text, logic.units, (s) => approved.get(s)?.[loc]));
      assert.deepEqual(local.map((c) => [c.route, c.purpose, c.action, c.canEnquire]).sort(),
        Object.entries(PURPOSES).map(([r, p]) => [r, approved.get(p)[loc], approved.get('View details')[loc], false]).sort(), loc);
      for (const c of local) assert.doesNotMatch(c.purpose + ' ' + c.action, ENGLISH, loc);
    }
    const english = comingSoonCards(logic.text);
    assert.deepEqual(english.map((c) => [c.route, c.purpose, c.action, c.canEnquire]).sort(), Object.entries(PURPOSES).map(([r, p]) => [r, p, 'View details', false]).sort());
  });
