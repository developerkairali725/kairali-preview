// Train N release-gate performance fix 2 (16 Oct 2026) on head c251b359a. Source only: no deploy, no form submission,
// no consent change, no copy or design change.
//   Air India Maharaja Club page (every locale): Lighthouse mobile 82 on /de/ (simulated LCP 4.8 s). Three causes:
//   1. the photos and partner logos below the phone hero were all on the network before the LCP settled (a 186 KB
//      lossless heritage photo, two lossless logos, six treatment cards) -> same images at 768px AVIF on phones;
//   2. react-dom re-assigned each img.src as a property on mount with the ORIGINAL address, after the phone mapping had
//      already written the derivative, so the phone fetched both -> that exact re-write keeps the chosen address;
//   3. the hero's member badge (Mulish 700) painted in the fallback bold on the snapshot sat the hero photo 1px lower,
//      so the live view's identical photo became a second, later LCP (observed 0.1 s -> 0.6 s) -> its bold face is
//      preloaded with the body face on Latin-script locales;
//   plus the snapshot and boot shipped in the HTML once (the existing server-only markup path; 135 -> 92 KB gzip).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import zlib from "node:zlib";
import { phoneCriticalMedia, firstCriticalImage } from "../app/(english)/_families/critical-media.mjs";
import { installLazyImgOrder } from "../app/(english)/_families/media-loading.mjs";
import { SSR_ONLY_HTML_ROUTES } from "../app/(english)/_families/ssr-only-html.mjs";
import { routeFontPreloads } from "../app/(english)/_families/snapshot-styles.mjs";
import { LOCALES } from "../tools/l10n/locales.mjs";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const LOCS = Object.keys(LOCALES).filter((l) => l !== "en");
const snapshot = (route, locale) => {
  const name = route.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9._-]+/gi, "_") + ".html";
  const file = locale === "en" ? "english-candidate/prerender/" + name : `l10n/prerender/${locale}/${name}.gz`;
  if (!fs.existsSync(new URL(`../${file}`, import.meta.url))) return null;
  const raw = fs.readFileSync(new URL(`../${file}`, import.meta.url));
  return (file.endsWith(".gz") ? zlib.gunzipSync(raw) : raw).toString();
};

const AIR = "/kairali-air-india-maharaja-club.html";
const NAMES = ["cultural", "maha2", "MaharajaClub_CMYK_Positive", "AyurvedaPanchkarmaDetoxatKairali", "weightmanagementatKairali", "ImmunityEnhancementExecutiveHealthAssessment", "DiabetesMetabolicBalance", "WomensHormonalBalanceatkairali", "StressReliefMentalWellnessatkairali"];
const IMG = (n) => `/ahv/assets/img/AHV-V3-${n}.webp`;
const PHONE = (n) => `/ahv/assets/img/AHV-V3-${n}-768-phone.avif`;

test("Air India snapshots in every locale map only the nine below-hero images to their phone derivatives; the hero keeps its preload", () => {
  let seen = 0;
  for (const locale of ["en", ...LOCS]) {
    const html = snapshot(AIR, locale);
    if (html === null) continue;
    seen++;
    for (const n of NAMES) assert.ok(html.includes(IMG(n)), `${locale}: ${n} in the approved snapshot`);
    const mapped = phoneCriticalMedia(html, AIR);
    let restored = mapped;
    for (const n of NAMES) { assert.ok(!mapped.includes(IMG(n)), `${locale}: ${n} mapped`); restored = restored.split(PHONE(n)).join(IMG(n)); }
    assert.equal(restored, phoneCriticalMedia(html), `${locale}: only those URLs change; size, place and attributes are kept`);
    assert.ok(mapped.includes("/ahv/assets/img/AHV-V3-kairali-logo.webp"), "the small Kairali logo is untouched");
    assert.equal(firstCriticalImage(mapped, AIR), "/ahv/assets/img/wx-hero-544.avif", `${locale}: the hero stays the phone priority preload`);
    assert.equal(phoneCriticalMedia(mapped, AIR), mapped, "idempotent");
  }
  assert.equal(seen, 1 + LOCS.length, "every locale has an Air India snapshot");
  const other = `<img src="${IMG("cultural")}">`;
  assert.equal(phoneCriticalMedia(other, "/food-sadhana/"), other, "other routes keep the original");
});

test("Air India phone derivatives are committed, built by the critical-media step, smaller, same aspect and alpha", () => {
  const build = read("tools/build-critical-media.mjs");
  assert.match(build, /Air India image dimensions\/aspect\/alpha changed/);
  for (const n of NAMES) {
    assert.ok(build.includes(`'${n}'`), `${n} in the build step`);
    const avif = fs.readFileSync(new URL(`../public${PHONE(n)}`, import.meta.url));
    assert.equal(avif.subarray(4, 12).toString("latin1"), "ftypavif", `${n}: AVIF`);
    assert.ok(avif.length < fs.statSync(new URL(`../public${IMG(n)}`, import.meta.url)).size, `${n}: smaller than the original`);
    assert.ok(fs.existsSync(new URL(`../public${IMG(n)}`, import.meta.url)), `${n}: original retained`);
  }
});

