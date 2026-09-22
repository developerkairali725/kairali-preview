#!/usr/bin/env node
/**
 * AHV — /ayurveda-training-programs/ "Available Courses": every course row
 * carries BOTH a "Learn more" and an "Enquire" button (owner, 23 Sep 2026).
 *
 * Before: the course name was a plain text link and one text-styled anchor
 * "Enquire about this course" sat under it. After: two real buttons in the
 * same cell — "Learn more" (the course page, the row's own href) and "Enquire"
 * (/enquiry-form/, same origin) — on the desktop table and the mobile cards.
 * Labels only; destinations are the view's own.
 *
 * Idempotent (marked data-ahv-course-actions).  node tools/repair-training-table.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIEWS = path.join(SITE, "public/ahv/views");
const DRY = process.argv.includes("--dry");

const BTN = (href, label, aria, primary) =>
  `<a href="${href}"${aria ? ` aria-label="${aria}"` : ""} style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 20px;border-radius:4px;font-family:'Mulish',sans-serif;font-weight:700;font-size:13.5px;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;box-sizing:border-box;${primary ? "background:#EEB41E;color:#2A2118" : "border:1.5px solid #5A4420;color:#5A4420;background:transparent"}" style-hover="${primary ? "background:#D9A31A;color:#2A2118" : "background:#5A4420;color:#F7F4EA"};text-decoration:none">${label}</a>`;
const ROW = `<div data-ahv-course-actions="1" style="display:flex;flex-wrap:wrap;gap:10px;margin-top:14px">` +
  BTN("{{ c.href }}", "Learn more", "Learn more: {{ c.name }}", true) +
  BTN("/enquiry-form/", "Enquire", "Enquire about this course: {{ c.name }}", false) + `</div>`;

for (const side of ["desktop", "mobile"]) {
  const id = `ahv-page-ayurveda-training-programs-${side}`;
  const file = path.join(VIEWS, id + ".json");
  const view = JSON.parse(fs.readFileSync(file, "utf8"));
  let T = view.template;
  if (T.includes('data-ahv-course-actions="1"')) { console.log(`as-is  ${id}`); continue; }
  const re = /<a href="https:\/\/ayurvedichealingvillage\.com\/enquiry-form\/" onClick="\{\{ guard \}\}" aria-label="Enquire about this course: \{\{ c\.name \}\}"[^>]*>Enquire about this course<\/a>/g;
  const n = (T.match(re) || []).length;
  if (n !== 1) throw new Error(`${id}: expected one enquire anchor, found ${n}`);
  T = T.replace(re, ROW);
  // the mobile card wrapped that anchor in its own flex row; the new row replaces it
  T = T.replace(/<div style="display:flex;margin-top:10px">\s*(<div data-ahv-course-actions="1")/, "$1").replace(/(<\/div>)\s*<\/div>(\s*<\/article>)/, (m, a, b) => T.includes('data-ahv-course-actions="1"') && side === "mobile" ? a + b : m);
  view.template = T;
  if (!DRY) fs.writeFileSync(file, JSON.stringify(view, null, 1) + "\n");
  console.log(`${DRY ? "[dry] " : "fixed  "}${id}: Learn more + Enquire on every course row`);
}
