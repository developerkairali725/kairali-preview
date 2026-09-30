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
// narrow="true" selects the chrome's phone half (burger, 64px bar) — the
// package's own mobile views pass it; without it the desktop header renders
// at 390px (measured 22 Sep on the deployed preview).
const HEADER_N = '<dc-import name="AHV Chrome Header" narrow="true" style="position:sticky;top:0;z-index:80" hint-size="100%,64px"></dc-import>';
const FOOTER_N = '<dc-import name="AHV Chrome Footer" narrow="true" hint-size="100%,900px"></dc-import>';
const VOID = new Set(["br", "img", "hr", "meta", "link", "input", "source", "path", "circle", "rect", "line", "polyline", "polygon", "use", "wbr"]);
function elementSpan(t, at) {
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g;
  re.lastIndex = at;
  let depth = 0, m;
  while ((m = re.exec(t))) {
    const [full, close, tag, attrs] = m;
    if (VOID.has(tag.toLowerCase()) || /\/\s*$/.test(attrs)) { if (m.index === at) return [at, at + full.length]; continue; }
    if (close) { depth -= 1; if (depth === 0) return [at, m.index + full.length]; } else depth += 1;
  }
  throw new Error(`unbalanced element at ${at}`);
}

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
  const H = side === "mobile" ? HEADER_N : HEADER, F = side === "mobile" ? FOOTER_N : FOOTER;
  if (!t.slice(openEnd, openEnd + 260).includes("AHV Chrome Header")) {
    t = t.slice(0, openEnd) + " " + H + " " + t.slice(openEnd);
    did.push("header");
  } else if (side === "mobile" && t.slice(openEnd, openEnd + 260).includes(HEADER)) { t = t.replace(HEADER, HEADER_N); did.push("header→narrow"); }
  const closeAt = t.lastIndexOf("</div>");
  if (!t.slice(Math.max(0, closeAt - 260), closeAt).includes("AHV Chrome Footer")) {
    t = t.slice(0, closeAt) + " " + F + " " + t.slice(closeAt);
    did.push("footer");
  } else if (side === "mobile" && t.slice(Math.max(0, closeAt - 260), closeAt).includes(FOOTER)) { t = t.replace(FOOTER, FOOTER_N); did.push("footer→narrow"); }
  const fixedOpen = open[0].replace(/padding: 0 0 \d+px;/, "padding: 0;");
  if (fixedOpen !== open[0]) { t = t.slice(0, bodyAt) + fixedOpen + t.slice(bodyAt + open[0].length); did.push("wrapper padding"); }
  const imports = (t.match(/<dc-import\b/g) || []).length;
  if (imports !== 2) problems.push(`${id}: expected 2 chrome imports, found ${imports}`);
  if (t !== before) { touched += 1; if (!DRY) { view.template = t; writeFileSync(file, JSON.stringify(view)); } }
  console.log(`${did.length ? (DRY ? "[dry] " : "fixed  ") : "as-is  "}${id}${did.length ? "  (" + did.join(", ") + ")" : ""}`);
}
/* ---- own-chrome templates: campaign-retreat (7 routes) and panchkarma-
   treatment (1) and the packages listing (D-20260922-20) ship their OWN page header (logo + e-mail/phone nav, no
   burger, no language switch) and their own footer (9 links, no socials).
   Measured 22 Sep (508-record chrome audit): the only routes besides the
   locked packages listing not on the shared chrome. The page-level <header>
   (the first one after the skip link) becomes the shared header import and
   the page-level <footer> (the last, dark one) the shared footer import.
   Testimonial <footer>s inside blockquotes are untouched. */
for (const base of ["ahv-page-campaign-retreat", "ahv-page-panchkarma-treatment", "ahv-page-ayurvedic-treatment-packages"]) {
  for (const side of ["desktop", "mobile"]) {
    const id = `${base}-${side}`;
    const file = join(VIEWS, `${id}.json`);
    if (!existsSync(file)) { problems.push(`missing view: ${id}`); continue; }
    const view = JSON.parse(readFileSync(file, "utf8"));
    let t = view.template;
    const before = t;
    const did = [];
    const H = side === "mobile" ? HEADER_N : HEADER, F = side === "mobile" ? FOOTER_N : FOOTER;
    const bodyAt = t.indexOf("</helmet>") + 9;
    // page header: the first <header …> in the body whose style paints the paper ground
    const hm = /<header style="background:(?:#F7F4EA|rgba\(247,244,234,\.97\))[^"]*">/.exec(t.slice(bodyAt));
    if (hm) {
      const [a, b] = elementSpan(t, bodyAt + hm.index);
      t = t.slice(0, a) + H + t.slice(b);
      did.push("own header → shared");
    }
    // page footer: the last <footer …> whose background is the dark ground
    let lastFooter = -1; const fre = /<footer style="background:[^"]*#2A2014[^"]*">/g; let fm;
    while ((fm = fre.exec(t))) lastFooter = fm.index;
    if (lastFooter >= 0) {
      const [a, b] = elementSpan(t, lastFooter);
      t = t.slice(0, a) + F + t.slice(b);
      did.push("own footer → shared");
    }
    const imports = (t.match(/<dc-import\b/g) || []).length;
    if (imports !== 2) problems.push(`${id}: expected 2 chrome imports, found ${imports}`);
    if (/<header style="background:(?:#F7F4EA|rgba\(247,244,234,\.97\))/.test(t.slice(t.indexOf("</helmet>")))) problems.push(`${id}: own page header still present`);
    if (t !== before) { touched += 1; if (!DRY) { view.template = t; writeFileSync(file, JSON.stringify(view)); } }
    console.log(`${did.length ? (DRY ? "[dry] " : "fixed  ") : "as-is  "}${id}${did.length ? "  (" + did.join(", ") + ")" : ""}`);
  }
}
console.log(`\nrepair-campaign-chrome${DRY ? " (dry)" : ""}: ${touched} view(s) changed`);
if (problems.length) { console.error("POSTCONDITION FAILURES:\n  " + problems.join("\n  ")); process.exit(1); }
