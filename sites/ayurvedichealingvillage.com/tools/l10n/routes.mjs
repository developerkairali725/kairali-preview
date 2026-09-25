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
fs.writeFileSync(rel("l10n/routes.json"), JSON.stringify({ generatedFrom: ["english-candidate/route-manifest.json", "l10n/scope.json", "l10n/legacy-map.json"], locales: ["en", ...CODES], legacyServed: served.length, routes, redirects }, null, 1) + "\n");
console.log({ routes: en.length, locales: CODES.length + 1, legacyServed: served.length, legacyRedirects: Object.keys(redirects).length });
// the locale registry for the Next.js app (typed JSON import), generated from locales.mjs
fs.writeFileSync(rel("l10n/locales.json"), JSON.stringify({ en: { prefix: "", lang: "en", htmlLang: "en-US", dir: "ltr", og: "en_US", currency: "INR", name: "English" }, ...Object.fromEntries(CODES.map((c) => [c, { ...LOCALES[c], htmlLang: LOCALES[c].lang }])) }, null, 1) + "\n");
