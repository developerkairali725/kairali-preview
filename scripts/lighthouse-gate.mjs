#!/usr/bin/env node
/**
 * lighthouse-gate.mjs — Ship Gate A5 as an executed gate, not a checklist line.
 *
 * WHY THIS EXISTS. The A5 budget (SITE_LAUNCH_CHECKLIST_v1.0.md item 5:
 * Performance ≥90 · Accessibility ≥95 · SEO = 100) has existed since 13 Jul —
 * as prose, plus a "TODO: Lighthouse CI" comment at the bottom of gate.yml.
 * The 17-Jul retro-audit found no wave site ever ran it ("Lighthouse (A5)
 * still not in CI", known open gap #1 on 14 Jul, still open on the 17th).
 * A budget nobody measures is a comment. This script measures it, in the
 * factory-gate `lighthouse` job, per fleet site, on every PR.
 *
 * WHAT IT RUNS. Lighthouse (pinned devDependency, mobile emulation — the
 * fleet's ~80%-mobile law) against the site's local production build
 * (`next start`, the factory spec suite's own transport). URLs come from
 * sites/<domain>/lighthouse-urls.json (a JSON array of paths) when present;
 * default is ["/"] with a LOUD notice, because A5 wants home + one content
 * template + one LP and home-only is partial coverage, stated, never silent.
 *
 * SCORING. Accessibility and SEO are deterministic — one run decides.
 * Performance is noisy on shared runners, so a first-run miss triggers four
 * more runs and the MEDIAN of five decides — never best-of (that would be
 * gaming our own gate), never a lowered threshold (CLAUDE.md rule g).
 * Five, not three, since 17 Jul 2026 (Q-A5-FLAKE): with three samples a single
 * runner-noise outlier drags the median onto the budget line and fails correct
 * code ~50% of the time. Extra runs cost nothing unless a run has already
 * missed.
 *
 * Exit codes: 0 = all URLs within budget · 2 = budget violation · 1 = harness error.
 *
 * Usage:
 *   SITE=sites/<domain> node scripts/lighthouse-gate.mjs
 *   node scripts/lighthouse-gate.mjs sites/<domain> [--port 4311]
 */

import { readFileSync, existsSync, mkdtempSync, rmSync, readdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { resolveSiteAppRoot } from "./lib/site-app-root.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Ship Gate A5 budgets (SITE_LAUNCH_CHECKLIST_v1.0.md item 5). Never lowered here. */
export const BUDGETS = { performance: 90, accessibility: 95, seo: 100 };
export function performanceMinimumForSite(site) {
  return site === "sites/ayurvedichealingvillage.com" ? 89 : BUDGETS.performance;
}
/** Runs that decide a first-run performance miss. MEDIAN of these — never
 *  best-of (that games our own gate), never a lowered budget (CLAUDE.md rule g).
 *
 *  Was 3; raised to 5 on 17 Jul 2026 per Abilash's ruling on Q-A5-FLAKE. Why:
 *  the gate was failing ~50% of the time on code that cannot affect performance
 *  (a .gitattributes line; a markdown-only PR). Two measured examples on
 *  kairaliyoga, both later passing GREEN on a re-run of the IDENTICAL commit:
 *    perf median of 64/91/89 → 89   (spread 27)
 *    perf median of 71/92/89 → 89   (spread 21)
 *  In both, ONE severe outlier (64, 71 — shared-runner CPU steal) sat below two
 *  healthy samples, and with only 3 samples the median lands ON the lower
 *  healthy one. Five samples let a single outlier be outvoted: the median moves
 *  to the 3rd of 5, so one bad run can no longer decide the gate.
 *
 *  COSTS NOTHING when a site is healthy — these runs only happen AFTER a first
 *  run misses the budget, so passing sites still take exactly one run.
 *
 *  This does NOT make the gate immune. kairaliyoga genuinely measures ~89-94 on
 *  CI runners against a budget of 90, so it is a marginal page, and a marginal
 *  page can still fail honestly. That is the gate working. If it keeps flaking
 *  after this, the cause is the page's real CI headroom, not the sampling —
 *  fix the page (Q-A5-FLAKE option 2: dedicated runners), never the budget. */
export const PERF_RUNS_ON_MISS = 5;

/** @param {number[]} xs */
export const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

/**
 * Judge one URL's category scores (0–100) against the budgets.
 * Pure — the tests drive it in both directions.
 * @param {{performance:number, accessibility:number, seo:number}} scores
 * @param {{seoNA?: boolean}} [opts] — seoNA per the registry's landing
 *   adaptation (see seoWaived below); perf/a11y always bind.
 * @returns {string[]} violations (empty = within budget)
 */
export function judge(scores, opts = {}) {
  const v = [];
  const performanceMinimum = opts.performanceMinimum ?? BUDGETS.performance;
  if (scores.performance < performanceMinimum) v.push(`performance ${scores.performance} < ${performanceMinimum}`);
  if (scores.accessibility < BUDGETS.accessibility) v.push(`accessibility ${scores.accessibility} < ${BUDGETS.accessibility}`);
  if (!opts.seoNA && scores.seo < BUDGETS.seo) v.push(`SEO ${scores.seo} < ${BUDGETS.seo} (A5 says exactly 100)`);
  return v;
}

/**
 * The landing-class SEO adaptation, ACTIVATED from its declared law — never a
 * new judgment call. gates/registry.yaml `lighthouse-budgets` → landing:
 * "SEO=100 n/a on noindexed LPs per LANDING_PAGE_DOCTRINE §8 — perf/a11y
 * budgets bind unchanged"; the doctrine's own words (§8): "SEO gate n/a to
 * noindexed LPs". BOTH conditions must hold — the measured page is an
 * /lp/<campaign> route AND Lighthouse's is-crawlable audit reports it blocked
 * from indexing (score 0). A noindexed NON-lp page gets NO waiver: outside the
 * LP doctrine, noindex is a defect signal the SEO budget exists to catch.
 * The registry's OTHER landing half ("STRICTER speed budget", doctrine §6)
 * names no number and stays declared-dormant law — perf binds at the standard
 * ≥90 here, never a made-up stricter figure (HARD GATE 6).
 * Pure — tests drive it in all directions.
 * @param {{finalPath: string, crawlableScore: number|null}} signals
 * @returns {boolean}
 */
export function seoWaived({ finalPath, crawlableScore }) {
  return typeof finalPath === "string" && /^\/lp\//.test(finalPath) && crawlableScore === 0;
}

/** Read the site's URL list; default home-only, loudly. */
export function urlsFor(siteDir, root = REPO_ROOT) {
  const cfg = join(root, siteDir, "lighthouse-urls.json");
  if (existsSync(cfg)) {
    const urls = JSON.parse(readFileSync(cfg, "utf8"));
    if (!Array.isArray(urls) || urls.length === 0 || !urls.every((u) => typeof u === "string" && u.startsWith("/"))) {
      throw new Error(`${siteDir}/lighthouse-urls.json must be a non-empty JSON array of paths starting with "/"`);
    }
    return { urls, defaulted: false };
  }
  return { urls: ["/"], defaulted: true };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForServer(url, timeoutMs = 90_000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status < 500) return;
    } catch { /* not up yet */ }
    await sleep(750);
  }
  throw new Error(`server at ${url} not ready after ${timeoutMs / 1000}s — did pnpm build run for this site?`);
}

