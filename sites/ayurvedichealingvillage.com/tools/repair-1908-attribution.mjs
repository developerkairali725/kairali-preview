/**
 * AHV — the group-attached "Since 1908", corrected to the ruled form.
 *
 * THE RULING (DECISIONS.md, 16 Jul 2026, Abilash, primary source): 1908 is the
 * FAMILY lineage origin; the GROUP was founded 1989. "Kairali Ayurvedic Group —
 * Since 1908" conflates the two, and the ruled replacement is
 * "· A family tradition since 1908".
 *
 * WHAT THE HEADLINE NUMBER ACTUALLY WAS. banned-string-lint reported 563
 * findings across 255 files, which reads like a sitewide rewrite. Counted by
 * sub-rule it is two unrelated defects of very different size:
 *
 *   founded 1908 ............  0
 *   Group-attached 1908 ..... 30 matches in 15 files   <- this tool
 *   typed copyright year ... 234 matches in 234 files  <- NOT this tool, see below
 *
 * This tool fixes the first. It rewrites exactly the prohibited shape — the
 * word "Group" with only punctuation between it and "since 1908" — and leaves
 * every other 1908 alone, because most of them are correct:
 *   · "health through ayurveda | since 1908" is the LOGO artwork (exempt)
 *   · "Family practice since 1908", "caring for patients since 1908" already
 *     attach to the practice, which is what the ruling permits
 *   · "Kairali — The Ayurvedic Healing Village · Since 1908" does not contain
 *     "Group" and is not the shape the ruling names
 * Widening past the ruled shape would be the agent rewriting approved copy on
 * its own authority.
 *
 * THE OTHER 234 ARE NOT A COPY PROBLEM. They are `© 1908 — ` with NOTHING after
 * the dash, and they exist only in english-candidate/prerender/. The chrome
 * footer source reads `© 1908 — {{ yearNow }}` with yearNow computed from
 * getFullYear(), which the lint deliberately permits. The snapshots were
 * captured before that interpolation resolved, so the server HTML a crawler
 * reads carries a dangling copyright line. That is a PRERENDER TIMING defect,
 * not wording, and baking a literal year into the snapshots to silence it would
 * be the typed-rolling-year the companion ruling (D-ROLLING-NUMBER) bans. It is
 * fixed by re-running the prerender once the runtime has resolved, and reported
 * here rather than papered over.
 *
 * Idempotent. Re-run after any design import.
 *   node tools/repair-1908-attribution.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");

/** The prohibited shape, from the lint's own regex. */
const GROUP_1908 = /\bGroup(\s*[—–·,:-]?\s*)(?:est\.?\s+)?since\s+1908\b/gi;
/** The ruled replacement, byte-for-byte one of the lint's anti-probes. */
const RULED = "Group · A family tradition since 1908";

const walk = (d, out = []) => {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|json|html|tsx|ts)$/.test(e)) out.push(p);
  }
  return out;
};

let fixed = 0;
const touched = [];
for (const p of walk(join(SITE, "public/ahv"))) {
  const before = readFileSync(p, "utf8");
  if (!GROUP_1908.test(before)) { GROUP_1908.lastIndex = 0; continue; }
  GROUP_1908.lastIndex = 0;
  const after = before.replace(GROUP_1908, RULED);
  const n = (before.match(GROUP_1908) || []).length;
  GROUP_1908.lastIndex = 0;
  if (after !== before) {
    fixed += n;
    touched.push(`${relative(SITE, p)} (${n})`);
    if (!DRY) writeFileSync(p, after);
  }
}

// Report the prerender defect without touching it.
let dangling = 0;
for (const p of walk(join(SITE, "english-candidate/prerender"))) {
  const t = readFileSync(p, "utf8");
  const m = t.match(/©\s*(?:19|20)\d{2}\s*[—–-]\s*(?=<|\s*$)/g);
  if (m) dangling += m.length;
}

console.log(`${DRY ? "[dry] " : ""}1908 attribution: ${fixed} group-attached instance(s) rewritten to the ruled form, across ${touched.length} file(s)`);
for (const t of touched) console.log(`  · ${t}`);
if (dangling) {
  console.log(`\n  SEPARATE DEFECT, not fixed here: ${dangling} snapshot(s) carry "© <year> — " with nothing after the dash.`);
  console.log(`  The footer computes its year; the prerender captured before it resolved. Re-run prerender-english.`);
}
