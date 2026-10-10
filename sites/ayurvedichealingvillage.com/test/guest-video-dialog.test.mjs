// DEC-GUEST-VIDEO-POPUP: the Stories on-page film popup (campaign-v2/production/sections/GuestVideoDialog.tsx +
// guest-video-policy.mjs). Source-level proof only: no browser runs here, so playback, focus movement, mobile layout
// and real network silence still need browser acceptance by the release owner.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  APPROVED_FILM_IDS, CLOSED, GUEST_VIDEO_ROUTES, REQUIRED_CATEGORIES, consentGranted, embedSrc, filmIdFromHref,
  interceptsClick, openCookieSettings, playerSrc, reduce, routeAllowed, watchHref,
} from '../campaign-v2/production/sections/guest-video-policy.mjs';
import * as policy from '../public/consent/policy.mjs';
import * as vendor from '../public/consent/vendor/cookieconsent.esm.js';
import { COPY } from '../campaign-v2/production/pages/index.ts';
import { ROUTES } from '../campaign-v2/production/bindings.ts';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const dialogSrc = read('../campaign-v2/production/sections/GuestVideoDialog.tsx');
const storiesSrc = read('../campaign-v2/production/sections/Stories.tsx');
const cssSrc = read('../campaign-v2/production/sections/GuestVideoDialog.module.css');

const storyPages = Object.values(COPY).filter((c) => c.page?.stories);
const locale = (slug) => ROUTES[slug].locale ?? 'en';

test('allowlist = exactly the English production routes that render Stories (13)', () => {
  const derived = storyPages.filter((c) => locale(c.slug) === 'en').map((c) => c.route).sort();
  assert.equal(derived.length, 13);
  assert.deepEqual([...GUEST_VIDEO_ROUTES].sort(), derived);
  for (const r of GUEST_VIDEO_ROUTES) assert.equal(routeAllowed(r, 'en'), true, r);
});

test('every other production route, locale and path variant is excluded', () => {
  const others = Object.values(ROUTES).filter((b) => !GUEST_VIDEO_ROUTES.includes(b.route));
  assert.equal(others.length, 11);
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

// A stored record shaped as bridge.mjs/CookieConsent write it (STORAGE_KEY, current REVISION).
const NOW = Date.parse('2026-10-10T06:00:00Z');
const DAY = 86400000;
function record(over = {}) {
  return {
    categories: ['necessary', 'analytics', 'advertising'], revision: policy.REVISION, consentId: 'c-1',
    consentTimestamp: new Date(NOW - DAY).toISOString(), lastConsentTimestamp: new Date(NOW - DAY).toISOString(),
    expirationTime: NOW - DAY + 30 * DAY, ...over,
  };
}
function storageWith(rec) {
  const m = new Map(rec ? [[policy.STORAGE_KEY, JSON.stringify(rec)]] : []);
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: () => assert.fail('must not write consent'), removeItem: () => assert.fail('must not write consent') };
}
/** The CookieConsent read API over the same record (what CC.run would expose after validating it). */
function ccFor(rec, valid = true) {
  return { validConsent: () => valid, getCookie: () => rec, acceptedCategory: (c) => !!rec?.categories.includes(c) };
}
function env(rec, over = {}) {
  return { cc: ccFor(rec), policy, storage: storageWith(rec), gpc: false, settingsReady: true, now: NOW, ...over };
}

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
    'CMP says invalid': env(r, { cc: ccFor(r, false) }),
    'nothing stored': env(r, { storage: storageWith(null) }),
    'necessary only (rejected)': env(record({ categories: ['necessary'] })),
    'analytics only': env(record({ categories: ['necessary', 'analytics'] })),
    'advertising only': env(record({ categories: ['necessary', 'advertising'] })),
    'older revision': env(record({ revision: policy.REVISION - 1 })),
    'newer/unknown revision': env(record({ revision: policy.REVISION + 1 })),
    'expired': env(record({ expirationTime: NOW - 1 })),
    'future-dated consent': env(record({ lastConsentTimestamp: new Date(NOW + DAY).toISOString() })),
    'unknown category': env(record({ categories: ['necessary', 'analytics', 'advertising', 'video'] })),
    'CC and storage disagree': env(r, { storage: storageWith(record({ consentId: 'other' })) }),
    'CC throws': env(r, { cc: { validConsent: () => { throw new Error('x'); }, getCookie: () => r, acceptedCategory: () => true } }),
    'storage throws': env(r, { storage: { getItem: () => { throw new Error('blocked'); } } }),
    'no clock': env(r, { now: undefined }),
  };
  for (const [name, e] of Object.entries(cases)) assert.equal(consentGranted(e), false, name);
});

test('lifecycle: no player before current consent AND an explicit press; granting later never auto-plays', () => {
  const id = '4x01PtWfNnk';
  assert.equal(playerSrc(CLOSED), null);
  let s = reduce(CLOSED, { type: 'open', id, title: 'Watch Michaela & Jan’s experience', granted: false, routeOk: true });
  assert.equal(s.kind, 'consent');
  assert.equal(playerSrc(s), null, 'facade only before grant');
  s = reduce(s, { type: 'consent', granted: true });
  assert.equal(s.kind, 'consent');
  assert.equal(playerSrc(s), null, 'consent alone does not start playback');
  s = reduce(s, { type: 'close' });
  assert.equal(s, CLOSED);
  s = reduce(s, { type: 'open', id, title: 't', granted: true, routeOk: true });
  assert.equal(s.kind, 'playing');
  assert.equal(playerSrc(s), embedSrc(id));
});

