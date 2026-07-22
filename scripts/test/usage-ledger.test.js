// usage-ledger.test.js — acceptance tests for the GPTW-44 usage telemetry
// mechanism (usage ledger + rollup + the ONE sanctioned STATUS.yaml write).
//
// Incident basis (never "industry standards"): STATUS.yaml's BUDGET-BURN NOTE
// (tokens_spent/cost_inr/hours null fleet-wide, no ledger existed) and the
// 21 Jul GPT walkthrough that had to hand-log its own spend
// (docs/reports/2026-07-21-gpt-walkthrough-findings.md §1).
//
// House rule (chat-bubble-lint.test.js et al.): every detector is tested in
// BOTH directions — the clean input must PASS and the broken input must FAIL,
// for the same detector, in the same run. All fixtures are local temp files;
// nothing here touches the network or the real ledger/STATUS.yaml.
//
// house style: plain ESM + node --test; tmp-dir fixtures.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import {
  appendUsage, appendUsageSafe, buildRow, readLedger, rollup,
} from "../lib/usage-ledger.mjs";
import {
  REPO_ROOT, costInr, formatTable, loadRates, main, parseRatesYaml, updateStatusTokens,
} from "../usage-rollup.mjs";

const IST_TO_THE_SECOND = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} IST$/;

const tmp = () => mkdtempSync(join(tmpdir(), "usage-ledger-"));
const quietWarn = () => {};

/** A STATUS.yaml fixture mirroring the real file's workstream shape. */
const STATUS_FIXTURE = `# STATUS.yaml fixture — BUDGET-BURN NOTE: nulls until instrumented (HARD GATE 6)
meta:
  updated: "2026-07-21 20:50:00 IST"

workstreams:
  - name: "OS v2 architecture (Agency OS 2026 merge)"
    status: "active"
    next_milestone: "M3"
    due: null
    tokens_spent: null
    cost_inr: null
    hours: null
  - name: "Website fleet (Next.js Factory)"
    status: "active"
    next_milestone: "weekend build"
    due: "2026-08-12"
    tokens_spent: null
    cost_inr: null
    hours: 0.5

sites:
  - name: "kairali.com"
    stage: "preview"
`;

// ── append: valid JSONL, IST to the second, dual stamp ───────────────────────

test("appendUsage writes one valid JSONL row with IST-to-the-second + UTC stamps", () => {
  const ledgerPath = join(tmp(), "usage-log.jsonl");
  appendUsage({ script: "audit-gpt", model: "gpt-5", prompt_tokens: 100, completion_tokens: 40, meta: { pass: "1" } }, { ledgerPath });
  appendUsage({ script: "audit-perplexity", model: "sonar-pro", prompt_tokens: 7, completion_tokens: 3 }, { ledgerPath });

  const raw = readFileSync(ledgerPath, "utf8");
  assert.ok(raw.endsWith("\n"), "ledger must end with a newline (JSONL)");
  const lines = raw.trim().split("\n");
  assert.equal(lines.length, 2, "one line per append");

  const row = JSON.parse(lines[0]); // every line individually parseable = valid JSONL
  assert.match(row.ts_ist, IST_TO_THE_SECOND, "ts_ist must be YYYY-MM-DD HH:MM:SS IST (repo log law)");
  assert.ok(!Number.isNaN(Date.parse(row.ts_utc)), "ts_utc must be a parseable ISO stamp");
  assert.equal(row.script, "audit-gpt");
  assert.equal(row.model, "gpt-5");
  assert.equal(row.prompt_tokens, 100);
  assert.equal(row.completion_tokens, 40);
  assert.equal(row.total_tokens, 140, "total = prompt + completion");
  assert.deepEqual(row.meta, { pass: "1" });
});

test("a missing token count stays null and poisons the total (HARD GATE 6: no invented sums)", () => {
  const row = buildRow({ script: "s", model: "m", prompt_tokens: 10, completion_tokens: undefined });
  assert.equal(row.prompt_tokens, 10);
  assert.equal(row.completion_tokens, null);
  assert.equal(row.total_tokens, null, "a total over an unknown part would be an invented number");
});

test("buildRow rejects rows that name no script/model (both directions of the validator)", () => {
  assert.throws(() => buildRow({ script: "", model: "m" }));
  assert.throws(() => buildRow({ script: "s", model: "  " }));
  assert.equal(buildRow({ script: "s", model: "m" }).script, "s"); // clean input passes
});

// ── appendUsageSafe: telemetry never breaks a run ────────────────────────────

