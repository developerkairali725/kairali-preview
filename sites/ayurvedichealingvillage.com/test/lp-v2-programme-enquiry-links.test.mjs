// DEC-PROGRAMME-DESCRIPTIONS (WOPS-AHV-PROGRAMME-DETAILS-20261010-001): "Ask about this programme" beside each existing
// programme link on the four English programme routes (production/sections/Offering.tsx). The real component is
// rendered (TypeScript transpile + react-dom/server) from the routes' real configs (production/load.ts). This is a
// description completion: existing programme overviews are shown in full beside the existing links and Ask anchors.
//
// AHV_OFFERING_SOURCE=<file> renders that source in Offering.tsx's place (mutation controls);
// AHV_OFFERING_BASELINE=<file> overrides the pre-change baseline (default: Offering.tsx at BASE_COMMIT, when present).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { htmlToDOM, Element, Text } from "html-react-parser";
import ts from "typescript";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { uiFor } from "../campaign-v2/production/ui.ts";
import { interactionForLink } from "../campaign-v2/production/interaction-map.ts";
import { richText } from "../campaign-v2/kit/rich.ts";
import { PROGRAMME_DESCRIPTIONS } from "../campaign-v2/production/programme-descriptions.ts";

const require = createRequire(import.meta.url);
const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OFFERING = path.join(SITE, "campaign-v2/production/sections/Offering.tsx");
const BASE_COMMIT = "a831a634828cdbee83fac381f06ea618714fe2cd";
const ASK = "Ask about this programme";

/** The four routes and their existing programme-link counts (SOURCE-QUALIFICATION, 10 Oct 2026): 21 links in all. */
const TARGETS = {
  "treatment-packages": ["/ayurvedic-treatment-packages.html", 11],
  "rejuvenation-detox": ["/preventive-rejuvenation-detoxification.html", 3],
  "ayurveda-retreat": ["/ayurveda-retreat-kerala.html", 5],
  "cleansing-centre": ["/kairali-cleansing-centre.html", 2],
};

/** Offering.tsx and its imports, transpiled and run; `source` replaces Offering.tsx's own text. */
function loadOffering(source) {
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const mod = { exports: {} };
    cache.set(filename, mod);
    const text = filename === OFFERING && source !== undefined ? source : fs.readFileSync(filename, "utf8");
    const js = ts.transpileModule(text, { fileName: filename, compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    } }).outputText;
    const req = (name) => {
      if (!name.startsWith(".")) return require(name);
      const base = path.resolve(path.dirname(filename), name);
      const hit = [base, base + ".tsx", base + ".ts"].find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
      assert.ok(hit, `resolve ${name} from ${filename}`);
      return load(hit);
    };
    vm.runInNewContext(js, { module: mod, exports: mod.exports, require: req }, { filename });
    return mod.exports;
  }
  return load(OFFERING).default;
}

const override = process.env.AHV_OFFERING_SOURCE;
const Offering = loadOffering(override ? fs.readFileSync(override, "utf8") : undefined);

