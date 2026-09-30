#!/usr/bin/env node
/**
 * AHV — "guest" leaves the alt text.
 *
 * WHY. The KTAHV clinical lock bans "guest"/"guests" outright: this is a
 * NABH-accredited hospital and the register is patient / physician / treatment
 * / programme. Measured across the 254 prerendered routes, 81 distinct alt
 * texts on 47 routes used it — "Therapists applying warm oil along a guest's
 * leg", "Kairali therapist treating a smiling guest". That is alt text the
 * build authored, not verbatim live copy, so it is ours to fix and there is no
 * SEO argument for keeping it.
 *
 * ALT TEXT IS NOT DECORATION. It is what a screen-reader user hears and what an
 * image search indexes, so the register binds there exactly as it does in body
 * copy — arguably harder, because a blind patient hears it and cannot see the
 * page that would otherwise set the tone.
 *
 * SCOPE, DELIBERATELY NARROW: only the value inside an alt attribute, in either
 * spelling the payloads use — the JSON `"alt":"…"` form and the raw HTML
 * `alt="…"` form. Body copy is untouched; verbatim live prose keeps its own
 * register debt, which is the owner's parked decision, not this tool's.
 *
 * NOT TOUCHED: award and property proper nouns elsewhere in the alt set
 * ("World Luxury Spa Awards", "Kairali Ayurvedic Health Resort"). An award is
 * named what it is named — the register rule says so — and none of them
 * contains "guest", so the narrow scope here cannot reach them.
 *
 *   node tools/repair-alt-register.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");

const TREES = [
  ["public/ahv/assets", (f) => f.endsWith(".js")],
  ["public/ahv/views", (f) => f.endsWith(".json")],
  ["public/ahv/components", (f) => f.endsWith(".dc.html")],
];

/** Whole word, case preserved. Possessive apostrophes survive untouched. */
function deGuest(value) {
  return value
    .replace(/\bGuests\b/g, "Patients")
    .replace(/\bGuest\b/g, "Patient")
    .replace(/\bguests\b/g, "patients")
    .replace(/\bguest\b/g, "patient");
}

/** Rewrite only the INSIDE of each alt value, leaving the markup alone. */
function rewriteAlts(src) {
  let n = 0;
  let out = src.replace(/("alt"\s*:\s*")((?:[^"\\]|\\.)*)(")/g, (m, a, v, b) => {
    const fixed = deGuest(v);
    if (fixed !== v) n += 1;
    return a + fixed + b;
  });
  out = out.replace(/(\salt=")([^"]*)(")/g, (m, a, v, b) => {
    const fixed = deGuest(v);
    if (fixed !== v) n += 1;
    return a + fixed + b;
  });
  // A view payload carries its template as a JSON STRING, so its alt attributes
  // arrive escaped: alt=\"…\". Missing this form found 27 of 81 on the first
  // run — the asset payloads only. The count is the tell: fix what the render
  // actually emits, not what one spelling happens to reach.
  out = out.replace(/(alt=\\")((?:[^"\\]|\\[^"])*)(\\")/g, (m, a, v, b) => {
    const fixed = deGuest(v);
    if (fixed !== v) n += 1;
    return a + fixed + b;
  });
  // Some payloads are hand-written JS objects with UNQUOTED keys: alt: "…".
  // Missing this left 3 of 226 behind, on ayurveda-gallery and knowledge-centre.
  // Three spellings of the same attribute, in one codebase — so the postcondition
  // below checks all three rather than trusting any single pass.
  out = out.replace(/(\balt:\s*")((?:[^"\\]|\\.)*)(")/g, (m, a, v, b) => {
    const fixed = deGuest(v);
    if (fixed !== v) n += 1;
    return a + fixed + b;
  });
  return { out, n };
}

let files = 0, fixed = 0;
const report = [];

for (const [rel, keep] of TREES) {
  const abs = join(SITE, rel);
  if (!existsSync(abs)) continue;
  for (const name of readdirSync(abs).filter(keep)) {
    const path = join(abs, name);
    const before = readFileSync(path, "utf8");
    const { out, n } = rewriteAlts(before);
    if (!n) continue;
    files += 1; fixed += n;
    report.push([`${rel}/${name}`, n]);
    if (!DRY) writeFileSync(path, out);
  }
}

// Postcondition: no alt value anywhere may still carry the word.
let left = 0;
for (const [rel, keep] of TREES) {
  const abs = join(SITE, rel);
  if (!existsSync(abs)) continue;
  for (const name of readdirSync(abs).filter(keep)) {
    const s = readFileSync(join(abs, name), "utf8");
    for (const re of [/"alt"\s*:\s*"((?:[^"\\]|\\.)*)"/g, /\salt="([^"]*)"/g, /alt=\\"((?:[^"\\]|\\[^"])*)\\"/g, /\balt:\s*"((?:[^"\\]|\\.)*)"/g]) {
      for (const m of s.matchAll(re)) if (/\bguests?\b/i.test(m[1])) left += 1;
    }
  }
}
if (!DRY && left) {
  console.error(`FAIL — ${left} alt value(s) still carry the banned word after the pass.`);
  process.exit(1);
}

console.log(`${DRY ? "[dry] " : ""}alt register: ${fixed} alt value(s) corrected across ${files} file(s)`);
for (const [f, n] of report.sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${f}`);
console.log(`\nremaining alt values carrying the word: ${left}`);
console.log(`Body copy untouched — the parked EN register debt is the owner's decision, not this tool's.`);
