// front-gate.test.js — tests for the session-2D FRONT gates: the approvals
// ledger, the arming rule, and the scaffold that writes both.
//
// House rule (matrix-walk.test.js, factory-hardening.test.js): every detector is
// tested in BOTH directions — the clean input must PASS and the broken input
// must FAIL, for the same detector, in the same run. A gate that always says no
// and a gate that always says yes are equally useless. This matters more here
// than anywhere else in the repo: a front gate that blocks everything gets
// switched off within a day, and a front gate that blocks nothing is a comment.
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  MODE_B_GATE, REQUIRED_GATES, VALID_STATUS,
  checkFrontGate, newSiteDomain, pageDomain, parseApprovals,
  runControlProbes as frontProbes, unsignedGates,
} from "../front-gate.mjs";
import {
  approvalsLedger, designIntakeReadme, designIntakeReferences,
} from "../launch-scaffold.mjs";

const WHEN = "2026-07-17 19:00:00 IST";
const signed = (gate) => `  - gate: ${gate}
    status: approved
    owner: Abilash
    date: ${WHEN}
    artifact: docs/x.md`;
const ledger = (mode, gates) => `domain: x.com\nmode: ${mode}\napprovals:\n${gates.map(signed).join("\n")}\n`;
const PAGE = [{ status: "M", path: "sites/x.com/app/page.tsx" }];

// ── the control probes ───────────────────────────────────────────────────────

test("front-gate control probes pass (the gate is not broken)", () => {
  assert.deepEqual(frontProbes(), []);
});

// ── page detection: what arms the gate, and what must not ───────────────────

test("pageDomain catches pages, and does NOT catch config/tests/assets", () => {
  assert.equal(pageDomain("sites/x.com/app/page.tsx"), "x.com");
  assert.equal(pageDomain("sites/x.com/content/about.mdx"), "x.com");
  assert.equal(pageDomain("sites/x.com/pages/contact.tsx"), "x.com");
  // A dependency bump or a test fix on an approved site is not a design decision.
  assert.equal(pageDomain("sites/x.com/site.config.json"), null);
  assert.equal(pageDomain("sites/x.com/test/foo.test.js"), null);
  assert.equal(pageDomain("sites/x.com/public/logo.svg"), null);
  assert.equal(pageDomain("packages/ui/brand-tokens.css"), null);
});

test("newSiteDomain fires only on the site config that introduces a site", () => {
  assert.equal(newSiteDomain("sites/x.com/site.config.json"), "x.com");
  assert.equal(newSiteDomain("sites/x.com/app/page.tsx"), null);
});

// ── the ledger parser: strict, and loud when it cannot read ──────────────────

test("parseApprovals reads a well-formed ledger", () => {
  const p = parseApprovals(ledger("A", REQUIRED_GATES));
  assert.deepEqual(p.errors, []);
  assert.equal(p.domain, "x.com");
  assert.equal(p.mode, "A");
  assert.deepEqual(p.rows.map((r) => r.gate), REQUIRED_GATES);
  assert.equal(p.rows[0].owner, "Abilash");
});

test("parseApprovals rejects what it cannot read — never silently passes", () => {
  assert.ok(parseApprovals("garbage\n").errors.length > 0, "free text");
  assert.ok(parseApprovals(ledger("C", ["brief"])).errors.some((e) => /mode/.test(e)), "bogus mode");
  assert.ok(
    parseApprovals(ledger("A", REQUIRED_GATES).replace("status: approved", "status: probably"))
      .errors.some((e) => /status must be one of/.test(e)),
    "invented status",
  );
  assert.ok(parseApprovals("mode: A\napprovals:\n").errors.some((e) => /no gate rows/.test(e)), "empty ledger");
  assert.ok(parseApprovals("domain: x.com\napprovals:\n" + signed("brief")).errors.some((e) => /mode/.test(e)), "no mode");
});

test("VALID_STATUS is the closed set the ledger template writes", () => {
  assert.deepEqual(VALID_STATUS, ["pending", "approved", "changes"]);
});

