import { restoreReviewedTitle } from '../app/(english)/_families/localized-title.mjs';
import { repairFaqTopicTargets } from '../app/(english)/_families/faq-topic-targets.mjs';
import { removeHomeVillaRates } from '../app/(english)/_families/home-villa-rates.mjs';
import {offersFlow} from '../app/(english)/_families/offers-flow.mjs';
// Media loading (lane P-perf): the runtime-side fixes in app/(english)/_families/media-loading.mjs.
// They are injected into BOOT_SCRIPT with fn.toString(), so each must also be self-contained and must
// survive being re-parsed from its own source text — asserted below for every export.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  EAGER_SLOTS, lazyImgFirst, deferHeroFilm, installLazyImgOrder, installSlotLoading, createBackgroundDeferral,
} from "../app/(english)/_families/media-loading.mjs";
import { phoneCriticalMedia, descriptiveAwardLinks, villaImageAttributes } from "../app/(english)/_families/critical-media.mjs";
import { formPostSafety } from "../app/(english)/_families/form-post-safety.mjs";
import { orderedRuntimeScripts } from "../app/(english)/_families/runtime-script-order.mjs";
import { CONSENT_RUNTIME } from "../app/(english)/_families/consent-runtime.ts";
// lane PERF2: two more helpers injected into BOOT_SCRIPT (snapshot-paint.mjs); the parse test needs them in scope
import { deferFarSnapshotContent, whenSnapshotPainted, snapshotFocusTarget, preserveSnapshotInputs } from "../app/(english)/_families/snapshot-paint.mjs";

const attrs = (tag) => (tag.match(/\s[a-zA-Z-:]+(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/g) || []).map((a) => a.trim()).sort();

test("lazyImgFirst puts loading=lazy ahead of src and changes nothing else", () => {
  const src = '<img src="/ahv/assets/img/sleep-restoration.webp" alt="Sleep" width="580" height="387" loading="lazy" decoding="async">';
  const out = lazyImgFirst(src);
  assert.equal(out, '<img loading="lazy" src="/ahv/assets/img/sleep-restoration.webp" alt="Sleep" width="580" height="387" decoding="async">');
  assert.deepEqual(attrs(out), attrs(src));
  assert.equal(lazyImgFirst(out), out, "idempotent");
  // an img without lazy is untouched, eager or otherwise
  for (const t of ['<img src="/a.webp" alt="">', '<img src="/a.webp" loading="eager" alt="">', '<img src="/a.webp" fetchpriority="high">']) assert.equal(lazyImgFirst(t), t);
  // interpolated src and single quotes survive
  assert.equal(lazyImgFirst("<img src=\"{{ g.image }}\" alt=\"{{ g.alt }}\" loading='lazy'/>"), "<img loading='lazy' src=\"{{ g.image }}\" alt=\"{{ g.alt }}\"/>");
  // <image-slot> and other tags are never touched
  assert.equal(lazyImgFirst('<image-slot src="/a.webp" loading="lazy">'), '<image-slot src="/a.webp" loading="lazy">');
});

test("lazyImgFirst over every approved view template: same attributes per tag, every lazy img leads with loading", () => {
  const dirs = ["public/ahv/views"];
  const L = JSON.parse(fs.readFileSync("l10n/locales.json", "utf8"));
  for (const [loc, info] of Object.entries(L)) if (loc !== "en" && fs.existsSync(`public/ahv/l10n/${info.prefix}/views`)) dirs.push(`public/ahv/l10n/${info.prefix}/views`);
  let lazy = 0, files = 0;
  for (const d of dirs) for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".json"))) {
    const { template = "" } = JSON.parse(fs.readFileSync(`${d}/${f}`, "utf8"));
    const safe = formPostSafety(template);
    const out = lazyImgFirst(safe);
    files++;
    const before = safe.match(/<img\b[^>]*>/gi) || [], after = out.match(/<img\b[^>]*>/gi) || [];
    assert.equal(after.length, before.length, `${d}/${f} img count`);
    before.forEach((t, i) => assert.deepEqual(attrs(after[i]), attrs(t), `${d}/${f} img #${i}`));
    for (const t of after) if (/\sloading=["']lazy["']/i.test(t)) { lazy++; assert.match(t, /^<img loading=["']lazy["']/i, `${d}/${f}`); }
    // outside <img> tags the template is byte-identical
    assert.equal(out.replace(/<img\b[^>]*>/gi, ""), safe.replace(/<img\b[^>]*>/gi, ""), `${d}/${f} non-img bytes`);
  }
  assert.ok(files > 200 && lazy > 1000, `files=${files} lazy=${lazy}`);
});

