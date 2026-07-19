// authenticated-approval.test.js — tests for the M1 authenticated-approval
// mechanism (plan §10 M1, external-review blocking finding 2: an agent-written
// approvals.yaml row alone no longer satisfies a gate; scope per D-20260719-10 —
// front gates + doctrine/evolution PRs only, routine PRs keep auto-merge).
//
// House rule (front-gate.test.js et al.): every detector is tested in BOTH
// directions — the clean input must PASS and the broken input must FAIL, for
// the same detector, in the same run. The reviews payload is mocked as plain
// JSON handed to the pure evaluator — no network, ever.
//
// PASS-2 HARDENING (external review pass 2, gpt-5.6-sol, blocking findings
// B2/B3/B4) is covered below: rename-bypass both directions, the widened
// guarded list (workflows, neutralizer, merge docs, root manifests),
// base-trusted owner identity (self-added-owner rejected, fail-closed on a
// missing base register), effective-review-state semantics (approve→request-
// changes fails, request-changes→approve passes, dismissal invalidates), and
// pagination (multi-page fixture + the loud truncation error).
//
// WORKFLOW-DERIVED GUARDS (adversarial verifier BLOCKING finding, 19 Jul 2026)
// are covered at the bottom: the ten CI-invoked enforcer scripts the verifier
// named classify GUARDED via the workflow-derived set, the workflow-coverage
// control probe passes on the real repo state (and fails when derivation is
// unplugged), a workflow-referenced script absent from the static list is
// still guarded, and unreadable-workflows-at-base enters DEGRADED fail-closed
// mode (all scripts/**.mjs guarded). Both directions throughout.
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import {
  DEGRADED_SCRIPTS_PATTERN, GUARDED, HASH_REMEDY, OWNERS, OWNERS_BASE_NOTE,
  REPO_ROOT, REVIEWS_MAX_PAGES, WORKFLOWS_DIR,
  changedApprovedRows, checkHashBinding, classifyChanged, evaluateOwnerApproval,
  extractWorkflowScriptInvocations, extractWorkflowScriptRefs,
  fetchReviews, guardRule, latestEffectiveReviews, makeGuardRule, parseLedger,
  parseNameStatus, parseOwners, resolveBaseOwners, resolveWorkflowGuardedScripts,
  runControlProbes as approvalProbes, sha256Hex, workflowCoverageProbe,
} from "../authenticated-approval.mjs";

const OWNER = "AbhilashKairali";
const HEAD = "abc123def456";
const review = (login, state, commit_id, submitted_at) => ({ user: { login }, state, commit_id, submitted_at });
const GUARDED_ONE = [{ path: "CLAUDE.md", rule: "CLAUDE.md" }];

const ROW = (extra = "") => `domain: x.com
mode: A
approvals:
  - gate: brief
    status: approved
    owner: Abilash
    date: 2026-07-19 17:30:00 IST
    artifact: docs/x.md
${extra}`;
const HASH = sha256Hex("the committed bytes");

// ── the control probes ───────────────────────────────────────────────────────

test("authenticated-approval control probes pass (the gate is not broken)", () => {
  assert.deepEqual(approvalProbes(), []);
});

// ── guarded-path classifier: what needs the owner, and what must not ─────────

test("guardRule catches every guarded path class", () => {
  assert.equal(guardRule("launches/x.com/approvals.yaml"), "launches/*/approvals.yaml");
  assert.equal(guardRule("CLAUDE.md"), "CLAUDE.md");
  assert.equal(guardRule("gates/registry.yaml"), "gates/**");
  assert.equal(guardRule("gates/owners.yaml"), "gates/**", "the register guards itself");
  assert.equal(guardRule("docs/process/os-2026/standards/03_evidence.md"), "docs/process/os-2026/standards/**");
  assert.equal(guardRule("docs/process/os-2026/workflows/phase-2.md"), "docs/process/os-2026/workflows/**");
  assert.equal(guardRule("docs/design/BEAUTY_DOCTRINE.md"), "docs/design/BEAUTY_DOCTRINE.md");
  assert.equal(guardRule("docs/design/what-is-beauty-owner-paper-2026-07-18.md"), "docs/design/what-is-beauty-owner-paper-2026-07-18.md");
  assert.equal(guardRule("docs/marketing/go-science/mcb.md"), "docs/marketing/go-science/**");
  assert.equal(guardRule("evolution/registers/channels.yaml"), "evolution/**");
  assert.equal(guardRule("decisions/D-20260719-10.md"), "decisions/**");
  assert.equal(guardRule("docs/process/os-2026/merge/merge-continuity.yaml"), "docs/process/os-2026/merge/merge-continuity.yaml");
  for (const s of [
    "scripts/front-gate.mjs", "scripts/authenticated-approval.mjs",
    "scripts/merge-continuity-lint.mjs", "scripts/standards-acceptance.mjs",
    "scripts/class-map-lint.mjs", "scripts/gate-registry-lint.mjs",
    "scripts/go-science-audit.mjs", "scripts/beauty-audit.mjs",
    "scripts/neutralize-workflows.mjs",
  ]) assert.equal(guardRule(s), s, `${s} must guard its own enforcer`);
});

