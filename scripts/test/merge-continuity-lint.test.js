// merge-continuity-lint.test.js — tests for the OS v2 merge continuity proof
// (plan §10 M0(b): external-review blocking finding #1 — continuity was a
// manually-asserted table; this lint makes it machine-checked).
//
// House rule (gate-registry-lint.test.js et al.): every detector is tested in
// BOTH directions — the clean input must PASS and the broken input must FAIL,
// for the same detector, in the same run.
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import {
  CONTINUITY, PROBE_GOOD, REGISTRY, REPO_ROOT, STRICT_RESIDUES,
  fileHash, hashOf, isValidDate, lint, normalize, parseContinuity, parseStrictResidues,
  relHome, runControlProbes, serialize, todayISO,
} from "../merge-continuity-lint.mjs";
import { genRows } from "../merge-continuity-gen-registry.mjs";
import { parseRegistry } from "../gate-registry-lint.mjs";

/** Baseline fixture options matching PROBE_GOOD. */
const baseOpts = () => ({
  strict: false, write: false,
  sources: { "CLAUDE.md": "Never write to production." },
  sourceHashes: { "CLAUDE.md": "PIN", [REGISTRY]: "PIN" },
  registryIds: new Set(["probe-gate"]),
  exists: () => true,
});

const goodDoc = () => parseContinuity(PROBE_GOOD).doc;

test("control probes pass (the lint can catch its own removal)", () => {
  assert.deepEqual(runControlProbes(), []);
});

test("known-good probe parses clean and lints clean", () => {
  const { doc, errors } = parseContinuity(PROBE_GOOD);
  assert.deepEqual(errors, []);
  assert.equal(doc.rows.length, 2);
  assert.deepEqual(lint(doc, baseOpts()).errors, []);
});

test("serialize/parse round-trip preserves rows", () => {
  const doc = goodDoc();
  const again = parseContinuity(serialize(doc));
  assert.deepEqual(again.errors, []);
  assert.equal(again.doc.rows.length, doc.rows.length);
  assert.equal(again.doc.rows[0].old_text, doc.rows[0].old_text);
  assert.equal(again.doc.rows[1].registry_id, doc.rows[1].registry_id);
});

test("DETECTOR hash integrity: edited quote fails, honest quote passes", () => {
  const doc = goodDoc();
  doc.rows[0].old_text = "Never write to production. (edited)";
  assert.ok(lint(doc, baseOpts()).errors.some((e) => e.includes("does not match")));
  const clean = goodDoc();
  assert.ok(!lint(clean, baseOpts()).errors.some((e) => e.includes("does not match")));
});

test("DETECTOR presence: paraphrased CLAUDE.md quote fails, verbatim passes", () => {
  const doc = goodDoc();
  doc.rows[0].old_text = "Never push to prod.";
  doc.rows[0].old_text_hash = hashOf(doc.rows[0].old_text);
  assert.ok(lint(doc, baseOpts()).errors.some((e) => e.includes("NOT FOUND")));
  assert.ok(!lint(goodDoc(), baseOpts()).errors.some((e) => e.includes("NOT FOUND")));
});

test("DETECTOR source drift: changed pin fails, matching pin passes", () => {
  const opts = baseOpts();
  opts.sourceHashes["CLAUDE.md"] = "DIFFERENT";
  assert.ok(lint(goodDoc(), opts).errors.some((e) => e.includes("SOURCE DRIFT")));
  assert.ok(!lint(goodDoc(), baseOpts()).errors.some((e) => e.includes("SOURCE DRIFT")));
});

test("DETECTOR schema: missing field fails, complete row passes", () => {
  const doc = goodDoc();
  delete doc.rows[0].trigger;
  assert.ok(lint(doc, baseOpts()).errors.some((e) => e.includes("missing/empty field trigger")));
  assert.ok(!lint(goodDoc(), baseOpts()).errors.some((e) => e.includes("missing/empty")));
});

