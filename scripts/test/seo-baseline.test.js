// seo-baseline.test.js — tests for the R6 baseline register + §3.5 bake-off
// mechanism (plan §3.4, M3(a); clears strict residues PKG-002/PKG-068).
//
// House rule (gate-registry-lint.test.js et al.): every detector is tested in
// BOTH directions — the clean input must PASS and the broken input must FAIL,
// for the same detector, in the same run. For a baseline mechanism the
// always-yes failure mode is a fabricated "this is where we were" record,
// which would poison every T+N comparison built on it.
//
// House style: plain ESM + node --test; tmp-dir fixtures; the network layer
// is injected (fetchImpl) — NO test touches the live API or spends money.
// Epistemology assertions are first-class: GSC sums must carry
// OBSERVED_FIRST_PARTY, script-computed derivatives CALCULATED, every vendor
// number THIRD_PARTY_ESTIMATE, absent sources UNKNOWN with a written gap — a
// register that silently invents a field is the HARD GATE 6 violation this
// suite exists to catch.
//
// This suite was hardened by the M3(a) 32-agent adversarial review
// (25 confirmed findings): ambiguous-sibling refusal (the KTAHV -www trap),
// numeric -rN run selection ('.json' sorts after '-r2.json'), quarantine of
// partial pulls, successful-manifest direction, read-side bundle verify,
// CLI arg parsing, credential-leak negative scan, verify-account-first order.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import {
  parseCsv, num, readGscExport, gscTotals,
  normalizeRankedKeywords, normalizeDomainOverview, normalizeBacklinks,
  normKeyword, normPath, joinKeywords, buildUrlRegister,
  median, computeBakeoff, renderBakeoffMd,
  nextDatedPath, parseRunName, selectLatestRun, claimDatedDir, claimDatedFile,
  makeCostMeter, loadCredentials, dfsRequest, parseArgs, assertDomainish,
  verifyBundleIfManifested,
  cmdVerifyAccount, cmdPull, cmdRegister, cmdBakeoff,
  LABELS, ENDPOINTS, API_BASE, REGISTER_SCHEMA,
} from "../seo-baseline.mjs";

const REAL_REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

// ───────────────────────── fixtures ─────────────────────────

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "seo-baseline-test-"));
}

/** tmp repo with the REAL evidence-manifest.mjs copied in, so manifest
 *  write/verify can be exercised in the SUCCESS direction (house rule). */
function tmpRepoWithManifestTool() {
  const repo = tmpdir();
  fs.mkdirSync(path.join(repo, "scripts"));
  // evidence-manifest.mjs → launch-scaffold.mjs → factory-matrix-lint.mjs
  for (const dep of ["evidence-manifest.mjs", "launch-scaffold.mjs", "factory-matrix-lint.mjs"]) {
    fs.copyFileSync(path.join(REAL_REPO, "scripts", dep), path.join(repo, "scripts", dep));
  }
  return repo;
}

function writeGscFixture(dir, { queries = true, pages = true, chart = true, nullDay = false } = {}) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "Filters.csv"), "Filter,Value\nSearch type,Web\nDate,Last 16 months\n");
  if (chart) {
    fs.writeFileSync(path.join(dir, "Chart.csv"),
      "Date,Clicks,Impressions,CTR,Position\n" +
      "2026-01-01,10,100,10%,5\n2026-01-02,20,200,10%,10\n2026-01-03,0,0,0%,-\n" +
      (nullDay ? "2026-01-04,-,-,-,-\n" : ""));
  }
  if (queries) {
    fs.writeFileSync(path.join(dir, "Queries.csv"),
      "Top queries,Clicks,Impressions,CTR,Position\n" +
      "kairali ayurvedic,20,500,4%,3.5\n" +
      "\"ayurveda, kerala\",8,300,2.67%,7.2\n" +
      "obscure long tail,2,50,4%,12\n");
  }
  if (pages) {
    fs.writeFileSync(path.join(dir, "Pages.csv"),
      "Top pages,Clicks,Impressions,CTR,Position\n" +
      "https://www.example.com/,25,600,4.17%,4.1\n" +
      "https://www.example.com/treatments/,5,250,2%,9.9\n");
  }
  fs.writeFileSync(path.join(dir, "Devices.csv"), "Device,Clicks,Impressions,CTR,Position\nMobile,20,600,3.33%,6\nDesktop,10,250,4%,4\n");
  fs.writeFileSync(path.join(dir, "Countries.csv"), "Country,Clicks,Impressions,CTR,Position\nIndia,28,800,3.5%,5\n");
}

function dfsEnvelope(resultItems, { cost = 0.01, taskStatus = 20000, apiStatus = 20000 } = {}) {
  return {
    status_code: apiStatus, status_message: "Ok.", cost,
    tasks: [{ status_code: taskStatus, status_message: taskStatus === 20000 ? "Ok." : "Error.", result: resultItems }],
  };
}

function rankedFixture() {
  const item = (kw, vol, rank, url, etv) => ({
    se_type: "google",
    keyword_data: { keyword: kw, keyword_info: { search_volume: vol, cpc: 0.2 } },
    ranked_serp_element: { serp_item: { rank_absolute: rank, relative_url: url, etv } },
  });
  return dfsEnvelope([{
    total_count: 245, items_count: 3,
    items: [
      item("kairali ayurvedic", 1300, 4, "/", 395.2),
      item("ayurveda, kerala", 800, 9, "/treatments/", 60.0),
      item("vendor only keyword", 90, 2, "/vendor-only/", 30.0),
    ],
  }]);
}