test("guardRule catches the pass-2 B2 additions — enforcement point, merge docs, root wiring", () => {
  assert.equal(guardRule(".github/workflows/factory-gate.yml"), ".github/workflows/**", "the workflow that RUNS the gates is itself guarded");
  assert.equal(guardRule(".github/workflows/gate.yml"), ".github/workflows/**");
  assert.equal(guardRule("docs/process/os-2026/merge/strict-residues.yaml"), "docs/process/os-2026/merge/**");
  assert.equal(guardRule("docs/process/os-2026/merge/gap-list.yaml"), "docs/process/os-2026/merge/**");
  assert.equal(guardRule("docs/process/os-2026/merge/work-item-boundary.md"), "docs/process/os-2026/merge/**");
  assert.equal(guardRule("package.json"), "package.json", "root test/check wiring is guarded");
  assert.equal(guardRule("pnpm-workspace.yaml"), "pnpm-workspace.yaml");
  assert.equal(guardRule("turbo.json"), "turbo.json");
});

test("guardRule catches the pass-2 B2 re-fix additions — lockfile + the enforcers' executable closure", () => {
  assert.equal(guardRule("pnpm-lock.yaml"), "pnpm-lock.yaml", "a lockfile-only PR can repoint resolved URL/integrity — guarded like package.json");
  assert.equal(guardRule("scripts/design-review.mjs"), "scripts/design-review.mjs", "sole enforcer of both design-external-ai-review rows; lends deriveVerdict/decideExit to beauty-audit");
  assert.equal(guardRule("scripts/audit-gpt.mjs"), "scripts/audit-gpt.mjs", "the spawned verdict emitters are part of the gate");
  assert.equal(guardRule("scripts/audit-perplexity.mjs"), "scripts/audit-perplexity.mjs");
  assert.equal(guardRule("scripts/lib/verdict.mjs"), "scripts/lib/**", "istStamp + sha256 — the evidence hash-binding is enforcement surface");
  assert.equal(guardRule("scripts/lib/image-input.mjs"), "scripts/lib/**");
  assert.equal(guardRule("scripts/lib/audit-verdict.mjs"), "scripts/lib/**");
  assert.equal(guardRule("scripts/lib/review-brief.mjs"), "scripts/lib/**");
  assert.equal(guardRule("sites/x.com/pnpm-lock.yaml"), null, "only the ROOT lockfile — the pattern is anchored");
});

test("guardRule leaves routine paths alone — D-20260719-10's auto-merge lane survives", () => {
  assert.equal(guardRule("sites/x.com/app/page.tsx"), null);
  assert.equal(guardRule("packages/ui/brand-tokens.css"), null);
  assert.equal(guardRule("scripts/status-build.mjs"), null, "only the LISTED enforcement scripts are guarded");
  assert.equal(guardRule("scripts/test/front-gate.test.js"), null);
  assert.equal(guardRule("launches/x.com/BRIEF.md"), null, "only the ledger is guarded, not every launch artifact");
  assert.equal(guardRule("docs/design/DESIGN_DOCTRINE.md"), null, "only the two listed design docs");
  assert.equal(guardRule("docs/reports/2026-07-19-m0a-paper-dryrun.md"), null);
  assert.equal(guardRule("sites/x.com/package.json"), null, "only the ROOT manifests are guarded — per-site wiring stays routine");
  assert.equal(guardRule("packages/ui/turbo.json"), null);
  assert.equal(guardRule("CLAUDE.md.bak"), null, "no prefix bleed");
});

test("classifyChanged counts deletions as guarded — deleting doctrine is a doctrine change", () => {
  const { guarded, routine } = classifyChanged([
    { status: "D", path: "CLAUDE.md" },
    { status: "M", path: "sites/x.com/app/page.tsx" },
  ]);
  assert.equal(guarded.length, 1);
  assert.equal(guarded[0].path, "CLAUDE.md");
  assert.deepEqual(routine, ["sites/x.com/app/page.tsx"]);
});

// ── rename handling (pass-2 B2: R/C lines carry BOTH paths) ─────────────────

test("parseNameStatus keeps both sides of a rename/copy, and plain statuses unchanged", () => {
  const rows = parseNameStatus(
    "M\tsites/x.com/app/page.tsx\n" +
    "R100\tCLAUDE.md\tdocs/notes/rulebook.md\n" +
    "C75\tdocs/a.md\tgates/copied.yaml\n" +
    "A\tdocs/new.md",
  );
  assert.deepEqual(rows, [
    { status: "M", path: "sites/x.com/app/page.tsx" },
    { status: "R100", oldPath: "CLAUDE.md", path: "docs/notes/rulebook.md" },
    { status: "C75", oldPath: "docs/a.md", path: "gates/copied.yaml" },
    { status: "A", path: "docs/new.md" },
  ]);
  assert.deepEqual(parseNameStatus(""), []);
});

