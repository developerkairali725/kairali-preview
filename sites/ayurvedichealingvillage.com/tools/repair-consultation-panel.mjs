#!/usr/bin/env node
/**
 * AHV — /online-consultation/: the consultation invitation names a PANEL of
 * physicians, not one doctor and no years of experience.
 *
 * SOURCE. Anoop Vijayaraj (GM), e-mail 21–22 Sep 2026: "in speak with an
 * ayurvedic physician we should not mention the years of experience, show
 * mention like a panel of doctors or else everyone will want to have a
 * consultation with Dr. Deepu only". Owner ruling D-20260922-30: a panel of
 * THREE — the physicians whose photographs exist — Dr. Deepu John, Dr. Akhila
 * Oommen, Dr. Rahul R; Dr. Aashitha PS and Dr. Adhina UB join when the GM
 * sends their photographs (not invented here).
 *
 * MEASURED BEFORE. The page carried one card: an EMPTY grey circle (a 56px
 * placeholder, never a photograph — the owner's "why no Dr. Deepu photo") and
 * "Dr. Deepu John, BAMS — Chief Physician & Head of Department · 12+ years'
 * clinical practice" from the record's `physician` field.
 *
 * WHAT THIS DOES. Adds `physicians[]` to the /online-consultation/ record
 * (enquiry-family-data.js) — names and roles exactly as the verified roster
 * (docs/group-inputs/kairali-physician-roster.md) and the homepage team tiles
 * print them, photographs = the team files already on disk — and replaces
 * the single-physician card in both enquiry views with a three-tile panel.
 * The old `physician` field stays in the data (nothing deleted), unused.
 * Idempotent; postcondition: no "years" line renders on the route.
 *
 *   node tools/repair-consultation-panel.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const DATA = join(SITE, "public/ahv/assets/enquiry-family-data.js");
const VIEWS = join(SITE, "public/ahv/views");

const PANEL = [
  { name: "Dr. Deepu John", role: "Chief Physician & Head of Department · BAMS", src: "/ahv/assets/img/team-deepu-john.webp" },
  { name: "Dr. Akhila Oommen", role: "Ayurvedic Physician · BAMS", src: "/ahv/assets/img/team-akhila-oommen-c.webp" },
  { name: "Dr. Rahul R", role: "Ayurvedic Physician · BAMS", src: "/ahv/assets/img/team-rahul-r-c.webp" },
];
for (const p of PANEL) if (!existsSync(join(SITE, "public", p.src.replace(/^\//, "")))) { console.error(`photo missing on disk: ${p.src}`); process.exit(1); }

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
/** [start,end) of the JSON object literal starting at `at` (a "{"). */
function objectSpan(s, at) {
  let depth = 0, inStr = false;
  for (let i = at; i < s.length; i++) {
    const c = s[i];
    if (inStr) { if (c === "\\") i++; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) return [at, i + 1]; }
  }
  throw new Error("unbalanced object");
}

const problems = [];
let touched = 0;

/* 1. the record */
{
  let s = readFileSync(DATA, "utf8");
  const rec = s.indexOf('"path":"/online-consultation/"');
  if (rec < 0) { problems.push("record /online-consultation/ not found"); }
  else {
    const key = s.indexOf('"physician":{', rec);
    // the next RECORD starts at "path":"/…","slug": — breadcrumb items also carry "path"
    const nr = /"path":"\/[^"]*","slug":/g; nr.lastIndex = rec + 1; const nm = nr.exec(s); const nextRec = nm ? nm.index : -1;
    if (key < 0 || (nextRec > 0 && key > nextRec)) problems.push("physician field not found in the record");
    else if (!s.slice(rec, nextRec > 0 ? nextRec : s.length).includes('"physicians":[')) {
      const [, e] = objectSpan(s, key + '"physician":'.length);
      s = s.slice(0, e) + ',"physicians":' + JSON.stringify(PANEL) + s.slice(e);
      if (!DRY) writeFileSync(DATA, s);
      touched += 1;
      console.log(`${DRY ? "[dry] " : "fixed  "}enquiry-family-data.js  (physicians[3] added to /online-consultation/)`);
    } else console.log("as-is  enquiry-family-data.js");
  }
}

/* 2. the views */
const panelMarkup = (mobile) =>
  `<div data-physician="true" style="background:#fff;border:1px solid #E0D7C4;border-radius:4px;padding:${mobile ? "16px 18px" : "18px 22px"};max-width:${mobile ? "100%" : "640px"};box-sizing:border-box">` +
  `<p style="margin:0 0 12px;font-size:12.5px;letter-spacing:2.6px;text-transform:uppercase;color:#8F6212;font-weight:700">Our panel of Ayurvedic physicians</p>` +
  `<ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:${mobile ? "column" : "row"};flex-wrap:wrap;gap:${mobile ? "12px" : "14px 26px"}">` +
  `<sc-for list="{{ O.physicians }}" as="ph" hint-placeholder-count="3"><li style="display:flex;align-items:center;gap:12px;min-width:0">` +
  `<img src="{{ ph.src }}" alt="{{ ph.name }}" width="56" height="56" loading="lazy" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 15%;display:block;border:1px solid #E0D7C4;flex:0 0 56px">` +
  `<span style="display:flex;flex-direction:column;min-width:0"><span style="font-weight:700;font-size:16.5px;line-height:1.3">{{ ph.name }}</span><span style="font-size:14.5px;color:#514a3f;line-height:1.4">{{ ph.role }}</span></span>` +
  `</li></sc-for></ul></div>`;

for (const side of ["desktop", "mobile"]) {
  const id = `ahv-page-enquiry-${side}`;
  const file = join(VIEWS, `${id}.json`);
  const view = JSON.parse(readFileSync(file, "utf8"));
  let t = view.template;
  const at = t.indexOf('<div data-physician="true"');
  if (at < 0) { problems.push(`${id}: physician block not found`); continue; }
  if (t.slice(at, at + 400).includes("O.physicians")) { console.log(`as-is  ${id}`); continue; }
  const [a, b] = elementSpan(t, at);
  t = t.slice(0, a) + panelMarkup(side === "mobile") + t.slice(b);
  if (!DRY) { view.template = t; writeFileSync(file, JSON.stringify(view)); }
  touched += 1;
  console.log(`${DRY ? "[dry] " : "fixed  "}${id}  (single-physician card → panel of three)`);
  if (/O\.physician\.name/.test(t)) problems.push(`${id}: the single-physician binding survives`);
}
console.log(`\nrepair-consultation-panel${DRY ? " (dry)" : ""}: ${touched} file(s) changed`);
if (problems.length) { console.error("POSTCONDITION FAILURES:\n  " + problems.join("\n  ")); process.exit(1); }
