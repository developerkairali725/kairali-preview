// shopify-catalog-lint — tests for the Shopify catalog findings tool
// (CLAUDE.md Shopify Track Doctrine (l)/(p); D-O1 weekend lane O1).
//
// House rule (gate-registry-lint.test.js, front-gate.test.js): every detector
// is tested in BOTH directions — the clean fixture must PASS and the broken
// fixture must FAIL, for the same detector, in the same run.
//
// The two that matter most here:
//   · READ-ONLY is structural, not behavioral: the source is asserted to hold
//     exactly ONE network call site, and that site hard-codes GET (CLAUDE.md
//     rule k — the agent is read-only in any Shopify admin).
//   · The negated-cure sentence ("It is not a cure for cancer…") stays CLEAN
//     and is surfaced as INFO — the §3.3 doctrine from content-lint carried to
//     commerce: a lint that reddens honest drafting trains reviewers to click
//     past the one lint that matters most.
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync, readdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  parseCsv, productsFromCsv, productsFromJson, stripHtml, lintCatalog, lintProse,
  exitCodeFor, runControlProbes, istNow, countBySeverity, renderMarkdown,
  HANDLE_RE, STORES, PROBE_CLEAN_PRODUCT, PROBE_BAD_PRODUCT,
} from "../shopify-catalog-lint.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..", "..");
const FIX = join(REPO, "test", "fixtures", "shopify-catalog");
const SCRIPT = join(REPO, "scripts", "shopify-catalog-lint.mjs");

const CAPS = { seo: true, hs: true, currency: true, surfaces: true };

function lintCsvFixture(name, opts = {}) {
  const parsed = productsFromCsv(parseCsv(readFileSync(join(FIX, name), "utf8")));
  assert.deepEqual(parsed.errors, []);
  return { parsed, res: lintCatalog(parsed.products, { store: "in", capabilities: parsed.capabilities, ...opts }) };
}

function lintJsonFixture(name, opts = {}) {
  const parsed = productsFromJson(JSON.parse(readFileSync(join(FIX, name), "utf8")));
  assert.deepEqual(parsed.errors, []);
  return { parsed, res: lintCatalog(parsed.products, { store: "in", capabilities: parsed.capabilities, surfaces: parsed.surfaces, ...opts }) };
}

const has = (findings, rule, handlePart, severity = null) =>
  findings.some((f) => f.rule === rule && f.handle.includes(handlePart) && (severity === null || f.severity === severity));

/** Env with every SHOPIFY_* var removed — API mode must see a bare machine. */
function bareEnv() {
  const env = { ...process.env };
  for (const k of Object.keys(env)) if (k.startsWith("SHOPIFY_")) delete env[k];
  return env;
}

// ── control probes ───────────────────────────────────────────────────────────

test("control probes pass (the scanner is not broken)", () => {
  assert.deepEqual(runControlProbes(), []);
});

test("probe catalog is honest in both directions", () => {
  const clean = lintCatalog([PROBE_CLEAN_PRODUCT], { store: "in", expectedCurrency: "INR", capabilities: CAPS });
  assert.deepEqual(clean.findings.filter((f) => f.severity !== "info"), []);
  // …and the suppression is VISIBLE, never silent (§2.7 r22)
  assert.ok(clean.findings.some((f) => f.severity === "info" && f.rule === "banned-claim"));
  const bad = lintCatalog([PROBE_BAD_PRODUCT], { store: "in", expectedCurrency: "INR", capabilities: CAPS });
  assert.ok(bad.findings.filter((f) => f.severity === "error").length >= 10);
});

// ── CSV parser (RFC 4180) ────────────────────────────────────────────────────

test("parseCsv handles quoted commas, escaped quotes and embedded newlines", () => {
  const rows = parseCsv('a,"b ""q"" c",d\n1,"x,y\nz",3\n');
  assert.deepEqual(rows, [["a", 'b "q" c', "d"], ["1", "x,y\nz", "3"]]);
});

test("productsFromCsv groups variant/image continuation rows under one product", () => {
  const { parsed } = lintCsvFixture("clean.csv");
  assert.equal(parsed.products.length, 2);
  const soap = parsed.products.find((p) => p.handle === "kairali-herbal-soap");
  assert.equal(soap.images.length, 2); // continuation row contributed the second image
  assert.equal(soap.variants.length, 1); // image-only row is NOT a variant
  assert.equal(parsed.capabilities.seo, true);
  assert.equal(parsed.capabilities.hs, true);
});