// ── unsignedGates: the heart ────────────────────────────────────────────────

test("a fully signed MODE A ledger blocks nothing", () => {
  const p = parseApprovals(ledger("A", REQUIRED_GATES));
  assert.deepEqual(unsignedGates({ domain: "x.com", mode: p.mode, rows: p.rows }), []);
});

test("every required gate blocks when unsigned — one blocker each, none missed", () => {
  const p = parseApprovals(ledger("A", REQUIRED_GATES).replaceAll("status: approved", "status: pending"));
  const out = unsignedGates({ domain: "x.com", mode: "A", rows: p.rows });
  assert.equal(out.length, REQUIRED_GATES.length);
  for (const g of REQUIRED_GATES) assert.ok(out.some((o) => o.startsWith(`${g}:`)), `${g} not blocked`);
});

test("a missing row blocks — an unopened gate is not an absent requirement", () => {
  const p = parseApprovals(ledger("A", ["brief", "strategy", "design_source"]));
  const out = unsignedGates({ domain: "x.com", mode: "A", rows: p.rows });
  assert.equal(out.length, 1);
  assert.match(out[0], /golden_page: NO ROW/);
});

test('status "changes" blocks and says so — the owner asked for changes', () => {
  const p = parseApprovals(ledger("A", REQUIRED_GATES).replace("status: approved", "status: changes"));
  const out = unsignedGates({ domain: "x.com", mode: "A", rows: p.rows });
  assert.equal(out.length, 1);
  assert.match(out[0], /he asked for changes/);
});

test("approved but unsigned (no owner/date/artifact) blocks — the anti-rubber-stamp check", () => {
  const rows = [
    { gate: "brief", status: "approved", owner: "", date: "", artifact: "" },
    ...REQUIRED_GATES.slice(1).map((gate) => ({ gate, status: "approved", owner: "A", date: WHEN, artifact: "x" })),
  ];
  const out = unsignedGates({ domain: "x.com", mode: "A", rows });
  assert.equal(out.length, 1);
  assert.match(out[0], /owner \+ date \+ artifact blank/);
});

test("MODE B requires design_direction; MODE A does not — the modes really differ", () => {
  const rows = parseApprovals(ledger("B", REQUIRED_GATES)).rows;
  const b = unsignedGates({ domain: "x.com", mode: "B", rows });
  assert.equal(b.length, 1);
  assert.match(b[0], new RegExp(`${MODE_B_GATE}: NO ROW`));

  // Same rows, MODE A: nothing missing.
  assert.deepEqual(unsignedGates({ domain: "x.com", mode: "A", rows }), []);

  // MODE B with the row signed: clean.
  const withB = parseApprovals(ledger("B", [...REQUIRED_GATES, MODE_B_GATE])).rows;
  assert.deepEqual(unsignedGates({ domain: "x.com", mode: "B", rows: withB }), []);
});

// ── checkFrontGate: the arming rule and its escape routes ───────────────────

test("armed + signed passes; armed + pending blocks (both directions, one detector)", () => {
  const ok = checkFrontGate({ changed: PAGE, ledgers: { "x.com": ledger("A", REQUIRED_GATES) } });
  assert.deepEqual(ok.blockers, []);
  assert.deepEqual(ok.armed, ["x.com"]);

  const bad = checkFrontGate({
    changed: PAGE,
    ledgers: { "x.com": ledger("A", REQUIRED_GATES).replaceAll("status: approved", "status: pending") },
  });
  assert.equal(bad.blockers.length, 4);
});

test("a page change on a pre-gate site is UNARMED, not blocked — and never silent", () => {
  const r = checkFrontGate({ changed: PAGE, ledgers: { "x.com": null } });
  assert.deepEqual(r.blockers, []);
  assert.deepEqual(r.unarmed, ["x.com"], "must be REPORTED, so the exemption cannot hide");
});

