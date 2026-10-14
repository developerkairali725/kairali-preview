// public/design/exit-offer.js — the exit-intent "Get 10% OFF on all Treatment Packages" offer with a real form.
// Owner decision, 14 Oct 2026 (direct chat, structured question): "10% offer popup", chosen over the no-discount help
// popup and over keeping exit popups off. Source-level checks with a minimal in-process DOM and a mocked fetch (never
// the network): trigger rules, once-per-session and 30-day suppression, the exclusion routes (confirmation, legal,
// lead-form and DEC-PAID-NAV paid pages) kept in step with their route sources, 13-locale copy bound to the approved
// en/de/fr popup strings and the existing l10n translations, the accessible dialog, and the /api/lead/ payload shape.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { validationProblem } from "../lib/lead-validation.ts";
import { relayLeadPayload, TABLE_COLUMNS } from "../lib/lead-store.ts";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");
const readJson = (p) => JSON.parse(read(p));
const require = createRequire(import.meta.url);
const xo = require(path.join(SITE, "public/design/exit-offer.js"));
const LOCALES = ["en", "hi", "de", "fr", "es", "it", "pt", "nl", "ru", "ar", "zh", "ja", "ko"];
const DAY = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------- wiring ----
test("every site-tree document loads the one exit-offer script; the paid campaign documents do not", () => {
  const doc = read("app/(english)/_families/site-document.tsx");
  assert.match(doc, /<script defer src="\/design\/exit-offer\.js" \/>/);
  assert.doesNotMatch(read("campaign-v2/production/Document.tsx"), /exit-offer/);
  for (const layout of ["app/(ppc-v2)/layout.tsx", "app/(campaign)/layout.tsx", "app/(lp)/layout.tsx"]) {
    assert.doesNotMatch(read(layout), /exit-offer|SiteDocument/, layout);
  }
});

test("accepted exit-intent submissions get the same receipt page; analytics logic is untouched (HARD GATE 11)", () => {
  const receipt = read("public/design/lead-receipt.js");
  assert.match(receipt, /'exit-intent': '\/thanks\/'/);
  // The consented lead-event allowlist is analytics logic: adding "exit-intent" there needs its own owner decision,
  // so an accepted exit-intent lead reaches /thanks/ but sends no conversion event until that is approved.
  const runtime = read("app/(english)/_families/consent-runtime.ts");
  assert.match(runtime, /\["contact", "enquiry-form", "online-consultation", "opd", "landing-page"\]\.indexOf\(form\) === -1\) return false;/);
  // No new tag or consent wiring in the offer script itself.
  const src = read("public/design/exit-offer.js");
  assert.doesNotMatch(src, /gtag|fbq|clarity|dataLayer|AHV_MEASUREMENT|recordInteraction|googletagmanager|AHV_SET_CONSENT/);
  assert.doesNotMatch(src, /innerHTML|insertAdjacentHTML|outerHTML|document\.write/);
});

test("server contract: the exit-intent table accepts exactly this payload and relays its columns", () => {
  const values = { full_name: "Test Guest", countrycode: "+49", phone: "1701234567", email: "guest@example.invalid", consent: true, subject: xo.OFFER_SUBJECT, trigger_type: "desktop-exit" };
  assert.equal(validationProblem("exit-intent", values), null);
  assert.equal(validationProblem("exit-intent", { ...values, consent: false }), "MISSING_REQUIRED_FIELDS");
  for (const k of Object.keys(values)) assert.ok(TABLE_COLUMNS["exit-intent"].includes(k), k);
  const relayed = relayLeadPayload("exit-intent", { site: "ayurvedichealingvillage.com", formType: "exit-intent", values, submitIp: "", tracking: { source: "", campaign: "", medium: "", gclid: "", fbclid: "", utmSource: "", utmMedium: "", utmCampaign: "", utmTerm: "", utmContent: "", leadSourceUrl: "", referrer: "" } }, "00000000-0000-4000-8000-000000000000");
  assert.equal(relayed.table, "exit-intent");
  assert.equal(relayed.values.consent, true);
  assert.equal(relayed.values.subject, xo.OFFER_SUBJECT);
  assert.equal(relayed.values.trigger_type, "desktop-exit");
});

