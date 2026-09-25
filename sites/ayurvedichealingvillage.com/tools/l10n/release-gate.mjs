/**
 * Localization RELEASE gate (distinct from interim progress metrics). PASS only if:
 *  1. every accepted batch re-validates against the current frozen source (revalidate --dry: 0 withdrawn);
 *  2. every eligible unit has an accepted translation in every locale: 0 missing, 0 blocked,
 *     0 null, 0 stale bindings (build --strict);
 *  2b. PDF-prefilled units pass the same validator against the current source;
 *  2c. build --strict exits cleanly (every unit applied in every locale);
 *  3. every locale route has a locale SSR snapshot (l10n/prerender/<locale>/*.html.gz) whose
 *     hash matches the committed manifest, AND the manifest records the catalogue and
 *     source-set hashes current now (snapshots rendered from the final catalogue);
 * SEO/server checks (qa-seo --release, reciprocity) and browser QA are run against the
 * built/hosted candidate separately and must also PASS.
 *   node tools/l10n/release-gate.mjs
 */
import fs from "node:fs";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { rel, sha256 } from "./sources-lite.mjs";
import { validate } from "./validate.mjs";
const fail = [];
const run = (args) => { try { return execFileSync(process.execPath, args, { cwd: rel("."), encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); } catch (e) { return (e.stdout || "") + (e.stderr || "") + "\nEXIT " + e.status; } };
const rv = JSON.parse(run(["tools/l10n/revalidate.mjs", "--dry"]));
if (rv.withdrawn) fail.push(`revalidate: ${rv.withdrawn} accepted batch(es) fail current validation`);
const SRC = JSON.parse(fs.readFileSync(rel("l10n/source/units.json"), "utf8"));
const S = SRC.units;
const SRCSET = SRC.sourceSetHash;
const LOCS = JSON.parse(fs.readFileSync(rel("l10n/batches.json"), "utf8")).locales;
const per = {};
for (const loc of LOCS) {
  const have = new Map();
  const pre = rel(`l10n/prefill/${loc}.json`);
  if (fs.existsSync(pre)) {
    const P = JSON.parse(fs.readFileSync(pre, "utf8"));
    const ids = Object.keys(P).filter((id) => S.some((x) => x.id === id));
    const r = validate({ units: ids.map((id) => ({ id, text: P[id].text, status: "translated", unchangedReason: "approved PDF string", issue: null })) }, { locale: loc, units: ids.map((id) => { const u = S.find((x) => x.id === id); return { id, src: u.source, roles: u.roles }; }) }, new Map(S.map((u) => [u.id, u])));
    const badIds = new Set(r.errs.map((e) => e.split(" ")[0]));
    for (const id of ids) have.set(id, badIds.has(id) ? "blocked" : "translated");
    if (r.errs.length) fail.push(`${loc}: ${r.errs.length} PDF-prefilled unit(s) fail validation: ${r.errs.slice(0, 3).join("; ")}`);
  }
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
const strict = run(["tools/l10n/build.mjs", "--strict"]);
if (/EXIT \d|STRICT:/.test(strict)) fail.push("build --strict: untranslated units remain (" + (strict.match(/missingUnits=\d+/g) || []).slice(0, 12).join(" ") + ")");
// A unit blocked for clinical/legal reasons in ANY locale is held in EVERY locale
// until ruled (other locales may have translated the same unapproved claim).
const held = new Set();
for (const loc of LOCS) { const d = rel(`l10n/output/${loc}`); if (fs.existsSync(d)) for (const f of fs.readdirSync(d)) for (const u of JSON.parse(fs.readFileSync(`${d}/${f}`, "utf8")).units) if (u.status === "blocked") held.add(u.id); }
if (held.size) fail.push(`${held.size} source unit(s) clinically held in all locales pending owner/Dr. Deepu John ruling: ${[...held].join(", ")}`);
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
  const catFile = rel(`l10n/generated/${loc}.catalog.json`);
  const catHash = fs.existsSync(catFile) ? sha256(fs.readFileSync(catFile, "utf8")) : null;
  if (!man[loc] || man[loc].catalogSha256 !== catHash || man[loc].sourceSetHash !== SRCSET) fail.push(`${loc}: SSR snapshots were not rendered from the current catalogue/source (manifest ${man[loc]?.catalogSha256?.slice(0, 12)} vs ${catHash?.slice(0, 12)})`);
}
const report = { at: new Date().toISOString(), verdict: fail.length ? "FAIL" : "PASS", perLocale: per, revalidate: rv, failures: fail };
fs.writeFileSync(rel("l10n/release-gate.json"), JSON.stringify(report, null, 1) + "\n");
console.log(report.verdict, fail.slice(0, 14).join("\n"));
process.exitCode = fail.length ? 1 : 0;
