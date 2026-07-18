#!/usr/bin/env node
/**
 * gate-emit.mjs — VERDICT EMITTERS, tranche 1. The missing half of the
 * pre-launch-matrix-walk gate (gates/registry.yaml `pre-launch-matrix-walk`,
 * status: partial — "verdict emitters for most gates are still being built").
 *
 * WHAT THIS IS. `scripts/matrix-walk.mjs` re-walks every stage gate S0→S9 and
 * believes NOTHING but §0.2 verdicts (scripts/lib/verdict.mjs). Today almost no
 * gate emits one, so the walk honestly prints DO-NOT-SHIP with ~50 unproven
 * gates on every site — the pilot (docs/reports/2026-07-18-prompt4-single-pager-
 * pilot.md, gate 17) recorded exactly that. This file makes gates PROVABLE by
 * giving their EXISTING enforcing commands a way to write the verdict their own
 * execution produced. It never makes a gate pass.
 *
 * THE THREE RULES OF AN EMITTER — each one refused in code below, not in prose:
 *   1. AN EMITTER RUNS THE REAL ENFORCING COMMAND AND DERIVES THE VERDICT FROM
 *      ITS REAL EXIT CODE, IN THE SAME PROCESS TREE, AT RUN TIME. An emitter
 *      that hardcodes PASS, or reads a report and transcribes it, is a .md file
 *      in a different costume — the exact forgery §0.2 exists to reject.
 *   2. AN EMITTER THAT IS NOT ARMED WRITES NOTHING. If the gate's input
 *      artifact does not exist, or the gate's mechanism does not cover this
 *      site (content-lint's registry-flagged one-site scope), the honest state
 *      is ABSENCE — the walk's "NO VERDICT" branch — never a synthesized PASS
 *      and never a synthesized FAIL claiming a command ran that didn't.
 *   3. AN EMITTER ONLY SPEAKS FOR GATES ITS COMMAND ENFORCES. The spec table
 *      below is the closed list; asking it to emit for any other gate throws.
 *
 * WHAT AN EMITTED VERDICT IS — AND IS NOT. emitVerdict() records the runner:
 * a local run yields runner:"local", which matrix-walk correctly rejects as
 * "iteration evidence, not ship evidence" (§0.2), and any verdict committed by
 * a human or agent fails provenance. A gate flips to PROVEN only when a CI job
 * runs the emitter and commits the verdict. That CI wiring is DELIBERATELY NOT
 * in this file's tranche: per the O6 precedent (generator shipped un-wired;
 * wiring is a separate ratified change), making these emitters required in CI
 * is a ratifiable change for Abilash, not a default this file takes.
 *
 * ARTIFACT BINDING, stated honestly. G3-PRE binds the artifact it judges
 * (docs/keywords/<dir>/demand.json — §0.2's own example). The build/lint gates
 * judge a SOURCE TREE, which cannot be sha256'd as one file, so the emitter
 * writes a deterministic source MANIFEST (sorted path→sha256 + tree hash) and
 * binds that. Re-running the emitter after any source change rewrites the
 * manifest, which voids the old verdict (§S9(d)2) — the right semantic. LIMIT:
 * a source edit with NO re-run leaves the committed manifest bytes unchanged,
 * so hash-binding alone does not catch it; the void chain / monotonic rule is
 * the partial net, and a manifest-vs-source drift check in the walk is a
 * tranche-2 STRENGTHENING (an addition, never a weakening — rule g).
 *
 * USAGE
 *   node scripts/gate-emit.mjs --site <domain> --gate <G6-BUILD|G6-LINT|G3-PRE>
 *   node scripts/gate-emit.mjs --list
 *
 * EXIT CODES (house rule): 0 = emitted PASS, or NOT ARMED (loud, nothing
 * written — same convention as CI's S3 "not armed" step) · 2 = emitted FAIL
 * (the real command failed; the verdict records it) · 1 = harness error.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { emitVerdict, istIso, sha256 } from "./lib/verdict.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_REPO_ROOT = resolve(HERE, "..");

/* ==========================================================================
 * SOURCE MANIFEST — how a verdict binds a tree instead of a file
 * ========================================================================== */

/** Directories that are build products or vendored code, never judged source. */
const MANIFEST_EXCLUDE = new Set(["node_modules", ".next", ".turbo", ".git", "dist", ".vercel"]);

/**
 * Deterministic manifest of a directory: sorted repo-relative paths + per-file
 * sha256 + one tree hash over the sorted pairs. Deterministic on purpose —
 * re-running over unchanged source must produce byte-identical output, so the
 * ONLY thing that changes the manifest (and thereby voids the old verdict) is
 * a real change to the judged source.
 *
 * @param {string} repoRoot absolute
 * @param {string} relDir   repo-relative directory to manifest
 * @returns {{files: {path:string, sha256:string}[], tree_sha256: string}}
 */