// ---------------------------------------------------------------- copy ----
function homePopupCopy() {
  const logic = readJson("public/ahv/views/home-mobile.json").logic;
  const start = logic.indexOf("const PL = {");
  const end = logic.indexOf("};", start) + 2;
  return vm.runInNewContext(`(function(){ ${logic.slice(start, end)} return PL; })()`);
}
function l10nLookup() {
  const units = readJson("l10n/source/units.json").units;
  const bySource = new Map();
  for (const u of units) if (!bySource.has(u.source)) bySource.set(u.source, u.id);
  const tr = {};
  const out = path.join(SITE, "l10n/output");
  for (const loc of fs.readdirSync(out)) {
    for (const f of fs.readdirSync(path.join(out, loc))) {
      if (!f.endsWith(".json")) continue;
      for (const u of JSON.parse(fs.readFileSync(path.join(out, loc, f), "utf8")).units || []) (tr[u.id] ||= {})[loc] = u.text;
    }
  }
  return (english, loc) => { const id = bySource.get(english); return id && tr[id] ? tr[id][loc === "zh" ? "zh-Hans" : loc] : undefined; };
}

test("13 locales, every string present, no template residue", () => {
  assert.deepEqual([...xo.LOCALES], LOCALES);
  assert.deepEqual(Object.keys(xo.COPY), LOCALES);
  const keys = Object.keys(xo.COPY.en);
  for (const loc of LOCALES) {
    assert.deepEqual(Object.keys(xo.COPY[loc]), keys, loc);
    for (const k of keys) {
      assert.equal(typeof xo.COPY[loc][k], "string", `${loc}.${k}`);
      assert.ok(xo.COPY[loc][k].trim(), `${loc}.${k}`);
      assert.doesNotMatch(xo.COPY[loc][k], /\{\{|\[\[|undefined|TODO/, `${loc}.${k}`);
    }
    assert.match(xo.COPY[loc].offer, /10\s?%/, `${loc}: the offer states 10%`);
  }
  assert.equal(xo.language("/"), "en");
  assert.equal(xo.language("/zh/our-villas/"), "zh");
  assert.equal(xo.language("/de"), "de");
  assert.equal(xo.language("/delhi-wellness/"), "en");
});

test("English, German and French use the approved popup strings of the home view, verbatim", () => {
  const PL = homePopupCopy();
  const map = { en: "English", de: "German", fr: "French" };
  for (const [loc, name] of Object.entries(map)) {
    const p = PL[name];
    for (const k of ["eyebrow", "title", "offer", "desc", "cta"]) assert.equal(xo.COPY[loc][k], p[k], `${loc}.${k}`);
    assert.equal(xo.COPY[loc].name, p.f1, `${loc}.name`);
    assert.equal(xo.COPY[loc].phone, p.f2, `${loc}.phone`);
    assert.equal(xo.COPY[loc].email, p.f3, `${loc}.email`);
  }
  assert.equal(xo.OFFER_SUBJECT, PL.English.offer);
});

test("no offer terms, validity dates or exclusions are invented (the approved offer has no footnote)", () => {
  for (const loc of LOCALES) {
    const all = Object.values(xo.COPY[loc]).join(" ");
    assert.doesNotMatch(all, /\b20\d\d\b(?!.*1908)|valid|until|expires|T&C|terms apply|\*\s*$/i, loc);
    assert.doesNotMatch(xo.COPY[loc].offer, /\*/, `${loc}: no unexplained asterisk`);
  }
});

test("other strings reuse the site's existing translations (popup, form, consent and status units)", () => {
  const t = l10nLookup();
  const en = xo.COPY.en;
  const reused = ["place", "note", "imageAlt", "close", "invalid", "success", "countryCode", "consent", "consentError", "privacy", "sending", "notConnected", "failed", "network", "wait"];
  const designed = ["eyebrow", "title", "offer", "desc", "name", "phone", "email", "cta"];
  for (const loc of LOCALES.slice(1)) {
    for (const k of reused) assert.equal(xo.COPY[loc][k], t(en[k], loc), `${loc}.${k}`);
    if (loc !== "de" && loc !== "fr") {
      for (const k of designed) assert.equal(xo.COPY[loc][k], t(en[k] === en.name ? "Name:*" : en[k], loc), `${loc}.${k}`);
    }
    // Image caption: the unit's own translation where it means "before you leave", else the eyebrow's translation.
    const own = t("Before you go", loc);
    assert.ok([own, xo.COPY[loc].eyebrow].includes(xo.COPY[loc].caption), `${loc}.caption`);
  }
  // Country-code error: lead-receipt.js's existing 13-locale message.
  const receipt = read("public/design/lead-receipt.js");
  for (const loc of LOCALES) assert.ok(receipt.includes(`'${xo.COPY[loc].countryCodeError}'`), `${loc}.countryCodeError`);
});

// ---------------------------------------------------------------- routes ----
function sourceExclusions() {
  const cat = { confirmation: new Set(), legal: new Set(["/privacy/", "/terms/"]), form: new Set(), paid: new Set() };
  for (const r of readJson("english-candidate/route-manifest.json").routes) {
    const v = r.mobileView;
    if (v === "ahv-page-confirmation-mobile") cat.confirmation.add(r.path);
    else if (v === "ahv-page-policy-reader-mobile" || v === "ahv-template-legal-policy-mobile") cat.legal.add(r.path);
    else if (v === "ahv-page-enquiry-mobile") cat.form.add(r.path);
    else if (v.startsWith("ahv-page-campaign-")) cat.paid.add(r.path);
  }
  for (const p of readJson("campaign-v110/routes.json")) cat.paid.add(p);
  const app = path.join(SITE, "app");
  const walk = (dir, url) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const seg = /^\(.*\)$/.test(e.name) ? "" : "/" + e.name;
      const sub = path.join(dir, e.name);
      const page = path.join(sub, "page.tsx");
      if (fs.existsSync(page) && /<ProductionPage\b/.test(fs.readFileSync(page, "utf8"))) cat.paid.add(url + seg + (/\.html$/.test(e.name) ? "" : "/"));
      walk(sub, url + seg);
    }
  };
  const paidGroups = fs.readdirSync(app).filter((d) => /^\(ppc-v2(-[a-z]+)?\)$/.test(d));
  for (const g of paidGroups) walk(path.join(app, g), "");
  return cat;
}

test("exclusion lists are exactly the route sources (confirmation, legal, lead-form and every paid page)", () => {
  const src = sourceExclusions();
  for (const k of Object.keys(src)) assert.deepEqual([...xo.EXCLUDED[k]].sort(), [...src[k]].sort(), k);
  // DEC-PAID-NAV: the 24 live paid campaign pages (ProductionPage) are all excluded.
  const production = [...src.paid].filter((p) => !p.startsWith("/offers/"));
  assert.ok(production.length >= 24);
});

test("every locale copy of an excluded route is excluded, with its reason; other pages stay eligible", () => {
  const routes = readJson("l10n/routes.json").routes;
  let checked = 0;
  for (const [reason, list] of Object.entries(xo.EXCLUDED)) {
    for (const base of list) {
      assert.equal(xo.exclusionReason(base), reason, base);
      for (const p of Object.values(routes[base] || {})) { assert.equal(xo.exclusionReason(p), reason, p); checked++; }
    }
  }
  assert.ok(checked > 300, `${checked} localized paths`);
  for (const p of Object.keys(xo.LOCALIZED_EXCLUDED)) assert.ok(Object.values(routes).some((r) => Object.values(r).includes(p)), p);
  for (const p of ["/fr/remerciers/", "/de/thanks/", "/zh/onlineconsultation-thanks/", "/thanks", "/ar/contact-us/thank-you/"]) assert.equal(xo.exclusionReason(p), "confirmation", p);
  for (const p of ["/de/cookie-richtlinie/", "/fr/mentions-legales/", "/ja/new-privacy-policy/", "/terms-and-conditions/"]) assert.equal(xo.exclusionReason(p), "legal", p);
  for (const p of ["/lp/weight-loss/", "/lp/anything-new/", "/ru/lp/treatment-in-kerala-russian/", "/lp-v2/pain-management/a/", "/pain-management.html", "/offers/new/", "/kairali-air-india-maharaja-club.html"]) assert.equal(xo.exclusionReason(p), "paid", p);
  for (const p of ["/", "/de/", "/zh/", "/our-villas/", "/fr/villas/", "/ayurvedic-treatments/", "/hi/our-villas/", "/deluxe-villa/", "/delhi-something/"]) assert.equal(xo.exclusionReason(p), null, p);
});

// ---------------------------------------------------------------- trigger ----
function env(over = {}) {
  const e = { t: 0, y: 0, h: 800, pointer: "fine", ...over };
  return {
    e,
    api: { now: () => e.t, scrollY: () => e.y, innerHeight: () => e.h, matches: (q) => q === `(pointer: ${e.pointer})` },
  };
}
const leave = (over = {}) => ({ clientY: -1, relatedTarget: null, ...over });

test("desktop: only a fine pointer leaving through the top, after 30 s and one viewport of scrolling", () => {
  const { e, api } = env();
  const shown = [];
  const tr = xo.createTrigger(api, (kind) => { shown.push(kind); });
  e.t = 60000;
  assert.equal(tr.mouseout(leave()), false, "no engagement yet");
  e.y = 900; tr.scroll();
  e.t = 29999;
  assert.equal(tr.mouseout(leave()), false, "before 30 s");
  e.t = 30000;
  assert.equal(tr.mouseout(leave({ clientY: 5 })), false, "not through the top");
  assert.equal(tr.mouseout(leave({ relatedTarget: {} })), false, "moving to another element");
  assert.equal(tr.mouseout(leave()), true);
  assert.deepEqual(shown, ["desktop-exit"]);
  assert.equal(tr.mouseout(leave()), false, "at most once");
  assert.equal(shown.length, 1);
});

test("mobile: a coarse pointer scrolling back towards the top by more than a viewport; no mouse trigger", () => {
  const { e, api } = env({ pointer: "coarse", h: 844 });
  const shown = [];
  const tr = xo.createTrigger(api, (kind) => { shown.push(kind); });
  assert.equal(tr.mouseout(leave()), false);
  e.t = 10000; e.y = 2000; tr.scroll(); e.y = 100;
  assert.equal(tr.scroll(), false, "before 30 s");
  e.t = 31000; e.y = 2400; tr.scroll();
  e.y = 1700; assert.equal(tr.scroll(), false, "still below the first viewport");
  e.y = 600; assert.equal(tr.scroll(), true);
  assert.deepEqual(shown, ["mobile-scroll-return"]);
  e.y = 2400; tr.scroll(); e.y = 0; assert.equal(tr.scroll(), false, "once");
});

test("a blocked moment (another dialog, consent notice) does not use up the one chance", () => {
  const { e, api } = env();
  let allow = false, n = 0;
  const tr = xo.createTrigger(api, () => { n++; return allow ? true : false; });
  e.t = 40000; e.y = 900; tr.scroll();
  assert.equal(tr.mouseout(leave()), false);
  allow = true;
  assert.equal(tr.mouseout(leave()), true);
  assert.equal(n, 2);
});

// ---------------------------------------------------------------- storage ----
function store(initial = {}) {
  const m = new Map(Object.entries(initial));
  return { m, getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}

test("30-day suppression after a dismissal or a submission; storage holds only the outcome and time", () => {
  const now = Date.UTC(2026, 9, 14);
  const s = store();
  assert.equal(xo.suppressed(s, now), false);
  xo.remember(s, "dismissed", now - DAY);
  assert.deepEqual(JSON.parse(s.getItem(xo.STORE_KEY)), { state: "dismissed", at: now - DAY });
  assert.equal(xo.suppressed(s, now), true);
  xo.remember(s, "submitted", now - 29 * DAY);
  assert.equal(xo.suppressed(s, now), true);
  xo.remember(s, "dismissed", now - 30 * DAY);
  assert.equal(xo.suppressed(s, now), false, "expires after 30 days");
  xo.remember(s, "dismissed", now + DAY);
  assert.equal(xo.suppressed(s, now), false, "a future timestamp never suppresses forever");
  s.setItem(xo.STORE_KEY, "{not json");
  assert.equal(xo.suppressed(s, now), false);
  s.setItem(xo.STORE_KEY, JSON.stringify({ state: "shown", at: now }));
  assert.equal(xo.suppressed(s, now), false);
  const broken = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
  assert.equal(xo.suppressed(broken, now), false);
  assert.equal(xo.remember(broken, "dismissed", now), false);
  assert.equal(xo.SUPPRESS_DAYS, 30);
  assert.equal(xo.MIN_ENGAGED_MS, 30000);
});

// ---------------------------------------------------------------- minimal DOM ----
class Node {
  constructor(doc, tag) { this.ownerDocument = doc; this.tagName = tag.toUpperCase(); this.children = []; this.parentNode = null; this.attrs = {}; this.listeners = {}; this._text = ""; this.value = ""; this.checked = false; }
  get className() { return this.attrs.class || ""; } set className(v) { this.attrs.class = v; }
  get id() { return this.attrs.id || ""; } set id(v) { this.attrs.id = v; }
  get hidden() { return "hidden" in this.attrs; } set hidden(v) { if (v) this.attrs.hidden = ""; else delete this.attrs.hidden; }
  get textContent() { return this._text + this.children.map((c) => c.textContent).join(""); } set textContent(v) { this._text = String(v); this.children = []; }
  set innerHTML(_) { throw new Error("innerHTML must not be used"); }
  setAttribute(k, v) { this.attrs[k] = String(v); } getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; } hasAttribute(k) { return k in this.attrs; } removeAttribute(k) { delete this.attrs[k]; }
  set href(v) { this.attrs.href = v; } set download(v) { this.attrs.download = v; }
  appendChild(c) { c.parentNode = this; this.children.push(c); return c; }
  remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter((c) => c !== this); this.parentNode = null; }
  click() { this.ownerDocument.clicked.push(this); }
  get isConnected() { let n = this; while (n.parentNode) n = n.parentNode; return n === this.ownerDocument.documentElement; }
  contains(n) { for (; n; n = n.parentNode) if (n === this) return true; return false; }
  matches(sel) { return sel.split(",").some((s) => matchOne(this, s.trim())); }
  closest(sel) { for (let n = this; n && n.tagName; n = n.parentNode) if (n.matches(sel)) return n; return null; }
  all() { return this.children.flatMap((c) => [c, ...c.all()]); }
  querySelectorAll(sel) { return this.all().filter((n) => n.matches(sel)); }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
  addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }
  dispatch(t, ev = {}) { ev.type = t; ev.target ||= this; ev.preventDefault ||= () => { ev.defaultPrevented = true; }; for (let n = this; n; n = n.parentNode) for (const f of n.listeners?.[t] || []) f(ev); return ev; }
  focus() { this.ownerDocument.activeElement = this; }
}
class Dialog extends Node {
  constructor(doc) { super(doc, "dialog"); }
  get open() { return "open" in this.attrs; }
  showModal() { if (!this.isConnected) throw new Error("not connected"); this.attrs.open = ""; }
  close() { if (!this.open) return; delete this.attrs.open; this.dispatch("close"); }
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
function makeWin(pathname = "/", over = {}) {
  const doc = { activeElement: null, clicked: [], referrer: "https://www.google.com/" };
  doc.createElement = (t) => (t === "dialog" ? new Dialog(doc) : new Node(doc, t));
  doc.createTextNode = (t) => { const n = new Node(doc, "#text"); n.textContent = t; return n; };
  doc.documentElement = new Node(doc, "html");
  const classes = new Set();
  doc.documentElement.classList = { contains: (c) => classes.has(c), add: (c) => classes.add(c) };
  doc.head = doc.documentElement.appendChild(new Node(doc, "head"));
  doc.body = doc.documentElement.appendChild(new Node(doc, "body"));
  doc.body.setAttribute("data-ahv-chat-open", "false");
  doc.querySelector = (s) => doc.documentElement.querySelector(s);
  doc.querySelectorAll = (s) => doc.documentElement.querySelectorAll(s);
  doc.getElementById = (id) => doc.documentElement.all().find((n) => n.id === id) || null;
  doc.listeners = {};
  doc.addEventListener = (t, f) => (doc.listeners[t] ||= []).push(f);
  doc.removeEventListener = (t, f) => { doc.listeners[t] = (doc.listeners[t] || []).filter((x) => x !== f); };
  const win = {
    document: doc, location: { pathname, href: `https://ayurvedichealingvillage.com${pathname}?utm_source=google&gclid=abc` },
    HTMLDialogElement: function () {}, localStorage: store(), sessionStorage: store(), scrollY: 0, innerHeight: 800,
    matchMedia: (q) => ({ matches: q === "(pointer: fine)" }), listeners: {},
    addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }, removeEventListener(t, f) { this.listeners[t] = (this.listeners[t] || []).filter((x) => x !== f); },
    setTimeout: (f, ms) => ({ f, ms }), clearTimeout() {},
    AbortController, Blob, crypto: { randomUUID: (() => { let i = 0; return () => `00000000-0000-4000-8000-00000000000${++i}`; })() },
    fetch: async () => { throw new Error("fetch not mocked"); },
    ...over,
  };
  return { win, doc };
}

