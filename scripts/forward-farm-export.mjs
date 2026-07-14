#!/usr/bin/env node
/**
 * Emit the Cloudflare Bulk Redirects upload CSV from the master
 * docs/redirects/forward-farm.csv (D1 rule 5: CSV maintained in-repo,
 * reviewed before upload; upload itself is a HUMAN action).
 *
 * Only rows with a target_now are exported — HOLD rows (empty target_now)
 * never reach Cloudflare (D1 rule 8 timing guard). Format per Cloudflare's
 * bulk-redirect import: 301, preserve query string, include subdomains,
 * subpath matching ON + preserve path suffix OFF → variant.tld/anything
 * lands on the target homepage in one hop (D1 rule 4).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const master = resolve(root, "docs/redirects/forward-farm.csv");
const out = resolve(root, "docs/redirects/cloudflare-upload.csv");

// simple CSV parse — the master file quotes nothing and contains no commas in fields
const [header, ...rows] = readFileSync(master, "utf8").trim().split("\n");
const cols = header.split(",");
const idx = (name) => {
  const i = cols.indexOf(name);
  if (i === -1) throw new Error(`forward-farm.csv: missing column "${name}"`);
  return i;
};
const iSource = idx("source_domain");
const iTarget = idx("target_now");
const iGate = idx("gate");

const exported = [];
const held = [];
for (const row of rows) {
  const f = row.split(",");
  const source = f[iSource]?.trim();
  const target = f[iTarget]?.trim();
  if (!source) continue;
  if (!target) {
    held.push(`${source} (gate: ${f[iGate] ?? "?"})`);
    continue;
  }
  if (!/^https:\/\//.test(target)) {
    throw new Error(`${source}: target_now "${target}" must be a full https URL (D1 rule 3: canonical form)`);
  }
  exported.push([`https://${source}/`, target, "301", "true", "true", "true", "false"].join(","));
}

const cfHeader = "Source URL,Target URL,Status,Preserve query string,Include subdomains,Subpath matching,Preserve path suffix";
writeFileSync(out, [cfHeader, ...exported].join("\n") + "\n");

console.log(`cloudflare-upload.csv: ${exported.length} rule(s) written to ${out}`);
if (held.length) {
  console.log(`HELD (not exported — timing/decision gates):`);
  for (const h of held) console.log(`  - ${h}`);
}
console.log("\nUpload is a HUMAN action (Abilash/Ambuj): Cloudflare dashboard → Bulk Redirects.");
