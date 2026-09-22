#!/usr/bin/env node
/**
 * AHV — physician roster: remove a physician who is no longer on the panel.
 *
 * SOURCE. The GM's e-mail of 22 Sep 2026 (Anoop Vijayaraj, gm.hv@kairali.com,
 * "Re: Please review: new Ayurvedic Healing Village website") lists the
 * CURRENT doctors: Dr. Deepu John, Dr. Aashitha PS, Dr. Akhila Oommen, Dr. Rahul
 * Ramachandran, Dr. Adhina UB. Dr. Ashikha Raj (also spelled "Ashika") is not
 * on it. Owner ruling D-20260922-27: remove her card and every mention.
 *
 * WHERE SHE APPEARS (measured, 22 Sep): the panchkarma-treatment views (a
 * physician card), campaign-family-data.js (a `doctors[]` entry on the retreat
 * pages), campaign-nine-data.js (two block runs — image + h6 heading + expertise
 * list — on the weight-loss and pain-management campaign pages).
 *
 * The datasets are `// header\nwindow.X = {json};` files: parsed, edited,
 * re-serialised with the header kept. Idempotent; postcondition: zero
 * mentions in any served payload (exit 1 otherwise). Nothing is added: the
 * two doctors whose photos the GM still owes are NOT invented here.
 *
 *   node tools/repair-physician-roster.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const ASSETS = join(SITE, "public/ahv/assets");
const VIEWS = join(SITE, "public/ahv/views");
const NAME_RE = /Ashikh?a Raj/i;
const SRC_RE = /ashikh?a-raj/i;

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

/** Parse a `// header…\nwindow.X = {…};` dataset. */
function loadDataset(file) {
  const raw = readFileSync(file, "utf8");
  const eq = raw.indexOf("= {");
  const start = raw.indexOf("{", eq);
  const end = raw.lastIndexOf("}");
  return { head: raw.slice(0, start), data: JSON.parse(raw.slice(start, end + 1)), tail: raw.slice(end + 1) };
}
function saveDataset(file, d) { writeFileSync(file, d.head + JSON.stringify(d.data) + d.tail); }

/** Walk any JSON value; arrays get a chance to drop members. */
function walk(node, onArray) {
  if (Array.isArray(node)) { onArray(node); node.forEach((n) => walk(n, onArray)); }
  else if (node && typeof node === "object") Object.values(node).forEach((n) => walk(n, onArray));
}
const mentions = (o) => JSON.stringify(o).match(NAME_RE) || JSON.stringify(o).match(SRC_RE);

let removed = 0;
const problems = [];

/* 1. doctors[] entries (campaign-family-data) and any list of physician objects. */
for (const name of ["campaign-family-data.js", "campaign-nine-data.js", "article-family-data.js", "hist9-family-data.js"]) {
  const file = join(ASSETS, name);
  let d;
  try { d = loadDataset(file); } catch (e) { problems.push(`${name}: ${e.message}`); continue; }
  let n = 0;
  walk(d.data, (arr) => {
    // (a) an object with a `name` naming her — a physician card entry
    for (let i = arr.length - 1; i >= 0; i--) {
      const it = arr[i];
      if (it && typeof it === "object" && !Array.isArray(it) && typeof it.name === "string" && NAME_RE.test(it.name)) { arr.splice(i, 1); n += 1; }
    }
    // (c) a lone figure/image whose alt names her (the karkidaka page's doctor row)
    for (let i = arr.length - 1; i >= 0; i--) {
      const it = arr[i];
      if (it && (it.kind === "figure") && NAME_RE.test(it.alt || "")) { arr.splice(i, 1); n += 1; }
    }
    // (b) a block run: image(alt=her) → heading(text=her) → list (her expertise)
    for (let i = arr.length - 1; i >= 0; i--) {
      const it = arr[i];
      if (it && it.kind === "image" && NAME_RE.test(it.alt || "")) {
        let j = i, k = i;
        if (arr[i + 1] && arr[i + 1].kind === "heading" && NAME_RE.test(arr[i + 1].text || "")) { k = i + 1; if (arr[i + 2] && arr[i + 2].kind === "list") k = i + 2; }
        arr.splice(j, k - j + 1); n += k - j + 1;
      } else if (it && it.kind === "heading" && NAME_RE.test(it.text || "")) {
        // a heading left without its image (defensive): drop it and a following list
        let k = i; if (arr[i + 1] && arr[i + 1].kind === "list") k = i + 1;
        arr.splice(i, k - i + 1); n += k - i + 1;
      }
    }
  });
  if (n) { removed += n; if (!DRY) saveDataset(file, d); }
  console.log(`${n ? (DRY ? "[dry] " : "fixed  ") : "as-is  "}${name}${n ? `  (${n} node(s) removed)` : ""}`);
  if (mentions(d.data)) problems.push(`${name}: a mention survives`);
}

