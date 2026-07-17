// factory-hardening.test.js — tests for the three session-2C hardening gates:
// factory-matrix-lint (self-registration), launch-evidence-gate (evidence law),
// launch-scaffold (front-loaded registration). House rule (matrix-walk.test.js):
// every detector is tested in BOTH directions — the clean input must PASS and
// the broken input must FAIL, for the same detector, in the same run. A gate
// that always says no and a gate that always says yes are equally useless.
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  EXEMPT, REPO_ROOT, WORKFLOW,
  fleetSites, lint, parseMatrices, runControlProbes as matrixProbes,
} from "../factory-matrix-lint.mjs";
import {
  checkLaunchDir, runControlProbes as evidenceProbes,
} from "../launch-evidence-gate.mjs";
import {
  checklistHeader, insertIntoMatrices, istNow, requiredChecksCommand,
} from "../launch-scaffold.mjs";

const YAML = `
jobs:
  spec:
    strategy:
      matrix:
        site: ["sites/a.com", "sites/b.com"]
  lighthouse:
    strategy:
      matrix:
        site: ["sites/a.com", "sites/b.com"]
`;

// ── factory-matrix-lint ──────────────────────────────────────────────────────

test("parseMatrices extracts every site matrix with its job name", () => {
  const m = parseMatrices(YAML);
  assert.equal(m.length, 2);
  assert.deepEqual(m.map((x) => x.job), ["spec", "lighthouse"]);
  assert.deepEqual(m[0].sites, ["sites/a.com", "sites/b.com"]);
});

test("lint FAILS when a fleet site is absent from any matrix", () => {
  const v = lint({ matrices: parseMatrices(YAML), sites: ["sites/a.com", "sites/b.com", "sites/new.com"], exempt: new Map() });
  // absent from BOTH matrices → two findings, one per matrix (drift in either is drift)
  assert.equal(v.length, 2);
  assert.match(v[0], /sites\/new\.com .* ABSENT from the `spec` matrix/);
});

test("lint PASSES a complete matrix, and exemptions suppress exactly their site", () => {
  const sites = ["sites/a.com", "sites/b.com", "sites/internal"];
  assert.equal(lint({ matrices: parseMatrices(YAML), sites, exempt: new Map([["sites/internal", "why"]]) }).length, 0);
});

test("lint FAILS on dead matrix entries and stale exemptions (both directions of rot)", () => {
  const dead = lint({ matrices: parseMatrices(YAML), sites: ["sites/a.com"], exempt: new Map() });
  assert.ok(dead.some((v) => /dead matrix entry/.test(v) && /sites\/b\.com/.test(v)));
  const stale = lint({ matrices: parseMatrices(YAML), sites: ["sites/a.com", "sites/b.com"], exempt: new Map([["sites/a.com", "why"]]) });
  assert.ok(stale.some((v) => /BOTH exempt and in/.test(v)));
  const gone = lint({ matrices: parseMatrices(YAML), sites: ["sites/a.com", "sites/b.com"], exempt: new Map([["sites/x.com", "why"]]) });
  assert.ok(gone.some((v) => /no such fleet site exists — delete the exemption/.test(v)));
});

test("lint treats zero matrices as a failure, never as clean (§0.6)", () => {
  const v = lint({ matrices: [], sites: ["sites/a.com"], exempt: new Map() });
  assert.equal(v.length, 1);
  assert.match(v[0], /checked NOTHING/);
});

test("REAL workflow: every fleet site on disk is in every matrix (the gate, run here too)", () => {
  const matrices = parseMatrices(readFileSync(join(REPO_ROOT, WORKFLOW), "utf8"));
  assert.ok(matrices.length >= 2, "factory-spec + lighthouse matrices expected");
  assert.deepEqual(lint({ matrices, sites: fleetSites(), exempt: EXEMPT }), []);
});

test("matrix-lint control probes hold", () => assert.deepEqual(matrixProbes(), []));

// ── launch-evidence-gate ─────────────────────────────────────────────────────

test("an armed dir with the full evidence set passes; each missing item is one finding", () => {
  const full = {
    domain: "x.com",
    files: ["design-qa-report.md", "seo-aeo-geo-report.md", "sitewide-checklist.md", "pagewise-checklist.md"],
    mentions: { "wiki/log.md": "built x.com today", "LEARNINGS.md": "x.com retro: …" },
  };
  assert.deepEqual(checkLaunchDir(full), { armed: true, missing: [] });

  const bare = checkLaunchDir({ domain: "x.com", files: ["seo-aeo-geo-report.md"], mentions: { "wiki/log.md": "", "LEARNINGS.md": "" } });
  assert.equal(bare.armed, true);
  assert.equal(bare.missing.length, 4);
  assert.ok(bare.missing.some((m) => /sitewide-checklist/.test(m)));
  assert.ok(bare.missing.some((m) => /wiki\/log\.md/.test(m)));
});

test("a dir with no audit report is unarmed — legacy screenshot dirs stay green", () => {
  const r = checkLaunchDir({ domain: "old.com", files: ["design-review.md", "home.png"], mentions: {} });
  assert.deepEqual(r, { armed: false, missing: [] });
});

test("evidence-gate control probes hold", () => assert.deepEqual(evidenceProbes(), []));

// ── launch-scaffold ──────────────────────────────────────────────────────────

test("insertIntoMatrices adds the site to EVERY matrix, once, idempotently", () => {
  const first = insertIntoMatrices(YAML, "sites/new.com");
  assert.equal(first.touched, 2);
  assert.equal(first.already, 0);
  const matrices = parseMatrices(first.text);
  for (const m of matrices) assert.ok(m.sites.includes("sites/new.com"), `${m.job} missing the new site`);
  // and the result LINTS clean — scaffold output must satisfy the gate it feeds
  assert.deepEqual(lint({ matrices, sites: ["sites/a.com", "sites/b.com", "sites/new.com"], exempt: new Map() }), []);

  const second = insertIntoMatrices(first.text, "sites/new.com");
  assert.equal(second.touched, 0);
  assert.equal(second.already, 2);
  assert.equal(second.text, first.text);
});

test("checklistHeader carries domain, master path, and the launch-evidence law", () => {
  const h = checklistHeader("x.com", "docs/checklists/sitewide-migration-checklist.md", "2026-07-17 15:00:00 IST");
  assert.match(h, /launches\/x\.com/);
  assert.match(h, /sitewide-migration-checklist\.md/);
  assert.match(h, /not a launch/);
});

test("istNow renders a second-precision IST stamp (log law format)", () => {
  assert.match(istNow(new Date("2026-07-17T00:00:00Z")), /^2026-07-17 05:30:00 IST$/);
});

test("requiredChecksCommand rebuilds the full contexts set from the live matrix", () => {
  const cmd = requiredChecksCommand(YAML);
  assert.match(cmd, /branches\/main\/protection\/required_status_checks/);
  for (const c of ["contexts[]=gate", "contexts[]=brand-lint", "contexts[]=factory-spec (sites/a.com)", "contexts[]=lighthouse (sites/b.com)"]) {
    assert.ok(cmd.includes(c), `missing ${c}`);
  }
});
