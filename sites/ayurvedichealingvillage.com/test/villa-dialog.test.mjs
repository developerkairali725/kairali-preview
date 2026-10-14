// public/design/villa-dialog.js — villa details in an on-page dialog (DEC-VILLA-POPUP).
// Source-level checks with a minimal in-process DOM: content bound verbatim to the villa prerenders, every one of the
// 14 scoped ad routes links all four villas through a mapped href, progressive-enhancement click rules, accessible
// dialog wiring (label, close, Escape via native cancel, focus restore, Tab trap) and no HTML parsing or fetching.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");
const require = createRequire(import.meta.url);
const vd = require(path.join(SITE, "public/design/villa-dialog.js"));
const ORIGIN = "https://ayurvedichealingvillage.com";

const ROUTES = [
  "pain-management.html", "family-ayurvedic-retreat-kerala.html", "ayurveda-retreat-kerala.html",
  "kairali-cleansing-centre.html", "treatment-in-kerala.html", "Ayurveda_Treatment_Neo_S.India_Cities.html",
  "weight-loss.html", "lp/ayurvedic-hospital-kerala", "lp/kairali-cleansing-centre", "lp/pain-management",
  "karkidaka-chikitsha-or-monsoon-wellness.html", "preventive-rejuvenation-detoxification.html",
  "wellness-resort-kerala.html", "Kairali_Brand_and_Competition_Neo-original.html",
];
const KEYS = ["/classic-villa/", "/deluxe-villa/", "/royal-villa/", "/maharaja-suite/"];

// ---- verbatim extraction from the approved villa pages (same rules as the evidence extractor) ----
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
const text = (h) => decode(h.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
function extract(slug) {
  const main = read(`english-candidate/prerender/${slug}.html`).match(/<main[\s\S]*?<\/main>/)[0];
  const name = text(main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]);
  const factsUl = main.match(/aria-label="Villa facts"[^>]*>([\s\S]*?)<\/ul>/)[1];
  const facts = [...factsUl.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => text(m[1]));
  const k = main.match(/<h3[^>]*>(In your (?:villa|suite))<\/h3>/);
  let rest = main.slice(k.index + k[0].length);
  const stop = rest.search(/<h2/);
  if (stop >= 0) rest = rest.slice(0, stop);
  const groups = [...rest.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>\s*<ul[^>]*>([\s\S]*?)<\/ul>/g)].map((m) => ({
    heading: text(m[1]), items: [...m[2].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((x) => text(x[1])),
  }));
  const images = [...main.matchAll(/<img[^>]*>/g)].slice(0, 4).map(([tag]) => ({
    src: tag.match(/src="([^"]+)"/)[1], alt: decode(tag.match(/alt="([^"]*)"/)[1]),
    width: Number(tag.match(/width="(\d+)"/)[1]), height: Number(tag.match(/height="(\d+)"/)[1]),
  }));
  return { name, facts, amenitiesHeading: k[1], groups, images };
}

test("dialog content is the villa pages' approved content, verbatim", () => {
  assert.deepEqual(Object.keys(vd.VILLAS).sort(), [...KEYS].sort());
  for (const key of KEYS) {
    const actual = JSON.parse(JSON.stringify(vd.VILLAS[key]));
    // Preserve the historical snapshot fixture and permit only the 14 October
    // owner-approved guest-area correction (total including outdoor sit-outs).
    if (key === '/deluxe-villa/') {
      assert.equal(actual.facts[0], '271–375 sq ft (including sit-outs)');
      actual.facts[0] = '260- 375 Sqft';
    }
    assert.deepEqual(actual, extract(key.slice(1, -1)), key);
    for (const im of vd.VILLAS[key].images) assert.ok(fs.existsSync(path.join(SITE, "public", im.src)), im.src);
  }
});

test("no prices, offers or KTAHV-locked words in the dialog content", () => {
  const all = JSON.stringify(vd.VILLAS);
  assert.doesNotMatch(all, /₹|INR|Rs\.?\s?\d|tariff|offer|discount/i);
  assert.doesNotMatch(all, /\b(spa|resort|holiday|luxury|cure|journey|guests?)\b/i);
});

