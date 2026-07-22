// design-review.test.js — the DESIGN EXTERNAL-AI REVIEW gate (D-20260718-12 +
// D-20260718-15): scripts/design-review.mjs + scripts/lib/image-input.mjs.
//
// What is under test, and why it matters: the auditors must SEE the image
// (encoding must be real and validated, never a text description smuggled
// through), every pass must land as an append-only evidence file, and exit 0
// must be reachable ONLY through a dual schema-strict PASS. Both directions
// per the house rule: the valid paths pass, and every refusal actually
// refuses. APIs are ALWAYS mocked here — a test that burns live tokens or
// needs a key on disk is a flake and a leak surface, never a gate.
//
// house style: plain ESM + node --test, throwaway repos.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { IMAGE_MIMES, buildUserContent, describeImages, loadImageParts } from "../lib/image-input.mjs";
import { parseReviewArgs } from "../lib/review-brief.mjs";
import {
  AUDITORS, STAGES, auditorArgv, decideExit, deriveVerdict,
  parseDesignArgs, runDesignReview,
} from "../design-review.mjs";
import {
  extractBlockingFindings, parseReclassifierOutput, validateMappings,
} from "../lib/facts-reclassify.mjs";
import { PROVIDERS, parseFindingsPayload, parseReclassifyArgs } from "../audit-reclassify.mjs";

const SITE = "whyayurveda.org";
const STAMP = "2026-07-18 12:00:00 IST"; // deterministic evidence date

// A real 1x1 transparent PNG — the encoding tests round-trip these exact bytes.
const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);
// Minimal JPEG-magic bytes (FF D8 FF … FF D9) — enough for the signature check.
const JPG_BYTES = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0xff, 0xd9]);

