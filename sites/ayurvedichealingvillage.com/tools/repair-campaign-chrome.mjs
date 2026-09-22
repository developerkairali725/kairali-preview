#!/usr/bin/env node
/**
 * AHV — give the legacy campaign template (campaign-nine, 8 routes) the site's
 * shared header and footer.
 *
 * MEASURED (16 Sep audit, confirmed by the 22 Sep census): campaign-nine is
 * the ONE family served with no site chrome at all — no header, no nav, no
 * footer — on 8 routes that carry 987 clicks and 616k impressions over 16
 * months. Every other family mounts the chrome as two design imports
 * (<dc-import name="AHV Chrome Header"> / "AHV Chrome Footer"); this template
 * predates them. The owner's 22 Sep directive (D-20260922-13) is that the
 * site reads as ONE site.
 *
 * WHAT THIS DOES. In both served payloads (desktop + mobile) the header import
 * is placed as the first child of the page wrapper and the footer import as
 * its last, exactly as the package's own views place them. The wrapper's
 * bottom padding (a stand-in for the missing footer) goes. Nothing else in
 * the template changes. Idempotent; postcondition: exactly two imports.
 *
 *   node tools/repair-campaign-chrome.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const VIEWS = join(SITE, "public/ahv/views");
const HEADER = '<dc-import name="AHV Chrome Header" hint-size="100%,72px"></dc-import>';
const FOOTER = '<dc-import name="AHV Chrome Footer" hint-size="100%,560px"></dc-import>';

let touched = 0;
const problems = [];
for (const side of ["desktop", "mobile"]) {
  const id = `ahv-page-campaign-nine-${side}`;
  const file = join(VIEWS, `${id}.json`);
  if (!existsSync(file)) { problems.push(`missing view: ${id}`); continue; }
  const view = JSON.parse(readFileSync(file, "utf8"));
  let t = view.template;
  const before = t;
  const did = [];
  const helmetEnd = t.indexOf("</helmet>");
  const bodyAt = helmetEnd < 0 ? 0 : helmetEnd + "</helmet>".length;
  // the wrapper: <div style="min-height: 100vh; background: #F7F4EA; padding: 0 0 80px;">
  const open = t.slice(bodyAt).match(/^\s*<div style="min-height: 100vh; background: #F7F4EA; padding: 0(?: 0 \d+px)?;">/);
  if (!open) { problems.push(`${id}: page wrapper not found`); continue; }
  const openEnd = bodyAt + open[0].length;
  if (!t.slice(openEnd, openEnd + 200).includes("AHV Chrome Header")) {
    t = t.slice(0, openEnd) + " " + HEADER + " " + t.slice(openEnd);
    did.push("header");
  }
  const closeAt = t.lastIndexOf("</div>");
  if (!t.slice(Math.max(0, closeAt - 200), closeAt).includes("AHV Chrome Footer")) {
    t = t.slice(0, closeAt) + " " + FOOTER + " " + t.slice(closeAt);
    did.push("footer");
  }
  const fixedOpen = open[0].replace(/padding: 0 0 \d+px;/, "padding: 0;");
  if (fixedOpen !== open[0]) { t = t.slice(0, bodyAt) + fixedOpen + t.slice(bodyAt + open[0].length); did.push("wrapper padding"); }
  const imports = (t.match(/<dc-import\b/g) || []).length;
  if (imports !== 2) problems.push(`${id}: expected 2 chrome imports, found ${imports}`);
  if (t !== before) { touched += 1; if (!DRY) { view.template = t; writeFileSync(file, JSON.stringify(view)); } }
  console.log(`${did.length ? (DRY ? "[dry] " : "fixed  ") : "as-is  "}${id}${did.length ? "  (" + did.join(", ") + ")" : ""}`);
}
console.log(`\nrepair-campaign-chrome${DRY ? " (dry)" : ""}: ${touched} view(s) changed`);
if (problems.length) { console.error("POSTCONDITION FAILURES:\n  " + problems.join("\n  ")); process.exit(1); }
