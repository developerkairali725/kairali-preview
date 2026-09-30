/**
 * AHV Ayurveda training hub — link every course row to its page.
 *
 * WHY. The hub's "Available Courses" table listed the five courses by name
 * and code with no link to the five course pages, so the pages were reachable
 * only from a legacy article and the sitemap (D-20260916-10). Routes come
 * from english-candidate/finder-additions.json (code -> route, tariff-backed);
 * nothing is invented. Idempotent; anchors must match exactly once per file.
 *
 * Usage: node tools/repair-training-hub.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(SITE, "public/ahv/assets/ayurveda-training-data.js");
const ADD = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/finder-additions.json"), "utf8"));
const DRY = process.argv.includes("--dry");
const rx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function once(text, find, repl, label) {
  const re = find instanceof RegExp ? find : new RegExp(rx(find));
  const n = (text.match(new RegExp(re.source, "g" + re.flags.replace("g", ""))) || []).length;
  if (n !== 1) throw new Error(`${label}: expected exactly one match, found ${n}`);
  return text.replace(re, repl);
}

// 1. Data: href per course, keyed by the tariff code already in the row.
let d = fs.readFileSync(DATA, "utf8");
if (/code: "OAP-HV", href: "/.test(d)) console.log("data: hrefs already present");
else {
  for (const c of ADD.programmes) {
    const code = c.code === "AATP1-HV" ? "AATP1-HV" : c.code;
    d = once(d, `{ code: "${code}", name:`, `{ code: "${code}", href: "${c.route}", name:`, `course ${code}`);
  }
  if (!DRY) fs.writeFileSync(DATA, d);
  console.log(`data: ${ADD.programmes.length} course hrefs added`);
}

// 2. Views: the course name becomes the link; logic makes the href absolute like every other link.
for (const v of ["desktop", "mobile"]) {
  const file = path.join(SITE, "public/ahv/views", `ahv-page-ayurveda-training-programs-${v}.json`);
  const view = JSON.parse(fs.readFileSync(file, "utf8"));
  if (view.template.includes("{{ c.href }}")) { console.log(`${v}: already linked`); continue; }
  const link = `<a href="{{ c.href }}" style="color:#2A2118" style-hover="color:#006038">{{ c.name }}</a>`;
  view.template = v === "desktop"
    ? once(view.template, /(<span style="display:block;font-family:'Marcellus',serif;font-size:19px;line-height:1.35">)\{\{ c\.name \}\}(<\/span>)/, `$1${link}$2`, `${v} course name`)
    : once(view.template, /(<h3 style="font-family:'Marcellus',serif;font-size:21px;line-height:1.3">)\{\{ c\.name \}\}(<\/h3>)/, `$1${link}$2`, `${v} course name`);
  view.logic = once(view.logic, /courses: D\.courses\.map\(c => \(\{ \.\.\.c,/, "courses: D.courses.map(c => ({ ...c, href: A + c.href,", `${v} course href`);
  if (!DRY) fs.writeFileSync(file, JSON.stringify(view, null, 1) + "\n");
  console.log(`${v}: course names link to their pages`);
}