/* 2. the physician card in the panchkarma views. */
for (const side of ["desktop", "mobile"]) {
  const id = `ahv-page-panchkarma-treatment-${side}`;
  const file = join(VIEWS, `${id}.json`);
  const view = JSON.parse(readFileSync(file, "utf8"));
  let t = view.template, n = 0;
  let at = t.search(/<img[^>]*team-ashikh?a-raj/i);
  while (at >= 0) {
    // the card is the nearest enclosing <article>
    const s = t.lastIndexOf("<article", at);
    if (s < 0) break;
    const [a, b] = elementSpan(t, s);
    if (b < at) break;
    t = t.slice(0, a) + t.slice(b);
    n += 1;
    at = t.search(/<img[^>]*team-ashikh?a-raj/i);
  }
  if (n) { removed += n; if (!DRY) { view.template = t; writeFileSync(file, JSON.stringify(view)); } }
  console.log(`${n ? (DRY ? "[dry] " : "fixed  ") : "as-is  "}${id}${n ? `  (${n} card(s) removed)` : ""}`);
  if (NAME_RE.test(t) || SRC_RE.test(t)) problems.push(`${id}: a mention survives`);
}

/* 3. the homepage "Our Team of Ayurvedic Doctors" cards (owner: "remove her
      everywhere" overrides the homepage lock for this one fact). Measured: the
      card is <div> → <div style="height:…"> → <div role="img" aria-label="Dr.
      Ashika Raj, …">, followed by the name and role lines; the tile was even
      painting Dr. Akhila Oommen's photograph under her name. */
for (const id of ["home-hi-fi-v4", "home-mobile"]) {
  const file = join(VIEWS, `${id}.json`);
  const view = JSON.parse(readFileSync(file, "utf8"));
  let t = view.template, n = 0, did = "";
  let at = t.search(/<div role="img" aria-label="Dr\. Ashikh?a Raj/i);
  while (at >= 0) {
    const wrap = t.lastIndexOf("<div", at - 1);
    const card = t.lastIndexOf("<div", wrap - 1);
    const [a, b] = elementSpan(t, card);
    if (b <= at || !NAME_RE.test(t.slice(a, b))) { problems.push(`${id}: card boundary not found`); break; }
    t = t.slice(0, a) + t.slice(b);
    n += 1;
    at = t.search(/<div role="img" aria-label="Dr\. Ashikh?a Raj/i);
  }
  // The photographs were crossed: Dr. Akhila Oommen's tile painted
  // team-ashikha-raj.webp (and the removed tile painted Akhila's). Her own
  // file, team-akhila-oommen-c.webp, ships already.
  const crossed = /(aria-label="Dr\. Akhila Oommen[^"]*"[^>]*background-image:url\()\/ahv\/assets\/img\/team-ashikh?a-raj\.webp(\))/gi;
  if (crossed.test(t)) { t = t.replace(crossed, "$1/ahv/assets/img/team-akhila-oommen-c.webp$2"); n += 1; did = "photo un-crossed"; }
  if (n) { removed += n; if (!DRY) { view.template = t; writeFileSync(file, JSON.stringify(view)); } }
  console.log(`${n ? (DRY ? "[dry] " : "fixed  ") : "as-is  "}${id}${n ? `  (${n} change(s)${did ? ", " + did : ""})` : ""}`);
  if (NAME_RE.test(t) || SRC_RE.test(t)) problems.push(`${id}: a mention survives`);
}

/* Postcondition across every served payload. */
if (!DRY) {
  for (const dir of [ASSETS, VIEWS]) for (const f of readdirSync(dir)) {
    if (!/\.(js|json)$/.test(f)) continue;
    const s = readFileSync(join(dir, f), "utf8");
    if (NAME_RE.test(s) || SRC_RE.test(s)) problems.push(`${f}: still mentions Dr. Ashikha Raj`);
  }
}
console.log(`\nrepair-physician-roster${DRY ? " (dry)" : ""}: ${removed} node(s) removed`);
if (problems.length) { console.error("POSTCONDITION FAILURES:\n  " + problems.join("\n  ")); process.exit(1); }
