/**
 * AHV /all-programs/ — carry the owner's shared finder block.
 *
 * Owner (D-20260916-10, 2026-09-17): every finder or filter page carries the
 * trust line, "Not sure which programme fits?" and the three CTAs. The
 * /all-programs/ finder keeps its own search + shortlist + compare layout
 * (the shortlist the owner asked about lives there); this appends the SAME
 * guidance section the benchmark finder carries (lifted verbatim from the
 * patched benchmark view, so the block is identical everywhere) before the
 * closing of <main>, and adds heritageLine to the view's render values.
 * Idempotent; anchors match exactly once. Run after build-finder-views.
 *
 * Usage: node tools/repair-all-programs-block.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIEWS = path.join(SITE, "public/ahv/views");
const DRY = process.argv.includes("--dry");
const MARK = 'data-ahv-finder-block="1"';
const rx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function once(text, find, repl, label) {
  const re = find instanceof RegExp ? find : new RegExp(rx(find));
  const n = (text.match(new RegExp(re.source, "g" + re.flags.replace("g", ""))) || []).length;
  if (n !== 1) throw new Error(`${label}: expected exactly one match, found ${n}`);
  return text.replace(re, repl);
}
for (const v of ["desktop", "mobile"]) {
  const bench = JSON.parse(fs.readFileSync(path.join(VIEWS, `ahv-page-ayurvedic-treatments-${v}.json`), "utf8")).template;
  const start = bench.indexOf(`<section aria-label="Guidance" ${MARK}`);
  if (start < 0) throw new Error(`${v}: benchmark carries no shared block; run tools/build-finder-views.mjs first`);
  const end = bench.indexOf("</section>", start);
  const block = bench.slice(start, end + "</section>".length);
  const file = path.join(VIEWS, `ahv-page-all-programs-${v}.json`);
  const view = JSON.parse(fs.readFileSync(file, "utf8"));
  if (view.template.includes(MARK)) { console.log(`${v}: block already present`); continue; }
  view.template = once(view.template, "</main>", block + " </main>", `${v} main close`);
  view.logic = once(view.logic, "minusOne: -1, guard,", "minusOne: -1, heritageLine: (new Date().getFullYear() - 1908) + '+ Years Heritage', guard,", `${v} renderVals`);
  if (!DRY) fs.writeFileSync(file, JSON.stringify(view, null, 1) + "\n");
  console.log(`${DRY ? "[dry] " : ""}${v}: shared block appended (${block.length} chars)`);
}
