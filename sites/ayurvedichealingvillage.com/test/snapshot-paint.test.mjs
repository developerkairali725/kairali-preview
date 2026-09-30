// Phone snapshot first paint (lane PERF2): snapshot-paint.mjs helpers injected into BOOT_SCRIPT, and the
// boot / site-document wiring around them.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { whenSnapshotPainted, deferFarSnapshotContent, snapshotFocusTarget } from "../app/(english)/_families/snapshot-paint.mjs";

const BOOT = fs.readFileSync("app/(english)/_families/boot.ts", "utf8");
const VIEW = fs.readFileSync("app/(english)/_families/design-view.tsx", "utf8");
const DOC = fs.readFileSync("app/(english)/_families/site-document.tsx", "utf8");

test("snapshot-paint exports survive the toString() injection (self-contained, no backslash)", () => {
  for (const fn of [whenSnapshotPainted, deferFarSnapshotContent, snapshotFocusTarget]) {
    assert.ok(!fn.toString().includes("\\"), `${fn.name} contains a backslash (BOOT_SCRIPT would eat it)`);
    assert.equal(typeof new Function(`return (${fn.toString()});`)(), "function", fn.name);
    assert.match(BOOT, new RegExp("\\(\\$\\{" + fn.name + "\\.toString\\(\\)\\}\\)"), `${fn.name} is injected as an expression`);
  }
});

function fakeWin({ hidden = false, po = true } = {}) {
  const timers = [];
  const listeners = {};
  let observer = null;
  const win = {
    document: { visibilityState: hidden ? "hidden" : "visible", addEventListener: (t, f) => { (listeners[t] ||= []).push(f); } },
    setTimeout: (f, ms) => { timers.push({ f, ms }); return timers.length; },
  };
  if (po) win.PerformanceObserver = class { constructor(cb) { this.cb = cb; observer = this; } observe() {} disconnect() { this.off = true; } };
  return { win, timers, listeners, fire: (name) => observer.cb({ getEntries: () => [{ name }] }), runTimers: () => { const t = timers.splice(0); t.forEach((x) => x.f()); } };
}

test("whenSnapshotPainted: immediate when inactive, hidden or unsupported; otherwise after FCP, once, capped", () => {
  let n = 0;
  whenSnapshotPainted(fakeWin().win, false, () => n++, 3000);
  assert.equal(n, 1, "inactive (desktop / no snapshot) continues at once");
  whenSnapshotPainted(fakeWin({ hidden: true }).win, true, () => n++, 3000);
  assert.equal(n, 2, "a hidden tab reports no paint: continue at once");
  whenSnapshotPainted(fakeWin({ po: false }).win, true, () => n++, 3000);
  assert.equal(n, 3, "no PerformanceObserver: continue at once");

  const a = fakeWin();
  let m = 0;
  whenSnapshotPainted(a.win, true, () => m++, 3000);
  assert.equal(m, 0, "waits for the paint");
  assert.equal(a.timers[0].ms, 3000, "never longer than maxWait");
  a.fire("first-paint");
  assert.equal(m, 0, "first-paint alone is not contentful");
  a.fire("first-contentful-paint");
  a.runTimers();
  assert.equal(m, 1, "continues one task after first-contentful-paint");
  a.runTimers();
  a.listeners.visibilitychange && a.listeners.visibilitychange.forEach((f) => { a.win.document.visibilityState = "hidden"; f(); });
  assert.equal(m, 1, "and only once");

  const b = fakeWin();
  let k = 0;
  whenSnapshotPainted(b.win, true, () => k++, 3000);
  b.runTimers();
  assert.equal(k, 1, "the cap fires when no paint is ever reported");
});