test("rename bypass caught — guarded→unguarded rename is still guarded (the B2 hole)", () => {
  const { guarded, routine } = classifyChanged([
    { status: "R100", oldPath: "CLAUDE.md", path: "docs/notes/rulebook.md" },
  ]);
  assert.equal(guarded.length, 1, "renaming CLAUDE.md away must NOT be routine");
  assert.equal(guarded[0].rule, "CLAUDE.md");
  assert.equal(guarded[0].oldPath, "CLAUDE.md");
  assert.deepEqual(routine, []);
});

test("unguarded→guarded rename is guarded too — both directions", () => {
  const { guarded } = classifyChanged([
    { status: "R90", oldPath: "docs/notes/draft.md", path: "docs/design/BEAUTY_DOCTRINE.md" },
  ]);
  assert.equal(guarded.length, 1, "renaming ONTO a guarded path is a guarded change");
  assert.equal(guarded[0].rule, "docs/design/BEAUTY_DOCTRINE.md");
});

test("routine→routine rename stays routine — the auto-merge lane survives renames", () => {
  const { guarded, routine } = classifyChanged([
    { status: "R100", oldPath: "sites/x.com/app/old.tsx", path: "sites/x.com/app/new.tsx" },
  ]);
  assert.deepEqual(guarded, []);
  assert.deepEqual(routine, ["sites/x.com/app/new.tsx"]);
});

// ── the owners register scanner ──────────────────────────────────────────────

test("parseOwners reads the committed register, and it names the owner", () => {
  const p = parseOwners(readFileSync(resolve(REPO_ROOT, OWNERS), "utf8"));
  assert.deepEqual(p.errors, []);
  assert.equal(p.version, "1");
  assert.deepEqual(p.ownerLogins, [OWNER]);
});

test("parseOwners rejects what it cannot read — never an empty allow-list by accident", () => {
  assert.ok(parseOwners("garbage\n").errors.length > 0, "free text");
  assert.ok(parseOwners("version: 1\n").errors.some((e) => /no logins/.test(e)), "empty register");
  assert.ok(parseOwners("owner_logins:\n  - a\n").errors.some((e) => /version/.test(e)), "no version");
  assert.ok(parseOwners("version: 1\n  - rogue\n").errors.some((e) => /outside/.test(e)), "login outside block");
});

// ── trusted-base identity (pass-2 B3) ───────────────────────────────────────

test("resolveBaseOwners reads the BASE revision's register — a readable base yields its logins", () => {
  const baseText = `version: 1\nowner_logins:\n  - ${OWNER}\n`;
  const owners = resolveBaseOwners((p) => {
    assert.equal(p, OWNERS, "it must ask the base for gates/owners.yaml, nothing else");
    return baseText;
  });
  assert.deepEqual(owners.errors, []);
  assert.deepEqual(owners.ownerLogins, [OWNER]);
});

test("resolveBaseOwners FAILS CLOSED when the register is unreadable at base — empty list + loud message", () => {
  const owners = resolveBaseOwners(() => { throw new Error("fatal: path does not exist at base"); });
  assert.deepEqual(owners.ownerLogins, [], "no base register = NOBODY can authenticate, never an accidental allow-list");
  assert.equal(owners.errors.length, 1);
  assert.ok(/TRUSTED BASE/.test(owners.errors[0]) && /FAILS CLOSED/.test(owners.errors[0]) && /cannot approve this PR/.test(owners.errors[0]),
    "the fail-closed message must explain the base-trust rule");
});

test("self-added owner rejected — a login added in THIS PR is not in the BASE list, so its approval is NON-OWNER", () => {
  // The PR adds "evil-intern" to gates/owners.yaml in its own checkout. The
  // gate consults the BASE list (which does not contain them) — so their
  // APPROVED-at-head review authenticates nothing, and the failure explains
  // that owner-list changes are validated against the BASE list.
  const baseOwners = resolveBaseOwners(() => `version: 1\nowner_logins:\n  - ${OWNER}\n`);
  const v = evaluateOwnerApproval({
    guarded: [{ path: "gates/owners.yaml", rule: "gates/**" }],
    headSha: HEAD,
    reviews: [review("evil-intern", "APPROVED", HEAD, "2026-07-19T12:00:00Z")],
    ownerLogins: baseOwners.ownerLogins,
    ownersTouched: true,
  });
  assert.equal(v.ok, false);
  assert.ok(v.failures.some((f) => /NON-OWNER/.test(f) && /evil-intern/.test(f) && /BASE/.test(f)));
  assert.ok(v.failures.includes(OWNERS_BASE_NOTE),
    "when the diff touches the register, the failure must say the BASE list is the one consulted");
});

test("owners-touched note absent on an ordinary guarded diff — the note fires only when the register moves", () => {
  const v = evaluateOwnerApproval({
    guarded: GUARDED_ONE, headSha: HEAD, reviews: [], ownerLogins: [OWNER],
  });
  assert.equal(v.ok, false);
  assert.ok(!v.failures.includes(OWNERS_BASE_NOTE));
});

// ── evaluateOwnerApproval: the authentication core ──────────────────────────

test("out-of-scope pass — no guarded file touched needs no approval at all", () => {
  const v = evaluateOwnerApproval({ guarded: [], headSha: HEAD, reviews: [], ownerLogins: [OWNER] });
  assert.equal(v.ok, true);
  assert.deepEqual(v.failures, []);
});

