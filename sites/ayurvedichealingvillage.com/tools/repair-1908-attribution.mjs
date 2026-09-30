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
 * THE OTHER 234 WERE MY OWN FALSE POSITIVE, and this is the correction.
 *
 * I reported 234 snapshots carrying `© 1908 — ` with nothing after the dash, and
 * called it a prerender timing defect fixed by re-running the prerender. Then I
 * re-ran the prerender and the count went UP, to 236 — which is exactly two,
 * the number of routes added that day. So it was never resolving because there
 * was never anything to resolve.
 *
 * What the snapshots actually carry is:
 *
 *   © 1908 — <span class="sc-interp">2026</span> Kairali — The Ayurvedic …
 *
 * The year IS there. The detector's regex ended in `(?=<|\s*$)` — treating
 * "followed by a tag" as "nothing after the dash" — and the tag that follows is
 * the span HOLDING the year. Measured against a reader, the line is complete and
 * correct.
 *
 * The check below now reads the tag-stripped text, which is what a crawler and a
 * person both see, so a year inside markup counts as a year. It is the same
 * lesson this file's headline number taught: a count is a claim, and a claim
 * that has not survived measurement is not a finding.
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
// THIRD PASS (21 Sep 2026). This loop walked public/ahv only, so two instances
// in a prerender snapshot survived every "0 remaining" report: /offers/new/
// carries the OLD SITE's footer ("(c) Kairali Ayurvedic Group Since 1908."),
// not the design's, because it is a legacy duplicate page. It 301s at flip and
// so never serves - but a defect that only survives because a redirect hides it
// is still in the repo, and the next person to reconsider that redirect inherits
// it. The prerender tree is now rewritten too, not merely inspected below.
const GROUP_TREES = ["public/ahv", "english-candidate/prerender"];
for (const p of GROUP_TREES.flatMap((t) => walk(join(SITE, t)))) {
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

// A copyright line with genuinely nothing after the dash. Read from the
// TAG-STRIPPED text: the year lives inside <span class="sc-interp">, so markup
// between the dash and the year is normal, not a defect.
let dangling = 0;
for (const p of walk(join(SITE, "english-candidate/prerender"))) {
  const text = readFileSync(p, "utf8").replace(/<[^>]+>/g, " ");
  // The whitespace goes INSIDE the lookahead. Written as `\s*(?!\w)` the engine
  // backtracks one space, sees a space, and the negative lookahead succeeds on a
  // line that is perfectly fine - which is how the first version of this check
  // reported 234 defects that did not exist.
  const m = text.match(/©\s*(?:19|20)\d{2}\s*[—–-](?!\s*[0-9A-Za-z])/g);
  if (m) dangling += m.length;
}

console.log(`${DRY ? "[dry] " : ""}1908 attribution: ${fixed} group-attached instance(s) rewritten to the ruled form, across ${touched.length} file(s)`);
for (const t of touched) console.log(`  · ${t}`);
if (dangling) {
  console.log(`\n  SEPARATE DEFECT, not fixed here: ${dangling} copyright line(s) really do end at the dash.`);
  console.log(`  Read from the tag-stripped text, so a year inside <span class="sc-interp"> counts as present.`);
}
