// DEC-GUEST-VIDEO-POPUP: the Stories on-page film popup (campaign-v2/production/sections/GuestVideoDialog.tsx +
// guest-video-policy.mjs). Synthetic only: no browser, network or build. The controller the component runs is driven
// here with fake window/document objects; React rendering, real playback, focus movement, mobile layout and network
// silence still need browser acceptance by the release owner.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  APPROVED_FILM_IDS, CLOSED, CLOSED_VIEW, GUEST_VIDEO_ROUTES, REQUIRED_CATEGORIES, consentGranted, createGuestVideoController,
  dialogSupported, embedSrc, filmIdFromHref, interceptsClick, localThumb, openCookieSettings, playerSrc, reduce, routeAllowed, watchHref,
} from '../campaign-v2/production/sections/guest-video-policy.mjs';
import * as policy from '../public/consent/policy.mjs';
import * as vendor from '../public/consent/vendor/cookieconsent.esm.js';
import { COPY } from '../campaign-v2/production/pages/index.ts';
import { ROUTES } from '../campaign-v2/production/bindings.ts';
import { BATCH6 } from './fixtures/train-a-batch6-20261014.mjs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const dialogSrc = read('../campaign-v2/production/sections/GuestVideoDialog.tsx');
const storiesSrc = read('../campaign-v2/production/sections/Stories.tsx');
const cssSrc = read('../campaign-v2/production/sections/GuestVideoDialog.module.css');
const vendorSrc = read('../public/consent/vendor/cookieconsent.esm.js');

const storyPages = Object.values(COPY).filter((c) => c.page?.stories);
const locale = (slug) => ROUTES[slug].locale ?? 'en';

// ---------------------------------------------------------------------------------------------------------- scope

test('allowlist = exactly the English production routes that render Stories (13, then the four batch-6 D routes)', () => {
  const derived = storyPages.filter((c) => locale(c.slug) === 'en').map((c) => c.route).sort();
  assert.equal(derived.length, 17);
  // Train A: AHV-WB.015/039.change (batch 8) were rejected in review and excluded, so these two stay without Stories.
  assert.ok(!derived.includes('/ayurvedic-treatment-packages.html') && !derived.includes('/panchkarma-treatment.html'));
  assert.deepEqual([...GUEST_VIDEO_ROUTES].sort(), derived);
  // The original 13 of DEC-GUEST-VIDEO-POPUP stay first and unchanged; batch 6 appends exactly its four D routes.
  assert.deepEqual(GUEST_VIDEO_ROUTES.slice(13), BATCH6.guestVideoRoutesAdded);
  assert.deepEqual([...BATCH6.guestVideoRoutesAdded].sort(), BATCH6.dSlugs.map((slug) => ROUTES[slug].route).sort());
  assert.equal(GUEST_VIDEO_ROUTES.slice(0, 13).filter((r) => BATCH6.guestVideoRoutesAdded.includes(r)).length, 0);
  for (const r of GUEST_VIDEO_ROUTES) assert.equal(routeAllowed(r, 'en'), true, r);
});

test('every other production route, locale and path variant is excluded', () => {
  const others = Object.values(ROUTES).filter((b) => !GUEST_VIDEO_ROUTES.includes(b.route));
  assert.equal(others.length, 7); // 11 before batch 6 appended four D routes
  assert.deepEqual(others.map((b) => b.slug).sort(), ['lp-behandlung-kerala', 'lp-brand', 'lp-treatment-kerala-ru', 'lp-weight-management', 'panchakarma', 'treatment-packages', 'weight-management']);
  for (const b of others) assert.equal(routeAllowed(b.route, b.locale ?? 'en'), false, b.route);
  for (const r of GUEST_VIDEO_ROUTES) {
    for (const lang of ['de', 'fr', 'ru', '', 'english', undefined]) assert.equal(routeAllowed(r, lang), false, `${r} ${lang}`);
    for (const variant of [`/de${r}`, `/fr${r}`, r.toUpperCase(), `${r}x`, r.endsWith('/') ? r.slice(0, -1) : `${r}/`, `${r}?a=1`]) {
      assert.equal(routeAllowed(variant, 'en'), false, variant);
    }
  }
  assert.equal(routeAllowed('/', 'en'), false);
  assert.equal(routeAllowed('/video-gallery/', 'en'), false);
  assert.equal(routeAllowed(null, 'en'), false);
});

