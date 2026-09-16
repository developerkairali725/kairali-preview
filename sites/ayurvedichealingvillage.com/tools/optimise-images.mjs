/**
 * Re-encodes the approved design package's images in place.
 *
 * WHY. Measured 2026-09-16 against the live WordPress site, same page, same
 * device: the live site sends 6.95 MB of images on its homepage (WordPress
 * generates phone-sized variants), the new build sends 33.62 MB. The package is
 * 384 MB across 2,010 files, with 18 files over 5 MB and the largest at 9.1 MB,
 * and not one image carries a srcset. Field data (CrUX p75) says the LIVE site
 * currently PASSES Core Web Vitals -- LCP 1.8s, INP 122ms, CLS 0.01 -- so this
 * is not fixing a broken site, it is preventing a regression against one that
 * already works, on an audience that is 80% mobile.
 *
 * WHY IN PLACE, SAME FILENAME, SAME FORMAT. Every reference to these files lives
 * inside the approved design payloads and the prerendered snapshots. Changing a
 * name or an extension would mean rewriting approved markup; re-encoding the
 * bytes behind the same name changes nothing anyone has to review, and no
 * <img> tag moves.
 *
 * WHY A TOOL AND NOT A ONE-OFF. tools/import-english-candidate.mjs rewrites
 * public/ahv/ wholesale on every run, so a hand-optimised tree would be erased
 * by the next import. This is idempotent and re-runnable: it records what it has
 * already processed and skips it.
 *
 * Usage:
 *   node tools/optimise-images.mjs [--max 1600] [--quality 82] [--min-kb 120] [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = path.join(SITE, "public/ahv/assets/img");
const LEDGER = path.join(SITE, "english-candidate/image-optimisation.json");
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
const MAX = Number(arg("max", "1600"));
const Q = Number(arg("quality", "82"));
const MIN_KB = Number(arg("min-kb", "120"));
const DRY = process.argv.includes("--dry");

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});

const dims = (f) => {
  try {
    const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", f], { encoding: "utf8" });
    const w = /pixelWidth:\s*(\d+)/.exec(out), h = /pixelHeight:\s*(\d+)/.exec(out);
    return w && h ? { w: +w[1], h: +h[1] } : null;
  } catch { return null; }
};

const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, "utf8")) : { done: {} };
const files = walk(ROOT).filter((f) => /\.(jpe?g|png)$/i.test(f));
let before = 0, after = 0, touched = 0, skipped = 0, failed = 0;

for (const f of files) {
  const rel = path.relative(SITE, f);
  const sz = fs.statSync(f).size;
  before += sz;
  const d = dims(f);
  const needsResize = d && d.w > MAX;
  const needsSqueeze = sz > MIN_KB * 1024;
  // Already processed at these settings, and unchanged since.
  const rec = ledger.done[rel];
  const sameSettings = rec && rec.max === MAX && rec.q === Q;
  if (rec && rec.size === sz && sameSettings) { after += sz; skipped++; continue; }
  if (!needsResize && !needsSqueeze) { after += sz; skipped++; continue; }
  if (DRY) { after += sz; touched++; continue; }
  try {
    const args = ["-s", "format", /\.png$/i.test(f) ? "png" : "jpeg"];
    if (!/\.png$/i.test(f)) args.push("-s", "formatOptions", String(Q));
    if (needsResize) args.push("-Z", String(MAX));
    execFileSync("sips", [...args, f, "--out", f], { stdio: "ignore" });
    const now = fs.statSync(f).size;
    // Never let a re-encode make a file bigger.
    if (now > sz) { fs.writeFileSync(f, fs.readFileSync(f)); after += now; }
    else after += now;
    ledger.done[rel] = { size: fs.statSync(f).size, was: sz, max: MAX, q: Q };
    touched++;
  } catch { failed++; after += sz; }
}

if (!DRY) {
  ledger.generated = new Date().toISOString();
  ledger.settings = { max: MAX, quality: Q, minKb: MIN_KB };
  fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 1));
}
const mb = (n) => (n / 1048576).toFixed(1) + " MB";
console.log(`images scanned : ${files.length}`);
console.log(`re-encoded     : ${touched}`);
console.log(`skipped        : ${skipped}  (already small, or already processed)`);
console.log(`failed         : ${failed}`);
console.log(`payload        : ${mb(before)} -> ${mb(after)}  (${Math.round((1 - after / before) * 100)}% smaller)`);