function makeRepo(t) {
  const root = mkdtempSync(join(tmpdir(), "design-review-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "launches", SITE), { recursive: true });
  writeFileSync(join(root, "mockup.png"), PNG_BYTES);
  writeFileSync(join(root, "shot-desktop.png"), PNG_BYTES);
  writeFileSync(join(root, "shot-mobile.png"), PNG_BYTES);
  writeFileSync(join(root, "checklist.md"), "# Post-build element checklist\n- [ ] E1 hero renders\n- [ ] E2 CTA visible\n");
  writeFileSync(join(root, "facts.md"), [
    "# Canonical owner facts (D-EXTREVIEW-OWNER-FACTS authority)",
    "- 14 centers across 5 countries is the canonical roster (owner's brother confirmed, 17 Jul 2026).",
    "- A family practising Ayurveda since 1908 — Abilash confirmed the lineage date (D-LIN).",
    "",
  ].join("\n"));
  return root;
}

/** Mock auditor runner: records calls, returns canned per-auditor results. Never touches a network. */
function mockRunner(map) {
  const calls = [];
  const run = (auditor, argv) => {
    calls.push({ name: auditor.name, argv });
    const spec = map[auditor.name];
    assert.ok(spec, `unexpected auditor ${auditor.name}`);
    return { status: spec.status, stdout: spec.stdout ?? "", stderr: spec.stderr ?? "", error: spec.error ?? null };
  };
  return { run, calls };
}

const PASS_RUN = { status: 0, stdout: JSON.stringify({ verdict: "PASS", note: "good" }) };
const FAIL_RUN = { status: 2, stdout: JSON.stringify({ verdict: "FAIL", blocking_issues: ["hero is generic"] }) };

const preArgv = (root, over = []) => [
  "--site", SITE, "--image", join(root, "mockup.png"),
  "--purpose", "earn sceptical trust", "--audience", "45yo German patient",
  ...over,
];

/* ==========================================================================
 * 1 · IMAGE ENCODING — the auditor must SEE the real pixels
 * ========================================================================== */

test("loadImageParts encodes a PNG as a base64 data URI with the right MIME", (t) => {
  const root = makeRepo(t);
  const [p] = loadImageParts([join(root, "mockup.png")]);
  assert.equal(p.mime, "image/png");
  assert.equal(p.bytes, PNG_BYTES.length);
  assert.equal(p.base64, PNG_BYTES.toString("base64"));
  assert.equal(p.dataUri, `data:image/png;base64,${PNG_BYTES.toString("base64")}`);
});

test("loadImageParts maps .jpg and .jpeg to image/jpeg", (t) => {
  const root = makeRepo(t);
  for (const name of ["m.jpg", "m.jpeg"]) {
    writeFileSync(join(root, name), JPG_BYTES);
    const [p] = loadImageParts([join(root, name)]);
    assert.equal(p.mime, "image/jpeg");
    assert.ok(p.dataUri.startsWith("data:image/jpeg;base64,"));
  }
  assert.deepEqual(Object.keys(IMAGE_MIMES).sort(), [".jpeg", ".jpg", ".png"]);
});

test("★ refusals: unsupported extension, missing file, empty file, lying extension", (t) => {
  const root = makeRepo(t);
  assert.throws(() => loadImageParts([join(root, "mock.gif")]), /only PNG\/JPG/);
  assert.throws(() => loadImageParts([join(root, "absent.png")]), /does not exist/);
  writeFileSync(join(root, "empty.png"), "");
  assert.throws(() => loadImageParts([join(root, "empty.png")]), /empty \(0 bytes\)/);
  writeFileSync(join(root, "fake.png"), "not a png at all");
  assert.throws(() => loadImageParts([join(root, "fake.png")]), /magic-byte check failed/);
});

test("buildUserContent without images returns the plain brief string — text-only behaviour unchanged", () => {
  assert.equal(buildUserContent("the brief", []), "the brief");
  assert.equal(buildUserContent("the brief"), "the brief");
});

test("buildUserContent with images produces the OpenAI/Perplexity-shared content-part shape, text first, order kept", (t) => {
  const root = makeRepo(t);
  writeFileSync(join(root, "b.jpg"), JPG_BYTES);
  const parts = loadImageParts([join(root, "mockup.png"), join(root, "b.jpg")]);
  const content = buildUserContent("the brief", parts);
  assert.equal(content.length, 3);
  assert.deepEqual(content[0], { type: "text", text: "the brief" });
  assert.deepEqual(content[1], { type: "image_url", image_url: { url: parts[0].dataUri } });
  assert.deepEqual(content[2], { type: "image_url", image_url: { url: parts[1].dataUri } });
  assert.match(describeImages(parts), /mockup\.png \(image\/png, \d+ bytes\)/);
});

test("parseReviewArgs: --image is repeatable and defaults to [] — existing auditor CLIs are untouched", () => {
  assert.deepEqual(parseReviewArgs(["--ask", "q"]).image, []);
  const a = parseReviewArgs(["--ask", "q", "--image", "a.png", "--image", "b.jpg"]);
  assert.deepEqual(a.image, ["a.png", "b.jpg"]);
});

/* ==========================================================================
 * 2 · ARG PARSING — a run that cannot be recorded must refuse before tokens
 * ========================================================================== */

test("parseDesignArgs: pre happy path, defaults, repeatables, model overrides", () => {
  const a = parseDesignArgs([
    "--site", SITE, "--image", "a.png", "--image", "b.png",
    "--purpose", "p", "--audience", "aud", "--context", "c1.md", "--context", "c2.md",
    "--pass", "2", "--gpt-model", "gpt-5x", "--perplexity-model", "sonar-huge",
  ]);
  assert.equal(a.stage, "pre");
  assert.deepEqual(a.image, ["a.png", "b.png"]);
  assert.deepEqual(a.context, ["c1.md", "c2.md"]);
  assert.equal(a.pass, "2");
  assert.equal(a.gptModel, "gpt-5x");
  assert.equal(a.perplexityModel, "sonar-huge");
});

test("parseDesignArgs: post requires --checklist; pre refuses one", () => {
  const base = ["--site", SITE, "--image", "a.png", "--purpose", "p", "--audience", "aud"];
  assert.throws(() => parseDesignArgs([...base, "--stage", "post"]), /--checklist/);
  const ok = parseDesignArgs([...base, "--stage", "post", "--checklist", "cl.md"]);
  assert.equal(ok.checklist, "cl.md");
  assert.throws(() => parseDesignArgs([...base, "--checklist", "cl.md"]), /--checklist belongs to --stage post/);
});

test("★ parseDesignArgs refuses every missing required input and bad enums", () => {
  const full = { site: ["--site", SITE], image: ["--image", "a.png"], purpose: ["--purpose", "p"], audience: ["--audience", "aud"] };
  for (const omit of Object.keys(full)) {
    const argv = Object.entries(full).filter(([k]) => k !== omit).flatMap(([, v]) => v);
    assert.throws(() => parseDesignArgs(argv), new RegExp(`--${omit}`), `missing --${omit} must throw`);
  }
  const base = Object.values(full).flat();
  assert.throws(() => parseDesignArgs([...base, "--stage", "mid"]), /--stage must be "pre"/);
  assert.throws(() => parseDesignArgs([...base, "--pass", "0"]), /--pass must be a positive integer/);
  assert.throws(() => parseDesignArgs([...base, "--pass", "nope"]), /--pass must be a positive integer/);
});

/* ==========================================================================
 * 3 · AUDITOR INVOCATIONS — both auditors, image flags, no secrets in argv
 * ========================================================================== */

test("auditorArgv carries every --image, the directive step, --raw, and the default model", () => {
  const args = parseDesignArgs(["--site", SITE, "--image", "a.png", "--image", "b.png", "--purpose", "p", "--audience", "aud"]);
  for (const auditor of AUDITORS) {
    const av = auditorArgv(auditor, args);
    const joined = av.join(" ");
    assert.deepEqual(av.filter((_, i) => av[i - 1] === "--image"), ["a.png", "b.png"]);
    assert.ok(av.includes("--raw"), "raw JSON is what the orchestrator parses");
    assert.match(joined, /D-20260718-12/);
    assert.equal(av[av.indexOf("--model") + 1], auditor.defaultModel);
    assert.ok(!/OPENAI|PERPLEXITY|sk-|Bearer/i.test(joined), "argv must never carry key material");
  }
});

test("auditorArgv (post) feeds the checklist as the FIRST context and an element-by-element ask; model overrides land", () => {
  const args = parseDesignArgs([
    "--site", SITE, "--stage", "post", "--image", "d.png", "--checklist", "cl.md",
    "--purpose", "p", "--audience", "aud", "--context", "extra.md", "--perplexity-model", "sonar-huge",
  ]);
  const [gpt, pplx] = AUDITORS.map((a) => auditorArgv(a, args));
  for (const av of [gpt, pplx]) {
    const ctxs = av.filter((_, i) => av[i - 1] === "--context");
    assert.deepEqual(ctxs, ["cl.md", "extra.md"], "checklist first, then caller context");
    assert.match(av.join(" "), /D-20260718-15/);
  }
  assert.match(gpt[gpt.indexOf("--ask") + 1], /EXTEND the checklist/, "GPT may extend the checklist (D-15)");
  assert.equal(pplx[pplx.indexOf("--model") + 1], "sonar-huge", "recorded model choice reaches the auditor");
  assert.equal(gpt[gpt.indexOf("--model") + 1], "gpt-5");
});

/* ==========================================================================
 * 4 · VERDICT DERIVATION + EXIT LOGIC — 0 is reachable only via dual PASS
 * ========================================================================== */

test("deriveVerdict accepts only the strict enum AND a consistent exit code", () => {
  assert.equal(deriveVerdict(PASS_RUN).verdict, "PASS");
  assert.equal(deriveVerdict(FAIL_RUN).verdict, "FAIL");
  // inconsistent run: claims PASS but exited 2 — not evidence
  assert.equal(deriveVerdict({ ...PASS_RUN, status: 2 }).verdict, null);
  // non-enum, garbage, and dead-process runs are NO verdict, never a pass
  assert.equal(deriveVerdict({ status: 0, stdout: JSON.stringify({ verdict: "MAYBE" }) }).verdict, null);
  assert.equal(deriveVerdict({ status: 1, stdout: "API error: boom" }).verdict, null);
  assert.equal(deriveVerdict({ status: 1, stdout: "", error: "spawn ENOENT" }).verdict, null);
});

test("decideExit: 0 only when both PASS; FAIL→2; any missing verdict→1", () => {
  const r = (verdict) => ({ verdict });
  assert.equal(decideExit([r("PASS"), r("PASS")]), 0);
  assert.equal(decideExit([r("PASS"), r("FAIL")]), 2);
  assert.equal(decideExit([r("FAIL"), r("FAIL")]), 2);
  assert.equal(decideExit([r(null), r("PASS")]), 1);
  assert.equal(decideExit([r(null), r("FAIL")]), 1);
});

/* ==========================================================================
 * 5 · THE FULL PASS — evidence files, append-only, honest failures
 * ========================================================================== */

test("pre-stage dual PASS: exit 0, evidence file with strict verdict lines + both raw critiques", (t) => {
  const root = makeRepo(t);
  const { run, calls } = mockRunner({ "audit-gpt": PASS_RUN, "audit-perplexity": PASS_RUN });
  const out = runDesignReview(preArgv(root), { runAuditor: run, repoRoot: root, stamp: STAMP });

  assert.equal(out.exitCode, 0);
  assert.deepEqual(calls.map((c) => c.name), ["audit-gpt", "audit-perplexity"], "BOTH auditors always run");
  assert.equal(out.evidencePath, join(root, "launches", SITE, "design-review", "2026-07-18-pass1.md"));
  const md = readFileSync(out.evidencePath, "utf8");
  assert.match(md, /VERDICT audit-gpt: PASS/);
  assert.match(md, /VERDICT audit-perplexity: PASS/);
  assert.match(md, /OVERALL: PASS — both external auditors returned PASS/);
  assert.match(md, /"note": "good"/, "raw critique is saved verbatim");
  assert.match(md, new RegExp(`sha256 [0-9a-f]{64}`), "image hash binds what was reviewed");
  assert.match(md, /D-20260718-12/);
});

test("one FAIL: exit 2, evidence records the FAIL and blocks proceeding", (t) => {
  const root = makeRepo(t);
  const { run } = mockRunner({ "audit-gpt": PASS_RUN, "audit-perplexity": FAIL_RUN });
  const out = runDesignReview(preArgv(root), { runAuditor: run, repoRoot: root, stamp: STAMP });
  assert.equal(out.exitCode, 2);
  const md = readFileSync(out.evidencePath, "utf8");
  assert.match(md, /VERDICT audit-perplexity: FAIL/);
  assert.match(md, /OVERALL: FAIL — audit-perplexity returned FAIL; the design may NOT proceed/);
  assert.match(md, /re-run as pass 2/);
});

test("post stage: evidence under post-build/ with the submitted checklist embedded and hashed", (t) => {
  const root = makeRepo(t);
  const { run, calls } = mockRunner({ "audit-gpt": PASS_RUN, "audit-perplexity": PASS_RUN });
  const out = runDesignReview([
    "--site", SITE, "--stage", "post",
    "--image", join(root, "shot-desktop.png"), "--image", join(root, "shot-mobile.png"),
    "--checklist", join(root, "checklist.md"),
    "--purpose", "ship a finished site", "--audience", "45yo German patient",
  ], { runAuditor: run, repoRoot: root, stamp: STAMP });

  assert.equal(out.exitCode, 0);
  assert.equal(out.evidencePath, join(root, "launches", SITE, "design-review", "post-build", "2026-07-18-pass1.md"));
  const md = readFileSync(out.evidencePath, "utf8");
  assert.match(md, /SUBMITTED CHECKLIST/);
  assert.match(md, /E1 hero renders/, "the checklist the auditors vetted is saved with the verdicts (D-15)");
  assert.match(md, /checklist: checklist\.md \(sha256 [0-9a-f]{64}\)/);
  assert.match(md, /D-20260718-15/);
  for (const c of calls) {
    const ctxs = c.argv.filter((_, i) => c.argv[i - 1] === "--context");
    assert.equal(ctxs[0], join(root, "checklist.md"), `${c.name} received the checklist`);
  }
});

test("an auditor that produces no strict verdict: exit 1, honest NO-CRITIQUE evidence — never a fake pass", (t) => {
  const root = makeRepo(t);
  const { run } = mockRunner({
    "audit-gpt": PASS_RUN,
    "audit-perplexity": { status: 1, stdout: "", stderr: "API error: image type rejected" },
  });
  const out = runDesignReview(preArgv(root), { runAuditor: run, repoRoot: root, stamp: STAMP });
  assert.equal(out.exitCode, 1);
  const md = readFileSync(out.evidencePath, "utf8");
  assert.match(md, /VERDICT audit-perplexity: NONE/);
  assert.match(md, /OVERALL: ERROR — audit-perplexity produced no strict verdict/);
  assert.match(md, /API error: image type rejected/, "the real stderr is recorded, not summarised away");
});

test("★ evidence is append-only: an existing pass file refuses the run BEFORE any auditor is called", (t) => {
  const root = makeRepo(t);
  const dir = join(root, "launches", SITE, "design-review");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "2026-07-18-pass1.md"), "OVERALL: FAIL — recorded history\n");
  const { run, calls } = mockRunner({});
  assert.throws(
    () => runDesignReview(preArgv(root), { runAuditor: run, repoRoot: root, stamp: STAMP }),
    /already exists — evidence is append-only.*--pass 2/s,
  );
  assert.equal(calls.length, 0, "no tokens may burn on a run that cannot be recorded");
  assert.match(readFileSync(join(dir, "2026-07-18-pass1.md"), "utf8"), /recorded history/, "the recorded FAIL survives");
});

