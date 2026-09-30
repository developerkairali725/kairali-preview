#!/usr/bin/env node
/**
 * AHV — /video-gallery/: the twenty video cards play.
 *
 * MEASURED (23 Sep sweep): every card on the legacy video hub printed a "▶"
 * box and "Video disabled in this preview" — a builder note — although the
 * record (travel-family-data.js, videoCards.items[]) carries each video's
 * youtubeId and title. The renderer simply never passed the id to the view.
 *
 * WHAT THIS DOES. (1) travel-family-render.js: the videoCards mapping also
 * exposes `youtubeId`. (2) Both article-reader views: the ▶ box becomes a
 * play button carrying data-ahv-video="<id>" (a 16:9 paper-toned facade, no
 * request to YouTube until it is pressed — the gallery spec's rule), and the
 * "disabled" line is dropped. public/design/consistency.js turns a press
 * into a youtube-nocookie iframe in place. Idempotent; loud postconditions.
 *
 *   node tools/repair-video-gallery.mjs [--dry]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const problems = []; let touched = 0;
// 1. the renderer
{
  const f = join(SITE, "public/ahv/assets/travel-family-render.js");
  let s = readFileSync(f, "utf8");
  if (!s.includes("R.videoCards.items.map(v => ({")) problems.push("travel render: videoCards mapping not found");
  else if (!s.includes("youtubeId: v.youtubeId")) {
    s = s.replace("R.videoCards.items.map(v => ({", "R.videoCards.items.map(v => ({ youtubeId: v.youtubeId || '',");
    if (!DRY) writeFileSync(f, s); touched += 1; console.log(`${DRY ? "[dry] " : "fixed  "}travel-family-render.js  (youtubeId exposed)`);
  } else console.log("as-is  travel-family-render.js");
}
// 2. the views
const BTN = '<button type="button" data-ahv-video="{{ v.youtubeId }}" aria-label="Play video: {{ v.title }}" style="display:flex;align-items:center;justify-content:center;width:100%;aspect-ratio:16/9;border:1px solid #EAE3D4;border-radius:3px;background:#F4F0E4;color:#5A4420;font-size:34px;line-height:1;cursor:pointer;padding:0">▶</button>';
for (const side of ["desktop", "mobile"]) {
  const id = `ahv-page-article-reader-${side}`;
  const f = join(SITE, "public/ahv/views", `${id}.json`);
  const view = JSON.parse(readFileSync(f, "utf8"));
  let t = view.template; const did = [];
  const boxRe = /<div aria-hidden="true" style="[^"]*">▶<\/div>\s*(?=<p[^>]*>\{\{ v\.title \}\})/;
  if (boxRe.test(t)) { t = t.replace(boxRe, BTN + " "); did.push("play button"); }
  const noteRe = /\s*<p[^>]*>\{\{ v\.inactiveLabel \}\}<\/p>/;
  if (noteRe.test(t)) { t = t.replace(noteRe, ""); did.push("disabled line removed"); }
  if (did.length) { touched += 1; if (!DRY) { view.template = t; writeFileSync(f, JSON.stringify(view)); } }
  console.log(`${did.length ? (DRY ? "[dry] " : "fixed  ") : "as-is  "}${id}${did.length ? "  (" + did.join(", ") + ")" : ""}`);
  if (/v\.inactiveLabel/.test(t)) problems.push(`${id}: inactiveLabel survives`);
  if (!/data-ahv-video="\{\{ v\.youtubeId \}\}"/.test(t)) problems.push(`${id}: play button missing`);
}
console.log(`\nrepair-video-gallery${DRY ? " (dry)" : ""}: ${touched} file(s) changed`);
if (problems.length) { console.error("POSTCONDITION FAILURES:\n  " + problems.join("\n  ")); process.exit(1); }