test('approved films = every film the 13 routes already link, each mapped back from its card href', () => {
  const hrefs = storyPages.flatMap((c) => c.page.stories.films.map((f) => f.href));
  const ids = new Set();
  for (const href of hrefs) {
    const id = filmIdFromHref(href);
    assert.ok(id, href);
    ids.add(id);
    assert.equal(watchHref(id), href, 'fallback link is the card href itself');
    assert.equal(embedSrc(id), `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`);
  }
  assert.deepEqual([...ids].sort(), [...APPROVED_FILM_IDS].sort());
});

test('no arbitrary source: only exact approved watch URLs yield an id; embeds refuse anything else', () => {
  const bad = [
    'http://www.youtube.com/watch?v=4x01PtWfNnk', 'https://youtube.com/watch?v=4x01PtWfNnk', 'https://m.youtube.com/watch?v=4x01PtWfNnk',
    'https://youtu.be/4x01PtWfNnk', 'https://www.youtube.com/embed/4x01PtWfNnk', 'https://www.youtube.com/watch?v=4x01PtWfNnk&list=x',
    'https://www.youtube.com/watch?v=4x01PtWfNnk#t=3', 'https://www.youtube.com:444/watch?v=4x01PtWfNnk', 'https://a:b@www.youtube.com/watch?v=4x01PtWfNnk',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=4x01PtWfNnkX', 'https://www.youtube.com/watch?v=4x01PtWfNn%22',
    'https://evil.example/watch?v=4x01PtWfNnk', 'javascript:alert(1)', '/watch?v=4x01PtWfNnk', '', null, undefined, 42,
  ];
  for (const href of bad) assert.equal(filmIdFromHref(href), null, String(href));
  for (const id of ['dQw4w9WgXcQ', '4x01PtWfNnk"', '"><script>', '', null, 'iPARaMRASUs?x']) {
    assert.throws(() => embedSrc(id), String(id));
    assert.throws(() => watchHref(id), String(id));
  }
});

test('only a plain primary click is taken over; modified/middle/handled clicks keep the link behaviour', () => {
  const base = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false };
  assert.equal(interceptsClick(base), true);
  for (const k of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey', 'defaultPrevented']) assert.equal(interceptsClick({ ...base, [k]: true }), false, k);
  assert.equal(interceptsClick({ ...base, button: 1 }), false);
  assert.equal(interceptsClick({ ...base, button: 2 }), false);
  assert.equal(interceptsClick(null), false);
});

// -------------------------------------------------------------------------------------------------------- consent

// A stored record with the fields the pinned CookieConsent 3.1.0 writes (see the vendor-shape test below).
const NOW = Date.parse('2026-10-10T06:00:00Z');
const DAY = 86400000;
function record(over = {}) {
  return {
    categories: ['necessary', 'analytics', 'advertising'], revision: policy.REVISION, data: null,
    consentTimestamp: new Date(NOW - DAY).toISOString(), consentId: 'c-1', services: { necessary: [], analytics: [], advertising: [] },
    languageCode: 'current', lastConsentTimestamp: new Date(NOW - DAY).toISOString(), expirationTime: NOW - DAY + 30 * DAY, ...over,
  };
}
function storageWith(rec) {
  const m = new Map(rec ? [[policy.STORAGE_KEY, JSON.stringify(rec)]] : []);
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    put: (r) => m.set(policy.STORAGE_KEY, JSON.stringify(r)),
    setItem: () => assert.fail('must not write consent'), removeItem: () => assert.fail('must not write consent'),
  };
}
/** The CookieConsent read API: getCookie() re-reads the stored record (as the vendor's getCookie does); `valid` = CC.run validated it. */
function ccOver(storage, state = { valid: true }) {
  const rec = () => { try { return JSON.parse(storage.getItem(policy.STORAGE_KEY)); } catch { return null; } };
  return { validConsent: () => state.valid, getCookie: () => rec(), acceptedCategory: (c) => state.valid && !!rec()?.categories.includes(c) };
}
function env(rec, over = {}) {
  const storage = storageWith(rec);
  return { cc: ccOver(storage), policy, storage, gpc: false, settingsReady: true, now: NOW, ...over };
}