test("★ a bad image refuses the run before any auditor is called", (t) => {
  const root = makeRepo(t);
  const { run, calls } = mockRunner({});
  assert.throws(
    () => runDesignReview(["--site", SITE, "--image", join(root, "absent.png"), "--purpose", "p", "--audience", "aud"],
      { runAuditor: run, repoRoot: root, stamp: STAMP }),
    /does not exist/,
  );
  assert.equal(calls.length, 0);
});

test("post stage refuses a missing or empty checklist before any auditor is called", (t) => {
  const root = makeRepo(t);
  const { run, calls } = mockRunner({});
  const argvFor = (cl) => [
    "--site", SITE, "--stage", "post", "--image", join(root, "shot-desktop.png"),
    "--checklist", cl, "--purpose", "p", "--audience", "aud",
  ];
  assert.throws(() => runDesignReview(argvFor(join(root, "no-such.md")), { runAuditor: run, repoRoot: root, stamp: STAMP }), /--checklist .*does not exist/);
  writeFileSync(join(root, "empty.md"), "  \n");
  assert.throws(() => runDesignReview(argvFor(join(root, "empty.md")), { runAuditor: run, repoRoot: root, stamp: STAMP }), /checklist .*is empty/);
  assert.equal(calls.length, 0);
});

/* ==========================================================================
 * 6 · ADVISORY LANE — D-EXTREVIEW-OWNER-FACTS (owner-confirmed facts are
 *     authority; FAIL resting solely on them → ADVISORY, non-blocking).
 *     Annotation only: raw verdicts/critiques stay verbatim; the strict enum
 *     is untouched; every failure path stays BLOCKING.
 * ========================================================================== */

