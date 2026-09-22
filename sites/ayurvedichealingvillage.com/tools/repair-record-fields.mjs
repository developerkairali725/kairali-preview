#!/usr/bin/env node
/**
 * AHV — small, sourced field corrections to dataset records.
 *
 * english-candidate/record-field-overrides.json lists, per route, the field
 * and the value to set, with its SOURCE (every value must come from the
 * record's own metadata/breadcrumb or an owner ruling — never invented).
 * The route's record is located in the dataset the manifest names; the
 * first occurrence of the field inside that record is rewritten. Idempotent.
 *
 *   node tools/repair-record-fields.mjs [--dry]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const OVR = JSON.parse(readFileSync(join(SITE, "english-candidate/record-field-overrides.json"), "utf8")).routes;
const MANIFEST = JSON.parse(readFileSync(join(SITE, "english-candidate/route-manifest.json"), "utf8")).routes;
let done = 0; const problems = [];
for (const [route, fields] of Object.entries(OVR)) {
  const row = MANIFEST.find((r) => r.path === route);
  if (!row || !row.dataset) { problems.push(`${route}: no dataset`); continue; }
  const file = join(SITE, "public/ahv", row.dataset);
  let s = readFileSync(file, "utf8");
  const rec = s.indexOf(`"path":"${route}"`);
  if (rec < 0) { problems.push(`${route}: record not found in ${row.dataset}`); continue; }
  const nr = /"path":"\/[^"]*","slug":/g; nr.lastIndex = rec + 1; const nm = nr.exec(s); const end = nm ? nm.index : s.length;
  for (const [field, spec] of Object.entries(fields)) {
    if (field.startsWith("_")) continue;
    const value = typeof spec === "string" ? spec : spec.value;
    const re = new RegExp(`"${field}":"((?:[^"\\\\]|\\\\.)*)"`);
    const window = s.slice(rec, end);
    const m = window.match(re);
    if (!m) { problems.push(`${route}: field ${field} not in the record`); continue; }
    if (m[1] === value) { console.log(`as-is  ${route} ${field}`); continue; }
    const patched = window.replace(re, `"${field}":${JSON.stringify(value)}`);
    s = s.slice(0, rec) + patched + s.slice(end);
    done += 1;
    console.log(`${DRY ? "[dry] " : "fixed  "}${route} ${field}: "${m[1].slice(0, 40)}" → "${value.slice(0, 60)}"`);
  }
  if (!DRY) writeFileSync(file, s);
}
console.log(`\nrepair-record-fields${DRY ? " (dry)" : ""}: ${done} field(s) set`);
if (problems.length) { console.error("PROBLEMS:\n  " + problems.join("\n  ")); process.exit(1); }
