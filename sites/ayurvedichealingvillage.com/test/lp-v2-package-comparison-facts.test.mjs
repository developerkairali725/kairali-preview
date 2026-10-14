// DEC-PACKAGE-COMPARISONS (WOPS-AHV-PROGRAMME-DETAILS-20261010-001; rows AHV-WB.007 / .140 / .230 / .468): named
// programme minimum stays and non-price inclusions added to the existing offering cards of four routes. Every inserted
// statement is checked against the hashed sources it was taken from: the programme catalogue
// (public/ahv/assets/all-programs-data.js) and the Ayurveda tariff inclusions (english-candidate/final-rates/strings.en.json,
// the N12 receipt). The production config graph is loaded twice, from the current page sources and from BASE_COMMIT's,
// so the delta is measured, not asserted; the real Offering component renders the result.
//
// AHV_COMPARISON_SOURCE_DIR=<dir> renders <dir>/<slug>.ts in place of the four page files (negative controls);
// AHV_COMPARISON_BASELINE_DIR=<dir> overrides the baseline (default: the four page files at BASE_COMMIT).
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
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
import { reverseTrainAConfig } from "./fixtures/train-a-20261014.mjs";

const require = createRequire(import.meta.url);
const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = (...p) => path.join(SITE, ...p);
// Integration baseline includes the separately released PR377 SEO title; preserve that title as well as all other existing fields.
const BASE_COMMIT = "e93b98054827cd940bc15aae4c62f80e4baa8a56";
const SLUGS = ["treatment-packages", "rejuvenation-detox", "treatment-kerala", "lp-treatment-packages"];
const PAGE = (slug) => P("campaign-v2/production/pages", `${slug}.ts`);
const NOW = new Date(Date.UTC(2026, 9, 10, 12));

// The two fact sources, as hashed in SOURCE-QUALIFICATION (10 Oct 2026). A changed source fails here first.
const CATALOGUE = P("public/ahv/assets/all-programs-data.js");
const TARIFF = P("english-candidate/final-rates/strings.en.json");
const SOURCE_SHA256 = {
  [CATALOGUE]: "0e2536118657369c52cb7c6c66e93458cd36d881b6ca20e778fc9c79b4d68968",
  [TARIFF]: "df4ded50ccdb7dbc04cff609bdd17a248d658e8d3cac480bb520338fef8e5a47",
};
const AYT = "KTAHV/AYT/EN-INR/20260925-R1";

// ── the config graph (TypeScript transpiled and run, so two copies can be loaded side by side) ──────────
function graph(pageSources = {}) {
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const mod = { exports: {} };
    cache.set(filename, mod);
    const text = pageSources[filename] ?? fs.readFileSync(filename, "utf8");
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
    vm.runInNewContext(js, { module: mod, exports: mod.exports, require: req, URL }, { filename });
    return mod.exports;
  }
  return load;
}
const sourcesFrom = (dir) => Object.fromEntries(SLUGS.map((s) => [PAGE(s), fs.readFileSync(path.join(dir, `${s}.ts`), "utf8")]));
function baselineSources() {
  if (process.env.AHV_COMPARISON_BASELINE_DIR) return sourcesFrom(process.env.AHV_COMPARISON_BASELINE_DIR);
  // Exact released source fixtures keep preservation checks runnable in shallow CI checkouts.
  const dir = P("test/fixtures/package-comparison-baseline");
  const provenance = JSON.parse(fs.readFileSync(path.join(dir, "PROVENANCE.json"), "utf8"));
  assert.equal(provenance.sourceCommit, BASE_COMMIT);
  const fixtureData = JSON.parse(fs.readFileSync(path.join(dir, "sources.json"), "utf8"));
  const sources = Object.fromEntries(SLUGS.map((slug) => [PAGE(slug), fixtureData[slug]]));
  for (const slug of SLUGS) assert.equal(crypto.createHash("sha256").update(sources[PAGE(slug)]).digest("hex"), provenance.sha256[slug]);
  return sources;
}
const nowLoad = graph(process.env.AHV_COMPARISON_SOURCE_DIR ? sourcesFrom(process.env.AHV_COMPARISON_SOURCE_DIR) : {});
const wasLoad = graph(baselineSources());
const NOW_M = nowLoad(P("campaign-v2/production/load.ts"));
const WAS_M = wasLoad(P("campaign-v2/production/load.ts"));
const plain = (x) => (x === undefined ? undefined : JSON.parse(JSON.stringify(x)));
/** Deep equality across the vm realms (their arrays have another Array.prototype). */
const same = (a, b, message) => assert.deepEqual(plain(a), plain(b), message);
const NOW_C = Object.fromEntries(NOW_M.PRODUCTION_SLUGS.map((s) => [s, NOW_M.productionCampaign(s)]));
const WAS_C = Object.fromEntries(WAS_M.PRODUCTION_SLUGS.map((s) => [s, WAS_M.productionCampaign(s)]));
const { richText, richLinks } = nowLoad(P("campaign-v2/kit/rich.ts"));
const { PRICE } = nowLoad(P("campaign-v2/kit/lint/pricing.ts"));
const lintNow = nowLoad(P("campaign-v2/kit/lint/index.ts")).lintCampaign;
const lintWas = wasLoad(P("campaign-v2/kit/lint/index.ts")).lintCampaign;