test("DETECTOR duplicate source_id fails, unique ids pass", () => {
  const doc = goodDoc();
  doc.rows[1].source_id = "CM-001";
  assert.ok(lint(doc, baseOpts()).errors.some((e) => e.includes("duplicate source_id")));
  assert.ok(!lint(goodDoc(), baseOpts()).errors.some((e) => e.includes("duplicate source_id")));
});

test("DETECTOR status enum: unknown status fails, contract status passes", () => {
  const doc = goodDoc();
  doc.rows[0].status = "vibes";
  assert.ok(lint(doc, baseOpts()).errors.some((e) => e.includes('unknown status "vibes"')));
  assert.ok(!lint(goodDoc(), baseOpts()).errors.some((e) => e.includes("unknown status")));
});

test("DETECTOR registry coverage: uncovered gate fails, covered registry passes", () => {
  const opts = baseOpts();
  opts.registryIds = new Set(["probe-gate", "uncovered-gate"]);
  assert.ok(lint(goodDoc(), opts).errors.some((e) => e.includes('"uncovered-gate" has NO continuity row')));
  assert.ok(!lint(goodDoc(), baseOpts()).errors.some((e) => e.includes("NO continuity row")));
});

test("DETECTOR ghost GR row: registry_id not in registry fails", () => {
  const doc = goodDoc();
  doc.rows[1].registry_id = "ghost-gate";
  assert.ok(lint(doc, baseOpts()).errors.some((e) => e.includes('"ghost-gate" not in')));
});

test("DETECTOR conflict: same old_text, two new_homes fails; same home passes", () => {
  const doc = goodDoc();
  doc.rows.push({ ...doc.rows[0], source_id: "CM-002", new_home: "somewhere else entirely" });
  assert.ok(lint(doc, baseOpts()).errors.some((e) => e.includes("one obligation, one home")));
  const dup = goodDoc();
  dup.rows.push({ ...dup.rows[0], source_id: "CM-002" });
  assert.ok(!lint(dup, baseOpts()).errors.some((e) => e.includes("one obligation, one home")));
});

test("DETECTOR pending_author: legal only under standards/, reported not fatal; --strict blocks", () => {
  const doc = goodDoc();
  doc.rows[0].status = "pending_author";
  doc.rows[0].new_home = "CLAUDE.md v2 HARD GATES";
  assert.ok(lint(doc, baseOpts()).errors.some((e) => e.includes("legal only for docs/process/os-2026/standards/")));

  const std = goodDoc();
  std.rows[0].status = "pending_author";
  std.rows[0].new_home = "docs/process/os-2026/standards/02-evidence.md";
  const opts = baseOpts();
  opts.exists = (p) => p !== "docs/process/os-2026/standards/02-evidence.md";
  const lax = lint(std, opts);
  assert.deepEqual(lax.errors, []);
  assert.equal(lax.pending.length, 1);
  const strict = lint(std, { ...opts, strict: true });
  assert.ok(strict.errors.some((e) => e.includes("STRICT: standard not authored yet")));
});

test("DETECTOR also_carried_by: non-canonical path fails, canonical passes and round-trips", () => {
  const doc = goodDoc();
  doc.rows[0].also_carried_by = ["docs/somewhere/else.md"];
  assert.ok(lint(doc, baseOpts()).errors.some((e) => e.includes("not a canonical standard path")));
  const ok = goodDoc();
  ok.rows[0].also_carried_by = ["docs/process/os-2026/standards/00_MASTER_OPERATING_SYSTEM.md"];
  assert.deepEqual(lint(ok, baseOpts()).errors, []);
  const rt = parseContinuity(serialize(ok));
  assert.deepEqual(rt.doc.rows[0].also_carried_by, ok.rows[0].also_carried_by);
});

test("relHome extracts repo paths from prose homes", () => {
  assert.equal(relHome("docs/process/os-2026/standards/02-evidence.md"), "docs/process/os-2026/standards/02-evidence.md");
  assert.equal(relHome("lands in gates/class-map.yaml at M1"), "gates/class-map.yaml");
  assert.equal(relHome("CLAUDE.md v2 HARD GATES section"), null);
});

