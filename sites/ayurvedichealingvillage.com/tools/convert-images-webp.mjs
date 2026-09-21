/**
 * AHV — convert the referenced JPG/PNG set to WebP and repoint every reference.
 *
 * WHY THIS EXISTS, AND WHY IT OVERRIDES THE EARLIER TOOL'S "NEVER RENAME" RULE.
 *
 * tools/optimise-images.mjs re-encoded the package IN PLACE, same filename, same
 * format, and said so deliberately: "Changing a name or an extension would mean
 * rewriting approved markup". That was the right call for a re-encode, where the
 * only thing changing is bytes nobody reviews. It is the wrong call here, for
 * two measured reasons:
 *
 *   1. It was not enough. After that pass the homepage alone still pulls 89
 *      images for 16.62 MB, against 6.95 MB for the SAME page on the live
 *      WordPress site. The audience is ~80% mobile and the live site currently
 *      PASSES Core Web Vitals (CrUX p75: LCP 1.8s / INP 122ms / CLS 0.01). Ship
 *      that and we regress a site that works. Ship Gate A5 wants perf >= 90.
 *   2. The format is the whole problem. Measured on a 40-file sample spanning
 *      the largest files and a random tail: 19.05 MB -> 2.26 MB, 88% smaller,
 *      and MOST of that needs no resizing at all. The PNGs are the story -
 *      1,149 KB -> 94 KB, repeatedly. 1,121 JPG + 359 PNG = 169.6 MB of the
 *      224.5 MB referenced set is sitting in formats that predate the problem.
 *
 * An extension change is not a redesign. The image is the same image, at the
 * same box, with the same alt text; no layout moves and nothing a reviewer
 * approved changes meaning. Weighed against a 150 MB regression on a mobile
 * audience, the "never rename" rule loses - and this file records that it was
 * overridden on purpose, with the numbers, rather than quietly.
 *
 * WHY IT ALSO UNBLOCKS CI. sites/ayurvedichealingvillage.com/.gitignore excludes
 * public/ahv media, so only 97 of 1,847 referenced files are in git and every
 * runner builds a site with no images (docs/reports/2026-09-21-ahv-images-are-
 * not-in-the-repo.md). 169.6 MB is an argument; ~20 MB is not. Committing the
 * referenced set is a SEPARATE change and a separate owner ruling - this tool
 * only makes it cheap.
 *
 * RESIZING IS CONSERVATIVE, because the markup lies. The <img width> attribute
 * is INTRINSIC, not display: measured on 13 files, 10 had width == the real
 * pixel width. So width is NOT treated as a display size. A file is downscaled
 * only where the declared width is SMALLER than the intrinsic one - there the
 * markup is genuinely describing a smaller render box (team-deepu-john.jpg
 * declares 600 and is stored 1024x1536 at 567 KB) - and never below it.
 * Everything else is a pure format change.
 *
 * COLLISIONS ARE REFUSED, NEVER RESOLVED. Two sources whose names differ only by
 * extension (foo.jpg + foo.webp, both referenced) would land on one target. The
 * tool skips those and names them, leaving the originals in place, rather than
 * silently clobbering one image with another.
 *
 * Post-import repair step: tools/import-english-candidate.mjs rewrites
 * public/ahv wholesale, so this runs AFTER an import, like every repair-*.mjs.
 * Idempotent - an already-converted source is skipped, references are rewritten
 * every run so a re-import cannot leave a dangling .jpg.
 *
 *   node tools/convert-images-webp.mjs [--quality 82] [--cap 1600] [--dry]
 */
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
const Q = Number(arg("quality", "82"));
const CAP = Number(arg("cap", "1600"));
const DRY = process.argv.includes("--dry");

/** The surfaces a browser actually reads. Tools and evidence are NOT rewritten. */
const SURFACES = ["english-candidate/prerender", "public/ahv/views", "public/ahv/assets", "public/ahv/components"];
const TEXTY = /\.(html|json|js)$/;
/**
 * The trailing lookahead is load-bearing. WordPress exports carry DOUBLE
 * extensions - /ahv/assets/img/Rehab.jpg.webp is one file, already WebP - and
 * without `(?![A-Za-z0-9.])` this pattern matches the ".jpg" PREFIX of it. The
 * first run did exactly that: it reported Rehab.jpg, careers-5148-150x150.jpg
 * and De-addiction-and-Rehabilitation-Treatment1-1.jpg as "source missing",
 * and I wrote that up as three images broken on every machine. All three exist.
 * There were never any broken references.
 *
 * It did not corrupt anything only because the rewrite refuses to point at a
 * file that is not on disk ("Rehab.webp" was not), so `Rehab.jpg.webp` was left
 * alone instead of becoming `Rehab.webp.webp`. That guard caught a bug it was
 * not written for; the anchor below is the actual fix.
 */