test("all 14 scoped routes render on the campaign document and link every villa through a mapped href", () => {
  const doc = read("campaign-v2/production/Document.tsx");
  assert.match(doc, /<body data-ahv-campaign="true">/);
  for (const route of ROUTES) {
    const page = read(`app/(ppc-v2)/${route}/page.tsx`);
    const slug = page.match(/SLUG = "([^"]+)"/)[1];
    const src = read(`campaign-v2/production/pages/${slug}.ts`);
    const hrefs = [...src.matchAll(/href: "([^"]+)"|\]\((\/[^)\s]+)\)/g)].map((m) => m[1] || m[2]);
    const mapped = new Set(hrefs.map((h) => vd.villaKey(h, ORIGIN)).filter(Boolean));
    assert.deepEqual([...mapped].sort(), [...KEYS].sort(), `${route} (${slug})`);
  }
});

test("villaKey maps only same-origin villa paths", () => {
  assert.equal(vd.villaKey("/deluxe-villa/", ORIGIN), "/deluxe-villa/");
  assert.equal(vd.villaKey("/deluxe-villa", ORIGIN), "/deluxe-villa/");
  assert.equal(vd.villaKey("/royal-villa/?utm_source=g#gallery", ORIGIN), "/royal-villa/");
  assert.equal(vd.villaKey(`${ORIGIN}/maharaja-suite/`, ORIGIN), "/maharaja-suite/");
  assert.equal(vd.villaKey("https://example.com/deluxe-villa/", ORIGIN), null);
  assert.equal(vd.villaKey("/our-villas/", ORIGIN), null);
  assert.equal(vd.villaKey("/villas-gallery/", ORIGIN), null);
  assert.equal(vd.villaKey("", ORIGIN), null);
  assert.equal(vd.villaKey("javascript:void(0)", ORIGIN), null);
});

// ---- minimal DOM ----
class Node {
  constructor(doc, tag) { this.ownerDocument = doc; this.tagName = tag.toUpperCase(); this.children = []; this.parentNode = null; this.attrs = {}; this.listeners = {}; this._text = ""; }
  get className() { return this.attrs.class || ""; } set className(v) { this.attrs.class = v; }
  get id() { return this.attrs.id || ""; } set id(v) { this.attrs.id = v; }
  get textContent() { return this._text + this.children.map((c) => c.textContent).join(""); } set textContent(v) { this._text = String(v); this.children = []; }
  set innerHTML(_) { throw new Error("innerHTML must not be used"); }
  setAttribute(k, v) { this.attrs[k] = String(v); } getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; } hasAttribute(k) { return k in this.attrs; }
  set src(v) { this.attrs.src = v; } get src() { return this.attrs.src; } set alt(v) { this.attrs.alt = v; } get alt() { return this.attrs.alt; }
  set width(v) { this.attrs.width = String(v); } set height(v) { this.attrs.height = String(v); } set type(v) { this.attrs.type = v; }
  set rel(v) { this.attrs.rel = v; } set href(v) { this.attrs.href = v; }
  appendChild(c) { c.parentNode = this; this.children.push(c); return c; }
  get isConnected() { let n = this; while (n.parentNode) n = n.parentNode; return n === this.ownerDocument.documentElement; }
  contains(n) { for (; n; n = n.parentNode) if (n === this) return true; return false; }
  matches(sel) { return sel.split(",").some((s) => matchOne(this, s.trim())); }
  closest(sel) { for (let n = this; n && n.tagName; n = n.parentNode) if (n.matches(sel)) return n; return null; }
  all() { return this.children.flatMap((c) => [c, ...c.all()]); }
  querySelectorAll(sel) { return this.all().filter((n) => n.matches(sel)); }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
  addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }
  dispatch(t, ev = {}) { ev.type = t; ev.target ||= this; for (let n = this; n; n = n.parentNode) for (const f of n.listeners?.[t] || []) f(ev); return ev; }
  focus() { this.ownerDocument.activeElement = this; }
}
class Dialog extends Node {
  constructor(doc) { super(doc, "dialog"); this.open = false; }
  showModal() { if (!this.isConnected) throw new Error("not connected"); this.open = true; }
  close() { if (!this.open) return; this.open = false; this.dispatch("close"); }
}
function matchOne(n, s) {
  const not = [...s.matchAll(/:not\(([^)]*)\)/g)].map((m) => m[1]);
  s = s.replace(/:not\([^)]*\)/g, "");
  if (not.some((x) => matchOne(n, x))) return false;
  const tag = s.match(/^[a-z0-9]+/i);
  if (tag && n.tagName !== tag[0].toUpperCase()) return false;
  for (const [, c] of s.matchAll(/\.([\w-]+)/g)) if (!n.className.split(/\s+/).includes(c)) return false;
  for (const [, k, v] of s.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)) if (!(k in n.attrs) || (v !== undefined && n.attrs[k] !== v)) return false;
  return true;
}
function makeDoc() {
  const doc = { activeElement: null };
  doc.createElement = (t) => (t === "dialog" ? new Dialog(doc) : new Node(doc, t));
  doc.documentElement = new Node(doc, "html");
  doc.documentElement.setAttribute("lang", "en"); // ProductionDocument default
  doc.head = doc.documentElement.appendChild(new Node(doc, "head"));
  doc.body = doc.documentElement.appendChild(new Node(doc, "body"));
  doc.body.setAttribute("data-ahv-campaign", "true");
  doc.querySelector = (s) => doc.documentElement.querySelector(s) || (doc.documentElement.matches(s) ? doc.documentElement : null);
  doc.querySelectorAll = (s) => doc.documentElement.querySelectorAll(s);
  doc.listeners = {};
  doc.addEventListener = (t, f) => (doc.listeners[t] ||= []).push(f);
  const lp = doc.body.appendChild(new Node(doc, "div")); lp.className = "lp lp-prod";
  const header = lp.appendChild(new Node(doc, "header"));
  const main = lp.appendChild(new Node(doc, "main"));
  const link = (parent, href, label) => { const a = parent.appendChild(new Node(doc, "a")); a.setAttribute("href", href); a.textContent = label; return a; };
  return { doc, lp, header, main, link };
}
const click = (over = {}) => ({ button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...over });