function overviewFixture() {
  return dfsEnvelope([{
    items: [{ metrics: { organic: { pos_1: 4, pos_2_3: 19, pos_4_10: 44, pos_11_20: 51, etv: 6683.26, count: 245, is_new: 102, is_up: 87, is_down: 42, is_lost: 112 } } }],
  }]);
}

function backlinksFixture() {
  // REAL shape (live-verified 19 Jul): summary fields sit directly on result[0]
  return dfsEnvelope([
    { target: "www.example.com", backlinks: 1647, referring_domains: 239, referring_main_domains: 200, rank: 236, broken_backlinks: 0, backlinks_spam_score: 1 },
  ]);
}

function userDataFixture(balance = 49.83) {
  return dfsEnvelope([{ money: { total: 51, balance } }], { cost: 0 });
}

/** fetchImpl that routes by endpoint and records calls. */
function makeFakeFetch(routes, log = []) {
  return async (url, init) => {
    log.push({ url, init });
    for (const [suffix, payload] of Object.entries(routes)) {
      if (url === API_BASE + suffix) {
        return { ok: true, status: 200, json: async () => (typeof payload === "function" ? payload() : payload) };
      }
    }
    return { ok: false, status: 404, json: async () => ({}) };
  };
}

function pullRoutes() {
  return {
    [ENDPOINTS.userData]: userDataFixture(),
    [ENDPOINTS.rankedKeywords]: rankedFixture(),
    [ENDPOINTS.domainOverview]: overviewFixture(),
    [ENDPOINTS.backlinksSummary]: backlinksFixture(),
  };
}

function writeDfsFixture(dfsDir, { omit = [], overviewJson } = {}) {
  fs.mkdirSync(dfsDir, { recursive: true });
  if (!omit.includes("ranked-keywords")) fs.writeFileSync(path.join(dfsDir, "ranked-keywords.json"), JSON.stringify(rankedFixture()));
  if (!omit.includes("domain-rank-overview")) fs.writeFileSync(path.join(dfsDir, "domain-rank-overview.json"), JSON.stringify(overviewJson ?? overviewFixture()));
  if (!omit.includes("backlinks-summary")) fs.writeFileSync(path.join(dfsDir, "backlinks-summary.json"), JSON.stringify(backlinksFixture()));
  fs.writeFileSync(path.join(dfsDir, "pull-meta.json"), JSON.stringify({ target: "www.example.com", location_code: 2356, language_code: "en", limit: 1000, total_cost_usd: 0.15, collected_at_utc: "2026-07-19T20:00:00.000Z" }));
}

function registerFixture() {
  const repo = tmpdir();
  writeGscFixture(path.join(repo, "launches", "example.com", "baseline", "raw", "gsc-ui-export-2026-07-19"));
  writeDfsFixture(path.join(repo, "launches", "example.com", "baseline", "raw", "dataforseo-2026-07-19"));
  return { repo };
}

const CREDS_ENV = { DATAFORSEO_LOGIN: "test-login", DATAFORSEO_PASSWORD: "test-secret" };

// ───────────────────────── parsing ─────────────────────────

test("parseCsv handles quoted commas, escaped quotes and CRLF", () => {
  const rows = parseCsv('a,b\n"x, y",2\r\n"he said ""hi""",3\n');
  assert.deepEqual(rows, [["a", "b"], ["x, y", "2"], ['he said "hi"', "3"]]);
});

test("num coerces GSC formats both directions", () => {
  assert.equal(num("2.82%"), 2.82);
  assert.equal(num("1,234"), 1234);
  assert.equal(num("15.9"), 15.9);
  assert.equal(num("-"), null);   // GSC's "no data" must NOT become a number
  assert.equal(num(""), null);
  assert.equal(num("N/A"), null); // garbage never coerces to a fake 0
});

test("readGscExport parses a complete export with zero flags (clean direction)", () => {
  const d = tmpdir();
  writeGscFixture(d);
  const g = readGscExport(d);
  assert.equal(g.flags.length, 0);
  assert.equal(g.queries.length, 3);
  assert.equal(g.queries[1].key, "ayurveda, kerala"); // quoted comma survives
  assert.equal(g.queries[1].clicks, 8);
  assert.equal(g.chart[2].position, null); // "-" stays null, never 0
});

test("readGscExport FLAGS missing tables instead of inventing them (broken direction)", () => {
  const d = tmpdir();
  writeGscFixture(d, { queries: false });
  const g = readGscExport(d);
  assert.equal(g.queries, null);
  assert.ok(g.flags.some((f) => f.includes("queries.csv missing") && f.includes("HARD GATE 6")));
});

