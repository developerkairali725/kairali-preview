// Owner, 10 Oct 2026 (WOPS-AHV-DOCTOR-POSITION-20261010-001): on every live ad route — the first four (batch 1), then
// the remaining 20 (batch 2) — the complete existing doctors section moves up as-is, immediately after the lead. Every
// other section keeps its relative order. Source-level: the template is TSX and is not rendered here (no browser, no
// build); the order it renders is production/section-order.ts, exercised with the real configs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { ROUTES } from "../campaign-v2/production/bindings.ts";
import { COPY } from "../campaign-v2/production/pages/index.ts";
import { CURRENT_ROSTER } from "../campaign-v2/data/doctors.ts";
import { DOCTORS_AFTER_LEAD, ORDER, sectionOrder, variantOrder } from "../campaign-v2/production/section-order.ts";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");
const C = Object.fromEntries(PRODUCTION_SLUGS.map((s) => [s, productionCampaign(s)]));
const FIRST4 = ["treatment-packages", "panchakarma", "pain-management", "family-ayurvedic-retreat"];
/** Batch 2: the remaining 20 route families (deliverables batch02/SCOPE.json), with their variant and locale. */
const REMAINING20 = {
  "monsoon-wellness": ["C", "en"], "rejuvenation-detox": ["C", "en"], "ayurveda-retreat": ["B", "en"], "wellness-kerala": ["B", "en"],
  "cleansing-centre": ["A", "en"], "treatment-kerala": ["A", "en"], "south-india-cities": ["D", "en"], "brand": ["D", "en"],
  "weight-management": ["C", "en"], "lp-south-india": ["D", "en"], "lp-hospital-kerala": ["A", "en"], "lp-brand": ["D", "en"],
  "lp-cleansing-centre": ["A", "en"], "lp-pain-management": ["A", "en"], "lp-panchakarma": ["D", "en"], "lp-treatment-kerala": ["C", "en"],
  "lp-treatment-packages": ["B", "en"], "lp-weight-management": ["A", "en"], "lp-behandlung-kerala": ["C", "de"], "lp-treatment-kerala-ru": ["C", "ru"],
};
const variantOf = (slug) => C[slug].defaultVariant ?? "A";

const A7 = ["lead", "physicians", "offering", "pathway", "rest", "place", "stay"];
const A8 = ["lead", "physicians", "offering", "pathway", "rest", "place", "stories", "stay"];
const B7 = ["lead", "physicians", "place", "offering", "pathway", "stories", "stay"];
const C7 = ["lead", "physicians", "offering", "pathway", "rest", "place", "stay"];
const C8 = ["lead", "physicians", "offering", "pathway", "rest", "place", "stories", "stay"];
const D5 = ["lead", "physicians", "offering", "pathway", "stay"];
/** Every route's new order (a route shows only the bands its copy writes). */
const NEW_ORDER = {
  "treatment-packages": A7, "panchakarma": A7, "pain-management": A8, "family-ayurvedic-retreat": A8,
  "monsoon-wellness": C8, "rejuvenation-detox": C8, "ayurveda-retreat": B7, "wellness-kerala": B7, "cleansing-centre": A8,
  "treatment-kerala": A8, "south-india-cities": D5, "brand": D5, "weight-management": C7, "lp-south-india": D5,
  "lp-hospital-kerala": A8, "lp-brand": D5, "lp-cleansing-centre": A8, "lp-pain-management": A8, "lp-panchakarma": D5,
  "lp-treatment-kerala": C8, "lp-treatment-packages": B7, "lp-weight-management": A7, "lp-behandlung-kerala": C7, "lp-treatment-kerala-ru": C7,
};

