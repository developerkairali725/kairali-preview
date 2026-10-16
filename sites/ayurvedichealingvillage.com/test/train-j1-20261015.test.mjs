// Train J batch 1 (15 Oct 2026) on the Train I head 00e944e44. Rows: AHV-I04.M054/M056/M059/M065.links,
// AHV-LATER-021.01/041.01/053.01, AHV-M004.01/.03, AHV-M005.02, AHV-M016.01 (breadcrumb/category part), AHV-M016.02,
// AHV-M021.02 (duration part), AHV-M077.01. The recorded delta (fixtures/train-j1-20261015.json) is checked here; each
// row's acceptance is pinned below. No string here is new copy: every visible label is a frozen English unit with 12
// accepted translations in the catalogue the l10n build reads.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { unitId } from "../tools/l10n/lib.mjs";
import { LOCALES } from "../tools/l10n/locales.mjs";
import { productionCss } from "../scripts/build-production-css.mjs";
import { TRAIN_J1, reverseTrainJ1Source, peelTrainJ1Source, peelTrainJ1Generated } from "./fixtures/train-j1-20261015.mjs";
// Train J integration: a file another Train J batch also edited is read as Train J1 left it (fixtures/train-j-integration-20261015.mjs).
import { peelTrainJ2OverJ1 } from "./fixtures/train-j-integration-20261015.mjs";
import { PLAN, snapshotFile } from "../tools/repair-contextual-links-train-j1-20261015.mjs";
import * as WORKSHOP from "../tools/repair-workshop-past-event-train-j1-20261015.mjs";
import * as BAOLI from "../tools/repair-baoli-archive-train-j1-20261015.mjs";
import * as PK from "../tools/repair-panchakarma-article-train-j1-20261015.mjs";
import * as HERO from "../tools/repair-panchakarma-locale-hero-train-j1-20261015.mjs";
import * as CANCER from "../tools/repair-cancer-approved-copy-train-j1-20261015.mjs";
import * as DUR from "../tools/repair-training-duration-filter-train-j1-20261015.mjs";

const SITE = fileURLToPath(new URL("../", import.meta.url));
const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(read(p));
const sha = (s) => createHash("sha256").update(s).digest("hex");
const plain = (v) => JSON.parse(JSON.stringify(v));
const LOCS = Object.keys(LOCALES).filter((l) => l !== "en");
const BASE = "00e944e4440c4b1710bffc29cc7c2bea8b385fdc";
const dataset = (file) => { const ctx = { window: {} }; vm.runInNewContext(read(file), ctx); return plain(Object.values(ctx.window)[0]); };
const route = (file, path) => dataset(file).routes.find((r) => r.path === path);
const MANIFEST = json("english-candidate/route-manifest.json");
const SERVED = new Set(MANIFEST.routes.map((r) => r.path));
const REDIRECTS = json("english-candidate/redirect-map.json").redirects;
const L10N = json("l10n/routes.json");
const ALIASES = json("english-candidate/link-aliases.json");

// The accepted catalogue the l10n build reads (tools/l10n/build.mjs catalog()), as in train-i-20261015.test.mjs.
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
  for (const f of ["catalogue-locales.json", "information-locales.json", "release-visible-locales.json"])
    for (const u of json(`english-candidate/${f}`).units) if (u.translations[loc]) cat.set(unitId(u.source), u.translations[loc]);
  catalogs.set(loc, cat);
  return cat;
}
const translated = (s) => { for (const loc of LOCS) assert.ok(catalog(loc).has(unitId(s)), `"${s}" has an accepted ${loc} translation`); };
const final13 = (href) => {
  assert.equal(REDIRECTS[href], undefined, `${href} is not a 301 source`);
  assert.ok(SERVED.has(href), `${href} is served`);
  assert.equal(Object.keys(L10N.routes[href] || {}).length, 13, `${href} has 13 locale routes`);
};

