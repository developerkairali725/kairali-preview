// Train H (15 Oct 2026): twelve tracker rows on the Train F head dae94e21c (fixtures/train-h-20261015.json/.mjs).
//   AHV-M001.01 RTL skip link on the Ayurvedic-treatments hub · AHV-M023.02 yoga hub Coming Soon cards · AHV-I04.M067/M068/
//   M069.links contextual resources rendered as content · AHV-WB.525 German phone example · AHV-WB.335 hospital LP hero ·
//   AHV-STAFF18 localized treatment-packages redirects · AHV-WB.114/.137 programme-card photographs · AHV-WB.124 Karkidaka
//   stay lengths · AHV-M021.01 direct training-tariff PDF.
// Source and server-render checks only: no build, no browser, no network, no form submission.
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { PHOTO_PICKS_20261015H, ROUTES } from "../campaign-v2/production/bindings.ts";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { IMAGES } from "../campaign-v2/data/images.ts";
import { CAMPAIGN_ENQUIRY_PHONE_PLACEHOLDER, LENGTHS, MONSOON_LENGTHS, campaignEnquiryForm, stayLengths } from "../campaign-v2/forms/schema.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import { uiFor } from "../campaign-v2/production/ui.ts";
import { TRAIN_H, reverseTrainHBindings, reverseTrainHConfig, reverseTrainHSource } from "./fixtures/train-h-20261015.mjs";
// Train G integration (15 Oct 2026): the Train G rework's exact delta on the shared files, and its Russian phone example
// (AHV-WB.548), are reversed first so the Train H checks below run on exactly Train H's state.
import { reverseTrainGHIntegrationSource, reverseTrainGReworkPhoneExample, reversePhoneTable } from "./fixtures/train-gh-integration-20261015.mjs";
// Train J3 (15 Oct 2026): its card photographs and copy edits (AHV-WB.298/454 and others) are reversed exactly first.
import { reverseTrainJ3Binding, reverseTrainJ3Config } from "./fixtures/train-j3-20261015.mjs";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(SITE, "package.json"));
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");
const json = (p) => JSON.parse(read(p));
const sha256 = (b) => crypto.createHash("sha256").update(b).digest("hex");
const LOCALES = ["hi", "de", "fr", "es", "it", "pt", "nl", "ru", "ar", "zh-Hans", "ja", "ko"];
const L10N = json("l10n/routes.json");
const REDIRECTS = json("english-candidate/redirect-map.json").redirects;
const SERVED = new Set(json("english-candidate/routes.json").routes.map((r) => r.path));
const clone = (v) => JSON.parse(JSON.stringify(v));

/** A .tsx/.ts module and its relative imports, transpiled and run (the package-facts / programme-links loader). */
function loadModule(file) {
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const mod = { exports: {} };
    cache.set(filename, mod);
    const js = ts.transpileModule(fs.readFileSync(filename, "utf8"), { fileName: filename, compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    } }).outputText;
    const req = (name) => {
      if (!name.startsWith(".")) return require(name);
      const base = path.resolve(path.dirname(filename), name);
      const hit = [base, base + ".tsx", base + ".ts"].find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
      assert.ok(hit, `resolve ${name} from ${filename}`);
      return load(hit);
    };
    vm.runInNewContext(js, { module: mod, exports: mod.exports, require: req, URL, process }, { filename });
    return mod.exports;
  }
  return load(path.join(SITE, file));
}

// ── the recorded delta ───────────────────────────────────────────────────────────────────────────────────────────────