/** Before any move (8 Oct order), and after batch 1 (the first four moved); compared against when present. */
const BASE = "a831a634828cdbee83fac381f06ea618714fe2cd";
const BATCH1 = "16a0f478452fa9cd1c1515e009e17c62a39f11f7";
const git = (...args) => execFileSync("git", args, { cwd: SITE, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
const hasCommit = (sha) => { try { git("cat-file", "-e", `${sha}^{commit}`); return true; } catch { return false; } };
const hasBase = hasCommit(BASE);
const hasBatch1 = hasCommit(BATCH1);
const bandFilter = (page) => (b) => (b === "rest" ? !!page.rest : b === "place" ? !!page.place : b === "stories" ? !!page.stories : true);

/** The order the template rendered at BASE: its own ORDER table and band filter, read from the base source. */
function baseOrder(slug) {
  const src = git("show", `${BASE}:./campaign-v2/production/ProductionPage.tsx`);
  const table = src.slice(src.indexOf("const ORDER"), src.indexOf("};", src.indexOf("const ORDER")));
  const order = Object.fromEntries([...table.matchAll(/([ABCD]): \[([^\]]+)\]/g)].map(([, v, l]) => [v, [...l.matchAll(/"(\w+)"/g)].map((m) => m[1])]));
  assert.match(src, /const order = ORDER\[v\]\.filter\(\(b\) => \(b === "rest" \? !!page\.rest : b === "place" \? !!page\.place : b === "stories" \? !!page\.stories : true\)\);/);
  return order[variantOf(slug)].filter(bandFilter(C[slug].page));
}

/** The variant-C chapter numbers ProductionPage's `sec()` assigns, in reading order (its rule, read from the source). */
function chapters(order, v) {
  const src = read("campaign-v2/production/ProductionPage.tsx");
  const list = src.match(/const CHAPTERED: Block\[\] = \[([^\]]+)\];/)[1].match(/"(\w+)"/g).map((s) => s.slice(1, -1));
  let n = 0;
  return Object.fromEntries(order.filter((b) => v === "C" && list.includes(b)).map((b) => [b, String(++n).padStart(2, "0")]));
}

test("template: ProductionPage renders section-order.ts's order between proof and enquiry, the doctors section unchanged and once", () => {
  const src = read("campaign-v2/production/ProductionPage.tsx");
  assert.match(src, /import \{ sectionOrder, type Block \} from "\.\/section-order\.ts";/);
  assert.equal((src.match(/sectionOrder\(/g) ?? []).length, 1);
  assert.match(src, /const order = sectionOrder\(c, v\);/);
  assert.doesNotMatch(src, /const ORDER\b/, "one order table, in section-order.ts");
  const main = src.slice(src.indexOf("<main"), src.indexOf("</main>"));
  const at = ["<Hero ", "<ProofStrip ", "{order.map(render)}", "<Enquiry ", "<Faq "].map((s) => {
    assert.equal(main.split(s).length - 1, 1, `${s} once`);
    return main.indexOf(s);
  });
  assert.deepEqual([...at].sort((a, b) => a - b), at, "hero → proof → designed sections → enquiry → FAQ");
  // The existing section, with its configured props, is the only physician rendering: no strip, summary or new CTA.
  assert.equal((src.match(/<Physicians\b/g) ?? []).length, 1);
  assert.match(src, /case "physicians": return <Physicians key=\{b\} c=\{c\} d=\{page\.doctors\} \{\.\.\.sec\(b\)\} \/>;/);
  assert.match(src, /export const PRODUCTION_VARIANT: Variant = "A";/);
  assert.match(src, /const v = c\.defaultVariant \?\? PRODUCTION_VARIANT;/);
});

test("allowlist: the first four, then exactly the remaining 20 route families, with their variants and locales", () => {
  assert.equal(PRODUCTION_SLUGS.length, 24);
  assert.deepEqual([...DOCTORS_AFTER_LEAD], [...FIRST4, ...Object.keys(REMAINING20)]);
  assert.deepEqual([...DOCTORS_AFTER_LEAD].sort(), [...PRODUCTION_SLUGS].sort(), "every live route, each once");
  for (const slug of FIRST4) assert.equal(variantOf(slug), "A", slug);
  for (const [slug, [v, locale]] of Object.entries(REMAINING20)) {
    assert.equal(variantOf(slug), v, slug);
    assert.equal(C[slug].locales[0], locale, slug);
  }
});

test("every route: the doctors once, immediately after the lead; every other section in its variant's order", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const v = variantOf(slug);
    const order = sectionOrder(C[slug], v);
    assert.deepEqual(order, NEW_ORDER[slug], slug);
    assert.equal(order.indexOf("physicians"), order.indexOf("lead") + 1, `${slug}: right after the lead`);
    assert.equal(order.filter((b) => b === "physicians").length, 1, `${slug}: doctors once`);
    assert.equal(new Set(order).size, order.length, `${slug}: no section twice`);
    assert.deepEqual(order.filter((b) => b !== "physicians"), ORDER[v].filter((b) => b !== "physicians" && order.includes(b)), `${slug}: other sections keep their relative order`);
  }
});

