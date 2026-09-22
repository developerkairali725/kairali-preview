#!/usr/bin/env node
/**
 * AHV — the two portraits the enquiry family left as placeholders (owner,
 * 23 Sep 2026: "you missed another placeholder priya photo — put a small photo
 * where gita quotes — same in the consultation page too").
 *
 *   · Priya card (/contact-us/, /enquiry-form/): the template drew an empty
 *     72px circle. The record itself names her picture — priya.externalImage,
 *     the Chatbase assistant's own avatar — so it is self-hosted as
 *     /ahv/assets/img/priya-care-coordinator.webp and painted in the circle.
 *   · Founder quote (/contact-us/ dark band; /online-consultation/ creds
 *     figure): a 64px round portrait of Mrs Gita Ramesh from the site's own
 *     team photograph (team-gita1.webp, already served on /about-us/) sits
 *     beside the attribution.
 * Desktop and mobile templates. Idempotent (marked data-ahv-portrait).
 *
 *   node tools/repair-enquiry-portraits.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIEWS = path.join(SITE, "public/ahv/views");
const DRY = process.argv.includes("--dry");
const PRIYA = "/ahv/assets/img/priya-care-coordinator.webp";
const GITA = "/ahv/assets/img/team-gita1.webp";
for (const f of [PRIYA, GITA]) if (!fs.existsSync(path.join(SITE, "public", f))) { console.error("missing on disk: " + f); process.exit(1); }

const portrait = (src, alt, size) => `<img data-ahv-portrait="1" src="${src}" alt="${alt}" width="${size}" height="${size}" loading="lazy" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex:none;display:block">`;

for (const side of ["desktop", "mobile"]) {
  const id = `ahv-page-enquiry-${side}`;
  const file = path.join(VIEWS, id + ".json");
  const view = JSON.parse(fs.readFileSync(file, "utf8"));
  let T = view.template, n = 0;
  if (T.includes('data-ahv-portrait="1"')) { console.log(`as-is  ${id}`); continue; }

  // 1. Priya: the empty circle in the data-priya section
  const circle = /(<section data-priya="true"[^>]*>\s*)<div aria-hidden="true" style="width:(\d+)px;height:\d+px;border-radius:50%;background:#EFE9DC;border:1px solid #E0D7C4"><\/div>/;
  if (!circle.test(T)) throw new Error(`${id}: Priya placeholder circle not found`);
  T = T.replace(circle, (m, pre, size) => pre + portrait(PRIYA, "Priya, patient care coordinator", size));
  n++;

  // 2. Gita on the contact band: portrait + attribution in one row
  const band = /(<section data-founder="true"[^>]*>\s*<blockquote[^>]*>\{\{ C\.founder\.quote \}\}<\/blockquote>\s*)<p style="([^"]*)">\{\{ C\.founder\.by \}\}<\/p>/;
  if (!band.test(T)) throw new Error(`${id}: contact founder band not found`);
  T = T.replace(band, (m, pre, st) => pre + `<div style="display:flex;align-items:center;gap:14px;margin:20px 0 0">${portrait(GITA, "Mrs Gita Ramesh", 64)}<p style="${st.replace(/margin:[^;]*;?/, "margin:0;")}">{{ C.founder.by }}</p></div>`);
  n++;

  // 3. Gita on the consultation creds figure
  const fig = /(<figure data-founder="true"[^>]*>\s*<blockquote[^>]*>\{\{ O\.creds\.quote \}\}<\/blockquote>\s*)<figcaption style="([^"]*)">/;
  if (!fig.test(T)) throw new Error(`${id}: consultation founder figure not found`);
  T = T.replace(fig, (m, pre, st) => pre + `<figcaption style="${st};display:flex;align-items:center;gap:14px">${portrait(GITA, "Mrs Gita Ramesh", 64)}<span>`);
  // close the span before </figcaption> of that figure
  T = T.replace(/(\{\{ O\.creds\.byRole \}\} <em>\{\{ O\.creds\.byBook \}\}<\/em>)(<\/figcaption>)/, "$1</span>$2");
  n++;

  view.template = T;
  if (!DRY) fs.writeFileSync(file, JSON.stringify(view, null, 1) + "\n");
  console.log(`${DRY ? "[dry] " : "fixed  "}${id}: ${n} portrait slot(s)`);
}