// ── the recorded delta ───────────────────────────────────────────────────────────────────────────────────────────────
test("every Train J1 file reverses exactly to the Train I head bytes (git 00e944e44); the head passes through; a third state fails", () => {
  assert.equal(TRAIN_J1.base, BASE);
  assert.equal(Object.keys(TRAIN_J1.files).length, 32);
  for (const [p, e] of Object.entries(TRAIN_J1.files)) {
    const now = peelTrainJ2OverJ1(p, read(p));
    assert.equal(sha(now), e.afterSHA256, `${p}: current bytes are Train J1's`);
    const head = reverseTrainJ1Source(p, now);
    assert.equal(sha(head), e.beforeSHA256, p);
    assert.equal(reverseTrainJ1Source(p, head), head, `${p}: head bytes pass through`);
    assert.equal(peelTrainJ1Source(p, head), head, `${p}: peel passes the head through`);
    assert.throws(() => reverseTrainJ1Source(p, now + " "), undefined, `${p}: any third state fails`);
    let base = null;
    try { base = execFileSync("git", ["show", `${BASE}:sites/ayurvedichealingvillage.com/${p}`], { cwd: SITE, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 27 }); } catch {}
    if (base !== null) assert.equal(sha(base), e.beforeSHA256, `${p}: beforeSHA256 is the Train I head`);
    for (const r of e.replacements) assert.match(r.row, /^AHV-/, p);
  }
  // the regenerated locale review chrome differs from the Train I build only by the retired Baoli route-map entry
  for (const [p, e] of Object.entries(TRAIN_J1.generated)) {
    for (const r of e.replacements) assert.ok(r.before.includes("/the-baoli-special-deal/") && !r.after.includes("/the-baoli-special-deal/"), p);
    if (fs.existsSync(new URL(`../${p}`, import.meta.url))) assert.equal(sha(peelTrainJ1Generated(p, read(p))), e.beforeSHA256, p);
  }
});

test("every Train J1 repair tool is idempotent on the committed tree (--check changes nothing)", () => {
  for (const tool of ["repair-contextual-links-train-j1-20261015.mjs", "repair-workshop-past-event-train-j1-20261015.mjs", "repair-baoli-archive-train-j1-20261015.mjs",
    "repair-panchakarma-article-train-j1-20261015.mjs", "repair-panchakarma-locale-hero-train-j1-20261015.mjs", "repair-cancer-approved-copy-train-j1-20261015.mjs",
    "repair-training-duration-filter-train-j1-20261015.mjs"])
    execFileSync(process.execPath, [`tools/${tool}`, "--check"], { cwd: SITE, stdio: "pipe" });
});

