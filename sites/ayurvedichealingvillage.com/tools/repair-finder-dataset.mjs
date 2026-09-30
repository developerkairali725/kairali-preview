/**
 * AHV programme finder — add the five training courses, move the training
 * hub, and widen categories, from english-candidate/finder-additions.json.
 *
 * WHY. The approved finder dataset (public/ahv/assets/all-programs-data.js)
 * carries ONE training entry, so every finder page showed the five residential
 * courses as a single card (owner, D-20260916-10: "we have 5 training programs
 * but it all got combined into one"). The import rewrites public/ahv wholesale,
 * so this is a re-runnable repair, not a hand edit: idempotent by route.
 *
 * Facts come only from the additions file, which cites the tariff sheet per
 * row. Prices are the sheet's per-night villa rate with that basis stated -
 * the sheet quotes no course fee and none is computed here (HARD GATE 6).
 *
 * Usage: node tools/repair-finder-dataset.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(SITE, "public/ahv/assets/all-programs-data.js");
const ADD = path.join(SITE, "english-candidate/finder-additions.json");
const DRY = process.argv.includes("--dry");
const TOKEN = "window.AHV_FINDER = ";

const src = fs.readFileSync(DATA, "utf8");
const at = src.indexOf(TOKEN);
if (at < 0) throw new Error("dataset token not found: " + TOKEN);
const start = at + TOKEN.length;
const end = src.lastIndexOf("}") + 1;
const head = src.slice(0, start);
let data;
try {
  data = JSON.parse(src.slice(start, end));
} catch (e) {
  throw new Error("dataset object is not JSON-parseable; refusing to edit by regex: " + e.message);
}
const add = JSON.parse(fs.readFileSync(ADD, "utf8"));
const byRoute = (r) => data.programmes.find((p) => p.route === r);
const log = [];

for (const mv of add.routeMoves || []) {
  const row = byRoute(mv.from);
  if (row) { row.route = mv.to; log.push(`moved ${mv.from} -> ${mv.to}`); }
  else if (byRoute(mv.to)) log.push(`already moved: ${mv.to}`);
  else throw new Error("route move source missing: " + mv.from);
}
for (const up of add.updates || []) {
  const row = byRoute(up.route);
  if (!row) throw new Error("update target missing: " + up.route);
  for (const [k, v] of Object.entries(up)) if (k !== "route") row[k] = v;
  log.push(`updated ${up.route}`);
}
const basis = add.priceBasis;
let added = 0, replaced = 0;
for (const c of add.programmes) {
  const row = {
    route: c.route,
    name: c.name,
    sanskrit: null,
    categories: ["Training"],
    minimumNights: c.minimumNights,
    from: basis.from,
    validFrom: basis.validFrom,
    validTo: basis.validTo,
    sourceRef: `${basis.sourceRef}; course ${c.code}, ${c.durationDisplay}`,
    cardSummary: c.cardSummary,
    durationDisplay: c.durationDisplay,
    priceBasisNote: basis.priceBasisNote,
    aliases: c.aliases,
  };
  const i = data.programmes.findIndex((p) => p.route === c.route);
  if (i >= 0) { data.programmes[i] = row; replaced++; } else { data.programmes.push(row); added++; }
}
for (const [cat, routes] of Object.entries(add.categoryAdditions || {})) {
  for (const r of routes) {
    const row = byRoute(r);
    if (!row) throw new Error(`category target missing: ${r}`);
    if (!row.categories.includes(cat)) { row.categories.push(cat); log.push(`${r} += ${cat}`); }
  }
}
const counts = { unique: data.programmes.length };
for (const p of data.programmes) for (const c of p.categories) counts[c] = (counts[c] || 0) + 1;
data.counts = counts;

const out = head + JSON.stringify(data, null, 2) + ";\n";
if (!DRY) fs.writeFileSync(DATA, out);
console.log(`${DRY ? "[dry] " : ""}finder dataset: +${added} added, ${replaced} replaced; counts ${JSON.stringify(counts)}`);
for (const l of log) console.log("  " + l);