test("deferHeroFilm rewrites the homepage film start in English and every built locale, and the logic still compiles", () => {
  const files = ["public/ahv/views/home-hi-fi-v4.json", "public/ahv/views/home-mobile.json"];
  const L = JSON.parse(fs.readFileSync("l10n/locales.json", "utf8"));
  for (const [loc, info] of Object.entries(L)) {
    for (const name of ["home-hi-fi-v4", "home-mobile"]) {
      const f = `public/ahv/l10n/${info.prefix}/views/${name}.json`;
      if (loc !== "en" && fs.existsSync(f)) files.push(f);
    }
  }
  assert.ok(files.length >= 26, `Both layouts in EN + 12 locales, found ${files.length}`);
  for (const f of files) {
    const { logic } = JSON.parse(fs.readFileSync(f, "utf8"));
    assert.ok(logic.includes("if (wide && !calm) this._heroPlay();") || logic.includes("_setHero = (el) => { if (el) this._hv = el; };"), `${f} carries the known homepage ref`);
    const out = deferHeroFilm(logic);
    assert.notEqual(out, logic, f);
    assert.doesNotMatch(out, /if \(wide && !calm\) this\._heroPlay\(\);/);
    assert.match(out, /addEventListener\('load', idle, \{once: true\}\)/);
    assert.match(out, /saveData/);
    new Function("DCLogic", "StreamableLogic", "React", out + '\n;return (typeof Component!=="undefined"&&Component)||undefined;');
  }
  // Other page families never gain autoplay.
  for (const f of fs.readdirSync("public/ahv/views").filter((x) => x.endsWith(".json") && !["home-hi-fi-v4.json", "home-mobile.json"].includes(x))) {
    const { logic = "" } = JSON.parse(fs.readFileSync(`public/ahv/views/${f}`, "utf8"));
    assert.equal(deferHeroFilm(logic), logic, f);
  }
});

test("deferHeroFilm: the deferred start never overrides a visitor who already started the film", async () => {
  const logic = deferHeroFilm("if (wide && !calm) this._heroPlay();");
  const calls = [];
  const listeners = {};
  const env = {
    window: { requestIdleCallback: (fn) => fn(), addEventListener: (ev, fn) => { listeners[ev] = fn; } },
    navigator: {}, document: { readyState: "loading" },
  };
  const run = (hvSrc) => {
    const self = { _hv: { getAttribute: () => hvSrc }, _heroPlay() { calls.push(hvSrc); } };
    new Function("wide", "calm", "window", "navigator", "document", "requestIdleCallback", "setTimeout", logic)
      .call(self, true, false, env.window, env.navigator, env.document, env.window.requestIdleCallback, setTimeout);
    listeners.load();
  };
  run(null);
  run("/ahv/assets/homepage-journey.mp4");
  assert.deepEqual(calls, [null], "plays once on load+idle, and not when the visitor already set it going");
  const saver = { ...env, navigator: { connection: { saveData: true } } };
  const self = { _hv: { getAttribute: () => null }, _heroPlay() { calls.push("saver"); } };
  new Function("wide", "calm", "window", "navigator", "document", "requestIdleCallback", "setTimeout", logic)
    .call(self, true, false, saver.window, saver.navigator, { readyState: "complete" }, saver.window.requestIdleCallback, setTimeout);
  assert.deepEqual(calls, [null], "Save-Data keeps the film click-to-play");
});