// ── the sources ───────────────────────────────────────────────────────────────────────────────────────
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(CATALOGUE, "utf8"), sandbox);
const PROGRAMMES = sandbox.window.AHV_FINDER.programmes;
const byRoute = (href) => PROGRAMMES.find((p) => href.endsWith(p.route));
const STRINGS = JSON.parse(fs.readFileSync(TARIFF, "utf8"));
const unescape = (s) => s.replace(/&amp;/g, "&");
const INCLUDED = STRINGS.ayurveda.included.map(unescape);

/** Paragraphs this change added: the current card's paragraphs after the baseline card's. */
function added(slug) {
  return NOW_C[slug].page.offering.cards.flatMap((card, i) => {
    const was = WAS_C[slug].page.offering.cards[i]?.paragraphs ?? [];
    return card.paragraphs.slice(was.length).map((text) => ({ card, i, text }));
  });
}
/** The catalogue programmes a statement is about: the names it spells out, else its card's own programme links. */
function programmesOf(text, card) {
  const named = PROGRAMMES.filter((p) => text.includes(p.name));
  return named.length ? named : (card.links ?? []).map((l) => byRoute(l.href)).filter(Boolean);
}
const nightsIn = (s) => [...s.matchAll(/(\d+)\s+nights?\b/g)].map((m) => Number(m[1]));