test("the recorded Train H delta reverses exactly to the Train F head, file by file", () => {
  assert.equal(TRAIN_H.base, "dae94e21cac638a57f715a9081b3583dc680b338");
  for (const [p, e] of Object.entries(TRAIN_H.files)) {
    const now = reverseTrainGHIntegrationSource(p, read(p));
    assert.equal(sha256(now), e.afterSHA256, `${p}: current bytes are Train H's`);
    assert.equal(sha256(reverseTrainHSource(p, now)), e.beforeSHA256, p);
    let base = null;
    try { base = execFileSync("git", ["show", `${TRAIN_H.base}:sites/ayurvedichealingvillage.com/${p}`], { cwd: SITE, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 26 }); } catch {}
    if (base !== null) assert.equal(sha256(base), e.beforeSHA256, `${p}: beforeSHA256 is the Train F head`);
  }
  // Untouched routes' bindings and configs are exactly as before; the three picked routes reverse to Train F.
  const before = reverseTrainHBindings(clone(ROUTES));
  for (const slug of PRODUCTION_SLUGS) {
    if (!TRAIN_H.photoPicks[slug]) assert.deepEqual(before[slug], reverseTrainJ3Binding(slug, clone(ROUTES[slug])), slug);
    const c = reverseTrainHConfig(slug, reverseTrainJ3Config(slug, clone(productionCampaign(slug))));
    if (TRAIN_H.photoPicks[slug]?.after) for (const v of ["A", "B", "C", "D"]) assert.equal(c.hero.image[v].id, "wx-hero", slug);
    if (c.page.offering.kind === "cards") assert.ok(c.page.offering.cards.every((card) => !("image" in card)), slug);
  }
});

// ── AHV-M001.01 ──────────────────────────────────────────────────────────────────────────────────────────────────────

