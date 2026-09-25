/**
 * Localization RELEASE gate (distinct from interim progress metrics). PASS only if:
 *  1. every accepted batch re-validates against the current frozen source (revalidate --dry: 0 withdrawn);
 *  2. every eligible unit has an accepted translation in every locale: 0 missing, 0 blocked,
 *     0 null, 0 stale bindings (build --strict);
 *  3. every locale route has a locale SSR snapshot (l10n/prerender/<locale>/*.html.gz) whose
 *     hash matches the committed manifest;
 * SEO/server checks (qa-seo --release, reciprocity) and browser QA are run against the
 * built/hosted candidate separately and must also PASS.
 *   node tools/l10n/release-gate.mjs
 */
import fs from "node:fs";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { rel } from "./sources-lite.mjs";
const fail = [];
const run = (args) => { try { return execFileSync(process.execPath, args, { cwd: rel("."), encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); } catch (e) { return (e.stdout || "") + (e.stderr || "") + "\nEXIT " + e.status; } };
const rv = JSON.parse(run(["tools/l10n/revalidate.mjs", "--dry"]));
if (rv.withdrawn) fail.push(`revalidate: ${rv.withdrawn} accepted batch(es) fail current validation`);
const S = JSON.parse(fs.readFileSync(rel("l10n/source/units.json"), "utf8")).units;
const LOCS = JSON.parse(fs.readFileSync(rel("l10n/batches.json"), "utf8")).locales;
const per = {};
for (const loc of LOCS) {
  const have = new Map();
  const pre = rel(`l10n/prefill/${loc}.json`);
  if (fs.existsSync(pre)) for (const id of Object.keys(JSON.parse(fs.readFileSync(pre, "utf8")))) have.set(id, "translated");
  const dir = rel(`l10n/output/${loc}`);
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) for (const u of JSON.parse(fs.readFileSync(`${dir}/${f}`, "utf8")).units) {
    const src = S.find((x) => x.id === u.id);
    have.set(u.id, !src ? "orphan" : src.sourceHash !== u.sourceHash ? "stale" : u.status === "translated" && typeof u.text === "string" && u.text.trim() ? "translated" : "blocked");
  }
  const c = { translated: 0, missing: 0, blocked: 0, stale: 0 };
  for (const u of S) { const st = have.get(u.id) || "missing"; c[st] = (c[st] || 0) + 1; }
  per[loc] = c;
  if (c.missing || c.blocked || c.stale) fail.push(`${loc}: missing ${c.missing}, blocked ${c.blocked}, stale ${c.stale}`);
}
const routes = JSON.parse(fs.readFileSync(rel("l10n/routes.json"), "utf8")).routes;
const LOCINFO = JSON.parse(fs.readFileSync(rel("l10n/locales.json"), "utf8"));
const man = fs.existsSync(rel("l10n/prerender-manifest.json")) ? JSON.parse(fs.readFileSync(rel("l10n/prerender-manifest.json"), "utf8")).locales : {};
for (const loc of LOCS) {
  let missing = 0, mismatch = 0;
  for (const en of Object.keys(routes)) {
    const name = (en.replace(/^\/+|\/+$/g, "") || "index").replace(/[^a-z0-9._-]+/gi, "_") + ".html.gz";
    const f = rel(`l10n/prerender/${loc}/${name}`);
    if (!fs.existsSync(f)) { missing++; continue; }
    const h = crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
    if (man[loc]?.files?.[name] !== h) mismatch++;
  }
  if (missing || mismatch) fail.push(`${loc} (${LOCINFO[loc].prefix}): ${missing} SSR snapshot(s) missing, ${mismatch} not matching manifest`);
}
const report = { at: new Date().toISOString(), verdict: fail.length ? "FAIL" : "PASS", perLocale: per, revalidate: rv, failures: fail };
fs.writeFileSync(rel("l10n/release-gate.json"), JSON.stringify(report, null, 1) + "\n");
console.log(report.verdict, fail.slice(0, 14).join("\n"));
process.exitCode = fail.length ? 1 : 0;