test("helper: the default tables are the 8 Oct ones and stay untouched; an unlisted slug keeps its default", () => {
  assert.deepEqual(ORDER, {
    A: ["lead", "offering", "pathway", "rest", "place", "stories", "stay", "physicians"],
    B: ["lead", "place", "offering", "pathway", "stories", "stay", "physicians"],
    C: ["lead", "offering", "pathway", "rest", "place", "stories", "stay", "physicians"],
    D: ["lead", "offering", "pathway", "stay", "physicians"],
  });
  for (const v of ["A", "B", "C", "D"]) {
    assert.deepEqual(variantOrder("not-a-listed-route", v), [...ORDER[v]], v);
    variantOrder("panchakarma", v); // pure: never mutates the shared table
    assert.equal(ORDER[v].at(-1), "physicians", v);
  }
});

test("against the base template: all 24 only move the doctors from last to after the lead, nothing lost or added", { skip: !hasBase && "base commit not in this checkout" }, () => {
  for (const slug of PRODUCTION_SLUGS) {
    const before = baseOrder(slug);
    const after = sectionOrder(C[slug], variantOf(slug));
    assert.equal(before.at(-1), "physicians", `${slug}: was directly before the enquiry`);
    assert.deepEqual([...after].sort(), [...before].sort(), `${slug}: same sections`);
    assert.deepEqual(after.filter((b) => b !== "physicians"), before.filter((b) => b !== "physicians"), slug);
  }
});

test("batch 1 regression: the first four render exactly as committed in batch 1", { skip: !hasBatch1 && "batch-1 commit not in this checkout" }, () => {
  const src = git("show", `${BATCH1}:./campaign-v2/production/section-order.ts`);
  const decl = src.indexOf("export const DOCTORS_AFTER_LEAD");
  const list = src.slice(src.indexOf("=", decl), src.indexOf("];", decl));
  assert.deepEqual([...list.matchAll(/"([\w-]+)"/g)].map((m) => m[1]), FIRST4);
  for (const slug of FIRST4) assert.deepEqual(sectionOrder(C[slug], "A"), NEW_ORDER[slug], slug);
});

test("variant C keeps numbering its chapters in reading order: the doctors are now 01, the rest shift by one", () => {
  for (const [slug, [v]] of Object.entries(REMAINING20)) {
    if (v !== "C") continue;
    assert.deepEqual(chapters(sectionOrder(C[slug], "C"), "C"), { physicians: "01", offering: "02", pathway: "03", place: "04", stay: "05" }, slug);
  }
  // No numbers outside C.
  for (const slug of PRODUCTION_SLUGS) if (variantOf(slug) !== "C") assert.deepEqual(chapters(sectionOrder(C[slug], variantOf(slug)), variantOf(slug)), {}, slug);
});

test("the doctors section is moved as-is: its props are the route's existing copy and roster", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const c = C[slug];
    const en = (ROUTES[slug].locale ?? "en") === "en";
    assert.deepEqual(c.page.doctors, COPY[slug].page.doctors, `${slug}: heading and intro from the reviewed copy`);
    // English routes show the roster; the German and Russian reviewed copy presents Dr. Deepu John only (unchanged).
    assert.deepEqual(c.doctors.map((d) => d.id), en ? [...CURRENT_ROSTER] : ["deepu-john"], slug);
  }
});

// Candidate proof against BASE: re-pin (or drop) when one of these files later changes under its own authority.
test("untouched: the doctors component, doctor data, shared locale strings, styles and every route's copy are byte-identical to the base", { skip: !hasBase && "base commit not in this checkout" }, () => {
  const files = [
    "campaign-v2/production/sections/Physicians.tsx", "campaign-v2/data/doctors.ts", "campaign-v2/production/production.css",
    "campaign-v2/production/ui.ts", "campaign-v2/sections/head.tsx",
    ...PRODUCTION_SLUGS.map((s) => `campaign-v2/production/pages/${s}.ts`),
  ];
  for (const f of files) {
    assert.equal(git("hash-object", f).trim(), git("rev-parse", `${BASE}:./${f}`).trim(), f);
  }
});
