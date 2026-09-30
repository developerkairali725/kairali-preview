/**
 * AHV — regenerate the .gitignore allowlist from what the site actually serves.
 *
 * THE MECHANISM THIS REPLACES, AND WHY IT STOPPED WORKING.
 *
 * public/ahv media was deliberately NOT in git. The binaries shipped from a
 * pinned, hash-verified GitHub release (english-candidate/runtime-assets-
 * release.json -> tag ahv-english-staging-20260915, 2,053 files) restored by
 * tools/restore-runtime-assets.mjs, which refuses any archive member the
 * manifest does not name. That is a good design and the release exists.
 *
 * Two things broke it, and only the second one is mine:
 *
 *   1. NOTHING EVER CALLED IT. `assets:restore` is a package.json script and
 *      that is all it is - no GitHub Actions step, no Vercel build command, no
 *      turbo task invokes it. So every CI runner and every Vercel build has
 *      always produced a site with no images. That is why factory-spec's
 *      "zero console errors" test drowns in 404s and why AHV has no deployment
 *      in the org's last 100. The bundle was never the problem; the wiring was.
 *
 *   2. THE CONVERSION STALED THE BUNDLE. tools/convert-images-webp.mjs
 *      re-encoded 1,489 JPG/PNG files to WebP and repointed 7,518 references
 *      (homepage 16.62 MB -> 7.06 MB). The bundle holds the ORIGINAL names -
 *      1,231 jpg, 438 png, 353 webp - so restoring it now would deliver files
 *      the site no longer asks for. Cutting a replacement release is an owner
 *      action, which the .gitignore itself says.
 *
 * So the owner ruled (2026-09-21, in-session): commit the images. This tool
 * makes that precise instead of wholesale. It tracks ONLY what a browser
 * fetches - the prerendered HTML, the view payloads, the family data and render
 * modules, the components, and the URLs app/ emits into <head> - and leaves the
 * ~300 unreferenced files, and every pre-conversion original, ignored.
 *
 * Generated, never hand-maintained: re-run it after any import or conversion
 * and the allowlist follows the site instead of drifting from it.
 *
 *   node tools/sync-image-gitignore.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const IGNORE = join(SITE, ".gitignore");
const DRY = process.argv.includes("--dry");
const BEGIN = "# BEGIN generated-served-media (tools/sync-image-gitignore.mjs) — do not hand-edit";
const END = "# END generated-served-media";

/** Exactly the surfaces a browser downloads, or that the app writes into markup. */
const SHIPPED_DIRS = ["english-candidate/prerender", "public/ahv/views", "public/ahv/assets", "public/ahv/components", "app"];
const SHIPPED_FILES = ["english-candidate/og-images.json"];
const MEDIA_RE = /\/ahv\/[A-Za-z0-9_\-./%()]+?\.(?:webp|jpe?g|png|svg|avif|mp4|pdf|ttf|woff2?)(?![A-Za-z0-9.])/gi;

const walk = (d, out = []) => {
  if (!existsSync(d)) return out;
  for (const e of readdirSync(d)) {
    if (e === "node_modules" || e === ".next") continue;
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};

const refs = new Set();
const texty = /\.(html|json|js|mjs|ts|tsx|css)$/;
for (const d of SHIPPED_DIRS) for (const p of walk(join(SITE, d))) {
  if (!texty.test(p)) continue;
  for (const m of readFileSync(p, "utf8").match(MEDIA_RE) ?? []) refs.add(m);
}
for (const f of SHIPPED_FILES) {
  const p = join(SITE, f);
  if (existsSync(p)) for (const m of readFileSync(p, "utf8").match(MEDIA_RE) ?? []) refs.add(m);
}

const served = [...new Set([...refs].map((u) => decodeURIComponent(u)))].sort();
const missing = served.filter((u) => !existsSync(join(SITE, "public" + u)));
if (missing.length) {
  console.error(`FAIL — ${missing.length} served reference(s) do not exist on disk; fix those before tracking an allowlist that cannot be satisfied:`);
  for (const u of missing.slice(0, 10)) console.error("   " + u);
  process.exit(1);
}

/**
 * A gitignore pattern containing a glob metacharacter would match the wrong
 * thing, so a filename carrying one is a refusal rather than a silent miss.
 */
const unsafe = served.filter((u) => /[*?\[\]]/.test(u) || u !== u.trim());
if (unsafe.length) {
  console.error(`FAIL — ${unsafe.length} path(s) contain gitignore glob metacharacters and cannot be allowlisted safely:`);
  for (const u of unsafe.slice(0, 10)) console.error("   " + u);
  process.exit(1);
}

let bytes = 0;
for (const u of served) bytes += statSync(join(SITE, "public" + u)).size;

const block = [
  BEGIN,
  `# ${served.length} files, ${(bytes / 1048576).toFixed(1)} MB — every image, video, font and PDF`,
  "# the built site actually fetches. Owner ruling 2026-09-21: commit them, because",
  "# the pinned-release mechanism above was never wired into any build (no Actions",
  "# step, no Vercel command, no turbo task calls assets:restore) and the WebP",
  "# conversion made its manifest stale. See tools/sync-image-gitignore.mjs.",
  ...served.map((u) => `!/public${u}`),
  END,
].join("\n");

const current = readFileSync(IGNORE, "utf8");
const hasBlock = current.includes(BEGIN) && current.includes(END);
const next = hasBlock
  ? current.replace(new RegExp(`${BEGIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${END}`), block)
  : current.trimEnd() + "\n\n" + block + "\n";

if (!DRY && next !== current) writeFileSync(IGNORE, next);

console.log(`sync-image-gitignore${DRY ? " (dry run)" : ""}`);
console.log(`  served media files : ${served.length}`);
console.log(`  total bytes        : ${(bytes / 1048576).toFixed(1)} MB`);
console.log(`  allowlist block    : ${hasBlock ? "replaced" : "appended"}${next === current ? " (no change)" : ""}`);