function fakeImg(connected) {
  const a = new Map();
  return { tagName: "IMG", isConnected: connected, __ahvSrc: undefined,
    setAttribute(n, v) { a.set(n, String(v)); }, getAttribute(n) { return a.has(n) ? a.get(n) : null; },
    hasAttribute(n) { return a.has(n); }, removeAttribute(n) { a.delete(n); }, order: a };
}

test("installLazyImgOrder: a detached img's src lands after its loading attribute; everything else passes through", async () => {
  const proto = { setAttribute(n, v) { this.order.set(n, String(v)); } };
  const win = { Element: { prototype: proto }, queueMicrotask };
  installLazyImgOrder(win);
  installLazyImgOrder(win); // idempotent
  const set = (el, n, v) => proto.setAttribute.call(el, n, v);
  const detached = fakeImg(false);
  set(detached, "src", "/a.webp"); set(detached, "alt", ""); set(detached, "loading", "lazy");
  assert.deepEqual([...detached.order.keys()], ["alt", "fetchpriority", "loading"], "src held for a microtask");
  await Promise.resolve();
  assert.deepEqual([...detached.order.keys()], ["alt", "fetchpriority", "loading", "src"]);
  assert.equal(detached.getAttribute("src"), "/a.webp");
  assert.equal(detached.getAttribute("fetchpriority"), "low", "off-screen image cannot compete with the hero");
  const connected = fakeImg(true);
  set(connected, "src", "/b.webp");
  assert.equal(connected.getAttribute("src"), "/b.webp", "connected images are untouched");
  const hasLazy = fakeImg(false);
  set(hasLazy, "loading", "lazy"); set(hasLazy, "src", "/c.webp");
  assert.equal(hasLazy.getAttribute("src"), "/c.webp", "already lazy: no hold");
  const div = { ...fakeImg(false), tagName: "DIV" };
  set(div, "src", "/d"); assert.equal(div.getAttribute("src"), "/d");
  const twice = fakeImg(false);
  set(twice, "src", "/1.webp"); set(twice, "src", "/2.webp");
  await Promise.resolve();
  assert.equal(twice.getAttribute("src"), "/2.webp", "the last held write wins");
});

test("installSlotLoading decides loading before the slot's first src write; LCP slot eager + high priority", () => {
  const defined = {};
  const win = { customElements: { define(n, C) { defined[n] = C; } } };
  installSlotLoading(win, EAGER_SLOTS);
  const writes = [];
  class Slot {
    constructor(id) { this.id = id; this.img = fakeImg(false); this.ghost = fakeImg(false);
      this.shadowRoot = { querySelector: (s) => (s === ".frame img" ? this.img : s === ".spill img" ? this.ghost : null) }; }
    attributeChangedCallback(n) { if (n === "src") { writes.push([this.id, this.img.getAttribute("loading"), this.img.getAttribute("fetchpriority")]); this.img.setAttribute("src", "/x.webp"); this.ghost.setAttribute("src", "/x.webp"); } }
    connectedCallback() {}
  }
  win.customElements.define("image-slot", Slot);
  const C = defined["image-slot"];
  for (const id of ["hero-still", "welcome-photo", "m-hero", "m-gita"]) { const s = new C(id); s.attributeChangedCallback("id"); s.attributeChangedCallback("src"); }
  assert.deepEqual(writes, [["hero-still", null, "high"], ["welcome-photo", "lazy", "low"], ["m-hero", null, "high"], ["m-gita", "lazy", "low"]]);
  const late = new C("zen-1"); late.img.setAttribute("src", "/y.webp"); late.attributeChangedCallback("shape");
  assert.equal(late.img.getAttribute("loading"), null, "never rewritten once the first src exists");
});