/** One Lighthouse run → {performance, accessibility, seo} as 0–100 integers. */
function runLighthouse(url, outDir, tag) {
  const outPath = join(outDir, `lh-${tag}.json`);
  execFileSync(
    "pnpm",
    [
      "exec", "lighthouse", url,
      "--output=json", `--output-path=${outPath}`,
      "--only-categories=performance,accessibility,seo",
      "--form-factor=mobile", "--quiet",
      '--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage',
    ],
    { cwd: REPO_ROOT, stdio: ["ignore", "inherit", "inherit"], timeout: 240_000 },
  );
  const report = JSON.parse(readFileSync(outPath, "utf8"));
  const score = (cat) => {
    const s = report.categories?.[cat]?.score;
    if (typeof s !== "number") throw new Error(`lighthouse produced no ${cat} score for ${url} (runtimeError: ${report.runtimeError?.message ?? "none"})`);
    return Math.round(s * 100);
  };
  // Signals for the landing-class SEO adaptation (seoWaived): where the run
  // actually landed after redirects, and whether the page is noindexed.
  let finalPath = null;
  try { finalPath = new URL(report.finalDisplayedUrl ?? report.finalUrl ?? url).pathname; } catch { /* leave null */ }
  const crawlable = report.audits?.["is-crawlable"]?.score;
  return {
    performance: score("performance"), accessibility: score("accessibility"), seo: score("seo"),
    diagnostics: Object.values(report.audits ?? {}).filter((audit) =>
      typeof audit.score === "number" && audit.score < 0.9 && audit.scoreDisplayMode !== "notApplicable"
    ).map((audit) => ({ id: audit.id, title: audit.title, value: audit.displayValue,
      details: JSON.stringify(audit.details?.items ?? []).slice(0, 5000) })),
    finalPath, crawlableScore: typeof crawlable === "number" ? crawlable : null,
  };
}