test("a CSV without a Handle column is a harness error, not a silent pass", () => {
  const parsed = productsFromCsv(parseCsv("Title,Vendor\nX,Y\n"));
  assert.ok(parsed.errors.some((e) => e.includes("Handle")));
});

// ── THE LAW: clean passes, every violation class fails ───────────────────────

test("clean.csv lints CLEAN — and the negated cure sentence surfaces as INFO, never as a finding", () => {
  const { res } = lintCsvFixture("clean.csv");
  assert.deepEqual(res.findings.filter((f) => f.severity !== "info"), [],
    JSON.stringify(res.findings.filter((f) => f.severity !== "info"), null, 2));
  assert.ok(res.findings.some((f) => f.severity === "info" && f.rule === "banned-claim"),
    "the §3.3 suppression must be visible");
  assert.equal(exitCodeFor(res.findings, true), 0);
});

test("violations.csv flags every violation class, attributed to the right handle", () => {
  const { res } = lintCsvFixture("violations.csv");
  const f = res.findings;
  assert.ok(has(f, "missing-sku", "missing-sku-product", "error"));
  assert.ok(has(f, "duplicate-sku", "dup-sku-a", "error"));
  assert.ok(has(f, "duplicate-sku", "dup-sku-b", "error"));
  assert.ok(has(f, "empty-description", "empty-description-product", "error"));
  assert.ok(has(f, "missing-image", "missing-image-product", "error"));
  assert.ok(has(f, "missing-image-alt", "missing-alt-product", "warn"));
  assert.ok(has(f, "zero-price", "zero-price-product", "error"));
  assert.ok(has(f, "negative-price", "negative-price-product", "error"));
  assert.ok(has(f, "compare-at-not-higher", "fake-sale-product", "error"));
  assert.ok(has(f, "missing-product-type", "missing-meta-product", "warn"));
  assert.ok(has(f, "missing-vendor", "missing-meta-product", "warn"));
  assert.ok(has(f, "missing-tags", "missing-meta-product", "warn"));
  assert.ok(has(f, "missing-seo-title", "missing-meta-product", "warn"));
  assert.ok(has(f, "missing-seo-description", "missing-meta-product", "warn"));
  assert.ok(has(f, "hsn-missing", "missing-meta-product", "warn"));
  assert.ok(has(f, "invalid-handle", "Bad_Handle_X", "error"));
  assert.ok(has(f, "banned-claim", "banned-claim-product", "error"));
  assert.ok(has(f, "banned-claim-phrase", "banned-claim-product", "error"));
  assert.ok(has(f, "banned-filler", "banned-filler-product", "error"));
  assert.ok(has(f, "urgency-claim", "urgency-product", "error"));
  assert.ok(has(f, "urgency-review", "urgency-product", "warn"));
  assert.ok(has(f, "duplicate-handle", "dup-handle-product", "error"));
  assert.ok(has(f, "thin-description", "thin-description-product", "warn"));
  assert.equal(exitCodeFor(f, true), 2);
  // …and the violations never bleed onto clean products in the same file
  assert.ok(!has(f, "missing-sku", "dup-sku-a"));
  assert.ok(!has(f, "banned-claim", "banned-filler-product"));
});

test("JSON mode reaches parity: clean.json CLEAN, violations.json flags its classes", () => {
  const clean = lintJsonFixture("clean.json", { expectedCurrency: "INR" });
  assert.deepEqual(clean.res.findings.filter((x) => x.severity !== "info"), []);
  assert.equal(clean.parsed.surfaces.length, 2); // collection + page linted too

  const bad = lintJsonFixture("violations.json", { expectedCurrency: "INR" });
  const f = bad.res.findings;
  assert.ok(has(f, "missing-handle", "<no handle>", "error"));
  assert.ok(has(f, "currency-mixed", "<catalog>", "error"));
  assert.ok(has(f, "currency-mismatch", "<catalog>", "error"));
  assert.ok(has(f, "missing-price", "no-variant-product", "error"));
  assert.ok(has(f, "price-not-numeric", "bad-price-product", "error"));
  assert.ok(has(f, "banned-filler", "banned-filler-collection", "error"));
  assert.ok(has(f, "empty-page-body", "empty-page", "warn"));
});