// ── AHV-I04.M054/M056/M059/M065.links ────────────────────────────────────────────────────────────────────────────────
const RENDERERS = { "seven-informational": ["AHV_SEVEN_INFO", "AHV_SEVEN_INFO_RENDER"], reader6c: ["AHV_READER6C_FAMILY", "AHV_READER6C_RENDER"], reader25a: ["AHV_READER25A_FAMILY", "AHV_READER25A_RENDER"], reader25b: ["AHV_READER25B_FAMILY", "AHV_READER25B_RENDER"] };
function sections(file, path) {
  const fam = file.match(/assets\/(.+)-(?:family-)?data\.js$/)[1].replace(/-family$/, "");
  const ctx = { window: { AHV_COLLECTION_RENDER: { sourceBlocks: (b) => b.map((x) => x.kind) } }, React: { createElement: () => null, cloneElement: (e) => e }, location: { search: "" }, URLSearchParams };
  vm.runInNewContext(read(file), ctx);
  vm.runInNewContext(read(file.replace(/-data\.js$/, "-render.js")), ctx);
  const api = Object.entries(ctx.window).find(([k, v]) => k.endsWith("_RENDER") && v && v.readerVals && k !== "AHV_COLLECTION_RENDER")[1];
  const R = Object.values(ctx.window).find((v) => v && Array.isArray(v.routes)).routes.find((r) => r.path === path);
  void RENDERERS; void fam;
  return api.readerVals(R, () => {}).sections;
}
test("AHV-I04: the four Knowledge articles end on the approved related-resources list, rendered as a <section>, with final localized destinations", () => {
  assert.deepEqual(PLAN.map(([row, , p]) => [row, p]), [["AHV-I04.M054.links", "/ayurveda-treatment/"], ["AHV-I04.M056.links", "/learn-about-ayurveda/"], ["AHV-I04.M059.links", "/meditation/"], ["AHV-I04.M065.links", "/what-is-yoga/"]]);
  for (const [, file, path, items] of PLAN) {
    const r = route(file, path), last = r.components.at(-1);
    assert.equal(last.component, "contextual-resources", path);
    assert.equal(r.components.filter((c) => c.component === "contextual-resources").length, 1, path);
    assert.equal(last.blocks[0].text, "Explore related resources");
    assert.deepEqual(last.blocks[1].items.map((i) => [i.tree[0].attrs.href, i.text]), items, path);
    for (const s of ["Explore related resources", ...items.map(([, l]) => l)]) translated(s);
    for (const [href] of items) final13(href);
    const s = sections(file, path).find((x) => x.component === "contextual-resources");
    assert.equal(s.isSection, true, `${path}: a section, not a sweepable nav`); assert.equal(s.isNav, false, path);
    const html = read(snapshotFile(path));
    assert.equal(html.split('data-source-component="contextual-resources"').length - 1, 1, `${path}: English snapshot carries the list once`);
    for (const [href, label] of items) assert.ok(html.includes(`<a href="${href}" data-source-href="${href}"`) && html.includes(`>${label.replace(/&/g, "&amp;")}</a>`), `${path}: ${href}`);
  }
  // M056: the reader-6C renderer keeps the retired sidebar a removable nav and the list a section
  const sweep = /context|menu|navigation/i;
  for (const s of sections("public/ahv/assets/reader6c-family-data.js", "/retreats-for-everyone/")) if (s.component === "contextNav") assert.equal(s.isNav, true);
  assert.ok(sweep.test("contextual-resources"), "the component name alone would be swept; the renderer exception is what keeps it");
});
// Ported from queued batch 8 (ac09c15d7, contextual-links-batch8.test.mjs): every body/related destination on the 24
// batch-8 rows resolves to a served page, never a redirect source, and each route has an onward body link.
const BATCH8 = ["/ayurveda-retreats-for-everyone/", "/ayurveda-treatment/", "/kairali-ayurvedic-way-of-weight-management/", "/live-to-100-with-panchkarma/",
  "/retreats-for-everyone/", "/training/", "/what-is-panchkarma/", "/why-get-training-in-ayurveda/", "/why-get-training-in-yoga/", "/why-pick-a-yoga-or-yoga-retreat/",
  "/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/", "/yoga-retreats-for-everyone/", "/karma-being-retreat-2019/", "/karma-being-retreat/", "/katha-wellness-retreat-2019/",
  "/learn-about-ayurveda/", "/learn-more-about-yoga/", "/meditation/", "/new-to-ayurveda/", "/new-to-yoga/", "/what-is-yoga/", "/yoga-classes-practical/", "/yoga-classes-theory/", "/food-sadhana/"];
