/**
 * Output lifecycle: retire translation rows whose English source no longer exists.
 *   node tools/l10n/prune-retired.mjs --archive <dir> [--dry]
 *
 * A row in l10n/output/<loc>/<batch>.json whose unit id is absent from the current l10n/source/units.json belongs
 * to English text that was replaced (owner-approved copy, clinical corrections). The build never applies it, but
 * release-gate.mjs reads "blocked" rows without testing source membership, so a retired blocked row reads as a
 * live clinical hold. This moves every such row out of the active output set:
 *   · the exact removed rows (full text) are written to <archive>/retired-rows-<stamp>.json BEFORE any file changes;
 *   · l10n/PRUNE-MANIFEST-<stamp>.json (committed) lists file, id, status, sourceHash and a SHA-256 of the text;
 *   · runtime references are checked first: an id still named in l10n/overrides or public/ahv stops the run.
 * Current-source rows are never touched. Idempotent (a second run removes nothing).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { rel } from "./sources-lite.mjs";

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const ai = args.indexOf("--archive");
const ARCHIVE = ai >= 0 ? args[ai + 1] : null;
if (!DRY && !ARCHIVE) { console.error("--archive <dir> is required (outside the repo): the removed rows are kept there verbatim"); process.exit(2); }

const live = new Set(JSON.parse(fs.readFileSync(rel("l10n/source/units.json"), "utf8")).units.map((u) => u.id));
const outRoot = rel("l10n/output");
const removed = [], plan = [];
for (const loc of fs.readdirSync(outRoot).sort()) {
  const dir = path.join(outRoot, loc);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
    const file = path.join(dir, f);
    const d = JSON.parse(fs.readFileSync(file, "utf8"));
    const gone = (d.units || []).filter((u) => !live.has(u.id));
    if (!gone.length) continue;
    plan.push({ file, d, keep: d.units.filter((u) => live.has(u.id)) });
    for (const u of gone) removed.push({ file: path.relative(rel("."), file), row: u });
  }
}

// Runtime references: a retired id must not be named by an override or a served asset.
const ids = new Set(removed.map((r) => r.row.id));
const refs = [];
const scan = (p) => {
  for (const e of fs.readdirSync(p, { withFileTypes: true })) {
    const q = path.join(p, e.name);
    if (e.isDirectory()) { if (!/^(img|l10n)$/.test(e.name)) scan(q); continue; }
    if (!/\.(json|js)$/.test(e.name)) continue;
    const s = fs.readFileSync(q, "utf8");
    for (const id of ids) if (s.includes(id)) refs.push(`${path.relative(rel("."), q)}: ${id}`);
  }
};
if (ids.size) { scan(rel("l10n/overrides")); scan(rel("public/ahv")); }
if (refs.length) { console.error("retired ids are still referenced — nothing pruned:\n" + refs.join("\n")); process.exit(1); }

const byStatus = removed.reduce((a, r) => ((a[r.row.status] = (a[r.row.status] || 0) + 1), a), {});
console.log(JSON.stringify({ files: plan.length, rows: removed.length, byStatus, heldIds: [...new Set(removed.filter((r) => r.row.status === "blocked").map((r) => r.row.id))] }));
if (DRY || !removed.length) process.exit(0);

const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..*/, "");
fs.mkdirSync(ARCHIVE, { recursive: true });
fs.writeFileSync(path.join(ARCHIVE, `retired-rows-${stamp}.json`), JSON.stringify(removed, null, 1));
const sha = (t) => crypto.createHash("sha256").update(String(t ?? "")).digest("hex");
fs.writeFileSync(rel(`l10n/PRUNE-MANIFEST-${stamp}.json`), JSON.stringify({
  rule: "remove output rows whose unit id is absent from the current l10n/source/units.json (retired English source)",
  archive: `retired-rows-${stamp}.json (kept outside the repo)`, files: plan.length, rows: removed.length, byStatus,
  removed: removed.map((r) => ({ file: r.file, id: r.row.id, status: r.row.status, sourceHash: r.row.sourceHash, textSha256: sha(r.row.text) })),
}, null, 1) + "\n");
for (const { file, d, keep } of plan) { d.units = keep; fs.writeFileSync(file, JSON.stringify(d, null, 1) + "\n"); }
