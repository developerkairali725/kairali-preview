// Train N release-gate performance fix (16 Oct 2026) on the Train N head 6f72f2e71. Source only: no deploy, no form
// submission, no consent change, no copy or design change.
//   1. Package pages (all 13 locales; also the other snapshot pages whose first form is not first in its column):
//      boot's enquiry-form lift moved the SERVER SNAPSHOT's form above the intro, and the live view then replaced the
//      snapshot in the approved order — a full-screen layout shift (Lighthouse mobile CLS 0.444, performance 71 on
//      /de/ayurvedic-treatment-packages.html). The snapshot form is now never moved; every page's final order is
//      exactly what it was (the lift could only ever reach the snapshot copy on those pages).
//   2. Yoga course pages (all 13 locales): the course photo under the banner is the phone LCP element. Same photos at
//      the established 768px AVIF55 phone preset, a phone-only priority preload of the course photo, and the snapshot
//      and boot shipped in the HTML once (the existing server-only markup path), as on the traced programme pages.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import zlib from "node:zlib";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { TRAIN_N_PERF_FIX, peelTrainNPerfFix } from "./fixtures/train-n-perf-fix-20261016.mjs";
import { phoneCriticalMedia, firstCriticalImage } from "../app/(english)/_families/critical-media.mjs";
import { installLazyImgOrder } from "../app/(english)/_families/media-loading.mjs";
import { SSR_ONLY_HTML_ROUTES } from "../app/(english)/_families/ssr-only-html.mjs";
import { LOCALES } from "../tools/l10n/locales.mjs";

const SITE = fileURLToPath(new URL("../", import.meta.url));
const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const BOOT = "app/(english)/_families/boot.ts";
const LOCS = Object.keys(LOCALES).filter((l) => l !== "en");
const snapshot = (route, locale) => {
  const name = route.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9._-]+/gi, "_") + ".html";
  const file = locale === "en" ? "english-candidate/prerender/" + name : `l10n/prerender/${locale}/${name}.gz`;
  if (!fs.existsSync(new URL(`../${file}`, import.meta.url))) return null;
  const raw = fs.readFileSync(new URL(`../${file}`, import.meta.url));
  return (file.endsWith(".gz") ? zlib.gunzipSync(raw) : raw).toString();
};

// ── the recorded delta ───────────────────────────────────────────────────────────────────────────────────────────────
test("the perf fix reverses exactly to the Train N head boot.ts bytes; the head passes through; a third state passes unchanged", () => {
  assert.deepEqual(Object.keys(TRAIN_N_PERF_FIX.files), [BOOT]);
  const e = TRAIN_N_PERF_FIX.files[BOOT];
  const now = read(BOOT);
  assert.equal(sha(now), e.afterSHA256, "current bytes are the perf fix's");
  const head = peelTrainNPerfFix(BOOT, now);
  assert.equal(sha(head), e.beforeSHA256);
  assert.equal(peelTrainNPerfFix(BOOT, head), head, "head bytes pass through");
  assert.equal(peelTrainNPerfFix(BOOT, now + " "), now + " ", "any other state passes through unchanged");
  // Shallow CI checkouts may lack the Train N head; provenance is checked whenever history exists.
  let base = null;
  try { base = execFileSync("git", ["show", `${TRAIN_N_PERF_FIX.base}:sites/ayurvedichealingvillage.com/${BOOT}`], { cwd: SITE, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 27 }); } catch {}
  if (base !== null) assert.equal(sha(base), e.beforeSHA256, "beforeSHA256 is the Train N head");
});