async function main(argv) {
  const site = argv.find((a) => !a.startsWith("-")) ?? process.env.SITE;
  if (!site) {
    console.error("usage: SITE=sites/<domain> node scripts/lighthouse-gate.mjs");
    return 1;
  }
  const portArg = argv.indexOf("--port");
  const port = Number(portArg >= 0 ? argv[portArg + 1] : process.env.PORT ?? 4311);
  const base = `http://localhost:${port}`;

  if (!existsSync(join(REPO_ROOT, site, "site.config.json"))) {
    console.error(`lighthouse-gate: ${site} has no site.config.json — not a fleet site`);
    return 1;
  }
  const appDir = resolveSiteAppRoot(site);
  const { urls, defaulted } = urlsFor(site);

  console.log(`\nlighthouse-gate — Ship Gate A5 · ${site} · budgets perf ≥${performanceMinimumForSite(site)} / a11y ≥${BUDGETS.accessibility} / SEO =${BUDGETS.seo} (mobile)`);
  if (defaulted) {
    console.log(`  NOTICE: no ${site}/lighthouse-urls.json — gating "/" ONLY. A5 wants home + one content template + one LP; add the file to close the gap (QUESTIONS.md item, 17 Jul). Partial coverage is stated, never silent.`);
  }

  const server = spawn("pnpm", ["exec", "next", "start", "-p", String(port)], {
    cwd: appDir,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let serverLog = "";
  server.stdout.on("data", (d) => { serverLog += d; });
  server.stderr.on("data", (d) => { serverLog += d; });
  const outDir = mkdtempSync(join(tmpdir(), "lh-gate-"));

  try {
    await waitForServer(base);

    const failures = [];
    for (const path of urls) {
      const url = base + path;
      let scores = runLighthouse(url, outDir, `${path.replace(/\W+/g, "_")}-1`);
      let note = "";
      if (scores.performance < BUDGETS.performance) {
        // perf is the one noisy category — median of PERF_RUNS_ON_MISS decides,
        // never best-of. 5 samples so one outlier cannot decide the gate (Q-A5-FLAKE).
        const samples = [scores];
        const perfs = [scores.performance];
        for (let i = 2; i <= PERF_RUNS_ON_MISS; i++) {
          const again = runLighthouse(url, outDir, `${path.replace(/\W+/g, "_")}-${i}`);
          perfs.push(again.performance);
          samples.push(again);
          scores.accessibility = Math.min(scores.accessibility, again.accessibility);
          scores.seo = Math.min(scores.seo, again.seo);
        }
        scores.diagnostics = [...samples].sort((a, b) => a.performance - b.performance)[Math.floor(samples.length / 2)].diagnostics;
        scores.performance = median(perfs);
        note = ` (perf median of ${perfs.join("/")})`;
      }
      const seoNA = seoWaived(scores);
      if (seoNA) {
        console.log(`  SEO-N/A  ${path} → landed on noindexed LP ${scores.finalPath} — registry lighthouse-budgets landing adaptation (LANDING_PAGE_DOCTRINE §8: "SEO gate n/a to noindexed LPs"); perf/a11y budgets bind unchanged`);
      }
      // Owner acceptance, 1 October 2026: AHV may pass at 89. This changes
      // neither another site's budget nor accessibility/SEO requirements.
      const performanceMinimum = performanceMinimumForSite(site);
      if (performanceMinimum !== BUDGETS.performance) console.log("  OWNER EXCEPTION: AHV performance minimum 89 (1 October 2026); accessibility/SEO unchanged");
      const v = judge(scores, { seoNA, performanceMinimum });
      console.log(`  ${v.length === 0 ? "PASS" : "FAIL"}  ${path} → perf ${scores.performance} · a11y ${scores.accessibility} · seo ${seoNA ? `${scores.seo} (n/a — noindexed LP)` : scores.seo}${note}`);
      if (v.length) console.log(`  DIAGNOSTICS ${path}: ${JSON.stringify(scores.diagnostics)}`);
      for (const violation of v) failures.push(`${path}: ${violation}`);
    }

    if (failures.length === 0) {
      console.log(`\nPASS — ${urls.length} URL(s) within the A5 budget.\n`);
      return 0;
    }
    for (const f of failures) console.log(`\nBUDGET  ${f}`);
    console.log(`\nFAIL — ${failures.length} A5 budget violation(s). Fix the page, never the budget (CLAUDE.md rule g).\n`);
    return 2;
  } finally {
    server.kill("SIGTERM");
    rmSync(outDir, { recursive: true, force: true });
    if (server.exitCode === null) await sleep(500);
    if (process.exitCode === 1 && serverLog) console.error(`server log tail:\n${serverLog.slice(-2000)}`);
  }
}

// NOTE: comparing import.meta.url to process.argv[1] as raw STRINGS silently
// broke on any checkout path containing a space — import.meta.url percent-encodes
// it, argv[1] does not — so main() never ran and the script exited 0 having
// checked NOTHING. Normalising argv[1] through URL() fixes it with no new import.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (e) => {
      console.error(`lighthouse-gate: harness error — ${e.message}`);
      process.exit(1);
    },
  );
}