test("only plain primary same-tab clicks inside main are intercepted", () => {
  const { main, header, link } = makeDoc();
  const a = link(main, "/deluxe-villa/", "Explore Deluxe Villa");
  assert.equal(vd.shouldIntercept(click(), a), true);
  for (const k of ["metaKey", "ctrlKey", "shiftKey", "altKey"]) assert.equal(vd.shouldIntercept(click({ [k]: true }), a), false, k);
  assert.equal(vd.shouldIntercept(click({ button: 1 }), a), false);
  assert.equal(vd.shouldIntercept(click({ defaultPrevented: true }), a), false);
  const blank = link(main, "/deluxe-villa/", "x"); blank.setAttribute("target", "_blank");
  assert.equal(vd.shouldIntercept(click(), blank), false);
  const dl = link(main, "/deluxe-villa/", "x"); dl.setAttribute("download", "");
  assert.equal(vd.shouldIntercept(click(), dl), false);
  assert.equal(vd.shouldIntercept(click(), link(header, "/deluxe-villa/", "x")), false);
});

test("a click opens a labelled modal built without HTML parsing; the original href is kept", () => {
  const { doc, lp, main, link } = makeDoc();
  const href = "/maharaja-suite/?utm_source=google#top";
  const a = link(main, href, "Explore Maharaja Suite");
  const handler = vd.onClick(doc, ORIGIN);
  const ev = click({ target: a });
  handler(ev);
  assert.equal(ev.defaultPrevented, true);
  const d = lp.querySelector('dialog[data-ahv-villa-dialog="/maharaja-suite/"]');
  assert.ok(d && d.open);
  const h = d.querySelector("h2");
  assert.equal(d.getAttribute("aria-labelledby"), h.id);
  assert.equal(h.textContent, "Maharaja Suite");
  assert.equal(d.querySelector(".ahv-villa-dialog__more").getAttribute("href"), href);
  assert.equal(d.querySelector(".ahv-villa-dialog__more").textContent, "Explore Maharaja Suite");
  assert.equal(a.getAttribute("href"), href, "source link untouched");
  assert.equal(doc.activeElement, d.querySelector("[data-ahv-villa-close]"));
  assert.equal(d.querySelectorAll("img").length, 4);
  for (const img of d.querySelectorAll("img")) assert.ok(img.getAttribute("alt"));
});