// ── 1. the enquiry-form lift never moves a server snapshot's form ───────────────────────────────────────────────────
class El {
  constructor(tag, attrs = {}, kids = []) {
    this.tagName = tag.toUpperCase(); this.attrs = { ...attrs }; this.children = []; this.parentElement = null;
    for (const k of kids) this.appendChild(k);
  }
  get id() { return this.attrs.id || ""; }
  getAttribute(n) { return Object.hasOwn(this.attrs, n) ? this.attrs[n] : null; }
  get firstElementChild() { return this.children[0] || null; }
  get nextSibling() { const s = this.parentElement && this.parentElement.children; return s ? s[s.indexOf(this) + 1] || null : null; }
  appendChild(k) { if (k.parentElement) k.parentElement.children.splice(k.parentElement.children.indexOf(k), 1); k.parentElement = this; this.children.push(k); return k; }
  insertBefore(k, ref) {
    if (k.parentElement) k.parentElement.children.splice(k.parentElement.children.indexOf(k), 1);
    k.parentElement = this; const i = ref ? this.children.indexOf(ref) : -1;
    this.children.splice(i < 0 ? this.children.length : i, 0, k); return k;
  }
  querySelector(sel) {
    assert.equal(sel, "form[id]");
    for (const k of this.children) { if (k.tagName === "FORM" && k.id) return k; const f = k.querySelector(sel); if (f) return f; }
    return null;
  }
  closest(sel) {
    assert.equal(sel, "[data-ahv-snapshot]");
    for (let n = this; n; n = n.parentElement) if (Object.hasOwn(n.attrs, "data-ahv-snapshot")) return n;
    return null;
  }
}
const liftSource = () => {
  const src = read(BOOT);
  const start = src.indexOf("  var formLifted = false;");
  const end = src.indexOf("  // A call to action that points at the page you are already on");
  assert.ok(start > 0 && end > start, "exercise the actual boot.ts lift");
  const body = src.slice(start, end);
  assert.ok(!body.includes("${") && !body.includes("\\"), "plain template text: the runtime sees exactly these bytes");
  return new Function("host", body + "\nreturn liftEnquiryForm;");
};
const column = (formId) => {
  const intro = new El("div", { "data-dc-tpl": "52" });
  const form = new El("form", { id: formId });
  return { col: new El("section", { id: "Enquirenow" }, [intro, form]), intro, form };
};

test("a server snapshot's form stays in the approved order, and the later live form is not lifted either (final order unchanged)", () => {
  const snap = column("EnquirenowForm");
  const snapRoot = new El("div", { "data-ahv-snapshot": "" }, [snap.col]);
  const host = new El("div", { id: "ahv-design-root" }, [snapRoot]);
  const lift = liftSource()(host);
  lift();
  assert.deepEqual(snap.col.children, [snap.intro, snap.form], "snapshot form not moved (was: form first, a 0.44 shift)");
  // the live root mounts first, as boot does; the sweep keeps running until the snapshot retires
  const live = column("EnquirenowForm");
  host.insertBefore(new El("div", {}, [live.col]), host.firstElementChild);
  lift();
  assert.deepEqual(live.col.children, [live.intro, live.form], "live view keeps the order it has had since the snapshot lane");
});

test("a page whose form exists only in the live view is still lifted exactly as before (owner ruling 2026-09-15)", () => {
  const live = column("enquiry");
  const skip = new El("a", { href: "#enquiry" });
  live.col.insertBefore(skip, live.intro);
  const host = new El("div", { id: "ahv-design-root" }, [new El("div", { "data-ahv-snapshot": "" }, [new El("p")]), new El("div", {}, [live.col])]);
  liftSource()(host)();
  assert.deepEqual(live.col.children, [skip, live.form, live.intro], "skip link first, then the form");
});

test("every snapshot the old lift reordered is a page with a server snapshot form (all locales covered by the boot fix)", () => {
  for (const route of ["/ayurvedic-treatment-packages.html", "/walk-in-ayurveda-treatment/", "/kairali-air-india-maharaja-club.html"]) {
    for (const locale of ["en", ...LOCS]) {
      const html = snapshot(route, locale);
      if (html === null) continue;
      assert.match(html, /<form\b[^>]*\sid="[^"]+"/, `${locale} ${route}: snapshot carries the form the guard now leaves in place`);
    }
  }
  const de = snapshot("/ayurvedic-treatment-packages.html", "de");
  assert.ok(de.indexOf('data-dc-tpl="52"') < de.indexOf('id="EnquirenowForm"'), "approved order: intro before the form");
});