test('vendor shape: the pinned CookieConsent stores exactly the fields these fixtures use, and getCookie re-reads storage', () => {
  assert.match(vendorSrc, /o\.p=\{categories:[^}]*revision:[^}]*consentTimestamp:[^}]*consentId:[^}]*services:[^}]*languageCode:[^}]*\}/);
  assert.match(vendorSrc, /o\.p\.lastConsentTimestamp=/);
  assert.match(vendorSrc, /g\.o\.p\.expirationTime=d\.getTime\(\)/);
  assert.match(vendorSrc, /Ke=\(e,t\)=>\{const o=Ae\(t\);return e\?o\[e\]:o\}/);
  assert.match(vendorSrc, /getCookie[^,]*,|Ke as getCookie/);
  assert.equal(vendor.validConsent(), false, 'unrun CMP is never valid');
  assert.equal(vendor.acceptedCategory('analytics'), false);
});

test('consent: granted only for a current, valid, unexpired record accepting every required category', () => {
  assert.deepEqual([...REQUIRED_CATEGORIES], ['analytics', 'advertising']);
  assert.equal(consentGranted(env(record())), true);
});

test('consent: missing API, unrun CMP, unknown, denied, partial, expired, revised and GPC states all fail closed', () => {
  const r = record();
  const cases = {
    'no env': undefined,
    'no CookieConsent': env(r, { cc: undefined }),
    'real vendor module before bridge ran': env(r, { cc: vendor }),
    'bridge not finished (no settings control)': env(r, { settingsReady: false }),
    'no policy module': env(r, { policy: undefined }),
    'GPC': env(r, { gpc: true }),
    'GPC unknown': env(r, { gpc: undefined }),
    'CMP says invalid': (() => { const e = env(r); e.cc = ccOver(e.storage, { valid: false }); return e; })(),
    'nothing stored': env(null),
    'necessary only (rejected)': env(record({ categories: ['necessary'] })),
    'analytics only': env(record({ categories: ['necessary', 'analytics'] })),
    'advertising only': env(record({ categories: ['necessary', 'advertising'] })),
    'older revision': env(record({ revision: policy.REVISION - 1 })),
    'newer/unknown revision': env(record({ revision: policy.REVISION + 1 })),
    'expired': env(record({ expirationTime: NOW - 1 })),
    'future-dated consent': env(record({ lastConsentTimestamp: new Date(NOW + DAY).toISOString() })),
    'unknown category': env(record({ categories: ['necessary', 'analytics', 'advertising', 'video'] })),
    'CC and storage disagree': (() => { const e = env(r); e.cc = ccOver(storageWith(record({ consentId: 'other' }))); return e; })(),
    'CC throws': env(r, { cc: { validConsent: () => { throw new Error('x'); }, getCookie: () => r, acceptedCategory: () => true } }),
    'storage throws': env(r, { storage: { getItem: () => { throw new Error('blocked'); } } }),
    'no clock': env(r, { now: undefined }),
  };
  for (const [name, e] of Object.entries(cases)) assert.equal(consentGranted(e), false, name);
});

test('state machine: the player exists only after an explicit open with current consent; later grant never plays', () => {
  const id = '4x01PtWfNnk';
  assert.equal(playerSrc(CLOSED), null);
  let s = reduce(CLOSED, { type: 'open', id, title: 't', granted: false, routeOk: true });
  assert.equal(s.kind, 'consent');
  assert.equal(playerSrc(reduce(s, { type: 'consent', granted: true })), null);
  s = reduce(CLOSED, { type: 'open', id, title: 't', granted: true, routeOk: true });
  assert.equal(playerSrc(s), embedSrc(id));
  assert.equal(reduce(s, { type: 'consent', granted: false }), CLOSED);
  assert.equal(reduce(s, { type: 'route', routeOk: false }), CLOSED);
  assert.equal(reduce(CLOSED, { type: 'open', id, granted: true, routeOk: false }), CLOSED);
  assert.equal(reduce(CLOSED, { type: 'open', id: 'dQw4w9WgXcQ', granted: true, routeOk: true }), CLOSED);
});

