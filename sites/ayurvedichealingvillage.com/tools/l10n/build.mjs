/**
 * AHV localization — build the locale artifacts from the frozen source + the
 * accepted catalogues. Deterministic; runs before `next build`.
 *
 *   node tools/l10n/build.mjs [--locales de,fr] [--strict]
 *
 * For every locale:
 *   public/ahv/l10n/<prefix>/views/<view>.json       localized view payloads
 *   public/ahv/l10n/<prefix>/assets/<script>.js      localized datasets/renderers
 *   public/ahv/l10n/<prefix>/components/<chrome>     localized header/footer
 *   l10n/generated/<locale>.json                     head metadata + runtime strings + stats
 *
 * Prose comes ONLY from the catalogue (unit id = hash of English text). Then
 * technical, non-prose transforms that are generated, never translated:
 *   · html lang / inLanguage / og:locale → locale codes;
 *   · internal page URLs → the locale's equivalent route (l10n/routes.json);
 *   · PDF links → the same edition in the locale's language/currency;
 *   · default tariff currency → the locale's approved currency table (a
 *     selection between existing approved tables — never a conversion);
 *   · dataset/component paths → the locale copies.
 * --strict fails when any unit lacks an accepted translation (release gate).
 * Without it, missing units keep English and are COUNTED in the report — a
 * draft build is never described as translated.
 */
import fs from "node:fs";
import path from "node:path";
import { applyUnits, unitId, sha256, jsUnits } from "./lib.mjs";
import * as X from "./extras.mjs";
import { rel, readJson, sourceFiles, parseFile, includedRoutes } from "./sources.mjs";
import { LOCALES, CODES } from "./locales.mjs";

const argv = process.argv;
const arg = (n, d) => { const i = argv.indexOf("--" + n); return i > -1 ? argv[i + 1] : d; };
const STRICT = argv.includes("--strict");
const only = (arg("locales", "") || CODES.join(",")).split(",");

const ROUTES = readJson("l10n/routes.json"); // { routes: { enPath: { loc: path } } }
const ALIASES = readJson("english-candidate/link-aliases.json");
const DOCS = readJson("english-candidate/document-assets-release.json").files.map((f) => f.file).filter((f) => f.endsWith(".pdf"));
const SRC = readJson("l10n/source/units.json");
const SOURCE_BY_ID = new Map(SRC.units.map((u) => [u.id, u]));

export function catalog(loc) {
  const cat = new Map();
  const pre = rel(`l10n/prefill/${loc}.json`);
  if (fs.existsSync(pre)) for (const [id, v] of Object.entries(JSON.parse(fs.readFileSync(pre, "utf8")))) cat.set(id, v.text);
  const dir = rel(`l10n/output/${loc}`);
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const b = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    for (const u of b.units) {
      const src = SOURCE_BY_ID.get(u.id);
      if (!src || src.sourceHash !== u.sourceHash) continue; // stale: never apply an old translation to new source
      if (u.status === "translated" && typeof u.text === "string") cat.set(u.id, u.text);
    }
  }
  const ovr = rel(`l10n/overrides/${loc}.json`); // coordinator QA corrections (same id/hash contract)
  if (fs.existsSync(ovr)) for (const [id, v] of Object.entries(JSON.parse(fs.readFileSync(ovr, "utf8")))) if (SOURCE_BY_ID.get(id)?.sourceHash === v.sourceHash) cat.set(id, v.text);
  return cat;
}

const normPath = (p) => {
  let x = p.replace(/\/+$/, "");
  if (ALIASES[x]) x = ALIASES[x].replace(/\/+$/, "");
  return (x || "") + "/";
};
export function localPath(enPath, loc) {
  const r = ROUTES.routes[enPath];
  return r ? r[loc] : null;
}