test("gscTotals: sums OBSERVED, derivatives CALCULATED — labels are per-field, never blanket", () => {
  const d = tmpdir();
  writeGscFixture(d);
  const t = gscTotals(readGscExport(d));
  assert.equal(t.clicks, 30);
  assert.equal(t.impressions, 300);
  assert.equal(t.avg_position_impr_weighted, +((5 * 100 + 10 * 200) / 300).toFixed(2));
  assert.equal(t.labels.clicks, LABELS.OBSERVED);
  assert.equal(t.labels.impressions, LABELS.OBSERVED);
  assert.equal(t.labels.ctr_pct, LABELS.CALCULATED);
  assert.equal(t.labels.avg_position_impr_weighted, LABELS.CALCULATED);
  assert.equal(t.labels.monthly_avg_clicks_16m, LABELS.CALCULATED);
  assert.equal(t.days_with_null_cells, 0);
  assert.ok(t.position_method.includes(LABELS.CALCULATED));
});

test("gscTotals COUNTS null daily cells instead of hiding the 0-coercion", () => {
  const d = tmpdir();
  writeGscFixture(d, { nullDay: true });
  const t = gscTotals(readGscExport(d));
  assert.equal(t.days_with_null_cells, 1);
  assert.equal(t.clicks, 30); // the null day contributes 0 to the sum — declared via the count
});

test("gscTotals returns null (not zeros) when the chart is absent", () => {
  const d = tmpdir();
  writeGscFixture(d, { chart: false });
  assert.equal(gscTotals(readGscExport(d)), null);
});

// ───────────────────────── normalizers ─────────────────────────

test("normalizeRankedKeywords maps the real API shape to vendor-neutral fields, all ESTIMATE", () => {
  const n = normalizeRankedKeywords(rankedFixture());
  assert.equal(n.total_count, 245);
  assert.equal(n.keywords.length, 3);
  assert.deepEqual(n.keywords[0], {
    keyword: "kairali ayurvedic", search_volume_monthly: 1300, cpc_usd: 0.2,
    rank_absolute: 4, url_path: "/", etv_monthly: 395.2, label: LABELS.ESTIMATE,
  });
});

test("normalizers return null/empty on empty results instead of fabricating", () => {
  const empty = dfsEnvelope([{ items: [] }]);
  assert.equal(normalizeRankedKeywords(dfsEnvelope([{ total_count: 0, items: [] }])).keywords.length, 0);
  assert.equal(normalizeDomainOverview(empty), null);
  assert.equal(normalizeBacklinks(empty), null);
});

test("normalizeDomainOverview: absent position buckets yield NULL top10_count, not a fabricated 0", () => {
  const o = normalizeDomainOverview(overviewFixture());
  assert.equal(o.keywords_count, 245);
  assert.equal(o.top10_count, 67);
  assert.equal(o.label, LABELS.ESTIMATE);
  const sparse = normalizeDomainOverview(dfsEnvelope([{ items: [{ metrics: { organic: { count: 100, etv: 50 } } }] }]));
  assert.equal(sparse.top10_count, null);       // unknown, never "measured: none"
  assert.equal(sparse.positions.pos_1, null);   // undefined → explicit null, field survives JSON
  assert.equal(sparse.movement.lost, null);
});

test("normalizeBacklinks accepts BOTH the real flat result[0] shape and an items[0] wrapper", () => {
  const flat = normalizeBacklinks(backlinksFixture());
  assert.equal(flat.backlinks, 1647);
  assert.equal(flat.referring_domains, 239);
  assert.equal(flat.label, LABELS.ESTIMATE);
  const wrapped = normalizeBacklinks(dfsEnvelope([{ items: [{ backlinks: 9, referring_domains: 3, rank: 1 }] }]));
  assert.equal(wrapped.backlinks, 9);
  // empty result must stay null — a zero-filled summary would be an invented fact
  assert.equal(normalizeBacklinks(dfsEnvelope([{ target: "x", info: {} }])), null);
});

// ───────────────────────── joins ─────────────────────────

test("normKeyword and normPath normalize the join keys", () => {
  assert.equal(normKeyword("  Kairali   Ayurvedic "), "kairali ayurvedic");
  assert.equal(normPath("https://www.example.com/Treatments/"), "/treatments");
  assert.equal(normPath("http://www.example.com/"), "/");
  assert.equal(normPath("/treatments/"), "/treatments");
  assert.equal(normPath(null), null);
});

test("joinKeywords: every GSC query keeps OBSERVED data; vendor side null when absent", () => {
  const gsc = [
    { key: "Kairali Ayurvedic", clicks: 20, impressions: 500, position: 3.5 },
    { key: "gsc only query", clicks: 2, impressions: 50, position: 12 },
  ];
  const vendor = normalizeRankedKeywords(rankedFixture()).keywords;
  const { joined, vendorOnly } = joinKeywords(gsc, vendor);
  assert.equal(joined.length, 2);
  assert.equal(joined[0].vendor.rank_absolute, 4); // case-insensitive match
  assert.equal(joined[0].gsc.label, LABELS.OBSERVED);
  assert.equal(joined[0].vendor.label, LABELS.ESTIMATE);
  assert.equal(joined[1].vendor, null); // absent vendor data stays null, never guessed
  assert.equal(vendorOnly.length, 2);
});

