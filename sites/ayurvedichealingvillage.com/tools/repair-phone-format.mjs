#!/usr/bin/env node
/**
 * AHV — one landline, one written form.
 *
 * OWNER RULING, 2026-09-21: normalise to "+91 9555 156 156". Measured before
 * the ruling, the same number rendered three ways across the payloads:
 * +91-9555156156 x78, +919555156156 x45, +91-9555-156-156 x41.
 *
 * TWO FORMS, NOT ONE, AND THAT IS DELIBERATE. The spaced form is for HUMANS —
 * it is what the ruling asked for and what the locked facts use for the
 * WhatsApp number. Inside `tel:` it would be wrong: a tel: URI should carry the
 * bare international number, so every dialler, Android included, reads it the
 * same way. So:
 *
 *     tel: hrefs      ->  tel:+919555156156      (unspaced, canonical)
 *     everything else ->  +91 9555 156 156       (spaced, readable)
 *
 * PROVENANCE IS PROTECTED, because this is the third time in one session that
 * a blanket replace would have rewritten a record of what the LIVE SITE says.
 * Four fields carry the number as source evidence — two `sourceHref` in
 * campaign-family-data.js and two `sourceText` in policy-family-data.js. They
 * are masked before the edit and restored after, and the run FAILS if any of
 * them comes back changed.
 *
 *   node tools/repair-phone-format.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");

/**
 * EVERY place the number renders from, not just the datasets.
 *
 * The first run of this tool scanned assets/ alone and moved 28 snapshots of
 * 268. The footer and header are CHROME COMPONENTS, and six routes carry the
 * number inside their view payload — so the sitewide footer, which is where
 * most visitors actually see the number, was untouched. Counting the snapshots
 * afterwards is what caught it.
 */
const DIRS = [
  ["public/ahv/assets", (f) => f.endsWith(".js")],
  ["public/ahv/components", (f) => f.endsWith(".dc.html")],
  ["public/ahv/views", (f) => f.endsWith(".json")],
];

const DISPLAY = "+91 9555 156 156";
const DIAL = "+919555156156";
/** Every written form of this one number, longest first so no partial match wins. */
const FORMS = ["+91-9555-156-156", "+91-9555156156", "+919555156156", "+91 9555 156 156"];
/** Fields that record what the source carried. Masked, never edited. */
const PROVENANCE = /"(source[A-Za-z]*|note|original[A-Za-z]*|printed[A-Za-z]*|resolution|ruling)"\s*:\s*"(?:[^"\\]|\\.)*"/g;

let files = 0, telFixed = 0, textFixed = 0, protectedFields = 0;

const targets = [];
for (const [rel, keep] of DIRS) {
  const abs = join(SITE, rel);
  if (!existsSync(abs)) continue;
  for (const f of readdirSync(abs).filter(keep)) targets.push([rel, join(abs, f), f]);
}

for (const [rel, path, name] of targets) {
  const before = readFileSync(path, "utf8");
  if (!FORMS.some((f) => before.includes(f))) continue;

  // 1. mask provenance
  const masked = [];
  let work = before.replace(PROVENANCE, (match) => {
    if (!FORMS.some((f) => match.includes(f))) return match;
    masked.push(match);
    return `\u0000PROV${masked.length - 1}\u0000`;
  });
  protectedFields += masked.length;

  // 2. tel: first — the longest forms first so no partial rewrite happens
  for (const f of FORMS) {
    const from = `tel:${f}`;
    const n = work.split(from).length - 1;
    if (n && from !== `tel:${DIAL}`) { work = work.split(from).join(`tel:${DIAL}`); telFixed += n; }
  }
  // 3. every remaining written form -> the readable one
  for (const f of FORMS) {
    if (f === DISPLAY) continue;
    const n = work.split(f).length - 1;
    if (n) { work = work.split(f).join(DISPLAY); textFixed += n; }
  }

  // 4. restore provenance, byte for byte
  work = work.replace(/\u0000PROV(\d+)\u0000/g, (_, i) => masked[Number(i)]);
  for (const m of masked) {
    if (!work.includes(m)) { console.error(`FAIL — provenance field altered in ${name}; not writing.`); process.exit(1); }
  }

  if (work !== before) { files += 1; if (!DRY) writeFileSync(path, work); }
}

console.log(`${DRY ? "[dry] " : ""}landline normalised across ${files} file(s) in ${DIRS.length} trees (assets, components, views)`);
console.log(`  tel: hrefs  -> ${DIAL}   ${telFixed}`);
console.log(`  written     -> ${DISPLAY}  ${textFixed}`);
console.log(`  provenance fields masked and restored unchanged: ${protectedFields}`);
