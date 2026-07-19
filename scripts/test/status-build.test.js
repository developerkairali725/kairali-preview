// status-build.test.js — fixture-driven tests for the schema-2 Fleet Pulse
// aggregator (scripts/status-build.mjs).
//
// House rule (front-gate.test.js et al.): every detector is tested in BOTH
// directions — the clean input must PASS and the broken input must FAIL, for
// the same detector, in the same run. Applied here as positive + negative
// fixtures for every derivation: phase mapping, vector match (incl. compound
// STATUS names), approvals parse, evidence counts, waiting_on extraction, and
// schema completeness.
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import {
  MILESTONES, STAGES, WAITING_NAMES,
  buildSnapshot, countDecisions, countOpenQuestions, countStrictResidues,
  countUnackedDirectives, evidenceFor, frontGatesFromLedger,
  parseClassMapProperties, parseStatusYaml, siteDomain, stageToPhase,
  timestamps, validate, vectorFor, waitingOn,
} from "../status-build.mjs";

// ── phase derivation ─────────────────────────────────────────────────────────

test("stageToPhase maps every stage of the enum to its lifecycle phase", () => {
  assert.equal(stageToPhase("ideation"), 0);
  assert.equal(stageToPhase("research"), 1); // spans 1-2; lower bound rendered
  assert.equal(stageToPhase("build"), 4);
  assert.equal(stageToPhase("gates"), 5);
  assert.equal(stageToPhase("preview"), 5);
  assert.equal(stageToPhase("human_audit"), 5);
  assert.equal(stageToPhase("ok_to_publish"), 6);
  assert.equal(stageToPhase("live"), 7);
  assert.equal(stageToPhase("monitoring"), 8);
});

test("stageToPhase renders unknown as null, never a guess", () => {
  assert.equal(stageToPhase("shipping"), null);
  assert.equal(stageToPhase(""), null);
  assert.equal(stageToPhase(undefined), null);
  // prototype pollution guard: only own keys of the map count
  assert.equal(stageToPhase("toString"), null);
});

test("every stage in the STAGES enum derives a non-null phase", () => {
  for (const s of STAGES) assert.notEqual(stageToPhase(s), null, s);
});

// ── domain derivation from compound STATUS names ─────────────────────────────

test("siteDomain: plain, compound, and parenthetical names", () => {
  assert.equal(siteDomain("kairali.com"), "kairali.com");
  assert.equal(
    siteDomain("kairaliorganic.com / kairorganics.com / kairproducts.com"),
    "kairaliorganic.com",
  );
  assert.equal(siteDomain("kairaliproducts.us / .cz / kairaliproduct.com"), "kairaliproducts.us");
  assert.equal(siteDomain("ayurvedichealingvillage.com (KTAHV)"), "ayurvedichealingvillage.com");
});

// ── class-map vector ─────────────────────────────────────────────────────────

const CLASS_MAP_FIXTURE = `# gates/class-map.yaml fixture
version: 1
updated: "2026-07-19 18:14:20 IST"
dimensions:
  site_class: [commerce, organic, landing]
properties:
  - domain: alpha.com
    site_class: organic
    business_model: b2c
    asset_situation: existing
    entity_register: group-corporate
    locale_market: en-global
    platform: factory-next
  # a comment between rows must not break the parser
  - domain: beta.com
    site_class: commerce
    business_model: unknown           # owner ratification pending — fixture trailing comment
    asset_situation: new
    entity_register: kappl-product
    locale_market: en-in
    platform: shopify
overlays: []
`;

test("vectorFor: exact match yields the five contract keys, in order", () => {
  const props = parseClassMapProperties(CLASS_MAP_FIXTURE);
  const v = vectorFor(props, "alpha.com");
  assert.deepEqual(v, {
    site_class: "organic",
    business_model: "b2c",
    asset_situation: "existing",
    entity_register: "group-corporate",
    platform: "factory-next",
  });
  // key ORDER is part of the deterministic-output contract
  assert.deepEqual(Object.keys(v), [
    "site_class", "business_model", "asset_situation", "entity_register", "platform",
  ]);
});

test("vectorFor: trailing comments are stripped; locale_market never leaks into the vector", () => {
  const props = parseClassMapProperties(CLASS_MAP_FIXTURE);
  const v = vectorFor(props, "beta.com");
  assert.equal(v.business_model, "unknown");
  assert.equal("locale_market" in v, false);
});

test("vectorFor: compound STATUS name resolves via its FIRST domain", () => {
  const props = parseClassMapProperties(CLASS_MAP_FIXTURE);
  const domain = siteDomain("beta.com / gamma.com / delta.com");
  assert.deepEqual(vectorFor(props, domain).site_class, "commerce");
});

