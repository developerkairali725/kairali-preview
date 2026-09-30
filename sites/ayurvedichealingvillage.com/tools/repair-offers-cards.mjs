#!/usr/bin/env node
/**
 * AHV — /offers/ (T8 "Offers, deals and gift vouchers"): real images in the
 * card slots and working buttons (owner, 23 Sep 2026: "discover the elder care
 * button is broken, linked to nowhere and the actual link is below it labelled
 * destination" · "you have enough images … why did you leave the images
 * empty").
 *
 * The delivered template shipped three 300×260 "Image placeholder" boxes
 * (senior / athletes / defence), one 380×280 gift-voucher placeholder, and
 * each card's button as href="#" with the real destination printed under it
 * as "Destination: /offers/…". This
 *   · paints each slot with a photograph the site already serves (listed
 *     below with its provenance — nothing new is generated),
 *   · moves the Destination URL into the button's href and drops the line,
 * on the desktop and the mobile view. Idempotent (marked data-ahv-offer-cards).
 *
 *   node tools/repair-offers-cards.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIEWS = path.join(SITE, "public/ahv/views");
const DRY = process.argv.includes("--dry");

/** Slot → photograph. Each file is already served by the site (alt from english-candidate/image-alt-map.json or the 2026 gallery manifest). */
const SLOTS = [
  { key: "For Senior Citizens", src: "/ahv/assets/img/gallery-2026/treatments/vasti-janu-vasti-04.webp", alt: "Kairali therapists performing janu vasti, a warm-oil knee treatment, on a patient" },
  { key: "For Athletes", src: "/ahv/assets/img/gallery-2026/photo/yoga-side-female-patient-02.webp", alt: "A patient in a side-stretch yoga pose at Kairali" },
  { key: "For Defence", src: "/ahv/assets/img/gallery-2026/treatments/hero-detail-cloth-herbal-poultice-01.webp", alt: "A warm herbal poultice being pressed during an Ayurvedic treatment at Kairali" },
];
/** The page's featured-offer block painted a stock "senior couple in a park" upload (commercial record image, alt "Healing at Kairali"); it becomes a Kairali photograph. */
const FEATURED = { src: "/ahv/assets/img/gallery/9f51c2fa498ffb5995b38b8bd332059e9779117b62572ae72561758f8a2cd5e6.webp", alt: "A patient speaking with a Kairali physician on the verandah" };
const GIFT = { src: "/ahv/assets/img/gallery-2026/product/hero-product-kairtis-oil-canister-01.webp", alt: "A Kairali Ayurvedic oil canister" };
for (const s of [...SLOTS, GIFT, FEATURED]) if (!fs.existsSync(path.join(SITE, "public", s.src))) { console.error("photo missing on disk: " + s.src); process.exit(1); }

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const escRe = (s) => s.replace(/[.*+?^$(){}|[\]\\]/g, (ch) => "\\" + ch);
const IMG = (s, h) => `<img src="${s.src}" alt="${esc(s.alt)}" loading="lazy" style="display:block;width:100%;height:${h};object-fit:cover">`;

