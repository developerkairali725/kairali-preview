#!/usr/bin/env node
// pnpm lp:perf <slug> — Lighthouse (PageSpeed Insights' mobile preset) on /lp-v2/<slug>/{a,b,c,d}. PRE-PUBLISH
// step, not CI: it needs a production build and a real Chrome. See campaign-v2/PERF.md.
//
//   pnpm lp:perf panchakarma                     build into .next-lp-perf, start on a spare port, run, stop
//   pnpm lp:perf panchakarma --base http://localhost:3471   use a production server that is already running
//   options: --runs 3 (median of N)  --variants A,B,C,D  --desktop A (also run the desktop preset on these)
//            --no-build (start the existing .next-lp-perf build)  --json out.json  --h1 (see below)
//
// HTTP/2: production (Vercel) serves every asset over one HTTP/2 connection, and Lighthouse's simulation models
// the protocol it observes. `next start` speaks HTTP/1.1, which the simulation charges for six TCP connections and
// their slow start: on the same build that alone adds ~1 s of mobile LCP. So by default the audit goes through a
// local HTTP/2 + TLS proxy (self-signed cert from `openssl`, Chrome told to accept it). --h1 audits the raw server.
//
// Never point --base at `next dev`: dev bundles are unminified and the numbers mean nothing.
// It builds into its own distDir (LP_DIST_DIR) so it never touches a dev server's .next, and restores the
// tsconfig.json / next-env.d.ts edits `next build` makes for a custom distDir.
// Exit 1 when any mobile median misses a gate (Performance >= 95, Accessibility 100, Best Practices >= 95,
// LCP <= 2.5 s (spec), CLS <= 0.05, TBT <= 150 ms), when any v2 route requests a /design/*.js file, or when v2's own
// JS (everything but the Next.js/React runtime chunks, see RUNTIME_MIN_KB) is over 90 KB compressed. LCP > 2.0 s is a warning (the
// internal target) and does not change the exit code. SEO is reported but not gated: /lp-v2 is noindex on purpose.
// Ctrl-C / SIGTERM stop the server, the proxy and Chrome, remove the temp dir and restore tsconfig.json.
import { spawn, execFileSync, fork } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import http from "node:http";
import http2 from "node:http2";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// chrome-launcher is Lighthouse's own dependency (not hoisted): resolve it from there.
const chromeLauncher = await import(pathToFileURL(createRequire(import.meta.resolve("lighthouse")).resolve("chrome-launcher")).href);

const SITE = join(import.meta.dirname, "..");
const DIST = ".next-lp-perf";
const argv = process.argv.slice(2);
if (argv[0] === "--serve-h2") { serveH2(argv[1], argv[2], argv[3]); await new Promise(() => {}); }
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i > -1 ? argv[i + 1] : d; };
const VALUED = new Set(["--base", "--runs", "--variants", "--desktop", "--json"]);
const slug = argv.find((a, i) => !a.startsWith("--") && !VALUED.has(argv[i - 1]));
if (!slug) { console.error("usage: pnpm lp:perf <slug> [--base URL] [--runs 3] [--desktop A] [--no-build]"); process.exit(2); }
const RUNS = Number(opt("runs", "3"));
const VARIANTS = opt("variants", "A,B,C,D").split(",");
const DESKTOP = opt("desktop", "A").split(",").filter(Boolean);
const JSON_OUT = opt("json", "");
const H1 = argv.includes("--h1");
export const TARGETS = { performance: 95, accessibility: 100, "best-practices": 95, lcp: 2500, cls: 0.05, tbt: 150, v2JsKB: 90 };
export const LCP_WARN = 2000;
// Next.js / React runtime every App Router page pays for; not v2's own JS. Next names some runtime chunks
// (framework, main, polyfills …) and puts others (react-dom, the client router) in hash-named shared chunks, so a
// chunk bigger than RUNTIME_MIN_KB compressed also counts as runtime. v2's page, layout and small shared chunks stay
// under it (page ≈ 15 KB).
const RUNTIME_MIN_KB = 30;
const RUNTIME_CHUNK = /\/_next\/static\/chunks\/(framework|main|main-app|webpack|polyfills)[-.]/;

const freePort = () => new Promise((res) => { const s = createServer(); s.listen(0, () => { const { port } = s.address(); s.close(() => res(port)); }); });
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

// Teardown: every resource registers a cleanup the moment it exists; run() is idempotent and also runs on
// SIGINT / SIGTERM, so an interrupted run leaves no server, proxy, Chrome, temp dir or edited tsconfig behind.
const cleanups = [];
let cleaned = false;
/** Synchronous on purpose: chrome-launcher installs its own SIGINT handler that calls process.exit(), so ours
 *  (registered first, run first) must finish all its work before returning. Returns pending promises (Chrome's exit). */
