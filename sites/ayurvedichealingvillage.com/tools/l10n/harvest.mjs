/**
 * Coordinator: harvest worker results (workflow journal.jsonl, or a JSON file),
 * validate each against its frozen input, and write accepted batches to
 * l10n/output/<locale>/<batchId>.json in the kit schema (output.schema.json).
 * Rejected batches go to work/rejected/ with reasons and are retried.
 *   node tools/l10n/harvest.mjs <journal.jsonl|results.json> [...]
 */
import fs from "node:fs";
import path from "node:path";
import { rel, sha256 } from "./sources-lite.mjs";
import { WORK } from "./jobs-const.mjs";
const S = new Map(JSON.parse(fs.readFileSync(rel("l10n/source/units.json"), "utf8")).units.map((u) => [u.id, u]));
const SET = JSON.parse(fs.readFileSync(rel("l10n/batches.json"), "utf8")).sourceSetHash;
import { validate as validateUnits } from "./validate.mjs";
const validate = (res, input) => validateUnits(res, input, S);

function* resultsIn(file) {
  const txt = fs.readFileSync(file, "utf8");
  const lines = file.endsWith(".jsonl") ? txt.split("\n").filter(Boolean) : [txt];
  const seen = new Set();
  const walk = function* (v) {
    if (typeof v === "string" && v.includes('"batchId"')) { try { yield* walk(JSON.parse(v)); } catch { /* not json */ } return; }
    if (!v || typeof v !== "object") return;
    if (typeof v.batchId === "string" && typeof v.locale === "string" && Array.isArray(v.units)) { const k = v.locale + "/" + v.batchId + "/" + JSON.stringify(v.units).length; if (!seen.has(k)) { seen.add(k); yield v; } return; }
    for (const x of Array.isArray(v) ? v : Object.values(v)) yield* walk(x);
  };
  for (const l of lines) { try { yield* walk(JSON.parse(l)); } catch { /* skip */ } }
}

const stats = { accepted: 0, rejected: 0, skippedExisting: 0, warnings: 0, blockedUnits: 0 };
const inflightPath = path.join(WORK, "inflight.json");
let inflight = new Set(fs.existsSync(inflightPath) ? JSON.parse(fs.readFileSync(inflightPath, "utf8")) : []);
for (const f of process.argv.slice(2)) {
  for (const res of resultsIn(f)) {
    const key = res.locale + "/" + res.batchId;
    const out = rel(`l10n/output/${res.locale}/${res.batchId}.json`);
    const inFile = path.join(WORK, "in", res.locale, res.batchId + ".json");
    if (fs.existsSync(out)) { stats.skippedExisting++; inflight.delete(key); continue; }
    if (!fs.existsSync(inFile)) continue;
    const input = JSON.parse(fs.readFileSync(inFile, "utf8"));
    // units retired from the frozen source since the job was issued are dropped, not translated
    const retired = new Set(input.units.filter((w) => !S.has(w.id)).map((w) => w.id));
    input.units = input.units.filter((w) => !retired.has(w.id));
    res.units = (res.units || []).filter((u) => !retired.has(u.id));
    const { errs, warn } = validate(res, input);
    inflight.delete(key);
    if (errs.length) {
      stats.rejected++;
      fs.mkdirSync(path.join(WORK, "rejected", res.locale), { recursive: true });
      fs.writeFileSync(path.join(WORK, "rejected", res.locale, res.batchId + ".json"), JSON.stringify({ errs, res }, null, 1));
      continue;
    }
    const got = new Map(res.units.map((u) => [u.id, u]));
    const units = input.units.map((w) => {
      const u = got.get(w.id);
      if (u.status === "blocked") stats.blockedUnits++;
      return { id: w.id, sourceHash: S.get(w.id).sourceHash, text: u.status === "blocked" ? null : u.text, status: u.status === "blocked" ? "blocked" : "translated",
        unchangedReason: u.unchangedReason || null, issues: [u.issue, ...warn.filter((x) => x.startsWith(w.id + " "))].filter(Boolean) };
    });
    stats.warnings += warn.length;
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify({ batchId: res.batchId, sourceSetHash: SET, locale: res.locale, units }, null, 1) + "\n");
    stats.accepted++;
  }
}
fs.writeFileSync(inflightPath, JSON.stringify([...inflight]));
console.log(JSON.stringify(stats));