export function buildSourceManifest(repoRoot, relDir) {
  const rootAbs = resolve(repoRoot, relDir);
  if (!existsSync(rootAbs)) throw new Error(`buildSourceManifest: ${relDir} does not exist`);
  /** @type {{path:string, sha256:string}[]} */
  const files = [];
  const scan = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (MANIFEST_EXCLUDE.has(e.name)) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) scan(p);
      else if (e.isFile()) files.push({ path: relative(repoRoot, p), sha256: sha256(readFileSync(p)) });
    }
  };
  scan(rootAbs);
  files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  const tree_sha256 = sha256(files.map((f) => `${f.path}\n${f.sha256}`).join("\n"));
  return { files, tree_sha256 };
}

/** Write the manifest JSON (stable shape, trailing newline) and return its repo-relative path. */
export function writeSourceManifest(repoRoot, relDir, outRel) {
  const m = buildSourceManifest(repoRoot, relDir);
  const abs = resolve(repoRoot, outRel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, JSON.stringify({ judged_dir: relDir, file_count: m.files.length, tree_sha256: m.tree_sha256, files: m.files }, null, 2) + "\n");
  return outRel;
}

/* ==========================================================================
 * THE SPEC TABLE — the closed list of gates tranche 1 can emit for
 *
 * Ordered by gates/registry.yaml severity (highest first): all three are
 * severity `blocker` rows (build-clean · honest-ymyl-content-lint ·
 * s3-keyword-gates). The `high`-severity cross-model chain (G*-PROC / G*-FACT
 * → registry `cross-model-audit`) is wired inside the auditors themselves —
 * see scripts/lib/audit-verdict.mjs — because only the audit run may emit it.
 * ========================================================================== */

/**
 * @typedef {object} EmitterSpec
 * @property {string} gate         matrix-walk gate id (must exist in its REGISTRY)
 * @property {string} registryId   gates/registry.yaml row this maps to
 * @property {"blocker"|"high"|"advisory"} severity  that row's severity (informational — the registry stays the truth)
 * @property {string} what
 * @property {(ctx: {site:string, repoRoot:string}) => {armed:boolean, reason:string, filter?:string, dir?:string}} preflight
 * @property {(ctx: {site:string, repoRoot:string, pre:any}) => string} artifact  returns repo-relative artifact path (may write a manifest)
 * @property {(ctx: {site:string, repoRoot:string, pre:any}) => string[][]} commands  real argv arrays, run in order
 * @property {string} command      the enforcing-command line recorded in the verdict
 */