test("buildUrlRegister: GSC rows OBSERVED, vendor rollup ESTIMATE, absent sources UNKNOWN with a written gap", () => {
  const gscPages = [
    { key: "https://www.example.com/", clicks: 25, impressions: 600, ctr_pct: 4.17, position: 4.1 },
  ];
  const vendor = normalizeRankedKeywords(rankedFixture()).keywords;
  const rows = buildUrlRegister(gscPages, vendor);
  const home = rows.find((r) => r.path === "/");
  assert.equal(home.gsc_16m.label, LABELS.OBSERVED);
  assert.equal(home.vendor_organic.label, LABELS.ESTIMATE);
  assert.equal(home.ga4_12m.value, null);
  assert.equal(home.ga4_12m.label, LABELS.UNKNOWN);
  assert.ok(home.ga4_12m.gap.length > 10); // the gap is WRITTEN, not implied
  assert.equal(home.disposition, null);    // Phase-2 fills it — never pre-filled here
  const vendorOnly = rows.find((r) => r.path === "/vendor-only");
  assert.ok(vendorOnly.flags?.[0].includes("vendor-only"));
  assert.equal(vendorOnly.gsc_16m, null);  // no GSC row invented for a vendor-only path
});

test("buildUrlRegister: null per-keyword ETV is COUNTED, never summed as 0", () => {
  const vendor = [
    { keyword: "a", rank_absolute: 1, url_path: "/x", etv_monthly: 10 },
    { keyword: "b", rank_absolute: 2, url_path: "/x", etv_monthly: null },
  ];
  const rows = buildUrlRegister([], vendor);
  const x = rows.find((r) => r.path === "/x");
  assert.equal(x.vendor_organic.etv_monthly_sum, 10);
  assert.equal(x.vendor_organic.etv_null_keywords, 1); // the unknown is visible
});

// ───────────────────────── bake-off ─────────────────────────

test("median: odd, even, empty", () => {
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([1, 2, 3, 4]), 2.5);
  assert.equal(median([]), null);
});

test("computeBakeoff produces hand-checkable overlap and ratio numbers", () => {
  const { repo } = registerFixture();
  const { register } = cmdRegister({ domain: "example.com", repoRoot: repo, manifest: false });
  const b = computeBakeoff(register);
  assert.equal(b.counts.gsc_queries, 3);
  assert.equal(b.counts.intersection, 2); // "kairali ayurvedic" + "ayurveda, kerala"
  assert.equal(b.overlap.share_of_gsc_queries_covered, +(2 / 3).toFixed(3));
  // clicks covered: (20+8)/(20+8+2)
  assert.equal(b.overlap.share_of_gsc_clicks_covered, +(28 / 30).toFixed(3));
  assert.equal(b.position_agreement.pairs, 2);
  // deltas: 4-3.5=0.5, 9-7.2=1.8 → median |Δ| 1.15, all within ±3
  assert.equal(b.position_agreement.median_abs_delta, 1.15);
  assert.equal(b.position_agreement.within_3, 1);
  assert.equal(b.traffic.vendor_etv_monthly, 6683.26);
  assert.equal(b.proposed_tolerances.label, LABELS.RECOMMENDATION);
});

test("computeBakeoff yields nulls (not NaN) on an empty intersection", () => {
  const b = computeBakeoff({ keywords: { joined: [], vendor_returned: 0 }, totals: {} });
  assert.equal(b.counts.intersection, 0);
  assert.equal(b.overlap.share_of_gsc_queries_covered, null);
  assert.equal(b.position_agreement.median_abs_delta, null);
  assert.equal(b.traffic.etv_over_actual_16m, null);
});

test("computeBakeoff on a GSC-only register reports vendor coverage UNKNOWN, never a measured 0.0%", () => {
  const repo = tmpdir();
  writeGscFixture(path.join(repo, "launches", "example.com", "baseline", "raw", "gsc-ui-export-2026-07-19"));
  const { register } = cmdRegister({ domain: "example.com", repoRoot: repo, manifest: false });
  const b = computeBakeoff(register);
  assert.equal(b.vendor_absent, true);
  assert.equal(b.counts.intersection, null);
  assert.equal(b.overlap.share_of_gsc_clicks_covered, null);
  assert.ok(b.overlap.note.includes(LABELS.UNKNOWN));
  const md = renderBakeoffMd("example.com", register, b);
  assert.ok(md.includes("vendor data ABSENT"));
  assert.ok(!md.includes("0.0%")); // absence must not render as a measurement
});

test("renderBakeoffMd carries the epistemology vocabulary and the RECOMMENDATION framing", () => {
  const { repo } = registerFixture();
  const { register } = cmdRegister({ domain: "example.com", repoRoot: repo, manifest: false });
  const md = renderBakeoffMd("example.com", register, computeBakeoff(register));
  assert.ok(md.includes("OBSERVED_FIRST_PARTY"));
  assert.ok(md.includes("ESTIMATE"));
  assert.ok(md.includes("RECOMMENDATION"));
  assert.ok(md.includes("owner"));           // adoption is the owner's call, in writing
  assert.ok(md.includes("proposed tolerance"));
  assert.ok(md.includes("JOIN CAVEAT"));     // property-fragmentation caveat declared
  assert.ok(!md.includes("NaN"));
  assert.ok(!md.includes("undefined"));
});

// ───────────────── run naming, selection, immutability ─────────────────

test("nextDatedPath never returns an existing path (dirs AND files)", () => {
  const d = tmpdir();
  const first = nextDatedPath(d, "run-2026-07-19");
  fs.mkdirSync(first);
  const second = nextDatedPath(d, "run-2026-07-19");
  assert.notEqual(second, first);
  assert.ok(second.endsWith("-r2"));
  const f1 = nextDatedPath(d, "register-2026-07-19", ".json");
  fs.writeFileSync(f1, "{}");
  const f2 = nextDatedPath(d, "register-2026-07-19", ".json");
  assert.ok(f2.endsWith("-r2.json"));
  assert.notEqual(f2, f1);
});