test("approved-at-head pass — owner login, state APPROVED, commit_id === head", () => {
  const v = evaluateOwnerApproval({
    guarded: GUARDED_ONE, headSha: HEAD,
    reviews: [review("someone-else", "COMMENTED", HEAD), review(OWNER, "APPROVED", HEAD)],
    ownerLogins: [OWNER],
  });
  assert.equal(v.ok, true);
  assert.equal(v.approvedBy, OWNER);
});

test("stale-approval fail — an approval at an older commit_id does not count, and the message says so", () => {
  const v = evaluateOwnerApproval({
    guarded: GUARDED_ONE, headSha: HEAD,
    reviews: [review(OWNER, "APPROVED", "0ldc0mm1t")],
    ownerLogins: [OWNER],
  });
  assert.equal(v.ok, false);
  assert.ok(v.failures.some((f) => /STALE/.test(f) && /0ldc0mm1t/.test(f) && new RegExp(HEAD).test(f)),
    "the failure must name both SHAs and say the approval is stale");
  assert.ok(v.failures.some((f) => /WHAT TO CLICK/.test(f) && /Approve/.test(f)),
    "the failure must tell the owner exactly what to click");
});

test("non-owner-approval fail — APPROVED at head by a login not in the register", () => {
  const v = evaluateOwnerApproval({
    guarded: GUARDED_ONE, headSha: HEAD,
    reviews: [review("not-the-owner", "APPROVED", HEAD)],
    ownerLogins: [OWNER],
  });
  assert.equal(v.ok, false);
  assert.ok(v.failures.some((f) => /NON-OWNER/.test(f) && /not-the-owner/.test(f)));
});

test("CHANGES_REQUESTED / COMMENTED / DISMISSED never authenticate", () => {
  for (const state of ["CHANGES_REQUESTED", "COMMENTED", "DISMISSED"]) {
    const v = evaluateOwnerApproval({
      guarded: GUARDED_ONE, headSha: HEAD,
      reviews: [review(OWNER, state, HEAD)],
      ownerLogins: [OWNER],
    });
    assert.equal(v.ok, false, `state ${state} must not count as approval`);
  }
});

// ── effective review state (pass-2 B4: latest-state, not existence-of-event) ─

test("approve-then-request-changes FAILS — the later CHANGES_REQUESTED supersedes the approval event", () => {
  const v = evaluateOwnerApproval({
    guarded: GUARDED_ONE, headSha: HEAD,
    reviews: [
      review(OWNER, "APPROVED", HEAD, "2026-07-19T10:00:00Z"),
      review(OWNER, "CHANGES_REQUESTED", HEAD, "2026-07-19T11:00:00Z"),
    ],
    ownerLogins: [OWNER],
  });
  assert.equal(v.ok, false, "an APPROVED event coexisting with a later CHANGES_REQUESTED must not authenticate");
  assert.ok(v.failures.some((f) => /SUPERSEDED/.test(f) && /CHANGES_REQUESTED/.test(f) && /LATEST EFFECTIVE state/.test(f)),
    "the failure must explain effective-state semantics");
});

test("request-changes-then-approve PASSES — the latest effective review is APPROVED at head", () => {
  const v = evaluateOwnerApproval({
    guarded: GUARDED_ONE, headSha: HEAD,
    reviews: [
      review(OWNER, "CHANGES_REQUESTED", "0ldc0mm1t", "2026-07-19T10:00:00Z"),
      review(OWNER, "APPROVED", HEAD, "2026-07-19T11:00:00Z"),
    ],
    ownerLogins: [OWNER],
  });
  assert.equal(v.ok, true, "a review round must be recoverable — the fresh approval at head speaks");
  assert.equal(v.approvedBy, OWNER);
});

test("dismissal invalidates — a dismissed latest review authenticates nothing, and older approvals are not resurrected", () => {
  // GitHub mutates the dismissed review's state to DISMISSED in place.
  const v = evaluateOwnerApproval({
    guarded: GUARDED_ONE, headSha: HEAD,
    reviews: [
      review(OWNER, "APPROVED", HEAD, "2026-07-19T10:00:00Z"),
      review(OWNER, "DISMISSED", HEAD, "2026-07-19T11:00:00Z"),
    ],
    ownerLogins: [OWNER],
  });
  assert.equal(v.ok, false);
  assert.ok(v.failures.some((f) => /DISMISSED/.test(f) && /not resurrected/.test(f)));
});

test("latestEffectiveReviews groups by author, orders by submitted_at, drops PENDING", () => {
  const eff = latestEffectiveReviews([
    review("a", "APPROVED", "X", "2026-07-19T10:00:00Z"),
    review("a", "CHANGES_REQUESTED", "X", "2026-07-19T11:00:00Z"),
    review("b", "CHANGES_REQUESTED", "X", "2026-07-19T09:00:00Z"),
    review("b", "APPROVED", "X", "2026-07-19T12:00:00Z"),
    { user: { login: "c" }, state: "PENDING", commit_id: "X" }, // unsubmitted draft — never speaks
  ]);
  assert.equal(eff.get("a").state, "CHANGES_REQUESTED");
  assert.equal(eff.get("b").state, "APPROVED");
  assert.equal(eff.has("c"), false);
});

