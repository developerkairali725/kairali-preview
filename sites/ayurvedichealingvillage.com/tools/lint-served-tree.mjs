/**
 * AHV served-tree string lint — the banned-string lint run over what a CLI deploy actually SHIPS
 * but CI never sees (SEO-D22 / D-22, 29 Sep 2026).
 *
 * WHY. CI's `brand-lint` job runs scripts/banned-string-lint.mjs over the checked-out repo. The
 * locale build writes three git-ignored trees that `vercel build` then serves or bakes into pages:
 *   public/ahv/l10n/    per-locale views, datasets and runtime copies (served as static files)
 *   l10n/generated/     per-locale catalogues (read at build time into heads, JSON-LD and pages)
 *   l10n/prerender/     per-locale snapshots (read at build time into the served HTML)
 * They are not in git, so a CI-green lint says nothing about them: on 28 Sep the local lint found
 * about 300 hits there that CI had never scanned. This tool closes that coverage gap. It does NOT
 * change what the lint means: same rules, same control probes, same exceptions, same exit codes —
 * it only points the lint at the served trees. Nothing here adds, removes or narrows an exception
 * (that is the owner's call, QUESTIONS.md Q-AHV-L10N-LINT-SCOPE; CLAUDE.md rule g).
 *
 * WHEN. After `node tools/l10n/build.mjs` (or `npm run build`) and before `vercel deploy`, next to
 * the release gate. A finding here is the same finding CI would raise if the tree were tracked.
 *
 *   node tools/lint-served-tree.mjs [--json] [--out <file>] [--allow-missing]
 *
 * exit 0 clean · 2 violation, broken control probe or a vacuous run · 1 harness error or a missing
 * served tree (build the locales first; --allow-missing skips an absent tree, loudly)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanRoots, runControlProbes } from "../../../scripts/banned-string-lint.mjs";

export const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Git-ignored text trees the deploy serves or bakes in. Kept in step with the site .gitignore by
 *  test/served-tree-lint.test.mjs: every ignored DIRECTORY must be listed here or in NOT_SERVED. */
export const SERVED_UNTRACKED_ROOTS = ["public/ahv/l10n", "l10n/generated", "l10n/prerender"];
/** Ignored directories that are never deployed content, each with the reason. */
export const NOT_SERVED = {
  "l10n/prerender-tmp": "scratch output of tools/prerender-english.mjs --locale; promoted into l10n/prerender before use",
};

export function run(argv = [], { site = SITE } = {}) {
  const json = argv.includes("--json");
  const allowMissing = argv.includes("--allow-missing");
  const outAt = argv.indexOf("--out");
  const out = outAt >= 0 ? argv[outAt + 1] : null;

  const probe = runControlProbes();
  if (!probe.ok) {
    console.error("lint-served-tree: CONTROL PROBE FAILED — the lint did not run.\n  " + probe.broken.join("\n  "));
    return 2;
  }
  const present = [], missing = [];
  for (const r of SERVED_UNTRACKED_ROOTS) (fs.existsSync(path.join(site, r)) ? present : missing).push(r);
  if (missing.length && !allowMissing) {
    console.error(`lint-served-tree: served tree(s) missing: ${missing.join(", ")} — build the locales first (node tools/l10n/build.mjs). A tree that does not exist cannot be called clean.`);
    return 1;
  }
  if (!present.length) { console.error("lint-served-tree: no served tree present — nothing was checked (vacuous run)."); return 2; }

  const { findings, filesScanned } = scanRoots(present.map((r) => path.join(site, r)));
  if (filesScanned === 0) { console.error("lint-served-tree: 0 files scanned — the walk is broken, not the tree clean."); return 2; }
  const errors = findings.filter((f) => f.severity === "error");
  const byRule = {}, byRoot = {};
  for (const f of errors) {
    byRule[f.rule] = (byRule[f.rule] || 0) + 1;
    const root = present.find((r) => f.file.replace(/\\/g, "/").includes(`/${r}/`)) || "?";
    byRoot[root] = (byRoot[root] || 0) + 1;
  }
  const report = {
    tool: "tools/lint-served-tree.mjs", lint: "scripts/banned-string-lint.mjs (unchanged rules and exceptions)",
    status: errors.length ? "FAIL" : "PASS", roots: present, skippedMissing: missing, filesScanned,
    controlProbe: { probes: probe.probes, antiProbes: probe.antiProbes, ok: probe.ok },
    errors: errors.length, byRule, byRoot, findings: errors,
  };
  if (out) fs.writeFileSync(out, JSON.stringify(report, null, 1) + "\n");
  if (json) console.log(JSON.stringify(report, null, 1));
  else {
    console.log(`lint-served-tree — ${filesScanned} files under ${present.join(", ")}${missing.length ? ` (SKIPPED missing: ${missing.join(", ")})` : ""}`);
    console.log(`control probe: ${probe.probes} rules matched · ${probe.antiProbes} negation probes clean`);
    for (const [k, v] of Object.entries(byRule)) console.log(`  ${k}: ${v}`);
    for (const [k, v] of Object.entries(byRoot)) console.log(`  in ${k}: ${v}`);
    for (const f of errors.slice(0, 20)) console.log(`ERROR ${f.file}:${f.line} [${f.rule}] ${f.message}`);
    if (errors.length > 20) console.log(`… ${errors.length - 20} more (use --json or --out)`);
    console.log(errors.length ? `FAIL — ${errors.length} served-tree violation(s). Fix the copy (or obtain the owner's ruling); never the gate.` : "PASS — 0 violations in the served trees.");
  }
  return errors.length ? 2 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.exit(run(process.argv.slice(2))); }
  catch (e) { console.error(`lint-served-tree: harness error — ${e.message}`); process.exit(1); }
}
