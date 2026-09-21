#!/usr/bin/env node
/**
 * AHV — the chief physician gets his full name back.
 *
 * OWNER RULING 2026-09-21: "I'll fix the conflations, he takes the claims."
 *
 * CLAUDE.md LOCKED FACTS names two Deepus and forbids conflating them: "Deepu"
 * is the web developer who executes WordPress changes; "Dr. Deepu John" is the
 * chief physician who signs clinical content. On a shipped page the physician's
 * name is always written in full — a bare "Dr Deepu" on a medical byline is
 * exactly the conflation the rulebook names.
 *
 * MEASURED, NOT ASSUMED. Across every payload and view there are 38 strings
 * containing his name. 28 are ALREADY CORRECT and are not touched. Exactly 10
 * are the defective form "Dr Deepu" — no period, no surname — in three files.
 * No other defective spelling exists: zero "Dr. Deepu" without the surname,
 * zero bare "Deepu John" without the title. A first pass over-counted by
 * matching "Deepu John" inside the correct "Dr. Deepu John"; the count is what
 * caught it.
 *
 * IT SITS INSIDE A PATIENT TESTIMONIAL, so this is a deviation from verbatim
 * live copy and is logged as one. The sentence reads "…has a distintive
 * advantage of having Dr Deepu as an experienced doctor…". Only the NAME is
 * corrected: the misspelling "distintive" is the live copy's own and is left
 * exactly as it is — fixing a physician's name on a hospital page is a locked
 * fact, tidying a patient's spelling is not ours to do.
 *
 * NOT TOUCHED: the image filename `karDr.-Deepu-John.webp` and its sourceUrl.
 * The lint flags them, but the filename already contains the full name in
 * hyphenated form and renaming a mined asset changes a path for no reader's
 * benefit. Reported by the lint, deliberately left — a false positive worth
 * seeing rather than silencing.
 *
 *   node tools/repair-physician-name.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const TREES = ["public/ahv/assets", "public/ahv/views"];

/** No period, no surname — and never inside an already-correct full form. */
const WRONG = /Dr Deepu(?! John)/g;
const RIGHT = "Dr. Deepu John";

let fixed = 0, files = 0;
const lines = [];

for (const rel of TREES) {
  const dir = join(SITE, rel);
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (!statSync(path).isFile()) continue;
    const before = readFileSync(path, "utf8");
    const n = (before.match(WRONG) ?? []).length;
    if (!n) continue;
    const after = before.replace(WRONG, RIGHT);
    // Postcondition: the correct form must only ever increase, never decrease.
    const wasOk = (before.match(/Dr\. Deepu John/g) ?? []).length;
    const nowOk = (after.match(/Dr\. Deepu John/g) ?? []).length;
    if (nowOk !== wasOk + n) {
      console.error(`FAIL — ${name}: expected ${wasOk + n} correct forms after the fix, got ${nowOk}.`);
      process.exit(1);
    }
    files += 1; fixed += n;
    lines.push(`  ${String(n).padStart(3)}  ${rel}/${name}`);
    if (!DRY) writeFileSync(path, after);
  }
}

let left = 0;
for (const rel of TREES) {
  const dir = join(SITE, rel);
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isFile()) continue;
    left += (readFileSync(p, "utf8").match(WRONG) ?? []).length;
  }
}
if (!DRY && left) { console.error(`FAIL — ${left} defective spelling(s) survive.`); process.exit(1); }

console.log(`${DRY ? "[dry] " : ""}physician name: ${fixed} occurrence(s) corrected across ${files} file(s)`);
for (const l of lines) console.log(l);
console.log(`\nremaining "Dr Deepu" without the surname: ${left}`);
console.log(`Left alone on purpose: the live copy's own misspelling "distintive", and the`);
console.log(`  karDr.-Deepu-John.webp filename, which already carries the full name.`);
