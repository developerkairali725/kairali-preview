// beauty-audit.test.js — the BEAUTY-CONFORMANCE gate (D-20260718-21):
// scripts/beauty-audit.mjs against docs/design/BEAUTY_DOCTRINE.md §R.
//
// What is under test, and why it matters: the rubric lives IN the doctrine
// (editing it is editing the gate), so parsing must be real and strict; the
// entity is selected, never guessed; the judge must SEE desktop AND mobile
// screenshots; every pass lands as an append-only evidence file with findings
// per pillar and a blocking-vs-advisory lane split (D-EXTREVIEW-OWNER-FACTS);
// and exit 0 is reachable ONLY through a schema-strict PASS. Both directions
// per the house rule: the valid paths pass, and every refusal actually
// refuses. Models are ALWAYS mocked — a test that burns live tokens or needs
// a key on disk is a flake and a leak surface, never a gate.
//
// house style: plain ESM + node --test, throwaway repos.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  DIRECTIVE, DOCTRINE, JUDGE, PILLARS,
  buildAsk, evidenceFilename, groupFindingsByPillar, judgeArgv,
  parseBeautyArgs, parseRubric, runBeautyAudit, selectEntity,
} from "../beauty-audit.mjs";

const REAL_REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const REAL_DOCTRINE = readFileSync(join(REAL_REPO, DOCTRINE), "utf8");

const SITE = "whatisayurveda.com";
const STAMP = "2026-07-18 23:00:00 IST"; // deterministic evidence date

// A real 1x1 transparent PNG — the image path round-trips real bytes.
const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

