/**
 * AHV article pages — end the page with somewhere to go.
 *
 * WHY. Measured on the article routes before this: not one of them closed
 * with anything. No trust line, no call to action. A visitor who read to the
 * bottom of a 4,000px page had no next step and no reason to believe the
 * place was a hospital rather than a blog. Owner, 2026-09-19: the legacy
 * pages "don't follow a structured format, a template".
 *
 * WHAT. Appends the SAME guidance block the owner approved for every finder -
 * NABH Certified Hospital, the heritage line, Individualised Programmes,
 * World Luxury Award Winner, "Not sure which programme fits?", then Free
 * Doctor Consultation, WhatsApp Patient Care and Enquire Now. It is lifted
 * verbatim from the patched benchmark view rather than retyped, so the block
 * is byte-identical everywhere it appears and one future edit moves all of
 * them.
 *
 * The heritage line is interpolated in the benchmark ({{ heritageLine }}),
 * which the article views do not compute, so it is resolved to plain text
 * here from the same arithmetic the design uses: the current year minus 1908.
 *
 * Marked data-ahv-article-cta so the stylesheet can find it. Idempotent.
 *
 * Usage: node tools/repair-article-cta.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIEWS = path.join(SITE, "public/ahv/views");
const DRY = process.argv.includes("--dry");
const MARK = "data-ahv-article-cta";
const HERITAGE = new Date().getFullYear() - 1908;

function blockFrom(variant) {
  const bench = JSON.parse(fs.readFileSync(path.join(VIEWS, `ahv-page-ayurvedic-treatments-${variant}.json`), "utf8")).template;
  const start = bench.indexOf('<section aria-label="Guidance" data-ahv-finder-block="1"');
  if (start < 0) throw new Error(`${variant}: the benchmark carries no guidance block - run tools/build-finder-views.mjs first`);
  const end = bench.indexOf("</section>", start) + "</section>".length;
  return bench
    .slice(start, end)
    .replace('data-ahv-finder-block="1"', MARK)
    .replace(/\{\{ heritageLine \}\}/g, `${HERITAGE}+ Years Heritage`);
}

const block = { desktop: blockFrom("desktop"), mobile: blockFrom("mobile") };
for (const v of Object.values(block)) {
  if (/\{\{/.test(v)) throw new Error("the block still carries an unresolved interpolation - refusing to ship {{ }} as visible text");
}

let added = 0, already = 0;
for (const f of fs.readdirSync(VIEWS)) {
  if (!/^ahv-page-article-reader-(desktop|mobile)\.json$/.test(f)) continue;
  const variant = f.includes("mobile") ? "mobile" : "desktop";
  const file = path.join(VIEWS, f);
  const view = JSON.parse(fs.readFileSync(file, "utf8"));
  if (view.template.includes(MARK)) { already++; console.log(`${f}: already closed with the block`); continue; }
  const n = view.template.split("</main>").length - 1;
  if (n !== 1) throw new Error(`${f}: expected one </main>, found ${n}`);
  view.template = view.template.replace("</main>", block[variant] + " </main>");
  if (!DRY) fs.writeFileSync(file, JSON.stringify(view, null, 1) + "\n");
  added++;
  console.log(`${DRY ? "[dry] " : ""}${f}: guidance block appended (${block[variant].length} chars)`);
}
console.log(`${added} view(s) updated, ${already} already done - this governs every article route`);