test("vectorFor: a site absent from the class-map renders vector null (negative)", () => {
  const props = parseClassMapProperties(CLASS_MAP_FIXTURE);
  assert.equal(vectorFor(props, "nowhere.com"), null);
});

test("parseClassMapProperties reads ONLY the properties block, not overlays or dimensions", () => {
  const props = parseClassMapProperties(CLASS_MAP_FIXTURE);
  assert.deepEqual([...props.keys()], ["alpha.com", "beta.com"]);
});

// ── front gates from approvals.yaml ──────────────────────────────────────────

const LEDGER_FIXTURE = `domain: alpha.com
mode: B
approvals:
  - gate: brief
    status: approved
    owner: Abilash
    date: "2026-07-18 20:05:00 IST"
    artifact: launches/alpha.com/BRIEF.md
  - gate: strategy
    status: pending
    owner:
    date:
    artifact:
  - gate: design_source
    status: changes
    owner: Abilash
    date: "2026-07-18 21:00:00 IST"
    artifact: notes
`;

test("frontGatesFromLedger: parses the strict ledger grammar into {gate,status} rows", () => {
  assert.deepEqual(frontGatesFromLedger(LEDGER_FIXTURE), [
    { gate: "brief", status: "approved" },
    { gate: "strategy", status: "pending" },
    { gate: "design_source", status: "changes" },
  ]);
});

test("frontGatesFromLedger: no ledger file -> [] (unarmed, honest absence)", () => {
  assert.deepEqual(frontGatesFromLedger(null), []);
  assert.deepEqual(frontGatesFromLedger(undefined), []);
});

test("frontGatesFromLedger: an out-of-enum status renders 'none', never a guess (negative)", () => {
  const bad = `domain: alpha.com\nmode: A\napprovals:\n  - gate: brief\n    status: signed-off\n`;
  assert.deepEqual(frontGatesFromLedger(bad), [{ gate: "brief", status: "none" }]);
});

// ── evidence counts (real temp-dir fixture) ──────────────────────────────────

function makeEvidenceFixture() {
  const root = mkdtempSync(join(tmpdir(), "status-build-"));
  const launch = join(root, "launches", "alpha.com");
  mkdirSync(join(launch, "go-science"), { recursive: true });
  mkdirSync(join(launch, "beauty"), { recursive: true });
  mkdirSync(join(launch, "design-review", "post-build"), { recursive: true });
  mkdirSync(join(root, "audits"), { recursive: true });
  writeFileSync(join(launch, "go-science", "2026-07-19.md"), "x");
  writeFileSync(join(launch, "go-science", "2026-07-19-pass2.md"), "x");
  writeFileSync(join(launch, "beauty", "2026-07-19.md"), "x");
  writeFileSync(join(launch, "design-review", "2026-07-18-pass1.md"), "x");
  writeFileSync(join(launch, "design-review", "2026-07-18-pass2.md"), "x");
  writeFileSync(join(launch, "design-review", "notes.txt"), "not md"); // must not count
  writeFileSync(join(launch, "design-review", "post-build", "2026-07-19-pass1.md"), "x");
  writeFileSync(join(launch, "pre-pr-audit-2026-07-19.md"), "x"); // *audit*.md in launch root
  writeFileSync(join(launch, "sitewide-checklist.md"), "x");
  writeFileSync(join(root, "audits", "alpha.com-2026-07-16.md"), "x");
  writeFileSync(join(root, "audits", "beta.com-2026-07-16.md"), "x"); // other domain
  // negative site: a launches dir with nothing in it
  mkdirSync(join(root, "launches", "bare.com"), { recursive: true });
  return root;
}