// ── the claims engine at the prose boundary ──────────────────────────────────

test("disease claims: assertion flags, question and negation do not (and suppression is visible)", () => {
  const claim = lintProse("This oil cures cancer fast.", "body_html");
  assert.ok(claim.some((x) => x.rule === "banned-claim" && x.severity === "error"));
  const question = lintProse("Does this oil cure cancer?", "body_html");
  assert.ok(!question.some((x) => x.severity === "error"), JSON.stringify(question));
  const negated = lintProse("It is not a cure for cancer; consult your treating medical team.", "body_html");
  assert.ok(!negated.some((x) => x.severity === "error"), JSON.stringify(negated));
  assert.ok(negated.some((x) => x.severity === "info"));
});

test("urgency: outcome-in-N-days is an ERROR claim; scarcity lines route to a human as WARN", () => {
  const f = lintProse("Visible results in 7 days. Hurry, while stocks last.", "body_html");
  assert.ok(f.some((x) => x.rule === "urgency-claim" && x.severity === "error"));
  assert.ok(f.some((x) => x.rule === "urgency-review" && x.severity === "warn"));
  const ok = lintProse("Apply twice daily after bathing.", "body_html");
  assert.deepEqual(ok, []);
});

test("stripHtml turns markup into scannable prose", () => {
  assert.equal(stripHtml("<p>Hello&nbsp;<b>world</b></p>"), "Hello world");
  assert.equal(stripHtml("a<br>b"), "a\nb");
});

// ── exit codes: severity is machine-readable ─────────────────────────────────

test("exit codes reflect findings severity — and a skip can never read as clean", () => {
  const err = [{ severity: "error" }], warn = [{ severity: "warn" }], info = [{ severity: "info" }];
  assert.equal(exitCodeFor([], true), 0);
  assert.equal(exitCodeFor(info, true), 0);
  assert.equal(exitCodeFor(warn, true), 4);
  assert.equal(exitCodeFor([...warn, ...err], true), 2);
  assert.equal(exitCodeFor([], false), 3); // NOTHING LINTED ≠ clean
});

// ── READ-ONLY, structurally ──────────────────────────────────────────────────