function makeRepo(t) {
  const root = mkdtempSync(join(tmpdir(), "beauty-audit-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  // The REAL doctrine — the rubric under test is the shipped rubric, never a fixture fork.
  mkdirSync(join(root, "docs", "design"), { recursive: true });
  writeFileSync(join(root, DOCTRINE), REAL_DOCTRINE);
  writeFileSync(join(root, "desktop.png"), PNG_BYTES);
  writeFileSync(join(root, "mobile.png"), PNG_BYTES);
  writeFileSync(join(root, "page.tsx"), "export default function Page() { return null; }\n");
  writeFileSync(join(root, "STRATEGY.md"), "# Strategy\nThe page's one job: educate.\n");
  writeFileSync(join(root, "facts.md"), "# Owner-confirmed facts\n- info@kairali.com\n");
  writeFileSync(join(root, "lighthouse.md"), "Perf 96 · A11y 100 · SEO 100 (Ship Gate A5, CI run)\n");
  return root;
}

const BASE_ARGV = (root) => [
  "--site", SITE, "--page-type", "homepage",
  "--desktop", join(root, "desktop.png"), "--mobile", join(root, "mobile.png"),
  "--source", join(root, "page.tsx"), "--strategy", join(root, "STRATEGY.md"),
  "--purpose", "educational reference hub for Ayurveda",
  "--audience", "sceptical first-time researcher of Ayurveda",
];

/** Mock judge: records argv, returns a canned result. Never touches a network. */
function mockJudge(spec) {
  const calls = [];
  const run = (argv) => { calls.push(argv); return { status: spec.status, stdout: spec.stdout ?? "", stderr: spec.stderr ?? "", error: spec.error ?? null }; };
  return { run, calls };
}

const PASS_RUN = {
  status: 0,
  stdout: JSON.stringify({
    verdict: "PASS",
    blocking_issues: [],
    recommendations: ["ADVISORY: B7 doubt about programme price tier is an owner-confirmed fact", "R1: needs evidence"],
  }),
};
const FAIL_RUN = {
  status: 2,
  stdout: JSON.stringify({
    verdict: "FAIL",
    blocking_issues: ["B4 the hero carries three competing CTAs — nothing was removed", "B6 imagery reads generic-wellness, not Kerala"],
    recommendations: ["B11 gradient treatment will date"],
  }),
};

/* ------------------------------------------------------- rubric parsing */

test("parseRubric: the SHIPPED doctrine rubric parses and carries all six entities (paper: every website type/company), the ROI page types, and both lanes", () => {
  const rubric = parseRubric(REAL_DOCTRINE);
  assert.deepEqual(
    Object.keys(rubric.entities).sort(),
    ["blog", "corporate", "healing-village", "kappl", "kappl-b2b", "villa-raag"],
  );
  // The exact communicate-lists from inputs §2, never reworded.
  assert.deepEqual(rubric.entities["healing-village"].communicates, [
    "healing", "calm", "trust", "authenticity", "expertise", "nature", "safety", "luxury without intimidation",
  ]);
  assert.deepEqual(rubric.entities["villa-raag"].communicates, [
    "exclusivity", "scarcity", "architecture", "craftsmanship", "privacy", "aspiration", "elegance", "emotional storytelling",
  ]);
  assert.deepEqual(rubric.entities.kappl.communicates, [
    "purity", "efficacy", "authenticity", "premium quality", "trust", "clinical credibility", "Ayurveda",
  ]);
  // The paper's additions (D-20260718-22): corporate §11 + B2B §12/§32, exact.
  assert.deepEqual(rubric.entities.corporate.communicates, [
    "scale", "continuity", "governance", "heritage", "stability", "competence", "clarity", "credibility", "connection across businesses",
  ]);
  assert.deepEqual(rubric.entities["kappl-b2b"].communicates, [
    "capability", "clarity", "commercial confidence",
  ]);
  // Paper Parts IV–VIII frameworks: must-answer + avoid lists ride the entities.
  assert.ok(rubric.entities.corporate.must_answer.length >= 5, "corporate must_answer (paper §11) present");
  assert.ok(rubric.entities["kappl-b2b"].must_answer.length >= 5, "b2b must_answer (paper §12.1) present");
  assert.ok(rubric.entities["healing-village"].must_answer.length >= 5, "healing-village must_answer (paper §19) present");
  assert.ok(rubric.entities["villa-raag"].avoid.some((a) => /superlative|gold|scarcity/.test(a)), "villa-raag avoid list carries the false-luxury bans (paper §23.5)");
  // The inputs-§3 ROI framework: every named page type present with its job.
  assert.equal(rubric.page_types.landing.job, "converts");
  assert.equal(rubric.page_types.blog.job, "educates");
  assert.equal(rubric.page_types.homepage.job, "positions");
  assert.equal(rubric.page_types.about.job, "builds trust");
  assert.equal(rubric.page_types.pdp.job, "reduces buying anxiety");
  // The paper's page-type additions: category §15, checkout §16, partner §12.
  assert.equal(rubric.page_types.category.job, "makes the catalogue navigable");
  assert.equal(rubric.page_types.checkout.job, "completes the purchase with calm confidence");
  assert.equal(rubric.page_types.partner.job, "qualifies a partnership enquiry");
  // The paper's criteria additions keep v1 ids stable and extend B13–B20.
  const idSet = new Set(rubric.criteria.map((c) => c.id));
  for (const id of ["B1", "B12", "B13", "B14", "B15", "B16", "B17", "B18", "B19", "B20", "R1", "R4"]) {
    assert.ok(idSet.has(id), `criterion ${id} must exist`);
  }
  // Criteria: unique ids, valid pillars, both lanes present, referenced ⇒ evidence.
  const ids = rubric.criteria.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(rubric.criteria.every((c) => PILLARS.includes(c.pillar)));
  assert.ok(rubric.criteria.some((c) => c.lane === "owned"));
  const referenced = rubric.criteria.filter((c) => c.lane === "referenced");
  assert.ok(referenced.length > 0);
  assert.ok(referenced.every((c) => c.evidence));
});

test("parseRubric refusals: no §R block, bad JSON, empty communicate-list, dup ids, dup domains, referenced-without-evidence", () => {
  assert.throws(() => parseRubric("# doc without a rubric\n"), /no machine-readable rubric/);
  assert.throws(() => parseRubric("## §R · rubric\n```json\n{not json\n```\n"), /not valid JSON/);
  const mk = (obj) => `## §R · rubric\n\`\`\`json\n${JSON.stringify(obj)}\n\`\`\`\n`;
  const good = {
    entities: { e1: { domains: ["a.com"], communicates: ["calm"] } },
    page_types: { homepage: { job: "positions", roi_focus: "x" } },
    criteria: [{ id: "B1", pillar: "business", lane: "owned", question: "q" }],
  };
  assert.equal(parseRubric(mk(good)).criteria.length, 1); // the fixture itself is valid
  assert.throws(() => parseRubric(mk({ ...good, entities: { e1: { domains: ["a.com"], communicates: [] } } })), /communicates\[\] missing\/empty/);
  assert.throws(() => parseRubric(mk({ ...good, entities: { e1: good.entities.e1, e2: { domains: ["a.com"], communicates: ["x"] } } })), /mapped to both/);
  assert.throws(() => parseRubric(mk({ ...good, criteria: [good.criteria[0], good.criteria[0]] })), /duplicate criterion id/);
  assert.throws(() => parseRubric(mk({ ...good, criteria: [{ id: "R1", pillar: "science", lane: "referenced", question: "q" }] })), /requires an evidence pointer/);
  assert.throws(() => parseRubric(mk({ ...good, criteria: [{ id: "B1", pillar: "vibes", lane: "owned", question: "q" }] })), /pillar "vibes"/);
  assert.throws(() => parseRubric(mk({ ...good, page_types: { homepage: { roi_focus: "x" } } })), /job missing/);
  // Paper frameworks are optional per entity, but a present-but-unusable list refuses (D-20260718-22).
  assert.throws(() => parseRubric(mk({ ...good, entities: { e1: { ...good.entities.e1, must_answer: [] } } })), /must_answer must be a non-empty array/);
  assert.throws(() => parseRubric(mk({ ...good, entities: { e1: { ...good.entities.e1, avoid: "not a list" } } })), /avoid must be a non-empty array/);
});

/* ------------------------------------------------------ entity selection */

test("selectEntity: domain map decides; explicit --entity wins; unknowns are REFUSED, never guessed", () => {
  const rubric = parseRubric(REAL_DOCTRINE);
  assert.equal(selectEntity(rubric, "whatisayurveda.com"), "blog");
  assert.equal(selectEntity(rubric, "ayurvedichealingvillage.com"), "healing-village");
  assert.equal(selectEntity(rubric, "villaraag.com"), "villa-raag");
  assert.equal(selectEntity(rubric, "kairaliorganic.com"), "kappl");
  // D-20260718-22: corporate is its own chapter; the bulk B2B domains moved to kappl-b2b (paper §11/§12).
  assert.equal(selectEntity(rubric, "kairali.com"), "corporate");
  assert.equal(selectEntity(rubric, "bulkayurvedaproducts.com"), "kappl-b2b");
  assert.equal(selectEntity(rubric, "bulkayurvedaoils.com"), "kappl-b2b");
  // Explicit override wins even for a mapped domain.
  assert.equal(selectEntity(rubric, "whatisayurveda.com", "kappl"), "kappl");
  // Unmapped domain without --entity: refused with the declare-your-entity message.
  assert.throws(() => selectEntity(rubric, "kairaliyoga.com"), /refuses to guess/);
  // Explicit entity that is not a doctrine chapter: refused.
  assert.throws(() => selectEntity(rubric, "whatisayurveda.com", "spa-resort"), /not in the doctrine rubric/);
});

/* ----------------------------------------------------------- arg parsing */

test("parseBeautyArgs: full parse works; every missing required flag refuses; bad --pass refuses", () => {
  const root = "/tmp/x";
  const argv = BASE_ARGV(root);
  const parsed = parseBeautyArgs([...argv, "--facts", "f1.md", "--facts", "f2.md", "--gate-evidence", "g1.md", "--perf-evidence", "lh.md", "--pass", "2", "--entity", "blog", "--model", "gpt-5"]);
  assert.equal(parsed.site, SITE);
  assert.equal(parsed.pageType, "homepage");
  assert.deepEqual(parsed.facts, ["f1.md", "f2.md"]);
  assert.deepEqual(parsed.gateEvidence, ["g1.md"]);
  assert.equal(parsed.perfEvidence, "lh.md");
  assert.equal(parsed.pass, "2");
  assert.equal(parsed.entity, "blog");

  for (const flag of ["--site", "--page-type", "--desktop", "--mobile", "--source", "--strategy", "--purpose", "--audience"]) {
    const i = argv.indexOf(flag);
    const without = [...argv.slice(0, i), ...argv.slice(i + 2)];
    assert.throws(() => parseBeautyArgs(without), new RegExp(`missing required: .*${flag}`), `${flag} must be required`);
  }
  assert.throws(() => parseBeautyArgs([...argv, "--pass", "0"]), /--pass must be a positive integer/);
  assert.throws(() => parseBeautyArgs([...argv, "--pass", "nope"]), /--pass must be a positive integer/);
});

/* ------------------------------------------------------- ask + judge argv */

test("buildAsk: carries the entity communicate-list, the page-type job, EVERY criterion id, the advisory lane, and the never-re-run law", () => {
  const rubric = parseRubric(REAL_DOCTRINE);
  const args = { site: SITE, pageType: "homepage" };
  const ask = buildAsk(rubric, "healing-village", "homepage", args);
  for (const item of rubric.entities["healing-village"].communicates) assert.ok(ask.includes(item), `communicate item "${item}" must be in the ask`);
  assert.ok(ask.includes("positions") || ask.includes("it positions"));
  for (const c of rubric.criteria) assert.ok(ask.includes(`${c.id} [${c.pillar}]`), `criterion ${c.id} must be in the ask`);
  assert.match(ask, /ADVISORY LANE.*D-EXTREVIEW-OWNER-FACTS/s);
  assert.match(ask, /NEVER re-run, re-measure or re-derive/);
  assert.match(ask, /needs evidence/);
  assert.match(ask, /RESTRAINT PROBE/);
  // KTAHV register nuance travels with the entity.
  assert.match(ask, /LANGUAGE LOCK/);
  // D-20260718-22: the paper's frameworks travel with the entity and the verdict frame.
  assert.match(ask, /MUST-ANSWER LIST/);
  for (const q of parseRubric(REAL_DOCTRINE).entities["healing-village"].must_answer) {
    assert.ok(ask.includes(q), `must-answer item "${q}" must be in the ask`);
  }
  assert.match(ask, /AVOID LIST/);
  assert.match(ask, /FIVE-LAYER APPROVAL TEST/);
  assert.match(ask, /not complete if it passes only the visual layer/);
});

test("buildAsk: entities without paper frameworks get no empty MUST-ANSWER/AVOID scaffolding", () => {
  const rubric = parseRubric(REAL_DOCTRINE);
  // blog has an avoid list but no must_answer in §R — the ask must only carry what exists.
  const ask = buildAsk(rubric, "blog", "blog", { site: "whatisayurveda.com", pageType: "blog" });
  assert.ok(!rubric.entities.blog.must_answer);
  assert.ok(!ask.includes("MUST-ANSWER LIST"));
  assert.match(ask, /AVOID LIST/);
});

test("judgeArgv: both screenshots as --image (desktop first), doctrine as first context, source as --artifact, model default + override", () => {
  const rubric = parseRubric(REAL_DOCTRINE);
  const args = {
    site: SITE, pageType: "blog", pass: "1", purpose: "p", audience: "a",
    desktop: "/r/desktop.png", mobile: "/r/mobile.png", source: "/r/page.tsx",
    strategy: "/r/STRATEGY.md", facts: ["/r/facts.md"], gateEvidence: ["/r/g1.md"],
    perfEvidence: "/r/lh.md", doctrinePath: "/r/docs/design/BEAUTY_DOCTRINE.md", model: "",
  };
  const av = judgeArgv(rubric, "blog", args);
  const images = av.flatMap((v, i) => (av[i - 1] === "--image" ? [v] : []));
  assert.deepEqual(images, ["/r/desktop.png", "/r/mobile.png"]);
  const contexts = av.flatMap((v, i) => (av[i - 1] === "--context" ? [v] : []));
  assert.equal(contexts[0], "/r/docs/design/BEAUTY_DOCTRINE.md"); // the law first
  assert.deepEqual(contexts.slice(1), ["/r/STRATEGY.md", "/r/facts.md", "/r/lh.md", "/r/g1.md"]);
  assert.equal(av[av.indexOf("--artifact") + 1], "/r/page.tsx");
  assert.equal(av[av.indexOf("--model") + 1], JUDGE.defaultModel);
  assert.ok(av.includes("--raw"));
  assert.match(av[av.indexOf("--step") + 1], new RegExp(`${DIRECTIVE}.*entity: blog.*page type: blog`));
  const av2 = judgeArgv(rubric, "blog", { ...args, model: "gpt-6-preview" });
  assert.equal(av2[av2.indexOf("--model") + 1], "gpt-6-preview");
});

/* -------------------------------------------------- findings per pillar */

test("groupFindingsByPillar: criterion-id prefixes route to pillars, ADVISORY prefix honoured, unprefixed items stay visible", () => {
  const rubric = parseRubric(REAL_DOCTRINE);
  const raw = {
    blocking_issues: ["B4 too many CTAs", "B6 generic-wellness imagery", "no prefix here"],
    recommendations: ["ADVISORY: B7 price doubt is owner-confirmed", "R1: needs evidence", "B11 gradient will date"],
  };
  const g = groupFindingsByPillar(raw, rubric);
  assert.deepEqual(g.blocking.philosophy, ["B4 too many CTAs", "B6 generic-wellness imagery"]);
  assert.deepEqual(g.blocking.unattributed, ["no prefix here"]);
  assert.deepEqual(g.advisory.business, ["ADVISORY: B7 price doubt is owner-confirmed"]);
  assert.deepEqual(g.advisory.science, ["R1: needs evidence"]);
  assert.deepEqual(g.advisory.philosophy, ["B11 gradient will date"]);
});

test("evidenceFilename: pass 1 is the bare date; later passes are numbered", () => {
  assert.equal(evidenceFilename("2026-07-18", "1"), "2026-07-18.md");
  assert.equal(evidenceFilename("2026-07-18", "3"), "2026-07-18-pass3.md");
});

/* --------------------------------------------------------- full runs */

test("runBeautyAudit PASS: exit 0, evidence written with strict verdict, per-pillar lanes, criteria list, and the needs-evidence perf note", (t) => {
  const root = makeRepo(t);
  const judge = mockJudge(PASS_RUN);
  const r = runBeautyAudit([...BASE_ARGV(root), "--facts", join(root, "facts.md")], { runJudge: judge.run, repoRoot: root, stamp: STAMP });
  assert.equal(r.exitCode, 0);
  assert.equal(r.entityKey, "blog"); // whatisayurveda.com maps to the blog entity
  assert.equal(judge.calls.length, 1);
  const av = judge.calls[0];
  const images = av.flatMap((v, i) => (av[i - 1] === "--image" ? [v] : []));
  assert.deepEqual(images, [join(root, "desktop.png"), join(root, "mobile.png")]);

  const evPath = join(root, "launches", SITE, "beauty", "2026-07-18.md");
  assert.ok(existsSync(evPath), "evidence file must land under launches/<site>/beauty/");
  const ev = readFileSync(evPath, "utf8");
  assert.match(ev, /VERDICT audit-gpt: PASS/);
  assert.match(ev, /OVERALL: PASS/);
  assert.match(ev, /FINDINGS PER PILLAR/);
  assert.match(ev, /Advisory lane \(never blocking — D-EXTREVIEW-OWNER-FACTS/);
  assert.match(ev, /ADVISORY: B7/);
  assert.match(ev, /entity: Blog & knowledge properties/);
  assert.match(ev, /page type: homepage — job: positions/);
  assert.match(ev, /- B1 · business · owned/);
  assert.match(ev, /R1 · science · referenced/);
  assert.match(ev, /\(none supplied — R1 recorded as needs-evidence, not re-run\)/);
  assert.match(ev, /sha256/);
});

test("runBeautyAudit FAIL: exit 2 and the FAIL is recorded — a fail is history, not a retry surface", (t) => {
  const root = makeRepo(t);
  const judge = mockJudge(FAIL_RUN);
  const r = runBeautyAudit(BASE_ARGV(root), { runJudge: judge.run, repoRoot: root, stamp: STAMP });
  assert.equal(r.exitCode, 2);
  const ev = readFileSync(r.evidencePath, "utf8");
  assert.match(ev, /VERDICT audit-gpt: FAIL/);
  assert.match(ev, /OVERALL: FAIL/);
  assert.match(ev, /B4 the hero carries three competing CTAs/);
});

test("runBeautyAudit exit 1: unparseable critique, non-enum verdict, and verdict/exit-code disagreement are all NO verdict", (t) => {
  for (const spec of [
    { status: 0, stdout: "not json at all" },
    { status: 0, stdout: JSON.stringify({ verdict: "MOSTLY_FINE" }) },
    { status: 2, stdout: JSON.stringify({ verdict: "PASS" }) }, // inconsistent run is not evidence
  ]) {
    const root = makeRepo(t);
    const judge = mockJudge(spec);
    const r = runBeautyAudit(BASE_ARGV(root), { runJudge: judge.run, repoRoot: root, stamp: STAMP });
    assert.equal(r.exitCode, 1, `spec ${JSON.stringify(spec)} must yield exit 1`);
    const ev = readFileSync(r.evidencePath, "utf8");
    assert.match(ev, /VERDICT audit-gpt: NONE/);
    assert.match(ev, /OVERALL: ERROR/);
  }
});

test("runBeautyAudit append-only: an existing evidence file is never overwritten — the rerun is the next pass", (t) => {
  const root = makeRepo(t);
  const first = runBeautyAudit(BASE_ARGV(root), { runJudge: mockJudge(FAIL_RUN).run, repoRoot: root, stamp: STAMP });
  const before = readFileSync(first.evidencePath, "utf8");
  const judge2 = mockJudge(PASS_RUN);
  assert.throws(
    () => runBeautyAudit(BASE_ARGV(root), { runJudge: judge2.run, repoRoot: root, stamp: STAMP }),
    /already exists — evidence is append-only.*--pass 2/s,
  );
  assert.equal(judge2.calls.length, 0, "the refused rerun must never reach the judge");
  assert.equal(readFileSync(first.evidencePath, "utf8"), before, "the recorded FAIL must be untouched");
  // The next pass lands beside it, never over it.
  const second = runBeautyAudit([...BASE_ARGV(root), "--pass", "2"], { runJudge: mockJudge(PASS_RUN).run, repoRoot: root, stamp: STAMP });
  assert.equal(second.exitCode, 0);
  assert.match(second.evidencePath, /2026-07-18-pass2\.md$/);
});

test("runBeautyAudit refusals happen BEFORE the judge runs: unmapped site, unknown page type, missing files, missing doctrine", (t) => {
  const root = makeRepo(t);
  const judge = mockJudge(PASS_RUN);
  const deps = { runJudge: judge.run, repoRoot: root, stamp: STAMP };

  const swap = (argv, flag, val) => { const i = argv.indexOf(flag); const c = [...argv]; c[i + 1] = val; return c; };
  assert.throws(() => runBeautyAudit(swap(BASE_ARGV(root), "--site", "kairaliyoga.com"), deps), /refuses to guess/);
  assert.throws(() => runBeautyAudit(swap(BASE_ARGV(root), "--page-type", "brochure"), deps), /not in the doctrine rubric.*valid:/s);
  assert.throws(() => runBeautyAudit(swap(BASE_ARGV(root), "--mobile", join(root, "missing.png")), deps), /does not exist/);
  assert.throws(() => runBeautyAudit(swap(BASE_ARGV(root), "--strategy", join(root, "missing.md")), deps), /--strategy .*does not exist/);
  assert.throws(() => runBeautyAudit([...BASE_ARGV(root), "--perf-evidence", join(root, "missing-lh.md")], deps), /--perf-evidence .*does not exist/);
  // Empty screenshot: refused by the image law (an empty image reviews nothing).
  writeFileSync(join(root, "desktop.png"), Buffer.alloc(0));
  assert.throws(() => runBeautyAudit(BASE_ARGV(root), deps), /file is empty/);
  // No doctrine, no gate.
  rmSync(join(root, DOCTRINE));
  assert.throws(() => runBeautyAudit(BASE_ARGV(root), deps), /no law to enforce/);
  assert.equal(judge.calls.length, 0, "every refusal must fire before any judge call");
});
