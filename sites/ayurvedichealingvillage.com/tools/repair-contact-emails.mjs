#!/usr/bin/env node
/**
 * AHV — the two department addresses on /contact-us/ become the locked one.
 *
 * THE INSTRUCTION (Abilash, in-chat, 2026-09-21, answering a direct question):
 * partners@ayurvedichealingvillage.com and press@ayurvedichealingvillage.com
 * do NOT exist. Replace them with info@kairali.com and keep the department
 * labels, so the page still tells a visitor where to aim.
 *
 * WHY IT MATTERS MORE THAN A TYPO: "public contact email everywhere:
 * info@kairali.com" is a LOCKED FACT. Two non-existent addresses on the contact
 * page of a hospital means a partner or a journalist writes and nobody ever
 * reads it — the mail does not bounce to us, it just disappears.
 *
 * THE SUBJECT LINES ARE KEPT. Both mailto: links carry ?subject= ("Travel trade
 * / partners", "Press / media enquiry"), and those are now the only thing that
 * tells whoever reads info@ which department the mail is for. Dropping them
 * while collapsing the addresses would have quietly lost the routing.
 *
 * WHAT IT DELIBERATELY DOES NOT TOUCH: one occurrence of each address sits
 * inside a provenance note — "obfuscated e-mails RECOVERED 8 Sep per overlay
 * (info@kairali.com x3, partners@... x2, press@...)". That sentence is a record
 * of what the LIVE SOURCE carried, and it stays true only if it keeps naming
 * the addresses the source used. Rewriting it would destroy the audit trail and
 * make the recovery note describe something that never happened. It is matched
 * by neither pattern below, by construction: every pattern requires a
 * mailto:, "v": or "afterText": prefix.
 *
 * Idempotent and asserted — each replacement declares its expected count and
 * the run EXITS 1 rather than half-applying if the payload moves.
 *
 *   node tools/repair-contact-emails.mjs [--dry]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const FILE = join(SITE, "public/ahv/assets/enquiry-family-data.js");
const LOCKED = "info@kairali.com";

/** from, to, expected count before the fix. */
const EDITS = [
  ["mailto:partners@ayurvedichealingvillage.com", `mailto:${LOCKED}`, 4],
  ["mailto:press@ayurvedichealingvillage.com", `mailto:${LOCKED}`, 2],
  ['"v":"partners@ayurvedichealingvillage.com"', `"v":"${LOCKED}"`, 1],
  ['"afterText":"partners@ayurvedichealingvillage.com"', `"afterText":"${LOCKED}"`, 1],
];

/** The provenance sentence that must survive VERBATIM. */
const PROVENANCE = "obfuscated e-mails RECOVERED 8 Sep per overlay";

let before = readFileSync(FILE, "utf8");
const hadProvenance = before.includes(PROVENANCE);
let applied = 0, already = 0;
const lines = [];

for (const [from, to, expect] of EDITS) {
  const n = before.split(from).length - 1;
  if (n === 0) {
    already += 1;
    lines.push(`  · ${from.slice(0, 54)}…  already applied`);
    continue;
  }
  if (n !== expect) {
    console.error(`FAIL — expected ${expect} occurrence(s) of:\n    ${from}\n  found ${n}. The payload moved; re-derive the targets rather than half-applying.`);
    process.exit(1);
  }
  before = before.split(from).join(to);
  applied += n;
  lines.push(`  · ${String(n).padStart(2)}×  ${from.slice(0, 54)}…`);
}

// The audit trail is a postcondition, not a hope.
if (hadProvenance && !before.includes(PROVENANCE)) {
  console.error("FAIL — the recovery provenance note was altered. Refusing to write.");
  process.exit(1);
}
const leftPartners = (before.match(/partners@ayurvedichealingvillage\.com/g) || []).length;
const leftPress = (before.match(/press@ayurvedichealingvillage\.com/g) || []).length;
if (applied && (leftPartners !== 1 || leftPress !== 1)) {
  console.error(`FAIL — expected exactly one provenance mention of each address to remain, found partners=${leftPartners} press=${leftPress}.`);
  process.exit(1);
}

if (!DRY && applied) writeFileSync(FILE, before);

console.log(`${DRY ? "[dry] " : ""}department addresses → ${LOCKED}: ${applied} replacement(s)${already ? `, ${already} pattern(s) already applied` : ""}`);
for (const l of lines) console.log(l);
console.log(`\nKEPT, deliberately: 1× partners@ and 1× press@ inside the "${PROVENANCE}…" note —`);
console.log(`  a record of what the LIVE SOURCE carried, which stays true only by naming those addresses.`);
console.log(`Re-prerender /contact-us/: the snapshot is what a crawler reads and it does not update itself.`);
