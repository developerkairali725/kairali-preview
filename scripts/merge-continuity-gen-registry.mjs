#!/usr/bin/env node
/**
 * merge-continuity-gen-registry.mjs — emit GR continuity rows for registry gates.
 *
 * merge-continuity-lint.mjs fails when a gates/registry.yaml gate has no GR row
 * (an undecided absence). This helper prints canonical rows for every gate — or,
 * with --missing, only for gates not yet covered by the continuity file — so a
 * new registry row is a two-step: add the gate, paste its generated GR row.
 * Output goes to stdout; a human pastes/commits it (the lint stays the judge).
 *
 *   node scripts/merge-continuity-gen-registry.mjs            # all gates
 *   node scripts/merge-continuity-gen-registry.mjs --missing  # uncovered only
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseRegistry, REGISTRY } from "./gate-registry-lint.mjs";
import { CONTINUITY, REPO_ROOT, hashOf, parseContinuity } from "./merge-continuity-lint.mjs";

const TRIGGERS = {
  blocker: "per PR (merge-blocking CI)",
  high: "pre-launch (launch-evidence item)",
  advisory: "recurring/monitoring (findings routed, not blocking)",
};
const APPROVERS = { automated: "CI", agent: "agent (structured PASS/FAIL)", human: "named human" };

export function genRows(gates, startIndex = 1) {
  return gates.map((g, i) => {
    const dims = Object.entries(g.applicability)
      .filter(([, v]) => v.kind !== "n_a")
      .map(([cls, v]) => (v.kind === "adapted" ? `${cls}-adapted` : cls));
    const oldText = `${g.id} — ${g.what_it_verifies ?? g.name ?? ""} (severity ${g.severity}, run ${g.run}, status ${g.status})`;
    return {
      source_id: `GR-${String(startIndex + i).padStart(3, "0")}`,
      source_file: REGISTRY,
      registry_id: g.id,
      old_text: oldText,
      old_text_hash: hashOf(oldText),
      new_home: "gates/registry.yaml (unchanged — Phase 5 battery per plan §2.1; registry classes supreme per §2.2; package checks ADD rows, never replace)",
      dimensions: dims.length ? dims : ["all"],
      trigger: TRIGGERS[g.severity] ?? "per registry severity contract",
      enforcement: g.script_or_agent_ref ?? "(registry ref)",
      evidence_path: null,
      approver: APPROVERS[g.run] ?? g.run,
      test: "scripts/test/gate-registry-lint.test.js (registry contract) + scripts/test/merge-continuity-lint.test.js (coverage)",
      status: "verbatim",
    };
  });
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const reg = parseRegistry(readFileSync(resolve(REPO_ROOT, REGISTRY), "utf8"));
  if (reg.errors.length) { for (const e of reg.errors) console.error("✗ " + e); process.exit(1); }

  let gates = reg.gates;
  let start = 1;
  if (process.argv.includes("--missing")) {
    const contPath = resolve(REPO_ROOT, CONTINUITY);
    const covered = new Set();
    let maxGr = 0;
    if (existsSync(contPath)) {
      const { doc } = parseContinuity(readFileSync(contPath, "utf8"));
      for (const r of doc.rows) {
        if (r.registry_id) covered.add(r.registry_id);
        const m = /^GR-(\d+)$/.exec(r.source_id ?? "");
        if (m) maxGr = Math.max(maxGr, Number(m[1]));
      }
    }
    gates = gates.filter((g) => !covered.has(g.id));
    start = maxGr + 1;
  }

  for (const r of genRows(gates, start)) {
    console.log(`  - source_id: ${r.source_id}`);
    console.log(`    source_file: "${r.source_file}"`);
    console.log(`    registry_id: ${r.registry_id}`);
    console.log("    old_text: |-");
    for (const l of r.old_text.split("\n")) console.log(`      ${l}`);
    console.log(`    old_text_hash: "${r.old_text_hash}"`);
    console.log(`    new_home: "${r.new_home}"`);
    console.log(`    dimensions: [${r.dimensions.join(", ")}]`);
    console.log(`    trigger: "${r.trigger}"`);
    console.log(`    enforcement: "${r.enforcement.replace(/"/g, '\\"')}"`);
    console.log(`    evidence_path: null`);
    console.log(`    approver: "${r.approver}"`);
    console.log(`    test: "${r.test}"`);
    console.log(`    status: verbatim`);
  }
  console.error(`(${gates.length} GR row(s) emitted to stdout)`);
}