for (const side of ["desktop", "mobile"]) {
  const id = `ahv-template-offers-deals-and-gift-vouchers-${side}`;
  const file = path.join(VIEWS, id + ".json");
  const view = JSON.parse(fs.readFileSync(file, "utf8"));
  let T = view.template;
  if (T.includes('data-ahv-offer-cards="1"')) { console.log(`as-is  ${id}`); continue; }
  let n = 0;
  // 1. the three card slots: the placeholder box directly before each card's kicker
  for (const s of SLOTS) {
    const re = new RegExp(`<div style="background:#E0D7C4;[^"]*"><p style="[^"]*">Image placeholder[^<]*</p></div>(\\s*<div style="padding:[^"]*">\\s*<p style="[^"]*">${escRe(s.key)})`);
    const m = T.match(re);
    if (!m) throw new Error(`${id}: slot "${s.key}" not found once`);
    T = T.replace(re, `<div style="min-height:${side === "desktop" ? "260px" : "150px"};overflow:hidden">${IMG(s, "100%")}</div>$1`);
    n++;
  }
  // 2. the gift-voucher slot
  const gre = /<div style="background:#E0D7C4;border:1px solid #C9BFA8;border-radius:4px;height:(\d+)px;[^"]*"><p style="[^"]*">Image placeholder — gift voucher[^<]*<\/p><\/div>|<div style="background:#E0D7C4;border:1px solid #C9BFA8;border-radius:4px;height:(\d+)px;[^"]*"><p style="[^"]*">Image placeholder — 350 × 170<\/p><\/div>/;
  const gm = T.match(gre);
  if (!gm) throw new Error(`${id}: gift-voucher slot not found`);
  T = T.replace(gre, (m, h1, h2) => `<div style="border-radius:4px;overflow:hidden;height:${h1 || h2}px;${side === "mobile" ? "margin:16px 0 0" : ""}">${IMG(GIFT, "100%")}</div>`);
  n++;
  // 3. each card's button: href="#" → the site's own offer route for that audience
  //    (the desktop senior card printed it as a "Destination:" line; the mobile
  //    one printed "Destination: [TO CONFIRM]"; the athletes/defence cards printed
  //    nothing). The route is read from the manifest; the Destination line goes.
  const manifest = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8"));
  const routeFor = (re2) => (manifest.routes.find((r) => re2.test(r.path)) || {}).path;
  const CARD_ROUTE = { "For Senior Citizens": routeFor(/^\/offers\/senior-citizen-offer\/$/), "For Athletes": routeFor(/^\/offers\/olympics/), "For Defence": routeFor(/^\/offers\/defence/) };
  const before = n;
  T = T.replace(/<article[^>]*>[^]*?<\/article>/g, (card) => {
    const key = Object.keys(CARD_ROUTE).find((k) => card.includes(`>${k}`));
    if (!key) return card;
    if (!CARD_ROUTE[key]) throw new Error(`${id}: no route for ${key}`);
    let c = card.replace(/\s*<p style="[^"]*">Destination: (?:\[TO CONFIRM\]|<a href="[^"]*">[^<]*<\/a>)<\/p>/, "");
    if (!/<a href="#"/.test(c)) throw new Error(`${id}: ${key} card has no href="#" button`);
    c = c.replace('<a href="#"', `<a href="${CARD_ROUTE[key]}"`); n++;
    return c;
  });
  if (n - before !== 3) throw new Error(`${id}: expected three buttons rewired, got ${n - before}`);
  T = T.replace(/(<main[^>]*)>/, '$1 data-ahv-offer-cards="1">');
  view.template = T;
  if (!DRY) fs.writeFileSync(file, JSON.stringify(view, null, 1) + "\n");
  console.log(`${DRY ? "[dry] " : "fixed  "}${id}: ${n} change(s) — 4 images, ${n - 4} buttons rewired`);
}

// the featured block's image lives in the commercial record, not the template
{
  const FILE = path.join(SITE, "public/ahv/assets/commercial-family-data.js");
  let src = fs.readFileSync(FILE, "utf8");
  const re = /"src":"\/ahv\/assets\/img\/commercial\/775c5adec97f99fbd773ee36cf4903844f79ea13635db974cf00821263818e82\.webp","alt":"Healing at Kairali"/g;
  const n = (src.match(re) || []).length;
  if (n) { src = src.replace(re, `"src":"${FEATURED.src}","alt":"${FEATURED.alt}"`); if (!DRY) fs.writeFileSync(FILE, src); console.log(`${DRY ? "[dry] " : "fixed  "}commercial-family-data.js: featured-offer photograph (${n})`); }
  else console.log("as-is  commercial-family-data.js (featured photograph)");
}