// ── 2. yoga course pages ─────────────────────────────────────────────────────────────────────────────────────────────
const YOGA = ["/yoga-classes-practical/", "/yoga-classes-theory/"];
const IMG = (n) => `/ahv/assets/img/seven/${n}.webp`;
const PHONE = (n) => `/ahv/assets/img/seven/${n}-768-phone.avif`;
const NAMES = ["ee7d129f97f1b7e2", "0df69b06cb6796e6"];

test("yoga course snapshots in every locale map only the two first-screen photos to their phone derivatives, with the matching preload", () => {
  for (const route of YOGA) for (const locale of ["en", ...LOCS]) {
    const html = snapshot(route, locale);
    assert.ok(html, `${locale} ${route}: snapshot exists`);
    for (const n of NAMES) assert.ok(html.includes(IMG(n)), `${locale} ${route}: ${n} in the approved snapshot`);
    const mapped = phoneCriticalMedia(html, route);
    let restored = mapped;
    for (const n of NAMES) { assert.ok(!mapped.includes(IMG(n))); restored = restored.split(PHONE(n)).join(IMG(n)); }
    assert.equal(restored, phoneCriticalMedia(html), `${locale} ${route}: only the two URLs change; size, place and attributes are kept`);
    assert.equal(firstCriticalImage(mapped, route), PHONE("0df69b06cb6796e6"), `${locale} ${route}: phone-only priority preload of the LCP photo`);
    assert.equal(phoneCriticalMedia(mapped, route), mapped, "idempotent");
  }
  const other = `<img src="${IMG("0df69b06cb6796e6")}">`;
  assert.equal(phoneCriticalMedia(other, "/food-sadhana/"), other, "other routes keep the original");
  assert.equal(firstCriticalImage(other, "/yoga-classes-practical/"), null, "the original (desktop) template gains no preload");
});

test("the runtime maps the same photos on a phone, only on the yoga course routes", () => {
  for (const [route, expected] of [["/yoga-classes-theory/", PHONE("0df69b06cb6796e6")], ["/other/", IMG("0df69b06cb6796e6")]]) {
    class Element {
      constructor() { this.tagName = "IMG"; this.isConnected = true; this.attrs = {}; }
      setAttribute(name, value) { this.attrs[name] = value; }
      hasAttribute(name) { return Object.hasOwn(this.attrs, name); }
    }
    const win = { Element, matchMedia: () => ({ matches: true }), queueMicrotask };
    installLazyImgOrder(win, null, (src) => phoneCriticalMedia(src, route));
    const img = new Element();
    img.setAttribute("src", IMG("0df69b06cb6796e6"));
    assert.equal(img.attrs.src, expected, route);
  }
});

test("the phone derivatives are committed, built by the critical-media step, and keep the originals", () => {
  const build = read("tools/build-critical-media.mjs");
  assert.match(build, /for \(const name of \['ee7d129f97f1b7e2', '0df69b06cb6796e6'\]\)/);
  assert.match(build, /resize\(\{width:768,withoutEnlargement:true\}\)\.avif\(\{quality:55\}\)/);
  for (const n of NAMES) {
    const avif = fs.readFileSync(new URL(`../public${PHONE(n)}`, import.meta.url));
    assert.equal(avif.subarray(4, 12).toString("latin1"), "ftypavif", `${n}: AVIF`);
    assert.ok(avif.length < fs.statSync(new URL(`../public${IMG(n)}`, import.meta.url)).size / 2, `${n}: under half the original`);
  }
});

test("the yoga course and package routes ship their snapshot and boot in the server HTML only", () => {
  for (const route of [...YOGA, "/ayurvedic-treatment-packages.html"]) assert.ok(SSR_ONLY_HTML_ROUTES.has(route), route);
});