test("deferFarSnapshotContent marks only the outermost boxes below the line, on a phone, keeping their height", () => {
  const mk = (tag, top, height, kids = [], display = "block") => {
    const el = { tagName: tag, top, height, display, kids, style: { props: {}, setProperty(k, v) { this.props[k] = v; } }, attrs: {},
      setAttribute(k, v) { this.attrs[k] = v; }, getBoundingClientRect: () => ({ top, bottom: top + height, height, width: 390 }) };
    kids.forEach((k, i) => { k.next = kids[i + 1] || null; });
    el.firstElementChild = kids[0] || null;
    Object.defineProperty(el, "nextElementSibling", { get() { return el.next || null; } });
    return el;
  };
  const cardA = mk("ARTICLE", 1300, 600), cardB = mk("ARTICLE", 1900, 600), inline = mk("SPAN", 2600, 20, [], "inline");
  const hero = mk("SECTION", 60, 700), gallery = mk("SECTION", 800, 2000, [mk("H2", 800, 60), cardA, cardB]);
  const footer = mk("FOOTER", 2800, 900);
  const root = mk("DIV", 0, 3700, [hero, gallery, inline, footer]);
  const win = { innerHeight: 800, CSS: { supports: () => true }, matchMedia: (q) => ({ matches: q === "(max-width: 699px)" }),
    getComputedStyle: (el) => ({ display: el.display, position: "static" }) };
  assert.equal(deferFarSnapshotContent(win, [root], 700, 1.5), 3, "two gallery cards + the footer");
  for (const el of [cardA, cardB, footer]) {
    assert.equal(el.style.props["content-visibility"], "auto");
    assert.equal(el.style.props["contain-intrinsic-block-size"], "auto " + el.height + "px", "keeps its measured height");
  }
  for (const el of [hero, gallery, inline]) assert.equal(el.style.props["content-visibility"], undefined);
  assert.equal(deferFarSnapshotContent({ ...win, matchMedia: () => ({ matches: false }) }, [root], 700, 1.5), 0, "desktop: nothing");
  assert.equal(deferFarSnapshotContent({ ...win, CSS: { supports: () => false } }, [root], 700, 1.5), 0, "unsupported: nothing");
  assert.equal(deferFarSnapshotContent(win, [], 700, 1.5), 0, "no snapshot: nothing");
});

test("boot wiring: runtime chain waits for the phone snapshot's paint; repairs + cookie notice keep their timing", () => {
  assert.match(BOOT, /\(\$\{whenSnapshotPainted\.toString\(\)\}\)\(window, narrow && snapshotNodes\.length > 0, resolve, 3000\)/);
  const sweep = BOOT.indexOf("sweepHoneypots(150);");
  const wait = BOOT.indexOf("whenSnapshotPainted.toString()");
  assert.ok(sweep > 0 && sweep < wait, "sweepHoneypots (applyConsent) starts before the paint wait, as before");
  assert.equal(BOOT.split("sweepHoneypots(150);").length, 2, "started exactly once");
  assert.match(BOOT, /\(\$\{deferFarSnapshotContent\.toString\(\)\}\)\(window, snapshotNodes, cfg\.breakpoint, 1\.5\)/);
  // served snapshot styles leave with the snapshot only when their twin is in <head>
  assert.match(BOOT, /querySelectorAll\("\[data-ahv-snapshot-style\]"\)/);
  assert.match(BOOT, /if \(twin && el\.parentNode\) el\.parentNode\.removeChild\(el\);/);
});

test("design-view serves the snapshot's first-paint styles phone-only; faces skipped on poster-led views", () => {
  assert.match(VIEW, /<style key=\{i\} media=\{narrowMedia\} data-ahv-snapshot-style=""/);
  assert.match(VIEW, /rel="preload" as="font" type=\{href\.endsWith\("\.woff2"\) \? "font\/woff2" : "font\/ttf"\} crossOrigin="anonymous" href=\{href\} media=\{narrowMedia\}/);
  assert.match(VIEW, /const snapshotFaces = firstPaint && !firstScreenPoster\(snapshot\) \? firstPaint : null;/);
  // the no-JS fallback rules of 609d5377 are untouched
  assert.match(DOC, /html\[data-ahv-js\] #ahv-design-root\[data-ahv-snapshot-state='held'\]:not\(\[data-ahv-fallback\]\)>\*\{display:none!important\}/);
  assert.match(DOC, /html:not\(\[data-ahv-js\]\) #ahv-consent\{display:none!important\}/);
});

test("snapshot replacement preserves only the same keyboard action", () => {
  const control = (href, label) => ({ tagName: "A", textContent: label, getAttribute: (key) => key === "href" ? href : null });
  const active = control("/", "Kairali");
  const same = control("/", "Kairali");
  const other = control("/contact-us/", "Kairali");
  const snapshots = [{ contains: (node) => node === active }];
  assert.equal(snapshotFocusTarget({ activeElement: active }, snapshots, { querySelectorAll: () => [other, same] }), same);
  assert.equal(snapshotFocusTarget({ activeElement: active }, snapshots, { querySelectorAll: () => [other] }), null);
  assert.equal(snapshotFocusTarget({ activeElement: other }, snapshots, { querySelectorAll: () => [same] }), null);
});
