/**
 * AHV — measure how big each image is ACTUALLY drawn, in a browser.
 *
 * WHY MEASURE INSTEAD OF READING THE MARKUP. tools/convert-images-webp.mjs
 * wanted a display width and could not trust the one in the HTML: <img width>
 * turned out to be the INTRINSIC width (10 of 13 sampled files had width equal
 * to the real pixel width), so using it as a render size would have been a
 * guess dressed as a measurement. It therefore resized almost nothing, and the
 * conversion banked the format win only.
 *
 * What the format win left behind, measured on the built site at 375px:
 *
 *   award-natgeo-traveller-spa-wellness-2026-kit.webp   1200px natural ->   56px drawn
 *   AHV-Knowledge-Cuisine.webp                          1200px natural ->  351px drawn
 *   AHV-About-Doc-1-lotus_cer.webp                       928px natural ->  166px drawn
 *
 * A 1200px file painted into a 56px box is 21x the pixels anyone sees. No
 * amount of re-encoding fixes that; only knowing the box does.
 *
 * WHAT IT DOES. Loads one representative route per distinct desktop view - so
 * every LAYOUT is covered without loading all 254 routes - at desktop AND
 * mobile, and records, per image URL, the LARGEST width it is ever drawn at.
 * Largest, because one file appears in several layouts and the biggest box is
 * the one that must still look sharp.
 *
 * The output is evidence, not a decision: tools/resize-images-to-render.mjs
 * consumes it. Nothing here writes an image.
 *
 * Requires a server already running on --port (next start).
 *   node tools/measure-image-render-sizes.mjs [--port 4399] [--out english-candidate/image-render-sizes.json]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
const PORT = Number(arg("port", "4399"));
const OUT = join(SITE, arg("out", "english-candidate/image-render-sizes.json"));
const BASE = `http://127.0.0.1:${PORT}`;

const manifestRaw = JSON.parse(readFileSync(join(SITE, "english-candidate/route-manifest.json"), "utf8"));
const routes = manifestRaw.routes ?? Object.values(manifestRaw).find(Array.isArray);

/**
 * --all visits EVERY route; the default visits one per distinct
 * (desktopView, mobileView) pair.
 *
 * The layout sample is the fast pass and it is not sufficient on its own: it
 * covered 74 layouts and measured 745 of 1,827 images, because routes that
 * SHARE a layout still carry their own photographs - the article family alone
 * is 131 routes through one view. An image nobody measured must never be
 * resized (there is no evidence for a target), so the slow pass is the one
 * whose output may be acted on broadly.
 */
const ALL = process.argv.includes("--all");
const seen = new Set();
const sample = [];
for (const r of routes) {
  if (ALL) { sample.push(r.path); continue; }
  const key = `${r.desktopView}|${r.mobileView}`;
  if (seen.has(key)) continue;
  seen.add(key); sample.push(r.path);
}

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 375, height: 812 },
];

const maxWidth = new Map();   // image URL -> largest CSS px width ever drawn
const natural = new Map();    // image URL -> intrinsic width the browser reports
let loaded = 0, failedRoutes = [];

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const path of sample) {
    try {
      await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 30000 });
      // draw the whole page so lazy images below the fold get their real box
      await page.evaluate(async () => {
        await new Promise((res) => {
          let y = 0; const step = () => { y += window.innerHeight; window.scrollTo(0, y);
            if (y < document.body.scrollHeight) requestAnimationFrame(step); else { window.scrollTo(0, 0); res(); } };
          step();
        });
      });
      await page.waitForTimeout(250);
      const found = await page.evaluate(() => {
        const out = [];
        const push = (src, w, nw) => { if (src && w > 0) out.push([src, Math.ceil(w), nw || 0]); };
        for (const i of document.images) {
          const r = i.getBoundingClientRect();
          push(i.currentSrc || i.src, r.width, i.naturalWidth);
        }
        // CSS background images draw too, and carry no naturalWidth
        for (const el of document.querySelectorAll("*")) {
          const bg = getComputedStyle(el).backgroundImage;
          if (!bg || bg === "none") continue;
          const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
          if (!m) continue;
          const r = el.getBoundingClientRect();
          push(m[1], r.width, 0);
        }
        return out;
      });
      for (const [src, w, nw] of found) {
        let u; try { u = new URL(src, BASE).pathname; } catch { continue; }
        if (!u.startsWith("/ahv/")) continue;
        maxWidth.set(u, Math.max(maxWidth.get(u) ?? 0, w));
        if (nw) natural.set(u, Math.max(natural.get(u) ?? 0, nw));
      }
      loaded++;
    } catch (e) { failedRoutes.push(`${vp.name} ${path}: ${String(e.message).slice(0, 70)}`); }
  }
  await ctx.close();
}
await browser.close();

const rows = [...maxWidth.entries()].map(([url, w]) => ({ url, maxRenderedWidth: w, naturalWidth: natural.get(url) ?? null }))
  .sort((a, b) => a.url.localeCompare(b.url));

writeFileSync(OUT, JSON.stringify({
  generated: new Date().toISOString(),
  base: BASE, viewports: VIEWPORTS,
  distinctLayouts: sample.length, pageLoads: loaded,
  failedRoutes,
  note: "maxRenderedWidth is the LARGEST CSS-pixel width the image is drawn at across every sampled layout and viewport. A resize target must be a multiple of this, never below it.",
  images: rows,
}, null, 2) + "\n");

const over = rows.filter((r) => r.naturalWidth && r.naturalWidth > r.maxRenderedWidth * 2.2);
console.log(`measure-image-render-sizes`);
console.log(`  distinct layouts sampled : ${sample.length}  (of ${routes.length} routes)`);
console.log(`  page loads               : ${loaded}${failedRoutes.length ? `  (${failedRoutes.length} failed)` : ""}`);
console.log(`  images measured          : ${rows.length}`);
console.log(`  oversized >2.2x          : ${over.length}`);
console.log(`  written                  : ${arg("out", "english-candidate/image-render-sizes.json")}`);
for (const f of failedRoutes.slice(0, 5)) console.log(`    FAILED ${f}`);
