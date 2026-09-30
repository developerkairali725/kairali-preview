/**
 * AHV — resize each image to the size it is actually DRAWN at, ×2 for retina.
 *
 * WHY THIS IS SEPARATE FROM THE WEBP CONVERSION. convert-images-webp.mjs banked
 * the format win (169.6 MB -> 72.6 MB) but resized almost nothing, because the
 * only size available to it was <img width> and that attribute turned out to be
 * the INTRINSIC width, not the display width (10 of 13 sampled files had width
 * equal to the real pixel width). Guessing from it would have shrunk images
 * below their own render box. So it deliberately left the question open.
 *
 * tools/measure-image-render-sizes.mjs answered it with a browser instead of a
 * guess: all 254 routes, 508 page loads at desktop 1440 and mobile 375, every
 * image scrolled into view so lazy ones get a real box, recording the LARGEST
 * width each file is ever painted at. 1,669 images measured, 0 route failures.
 *
 * What that measurement found, on /photo-gallery/ alone:
 *
 *   69 images, 5.85 MB, mean 87 KB
 *   median natural width 1200px, median DRAWN width 351px
 *   67 of 69 more than 2x oversized
 *
 * A 1200px file painted into a 351px box sends roughly ten times the pixels a
 * reader can see. That is the whole reason the gallery loads visibly slowly:
 * nothing is broken, there is just far too much of it. Sitewide the measured
 * set is 82.6 MB with 561 images over 2x.
 *
 * THE RULE, AND WHY IT CANNOT CUT TOO FAR. target = min(natural, drawn x 2).
 * The x2 is the retina allowance, so a 351px box keeps a 702px file and stays
 * sharp on a phone. An image is never enlarged, and never taken below its own
 * measured box - both are asserted after the fact, per file. An image the
 * measurement never saw is LEFT ALONE: no evidence, no resize.
 *
 * SOURCE PREFERENCE. Re-encoding an already-lossy WebP compounds the loss, so
 * where the pre-conversion JPG/PNG is still on disk (it is - those are ignored
 * by git, not deleted) the resize is taken from the ORIGINAL. Quality is
 * therefore no worse than a single encode from source.
 *
 * Post-import repair step, idempotent: the ledger records the target each file
 * was last encoded to, so a re-run skips it, and a re-measure that finds a
 * bigger box re-encodes it larger from the original.
 *
 *   node tools/resize-images-to-render.mjs [--quality 82] [--retina 2] [--dry]
 */
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, copyFileSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
const Q = Number(arg("quality", "82"));
const RETINA = Number(arg("retina", "2"));
const DRY = process.argv.includes("--dry");
const MEASURE = join(SITE, "english-candidate/image-render-sizes.json");
const LEDGER = join(SITE, "english-candidate/image-resize-ledger.json");

if (!existsSync(MEASURE)) {
  console.error(`FAIL — ${MEASURE} is missing. Run tools/measure-image-render-sizes.mjs --all against a live server first; this tool never guesses a render size.`);
  process.exit(1);
}
const measured = JSON.parse(readFileSync(MEASURE, "utf8"));
if (!measured.images?.length || measured.pageLoads < 1) {
  console.error("FAIL — the measurement file records no page loads; it is not evidence.");
  process.exit(1);
}
const ledger = existsSync(LEDGER) ? JSON.parse(readFileSync(LEDGER, "utf8")) : { files: {} };

const intrinsic = (p) => {
  try {
    const out = execFileSync("sips", ["-g", "pixelWidth", p], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return Number(out.match(/pixelWidth:\s*(\d+)/)?.[1]) || null;
  } catch { return null; }
};

/** The pre-conversion original, still on disk (git-ignored, not deleted). */
function originalFor(webpDisk) {
  for (const ext of [".jpg", ".jpeg", ".png", ".JPG", ".PNG"]) {
    const cand = webpDisk.replace(/\.webp$/i, ext);
    if (existsSync(cand)) return cand;
  }
  return null;
}

let resized = 0, skippedNoEvidence = 0, skippedAlready = 0, failed = [];
let before = 0, after = 0;
const touched = [];

for (const row of measured.images) {
  const url = decodeURIComponent(row.url);
  const disk = join(SITE, "public" + url);
  if (!existsSync(disk) || !/\.webp$/i.test(disk)) continue;

  const drawn = row.maxRenderedWidth;
  if (!drawn || drawn < 1) { skippedNoEvidence++; continue; }

  const cur = intrinsic(disk);
  if (!cur) { skippedNoEvidence++; continue; }

  const target = Math.min(cur, Math.ceil(drawn * RETINA));
  if (target >= cur) { skippedAlready++; continue; }            // never enlarge
  if (ledger.files[url]?.target === target && ledger.files[url]?.width === cur) { skippedAlready++; continue; }

  const src = originalFor(disk) ?? disk;
  const bIn = statSync(disk).size;
  if (DRY) { before += bIn; after += Math.round(bIn * (target / cur) ** 1.7); resized++; continue; }

  const backup = disk + ".bak";
  copyFileSync(disk, backup);
  try {
    execFileSync("cwebp", ["-quiet", "-q", String(Q), "-resize", String(target), "0", src, "-o", disk], { stdio: "ignore" });
    const got = intrinsic(disk);
    // POSTCONDITION, per file: never narrower than the box it is painted into.
    if (!got || got < drawn) throw new Error(`result ${got}px is narrower than its measured ${drawn}px render box`);
    unlinkSync(backup);
  } catch (e) {
    copyFileSync(backup, disk); unlinkSync(backup);
    failed.push(`${url}: ${String(e.message).slice(0, 80)}`);
    continue;
  }
  before += bIn; after += statSync(disk).size; resized++;
  ledger.files[url] = { target, width: target, drawn, from: src === disk ? "webp" : "original" };
  touched.push([bIn - statSync(disk).size, url]);
}

if (!DRY) {
  ledger.generated = new Date().toISOString();
  ledger.settings = { quality: Q, retina: RETINA };
  ledger.measurementGenerated = measured.generated;
  writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + "\n");
}

const mb = (b) => (b / 1048576).toFixed(1);
console.log(`resize-images-to-render${DRY ? " (dry run)" : ""}  retina=${RETINA}x q=${Q}`);
console.log(`  measured images        : ${measured.images.length} (from ${measured.pageLoads} page loads)`);
console.log(`  resized                : ${resized}`);
console.log(`  already at/below target: ${skippedAlready}`);
console.log(`  no usable evidence     : ${skippedNoEvidence}`);
if (before) console.log(`  bytes                  : ${mb(before)} MB -> ${mb(after)} MB  (${(100 * (1 - after / before)).toFixed(0)}% smaller)`);
if (failed.length) { console.log(`  FAILED (original restored): ${failed.length}`); for (const f of failed.slice(0, 5)) console.log("    " + f); }
touched.sort((a, b) => b[0] - a[0]);
for (const [saved, u] of touched.slice(0, 6)) console.log(`    -${(saved / 1024).toFixed(0)}K  ${u.split("/").pop().slice(0, 50)}`);
