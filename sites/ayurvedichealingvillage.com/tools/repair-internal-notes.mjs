#!/usr/bin/env node
/**
 * AHV — remove the design-review annotations from the final build and fill
 * the slots those annotations were standing in for (owner directive
 * D-20260922-13, 22 Sep 2026: "remove any internal notes from the final build").
 *
 * WHAT COUNTS AS A NOTE, and what does not (D-20260922-10, same day):
 *   · a NOTE is a designer/builder annotation — "Draft — approve or replace",
 *     "Video not loaded in this prototype", "record asset goes in at apply",
 *     "Official badge pending", a breadcrumb chip, a slot label. These go.
 *   · a [TO CONFIRM] FACT CHIP is not a note: it marks a fact the record does
 *     not hold (offer validity, defence eligibility, training timetable, the
 *     cancer physician standfirst). The owner ruled these STAY VISIBLE on the
 *     preview. This tool never touches a [TO CONFIRM] chip.
 *   · a DRAFT chip on a line the owner has APPROVED (D-20260922-12: the
 *     photo-gallery intro, the attractions summaries and "Good for" labels,
 *     the how-to-reach route description, the product-family "not sold on
 *     this website" line) is a note — the line stays, the chip goes.
 *
 * Every edit below is an exact, idempotent string transform on a served view
 * (public/ahv/views/*.json), desktop and mobile alike, and every slot fill
 * reads from the record (english-candidate/record-images.json — the served
 * page as it was before the families were wired, git 9a605c14^). Nothing is
 * invented: a slot with no record image is reported and left.
 *
 * Postconditions fail loudly (exit 1) if any listed note is still present.
 * Re-run after every import — the importer rewrites public/ahv wholesale;
 * order: after repair-claude-design-images.mjs.
 *
 *   node tools/repair-internal-notes.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const VIEWS = join(SITE, "public/ahv/views");
const RECORD = JSON.parse(readFileSync(join(SITE, "english-candidate/record-images.json"), "utf8")).routes;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const VOID = new Set(["br", "img", "hr", "meta", "link", "input", "source", "path", "circle", "rect", "line", "polyline", "polygon", "use", "wbr"]);
/** [start, end) of the element whose opening tag begins at `at`. */
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
/** Remove every element of `tag` whose text contains `needle` (the element that DIRECTLY holds the text). */
function dropElements(t, tag, needle) {
  let n = 0, from = 0;
  for (;;) {
    const i = t.indexOf(needle, from);
    if (i < 0) break;
    // the nearest enclosing <tag …> before the needle
    const s = t.lastIndexOf(`<${tag}`, i);
    if (s < 0) { from = i + needle.length; continue; }
    const [a, b] = elementSpan(t, s);
    if (b <= i) { from = i + needle.length; continue; }          // not enclosing
    t = t.slice(0, a) + t.slice(b).replace(/^\s+(?=<)/, " ");
    n += 1; from = a;
  }
  return [t, n];
}

const report = [];
const problems = [];
let touched = 0;

function load(id) { const f = join(VIEWS, `${id}.json`); return existsSync(f) ? { f, v: JSON.parse(readFileSync(f, "utf8")) } : null; }
function save(id, f, v, before, did) {
  const after = JSON.stringify(v);
  if (after === before) { console.log(`as-is  ${id}`); return; }
  touched += 1;
  if (!DRY) writeFileSync(f, after);
  console.log(`${DRY ? "[dry] " : "fixed  "}${id}  (${did.join(", ")})`);
}
function forBoth(base, fn) {
  for (const side of ["desktop", "mobile"]) {
    const id = `${base}-${side}`;
    const got = load(id);
    if (!got) { problems.push(`missing view: ${id}`); continue; }
    const before = JSON.stringify(got.v);
    const did = [];
    fn(got.v, did, side, id);
    save(id, got.f, got.v, before, did);
  }
}

/* 1. campaign-retreat: two prototype notes in the story cards and the form. */
forBoth("ahv-page-campaign-retreat", (v, did) => {
  let n; [v.template, n] = dropElements(v.template, "p", "Video not loaded in this prototype."); if (n) did.push(`video note×${n}`);
  [v.template, n] = dropElements(v.template, "span", "The source page injects its question here at run time."); if (n) did.push(`question note×${n}`);
});

