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
 * Performance is noisy on shared runners, so a first-run miss triggers two
 * more runs and the MEDIAN decides — never best-of (that would be gaming
 * our own gate), never a lowered threshold (CLAUDE.md rule g).
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

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Ship Gate A5 budgets (SITE_LAUNCH_CHECKLIST_v1.0.md item 5). Never lowered here. */
export const BUDGETS = { performance: 90, accessibility: 95, seo: 100 };
const PERF_RUNS_ON_MISS = 3; // median of 3 decides a first-run performance miss

/** @param {number[]} xs */
export const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

/**
 * Judge one URL's category scores (0–100) against the budgets.
 * Pure — the tests drive it in both directions.
 * @param {{performance:number, accessibility:number, seo:number}} scores
 * @returns {string[]} violations (empty = within budget)
 */
export function judge(scores) {
  const v = [];
  if (scores.performance < BUDGETS.performance) v.push(`performance ${scores.performance} < ${BUDGETS.performance}`);
  if (scores.accessibility < BUDGETS.accessibility) v.push(`accessibility ${scores.accessibility} < ${BUDGETS.accessibility}`);
  if (scores.seo < BUDGETS.seo) v.push(`SEO ${scores.seo} < ${BUDGETS.seo} (A5 says exactly 100)`);
  return v;
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
  return { performance: score("performance"), accessibility: score("accessibility"), seo: score("seo") };
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
  const { urls, defaulted } = urlsFor(site);

  console.log(`\nlighthouse-gate — Ship Gate A5 · ${site} · budgets perf ≥${BUDGETS.performance} / a11y ≥${BUDGETS.accessibility} / SEO =${BUDGETS.seo} (mobile)`);
  if (defaulted) {
    console.log(`  NOTICE: no ${site}/lighthouse-urls.json — gating "/" ONLY. A5 wants home + one content template + one LP; add the file to close the gap (QUESTIONS.md item, 17 Jul). Partial coverage is stated, never silent.`);
  }

  const server = spawn("pnpm", ["--dir", site, "exec", "next", "start", "-p", String(port)], {
    cwd: REPO_ROOT,
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
        // perf is the one noisy category — median of 3 decides, never best-of
        const perfs = [scores.performance];
        for (let i = 2; i <= PERF_RUNS_ON_MISS; i++) {
          const again = runLighthouse(url, outDir, `${path.replace(/\W+/g, "_")}-${i}`);
          perfs.push(again.performance);
          scores.accessibility = Math.min(scores.accessibility, again.accessibility);
          scores.seo = Math.min(scores.seo, again.seo);
        }
        scores.performance = median(perfs);
        note = ` (perf median of ${perfs.join("/")})`;
      }
      const v = judge(scores);
      console.log(`  ${v.length === 0 ? "PASS" : "FAIL"}  ${path} → perf ${scores.performance} · a11y ${scores.accessibility} · seo ${scores.seo}${note}`);
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

if (import.meta.url === `file://${process.argv[1]}`) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (e) => {
      console.error(`lighthouse-gate: harness error — ${e.message}`);
      process.exit(1);
    },
  );
}
