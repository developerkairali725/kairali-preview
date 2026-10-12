/**
 * AHV localization — route allocation, generated (never translated).
 *   node tools/l10n/routes.mjs  → l10n/routes.json
 *
 * English keeps its paths. Every other locale gets /<prefix><english path>,
 * EXCEPT German and French: where the verified legacy map (l10n/legacy-map.json)
 * names a live legacy page as the same page (primary, high/medium confidence),
 * the localized page is served AT that legacy URL, so the ranked URL survives
 * as a 200 instead of a redirect. Legacy URLs that are not served (case
 * variants, duplicates, no equivalent) get a single-hop 301 in `redirects`
 * to their equivalent (or nearest, flagged) localized page.
 */
import fs from "node:fs";
import { rel, readJson, includedRoutes } from "./sources.mjs";
import { LOCALES, CODES } from "./locales.mjs";

const legacy = fs.existsSync(rel("l10n/legacy-map.json")) ? readJson("l10n/legacy-map.json").entries : [];
const routes = {};
const en = includedRoutes().map((r) => r.path);
const enSet = new Set(en);
const taken = new Set(en);
for (const p of en) {
  routes[p] = { en: p };
  for (const loc of CODES) routes[p][loc] = "/" + LOCALES[loc].prefix + p;
}
const pathOf = (url) => new URL(url).pathname.replace(/\/?$/, "/").toLowerCase();
const served = [];
for (const e of legacy) {
  if (!e.enPath || !enSet.has(e.enPath) || !e.primary || !["high", "medium"].includes(e.confidence)) continue;
  if (e.lang !== "de" && e.lang !== "fr") continue;
  const lp = pathOf(e.canonical);
  if (!lp.startsWith(`/${e.lang}/`)) continue;
  if (taken.has(lp) && routes[e.enPath][e.lang] !== lp) continue;
  routes[e.enPath][e.lang] = lp;
  taken.add(lp);
  served.push(lp);
}
// every locale path must be unique
const all = new Map();
for (const [p, m] of Object.entries(routes)) for (const [loc, x] of Object.entries(m)) {
  if (all.has(x)) throw new Error(`route collision ${x}: ${all.get(x)} vs ${loc}:${p}`);
  all.set(x, `${loc}:${p}`);
}
// legacy protection: every legacy URL/variant not served gets one 301 hop
const redirects = {};
const servedSet = new Set(served);
// Paid/campaign destinations and machine URLs keep their current handling (owner: landing pages excluded, paid URLs survive)
const PAID = new Set(readJson("english-candidate/ad-sitelink-redirects.json").map((r) => r.source.replace(/\/?$/, "/").toLowerCase()));
const LP_LEGACY = new Set(["/de/behandlung-in-kerala/", "/de/behandlung-in-kerala.html/"]);
for (const e of legacy) {
  const target = e.enPath && enSet.has(e.enPath) ? e.enPath : e.nearest && enSet.has(e.nearest) ? e.nearest : "/";
  const loc = e.lang === "ru" ? "ru" : e.lang;
  if (!LOCALES[loc]) continue;
  const to = routes[target][loc];
  const srcs = new Set([pathOf(e.canonical), ...(e.variants || []).map((v) => v.replace(/\/?$/, "/"))]);
  for (const s of srcs) {
    if (PAID.has(s.toLowerCase()) || LP_LEGACY.has(s.toLowerCase()) || /\.xml\/?$|[?]/.test(s)) continue;
    if (s === to || servedSet.has(s) && s.toLowerCase() === to) continue;
    if (all.has(s)) continue; // a live page of the new site already answers here
    redirects[s] = { to, basis: e.enPath ? `equivalent (${e.confidence})` : "NO EQUIVALENT — nearest, flagged for owner", clicks: e.clicks ?? null };
  }
}
// Query-string variants are skipped above (a redirect source is a path), which also dropped the PATH of a recorded
// variant when no other entry names it: /fr/programs/page/2/?query-17-page=2 was crawled live, yet /fr/programs/page/2/
// had no rule and would 404 (SEO-D22 D-13, 29 Sep 2026). The path part now gets the same single hop as its entry —
// only when nothing else already answers there, so no existing rule changes.
for (const e of legacy) {
  const target = e.enPath && enSet.has(e.enPath) ? e.enPath : e.nearest && enSet.has(e.nearest) ? e.nearest : "/";
  const loc = e.lang === "ru" ? "ru" : e.lang;
  if (!LOCALES[loc]) continue;
  const to = routes[target][loc];
  for (const v of [e.canonical, ...(e.variants || [])]) {
    if (!v.includes("?")) continue;
    const s = new URL(v, "https://ayurvedichealingvillage.com").pathname.replace(/\/?$/, "/");
    if (redirects[s] || PAID.has(s.toLowerCase()) || LP_LEGACY.has(s.toLowerCase()) || /\.xml\/?$/.test(s)) continue;
    if (s === to || servedSet.has(s) || all.has(s)) continue;
    redirects[s] = { to, basis: `path of a recorded query variant (${e.enPath ? `equivalent (${e.confidence})` : "NO EQUIVALENT — nearest, flagged for owner"})`, clicks: null };
  }
}
// English protection-map 301s (english-candidate/redirect-map.json: retired test/cart/old-duplicate pages) apply
// in every locale too. Before 28 Sep 2026 these were allocated as locale PAGES, so /hi/cart/, /de/map/ or
// /ar/test-page/ served a live localized copy of a page English retires. Each locale copy is now one 301 hop to
// the SAME target's localized path, and the route is not allocated as a locale page.
const EN_REDIRECTS = readJson("english-candidate/redirect-map.json").redirects;
for (const [src, rule] of Object.entries(EN_REDIRECTS)) {
  if (!routes[src]) continue;
  for (const loc of CODES) {
    const from = routes[src][loc];
    const to = (routes[rule.to] && routes[rule.to][loc]) || rule.to;
    if (from && from.toLowerCase() !== to.toLowerCase()) redirects[from] = { to, basis: `mirrors the English protection-map 301 ${src} → ${rule.to}`, clicks: null };
  }
  delete routes[src];
}
// single hop, always: a legacy redirect whose target is now itself redirected goes straight to the final page
for (const r of Object.values(redirects)) {
  const seen = new Set();
  while (redirects[r.to] && !seen.has(r.to)) { seen.add(r.to); r.to = redirects[r.to].to; }
}
fs.writeFileSync(rel("l10n/routes.json"), JSON.stringify({ generatedFrom: ["english-candidate/route-manifest.json", "l10n/scope.json", "l10n/legacy-map.json"], locales: ["en", ...CODES], legacyServed: served.length, routes, redirects }, null, 1) + "\n");
console.log({ routes: en.length, locales: CODES.length + 1, legacyServed: served.length, legacyRedirects: Object.keys(redirects).length });
// the locale registry for the Next.js app (typed JSON import), generated from locales.mjs
fs.writeFileSync(rel("l10n/locales.json"), JSON.stringify({ en: { prefix: "", lang: "en", htmlLang: "en-US", dir: "ltr", og: "en_US", currency: "INR", name: "English" }, ...Object.fromEntries(CODES.map((c) => [c, { ...LOCALES[c], htmlLang: LOCALES[c].lang }])) }, null, 1) + "\n");