test('settings helper opens the existing Cookie choices control only', () => {
  let calls = 0;
  assert.equal(openCookieSettings({ AHV_COOKIE_SETTINGS: () => { calls++; } }), true);
  assert.equal(calls, 1);
  assert.equal(openCookieSettings({}), false);
  assert.equal(openCookieSettings({ AHV_COOKIE_SETTINGS: () => { throw new Error('x'); } }), false);
});

// ------------------------------------------------------------------------------------- controller wiring (fakes)

class Target {
  constructor() { this.listeners = new Map(); }
  addEventListener(t, f) { if (!this.listeners.has(t)) this.listeners.set(t, new Set()); this.listeners.get(t).add(f); }
  removeEventListener(t, f) { this.listeners.get(t)?.delete(f); }
  fire(t, ev = {}) { for (const f of [...(this.listeners.get(t) ?? [])]) f(ev); }
  count(t) { return t ? this.listeners.get(t)?.size ?? 0 : [...this.listeners.values()].reduce((n, s) => n + s.size, 0); }
}
class El {
  constructor(tag, classes = [], attrs = {}, parent = null, text = '') {
    Object.assign(this, { tag, classes: new Set(classes), attrs, parent, children: [], textContent: text, focused: 0, isConnected: true });
    parent?.children.push(this);
  }
  matches(sel) {
    const m = /^([a-z]+)?(?:\.([\w-]+))?$/.exec(sel);
    return !!m && (!m[1] || m[1] === this.tag) && (!m[2] || this.classes.has(m[2]));
  }
  closest(sel) { for (let e = this; e; e = e.parent) if (e.matches(sel)) return e; return null; }
  querySelector(sel) { for (const c of this.children) { if (c.matches(sel)) return c; const d = c.querySelector(sel); if (d) return d; } return null; }
  getAttribute(n) { return this.attrs[n] ?? null; }
  focus() { this.focused++; }
}

const ORIGIN = 'https://ayurvedichealingvillage.com';
function harness({ path = '/pain-management.html', rec = record(), lang = 'en', gpc = false, settings = true, showModal = true, cmpValid = true, loadFails = false, deferLoad = false } = {}) {
  const storage = storageWith(rec);
  const cmp = { valid: cmpValid };
  const body = new El('body');
  const prod = new El('div', ['lp', 'lp-prod'], {}, body);
  const section = new El('section', ['lp-sec', 'lp-pstories'], {}, prod);
  const cards = {};
  for (const [id, title, src] of [
    ['4x01PtWfNnk', 'Watch Michaela & Jan’s experience', '/_next/image?url=%2Fahv%2Fimages%2Fa.webp&w=640&q=75'],
    ['3vWviQfW1Ug', 'Watch Ms. Supriya’s experience', 'https://i.ytimg.com/vi/3vWviQfW1Ug/hqdefault.jpg'],
    ['dQw4w9WgXcQ', 'Not an approved film', '/x.webp'],
  ]) {
    const a = new El('a', ['lp-pstory'], { href: `https://www.youtube.com/watch?v=${id}`, target: '_blank' }, new El('li', [], {}, section));
    new El('img', [], { src }, new El('span', ['lp-pstory__thumb'], {}, a));
    new El('span', ['lp-pstory__title'], {}, new El('span', ['lp-pstory__text'], {}, a), title);
    cards[id] = a;
  }
  const outside = new El('a', ['lp-pstory'], { href: 'https://www.youtube.com/watch?v=4x01PtWfNnk' }, prod);
  const timers = new Map();
  let nextTimer = 1;
  const calls = { settings: 0, opened: [], loads: 0 };
  function Dialog() {}
  if (showModal) Dialog.prototype.showModal = function () {};
  const win = Object.assign(new Target(), {
    location: { pathname: path, href: ORIGIN + path, origin: ORIGIN },
    navigator: { globalPrivacyControl: gpc }, localStorage: storage, HTMLDialogElement: Dialog,
    setInterval: (f) => { timers.set(nextTimer, f); return nextTimer++; }, clearInterval: (id) => { timers.delete(id); },
    open: (...a) => { calls.opened.push(a); },
  });
  if (settings) win.AHV_COOKIE_SETTINGS = () => { calls.settings++; };
  const doc = Object.assign(new Target(), { documentElement: { lang }, body });
  let release;
  const gate = deferLoad ? new Promise((r) => { release = r; }) : null;
  const loadConsent = async () => {
    calls.loads++;
    if (gate) await gate;
    if (loadFails) throw new Error('404');
    return { cc: ccOver(storage, cmp), policy };
  };
  let now = NOW;
  const ctl = createGuestVideoController({ win, doc, loadConsent, now: () => now });
  const h = {
    ctl, win, doc, storage, cmp, cards, outside, calls, release,
    view: () => ctl.getSnapshot(),
    src: () => playerSrc(ctl.getSnapshot().film),
    click(target, mods = {}) {
      const ev = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false, target, ...mods };
      ev.preventDefault = () => { ev.defaultPrevented = true; };
      doc.fire('click', ev);
      return ev;
    },
    go(p, { router = true } = {}) { win.location.pathname = p; win.location.href = ORIGIN + p; if (router) ctl.setPathname(p); },
    tick() { for (const f of [...timers.values()]) f(); },
    timers: () => timers.size,
    advance(ms) { now += ms; },
  };
  ctl.install();
  ctl.setPathname(path);
  return h;
}
const flush = () => new Promise((r) => setImmediate(r));

