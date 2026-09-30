/**
 * AHV — carry the four Kairali maps onto the new How to Reach page.
 *
 * WHY. Owner, 2026-09-19: /how-to-reach-old/ is old and going, "but i like
 * the map of kairali ayurvedic healing village save it for future use and
 * the other map images ... so it is easy for my clients to know where is
 * kerala in india and where is palakkad in kerala and where is the property
 * - make sure the new appropriate page has it". They exist only on the old
 * page: India with Kerala picked out, Kerala with Palakkad picked out,
 * Palakkad locating the hospital, and the illustrated aerial plan of the
 * grounds.
 *
 * WHY IT IS DONE IN THE VIEW, not the dataset. The obvious route - copying
 * the old record's map-lightboxes component onto the /how-to-reach/ record -
 * was tried and MEASURED: the dataset accepted it, the file stayed valid, and
 * the page rendered zero maps, because that route does not take its body from
 * that record. So the section is injected into the article-reader template
 * once and hidden by default; public/design/directions.css reveals it on
 * /how-to-reach/ alone. The same shape as the closing CTA block, which works.
 *
 * Idempotent, and adds no new asset: the four images already ship.
 *
 * Usage: node tools/repair-how-to-reach-maps.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIEWS = path.join(SITE, "public/ahv/views");
const DRY = process.argv.includes("--dry");
const MARK = "data-ahv-maps";
const ALT = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/image-alt-map.json"), "utf8")).alt;

const MAPS = [
  ["/ahv/assets/img/travel/9653d662c2fc437a5f8c23e8bef405d70675dedd13aa48633614f1e30dc79abf.png", "Kerala, in India"],
  ["/ahv/assets/img/travel/f36802a3b9f5345de250dc23004d4b5e14396915f863443e0466434a125d9b9e.png", "Palakkad, in Kerala"],
  ["/ahv/assets/img/travel/04afbaee86de67ca8098ebe956cd7dcd3904bb93a88c8e7cbf8507a92dca27cd.png", "The hospital, in Palakkad"],
];
const PLAN = "/ahv/assets/img/travel/89310cfa7faa54ee1eecf73b427105b0af81fd179ce8fad0e6992eaa563b51c1.jpg";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const alt = (src, fallback) => esc(ALT[src] || fallback);

const card = ([src, caption]) =>
  `<figure style="margin:0"><img src="${src}" alt="${alt(src, caption)}" loading="lazy" style="width:100%;height:190px;object-fit:contain;display:block"><figcaption style="margin-top:10px;font-family:Mulish,system-ui,sans-serif;font-size:12px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#75695A;text-align:center">${esc(caption)}</figcaption></figure>`;

const section =
  `<section ${MARK} aria-label="Where we are" style="margin-top:8px">` +
  `<h2>Where we are</h2>` +
  `<p>Kairali sits in Palakkad district, inland Kerala, in the south west of India.</p>` +
  `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(210px,100%),1fr));gap:26px;margin:22px 0 30px">${MAPS.map(card).join("")}</div>` +
  `<figure style="margin:0"><img src="${PLAN}" alt="${alt(PLAN, "Illustrated aerial plan of the grounds")}" loading="lazy" style="width:100%;height:auto;display:block;border-radius:4px"><figcaption style="margin-top:10px;font-family:Mulish,system-ui,sans-serif;font-size:14.5px;color:#75695A">A plan of the grounds, numbering reception, the Ayurvedic hospital, the yoga centre, the herbal garden and the villas.</figcaption></figure>` +
  `</section>`;

let n = 0;
for (const f of fs.readdirSync(VIEWS)) {
  if (!/^ahv-page-article-reader-(desktop|mobile)\.json$/.test(f)) continue;
  const file = path.join(VIEWS, f);
  const view = JSON.parse(fs.readFileSync(file, "utf8"));
  if (view.template.includes(MARK)) { console.log(`${f}: already carries the maps`); continue; }
  const anchor = '<section aria-label="Guidance" data-ahv-article-cta';
  if (!view.template.includes(anchor)) throw new Error(`${f}: run tools/repair-article-cta.mjs first - the maps sit above the closing block`);
  view.template = view.template.replace(anchor, section + anchor);
  if (!DRY) fs.writeFileSync(file, JSON.stringify(view, null, 1) + "\n");
  n++;
  console.log(`${DRY ? "[dry] " : ""}${f}: maps section injected (hidden except on /how-to-reach/)`);
}
console.log(`${n} view(s) updated`);
