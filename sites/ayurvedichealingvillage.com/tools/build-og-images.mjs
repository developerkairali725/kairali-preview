/**
 * Builds a share-card image for every approved route, from the site's own image bank.
 *
 * WHY. Measured 2026-09-16 across the 252 routes: 71 pages declared no og:image at
 * all (their WhatsApp/Facebook card renders as a bare text link), 180 pointed at
 * /wp-content/ on the production domain — which the new host does not serve, so
 * they break the moment DNS moves — and the homepage's pointed at /og-card.jpg,
 * which already returns 404 on production today. Between them, every page.
 *
 * WHAT IT MAKES. 1200x630 (the 1.91:1 Facebook/WhatsApp card ratio), baseline JPEG,
 * held under 300 KB. Meta's documented ceiling is 8 MB, but WhatsApp previews are
 * widely reported to fail silently above roughly 300 KB, and WhatsApp matters here:
 * the audience is India-heavy. JPEG rather than WebP because social scrapers are
 * least fussy about it.
 *
 * WHERE THE PICTURE COMES FROM. An owner-selected homepage campaign image
 * overrides the default image-bank selection (7 October 2026). Other routes use:
 *   1. the route's own declared og:image, mirrored from production, where one exists
 *   2. otherwise the first substantial photograph on that page
 *   3. otherwise the brand hero
 *
 * Output goes to public/images/og/, NOT public/ahv/ — the importer rewrites
 * public/ahv/ wholesale, so anything generated in there would be erased.
 *
 * Usage: node tools/build-og-images.mjs [--only /about-us/]
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import { logoSource, renderLogo } from "./lib/og-logo-fit.mjs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(SITE, "public/images/og");
const MAP = path.join(SITE, "english-candidate/og-images.json");
const PLAN = "/tmp/claude-501/og-plan.json";
const FALLBACK = path.join(SITE, "public/ahv/assets/img/wx-hero.jpg");
const W = 1200, H = 630, MAX_KB = 300;
// Owner-requested AI-generated female Ayurveda share artwork. Keep the original
// homepage banner/card available; a versioned URL avoids reusing its image cache.
const SELECTED_CARDS = { "/": "home-ayurveda-woman-20261007.jpg" };
const only = (() => { const i = process.argv.indexOf("--only"); return i > -1 ? process.argv[i + 1] : null; })();

const routes = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8")).routes;
const plan = fs.existsSync(PLAN) ? JSON.parse(fs.readFileSync(PLAN, "utf8")) : {};
fs.mkdirSync(OUT, { recursive: true });

const slug = (p) => { const c = p.replace(/^\/+|\/+$/g, ""); return (c === "" ? "home" : c.replace(/[^a-z0-9._-]+/gi, "-")).toLowerCase(); };
const dims = (f) => { try { const o = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", f], { encoding: "utf8" });
  const w = /pixelWidth:\s*(\d+)/.exec(o), h = /pixelHeight:\s*(\d+)/.exec(o); return w && h ? { w: +w[1], h: +h[1] } : null; } catch { return null; } };

// --only must MERGE into the existing map, not replace it: a single-route rerun
// once rewrote the map with one entry and silently unmapped the other 247 pages.
const map = fs.existsSync(MAP) ? JSON.parse(fs.readFileSync(MAP, "utf8")) : {};
let made = 0, reused = 0, failed = 0, over = 0;
for (const r of routes) {
  if (only && r.path !== only) continue;
  if (SELECTED_CARDS[r.path]) {
    const name = SELECTED_CARDS[r.path], selected = path.join(OUT, name);
    // Never silently replace selected artwork with the old fallback on a rebuild.
    const bytes = fs.readFileSync(selected), size = dims(selected);
    if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes.length > MAX_KB * 1024 || size?.w !== W || size?.h !== H) {
      throw new Error(`Invalid selected share card: ${selected}`);
    }
    map[r.path] = "/images/og/" + name;
    reused++; continue;
  }
  const logo = logoSource(r.path);
  const src = logo ? path.join(SITE, logo) : plan[r.path] && fs.existsSync(plan[r.path]) ? plan[r.path] : FALLBACK;
  const name = slug(r.path) + ".jpg";
  const dest = path.join(OUT, name);
  map[r.path] = "/images/og/" + name;
  if (fs.existsSync(dest)) { reused++; continue; }
  try {
    if (logo) {
      // Existing Next dependency; do not add/install an image package. Fail visibly if unavailable.
      const require = createRequire(import.meta.url);
      const sharp = require(require.resolve("sharp", { paths: [require.resolve("next")] }));
      for (const q of [82, 72, 62, 52]) {
        await renderLogo(sharp, src, dest, q);
        if (fs.statSync(dest).size <= MAX_KB * 1024) break;
      }
      if (fs.statSync(dest).size > MAX_KB * 1024) over++;
      made++; continue;
    }
    fs.copyFileSync(src, dest);
    // sips reads WebP but cannot WRITE it, so a .webp source (most of the page
    // bank since the 21 Sep WebP conversion) must become a JPEG before the
    // in-place resample/crop below, or every sips write fails (SEO-D22, 29 Sep).
    execFileSync("sips", ["-s", "format", "jpeg", dest, "--out", dest], { stdio: "ignore" });
    const d = dims(dest);
    // Cover-fit: scale on the axis that would otherwise leave the frame short,
    // then centre-crop. Scaling on the wrong axis makes sips pad with white bars.
    if (d) {
      if (d.w / d.h > W / H) execFileSync("sips", ["--resampleHeight", String(H), dest, "--out", dest], { stdio: "ignore" });
      else execFileSync("sips", ["--resampleWidth", String(W), dest, "--out", dest], { stdio: "ignore" });
    }
    execFileSync("sips", ["-c", String(H), String(W), dest, "--out", dest], { stdio: "ignore" });
    // Walk the quality down only as far as the WhatsApp budget needs.
    for (const q of [82, 72, 62, 52]) {
      execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", String(q), dest, "--out", dest], { stdio: "ignore" });
      if (fs.statSync(dest).size <= MAX_KB * 1024) break;
    }
    if (fs.statSync(dest).size > MAX_KB * 1024) over++;
    made++;
  } catch {
    failed++; delete map[r.path];
    // A half-made card (e.g. the raw copied source under a .jpg name) must not
    // survive: the next run would count it as "reused" and map it.
    try { fs.unlinkSync(dest); } catch { /* nothing was written */ }
  }
}
fs.writeFileSync(MAP, JSON.stringify(map, null, 1));
const sizes = Object.values(map).map((p) => { try { return fs.statSync(path.join(SITE, "public", p.replace(/^\//, ""))).size; } catch { return 0; } }).filter(Boolean);
console.log(`routes covered : ${Object.keys(map).length} of ${routes.length}${only ? "  (merged; --only run)" : ""}`);
console.log(`generated      : ${made}   reused: ${reused}   failed: ${failed}`);
console.log(`over ${MAX_KB} KB     : ${over}`);
if (sizes.length) console.log(`card size      : min ${Math.round(Math.min(...sizes)/1024)} KB · median ${Math.round(sizes.sort((a,b)=>a-b)[Math.floor(sizes.length/2)]/1024)} KB · max ${Math.round(Math.max(...sizes)/1024)} KB`);
console.log(`map            : english-candidate/og-images.json`);