test('wiring: first route unapproved, then a client navigation to an approved one — works there, nothing fetched before', async () => {
  const h = harness({ path: '/lp/weight-loss/' });
  await flush();
  assert.equal(h.calls.loads, 0, 'no consent module fetch off-route');
  assert.equal(h.click(h.cards['4x01PtWfNnk']).defaultPrevented, false, 'off-route the card stays a link');
  assert.equal(h.view(), CLOSED_VIEW);
  h.go('/pain-management.html');
  await flush();
  assert.equal(h.calls.loads, 1);
  const ev = h.click(h.cards['4x01PtWfNnk']);
  assert.equal(ev.defaultPrevented, true);
  await flush();
  assert.equal(h.view().film.kind, 'playing');
  assert.equal(h.src(), embedSrc('4x01PtWfNnk'), 'the iframe is the pressed film, from the policy');
  assert.equal(h.view().host, h.cards['4x01PtWfNnk'].closest('.lp-prod'));
});

test('wiring: approved first, then an unapproved or localized route — no interception, nothing opens', async () => {
  for (const [p, lang] of [['/lp/weight-loss/', 'en'], ['/lp/behandlung-in-kerala/', 'de'], ['/pain-management.html', 'de']]) {
    const h = harness();
    await flush();
    h.go(p);
    h.doc.documentElement.lang = lang;
    const ev = h.click(h.cards['4x01PtWfNnk']);
    await flush();
    assert.equal(ev.defaultPrevented, false, `${p} ${lang}`);
    assert.equal(h.view(), CLOSED_VIEW);
  }
});

test('wiring: ANY route change closes a playing film — allowed → different allowed via the router, or history alone', async () => {
  const h = harness();
  await flush();
  h.click(h.cards['4x01PtWfNnk']);
  await flush();
  assert.ok(h.src());
  h.go('/lp/pain-management/');
  assert.equal(h.view(), CLOSED_VIEW, 'router pathname change to another allowed route closes');
  assert.equal(h.src(), null);

  const g = harness();
  await flush();
  g.click(g.cards['4x01PtWfNnk']);
  await flush();
  g.go('/treatment-in-kerala.html', { router: false });
  g.tick();
  assert.equal(g.view(), CLOSED_VIEW, 'a history change the router did not report is caught by the recheck');

  const p = harness();
  await flush();
  p.click(p.cards['4x01PtWfNnk']);
  await flush();
  p.win.fire('popstate');
  assert.equal(p.view(), CLOSED_VIEW, 'back/forward closes');
});

test('wiring: a press made before the consent modules arrive is cancelled by navigation', async () => {
  const h = harness({ deferLoad: true });
  const ev = h.click(h.cards['4x01PtWfNnk']);
  assert.equal(ev.defaultPrevented, true);
  h.go('/lp/treatment-packages/');
  h.release();
  await flush();
  assert.equal(h.view(), CLOSED_VIEW);
});

