#!/usr/bin/env node
/**
 * AHV — fill the Claude Design families' labelled image slots from the record.
 *
 * Claude Design could not download the site's photographs, so its views carry
 * grey slot boxes labelled "Hero image", "Image 2", "Map 1 … 3", "Grounds
 * plan", "Image placeholder — hero banner" and left the note "record asset goes
 * in at apply". The record is english-candidate/record-images.json: every
 * route's main-content <img> tags, in DOM order, from the served page as it was
 * before the families were wired (git 9a605c14^). This tool maps slots to
 * those images by MEANING, never by guess:
 *
 *   hero slot        -> the route's first record image (the live hero)
 *   Map 1 / 2 / 3    -> the record images whose alt says Map of India /
 *                       Kerala / Palakkad (the wayfinding trio)
 *   Grounds plan     -> the record image whose alt names the grounds plan
 *   Image N / photo  -> the next unused record photograph, in order
 *
 * A slot with no qualifying image is LEFT AS IS and reported; the box keeps
 * its size, so the layout Claude Design checked does not move. Idempotent:
 * a box that already holds an <img> is skipped.
 *
 *   node tools/repair-claude-design-images.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const VIEWS = join(SITE, "public/ahv/views");
const REPOINTED = JSON.parse(readFileSync(join(SITE, "english-candidate/package-overlay/ROUTES-REPOINTED.json"), "utf8"));
const RECORD = JSON.parse(readFileSync(join(SITE, "english-candidate/record-images.json"), "utf8")).routes;

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
const text = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const viewIdsFor = (row) => {
  const base = (row.viewsTo ?? row.to).replace(/ Desktop\.dc\.html$/, "");
  return ["Desktop", "Mobile"].map((s) => `${base} ${s}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
};

let filled = 0, left = 0, viewsChanged = 0;
const report = [];
for (const row of REPOINTED) {
  const imgs = RECORD[row.path];
  if (!Array.isArray(imgs) || !imgs.length) { report.push(`${row.path}: no record images — untouched`); continue; }
  const maps = [/Map of India/i, /Map of Kerala/i, /Map of Palakkad/i].map((re) => imgs.find((i) => re.test(i.alt)));
  const plan = imgs.find((i) => /grounds|site map|plan of the/i.test(i.alt));
  const hero = imgs[0];
  const photos = imgs.filter((i) => i !== hero && !maps.includes(i) && i !== plan);

  for (const id of viewIdsFor(row)) {
    const file = join(VIEWS, `${id}.json`);
    if (!existsSync(file)) continue;
    const view = JSON.parse(readFileSync(file, "utf8"));
    let t = view.template;
    let photoCursor = 0;
    const edits = [];
    const re = /<div\b[^>]*background:\s*#E0D7C4[^>]*>/gi;
    let m;
    const spans = [];
    while ((m = re.exec(t))) spans.push(elementSpan(t, m.index));
    // Decide in DOM order (so "next photo" follows the page), apply from the
    // end (so earlier indices stay valid).
    const decided = [];
    for (const [s, e] of spans) {
      const box = t.slice(s, e);
      if (/<img\b/i.test(box)) continue;               // already filled
      const label = text(box);
      let pick = null, why = "";
      if (/hero (image|banner)|Image placeholder — hero/i.test(label)) { pick = hero; why = "hero"; }
      else if (/\bMap (\d)\b/i.test(label)) { const n = +label.match(/\bMap (\d)\b/i)[1]; pick = maps[n - 1] || null; why = `map ${n}`; }
      else if (/grounds plan|plan of the grounds/i.test(label)) { pick = plan; why = "grounds plan"; }
      else if (/\bImage \d\b|Photograph|Image placeholder|In-body image|Live asset|^Image$/i.test(label)) { pick = photos[photoCursor] || null; if (pick) photoCursor += 1; why = "photo (in order)"; }
      else { report.push(`${id}: slot "${label.slice(0, 50)}" has no recognised label — left`); left += 1; continue; }
      if (!pick) { report.push(`${id}: ${why} slot — record has no such image — left`); left += 1; continue; }
      decided.push({ s, e, box, label, pick, why });
    }
    for (const { s, e, box, label, pick, why } of decided.reverse()) {
      const open = box.match(/^<div\b[^>]*>/i)[0];
      const openFixed = /overflow:/i.test(open) ? open : open.replace(/style="/i, 'style="overflow:hidden;');
      const alt = pick.alt || label.replace(/^(Hero image|Image \d|Map \d|Grounds plan)\s*/i, "").slice(0, 120);
      const img = `<img src="${esc(pick.src)}" alt="${esc(alt)}" loading="${why === "hero" ? "eager" : "lazy"}" style="width:100%;height:100%;object-fit:cover;display:block;">`;
      t = t.slice(0, s) + openFixed + img + "</div>" + t.slice(e);
      edits.push(`${why}→${pick.src.split("/").pop().slice(0, 40)}`);
      filled += 1;
    }
    if (edits.length) {
      viewsChanged += 1;
      if (!DRY) { view.template = t; writeFileSync(file, JSON.stringify(view)); }
      console.log(`${DRY ? "[dry] " : ""}${id}: ${edits.length} slot(s) filled — ${edits.join(", ")}`);
    }
  }
}
console.log(`\nrepair-claude-design-images${DRY ? " (dry)" : ""}: ${filled} slot(s) filled across ${viewsChanged} view(s); ${left} left as labelled`);
if (report.length) console.log("left / untouched:\n  " + report.join("\n  "));