/** @type {EmitterSpec[]} */
export const EMITTERS = [
  {
    // registry `build-clean` (severity: blocker). The walk's G6-BUILD: "pnpm
    // build (resolveReview() throws) — no fabricated physician review can be
    // represented. ⭐ the one gate that is LIVE." The emitter runs the real
    // production build for the site; the verdict is its real exit code.
    gate: "G6-BUILD",
    registryId: "build-clean",
    severity: "blocker",
    what: "pnpm build clean for the site — resolveReview() throws on any fabricated review (failure #5)",
    command: "pnpm exec turbo build --filter=<site>",
    preflight({ site, repoRoot }) {
      const pkg = join(repoRoot, "sites", site, "package.json");
      if (!existsSync(pkg)) return { armed: false, reason: `no sites/${site}/package.json — there is no build to run for this site` };
      let name;
      try { name = JSON.parse(readFileSync(pkg, "utf8")).name; } catch (e) { return { armed: false, reason: `sites/${site}/package.json unreadable: ${e.message}` }; }
      if (!name) return { armed: false, reason: `sites/${site}/package.json has no "name" — turbo cannot filter to it` };
      return { armed: true, reason: "", filter: name };
    },
    artifact({ site, repoRoot }) {
      return writeSourceManifest(repoRoot, join("sites", site), join("audits", site, "G6-BUILD-source-manifest.json"));
    },
    commands({ pre }) {
      return [["pnpm", "exec", "turbo", "build", `--filter=${pre.filter}`]];
    },
  },
  {
    // registry `honest-ymyl-content-lint` (severity: blocker; status: partial —
    // "scoped to sites/whatisayurveda.com today; other organic sites are NOT
    // covered (flagged cross-class AND cross-site miss)"). The emitter mirrors
    // that scope EXACTLY: for any other site it is NOT ARMED and writes
    // nothing. Widening the scope here without widening the lint would emit
    // verdicts for pages the lint never read — a synthesized PASS.
    gate: "G6-LINT",
    registryId: "honest-ymyl-content-lint",
    severity: "blocker",
    what: "the 35-rule honest-YMYL per-page content lint (scripts/content-lint.mjs)",
    command: "node scripts/content-lint.mjs --quiet",
    preflight({ site, repoRoot }) {
      // content-lint.mjs hardcodes SITE = sites/whatisayurveda.com (its §2.7
      // scope boundary). This list is that fact, not a policy of ours.
      const covered = ["whatisayurveda.com"];
      if (!covered.includes(site))
        return { armed: false, reason: `content-lint.mjs covers only [${covered.join(", ")}] — ${site} is outside its scope (registry-known cross-site miss on honest-ymyl-content-lint). Emitting a verdict for a site the lint never read would be a synthesized PASS; the honest state is NO VERDICT until the lint's scope grows` };
      const dir = join("sites", site, "content");
      if (!existsSync(resolve(repoRoot, dir))) return { armed: false, reason: `${dir} does not exist — nothing for the lint to judge` };
      return { armed: true, reason: "", dir };
    },
    artifact({ site, repoRoot, pre }) {
      return writeSourceManifest(repoRoot, pre.dir, join("audits", site, "G6-LINT-content-manifest.json"));
    },
    commands({ repoRoot }) {
      return [["node", join(repoRoot, "scripts", "content-lint.mjs"), "--quiet"]];
    },
  },
  {
    // registry `s3-keyword-gates` (severity: blocker). G3-PRE's claim is BOTH
    // halves — "V1–V10 + assertions 0–9 + seed Rule A/B". CI arms per
    // docs/keywords/<dir>: seed-lint always, keyword-validate only when
    // demand.json exists. A verdict for the GATE therefore requires all three
    // artifacts; seeds without demand.json runs only half the claim, and half
    // a claim is NOT ARMED here, never a PASS.
    gate: "G3-PRE",
    registryId: "s3-keyword-gates",
    severity: "blocker",
    what: "S3 keyword rigor: seed Rule A/B + V1–V10 / assertions 0–9 on the demand artifact",
    command: "node scripts/seed-lint.mjs + node scripts/keyword-validate.mjs",
    preflight({ site, repoRoot }) {
      const label = site.split(".")[0];
      const base = join(repoRoot, "docs", "keywords");
      const candidates = [site, label].map((n) => join(base, n)).filter((p) => existsSync(p));
      if (candidates.length === 0)
        return { armed: false, reason: `no docs/keywords/${site}/ (or docs/keywords/${label}/) — the S3 artifacts do not exist; same loud not-armed state CI prints` };
      const dir = candidates[0];
      const missing = ["seeds.json", "ontology.json", "demand.json"].filter((f) => !existsSync(join(dir, f)));
      if (missing.length)
        return { armed: false, reason: `${relative(repoRoot, dir)} is missing ${missing.join(", ")} — G3-PRE's claim covers seed Rule A/B AND V1–V10 on demand.json; running half the claim cannot prove the gate` };
      return { armed: true, reason: "", dir: relative(repoRoot, dir) };
    },
    artifact({ pre }) {
      // The artifact the gate judges — §0.2's own schema example binds exactly
      // this shape ("docs/.../keyword-map.json", command keyword-validate).
      return join(pre.dir, "demand.json");
    },
    commands({ repoRoot, pre }) {
      const d = (f) => join(pre.dir, f);
      return [
        ["node", join(repoRoot, "scripts", "seed-lint.mjs"), "--seeds", d("seeds.json"), "--ontology", d("ontology.json")],
        ["node", join(repoRoot, "scripts", "keyword-validate.mjs"), "--artifact", d("demand.json"), "--ontology", d("ontology.json"), "--seeds", d("seeds.json")],
      ];
    },
  },
];

/* ==========================================================================
 * THE HARNESS
 * ========================================================================== */

