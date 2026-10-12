/**
 * Hash manifest for the git-ignored locale snapshots (l10n/prerender/<locale>/*.html.gz):
 * the committed pointer of record for binaries kept off-repo.
 *   node tools/l10n/prerender-manifest.mjs  → l10n/prerender-manifest.json
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { rel } from "./sources-lite.mjs";
const root = rel("l10n/prerender");
const released = process.argv.includes("--release-spec")
  ? new Set(JSON.parse(fs.readFileSync(rel("english-candidate/locale-prerenders-release.json"), "utf8")).files.map((row) => row.file))
  : null;
const out = { generated: new Date().toISOString(), locales: {} };
if (fs.existsSync(root)) for (const loc of fs.readdirSync(root).sort()) {
  const dir = path.join(root, loc);
  const files = {};
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".gz") && (!released || released.has(`l10n/prerender/${loc}/${x}`))).sort()) files[f] = crypto.createHash("sha256").update(fs.readFileSync(path.join(dir, f))).digest("hex");
  const cat = rel(`l10n/generated/${loc}.catalog.json`);
  out.locales[loc] = { count: Object.keys(files).length, catalogSha256: fs.existsSync(cat) ? crypto.createHash("sha256").update(fs.readFileSync(cat, "utf8"), "utf8").digest("hex") : null, sourceSetHash: JSON.parse(fs.readFileSync(rel("l10n/source/units.json"), "utf8")).sourceSetHash, files };
}
fs.writeFileSync(rel("l10n/prerender-manifest.json"), JSON.stringify(out, null, 1) + "\n");
console.log(Object.fromEntries(Object.entries(out.locales).map(([k, v]) => [k, v.count])));