test("normalize + hashOf are whitespace-stable", () => {
  assert.equal(normalize("a\n  b\t c"), "a b c");
  assert.equal(hashOf("a\n b"), hashOf("a  b"));
  assert.notEqual(hashOf("a b"), hashOf("a c"));
});

test("genRows: every registry gate gets a row with a matching hash", () => {
  const reg = parseRegistry(readFileSync(resolve(REPO_ROOT, REGISTRY), "utf8"));
  assert.deepEqual(reg.errors, []);
  const rows = genRows(reg.gates);
  assert.equal(rows.length, reg.gates.length);
  for (const r of rows) {
    assert.equal(r.old_text_hash, hashOf(r.old_text));
    assert.ok(reg.gates.some((g) => g.id === r.registry_id));
  }
});

/* ── strict-residue allowlist (rule 8, M1) — every direction of the detector ── */

/** Fixture: CM-001 re-homed to a file-like path that does not exist.
 *  Clock pinned (opts.today) so ALLOW_ROW's review_by stays in the future
 *  forever — the expiry detector (rule 8b) gets its own real-clock tests. */
const residueFixture = () => {
  const doc = goodDoc();
  doc.rows[0].new_home = "decisions/index.json joins the durable-state set (M2)";
  const opts = baseOpts();
  opts.strict = true;
  opts.exists = (p) => p !== "decisions/index.json";
  opts.today = "2026-07-19";
  return { doc, opts };
};
const ALLOW_ROW = { path: "decisions/index.json", rows: ["CM-001"], milestone: "M2", reason: "M2 mechanism", review_by: "2026-07-26" };

test("DETECTOR strict allowlist: allowlisted residue is reported ALLOWED, never fatal", () => {
  const { doc, opts } = residueFixture();
  opts.allow = [ALLOW_ROW];
  const res = lint(doc, opts);
  assert.deepEqual(res.errors, []);
  assert.equal(res.allowed.length, 1);
  assert.deepEqual(res.allowed[0], {
    id: "CM-001", path: "decisions/index.json", milestone: "M2",
    reason: "M2 mechanism", review_by: "2026-07-26",
  });
});

test("DETECTOR strict allowlist: a residue NOT allowlisted still fails --strict", () => {
  const { doc, opts } = residueFixture();
  opts.allow = []; // no allowlist at all
  assert.ok(lint(doc, opts).errors.some((e) => e.includes("STRICT: new_home file does not exist: decisions/index.json")));
  // allowlist exists but names a DIFFERENT row id — this row is still a failure
  const { doc: d2, opts: o2 } = residueFixture();
  o2.allow = [{ ...ALLOW_ROW, rows: ["CM-099"] }];
  const r2 = lint(d2, o2);
  assert.ok(r2.errors.some((e) => e.includes("STRICT: new_home file does not exist: decisions/index.json")));
  assert.equal(r2.allowed.length, 0);
});

test("DETECTOR strict allowlist: an entry whose file EXISTS is a stale-row failure; a truthful entry is not", () => {
  const { doc, opts } = residueFixture();
  opts.exists = () => true; // the excused file now exists
  opts.allow = [ALLOW_ROW];
  assert.ok(lint(doc, opts).errors.some((e) => e.includes("stale allowlist row — decisions/index.json EXISTS")));
  const { doc: d2, opts: o2 } = residueFixture();
  o2.allow = [ALLOW_ROW];
  assert.ok(!lint(d2, o2).errors.some((e) => e.includes("stale allowlist row")));
});

test("DETECTOR strict allowlist: pending_author rows are never allowlistable (rule 7 supreme)", () => {
  const doc = goodDoc();
  doc.rows[0].status = "pending_author";
  doc.rows[0].new_home = "docs/process/os-2026/standards/02-evidence.md";
  const opts = baseOpts();
  opts.strict = true;
  opts.exists = (p) => p !== "docs/process/os-2026/standards/02-evidence.md";
  opts.today = "2026-07-19";
  opts.allow = [{ path: "docs/process/os-2026/standards/02-evidence.md", rows: ["CM-001"], milestone: "M2", reason: "x", review_by: "2026-07-26" }];
  const res = lint(doc, opts);
  assert.ok(res.errors.some((e) => e.includes("STRICT")));
  assert.equal(res.allowed.length, 0);
});