function localizeUrls(s, loc) {
  const lp = LOCALES[loc];
  // absolute production URLs
  s = s.replace(/https?:\/\/(?:www\.)?ayurvedichealingvillage\.com(\/[^"'\s<>\\?#)]*)?/g, (m, p) => {
    // a BARE origin (no path) is a concatenation base in view logic (`A + o.href`), never a link: rewriting it to the
    // locale home produced /de//de/… and /de//about-us/ (28 Sep 2026 link audit). The home link carries its slash.
    if (!p) return m;
    const t = localPath(normPath(p), loc);
    return t ? "https://ayurvedichealingvillage.com" + t : m;
  });
  // root-relative hrefs and href-like data fields
  s = s.replace(/((?:\bhref|\burl|\blink|\bcanonical|\bitem|@id|\bto|\bmore|\bcta\w*)\\?["']?\s*[:=]\s*\\?["'])(\/[^"'\\?#\s]*)/g, (m, pre, p) => {
    if (/^\/(ahv|documents|images|_next|api)\//.test(p)) return m;
    const t = localPath(normPath(p), loc);
    return t ? pre + t : m;
  });
  // PDF editions → the locale's own edition of the same document family
  s = s.replace(/\/documents\/pdf\/([a-z-]+)\/en\/([A-Za-z0-9._-]+\.pdf)/g, (m, fam) => {
    const hit = DOCS.find((f) => f.startsWith(`public/documents/pdf/${fam}/${lp.pdf}/`));
    return hit ? hit.slice("public".length) : m;
  });
  return s;
}

function localizeLang(s, loc) {
  const lp = LOCALES[loc];
  return s
    .replace(/(documentElement\.lang\s*=\s*)(['"])en(?:-US)?\2/g, `$1$2${lp.lang}$2`)
    .replace(/((?:htmlLang|inLanguage)\\?["']?\s*:\s*\\?["'])en(?:-US)?(\\?["'])/g, `$1${lp.lang}$2`)
    .replace(/(htmlLang\s*\|\|\s*)(['"])en(?:-US)?\2/g, `$1$2${lp.lang}$2`)
    .replace(/\ben_US\b/g, lp.og);
}

function localizeCurrency(logic, loc) {
  const want = LOCALES[loc].currency;
  if (want === "INR") return logic;
  const key = want === "EUR" ? (/['"]EURO['"]/.test(logic) ? "EURO" : "EUR") : "USD";
  if (!new RegExp(`['"]${key}['"]`).test(logic)) return logic; // this view has no such table: keep its default
  return logic.replace(/(\bcur\s*:\s*)(['"])INR\2/g, `$1$2${key}$2`);
}

const scriptPath = (s, prefix) => (/^\/ahv\/(?!l10n\/)/.test(s) ? `/ahv/l10n/${prefix}/` + s.slice("/ahv/".length) : s);

// Finder views keep ENGLISH route keys in their data (they are also match keys for search/chips) and build card
// links as HOST_URL + key. A string rewrite cannot localize that concatenation (it produced /de/panchakarma-therapy/,
// a 404, where German serves /de/panchakarma-therapie/), so the locale logic gets its route map and a lookup.
function localizeRouteConcat(logic, loc) {
  if (!/\bHOST_URL \+ /.test(logic)) return logic;
  const map = Object.fromEntries(Object.entries(ROUTES.routes).map(([en, r]) => [en, r[loc]]).filter(([, v]) => v));
  const helper = `const __AHV_LP = ${JSON.stringify(map)};\nconst __ahvLoc = (r) => 'https://ayurvedichealingvillage.com' + (__AHV_LP[r] || r);\n`;
  return helper + logic.replace(/\bHOST_URL \+ ([A-Za-z_$][\w$.]*)/g, (m, expr) => `__ahvLoc(${expr})`);
}

function technical(s, loc, { logic = false } = {}) {
  let out = localizeLang(localizeUrls(s, loc), loc);
  if (logic) out = localizeRouteConcat(localizeCurrency(out, loc), loc);
  const prefix = LOCALES[loc].prefix;
  out = out.replace(/(["'])\/ahv\/assets\/([a-z0-9-]+-(?:data|render)\.js)\1/g, (m, q, f) => `${q}/ahv/l10n/${prefix}/assets/${f}${q}`);
  return out;
}

/** Runtime script copies: locale search index/search page, enquiry path checks. */
function technicalRuntime(s, loc) {
  const lp = LOCALES[loc];
  const lpath = (p) => localPath(p, loc) || p;
  // Search/finder currency: a visitor's stored choice still wins; otherwise the
  // locale's approved tariff table is the default (selection, never conversion).
  if (lp.currency !== "INR") s = s.replace(/localStorage\.getItem\("ahv-cur"\) \|\| "INR"/g, `localStorage.getItem("ahv-cur") || "${lp.currency}"`).replace(/cur = "INR", timer/g, `cur = "${lp.currency}", timer`).replace(/cur = cur \|\| "INR";/g, `cur = cur || "${lp.currency}";`);
  return localizeUrls(s, loc)
    .replace(/(["'])\/ahv\/search-index\.json\1/g, `$1/ahv/l10n/${lp.prefix}/search-index.json$1`)
    .replace(/(["'])\/search\/\?q=/g, `$1${lpath("/search/")}?q=`)
    .replace(/(["'])\/enquiry-form\/(["'#])/g, (m, a, b) => `${a}${lpath("/enquiry-form/")}${b}`);
}

function buildLocale(loc) {
  const lp = LOCALES[loc];
  const cat = catalog(loc);
  const missing = new Map();
  const lookup = (source) => {
    const t = cat.get(unitId(source));
    if (t == null) missing.set(unitId(source), source);
    return t;
  };
  const outRoot = rel(`public/ahv/l10n/${lp.prefix}`);
  fs.rmSync(outRoot, { recursive: true, force: true });
  const files = sourceFiles();
  let written = 0;
  for (const file of [...files.views, ...files.scripts, ...files.components]) {
    const text = fs.readFileSync(rel(file), "utf8");
    const parsed = parseFile(file, text);
    let outText;
    if (parsed.kind === "view") {
      const v = { ...parsed.json };
      for (const part of parsed.parts) v[part.field] = technical(applyUnits(part.text, part.units, lookup), loc, { logic: part.field === "logic" });
      v.scripts = (v.scripts || []).map((s) => scriptPath(s, lp.prefix));
      v.locale = loc;
      outText = JSON.stringify(v, null, 2) + "\n";
    } else {
      outText = technical(applyUnits(parsed.parts[0].text, parsed.parts[0].units, lookup), loc, { logic: true });
    }
    const dest = path.join(outRoot, file.replace(/^public\/ahv\//, ""));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, outText);
    written++;
  }
  // ── sitewide runtime scripts (curated), rail data, search index ──
  const designOut = path.join(outRoot, "design");
  fs.mkdirSync(designOut, { recursive: true });
  for (const f of X.RUNTIME_SCRIPTS) {
    const file = "public/design/" + f, text = fs.readFileSync(rel(file), "utf8");
    let out = technicalRuntime(applyUnits(text, X.runtimeScriptUnits(file, text), lookup), loc);
    fs.writeFileSync(path.join(designOut, f), out);
    written++;
  }
  {
    const file = "public/design/section-nav.data.js", text = fs.readFileSync(rel(file), "utf8");
    const us = jsUnits(text).units.filter((u) => /(^|\.)label$/.test(u.key || ""));
    // the tree keeps English keys (routes are looked up by data-ahv-route = English path); the family
    // header and breadcrumb take this locale's hrefs from AHV_LOCAL_PATHS (English path → locale path)
    const localPaths = Object.fromEntries(Object.entries(ROUTES.routes).map(([en, r]) => [en, r[loc]]).filter(([, p]) => p));
    // English pages the protection map retires (301) are not locale routes; a link to one from a locale page goes
    // straight to the locale's version of its target (single hop, no detour through English)
    for (const [src, rule] of Object.entries(readJson("english-candidate/redirect-map.json").redirects)) {
      const to = ROUTES.routes[rule.to] && ROUTES.routes[rule.to][loc];
      if (to && !localPaths[src]) localPaths[src] = to;
    }
    fs.writeFileSync(path.join(designOut, "section-nav.data.js"), localizeUrls(applyUnits(text, us, lookup), loc) + "window.AHV_LOCAL_PATHS = " + JSON.stringify(localPaths) + ";\n");
    written++;
  }
  const data = {};
  for (const spec of X.JSON_SOURCES) {
    const doc = JSON.parse(fs.readFileSync(rel(spec.file), "utf8"));
    for (const u of X.jsonUnits(doc, spec)) { const t = lookup(u.source); if (t != null) u.set(t); }
    if (spec.file === "public/ahv/search-index.json") {
      fs.writeFileSync(path.join(outRoot, "search-index.json"), localizeUrls(JSON.stringify(doc), loc));
    } else data[path.basename(spec.file, ".json")] = doc;
  }
  const ui = {};
  for (const u of X.uiStrings()) { const t = lookup(u.source); if (t != null) ui[u.source] = t; }
  const nativeStrings = {};
  for (const file of X.NATIVE_TSX) for (const u of X.tsxUnits(fs.readFileSync(rel(file), "utf8"))) { const t = lookup(u.source); if (t != null) nativeStrings[u.source] = t; }

  // head metadata for the server (title/description/og) from the same catalogue
  const meta = {};
  for (const r of includedRoutes()) {
    const m = r.metadata || {};
    const tr = (v) => (v ? cat.get(unitId(v.replace(/\s+/g, " ").trim())) ?? null : null);
    meta[r.path] = { path: localPath(r.path, loc), title: tr(m.title), description: tr(m.description), ogTitle: tr(m.ogTitle), ogDescription: tr(m.ogDescription) };
  }
  const report = { locale: loc, files: written, catalogue: cat.size, missingUnits: missing.size, missingSample: [...missing.values()].slice(0, 20), sourceSetHash: SRC.sourceSetHash };
  fs.mkdirSync(rel("l10n/generated"), { recursive: true });
  fs.writeFileSync(rel(`l10n/generated/${loc}.json`), JSON.stringify({ ...report, meta, ui, native: nativeStrings, data }, null, 1) + "\n");
  fs.writeFileSync(rel(`l10n/generated/${loc}.catalog.json`), JSON.stringify(Object.fromEntries(cat)));
  return report;
}

const reports = only.map(buildLocale);
for (const r of reports) console.log(`${r.locale}: files=${r.files} catalogue=${r.catalogue} missingUnits=${r.missingUnits}`);
if (STRICT && reports.some((r) => r.missingUnits)) { console.error("STRICT: untranslated units remain"); process.exit(1); }
void sha256;
