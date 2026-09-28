// Hydrated first-party document links (owner regression 28 Sep 2026: the OPD rates PDF link became a production 404
// after hydration while the raw HTML and the EF sweep looked fine). Loads every manifest route (optionally a locale
// prefix list) in a real browser, waits for hydration, and reports any visible link to a /documents/ path that
// leaves this deployment, plus the status of every distinct /documents/ link it saw. Optional OIDC header for
// protected staging comes from the environment and is never printed.
//   node tools/hydrated-document-link-audit.mjs --base <url> [--locales de,ar] [--out file.json] [--concurrency 4]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://localhost:4471").replace(/\/$/, "");
const OUT = arg("out", null);
const CONC = Number(arg("concurrency", "4"));
const locales = (arg("locales", "") || "").split(",").filter(Boolean);
let dir = HERE, pw = null;
while (!pw && dir !== "/") { const s = path.join(dir, "node_modules/.pnpm"); if (fs.existsSync(s)) { const d = fs.readdirSync(s).find((x) => x.startsWith("playwright@")); if (d) pw = require(path.join(s, d, "node_modules/playwright")); } dir = path.dirname(dir); }
const SITE = path.resolve(HERE, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8"));
const redirects = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/redirect-map.json"), "utf8")).redirects;
const l10n = JSON.parse(fs.readFileSync(path.join(SITE, "l10n/routes.json"), "utf8")).routes;
const LCODE = { zh: "zh-Hans" };
let routes = manifest.routes.map((r) => r.path).filter((p) => !redirects[p] && !p.startsWith("/lp/"));
if (locales.length) routes = routes.flatMap((p) => locales.map((l) => l10n[p] && l10n[p][LCODE[l] || l]).filter(Boolean));
const oidc = /^https/.test(BASE) && process.env.VERCEL_OIDC_TOKEN ? { extraHTTPHeaders: { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN } } : {};
const b = await pw.chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...oidc });
await ctx.addInitScript(() => { try { localStorage.setItem("ktahv-consent", "declined"); } catch (e) {} });
const offsite = [], seen = new Map(), errors = [];
let i = 0;
async function worker() {
  while (i < routes.length) {
    const r = routes[i++]; const p = await ctx.newPage();
    try {
      await p.goto(BASE + r, { waitUntil: "load", timeout: 90000 }); await p.waitForTimeout(2500);
      const links = await p.evaluate(() => [...document.querySelectorAll('a[href*="/documents/"]')].map((a) => ({ href: a.getAttribute("href"), abs: a.href, visible: a.getClientRects().length > 0 })));
      for (const l of links) {
        const u = new URL(l.abs);
        if (u.origin !== new URL(BASE).origin) offsite.push({ route: r, ...l });
        if (u.origin === new URL(BASE).origin) seen.set(u.pathname, (seen.get(u.pathname) || new Set()).add(r));
      }
    } catch (e) { errors.push({ route: r, error: String(e).slice(0, 160) }); }
    await p.close();
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
const status = {};
for (const pth of seen.keys()) { const res = await ctx.request.get(BASE + pth, { maxRedirects: 0 }); status[pth] = { status: res.status(), type: res.headers()["content-type"], length: Number(res.headers()["content-length"] || 0) }; }
await b.close();
const bad = Object.entries(status).filter(([, s]) => s.status !== 200);
const report = { base: BASE, at: new Date().toISOString(), routes: routes.length, offsiteDocumentLinks: offsite, documentLinks: Object.fromEntries([...seen].map(([k, v]) => [k, { routes: [...v].length, ...status[k] }])), non200: bad.map(([k]) => k), errors };
if (OUT) fs.writeFileSync(OUT, JSON.stringify(report, null, 1));
console.log(JSON.stringify({ routes: routes.length, offsite: offsite.length, distinctDocuments: seen.size, non200: bad.length, errors: errors.length }));
process.exit(offsite.length || bad.length || errors.length ? 1 : 0);