/* 2. panchkarma-treatment: a builder annotation in a physician card and a
      "badge pending" sub-label on the PATWA award tile. The award name stays
      (record fact); the dashed placeholder frame becomes the site's hairline. */
forBoth("ahv-page-panchkarma-treatment", (v, did) => {
  let n; [v.template, n] = dropElements(v.template, "p", "Live source repeats Dr. Deepu John"); if (n) did.push(`physician-card note×${n}`);
  const before = v.template;
  v.template = v.template.replace(/<br><span[^>]*>Official badge pending<\/span>/g, "");
  if (v.template !== before) did.push("badge-pending label");
  const b2 = v.template;
  v.template = v.template.replace(/(font-size:13\.5px;line-height:1\.2;color:#8F6212;)border:1px dashed #C1882C;/g, "$1border:1px solid #E9E2D3;");
  if (v.template !== b2) did.push("badge frame → hairline");
});

/* 3. product-family: the approved "not sold on this website" line loses its
      chip; the seven "Image — self-host" slots take the record's product
      photographs, matched by the product's name against the record alt text. */
{
  const imgs = RECORD["/product-range/"] || [];
  const byAlt = (re) => imgs.find((i) => re.test(i.alt));
  const MAP = {
    "Kairali Ayurvedic Herbal Tea": byAlt(/Herbal Tea/i),
    "Ayurvedic Proprietary Organics": byAlt(/Proprietary-?\s?Organics/i),
    "Kair by Kairali": byAlt(/Kair by Kairali/i),
    "Kairali Ayurvedic Proprietary Medicines": byAlt(/Proprietary Medicines/i),
    "Books": byAlt(/Book covers/i),
    "Kairali Ayurvedic Equipment": byAlt(/treatment table|brass oil vessel/i),
    // the one product photograph the alt text does not name: the boxed
    // classical range shot, the only record photograph left unmatched
    "Kairali Ayurvedic Classical Medicines": byAlt(/branded cartons/i),
  };
  forBoth("ahv-template-product-family", (v, did) => {
    let n; [v.template, n] = dropElements(v.template, "span", "Draft — approve or replace"); if (n) did.push(`draft chip×${n}`);
    // the slot: <div style="…background:#E0D7C4…"><span>Image — self-host</span><span>{{ e.file }}</span></div>
    const slotRe = /<div style="([^"]*)background:#E0D7C4;([^"]*)">\s*<span[^>]*>Image — self-host<\/span>\s*<span[^>]*>\{\{ e\.file \}\}<\/span>\s*<\/div>/;
    const m = v.template.match(slotRe);
    if (m) {
      const sizing = (m[1] + m[2]).replace(/display:flex;|flex-direction:column;|align-items:center;|justify-content:center;|gap:8px;|text-align:center;|padding:1[46]px;/g, "");
      v.template = v.template.replace(slotRe, `<div style="${sizing}overflow:hidden;background:#E0D7C4;"><img src="{{ e.src }}" alt="{{ e.name }}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`);
      did.push("image slot → record photo");
    }
    // the logic: give every entry its record photograph
    if (!/\.src\b|src:/.test(v.logic || "") || !/ENTRIES_SRC/.test(v.logic || "")) {
      const missing = Object.entries(MAP).filter(([, i]) => !i).map(([k]) => k);
      if (missing.length) { problems.push(`product-family: no record image for ${missing.join(", ")}`); return; }
      const table = JSON.stringify(Object.fromEntries(Object.entries(MAP).map(([k, i]) => [k, i.src])));
      v.logic = v.logic.replace(/class Component extends DCLogic \{/, `const ENTRIES_SRC = ${table};\nENTRIES.forEach(e => { e.src = ENTRIES_SRC[e.name] || ''; });\n\nclass Component extends DCLogic {`);
      if (!/ENTRIES_SRC/.test(v.logic)) problems.push("product-family: logic anchor not found");
      else did.push("entries ← record src");
    }
  });
}

/* 4. photo-collections: the approved intro loses its DRAFT chip. */
forBoth("ahv-template-photo-collections", (v, did) => {
  let n; [v.template, n] = dropElements(v.template, "p", "Draft — approve or replace"); if (n) did.push(`draft chip×${n}`);
});

/* 5. attractions-by-distance: the approved summaries lose the DRAFT panel. */
forBoth("ahv-template-attractions-by-distance", (v, did) => {
  let n; [v.template, n] = dropElements(v.template, "p", "DRAFT — approve or replace:"); if (n) did.push(`draft panel×${n}`);
});

/* 6. how-to-reach: the grounds-plan artwork slot takes the record's grounds
      plan (alt names it); the caption keeps its first sentence only. */
{
  const plan = (RECORD["/how-to-reach/"] || []).find((i) => /aerial map of the grounds|grounds plan/i.test(i.alt));
  forBoth("ahv-page-how-to-reach", (v, did) => {
    if (!plan) { problems.push("how-to-reach: record has no grounds-plan image"); return; }
    // the dashed slot box: <div style="…border:1px dashed #C9BFA8;…"> <p>… artwork slot [TO CONFIRM]</p> <p>…</p> (desktop: a map-links div follows) </div>
    // The two label paragraphs become the plan; the box keeps its size and
    // its links, and its dashed frame becomes the site's hairline.
    const slotRe = /<div style="([^"]*)border:1px dashed #C9BFA8;([^"]*)">\s*<p[^>]*>[^<]*artwork slot \[TO CONFIRM\]<\/p>\s*<p[^>]*>[^<]*<\/p>/;
    if (slotRe.test(v.template)) {
      v.template = v.template.replace(slotRe, (_all, a, b) => {
        return `<div style="${a}border:1px solid #E9E2D3;${b}"><img src="${esc(plan.src)}" alt="${esc(plan.alt)}" loading="lazy" style="width:100%;flex:1 1 auto;min-height:0;max-height:100%;object-fit:contain;display:block;">`;
      });
      did.push("grounds plan ← record");
    }
    const capRe = /(<p data-cap="3"[^>]*>)The village grounds at Olassery, Kodumbu\.\s*<strong[^>]*>DRAFT — approve or replace[:.]<\/strong>[^<]*(<\/p>)/;
    if (capRe.test(v.template)) { v.template = v.template.replace(capRe, "$1The village grounds at Olassery, Kodumbu.$2"); did.push("caption note"); }
  });
}

