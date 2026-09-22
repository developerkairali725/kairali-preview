#!/usr/bin/env node
/**
 * AHV site search — acceptance runner (no browser). Loads the shipped engine
 * (public/design/search.js) and the built index (public/ahv/search-index.json)
 * exactly as the browser would, runs the §2.2 site set (176 rows) and the §5.5
 * FAQ set (61 rows) from english-candidate/search-queries.json, and prints
 * top-1 vs expected for every row. Target ≥ 90% top-1 per set; every miss is
 * listed. Exit 1 below target.
 *
 *   node tests/search-acceptance.mjs [--verbose] [--build]   (--build regenerates the index first)
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VERBOSE = process.argv.includes("--verbose");
if (process.argv.includes("--build")) execFileSync(process.execPath, [path.join(SITE, "tools/build-search-index.mjs")], { stdio: "inherit" });

const ctx = { console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(SITE, "public/design/search.js"), "utf8"), ctx, { filename: "search.js" });
const AHVSearch = ctx.AHVSearch;
if (!AHVSearch || !AHVSearch.createEngine) throw new Error("search.js did not expose AHVSearch.createEngine");
const index = JSON.parse(fs.readFileSync(path.join(SITE, "public/ahv/search-index.json"), "utf8"));
const engine = AHVSearch.createEngine(index);
const SETS = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/search-queries.json"), "utf8"));

function top1Of(res) {
  const first = res.order[0];
  if (!first) return null;
  const r = res[first][0];
  return first === "questions" ? r.id : r.route;
}
function nightsOk(res, n) {
  const first = res.order[0];
  if (first !== "programmes") return false;
  return res.programmes[0].data.nights === n;
}
function run(name, rows, scope) {
  let pass = 0; const misses = [];
  for (const row of rows) {
    const res = engine.query(row.q, { scope });
    const got = top1Of(res);
    let ok = true; const why = [];
    if ("top1" in row) {
      const exp = row.top1;
      if (exp === null) { if (res.total !== 0) { ok = false; why.push(`expected zero results, got ${got} (${res.total})`); } }
      else if (typeof exp === "object" && exp.nights) { if (!nightsOk(res, exp.nights)) { ok = false; why.push(`expected a ${exp.nights}-night programme, got ${got} (${res.programmes[0] ? res.programmes[0].data.nights : "-"} nights)`); } }
      else if (Array.isArray(exp)) { if (!exp.includes(got)) { ok = false; why.push(`expected one of ${exp.join(" | ")}, got ${got}`); } }
      else if (got !== exp) { ok = false; why.push(`expected ${exp}, got ${got}`); }
    }
    if (row.cls && res.cls !== row.cls) { ok = false; why.push(`class ${row.cls} expected, got ${res.cls}`); }
    if (row.notCls && res.cls === row.notCls) { ok = false; why.push(`class must not be ${row.notCls}`); }
    if (ok) pass++; else misses.push({ row, got, why, res });
    if (VERBOSE) console.log(`${ok ? "ok  " : "MISS"} #${String(row.n).padStart(3)} ${row.q.padEnd(34)} → ${String(got).padEnd(60)} ${res.cls}${res.corrected ? ` (corrected: ${res.corrected})` : ""}`);
  }
  const pct = Math.round((pass / rows.length) * 1000) / 10;
  console.log(`\n${name}: ${pass}/${rows.length} top-1 = ${pct}% ${pct >= 90 ? "PASS" : "FAIL (target ≥ 90%)"}`);
  for (const m of misses) console.log(`  MISS #${m.row.n} "${m.row.q}": ${m.why.join("; ")} [cls ${m.res.cls}${m.res.corrected ? `, corrected → ${m.res.corrected}` : ""}]`);
  return pct;
}
console.log(`engine ${AHVSearch.version} · index ${index.version} (${index.programmes.length} programmes, ${index.faqs.length} FAQ, ${index.pages.length} pages)`);
const a = run("SITE set (§2.2)", SETS.site, "site");
const b = run("FAQ set (§5.5)", SETS.faq, "faq");
process.exit(a >= 90 && b >= 90 ? 0 : 1);