// A perplexity FAIL whose ONLY blocking finding doubts the owner-confirmed
// 1908 lineage — the exact shape of the kairalicenters pass-4 gap.
const PPLX_FACT_FAIL = {
  status: 2,
  stdout: JSON.stringify({
    verdict: "FAIL",
    summary: "1908 lineage externally unverifiable",
    claims_checked: [
      { claim: "14 centers in 5 countries", verdict: "SUPPORTED", evidence: "locations page", correction: "", is_health_claim: false, risk_to_this_audience: "low", confidence: "high" },
      { claim: "family practising Ayurveda since 1908", verdict: "MISLEADING", evidence: "no external primary source", correction: "", is_health_claim: false, risk_to_this_audience: "low", confidence: "low" },
    ],
    data_faults: [],
    fabricated_or_misrepresented_sources: [],
  }),
};

/** Mock reclassifier: records requests, returns canned mapping runs. Never touches a network. */
function mockReclassifier(fn) {
  const calls = [];
  const run = (req, opts) => { calls.push({ ...req, opts }); return fn(req); };
  return { run, calls };
}

const mappingRun = (mappings) => ({ status: 0, stdout: JSON.stringify({ mappings }), stderr: "", error: null });
const COVERED_1908 = { finding_id: "claims_checked[1]", covered: true, fact: "A family practising Ayurveda since 1908", reasoning: "owner-confirmed lineage date" };

