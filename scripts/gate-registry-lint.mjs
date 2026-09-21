#!/usr/bin/env node
/**
 * gate-registry-lint.mjs — the no-miss gate for gates/registry.yaml.
 *
 * WHY THIS EXISTS. Roadmap §7 (Abilash's 17 Jul rule, executed as PROMPT 5):
 * the rigorous checks are ONE registry applied to three site classes —
 * commerce, organic, landing — not three parallel lists. The failure class it
 * closes is real and already happened: the "19-gate check" was cited in
 * CLAUDE.md Lane B for days while no 19-item gate existed anywhere
 * (MASTER_PIPELINE WF-B ruled it an ORPHAN REFERENCE), and content-lint runs
 * for exactly one organic site while commerce and landing surfaces carry the
 * same claim risk with nothing pointed at them. A check that exists for one
 * class and is simply ABSENT for the others is invisible — nobody decided the
 * absence, so nobody can defend it. This lint makes the absence impossible:
 *
 *   1. every gate carries an EXPLICIT entry for EVERY declared class —
 *      `required`, `{ adapted: "how" }`, or `{ n_a: "reason" }` — and a
 *      missing class entry FAILS the PR;
 *   2. adapted/n_a entries must state their how/reason (an empty reason is a
 *      dodge, not a decision);
 *   3. enum fields (severity/run/status) admit only their contract values;
 *   4. a `built`/`partial` gate's script_or_agent_ref is existence-checked —
 *      every path-like token must exist on disk (the FALSE-automated A5/A9/
 *      A10/A11 finding, made structural), and the ref must NOT claim PLANNED;
 *   5. a `planned` gate's ref MUST start with "PLANNED" — a planned gate can
 *      never masquerade as enforcement that runs;
 *   6. duplicate ids fail — a gate defined twice is two gates drifting.
 *
 * The registry format is a deliberately NARROW YAML subset (single-line
 * values; applicability entries are `required` or a one-key inline map), and
 * the parser here refuses anything it does not understand — an unparseable
 * registry is a gate failure, not a skip (front-gate.mjs stance; this repo has
 * no yaml dependency by design).
 *
 * CONTROL PROBE (§0.6): a known-good registry document and known-bad documents
 * run through the REAL parser and REAL lint first; the probe failing means the
 * gate checked nothing and the run fails.
 *
 * Exit codes: 0 = clean · 2 = violations OR broken probe (CI blocks) · 1 = harness error.
 *
 * Usage: node scripts/gate-registry-lint.mjs [--registry <path>]
 */

import { readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const REGISTRY = "gates/registry.yaml";

export const SEVERITIES = new Set(["blocker", "high", "advisory"]);
export const RUNS = new Set(["automated", "agent", "human"]);
export const STATUSES = new Set(["built", "partial", "planned"]);
/** The classes the law is written for. `classes:` in the file may extend this
 * (roadmap §8 plans `external`), but may never shrink it. */
export const CORE_CLASSES = ["commerce", "organic", "landing"];

const GATE_FIELDS = ["id", "name", "what_it_verifies", "severity", "run", "status", "script_or_agent_ref", "source"];

/**
 * Parse the narrow registry format. Returns { classes, gates, errors }.
 * Anything unparseable lands in errors — never silently skipped.
 * @param {string} text
 */
export function parseRegistry(text) {
  const errors = [];
  let classes = null;
  const gates = [];
  let gate = null; // current gate object
  let inApplicability = false;

  const unquote = (v) => {
    const t = v.trim();
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) return t.slice(1, -1);
    return t;
  };

  text.split(/\r?\n/).forEach((raw, idx) => {
    const line = idx + 1;
    const stripped = raw.replace(/\s+$/, "");
    if (stripped === "" || /^\s*#/.test(stripped)) return;

    let m;
    if ((m = stripped.match(/^classes:\s*\[(.*)\]\s*$/))) {
      classes = m[1].split(",").map((s) => unquote(s)).filter(Boolean);
      return;
    }
    if (/^(version|updated):/.test(stripped) || /^gates:\s*$/.test(stripped)) return;

    if ((m = stripped.match(/^  - id:\s*(.+)$/))) {
      gate = { id: unquote(m[1]), applicability: {}, line };
      gates.push(gate);
      inApplicability = false;
      return;
    }
    if (gate && stripped === "    applicability:") {
      inApplicability = true;
      return;
    }
    if (gate && (m = stripped.match(/^    ([a-z_]+):\s*(.+)$/))) {
      gate[m[1]] = unquote(m[2]);
      inApplicability = false;
      return;
    }
    if (gate && inApplicability && (m = stripped.match(/^      ([a-z_]+):\s*(.+)$/))) {
      const cls = m[1];
      const val = m[2].trim();
      if (val === "required") {
        gate.applicability[cls] = { kind: "required" };
        return;
      }
      const inline = val.match(/^\{\s*(adapted|n_a):\s*(.+?)\s*\}$/);
      if (inline) {
        gate.applicability[cls] = { kind: inline[1], reason: unquote(inline[2]) };
        return;
      }
      errors.push(`line ${line}: applicability value for "${cls}" is neither \`required\` nor \`{ adapted: "..." }\` nor \`{ n_a: "..." }\`: ${val}`);
      return;
    }
    errors.push(`line ${line}: unparseable registry line: ${stripped.trim()}`);
  });

  if (classes === null) errors.push(`no \`classes: [...]\` line found — the registry declares its classes or it declares nothing`);
  if (gates.length === 0) errors.push(`no gates found — an empty registry guards nothing`);
  return { classes: classes ?? [], gates, errors };
}

/** Path-like tokens in a ref string (files with known extensions; <placeholders> excluded). */
export function pathTokens(ref) {
  const out = [];
  const re = /(?:[\w.-]+\/)*[\w.-]+\.(?:mjs|js|ts|tsx|yml|yaml|md|json|sh|toml|css)\b/g;
  let m;
  while ((m = re.exec(ref)) !== null) out.push(m[0]);
  return out;
}

/**
 * The lint proper — pure, so probes and tests can drive it.
 * @param {{classes:string[], gates:any[], errors:string[]}} parsed
 * @param {(p:string)=>boolean} exists — path existence oracle (injected for tests)
 * @returns {string[]} violations (empty = clean)
 */
export function lint(parsed, exists) {
  const violations = [...parsed.errors];
  const { classes, gates } = parsed;

  for (const core of CORE_CLASSES) {
    if (classes.length > 0 && !classes.includes(core)) {
      violations.push(`classes: [${classes.join(", ")}] is missing core class "${core}" — the three-class law may be extended, never shrunk`);
    }
  }

  const seen = new Set();
  for (const g of gates) {
    const at = `gate "${g.id ?? "<no id>"}" (line ${g.line})`;
    if (seen.has(g.id)) violations.push(`${at}: duplicate id — a gate defined twice is two gates drifting`);
    seen.add(g.id);
    if (g.id && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(g.id)) violations.push(`${at}: id must be kebab-case`);

    for (const f of GATE_FIELDS) {
      if (!g[f] || String(g[f]).trim() === "") violations.push(`${at}: missing required field \`${f}\``);
    }
    if (g.severity && !SEVERITIES.has(g.severity)) violations.push(`${at}: severity "${g.severity}" not in {${[...SEVERITIES].join(", ")}}`);
    if (g.run && !RUNS.has(g.run)) violations.push(`${at}: run "${g.run}" not in {${[...RUNS].join(", ")}}`);
    if (g.status && !STATUSES.has(g.status)) violations.push(`${at}: status "${g.status}" not in {${[...STATUSES].join(", ")}}`);

    // THE LAW: every declared class carries an explicit entry.
    for (const cls of classes) {
      const entry = g.applicability[cls];
      if (!entry) {
        violations.push(`${at}: NO entry for class "${cls}" — a gate can never exist for one class and simply be absent from the others (required | adapted:"how" | n_a:"reason")`);
        continue;
      }
      if ((entry.kind === "adapted" || entry.kind === "n_a") && (!entry.reason || entry.reason.trim().length < 10)) {
        violations.push(`${at}: class "${cls}" is ${entry.kind} but the ${entry.kind === "adapted" ? "how" : "reason"} is empty/trivial — an unexplained ${entry.kind} is a dodge, not a decision`);
      }
    }
    for (const cls of Object.keys(g.applicability)) {
      if (!classes.includes(cls)) violations.push(`${at}: applicability names unknown class "${cls}" (declared: ${classes.join(", ")}) — typo or undeclared class`);
    }

    // Honesty coupling between status and ref.
    const ref = g.script_or_agent_ref ?? "";
    if (g.status === "planned" && !/^PLANNED\b/.test(ref)) {
      violations.push(`${at}: status is planned but script_or_agent_ref does not start with "PLANNED" — a planned gate may never read like running enforcement`);
    }
    if ((g.status === "built" || g.status === "partial") && /^PLANNED\b/.test(ref)) {
      violations.push(`${at}: status is ${g.status} but the ref claims PLANNED — one of them is lying`);
    }
    if (g.status === "built" || g.status === "partial") {
      for (const p of pathTokens(ref)) {
        if (!exists(p)) violations.push(`${at}: script_or_agent_ref names "${p}" but no such file exists — enforcement that names a missing artifact is the FALSE-automated failure class (A5/A9/A10/A11)`);
      }
    }
  }
  return violations;
}

// ---------------------------------------------------------------------------
// Control probes — the REAL parser + REAL lint on known-good and known-bad docs.
// ---------------------------------------------------------------------------

export const PROBE_GOOD = `classes: [commerce, organic, landing]
gates:
  - id: probe-gate
    name: "Probe"
    what_it_verifies: "probe check"
    severity: blocker
    run: automated
    status: built
    script_or_agent_ref: "package.json (probe)"
    source: "probe source"
    applicability:
      commerce: required
      organic: { adapted: "adapted for the probe, in enough words" }
      landing: { n_a: "no landing surface in the probe" }
`;

export const PROBE_MISSING_CLASS = PROBE_GOOD.replace(/\n      landing: .*\n/, "\n");

export function runControlProbes() {
  const broken = [];
  const exists = (p) => p === "package.json";

  const good = parseRegistry(PROBE_GOOD);
  if (good.errors.length > 0 || good.gates.length !== 1 || good.gates[0].id !== "probe-gate") {
    broken.push(`parser probe: known-good registry did not parse cleanly (${JSON.stringify(good.errors)})`);
  }
  const mustPass = lint(good, exists);
  if (mustPass.length !== 0) broken.push(`lint anti-probe: a complete registry was flagged (${mustPass[0]})`);

  const mustFail = lint(parseRegistry(PROBE_MISSING_CLASS), exists);
  if (!mustFail.some((v) => v.includes('NO entry for class "landing"'))) {
    broken.push(`lint probe: a missing class entry was NOT flagged — the gate would pass while checking nothing`);
  }
  const mustFailPath = lint(parseRegistry(PROBE_GOOD.replace("package.json (probe)", "scripts/does-not-exist.mjs")), exists);
  if (!mustFailPath.some((v) => v.includes("no such file exists"))) {
    broken.push(`lint probe: a built gate naming a missing artifact was NOT flagged`);
  }
  return broken;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main(argv) {
  const regArg = argv.indexOf("--registry");
  const regPath = resolve(REPO_ROOT, regArg >= 0 ? argv[regArg + 1] : REGISTRY);

  const broken = runControlProbes();
  if (broken.length > 0) {
    console.error("\ngate-registry-lint: CONTROL PROBE FAILED — this gate did not run.");
    for (const b of broken) console.error(`  ✗ ${b}`);
    return 2;
  }

  const parsed = parseRegistry(readFileSync(regPath, "utf8"));
  const violations = lint(parsed, (p) => existsSync(join(REPO_ROOT, p)));

  const counts = { required: {}, adapted: {}, n_a: {} };
  for (const cls of parsed.classes) for (const k of Object.keys(counts)) counts[k][cls] = 0;
  for (const g of parsed.gates) {
    for (const [cls, entry] of Object.entries(g.applicability)) {
      if (counts[entry?.kind]?.[cls] !== undefined) counts[entry.kind][cls] += 1;
    }
  }

  console.log(`\ngate-registry-lint — ${parsed.gates.length} gates × ${parsed.classes.length} classes (${parsed.classes.join(", ")}) in ${REGISTRY}`);
  for (const cls of parsed.classes) {
    console.log(`  ${cls}: ${counts.required[cls]} required · ${counts.adapted[cls]} adapted · ${counts.n_a[cls]} n_a`);
  }

  if (violations.length === 0) {
    console.log(`\nPASS — every gate carries an explicit entry for every class; enums valid; every built/partial ref resolves on disk.\n`);
    return 0;
  }
  for (const v of violations) console.log(`\nVIOLATION  ${v}`);
  console.log(`\nFAIL — ${violations.length} violation${violations.length === 1 ? "" : "s"}. A gate with a missing class entry is a check nobody decided to skip — tag it required, adapted:"how", or n_a:"reason". Fix the registry, never the gate (CLAUDE.md rule g).\n`);
  return 2;
}

// NOTE: comparing import.meta.url to process.argv[1] as raw STRINGS silently
// broke on any checkout path containing a space — import.meta.url percent-encodes
// it, argv[1] does not — so main() never ran and the script exited 0 having
// checked NOTHING. Normalising argv[1] through URL() fixes it with no new import.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`gate-registry-lint: harness error — ${e.message}`);
    process.exit(1);
  }
}