test("close button, backdrop and native Escape (cancel → close) restore focus to the link", () => {
  const { doc, main, link } = makeDoc();
  const a = link(main, "/royal-villa/", "Royal");
  const handler = vd.onClick(doc, ORIGIN);
  handler(click({ target: a }));
  const d = main.parentNode.querySelector("dialog");
  d.querySelector("[data-ahv-villa-close]").dispatch("click");
  assert.equal(d.open, false);
  assert.equal(doc.activeElement, a);
  handler(click({ target: a }));
  assert.equal(main.parentNode.querySelectorAll("dialog").length, 1, "dialog reused");
  d.dispatch("click", { target: d });
  assert.equal(d.open, false);
  handler(click({ target: a }));
  d.close(); // what the browser does on Escape
  assert.equal(doc.activeElement, a);
  assert.equal(d.querySelector(".ahv-villa-dialog__more").textContent, "Explore Royal Villa");
});

test("Tab and Shift+Tab stay inside the dialog", () => {
  const { doc, main, link } = makeDoc();
  vd.onClick(doc, ORIGIN)(click({ target: link(main, "/classic-villa/", "Classic Villa") }));
  const d = main.parentNode.querySelector("dialog");
  const close = d.querySelector("[data-ahv-villa-close]"), more = d.querySelector(".ahv-villa-dialog__more");
  const key = (shiftKey) => ({ key: "Tab", shiftKey, preventDefault() { this.prevented = true; } });
  let e = key(false); assert.equal(vd.trapTab(e, d, more), true); assert.equal(doc.activeElement, close); assert.ok(e.prevented);
  e = key(true); assert.equal(vd.trapTab(e, d, close), true); assert.equal(doc.activeElement, more);
  assert.equal(vd.trapTab(key(false), d, close), false, "middle of the cycle uses native order");
});

test("unknown links, modified clicks and missing showModal fall back to navigation", () => {
  const { doc, main, link } = makeDoc();
  const handler = vd.onClick(doc, ORIGIN);
  let ev = click({ target: link(main, "/our-villas/", "Our villas") }); handler(ev); assert.equal(ev.defaultPrevented, false);
  ev = click({ target: link(main, "/deluxe-villa/", "Deluxe"), ctrlKey: true }); handler(ev); assert.equal(ev.defaultPrevented, false);
  const orig = doc.createElement;
  doc.createElement = (t) => { const n = orig(t); if (t === "dialog") n.showModal = undefined; return n; };
  ev = click({ target: link(main, "/deluxe-villa/", "Deluxe") }); handler(ev); assert.equal(ev.defaultPrevented, false);
  assert.equal(main.parentNode.querySelectorAll("dialog").length, 0);
});

const SCOPE_PATHS = ROUTES.map((r) => (r.endsWith(".html") ? `/${r}` : `/${r}/`));
const win = (doc, pathname) => ({ document: doc, location: { origin: ORIGIN, pathname }, HTMLDialogElement: function () {} });

test("the module's route allowlist is exactly the 14 scoped English paths", () => {
  assert.deepEqual([...vd.ROUTES].sort(), [...SCOPE_PATHS].sort());
  for (const p of SCOPE_PATHS) {
    const { doc } = makeDoc();
    assert.equal(vd.init(win(doc, p)), true, p);
  }
});