test("Air India ships its snapshot and boot in the server HTML only", () => {
  assert.ok(SSR_ONLY_HTML_ROUTES.has(AIR));
});

// ── react-dom's mount-time img.src property re-write ────────────────────────────────────────────────────────────────
function fakeWindow(phone) {
  class Element {
    constructor() { this.tagName = "IMG"; this.isConnected = true; this.attrs = {}; }
    setAttribute(name, value) { this.attrs[name] = String(value); }
    getAttribute(name) { return Object.hasOwn(this.attrs, name) ? this.attrs[name] : null; }
    hasAttribute(name) { return Object.hasOwn(this.attrs, name); }
  }
  class HTMLImageElement extends Element {}
  Object.defineProperty(HTMLImageElement.prototype, "src", {
    configurable: true, enumerable: true,
    get() { return this.getAttribute("src") || ""; },
    set(v) { this.attrs.src = String(v); }, // native setter: never through the (hooked) JS setAttribute
  });
  return { Element, HTMLImageElement, matchMedia: () => ({ matches: phone }), queueMicrotask };
}

test("a React mount re-write of the original address keeps the phone derivative; every other .src write passes through", async () => {
  const win = fakeWindow(true);
  installLazyImgOrder(win, null, (src) => phoneCriticalMedia(src, AIR));
  installLazyImgOrder(win, null, (src) => phoneCriticalMedia(src, AIR)); // idempotent
  const img = new win.HTMLImageElement();
  img.setAttribute("src", IMG("cultural"));
  assert.equal(img.attrs.src, PHONE("cultural"), "attribute write mapped (as before)");
  img.src = IMG("cultural");
  assert.equal(img.attrs.src, PHONE("cultural"), "the same original re-written as a property keeps the derivative");
  img.src = "/ahv/assets/img/other.webp";
  assert.equal(img.attrs.src, "/ahv/assets/img/other.webp", "a different address passes through");
  const plain = new win.HTMLImageElement();
  plain.src = IMG("cultural");
  assert.equal(plain.attrs.src, IMG("cultural"), "a property write with no prior attribute passes through (as before)");
  // held src (detached img without a loading attribute): React's commitMount runs before the microtask
  const held = new win.HTMLImageElement();
  held.isConnected = false;
  held.setAttribute("src", IMG("maha2"));
  assert.equal(held.attrs.src, undefined, "src held for a microtask");
  held.src = IMG("maha2");
  assert.equal(held.attrs.src, PHONE("maha2"), "the held derivative wins over the original re-write");
  await Promise.resolve();
  assert.equal(held.attrs.src, PHONE("maha2"));
});

test("desktop and other routes: the property hook never changes an address", () => {
  const desk = fakeWindow(false);
  installLazyImgOrder(desk, null, (src) => phoneCriticalMedia(src, AIR));
  const a = new desk.HTMLImageElement();
  a.setAttribute("src", IMG("cultural")); a.src = IMG("cultural");
  assert.equal(a.attrs.src, IMG("cultural"), "desktop keeps the original");
  const other = fakeWindow(true);
  installLazyImgOrder(other, null, (src) => phoneCriticalMedia(src, "/food-sadhana/"));
  const b = new other.HTMLImageElement();
  b.setAttribute("src", IMG("cultural")); b.src = IMG("cultural");
  assert.equal(b.attrs.src, IMG("cultural"), "unmapped route keeps the original");
  const none = fakeWindow(true);
  installLazyImgOrder(none);
  const c = new none.HTMLImageElement();
  c.src = IMG("cultural");
  assert.equal(c.attrs.src, IMG("cultural"), "no phone mapping installed: untouched");
});

test("Air India preloads the badge's bold face with the body face on Latin-script locales only", () => {
  const css = '@font-face{font-family:"Mulish";font-weight:400;src:url("body.common.woff2")}@font-face{font-family:"Marcellus";font-weight:400;src:url("heading.common.woff2")}@font-face{font-family:"Mulish";font-weight:700;src:url("bold.common.woff2")}';
  const styles = { fonts: ["/ahv/fonts/test.css"], styles: ["body{font-family:Mulish}"] };
  for (const l of ["en", "de", "fr", "es", "it", "pt", "nl"]) assert.deepEqual(routeFontPreloads(AIR, styles, () => css, l), ["/ahv/fonts/body.common.woff2", "/ahv/fonts/bold.common.woff2"], l);
  for (const l of ["ja", "zh-Hans", "ko", "ru", "ar", "hi"]) assert.deepEqual(routeFontPreloads(AIR, styles, () => css, l), ["/ahv/fonts/body.common.woff2"], l);
  assert.deepEqual(routeFontPreloads("/offers/", styles, () => css, "de"), ["/ahv/fonts/body.common.woff2"], "other routes unchanged");
});