function cleanup() {
  if (cleaned) return [];
  cleaned = true;
  const pending = [];
  while (cleanups.length) {
    try { pending.push(cleanups.pop()()); } catch { /* best effort */ }
  }
  return pending;
}
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => { cleanup(); process.exit(sig === "SIGINT" ? 130 : 143); });
}

async function build() {
  const keep = ["tsconfig.json", "next-env.d.ts"].map((f) => [f, readFileSync(join(SITE, f), "utf8")]);
  cleanups.push(() => { for (const [f, s] of keep) writeFileSync(join(SITE, f), s); });
  console.log(`building into ${DIST} …`);
  const child = spawn("npx", ["next", "build"], { cwd: SITE, stdio: ["ignore", "ignore", "inherit"], env: { ...process.env, LP_DIST_DIR: DIST }, detached: true });
  const stop = () => { try { process.kill(-child.pid); } catch { /* already gone */ } };
  cleanups.push(stop);
  const code = await new Promise((res) => child.once("exit", res));
  if (code !== 0) throw new Error(`next build failed (exit ${code})`);
}

async function start() {
  const port = await freePort();
  const child = spawn("npx", ["next", "start", "-p", String(port), "-H", "127.0.0.1"], { cwd: SITE, env: { ...process.env, LP_DIST_DIR: DIST }, stdio: "ignore", detached: true });
  const stop = () => { try { process.kill(-child.pid); } catch { /* already gone */ } }; // whole process group: npx, next, its workers
  cleanups.push(stop);
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(`${base}/lp-v2/${slug}/a/`)).ok) return { base, stop }; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("server did not start");
}

/** Child mode: an HTTP/2 + TLS front for an HTTP/1.1 origin (own process, so it never competes with Lighthouse). */
function serveH2(origin, port, dir) {
  const up = new URL(origin);
  const srv = http2.createSecureServer({ key: readFileSync(join(dir, "key.pem")), cert: readFileSync(join(dir, "cert.pem")), allowHTTP1: true });
  srv.on("request", (req, res) => {
    const headers = Object.fromEntries(Object.entries(req.headers).filter(([k]) => !k.startsWith(":")));
    headers.host = up.host;
    const fwd = http.request({ host: up.hostname, port: up.port, path: req.url, method: req.method, headers }, (r) => {
      const h = { ...r.headers };
      for (const k of ["connection", "keep-alive", "transfer-encoding", "upgrade"]) delete h[k];
      res.writeHead(r.statusCode ?? 502, h);
      r.pipe(res);
    });
    fwd.on("error", () => { if (!res.headersSent) res.writeHead(502); res.end(); });
    req.pipe(fwd);
  });
  srv.listen(Number(port), "127.0.0.1", () => process.send?.("ready"));
}

/** Start the HTTP/2 front in a child process. Returns null without openssl. */
async function h2Proxy(origin) {
  const dir = mkdtempSync(join(tmpdir(), "lp-perf-"));
  try {
    execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", join(dir, "key.pem"), "-out", join(dir, "cert.pem"), "-days", "1", "-subj", "/CN=localhost", "-addext", "subjectAltName=DNS:localhost,IP:127.0.0.1"], { stdio: "ignore" });
  } catch {
    rmSync(dir, { recursive: true, force: true });
    return null;
  }
  const port = await freePort();
  const stop = () => { child.kill(); rmSync(dir, { recursive: true, force: true }); };
  const child = fork(import.meta.filename, ["--serve-h2", origin, String(port), dir], { stdio: "ignore" });
  cleanups.push(stop);
  await new Promise((res, rej) => { child.once("message", res); child.once("exit", () => rej(new Error("h2 proxy exited"))); });
  return { base: `https://127.0.0.1:${port}`, stop };
}

async function audit(url, preset, chrome) {
  const flags = { port: chrome.port, output: "json", logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] };
  const { lhr } = await lighthouse(url, flags, preset === "desktop" ? desktopConfig : undefined);
  const a = lhr.audits;
  const scriptBytes = (a["resource-summary"]?.details?.items ?? []).find((i) => i.resourceType === "script")?.transferSize ?? 0;
  // Scripts from the network audit (compressed transfer size): v2's own JS is everything but the runtime chunks.
  const net = (a["network-requests"]?.details?.items ?? []).filter((i) => i.resourceType === "Script" || /\.js(\?|$)/.test(i.url));
  const v2Bytes = net.filter((i) => !RUNTIME_CHUNK.test(i.url) && (i.transferSize ?? 0) <= RUNTIME_MIN_KB * 1024).reduce((n, i) => n + (i.transferSize ?? 0), 0);
  const designJs = net.filter((i) => /\/design\/[^?]*\.js(\?|$)/.test(new URL(i.url).pathname + new URL(i.url).search)).map((i) => new URL(i.url).pathname);
  return {
    performance: Math.round(lhr.categories.performance.score * 100),
    accessibility: Math.round(lhr.categories.accessibility.score * 100),
    "best-practices": Math.round(lhr.categories["best-practices"].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100),
    lcp: Math.round(a["largest-contentful-paint"].numericValue),
    cls: Math.round(a["cumulative-layout-shift"].numericValue * 1000) / 1000,
    tbt: Math.round(a["total-blocking-time"].numericValue),
    jsKB: Math.round(scriptBytes / 102.4) / 10,
    v2JsKB: Math.round(v2Bytes / 102.4) / 10,
    designJs,
    lcpElement: a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.selector ?? "",
    failed: Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode === "binary").map((x) => x.id),
  };
}