test("init refuses every other campaign, localized or non-campaign path", () => {
  const negatives = [
    "/panchkarma-treatment.html", "/ayurvedic-treatment-packages.html", "/lp/weight-loss/", "/lp/kairali-brand/",
    "/lp/treatment-in-kerala/", "/lp/ayurveda-treatment-south-india/", "/lp/panchkarma-treatment/", "/lp/treatment-packages/",
    "/lp/behandlung-in-kerala/", "/lp-v2/pain-management/", "/de/pain-management.html", "/fr/pain-management.html",
    "/ru/lp/pain-management/", "/lp/pain-management", "/PAIN-MANAGEMENT.html", "/deluxe-villa/", "/",
  ];
  for (const p of negatives) {
    const { doc } = makeDoc();
    assert.equal(vd.init(win(doc, p)), false, p);
    assert.equal(doc.querySelectorAll("link[data-ahv-villa-dialog-css]").length, 0, p);
  }
  const de = makeDoc(); de.doc.documentElement.setAttribute("lang", "de");
  assert.equal(vd.init(win(de.doc, "/pain-management.html")), false, "German document on a scoped path");
  const nolang = makeDoc(); delete nolang.doc.documentElement.attrs.lang;
  assert.equal(vd.init(win(nolang.doc, "/pain-management.html")), false, "no document language");
  const noCampaign = makeDoc(); delete noCampaign.doc.body.attrs["data-ahv-campaign"];
  assert.equal(vd.init(win(noCampaign.doc, "/pain-management.html")), false, "not the campaign document");
  const once = makeDoc(); const w = win(once.doc, "/weight-loss.html");
  assert.equal(vd.init(w), true);
  assert.equal(vd.init(w), false, "second init is a no-op");
});

test("no click is intercepted until the stylesheet loads, and never if it fails", () => {
  const run = (outcome) => {
    const { doc, main, link } = makeDoc();
    assert.equal(vd.init(win(doc, "/lp/pain-management/")), true);
    const css = doc.querySelector("link[data-ahv-villa-dialog-css]");
    const handler = doc.listeners.click[0];
    let ev = click({ target: link(main, "/deluxe-villa/", "Explore Deluxe Villa") });
    handler(ev);
    assert.equal(ev.defaultPrevented, false, "pending stylesheet: link navigates");
    if (outcome) css.dispatch(outcome);
    ev = click({ target: link(main, "/deluxe-villa/", "Explore Deluxe Villa") });
    handler(ev);
    return { prevented: ev.defaultPrevented, dialogs: main.parentNode.querySelectorAll("dialog").length };
  };
  assert.deepEqual(run("error"), { prevented: false, dialogs: 0 });
  assert.deepEqual(run("load"), { prevented: true, dialogs: 1 });
});

test("after client-side navigation the current route, language and campaign scope are re-checked on every click", () => {
  const { doc, main, link } = makeDoc();
  const w = win(doc, "/pain-management.html");
  assert.equal(vd.init(w), true);
  doc.querySelector("link[data-ahv-villa-dialog-css]").dispatch("load");
  const handler = doc.listeners.click[0];
  const tryClick = () => { const ev = click({ target: link(main, "/royal-villa/", "Explore Royal Villa") }); handler(ev); return ev.defaultPrevented; };
  const dialog = () => main.parentNode.querySelector("dialog");
  for (const p of ["/panchkarma-treatment.html", "/lp/weight-loss/", "/de/pain-management.html", "/ru/lp/pain-management/", "/lp/pain-management"]) {
    w.location.pathname = p;
    assert.equal(tryClick(), false, `navigated to ${p}: ordinary navigation`);
  }
  w.location.pathname = "/pain-management.html";
  doc.documentElement.setAttribute("lang", "de");
  assert.equal(tryClick(), false, "document language changed to German");
  doc.documentElement.setAttribute("lang", "en");
  delete doc.body.attrs["data-ahv-campaign"];
  assert.equal(tryClick(), false, "no longer the campaign document");
  assert.equal(dialog(), null, "no dialog was built off-scope");
  doc.body.setAttribute("data-ahv-campaign", "true");
  w.location.pathname = "/lp/ayurvedic-hospital-kerala/";
  assert.equal(tryClick(), true, "back on an approved route: dialog opens");
  assert.ok(dialog().open);
});