test("extractBlockingFindings: audit-gpt takes blocking_issues + blocking missed_steps only", () => {
  const raw = {
    blocking_issues: ["mobile has no persistent call CTA", "gold-on-cream contrast unproven"],
    missed_steps: [
      { step: "task-flow proof", evidence_it_was_missed: "no sticky CTA", severity: "blocking" },
      { step: "city chips check", evidence_it_was_missed: "Gurgaon absent", severity: "major" },
    ],
  };
  const f = extractBlockingFindings("audit-gpt", raw);
  assert.deepEqual(f.map((x) => x.id), ["blocking_issues[0]", "blocking_issues[1]", "missed_steps[0]"]);
  assert.match(f[2].text, /task-flow proof — evidence: no sticky CTA/);
  assert.deepEqual(extractBlockingFindings("audit-gpt", {}), []);
  assert.throws(() => extractBlockingFindings("audit-other", {}), /unknown auditor/);
});

test("extractBlockingFindings: audit-perplexity takes CONTRADICTED/MISLEADING, UNVERIFIABLE health claims, data faults, fabricated sources — never SUPPORTED", () => {
  const raw = {
    claims_checked: [
      { claim: "true thing", verdict: "SUPPORTED", is_health_claim: false },
      { claim: "wrong count", verdict: "CONTRADICTED", evidence: "roster says 14", correction: "14", is_health_claim: false },
      { claim: "cures diabetes", verdict: "UNVERIFIABLE", is_health_claim: true },
      { claim: "obscure history", verdict: "UNVERIFIABLE", is_health_claim: false },
      { claim: "spun claim", verdict: "MISLEADING", is_health_claim: false },
    ],
    data_faults: ["zero volume implausible"],
    fabricated_or_misrepresented_sources: ["cited study does not exist"],
  };
  const f = extractBlockingFindings("audit-perplexity", raw);
  assert.deepEqual(f.map((x) => x.id), ["claims_checked[1]", "claims_checked[2]", "claims_checked[4]", "data_faults[0]", "fabricated_sources[0]"]);
  assert.match(f[0].text, /\[CONTRADICTED\] wrong count — evidence: roster says 14 — correction: 14/);
});

test("★ validateMappings machine-checks the model's mapping: complete, once each, boolean, verbatim quotes", (t) => {
  const root = makeRepo(t);
  const facts = readFileSync(join(root, "facts.md"), "utf8");
  const findings = [{ id: "a", text: "doubts 1908" }, { id: "b", text: "doubts roster" }];
  const ok = validateMappings(findings, { mappings: [
    { finding_id: "a", covered: true, fact: "practising Ayurveda since 1908", reasoning: "r" },
    { finding_id: "b", covered: false, fact: "", reasoning: "independent" },
  ] }, facts);
  assert.equal(ok.length, 2);
  // quote tolerance: case + punctuation differences still match the sheet
  validateMappings([findings[0]], { mappings: [{ finding_id: "a", covered: true, fact: "PRACTISING  ayurveda, since 1908!", reasoning: "r" }] }, facts);
  const one = (m) => ({ mappings: [m] });
  assert.throws(() => validateMappings(findings, { mappings: [] }, facts), /unmapped finding/);
  assert.throws(() => validateMappings([findings[0]], one({ finding_id: "zzz", covered: false, fact: "", reasoning: "" }), facts), /unknown finding_id/);
  assert.throws(() => validateMappings([findings[0]], { mappings: [COVERED_1908, COVERED_1908].map((m) => ({ ...m, finding_id: "a" })) }, facts), /mapped more than once/);
  assert.throws(() => validateMappings([findings[0]], one({ finding_id: "a", covered: "yes", fact: "x", reasoning: "" }), facts), /covered must be a boolean/);
  assert.throws(() => validateMappings([findings[0]], one({ finding_id: "a", covered: true, fact: "", reasoning: "" }), facts), /substantive verbatim fact quote/);
  assert.throws(() => validateMappings([findings[0]], one({ finding_id: "a", covered: true, fact: "a fact the sheet never declared anywhere", reasoning: "" }), facts),
    /does not appear in the facts sheet/, "an asserted-but-unquoted covering fact is refused — coverage is machine-checked");
  assert.equal(validateMappings(findings, { mappings: [
    { finding_id: "a", covered: false, fact: "", reasoning: "" },
    { finding_id: "b", covered: false, fact: "", reasoning: "" },
  ] }, facts).every((m) => m.covered), false);
});