test("the source holds exactly ONE network call site and it hard-codes GET (rule k)", () => {
  const src = readFileSync(SCRIPT, "utf8");
  const fetchSites = src.match(/\bfetch\(/g) ?? [];
  assert.equal(fetchSites.length, 1, "every additional fetch call site must be argued past this test");
  assert.match(src, /method:\s*"GET"/);
  assert.ok(!/method:\s*"(POST|PUT|PATCH|DELETE)"/.test(src), "no mutating HTTP method may exist in this file");
  assert.ok(!/(POST|PUT|PATCH|DELETE)/.test(src.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, "").match(/fetch\([\s\S]{0,200}/)?.[0] ?? ""));
});

test("no token value is ever defaulted — token envs have no fallback", () => {
  const src = readFileSync(SCRIPT, "utf8");
  for (const store of Object.values(STORES)) {
    assert.ok(src.includes(store.tokenEnv));
    assert.ok(!new RegExp(`${store.tokenEnv}\\][^\\n]*(\\|\\||\\?\\?)`).test(src),
      `${store.tokenEnv} must have no || / ?? fallback`);
  }
});

// ── CLI integration (real process, real exit codes, real reports) ────────────

test("CLI FILE mode: clean exits 0, violations exit 2, reports are written and honest", () => {
  const out = mkdtempSync(join(tmpdir(), "catlint-"));
  try {
    const clean = spawnSync(process.execPath, [SCRIPT, "--file", join(FIX, "clean.csv"), "--store", "in", "--out-dir", out], { encoding: "utf8" });
    assert.equal(clean.status, 0, clean.stdout + clean.stderr);

    const bad = spawnSync(process.execPath, [SCRIPT, "--file", join(FIX, "violations.csv"), "--store", "in", "--out-dir", out], { encoding: "utf8" });
    assert.equal(bad.status, 2, bad.stdout + bad.stderr);

    const files = readdirSync(out).sort();
    const mds = files.filter((f) => f.endsWith(".md"));
    const jsons = files.filter((f) => f.endsWith(".findings.json"));
    assert.equal(mds.length, 2, files.join(", ")); // two runs, two reports — never overwritten
    assert.equal(jsons.length, 2, files.join(", "));
    for (const f of mds) assert.match(f, /^\d{4}-\d{2}-\d{2}-\d{6}-IST-catalog-lint-file-in(?:-run\d+)?\.md$/);

    // Identify the violations run by its verdict, not by filename order
    // (two runs can share one second-precision stamp).
    const parsedJsons = jsons.map((f) => ({ f, data: JSON.parse(readFileSync(join(out, f), "utf8")) }));
    const errRun = parsedJsons.find((j) => j.data.verdict === "ERROR");
    assert.ok(errRun, "one of the two reports must carry the ERROR verdict");

    const md = readFileSync(join(out, errRun.f.replace(".findings.json", ".md")), "utf8");
    assert.match(md, /READ-ONLY run/);
    assert.match(md, /NEVER auto-fix/);
    assert.match(md, /Not covered in this run/);
    assert.match(md, /Week-over-week/); // the second run diffs against the first

    const machine = errRun.data;
    assert.ok(machine.counts.error > 0);
    assert.ok(Array.isArray(machine.findings) && machine.findings.length === machine.counts.error + machine.counts.warn + machine.counts.info);
    assert.equal(machine.meta.doctrine.includes("READ-ONLY"), true);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("CLI API mode with no tokens: LOUD per-store skip, exit 3, no report invented", () => {
  const out = mkdtempSync(join(tmpdir(), "catlint-api-"));
  try {
    const run = spawnSync(process.execPath, [SCRIPT, "--out-dir", out], { encoding: "utf8", env: bareEnv() });
    assert.equal(run.status, 3, run.stdout + run.stderr);
    assert.match(run.stdout, /SKIPPED store "in"/);
    assert.match(run.stdout, /SKIPPED store "com"/);
    assert.match(run.stdout, /NOTHING WAS LINTED/);
    assert.ok(!existsSync(out) || readdirSync(out).length === 0, "a skipped run must not write a report");
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("CLI rejects unknown arguments and a bad --store (harness error, exit 1)", () => {
  const bogus = spawnSync(process.execPath, [SCRIPT, "--frobnicate"], { encoding: "utf8", env: bareEnv() });
  assert.equal(bogus.status, 1);
  const badStore = spawnSync(process.execPath, [SCRIPT, "--store", "de"], { encoding: "utf8", env: bareEnv() });
  assert.equal(badStore.status, 1);
});

// ── report plumbing ──────────────────────────────────────────────────────────

test("istNow renders second-precision IST (CLAUDE.md timestamp law)", () => {
  const t = istNow(new Date("2026-07-18T12:00:00Z"));
  assert.equal(t.stamp, "2026-07-18 17:30:00 IST");
  assert.equal(t.compact, "2026-07-18-173000-IST");
});

test("renderMarkdown escapes pipes and always carries the doctrine line", () => {
  const md = renderMarkdown({
    meta: { mode: "FILE", store: "in", stamp: "2026-07-18 17:30:00 IST", sources: ["x.csv"], skips: [], stats: { products: 1, variants: 1, images: 1, surfaces: 0 } },
    verdict: "ERROR", counts: { error: 1, warn: 0, info: 0 },
    byRule: [{ rule: "zero-price", severity: "error", n: 1 }],
    findings: [{ severity: "error", rule: "zero-price", store: "in", kind: "product", handle: "h", where: "variants[0].price", message: "a | b", excerpt: "c | d" }],
    coverage: ["x not covered"], delta: null,
  });
  assert.match(md, /NEVER auto-fix/);
  assert.match(md, /a \\| b/);
  assert.match(md, /x not covered/);
});

test("HANDLE_RE accepts shopify handles and rejects the broken ones", () => {
  for (const good of ["kairali-hair-care-oil", "a", "a-1-b"]) assert.ok(HANDLE_RE.test(good), good);
  for (const bad of ["Bad_Handle_X", "-lead", "trail-", "double--hyphen", "UPPER", "spa ce", ""]) assert.ok(!HANDLE_RE.test(bad), bad);
});