test('race: a press while consent is unknown is denied for that press; a grant landing during the load never plays it', async () => {
  const h = harness({ rec: record({ categories: ['necessary'] }), deferLoad: true });
  const ev = h.click(h.cards['4x01PtWfNnk']);
  assert.equal(ev.defaultPrevented, true);
  h.storage.put(record());
  h.release();
  await flush();
  assert.equal(h.view().film.kind, 'consent', 'grant after the press is not applied to it');
  assert.equal(h.src(), null, 'no iframe');
  h.ctl.close();
  h.ctl.dialogClosed();
  h.click(h.cards['4x01PtWfNnk']);
  await flush();
  assert.equal(h.view().film.kind, 'playing', 'a new explicit press after the grant plays');
  assert.equal(h.src(), embedSrc('4x01PtWfNnk'));

  const stored = harness({ deferLoad: true });
  stored.click(stored.cards['4x01PtWfNnk']);
  stored.release();
  await flush();
  assert.equal(stored.src(), null, 'unknown at the press counts as denied even if the stored record turns out granted');
});

test('race: a known grant is rechecked when the film opens, so a revocation before the press stays denied', async () => {
  const h = harness();
  await flush();
  h.storage.put(record({ categories: ['necessary', 'analytics'] }));
  h.click(h.cards['4x01PtWfNnk']);
  await flush();
  assert.equal(h.view().film.kind, 'consent');
  assert.equal(h.src(), null);
  const v = harness();
  await flush();
  v.cmp.valid = false;
  v.click(v.cards['4x01PtWfNnk']);
  await flush();
  assert.equal(v.src(), null);
});

test('wiring: without current consent only the local facade shows; granting while open never starts the player', async () => {
  const h = harness({ rec: record({ categories: ['necessary'] }) });
  await flush();
  h.click(h.cards['4x01PtWfNnk']);
  await flush();
  assert.equal(h.view().film.kind, 'consent');
  assert.equal(h.src(), null);
  assert.equal(h.view().thumb, '/_next/image?url=%2Fahv%2Fimages%2Fa.webp&w=640&q=75', 'the card’s own local thumbnail');
  h.storage.put(record());
  h.win.fire('cc:onChange');
  h.tick();
  assert.equal(h.view().film.kind, 'consent');
  assert.equal(h.src(), null, 'no autoplay on grant');
});

test('wiring: consent modules unavailable → facade with the external link, never a player', async () => {
  const h = harness({ loadFails: true });
  await flush();
  const ev = h.click(h.cards['4x01PtWfNnk']);
  await flush();
  assert.equal(ev.defaultPrevented, true);
  assert.equal(h.view().film.kind, 'consent');
  assert.equal(h.src(), null);
});

test('wiring: withdrawal, CMP invalidation, expiry and a locale change each remove the playing film', async () => {
  const withdraw = harness();
  await flush();
  withdraw.click(withdraw.cards['4x01PtWfNnk']);
  await flush();
  assert.ok(withdraw.src());
  withdraw.storage.put(record({ categories: ['necessary', 'analytics'] }));
  withdraw.win.fire('cc:onChange');
  assert.equal(withdraw.view(), CLOSED_VIEW, 'withdrawal');

  const invalid = harness();
  await flush();
  invalid.click(invalid.cards['4x01PtWfNnk']);
  await flush();
  invalid.cmp.valid = false;
  invalid.win.fire('storage');
  assert.equal(invalid.view(), CLOSED_VIEW, 'CMP no longer valid');

  const expiry = harness();
  await flush();
  expiry.click(expiry.cards['4x01PtWfNnk']);
  await flush();
  expiry.advance(30 * DAY);
  expiry.tick();
  assert.equal(expiry.view(), CLOSED_VIEW, 'expiry while open');

  const lang = harness();
  await flush();
  lang.click(lang.cards['4x01PtWfNnk']);
  await flush();
  lang.doc.documentElement.lang = 'de';
  lang.tick();
  assert.equal(lang.view(), CLOSED_VIEW, 'locale change');
});

test('wiring: GPC never plays, even with a full stored grant', async () => {
  const h = harness({ gpc: true });
  await flush();
  h.click(h.cards['4x01PtWfNnk']);
  await flush();
  assert.equal(h.view().film.kind, 'consent');
  assert.equal(h.view().gpc, true);
  assert.equal(h.src(), null);
});

