// arogyashala.in integrity gate — pins the page to its rulings so later edits
// cannot drift: no invented counts, no commercial figures, no cure claims,
// no group-1908 conflation, redirects cover every legacy URL.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, "..");
// Guards judge the SHIPPED COPY, not our own annotations: strip comments.
const page = readFileSync(join(site, "app/page.tsx"), "utf8")
  .replace(/^\s*\/\/[^\n]*$/gm, "") // full-line comments only — never URLs' "//"
  .replace(/\/\*[\s\S]*?\*\//g, "");
const config = readFileSync(join(site, "next.config.ts"), "utf8");

test("no outlet counts, locations, or commercial figures (roster blocked, commercials gated)", () => {
  // "tier-2/tier-3 cities" is legitimate; counted NOUNS are not.
  assert.doesNotMatch(page, /\d+\s*\+?\s*(outlets|stores|counters|centres|centers|shops)\b/i);
  assert.doesNotMatch(page, /₹|lakh|crore|investment|royalty|margin\b|franchise fee/i);
  assert.doesNotMatch(page, /our locations|store locator/i);
});

test("no cure-claim language survives from the legacy site (compliance floor)", () => {
  assert.doesNotMatch(page, /\bcures?\b|without any side effects|relieve.*diseases|treats? (disease|ailment)/i);
});

test("1908 appears ONLY as family-lineage phrasing, and rolling numbers are computed", () => {
  const groupClaim = /(Group|Kairali Ayurvedic Group)[^.]{0,40}[Ss]ince 1908/;
  assert.doesNotMatch(page, groupClaim, "1908 must never attach to the Group");
  assert.match(page, /family\s+(that has practised|practising)\s+Ayurveda/i);
  assert.match(page, /new Date\(\)\.getFullYear\(\) - 1908/, "lineage years must be computed");
  assert.match(page, /new Date\(\)\.getFullYear\(\) - 1989/, "group years must be computed");
  assert.doesNotMatch(page, /\b1[0-9]{2}\s*\+?\s*years/i, "no typed rolling year counts");
});

test("counters are never implied to give treatment (physician-implication guard)", () => {
  assert.match(page, /treatment belong[s]? with physicians/i);
  assert.doesNotMatch(page, /consultation at (the|your) counter/i);
});

test("redirect map covers every mined legacy page, single-hop", () => {
  const mined = readdirSync(join(site, "../../content-mined/arogyashala.co.in"))
    .filter((f) => f.endsWith(".html") && f !== "home.html")
    .map((f) => "/" + f.replace(/\.html$/, ".aspx"));
  for (const p of mined) {
    assert.ok(config.includes(`"${p}"`), `legacy URL ${p} has no redirect fate`);
  }
  // single-hop: destinations are final pages, never other redirects
  assert.doesNotMatch(config, /destination:\s*"\/[a-z-]+\.aspx"/);
});

test("locked contact facts only: info@kairali.com + the interim 38797 WhatsApp", () => {
  assert.match(page, /info@kairali\.com/);
  assert.doesNotMatch(page, /38777/, "…38777 is the WRONG number, fix on sight");
  assert.match(page, /919289838797/);
});