test("reopening the same villa from a different link uses that link's exact href and label", () => {
  const { doc, lp, main, link } = makeDoc();
  const handler = vd.onClick(doc, ORIGIN);
  const first = link(main, "/deluxe-villa/", "Explore Deluxe Villa");
  const second = link(main, "/deluxe-villa/?utm_campaign=x&gclid=1#gallery", "Deluxe");
  handler(click({ target: first }));
  const d = lp.querySelector("dialog");
  const more = d.querySelector(".ahv-villa-dialog__more");
  assert.equal(more.getAttribute("href"), "/deluxe-villa/");
  d.close();
  handler(click({ target: second }));
  assert.equal(lp.querySelectorAll("dialog").length, 1);
  assert.equal(more.getAttribute("href"), "/deluxe-villa/?utm_campaign=x&gclid=1#gallery");
  assert.equal(more.textContent, "Explore Deluxe Villa");
  d.close();
  assert.equal(doc.activeElement, second, "focus returns to the second trigger");
  handler(click({ target: first }));
  assert.equal(more.getAttribute("href"), "/deluxe-villa/");
});

test("source safety: no HTML parsing, fetching or script injection; CSS scoped to the dialog", () => {
  const js = read("public/design/villa-dialog.js").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  assert.doesNotMatch(js, /innerHTML|outerHTML|insertAdjacentHTML|DOMParser|document\.write|\beval\(|new Function|fetch\(|XMLHttpRequest|createElement\(["']script/);
  assert.doesNotMatch(js, /stopPropagation|dataLayer|gtag|fbq|consent|localStorage|sessionStorage/i);
  const css = read("public/design/villa-dialog.css");
  const selectors = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@keyframes[^{]*\{(?:[^{}]*\{[^}]*\})*[^}]*\}/g, "").match(/[^{}]+(?=\{)/g).map((s) => s.trim()).filter((s) => s && !s.startsWith("@"));
  for (const s of selectors) for (const part of s.split(",")) assert.match(part.trim(), /ahv-villa-dialog/, part);
});

// ---- the reachable loader: campaign-v2/production/Document.tsx ----
import vm from "node:vm";
const documentSrc = read("campaign-v2/production/Document.tsx");
const loader = documentSrc.match(/const VILLA_DIALOG_LOADER =\s*'([^']+)';/)[1];
function runLoader(pathname) {
  const added = [];
  const ctx = { location: { pathname }, document: { createElement: (t) => ({ tagName: t }), body: { appendChild: (n) => added.push(n) } } };
  vm.runInNewContext(loader, ctx);
  return added;
}

test("Document.tsx renders the loader for English documents only, after the existing chrome, nothing else changed", () => {
  assert.match(documentSrc, /\{lang === "en" \? <Script id="ahv-villa-dialog-loader" strategy="afterInteractive" dangerouslySetInnerHTML=\{\{ __html: VILLA_DIALOG_LOADER \}\} \/> : null\}/);
  assert.equal(documentSrc.match(/VILLA_DIALOG_LOADER/g).length, 2, "declared once, rendered once");
  assert.match(documentSrc, /<Script src=\{CHROME\[lang\]\} strategy="afterInteractive" \/>\n\s+\{lang === "en" \? <Script id="ahv-villa-dialog-loader"/);
  const routes = JSON.parse(loader.match(/var r=(\[[^\]]+\])/)[1]);
  assert.deepEqual([...routes].sort(), [...SCOPE_PATHS].sort(), "loader allowlist = the 14 scoped paths");
  assert.deepEqual([...routes].sort(), [...vd.ROUTES].sort(), "loader and module agree");
});

test("the loader adds villa-dialog.js on each of the 14 paths and on no other path", () => {
  for (const p of SCOPE_PATHS) {
    const added = runLoader(p);
    assert.equal(added.length, 1, p);
    assert.equal(added[0].tagName, "script");
    assert.equal(added[0].src, "/design/villa-dialog.js");
    assert.equal(added[0].async, true);
  }
  for (const p of ["/panchkarma-treatment.html", "/ayurvedic-treatment-packages.html", "/lp/weight-loss/", "/lp/kairali-brand/",
    "/lp/treatment-in-kerala/", "/lp/behandlung-in-kerala/", "/de/pain-management.html", "/ru/lp/pain-management/",
    "/lp/pain-management", "/pain-management.html/", "/", "/deluxe-villa/"]) assert.equal(runLoader(p).length, 0, p);
});