const bodyLinks = (r) => {
  const out = [];
  const walk = (o, comp) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) { o.forEach((x) => walk(x, comp)); return; }
    const c = o.component || comp;
    if (c === "contextNav") return;
    if (o.attrs && typeof o.attrs.href === "string") out.push(o.attrs.href);
    for (const [k, v] of Object.entries(o)) if (k !== "attrs" && !k.endsWith("Private")) walk(v, c);
  };
  walk(r.components || r.items || [], "");
  for (const l of r.relatedLinks || []) out.push(l.href);
  return out;
};
test("batch 8 contextual links: every body/related destination is a served page, never a redirect source; each route links onward", () => {
  for (const path of BATCH8) {
    const m = MANIFEST.routes.find((x) => x.path === path);
    const r = route("public/ahv/" + m.dataset, path);
    assert.ok(r, path);
    const links = bodyLinks(r);
    for (const href of links) {
      if (!href.startsWith("/") && !href.startsWith("https://ayurvedichealingvillage.com/")) continue;
      if (/^\/cdn-cgi\//.test(href)) continue;
      const p = href.replace(/^https:\/\/ayurvedichealingvillage\.com/, "").split(/[?#]/)[0];
      const to = ALIASES[p.replace(/\/$/, "")] || p;
      assert.ok(SERVED.has(to), `${path}: ${href} -> ${to} is served`);
      assert.equal(REDIRECTS[to] || REDIRECTS[to.replace(/\/$/, "")], undefined, `${path}: ${to} is not a redirect source`);
    }
    assert.ok(links.some((h) => !/^(tel:|mailto:|\/cdn-cgi\/)/.test(h)), path);
  }
});

// ── AHV-M077.01 ──────────────────────────────────────────────────────────────────────────────────────────────────────
test("AHV-M077.01: /ayurveda-workshop/ is labelled a past event with the existing undated notice, under Past retreats in every locale", () => {
  const r = route(WORKSHOP.DATA, "/ayurveda-workshop/");
  assert.equal(r.statusLabel, "Past Retreat");
  assert.equal(r.historicalNotice, "Past retreat — preserved for historical reference. The event year has not been verified.");
  assert.doesNotMatch(r.historicalNotice, /\b(19|20)\d\d\b/, "no year stated");
  const chef = route("public/ahv/assets/hist9-family-data.js", "/chef-retreat-food-to-wellness/");
  assert.equal(r.statusLabel, chef.statusLabel, "the same eyebrow as the Chef retreat record");
  assert.deepEqual(r.crumbs.map((c) => c.path), ["/", "/archive/", "/archive-yoga-retreat/", "/ayurveda-workshop/"]);
  assert.deepEqual(r.breadcrumbSchemaExpected.itemListElement.map((i) => i.name), r.crumbs.map((c) => c.label));
  for (const s of [r.statusLabel, r.historicalNotice, ...r.crumbs.map((c) => c.label)]) translated(s);
  const nav = (() => { const w = {}; vm.runInNewContext(read("public/design/section-nav.data.js"), { window: w }); return plain(w.AHV_SECTION_NAV); })();
  assert.deepEqual(nav.routes["/ayurveda-workshop/"].crumbs, ["/archive-yoga-retreat/", "/ayurveda-workshop/"], "English rail/breadcrumb already under Past retreats");
  // the renderer opens the page with the notice; the English snapshot carries it right after the title
  const ctx = { window: { AHV_COLLECTION_RENDER: { sourceBlocks: (b) => b.map((x) => x.kind) } }, React: { createElement: (t, p, ...c) => ({ t, p, c }) }, location: { search: "" }, URLSearchParams };
  vm.runInNewContext(read(WORKSHOP.DATA), ctx); vm.runInNewContext(read("public/ahv/assets/training7-family-render.js"), ctx);
  const secs = ctx.window.AHV_TRAINING7_RENDER.readerVals(ctx.window.AHV_TRAINING7_FAMILY.routes.find((x) => x.path === "/ayurveda-workshop/"), () => {}).sections;
  assert.equal(secs[0].component, "past-event-notice"); assert.equal(secs[0].isSection, true);
  assert.deepEqual(plain(secs[0].el.map((e) => e.c[0])), [r.statusLabel, r.historicalNotice]);
  assert.equal(secs[0].el[1].p.role, "note");
  const other = ctx.window.AHV_TRAINING7_RENDER.readerVals(ctx.window.AHV_TRAINING7_FAMILY.routes.find((x) => x.path !== "/ayurveda-workshop/"), () => {}).sections;
  assert.ok(!other.some((s) => s.component === "past-event-notice"), "no other training route gains a notice");
  const html = read(WORKSHOP.SNAPSHOT);
  assert.ok(html.indexOf('data-source-component="past-event-notice"') > html.indexOf('id="r6c-h1"'));
  assert.ok(html.includes(">Past Retreat</p>") && html.includes(`role="note"`) && html.includes(r.historicalNotice));
});

// ── AHV-M016.01 / AHV-M016.02 ────────────────────────────────────────────────────────────────────────────────────────
test("AHV-M016.02: /the-baoli-special-deal/ is one 301 hop to /the-baoli-advert-box-deal/ in all 13 locales; the survivor keeps the stronger search evidence", () => {
  const rule = REDIRECTS["/the-baoli-special-deal/"];
  assert.equal(rule.to, "/the-baoli-advert-box-deal/");
  assert.deepEqual([rule.gsc.clicks, rule.gsc.impressions, rule.gsc.position], [0, 16, 52.56]);
  assert.match(rule.gsc.basis, /24 impressions, position 28\.79/);
  assert.match(rule.ownerApproval, /DEC-BAOLI/);
  assert.ok(SERVED.has("/the-baoli-advert-box-deal/") && !REDIRECTS["/the-baoli-advert-box-deal/"]);
  assert.equal(L10N.routes["/the-baoli-special-deal/"], undefined, "no longer allocated as a locale page");
  for (const loc of LOCS) {
    const p = "/" + LOCALES[loc].prefix + "/the-baoli-special-deal/";
    assert.deepEqual([L10N.redirects[p]?.to], [L10N.routes["/the-baoli-advert-box-deal/"][loc]], p);
    assert.equal(L10N.redirects[L10N.redirects[p].to], undefined, `${p}: single hop`);
  }
  // the retired twin leaves the rail, header family, site tree and search index; its body was the same contact reference
  const nav = (() => { const w = {}; vm.runInNewContext(read("public/design/section-nav.data.js"), { window: w }); return plain(w.AHV_SECTION_NAV); })();
  assert.equal(nav.routes["/the-baoli-special-deal/"], undefined); assert.equal(nav.family["/the-baoli-special-deal/"], undefined);
  assert.equal(json("english-candidate/site-tree.json").unlisted["/the-baoli-special-deal/"], undefined);
  assert.ok(!json("public/ahv/search-index.json").pages.some((p) => p.route === "/the-baoli-special-deal/"));
  const text = (r) => JSON.stringify(r.components.slice(1).map((c) => c.blocks.map((b) => b.text || (b.items || []).map((i) => i.text))));
  assert.equal(text(route("public/ahv/assets/commercial-family-data.js", "/the-baoli-special-deal/")), text(route("public/ahv/assets/commercial-family-data.js", "/the-baoli-advert-box-deal/")));
});
test("AHV-M016.01: the Baoli page leaves the Offers category for the archive, with no term, discount or validity added", () => {
  const r = route(BAOLI.DATA, BAOLI.ROUTE);
  assert.deepEqual(r.crumbs.map((c) => c.path), ["/", "/archive/", "/the-baoli-advert-box-deal/"]);
  assert.ok(!JSON.stringify(r.crumbs).includes("/offers/") && !JSON.stringify(r.breadcrumbSchemaExpected).includes("/offers/"));
  for (const c of r.crumbs) translated(c.label);
  const nav = (() => { const w = {}; vm.runInNewContext(read("public/design/section-nav.data.js"), { window: w }); return plain(w.AHV_SECTION_NAV); })();
  assert.equal(nav.routes[BAOLI.ROUTE].section, "news"); assert.equal(nav.family[BAOLI.ROUTE].section, "news");
  assert.deepEqual(nav.routes[BAOLI.ROUTE].remove, { navPrefixes: [], blockPrefixes: ["/sections/3/c/1"] }, "the retired Knowledge sidebar stays removed");
  assert.equal(json("english-candidate/site-tree.json").unlisted[BAOLI.ROUTE].section, "news");
  const html = read(BAOLI.SNAPSHOT);
  assert.ok(html.includes(BAOLI.CRUMB_AFTER) && !html.includes(BAOLI.CRUMB_BEFORE));
  const body = JSON.stringify(r.components);
  assert.doesNotMatch(body, /%|discount|valid (until|till|to)|₹/i, "no commercial term added");
  assert.ok(!read("english-candidate/prerender/offers.html").includes("baoli"), "not linked from Offers");
});

// ── AHV-M004.01 / AHV-M004.03 ────────────────────────────────────────────────────────────────────────────────────────
test("AHV-M004.01/.03: /panchakarma/ reads as sections with an in-page list, two existing explanatory photographs, every source paragraph kept", () => {
  const r = route(PK.DATA, PK.ROUTE);
  assert.deepEqual(r.components.map((c) => c.component), ["hero", "contextNav", "article", "on-this-page", "what-is-panchakarma", "the-five-therapies", "contextual-resources"]);
  const blocks = r.components.flatMap((c) => c.blocks);
  const ptrs = blocks.filter((b) => b.ptr && b.ptr.startsWith("/sections/3/c/3/")).map((b) => b.ptr);
  assert.deepEqual(ptrs, ["/sections/3/c/3/c/2", "/sections/3/c/3/c/4", "/sections/3/c/3/c/6", "/sections/3/c/3/c/8", "/sections/3/c/3/c/10", "/sections/3/c/3/c/12/c/0", "/sections/3/c/3/c/14", "/sections/3/c/3/c/16", "/sections/3/c/3/c/18"], "every source block, in source order");
  const toc = r.components.find((c) => c.component === "on-this-page");
  const anchors = toc.blocks[1].items.map((i) => i.anchor);
  assert.deepEqual(toc.blocks[1].items.map((i) => i.tree[0].attrs.href), anchors.map((a) => "#" + a));
  assert.deepEqual(blocks.filter((b) => b.kind === "heading" && b.anchor).map((b) => b.anchor), anchors, "each list entry has its heading");
  for (const s of ["On this page", ...toc.blocks[1].items.map((i) => i.text)]) translated(s);
  for (const im of [PK.ABHYANGA, PK.NASYAM]) {
    assert.ok(fs.existsSync(new URL(`../public${im.src}`, import.meta.url)), im.src);
    translated(im.alt);
    assert.ok(blocks.some((b) => b.kind === "image" && b.src === im.src && b.alt === im.alt), im.src);
  }
  assert.ok(json("public/ahv/views/ahv-page-panchakarma-therapy-mobile.json").template.includes(PK.NASYAM.alt), "Nasyam photograph already published with this alt");
  assert.ok(json("public/ahv/views/ahv-page-preventive-regenerative-mobile.json").template.includes(PK.ABHYANGA.alt), "Abhyanga photograph already published with this alt");
  // the renderer gives each anchored heading its id and draws the in-page list with relative links
  const React = { createElement: (t, p, ...c) => ({ type: t, props: { ...p, children: c } }), cloneElement: (e, p) => ({ ...e, props: { ...e.props, ...p } }) };
  const ctx = { window: {}, React, location: { search: "" }, URLSearchParams };
  vm.runInNewContext(read("public/ahv/assets/collection-family-render.js"), ctx);
  vm.runInNewContext(read(PK.DATA), ctx); vm.runInNewContext(read("public/ahv/assets/reader25b-family-render.js"), ctx);
  const secs = ctx.window.AHV_READER25B_RENDER.readerVals(ctx.window.AHV_READER25B_RENDER.resolveRoute(PK.ROUTE), () => {}).sections;
  const ids = [], hrefs = [];
  const walk = (n) => { if (Array.isArray(n)) return n.forEach(walk); if (!n || typeof n !== "object") return; if (n.props?.id) ids.push(n.props.id); if (n.type === "a") hrefs.push(n.props.href); walk(n.props?.children); };
  secs.forEach((s) => walk(s.el));
  assert.deepEqual(plain(ids), anchors); assert.deepEqual(plain(hrefs).filter((h) => h.startsWith("#")), anchors.map((a) => "#" + a));
  for (const s of secs) assert.equal(s.isSection, !/^contextNav$/.test(s.component), s.component);
  const html = read(PK.SNAPSHOT);
  for (const a of anchors) assert.equal(html.split(` id="${a}"`).length - 1, 1, a), assert.ok(html.includes(`href="#${a}"`), a);
  for (const im of [PK.ABHYANGA, PK.NASYAM]) assert.ok(html.includes(`src="${im.src}"`), im.src);
  assert.ok(!html.includes(">WHAT IS PANCHAKARMA?<"));
});

// ── AHV-M005.02 ──────────────────────────────────────────────────────────────────────────────────────────────────────
test("AHV-M005.02: the survivor carries the retired page's three approved CLINICAL-COPY paragraphs verbatim, translated, on both views and the snapshot", () => {
  const legacy = JSON.stringify(route("public/ahv/assets/exception-five-family-data.js", "/revitalizing-and-strengthening-treatment-for-cancer-patients/"));
  for (const s of CANCER.RESTORED) {
    assert.ok(legacy.includes(JSON.stringify(s).slice(1, -1)), `restored verbatim from the retired page: ${s}`);
    translated(s);
    for (const f of CANCER.VIEWS) assert.equal(json(f).template.split(`>${s}</p>`).length - 1, 1, f);
    assert.equal(read(CANCER.SNAPSHOT).split(`>${s}</p>`).length - 1, 1);
  }
  assert.equal(REDIRECTS["/revitalizing-and-strengthening-treatment-for-cancer-patients/"].to, "/revitalizing-and-strengthening/");
  for (const f of CANCER.VIEWS) assert.doesNotMatch(json(f).template, /motivator|Vaman are chosen/, "uncleared lines are not restored");
});

// ── AHV-LATER-021.01 ─────────────────────────────────────────────────────────────────────────────────────────────────
test("AHV-LATER-021.01: the 12 locale Panchakarma pages open on the page's own Palakkad photograph, not the homepage hero", () => {
  const homeHero = "/ahv/assets/img/wx-hero.webp";
  assert.ok(json("public/ahv/views/home-mobile.json").template.includes(homeHero) || read("public/ahv/views/home-hi-fi-v4.json").includes("wx-hero"));
  for (const f of Object.keys(HERO.FILES)) {
    const t = json(f).template;
    assert.ok(!t.includes(homeHero), f);
    const m = t.match(/<img src="(\/ahv\/assets\/img\/owner-decision-20261015\/ahv-pkd-50(?:-768)?\.webp)" alt="Kairali &mdash; The Ayurvedic Healing Village, Palakkad" width="(\d+)" height="(\d+)"/);
    assert.ok(m, f);
    assert.ok(fs.existsSync(new URL(`../public${m[1]}`, import.meta.url)), m[1]);
  }
  translated("Kairali — The Ayurvedic Healing Village, Palakkad");
  assert.match(read("campaign-v2/production/bindings.ts"), /panchakarma: \{ hero: "ahv-pkd-50" \}/, "the same photograph as the English Panchakarma page");
  for (const loc of LOCS) assert.ok(L10N.routes["/panchkarma-treatment.html"][loc], loc);
});

// ── AHV-LATER-041.01 / AHV-LATER-053.01 ──────────────────────────────────────────────────────────────────────────────
test("AHV-LATER-041.01/053.01: the number field spans the form unless a country-code field sits beside it; Variant C tablet steps stack their numeral", () => {
  const css = read("campaign-v2/production/production.css");
  assert.ok(css.includes(".lp-prod .lp-enq__fields--enquiry > .lp-enq__field--name-dialCode + .lp-enq__field--name-phone { grid-column: 2; }"));
  assert.ok(!css.includes(".lp-prod .lp-enq__fields--enquiry > .lp-enq__field--name-phone { grid-column: 2; }"));
  assert.ok(css.includes(".lp-prod .lp-enq__fields--enquiry > * { grid-column: 1 / -1; }"), "the full-width default stays");
  assert.match(css, /@media \(min-width: 768px\) and \(max-width: 1023px\) \{\n {2}\.lp-prod\[data-variant="C"\] \.lp-adm__step \{ grid-template-columns: minmax\(0, 1fr\); gap: 6px; \}\n\}/);
  assert.equal(read("campaign-v2/production/document.css"), productionCss(), "generated CSS equals its authored sources");
});

// ── AHV-M021.02 (duration part) ──────────────────────────────────────────────────────────────────────────────────────
test("AHV-M021.02: the training hub filters its five courses by the legacy finder's duration chips, in both views", () => {
  const legacy = json("public/ahv/views/ahv-page-training-programs-mobile.json").logic;
  assert.ok(legacy.includes("[['', 'Any'], ['7', 'Up to 7 nights'], ['10', '10 nights'], ['14', '14 nights'], ['20', '20 nights'], ['21', '21+ nights']]"), "labels as in the legacy finder");
  for (const s of ["Duration", ...DUR.DURATIONS.map(([, l]) => l)]) translated(s);
  for (const [v, f] of Object.entries(DUR.VIEWS)) {
    const d = json(f);
    assert.equal(d.template.split('data-ahv-course-duration=""').length - 1, 1, f);
    assert.match(d.template, /role="group" aria-label="Duration"[\s\S]*aria-pressed="\{\{ c\.on \}\}"/);
    const ctx = { window: {}, document: { documentElement: {} }, DCLogic: class { constructor() { this.state = this.state || {}; } setState(s) { Object.assign(this.state, s); } } };
    vm.createContext(ctx);
    vm.runInContext(read("public/ahv/assets/ayurveda-training-data.js"), ctx);
    vm.runInContext(d.logic + ";globalThis.C = Component;", ctx);
    const c = new ctx.C();
    let r = c.renderVals();
    assert.deepEqual(plain(r.durations.map((x) => [x.label, x.on])), [["Any", "true"], ["Up to 7 nights", "false"], ["10 nights", "false"], ["20 nights", "false"]], v);
    assert.deepEqual(plain(r.courses.map((x) => x.days)), [1, 3, 5, 10, 20], v);
    const by = (label) => r.durations.find((x) => x.label === label);
    for (const [label, days] of [["Up to 7 nights", [1, 3, 5]], ["10 nights", [10]], ["20 nights", [20]], ["Any", [1, 3, 5, 10, 20]]]) {
      by(label).pick(); r = c.renderVals();
      assert.deepEqual(plain(r.courses.map((x) => x.days)), days, `${v} ${label}`);
      assert.equal(by(label).on, "true");
    }
  }
  const html = read(DUR.SNAPSHOT);
  assert.equal(html.split("data-ahv-course-duration").length - 1, 1);
  assert.ok(html.includes('aria-pressed="true"') && html.indexOf("data-ahv-course-duration") < html.indexOf('<ul data-dc-tpl="82"'));
  assert.ok(!/budget|currency/i.test(json(DUR.VIEWS.mobile).template.match(/data-ahv-course-duration[\s\S]{0,2000}/)[0]), "budget/currency not ported (owner decision)");
});