test("DETECTOR enforced expiry (8b): expired residue FAILS --strict and excuses nothing; future review_by passes", () => {
  // EXPIRED: clock moved past ALLOW_ROW's review_by 2026-07-26
  const { doc, opts } = residueFixture();
  opts.allow = [ALLOW_ROW];
  opts.today = "2026-08-01";
  const res = lint(doc, opts);
  assert.ok(res.errors.some((e) => e.includes("EXPIRED") && e.includes("review_by 2026-07-26") && e.includes("rebuild or owner re-ruling")));
  // the expired entry no longer excuses its residue — the row fails as unallowlisted
  assert.ok(res.errors.some((e) => e.includes("STRICT: new_home file does not exist: decisions/index.json")));
  assert.equal(res.allowed.length, 0);
  // FUTURE: same entry, clock before the deadline — ALLOWED, zero errors
  const { doc: d2, opts: o2 } = residueFixture();
  o2.allow = [ALLOW_ROW];
  o2.today = "2026-07-19";
  const ok = lint(d2, o2);
  assert.deepEqual(ok.errors, []);
  assert.equal(ok.allowed.length, 1);
  // review_by == today is NOT yet expired (expiry is "after review_by")
  const { doc: d3, opts: o3 } = residueFixture();
  o3.allow = [ALLOW_ROW];
  o3.today = "2026-07-26";
  assert.deepEqual(lint(d3, o3).errors, []);
});

test("DETECTOR review_by date format (8b): malformed date fails fail-closed in lint; valid date passes", () => {
  const { doc, opts } = residueFixture();
  opts.allow = [{ ...ALLOW_ROW, review_by: "next sprint" }];
  const res = lint(doc, opts);
  assert.ok(res.errors.some((e) => e.includes('review_by "next sprint" is not a valid YYYY-MM-DD date')));
  assert.ok(res.errors.some((e) => e.includes("STRICT: new_home file does not exist"))); // excuses nothing
  assert.equal(res.allowed.length, 0);
  // an impossible calendar date is also not a date
  const { doc: d2, opts: o2 } = residueFixture();
  o2.allow = [{ ...ALLOW_ROW, review_by: "2026-13-45" }];
  assert.ok(lint(d2, o2).errors.some((e) => e.includes("not a valid YYYY-MM-DD")));
  // valid date passes (the clean direction is the residueFixture + ALLOW_ROW path above)
  const { doc: d3, opts: o3 } = residueFixture();
  o3.allow = [ALLOW_ROW];
  assert.ok(!lint(d3, o3).errors.some((e) => e.includes("not a valid YYYY-MM-DD")));
});