test("AHV-M001.01: the Ayurvedic-treatments hub gets the finder hubs' RTL-safe skip link (no -9999px overflow under dir=rtl)", () => {
  const view = read("app/(english)/_families/design-view.tsx");
  const m = view.match(/\{(\[[^\]]+\])\.includes\(route\.path\) \? <style data-ahv-finder-skip-link=""/);
  assert.ok(m, "skip-link style block");
  assert.deepEqual(JSON.parse(m[1]), ["/ayurvedic-treatments/", "/all-programs/", "/wellness-programs/", "/yoga-meditation-programs/"]);
  // The cause: the hub's own skip link sits at left:-9999px, which in an RTL document widens the scroll area. As on the
  // three finder hubs the rule already covers, it is the first element with a pseudo-class style, so the runtime
  // (public/ahv/support.js, "scp" + counter) names its class scp0 on both views.
  const firstPseudo = (slug, side) => {
    const t = json(`public/ahv/views/ahv-page-${slug}-${side}.json`).template.replace(/<helmet>[\s\S]*?<\/helmet>/, "");
    const m = t.match(/<(\w+)\b[^<>]*\bstyle-(?:focus|hover|active|before|after|focus-visible|focus-within)="/);
    return m && m[0];
  };
  for (const side of ["desktop", "mobile"]) {
    const first = firstPseudo("ayurvedic-treatments", side);
    assert.match(first, /^<a href="#main-content" style="position:(?:absolute|fixed);left:-9999px;/, side);
    assert.equal(first, firstPseudo("all-programs", side), `${side}: same skip link as the covered /all-programs/ hub`);
  }
  assert.match(read("public/ahv/support.js"), /const cls = "scp" \+ \(n\+\+\)\.toString\(36\);/);
  // The override pins the unfocused link inside the viewport (left/top 0, 1px, clipped) and leaves :focus untouched.
  assert.match(view, /\.scp0:not\(:focus\)\{left:0!important;top:0!important;width:1px!important;height:1px!important;padding:0!important;overflow:hidden!important;clip-path:inset\(50%\)!important;white-space:nowrap!important\}/);
  assert.ok(L10N.routes["/ayurvedic-treatments/"].ar, "the Arabic hub is a released locale route");
});

// ── AHV-M023.02 ──────────────────────────────────────────────────────────────────────────────────────────────────────

const finder = (slug, side) => {
  const view = json(`public/ahv/views/ahv-page-${slug}-${side}.json`);
  const context = { window: {}, DCLogic: class { setState(s) { Object.assign(this.state, s); } } };
  vm.runInNewContext(view.logic + ";globalThis.Instance=Component;", context);
  return new context.Instance();
};
for (const side of ["desktop", "mobile"]) test(`AHV-M023.02 (${side}): the yoga hub's Coming Soon filter shows the two unpriced, non-bookable training courses`, () => {
  const hub = finder("yoga-meditation-programs", side);
  const all = hub.renderVals().list;
  assert.equal(all.length, 6, "four yoga programmes + two Coming Soon courses");
  hub.state.availability = "coming_soon";
  const soon = hub.renderVals().list;
  assert.deepEqual(clone(soon.map((p) => p.h.replace(/^https:\/\/ayurvedichealingvillage\.com/, ""))).sort(), ["/new-to-yoga-teacher-training/", "/yoga-meditation-program/"]);
  for (const p of soon) {
    assert.equal(p.canEnquire, false);
    assert.equal(p.action, "View details");
    assert.equal(p.meta, "Coming Soon — enrolment is not open");
    assert.doesNotMatch(JSON.stringify(p), /₹|\$\d|€\d|INR|EUR|USD/);
  }
  hub.state.availability = "current"; assert.equal(hub.renderVals().list.length, 3);
  hub.state.availability = "enquiry_only"; assert.equal(hub.renderVals().list.length, 1);
  // The other finder hubs are unchanged (the course rows keep category R there).
  const ayurveda = finder("ayurvedic-treatments", side); ayurveda.state.cat = "Y"; assert.equal(ayurveda.renderVals().list.length, 0);
  const everything = finder("all-programs", side); everything.state.availability = "coming_soon"; assert.equal(everything.renderVals().list.length, 2);
});
test("AHV-M023.02: only the yoga hub dataset gains category Y on the two Coming Soon rows; the search index is unchanged", () => {
  const index = json("public/ahv/search-index.json");
  for (const route of ["/yoga-meditation-program/", "/new-to-yoga-teacher-training/"]) assert.equal(index.programmes.find((p) => p.route === route).cats, "R");
  const ds = (slug) => JSON.parse(json(`public/ahv/views/ahv-page-${slug}-desktop.json`).logic.match(/const DATASET = (.*);/)[1]);
  assert.deepEqual(ds("yoga-meditation-programs").filter((p) => p.av === "coming_soon").map((p) => p.c), ["RY", "RY"]);
  for (const slug of ["all-programs", "wellness-programs", "training-programs"]) assert.deepEqual(ds(slug).filter((p) => p.av === "coming_soon").map((p) => p.c), ["R", "R"], slug);
  for (const route of ["/yoga-meditation-program/", "/new-to-yoga-teacher-training/"]) for (const loc of LOCALES) assert.ok(L10N.routes[route][loc], `${route} ${loc}`);
});

// ── AHV-I04.M067 / M068 / M069 ───────────────────────────────────────────────────────────────────────────────────────

function readerVals(family, route) {
  const window = {
    AHV_COLLECTION_RENDER: { sourceBlocks: (blocks) => blocks.map((b) => b.kind), applyHead() {} },
  };
  const ctx = { window, React: { createElement: () => null }, location: { search: "" }, URLSearchParams };
  vm.runInNewContext(read(`public/ahv/assets/${family}-family-data.js`), ctx);
  vm.runInNewContext(read(`public/ahv/assets/${family}-family-render.js`), ctx);
  const data = family === "reader25a" ? window.AHV_READER25A_FAMILY : window.AHV_READER25B_FAMILY;
  const R = data.routes.find((r) => r.path === route);
  assert.ok(R, route);
  const api = family === "reader25a" ? window.AHV_READER25A_RENDER : window.AHV_READER25B_RENDER;
  return { R, vals: api.readerVals(R, {}) };
}
const hrefs = (blocks) => JSON.stringify(blocks).match(/"href":"[^"]+"/g).map((h) => h.slice(8, -1));
const WHY = {
  "/why-get-training-in-yoga/": ["/yoga-classes-theory/", "/yoga-classes-practical/", "/yoga-meditation-training/"],
  "/why-pick-a-yoga-or-yoga-retreat/": ["/yoga-meditation-programs/", "/yoga-classes-practical/"],
  "/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/": ["/ayurvedic-treatments/", "/online-consultation/"],
};
test("AHV-I04: the three 'why' pages render their contextual resources as page content, with served, localized destinations", () => {
  for (const [route, expected] of Object.entries(WHY)) {
    const { R, vals } = readerVals("reader25a", route);
    const sections = Object.fromEntries(vals.sections.map((s) => [s.component, s]));
    assert.equal(sections["contextual-resources"].isSection, true, route);
    assert.equal(sections["contextual-resources"].isNav, false, route);
    // The retired WordPress sidebar (contextNav) still renders as a <nav> that section-nav.js removes.
    assert.equal(sections.contextNav.isNav, true, route);
    assert.equal(sections.contextNav.isSection, false, route);
    const links = hrefs(R.components.find((c) => c.component === "contextual-resources").blocks);
    assert.deepEqual(links, expected, route);
    for (const href of links) {
      assert.ok(SERVED.has(href), `${route}: ${href} is a served page`);
      assert.ok(!REDIRECTS[href], `${route}: ${href} is not a redirect source`);
      for (const loc of LOCALES) assert.ok(L10N.routes[href]?.[loc], `${route}: ${href} has a ${loc} route`);
    }
  }
  // "Yoga programmes" led to /yoga-retreats/, a 301 to personalised yoga with no locale routes; it now leads to the hub.
  assert.equal(REDIRECTS["/yoga-retreats/"].to, "/yoga-therapy-individual/");
  assert.ok(!read("public/ahv/assets/reader25a-family-data.js").includes('"href":"/yoga-retreats/"'));
  // The 25B renderer treats the same component the same way (/panchakarma/).
  const { vals } = readerVals("reader25b", "/panchakarma/");
  const cr = vals.sections.find((s) => s.component === "contextual-resources");
  assert.equal(cr.isSection, true); assert.equal(cr.isNav, false);
  // section-nav.js only removes nav[data-source-component]; the template renders section components as <section>.
  assert.match(read("public/design/section-nav.js"), /querySelectorAll\("nav\[data-source-component\]"\)/);
  const template = json("public/ahv/views/ahv-page-article-reader-desktop.json").template;
  assert.match(template, /<sc-if value="\{\{ s\.isSection \}\}"[^>]*>\s*<section data-source-component="\{\{ s\.component \}\}"/);
});

// ── AHV-WB.525.phone-example ─────────────────────────────────────────────────────────────────────────────────────────

test("AHV-WB.525: the German campaign enquiry form shows a German phone example; the field is otherwise unchanged", () => {
  const phone = (loc) => campaignEnquiryForm(loc).steps[0].fields.find((f) => f.name === "phone");
  assert.deepEqual(reversePhoneTable(CAMPAIGN_ENQUIRY_PHONE_PLACEHOLDER, reverseTrainGReworkPhoneExample), { en: "+91 …", de: "+49 …", ru: "+91 …" });
  assert.equal(phone("de").placeholder, "+49 …");
  assert.equal(phone("en").placeholder, "+91 …");
  assert.equal(reverseTrainGReworkPhoneExample("ru", phone("ru").placeholder), "+91 …");
  const { placeholder: _de, label: _l1, ...de } = phone("de");
  const { placeholder: _en, label: _l2, ...en } = phone("en");
  assert.deepEqual(de, en, "name, type, optional, autocomplete, length, pattern and lead mapping unchanged");
  assert.equal(de.required, false, "phone stays optional");
  assert.match(uiFor("de").form.errors.phone, /\+49 30 123456/, "the shipped German error example");
  const c = productionCampaign("lp-behandlung-kerala");
  assert.equal(c.locales[0], "de");
  assert.equal(c.form.schema.steps[0].fields.find((f) => f.name === "phone").placeholder, "+49 …");
  for (const slug of PRODUCTION_SLUGS) if (slug !== "lp-behandlung-kerala")
    for (const f of productionCampaign(slug).form.schema.steps.flatMap((s) => s.fields)) assert.notEqual(f.placeholder, "+49 …", slug);
});

// ── AHV-WB.335.hero-image ────────────────────────────────────────────────────────────────────────────────────────────

function webpSize(buf) {
  assert.equal(buf.toString("ascii", 0, 4), "RIFF");
  assert.equal(buf.toString("ascii", 8, 12), "WEBP");
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X") return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
  if (chunk === "VP8 ") return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  const b = buf.readUInt32LE(21);
  return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1];
}
const CATALOG = (() => {
  const file = path.join(SITE, "../../docs/media/IMAGE_CATALOG.csv");
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
})();
test("AHV-WB.335: /lp/ayurvedic-hospital-kerala/ leads with the consultation room (ahv-pkd-111), page-specific, 1600 px", () => {
  assert.deepEqual(PHOTO_PICKS_20261015H["lp-hospital-kerala"], { hero: "ahv-pkd-111" });
  const c = productionCampaign("lp-hospital-kerala");
  for (const v of ["A", "B", "C", "D"]) assert.equal(c.hero.image[v].id, "ahv-pkd-111");
  assert.equal(c.hero.mobileImage.id, "ahv-pkd-111");
  assert.equal(c.defaultVariant, "A");
  const im = IMAGES["ahv-pkd-111"];
  assert.equal(im.consent, "not-applicable"); assert.equal(im.location, "palakkad"); assert.ok(im.width >= 1600);
  for (const [file, size] of Object.entries(TRAIN_H.assets["ahv-pkd-111"].files)) assert.deepEqual(webpSize(fs.readFileSync(path.join(SITE, file))), size, file);
  assert.equal(im.src, "/ahv/assets/img/owner-decision-20261015/ahv-pkd-111.webp");
  // Page-specific: no other route uses it, and the old mist photograph is no longer this route's hero.
  for (const slug of PRODUCTION_SLUGS) if (slug !== "lp-hospital-kerala") {
    const o = productionCampaign(slug);
    assert.ok(![o.hero.image.A.id, o.hero.mobileImage.id, o.page.pathway.image?.id, ...o.gallery.map((g) => g.image.id)].includes("ahv-pkd-111"), slug);
  }
  assert.ok(!c.gallery.some((g) => g.image.id === "ahv-pkd-111"));
  assert.notEqual(c.page.pathway.image.id, "ahv-pkd-111");
  if (CATALOG) {
    const row = CATALOG.split("\n").find((l) => l.includes("KHASGIWALA-111.jpg"));
    assert.ok(row, "catalogued"); assert.match(row, /,yes,ahv-edited\s*$/, "register_ok=yes");
  }
  assert.match(read("tools/build-train-h-20261015-photos.py"), /"111": \("f110d9a4b4d42cd00593674cd7fd5d8bbd237340c5128aa3757241603c0c4e63", None\)/);
});

// ── AHV-WB.114 / AHV-WB.137 ──────────────────────────────────────────────────────────────────────────────────────────

const CARD_ROUTES = { "monsoon-wellness": ["ahv-img-045", "ahv-pkd-115", "ahv-pkd-50"], "rejuvenation-detox": ["ahv-img-012", "ahv-pkd-132", "ahv-img-018"] };
test("AHV-WB.114/.137: each programme card carries one approved no-person photograph; card copy and links are unchanged", () => {
  const Offering = loadModule("campaign-v2/production/sections/Offering.tsx").default;
  for (const [slug, ids] of Object.entries(CARD_ROUTES)) {
    const c = productionCampaign(slug);
    assert.equal(c.page.offering.kind, "cards");
    assert.deepEqual(c.page.offering.cards.map((card) => card.image.id), ids, slug);
    const prior = reverseTrainHConfig(slug, clone(c));
    assert.deepEqual(clone(c.page.offering.cards).map(({ image: _i, ...rest }) => rest), prior.page.offering.cards, `${slug}: copy unchanged`);
    const own = [c.hero.image.A.id, c.hero.mobileImage.id, c.page.pathway.image.id, c.stillness.image.id, ...c.gallery.map((g) => g.image.id)];
    for (const id of ids) {
      const im = IMAGES[id];
      assert.ok(!own.includes(id), `${slug}: ${id} is not already on the route`);
      assert.equal(im.consent, "not-applicable", `${id}: no person (consent not applicable)`);
      assert.equal(im.location, "palakkad");
      assert.ok(im.width >= 1600, id);
      assert.ok(fs.existsSync(path.join(SITE, "public", im.src)), im.src);
    }
    assert.deepEqual(lintCampaign(c, new Date("2026-10-15T00:00:00Z")).errors, [], slug);
    const html = renderToStaticMarkup(React.createElement(Offering, { c, o: c.page.offering, v: c.defaultVariant, ui: uiFor("en") }));
    const imgs = html.match(/<img [^>]*class="lp-poffer__img"[^>]*>/g) ?? [];
    assert.equal(imgs.length, ids.length, slug);
    ids.forEach((id, i) => {
      const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/</g, "&lt;");
      assert.ok(imgs[i].includes(`alt="${esc(IMAGES[id].alt)}"`), `${slug} card ${i}: alt`);
      assert.ok(imgs[i].includes(encodeURIComponent(IMAGES[id].src)) || imgs[i].includes(IMAGES[id].src), `${slug} card ${i}: src`);
      assert.match(imgs[i], /loading="lazy"/);
    });
    assert.equal((html.match(/<li class="lp-poffer__card">/g) ?? []).length, ids.length);
  }
  // Every other route renders no card photograph.
  for (const slug of PRODUCTION_SLUGS) if (!CARD_ROUTES[slug]) {
    const o = reverseTrainJ3Config(slug, clone(productionCampaign(slug))).page.offering;
    if (o.kind === "cards") assert.ok(o.cards.every((card) => card.image === undefined), slug);
  }
});