test('wiring: close/Escape tears everything down and returns focus to the pressed card; unmount removes the listener', async () => {
  const h = harness();
  await flush();
  const before = { win: h.win.count(), doc: h.doc.count() };
  h.click(h.cards['4x01PtWfNnk']);
  await flush();
  assert.ok(h.win.count() > before.win && h.timers() === 1, 'rechecks run only while open');
  h.ctl.close();
  assert.equal(h.view(), CLOSED_VIEW);
  assert.deepEqual({ win: h.win.count(), doc: h.doc.count() }, before, 'open-time listeners removed');
  assert.equal(h.timers(), 0);
  h.ctl.dialogClosed();
  assert.equal(h.cards['4x01PtWfNnk'].focused, 1);
  assert.equal(h.calls.settings, 0);
  h.click(h.cards['4x01PtWfNnk']);
  await flush();
  h.ctl.destroy();
  assert.equal(h.view(), CLOSED_VIEW);
  assert.equal(h.doc.count('click'), 0);
  assert.equal(h.click(h.cards['4x01PtWfNnk']).defaultPrevented, false, 'after unmount the card is a plain link');
});

test('wiring: Cookie choices close the popup first and open the existing control after the dialog closed', async () => {
  const h = harness({ rec: null });
  await flush();
  h.click(h.cards['4x01PtWfNnk']);
  await flush();
  assert.equal(h.ctl.requestSettings(), true);
  assert.equal(h.view(), CLOSED_VIEW);
  assert.equal(h.calls.settings, 0, 'not while the modal is still in the page');
  h.ctl.dialogClosed();
  assert.equal(h.calls.settings, 1);
  assert.equal(h.cards['4x01PtWfNnk'].focused, 1);

  const none = harness({ rec: null, settings: false });
  await flush();
  none.click(none.cards['4x01PtWfNnk']);
  await flush();
  assert.equal(none.ctl.requestSettings(), false);
  assert.equal(none.view().settingsUnavailable, true);
  assert.equal(none.view().film.kind, 'consent', 'stays open with the external link; no substitute UI');
});

test('wiring: modified/middle clicks, cards outside the section, unapproved films and no native modal keep the link', async () => {
  const h = harness();
  await flush();
  for (const mods of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    assert.equal(h.click(h.cards['4x01PtWfNnk'], mods).defaultPrevented, false, JSON.stringify(mods));
  }
  assert.equal(h.click(h.outside).defaultPrevented, false);
  assert.equal(h.click(h.cards['dQw4w9WgXcQ']).defaultPrevented, false);
  await flush();
  assert.equal(h.view(), CLOSED_VIEW);
  const old = harness({ showModal: false });
  await flush();
  assert.equal(dialogSupported(old.win), false);
  assert.equal(old.click(old.cards['4x01PtWfNnk']).defaultPrevented, false);
  assert.equal(dialogSupported({ HTMLDialogElement: function () {} }), false, 'constructor alone is not proof');
});

test('wiring: if showModal() still fails, the popup closes and the card’s href opens as its link would', async () => {
  const h = harness();
  await flush();
  h.click(h.cards['4x01PtWfNnk']);
  await flush();
  h.ctl.modalFailed();
  assert.equal(h.view(), CLOSED_VIEW);
  assert.deepEqual(h.calls.opened, [['https://www.youtube.com/watch?v=4x01PtWfNnk', '_blank', 'noopener,noreferrer']]);
});

test('thumbnails: only a same-origin image already on the card, never a remote one', () => {
  const h = harness();
  assert.equal(localThumb(h.cards['3vWviQfW1Ug'], h.win), null);
  assert.equal(localThumb(h.cards['4x01PtWfNnk'], h.win), '/_next/image?url=%2Fahv%2Fimages%2Fa.webp&w=640&q=75');
});

// ---------------------------------------------------------------------------------------------- source checks

