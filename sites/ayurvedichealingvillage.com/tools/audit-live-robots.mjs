#!/usr/bin/env node
/**
 * AHV — what the LIVE site says about indexing, for every URL the sitemap will
 * emit at the DNS flip.
 *
 * WHY. `app/sitemap.ts` is staging-locked and emits nothing today; at the flip
 * it emits 236 URLs (254 routes minus 16 sitemapExclude minus 12 redirects).
 * Submitting a URL that serves `noindex` is a standing Search Console warning
 * and a conflicting signal — the live site already does exactly this on at
 * least two pages, which is how the problem was noticed.
 *
 * The rebuild cannot answer the question itself: `RouteMetadata` records no
 * robots value, and the importer rewrites every payload's robots to noindex for
 * staging, so the production intent is not in the repo. It is only on the live
 * site. So this asks the live site, once, and writes the answer down.
 *
 * ALSO CAPTURED, because the same fetch answers it: the canonical. Two routes
 * were found to have a self-canonical on live and none in the rebuild — a
 * regression that would otherwise be discovered after the flip.
 *
 * Read-only. Nothing is written to the live site.
 *
 *   node tools/audit-live-robots.mjs [--limit N] [--out <path>]
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(n); return i > -1 ? argv[i + 1] : d; };
const LIMIT = Number(flag("--limit", "0"));
const OUT = join(SITE, flag("--out", "english-candidate/live-robots-audit.json"));
const ORIGIN = "https://ayurvedichealingvillage.com";

const manifest = JSON.parse(await import("node:fs").then((m) => m.promises.readFile(join(SITE, "english-candidate/route-manifest.json"), "utf8")));
const redirects = new Set(Object.keys(JSON.parse(await import("node:fs").then((m) => m.promises.readFile(join(SITE, "english-candidate/redirect-map.json"), "utf8"))).redirects));

/** Exactly what app/sitemap.ts will emit once AHV_STAGING=0. */
let routes = manifest.routes.filter((r) => !r.sitemapExclude && !redirects.has(r.path));
if (LIMIT) routes = routes.slice(0, LIMIT);

const browser = await chromium.launch();
const ctx = await browser.newContext();
const out = {};
let noindexInSitemap = 0, canonicalElsewhere = 0, missingLocally = 0, errors = 0, n = 0;

for (const r of routes) {
  n += 1;
  try {
    const res = await ctx.request.get(ORIGIN + r.path, { timeout: 30000 });
    const html = res.status() === 200 ? await res.text() : "";
    const robots = (/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i.exec(html) ?? [])[1] ?? null;
    const canonical = (/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i.exec(html) ?? [])[1] ?? null;
    const isNoindex = !!robots && /noindex/i.test(robots);
    const canonPath = canonical ? new URL(canonical, ORIGIN).pathname : null;
    const repoCanonical = r.metadata?.canonical ?? null;

    if (isNoindex) noindexInSitemap += 1;
    if (canonPath && canonPath !== r.path) canonicalElsewhere += 1;
    if (canonical && !repoCanonical) missingLocally += 1;

    out[r.path] = {
      liveStatus: res.status(), liveRobots: robots, liveCanonical: canonical,
      liveCanonicalIsSelf: canonPath === r.path,
      repoCanonical,
      wouldBeSubmitted: true,
      flags: [
        ...(isNoindex ? ["NOINDEX-BUT-IN-SITEMAP"] : []),
        ...(canonPath && canonPath !== r.path ? ["CANONICAL-POINTS-ELSEWHERE"] : []),
        ...(canonical && !repoCanonical ? ["CANONICAL-LOST-IN-REBUILD"] : []),
      ],
    };
  } catch (e) {
    errors += 1;
    out[r.path] = { error: String(e).slice(0, 120), wouldBeSubmitted: true, flags: ["FETCH-FAILED"] };
  }
  if (n % 40 === 0) console.log(`  ${n}/${routes.length}`);
}
await browser.close();

writeFileSync(OUT, `${JSON.stringify({
  why: "Live indexing signals for every URL app/sitemap.ts emits once AHV_STAGING=0",
  generated: new Date().toISOString(),
  origin: ORIGIN,
  routesChecked: routes.length,
  totals: { noindexInSitemap, canonicalElsewhere, canonicalLostInRebuild: missingLocally, fetchErrors: errors },
  routes: out,
}, null, 2)}\n`);

console.log(`\nchecked ${routes.length} sitemap-eligible routes against live`);
console.log(`  NOINDEX on live but WOULD BE SUBMITTED : ${noindexInSitemap}`);
console.log(`  canonical points at another URL        : ${canonicalElsewhere}`);
console.log(`  canonical on live, absent in rebuild   : ${missingLocally}`);
console.log(`  fetch errors                           : ${errors}`);
console.log(`wrote ${OUT.replace(`${SITE}/`, "")}`);
