// Train I (15 Oct 2026): owner decisions 28-30, 32 and 33 (OWNER-DECISIONS-20261015-ANSWERS.json) on the Train G head
// 441c3aa5c. Source only: no build, deploy, network, form submission or lead. Exact deltas: fixtures/train-i-20261015.json.
//   28  AHV-WB.004/030/149/288/310/334/465.quotation-box: one quotation explanation per page (the stay box) plus the owner's
//       pinned CTA support line; restating step, closing and FAQ mentions reworded without dropping a fact.
//   29  AHV-WB.054.change / AHV-LATER-016.01: "Abhyangam, a full-body medicated oil therapy" on /pain-management.html.
//   30  AHV-M024.01: the first-visit compact consent notice no longer hides keyboard-focused links (layout only).
//   32  AHV-M067.01: /why-get-training-in-yoga/ points at the current yoga programmes with approved, translated copy.
//   33  AHV-LATER-043.01 hero fine print 14px on phones (and shown on D phones); AHV-I04.M085.links Katha 2019 links;
//       AHV-LATER-038.01 Tripadvisor 4.6 / 450 dated 29 August 2026; AHV-N08.yoga-and-meditation-package.description.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { unitId } from "../tools/l10n/lib.mjs";
import { LOCALES } from "../tools/l10n/locales.mjs";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import { pageText } from "../campaign-v2/kit/lint/page-text.ts";
import { lintData } from "../campaign-v2/kit/lint/data.ts";
import { TRIPADVISOR, dateLabel, monthLabel } from "../campaign-v2/data/ratings.ts";
import { productionCss } from "../scripts/build-production-css.mjs";
import { TRAIN_I, reverseTrainISource, peelTrainISource, reverseTrainIConfig, reverseTrainIRatings } from "./fixtures/train-i-20261015.mjs";
// Train J batch 1 composes on Train I: its recorded delta is peeled first (fixtures/train-j1-20261015.mjs).
import { peelTrainJ1Source } from "./fixtures/train-j1-20261015.mjs";

const SITE = fileURLToPath(new URL("../", import.meta.url));
const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(read(p));
const sha = (s) => createHash("sha256").update(s).digest("hex");
const plain = (v) => JSON.parse(JSON.stringify(v));
const LOCS = Object.keys(LOCALES).filter((l) => l !== "en");
const BASE = "441c3aa5c3fb3c205545e62318318ad107dea997";

// The accepted catalogue the l10n build reads (tools/l10n/build.mjs catalog()), as in train-g-rework-20261015.test.mjs.
const SRC = new Map(json("l10n/source/units.json").units.map((u) => [u.id, u]));
const catalogs = new Map();
function catalog(loc) {
  if (catalogs.has(loc)) return catalogs.get(loc);
  const cat = new Map();
  const pre = new URL(`../l10n/prefill/${loc}.json`, import.meta.url);
  if (fs.existsSync(pre)) for (const [id, v] of Object.entries(JSON.parse(fs.readFileSync(pre, "utf8")))) cat.set(id, v.text);
  const dir = new URL(`../l10n/output/${loc}/`, import.meta.url);
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
    for (const u of JSON.parse(fs.readFileSync(new URL(f, dir), "utf8")).units) {
      const src = SRC.get(u.id);
      if (src && src.sourceHash === u.sourceHash && u.status === "translated" && typeof u.text === "string") cat.set(u.id, u.text);
    }
  }
  const ovr = new URL(`../l10n/overrides/${loc}.json`, import.meta.url);
  if (fs.existsSync(ovr)) for (const [id, v] of Object.entries(JSON.parse(fs.readFileSync(ovr, "utf8")))) if (SRC.get(id)?.sourceHash === v.sourceHash) cat.set(id, v.text);
  for (const f of ["catalogue-locales.json", "information-locales.json", "release-visible-locales.json"]) {
    for (const u of json(`english-candidate/${f}`).units) if (u.translations[loc]) cat.set(unitId(u.source), u.translations[loc]);
  }
  catalogs.set(loc, cat);
  return cat;
}
const untranslated = (source) => LOCS.filter((loc) => typeof catalog(loc).get(unitId(source)) !== "string" || !catalog(loc).get(unitId(source)).trim());
const REDIRECTS = json("english-candidate/redirect-map.json").redirects;
const SERVED = new Set(json("english-candidate/route-manifest.json").routes.map((r) => r.path));
const L10N = json("l10n/routes.json").routes;
const finalLocalized = (p) => { assert.equal(REDIRECTS[p], undefined, `${p} is not a 301 source`); assert.ok(SERVED.has(p), `${p} is served`); assert.equal(Object.keys(L10N[p] || {}).length, 13, `${p} has 13 locale routes`); };