const MEDIA_RE = /\/ahv\/[A-Za-z0-9_\-./%()]+?\.(?:jpe?g|png)(?![A-Za-z0-9.])/gi;
const LEDGER = join(SITE, "english-candidate", "image-webp-conversion.json");

const walk = (d, out = []) => {
  if (!existsSync(d)) return out;
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};

const surfaceFiles = SURFACES.flatMap((s) => walk(join(SITE, s))).filter((p) => TEXTY.test(p));

/** url -> largest declared <img width>, used ONLY to shrink, never to grow. */
const declared = new Map();
for (const p of surfaceFiles.filter((p) => p.endsWith(".html"))) {
  const s = readFileSync(p, "utf8");
  for (const tag of s.match(/<img\b[^>]*>/gi) ?? []) {
    const src = tag.match(/src="(\/ahv\/[^"]+)"/)?.[1];
    const w = Number(tag.match(/\bwidth="(\d+)"/)?.[1]);
    if (src && w > 0) declared.set(src, Math.max(declared.get(src) ?? 0, w));
  }
}

/** Every referenced jpg/png, and every referenced image of any kind (for collisions). */
const refs = new Set();
const allImageRefs = new Set();
for (const p of surfaceFiles) {
  const s = readFileSync(p, "utf8");
  for (const m of s.match(MEDIA_RE) ?? []) refs.add(m);
  for (const m of s.match(/\/ahv\/[A-Za-z0-9_\-./%()]+?\.(?:jpe?g|png|webp)/gi) ?? []) allImageRefs.add(m);
}

const diskPath = (url) => join(SITE, "public", decodeURIComponent(url));
const webpUrl = (url) => url.replace(/\.(jpe?g|png)$/i, ".webp");

/** A target already claimed by a DIFFERENT referenced image is a refusal, not a merge. */
const claimed = new Map();
for (const u of allImageRefs) if (/\.webp$/i.test(u)) claimed.set(u.toLowerCase(), u);

const intrinsicWidth = (p) => {
  try {
    const out = execFileSync("sips", ["-g", "pixelWidth", p], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return Number(out.match(/pixelWidth:\s*(\d+)/)?.[1]) || null;
  } catch { return null; }
};

let encoded = 0, skippedExisting = 0, missing = [], collisions = [], failed = [];
let bytesBefore = 0, bytesAfter = 0;

for (const url of [...refs].sort()) {
  const src = diskPath(url);
  if (!existsSync(src)) { missing.push(url); continue; }
  const outUrl = webpUrl(url);
  if (claimed.has(outUrl.toLowerCase())) { collisions.push([url, claimed.get(outUrl.toLowerCase())]); continue; }
  const out = diskPath(outUrl);

  const bIn = statSync(src).size;
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) {
    skippedExisting++; bytesBefore += bIn; bytesAfter += statSync(out).size; continue;
  }
  const iw = intrinsicWidth(src);
  const d = declared.get(url);
  const target = Math.min(iw ?? CAP, d && iw && d < iw ? d : (iw ?? CAP), CAP);

  if (!DRY) {
    mkdirSync(dirname(out), { recursive: true });
    const args = ["-quiet", "-q", String(Q)];
    if (iw && target < iw) args.push("-resize", String(target), "0");
    try { execFileSync("cwebp", [...args, src, "-o", out], { stdio: "ignore" }); }
    catch (e) { failed.push(url); continue; }
    if (!existsSync(out)) { failed.push(url); continue; }
    bytesAfter += statSync(out).size;
  }
  bytesBefore += bIn; encoded++;
}

/** Repoint references — every run, so a re-import cannot leave a dangling .jpg. */
const skipUrls = new Set([...collisions.map(([u]) => u), ...missing, ...failed]);
let filesRewritten = 0, refsRewritten = 0;
for (const p of surfaceFiles) {
  const before = readFileSync(p, "utf8");
  let n = 0;
  const after = before.replace(MEDIA_RE, (m) => {
    if (skipUrls.has(m)) return m;
    if (!existsSync(diskPath(webpUrl(m)))) return m;   // never point at a file that is not there
    n++; return webpUrl(m);
  });
  if (n && after !== before) { filesRewritten++; refsRewritten += n; if (!DRY) writeFileSync(p, after); }
}

