#!/usr/bin/env node
/**
 * AHV English candidate — route-state verification against the ACCEPTED baseline.
 *
 * Loads approved routes in a real browser at 320 and 1024 and compares each
 * state to the design package's own accepted evidence
 * (FINAL-PORTABLE-504-VERIFICATION.json -> FINAL-PORTABLE-ENTRY-*.json), which
 * is the same bar the independent reviewer applies. "HTTP 200 with some <h1>"
 * is explicitly NOT the bar: title, the visible H1 list, the canonical list and
 * the full body text must match the accepted state for that exact route+width.
 *
 * A state passes only when ALL of these hold:
 *   · HTTP 200
 *   · title       === baseline title
 *   · h1[]        === baseline h1[]            (visible H1s, in order)
 *   · canonical[] === baseline canonical[]     (so exactly one, and the right one)
 *   · bodyText    === baseline bodyText        (reported; see --require-body)
 *   · a robots meta containing "noindex"       (staging lock)
 *   · no horizontal overflow at that width
 *   · no visible broken image
 *   · no uncaught page error
 *   · no off-origin request (self-hosting: nothing may reach WordPress/CDN)
 *   · no response >= 400
 *   · no iframe
 *
 * Usage:
 *   node tools/verify-english-candidate.mjs                       # all 252 routes
 *   node tools/verify-english-candidate.mjs --routes / /about-us/ # named routes
 *   node tools/verify-english-candidate.mjs --limit 25 --widths 320
 *   node tools/verify-english-candidate.mjs --out <file.json>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, "..");
const HANDOFF =
  process.env.AHV_HANDOFF_DIR ??
  "/Volumes/Extreme SSD - Blue 2nd/Claude Workspaces/10x WordPress and Websites/deliverables/WOPS-AHV-CLAUDE-CONTINUATION-002/code-handoff";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i > -1 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : fallback;
};
const list = (name) => {
  const i = argv.indexOf(name);
  if (i < 0) return null;
  const out = [];
  for (let j = i + 1; j < argv.length && !argv[j].startsWith("--"); j += 1) out.push(argv[j]);
  return out;
};

const BASE = flag("--base", "http://localhost:4321").replace(/\/$/, "");
const LIMIT = Number(flag("--limit", "0"));
const CONCURRENCY = Number(flag("--concurrency", "4"));
const ONLY = list("--routes");
const WIDTHS = (list("--widths") ?? ["320", "1024"]).map(Number);
const REQUIRE_BODY = argv.includes("--require-body");
const OUT = flag("--out", path.join(SITE, "..", "..", "launches", "ayurvedichealingvillage.com", "evidence", "route-verification", "route-verification.json"));

const BREAKPOINT = 700;

const manifest = JSON.parse(
  fs.readFileSync(path.join(SITE, "english-candidate", "route-manifest.json"), "utf8"),
);

/* ---- accepted baseline index: route|width -> state ---- */
const baselineIndex = new Map();
{
  const top = JSON.parse(
    fs.readFileSync(path.join(HANDOFF, "FINAL-PORTABLE-504-VERIFICATION.json"), "utf8"),
  );
  const seen = new Set();
  for (const ref of top.batches.flat()) {
    if (seen.has(ref.evidence)) continue;
    seen.add(ref.evidence);
    const file = path.join(HANDOFF, ref.evidence);
    if (!fs.existsSync(file)) continue;
    for (const row of JSON.parse(fs.readFileSync(file, "utf8")).rows ?? [])
      baselineIndex.set(`${row.route}|${row.width}`, row.state);
  }
}

/** Source path "/about-us/" -> served URL "/about-us" (Next trims the slash). */
const urlFor = (routePath) =>
  routePath === "/" ? "/" : "/" + routePath.replace(/^\/|\/$/g, "");