test("the fact sources are the hashed SOURCE-QUALIFICATION inputs", () => {
  for (const [file, sha] of Object.entries(SOURCE_SHA256)) {
    assert.equal(crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"), sha, path.relative(SITE, file));
  }
});

test("all four routes carry the comparison, and no other route changed", () => {
  const changed = NOW_M.PRODUCTION_SLUGS.filter((s) => JSON.stringify(plain(NOW_C[s])) !== JSON.stringify(plain(WAS_C[s])));
  same(changed.sort(), [...SLUGS].sort(), "exactly the four comparison routes differ from the baseline");
  assert.equal(NOW_M.PRODUCTION_SLUGS.length, 24);
  for (const slug of SLUGS) assert.ok(added(slug).length > 0, `${slug}: a comparison statement was added`);
});

test("only paragraphs were appended: every original card, heading, link, paragraph, CTA and FAQ is unchanged", () => {
  for (const slug of SLUGS) {
    const now = plain(NOW_C[slug]);
    const was = plain(WAS_C[slug]);
    const cardsNow = now.page.offering.cards;
    const cardsWas = was.page.offering.cards;
    assert.equal(cardsNow.length, cardsWas.length, `${slug}: card count`);
    cardsNow.forEach((card, i) => {
      assert.equal(card.title, cardsWas[i].title, `${slug}: card ${i} title/order`);
      same(card.links, cardsWas[i].links, `${slug}: card ${i} full-detail links`);
      same(card.paragraphs.slice(0, cardsWas[i].paragraphs.length), cardsWas[i].paragraphs, `${slug}: card ${i} approved text first and unchanged`);
    });
    // With the added paragraphs removed, the whole campaign is the baseline's: CTA, form, FAQ, metadata and the rest.
    cardsNow.forEach((card, i) => { card.paragraphs = card.paragraphs.slice(0, cardsWas[i].paragraphs.length); });
    // Train A: reverse exactly every merged candidate's recorded config change (batch 8's AHV-WB.015.change Stories
    // addition was rejected and excluded, so none remains on these routes today).
    same(reverseTrainAConfig(slug, now), was, `${slug}: nothing else changed`);
  }
  const links = (slug) => NOW_C[slug].page.offering.cards.flatMap((c) => c.links ?? []).length;
  assert.equal(links("treatment-packages"), 11, "the 11 programme links stay");
  assert.equal(links("rejuvenation-detox"), 3);
});

test("every named minimum stay is the catalogue's, Ayurveda-tariff bound, and no other number is stated", () => {
  for (const slug of SLUGS) {
    for (const { card, i, text } of added(slug)) {
      const progs = programmesOf(text, card);
      assert.ok(progs.length, `${slug} card ${i}: the statement names or links a catalogue programme`);
      for (const p of progs) {
        assert.equal(p.sourceRef, AYT, `${p.name}: an Ayurveda-tariff programme`);
        assert.equal(p.availability, "current", p.name);
      }
      const named = PROGRAMMES.filter((p) => text.includes(p.name));
      for (const p of named) {
        // The first "N nights" after the name is that programme's minimum.
        const after = nightsIn(text.slice(text.indexOf(p.name) + p.name.length));
        assert.equal(after[0], p.minimumNights, `${slug} card ${i}: ${p.name} minimum`);
      }
      const allowed = new Set(progs.map((p) => p.minimumNights));
      for (const n of nightsIn(text)) assert.ok(allowed.has(n), `${slug} card ${i}: ${n} nights is a bound minimum`);
      // No other numeral (no counts, prices, hours or a 21-night generalisation).
      const numbers = [...text.matchAll(/\d[\d,.]*/g)].map((m) => Number(m[0]));
      assert.ok(numbers.every((n) => allowed.has(n)), `${slug} card ${i}: only bound minimums are numerals (${numbers})`);
    }
  }
});

test("inclusions are the Ayurveda tariff's own wording, with the Preventive one-therapy exception", () => {
  const items = (text) => {
    const m = text.match(/(?:Both include|Included:)\s*([^]*?)\.(?:\s|$)/);
    return m ? m[1].replace(/^and |; and /g, "; ").split(/;\s*(?:and\s+)?/).map((s) => s.trim()).filter(Boolean) : [];
  };
  const two = INCLUDED.find((s) => s.startsWith("Two Ayurvedic therapies a day"));
  assert.match(two, /one a day in the Preventive Health & Regenerative programme/, "the tariff's Preventive exception");
  let checked = 0;
  for (const slug of SLUGS) {
    for (const { card, i, text } of added(slug)) {
      const progs = programmesOf(text, card);
      const preventive = progs.some((p) => p.route === "/preventive-and-regenerative-treatment/");
      for (const item of items(text)) {
        checked++;
        if (/^one Ayurvedic therapy a day rather than two$/.test(item)) {
          assert.ok(preventive, `${slug} card ${i}: one therapy a day only for Preventive`);
          assert.equal(STRINGS.ayurveda.notes.one_therapy_note, "The only programme with one therapy a day rather than two.");
          continue;
        }
        assert.ok(INCLUDED.some((src) => src.toLowerCase().startsWith(item.toLowerCase()) || src.toLowerCase() === item.toLowerCase()),
          `${slug} card ${i}: "${item}" is a tariff inclusion (ayurveda.included)`);
        if (/two Ayurvedic therapies/i.test(item)) assert.ok(!preventive, `${slug} card ${i}: Preventive never gets two therapies a day`);
      }
      if (preventive) assert.match(text, /one Ayurvedic therapy a day rather than two/, `${slug} card ${i}: the Preventive card states its exception`);
      assert.doesNotMatch(text, /Private yoga|private sunrise|certificate|theory classes|hours/i, `${slug} card ${i}: no yoga-tariff or training entitlement`);
    }
  }
  assert.ok(checked >= 20, `inclusion items checked: ${checked}`);
  // A card naming Preventive with two-therapy inclusions would be wrong: treatment-packages names the exception in that card.
  const tp = added("treatment-packages").find((a) => a.i === 0).text;
  assert.match(tp, /Preventive Health & Regenerative programme has one therapy a day rather than two/);
});

test("treatment in Kerala: named examples only, no inclusions and no generic stay length", () => {
  for (const { text } of added("treatment-kerala")) {
    assert.match(text, /^For example, /, "an example, not a rule");
    assert.doesNotMatch(text, /Included|include|therap(y|ies) a day|21|normal|usual|typical|most stays/i);
  }
  const faq = NOW_C["treatment-kerala"].faq.find((f) => /length of stay/.test(f.q)).a;
  assert.match(faq, /There is no single duration suitable for every enquiry\./);
  assert.ok(added("treatment-kerala").some(({ text }) => /Your doctor recommends the length of your own stay\./.test(text)));
});

test("no price, cost, cure or new claim: lint errors stay zero and lint warnings are the baseline's", () => {
  for (const slug of SLUGS) {
    for (const { text } of added(slug)) {
      assert.doesNotMatch(text, PRICE, `${slug}: no price`);
      assert.doesNotMatch(text, /₹|\bINR\b|\bUSD\b|\bEUR\b|\bfrom\s+\d|get (a )?price|\bcosts?\b|\brates?\b|tariff|discount/i, `${slug}: no price wording`);
      assert.doesNotMatch(text, /\bcur(e|es|ed|ing)\b|guarantee|suitable for|recommended for|helps|results?\b|relieves/i, `${slug}: no suitability or outcome claim`);
      assert.doesNotMatch(text, /\b(spa|resort|holiday|luxury|journey|guests?)\b/i, `${slug}: KTAHV register`);
      same(richLinks(text), [], `${slug}: no new link`);
      assert.equal(richText(text), text);
    }
    const now = lintNow(NOW_C[slug], NOW);
    const was = lintWas(WAS_C[slug], NOW);
    same(now.errors, [], `${slug}: lint errors`);
    same(plain(now.warnings), plain(was.warnings), `${slug}: no new lint warning`);
  }
  // The LP keeps its no-outbound-link convention: its cards have no links at all.
  assert.ok(NOW_C["lp-treatment-packages"].page.offering.cards.every((c) => !c.links?.length && c.paragraphs.every((t) => richLinks(t).length === 0)));
});

// ── the rendered cards (the real Offering component) ──────────────────────────────────────────────────
const Offering = nowLoad(P("campaign-v2/production/sections/Offering.tsx")).default;
const { uiFor } = nowLoad(P("campaign-v2/production/ui.ts"));
const all = (nodes, pred) => nodes.flatMap((n) => (n instanceof Element ? [...(pred(n) ? [n] : []), ...all(n.children, pred)] : []));
const text = (n) => (n instanceof Text ? n.data : n instanceof Element ? n.children.map(text).join("") : "");
const cls = (n, name) => (n.attribs.class || "").split(/\s+/).includes(name);

test("rendered: each card shows its approved text then the comparison, with links, Ask anchors and the section CTA intact", () => {
  const asks = { "treatment-packages": 11, "rejuvenation-detox": 3, "treatment-kerala": 0, "lp-treatment-packages": 0 };
  for (const slug of SLUGS) {
    const c = NOW_C[slug];
    const nodes = htmlToDOM(renderToStaticMarkup(React.createElement(Offering, { c, o: c.page.offering, v: c.defaultVariant, ui: uiFor(c.locales[0]) })));
    const cards = all(nodes, (n) => n.name === "li" && cls(n, "lp-poffer__card"));
    assert.equal(cards.length, c.page.offering.cards.length, slug);
    cards.forEach((card, i) => {
      const src = c.page.offering.cards[i];
      same(card.children.filter((k) => k instanceof Element && k.name === "p").map(text), src.paragraphs.map(richText), `${slug} card ${i}: rendered paragraphs`);
      same(all([card], (n) => n.name === "a" && cls(n, "lp-poffer__link")).map((a) => a.attribs.href), (src.links ?? []).map((l) => l.href), `${slug} card ${i}: detail links`);
    });
    assert.equal(all(nodes, (n) => n.name === "a" && text(n).trim() === "Ask about this programme").length, asks[slug], `${slug}: Ask anchors (CTA commit)`);
    assert.equal(all(nodes, (n) => n.name === "a" && cls(n, "lp-pcta")).length, 1, `${slug}: the section CTA`);
    assert.equal(all(nodes, (n) => ["form", "input", "select", "button"].includes(n.name)).length, 0, `${slug}: no form element`);
    assert.doesNotMatch(renderToStaticMarkup(React.createElement(Offering, { c, o: c.page.offering, v: c.defaultVariant, ui: uiFor("en") })), PRICE, `${slug}: rendered without a price`);
  }
});