test("createBackgroundDeferral reveals the first screen at once and the rest through the observer, a section together", () => {
  const observed = new Set();
  let cb = null, opts = null;
  class IO { constructor(f, o) { cb = f; opts = o; } observe(el) { observed.add(el); } unobserve(el) { observed.delete(el); } }
  const mk = (top, sec) => { const e = { ...fakeImg(true), tagName: "DIV", nodeType: 1, top, sec, matches: () => true, querySelectorAll: () => [],
    closest: () => sec, parentElement: sec, getBoundingClientRect: () => ({ top, bottom: top + 300, width: 300, height: 300 }) }; e.setAttribute("style", "background-image:url(/a.webp)"); return e; };
  const secB = { list: [], querySelectorAll() { return this.list; } };
  const a = mk(100, null), b1 = mk(3000, secB), b2 = mk(3000, secB), c = mk(1500, null);
  b2.getBoundingClientRect = () => ({ top: 3000, bottom: 3300, width: 0, height: 0 }); // e.g. a hidden tab in the same section
  secB.list = [b1, b2];
  const root = { nodeType: 1, matches: () => false, querySelectorAll: () => [a, b1, b2, c] };
  const defer = createBackgroundDeferral({ IntersectionObserver: IO, innerHeight: 844 }, 800);
  assert.equal(opts.rootMargin, "800px 0px");
  defer(root);
  assert.ok(a.hasAttribute("data-ahv-bg"), "first screen revealed synchronously");
  assert.ok(c.hasAttribute("data-ahv-bg"), "within the 800px margin revealed synchronously");
  assert.ok(!b1.hasAttribute("data-ahv-bg") && !b2.hasAttribute("data-ahv-bg"), "far below waits");
  assert.deepEqual([...observed].sort((x, y) => x.top - y.top), [b1, b2]);
  cb([{ isIntersecting: true, target: b1 }]);
  assert.ok(b1.hasAttribute("data-ahv-bg") && b2.hasAttribute("data-ahv-bg"), "the whole section is revealed together");
  assert.equal(observed.size, 0);
  defer(root); // re-sweeps are cheap no-ops
  assert.equal(observed.size, 0);
});

test("every media-loading export survives the toString() injection boot.ts uses (self-contained, no backslash hazard)", () => {
  for (const fn of [lazyImgFirst, deferHeroFilm, installLazyImgOrder, installSlotLoading, createBackgroundDeferral]) {
    const again = new Function(`return (${fn.toString()});`)();
    assert.equal(typeof again, "function", fn.name);
  }
  assert.equal(new Function(`return (${lazyImgFirst.toString()});`)()('<img src="/a" loading="lazy">'), '<img loading="lazy" src="/a">');
  const boot = fs.readFileSync("app/(english)/_families/boot.ts", "utf8");
  for (const name of ["lazyImgFirst", "deferHeroFilm", "installLazyImgOrder", "installSlotLoading", "createBackgroundDeferral"]) {
    assert.match(boot, new RegExp("\\(\\$\\{" + name + "\\.toString\\(\\)\\}\\)"), `${name} is injected as an expression, never by name`);
  }
});

test("BOOT_SCRIPT with the media-loading layer is valid JavaScript", async () => {
  // Built the same way the page gets it; a single mangled escape would kill every page's runtime.
  const src = fs.readFileSync("app/(english)/_families/boot.ts", "utf8");
  const start = src.indexOf("export const BOOT_SCRIPT = `") + "export const BOOT_SCRIPT = `".length;
  const end = src.lastIndexOf("`.trim();");
  const body = src.slice(start, end);
  const env = { IS_STAGING: true, ROUTE_CONFIG_ID: "ahv-route-config", DESIGN_ROOT_ID: "ahv-design-root", LINK_ALIASES: {}, IMAGE_ALIASES: {},
    restoreReviewedTitle, orderedRuntimeScripts, repairFaqTopicTargets, removeHomeVillaRates, offersFlow, phoneCriticalMedia, descriptiveAwardLinks, villaImageAttributes, EAGER_SLOTS, createBackgroundDeferral, installLazyImgOrder, installSlotLoading, lazyImgFirst, deferHeroFilm, formPostSafety, CONSENT_RUNTIME,
    deferFarSnapshotContent, whenSnapshotPainted, snapshotFocusTarget, preserveSnapshotInputs };
  const script = new Function(...Object.keys(env), "return `" + body + "`;")(...Object.values(env));
  assert.doesNotThrow(() => new Function(script), "BOOT_SCRIPT parses");
});