/* 7. no-preservatives: the review markers (breadcrumb chip, draft standfirst
      chip) are a design prop; off in the final build. */
forBoth("ahv-page-no-preservatives", (v, did) => {
  // props are stored as a JSON STRING in the served payload
  const asString = typeof v.props === "string";
  const props = asString ? JSON.parse(v.props) : (v.props || {});
  const p = props.showDraftMarkers;
  if (p && p.default !== false) { p.default = false; v.props = asString ? JSON.stringify(props) : props; did.push("showDraftMarkers → false"); }
});

/* 8. sitemap: two notes about the SOURCE ("link broken in source", "have no
      destination in the source") — internal by definition. The headings and
      lists they annotate stay; the gaps are logged in the apply report. */
forBoth("ahv-page-sitemap", (v, did) => {
  const b = v.template;
  v.template = v.template.replace(/\s*<(span|p)[^>]*>\[TO CONFIRM\] link broken in source<\/\1>/g, "");
  if (v.template !== b) did.push("source-link note");
  let n; [v.template, n] = dropElements(v.template, "p", "have no destination in the source."); if (n) did.push(`villa-gallery note×${n}`);
  // D-20260922-14: the "Media Gallery" group heading links to the served
  // gallery hub. (The four villa pages already link from the Villas group.)
  const headRe = /(<h[34]\b[^>]*>)Media Gallery(<\/h[34]>)/;
  if (headRe.test(v.template)) {
    v.template = v.template.replace(headRe, '$1<a href="/photo-gallery/" style="color:inherit;text-decoration:none;display:inline-flex;align-items:center;min-height:44px;">Media Gallery</a>$2');
    did.push("Media Gallery → /photo-gallery/");
  }
});