// ── the recorded delta ───────────────────────────────────────────────────────────────────────────────────────────────
test("every Train I file reverses exactly to the Train G head bytes (git 441c3aa5c); the head passes through; a third state fails", () => {
  assert.equal(TRAIN_I.base, BASE);
  assert.equal(Object.keys(TRAIN_I.files).length, 20);
  for (const [p, e] of Object.entries(TRAIN_I.files)) {
    const now = peelTrainJ1Source(p, read(p));
    assert.equal(sha(now), e.afterSHA256, `${p}: current bytes are Train I's`);
    const head = reverseTrainISource(p, now);
    assert.equal(sha(head), e.beforeSHA256, p);
    assert.equal(reverseTrainISource(p, head), head, `${p}: head bytes pass through`);
    assert.equal(peelTrainISource(p, head), head, `${p}: peel passes the head through`);
    assert.throws(() => reverseTrainISource(p, now + " "), undefined, `${p}: any third state fails`);
    let base = null;
    try { base = execFileSync("git", ["show", `${BASE}:sites/ayurvedichealingvillage.com/${p}`], { cwd: SITE, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 27 }); } catch {}
    if (base !== null) assert.equal(sha(base), e.beforeSHA256, `${p}: beforeSHA256 is the Train G head`);
    for (const r of e.replacements) assert.match(r.row, /^AHV-/, p);
  }
});

test("configs: Train I changes exactly the recorded fields on eight routes and reverses to the Train G head", () => {
  assert.deepEqual(Object.keys(TRAIN_I.configChanges).sort(), ["ayurveda-retreat", "lp-hospital-kerala", "lp-south-india", "lp-treatment-packages", "pain-management", "panchakarma", "treatment-packages", "weight-management"]);
  for (const slug of PRODUCTION_SLUGS) {
    const now = plain(productionCampaign(slug));
    const head = reverseTrainIConfig(slug, plain(now));
    assert.equal(JSON.stringify(reverseTrainIConfig(slug, plain(head))), JSON.stringify(head), `${slug}: head passes through`);
    if (!TRAIN_I.configChanges[slug]) assert.equal(JSON.stringify(head), JSON.stringify(now), slug);
    else assert.notEqual(JSON.stringify(head), JSON.stringify(now), slug);
  }
});

// ── 28: one quotation explanation per page ───────────────────────────────────────────────────────────────────────────
const SUPPORT = "Your initial consultation is free. Ask for a quotation covering treatment and any later services.";
const QUOTE = /\bquot/i;
const QUOTATION_ROWS = {
  "treatment-packages": "AHV-WB.004.quotation-box",
  panchakarma: "AHV-WB.030.quotation-box",
  "ayurveda-retreat": "AHV-WB.149.quotation-box",
  "weight-management": "AHV-WB.288.quotation-box",
  "lp-south-india": "AHV-WB.310.quotation-box",
  "lp-hospital-kerala": "AHV-WB.334.quotation-box",
  "lp-treatment-packages": "AHV-WB.465.quotation-box",
};
// Not explanations and not in the steps/stay/FAQ scope of decision 28: who the page is for, left as approved.
const AUDIENCE = {
  "lp-hospital-kerala": ["page.lead.points.3"],
  "lp-treatment-packages": ["hero.standfirst", "page.lead.points.3"],
};
function strings(value, at = [], out = []) {
  if (typeof value === "string") out.push({ at: at.join("."), s: value });
  else if (Array.isArray(value)) value.forEach((v, i) => strings(v, [...at, i], out));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) strings(v, [...at, k], out);
  return out;
}