test("dialog: role=dialog, aria-modal, labelled by its heading, localized labels and fields, built without HTML parsing", () => {
  for (const loc of LOCALES) {
    const { doc } = makeWin();
    const d = xo.buildDialog(doc, loc);
    const t = xo.COPY[loc];
    assert.equal(d.tagName, "DIALOG");
    assert.equal(d.getAttribute("role"), "dialog");
    assert.equal(d.getAttribute("aria-modal"), "true");
    const h = d.querySelector("h2");
    assert.equal(d.getAttribute("aria-labelledby"), h.id);
    assert.equal(h.textContent, t.title);
    assert.equal(d.all().find((n) => n.id === d.getAttribute("aria-describedby")).textContent, t.offer);
    assert.equal(d.querySelector("[data-ahv-exit-close]").getAttribute("aria-label"), t.close);
    assert.equal(d.querySelector('[role="img"]').getAttribute("aria-label"), t.imageAlt);
    const inputs = d.querySelectorAll("input");
    assert.deepEqual(inputs.map((i) => i.getAttribute("name")), ["full_name", "countrycode", "phone", "email", "consent"]);
    for (const i of inputs) {
      assert.ok(i.hasAttribute("required"), `${loc} ${i.getAttribute("name")} required`);
      const label = d.querySelectorAll("label").find((l) => l.getAttribute("for") === i.id);
      assert.ok(label && label.textContent.trim(), `${loc} ${i.getAttribute("name")} labelled`);
    }
    assert.deepEqual(d.querySelectorAll("label").map((l) => l.textContent), [t.name, t.countryCode, t.phone, t.email, t.consent]);
    assert.equal(d.querySelector('input[name="countrycode"]').getAttribute("autocomplete"), "tel-country-code");
    assert.equal(d.querySelector('input[name="email"]').getAttribute("type"), "email");
    assert.equal(d.querySelector('input[name="consent"]').getAttribute("type"), "checkbox");
    assert.equal(d.querySelector("a.ahv-exit-offer__privacy").getAttribute("href"), loc === "en" ? "/new-privacy-policy/" : `/${loc}/new-privacy-policy/`);
    assert.equal(d.querySelector('button[type="submit"]').textContent, t.cta);
    assert.equal(d.querySelector("[data-ahv-exit-alert]").getAttribute("role"), "alert");
    assert.equal(d.querySelector("[data-ahv-exit-status]").getAttribute("role"), "status");
    assert.ok(d.querySelector("[data-ahv-exit-success]").hidden);
  }
});