test('lifecycle: withdrawal/expiry, route or locale change, close/Escape/unmount all remove the player', () => {
  const play = () => reduce(CLOSED, { type: 'open', id: 'iPARaMRASUs', title: 't', granted: true, routeOk: true });
  assert.equal(playerSrc(reduce(play(), { type: 'consent', granted: false })), null);
  assert.equal(reduce(play(), { type: 'consent', granted: false }), CLOSED);
  assert.equal(reduce(play(), { type: 'route', routeOk: false }), CLOSED);
  assert.equal(reduce(play(), { type: 'close' }), CLOSED);
  const kept = play();
  assert.equal(reduce(kept, { type: 'consent', granted: true }), kept, 'still-granted recheck keeps playing');
  assert.equal(reduce(kept, { type: 'route', routeOk: true }), kept);
  assert.equal(reduce(kept, { type: 'open', id: '3vWviQfW1Ug', title: 'x', granted: true, routeOk: true }), kept, 'no second player');
});

test('lifecycle: never opens off-route or for an unapproved film', () => {
  assert.equal(reduce(CLOSED, { type: 'open', id: '4x01PtWfNnk', title: 't', granted: true, routeOk: false }), CLOSED);
  assert.equal(reduce(CLOSED, { type: 'open', id: 'dQw4w9WgXcQ', title: 't', granted: true, routeOk: true }), CLOSED);
  assert.equal(reduce(CLOSED, { type: 'open', id: undefined, granted: true, routeOk: true }), CLOSED);
  assert.equal(reduce(CLOSED, { type: 'bogus' }), CLOSED);
});

test('settings opens the existing Cookie choices control only; unavailable is reported, never replaced', () => {
  let calls = 0;
  assert.equal(openCookieSettings({ AHV_COOKIE_SETTINGS: () => { calls++; } }), true);
  assert.equal(calls, 1);
  assert.equal(openCookieSettings({}), false);
  assert.equal(openCookieSettings(undefined), false);
  assert.equal(openCookieSettings({ AHV_COOKIE_SETTINGS: () => { throw new Error('x'); } }), false);
});

test('component source: one gated iframe, URLs only from the policy, read-only consent, full teardown', () => {
  assert.match(dialogSrc, /^"use client";/);
  assert.equal(dialogSrc.match(/<iframe\b/g)?.length, 1);
  assert.match(dialogSrc, /const src = playerSrc\(state\);/);
  assert.match(dialogSrc, /\{src \? \(\s*<iframe[\s\S]*?src=\{src\}/);
  assert.doesNotMatch(dialogSrc, /youtube(-nocookie)?\.com|youtu\.be|ytimg/i, 'no provider URL outside the policy');
  assert.doesNotMatch(dialogSrc, /preconnect|dns-prefetch|prefetch/i);
  assert.doesNotMatch(dialogSrc, /kairali-consent-v1|ktahv-consent|ahv-consent-v2|integrations\/consent/);
  assert.doesNotMatch(dialogSrc, /(AHV_SET_CONSENT|AHV_COOKIE_SETTINGS|CookieConsent)\s*=[^=]/, 'no consent API monkeypatch');
  assert.doesNotMatch(dialogSrc, /\.(acceptCategory|acceptService|setCookieData|reset|run|show)\(|localStorage\.(setItem|removeItem)|sessionStorage/);
  assert.match(dialogSrc, /webpackIgnore: true \*\/ CC_URL/);
  assert.match(dialogSrc, /"\/consent\/vendor\/cookieconsent\.esm\.js"/);
  assert.match(dialogSrc, /useDialog\(isOpen, close\)/, 'kit dialog: modal, focus trap, Escape, scroll lock, focus return');
  assert.match(dialogSrc, /onKeyDown=\{trapKeyDown\}/);
  assert.match(dialogSrc, /setTrigger\(link\)/);
  assert.match(dialogSrc, /if \(!currentRouteOk\(\)\) return;/, 'no listener off-route');
  assert.match(dialogSrc, /interceptsClick\(e\)[^\n]*currentRouteOk\(\)/, 'route rechecked on every click');
  for (const ev of ['"cc:onChange"', '"cc:onConsent"', '"storage"', '"popstate"', '"pagehide"', '"visibilitychange"']) assert.ok(dialogSrc.includes(ev), ev);
  const adds = dialogSrc.match(/addEventListener\(/g).length;
  const removes = dialogSrc.match(/removeEventListener\(/g).length;
  assert.equal(adds, removes, 'every listener is removed on close/unmount');
  assert.match(dialogSrc, /attributeFilter: \["lang"\]/);
  assert.match(dialogSrc, /clearInterval\(timer\)/);
  // KTAHV language lock on what a visitor reads: JSX text and aria labels of the rendered popup (not identifiers).
  const jsx = dialogSrc.slice(dialogSrc.indexOf('return createPortal('));
  const visible = [...jsx.matchAll(/>([^<>{}]+)</g), ...jsx.matchAll(/aria-label="([^"]+)"/g)].map((m) => m[1].trim()).filter(Boolean).join(' | ');
  assert.match(visible, /This video is hosted on YouTube\./);
  assert.doesNotMatch(visible, /\b(spa|resort|holiday|luxury|cure|journey|guests?)\b/i, 'KTAHV language lock in visible copy');
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