test("parseRunName parses canonical names and rejects deviants", () => {
  assert.deepEqual(parseRunName("dataforseo-2026-07-19", "dataforseo-"), { date: "2026-07-19", run: 1 });
  assert.deepEqual(parseRunName("dataforseo-2026-07-19-r12", "dataforseo-"), { date: "2026-07-19", run: 12 });
  assert.deepEqual(parseRunName("register-2026-07-19-r2.json", "register-", ".json"), { date: "2026-07-19", run: 2 });
  assert.equal(parseRunName("gsc-ui-export-2026-07-19-www", "gsc-ui-export-"), null);
  assert.equal(parseRunName("dataforseo-2026-07-19-FAILED", "dataforseo-"), null);
});

test("selectLatestRun: numeric run order (r10 > r9 > r2), corrections beat base names, -FAILED ignored", () => {
  const d = tmpdir();
  for (const n of ["dataforseo-2026-07-18", "dataforseo-2026-07-19", "dataforseo-2026-07-19-r2", "dataforseo-2026-07-19-r10", "dataforseo-2026-07-19-r3-FAILED"]) {
    fs.mkdirSync(path.join(d, n));
  }
  assert.ok(selectLatestRun(d, "dataforseo-").endsWith("-r10")); // NOT -r2 (lexicographic trap)
  const f = tmpdir();
  fs.writeFileSync(path.join(f, "register-2026-07-19.json"), "{}");
  fs.writeFileSync(path.join(f, "register-2026-07-19-r2.json"), "{}");
  // raw sort puts ".json" after "-r2.json" — numeric selection must pick the correction
  assert.ok(selectLatestRun(f, "register-", { ext: ".json", wantDir: false }).endsWith("-r2.json"));
  assert.equal(selectLatestRun(tmpdir(), "dataforseo-"), null);
});

test("selectLatestRun REFUSES ambiguous non-run siblings (the KTAHV -www property trap)", () => {
  const d = tmpdir();
  fs.mkdirSync(path.join(d, "gsc-ui-export-2026-07-19"));
  fs.mkdirSync(path.join(d, "gsc-ui-export-2026-07-19-www"));
  assert.throws(() => selectLatestRun(d, "gsc-ui-export-"), /ambiguous[\s\S]*-www[\s\S]*HARD GATE 6/);
});

test("cmdRegister refuses ambiguous GSC property dirs by default; explicit --gsc-dir resolves it", () => {
  const repo = tmpdir();
  const apex = path.join(repo, "launches", "example.com", "baseline", "raw", "gsc-ui-export-2026-07-19");
  const www = path.join(repo, "launches", "example.com", "baseline", "raw", "gsc-ui-export-2026-07-19-www");
  writeGscFixture(apex);
  writeGscFixture(www);
  assert.throws(() => cmdRegister({ domain: "example.com", repoRoot: repo, manifest: false }), /ambiguous/);
  const r = cmdRegister({ domain: "example.com", gscDir: apex, repoRoot: repo, manifest: false });
  assert.ok(r.register.sources.every((s) => !s.path.includes("-www")));
});

test("claimDatedDir and claimDatedFile survive a pre-existing claim (concurrency guard)", () => {
  const d = tmpdir();
  fs.mkdirSync(path.join(d, "dataforseo-2026-07-19")); // simulate the race loser's view
  const claimed = claimDatedDir(d, "dataforseo-2026-07-19");
  assert.ok(claimed.endsWith("-r2"));
  fs.writeFileSync(path.join(d, "x-2026-07-19.json"), "{}");
  const f = claimDatedFile(d, "x-2026-07-19", ".json", "{}");
  assert.ok(f.endsWith("-r2.json"));
});

// ───────────────── cost, creds, HTTP ─────────────────

test("makeCostMeter allows under-cap calls and REFUSES once the cap is spent", () => {
  const m = makeCostMeter(0.05);
  m.guard("/x"); // clean direction: nothing spent yet
  m.add({ cost: 0.04 });
  m.guard("/x"); // still under cap
  m.add({ cost: 0.02 });
  assert.throws(() => m.guard("/x"), /COST BUDGET REFUSAL/); // broken direction
});

test("loadCredentials: env wins; secrets file parses; total absence THROWS (never guesses)", () => {
  const c = loadCredentials({ env: CREDS_ENV, secretsFile: "/nonexistent" });
  assert.equal(c.login, "test-login");
  const sf = path.join(tmpdir(), "dataforseo.env");
  fs.writeFileSync(sf, 'DATAFORSEO_LOGIN="file-login"\nDATAFORSEO_PASSWORD=file-pass\n');
  const cf = loadCredentials({ env: {}, secretsFile: sf });
  assert.equal(cf.login, "file-login");
  assert.equal(cf.password, "file-pass");
  assert.throws(() => loadCredentials({ env: {}, secretsFile: "/nonexistent" }), /credentials not found/);
});