function openedOn(pathname = "/", over = {}) {
  const ctx = makeWin(pathname, over);
  const opener = ctx.doc.body.appendChild(new Node(ctx.doc, "a"));
  opener.setAttribute("href", "/our-villas/");
  opener.focus();
  const deps = { win: ctx.win, doc: ctx.doc, lang: xo.language(pathname), storage: ctx.win.localStorage, now: () => 1000, state: { busy: false, done: false, token: null } };
  assert.equal(xo.open(ctx.win, "desktop-exit", deps), true);
  const d = ctx.doc.querySelector("dialog[data-ahv-exit-offer]");
  return { ...ctx, deps, d, opener };
}

test("open focuses the close button; the close button, backdrop and Escape (native close) return focus and record a dismissal", () => {
  let o = openedOn();
  assert.ok(o.d.open);
  assert.equal(o.doc.activeElement, o.d.querySelector("[data-ahv-exit-close]"));
  assert.equal(o.doc.querySelectorAll("style[data-ahv-exit-offer-css]").length, 1);
  o.d.querySelector("[data-ahv-exit-close]").dispatch("click");
  assert.equal(o.d.open, false);
  assert.equal(o.doc.activeElement, o.opener);
  assert.equal(JSON.parse(o.win.localStorage.getItem(xo.STORE_KEY)).state, "dismissed");

  o = openedOn();
  o.d.getBoundingClientRect = () => ({ left: 100, right: 500, top: 100, bottom: 700 });
  o.d.dispatch("click", { target: o.d, clientX: 300, clientY: 300 });
  assert.equal(o.d.open, true, "a click inside the box keeps it open");
  o.d.dispatch("click", { target: o.d, clientX: 20, clientY: 300 });
  assert.equal(o.d.open, false, "backdrop click closes");

  o = openedOn("/de/");
  o.d.close(); // what the browser does on Escape (cancel → close)
  assert.equal(o.doc.activeElement, o.opener);
  assert.equal(JSON.parse(o.win.localStorage.getItem(xo.STORE_KEY)).state, "dismissed");
});

