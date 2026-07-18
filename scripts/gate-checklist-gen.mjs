#!/usr/bin/env node
/**
 * gate-checklist-gen.mjs — per-site ship checklists GENERATED from the registry.
 *
 * WHY THIS EXISTS. CLAUDE.md §GATE REGISTRY (v1.10) is explicit: "Per-site ship
 * checklists are GENERATED from the registry by site class, never hand-written."
 * Until this script, that law had no mechanism — the registry row
 * `generated-checklists-filled` sat at `partial` and filled checklists were
 * transcribed from the docs/checklists/ masters by hand (the exact failure the
 * registry exists to close: a hand-written list drifts, and nobody decided the
 * drift). This is follow-up O6 of docs/reports/2026-07-18-prompt5-gate-registry.md.
 *
 * WHAT IT DOES. Reads gates/registry.yaml — and ONLY the registry; there is no
 * other content source by design — and emits launches/<domain>/checklist-<class>.md:
 *
 *   · every non-n_a gate for the class becomes exactly ONE fillable checkbox
 *     row (id, name, what_it_verifies, run, status, enforcement ref, and the
 *     adapted-how where the class adapts it), grouped by severity in contract
 *     order (blocker → high → advisory), registry order within a group;
 *   · every n_a gate lands in a collapsed "explicitly N/A" section WITH its
 *     reason — never silently dropped (the registry's no-silence law: skipping
 *     a class is a decision with a written reason);
 *   · the header carries generated-by + registry commit + IST-to-the-second
 *     timestamp + DO NOT HAND-EDIT, so a generated file can never masquerade
 *     as an authored one.
 *
 * REFUSALS (loud, exit 2 — never a silent skip):
 *   · a registry that fails gate-registry-lint — no law is generated from an
 *     invalid source;
 *   · an unknown class — classes come from the registry's `classes:` line, so
 *     the planned `external` class works here the day it is declared;
 *   · an unknown domain — no sites/<domain> or launches/<domain> exists.
 *
 * Deliberately NOT here (separately-ratified changes, per the O6 brief):
 *   · no factory-gate.yml wiring — this generator is not merge-blocking yet;
 *   · the `run` enum is read AS-IS (automated|agent|human) while O4's
 *     ratification is pending;
 *   · no fleet-wide emit — one domain per invocation, on purpose.
 *
 * CONTROL PROBE (§0.6): the REAL generator runs on the lint's known-good and
 * known-bad probe registries first; a probe failure means the generator proved
 * nothing and the run fails.
 *
 * Exit codes: 0 = written · 2 = refusal OR broken probe · 1 = harness error.
 *
 * Usage:
 *   node scripts/gate-checklist-gen.mjs --domain <domain> --class <commerce|organic|landing>
 *   node scripts/gate-checklist-gen.mjs --list          # declared classes + known domains
 *   [--registry <path>]                                 # non-default registry (tests/dev)
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import {
  PROBE_GOOD, PROBE_MISSING_CLASS, REGISTRY, REPO_ROOT,
  lint, parseRegistry,
} from "./gate-registry-lint.mjs";
import { istNow } from "./launch-scaffold.mjs";

/** Severity contract order + the registry FIELD CONTRACT's own wording. */
export const SEVERITY_ORDER = ["blocker", "high", "advisory"];
export const SEVERITY_HEADINGS = {
  blocker: "Blocker — merge/ship-blocking: the site does not move",
  high: "High — launch-evidence items: must pass before go-live",
  advisory: "Advisory — recurring/monitoring: findings routed, not blocking",
};

/** Domains this factory knows: any directory under sites/ or launches/. */
export function knownDomains(root = REPO_ROOT) {
  const names = new Set();
  for (const dir of ["sites", "launches"]) {
    const p = join(root, dir);
    if (!existsSync(p)) continue;
    for (const e of readdirSync(p, { withFileTypes: true })) {
      if (e.isDirectory() && !e.name.startsWith("_") && !e.name.startsWith(".")) names.add(e.name);
    }
  }
  return [...names].sort();
}

/** Loud refusal for a domain the factory has never heard of. */
export function assertKnownDomain(domain, domains) {
  if (!domains.includes(domain)) {
    throw new Error(
      `unknown domain "${domain}" — no sites/<domain> or launches/<domain> directory exists. ` +
      `Known domains: ${domains.join(", ")}`,
    );
  }
}

