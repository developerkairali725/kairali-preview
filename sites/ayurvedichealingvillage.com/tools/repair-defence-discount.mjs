#!/usr/bin/env node
/**
 * AHV — the defence/paramilitary discount stops contradicting itself.
 *
 * THE INSTRUCTION (Abilash, in-chat, 2026-09-21, answering a direct question):
 * "20% is real — fix the 30s in the copy", and leave the slug alone because it
 * is a live ranking URL.
 *
 * THE CONTRADICTION, measured across the rebuild before anything was changed:
 *
 *   /offers/defence-paramilitary-personnel-get-upto-30-off/
 *       slug says 30 · H1 says "get upto 20% OFF" · tiers 10 / 15 / 20 by nights
 *   /defence-and-paramilitary-forces/
 *       "Kairali is offering 30% discount ... on all our treatment packages"
 *       "Kairali will provide up to 30% discount on Booking amount only"
 *   the campaign offer band
 *       figure "30%", eligibility "Up to 30% Off for Senior Citizen, Olympic and
 *       Paralympics Athlete, Defence and Paramilitary Personnel"
 *
 * WHAT SETTLED IT WITHOUT GUESSING. The two SIBLING offer pages were measured
 * too: the senior-citizen page reads "Up to 20% Off" and the Olympics page
 * "Up to 20% OFF" with the identical 10/15/20 night tiers. All three
 * destination pages say 20 with the same structure, so the band's "Upto 30%"
 * over-promises against every page it links to, and the flat "30% on all our
 * treatment packages" contradicts a table that starts at 10%.
 *
 * A PREVIOUSLY PARKED ITEM, now unparked. article-family-data.js carries its own
 * governance record of this exact discrepancy — discountWording.ruling, and a
 * privateGate reading "30% body and up-to 30% terms differ; preserve both exact
 * source statements pending current business confirmation." Today's answer IS
 * that business confirmation.
 *
 * WHAT IT DELIBERATELY DOES NOT TOUCH:
 *   · the slug /offers/...-get-upto-30-off/ — a live ranking URL; changing it is
 *     a redirect, not an edit, and the owner ruled it stays;
 *   · the governance metadata in article-family-data.js — it describes the LIVE
 *     SOURCE, which still says 30, and that remains true;
 *   · "A non-refundable deposit of 30%" in hist9-family-data.js — a deposit is
 *     not a discount;
 *   · width: min(112px,30%) in story-family-render.js — CSS;
 *   · the 9 "Get Upto 30% OFF" strings on /testing/ (utility7-family-data.js) —
 *     a noindex placeholder page carrying Etudes boilerplate. Reported, not
 *     edited: whether that page ships at all is a separate question.
 *
 * Idempotent, asserted: every replacement declares the number of occurrences it
 * expects and the run FAILS rather than half-applying if the payload has moved.
 *
 *   node tools/repair-defence-discount.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const A = join(SITE, "public/ahv/assets");

/** file, exact from, exact to, how many occurrences must exist BEFORE the fix. */
const EDITS = [
  ["article-family-data.js",
    "Kairali is offering 30% discount enchantingly on all our treatment packages",
    "Kairali is offering up to 20% discount enchantingly on all our treatment packages", 2],
  ["article-family-data.js",
    "Kairali will provide up to 30% discount on Booking amount only.",
    "Kairali will provide up to 20% discount on Booking amount only.", 2],
  ["campaign-family-data.js", '"figure":"30%"', '"figure":"20%"', 2],
  ["campaign-family-data.js",
    "Up to 30% Off for Senior Citizen", "Up to 20% Off for Senior Citizen", 1],
  ["campaign-family-data.js",
    "Upto 30% Off for Senior Citizen", "Upto 20% Off for Senior Citizen", 1],
];

/** Left alone on purpose. Counted every run so a silent drift is visible. */
const UNTOUCHED = [
  ["hist9-family-data.js", "deposit of 30%", "a deposit, not a discount"],
  ["utility7-family-data.js", "Get Upto 30% OFF", "/testing/ placeholder page, noindex"],
];

let applied = 0, already = 0;
const lines = [];

for (const [file, from, to, expect] of EDITS) {
  const p = join(A, file);
  if (!existsSync(p)) { console.error(`FAIL — missing ${file}`); process.exit(1); }
  const before = readFileSync(p, "utf8");
  const n = before.split(from).length - 1;
  const done = before.split(to).length - 1;
  if (n === 0 && done >= expect) { already += done; lines.push(`  · ${file}  ${done}×  already applied`); continue; }
  if (n !== expect) {
    console.error(`FAIL — ${file}: expected ${expect} occurrence(s) of:\n    ${from}\n  found ${n}. The payload moved; re-derive the target rather than half-applying.`);
    process.exit(1);
  }
  if (!DRY) writeFileSync(p, before.split(from).join(to));
  applied += n;
  lines.push(`  · ${file}  ${n}×  ${from.slice(0, 52)}…`);
}

console.log(`${DRY ? "[dry] " : ""}30% → 20%: ${applied} replacement(s)${already ? `, ${already} already in place` : ""}`);
for (const l of lines) console.log(l);

console.log("\nLEFT ALONE, deliberately:");
for (const [file, needle, why] of UNTOUCHED) {
  const c = readFileSync(join(A, file), "utf8").split(needle).length - 1;
  console.log(`  · ${String(c).padStart(2)}×  "${needle}"  in ${file} — ${why}`);
}
console.log(`  ·  1×  the slug /offers/defence-paramilitary-personnel-get-upto-30-off/ — live ranking URL, owner ruled it stays`);
console.log(`\nRe-prerender the affected routes; the snapshot is served to crawlers and does not update itself.`);
