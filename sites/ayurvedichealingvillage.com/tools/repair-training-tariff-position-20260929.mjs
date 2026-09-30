// OWNER-REG-03 (29 Sep 2026): the residential training tariff block sat AFTER the footer on the training hub and the
// five course pages (12 views). It moves, unchanged, to the end of <main> — where tools/align-final-rates.mjs now
// inserts it. The /ayurveda-training-programme/ pair also gets its JSON-LD ids on its own canonical (they still named
// the retired /ayurveda-training-programs/ alias, which 301s here) and a wrapping desktop breadcrumb.
//   node tools/repair-training-tariff-position-20260929.mjs [--check]     idempotent
import fs from "node:fs";

const IDS = ["ayurveda-training-programme", "course-consultant-therapist", "course-five-day-intensive", "course-level-one-advanced", "course-one-day-workshop", "course-three-day-certificate"];
const indentOf = (raw) => (raw.match(/^\{\n( +)"/) || [, "  "])[1].length;
const check = process.argv.includes("--check");
const log = [];
for (const id of IDS) for (const v of ["desktop", "mobile"]) {
  const f = `public/ahv/views/ahv-page-${id}-${v}.json`;
  const raw = fs.readFileSync(f, "utf8");
  const d = JSON.parse(raw);
  let t = d.template;
  const s = t.indexOf("<section data-rate-reference=");
  const footer = t.indexOf('<dc-import name="AHV Chrome Footer"');
  if (s < 0 || footer < 0) throw new Error(`${f}: tariff block or footer import missing`);
  if (s > footer) {
    const e = t.indexOf("</section>", s) + "</section>".length;
    if (t.slice(e).trim() !== "") throw new Error(`${f}: unexpected content after the tariff block`);
    const block = t.slice(s, e);
    t = t.slice(0, s).replace(/\s+$/, "") ;
    const main = t.lastIndexOf("</main>");
    if (main < 0 || main > t.indexOf('<dc-import name="AHV Chrome Footer"')) throw new Error(`${f}: no </main> before the footer`);
    t = t.slice(0, main) + block + "\n" + t.slice(main);
    log.push(`${f}: tariff moved inside <main>`);
  } else log.push(`${f}: tariff already before the footer`);
  if (id === "ayurveda-training-programme") {
    const n = t.split("https://ayurvedichealingvillage.com/ayurveda-training-programs/").length - 1;
    if (n) { t = t.replaceAll("https://ayurvedichealingvillage.com/ayurveda-training-programs/", "https://ayurvedichealingvillage.com/ayurveda-training-programme/"); log.push(`${f}: ${n} JSON-LD ids -> own canonical`); }
    const nav = '<nav aria-label="Breadcrumb" style="font-size:15px;color:#75695A;display:flex;gap:8px;align-items:center">';
    if (t.includes(nav)) { t = t.replace(nav, nav.replace('align-items:center">', 'align-items:center;flex-wrap:wrap">')); log.push(`${f}: breadcrumb wraps`); }
  }
  if (t !== d.template && !check) { d.template = t; fs.writeFileSync(f, JSON.stringify(d, null, indentOf(raw)) + (raw.endsWith("\n") ? "\n" : "")); }
}
console.log(log.join("\n"));