test("parseReclassifierOutput: every failure path yields error + no advisory flip", (t) => {
  const root = makeRepo(t);
  const facts = readFileSync(join(root, "facts.md"), "utf8");
  const findings = [{ id: "claims_checked[1]", text: "doubts 1908" }];
  const good = parseReclassifierOutput(findings, mappingRun([COVERED_1908]), facts);
  assert.equal(good.error, null);
  assert.equal(good.allCovered, true);
  for (const run of [
    { status: 1, stdout: "", stderr: "API error: boom", error: null },
    { status: 0, stdout: "not json", stderr: "", error: null },
    { status: 0, stdout: JSON.stringify({ mappings: [] }), stderr: "", error: null }, // incomplete
    { status: 1, stdout: "", stderr: "", error: "spawn ENOENT" },
  ]) {
    const r = parseReclassifierOutput(findings, run, facts);
    assert.ok(r.error, `run ${JSON.stringify(run)} must carry an error`);
    assert.equal(r.allCovered, false);
    assert.equal(r.mappings, null);
  }
});

test("decideExit treats ADVISORY as non-blocking, raw verdicts untouched", () => {
  const adv = { verdict: "FAIL", effective: "ADVISORY" };
  const pass = { verdict: "PASS", effective: "PASS" };
  const fail = { verdict: "FAIL", effective: "FAIL" };
  assert.equal(decideExit([pass, adv]), 0);
  assert.equal(decideExit([adv, adv]), 0);
  assert.equal(decideExit([adv, fail]), 2);
  assert.equal(decideExit([{ verdict: null, effective: null }, adv]), 1);
});

test("--facts is auto-attached to BOTH auditors as context (pre: first; post: after the checklist)", () => {
  const pre = parseDesignArgs(["--site", SITE, "--image", "a.png", "--purpose", "p", "--audience", "aud", "--facts", "facts.md", "--context", "c.md"]);
  const post = parseDesignArgs(["--site", SITE, "--stage", "post", "--image", "a.png", "--checklist", "cl.md", "--purpose", "p", "--audience", "aud", "--facts", "facts.md", "--context", "c.md"]);
  for (const auditor of AUDITORS) {
    const preCtx = auditorArgv(auditor, pre).filter((_, i, av) => av[i - 1] === "--context");
    assert.deepEqual(preCtx, ["facts.md", "c.md"], `${auditor.name} pre: facts sheet attached before caller context`);
    const postCtx = auditorArgv(auditor, post).filter((_, i, av) => av[i - 1] === "--context");
    assert.deepEqual(postCtx, ["cl.md", "facts.md", "c.md"], `${auditor.name} post: checklist first, then facts, then caller context`);
  }
});