test("dfsRequest returns the envelope on 20000 and sends Basic auth", async () => {
  const log = [];
  const fetchImpl = makeFakeFetch({ [ENDPOINTS.userData]: userDataFixture() }, log);
  const json = await dfsRequest(ENDPOINTS.userData, null, { login: "l", password: "p" }, fetchImpl);
  assert.equal(json.status_code, 20000);
  assert.ok(log[0].init.headers.Authorization.startsWith("Basic "));
  assert.equal(log[0].init.method, "GET");
});

test("dfsRequest throws on HTTP failure, API error, and task error (all broken directions)", async () => {
  const badHttp = async () => ({ ok: false, status: 500, json: async () => ({}) });
  await assert.rejects(() => dfsRequest("/v3/x", null, { login: "l", password: "p" }, badHttp), /HTTP 500/);
  const apiErr = makeFakeFetch({ "/v3/x": dfsEnvelope([], { apiStatus: 40100 }) });
  await assert.rejects(() => dfsRequest("/v3/x", null, { login: "l", password: "p" }, apiErr), /API error 40100/);
  const taskErr = makeFakeFetch({ "/v3/x": dfsEnvelope([], { taskStatus: 40501 }) });
  await assert.rejects(() => dfsRequest("/v3/x", null, { login: "l", password: "p" }, taskErr), /task error 40501/);
});

test("cmdVerifyAccount returns balance and refuses an unverifiable account", async () => {
  const good = makeFakeFetch({ [ENDPOINTS.userData]: userDataFixture(12.34) });
  const r = await cmdVerifyAccount({ fetchImpl: good, env: CREDS_ENV });
  assert.equal(r.balance_usd, 12.34);
  const noBalance = makeFakeFetch({ [ENDPOINTS.userData]: dfsEnvelope([{ money: {} }]) });
  await assert.rejects(() => cmdVerifyAccount({ fetchImpl: noBalance, env: CREDS_ENV }), /no balance/);
});

// ───────────────── CLI arg parsing ─────────────────

test("parseArgs: camelCase flags, values, positionals — and the flag-ate-its-value trap is caught downstream", async () => {
  const { cmd, opts } = parseArgs(["pull", "--domain", "example.com", "--max-cost", "1.5", "pos1"]);
  assert.equal(cmd, "pull");
  assert.equal(opts.domain, "example.com");
  assert.equal(opts.maxCost, "1.5");
  assert.deepEqual(opts._, ["pos1"]);
  // "--domain --target x" → domain becomes the string "true"
  const eaten = parseArgs(["pull", "--domain", "--target", "x"]);
  assert.equal(eaten.opts.domain, "true");
  assert.throws(() => assertDomainish("true", "--domain"), /does not look like a domain/);
  assert.equal(assertDomainish("example.co.in", "--domain"), undefined); // clean direction
  // and the command layer actually enforces it BEFORE any billable call
  await assert.rejects(
    () => cmdPull({ domain: "true", repoRoot: tmpdir(), fetchImpl: makeFakeFetch(pullRoutes()), env: CREDS_ENV, manifest: false }),
    /does not look like a domain/,
  );
});

// ───────────────── pull / register / bakeoff commands ─────────────────

test("cmdPull writes the immutable dated raw layer with pull-meta and real costs; verify-account is the FIRST call", async () => {
  const repo = tmpdir();
  const log = [];
  const p = await cmdPull({
    domain: "example.com", target: "www.example.com", repoRoot: repo,
    fetchImpl: makeFakeFetch(pullRoutes(), log), env: CREDS_ENV, manifest: false,
  });
  // the free account check precedes every billable call (header law)
  assert.equal(log[0].url, API_BASE + ENDPOINTS.userData);
  assert.ok(log.slice(1).every((c) => c.url !== API_BASE + ENDPOINTS.userData));
  const names = fs.readdirSync(p.outDir).sort();
  assert.deepEqual(names, ["backlinks-summary.json", "domain-rank-overview.json", "pull-meta.json", "ranked-keywords.json"]);
  const meta = JSON.parse(fs.readFileSync(path.join(p.outDir, "pull-meta.json")));
  assert.equal(meta.target, "www.example.com");
  assert.equal(meta.total_cost_usd, 0.03); // 3 × 0.01 from fixtures — measured, not guessed
  assert.ok(meta.generated.endsWith("IST"));
  assert.ok(meta.collected_at_utc.endsWith("Z"));

  // immutability: a same-day second pull lands in -r2, first run untouched
  const before = fs.readdirSync(p.outDir).length;
  const p2 = await cmdPull({
    domain: "example.com", target: "www.example.com", repoRoot: repo,
    fetchImpl: makeFakeFetch(pullRoutes()), env: CREDS_ENV, manifest: false,
  });
  assert.notEqual(p2.outDir, p.outDir);
  assert.ok(p2.outDir.endsWith("-r2"));
  assert.equal(fs.readdirSync(p.outDir).length, before);
});

test("HARD GATE 14: no credential material lands in any written artifact or error message", async () => {
  const repo = tmpdir();
  const p = await cmdPull({
    domain: "example.com", repoRoot: repo,
    fetchImpl: makeFakeFetch(pullRoutes()), env: CREDS_ENV, manifest: false,
  });
  for (const f of fs.readdirSync(p.outDir)) {
    const body = fs.readFileSync(path.join(p.outDir, f), "utf8");
    assert.ok(!body.includes("test-login") && !body.includes("test-secret"), `credential material leaked into ${f}`);
    assert.ok(!body.includes("Basic "), `auth header leaked into ${f}`);
  }
  // failure path: the thrown error must not carry credentials either
  const failing = { [ENDPOINTS.userData]: userDataFixture(), [ENDPOINTS.rankedKeywords]: dfsEnvelope([], { taskStatus: 40501 }) };
  try {
    await cmdPull({ domain: "example.com", repoRoot: tmpdir(), fetchImpl: makeFakeFetch(failing), env: CREDS_ENV, manifest: false });
    assert.fail("expected rejection");
  } catch (err) {
    assert.ok(!err.message.includes("test-login") && !err.message.includes("test-secret"));
  }
});