// ── AHV-WB.124.change ────────────────────────────────────────────────────────────────────────────────────────────────

test("AHV-WB.124: the Karkidaka route's stay lengths are its 7/14/21-day programmes; field, default and other routes unchanged", () => {
  const monsoon = productionCampaign("monsoon-wellness");
  const titles = monsoon.page.offering.cards.map((card) => card.title);
  assert.deepEqual(titles, ["The Monsoon Starter · 7 days", "The Monsoon Reset · 14 days", "The Monsoon Overhaul · 21 days"]);
  assert.deepEqual(MONSOON_LENGTHS, [
    { value: "7", label: titles[0] }, { value: "14", label: titles[1] }, { value: "21", label: titles[2] }, { value: "advise", label: "Doctor to advise" },
  ]);
  assert.equal(stayLengths(monsoon.route), MONSOON_LENGTHS);
  for (const slug of PRODUCTION_SLUGS) if (slug !== "monsoon-wellness") assert.equal(stayLengths(productionCampaign(slug).route), LENGTHS, slug);
  assert.equal(stayLengths(undefined), LENGTHS);
  assert.deepEqual(LENGTHS.map((o) => o.value), ["14", "21", "28", "advise"], "the shared list is unchanged");
  // The route has no Step-1 bar (consultBar false): the enquiry's served length labels (the payload the reviewer read)
  // now come from the route's own list; field names, the R10 form, its adapter and consent are untouched.
  assert.match(read("campaign-v2/sections/interactive/Enquiry.tsx"), /length: stayLengths\(c\.route\),/);
  assert.match(read("campaign-v2/sections/interactive/Enquiry.tsx"), /prefillEnabled=\{c\.consultBar !== false\}/);
  assert.equal(monsoon.consultBar, false);
  // The page states the same durations everywhere (lead point, card titles, FAQ).
  const faq = monsoon.faq.find((f) => /How long/.test(f.q)).a;
  assert.match(faq, /The Monsoon Starter is 7 days, The Monsoon Reset is 14 days and The Monsoon Overhaul is 21 days/);
  assert.equal(ROUTES["monsoon-wellness"].productionForm.profile, "r10");
  assert.deepEqual(monsoon.form.schema.steps.flatMap((s) => s.fields.map((f) => f.name)), ["fullName", "rdogender", "email", "dialCode", "phone", "message"]);
  assert.equal(monsoon.form.adapterId, "ahv-production");
});