async function checkState(browser, route, width) {
  const ctx = await browser.newContext({
    viewport: { width, height: 1080 },
    reducedMotion: "reduce",
    serviceWorkers: "block",
  });
  const page = await ctx.newPage();
  const errors = [];
  const external = [];
  const missing = [];
  page.on("pageerror", (e) => errors.push(String(e.message ?? e).slice(0, 200)));
  page.on("response", (r) => {
    if (r.status() >= 400) missing.push({ url: r.url(), status: r.status() });
  });
  await ctx.route("**/*", async (r) => {
    if (new URL(r.request().url()).origin !== BASE) {
      external.push(r.request().url());
      await r.abort();
    } else await r.continue();
  });

  const result = { route: route.path, width, url: BASE + urlFor(route.path), problems: [] };
  try {
    const response = await page.goto(result.url, { waitUntil: "load", timeout: 45000 });
    result.status = response?.status() ?? 0;
    await page.locator("h1").first().waitFor({ timeout: 20000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    result.state = await page.evaluate(() => ({
      title: document.title,
      lang: document.documentElement.lang,
      bodyText: document.body.innerText,
      h1: [...document.querySelectorAll("h1")]
        .filter((e) => e.getBoundingClientRect().height)
        .map((e) => e.innerText),
      canonical: [...document.querySelectorAll("link[rel=canonical]")].map((e) => e.href),
      robots: [...document.querySelectorAll("meta[name=robots]")].map((e) => e.content),
      // Iframes, split by origin. The blanket count was written when the site had
      // none, and it is the assertion cited whenever an embed is proposed — it is
      // why the maps question was settled with a static map. Since the owner ruled
      // the Chatbase bubble ships (D-20260921-06), a bare count would have meant
      // "the sweep finished before the widget loaded" rather than "no iframe", and
      // the gate's meaning would have drifted without anyone deciding it.
      // So: a KNOWN third-party widget is counted separately and reported, never
      // silently dropped; anything else is still a failure, exactly as before.
      iframes: [...document.querySelectorAll("iframe")]
        .filter((f) => !/(?:^|\/\/)(?:[\w-]+\.)*chatbase\.co\//.test(f.src || ""))
        .length,
      widgetIframes: [...document.querySelectorAll("iframe")]
        .filter((f) => /(?:^|\/\/)(?:[\w-]+\.)*chatbase\.co\//.test(f.src || ""))
        .map((f) => f.src.split("?")[0]),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      actualView: document.getElementById("ahv-design-root")?.getAttribute("data-ahv-view-file") ?? null,
      previewMarker: document.documentElement.getAttribute("data-ahv-preview-target"),
      brokenImages: [...document.images]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width && r.height && r.top < innerHeight && r.bottom > 0 && (!e.complete || !e.naturalWidth);
        })
        .map((e) => e.src),
    }));
  } catch (err) {
    result.problems.push(`navigation: ${String(err.message ?? err).split("\n")[0]}`);
  }

  const prior = baselineIndex.get(`${route.path}|${width}`) ?? null;
  const s = result.state;
  if (s) {
    result.comparison = prior
      ? {
          title: s.title === prior.title,
          h1: JSON.stringify(s.h1) === JSON.stringify(prior.h1),
          canonical: JSON.stringify(s.canonical) === JSON.stringify(prior.canonical),
          bodyExact: s.bodyText === prior.bodyText,
          actualView: s.actualView === prior.actualView,
        }
      : null;
    if (!prior) result.problems.push("no accepted baseline row for this route+width");
    else {
      if (!result.comparison.title) result.problems.push(`title != baseline (${JSON.stringify(s.title)} vs ${JSON.stringify(prior.title)})`);
      if (!result.comparison.h1) result.problems.push(`h1 != baseline (${JSON.stringify(s.h1)} vs ${JSON.stringify(prior.h1)})`);
      if (!result.comparison.canonical) result.problems.push(`canonical != baseline (${JSON.stringify(s.canonical)} vs ${JSON.stringify(prior.canonical)})`);
      if (!result.comparison.actualView) result.problems.push(`view ${s.actualView} != baseline ${prior.actualView}`);
      if (!result.comparison.bodyExact) {
        const diff = firstDiff(s.bodyText, prior.bodyText);
        result.bodyDiff = diff;
        if (REQUIRE_BODY) result.problems.push(`body != baseline @${diff.index}: got ${JSON.stringify(diff.got)} want ${JSON.stringify(diff.want)}`);
      }
    }
    if (result.status !== 200) result.problems.push(`HTTP ${result.status}`);
    if (!s.robots.some((x) => x.includes("noindex"))) result.problems.push(`robots not noindex: ${JSON.stringify(s.robots)}`);
    if (s.overflow) result.problems.push("horizontal overflow");
    if (s.brokenImages.length) result.problems.push(`broken images: ${s.brokenImages.slice(0, 3).join(", ")}`);
    if (s.iframes) result.problems.push(`${s.iframes} iframe(s)`);
    // Reported, not a problem: a ruled third-party widget. Visible so nobody
    // later mistakes an empty problems list for "this page embeds nothing".
    if (s.widgetIframes?.length) result.widgetIframes = s.widgetIframes;
  }
  if (errors.length) result.problems.push(`page error: ${errors[0]}`);
  if (external.length) result.problems.push(`off-origin: ${external[0]}`);
  if (missing.length) result.problems.push(`HTTP>=400 (${missing.length}): ${missing.slice(0, 3).map((m) => `${m.status} ${m.url}`).join(" | ")}`);
  result.errors = errors.slice(0, 3);
  result.external = [...new Set(external)].slice(0, 3);
  result.missing = missing.slice(0, 6);
  result.passed = result.problems.length === 0;

  await ctx.close();
  return result;
}

function firstDiff(got = "", want = "") {
  let i = 0;
  while (i < got.length && i < want.length && got[i] === want[i]) i += 1;
  return { index: i, got: got.slice(i, i + 90), want: want.slice(i, i + 90) };
}

async function main() {
  let routes = manifest.routes;
  if (ONLY && ONLY.length) routes = routes.filter((r) => ONLY.includes(r.path));
  if (LIMIT > 0) routes = routes.slice(0, LIMIT);
  if (!routes.length) {
    console.error("no routes selected");
    process.exit(2);
  }

  const jobs = [];
  for (const route of routes) for (const width of WIDTHS) jobs.push({ route, width });

  const browser = await chromium.launch();
  const results = new Array(jobs.length);
  let next = 0;
  let done = 0;
  const worker = async () => {
    for (;;) {
      const i = next++;
      if (i >= jobs.length) return;
      results[i] = await checkState(browser, jobs[i].route, jobs[i].width);
      done += 1;
      if (done % 25 === 0 || done === jobs.length) process.stdout.write(`  ${done}/${jobs.length} states\n`);
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, worker));
  await browser.close();

  const failures = results.filter((r) => !r.passed);
  const bodyDiffs = results.filter((r) => r.comparison && !r.comparison.bodyExact);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(
    OUT,
    JSON.stringify(
      {
        taskId: "WOPS-AHV-ENGLISH-STAGING-BUILD-20260915-001",
        base: BASE,
        generated: new Date().toISOString(),
        baseline: "FINAL-PORTABLE-504-VERIFICATION.json (accepted design-package evidence)",
        widths: WIDTHS,
        breakpoint: BREAKPOINT,
        requireBody: REQUIRE_BODY,
        totals: {
          states: results.length,
          passed: results.length - failures.length,
          failed: failures.length,
          bodyTextDiffs: bodyDiffs.length,
        },
        results,
      },
      null,
      1,
    ) + "\n",
  );

  console.log(`\n${results.length - failures.length}/${results.length} states pass the accepted-baseline bar`);
  console.log(`body-text exact: ${results.length - bodyDiffs.length}/${results.length}${REQUIRE_BODY ? "" : " (reported, not gating — pass --require-body to gate)"}`);
  for (const f of failures.slice(0, 20)) console.log(`  FAIL ${f.width} ${f.route}\n      ${f.problems.join("\n      ")}`);
  if (failures.length > 20) console.log(`  ... and ${failures.length - 20} more`);
  for (const d of bodyDiffs.slice(0, 5))
    console.log(`  BODYDIFF ${d.width} ${d.route} @${d.bodyDiff.index}\n      got : ${JSON.stringify(d.bodyDiff.got)}\n      want: ${JSON.stringify(d.bodyDiff.want)}`);
  console.log(`report: ${path.relative(SITE, OUT)}`);
  process.exit(failures.length ? 1 : 0);
}

main();