// ── pre-sweep of the remaining gated routes (batches 13-20) ─────────────────────────────────────────────────────────
const SWEEP_SSR = ["/why-get-training-in-ayurveda/", "/food-sadhana/", "/why-get-training-in-yoga/", "/why-pick-a-yoga-or-yoga-retreat/", "/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/", "/yoga-retreats-for-everyone/", "/katha-wellness-retreat-2019/", "/yoga-and-meditation-package/", "/learn-about-ayurveda/", "/meditation/", "/what-is-yoga/", "/panchkarma-treatment.html", "/ayurveda-workshop/", "/lakshya-yoga-retreat-2018/", "/sleep-restoration-therapy/", "/new-to-ayurveda/", "/new-to-yoga/"];

test("the pre-sweep routes under 93 ship their snapshot and boot in the server HTML only (every locale shares the route)", () => {
  for (const route of SWEEP_SSR) assert.ok(SSR_ONLY_HTML_ROUTES.has(route), route);
});

test("snapshot <style> assets keep one stable dangerouslySetInnerHTML object (no same-text rewrite, no font-face re-parse at the swap)", () => {
  const src = read("app/(english)/_families/SnapshotStyles.tsx");
  assert.match(src, /const innerHtml = new WeakMap<SnapshotStyleAsset, \{ __html: string \}>\(\);/);
  assert.match(src, /dangerouslySetInnerHTML=\{stableHtml\(asset\)\}/);
  assert.doesNotMatch(src, /dangerouslySetInnerHTML=\{\{/, "no per-render object literal");
});

test("Sleep Restoration and New to Yoga share the runtime's font stylesheet link", async () => {
  const { sharedFontLinkRoute } = await import("../app/(english)/_families/snapshot-styles.mjs");
  for (const path of ["/sleep-restoration-therapy/", "/new-to-yoga/"]) assert.equal(sharedFontLinkRoute({ path, dataset: "assets/article-family-data.js" }), true, path);
  assert.equal(sharedFontLinkRoute({ path: "/new-to-ayurveda/", dataset: "assets/article-family-data.js" }), false);
});

test("Yoga & Meditation package: approved subtitle style on the stale English snapshot, about photo back to lazy/low, hero preload", () => {
  const YMP = "/yoga-and-meditation-package/";
  const STALE = '<p data-dc-tpl="42" style="font-size: 22px;">';
  const APPROVED = '<p data-dc-tpl="42" style="font-family: Marcellus, serif; font-size: 20px; color: rgb(117, 105, 90); margin: 10px 0px 0px;">';
  const en = snapshot(YMP, "en");
  assert.equal(en.split(STALE).length - 1, 1, "the English capture predates AHV-N03.01");
  for (const locale of LOCS) { const html = snapshot(YMP, locale); if (html) assert.ok(html.includes(APPROVED), `${locale}: locale capture carries the approved style`); }
  assert.match(read("public/ahv/views/ahv-page-yoga-and-meditation-package-mobile.json"), /font-family:'Marcellus',serif;font-size:20px;color:#75695A;margin:10px 0 0/);
  for (const locale of ["en", ...LOCS]) {
    const html = snapshot(YMP, locale);
    if (!html) continue;
    const mapped = phoneCriticalMedia(html, YMP);
    assert.ok(!mapped.includes(STALE) && mapped.includes(APPROVED), `${locale}: subtitle as approved`);
    const about = mapped.match(/<img\b[^>]*yoga-meditation-about-seated-meditation\.webp[^>]*>/g);
    assert.ok(about && about.length >= 1, locale);
    for (const tag of about) { assert.ok(tag.startsWith('<img loading="lazy" fetchpriority="low"'), tag); assert.equal((tag.match(/fetchpriority=/g) || []).length, 1, tag); }
    assert.equal(firstCriticalImage(mapped, YMP), "/ahv/assets/img/yoga-meditation-hero-namaste-greeting.webp", `${locale}: hero preload`);
    assert.equal(phoneCriticalMedia(mapped, YMP), mapped, "idempotent");
  }
  assert.equal(phoneCriticalMedia(en, "/other/").includes(STALE), true, "other routes untouched");
});

test("Yoga & Meditation package preloads its existing heading face with the body face", () => {
  const css = '@font-face{font-family:"Mulish";font-weight:400;src:url("body.common.woff2")}@font-face{font-family:"Marcellus";font-weight:400;src:url("heading.common.woff2")}';
  const styles = { fonts: ["/ahv/fonts/test.css"], styles: ["body{font-family:Mulish}"] };
  assert.deepEqual(routeFontPreloads("/yoga-and-meditation-package/", styles, () => css, "de"), ["/ahv/fonts/body.common.woff2", "/ahv/fonts/heading.common.woff2"]);
});