test("evidenceFor: counts every evidence class from its declared location", () => {
  const root = makeEvidenceFixture();
  try {
    assert.deepEqual(evidenceFor(root, "alpha.com"), {
      go_science: 2,
      beauty: 1,
      design_review_pre: 2,   // post-build/ NOT included (non-recursive)
      design_review_post: 1,
      audits: 2,              // 1 launch-root *audit*.md + 1 audits/<domain>*.md
      checklists: true,
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("evidenceFor: audits/ matches hyphenated, bare-stem, and alias filenames — token equality, never prefix", () => {
  const root = mkdtempSync(join(tmpdir(), "status-build-"));
  try {
    mkdirSync(join(root, "audits"), { recursive: true });
    writeFileSync(join(root, "audits", "kairali-guru-2026-07-16.md"), "x");           // hyphenated full domain
    writeFileSync(join(root, "audits", "kairali.com-2026-07-16.md"), "x");            // dotted full domain
    writeFileSync(join(root, "audits", "villaraag-2026-07-16.md"), "x");              // bare stem (no TLD)
    writeFileSync(join(root, "audits", "villaraag.com-2026-07-16-hygiene.md"), "x");  // full domain + suffix
    writeFileSync(join(root, "audits", "arogyashala.co.in-2026-07-16.md"), "x");      // declared alias
    writeFileSync(join(root, "audits", "SUMMARY-2026-07-16-audit-tail.md"), "x");     // never a site
    // hyphenated fixture counts for its own domain only
    assert.equal(evidenceFor(root, "kairali.guru").audits, 1);
    // stem "kairali" must NOT swallow kairali-guru-*.md (equality, not prefix)
    assert.equal(evidenceFor(root, "kairali.com").audits, 1);
    // bare stem + suffixed full-domain file both count
    assert.equal(evidenceFor(root, "villaraag.com").audits, 2);
    // alias map bridges the legacy filename
    assert.equal(evidenceFor(root, "arogyashala.in").audits, 1);
    // an unrelated domain sees none of it
    assert.equal(evidenceFor(root, "theblushlounge.com").audits, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("evidenceFor: absence renders as zero counts + checklists false (negative)", () => {
  const root = makeEvidenceFixture();
  try {
    assert.deepEqual(evidenceFor(root, "bare.com"), {
      go_science: 0,
      beauty: 0,
      design_review_pre: 0,
      design_review_post: 0,
      audits: 0,
      checklists: false,
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

// ── waiting_on extraction ────────────────────────────────────────────────────

test("waitingOn: extracts only fixed-list names present in the blocker (positive)", () => {
  const b =
    "clinical sign-off Dr. Deepu John. QA/QC batch waits on Deepu's Novamira install + Vikash's 11-URL list";
  // fixed-list order: Vikash < Deepu < Dr. Deepu John
  assert.deepEqual(waitingOn(b), ["Vikash", "Deepu", "Dr. Deepu John"]);
});

test("waitingOn: two-Deepus law — 'Dr. Deepu John' alone never yields 'Deepu'", () => {
  assert.deepEqual(waitingOn("clinical clusters compiled for Dr. Deepu John"), ["Dr. Deepu John"]);
});

test("waitingOn: case-insensitive; 'owner' matches possessives and compounds", () => {
  assert.deepEqual(waitingOn("Supabase RFQ env keys owner-side; ABILASH to promote"), [
    "Abilash", "owner",
  ]);
  assert.deepEqual(waitingOn("Waiting: owner's feedback round"), ["owner"]);
});

test("waitingOn: a blocker naming nobody on the list -> [] (negative)", () => {
  assert.deepEqual(waitingOn("TARIFF_MODE + BOOKING_ROUTE machine blockers unanswered"), []);
  assert.deepEqual(waitingOn(null), []);
  assert.deepEqual(waitingOn(""), []);
  // substrings inside larger words must NOT match (word boundaries)
  assert.deepEqual(waitingOn("disowner shastha"), []);
});

test("waitingOn: the fixed list is exactly the contract's 14 names", () => {
  assert.equal(WAITING_NAMES.length, 14);
  assert.deepEqual(WAITING_NAMES.slice(0, 2), ["Abilash", "owner"]);
});

// ── os counters ──────────────────────────────────────────────────────────────

test("countStrictResidues counts '- path:' entries, ignoring comments", () => {
  const y = `# - path: comments/dont/count\nresidues:\n  - path: a.mjs\n    rows: [X]\n  - path: b/c.json\n`;
  assert.equal(countStrictResidues(y), 2);
  assert.equal(countStrictResidues(""), 0);
});

test("countUnackedDirectives counts '- [ ]' lines only, not ticked boxes", () => {
  const d = `- [x] D-1 done\n- [ ] D-2 open\n- [ ] D-3 open\ntext - [ ] not a list line? no: must start the line\n`;
  assert.equal(countUnackedDirectives(d), 2);
  assert.equal(countUnackedDirectives("- [x] all acked\n"), 0);
});

test("countOpenQuestions counts '## ' headers (documented honest approximation)", () => {
  const q = `# QUESTIONS\n## Q-ONE\ntext\n## Q-TWO\n### not a question header\n`;
  assert.equal(countOpenQuestions(q), 2);
  assert.equal(countOpenQuestions("no headers here"), 0);
});

test("countDecisions: missing index -> 0 entries; array and keyed shapes count", () => {
  assert.equal(countDecisions(null), 0); // decisions/index.json absent (pre-M2)
  assert.equal(countDecisions('[{"id":"D-1"},{"id":"D-2"}]'), 2);
  assert.equal(countDecisions('{"decisions":[{"id":"D-1"}]}'), 1);
  assert.equal(countDecisions("not json"), 0);
});

// ── validations (carried over from v1) ───────────────────────────────────────

test("validate: clean status passes; bad stage and non-https URL fail (both directions)", () => {
  const ok = { sites: [{ name: "a.com", stage: "preview", preview_url: "https://a.vercel.app", live_url: null }] };
  assert.deepEqual(validate(ok), []);
  const badStage = { sites: [{ name: "a.com", stage: "shipping", preview_url: null, live_url: null }] };
  assert.equal(validate(badStage).length, 1);
  const badUrl = { sites: [{ name: "a.com", stage: "preview", preview_url: "http://insecure", live_url: null }] };
  assert.match(validate(badUrl)[0], /invalid URL/);
});

// ── schema completeness + determinism (full snapshot from fixtures) ──────────

const STATUS_FIXTURE = `meta:
  updated: "2026-07-19 21:00:00 IST"
sites:
  - name: "alpha.com"
    entity: "Kairali Group"
    stage: "preview"
    owner: "Abilash"
    blocker: "Waiting: owner promote + Sunaj grants"
    updated: "2026-07-19"
    preview_url: "https://alpha.vercel.app"
    live_url: null
  - name: "beta.com / gamma.com"
    entity: "KAPPL (commerce)"
    stage: "ideation"
    owner: "Ambuj"
    blocker: null
    updated: "2026-07-13"
    preview_url: null
    live_url: null
`;

function fullSnapshot(now = new Date("2026-07-19T16:30:00Z")) {
  const status = parseStatusYaml(STATUS_FIXTURE);
  const evidence = {
    "alpha.com": { go_science: 1, beauty: 0, design_review_pre: 2, design_review_post: 1, audits: 1, checklists: true },
    "beta.com": { go_science: 0, beauty: 0, design_review_pre: 0, design_review_post: 0, audits: 0, checklists: false },
  };
  return buildSnapshot({
    status,
    classMapText: CLASS_MAP_FIXTURE,
    ledgers: { "alpha.com": LEDGER_FIXTURE, "beta.com": null },
    evidence,
    strictResiduesText: "residues:\n  - path: a.mjs\n",
    directivesText: "- [ ] D-1\n- [ ] D-2\n- [ ] D-3\n",
    questionsText: "## Q-1\n## Q-2\n",
    decisionsIndexJson: null,
    now,
  });
}

test("buildSnapshot emits the complete schema-2 contract, keys in contract order", () => {
  const snap = fullSnapshot();
  assert.deepEqual(Object.keys(snap), ["schema", "generated", "generated_utc", "os", "sites"]);
  assert.equal(snap.schema, 2);
  assert.equal(snap.generated, "2026-07-19 22:00:00 IST"); // 16:30Z + 05:30
  assert.equal(snap.generated_utc, "2026-07-19T16:30:00Z");

  assert.deepEqual(Object.keys(snap.os), [
    "milestone", "milestones", "strict_residues", "unacked_directives",
    "open_questions", "decisions", "tests",
  ]);
  assert.equal(snap.os.milestone, MILESTONES.milestone);
  assert.equal(snap.os.milestones.length, 5);
  for (const m of snap.os.milestones) {
    assert.deepEqual(Object.keys(m), ["id", "label", "state"]);
    assert.match(m.id, /^M[0-4]$/);
    assert.ok(["done", "in-review", "next", "pending"].includes(m.state), m.state);
  }
  assert.equal(snap.os.strict_residues, 1);
  assert.equal(snap.os.unacked_directives, 3);
  assert.equal(snap.os.open_questions, 2);
  assert.equal(snap.os.decisions, 0);
  assert.equal(snap.os.tests, null); // no ledger -> honest absence, never invented

  assert.equal(snap.sites.length, 2);
  for (const s of snap.sites) {
    assert.deepEqual(Object.keys(s), [
      "name", "entity", "stage", "phase", "owner", "blocker", "updated",
      "preview_url", "live_url", "vector", "front_gates", "evidence", "waiting_on",
    ]);
  }

  const [alpha, beta] = snap.sites;
  assert.equal(alpha.phase, 5);
  assert.deepEqual(alpha.waiting_on, ["owner", "Sunaj"]);
  assert.equal(alpha.front_gates.length, 3);
  assert.equal(alpha.vector.site_class, "organic");
  // compound name: vector via FIRST domain; no ledger -> unarmed []
  assert.equal(beta.phase, 0);
  assert.deepEqual(beta.front_gates, []);
  assert.equal(beta.vector.site_class, "commerce");
  assert.deepEqual(beta.waiting_on, []);
});

test("buildSnapshot is deterministic: same inputs, byte-identical JSON", () => {
  const a = JSON.stringify(fullSnapshot(), null, 2);
  const b = JSON.stringify(fullSnapshot(), null, 2);
  assert.equal(a, b);
});

test("timestamps: IST is UTC+05:30 to the second; UTC is ISO without millis", () => {
  const t = timestamps(new Date("2026-01-01T00:00:00Z"));
  assert.equal(t.generated, "2026-01-01 05:30:00 IST");
  assert.equal(t.generated_utc, "2026-01-01T00:00:00Z");
});
