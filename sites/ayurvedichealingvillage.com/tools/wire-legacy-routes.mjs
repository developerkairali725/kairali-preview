#!/usr/bin/env node
/**
 * AHV — put the two owner-ruled legacy routes into the payload the runtime reads.
 *
 * tools/build-legacy-route.mjs produces a record per page under
 * english-candidate/legacy-routes/. This carries those records into
 * public/ahv/assets/article-family-data.js, which is the dataset the
 * article-reader renderer looks in (`window.AHV_ARTICLE`), and fills the few
 * fields the renderer expects that a captured page cannot supply on its own —
 * breadcrumbs, the breadcrumb schema, and the hero image.
 *
 * WHY APPEND TO AN APPROVED DATASET RATHER THAN SHIP A NEW ONE. A route names
 * exactly one dataset, and the renderer reads exactly one global. A second file
 * setting AHV_ARTICLE would clobber the first; a second renderer for two pages
 * is a family nobody asked for. So the records are appended, and — like every
 * other repair tool here — this is idempotent and re-run after any import,
 * because the importer regenerates the dataset from the package and the package
 * still does not contain these two pages.
 *
 * EVERY APPENDED RECORD CARRIES ITS PROVENANCE. `provenance.ruling` names the
 * owner decision that created it. A row in an approved dataset with no
 * provenance is indistinguishable from one the design package produced, and
 * that is exactly how a page ends up shipped with nobody able to say who asked
 * for it.
 *
 *   node tools/wire-legacy-routes.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const SRC_DIR = join(SITE, "english-candidate/legacy-routes");
const DATASET = join(SITE, "public/ahv/assets/article-family-data.js");
const BASE = "https://ayurvedichealingvillage.com";

if (!existsSync(SRC_DIR)) {
  console.log("no legacy-routes records — nothing to wire");
  process.exit(0);
}

const raw = readFileSync(DATASET, "utf8");
const open = raw.indexOf("{");
const close = raw.lastIndexOf("}");
const prefix = raw.slice(0, open);
const suffix = raw.slice(close + 1);
const data = JSON.parse(raw.slice(open, close + 1));

/** Home + the page itself. These pages hang off the root: they are ad landing
 *  destinations with no parent section, which the live breadcrumb also says. */
const crumbsFor = (rec) => [
  { label: "Home", path: "/", canonical: `${BASE}/` },
  { label: rec.h1 || rec.title, path: rec.path, canonical: `${BASE}${rec.path}` },
];

const schemaFor = (crumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.label,
    item: c.canonical,
  })),
});

/**
 * Pixel width, read from the file header. PNG, JPEG and WebP only, which is the
 * whole of what these two pages carry.
 *
 * It exists because "the first image on the page" is not the hero: on both pages
 * the first image is chrome — a NABH badge on one, the Kairali logo on the other.
 * Picking either as the hero would put a 200px badge across the top of the page.
 * Measuring is cheap and it is the difference between a heuristic and a fact.
 */
function pixelWidth(file) {
  let b;
  try { b = readFileSync(file); } catch { return 0; }
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return b.readUInt32BE(16); // PNG
  if (b.length > 12 && b.toString("ascii", 8, 12) === "WEBP") {
    const fmt = b.toString("ascii", 12, 16);
    if (fmt === "VP8 ") return b.readUInt16LE(26) & 0x3fff;
    if (fmt === "VP8L") { const n = b.readUInt32LE(21); return (n & 0x3fff) + 1; }
    if (fmt === "VP8X") return ((b[24] | (b[25] << 8) | (b[26] << 16)) & 0xffffff) + 1;
    return 0;
  }
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) { // JPEG: walk the segments
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i += 1; continue; }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return b.readUInt16BE(i + 7);
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return 0;
}

/** Wide enough to be a page image rather than a badge, logo or award mark. */
const HERO_MIN_WIDTH = 600;

let added = 0;
let refreshed = 0;
for (const f of readdirSync(SRC_DIR).filter((n) => n.endsWith(".json")).sort()) {
  const rec = JSON.parse(readFileSync(join(SRC_DIR, f), "utf8"));
  if (!rec.provenance?.ruling) throw new Error(`${f}: no provenance.ruling — refusing to append an unattributed record`);

  const crumbs = crumbsFor(rec);
  // The hero is the first figure wide enough to BE one, measured from the file
  // rather than assumed from its position. No qualifying image means no hero:
  // the reader template renders the body without one, which is better than
  // stretching a logo across the top of the page.
  const figures = rec.items.filter((i) => i.kind === "figure");
  const firstFigure = figures.find((i) => pixelWidth(join(SITE, "public", i.src.replace(/^\//, ""))) >= HERO_MIN_WIDTH) || null;
  const row = {
    path: rec.path,
    slug: rec.slug,
    title: rec.title,
    h1: rec.h1,
    metadata: rec.metadata,
    crumbs,
    breadcrumbSchemaExpected: schemaFor(crumbs),
    heroImg: firstFigure ? { src: firstFigure.src, sourceUrl: firstFigure.sourceUrl, alt: firstFigure.alt || "" } : null,
    // The Knowledge Centre sidebar belongs to the editorial routes. These two
    // are landing pages and the live originals carry no such menu, so an empty
    // one is the honest value — not a copy of somebody else's navigation.
    nav: null,
    items: rec.items,
    provenance: rec.provenance,
  };

  const at = data.routes.findIndex((r) => r.path === rec.path);
  if (at === -1) { data.routes.push(row); added += 1; }
  else if (JSON.stringify(data.routes[at]) !== JSON.stringify(row)) { data.routes[at] = row; refreshed += 1; }
}

if (!DRY && (added || refreshed)) {
  writeFileSync(DATASET, prefix + JSON.stringify(data) + suffix);
}
console.log(`${DRY ? "[dry] " : ""}legacy routes: ${added} appended, ${refreshed} refreshed, ${data.routes.length} record(s) in the dataset`);
for (const r of data.routes.filter((x) => x.provenance)) {
  console.log(`  · ${r.path}  (${r.items.length} blocks, lang ${r.metadata.htmlLang}, hero ${r.heroImg ? r.heroImg.src.split("/").pop() : "none"})`);
}