// ── AHV-STAFF18.review ───────────────────────────────────────────────────────────────────────────────────────────────

test("AHV-STAFF18: each released locale's /ayurvedic-treatment-packages/ is one 301 to its existing .html page", () => {
  const rules = json("english-candidate/legacy-english-redirects.json");
  const dest = L10N.routes["/ayurvedic-treatment-packages.html"];
  assert.equal(rules.find((r) => r.source === "/ayurvedic-treatment-packages/").destination, "/ayurvedic-treatment-packages.html");
  const sources = new Set([...rules.map((r) => r.source), ...Object.keys(REDIRECTS), ...json("english-candidate/document-redirects.json").map((r) => r.source),
    ...json("english-candidate/ad-sitelink-redirects.json").map((r) => r.source), ...json("english-candidate/ppc-thanks-redirects.json").map((r) => r.source)]);
  for (const loc of LOCALES) {
    const target = dest[loc];
    assert.match(target, /^\/[a-z-]+\/ayurvedic-treatment-packages\.html$/, loc);
    const source = target.replace(/\.html$/, "/");
    const matching = rules.filter((r) => r.source === source);
    assert.equal(matching.length, 1, `${loc}: one rule`);
    assert.equal(matching[0].destination, target, loc);
    assert.ok(!sources.has(target), `${loc}: the destination is not itself redirected (single hop)`);
    assert.ok(!Object.values(L10N.routes).some((m) => Object.values(m).includes(source)), `${loc}: the source is not a served page`);
  }
  assert.equal(rules.filter((r) => /ayurvedic-treatment-packages\/$/.test(r.source)).length, 13);
  // next.config.ts emits these as 301s (the shared rule for legacy-english-redirects.json).
  assert.match(read("next.config.ts"), /\.\.\.\[\.\.\.adSitelinks, \.\.\.legacyEnglishRedirects, \.\.\.documentRedirects\]\.map\(rule => \(\{ source:rule\.source, destination:rule\.destination, statusCode:301 \}\)\)/);
});