test("Tab and Shift+Tab stay inside the dialog", () => {
  const { d, doc } = openedOn();
  const key = (shiftKey) => ({ key: "Tab", shiftKey, preventDefault() { this.prevented = true; } });
  const close = d.querySelector("[data-ahv-exit-close]");
  const last = d.querySelector('button[type="submit"]');
  let e = key(true); assert.equal(xo.trapTab(e, d, close), true); assert.equal(doc.activeElement, last); assert.ok(e.prevented);
  e = key(false); assert.equal(xo.trapTab(e, d, last), true); assert.equal(doc.activeElement, close);
  assert.equal(xo.trapTab(key(false), d, d.querySelector('input[name="email"]')), false, "middle of the cycle uses native order");
});

test("never over another dialog, the cookie notice, the open chat or a form the visitor is typing in", () => {
  const blockers = [
    (doc) => { const x = doc.body.appendChild(new Dialog(doc)); x.attrs.open = ""; },
    (doc) => { doc.body.appendChild(new Node(doc, "div")).setAttribute("aria-modal", "true"); },
    (doc) => { doc.body.appendChild(new Node(doc, "div")).id = "ahv-consent"; },
    (doc) => { doc.documentElement.classList.add("show--consent"); },
    (doc) => { doc.documentElement.classList.add("show--preferences"); },
    (doc) => { doc.body.setAttribute("data-ahv-chat-open", "true"); },
    (doc) => { const f = doc.body.appendChild(new Node(doc, "form")); f.appendChild(new Node(doc, "input")).focus(); },
  ];
  for (const [i, block] of blockers.entries()) {
    const { doc } = makeWin();
    assert.equal(xo.busyElsewhere(doc, null), false, `clear ${i}`);
    block(doc);
    assert.equal(xo.busyElsewhere(doc, null), true, `blocked ${i}`);
  }
  const { doc } = makeWin();
  const hiddenPanel = doc.body.appendChild(new Node(doc, "div"));
  hiddenPanel.setAttribute("aria-modal", "true");
  hiddenPanel.getClientRects = () => [];
  assert.equal(xo.busyElsewhere(doc, null), false, "a mounted but hidden aria-modal panel does not block");
  const own = doc.body.appendChild(new Dialog(doc)); own.setAttribute("aria-modal", "true");
  assert.equal(xo.busyElsewhere(doc, own), false, "its own closed dialog does not block");
});

