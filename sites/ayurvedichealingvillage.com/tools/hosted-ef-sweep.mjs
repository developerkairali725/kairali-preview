// Hosted evidence for the English-feedback items (EF-01…EF-25, TF-08/19): for each affected page — HTTP status,
// images that failed to load (after scrolling the page through), every internal link resolved (fetched from the page,
// so protected staging is read with the same OIDC header), and the text that proves the specific fix is present /
// the defect is absent. Read-only.
//   vc env run -- node tools/hosted-ef-sweep.mjs --base https://ahv-final-staging.vercel.app --out <dir>
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module"; import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const store = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../node_modules/.pnpm");
const pw = require(path.join(store, fs.readdirSync(store).find((d) => d.startsWith("playwright@")), "node_modules/playwright"));
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://localhost:4471"), OUT = arg("out", "/tmp/ef-sweep");
fs.mkdirSync(OUT, { recursive: true });
const oidc = /^https/.test(BASE) && process.env.VERCEL_OIDC_TOKEN ? { extraHTTPHeaders: { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN } } : {};
const CHECKS = [
  ["EF-01", "/", { has: ["₹", "$", "€"] }],
  ["EF-02", "/ayurveda-package/", {}],
  ["EF-03", "/yoga-meditation-programs/", { has: ["₹"] }],
  ["EF-05", "/", { has: ["Optional. Leave blank if your dates are not fixed yet."] }],
  ["EF-06", "/accreditations/", { has: ["Clinical establishment permanent registration"] }],
  ["EF-07", "/offers/", { not: ["[TO CONFIRM", "Reviewed on", "The record"] }],
  // the award strip shows "World Luxury Award 2023" once — under its own logo; the defect was that caption on four others
  ["EF-08", "/offers/senior-citizen-offer/", { maxCount: [["World Luxury Award 2023", 1]] }],
  ["EF-09", "/ayurvedic-cuisine/", {}],
  ["EF-10", "/experience/", {}],
  ["EF-11", "/village-facilities/", { has: ["Beauty Therapy"] }],
  ["EF-13", "/walk-in-ayurveda-treatment/", { not: ["near me", "healing journey", "guarantees a smooth"] }],
  ["EF-14", "/about-us/", {}],
  ["EF-15", "/things-to-do/", {}],
  ["EF-16", "/sightseeing/", {}],
  ["EF-18", "/gallery/", {}],
  ["EF-20", "/virtual-tour/", { has: ["in production"] }],
  ["EF-22", "/video-gallery/", {}],
  ["EF-23", "/retreats-gallery/", { uniqueImages: true }],
  ["TF-08", "/treatment-for-chronic-back-pain/", { not: ["Book My Treatment"], has: ["Enquire About Treatment for Chronic Back Pain"] }],
  ["TF-08", "/sleep-restoration-therapy/", { not: ["Book My Treatment"], has: ["Enquire About My Treatment"] }],
  ["TF-19", "/deluxe-villa/", { has: ["Single occupancy, per villa per night: ₹26,700", "admission rates, not room-only prices"] }],
  ["TF-19", "/maharaja-suite/", { has: ["Single occupancy, per villa per night: ₹53,400"] }],
  ["L10N", "/de/", {}], ["L10N", "/de/unsere-villen/", {}], ["L10N", "/fr/", {}], ["L10N", "/ar/", {}], ["L10N", "/ja/all-programs/", {}],
  // owner-decision round, 28 Sep 2026 (OWNER-DECISIONS-LATEST.md)
  ["OD-BDM", "/jobs/business-development-manager/", { has: ["Vacancy closed", "not accepting applications"], not: ["Contact Person", "8826921119", "Apply for this position"] }],
  ["OD-BDM", "/careers/", { has: ["No vacancies are open at the moment."], not: ["More Details"] }],
  ["OD-FAC", "/village-facilities/", { has: ["Astrology & Palmistry", "at least one day in advance", "Badminton Court", "Children’s plunge pool", "Curio Shop"], not: ["Conference Hall", "Charm Science Experts", "Antique Shop"] }],
  ["OD-TRN", "/training-course-fees/", { has: ["Arranged on enquiry", "one-to-one or for groups"], not: ["TO CONFIRM", "poured from the record", "Transcribed from"] }],
  ["OD-DEF", "/defence-and-paramilitary-forces/", { has: ["Central Armed Police Forces", "3–13 nights", "best saving", "before tax"], not: ["TO CONFIRM", "changeable and cancellable", "Army, Navy, Air force Citizens", "map captions"] }],
  ["OD-OFF", "/offers/", { has: ["between 3 to 13 Nights", "Stays of 1–2 nights"], not: ["3 to 14 Nights", "14 to 21 Nights", "clubbed"] }],
  ["OD-OFF", "/offers/senior-citizen-offer/", { has: ["3–13 nights", "best saving"] }],
  ["OD-OFF", "/offers/defence-paramilitary-personnel-get-upto-30-off/", { has: ["between 3 to 13 Nights", "before tax"], not: ["3 to 14 Nights", "clubbed", "changeable and cancellable"] }],
  ["EF-21", "/ayurveda-gallery/", { finalPath: "/treatments-gallery/" }],
  ["EF-21", "/de/ayurveda-gallery/", { finalPath: "/de/behandlungsgalerie/" }],
  ["EF-24", "/prav-simona-yoga-retreat/", { finalPath: "/prav-simona-monsoon-yoga-retreat/" }],
  ["EF-24", "/prav-simona-monsoon-yoga-retreat/", { altHas: ["yoga steps", "yoga pose"] }],
  ["TF-18", "/enquiry-form/?programme=treatment", { selectIndex: 1 }],
  ["TF-18", "/enquiry-form/?programme=bogus", { selectIndex: 0 }],
  ["NOTE", "/search-results/", { not: ["design review"] }],
  // round 7: owner regression + desktop composition
  ["PKG", "/packages/", { not: ["Open the category navigation"] }],
  ["OD-OFF", "/offers/", { has: ["3 nights"], not: ["No minimum stay"] }],
];
const b = await pw.chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...oidc });
await ctx.addInitScript(() => { try { localStorage.setItem("ktahv-consent", "declined"); } catch (e) {} });
const rows = [];
for (const [id, route, want] of CHECKS) {
  const pg = await ctx.newPage(); const row = { id, route };
  try {
    const r = await pg.goto(BASE + route, { waitUntil: "load", timeout: 90000 }); row.status = r.status();
    await pg.waitForTimeout(2500);
    await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((s) => setTimeout(s, 120)); } window.scrollTo(0, 0); });
    await pg.waitForTimeout(1500);
    const d = await pg.evaluate(async () => {
      const imgs = [...document.querySelectorAll("#ahv-design-root img, main img")].filter((i) => i.getClientRects().length);
      const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src"));
      const srcs = imgs.map((i) => i.currentSrc || i.src).filter(Boolean);
      const hrefs = [...new Set([...document.querySelectorAll("a[href]")].map((a) => { try { const u = new URL(a.getAttribute("href"), location.href); return u.origin === location.origin && !/\.(pdf|jpg|png|webp|mp4)$/i.test(u.pathname) ? u.pathname + u.search : null; } catch { return null; } }).filter(Boolean))];
      const bad = [];
      for (const h of hrefs) { try { const r = await fetch(h, { method: "GET", redirect: "follow" }); if (!r.ok) bad.push(r.status + " " + h); } catch (e) { bad.push("ERR " + h); } }
      return { text: document.body.innerText, alts: imgs.map((i) => i.alt), broken, srcs, links: hrefs.length, badLinks: bad };
    });
    row.images = d.srcs.length; row.brokenImages = d.broken; row.links = d.links; row.badLinks = d.badLinks;
    const low = d.text.toLowerCase();
    row.missing = (want.has || []).filter((t) => !low.includes(t.toLowerCase()));
    row.present = (want.not || []).filter((t) => low.includes(t.toLowerCase()) || d.alts.some((a) => a.includes(t)));
    row.altMissing = (want.altHas || []).filter((t) => !d.alts.includes(t));
    for (const [t, max] of want.maxCount || []) { const n = low.split(t.toLowerCase()).length - 1; if (n > max) row.present.push(`${t} ×${n} (max ${max})`); }
    if (want.finalPath) { row.finalPath = new URL(pg.url()).pathname; if (row.finalPath !== want.finalPath) row.present.push(`landed on ${row.finalPath}, expected ${want.finalPath}`); }
    if (want.selectIndex != null) { row.selectIndex = await pg.evaluate(() => { const s = document.querySelector('form[data-form="contact"] select[name="programme"]'); return s ? s.selectedIndex : null; }); if (row.selectIndex !== want.selectIndex) row.present.push(`programme select index ${row.selectIndex}, expected ${want.selectIndex}`); }
    if (want.uniqueImages) { const seen = new Map(); for (const s of d.srcs) seen.set(s, (seen.get(s) || 0) + 1); row.duplicateImages = [...seen].filter(([, n]) => n > 1).map(([s, n]) => `${n}× ${s.split("/").pop()}`); }
    row.pass = row.status === 200 && !row.brokenImages.length && !row.badLinks.length && !row.missing.length && !row.present.length && !row.altMissing.length && !(row.duplicateImages || []).length;
  } catch (e) { row.error = String(e).slice(0, 200); row.pass = false; }
  rows.push(row);
  console.log(row.pass ? "PASS" : "FAIL", id, route, row.error || `status ${row.status} imgs ${row.images} broken ${row.brokenImages.length} links ${row.links} bad ${row.badLinks.length}` + (row.missing.length ? " missing:" + row.missing.join("|") : "") + (row.present.length ? " present:" + row.present.join("|") : "") + (row.altMissing?.length ? " alt:" + row.altMissing.join("|") : "") + (row.duplicateImages?.length ? " dup:" + row.duplicateImages.join("|") : "") + (row.badLinks.length ? " e.g. " + row.badLinks.slice(0, 3).join(", ") : ""));
  await pg.close();
}
await b.close();
fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify({ base: BASE, at: new Date().toISOString(), rows }, null, 1));