/** Real spawn. Returns the child's real exit code (null → treated as harness failure). */
export function realRun(argv, { repoRoot }) {
  const r = spawnSync(argv[0], argv.slice(1), { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (r.error) return { exit: null, output: String(r.error.message ?? r.error) };
  return { exit: r.status, output: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

const TAIL = 2000;
const tail = (s) => (s.length > TAIL ? `…${s.slice(-TAIL)}` : s);

/**
 * Run one emitter. Returns {emitted, reason?, path?, verdict?, results?}.
 *
 * §0.6 CONTROL PROBE, harness edition: this harness's "zero" is "zero failing
 * commands". Before believing that zero, the harness spawns a command that MUST
 * fail (`node -e "process.exit(2)"`) through the SAME run path and must observe
 * the non-zero exit. If the detector cannot see a failure, nothing this run
 * reports is evidence, and it REFUSES to emit rather than emitting a verdict
 * whose own probe would (rightly) void it.
 *
 * @param {string} gateId
 * @param {{site:string, repoRoot?:string, run?:typeof realRun}} opts
 */
export function emitForGate(gateId, opts) {
  const spec = EMITTERS.find((s) => s.gate === gateId);
  if (!spec) {
    throw new Error(
      `no emitter for "${gateId}" — tranche 1 covers [${EMITTERS.map((s) => s.gate).join(", ")}]. ` +
      `An emitter may only speak for a gate its command enforces; HUMAN gates take no emitter at all ` +
      `(a sign-off is recorded by the person, never synthesized — §0.1 "a named person, not delegable")`,
    );
  }
  const repoRoot = opts.repoRoot ?? DEFAULT_REPO_ROOT;
  const run = opts.run ?? realRun;
  const site = opts.site;
  if (!site) throw new Error("emitForGate: --site is required");

  const pre = spec.preflight({ site, repoRoot });
  if (!pre.armed) return { emitted: false, reason: pre.reason };

  // control probe BEFORE any emit decision
  const probe = run(["node", "-e", "process.exit(2)"], { repoRoot });
  if (probe.exit !== 2) {
    throw new Error(
      `control probe misfired: a command hard-coded to exit 2 was observed as ${JSON.stringify(probe.exit)} — ` +
      `the failure detector is broken, so no result from this run is evidence (§0.6). REFUSING to emit`,
    );
  }

  const startedAt = istIso();
  const artifactPath = spec.artifact({ site, repoRoot, pre });

  const results = [];
  let failedExit = 0;
  for (const argv of spec.commands({ site, repoRoot, pre })) {
    const r = run(argv, { repoRoot });
    results.push({ argv, exit_code: r.exit, output_tail: tail(r.output ?? "") });
    if (r.exit === null || r.exit === undefined) {
      throw new Error(`command did not produce an exit code (${argv.join(" ")}) — a verdict cannot be derived from a run that did not complete`);
    }
    if (r.exit !== 0 && failedExit === 0) failedExit = r.exit;
  }

  const status = failedExit === 0 ? "PASS" : "FAIL";
  const { verdict, path } = emitVerdict({
    gate: spec.gate,
    status,
    artifactPath,
    repoRoot,
    command: spec.command,
    argv: results.map((r) => r.argv.join(" ")),
    exitCode: failedExit,
    startedAt,
    controlProbe: { name: "harness-detects-nonzero-exit", expected: 2, observed: probe.exit },
    extra: { site, registry_gate: spec.registryId, registry_severity: spec.severity, commands: results.map(({ argv, exit_code }) => ({ argv, exit_code })) },
    outPath: join("audits", site, `${spec.gate}-verdict.json`),
  });
  return { emitted: true, path, verdict, results };
}

/* ------------------------------------------------------------------- CLI */

function parseArgs(argv) {
  const o = { site: null, gate: null, list: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--site") o.site = argv[++i];
    else if (a === "--gate") o.gate = argv[++i];
    else if (a === "--list") o.list = true;
    else throw new Error(`unknown argument "${a}"`);
  }
  return o;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.list) {
    console.log("tranche-1 verdict emitters (registry-severity order):");
    for (const s of EMITTERS) console.log(`  ${s.gate}  [${s.severity} · ${s.registryId}]  ${s.command}`);
    console.log("\ncross-model chain (G*-PROC via audit-gpt.mjs, G*-FACT via audit-perplexity.mjs):");
    console.log("  emitted only by the audit run itself — pass --emit-gate/--emit-site to the auditor (scripts/lib/audit-verdict.mjs)");
    process.exit(0);
  }
  if (!args.site || !args.gate) {
    console.error("usage: node scripts/gate-emit.mjs --site <domain> --gate <id> | --list");
    process.exit(1);
  }
  const r = emitForGate(args.gate, { site: args.site });
  if (!r.emitted) {
    console.log(`NOT ARMED — no verdict written (absence stays honest; the walk keeps saying "NO VERDICT"):\n  ${r.reason}`);
    process.exit(0);
  }
  for (const c of r.results) console.log(`ran: ${c.argv.join(" ")} → exit ${c.exit_code}`);
  console.log(`verdict: ${relative(DEFAULT_REPO_ROOT, r.path)} — ${r.verdict.status} (runner ${r.verdict.runner}${r.verdict.runner === "local" ? " — iteration evidence; ship evidence requires a CI-committed run, §0.2" : ""})`);
  process.exit(r.verdict.status === "PASS" ? 0 : 2);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  try { main(); } catch (e) { console.error("gate-emit harness error:", e.message); process.exit(1); }
}