test("init: inert on excluded routes, campaign documents, after a session showing, while suppressed or without <dialog>", () => {
  for (const p of ["/thanks/", "/fr/remerciers/", "/new-privacy-policy/", "/contact-us/", "/lp/weight-loss/", "/ayurvedic-treatment-packages.html", "/offers/senior-citizen-offer/"]) {
    const { win } = makeWin(p);
    assert.equal(xo.init(win), false, p);
    assert.equal((win.listeners.scroll || []).length, 0, p);
  }
  let c = makeWin("/our-villas/"); c.doc.body.setAttribute("data-ahv-campaign", "true");
  assert.equal(xo.init(c.win), false, "campaign document");
  c = makeWin("/"); c.win.sessionStorage.setItem(xo.SESSION_KEY, "shown");
  assert.equal(xo.init(c.win), false, "once per session");
  c = makeWin("/"); xo.remember(c.win.localStorage, "dismissed", Date.now() - DAY);
  assert.equal(xo.init(c.win), false, "suppressed after a dismissal");
  c = makeWin("/"); delete c.win.HTMLDialogElement;
  assert.equal(xo.init(c.win), false, "no native dialog");
  c = makeWin("/");
  assert.equal(xo.init(c.win), true);
  assert.equal(xo.init(c.win), false, "second init is a no-op");
  assert.equal(c.win.listeners.scroll.length, 1);
  assert.equal(c.doc.listeners.mouseout.length, 1);
  assert.equal(c.doc.querySelector("dialog"), null, "nothing is built before an exit");
});

