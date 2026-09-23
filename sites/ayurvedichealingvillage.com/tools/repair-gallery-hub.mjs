#!/usr/bin/env node
/**
 * AHV — /gallery/ as a selection page for EVERY gallery (owner, 23 Sep 2026:
 * "just large images and small left-aligned links … not all galleries are
 * present … broken").
 *
 * The capture listed three items (Photo Gallery, Video Gallery, a Google 360
 * view) as full-width images with a text link under each. The site serves
 * eleven galleries. This rebuilds the page's list section as ONE card grid in
 * the collection family's own card shape — one card per gallery, in the order
 * the site's own manifests declare them:
 *   · the eight photo collections (english-candidate/galleries-2026.json:
 *     title + its first photograph as the cover),
 *   · Ayurveda Gallery, Video Gallery and Virtual Tour (route manifest title;
 *     cover = the route's own hero/first image).
 * The Google 360 link is kept as the Virtual Tour card's target only if the
 * site has no /virtual-tour/ route (it has one, so it is not duplicated).
 * Nothing is written by hand: titles and images come from the manifests.
 * Deterministic: the card list is rebuilt from the manifests on every run.   node tools/repair-gallery-hub.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(SITE, "public/ahv/assets");
const DRY = process.argv.includes("--dry");
const FILE = path.join(ASSETS, "seven-informational-data.js");
const manifest = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8"));
const g2026 = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/galleries-2026.json"), "utf8"));

function loadDataset(file) { const w = {}; vm.runInNewContext(fs.readFileSync(file, "utf8"), { window: w }); return Object.values(w)[0]; }
const firstImage = (obj) => { const m = JSON.stringify(obj).match(/(\/ahv\/assets\/img\/[^"'\\)\s]+?\.(?:webp|jpg|jpeg|png))/); return m ? m[1] : null; };

const cards = [];
// 1. the eight photo collections, in manifest order
// galleries-2026.json `routes` is an ARRAY of records ({ path, h1, … }); iterating it with
// Object.entries once gave keys "0"–"7" as the card hrefs (dead links, caught by the 23 Sep review)
for (const g of (Array.isArray(g2026.routes) ? g2026.routes : Object.entries(g2026.routes).map(([path, v]) => ({ path, ...v })))) {
  const route = g.path;
  const cover = firstImage(g);
  const count = (g.chapters || []).reduce((n, c) => n + ((c.images || c.items || []).length || 0), 0) || null;
  cards.push({ route, title: g.h1 || g.title, cover, alt: g.h1 || g.title, note: count ? `${count} photographs` : "" });
}
// 2. the other gallery routes the site serves
const extra = ["/ayurveda-gallery/", "/video-gallery/", "/virtual-tour/"];
const datasets = {};
for (const p of extra) {
  const r = manifest.routes.find((x) => x.path === p);
  if (!r) continue;
  let cover = null;
  if (r.dataset) {
    const key = r.dataset;
    datasets[key] = datasets[key] || loadDataset(path.join(SITE, "public/ahv", key));
    const rec = (datasets[key].routes || []).find((x) => x.path === p);
    cover = rec ? firstImage(rec) : null;
    // the video gallery is YouTube facades (tools/repair-video-gallery.mjs): its cover is the first film's self-hosted thumbnail
    if (!cover && rec) {
      const ids = [...JSON.stringify(rec).matchAll(/"youtubeId":"([A-Za-z0-9_-]+)"/g)].map((m) => m[1]);
      // the facade thumbnails the page actually paints (tools/repair-video-gallery.mjs) are the source of truth
      const snap = path.join(SITE, "english-candidate/prerender/video-gallery.html");
      const painted = fs.existsSync(snap) ? [...fs.readFileSync(snap, "utf8").matchAll(/video-thumb-([A-Za-z0-9_-]+)\.webp/g)].map((m) => m[1]) : [];
      for (const yid of [...painted, ...ids]) { const th = `/ahv/assets/img/video-thumb-${yid}.webp`; if (fs.existsSync(path.join(SITE, "public", th))) { cover = th; break; } }
      // no thumbnails on disk: the page's own hero photograph (first non-logo image the snapshot paints)
      if (!cover && fs.existsSync(snap)) { const m = [...fs.readFileSync(snap, "utf8").matchAll(/src="(\/ahv\/assets\/img\/[^"]+\.(?:webp|jpg|png))"/g)].map((x) => x[1]).find((u) => !/logo/i.test(u)); if (m) cover = m; }
    }
  } else {
    const v = JSON.parse(fs.readFileSync(path.join(SITE, "public/ahv/views", r.desktopView + ".json"), "utf8")).template;
    cover = firstImage(v);
  }
  const title = r.metadata.title.split("|")[0].replace(/\s+at Kairali.*$/i, "").trim();
  cards.push({ route: p, title, cover, alt: title, note: p === "/video-gallery/" ? "Patient stories and the village on film" : p === "/virtual-tour/" ? "360° walk-through" : "" });
}
for (const c of cards) if (!c.cover) console.warn("no cover for " + c.route);

const D = loadDataset(FILE);
const R = D.routes.find((r) => r.path === "/gallery/");
if (!R) throw new Error("/gallery/ not in seven-informational-data.js");
// rebuilt on every run (the card list is generated, so a fix to this tool reaches the page)
const list = R.components.find((c) => c.blocks.some((b) => b.kind === "card" && /\/g0$/.test(b.ptr))) ||
  R.components.find((c) => c.blocks.some((b) => b.kind === "para" && JSON.stringify(b.tree).includes("/photo-gallery/")));
if (!list) throw new Error("/gallery/: the gallery list section not found");
list.component = "collection-cards";
list.blocks = cards.map((c, i) => ({
  kind: "card", ptr: list.ptr + "/g" + i,
  blocks: [
    ...(c.cover ? [{ kind: "image", ptr: list.ptr + "/g" + i + "/img", src: c.cover, alt: c.alt, width: 640, height: 420 }] : []),
    { kind: "heading", tag: "h3", ptr: list.ptr + "/g" + i + "/h", tree: [{ k: "e", tag: "a", attrs: { href: c.route }, c: [{ k: "t", v: c.title }] }] },
    ...(c.note ? [{ kind: "para", ptr: list.ptr + "/g" + i + "/p", tree: [{ k: "t", v: c.note }] }] : []),
    { kind: "line", ptr: list.ptr + "/g" + i + "/more", tree: [{ k: "e", tag: "a", attrs: { href: c.route }, c: [{ k: "t", v: "View gallery" }] }], sourceClass: "wp-block-button__link" },
  ],
}));
R.galleryHub = { generated: new Date().toISOString(), cards: cards.length, by: "tools/repair-gallery-hub.mjs" };

const src = fs.readFileSync(FILE, "utf8");
const start = src.indexOf("{", src.indexOf("= {")), end = src.lastIndexOf("}") + 1;
if (!DRY) fs.writeFileSync(FILE, src.slice(0, start) + JSON.stringify(D) + src.slice(end));
console.log(`${DRY ? "[dry] " : "fixed  "}/gallery/: ${cards.length} gallery cards — ` + cards.map((c) => c.title).join(" · "));