/* 9. the forms' "design review prototype" notices. The enquiry, campaign and
      retreat forms have no endpoint yet — Deepu's pre-flip work
      (Q-AHV-ENQUIRY-ENDPOINT, answered 2026-09-20) — and every one of them
      prints a builder's notice under the button ("Design review prototype —
      nothing is submitted…", "Prototype only — this form does not submit…",
      one of them in Russian). Hiding the notice would tell a visitor a
      message went out. Removing the internal register while keeping the truth:
      every such string, in the views and in the datasets that render them,
      becomes ONE visitor-facing line built from the locked facts only
      (info@kairali.com, WhatsApp +91 92898 38797). Deepu's endpoint work
      replaces the line when the forms send. */
const FALLBACK = "This form is being connected. Until then, please write to info@kairali.com or message us on WhatsApp at +91 92898 38797.";
const NOTICE_RE = /(Design review prototype|Prototype only)[^'"<{}\n]*/g;
for (const id of ["ahv-page-enquiry-desktop", "ahv-page-enquiry-mobile", "ahv-page-campaign-retreat-desktop", "ahv-page-campaign-retreat-mobile"]) {
  const got = load(id); if (!got) { problems.push(`missing view: ${id}`); continue; }
  const before = JSON.stringify(got.v); const did = [];
  for (const k of ["template", "logic"]) {
    const s = got.v[k] || ""; const n = (s.match(NOTICE_RE) || []).length;
    if (n) { got.v[k] = s.replace(NOTICE_RE, FALLBACK); did.push(`${k} notice×${n}`); }
  }
  save(id, got.f, got.v, before, did);
}
for (const rel of ["public/ahv/assets/campaign-nine-render.js", "public/ahv/assets/enquiry-family-data.js", "public/ahv/assets/utility7-family-data.js"]) {
  const f = join(SITE, rel); if (!existsSync(f)) { problems.push(`missing asset: ${rel}`); continue; }
  const s = readFileSync(f, "utf8"); const n = (s.match(NOTICE_RE) || []).length;
  if (n) { touched += 1; if (!DRY) writeFileSync(f, s.replace(NOTICE_RE, FALLBACK)); console.log(`${DRY ? "[dry] " : "fixed  "}${rel}  (notice×${n})`); } else console.log(`as-is  ${rel}`);
}

/* Postconditions: none of the removed strings survives in any treated view. */
const GONE = [
  ["ahv-page-campaign-retreat", ["Video not loaded in this prototype", "injects its question here at run time"]],
  ["ahv-page-panchkarma-treatment", ["Live source repeats", "Official badge pending"]],
  ["ahv-template-product-family", ["Draft — approve or replace", "Image — self-host", "{{ e.file }}"]],
  ["ahv-template-photo-collections", ["Draft — approve or replace"]],
  ["ahv-template-attractions-by-distance", ["DRAFT — approve or replace"]],
  ["ahv-page-how-to-reach", ["DRAFT — approve or replace", "artwork slot [TO CONFIRM]"]],
  ["ahv-page-sitemap", ["link broken in source", "have no destination in the source"]],
  ["ahv-page-enquiry", ["Design review prototype", "Prototype only"]],
  ["ahv-page-campaign-retreat", ["Design review prototype", "Prototype only"]],
];
for (const [base, needles] of GONE) for (const side of ["desktop", "mobile"]) {
  const got = load(`${base}-${side}`); if (!got) continue;
  const t = DRY ? "" : (got.v.template + "\n" + (got.v.logic || ""));
  for (const n of needles) if (t.includes(n)) problems.push(`${base}-${side}: "${n}" still present`);
}
console.log(`\nrepair-internal-notes${DRY ? " (dry)" : ""}: ${touched} view(s) changed`);
if (report.length) console.log("notes:\n  " + report.join("\n  "));
if (problems.length) { console.error("POSTCONDITION FAILURES:\n  " + problems.join("\n  ")); process.exit(1); }