test("stale-but-latest approval reports STALE, not superseded — the two failure shapes stay distinct", () => {
  const v = evaluateOwnerApproval({
    guarded: GUARDED_ONE, headSha: HEAD,
    reviews: [
      review(OWNER, "CHANGES_REQUESTED", "0lder", "2026-07-19T09:00:00Z"),
      review(OWNER, "APPROVED", "0ldc0mm1t", "2026-07-19T10:00:00Z"),
    ],
    ownerLogins: [OWNER],
  });
  assert.equal(v.ok, false);
  assert.ok(v.failures.some((f) => /STALE/.test(f) && /0ldc0mm1t/.test(f)));
});

// ── pagination (pass-2 B4: effective state needs the FULL review list) ──────

const page = (n) => Array.from({ length: n }, (_, i) => review(`u${i}`, "COMMENTED", "X", `2026-07-19T00:00:0${i % 10}Z`));
const mockFetch = (pages) => {
  const calls = [];
  const impl = async (url) => {
    calls.push(url);
    const pageNo = Number(new URL(url).searchParams.get("page"));
    return { ok: true, json: async () => pages[pageNo - 1] ?? [] };
  };
  impl.calls = calls;
  return impl;
};

test("fetchReviews paginates — a 100-review page is followed, a short page ends the walk", async () => {
  const impl = mockFetch([page(100), page(3)]);
  const reviews = await fetchReviews({ repo: "o/r", prNumber: 7, token: "t" }, impl);
  assert.equal(reviews.length, 103);
  assert.equal(impl.calls.length, 2);
  assert.ok(impl.calls[0].includes("per_page=100") && impl.calls[0].includes("page=1"));
  assert.ok(impl.calls[1].includes("page=2"));
});

test("fetchReviews REFUSES a truncated list — full pages past the cap throw loudly, never silently drop", async () => {
  const impl = mockFetch(Array.from({ length: REVIEWS_MAX_PAGES + 5 }, () => page(100)));
  await assert.rejects(
    () => fetchReviews({ repo: "o/r", prNumber: 7, token: "t" }, impl),
    (e) => /TRUNCATED/.test(e.message) && /CHANGES_REQUESTED/.test(e.message),
    "a truncated review list could hide the owner's latest CHANGES_REQUESTED — refusing must be loud",
  );
});

test("fetchReviews surfaces an API error status, never an empty pass", async () => {
  await assert.rejects(
    () => fetchReviews({ repo: "o/r", prNumber: 7, token: "t" }, async () => ({ ok: false, status: 403 })),
    /403/,
  );
});

// ── the ledger scanner (superset: artifact_sha256) ──────────────────────────

test("parseLedger reads rows incl. artifact_sha256, and unquotes values", () => {
  const p = parseLedger(ROW(`    artifact_sha256: "${HASH}"\n`));
  assert.deepEqual(p.errors, []);
  assert.equal(p.rows.length, 1);
  assert.equal(p.rows[0].artifact_sha256, HASH);
  assert.equal(p.rows[0].artifact, "docs/x.md");
});

test("parseLedger fails loudly on what it cannot read", () => {
  assert.ok(parseLedger("total garbage here\n").errors.length > 0);
});

// ── hash binding: the approval binds to the exact bytes ─────────────────────

const hashOf = (repoPath) => (repoPath === "docs/x.md" ? HASH : null);
const ledger = (headExtra, baseText = null) => ({
  ledgers: [{ path: "launches/x.com/approvals.yaml", baseText, headText: ROW(headExtra) }],
  hashOf,
});

test("hash-match pass — added approved row with artifact + matching artifact_sha256", () => {
  assert.deepEqual(checkHashBinding(ledger(`    artifact_sha256: ${HASH}\n`)), []);
});

test("approved-row-without-hash fail — with the exact remedy line", () => {
  const out = checkHashBinding(ledger(""));
  assert.equal(out.length, 1);
  assert.ok(out[0].includes("no artifact_sha256"));
  assert.ok(out[0].includes(HASH_REMEDY), "the exact remedy line must be printed");
});

test("hash-mismatch fail — the row's hash must equal the committed bytes' hash", () => {
  const wrong = sha256Hex("different bytes");
  const out = checkHashBinding(ledger(`    artifact_sha256: ${wrong}\n`));
  assert.equal(out.length, 1);
  assert.ok(/MISMATCH/.test(out[0]) && out[0].includes(wrong) && out[0].includes(HASH));
});

test("artifact that is not a committed file fails — prose is not a path", () => {
  const bad = {
    ledgers: [{ path: "launches/x.com/approvals.yaml", baseText: null, headText: ROW(`    artifact_sha256: ${HASH}\n`).replace("docs/x.md", "docs/x.md · plus prose") }],
    hashOf,
  };
  const out = checkHashBinding(bad);
  assert.equal(out.length, 1);
  assert.ok(/not a committed file/.test(out[0]));
});

