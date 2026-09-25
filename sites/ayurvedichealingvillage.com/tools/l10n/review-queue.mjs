/**
 * Human review queue from accepted outputs: every BLOCKED unit (worker refused
 * to translate without a clinical/legal decision) and every banned-register
 * warning, grouped by source unit across locales. Blocked units fail the
 * release gate until resolved (English rewrite approved or explicit ruling).
 *   node tools/l10n/review-queue.mjs → <evidence>/CLINICAL-REVIEW-QUEUE.json
 */
import fs from "node:fs";
import path from "node:path";
import { rel } from "./sources-lite.mjs";
import { WORK } from "./jobs-const.mjs";
const S = new Map(JSON.parse(fs.readFileSync(rel("l10n/source/units.json"), "utf8")).units.map((u) => [u.id, u]));
const q = new Map();
for (const loc of fs.readdirSync(rel("l10n/output"))) for (const f of fs.readdirSync(rel(`l10n/output/${loc}`))) {
  for (const u of JSON.parse(fs.readFileSync(rel(`l10n/output/${loc}/${f}`), "utf8")).units) {
    const warn = (u.issues || []).filter((i) => /banned-term/.test(i));
    if (u.status !== "blocked" && !warn.length) continue;
    const e = q.get(u.id) || { id: u.id, source: S.get(u.id)?.source, files: S.get(u.id)?.files, blocked: {}, bannedTermWarnings: {} };
    if (u.status === "blocked") e.blocked[loc] = (u.issues || [])[0] || "";
    if (warn.length) e.bannedTermWarnings[loc] = { text: u.text, warnings: warn };
    q.set(u.id, e);
  }
}
const items = [...q.values()].sort((a, b) => Object.keys(b.blocked).length - Object.keys(a.blocked).length);
const out = { generated: new Date().toISOString(), note: "Blocked units fail the release gate. Owner/Dr. Deepu John decision needed: approve an English rewrite (then re-extract; only changed units retranslate) or rule on faithful translation. Banned-term warnings are for review (proper names/award titles are allowed).", blockedUnits: items.filter((i) => Object.keys(i.blocked).length).length, warningUnits: items.filter((i) => Object.keys(i.bannedTermWarnings).length).length, items };
fs.writeFileSync(path.join(WORK, "..", "CLINICAL-REVIEW-QUEUE.json"), JSON.stringify(out, null, 1));
console.log({ blockedUnits: out.blockedUnits, warningUnits: out.warningUnits });
