#!/usr/bin/env node
/**
 * AHV — /offers/senior-citizen-offer/ (owner, 23 Sep 2026: "if you audit this
 * as a landing page you yourself would fail it: testimonial has no text, what
 * kind of award section is that, hero image needs to be replaced").
 *
 * Three sourced repairs on the campaign record + the offer-variant template:
 *   1. HERO PHOTOGRAPH — the stock "happy senior couple in a park" (a
 *      wp-content upload, not a Kairali photograph) becomes a photograph the
 *      site already serves: a patient speaking with a Kairali physician on the
 *      verandah (alt from english-candidate/image-alt-map.json).
 *   2. TESTIMONIAL TEXT — the five slides are YouTube thumbnails whose only
 *      text was "Watch on YouTube ↗". Each slide now carries the video's OWN
 *      title and channel, read from YouTube's oEmbed endpoint and cached in
 *      english-candidate/video-titles.json (re-fetch with --fetch). A title is
 *      a fact about the video, not a quotation; no words are put in a
 *      patient's mouth. The template prints it under the thumbnail.
 *   3. AWARDS — the 22 logos rendered as a 12-column strip of 60px marks. The
 *      template's grid becomes 5-up cards with the logo's own alt text as a
 *      caption (the alt is the source's own naming of each award).
 * Idempotent (record.seniorRepair / data-ahv-senior).
 *
 *   node tools/repair-senior-offer.mjs [--dry] [--fetch]
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(SITE, "public/ahv/assets/campaign-family-data.js");
const VIEWS = path.join(SITE, "public/ahv/views");
const TITLES = path.join(SITE, "english-candidate/video-titles.json");
const DRY = process.argv.includes("--dry"), FETCH = process.argv.includes("--fetch");
const HERO = { src: "/ahv/assets/img/gallery/9f51c2fa498ffb5995b38b8bd332059e9779117b62572ae72561758f8a2cd5e6.webp", alt: "A patient in a green checked robe speaking with a Kairali physician on the verandah", width: 1200, height: 857 };
if (!fs.existsSync(path.join(SITE, "public", HERO.src))) { console.error("hero photo missing on disk"); process.exit(1); }

const w = {};
vm.runInNewContext(fs.readFileSync(FILE, "utf8"), { window: w });
const D = Object.values(w)[0];
const R = D.routes.find((r) => r.path === "/offers/senior-citizen-offer/");
if (!R) throw new Error("senior record missing");
const hero = R.sections.find((s) => s.component === "hero");
const ts = R.sections.find((s) => s.component === "testimonials");
const ids = ts.slides.map((s) => (s.sourceVideoHref.match(/v=([A-Za-z0-9_-]+)/) || [])[1]).filter(Boolean);

let titles = fs.existsSync(TITLES) ? JSON.parse(fs.readFileSync(TITLES, "utf8")) : { _why: "YouTube video titles + channel, from https://www.youtube.com/oembed (tools/repair-senior-offer.mjs --fetch). A title is the video's own metadata.", videos: {} };
const need = ids.filter((id) => !titles.videos[id]);
if (need.length && (FETCH || need.length === ids.length)) {
  for (const id of need) {
    const r = await fetch("https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=" + id + "&format=json");
    if (!r.ok) { console.warn("oembed " + id + " → " + r.status); continue; }
    const j = await r.json();
    titles.videos[id] = { title: j.title, channel: j.author_name, fetched: new Date().toISOString() };
  }
  if (!DRY) fs.writeFileSync(TITLES, JSON.stringify(titles, null, 1) + "\n");
}

let n = 0;
if (!R.seniorRepair) {
  hero.image = Object.assign({}, hero.image, { src: HERO.src, alt: HERO.alt, width: HERO.width, height: HERO.height, sourceUrl: null, provenance: "Kairali photograph already served by the site (replaces the stock couple; owner, 23 Sep 2026)" });
  n++;
  ts.slides.forEach((s) => { const id = (s.sourceVideoHref.match(/v=([A-Za-z0-9_-]+)/) || [])[1]; const t = titles.videos[id]; if (t) { s.title = t.title; s.channel = t.channel; n++; } });
  R.seniorRepair = { generated: new Date().toISOString(), by: "tools/repair-senior-offer.mjs", hero: HERO.src, titled: ts.slides.filter((s) => s.title).length };
  const src = fs.readFileSync(FILE, "utf8");
  const start = src.indexOf("{", src.indexOf("= {")), end = src.lastIndexOf("}") + 1;
  if (!DRY) fs.writeFileSync(FILE, src.slice(0, start) + JSON.stringify(D) + src.slice(end));
  console.log(`${DRY ? "[dry] " : "fixed  "}record: hero photograph + ${R.seniorRepair.titled}/${ts.slides.length} slide titles`);
} else console.log("as-is  record");

for (const side of ["desktop", "mobile"]) {
  const id = `ahv-page-campaign-retreat-${side}`;
  const file = path.join(VIEWS, id + ".json");
  const view = JSON.parse(fs.readFileSync(file, "utf8"));
  let T = view.template;
  if (T.includes('data-ahv-senior="1"')) { console.log(`as-is  ${id}`); continue; }
  // 2. the slide caption: title + channel above the "Watch on YouTube" link
  const li = /(<sc-for list="\{\{ tsSlides \}\}" as="s"[^>]*>\s*<li[^>]*>\s*<img[^>]*>\s*<div[^>]*>\s*)(<a href="\{\{ s\.sourceVideoHref \}\}")/;
  if (!li.test(T)) throw new Error(`${id}: testimonial slide markup not found`);
  T = T.replace(li, `$1<sc-if value="{{ s.title }}" hint-placeholder-val="{{ true }}"><p data-ahv-senior="1" style="margin:0 0 8px;font-family:'Marcellus',serif;font-size:${side === "desktop" ? "18px" : "17px"};line-height:1.35;color:#2A2118">{{ s.title }}</p><p style="margin:0 0 10px;font-size:14px;color:#75695A">{{ s.channel }}</p></sc-if>$2`);
  // 3. the awards grid: 5-up cards with the alt as a caption
  const aw = /(<sc-for list="\{\{ ov\.benefits\.awards\.logos \}\}" as="l"[^>]*>\s*)<li[^>]*>\s*<img src="\{\{ l\.src \}\}" alt="\{\{ l\.alt \}\}"([^>]*)>\s*<\/li>/;
  if (!aw.test(T)) throw new Error(`${id}: awards logo markup not found`);
  T = T.replace(aw, `$1<li style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:16px 12px;background:#fff;border:1px solid #E9E2D3;border-radius:4px;box-sizing:border-box;text-align:center"><img src="{{ l.src }}" alt=""$2 style="width:auto;max-width:100%;height:72px;object-fit:contain"><span style="font-size:14px;line-height:1.4;color:#514A3F">{{ l.alt }}</span></li>`);
  // the list itself: a sane grid instead of the 12-column strip
  const ulRe = /<ul([^>]*)>(\s*<sc-for list="\{\{ ov\.benefits\.awards\.logos \}\}")/;
  T = T.replace(ulRe, (m, attrs, rest) => `<ul${attrs.replace(/style="[^"]*"/, `style="list-style:none;margin:18px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(${side === "desktop" ? "170px" : "140px"},1fr));gap:14px"`)}>${rest}`);
  view.template = T;
  if (!DRY) fs.writeFileSync(file, JSON.stringify(view, null, 1) + "\n");
  console.log(`${DRY ? "[dry] " : "fixed  "}${id}: slide titles + awards cards`);
}