test("28 quotation-box: the quotation is explained once, in the stay box; elsewhere only the owner's support line", () => {
  for (const [slug, row] of Object.entries(QUOTATION_ROWS)) {
    const c = plain(productionCampaign(slug));
    assert.ok(TRAIN_I.configChanges[slug].every((x) => x.row === row), slug);
    assert.equal(c.cta.primarySupport, SUPPORT, `${slug}: owner's support line unchanged`);
    const { stay, ...page } = c.page;
    const outside = strings({ hero: c.hero, page, admission: c.admission, faq: c.faq })
      .filter(({ s }) => QUOTE.test(s)).map(({ at }) => at).filter((at) => !(AUDIENCE[slug] ?? []).includes(at));
    assert.deepEqual(outside, [], `${slug}: quotation wording outside the stay box`);
    assert.ok(strings(stay).some(({ s }) => QUOTE.test(s)), `${slug}: the one quotation explanation remains (stay box)`);
    for (const f of c.faq) assert.doesNotMatch(f.q, QUOTE, `${slug}: ${f.q}`);
    // before Train I each page restated the quotation outside its box
    const head = reverseTrainIConfig(slug, plain(c));
    const { stay: _s, ...headPage } = head.page;
    assert.ok(strings({ page: headPage, faq: head.faq }).some(({ s }) => QUOTE.test(s)), `${slug}: had restatements`);
    // FAQ count kept; answers still in the 25-70 word range; no lint error
    assert.equal(c.faq.length, head.faq.length, `${slug}: no FAQ removed`);
    assert.deepEqual(lintCampaign(productionCampaign(slug), new Date("2026-10-15T00:00:00Z")).errors, [], slug);
  }
});

test("28 quotation-box: every fact the reworded lines carried is still on the page", () => {
  const has = (slug, re) => assert.match(JSON.stringify(productionCampaign(slug)), re, `${slug}: ${re}`);
  has("treatment-packages", /Review what is included, what is charged separately and any programme-specific minimum stay/);
  has("treatment-packages", /The cost depends on the programme, duration, dates, villa category and occupancy/);
  has("treatment-packages", /group or private sessions are included in your stay/);
  has("treatment-packages", /doctor reviews and any later services included in your stay, along with separately charged items/);
  has("panchakarma", /The cost of your stay depends on your programme, duration, dates and villa occupancy/);
  has("panchakarma", /Ask for your treatment itinerary and a personalised quotation/);
  has("ayurveda-retreat", /Confirm occupancy, meals, programme dates and companion charges/);
  has("ayurveda-retreat", /number of nights, villa occupancy and the care included for your dates/);
  has("ayurveda-retreat", /what your programme, accommodation and any later services include/);
  has("weight-management", /minimum admission of 14 nights/);
  has("weight-management", /confirm the programme and dates before making travel arrangements/);
  has("weight-management", /programme, accommodation, care and any later services/);
  has("lp-south-india", /Confirm your programme, villa occupancy, inclusions and booking terms\./);
  has("lp-south-india", /Review the booking terms before making a payment/);
  has("lp-hospital-kerala", /Then review your programme, accommodation and included care, with any extra charges set out/);
  has("lp-hospital-kerala", /any companion charges before booking/);
  has("lp-treatment-packages", /brings the programme and accommodation together for your dates, duration and occupancy/);
  has("lp-treatment-packages", /Compare like with like: the same duration, dates and occupancy/);
  has("lp-treatment-packages", /Ask for a written quotation for your proposed programme/);
  // South India Cities (decision 24, "Keep all 3") is not touched
  assert.equal(TRAIN_I.files["campaign-v2/production/pages/south-india-cities.ts"], undefined);
});

// ── 29: Abhyangam wording ────────────────────────────────────────────────────────────────────────────────────────────
test("29 AHV-WB.054.change / AHV-LATER-016.01: the pain page says 'Abhyangam, a full-body medicated oil therapy'; DE and weight pages already match", () => {
  const pain = pageText(productionCampaign("pain-management")).map(({ text }) => text);
  assert.deepEqual(pain.filter((t) => t.includes("Abhyangam")), ["Discuss therapies such as Abhyangam, a full-body medicated oil therapy; Kizhi, a herbal treatment; Pizhichil, a warm oil treatment; Kati Basti, herbal oil pooling; or Nasya, nasal administration. Your doctor explains which procedures suit you and what each session involves."]);
  for (const slug of ["pain-management", "lp-pain-management", "weight-management", "lp-weight-management", "lp-behandlung-kerala"]) {
    assert.doesNotMatch(JSON.stringify(productionCampaign(slug)), /massage|Massage/, `${slug}: no massage wording`);
  }
  // German: the approved D06 term (AHV-WB.507.change) is already in place; Train I adds nothing there.
  assert.match(JSON.stringify(productionCampaign("lp-behandlung-kerala")), /Abhyanga ist eine Ganzkörperanwendung mit medizinischen Kräuterölen\./);
  assert.match(JSON.stringify(productionCampaign("lp-weight-management")), /oil-based or cleansing therapies where indicated/);
  for (const p of Object.keys(TRAIN_I.files)) assert.doesNotMatch(p, /lp-behandlung-kerala|lp-weight-management|ui\.ts$/);
});