test("init end to end: an exit opens it once, marks the session and detaches the listeners", () => {
  const realNow = Date.now;
  let t = 1_000_000;
  Date.now = () => t;
  try {
    const { win, doc } = makeWin("/ko/");
    assert.equal(xo.init(win), true);
    win.scrollY = 900; win.listeners.scroll[0]();
    t += 31000;
    doc.listeners.mouseout[0](leave());
    const d = doc.querySelector("dialog[data-ahv-exit-offer]");
    assert.ok(d && d.open);
    assert.equal(d.querySelector("h2").textContent, xo.COPY.ko.title);
    assert.equal(win.sessionStorage.getItem(xo.SESSION_KEY), "shown");
    assert.equal(win.listeners.scroll.length, 0);
    assert.equal(doc.listeners.mouseout.length, 0);
  } finally { Date.now = realNow; }
});

// ---------------------------------------------------------------- submission ----
function fill(d, v) {
  for (const [k, val] of Object.entries(v)) {
    const i = d.querySelector(`[name="${k}"]`);
    if (k === "consent") i.checked = val; else i.value = val;
  }
}
const GOOD = { full_name: "Test Guest", countrycode: "+49", phone: "170 1234567", email: "guest@example.invalid", consent: true };
function contactBodyKeys() {
  const boot = read("app/(english)/_families/static-design-boot.mjs");
  const s = boot.slice(boot.indexOf('form: "contact"'), boot.indexOf("fields:", boot.indexOf('form: "contact"')));
  return ["form", ...[...s.matchAll(/(\w+):/g)].map((m) => m[1]), "fields"];
}

test("invalid input never reaches the network: fields are marked and the localized message is shown", async () => {
  const o = openedOn("/es/", { fetch: async () => { throw new Error("must not fetch"); } });
  o.deps.trigger = "desktop-exit";
  fill(o.d, { ...GOOD, email: "nope", consent: false });
  assert.equal(await xo.submit(o.d, o.deps), false);
  assert.equal(o.d.querySelector('[name="email"]').getAttribute("aria-invalid"), "true");
  assert.equal(o.d.querySelector('[name="consent"]').getAttribute("aria-invalid"), "true");
  assert.equal(o.d.querySelector('[name="full_name"]').getAttribute("aria-invalid"), null);
  const alert = o.d.querySelector("[data-ahv-exit-alert]");
  assert.equal(alert.hidden, false);
  assert.equal(alert.textContent, xo.COPY.es.invalid);
  assert.equal(o.doc.activeElement, o.d.querySelector('[name="email"]'));
  fill(o.d, { ...GOOD, consent: false });
  await xo.submit(o.d, o.deps);
  assert.equal(alert.textContent, xo.COPY.es.consentError);
  fill(o.d, { ...GOOD, countrycode: " " });
  await xo.submit(o.d, o.deps);
  assert.equal(alert.textContent, xo.COPY.es.countryCodeError);
  fill(o.d, { ...GOOD, phone: "12345" });
  await xo.submit(o.d, o.deps);
  assert.equal(alert.textContent, xo.COPY.es.invalid);
});