test("PRE-EXISTING unchanged rows are out of scope — backfill rides the next touch", () => {
  // Same hash-less approved row in base and head: the diff did not touch it.
  assert.deepEqual(checkHashBinding(ledger("", ROW(""))), []);
  // But the moment the row CHANGES (date bumped), the binding requirement fires.
  const touched = checkHashBinding(ledger("", ROW("").replace("17:30:00", "18:00:00")));
  assert.equal(touched.length, 1);
});

test("changedApprovedRows: added + modified fire; unchanged and pending do not", () => {
  const base = ROW("");
  const headUnchanged = ROW("");
  assert.deepEqual(changedApprovedRows({ baseText: base, headText: headUnchanged }).touched, []);

  const headModified = ROW("").replace("docs/x.md", "docs/y.md");
  assert.equal(changedApprovedRows({ baseText: base, headText: headModified }).touched.length, 1);

  const headAdded = ROW("") + `  - gate: strategy
    status: approved
    owner: Abilash
    date: 2026-07-19 17:31:00 IST
    artifact: docs/s.md
`;
  const added = changedApprovedRows({ baseText: base, headText: headAdded }).touched;
  assert.deepEqual(added.map((r) => r.gate), ["strategy"]);

  const headPending = ROW("") + `  - gate: strategy
    status: pending
    owner: ""
    date: ""
    artifact: ""
`;
  assert.deepEqual(changedApprovedRows({ baseText: base, headText: headPending }).touched, [],
    "a pending row needs no hash — it is not an approval yet");

  const newLedger = changedApprovedRows({ baseText: null, headText: ROW("") }).touched;
  assert.equal(newLedger.length, 1, "a brand-new ledger's approved rows are all touched");
});

// ── the guarded list itself ─────────────────────────────────────────────────

test("GUARDED names every path class the task binds — nothing quietly dropped", () => {
  for (const must of [
    "launches/*/approvals.yaml", "CLAUDE.md", "gates/**",
    "docs/process/os-2026/standards/**", "docs/process/os-2026/workflows/**",
    "docs/design/BEAUTY_DOCTRINE.md", "docs/design/what-is-beauty-owner-paper-2026-07-18.md",
    "docs/marketing/go-science/**", "evolution/**", "decisions/**",
    "scripts/front-gate.mjs", "scripts/authenticated-approval.mjs",
    "scripts/merge-continuity-lint.mjs", "scripts/standards-acceptance.mjs",
    "scripts/class-map-lint.mjs", "scripts/gate-registry-lint.mjs",
    "scripts/go-science-audit.mjs", "scripts/beauty-audit.mjs",
    "docs/process/os-2026/merge/merge-continuity.yaml",
    // pass-2 B2 additions — the enforcement point, its rewriter, the merge law, the wiring
    ".github/workflows/**", "scripts/neutralize-workflows.mjs",
    "docs/process/os-2026/merge/**",
    "package.json", "pnpm-workspace.yaml", "turbo.json",
    // pass-2 B2 re-fix — the lockfile + the enforcers' executable closure
    "pnpm-lock.yaml", "scripts/design-review.mjs",
    "scripts/audit-gpt.mjs", "scripts/audit-perplexity.mjs", "scripts/lib/**",
  ]) assert.ok(GUARDED.includes(must), `${must} missing from GUARDED`);
});

// ── workflow-derived guards (adversarial verifier BLOCKING finding) ─────────
// A merge-blocking enforcer the workflows invoke but the static list omits was
// classified ROUTINE — a routine auto-merge PR could rewrite it to
// process.exit(0) and silently disable its check. The fix is DYNAMIC: the
// guard set is derived from the workflows at the trusted revision, so the
// next workflow-added enforcer is guarded with no list to remember to update.

/** The ten scripts the verifier named — every one merge-blocking in factory-gate.yml. */
const TEN_ENFORCERS = [
  "scripts/banned-string-lint.mjs", "scripts/cta-label-lint.mjs",
  "scripts/placeholder-lint.mjs", "scripts/content-lint.mjs",
  "scripts/seed-lint.mjs", "scripts/keyword-validate.mjs",
  "scripts/factory-matrix-lint.mjs", "scripts/launch-evidence-gate.mjs",
  "scripts/chat-bubble-lint.mjs", "scripts/lighthouse-gate.mjs",
];

/** The real repo's workflows, read from disk via the same injectable seams the CLI uses. */
const realWorkflowGuards = () => resolveWorkflowGuardedScripts({
  listWorkflows: () => readdirSync(resolve(REPO_ROOT, WORKFLOWS_DIR)).map((f) => `${WORKFLOWS_DIR}/${f}`),
  show: (p) => readFileSync(resolve(REPO_ROOT, p), "utf8"),
});

