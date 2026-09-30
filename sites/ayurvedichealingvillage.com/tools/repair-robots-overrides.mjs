#!/usr/bin/env node
/**
 * AHV — per-route robots overrides, applied to the payload.
 *
 * OWNER RULING 2026-09-21 (Q-AHV-NOINDEX-HUBS): index all eleven. Measured by
 * tools/audit-live-robots.mjs against the LIVE site, eleven routes serve
 * `noindex` while the rebuild's sitemap would submit them at the flip — a
 * conflicting signal. Three of them (`/training-programs/`,
 * `/yoga-meditation-programs/`, `/yoga-retreats/`) are linked from 237 pages
 * each; you do not noindex a page you link sitewide, so it reads as a live-site
 * mistake rather than a decision, and the flip is the moment to stop
 * inheriting it.
 *
 * WHY A TOOL, AND WHY IT MUST RE-RUN AFTER EVERY IMPORT. The importer rewrites
 * every payload's robots to `noindex, nofollow` as one of the FOUR staging
 * locks, so a hand edit is erased by the next import. This reads the
 * declaration from english-candidate/route-overrides.json (`robotsOverrides`)
 * and re-applies it, exactly like repair-route-manifest.mjs does for the
 * manifest.
 *
 * STAGING STAYS NOINDEX, and that is not an accident of this tool. The payload
 * value is one lock of four — the X-Robots-Tag response header, robots.txt
 * `Disallow: /`, the payload's robots, and the boot script's head guard. This
 * changes one of them, so the preview remains unindexable and the ruling only
 * takes effect at production.
 *
 * Idempotent, asserted: a declared route whose robots value cannot be found is
 * a FAILURE, never a silent skip — the whole point is that the value ships.
 *
 *   node tools/repair-robots-overrides.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const OVR = JSON.parse(readFileSync(join(SITE, "english-candidate/route-overrides.json"), "utf8"));
const WANT = Object.fromEntries(Object.entries(OVR.robotsOverrides ?? {}).filter(([k]) => k !== "_why"));

if (!Object.keys(WANT).length) { console.log("no robotsOverrides declared — nothing to do"); process.exit(0); }

const TREES = [["public/ahv/assets", (f) => f.endsWith(".js")], ["public/ahv/views", (f) => f.endsWith(".json")]];
const rx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let applied = 0, already = 0;
const found = new Set();
const lines = [];

for (const [rel, keep] of TREES) {
  const dir = join(SITE, rel);
  for (const name of readdirSync(dir).filter(keep)) {
    const path = join(dir, name);
    const before = readFileSync(path, "utf8");
    let work = before, touched = 0;

    for (const [route, value] of Object.entries(WANT)) {
      // The route's own record, then the robots value inside it. Bounded window
      // so a robots value belonging to a LATER route can never be captured.
      const anchor = new RegExp(`"(?:path|route|canonical)"\\s*:\\s*"[^"]*${rx(route)}"`, "g");
      let m;
      while ((m = anchor.exec(work))) {
        const start = m.index;
        const window = work.slice(start, start + 2500);
        const rb = /"robots"\s*:\s*"([^"]*)"/.exec(window);
        if (!rb) continue;
        found.add(route);
        if (rb[1] === value) { already += 1; continue; }
        const at = start + rb.index;
        work = work.slice(0, at) + `"robots":"${value}"` + work.slice(at + rb[0].length);
        touched += 1; applied += 1;
        anchor.lastIndex = start + 1;
      }
    }
    if (touched) { lines.push(`  ${String(touched).padStart(3)}  ${rel}/${name}`); if (!DRY) writeFileSync(path, work); }
  }
}

const missing = Object.keys(WANT).filter((r) => !found.has(r));
console.log(`${DRY ? "[dry] " : ""}robots overrides: ${applied} value(s) set, ${already} already correct`);
for (const l of lines) console.log(l);
if (missing.length) {
  console.error(`\nFAIL — ${missing.length} declared route(s) have no robots value in any payload, so the override would never ship:`);
  for (const r of missing) console.error(`  ${r}`);
  process.exit(1);
}
console.log(`\nall ${Object.keys(WANT).length} declared routes located.`);
console.log(`Staging remains noindex: this is one lock of four (X-Robots-Tag, robots.txt, payload, boot guard).`);