test("payload: the contact form's /api/lead/ body as form exit-intent, with consent, subject and trigger", async () => {
  const calls = [];
  const o = openedOn("/zh/", {
    fetch: async (url, init) => { calls.push({ url, init, body: JSON.parse(await init.body.text()) }); return { ok: true, status: 200, json: async () => ({ ok: true, status: "received", guideUrl: "/downloads/guide-zh.pdf" }) }; },
    AHV_LEAD_RECEIPT: { attribution: () => ({ utm_source: "google", gclid: "abc" }), siteLanguage: () => "zh-Hans" },
  });
  o.deps.trigger = "mobile-scroll-return";
  fill(o.d, GOOD);
  assert.equal(await xo.submit(o.d, o.deps), true);
  assert.equal(calls.length, 1);
  const { url, init, body } = calls[0];
  assert.equal(url, "/api/lead/");
  assert.equal(init.method, "POST");
  assert.equal(init.credentials, "same-origin");
  assert.equal(init.cache, "no-store");
  assert.equal(init.body.type, "application/json");
  assert.deepEqual(Object.keys(body), contactBodyKeys().map((k) => (k === "submissionToken" ? k : k)).filter((k, i, a) => a.indexOf(k) === i));
  assert.equal(body.form, "exit-intent");
  assert.match(body.submissionToken, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(body.site_language, "zh-Hans");
  assert.equal(body.utm_source, "google");
  assert.equal(body.gclid, "abc");
  assert.equal(body.utm_medium, "");
  assert.equal(body.lead_source_url, "https://ayurvedichealingvillage.com/zh/?utm_source=google&gclid=abc");
  assert.equal(body.referrer, "https://www.google.com/");
  assert.deepEqual(body.fields, { full_name: "Test Guest", countrycode: "+49", phone: "170 1234567", email: "guest@example.invalid", consent: true, subject: "Get 10% OFF on all Treatment Packages", trigger_type: "mobile-scroll-return" });
  assert.equal(validationProblem("exit-intent", body.fields), null, "the server accepts it");
  // Outcome: success shown, form hidden, guide offered like the contact form, 30-day suppression recorded.
  assert.equal(o.d.querySelector("form").hidden, true);
  assert.equal(o.d.querySelector("[data-ahv-exit-success]").hidden, false);
  assert.equal(o.doc.clicked[0].attrs.href, "/downloads/guide-zh.pdf");
  assert.equal(JSON.parse(o.win.localStorage.getItem(xo.STORE_KEY)).state, "submitted");
  assert.doesNotMatch(o.win.localStorage.getItem(xo.STORE_KEY), /guest|Test|170/, "no personal data in storage");
  o.d.close();
  assert.equal(JSON.parse(o.win.localStorage.getItem(xo.STORE_KEY)).state, "submitted", "closing after success stays 'submitted'");
});

test("server outcomes keep the details and show the site's existing messages; a retry reuses the token", async () => {
  const cases = [
    [{ status: 503, ok: false, json: async () => ({ ok: false, code: "LEAD_STORE_NOT_CONFIGURED" }) }, "notConnected"],
    [{ status: 429, ok: false, json: async () => ({ ok: false, code: "RATE_LIMITED" }) }, "wait"],
    [{ status: 502, ok: false, json: async () => ({ ok: false, code: "SHEET_SYNC_FAILED" }) }, "failed"],
    [{ status: 200, ok: true, json: async () => { throw new Error("not json"); } }, "failed"],
    [null, "network"],
  ];
  for (const [response, key] of cases) {
    const tokens = [];
    const o = openedOn("/ar/", { fetch: async (u, init) => { tokens.push(JSON.parse(await init.body.text()).submissionToken); if (!response) throw new TypeError("offline"); return response; } });
    fill(o.d, GOOD);
    assert.equal(await xo.submit(o.d, o.deps), false, key);
    assert.equal(o.d.querySelector("[data-ahv-exit-status]").textContent, xo.COPY.ar[key], key);
    assert.equal(o.d.querySelector("form").hidden, false, key);
    assert.equal(o.d.querySelector('[name="email"]').value, GOOD.email, `${key}: details kept`);
    assert.equal(o.win.localStorage.getItem(xo.STORE_KEY), null, `${key}: nothing recorded`);
    await xo.submit(o.d, o.deps);
    assert.equal(tokens[0], tokens[1], `${key}: same token on retry`);
    o.d.querySelector("form").dispatch("input");
    await xo.submit(o.d, o.deps);
    assert.notEqual(tokens[2], tokens[1], `${key}: edited details get a new token`);
  }
});
