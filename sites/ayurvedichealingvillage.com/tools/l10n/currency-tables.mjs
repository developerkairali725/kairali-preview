/**
 * AHV localization — approved EUR / USD tariff tables for the training + yoga routes whose English source prints a
 * STATIC INR table (C-37, RATE-PARITY, 28 Sep 2026).
 *
 * WHY. tools/l10n/build.mjs localizeCurrency() only switches a view's default `cur: 'INR'` where the view's LOGIC
 * already carries EUR/EURO/USD tables (every Ayurveda programme page, the finders, the homepage). Seven routes print
 * their villa tariff as literal INR markup instead — the training hub + five course pages (a static block appended by
 * tools/align-final-rates.mjs) and /yoga-and-meditation-package/ (a table inside the commercial-family dataset) — so
 * the EUR locales (de fr es it pt nl) and USD locales (ru ar zh-Hans ja ko) showed rupees.
 *
 * WHAT. A SELECTION between approved tables, never a conversion: every INR amount printed on those routes is mapped
 * to the SAME cell of the locale currency's approved table (english-candidate/final-rates/training.json tables,
 * yoga.json editions.<cur>.tables.I). A course total the English page prints as "per-night rate × the course's nights"
 * maps to the same villa/occupancy cell × the same nights (the arithmetic the English page itself shows). Any INR
 * token that is not an approved cell or such a product FAILS the build — nothing is guessed.
 *
 * SCOPE. Exact views (training hub + five course pages, desktop + mobile; each view must belong to its route alone)
 * and exactly ONE route object inside public/ahv/assets/commercial-family-data.js (the shared article-reader view
 * and the other commercial routes are never touched). EN and HI keep INR. Reference codes (…/EN-INR/20260925-R1)
 * are left as printed, as on every other priced locale page.
 *
 * Pure module: importing it has no side effects (unlike build.mjs).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(SITE, p), "utf8"));
const VILLAS = ["deluxe", "classic", "royal", "suite"];
const SYM = { INR: "₹", EUR: "€", USD: "$" };
/** en-US grouping, the form every priced AHV page prints (₹368,200 / €4,600 / $5,260). */
export const fmt = (n, cur) => SYM[cur] + Number(n).toLocaleString("en-US");
const pathOf = (url) => new URL(url).pathname;

export const COMMERCIAL_DATASET = "public/ahv/assets/commercial-family-data.js";

/** Route entries with their approved tables and night counts, read from the final-rates source of truth. */
export function currencyPlan() {
  const training = readJson("english-candidate/final-rates/training.json");
  const yoga = readJson("english-candidate/final-rates/yoga.json");
  const manifest = readJson("english-candidate/route-manifest.json").routes;
  const tTables = (cur) => Object.fromEntries(VILLAS.map((v) => [v, training.tables[v][cur]]));
  const entries = [];
  // training hub: courses of 1/3/5/10/20 nights; the page tells the reader to multiply — no total is printed
  entries.push({ route: "/ayurveda-training-programme/", family: "training", nights: null, tables: { INR: tTables("INR"), EUR: tTables("EUR"), USD: tTables("USD") } });
  for (const c of training.courses) entries.push({ route: pathOf(c.url), family: "training", nights: c.days, tables: { INR: tTables("INR"), EUR: tTables("EUR"), USD: tTables("USD") } });
  const g = yoga.groups.find((x) => x.id === "I");
  const p = g.programmes.find((x) => pathOf(x.url) === "/yoga-and-meditation-package/");
  if (!p) throw new Error("currency-tables: yoga.json group I has no /yoga-and-meditation-package/ programme");
  entries.push({ route: "/yoga-and-meditation-package/", family: "yoga", nights: p.min_nights, dataset: COMMERCIAL_DATASET,
    tables: { INR: yoga.editions.INR.tables.I, EUR: yoga.editions.EUR.tables.I, USD: yoga.editions.USD.tables.I } });
  const viewUse = new Map();
  for (const r of manifest) for (const v of [r.desktopView, r.mobileView]) if (v) viewUse.set(v, [...(viewUse.get(v) || []), r.path]);
  for (const e of entries) {
    const row = manifest.find((r) => r.path === e.route);
    if (!row) throw new Error(`currency-tables: ${e.route} is not in english-candidate/route-manifest.json`);
    for (const cur of ["INR", "EUR", "USD"]) for (const v of VILLAS) {
      const pair = e.tables[cur] && e.tables[cur][v];
      if (!Array.isArray(pair) || pair.length !== 2 || !pair.every((n) => Number.isInteger(n) && n > 0)) throw new Error(`currency-tables: ${e.route} ${cur} ${v} is not an approved [single, double] pair`);
    }
    if (!e.dataset) {
      e.views = [...new Set([row.desktopView, row.mobileView].filter(Boolean))];
      for (const v of e.views) if ((viewUse.get(v) || []).length !== 1) throw new Error(`currency-tables: view ${v} serves ${viewUse.get(v).join(", ")} — a shared view is never rewritten`);
    }
    e.maps = { EUR: tokenMap(e, "EUR"), USD: tokenMap(e, "USD") };
  }
  return entries;
}