/* ---------- POSTCONDITIONS ---------- */
const problems = [];
if (!DRY) {
  const stillRaw = new Set();
  const unresolved = new Set();
  for (const p of surfaceFiles) {
    const s = readFileSync(p, "utf8");
    for (const m of s.match(MEDIA_RE) ?? []) if (!skipUrls.has(m)) stillRaw.add(m);
    // Same double-extension anchor as MEDIA_RE — a second, unanchored copy of
    // this pattern is what made the postcondition report three files as
    // missing when all three exist as .jpg.webp.
    for (const m of s.match(/\/ahv\/[A-Za-z0-9_\-./%()]+?\.(?:jpe?g|png|webp|svg|avif|mp4|pdf)(?![A-Za-z0-9.])/gi) ?? []) {
      if (!existsSync(diskPath(m))) unresolved.add(m);
    }
  }
  if (stillRaw.size) problems.push(`${stillRaw.size} jpg/png reference(s) survived the rewrite: ${[...stillRaw].slice(0, 5).join(", ")}`);
  const newlyBroken = [...unresolved].filter((u) => !missing.includes(u));
  if (newlyBroken.length) problems.push(`${newlyBroken.length} reference(s) now point at a file that does not exist: ${newlyBroken.slice(0, 5).join(", ")}`);

  // INTEGRITY. 7,518 substitutions across 438 files is exactly the shape of
  // change that corrupts a payload silently - a replacement landing inside an
  // escaped string breaks the file, not the URL, and nothing notices until a
  // page renders blank in front of the owner. So every machine-readable
  // surface this tool touched is re-parsed before the run is allowed to pass.
  for (const f of readdirSync(join(SITE, "public/ahv/views"))) {
    if (!f.endsWith(".json")) continue;
    try { JSON.parse(readFileSync(join(SITE, "public/ahv/views", f), "utf8")); }
    catch (e) { problems.push(`view payload no longer parses: ${f} — ${String(e.message).slice(0, 70)}`); }
  }
  for (const f of readdirSync(join(SITE, "public/ahv/assets"))) {
    if (!/-(data|render)\.js$/.test(f)) continue;
    try { new Function(readFileSync(join(SITE, "public/ahv/assets", f), "utf8")); }
    catch (e) { problems.push(`asset module no longer parses: ${f} — ${String(e.message).slice(0, 70)}`); }
  }

  writeFileSync(LEDGER, JSON.stringify({
    generated: new Date().toISOString(), settings: { quality: Q, cap: CAP },
    encoded, skippedExisting, refsRewritten, filesRewritten,
    bytesBefore, bytesAfter,
    collisions: collisions.map(([a, b]) => ({ source: a, blockedBy: b })),
    missingSources: missing, failed,
  }, null, 2) + "\n");
}

const mb = (b) => (b / 1048576).toFixed(1);
console.log(`convert-images-webp${DRY ? " (dry run)" : ""}  q=${Q} cap=${CAP}`);
console.log(`  referenced jpg/png      : ${refs.size}`);
console.log(`  encoded this run        : ${encoded}`);
console.log(`  already converted       : ${skippedExisting}`);
console.log(`  references repointed    : ${refsRewritten} in ${filesRewritten} file(s)`);
if (!DRY && bytesBefore > 0) console.log(`  bytes                   : ${mb(bytesBefore)} MB -> ${mb(bytesAfter)} MB  (${(100 * (1 - bytesAfter / bytesBefore)).toFixed(0)}% smaller)`);
if (collisions.length) { console.log(`  REFUSED (name collision, originals left alone): ${collisions.length}`); for (const [a, b] of collisions) console.log(`    ${a}  would overwrite  ${b}`); }
if (missing.length) { console.log(`  SOURCE MISSING (pre-existing broken refs): ${missing.length}`); for (const u of missing) console.log(`    ${u}`); }
if (failed.length) console.log(`  ENCODE FAILED: ${failed.length}`);
if (problems.length) { console.error("\nFAIL —"); for (const p of problems) console.error("  " + p); process.exit(1); }