test("★ a FAIL fully covered by owner facts → FAIL(raw) → ADVISORY, exit 0, raw critique verbatim, table in evidence", (t) => {
  const root = makeRepo(t);
  const { run } = mockRunner({ "audit-gpt": PASS_RUN, "audit-perplexity": PPLX_FACT_FAIL });
  const reclass = mockReclassifier(() => mappingRun([COVERED_1908]));
  const out = runDesignReview(preArgv(root, ["--facts", join(root, "facts.md")]),
    { runAuditor: run, runReclassifier: reclass.run, repoRoot: root, stamp: STAMP });

  assert.equal(out.exitCode, 0, "a FAIL resting solely on owner-confirmed facts is non-blocking (D-EXTREVIEW-OWNER-FACTS)");
  // the reclassifier asked the SAME auditor model about ITS OWN findings
  assert.equal(reclass.calls.length, 1, "only the raw-FAIL auditor is reclassified");
  assert.equal(reclass.calls[0].auditor, "audit-perplexity");
  assert.equal(reclass.calls[0].model, "sonar-pro");
  assert.deepEqual(reclass.calls[0].findings.map((f) => f.id), ["claims_checked[1]"]);
  assert.equal(reclass.calls[0].factsPath, join(root, "facts.md"));

  const md = readFileSync(out.evidencePath, "utf8");
  assert.match(md, /VERDICT audit-perplexity: FAIL\(raw\) → ADVISORY per D-EXTREVIEW-OWNER-FACTS/);
  assert.match(md, /VERDICT audit-gpt: PASS/);
  assert.match(md, /OVERALL: PASS \(advisory\)/);
  assert.match(md, /## RECLASSIFICATION — D-EXTREVIEW-OWNER-FACTS/);
  assert.match(md, /\| claims_checked\[1\] \| .*1908.* \| A family practising Ayurveda since 1908 \| ADVISORY \|/);
  assert.match(md, /facts sheet .*facts\.md \(sha256 [0-9a-f]{64}\)/);
  // the raw auditor output is preserved VERBATIM — annotation, never an edit
  assert.match(md, /"verdict": "FAIL"/, "raw FAIL stays in the raw critique block");
  assert.match(md, /"summary": "1908 lineage externally unverifiable"/);
});

test("★ a FAIL with one finding NOT covered by the sheet stays blocking: exit 2, table shows the blocking row", (t) => {
  const root = makeRepo(t);
  const GPT_MIXED_FAIL = {
    status: 2,
    stdout: JSON.stringify({
      verdict: "FAIL",
      blocking_issues: ["hero doubts the 14-center roster", "mobile drops the call CTA"],
      missed_steps: [],
    }),
  };
  const { run } = mockRunner({ "audit-gpt": GPT_MIXED_FAIL, "audit-perplexity": PASS_RUN });
  const reclass = mockReclassifier(() => mappingRun([
    { finding_id: "blocking_issues[0]", covered: true, fact: "14 centers across 5 countries is the canonical roster", reasoning: "owner ruling" },
    { finding_id: "blocking_issues[1]", covered: false, fact: "", reasoning: "a design/conversion issue — no owner fact involved" },
  ]));
  const out = runDesignReview(preArgv(root, ["--facts", join(root, "facts.md")]),
    { runAuditor: run, runReclassifier: reclass.run, repoRoot: root, stamp: STAMP });

  assert.equal(out.exitCode, 2, "one uncovered blocking finding keeps the FAIL blocking");
  assert.equal(reclass.calls[0].model, "gpt-5", "the gpt FAIL is mapped by the gpt model");
  const md = readFileSync(out.evidencePath, "utf8");
  assert.match(md, /VERDICT audit-gpt: FAIL\n/, "no advisory annotation — the raw verdict stands");
  assert.match(md, /OVERALL: FAIL — audit-gpt returned FAIL/);
  assert.match(md, /\| blocking_issues\[0\] \| .* \| 14 centers across 5 countries is the canonical roster \| ADVISORY \|/);
  assert.match(md, /\| blocking_issues\[1\] \| .* \| — \| BLOCKING \|/);
  assert.match(md, /EFFECTIVE audit-gpt: FAIL — 1 finding\(s\) not covered by the sheet keep the FAIL blocking/);
  assert.match(md, /"verdict": "FAIL"/, "raw critique verbatim");
});

test("reclassifier failure or refused mapping leaves the raw FAIL blocking, recorded honestly", (t) => {
  const root = makeRepo(t);
  const { run } = mockRunner({ "audit-gpt": PASS_RUN, "audit-perplexity": PPLX_FACT_FAIL });
  const reclass = mockReclassifier(() => ({ status: 1, stdout: "", stderr: "audit-reclassify failed: API error", error: null }));
  const out = runDesignReview(preArgv(root, ["--facts", join(root, "facts.md")]),
    { runAuditor: run, runReclassifier: reclass.run, repoRoot: root, stamp: STAMP });
  assert.equal(out.exitCode, 2, "a broken reclassifier can only fail toward blocking");
  const md = readFileSync(out.evidencePath, "utf8");
  assert.match(md, /VERDICT audit-perplexity: FAIL\n/);
  assert.match(md, /RECLASSIFICATION NOT APPLIED — reclassifier exited 1/);
  assert.match(md, /stays BLOCKING/);
});

test("without --facts nothing is reclassified; a FAIL with no extractable blocking findings stays blocking too", (t) => {
  const root = makeRepo(t);
  // no --facts: reclassifier must never be called
  const a = mockReclassifier(() => { throw new Error("must not be called"); });
  const out1 = runDesignReview(preArgv(root), { runAuditor: mockRunner({ "audit-gpt": PASS_RUN, "audit-perplexity": FAIL_RUN }).run, runReclassifier: a.run, repoRoot: root, stamp: STAMP });
  assert.equal(out1.exitCode, 2);
  assert.equal(a.calls.length, 0);
  assert.ok(!readFileSync(out1.evidencePath, "utf8").includes("RECLASSIFICATION"), "no facts sheet, no reclassification section");
  // --facts but a FAIL whose critique carries no machine-extractable blocking findings
  const HOLLOW_FAIL = { status: 2, stdout: JSON.stringify({ verdict: "FAIL", claims_checked: [], data_faults: [], fabricated_or_misrepresented_sources: [] }) };
  const b = mockReclassifier(() => { throw new Error("must not be called"); });
  const out2 = runDesignReview(preArgv(root, ["--pass", "2", "--facts", join(root, "facts.md")]),
    { runAuditor: mockRunner({ "audit-gpt": PASS_RUN, "audit-perplexity": HOLLOW_FAIL }).run, runReclassifier: b.run, repoRoot: root, stamp: STAMP });
  assert.equal(out2.exitCode, 2, "a FAIL that cannot be itemised cannot be shown to rest solely on owner facts");
  assert.equal(b.calls.length, 0);
  assert.match(readFileSync(out2.evidencePath, "utf8"), /no machine-extractable blocking findings/);
});

test("★ --facts refusals: a missing or empty sheet refuses the run BEFORE any auditor is called", (t) => {
  const root = makeRepo(t);
  const { run, calls } = mockRunner({});
  assert.throws(
    () => runDesignReview(preArgv(root, ["--facts", join(root, "no-such-facts.md")]), { runAuditor: run, repoRoot: root, stamp: STAMP }),
    /--facts .*does not exist/,
  );
  writeFileSync(join(root, "empty-facts.md"), "  \n");
  assert.throws(
    () => runDesignReview(preArgv(root, ["--facts", join(root, "empty-facts.md")]), { runAuditor: run, repoRoot: root, stamp: STAMP }),
    /--facts .*is empty/,
  );
  assert.equal(calls.length, 0, "no tokens may burn on a run that cannot be recorded");
});

test("audit-reclassify CLI plumbing: args + stdin payload validation, provider map covers exactly the two auditors", () => {
  assert.deepEqual(Object.keys(PROVIDERS).sort(), ["audit-gpt", "audit-perplexity"]);
  assert.equal(PROVIDERS["audit-gpt"].keyVar, "OPENAI_API_KEY");
  assert.equal(PROVIDERS["audit-perplexity"].keyVar, "PERPLEXITY_API_KEY");
  const ok = parseReclassifyArgs(["--auditor", "audit-gpt", "--model", "gpt-5", "--facts", "f.md"]);
  assert.deepEqual(ok, { auditor: "audit-gpt", model: "gpt-5", facts: "f.md" });
  assert.throws(() => parseReclassifyArgs(["--auditor", "audit-claude", "--model", "m", "--facts", "f"]), /--auditor must be one of/);
  assert.throws(() => parseReclassifyArgs(["--auditor", "audit-gpt", "--facts", "f"]), /--model is required/);
  assert.throws(() => parseReclassifyArgs(["--auditor", "audit-gpt", "--model", "m"]), /--facts is required/);
  assert.deepEqual(parseFindingsPayload('{"findings":[{"id":"a","text":"t"}]}'), [{ id: "a", text: "t" }]);
  assert.throws(() => parseFindingsPayload("not json"), /stdin is not JSON/);
  assert.throws(() => parseFindingsPayload('{"findings":[]}'), /no findings/);
  assert.throws(() => parseFindingsPayload('{"findings":[{"id":"","text":"t"}]}'), /malformed finding/);
  // no key material in argv of the child the orchestrator spawns
  for (const p of Object.values(PROVIDERS)) {
    const body = p.body("m", "sys", "usr");
    assert.ok(body.response_format, `${p.url} call is schema-constrained`);
  }
});

test("STAGES map is the two directives and nothing else; a pass increments to a NEW file (the iterate loop)", (t) => {
  assert.deepEqual(Object.keys(STAGES).sort(), ["post", "pre"]);
  assert.equal(STAGES.pre.directive, "D-20260718-12");
  assert.equal(STAGES.post.directive, "D-20260718-15");
  const root = makeRepo(t);
  const fail = mockRunner({ "audit-gpt": FAIL_RUN, "audit-perplexity": FAIL_RUN });
  const p1 = runDesignReview(preArgv(root), { runAuditor: fail.run, repoRoot: root, stamp: STAMP });
  const pass = mockRunner({ "audit-gpt": PASS_RUN, "audit-perplexity": PASS_RUN });
  const p2 = runDesignReview(preArgv(root, ["--pass", "2"]), { runAuditor: pass.run, repoRoot: root, stamp: STAMP });
  assert.notEqual(p1.evidencePath, p2.evidencePath);
  assert.ok(existsSync(p1.evidencePath) && existsSync(p2.evidencePath), "every pass stays on the record");
  assert.equal(p1.exitCode, 2);
  assert.equal(p2.exitCode, 0);
});
