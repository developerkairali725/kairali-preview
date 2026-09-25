/**
 * Freeze source IDs into batches (≤25 comparable units, ≤3,200 chars) in
 * first-occurrence order (chrome → views → datasets), identical for every
 * locale. Units whose whole English text is an owner-approved PDF string are
 * prefilled from the PDF family (l10n/prefill/<locale>.json) and not re-sent.
 *   node tools/l10n/batches.mjs            → l10n/batches.json, l10n/prefill/*, l10n/FROZEN.json
 */
import fs from "node:fs";
import { rel, sha256 } from "./sources-lite.mjs";
const LOCALES = ["hi", "de", "fr", "es", "it", "pt", "nl", "ru", "ar", "zh-Hans", "ja", "ko"];
const src = JSON.parse(fs.readFileSync(rel("l10n/source/units.json"), "utf8"));
const g = JSON.parse(fs.readFileSync(rel("l10n/glossary.json"), "utf8"));
const approved = { ...g.approvedSentences, ...g.terms };
const prefill = Object.fromEntries(LOCALES.map((l) => [l, {}]));
const queue = [];
for (const u of src.units) {
  const pdf = approved[u.source];
  if (pdf && LOCALES.every((l) => pdf[l])) { for (const l of LOCALES) prefill[l][u.id] = { text: pdf[l], origin: "pdf-20260925-R1" }; continue; }
  queue.push(u);
}
// keep previously frozen batch membership for unchanged units (never reshuffle accepted work)
const prev = fs.existsSync(rel("l10n/batches.json")) ? JSON.parse(fs.readFileSync(rel("l10n/batches.json"), "utf8")) : null;
const known = new Set(prev ? prev.batches.flatMap((b) => b.ids) : []);
const live = new Set(queue.map((u) => u.id));
const batches = prev ? prev.batches.map((b) => ({ ...b, ids: b.ids.filter((id) => live.has(id)) })).filter((b) => b.ids.length) : [];
let n = prev ? Math.max(0, ...prev.batches.map((b) => +b.id.slice(2))) : 0;
let cur = null, chars = 0;
for (const u of queue) {
  if (known.has(u.id)) continue;
  if (!cur || cur.ids.length >= 25 || chars + u.source.length > 3200) { cur = { id: "b-" + String(++n).padStart(4, "0"), ids: [] }; batches.push(cur); chars = 0; }
  cur.ids.push(u.id); chars += u.source.length;
}
fs.mkdirSync(rel("l10n/prefill"), { recursive: true });
for (const l of LOCALES) fs.writeFileSync(rel(`l10n/prefill/${l}.json`), JSON.stringify(prefill[l], null, 1) + "\n");
const out = { sourceSetHash: src.sourceSetHash, locales: LOCALES, batchCount: batches.length, unitCount: queue.length, prefilled: src.units.length - queue.length, batches };
fs.writeFileSync(rel("l10n/batches.json"), JSON.stringify(out, null, 1) + "\n");
const frozen = { frozenAt: new Date().toISOString(), sourceSetHash: src.sourceSetHash, units: src.units.length, glossarySha256: sha256(fs.readFileSync(rel("l10n/glossary.json"), "utf8")), batchesSha256: sha256(fs.readFileSync(rel("l10n/batches.json"), "utf8")) };
fs.writeFileSync(rel("l10n/FROZEN.json"), JSON.stringify(frozen, null, 1) + "\n");
console.log({ batches: batches.length, queued: queue.length, prefilled: out.prefilled });