test("the ten verifier-named enforcers classify GUARDED via the workflow-derived set — and are NOT statically guarded (the closed hole, both directions)", () => {
  const wf = realWorkflowGuards();
  assert.equal(wf.degraded, false, "the real repo's workflows must be readable");
  const rule = makeGuardRule(wf.scripts);
  for (const s of TEN_ENFORCERS) {
    assert.equal(guardRule(s), null, `${s} is not in the static GUARDED list — the verifier's premise, and why the derivation exists`);
    assert.ok(wf.scripts.includes(s), `${s} must be extracted from the workflows`);
    assert.equal(rule(s), s, `${s} must classify GUARDED via the workflow-derived set`);
  }
  // The derivation reaches what a static scripts/*.mjs list would miss:
  assert.ok(wf.scripts.includes("scripts/uptime/check.mjs"), "nested paths (uptime.yml) are derived too");
  assert.ok(wf.scripts.includes("scripts/gate-emit.mjs"), "a comment-only mention still guards — over-guarding a mentioned enforcer is safe, missing an invoked one is the hole");
  // And it does NOT drag routine scripts into the guard — the auto-merge lane survives:
  assert.equal(rule("scripts/status-build.mjs"), null, "unreferenced scripts stay routine");
  assert.equal(rule("sites/x.com/app/page.tsx"), null);
});

test("classifyChanged with the effective rule guards an enforcer edit that the static rule waves through — the exact attack, both classifiers", () => {
  const changed = [{ status: "M", path: "scripts/banned-string-lint.mjs" }];
  const staticOnly = classifyChanged(changed);
  assert.deepEqual(staticOnly.routine, ["scripts/banned-string-lint.mjs"],
    "under the static list alone the attack PR is routine — the verifier's finding");
  const wf = realWorkflowGuards();
  const effective = classifyChanged(changed, makeGuardRule(wf.scripts));
  assert.equal(effective.guarded.length, 1, "under the effective rule the same PR needs the owner");
  assert.equal(effective.guarded[0].rule, "scripts/banned-string-lint.mjs");
  assert.deepEqual(effective.routine, []);
});

test("workflow-coverage control probe passes on the real repo state", () => {
  assert.deepEqual(workflowCoverageProbe(), [],
    "every `node scripts/*.mjs` invocation in the real workflows must classify GUARDED");
});

test("workflow-coverage control probe FAILS when derivation is unplugged — static-only coverage is not coverage", () => {
  const failures = workflowCoverageProbe(REPO_ROOT, () => guardRule);
  assert.ok(failures.length > 0, "a classifier without the derived set must fail the probe");
  assert.ok(failures.some((f) => /ROUTINE/.test(f) && /banned-string-lint\.mjs/.test(f)),
    "the failure must name the unguarded enforcer and say it classifies ROUTINE");
  assert.ok(failures.some((f) => /process\.exit\(0\)/.test(f)),
    "the failure must explain the attack it blocks");
});

test("extractWorkflowScriptRefs — mention forms in, lookalikes out", () => {
  const text = [
    "      - run: node scripts/a-lint.mjs --quiet",
    "        OUT=$(node scripts/uptime/check.mjs 2>&1)",
    "      # re-runs scripts/gate-emit.mjs at the merged commit",
    '        run: node "scripts/quoted.mjs"',
    "        run: node ./scripts/dotted.mjs",
    "      - run: node scripts/a-lint.mjs   # duplicate — deduped",
  ].join("\n");
  assert.deepEqual(extractWorkflowScriptRefs(text), [
    "scripts/a-lint.mjs", "scripts/dotted.mjs", "scripts/gate-emit.mjs",
    "scripts/quoted.mjs", "scripts/uptime/check.mjs",
  ]);
  assert.deepEqual(extractWorkflowScriptRefs("prescripts/foo.mjs vendor/scripts/foo.mjs scripts/foo.mjsx scripts/ scripts/foo.js"), [],
    "prefix bleed, nested lookalikes, .mjsx and .js must not be extracted");
});

test("extractWorkflowScriptInvocations — only `node …` forms count, and every invocation is also a mention (the probe's soundness invariant)", () => {
  const text = [
    "      - run: node scripts/a-lint.mjs --quiet",
    "        OUT=$(node scripts/uptime/check.mjs 2>&1)",
    "        run: node --test scripts/flagged.mjs",
    "      # a comment mentioning scripts/gate-emit.mjs is NOT an invocation",
    "        run: ./scripts/direct.mjs   # direct execution without node — mention only",
  ].join("\n");
  assert.deepEqual(extractWorkflowScriptInvocations(text),
    ["scripts/a-lint.mjs", "scripts/flagged.mjs", "scripts/uptime/check.mjs"]);
  // Invariant: mentions ⊇ invocations — on synthetic text and on every real workflow file.
  for (const inv of extractWorkflowScriptInvocations(text)) {
    assert.ok(extractWorkflowScriptRefs(text).includes(inv));
  }
  for (const f of readdirSync(resolve(REPO_ROOT, WORKFLOWS_DIR)).filter((n) => /\.ya?ml$/.test(n))) {
    const wfText = readFileSync(resolve(REPO_ROOT, WORKFLOWS_DIR, f), "utf8");
    const refs = extractWorkflowScriptRefs(wfText);
    for (const inv of extractWorkflowScriptInvocations(wfText)) {
      assert.ok(refs.includes(inv), `${f}: invocation ${inv} must be visible to the derivation`);
    }
  }
});