test("snapshot -> live swap is shift-free: live root mounts first, hidden out of flow until boot retires the snapshot", () => {
  const boot = fs.readFileSync("app/(english)/_families/boot.ts", "utf8");
  const doc = fs.readFileSync("app/(english)/_families/site-document.tsx", "utf8");
  assert.match(boot, /host\.insertBefore\(document\.createElement\("x-dc"\), host\.firstChild\)/, "x-dc (the live root) goes ahead of the snapshot");
  assert.doesNotMatch(boot, /host\.appendChild\(document\.createElement\("x-dc"\)\)/);
  assert.doesNotMatch(boot, /live\.innerText/, "readiness must not use innerText (empty while the live root is invisible)");
  assert.match(boot, /liveTextLength\(live\) > 200/);
  assert.match(boot, /now - lastLiveChange < 120 && now - liveReadyAt < 800/, "the swap waits for a quiet DOM, capped");
  assert.match(doc, /#ahv-design-root\[data-ahv-live-pending\]>#dc-root\{position:absolute!important;top:0!important;left:0!important;right:0!important;visibility:hidden!important/);
  assert.match(boot, /if \(snapshotNodes\.length\) host\.setAttribute\("data-ahv-live-pending", ""\);/, "only a page with a snapshot holds its live view back");
  assert.equal(boot.split('host.removeAttribute("data-ahv-live-pending");').length, 3, "released on both the swap and the failure path");
  assert.match(boot, /if \(live\) host\.appendChild\(live\);\n    host\.removeAttribute\("data-ahv-live-pending"\);\n    host\.setAttribute\("data-ahv-snapshot-state", "held"\)/, "a runtime that never renders goes back behind the snapshot");
  // Without JavaScript the server snapshot still carries id="dc-root": nothing may hide #dc-root outside "released".
  const hits = doc.split("#dc-root{");
  assert.ok(hits.length > 1, "the released rule exists");
  for (let k = 0; k < hits.length - 1; k++) assert.match(hits[k], /#ahv-design-root\[data-ahv-live-pending\]>$/, "only the live-pending root may style #dc-root");
  assert.match(doc, /@media \(min-width:700px\)\{html\[data-ahv-js\] #ahv-design-root\[data-ahv-snapshot-state='held'\]:not\(\[data-ahv-fallback\]\)>\*\{display:none!important\}/, "P4: the scripted desktop hold is display:none");
  // no-JS / runtime-failure fallback (parent review 29 Sep 2026): without html[data-ahv-js] or with data-ahv-fallback the held snapshot is shown, never a blank page
  assert.match(doc, /setAttribute\('data-ahv-js',''\)/, "an early inline script marks scripted documents");
  assert.match(doc, /data-ahv-fallback/, "the runtime-failure fallback is armed");
});

test("renderer images select the phone derivative before starting its request", async () => {
 const proto = {setAttribute(n,v){this.order.set(n,String(v));}};
 const win = {Element:{prototype:proto},queueMicrotask,matchMedia:()=>({matches:true})};
 installLazyImgOrder(win,villaImageAttributes,phoneCriticalMedia);
 const image=fakeImg(false),original='/ahv/assets/img/owner-approved-20260928/ahv-img-002.webp';
 proto.setAttribute.call(image,'src',original);
 await Promise.resolve();
 assert.equal(image.getAttribute('src'),original.replace('.webp','-768.webp'));
 assert.equal(image.getAttribute('fetchpriority'),'high');
 const desktopProto={setAttribute(n,v){this.order.set(n,String(v));}};
 installLazyImgOrder({Element:{prototype:desktopProto},queueMicrotask,matchMedia:()=>({matches:false})},villaImageAttributes,phoneCriticalMedia);
 const wide=fakeImg(true);desktopProto.setAttribute.call(wide,'src',original);
 assert.equal(wide.getAttribute('src'),original);
});