test("cmdPull REFUSES the call that would run over --max-cost (cost budget is a gate)", async () => {
  const repo = tmpdir();
  const expensive = {
    [ENDPOINTS.userData]: userDataFixture(),
    [ENDPOINTS.rankedKeywords]: () => dfsEnvelope(rankedFixture().tasks[0].result, { cost: 1.6 }),
    [ENDPOINTS.domainOverview]: () => dfsEnvelope(overviewFixture().tasks[0].result, { cost: 1.6 }),
    [ENDPOINTS.backlinksSummary]: backlinksFixture(),
  };
  await assert.rejects(
    () => cmdPull({ domain: "example.com", repoRoot: repo, fetchImpl: makeFakeFetch(expensive), env: CREDS_ENV, manifest: false, maxCost: 2 }),
    /COST BUDGET REFUSAL/,
  );
});

test("a failed pull is QUARANTINED (-FAILED), never left where selection would consume it", async () => {
  const repo = tmpdir();
  const failing = {
    [ENDPOINTS.userData]: userDataFixture(),
    [ENDPOINTS.rankedKeywords]: rankedFixture(),
    [ENDPOINTS.domainOverview]: dfsEnvelope([], { taskStatus: 40501 }), // dies mid-pull
  };
  await assert.rejects(
    () => cmdPull({ domain: "example.com", repoRoot: repo, fetchImpl: makeFakeFetch(failing), env: CREDS_ENV, manifest: false }),
    /quarantined/,
  );
  const raw = path.join(repo, "launches", "example.com", "baseline", "raw");
  const dirs = fs.readdirSync(raw);
  assert.equal(dirs.length, 1);
  assert.ok(dirs[0].endsWith("-FAILED"), `expected quarantine suffix, got ${dirs[0]}`);
  assert.ok(fs.existsSync(path.join(raw, dirs[0], "ranked-keywords.json"))); // partial evidence preserved, loudly
  // selection ignores the quarantined dir → register falls back to the GSC-only gap
  assert.equal(selectLatestRun(raw, "dataforseo-"), null);
  writeGscFixture(path.join(raw, "gsc-ui-export-2026-07-19"));
  const { register } = cmdRegister({ domain: "example.com", repoRoot: repo, manifest: false });
  assert.ok(register.gaps.some((g) => g.field === "vendor_organic"));
});

test("evidence-manifest write: SUCCESS direction (real tool) and failure direction (missing tool)", async () => {
  // success: real evidence-manifest.mjs copied into the tmp repo
  const repo = tmpRepoWithManifestTool();
  const p = await cmdPull({
    domain: "example.com", repoRoot: repo,
    fetchImpl: makeFakeFetch(pullRoutes()), env: CREDS_ENV, manifest: true, session: "test-session",
  });
  assert.ok(fs.existsSync(path.join(p.outDir, "manifest.json")), "manifest.json written by the real tool");
  assert.equal(verifyBundleIfManifested(repo, p.outDir), true); // and it verifies clean
  // failure: no scripts/evidence-manifest.mjs in the repo root → loud throw + quarantine
  await assert.rejects(
    () => cmdPull({ domain: "example.com", repoRoot: tmpdir(), fetchImpl: makeFakeFetch(pullRoutes()), env: CREDS_ENV, manifest: true }),
    /evidence-manifest write failed[\s\S]*quarantined/,
  );
});

test("cmdRegister verifies a manifested raw bundle before consuming — tampered bytes REFUSED", async () => {
  const repo = tmpRepoWithManifestTool();
  const p = await cmdPull({
    domain: "example.com", repoRoot: repo,
    fetchImpl: makeFakeFetch(pullRoutes()), env: CREDS_ENV, manifest: true, session: "test-session",
  });
  writeGscFixture(path.join(repo, "launches", "example.com", "baseline", "raw", "gsc-ui-export-2026-07-19"));
  // clean direction: consumes fine, register + its own manifest written
  const r = cmdRegister({ domain: "example.com", repoRoot: repo, session: "test-session" });
  assert.ok(fs.existsSync(r.outFile));
  assert.ok(fs.existsSync(path.join(path.dirname(r.outFile), "manifest.json")), "register bundle is manifested");
  // broken direction: tamper one committed raw byte → refusal
  const victim = path.join(p.outDir, "backlinks-summary.json");
  fs.writeFileSync(victim, fs.readFileSync(victim, "utf8").replace("1647", "9999"));
  assert.throws(
    () => cmdRegister({ domain: "example.com", repoRoot: repo, session: "test-session" }),
    /FAILS verification/,
  );
});

