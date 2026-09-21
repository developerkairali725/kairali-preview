/**
 * AHV — mark the footer's rolling year as COMPUTED in the prerender snapshots.
 *
 * WHAT WAS ACTUALLY WRONG (and it was not what the finding said).
 *
 * banned-string-lint reported 513 × "Typed copyright year ... Rolling values are
 * computed, never typed (D-ROLLING-NUMBER)" across the prerender snapshots. Read
 * at face value that is a sitewide rot defect: 236 pages that would still read
 * "2026" on 1 January 2027.
 *
 * The source is not typed. The footer design carries a live binding:
 *
 *   public/ahv/components/AHV Chrome Footer.dc.html
 *     <span>Ayurvedic Healing Village · Palakkad · 1908 — {{ yearNow }}</span>
 *     <div ...>© 1908 — {{ yearNow }} Kairali — The Ayurvedic Healing Village.</div>
 *
 * The prerender renders that binding and serialises the result, so the snapshot
 * carries `© 1908 — <span class="sc-interp">2026</span>` — a COMPUTED value in
 * its rendered form, not a typed one.
 *
 * WHY THE LINT STILL FIRED. Its own comment names the legal shape:
 *
 *   //  A fixed span START before a computed end ("© 1989–{…}") has no literal
 *   //  year token directly after © or the dash, so it stays legal.
 *
 * — and the regex implements that exemption as `(?!\s*[—–-]\s*\{)`, i.e. it
 * recognises a computed end ONLY in `{…}` brace syntax. The fleet has a second
 * templating system, and dc-runtime renders its computed end as a <span>. So the
 * rule was not wrong about the intent, it just did not know this shape. Verified
 * directly rather than assumed:
 *
 *   © 1908 — <span class="sc-interp">2026</span>   A:false B:true  -> FLAGGED
 *   © 1989–{new Date().getFullYear()}              A:false B:false -> legal
 *   © 1908 — 2026                                  A:true  B:true  -> FLAGGED
 *   © 2026                                         A:false B:true  -> FLAGGED
 *
 * The exemption exists; only the syntax was missing.
 *
 * WHAT THIS TOOL DOES — AND WHY IT IS NOT A SUPPRESSION. `class="sc-interp"` is
 * generic: the same class carries nav labels ("About Us", "Careers"), so making
 * the lint trust bare `sc-interp` would blind it to a typed year that happened to
 * sit in any interpolation span. Instead this tool stamps the year spans — and
 * ONLY the year spans — with an explicit, greppable marker:
 *
 *   <span class="sc-interp" data-dc-computed="yearNow">2026</span>
 *
 * and the lint's exemption is widened to that marker alone. An unmarked typed
 * year still FAILS, in every syntax, on every site. The gate keeps its full
 * force; it gains one shape it was always meant to allow (rule g).
 *
 * The marker is also load-bearing, not cosmetic: it names the binding it came
 * from, so `assertSourceBindingLive()` below fails the run if anyone ever
 * replaces `{{ yearNow }}` in the footer design with a hardcoded year. That is
 * the compensating control — the defect the rule exists to catch is now caught
 * at the SOURCE, where it can actually be fixed, instead of at the artifact.
 *
 * Idempotent. Re-run after any prerender or design import.
 *   node tools/repair-computed-year.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRERENDER = join(SITE, "english-candidate", "prerender");
const FOOTER = join(SITE, "public", "ahv", "components", "AHV Chrome Footer.dc.html");
const DRY = process.argv.includes("--dry");

const MARKER = 'data-dc-computed="yearNow"';

/**
 * The year span, ONLY where a copyright/lineage context precedes it — `©` or
 * `1908 —`. A bare <span class="sc-interp">2026</span> elsewhere is left alone:
 * this tool never claims a value is computed on a shape it has not seen.
 */
const YEAR_SPAN = /((?:©|\b1908)\s*(?:[—–-]\s*)?)<span class="sc-interp">((?:19|20)\d{2})<\/span>/g;

/**
 * COMPENSATING CONTROL. The marker asserts "this came from {{ yearNow }}". If
 * that stops being true the assertion must fail, or the marker becomes a lie
 * that launders a real typed year past the gate.
 */
function assertSourceBindingLive() {
  const src = readFileSync(FOOTER, "utf8");
  const bindings = src.match(/\{\{\s*yearNow\s*\}\}/g) || [];
  if (bindings.length < 2) {
    throw new Error(
      `AHV Chrome Footer.dc.html carries ${bindings.length} "{{ yearNow }}" binding(s); expected the 2 rolling-year slots ` +
      `(the uppercase strip and the © line). If the design now TYPES the year, that is the real D-ROLLING-NUMBER defect — ` +
      `fix the design, do not mark it computed.`
    );
  }
  if (/©\s*(?:19|20)\d{2}\s*[—–-]\s*(?:19|20)\d{2}/.test(src)) {
    throw new Error("AHV Chrome Footer.dc.html contains a TYPED copyright range — the source defect this marker must never hide.");
  }
  return bindings.length;
}

const bindings = assertSourceBindingLive();

let filesTouched = 0, spansMarked = 0, alreadyMarked = 0;
const files = readdirSync(PRERENDER).filter((f) => f.endsWith(".html")).sort();

for (const f of files) {
  const p = join(PRERENDER, f);
  const before = readFileSync(p, "utf8");
  alreadyMarked += (before.match(new RegExp(MARKER.replace(/"/g, '"'), "g")) || []).length;
  let n = 0;
  const after = before.replace(YEAR_SPAN, (m, lead, year) => {
    n++;
    return `${lead}<span class="sc-interp" ${MARKER}>${year}</span>`;
  });
  if (n === 0 || after === before) continue;
  spansMarked += n; filesTouched++;
  if (!DRY) writeFileSync(p, after);
}

// POSTCONDITION: every copyright-context year span is now marked, none left bare.
let bareLeft = 0;
for (const f of files) {
  const s = DRY ? readFileSync(join(PRERENDER, f), "utf8") : readFileSync(join(PRERENDER, f), "utf8");
  if (DRY) continue;
  bareLeft += (s.match(YEAR_SPAN) || []).length;
}

console.log(`repair-computed-year${DRY ? " (dry run)" : ""}`);
console.log(`  footer bindings verified : {{ yearNow }} × ${bindings}`);
console.log(`  snapshots scanned        : ${files.length}`);
console.log(`  already marked           : ${alreadyMarked}`);
console.log(`  spans marked this run    : ${spansMarked} in ${filesTouched} file(s)`);
if (!DRY) {
  console.log(`  bare year spans left     : ${bareLeft}`);
  if (bareLeft !== 0) { console.error(`FAIL: ${bareLeft} copyright-context year span(s) still unmarked.`); process.exit(1); }
}