// ── 30: consent notice layout ────────────────────────────────────────────────────────────────────────────────────────
test("30 AHV-M024.01: only a layout helper is added to the bridge; consent text, choices, storage and policy are unchanged", () => {
  for (const f of ["public/consent/copy.mjs", "public/consent/policy.mjs", "public/consent/regions.mjs"]) {
    assert.equal(TRAIN_I.files[f], undefined, f);
    assert.equal(sha(read(f)), sha(execFileSync("git", ["show", `${BASE}:sites/ayurvedichealingvillage.com/${f}`], { cwd: SITE, encoding: "utf8" })), `${f} unchanged`);
  }
  const [delta] = TRAIN_I.files["public/consent/bridge.mjs"].replacements;
  assert.ok(delta.after.startsWith(delta.before.replace(/\n}\n$/, "")), "the notice markup is built exactly as before");
  const added = delta.after.slice(delta.before.length - 2).split("\n").filter((l) => !l.startsWith("//")).join("\n"); // code only
  assert.doesNotMatch(added, /\bCC\.|localStorage|sessionStorage|storage|cookie|acceptCategory|showPreferences|AHV_SET_CONSENT|gtag|dataLayer|textContent|innerHTML/);
  const css = TRAIN_I.files["public/consent/ahv.css"].replacements[0];
  assert.ok(css.after.startsWith(css.before), "ahv.css only gains rules");
  assert.doesNotMatch(css.after.slice(css.before.length), /\.ahv-consent-compact[^-]|#cc-main|display:\s*none|visibility|opacity/);
});

test("30 AHV-M024.01: the helper publishes the covered height while the notice shows and clears it when hidden or removed", () => {
  const src = read("public/consent/bridge.mjs");
  const fn = src.slice(src.indexOf("function reserveCompactNoticeSpace(notice){"), src.indexOf("\n}\n", src.indexOf("function reserveCompactNoticeSpace(notice){")) + 3);
  const props = new Map(), attrs = new Set(), observers = [], listeners = [];
  const root = { style: { setProperty: (k, v) => props.set(k, v), removeProperty: (k) => props.delete(k) }, setAttribute: (k) => attrs.add(k), removeAttribute: (k) => attrs.delete(k) };
  const notice = { isConnected: true, hidden: false, top: 561, getBoundingClientRect() { return { top: this.top, height: 844 - 12 - this.top }; } };
  const ctx = vm.createContext({
    document: { documentElement: root, body: {} }, innerHeight: 844,
    ResizeObserver: class { constructor(cb) { this.cb = cb; observers.push(this); } observe() {} disconnect() { this.off = true; } },
    MutationObserver: class { constructor(cb) { this.cb = cb; observers.push(this); } observe() {} disconnect() { this.off = true; } },
    addEventListener: (t, f) => listeners.push([t, f]), removeEventListener: (t, f) => { const i = listeners.findIndex((x) => x[1] === f); if (i > -1) listeners.splice(i, 1); },
  });
  vm.runInContext(`${fn}\nthis.reserve = reserveCompactNoticeSpace;`, ctx);
  ctx.reserve(notice);
  assert.equal(props.get("--ahv-consent-compact-clear"), "291px"); // 844 - 561 + 8
  assert.ok(attrs.has("data-ahv-consent-compact"));
  notice.hidden = true; observers[1].cb();
  assert.equal(props.has("--ahv-consent-compact-clear"), false); assert.equal(attrs.has("data-ahv-consent-compact"), false);
  notice.hidden = false; notice.top = 700; listeners.find(([t]) => t === "resize")[1]();
  assert.equal(props.get("--ahv-consent-compact-clear"), "152px");
  notice.isConnected = false; observers[1].cb();
  assert.equal(props.size, 0); assert.equal(attrs.size, 0);
  assert.ok(observers.every((o) => o.off), "observers disconnect once the notice is removed");
  assert.equal(listeners.length, 0);
  const css = read("public/consent/ahv.css");
  assert.match(css, /:root\[data-ahv-consent-compact\] \{ scroll-padding-bottom:var\(--ahv-consent-compact-clear, 0px\); \}/);
  assert.match(css, /:root\[data-ahv-consent-compact\] body::after \{ content:"";display:block;height:max\(var\(--ahv-consent-compact-clear, 0px\), var\(--ahv-page-clear, 0px\)\); \}/);
});

