#!/usr/bin/env node
/**
 * AHV — /things-to-do/ as a real hub page (owner, 23 Sep 2026: "the content has
 * no images and the images are in the footer and not internally linked
 * properly").
 *
 * The WordPress capture is fourteen paragraphs of the shape
 * "<strong>Nature Walk</strong>: Taking a nature walk at Kairali …" under three
 * headings, and three picture cards at the very end. Each bold lead names a
 * page this site serves (/nature-walk/, /cooking-classes/, /elephant-safari/ …).
 * This turns every such paragraph into a CARD in the collection family's own
 * card grid: the target page's hero photograph, the lead as a link to that
 * page, the paragraph's own text. The link target is resolved from the
 * section-nav tree (owner-authorised breadcrumb labels) and the photograph is
 * the target page's own hero — nothing new is written or chosen by hand. A
 * lead with no page of its own (Herbal Garden) stays a paragraph.
 *
 * Idempotent (marked record.thingsToDoCards). Run after import and after
 * tools/build-section-nav.mjs.   node tools/repair-things-to-do.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(SITE, "public/ahv/assets");
const DRY = process.argv.includes("--dry");
const FILE = path.join(ASSETS, "collection-family-data.js");
const nav = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/section-nav.json"), "utf8"));

function loadDataset(file) { const w = {}; vm.runInNewContext(fs.readFileSync(file, "utf8"), { window: w }); return Object.values(w)[0]; }
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// label → path from the Things to Do + Village Facilities trees (the pages these leads name)
const byLabel = new Map();
for (const hub of ["/things-to-do/", "/village-facilities/", "/knowledge-centre/", "/training-programs/"]) {
  const walk = (nodes) => nodes.forEach((n) => { if (n.link) byLabel.set(norm(n.label), n.path); walk(n.children || []); });
  walk(nav.sections[hub].items);
  byLabel.set(norm(nav.sections[hub].label), hub);
}
// synonyms the source spells differently from the breadcrumb label (both name the same page)
const ALIAS = { "houseboat tour": "houseboat tour", "yoga classes theory": "yoga classes theory", "yoga classes practical": "practical yoga classes" };

// hero photograph of every route, from whichever dataset serves it
const heroesFile = path.join(SITE, "english-candidate/article-heroes.json");
const heroes = fs.existsSync(heroesFile) ? (JSON.parse(fs.readFileSync(heroesFile, "utf8")).routes || {}) : {};
const hero = new Map();
for (const f of fs.readdirSync(ASSETS).filter((x) => /-data\.js$/.test(x))) {
  let D; try { D = loadDataset(path.join(ASSETS, f)); } catch { continue; }
  for (const R of (D && (D.routes || D.records)) || []) {
    if (!R || !R.path || hero.has(R.path)) continue;
    // the page's OWN photograph: the per-route hero the owner had assigned
    // (english-candidate/article-heroes.json), else the first photograph inside
    // the article body, else the record's hero — the WordPress source reused one
    // paddy-field aerial as the hero of most pages (owner, 23 Sep: no duplicates)
    const assigned = heroes[R.path];
    const body = (R.components || []).filter((c) => !/hero/i.test(c.component || "")).flatMap((c) => c.blocks || []).find((b) => b.kind === "image" && b.src && !/logo|our-story/i.test(b.src));
    const img = assigned || body
      || ((R.heroImage && R.heroImage.src) ? R.heroImage : (R.hero && R.hero.image && R.hero.image.src) ? R.hero.image : (R.hero && R.hero.src) ? R.hero : null);
    if (img && img.src) hero.set(R.path, { src: img.src, alt: img.alt || "", width: img.width, height: img.height });
  }
}

const D = loadDataset(FILE);
const R = D.routes.find((r) => r.path === "/things-to-do/");
if (!R) throw new Error("/things-to-do/ not in collection-family-data.js");
if (R.thingsToDoCards) { console.log("as-is  /things-to-do/"); process.exit(0); }

let made = 0, kept = [];
for (const c of R.components) {
  if (c.component !== "source-body-paragraph" || c.blocks.length !== 1 || c.blocks[0].kind !== "para") continue;
  const p = c.blocks[0];
  const lead = p.tree[0];
  if (!lead || lead.k !== "e" || lead.tag !== "strong" || !lead.c || lead.c[0].k !== "t") continue;
  const label = lead.c[0].v.replace(/[:\s]+$/, "").trim();
  const key = ALIAS[norm(label)] || norm(label);
  const target = byLabel.get(key) || byLabel.get(key.replace(/^the /, ""));
  if (!target) { kept.push(label); continue; }
  const img = hero.get(target);
  const rest = p.tree.slice(1);
  if (rest[0] && rest[0].k === "t") rest[0] = { k: "t", v: rest[0].v.replace(/^\s*:\s*/, "") };
  const blocks = [];
  if (img) blocks.push({ kind: "image", ptr: p.ptr + "/img", src: img.src, alt: img.alt, width: 640, height: 400, note: "the target page's own hero photograph (tools/repair-things-to-do.mjs)" });
  blocks.push({ kind: "heading", tag: "h3", ptr: p.ptr + "/h", tree: [{ k: "e", tag: "a", attrs: { href: target }, c: [{ k: "t", v: label }] }] });
  blocks.push({ kind: "para", ptr: p.ptr, tree: rest });
  blocks.push({ kind: "line", ptr: p.ptr + "/more", tree: [{ k: "e", tag: "a", attrs: { href: target }, c: [{ k: "t", v: "Read more" }] }], sourceClass: "wp-block-button__link" });
  c.component = "collection-cards";
  c.blocks = [{ kind: "card", ptr: p.ptr + "/card", blocks }];
  made++;
}
// consecutive cards become ONE grid (the renderer lays a component's cards out together)
{
  const merged = [];
  for (const c of R.components) {
    const last = merged[merged.length - 1];
    if (c.component === "collection-cards" && last && last.component === "collection-cards" && last.merged) { last.blocks.push(...c.blocks); continue; }
    if (c.component === "collection-cards" && c.blocks.every((b) => b.kind === "card" && /\/card$/.test(b.ptr))) merged.push({ ...c, merged: true }); else merged.push(c);
  }
  R.components = merged.map(({ merged: _m, ...c }) => c);
}
R.thingsToDoCards = { generated: new Date().toISOString(), cards: made, keptAsParagraphs: kept, by: "tools/repair-things-to-do.mjs" };

// write back in the dataset's own "// header\nwindow.X = {json};" form
const src = fs.readFileSync(FILE, "utf8");
const start = src.indexOf("{", src.indexOf("= {")), end = src.lastIndexOf("}") + 1;
const out = src.slice(0, start) + JSON.stringify(D) + src.slice(end);
if (!DRY) fs.writeFileSync(FILE, out);
console.log(`${DRY ? "[dry] " : "fixed  "}/things-to-do/: ${made} lead paragraphs → cards with the target page's photograph; kept as text: ${kept.join(", ") || "none"}`);
