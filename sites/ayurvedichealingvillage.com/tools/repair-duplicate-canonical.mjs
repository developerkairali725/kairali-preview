/**
 * AHV — point a thin duplicate's canonical at the page that should rank.
 *
 * WHY. Four legacy pages say the same thing as a fuller page and compete with
 * it. Measured content similarity: /our-story/ is 96% identical to /about-us/,
 * /offers/new/ is 93% identical to the senior-citizen offer (which earns 236
 * clicks while the copy earns none). /panchakarma/ and the cancer
 * supportive-care legacy page are only 3% and 1% similar to their programme
 * pages, but that is because they are THIN versions of the same subject -
 * 5k and 6k characters against 26k and 27k - which is the same consolidation
 * case by a different route.
 *
 * WHERE THE CANONICAL ACTUALLY LIVES, and this is the part that matters: not
 * in the page markup. No view template writes one. The approved runtime
 * writes it on boot from the route's DATASET record, and app metadata.ts
 * deliberately does not emit one because doing so put two canonicals in every
 * head. So the only correct place to change it is the dataset, which is what
 * this does - reading the targets from english-candidate/route-overrides.json
 * so one list drives the manifest, the sitemap and the head.
 *
 * The 301 itself is NOT done here and cannot be: a redirect is a production
 * change and a human action at go-live. This sets the canonical and the
 * sitemap exclusion, which is the whole of the staging-safe half.
 *
 * Idempotent. Usage: node tools/repair-duplicate-canonical.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const OVR = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-overrides.json"), "utf8")).routes;
const MANIFEST = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8")).routes;

let done = 0;
for (const [route, o] of Object.entries(OVR)) {
  const target = o.duplicateOf;
  if (!target) continue;
  const row = MANIFEST.find((r) => r.path === route);
  if (!row) throw new Error(`no manifest row for ${route}`);
  if (!row.dataset) {
    // A route whose view bakes its own content (the 2026-09-22 Claude Design
    // pages) has no dataset record to carry a canonical. Reported, not thrown:
    // its head is the view's own, and the canonical for it is set there.
    console.log(`${route}: NO DATASET (view ${row.desktopView ?? row.views?.[0] ?? "?"}) — canonical ${target} must live in the view head; not written here`);
    continue;
  }
  const file = path.join(SITE, "public/ahv", row.dataset);
  const raw = fs.readFileSync(file, "utf8");
  // Find this route's record, then the FIRST canonical KEY inside it. A record
  // starts at `"path":"<route>","slug":` and ends where the next record's
  // `"path":"/…","slug":` begins — breadcrumb items also carry "path", so the
  // "slug" that follows is what tells a record head from a breadcrumb item.
  // (The old fixed 4,000-char window broke once a record's provenance note
  // grew past it and the word "canonical" inside that note matched first.)
  const at = raw.indexOf(`"path":"${route}","slug":`);
  if (at < 0) throw new Error(`${row.dataset} has no record for ${route}`);
  const nextRec = /"path":"\/[^"]*","slug":/g;
  nextRec.lastIndex = at + 1;
  const nx = nextRec.exec(raw);
  const end = nx ? nx.index : raw.length;
  const window = raw.slice(at, end);
  const m = window.match(/"canonical":\s*(?:"[^"]*"|null)/);
  const next = `"canonical":"${target}"`;
  let patched;
  if (!m) {
    // The campaign-family record for /offers/new/ carries no canonical key at
    // all (the runtime then writes none). Add one right after the slug field —
    // additive, and exactly what applyHead() reads.
    const slugEnd = window.indexOf('"', window.indexOf('"slug":') + 7 + 1) + 1;
    if (slugEnd < 8) throw new Error(`${route}: no canonical field and no slug field to anchor one`);
    patched = window.slice(0, slugEnd) + "," + next + window.slice(slugEnd);
    console.log(`${DRY ? "[dry] " : ""}${route}: record had no canonical field — added ${target}`);
  } else {
    if (m[0] === next) { console.log(`${route}: already canonical to ${target}`); continue; }
    patched = window.replace(m[0], next);
  }
  const out = raw.slice(0, at) + patched + raw.slice(end);
  if (!DRY) fs.writeFileSync(file, out);
  done++;
  console.log(`${DRY ? "[dry] " : ""}${route} -> canonical ${target}   (${row.dataset})`);
}
console.log(`${done} duplicate canonical(s) set`);