// ── 32: /why-get-training-in-yoga/ ───────────────────────────────────────────────────────────────────────────────────
const LINE = "View the three yoga programmes and personalised yoga option.";
test("32 AHV-M067.01: /why-get-training-in-yoga/ points at the current yoga programmes with approved, translated copy", () => {
  const ctx = vm.createContext({ window: {}, URL, URLSearchParams, location: { search: "" } });
  vm.runInContext(read("public/ahv/assets/reader25a-family-data.js"), ctx);
  const R = ctx.window.AHV_READER25A_FAMILY.routes.find((r) => r.path === "/why-get-training-in-yoga/");
  const article = JSON.parse(JSON.stringify(R.components.find((c) => c.component === "article") ?? R.components[2]));
  const text = JSON.stringify(article.blocks.map((x) => [x.text, x.tree])); // rendered copy only, not provenance notes
  assert.doesNotMatch(text, /workshop|intensive course/i);
  assert.equal(article.blocks.length, 2);
  assert.match(article.blocks[0].text, /^Yoga is such a discipline/);
  const b = article.blocks[1];
  assert.equal(b.text, LINE);
  assert.deepEqual(b.tree, [{ k: "e", tag: "a", attrs: { href: "/yoga-meditation-programs/" }, c: [{ k: "t", v: LINE }] }]);
  assert.deepEqual(untranslated(LINE), [], "12 accepted translations");
  finalLocalized("/yoga-meditation-programs/");
  // the same approved line and destination the teacher-training page already uses
  assert.match(read("public/ahv/views/ahv-page-new-to-yoga-teacher-training-desktop.json"), /View the three yoga programmes and personalised yoga option\.<\/p><a class=\\"catalogue-action\\" href=\\"\/yoga-meditation-programs\/\\"/);
  // the contextual resources are unchanged
  assert.deepEqual(JSON.parse(JSON.stringify(R.components.find((c) => c.component === "contextual-resources").blocks[1].items.map((i) => i.tree[0].attrs.href))), ["/yoga-classes-theory/", "/yoga-classes-practical/", "/yoga-meditation-training/"]);
  const snap = read("english-candidate/prerender/why-get-training-in-yoga.html");
  assert.doesNotMatch(snap, /workshop/i);
  assert.match(snap, /<a href="\/yoga-meditation-programs\/" data-source-href="\/yoga-meditation-programs\/"[^>]*>View the three yoga programmes and personalised yoga option\.<\/a>/);
});

// ── 33: small items ──────────────────────────────────────────────────────────────────────────────────────────────────
test("33 AHV-LATER-043.01: hero fine print is 14px on phones and D phones show the card's line; desktop untouched", () => {
  const css = read("campaign-v2/production/production.css");
  const phone = css.slice(css.indexOf("@media (max-width: 767px) {\n  /* AHV-LATER-043.01"));
  assert.match(phone.slice(0, 400), /\.lp-prod \.lp-hero__note \{ font-size: 14px; \}/);
  assert.doesNotMatch(css, /\.lp-hero__note \{ font-size: 13px; \}/);
  assert.match(css, /\.lp-prod \.lp-hero__note \{ font-size: 14px; line-height: 1\.5; max-width: 470px; color: var\(--lp-muted\); \}/, "desktop 14px unchanged");
  const d = css.indexOf('.lp-prod[data-variant="D"] .lp-consult--card .lp-consult__sub { display: block; }');
  assert.ok(d > -1);
  assert.ok(css.lastIndexOf("@media (max-width: 767px) {", d) > css.lastIndexOf("}\n@media", d) - 1, "D rule sits in a phone media block");
  assert.equal(read("campaign-v2/production/document.css"), productionCss(), "generated bundle rebuilt from its sources");
});

