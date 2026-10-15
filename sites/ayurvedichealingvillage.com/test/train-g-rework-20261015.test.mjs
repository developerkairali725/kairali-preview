// Train G rework (15 Oct 2026): the 14 rows an adversarial reviewer returned from Train E, each fixed exactly as the
// rejection says. The three AHV-N08.documents.* rows were rejected in the independent Train G review (the hub title,
// heading and description stay English for every locale, and the locale entry routes are not registered) and reverted
// with their two tests. Source only: no build, browser, network, form submission or lead. The reversal of the one production
// config change lives in fixtures/train-g-rework-20261015.mjs; AHV-I04.M066.links is in reader25a-contextual-resources.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { unitId } from "../tools/l10n/lib.mjs";
import { LOCALES } from "../tools/l10n/locales.mjs";
import { removeCampaignPriceNotes } from "../app/(english)/_families/campaign-price-notes.mjs";
import { applyReviewSnapshot, reviewCopyFor } from "../app/(english)/_families/content-review.mjs";
import { keepsLocaleCanonical, LOCALE_SELF_CANONICAL_PATHS, restoreReviewedHead } from "../app/(english)/_families/localized-title.mjs";
// Train G integration (15 Oct 2026): Train H's per-language table (AHV-WB.525) carries this row's Russian example under
// Train H's name; Train H's German example is reversed first (fixtures/train-gh-integration-20261015.mjs).
import { campaignEnquiryForm, CAMPAIGN_ENQUIRY_PHONE_PLACEHOLDER as CAMPAIGN_PHONE_PLACEHOLDER, LIVE_PHONE_PATTERN } from "../campaign-v2/forms/schema.ts";
import { reverseTrainHPhoneExample, reversePhoneTable } from "./fixtures/train-gh-integration-20261015.mjs";
import { UI } from "../campaign-v2/production/ui.ts";
import { reverseTrainGConfig, TRAIN_G_REWORK } from "./fixtures/train-g-rework-20261015.mjs";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(read(p));
const view = (id) => json(`public/ahv/views/${id}.json`);
const LOCS = Object.keys(LOCALES);
const ORIGIN = "https://ayurvedichealingvillage.com";

// The accepted catalogue the l10n build reads (tools/l10n/build.mjs catalog()): prefill, current translated outputs,
// coordinator overrides, then the shipped supplements. Used to prove every reused English string has 12 translations.
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
const translatedEverywhere = (source) => LOCS.filter((loc) => typeof catalog(loc).get(unitId(source)) !== "string" || !catalog(loc).get(unitId(source)).trim());