const results = [];
let proxy = null;
let base = opt("base", "");
let origin = base;
try {
  if (!base) {
    if (!argv.includes("--no-build")) await build();
    base = (await start()).base;
  }
  proxy = H1 ? null : await h2Proxy(base);
  if (!H1 && !proxy) console.warn("openssl not found: auditing over HTTP/1.1, which overstates LCP (see --h1 above)");
  origin = base;
  if (proxy) base = proxy.base;
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new", "--no-first-run", ...(proxy ? ["--ignore-certificate-errors"] : [])] });
  cleanups.push(() => chrome.kill());
  const jobs = [...VARIANTS.map((v) => [v, "mobile"]), ...DESKTOP.map((v) => [v, "desktop"])];
  for (const [v, preset] of jobs) {
    const url = `${base}/lp-v2/${slug}/${v.toLowerCase()}/`;
    await fetch(url.replace(base, origin)); // warm the server so the first run does not pay for cold rendering
    const runs = [];
    for (let i = 0; i < RUNS; i++) runs.push(await audit(url, preset, chrome));
    const keys = ["performance", "accessibility", "best-practices", "seo", "lcp", "cls", "tbt", "jsKB", "v2JsKB"];
    const med = Object.fromEntries(keys.map((k) => [k, median(runs.map((r) => r[k]))]));
    med.lcpElement = runs[0].lcpElement;
    med.failed = [...new Set(runs.flatMap((r) => r.failed))];
    med.designJs = [...new Set(runs.flatMap((r) => r.designJs))];
    results.push({ variant: v, preset, ...med, runs });
  }
} finally {
  await Promise.allSettled(cleanup());
}

const miss = (r) => r.preset === "mobile" && (r.performance < TARGETS.performance || r.accessibility < TARGETS.accessibility ||
  r["best-practices"] < TARGETS["best-practices"] || r.lcp > TARGETS.lcp || r.cls > TARGETS.cls || r.tbt > TARGETS.tbt ||
  r.v2JsKB > TARGETS.v2JsKB || r.designJs.length > 0);
const pad = (s, n) => String(s).padEnd(n);
const W = [8, 8, 6, 6, 6, 6, 8, 7, 8, 8, 8, 0];
console.log(`\nlp:perf ${slug} — Lighthouse median of ${RUNS} over ${proxy ? "HTTP/2 (as served in production)" : "HTTP/1.1"} (mobile = PSI default: simulated throttling, Moto G Power)`);
console.log(["variant", "preset", "Perf", "A11y", "BP", "SEO", "LCP ms", "CLS", "TBT ms", "JS KB", "v2 JS KB", ""].map((h, i) => pad(h, W[i])).join(""));
for (const r of results) {
  console.log([r.variant, r.preset, r.performance, r.accessibility, r["best-practices"], r.seo, r.lcp, r.cls, r.tbt, r.jsKB, r.v2JsKB, miss(r) ? "✖" : r.preset === "mobile" && r.lcp > LCP_WARN ? "⚠ LCP" : ""]
    .map((c, i) => pad(c, W[i])).join(""));
  if (r.failed.length) console.log(`        failing audits: ${r.failed.join(", ")}`);
  if (r.designJs.length) console.log(`        /design/*.js requested on a v2 route: ${r.designJs.join(", ")}`);
  if (r.preset === "mobile" && r.lcp > LCP_WARN && r.lcp <= TARGETS.lcp) console.log(`        warning: LCP ${r.lcp} ms is over the ${LCP_WARN} ms internal target (hard limit ${TARGETS.lcp} ms)`);
}
console.log(`gates (mobile): Perf ≥ ${TARGETS.performance}, A11y ${TARGETS.accessibility}, BP ≥ ${TARGETS["best-practices"]}, LCP ≤ ${TARGETS.lcp} ms (warn > ${LCP_WARN}), CLS ≤ ${TARGETS.cls}, TBT ≤ ${TARGETS.tbt} ms, v2 JS ≤ ${TARGETS.v2JsKB} KB compressed (JS KB column = everything incl. the Next.js/React runtime), no /design/*.js. SEO is not gated (noindex by design).`);
if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(results, null, 2));
process.exit(results.some(miss) ? 1 : 0);
