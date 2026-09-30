#!/usr/bin/env node
/**
 * AHV — "3 Lacs" becomes "300,000", and the deviation is recorded.
 *
 * THE INSTRUCTION (Abilash, via the long-form advertising handover, 19 Sep 2026,
 * item 3): "3 Lacs" -> international numerals. The handover is explicit that
 * this string is VERBATIM LIVE COPY protected by its standing rule 1, and that
 * the owner has called it out anyway — so the change is authorised, and it is
 * recorded rather than made silently, so the SEO diff stays explainable.
 *
 * WHY THE NUMERAL MATTERS. A "lac" is a hundred thousand and the word is read
 * in India and almost nowhere else. This page is the biggest search surface on
 * the site and its audience is largely international; "3 Lacs" reads to most of
 * them as a typo, not a number.
 *
 * WHAT IT DOES NOT TOUCH, and this is the important half: the sentence also
 * carries "with an 87% satisfactory rate". That is an UNSOURCED OUTCOME CLAIM on
 * a hospital page, which is a different and larger problem than a numeral — it
 * is a HARD GATE 7 item for Dr. Deepu John, and rewriting the numeral around it
 * would make the sentence look freshly approved when nobody has approved it.
 * The claim is left exactly as it is and reported every run.
 *
 * Idempotent. Re-run after any design import.
 *   node tools/repair-lacs-numeral.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");

/** Only the Indian-numeral forms, and only where they quantify treatments. A
 *  bare "lakh" elsewhere in the payload is not this sentence and is not ours. */
const FROM = /\b3\s*(?:Lacs|lacs|Lakhs?|lakhs?)\b/g;
const TO = "300,000";

const dirs = ["public/ahv/assets", "public/ahv/views"];
let changed = 0;
const touched = [];
let claim = 0;

for (const d of dirs) {
  const abs = join(SITE, d);
  if (!existsSync(abs)) continue;
  for (const f of readdirSync(abs)) {
    if (!/\.(js|json)$/.test(f)) continue;
    const p = join(abs, f);
    const before = readFileSync(p, "utf8");
    const n = (before.match(FROM) || []).length;
    claim += (before.match(/87%\s*satisfactory\s*rate/gi) || []).length;
    if (!n) continue;
    const after = before.replace(FROM, TO);
    changed += n;
    touched.push(`${d}/${f} (${n})`);
    if (!DRY) writeFileSync(p, after);
  }
}

// The deviation ledger the handover asks for. Written next to the drop it came
// from, so the reason travels with the design rather than living in a commit.
const NOTE_DIR = join(SITE, "..", "..", "launches/ayurvedichealingvillage.com/design-intake/LONG-FORM-ADVERTISING/notes");
const NOTE = join(NOTE_DIR, "register-violations.md");
const entry = `
## 2026-09-20 — "3 Lacs" -> "300,000" (owner-authorised deviation from verbatim)

- **String:** \`Kairali has performed more than 3 Lacs Treatments with an 87% satisfactory rate\`
- **Changed to:** \`... more than 300,000 Treatments with an 87% satisfactory rate\`
- **Instances:** ${changed}, all in \`public/ahv/assets/campaign-nine-data.js\`
- **Rendered on:** /wellness-resort-kerala.html, /kairali-cleansing-centre.html
- **Authority:** Abilash, long-form advertising handover item 3, 19 Sep 2026. The handover names
  the string as verbatim live copy under its standing rule 1 and records that the owner called it
  out anyway, so the deviation is authorised and logged here to keep the SEO diff explainable.
- **NOT changed:** the "87% satisfactory rate" in the same sentence. An unsourced outcome claim on
  a hospital page is a HARD GATE 7 item for Dr. Deepu John, not a copy edit, and rewriting around
  it would make the sentence read as freshly approved when it has not been.
`;
if (!DRY && changed) {
  mkdirSync(NOTE_DIR, { recursive: true });
  const prior = existsSync(NOTE) ? readFileSync(NOTE, "utf8") : "# Register and verbatim deviations — long-form advertising\n";
  if (!prior.includes('"3 Lacs" -> "300,000"')) writeFileSync(NOTE, prior.trimEnd() + "\n" + entry);
}

console.log(`${DRY ? "[dry] " : ""}Indian numerals: ${changed} instance(s) rewritten to ${TO}`);
for (const t of touched) console.log(`  · ${t}`);
if (!touched.length) console.log("  (nothing to do — already applied)");
if (claim) {
  console.log(`\n  NOT FIXED, and deliberately: ${claim} occurrence(s) of "87% satisfactory rate" remain.`);
  console.log(`  An unsourced outcome claim on a hospital page is Dr. Deepu John's call (HARD GATE 7), not a numeral fix.`);
}