test("ESCAPE ROUTE 1 — a new site without a ledger is blocked (the scaffold cannot be skipped)", () => {
  const r = checkFrontGate({
    changed: [{ status: "A", path: "sites/x.com/site.config.json" }],
    ledgers: { "x.com": null },
  });
  assert.equal(r.blockers.length, 1);
  assert.match(r.blockers[0], /is NEW but has no launches\/x\.com\/approvals\.yaml/);
});

test("ESCAPE ROUTE 2 — deleting a ledger is blocked (an armed gate cannot be disarmed)", () => {
  const r = checkFrontGate({
    changed: [{ status: "D", path: "launches/x.com/approvals.yaml" }],
    ledgers: { "x.com": null },
  });
  assert.equal(r.blockers.length, 1);
  assert.match(r.blockers[0], /is DELETED in this PR/);
});

test("ESCAPE ROUTE 3 — an unreadable ledger blocks; it does not wave through", () => {
  const r = checkFrontGate({ changed: PAGE, ledgers: { "x.com": "mode: yes please\n" } });
  assert.ok(r.blockers.length > 0);
  assert.ok(r.blockers.every((b) => /unreadable/.test(b)));
});

test("deleting a page does not need an approval — removing is not building", () => {
  const r = checkFrontGate({
    changed: [{ status: "D", path: "sites/x.com/app/old.tsx" }],
    ledgers: { "x.com": ledger("A", REQUIRED_GATES).replaceAll("status: approved", "status: pending") },
  });
  assert.deepEqual(r.blockers, []);
});

test("one unapproved site does not block another approved site in the same PR", () => {
  const r = checkFrontGate({
    changed: [
      { status: "M", path: "sites/x.com/app/page.tsx" },
      { status: "M", path: "sites/y.com/app/page.tsx" },
    ],
    ledgers: {
      "x.com": ledger("A", REQUIRED_GATES),
      "y.com": ledger("A", REQUIRED_GATES).replaceAll("status: approved", "status: pending").replace("domain: x.com", "domain: y.com"),
    },
  });
  assert.ok(r.blockers.every((b) => b.includes("y.com")), "x.com must not be blamed for y.com");
  assert.deepEqual(r.armed, ["x.com", "y.com"]);
});

// ── the scaffolded artifacts ────────────────────────────────────────────────

test("the scaffolded ledger is born pending, and front-gate blocks it", () => {
  const text = approvalsLedger("x.com", WHEN);
  const p = parseApprovals(text);
  assert.deepEqual(p.errors, [], `the scaffold must emit a ledger its own gate can read: ${p.errors[0]}`);
  assert.equal(p.mode, "A", "MODE A is the default — human-supplied design is the preferred path");
  assert.ok(p.rows.every((r) => r.status === "pending"), "a scaffolded gate is never pre-approved");
  const r = checkFrontGate({ changed: PAGE, ledgers: { "x.com": text } });
  assert.equal(r.blockers.length, REQUIRED_GATES.length, "a fresh scaffold must block every required gate");
});

test("the scaffolded ledger carries every gate row, including the MODE B one", () => {
  const p = parseApprovals(approvalsLedger("x.com", WHEN));
  for (const g of [...REQUIRED_GATES, MODE_B_GATE]) {
    assert.ok(p.rows.some((r) => r.gate === g), `scaffold omitted the ${g} row`);
  }
});

test("the design-intake README tells the human what to drop and forbids redesign", () => {
  const r = designIntakeReadme("x.com", WHEN);
  for (const must of [/screenshots/i, /reference-site URLs/i, /wireframe/i, /page-order\.md/, /section/i]) {
    assert.match(r, must);
  }
  assert.match(r, /does not redesign it/i, "MODE A's core rule must be stated to the human");
  assert.match(r, /stops and flags it/i, "the flag-don't-override rule must be stated");
});

test("REFERENCES.md is owner-only and names the brand-manual override rule", () => {
  const r = designIntakeReferences("x.com", WHEN);
  assert.match(r, /agent does NOT write this file/i);
  assert.match(r, /brand manuals win/i, "doctrine (d) must survive MODE B");
  assert.match(r, /Anti-references/i);
});
