/**
 * AHV route manifest overrides — owner-ruled route changes that survive import.
 *
 * tools/import-english-candidate.mjs regenerates english-candidate/
 * route-manifest.json from the approved package, so any ruling that changes
 * which view a route mounts or what its head says must be re-applied after
 * every import. This applies english-candidate/route-overrides.json: per
 * route, shallow fields replace; `metadata` merges; a metadata value of
 * "@from:<route>" copies that field from another route. Idempotent.
 *
 * `addRoutes` ADDS a route the approved package does not contain. That is a
 * narrower thing than it sounds and it is deliberately separate from `routes`:
 * an entry there must name the owner ruling that created it, because the
 * manifest is otherwise generated from the design package and a row with no
 * provenance would be indistinguishable from one the package produced. It
 * exists because two live pages were ruled BUILD on 2026-09-20 and neither is
 * in the package — their source kits were completed on 2026-09-01 and their
 * design pass was never started, so nothing downstream could see them.
 *
 * Usage: node tools/repair-route-manifest.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(SITE, "english-candidate/route-manifest.json");
const OVR = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-overrides.json"), "utf8"));
const DRY = process.argv.includes("--dry");

const manifest = JSON.parse(fs.readFileSync(FILE, "utf8"));
const byPath = (p) => manifest.routes.find((r) => r.path === p);
let changes = 0;
let added = 0;

// Additions run FIRST so an addRoutes row can also carry an override.
for (const [p, row] of Object.entries(OVR.addRoutes ?? {})) {
  if (byPath(p)) continue; // idempotent: already added on an earlier run
  if (!row.ruling) throw new Error(`addRoutes ${p}: no owner ruling recorded - a manifest row without provenance is indistinguishable from one the package generated`);
  for (const k of ["path", "desktopView", "mobileView", "dataset", "metadata"]) {
    if (row[k] === undefined) throw new Error(`addRoutes ${p}: missing required field \`${k}\``);
  }
  if (row.path !== p) throw new Error(`addRoutes ${p}: the row's own path says ${row.path}`);
  const { ruling, ...manifestRow } = row;
  manifest.routes.push(manifestRow);
  added++;
}
if (added) manifest.routes.sort((a, b) => a.path.localeCompare(b.path));
for (const [p, o] of Object.entries(OVR.routes)) {
  const row = byPath(p);
  if (!row) throw new Error("override for a route not in the manifest: " + p);
  for (const [k, v] of Object.entries(o)) {
    if (k === "metadata") {
      row.metadata = row.metadata || {};
      for (const [mk, mv] of Object.entries(v)) {
        let val = mv;
        if (typeof mv === "string" && mv.startsWith("@from:")) {
          const src = byPath(mv.slice(6));
          if (!src || src.metadata?.[mk] === undefined) throw new Error(`${p}.metadata.${mk}: source ${mv} has no value`);
          val = src.metadata[mk];
        }
        if (row.metadata[mk] !== val) { row.metadata[mk] = val; changes++; }
      }
    } else if (JSON.stringify(row[k]) !== JSON.stringify(v)) { row[k] = v; changes++; }
  }
}
if (!DRY && (changes || added)) fs.writeFileSync(FILE, JSON.stringify(manifest, null, 1) + "\n");
console.log(`${DRY ? "[dry] " : ""}route manifest: ${changes} field change(s) across ${Object.keys(OVR.routes).length} route(s), ${added} route(s) added, ${manifest.routes.length} total`);