test("cmdRegister builds the vendor-neutral register: schema, hashed sources, labels, gaps", () => {
  const { repo } = registerFixture();
  const { outFile, register } = cmdRegister({ domain: "example.com", repoRoot: repo, manifest: false });
  assert.equal(register.schema, REGISTER_SCHEMA);
  assert.ok(fs.existsSync(outFile));
  assert.ok(outFile.includes(`${path.sep}registers${path.sep}`)); // registers/ bundle dir
  // every source is pointer + hash (Evidence Law v2 pointer rule)
  assert.ok(register.sources.length >= 8);
  for (const s of register.sources) {
    assert.match(s.sha256, /^[0-9a-f]{64}$/);
    assert.ok([LABELS.OBSERVED, LABELS.ESTIMATE].includes(s.epistemology));
  }
  assert.equal(register.totals.gsc_16m.labels.clicks, LABELS.OBSERVED);
  assert.equal(register.totals.gsc_16m.labels.monthly_avg_clicks_16m, LABELS.CALCULATED);
  assert.equal(register.totals.vendor_domain_overview.label, LABELS.ESTIMATE);
  // the mandated UNKNOWN gaps are present and written
  for (const f of ["ga4_12m", "crawl_fields", "cwv", "gsc_api_16m"]) {
    const gap = register.gaps.find((g) => g.field === f);
    assert.ok(gap, `gap row for ${f}`);
    assert.equal(gap.label, LABELS.UNKNOWN);
    assert.ok(gap.reason.length > 15);
  }
});

test("cmdRegister: per-file dfs gaps AND vendor-returned-nothing both become written UNKNOWN rows", () => {
  // a raw dir missing one endpoint file → per-file gap
  const repo1 = tmpdir();
  writeGscFixture(path.join(repo1, "launches", "example.com", "baseline", "raw", "gsc-ui-export-2026-07-19"));
  writeDfsFixture(path.join(repo1, "launches", "example.com", "baseline", "raw", "dataforseo-2026-07-19"), { omit: ["backlinks-summary"] });
  const r1 = cmdRegister({ domain: "example.com", repoRoot: repo1, manifest: false });
  assert.ok(r1.register.gaps.some((g) => g.field === "backlinks-summary" && g.label === LABELS.UNKNOWN));
  // a raw file PRESENT whose payload is empty (unindexed target) → UNKNOWN, not silent null
  const repo2 = tmpdir();
  writeGscFixture(path.join(repo2, "launches", "example.com", "baseline", "raw", "gsc-ui-export-2026-07-19"));
  writeDfsFixture(path.join(repo2, "launches", "example.com", "baseline", "raw", "dataforseo-2026-07-19"), { overviewJson: dfsEnvelope([{ items: null }]) });
  const r2 = cmdRegister({ domain: "example.com", repoRoot: repo2, manifest: false });
  assert.equal(r2.register.totals.vendor_domain_overview, null);
  assert.ok(r2.register.gaps.some((g) => g.field === "vendor_domain_overview" && g.reason.includes("NO data")));
});

test("cmdRegister works GSC-only (the documented vendor fallback path) and never overwrites", () => {
  const d = tmpdir();
  const gscDir = path.join(d, "launches", "example.com", "baseline", "raw", "gsc-ui-export-2026-07-19");
  writeGscFixture(gscDir);
  const r1 = cmdRegister({ domain: "example.com", repoRoot: d, manifest: false });
  assert.ok(r1.register.gaps.some((g) => g.field === "vendor_organic" && g.reason.includes("fallback")));
  assert.equal(r1.register.totals.vendor_domain_overview, null);
  assert.equal(r1.register.totals.gsc_16m.clicks, 30);
  const r2 = cmdRegister({ domain: "example.com", repoRoot: d, manifest: false });
  assert.notEqual(r2.outFile, r1.outFile); // append-only: -r2, not overwrite
  assert.ok(fs.existsSync(r1.outFile));
});

test("cmdBakeoff consumes the NEWEST register (same-day -r2 correction wins) and refuses with none", () => {
  const { repo } = registerFixture();
  const r1 = cmdRegister({ domain: "example.com", repoRoot: repo, manifest: false });
  // same-day correction: -r2 register with a visibly different GSC query count
  const corrected = JSON.parse(JSON.stringify(r1.register));
  corrected.keywords.joined = corrected.keywords.joined.slice(0, 1);
  const regDir = path.dirname(r1.outFile);
  fs.writeFileSync(path.join(regDir, path.basename(r1.outFile).replace(".json", "-r2.json")), JSON.stringify(corrected));
  const b = cmdBakeoff({ domain: "example.com", repoRoot: repo, manifest: false });
  assert.equal(b.bakeoff.counts.gsc_queries, 1, "bakeoff must read the -r2 correction, not the stale base register");
  assert.throws(() => cmdBakeoff({ domain: "missing.example", repoRoot: repo, manifest: false }), /no register-.*run register first/);
});

test("cmdBakeoff writes an append-only report", () => {
  const { repo } = registerFixture();
  cmdRegister({ domain: "example.com", repoRoot: repo, manifest: false });
  const b1 = cmdBakeoff({ domain: "example.com", repoRoot: repo, manifest: false });
  assert.ok(fs.existsSync(b1.outFile));
  const b2 = cmdBakeoff({ domain: "example.com", repoRoot: repo, manifest: false });
  assert.notEqual(b2.outFile, b1.outFile);
  assert.ok(b2.outFile.endsWith("-r2.md"));
});