test("isValidDate + todayISO: strict YYYY-MM-DD, real calendar dates only", () => {
  assert.ok(isValidDate("2026-07-26"));
  assert.ok(!isValidDate("2026-7-26"));      // not zero-padded
  assert.ok(!isValidDate("2026-02-30"));     // not a real date
  assert.ok(!isValidDate("26 Jul 2026"));
  assert.ok(!isValidDate(""));
  assert.ok(!isValidDate(null));
  assert.match(todayISO(), /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(todayISO(new Date(2026, 6, 19)), "2026-07-19"); // local-calendar, zero-padded
});

test("parseStrictResidues: bad review_by format fails at parse time; valid format passes", () => {
  const src = `version: 1
meta:
  generated: "2026-07-19 18:55:00 IST"
residues:
  - path: decisions/index.json
    rows: [CM-073]
    milestone: M2
    reason: "M2 mechanism"
    review_by: "26 Jul 2026"
`;
  const bad = parseStrictResidues(src);
  assert.ok(bad.errors.some((e) => e.includes('review_by "26 Jul 2026" is not a valid YYYY-MM-DD date')));
  const good = parseStrictResidues(src.replace('review_by: "26 Jul 2026"', 'review_by: "2026-07-26"'));
  assert.deepEqual(good.errors, []);
  // missing review_by still reports missing/empty (unchanged law)
  const missing = parseStrictResidues(src.replace('    review_by: "26 Jul 2026"\n', ""));
  assert.ok(missing.errors.some((e) => e.includes("missing/empty review_by")));
});

test("parseStrictResidues: canonical file shape parses clean; bad milestone / non-inline rows fail", () => {
  const good = `version: 1
meta:
  generated: "2026-07-19 18:55:00 IST"
residues:
  - path: decisions/index.json
    rows: [CM-073, CM-076]
    milestone: M2
    reason: "M2 mechanism"
    review_by: "2026-07-26"
`;
  const g = parseStrictResidues(good);
  assert.deepEqual(g.errors, []);
  assert.equal(g.doc.residues.length, 1);
  assert.deepEqual(g.doc.residues[0].rows, ["CM-073", "CM-076"]);
  const badMilestone = parseStrictResidues(good.replace("milestone: M2", "milestone: M4"));
  assert.ok(badMilestone.errors.some((e) => e.includes("milestone must be M2 or M3")));
  const badRows = parseStrictResidues(good.replace("rows: [CM-073, CM-076]", "rows: CM-073"));
  assert.ok(badRows.errors.some((e) => e.includes("inline list")));
});

test("END-TO-END strict: the committed continuity file + committed allowlist lint clean; every ALLOWED id comes from the allowlist", () => {
  const contPath = resolve(REPO_ROOT, CONTINUITY);
  const { doc, errors: parseErrors } = parseContinuity(readFileSync(contPath, "utf8"));
  assert.deepEqual(parseErrors, []);
  const resPath = resolve(REPO_ROOT, STRICT_RESIDUES);
  assert.ok(existsSync(resPath), `${STRICT_RESIDUES} must exist (M1 deliverable)`);
  const parsed = parseStrictResidues(readFileSync(resPath, "utf8"));
  assert.deepEqual(parsed.errors, []);

  const sources = {}; const sourceHashes = {};
  for (const f of ["CLAUDE.md", REGISTRY]) {
    const buf = readFileSync(resolve(REPO_ROOT, f));
    sources[f] = normalize(buf.toString("utf8"));
    sourceHashes[f] = fileHash(buf);
  }
  const reg = parseRegistry(readFileSync(resolve(REPO_ROOT, REGISTRY), "utf8"));
  const { errors, allowed } = lint(doc, {
    strict: true, write: false, sources, sourceHashes,
    registryIds: new Set(reg.gates.map((g) => g.id)),
    exists: (p) => existsSync(resolve(REPO_ROOT, p)),
    allow: parsed.doc.residues,
  });
  assert.deepEqual(errors, []);
  const allowlistedIds = new Set(parsed.doc.residues.flatMap((e) => e.rows));
  for (const a of allowed) assert.ok(allowlistedIds.has(a.id), `${a.id} allowed but not in ${STRICT_RESIDUES}`);
});

test("END-TO-END: the real committed continuity file lints clean (non-strict)", () => {
  const contPath = resolve(REPO_ROOT, CONTINUITY);
  assert.ok(existsSync(contPath), `${CONTINUITY} must exist (M0(b) deliverable)`);
  const { doc, errors: parseErrors } = parseContinuity(readFileSync(contPath, "utf8"));
  assert.deepEqual(parseErrors, []);

  const sources = {}; const sourceHashes = {};
  for (const f of ["CLAUDE.md", REGISTRY]) {
    const buf = readFileSync(resolve(REPO_ROOT, f));
    sources[f] = normalize(buf.toString("utf8"));
    sourceHashes[f] = fileHash(buf);
  }
  const reg = parseRegistry(readFileSync(resolve(REPO_ROOT, REGISTRY), "utf8"));
  const { errors } = lint(doc, {
    strict: false, write: false, sources, sourceHashes,
    registryIds: new Set(reg.gates.map((g) => g.id)),
    exists: (p) => existsSync(resolve(REPO_ROOT, p)),
  });
  assert.deepEqual(errors, []);
});
