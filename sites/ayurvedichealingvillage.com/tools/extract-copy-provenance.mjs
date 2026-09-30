/**
 * AHV — lift the copy-change PROVENANCE out of the browser payload.
 *
 * WHAT IT IS. Nine policy routes carry a `copyChanges` array recording, per
 * paragraph, how the rebuild resolved a piece of legacy copy: the live page's
 * cf-encoded mailto, what it decoded to, what was used instead, and why. It is
 * a genuine audit trail and it must survive — one entry records that the LIVE
 * site's encoded address decodes to "infoo@kairali.com", a doubled-o typo, with
 * the resolution "retain the differing source-record fragment as a provenance
 * discrepancy, not an invented address". That is exactly the right call, and
 * deleting the record to quiet a lint would destroy the evidence for it.
 *
 * WHY IT MOVES. It is shipped to every visitor's browser and read by nothing —
 * no render module, no runtime, no app code references `copyChanges`. Evidence
 * Law v2 (CLAUDE.md) already rules where an audit trail lives:
 * launches/<domain>/evidence/. It was simply in the wrong file.
 *
 * So banned-string-lint's last AHV finding is not fixed by hiding a wrong
 * address — the bytes are preserved verbatim at their ruled address, and the
 * served payload stops carrying build-time metadata it never used.
 *
 * Idempotent: a payload with no copyChanges left is a no-op, and re-running
 * merges rather than truncates the evidence file.
 *   node tools/extract-copy-provenance.mjs [--dry]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAYLOAD = join(SITE, "public", "ahv", "assets", "policy-family-data.js");
const EVIDENCE_DIR = join(SITE, "..", "..", "launches", "ayurvedichealingvillage.com", "evidence", "copy-provenance");
const EVIDENCE = join(EVIDENCE_DIR, "policy-family-copy-changes.json");
const DRY = process.argv.includes("--dry");

const raw = readFileSync(PAYLOAD, "utf8");
const eq = raw.indexOf("=");
const prefix = raw.slice(0, eq + 1);                 // "window.AHV_POLICY ="
const body = raw.slice(eq + 1).trim().replace(/;\s*$/, "");
const data = JSON.parse(body);

const lifted = {};
let routesTouched = 0, entries = 0;
for (const r of data.routes ?? []) {
  if (!Array.isArray(r.copyChanges) || r.copyChanges.length === 0) continue;
  const key = r.path ?? r.route ?? `route-${routesTouched}`;
  lifted[key] = r.copyChanges;
  entries += r.copyChanges.length;
  routesTouched++;
  delete r.copyChanges;
}

if (routesTouched === 0) {
  console.log("extract-copy-provenance: no copyChanges in the payload — already lifted (no-op).");
  process.exit(0);
}

// PRECONDITION: nothing but copyChanges may differ. The deletion below must use
// the SAME condition as the lift — an empty `copyChanges: []` is left in place,
// so deleting it unconditionally here would report a false difference (it did,
// on the first run: routes carrying an empty array).
const roundTrip = JSON.parse(body);
for (const r of roundTrip.routes ?? []) {
  if (Array.isArray(r.copyChanges) && r.copyChanges.length > 0) delete r.copyChanges;
}
if (JSON.stringify(roundTrip) !== JSON.stringify(data)) {
  console.error("FAIL — the payload changed in a way other than removing copyChanges.");
  process.exit(1);
}

const merged = existsSync(EVIDENCE) ? JSON.parse(readFileSync(EVIDENCE, "utf8")) : { source: "public/ahv/assets/policy-family-data.js", note: "Lifted verbatim by tools/extract-copy-provenance.mjs. Build-time audit trail, never served.", routes: {} };
merged.routes = { ...merged.routes, ...lifted };

if (!DRY) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  writeFileSync(EVIDENCE, JSON.stringify(merged, null, 2) + "\n");
  writeFileSync(PAYLOAD, `${prefix} ${JSON.stringify(data)};\n`);
}

// POSTCONDITION: every lifted entry is readable back, byte-for-byte.
if (!DRY) {
  const back = JSON.parse(readFileSync(EVIDENCE, "utf8"));
  for (const [k, v] of Object.entries(lifted)) {
    if (JSON.stringify(back.routes[k]) !== JSON.stringify(v)) {
      console.error(`FAIL — provenance for ${k} did not round-trip into the evidence file.`);
      process.exit(1);
    }
  }
  const reparsed = readFileSync(PAYLOAD, "utf8");
  JSON.parse(reparsed.slice(reparsed.indexOf("=") + 1).trim().replace(/;\s*$/, ""));
}

console.log(`extract-copy-provenance${DRY ? " (dry run)" : ""}`);
console.log(`  routes lifted   : ${routesTouched}`);
console.log(`  change entries  : ${entries}`);
console.log(`  evidence file   : launches/ayurvedichealingvillage.com/evidence/copy-provenance/policy-family-copy-changes.json`);
console.log(`  payload bytes   : ${raw.length} -> ${DRY ? "(dry)" : readFileSync(PAYLOAD, "utf8").length}`);