test("appendUsageSafe swallows failure with a warning — a ledger error never breaks an audit run", () => {
  const warnings = [];
  // A directory as the ledger path makes appendFileSync throw (EISDIR).
  const out = appendUsageSafe({ script: "s", model: "m" }, { ledgerPath: tmp(), warn: (m) => warnings.push(m) });
  assert.equal(out, null, "failure returns null, never throws");
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /non-fatal/);

  // Clean direction: same wrapper actually writes when the path is writable.
  const ledgerPath = join(tmp(), "l.jsonl");
  const row = appendUsageSafe({ script: "s", model: "m", prompt_tokens: 1, completion_tokens: 2 }, { ledgerPath });
  assert.equal(row.total_tokens, 3);
  assert.equal(readLedger({ ledgerPath }).rows.length, 1);
});

// ── read: corrupt line skipped with a warning, not a crash ──────────────────

test("a corrupt ledger line is skipped with a warning; valid rows survive", () => {
  const ledgerPath = join(tmp(), "l.jsonl");
  const good = (s, p, c) => JSON.stringify(buildRow({ script: s, model: "m", prompt_tokens: p, completion_tokens: c }));
  writeFileSync(ledgerPath, [
    good("audit-gpt", 10, 5),
    `{"broken json`, // truncated write (the crash-resilience failure mode: no power backup until ~Sep 2026)
    `42`, // parseable JSON but not a row
    good("audit-gpt", 20, 5),
    "",
  ].join("\n"));

  const warnings = [];
  const { rows, skipped } = readLedger({ ledgerPath, warn: (m) => warnings.push(m) });
  assert.equal(rows.length, 2, "both valid rows survive");
  assert.equal(skipped.length, 2, "both corrupt lines reported, neither crashed the read");
  assert.deepEqual(skipped.map((s) => s.line), [2, 3], "skip report points at the exact lines");
  assert.equal(warnings.length, 2);
  assert.equal(rollup(rows).totals.total_tokens, 40, "rollup still sums the valid rows");
});

test("missing ledger file reads as empty, not as an error", () => {
  const { rows, skipped } = readLedger({ ledgerPath: join(tmp(), "never-written.jsonl") });
  assert.deepEqual(rows, []);
  assert.deepEqual(skipped, []);
});

// ── rollup: sums by script+model + grand totals ─────────────────────────────

test("rollup sums by script+model and in the grand total", () => {
  const rows = [
    buildRow({ script: "audit-gpt", model: "gpt-5", prompt_tokens: 100, completion_tokens: 50 }),
    buildRow({ script: "audit-gpt", model: "gpt-5", prompt_tokens: 200, completion_tokens: 100 }),
    buildRow({ script: "audit-perplexity", model: "sonar-pro", prompt_tokens: 10, completion_tokens: 5 }),
    buildRow({ script: "audit-gpt", model: "gpt-5", prompt_tokens: 30, completion_tokens: null }), // incomplete call
  ];
  const r = rollup(rows);
  assert.equal(r.by.length, 2, "two script+model buckets");

  const gpt = r.by.find((b) => b.script === "audit-gpt");
  assert.deepEqual(
    { calls: gpt.calls, incomplete: gpt.incomplete_calls, p: gpt.prompt_tokens, c: gpt.completion_tokens, t: gpt.total_tokens },
    { calls: 3, incomplete: 1, p: 330, c: 150, t: 450 },
    "bucket sums measured values; the incomplete call is counted, its unknown side is not guessed",
  );
  assert.deepEqual(
    { calls: r.totals.calls, incomplete: r.totals.incomplete_calls, p: r.totals.prompt_tokens, c: r.totals.completion_tokens, t: r.totals.total_tokens },
    { calls: 4, incomplete: 1, p: 340, c: 155, t: 465 },
  );
});

// ── cost: null without rates; computed ONLY from cited rates ────────────────

test("cost stays null without rates (missing file, empty rates, uncited entry)", () => {
  const bucket = { model: "gpt-5", prompt_tokens: 1000, completion_tokens: 1000 };

  // missing file
  assert.equal(loadRates({ ratesPath: join(tmp(), "absent.yaml") }).size, 0);
  // the SHIPPED file is honestly empty
  const shipped = loadRates({ ratesPath: resolve(REPO_ROOT, "config/api-rates.yaml") });
  assert.equal(shipped.size, 0, "config/api-rates.yaml ships with zero usable rates — owner fills it");
  // an entry without a source citation is rejected (HARD GATE 6)
  const uncited = parseRatesYaml(
    `rates:\n  gpt-5:\n    prompt_inr_per_1k: 1\n    completion_inr_per_1k: 2\n    as_of: "2026-07-21"\n`,
    quietWarn,
  );
  assert.equal(uncited.size, 0, "no source citation, no usable rate");
  assert.equal(costInr(bucket, uncited), null);

  const table = formatTable(rollup([buildRow({ script: "s", model: "gpt-5", prompt_tokens: 1, completion_tokens: 1 })]), new Map());
  assert.ok(table.some((l) => l.includes("cost_inr is null")), "the table says WHY cost is null");
});