// ── AHV-M028.01: no campaign prices on the 12 localized /ayurvedic-treatment-packages.html routes ─────────────────────
const TP = "/ayurvedic-treatment-packages.html";
const META = "Physician-led Ayurvedic treatment packages at Kairali – The Ayurvedic Healing Village, Kerala: personalised therapies, yoga, meditation and sattvic meals.";
test("AHV-M028.01: the long-form view the locales serve presents no price, tariff, currency switch or rate download", () => {
  for (const v of ["desktop", "mobile"]) {
    const t = view(`ahv-page-ayurvedic-treatment-packages-${v}`).template;
    for (const banned of [/₹/, /Rs\.\s?\d/, /€\s?\d/, /\$\s?\d/, /Tariff/, /Download Rates/, /Package Starts From/, /\{\{\s*v\.(?:single|double|pick\w+)\s*\}\}/, /aria-label="Currency"/, /\/documents\/#ayurveda/, /ayurveda-programmes-tariff/]) {
      assert.doesNotMatch(t, banned, `${v}: ${banned}`);
    }
    // the kept content: hero lead (the route's own approved description), programme list, villas, enquiry, offer box
    const body = t.slice(t.indexOf("</helmet>"));
    assert.equal(body.split(META).length - 1, 1, `${v}: hero lead is the approved route description`);
    assert.match(t, /Weight Loss Programme/);
    assert.match(t, /<sc-for list="\{\{ villas \}\}" as="v"/);
    assert.match(t, /\{\{ v\.desc \}\}/);
    assert.match(t, /href="#Enquirenow"/);
    assert.equal(t.split("data-ahv-campaign-price-note=\"\"").length - 1, 1, `${v}: the one shared intro/rates paragraph is marked`);
  }
  assert.equal(json("english-candidate/route-manifest.json").routes.find((r) => r.path === TP).metadata.description, META);
  assert.deepEqual(translatedEverywhere(META), [], "the reused hero lead has an accepted translation in every locale");
  // nothing in the shipped review copy for this route names a price (the locale payload embeds it)
  assert.doesNotMatch(JSON.stringify(reviewCopyFor(TP, "en")), /₹|Rs\.\s?\d|rates mentioned/);
});

test("AHV-M028.01: the orphaned 'rates mentioned' note is cut in the live template and the server snapshot, in any language", () => {
  const live = '<p data-ahv-campaign-price-note="" style="margin:0">Kairali - The Ayurvedic Healing Village, with its expert professionals, provides authentic Ayurvedic treatment.<br>The rates mentioned are for per-night accommodation tariff.</p><p>Other<br>kept</p>';
  assert.equal(removeCampaignPriceNotes(live, TP), '<p data-ahv-campaign-price-note="" style="margin:0">Kairali - The Ayurvedic Healing Village, with its expert professionals, provides authentic Ayurvedic treatment.</p><p>Other<br>kept</p>');
  const de = '<p data-dc-tpl="261" data-ahv-campaign-price-note="" style="margin: 0px;">Kairali bietet authentische Ayurveda-Behandlungen.<br data-dc-tpl="262">Die angegebenen Preise sind Übernachtungstarife pro Nacht.</p>';
  assert.equal(removeCampaignPriceNotes(de, TP), '<p data-dc-tpl="261" data-ahv-campaign-price-note="" style="margin: 0px;">Kairali bietet authentische Ayurveda-Behandlungen.</p>');
  assert.equal(removeCampaignPriceNotes(removeCampaignPriceNotes(de, TP), TP), removeCampaignPriceNotes(de, TP), "idempotent");
  assert.equal(removeCampaignPriceNotes(live, "/offers/"), live, "no other route is touched");
  assert.equal(applyReviewSnapshot(de, TP, "de").includes("Übernachtungstarife"), false, "server snapshot path applies it");
  // self-contained (boot.ts injects its source text) and injected after the home-villa rate removal
  vm.runInNewContext("(" + removeCampaignPriceNotes.toString() + ")");
  const boot = read("app/(english)/_families/boot.ts");
  assert.match(boot, /view\.template = \(\$\{removeHomeVillaRates\.toString\(\)\}\)\(view\.template, cfg\.path\);\n      view\.template = \(\$\{removeCampaignPriceNotes\.toString\(\)\}\)\(view\.template, cfg\.path\);/);
});

// ── AHV-M043.01 / .02: /offers/ gift vouchers carry the accepted Coming Soon copy and status ─────────────────────────
const COMING = "A thoughtful way to support the health of family and friends. We’re preparing gift vouchers for health assessments and appropriate treatment at AHV. Treatment will depend on the recipient’s assessment and individual needs. Gift vouchers are not yet available to purchase. Details will be shared when the offering launches.";
test("AHV-M043.01/.02: the offers hub voucher section states Coming Soon in its heading block and body, in every view and locale", () => {
  // the body is exactly the accepted /gift-vouchers/ Coming Soon paragraph
  const gv = read("public/ahv/assets/exception-five-family-data.js");
  assert.ok(gv.includes(JSON.stringify(COMING)), "same text as the accepted /gift-vouchers/ page");
  for (const [v, pre] of [["desktop", ""], ["mobile", "m-"]]) {
    const t = view(`ahv-template-offers-deals-and-gift-vouchers-${v}`).template;
    const start = t.indexOf(`<section aria-labelledby="${pre}gift-vouchers ${pre}gift-vouchers-status"`);
    assert.ok(start > 0, `${v}: the section is named by its heading and its status`);
    const section = t.slice(start, t.indexOf("</section>", start));
    assert.match(section, new RegExp(`<h2 id="${pre}gift-vouchers"[^>]*>Gift vouchers</h2>\\n    <p id="${pre}gift-vouchers-status"[^>]*>Coming Soon</p>`));
    assert.equal(section.split(COMING).length - 1, 1, `${v}: accepted Coming Soon body`);
    assert.doesNotMatch(section, /these vouchers provide|customized voucher options|exclusive discounts|Share the gift of wellness/);
    assert.match(section, /mailto:info@kairali\.com/);
    assert.match(section, /tel:\+91 9555 156 156/);
  }
  for (const s of [COMING, "Coming Soon", "Gift vouchers"]) assert.deepEqual(translatedEverywhere(s), [], `${s.slice(0, 30)}: 12 accepted translations`);
  assert.doesNotMatch(JSON.stringify(reviewCopyFor("/offers/", "en")), /Gift Vouchers\. Ideal for|customized voucher options/);
  const snap = read("english-candidate/prerender/offers.html");
  assert.ok(snap.includes(COMING) && snap.includes('id="m-gift-vouchers-status"') && !snap.includes("customized voucher options"), "English snapshot matches");
});

// ── AHV-I01.nav1 / nav2: Air India in-page anchors clear the sticky header on the first native jump ──────────────────
const AIR = ["v3-about", "v3-features", "v3-programs", "v3-routine", "v3-contact"];
test("AHV-I01.nav1/nav2: every Air India section-nav target carries the #v3-form 100px scroll margin in every served source", () => {
  const css = read("campaign-v110/components/dc/dc-staging.css");
  assert.match(css, /\.air-membership #v3-form \{scroll-margin-top:100px\}/, "the reference value");
  const sources = {
    "views/air-india-desktop": view("ahv-page-campaign-retreat--air-india-desktop").template,
    "views/air-india-mobile": view("ahv-page-campaign-retreat--air-india-mobile").template,
    "views/campaign-retreat-desktop": view("ahv-page-campaign-retreat-desktop").template,
    "views/campaign-retreat-mobile": view("ahv-page-campaign-retreat-mobile").template,
    "english prerender": read("english-candidate/prerender/kairali-air-india-maharaja-club.html.html"),
    "staging": read("campaign-v110/pages/kairali-air-india-maharaja-club.html/staging.html"),
  };
  for (const [name, t] of Object.entries(sources)) for (const id of AIR) {
    const tag = t.match(new RegExp(`<section(?=[^>]*\\bid="${id}")[^>]*>`));
    assert.ok(tag, `${name} #${id}`);
    const m = tag[0].match(/scroll-margin-top:\s?(\d+)px/);
    // WebKit's native jump on a fresh page lands at exactly this margin (the reviewer measured 20 / 16 under 73 / 64px
    // headers); 100 clears the tallest sticky header (73px at 1440) on the very first activation.
    assert.equal(m && Number(m[1]), 100, `${name} #${id}`);
  }
  // the nav items point at these targets, and the form keeps its own rule
  const live = sources["english prerender"];
  for (const id of AIR.slice(0, 2)) assert.match(live, new RegExp(`href="[^"]*#${id}"`), `nav item ${id}`);
});

// ── AHV-M044.01: the focused skip link is never under the sticky header ──────────────────────────────────────────────
test("AHV-M044.01: the focused skip link joins the flow above the sticky header", () => {
  const css = read("campaign-v110/pages/globals.css");
  const focus = css.match(/\.skip-link:focus \{([^}]*)\}/)[1];
  assert.match(focus, /position: static;/);
  assert.match(focus, /display: block;/);
  assert.match(css, /\.skip-link \{\n  position: absolute;\n  left: 12px;\n  top: -200px;/, "unfocused it stays off-screen as before");
  const shell = read("campaign-v110/components/PageShell.tsx");
  assert.ok(shell.indexOf('className="skip-link"') < shell.indexOf("<SiteHeader"), "it precedes the header, so in flow the header starts below it");
});

// ── AHV-M030.01: localized Air India canonical stays self-referencing after hydration ────────────────────────────────
const AIRPATH = "/kairali-air-india-maharaja-club.html";
test("AHV-M030.01: the boot head guard restores each locale's own Air India canonical over the dataset's English one", () => {
  for (const loc of LOCS) assert.equal(keepsLocaleCanonical(AIRPATH, loc), true, loc);
  assert.equal(keepsLocaleCanonical(AIRPATH, "en"), false);
  assert.equal(keepsLocaleCanonical("/karkidaka-chikitsha-or-monsoon-wellness.html", "de"), true, "existing route kept");
  assert.equal(keepsLocaleCanonical("/offers/", "de"), false);
  assert.deepEqual([...LOCALE_SELF_CANONICAL_PATHS].sort(), ["/kairali-air-india-maharaja-club.html", "/karkidaka-chikitsha-or-monsoon-wellness.html"]);
  const dv = read("app/(english)/_families/design-view.tsx");
  assert.match(dv, /reviewedLocaleCanonical: \(reviewedLocaleTitle \|\| keepsLocaleCanonical\(route\.path, locale\)\) \? \(\(route\.path === "\/panchakarma\/" && locale === "en" \? serverCanonical\(route\) : canonicalUrl\(route\.path, locale\)\)/);
  const routes = json("l10n/routes.json").routes[AIRPATH];
  assert.equal(Object.keys(routes).length, 13);
  // the dataset writes the English canonical after mounting; the guard puts the locale's own back, once
  const english = json("english-candidate/route-manifest.json").routes.find((r) => r.path === AIRPATH).metadata.canonical;
  assert.equal(english, ORIGIN + AIRPATH);
  for (const loc of LOCS) {
    let href = english, writes = 0;
    const link = { getAttribute: () => href, setAttribute: (k, v) => { assert.equal(k, "href"); href = v; writes++; } };
    const doc = { head: { querySelector: (s) => { assert.equal(s, 'link[rel="canonical"]'); return link; } } };
    const run = vm.runInNewContext("(" + restoreReviewedHead.toString() + ")");
    assert.equal(run(doc, undefined, ORIGIN + routes[loc]), true);
    assert.equal(run(doc, undefined, ORIGIN + routes[loc]), false);
    assert.equal(href, ORIGIN + routes[loc], loc);
    assert.equal(writes, 1);
  }
});

// ── AHV-M008.02: the open phone menu ends above the compact consent notice ───────────────────────────────────────────
function placer(notice, innerHeight = 844) {
  const src = read("public/design/family-header.js");
  const body = src.slice(src.indexOf("  var CONSENT_GAP"), src.indexOf("  // the notice is appended to <body>"));
  const attrs = {};
  const panel = { hidden: false, style: {}, setAttribute: (k) => { attrs[k] = ""; }, removeAttribute: (k) => { delete attrs[k]; } };
  const openBtn = { closest: () => ({ getBoundingClientRect: () => ({ bottom: 64 }) }) };
  const document = { querySelector: (s) => { assert.equal(s, ".ahv-consent-compact"); return notice; } };
  const ctx = vm.createContext({ panel, openBtn, document, window: { innerHeight }, Math });
  vm.runInContext(body + "\nthis.place = place;", ctx);
  ctx.place();
  return { panel, attrs };
}
test("AHV-M008.02: with the compact consent notice showing, the open menu panel stops above it and scrolls there", () => {
  // the reviewer's 390px phone: notice 570–780, header bottom 64
  const shown = placer({ hidden: false, getBoundingClientRect: () => ({ top: 569.64, height: 210.36 }) });
  assert.equal(shown.panel.style.top, "64px");
  assert.equal(shown.panel.style.maxHeight, 569 - 8 - 64 + "px");
  assert.deepEqual(shown.attrs, {});
  // no notice (choice saved) or a hidden one: the panel keeps its full height, as before
  for (const notice of [null, { hidden: true, getBoundingClientRect: () => ({ top: 570, height: 210 }) }]) {
    const p = placer(notice);
    assert.equal(p.panel.style.maxHeight, "calc(100vh - 64px)");
    assert.deepEqual(p.attrs, {});
  }
  // a notice that leaves no usable room (short landscape phone): the panel is layered over it instead
  const tight = placer({ hidden: false, getBoundingClientRect: () => ({ top: 180, height: 160 }) }, 360);
  assert.equal(tight.panel.style.maxHeight, "calc(100vh - 64px)");
  assert.deepEqual(tight.attrs, { "data-ahv-fh-over-consent": "" });
  assert.match(read("public/design/family-header.css"), /\.ahv-fh-panel\[data-ahv-fh-over-consent\] \{ z-index:1000000; \}/);
  // consent behaviour and copy untouched: the header only reads the notice's position
  const fh = read("public/design/family-header.js");
  assert.doesNotMatch(fh, /acceptCategory|showPreferences|ahv-consent-compact[^"]*"\)\.(?:remove|hidden\s*=)/);
  assert.match(fh, /new MutationObserver\(function \(\) \{ if \(panel && !panel\.hidden\) place\(\); \}\)\.observe\(document\.body, \{ childList: true \}\)/);
});

// ── AHV-I04.M082.links: /food-sadhana/ and its alternates carry contextual links, not the corporate sidebar ──────────
test("AHV-I04.M082.links: /food-sadhana/ renders food, yoga and Ayurveda knowledge links; the corporate block is retired", () => {
  const ctx = vm.createContext({ window: {}, URL, URLSearchParams, location: { search: "" } });
  vm.runInContext(read("public/ahv/assets/hist9-family-data.js"), ctx);
  const R = ctx.window.AHV_HIST9_FAMILY.routes.find((r) => r.path === "/food-sadhana/");
  const links = JSON.parse(JSON.stringify(R.relatedLinks.map((l) => [l.label, new URL(l.href).pathname])));
  assert.deepEqual(links, [
    ["New to Ayurveda", "/new-to-ayurveda/"], ["New to Yoga", "/new-to-yoga/"],
    ["What is Ayurvedic Food?", "/what-is-ayurvedic-food/"], ["Ayurvedic Restaurant & Cooking at Healing Village", "/ayurvedic-resturant-and-cooking-at-healing-village/"],
  ]);
  assert.equal(R.retiredRelatedLinks.links.length, 19, "the captured source sidebar is retained for accounting only");
  const corporate = /kairali-hospitality|product-range|herbal-tea|books|franchise|equipment|vision-and-mission|accreditations|arogya-/;
  for (const [, p] of links) assert.doesNotMatch(p, corporate);
  const redirects = json("english-candidate/redirect-map.json").redirects;
  const routes = json("l10n/routes.json").routes;
  for (const [label, p] of links) {
    assert.equal(redirects[p], undefined, `${p} is final`);
    assert.equal(Object.keys(routes[p] || {}).length, 13, `${p} exists in every locale`);
    assert.deepEqual(translatedEverywhere(label), [], `${label}: accepted translations`);
  }
  const snap = read("english-candidate/prerender/food-sadhana.html");
  const nav = snap.slice(snap.indexOf('class="ahv-related-resources"'), snap.indexOf("</nav>", snap.indexOf('class="ahv-related-resources"')));
  assert.doesNotMatch(nav, corporate);
  assert.equal((nav.match(/<li /g) || []).length, 4);
});

// ── AHV-WB.548.phone-example: the Russian form's phone example is Russian ────────────────────────────────────────────
test("AHV-WB.548.phone-example: the RU campaign form shows the RU example its own error copy gives; field and lead unchanged", () => {
  const ru = campaignEnquiryForm("ru").steps[0].fields.find((f) => f.name === "phone");
  assert.equal(ru.placeholder, "+7 900 000 00 00");
  assert.ok(UI.ru.form.errors.phone.includes(ru.placeholder), "the same example the RU validation message gives");
  assert.match(ru.placeholder, new RegExp(`^${LIVE_PHONE_PATTERN}$`), "the example satisfies the field's own pattern");
  assert.equal(ru.required, false, "phone stays optional (owner decision 14 Oct)");
  for (const loc of ["en", "de"]) assert.equal(reverseTrainHPhoneExample(loc, campaignEnquiryForm(loc).steps[0].fields.find((f) => f.name === "phone").placeholder), "+91 …", loc);
  assert.deepEqual(reversePhoneTable(CAMPAIGN_PHONE_PLACEHOLDER, reverseTrainHPhoneExample), { en: "+91 …", de: "+91 …", ru: "+7 900 000 00 00" });
  const { pattern, maxLength, mapsTo, autocomplete } = ru;
  assert.deepEqual({ pattern, maxLength, mapsTo, autocomplete }, { pattern: LIVE_PHONE_PATTERN, maxLength: 30, mapsTo: "phone", autocomplete: "tel" });
  // the reversal fixture restores exactly this one value on exactly this route
  const c = { form: { schema: campaignEnquiryForm("ru") } };
  const back = reverseTrainGConfig(TRAIN_G_REWORK.phonePlaceholder.slug, JSON.parse(JSON.stringify(c)));
  assert.equal(back.form.schema.steps[0].fields[2].placeholder, "+91 …");
});
