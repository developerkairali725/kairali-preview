/**
 * Coordinator checkpoint → STATUS.json in the evidence folder (and l10n/progress.json in the repo).
 *   node tools/l10n/status.mjs --phase <p> --next "<step>" [--concurrency n] [--runs "wf_a,wf_b"] [--failure "..."]
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { rel } from "./sources-lite.mjs";
import { WORK } from "./jobs-const.mjs";
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
const B = JSON.parse(fs.readFileSync(rel("l10n/batches.json"), "utf8"));
const src = JSON.parse(fs.readFileSync(rel("l10n/source/units.json"), "utf8"));
const perLocale = {};
let accepted = 0, blocked = 0;
for (const l of B.locales) {
  const dir = rel(`l10n/output/${l}`);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".json")) : [];
  let units = 0, bl = 0;
  for (const f of files) for (const u of JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")).units) { if (u.status === "blocked") bl++; else units++; }
  perLocale[l] = { batchesAccepted: files.length, batchesTotal: B.batches.length, unitsTranslated: units, unitsBlocked: bl };
  accepted += files.length; blocked += bl;
}
const rejectedDir = path.join(WORK, "rejected");
const rejectedOpen = fs.existsSync(rejectedDir) ? fs.readdirSync(rejectedDir).flatMap((l) => fs.readdirSync(path.join(rejectedDir, l)).map((f) => l + "/" + f.replace(".json", ""))).filter((k) => !fs.existsSync(rel(`l10n/output/${k}.json`))) : [];
const now = new Date(Date.now() + 5.5 * 3600e3).toISOString().replace("T", " ").slice(0, 19) + " IST";
const prev = fs.existsSync(path.join(WORK, "..", "STATUS.json")) ? JSON.parse(fs.readFileSync(path.join(WORK, "..", "STATUS.json"), "utf8")) : {};
const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: rel(".") }).toString().trim();
const status = {
  ...prev,
  phase: arg("phase", prev.phase),
  model: "claude-opus-5-5",
  effort: { coordinator: "high", routineTranslationJobs: "medium", clinicalAmbiguityQA: "high" },
  sourceCommit: "12c539a887857c34ade1b50593f6a4f41fb56d0d",
  workingHead: head,
  sourceFreeze: { sourceSetHash: src.sourceSetHash, units: src.count, batches: B.batches.length, jobsTotal: B.batches.length * B.locales.length, pdfPrefilledUnitsPerLocale: B.prefilled },
  workers: { ...(prev.workers || {}), concurrency: Number(arg("concurrency", prev.workers?.concurrency ?? 3)), activeRuns: (arg("runs", "") || "").split(",").filter(Boolean) },
  counts: { jobsAccepted: accepted, jobsRemaining: B.batches.length * B.locales.length - accepted, unitsBlocked: blocked, rejectedAwaitingRetry: rejectedOpen.length, perLocale },
  failures: [...(prev.failures || []), ...(arg("failure", "") ? [{ at: now, note: arg("failure", "") }] : [])],
  nextStep: arg("next", prev.nextStep),
  productionAction: "NONE — worker restricted to candidate/preview; release checkpoint to parent before any production/DNS",
  updatedAt: now,
};
fs.writeFileSync(path.join(WORK, "..", "STATUS.json"), JSON.stringify(status, null, 2) + "\n");
fs.writeFileSync(rel("l10n/progress.json"), JSON.stringify({ sourceSetHash: src.sourceSetHash, updatedAt: now, counts: status.counts }, null, 1) + "\n");
console.log(JSON.stringify({ accepted, remaining: status.counts.jobsRemaining, rejectedOpen: rejectedOpen.length }));