test('component source: thin shell over the controller, native modal only, one policy-sourced iframe', () => {
  assert.match(dialogSrc, /^"use client";/);
  assert.match(dialogSrc, /const pathname = usePathname\(\);/);
  assert.match(dialogSrc, /useEffect\(\(\) => \{ ctl\?\.setPathname\(pathname\); \}, \[ctl, pathname\]\);/);
  assert.match(dialogSrc, /createGuestVideoController\(\{ win: window, doc: document, loadConsent \}\)/);
  assert.match(dialogSrc, /return \(\) => c\.destroy\(\);/);
  assert.match(dialogSrc, /try \{\s*dlg\.showModal\(\);\s*\} catch \{\s*ctl\.modalFailed\(\);/);
  assert.doesNotMatch(dialogSrc, /setAttribute\(\s*["']open|useDialog\(/, 'no non-modal stand-in');
  assert.match(dialogSrc, /ctl\.dialogClosed\(\);\s*\};\s*\}, \[isOpen, ctl\]\);/);
  assert.equal(dialogSrc.match(/<iframe\b/g)?.length, 1);
  assert.match(dialogSrc, /const src = playerSrc\(film\);/);
  assert.match(dialogSrc, /\{src \? \(\s*<iframe[\s\S]*?src=\{src\}/);
  assert.match(dialogSrc, /href=\{watchHref\(film\.id\)\} target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(dialogSrc, /youtube(-nocookie)?\.com|youtu\.be|ytimg/i, 'no provider URL outside the policy');
  assert.doesNotMatch(dialogSrc, /preconnect|dns-prefetch|prefetch/i);
  assert.doesNotMatch(dialogSrc, /kairali-consent-v1|ktahv-consent|ahv-consent-v2|integrations\/consent/);
  assert.doesNotMatch(dialogSrc, /(AHV_SET_CONSENT|AHV_COOKIE_SETTINGS|CookieConsent)\s*=[^=]/, 'no consent API monkeypatch');
  assert.doesNotMatch(dialogSrc, /\.(acceptCategory|acceptService|setCookieData|reset|run)\(|localStorage|sessionStorage|history\.|pushState/);
  assert.match(dialogSrc, /webpackIgnore: true \*\/ CC_URL/);
  assert.equal(dialogSrc.match(/addEventListener\(/g).length, dialogSrc.match(/removeEventListener\(/g).length);
  assert.match(dialogSrc, /onKeyDown=\{trapTab\}/);
  assert.match(dialogSrc, /aria-modal="true"/);
  const jsx = dialogSrc.slice(dialogSrc.indexOf('return createPortal('));
  const visible = [...jsx.matchAll(/>([^<>{}]+)</g), ...jsx.matchAll(/aria-label="([^"]+)"/g)].map((m) => m[1].trim()).filter(Boolean).join(' | ');
  assert.match(visible, /This video is hosted on YouTube\./);
  assert.doesNotMatch(visible, /\b(spa|resort|holiday|luxury|cure|journey|guests?)\b/i, 'KTAHV language lock in visible copy');
});

test('policy source: read-only consent, no history or consent API patching', () => {
  const src = read('../campaign-v2/production/sections/guest-video-policy.mjs');
  assert.doesNotMatch(src, /(AHV_SET_CONSENT|AHV_COOKIE_SETTINGS|CookieConsent|pushState|replaceState)\s*=[^=]/);
  assert.doesNotMatch(src, /\.(setItem|removeItem|acceptCategory|acceptService|setCookieData|run|reset)\(|kairali-consent-v1/);
  assert.doesNotMatch(src, /history\./);
});

test('Stories keeps its cards, links, thumbnails and fallback; the popup only mounts', () => {
  assert.match(storiesSrc, /<a className="lp-pstory" href=\{f\.href\} target="_blank" rel="noopener noreferrer">/);
  assert.match(storiesSrc, /<Image src=\{f\.thumb\.src\} alt="" width=\{f\.thumb\.width\} height=\{f\.thumb\.height\}/);
  assert.match(storiesSrc, /YouTube<span className="lp-sr"> \(opens in a new tab\)<\/span>/);
  assert.equal(storiesSrc.match(/<GuestVideoDialog \/>/g)?.length, 1);
  assert.doesNotMatch(storiesSrc, /^"use client"/, 'Stories stays a server component');
});

test('popup CSS is dedicated: no rule touches the section, its cards or global elements', () => {
  assert.doesNotMatch(cssSrc, /lp-pstor|:global|(^|[\s,}])(a|button|img|iframe|h2|dialog|body|html)\s*[{,]/m);
  assert.match(cssSrc, /@media \(max-width: 767px\)/);
});