/** INR token -> locale-currency token: every approved cell, and cell × nights where the page prints a course total. */
function tokenMap(e, cur) {
  const map = {};
  const put = (inr, out) => {
    const k = fmt(inr, "INR"), val = fmt(out, cur);
    if (map[k] && map[k] !== val) throw new Error(`currency-tables: ${e.route} ${k} would map to both ${map[k]} and ${val}`);
    map[k] = val;
  };
  for (const v of VILLAS) for (const o of [0, 1]) {
    put(e.tables.INR[v][o], e.tables[cur][v][o]);
    if (e.nights && e.nights > 1) put(e.tables.INR[v][o] * e.nights, e.tables[cur][v][o] * e.nights);
  }
  return map;
}

let PLAN;
const plan = () => (PLAN ??= currencyPlan());
/** view id -> route, for the exact views in scope. */
export function currencyViews() { return new Map(plan().filter((e) => e.views).flatMap((e) => e.views.map((v) => [v, e.route]))); }

/** Replace every INR amount in `text` with the approved `cur` cell for `route`. Fails on any unmapped amount. */
export function applyCurrencyTables(text, route, cur) {
  const e = plan().find((x) => x.route === route);
  if (!e) throw new Error(`currency-tables: ${route} is outside the C-37 scope`);
  if (cur === "INR") return { text, replacements: 0 };
  const map = e.maps[cur];
  if (!map) throw new Error(`currency-tables: no approved ${cur} table`);
  let replacements = 0;
  const out = text.replace(/₹[0-9]+(?:,[0-9]{3})*(?:\.[0-9]+)?/g, (tok) => {
    if (!Object.hasOwn(map, tok)) throw new Error(`currency-tables: ${route} prints ${tok}, which is not an approved ${e.family} INR cell (or cell × ${e.nights} nights) — fix the source, never convert`);
    replacements++;
    return map[tok];
  });
  if (/₹/.test(out)) throw new Error(`currency-tables: ${route} still carries a rupee sign after the ${cur} selection (non-standard amount format?)`);
  return { text: out, replacements };
}

/**
 * The yoga route lives inside a dataset shared by six commercial routes. Rewrite ONLY that route's object, in place:
 * the object's compact JSON must occur exactly once in the (already translated) script text.
 */
export function applyCurrencyToDataset(scriptText, route, cur) {
  if (cur === "INR") return { text: scriptText, replacements: 0 };
  const start = scriptText.indexOf("{"), end = scriptText.lastIndexOf("}");
  const data = JSON.parse(scriptText.slice(start, end + 1));
  const rec = (data.routes || []).find((r) => r.path === route);
  if (!rec) throw new Error(`currency-tables: ${route} not found in the dataset`);
  const before = JSON.stringify(rec);
  const n = scriptText.split(before).length - 1;
  if (n !== 1) throw new Error(`currency-tables: ${route} record found ${n}× as compact JSON in the dataset text — refusing a positional guess`);
  const r = applyCurrencyTables(before, route, cur);
  JSON.parse(r.text); // the rewritten record must still be valid JSON
  return { text: scriptText.replace(before, () => r.text), replacements: r.replacements };
}
