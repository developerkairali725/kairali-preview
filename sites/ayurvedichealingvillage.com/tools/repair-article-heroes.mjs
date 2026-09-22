#!/usr/bin/env node
/**
 * AHV — per-page hero photographs for the article families.
 *
 * WHY. The WordPress source used one image — our-story.png, the aerial of the
 * paddy fields — as the hero of ~120 article pages, so the rebuild shows the
 * same photograph at the top of a hair-oil product page, a festival page and
 * a CSR page alike (owner, 23 Sep: "stop using duplicates"; "/kair-by-kairali/
 * is broken"). The record keeps that hero as its own `components[hero]` image
 * block (reader25a/25b/6c/travel families) or as `heroImg` (article family).
 *
 * WHAT THIS DOES. english-candidate/article-heroes.json maps a route to the
 * photograph that belongs to it (src + alt, every entry sourced — the file
 * says from where). For each mapped route the tool finds the record in
 * whichever dataset the manifest names and rewrites the hero image's src/alt.
 * Nothing else in the record changes; a route whose record has no hero block
 * is reported and skipped. Idempotent.
 *
 *   node tools/repair-article-heroes.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const MAP = JSON.parse(readFileSync(join(SITE, "english-candidate/article-heroes.json"), "utf8")).routes;
const MANIFEST = JSON.parse(readFileSync(join(SITE, "english-candidate/route-manifest.json"), "utf8")).routes;

function loadDataset(file) {
  const raw = readFileSync(file, "utf8");
  const eq = raw.indexOf("= {");
  const start = raw.indexOf("{", eq);
  const end = raw.lastIndexOf("}");
  return { head: raw.slice(0, start), data: JSON.parse(raw.slice(start, end + 1)), tail: raw.slice(end + 1) };
}
const saveDataset = (file, d) => writeFileSync(file, d.head + JSON.stringify(d.data) + d.tail);

/** Find the record object for a route anywhere in the dataset. */
function findRecord(node, route, depth = 0) {
  if (!node || typeof node !== "object" || depth > 8) return null;
  if (Array.isArray(node)) { for (const n of node) { const r = findRecord(n, route, depth + 1); if (r) return r; } return null; }
  if (node.path === route && (node.components || node.heroImg || node.sections)) return node;
  for (const v of Object.values(node)) { const r = findRecord(v, route, depth + 1); if (r) return r; }
  return null;
}

const touchedFiles = new Map();
const problems = [];
let done = 0;
for (const [route, hero] of Object.entries(MAP)) {
  if (!hero || !hero.src) continue;
  if (!existsSync(join(SITE, "public", hero.src.replace(/^\//, "")))) { problems.push(`${route}: hero file not on disk: ${hero.src}`); continue; }
  const row = MANIFEST.find((r) => r.path === route);
  if (!row || !row.dataset) { problems.push(`${route}: no dataset in the manifest`); continue; }
  const file = join(SITE, "public/ahv", row.dataset);
  const d = touchedFiles.get(file) || loadDataset(file);
  touchedFiles.set(file, d);
  const rec = findRecord(d.data, route);
  if (!rec) { problems.push(`${route}: record not found in ${row.dataset}`); continue; }
  let block = null;
  if (rec.heroImg && typeof rec.heroImg === "object") block = rec.heroImg;
  else if (Array.isArray(rec.components)) {
    const heroC = rec.components.find((c) => c.component === "hero");
    block = heroC && Array.isArray(heroC.blocks) ? heroC.blocks.find((b) => b.kind === "image") : null;
  }
  if (!block) { problems.push(`${route}: record has no hero image block`); continue; }
  if (block.src === hero.src && block.alt === hero.alt) { console.log(`as-is  ${route}`); continue; }
  block.src = hero.src;
  block.alt = hero.alt;
  if ("sourceUrl" in block) block.sourceUrl = hero.sourceUrl || block.sourceUrl;
  d.changed = true;
  done += 1;
  console.log(`${DRY ? "[dry] " : "fixed  "}${route}  → ${hero.src.split("/").slice(-2).join("/")}`);
}
if (!DRY) for (const [file, d] of touchedFiles) if (d.changed) saveDataset(file, d);
console.log(`\nrepair-article-heroes${DRY ? " (dry)" : ""}: ${done} hero(es) set`);
if (problems.length) { console.error("PROBLEMS:\n  " + problems.join("\n  ")); process.exit(1); }