test("cost IS computed from a complete, cited rate entry (clean direction)", () => {
  const rates = parseRatesYaml([
    "rates:",
    "  gpt-5:",
    "    prompt_inr_per_1k: 2.5",
    "    completion_inr_per_1k: 10",
    '    source: "https://example.test/pricing @ 83.5 INR/USD 2026-07-21"',
    '    as_of: "2026-07-21"',
  ].join("\n"), quietWarn);
  assert.equal(rates.size, 1);
  // 2000/1000*2.5 + 500/1000*10 = 5 + 5 = 10
  assert.equal(costInr({ model: "gpt-5", prompt_tokens: 2000, completion_tokens: 500 }, rates), 10);
  // a model the table does not price still reads null
  assert.equal(costInr({ model: "sonar-pro", prompt_tokens: 2000, completion_tokens: 500 }, rates), null);
});

// ── STATUS.yaml: --status updates tokens_spent ONLY ─────────────────────────

test("updateStatusTokens changes ONLY the named workstream's tokens_spent line", () => {
  const updated = updateStatusTokens(STATUS_FIXTURE, "Website fleet (Next.js Factory)", 465);

  const changed = STATUS_FIXTURE.split("\n").filter((l, i) => updated.split("\n")[i] !== l);
  assert.equal(changed.length, 1, "exactly one line differs");
  assert.equal(changed[0], "    tokens_spent: null");
  assert.ok(updated.includes("    tokens_spent: 465\n    cost_inr: null\n    hours: 0.5"),
    "target updated; its cost_inr/hours untouched");
  assert.ok(updated.includes(`- name: "OS v2 architecture (Agency OS 2026 merge)"\n    status: "active"\n    next_milestone: "M3"\n    due: null\n    tokens_spent: null`),
    "the OTHER workstream's tokens_spent stays null");
  assert.ok(updated.startsWith("# STATUS.yaml fixture"), "comments survive (text surgery, no re-serialize)");
});

test("updateStatusTokens fails loud on an unknown workstream and on bad token values (broken direction)", () => {
  assert.throws(() => updateStatusTokens(STATUS_FIXTURE, "No Such Workstream", 1), /workstream not found/);
  assert.throws(() => updateStatusTokens(STATUS_FIXTURE, "Website fleet (Next.js Factory)", -1), /non-negative integer/);
  assert.throws(() => updateStatusTokens(STATUS_FIXTURE, "Website fleet (Next.js Factory)", 1.5), /non-negative integer/);
  // a site named like the workstream must never match — only the workstreams block is in scope
  assert.throws(() => updateStatusTokens(STATUS_FIXTURE, "kairali.com", 1), /workstream not found/);
});

// ── the CLI end-to-end (main), offline, temp dirs only ──────────────────────

test("main --status: ledger totals land in tokens_spent; corrupt lines report exit 2", () => {
  const dir = tmp();
  const ledgerPath = join(dir, "usage-log.jsonl");
  const statusPath = join(dir, "STATUS.yaml");
  writeFileSync(statusPath, STATUS_FIXTURE);
  appendUsage({ script: "audit-gpt", model: "gpt-5", prompt_tokens: 63959, completion_tokens: 36099 }, { ledgerPath }); // the walkthrough's hand-logged spend, now machine-logged
  appendUsage({ script: "audit-perplexity", model: "sonar-pro", prompt_tokens: 41, completion_tokens: 9 }, { ledgerPath });

  const code = main(["--status", "--workstream", "OS v2 architecture (Agency OS 2026 merge)",
    "--ledger", ledgerPath, "--status-file", statusPath, "--rates", join(dir, "no-rates.yaml")]);
  assert.equal(code, 0, "clean ledger + successful update = exit 0");
  const text = readFileSync(statusPath, "utf8");
  assert.ok(text.includes("    tokens_spent: 100108\n    cost_inr: null\n    hours: null"),
    "tokens_spent = measured prompt+completion total; cost_inr/hours untouched");

  // corrupt line -> still reports + updates, but surfaces the finding as exit 2
  writeFileSync(ledgerPath, readFileSync(ledgerPath, "utf8") + "{oops\n");
  assert.equal(main(["--ledger", ledgerPath, "--rates", join(dir, "no-rates.yaml")]), 2);
});

test("main fails loud (exit 1) on --status without --workstream and on an unknown workstream", () => {
  const dir = tmp();
  const ledgerPath = join(dir, "l.jsonl");
  const statusPath = join(dir, "STATUS.yaml");
  writeFileSync(statusPath, STATUS_FIXTURE);
  appendUsage({ script: "s", model: "m", prompt_tokens: 1, completion_tokens: 1 }, { ledgerPath });

  assert.equal(main(["--status", "--ledger", ledgerPath, "--status-file", statusPath]), 1);
  assert.equal(main(["--status", "--workstream", "nope", "--ledger", ledgerPath, "--status-file", statusPath, "--rates", join(dir, "r.yaml")]), 1);
  assert.equal(readFileSync(statusPath, "utf8"), STATUS_FIXTURE, "a failed run writes NOTHING");
});
