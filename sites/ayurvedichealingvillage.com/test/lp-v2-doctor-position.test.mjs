// Owner, 10 Oct 2026 (WOPS-AHV-DOCTOR-POSITION-20261010-001): on the first four live ad routes the complete existing
// doctors section moves up as-is, immediately after the lead and before the offering. The other 20 routes keep their
// variant's default order (doctors directly before the enquiry). Source-level: the template is TSX and is not rendered
// here (no browser, no build); the order it renders is production/section-order.ts, exercised with the real configs.
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
const LATER = PRODUCTION_SLUGS.filter((s) => !FIRST4.includes(s));
const variantOf = (slug) => C[slug].defaultVariant ?? "A";
/** The four routes' new orders (batch 1 writes no films band). */
const NEW_ORDER = {
  "treatment-packages": ["lead", "physicians", "offering", "pathway", "rest", "place", "stay"],
  "panchakarma": ["lead", "physicians", "offering", "pathway", "rest", "place", "stay"],
  "pain-management": ["lead", "physicians", "offering", "pathway", "rest", "place", "stories", "stay"],
  "family-ayurvedic-retreat": ["lead", "physicians", "offering", "pathway", "rest", "place", "stories", "stay"],
};

/** The commit this candidate was cut from; the order and the untouched files are compared against it when present. */
const BASE = "a831a634828cdbee83fac381f06ea618714fe2cd";
const git = (...args) => execFileSync("git", args, { cwd: SITE, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
const hasBase = (() => { try { git("cat-file", "-e", `${BASE}^{commit}`); return true; } catch { return false; } })();

/** The order the template rendered at BASE: its own ORDER table and band filter, read from the base source. */
function baseOrder(slug) {
  const src = git("show", `${BASE}:./campaign-v2/production/ProductionPage.tsx`);
  const table = src.slice(src.indexOf("const ORDER"), src.indexOf("};", src.indexOf("const ORDER")));
  const order = Object.fromEntries([...table.matchAll(/([ABCD]): \[([^\]]+)\]/g)].map(([, v, l]) => [v, [...l.matchAll(/"(\w+)"/g)].map((m) => m[1])]));
  assert.match(src, /const order = ORDER\[v\]\.filter\(\(b\) => \(b === "rest" \? !!page\.rest : b === "place" \? !!page\.place : b === "stories" \? !!page\.stories : true\)\);/);
  const page = C[slug].page;
  return order[variantOf(slug)].filter((b) => (b === "rest" ? !!page.rest : b === "place" ? !!page.place : b === "stories" ? !!page.stories : true));
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

test("allowlist: exactly the four first routes, all variant A", () => {
  assert.deepEqual([...DOCTORS_AFTER_LEAD], FIRST4);
  for (const slug of FIRST4) assert.equal(variantOf(slug), "A", slug);
  assert.equal(PRODUCTION_SLUGS.length, 24);
  assert.equal(LATER.length, 20);
});

test("first four: the doctors immediately after the lead, before the offering; every other section in its own order", () => {
  for (const slug of FIRST4) {
    const order = sectionOrder(C[slug], variantOf(slug));
    assert.deepEqual(order, NEW_ORDER[slug], slug);
    assert.equal(order.filter((b) => b === "physicians").length, 1, `${slug}: doctors once`);
    assert.equal(new Set(order).size, order.length, `${slug}: no section twice`);
    assert.deepEqual(order.filter((b) => b !== "physicians"), ORDER.A.filter((b) => b !== "physicians" && order.includes(b)), `${slug}: other sections keep their relative order`);
  }
});

test("other 20 routes: their variant's default order, doctors last before the enquiry", () => {
  for (const slug of LATER) {
    const v = variantOf(slug);
    const order = sectionOrder(C[slug], v);
    assert.deepEqual(variantOrder(slug, v), [...ORDER[v]], slug);
    assert.deepEqual(order, ORDER[v].filter((b) => order.includes(b)), slug);
    assert.equal(order.at(-1), "physicians", slug);
  }
  // The default tables (variant order for every non-allowlisted route) are the 8 Oct ones.
  assert.deepEqual(ORDER, {
    A: ["lead", "offering", "pathway", "rest", "place", "stories", "stay", "physicians"],
    B: ["lead", "place", "offering", "pathway", "stories", "stay", "physicians"],
    C: ["lead", "offering", "pathway", "rest", "place", "stories", "stay", "physicians"],
    D: ["lead", "offering", "pathway", "stay", "physicians"],
  });
  // Pure: the helper never mutates the shared table.
  variantOrder("panchakarma", "A");
  assert.equal(ORDER.A.at(-1), "physicians");
});

test("against the base template: 20 routes identical; the first four only move the doctors, nothing lost or added", { skip: !hasBase && "base commit not in this checkout" }, () => {
  for (const slug of LATER) assert.deepEqual(sectionOrder(C[slug], variantOf(slug)), baseOrder(slug), slug);
  for (const slug of FIRST4) {
    const before = baseOrder(slug);
    const after = sectionOrder(C[slug], variantOf(slug));
    assert.equal(before.at(-1), "physicians", `${slug}: was directly before the enquiry`);
    assert.deepEqual([...after].sort(), [...before].sort(), `${slug}: same sections`);
    assert.deepEqual(after.filter((b) => b !== "physicians"), before.filter((b) => b !== "physicians"), slug);
  }
});

test("the doctors section is moved as-is: its props are the route's existing copy and roster", () => {
  for (const slug of FIRST4) {
    const c = C[slug];
    assert.deepEqual(c.page.doctors, COPY[slug].page.doctors, `${slug}: heading and intro from the reviewed copy`);
    assert.deepEqual(c.doctors.map((d) => d.id), [...CURRENT_ROSTER], slug);
  }
});

// Candidate proof against BASE: re-pin (or drop) when one of these files later changes under its own authority.
test("untouched: the doctors component, doctor data, styles and the four routes' copy are byte-identical to the base", { skip: !hasBase && "base commit not in this checkout" }, () => {
  const files = [
    "campaign-v2/production/sections/Physicians.tsx", "campaign-v2/data/doctors.ts", "campaign-v2/production/production.css",
    ...FIRST4.map((s) => `campaign-v2/production/pages/${s}.ts`),
  ];
  for (const f of files) {
    assert.equal(git("hash-object", f).trim(), git("rev-parse", `${BASE}:./${f}`).trim(), f);
  }
});