test("a workflow-referenced script the static list lacks is still guarded — the derivation is the guard (fixture: scripts/new-gate.mjs)", () => {
  const wf = resolveWorkflowGuardedScripts({
    listWorkflows: () => [`${WORKFLOWS_DIR}/ci.yml`],
    show: () => "jobs:\n  gate:\n    steps:\n      - run: node scripts/new-gate.mjs --strict\n",
  });
  assert.equal(wf.degraded, false);
  assert.deepEqual(wf.scripts, ["scripts/new-gate.mjs"]);
  assert.equal(guardRule("scripts/new-gate.mjs"), null, "premise: the static list has never heard of it");
  const rule = makeGuardRule(wf.scripts);
  assert.equal(rule("scripts/new-gate.mjs"), "scripts/new-gate.mjs", "derived, therefore guarded");
  assert.equal(rule("scripts/not-in-any-workflow.mjs"), null, "…and ONLY the referenced script is added");
  const { guarded, routine } = classifyChanged([{ status: "M", path: "scripts/new-gate.mjs" }], rule);
  assert.equal(guarded.length, 1);
  assert.deepEqual(routine, []);
});

test("workflow-coverage probe on a fixture tree — passes with derivation, fails without it, and a missing/blind workflows dir is loud", () => {
  const tmp = mkdtempSync(join(tmpdir(), "auth-approval-probe-"));
  try {
    mkdirSync(join(tmp, WORKFLOWS_DIR), { recursive: true });
    writeFileSync(join(tmp, WORKFLOWS_DIR, "ci.yml"),
      "jobs:\n  gate:\n    steps:\n      - run: node scripts/new-gate.mjs --strict\n");
    assert.deepEqual(workflowCoverageProbe(tmp), [],
      "the default classifier derives from the same files, so a wired-in enforcer is covered");
    const failures = workflowCoverageProbe(tmp, () => guardRule);
    assert.equal(failures.length, 1, "without derivation the new enforcer is uncovered — the probe must say so");
    assert.ok(/new-gate\.mjs/.test(failures[0]) && /ROUTINE/.test(failures[0]));

    // A workflow with zero node invocations makes the probe declare itself blind:
    writeFileSync(join(tmp, WORKFLOWS_DIR, "ci.yml"), "jobs:\n  noop:\n    steps:\n      - run: echo ok\n");
    assert.ok(workflowCoverageProbe(tmp).some((f) => /ZERO/.test(f) && /blind/.test(f)));

    // No workflows dir at all — the probe cannot prove coverage and must not pass:
    rmSync(join(tmp, WORKFLOWS_DIR), { recursive: true });
    assert.ok(workflowCoverageProbe(tmp).some((f) => /does not exist/.test(f)));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("DEGRADED fail-closed mode — unreadable workflows at the trusted revision guard ALL scripts/**.mjs, loudly (every failure shape)", () => {
  const listingThrows = resolveWorkflowGuardedScripts({ listWorkflows: () => { throw new Error("fatal: bad revision"); }, show: () => "" });
  const fileThrows = resolveWorkflowGuardedScripts({
    listWorkflows: () => [`${WORKFLOWS_DIR}/ci.yml`],
    show: () => { throw new Error("fatal: path does not exist"); },
  });
  const noFiles = resolveWorkflowGuardedScripts({ listWorkflows: () => [], show: () => "" });
  for (const [name, wf] of [["listing throws", listingThrows], ["a file is unreadable", fileThrows], ["no workflow files visible", noFiles]]) {
    assert.equal(wf.degraded, true, `${name} must degrade`);
    assert.deepEqual(wf.scripts, []);
    assert.ok(wf.notes.some((n) => /DEGRADED FAIL-CLOSED/.test(n) && /GUARDED/.test(n)), `${name} must say so loudly`);
  }
  const rule = makeGuardRule(listingThrows.scripts, { degraded: listingThrows.degraded });
  for (const s of [...TEN_ENFORCERS, "scripts/uptime/check.mjs", "scripts/anything-at-all.mjs", "scripts/lib/deep/helper.mjs"]) {
    assert.equal(rule(s) !== null, true, `degraded mode must guard ${s}`);
    assert.ok([DEGRADED_SCRIPTS_PATTERN, guardRule(s)].includes(rule(s)));
  }
  // …but degradation closes the SCRIPTS lane, not the whole repo:
  assert.equal(rule("sites/x.com/app/page.tsx"), null, "site work stays routine even degraded");
  assert.equal(rule("packages/ui/tokens.css"), null);
});

test("readable workflows do NOT degrade — the fail-closed path arms only on failure (the other direction)", () => {
  const wf = resolveWorkflowGuardedScripts({
    listWorkflows: () => [`${WORKFLOWS_DIR}/ci.yml`, `${WORKFLOWS_DIR}/README.md`],
    show: (p) => (p.endsWith("ci.yml") ? "run: node scripts/a.mjs\n" : assert.fail("non-workflow files must not be read")),
  });
  assert.equal(wf.degraded, false);
  assert.deepEqual(wf.notes, []);
  assert.deepEqual(wf.scripts, ["scripts/a.mjs"]);
  const rule = makeGuardRule(wf.scripts, { degraded: wf.degraded });
  assert.equal(rule("scripts/unreferenced.mjs"), null,
    "outside degraded mode, only referenced scripts are guarded — no accidental all-scripts lockdown");
});