function baselineSource() {
  if (process.env.AHV_OFFERING_BASELINE) return fs.readFileSync(process.env.AHV_OFFERING_BASELINE, "utf8");
  try {
    return execFileSync("git", ["show", `${BASE_COMMIT}:sites/ayurvedichealingvillage.com/campaign-v2/production/sections/Offering.tsx`],
      { cwd: SITE, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch { return null; }
}

const C = Object.fromEntries(PRODUCTION_SLUGS.map((s) => [s, productionCampaign(s)]));
const render = (Component, c) => renderToStaticMarkup(React.createElement(Component,
  { c, o: c.page.offering, v: c.defaultVariant, ui: uiFor(c.locales[0]) }));

// ── a small DOM reader over the rendered markup ───────────────────────────────────────────────────────
const dom = (html) => htmlToDOM(html);
const all = (nodes, pred) => nodes.flatMap((n) => (n instanceof Element ? [...(pred(n) ? [n] : []), ...all(n.children, pred)] : []));
const text = (n) => (n instanceof Text ? n.data : n instanceof Element ? n.children.map(text).join("") : "");
const cls = (n, name) => (n.attribs.class || "").split(/\s+/).includes(name);
const kids = (n, tag) => n.children.filter((k) => k instanceof Element && k.name === tag);
const asks = (nodes) => all(nodes, (n) => n.name === "a" && text(n).trim() === ASK);
/** The rendered markup without the Ask anchors: what the page rendered before this change. */
const withoutAsks = (html) => html.replace(/<div data-programme-description="[^"]+">[\s\S]*?<\/div>/g, "").replace(/<a class="lp-btn lp-btn--line" href="#enquiry"[^>]*>Ask about this programme<\/a>/g, "");

// DEC-PACKAGE-CARDS adds independently approved facts outside the programme link/card content.
// package-facts.test.mjs verifies their exact facts and preservation of every existing node across all24routes.
// Remove only that new block for this older Ask/description delta comparison; all interaction tests still render it.
const withoutPackageFacts = (html) => html.replace(/<div data-package-facts="[^"]+">[\s\S]*?<\/div>/g, "").replace('<div class="lp-poffer__intro"></div>', '');

test("all four English routes render one Ask anchor per existing programme link: 11 + 3 + 5 + 2 = 21", () => {
  let total = 0;
  for (const [slug, [route, count]] of Object.entries(TARGETS)) {
    const c = C[slug];
    assert.equal(c.route, route, slug);
    assert.deepEqual(c.locales, ["en"], slug);
    const nodes = dom(render(Offering, c));
    const items = all(nodes, (n) => n.name === "ul" && cls(n, "lp-poffer__links")).flatMap((ul) => kids(ul, "li"));
    assert.equal(items.length, count, `${slug}: programme link items`);
    for (const li of items) {
      const detail = kids(li, "a").filter((a) => cls(a, "lp-poffer__link"));
      const ask = kids(li, "a").filter((a) => text(a).trim() === ASK);
      assert.equal(detail.length, 1, `${slug}: one full-detail link per item`);
      assert.equal(ask.length, 1, `${slug}: one Ask anchor per item (${text(detail[0])})`);
    }
    assert.equal(asks(nodes).length, count, `${slug}: no Ask anchor outside the programme items`);
    total += count;
  }
  assert.equal(total, 21);
});

test("each Ask anchor names its own programme, uses the existing button and the section CTA's #enquiry tracking", () => {
  for (const slug of Object.keys(TARGETS)) {
    const c = C[slug];
    const nodes = dom(render(Offering, c));
    const generic = all(nodes, (n) => n.name === "a" && cls(n, "lp-pcta"));
    assert.equal(generic.length, 1, `${slug}: the generic section CTA is still there, once`);
    const g = generic[0].attribs;
    const names = new Set();
    for (const ul of all(nodes, (n) => n.name === "ul" && cls(n, "lp-poffer__links"))) {
      for (const li of kids(ul, "li")) {
        const label = text(kids(li, "a").find((a) => cls(a, "lp-poffer__link"))).trim();
        const a = kids(li, "a").find((x) => text(x).trim() === ASK).attribs;
        assert.equal(a["aria-label"], `${ASK}: ${label}`, `${slug}: accessible name starts with the visible text and names ${label}`);
        names.add(a["aria-label"]);
        assert.equal(a.class, "lp-btn lp-btn--line", "the existing secondary button style (ConsultCard's Ask Anything)");
        assert.equal(a.href, "#enquiry", "the existing enquiry form, no query or prefill parameter");
        assert.equal(a.href, g.href);
        for (const k of ["data-track", "data-track-cta", "data-track-position"]) assert.equal(a[k], g[k], `${slug}: ${k} as the section CTA`);
        assert.deepEqual(Object.keys(a).sort(), ["aria-label", "class", "data-track", "data-track-cta", "data-track-position", "href"],
          `${slug}: no new data attribute, target or parameter`);
        assert.equal(a.target, undefined);
      }
    }
    assert.equal(names.size, TARGETS[slug][1], `${slug}: every accessible name is distinct`);
  }
});

test("original full-detail links, card order, headings, paragraphs and the generic CTA are unchanged", () => {
  for (const slug of Object.keys(TARGETS)) {
    const c = C[slug];
    const o = c.page.offering;
    const html = render(Offering, c);
    const nodes = dom(html);
    const cards = all(nodes, (n) => n.name === "li" && cls(n, "lp-poffer__card"));
    assert.deepEqual(cards.map((k) => text(all([k], (n) => n.name === "h3")[0])), o.cards.map((k) => k.title), `${slug}: card order + headings`);
    cards.forEach((card, i) => {
      const src = o.cards[i];
      const links = all([card], (n) => n.name === "a" && cls(n, "lp-poffer__link"));
      assert.deepEqual(links.map((a) => [text(a), a.attribs.href]), (src.links ?? []).map((l) => [l.label, l.href]), `${slug}: detail links`);
      for (const a of links) {
        if (/^https:\/\//.test(a.attribs.href)) assert.deepEqual([a.attribs.target, a.attribs.rel], ["_blank", "noopener noreferrer"]);
      }
      const paras = kids(card, "p").map(text);
      assert.deepEqual(paras, src.paragraphs.map(richText), `${slug}: paragraphs`);
    });
    // The same page with the gate closed (any other route) renders exactly the Ask-less markup: nothing else moved.
    const closed = render(Offering, { ...c, route: "/not-a-programme-route.html" });
    assert.equal(asks(dom(closed)).length, 0);
    assert.equal(withoutAsks(withoutPackageFacts(html)), closed, `${slug}: only the approved descriptions and Ask anchors were added`);
  }
});

test("untargeted routes and every locale variant render no Ask anchor (no English copy inherited)", () => {
  const targetRoutes = Object.values(TARGETS).map(([r]) => r);
  for (const slug of PRODUCTION_SLUGS) {
    const c = C[slug];
    const nodes = dom(render(Offering, c));
    if (Object.hasOwn(TARGETS, slug)) continue;
    assert.ok(!targetRoutes.includes(c.route), slug);
    assert.equal(asks(nodes).length, 0, `${slug} (${c.route}, ${c.locales}): no Ask anchor`);
    assert.ok(!render(Offering, c).includes(ASK), slug);
  }
  assert.ok(PRODUCTION_SLUGS.some((s) => C[s].locales[0] === "de") && PRODUCTION_SLUGS.some((s) => C[s].locales[0] === "ru"));
  for (const slug of Object.keys(TARGETS)) {
    for (const locales of [["de"], ["ru"], ["en", "de"], []]) {
      const c = { ...C[slug], locales };
      const html = render(Offering, c);
      assert.equal(asks(dom(html)).length, 0, `${slug} as ${JSON.stringify(locales)}`);
      assert.ok(!html.includes(ASK), `${slug} as ${JSON.stringify(locales)}: no English Ask copy`);
    }
    // A near-miss route (case, trailing slash, /lp/ prefix) is not the route.
    const [route] = TARGETS[slug];
    for (const r of [route.toUpperCase(), route + "/", "/lp" + route, route.replace(".html", "")]) {
      assert.equal(asks(dom(render(Offering, { ...C[slug], route: r }))).length, 0, r);
    }
  }
});

test("no lead or diagnostics change: no form fields, no prefill, #enquiry stays an enquiry open, programme links stay programme opens", () => {
  for (const slug of Object.keys(TARGETS)) {
    const nodes = dom(render(Offering, C[slug]));
    assert.equal(all(nodes, (n) => ["form", "input", "select", "textarea", "button"].includes(n.name)).length, 0, slug);
    const enquiry = all(nodes, (n) => n.name === "a" && (n.attribs.href || "").includes("enquiry"));
    assert.ok(enquiry.every((a) => a.attribs.href === "#enquiry"), `${slug}: no parameterised enquiry link`);
    // Inside [data-programme-links] (Interactions.tsx): the Ask anchor is measured as the form opening, never as a programme.
    assert.equal(all(nodes, (n) => n.name === "ol" && "data-programme-links" in n.attribs).length, 1);
    assert.deepEqual(interactionForLink("#enquiry", true), ["enquiry_open", "enquiry"]);
    for (const a of all(nodes, (n) => n.name === "a" && cls(n, "lp-poffer__link"))) {
      assert.deepEqual(interactionForLink(a.attribs.href, true), ["programme_open", "programme"], a.attribs.href);
    }
  }
});

test("against the pre-change Offering.tsx: untargeted routes are byte-identical, targeted routes differ only by descriptions and Ask anchors", (t) => {
  const source = baselineSource();
  if (source === null) { t.skip(`baseline ${BASE_COMMIT} not available in this clone; set AHV_OFFERING_BASELINE`); return; }
  const Before = loadOffering(source);
  for (const slug of PRODUCTION_SLUGS) {
    const c = C[slug];
    const before = render(Before, c);
    const after = withoutPackageFacts(render(Offering, c));
    assert.ok(!before.includes(ASK), `${slug}: the baseline had no Ask anchor`);
    if (Object.hasOwn(TARGETS, slug)) {
      assert.notEqual(after, before, `${slug}: the candidate adds the Ask anchors`);
      assert.equal(withoutAsks(after), before, `${slug}: nothing but approved descriptions and Ask anchors changed`);
    } else {
      assert.equal(after, before, `${slug}: unchanged`);
    }
  }
});


test("all 21 programme links show the complete existing overview, without disclosures or truncation", () => {
  let total = 0;
  for (const slug of Object.keys(TARGETS)) {
    const nodes = dom(render(Offering, C[slug]));
    const descriptions = all(nodes, (n) => "data-programme-description" in n.attribs);
    assert.equal(descriptions.length, TARGETS[slug][1]);
    for (const entry of descriptions) {
      const href = entry.attribs["data-programme-description"];
      assert.deepEqual(kids(entry, "p").map(text), PROGRAMME_DESCRIPTIONS[href]);
      assert.equal(all([entry], (n) => ["details", "summary", "button"].includes(n.name)).length, 0);
      assert.equal(entry.attribs.hidden, undefined);
      assert.equal(entry.attribs.style, undefined);
    }
    total += descriptions.length;
    const closed = dom(render(Offering, { ...C[slug], locales: ["de"] }));
    assert.equal(all(closed, (n) => "data-programme-description" in n.attribs).length, 0);
  }
  assert.equal(total, 21);
});

test("every description is copied verbatim from its existing programme source", () => {
  const refs = JSON.parse(fs.readFileSync(path.join(SITE, "test/fixtures/programme-description-sources.json"), "utf8"));
  // AHV-WB.026 adds the /yoga-therapy-individual/ survivor key, verified against the same yoga source.
  assert.equal(Object.keys(refs).length, 12);
  for (const [route, ref] of Object.entries(refs)) {
    const source = fs.readFileSync(path.join(SITE, ref.source), "utf8");
    let expected;
    if (ref.paragraphIds) {
      const about = all(dom(source), (n) => n.name === "section" && n.attribs.id === "about");
      assert.equal(about.length, 1, route);
      expected = ref.paragraphIds.map((id) => {
        const found = all(about, (n) => n.name === "p" && n.attribs["data-dc-tpl"] === id);
        assert.equal(found.length, 1, `${route}: ${id}`);
        return text(found[0]);
      });
    } else {
      const sandbox = { window: {} };
      vm.runInNewContext(source, sandbox);
      expected = [sandbox.window.AHV_YOGA_RETREATS.faqs.find((f) => f.question === "How is the yoga programme personalised?").answer];
    }
    assert.deepEqual(PROGRAMME_DESCRIPTIONS["https://ayurvedichealingvillage.com" + route], expected, route);
  }
});