/**
 * The generator proper — pure, so probes and tests can drive it byte-for-byte.
 * Renders ONE class checklist from registry text. Throws on any refusal.
 *
 * @param {string} text — registry document text (the ONLY content source)
 * @param {object} opts
 * @param {string} opts.domain — site domain (validated by the CLI, not here)
 * @param {string} opts.siteClass — must be declared on the registry's `classes:` line
 * @param {string} opts.registryCommit — commit hash of the registry (header provenance)
 * @param {string} opts.generatedAt — IST second-precision stamp (header provenance)
 * @param {(p:string)=>boolean} opts.exists — path oracle for the lint (injected for tests)
 * @returns {string} markdown
 */
export function generateChecklist(text, { domain, siteClass, registryCommit, generatedAt, exists }) {
  if (typeof exists !== "function") throw new Error("generateChecklist needs an `exists` path oracle — refusing to skip the lint");
  const parsed = parseRegistry(text);
  const violations = lint(parsed, exists);
  if (violations.length > 0) {
    throw new Error(
      `registry fails gate-registry-lint (${violations.length} violation${violations.length === 1 ? "" : "s"}) — ` +
      `refusing to generate a checklist from an invalid source. First: ${violations[0]}`,
    );
  }
  if (!parsed.classes.includes(siteClass)) {
    throw new Error(`unknown class "${siteClass}" — the registry declares: ${parsed.classes.join(", ")}`);
  }

  const active = parsed.gates.filter((g) => g.applicability[siteClass].kind !== "n_a");
  const na = parsed.gates.filter((g) => g.applicability[siteClass].kind === "n_a");
  const nRequired = active.filter((g) => g.applicability[siteClass].kind === "required").length;
  const nAdapted = active.length - nRequired;

  const lines = [];
  lines.push(`# Ship checklist — ${domain} · class: ${siteClass}`);
  lines.push("");
  lines.push(`**Generated-by: \`node scripts/gate-checklist-gen.mjs --domain ${domain} --class ${siteClass}\` · registry: \`${REGISTRY}\` @ ${registryCommit} · ${generatedAt}**`);
  lines.push("");
  lines.push("**DO NOT HAND-EDIT — regenerate from gates/registry.yaml.** Per-site ship checklists are GENERATED from the registry by site class, never hand-written (CLAUDE.md §GATE REGISTRY). The launch crew fills marks and evidence IN PLACE — [x] done · [~] partial (gap stated) · [ ] pending (reason given); evidence is real command output or a named artifact, never self-reported success. Adding, removing, or rewording a gate happens ONLY in the registry (rule g); marking a gate n/a for a class is a REGISTRY decision, never a fill-time one. Regenerating overwrites this file.");
  lines.push("");
  lines.push(`**${parsed.gates.length} gates in the registry · ${nRequired} required + ${nAdapted} adapted = ${active.length} to clear for class ${siteClass} · ${na.length} explicitly n/a (collapsed at the end — each one decided, never silent).**`);
  lines.push("**run legend: automated = deterministic script/CI · agent = LLM subagent with structured PASS/FAIL output · human = a named person signs.**");

  for (const sev of SEVERITY_ORDER) {
    const group = active.filter((g) => g.severity === sev);
    if (group.length === 0) continue;
    lines.push("");
    lines.push(`## ${SEVERITY_HEADINGS[sev]} (${group.length})`);
    lines.push("");
    for (const g of group) {
      const entry = g.applicability[siteClass];
      lines.push(`- [ ] \`${g.id}\` — **${g.name}** · run: ${g.run} · status: ${g.status} · ${siteClass}: ${entry.kind}`);
      lines.push(`  - verifies: ${g.what_it_verifies}`);
      lines.push(`  - enforcement: ${g.script_or_agent_ref}`);
      if (entry.kind === "adapted") lines.push(`  - adapted for ${siteClass}: ${entry.reason}`);
      lines.push(`  - evidence:`);
    }
  }

  lines.push("");
  lines.push("<details>");
  lines.push(`<summary>Explicitly N/A for class ${siteClass} — ${na.length} gate${na.length === 1 ? "" : "s"} (decided in the registry with a written reason, never silent)</summary>`);
  lines.push("");
  if (na.length === 0) lines.push(`(none — every registry gate binds on class ${siteClass})`);
  for (const g of na) {
    lines.push(`- \`${g.id}\` — **${g.name}** · n/a: ${g.applicability[siteClass].reason}`);
  }
  lines.push("");
  lines.push("</details>");
  lines.push("");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Control probes — the REAL generator on the lint's known-good/known-bad docs.
// ---------------------------------------------------------------------------

export function runControlProbes() {
  const broken = [];
  const exists = (p) => p === "package.json";
  const base = { domain: "probe.example", registryCommit: "abc1234", generatedAt: "2026-07-18 00:00:00 IST", exists };
  const threw = (fn) => { try { fn(); return false; } catch { return true; } };

  const commerce = generateChecklist(PROBE_GOOD, { ...base, siteClass: "commerce" }); // required
  if ((commerce.match(/^- \[ \] `probe-gate` /gm) ?? []).length !== 1) {
    broken.push("a required gate did not render as exactly one checkbox row");
  }
  const organic = generateChecklist(PROBE_GOOD, { ...base, siteClass: "organic" }); // adapted
  if (!organic.includes("adapted for organic: adapted for the probe, in enough words")) {
    broken.push("an adapted gate's how-text was dropped");
  }
  const landing = generateChecklist(PROBE_GOOD, { ...base, siteClass: "landing" }); // n_a
  if (/^- \[ \] `probe-gate` /m.test(landing)) broken.push("an n_a gate rendered as a checkbox row");
  if (!landing.includes("no landing surface in the probe")) broken.push("an n_a gate was silently dropped — the no-silence law broke");

  if (!threw(() => generateChecklist(PROBE_GOOD, { ...base, siteClass: "bogus" }))) {
    broken.push("an unknown class did NOT refuse");
  }
  if (!threw(() => generateChecklist(PROBE_MISSING_CLASS, { ...base, siteClass: "commerce" }))) {
    broken.push("a lint-failing registry did NOT refuse — the generator would mint law from an invalid source");
  }
  return broken;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

/** Provenance of the registry file: last commit that touched it (+dirty flag). */
function registryProvenance(registryRel) {
  // execFileSync with an argument array — no shell, so a hostile --registry
  // value cannot inject commands (security-guidance rule).
  const git = (...args) => execFileSync("git", args, { cwd: REPO_ROOT, encoding: "utf8" }).trim();
  const hash = git("log", "-1", "--format=%h", "--", registryRel);
  const dirty = git("status", "--porcelain", "--", registryRel) !== "";
  if (!hash) return "UNCOMMITTED";
  return dirty ? `${hash}+dirty` : hash;
}

function main(argv) {
  const flag = (name) => {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const registryRel = flag("--registry") ?? REGISTRY;
  const registryPath = resolve(REPO_ROOT, registryRel);

  const broken = runControlProbes();
  if (broken.length > 0) {
    console.error("\ngate-checklist-gen: CONTROL PROBE FAILED — this generator proved nothing.");
    for (const b of broken) console.error(`  ✗ ${b}`);
    return 2;
  }

  const text = readFileSync(registryPath, "utf8");
  const domains = knownDomains();

  if (argv.includes("--list")) {
    const parsed = parseRegistry(text);
    console.log(`\ngate-checklist-gen — list mode`);
    console.log(`  declared classes (${registryRel}): ${parsed.classes.join(", ")}`);
    console.log(`  known domains (sites/ + launches/): ${domains.join(", ")}\n`);
    return 0;
  }

  const domain = flag("--domain");
  const siteClass = flag("--class");
  if (!domain || !siteClass) {
    console.error("\nusage: node scripts/gate-checklist-gen.mjs --domain <domain> --class <class>  |  --list");
    return 2;
  }

  try {
    assertKnownDomain(domain, domains);
    const md = generateChecklist(text, {
      domain, siteClass,
      registryCommit: registryProvenance(registryRel),
      generatedAt: istNow(),
      exists: (p) => existsSync(join(REPO_ROOT, p)),
    });
    const outDir = join(REPO_ROOT, "launches", domain);
    mkdirSync(outDir, { recursive: true });
    const outPath = join(outDir, `checklist-${siteClass}.md`);
    writeFileSync(outPath, md);

    const parsed = parseRegistry(text);
    const kinds = { required: 0, adapted: 0, n_a: 0 };
    for (const g of parsed.gates) kinds[g.applicability[siteClass].kind] += 1;
    console.log(`\ngate-checklist-gen — wrote launches/${domain}/checklist-${siteClass}.md`);
    console.log(`  ${parsed.gates.length} gates · ${siteClass}: ${kinds.required} required · ${kinds.adapted} adapted · ${kinds.n_a} n_a (all listed — no-silence law)\n`);
    return 0;
  } catch (e) {
    console.error(`\ngate-checklist-gen: REFUSED — ${e.message}\n`);
    return 2;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`gate-checklist-gen: harness error — ${e.message}`);
    process.exit(1);
  }
}
