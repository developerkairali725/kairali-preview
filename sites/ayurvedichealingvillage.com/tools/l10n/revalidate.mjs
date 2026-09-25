/**
 * Re-validate every accepted batch (l10n/output/<locale>/<batch>.json) with the
 * current validator against the CURRENT frozen source and batch membership.
 * A failing batch is withdrawn: moved to work/rejected/<locale>/<batch>.json
 * (reasons + the prior result, which the retry job input then carries) and
 * removed from output, so only passing work is ever integrated.
 *   node tools/l10n/revalidate.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { rel } from "./sources-lite.mjs";
import { WORK } from "./jobs-const.mjs";
import { validate } from "./validate.mjs";
const DRY = process.argv.includes("--dry");
const S = new Map(JSON.parse(fs.readFileSync(rel("l10n/source/units.json"), "utf8")).units.map((u) => [u.id, u]));
const B = new Map(JSON.parse(fs.readFileSync(rel("l10n/batches.json"), "utf8")).batches.map((b) => [b.id, b.ids]));
const stats = { checked: 0, passed: 0, withdrawn: 0, reasons: {} };
for (const loc of fs.readdirSync(rel("l10n/output"))) {
  for (const f of fs.readdirSync(rel(`l10n/output/${loc}`)).filter((x) => x.endsWith(".json"))) {
    const p = rel(`l10n/output/${loc}/${f}`);
    const out = JSON.parse(fs.readFileSync(p, "utf8"));
    const ids = B.get(out.batchId) || [];
    const input = { locale: loc, units: ids.map((id) => ({ id, src: S.get(id)?.source ?? "", roles: S.get(id)?.roles ?? [] })) };
    const res = { units: out.units.filter((u) => ids.includes(u.id)).map((u) => ({ id: u.id, text: u.text, status: u.status, unchangedReason: u.unchangedReason, issue: (u.issues || [])[0] || null })) };
    const errs = [...validate(res, input, S).errs];
    for (const u of out.units) if (S.get(u.id) && S.get(u.id).sourceHash !== u.sourceHash) errs.push(`${u.id} stamped sourceHash differs from frozen source`);
    stats.checked++;
    if (!errs.length) { stats.passed++; continue; }
    stats.withdrawn++;
    for (const e of errs) { const k = e.replace(/^t_\w+ /, "").replace(/\d[\d,]*/g, "#").slice(0, 40); stats.reasons[k] = (stats.reasons[k] || 0) + 1; }
    if (!DRY) {
      fs.mkdirSync(path.join(WORK, "rejected", loc), { recursive: true });
      fs.writeFileSync(path.join(WORK, "rejected", loc, f), JSON.stringify({ errs, withdrawnBy: "revalidate", res: { batchId: out.batchId, locale: loc, units: res.units } }, null, 1));
      fs.rmSync(p);
    }
  }
}
console.log(JSON.stringify(stats, null, 1));