test("33 AHV-I04.M085.links: the Katha 2019 page links the current programme hubs; the corporate sidebar is retired", () => {
  const ctx = vm.createContext({ window: { AHV_COLLECTION_RENDER: { sourceBlocks: () => null } }, URL, URLSearchParams, location: { search: "" }, React: { createElement: () => ({}) } });
  vm.runInContext(read("public/ahv/assets/hist9-family-data.js"), ctx);
  vm.runInContext(read("public/ahv/assets/hist9-family-render.js"), ctx);
  const R = ctx.window.AHV_HIST9_FAMILY.routes.find((r) => r.path === "/katha-wellness-retreat-2019/");
  const links = JSON.parse(JSON.stringify(R.relatedLinks.map((l) => [l.label, new URL(l.href).pathname])));
  assert.deepEqual(links, [["Yoga programmes", "/yoga-meditation-programs/"], ["Ayurvedic treatment programmes", "/ayurvedic-treatments/"], ["All programmes", "/all-programs/"]]);
  assert.equal(R.retiredRelatedLinks.links.length, 19);
  for (const [label, p] of links) { finalLocalized(p); assert.deepEqual(untranslated(label), [], label); }
  const groups = JSON.parse(JSON.stringify(ctx.window.AHV_HIST9_RENDER.histVals(R, {}).relatedGroups.map((g) => g.label)));
  assert.deepEqual(groups, ["Explore current programmes"]);
  assert.deepEqual(untranslated("Explore current programmes"), []);
  // no other hist9 route's groups move
  for (const r of ctx.window.AHV_HIST9_FAMILY.routes) if (r.path !== R.path) for (const l of r.relatedLinks) assert.doesNotMatch(new URL(l.href).pathname, /^\/(yoga-meditation-programs|ayurvedic-treatments|all-programs)\/$/, r.path);
  const snap = read("english-candidate/prerender/katha-wellness-retreat-2019.html");
  const nav = snap.slice(snap.indexOf('class="ahv-related-resources"'), snap.indexOf("</nav>", snap.indexOf('class="ahv-related-resources"')));
  assert.equal((nav.match(/<li /g) || []).length, 3);
  assert.doesNotMatch(nav, /kairali-hospitality|product-range|franchise|accreditations/);
});

test("33 AHV-LATER-038.01: Tripadvisor 4.6 / 450 carry the 29 August 2026 capture date", () => {
  assert.equal(TRIPADVISOR.rating, 4.6);
  assert.equal(TRIPADVISOR.reviewCount, 450);
  assert.equal(TRIPADVISOR.asOf, "2026-08-29");
  assert.equal(dateLabel(TRIPADVISOR.asOf), "29 August 2026");
  assert.equal(dateLabel("2026-08"), "August 2026");
  assert.equal(monthLabel(TRIPADVISOR.asOf), "August 2026");
  assert.equal(reverseTrainIRatings(TRIPADVISOR).asOf, "2026-08");
  const src = read("campaign-v2/sections/ProofStrip.tsx");
  assert.match(src, /const TA_AS_OF = `Tripadvisor, as of \$\{dateLabel\(TRIPADVISOR\.asOf\)\}`;/);
  assert.match(src, /day: "numeric"/);
  assert.match(read("campaign-v2/data/ratings.ts"), /NOTES\.md:144-160/);
  // staleness now counts from the capture day
  assert.deepEqual(lintData(new Date("2026-12-26T00:00:00Z")), []);
  assert.deepEqual(lintData(new Date("2026-12-28T00:00:00Z")).map((i) => i.rule), ["data.stale"]);
});

test("33 AHV-N08.yoga-and-meditation-package.description: the served description is the page's own approved, translated line", () => {
  const DESC = "Explore guided yoga and meditation alongside Ayurveda at Kairali in Kerala, with sessions led by experienced instructors.";
  const m = json("english-candidate/route-manifest.json").routes.find((r) => r.path === "/yoga-and-meditation-package/").metadata;
  assert.equal(m.description, DESC);
  assert.equal(m.ogDescription, DESC);
  assert.doesNotMatch(read("english-candidate/route-manifest.json"), /can be availed by becoming a member here/);
  for (const v of ["desktop", "mobile"]) assert.match(read(`public/ahv/views/ahv-page-yoga-and-meditation-package-${v}.json`), new RegExp(`<meta name=\\\\"description\\\\" content=\\\\"${DESC.replace(/\./g, "\\.")}\\\\">`));
  assert.deepEqual(untranslated(DESC), [], "12 accepted translations");
  assert.equal(m.title, "Yoga and Meditation Package | Kairali Healing Village", "title unchanged");
});