// ── AHV-M021.01 ──────────────────────────────────────────────────────────────────────────────────────────────────────

test("AHV-M021.01: the training overview links the published tariff PDF directly (the l10n build maps it to each locale's edition)", () => {
  const PDF = "/documents/pdf/ayurveda-training-courses-tariff/en/KTAHV-Ayurveda-Training-Courses-Tariff-EN-INR_20260925-R1.pdf";
  const release = json("english-candidate/document-assets-release.json").files.map((f) => f.file);
  assert.ok(release.includes("public" + PDF), "the PDF is a released document asset");
  for (const loc of ["hi", "de", "fr", "es", "it", "pt", "nl", "ru", "ar", "zh", "ja", "ko"])
    assert.ok(release.some((f) => f.startsWith(`public/documents/pdf/ayurveda-training-courses-tariff/${loc}/`)), `${loc} edition`);
  for (const side of ["desktop", "mobile"]) {
    const t = json(`public/ahv/views/ahv-page-ayurveda-training-programme-${side}.json`).template;
    assert.ok(t.includes(`See the <a href="${PDF}">published tariff</a> for full inclusions`), side);
    assert.ok(!t.includes('<a href="/documents/">published tariff</a>'), side);
  }
  assert.ok(read("english-candidate/prerender/ayurveda-training-programme.html").includes(`href="${PDF}">published tariff</a>`));
  // The l10n build rewrites /documents/pdf/<family>/en/… to the locale's edition (tools/l10n/build.mjs).
  assert.match(read("tools/l10n/build.mjs"), /s\.replace\(\/\\\/documents\\\/pdf\\\/\(\[a-z-\]\+\)\\\/en\\\/\(\[A-Za-z0-9\._-\]\+\\\.pdf\)\/g/);
  // /training-programs/ still reaches this overview in one hop.
  assert.equal(REDIRECTS["/training-programs/"].to, "/ayurveda-training-programme/");
});
