// Exact tariff VALUES (not just currency symbols) against the approved tables in english-candidate/final-rates/*.json,
// on the rendered pages — hydrated DOM AND authenticated initial HTML — for the homepage (programme cards, daily
// admission, villa "from" cards: 11 values per currency, 33 per viewport), the programme finder, /training-course-fees/
// and the 7 C-37 routes (5 courses + training hub + yoga package), in EN and at least DE/FR/AR.
//
// Expected values come ONLY from the approved files (never from the page, never from the search index):
//   homepage programmes  route-map.json[route].tables[CUR].deluxe[0]          (card says "Deluxe Villa · single")
//   homepage admission   accommodation.json editions[CUR].tables.APAI[villa][0] (single, deluxe→suite)
//   homepage villa cards ayurveda.json editions[CUR].tables.I[villa][0]         (lowest programme rate, single)
//   finder cards         route-map deluxe[0] × min nights (training: per night, deluxe[0])
//   training-course-fees training.json tables[villa][CUR] (single, double) + transfers[i][CUR]
//   C-37 training routes training.json via route-map, locale currency only; worked example = rate × nights
//   C-37 yoga route      yoga.json editions via route-map (group I), locale currency only
// Integrity first: SOURCE.json sha256 of each approved file, and route-map.json cross-checked against the family files.
//
// Initial HTML is fetched with the staging token passed EXPLICITLY (tools/lib/verify-common.mjs stagingFetch — staging
// origin + https only, manual redirects); status, final URL and a page-identity signature are recorded and must pass
// before anything is extracted, and extraction is scoped to the tariff element (never the RSC <script> payload).
//
//   local:  node tools/hosted-rates-exact.mjs --base http://127.0.0.1:4471 --out /tmp/rates
//   hosted: vercel env run -- bash -c "cd sites/ayurvedichealingvillage.com && node tools/hosted-rates-exact.mjs --base https://ahv-final-staging.vercel.app --out <dir>"
// Options: --locales en,de,fr,ar  --viewports 1440,390  --pages home,finder,fees,c37
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { attachStagingToken } from "./lib/staging-auth.mjs";
import { arg, baseArg, outDir, readJson, writeJson, nowIso, istStamp, runContext, stagingFetch, identityFromHtml, wrongPageSigns, stripNonContent, findElement, enclosing, decodeEntities, priceTokens, line, playwright, CUR_SYM } from "./lib/verify-common.mjs";

const BASE = baseArg();
const OUT = outDir("/tmp/ahv-rates-exact");
const LOCALES = arg("locales", "en,de,fr,ar").split(",");
const VIEWPORTS = arg("viewports", "1440,390").split(",").map(Number);
const PAGES = arg("pages", "home,finder,fees,c37").split(",");
const FR = arg("rates-dir", "english-candidate/final-rates"); // --rates-dir only for a negative control (tampered copy)
const L = readJson("l10n/locales.json");
const R = readJson("l10n/routes.json").routes;
const SRC = readJson(`${FR}/SOURCE.json`);
const ACC = readJson(`${FR}/accommodation.json`), AYU = readJson(`${FR}/ayurveda.json`), YOGA = readJson(`${FR}/yoga.json`), TRG = readJson(`${FR}/training.json`), RM = readJson(`${FR}/route-map.json`);
const VILLAS = ["deluxe", "classic", "royal", "suite"];
const VILLA_KEY = { deluxe: "/deluxe-villa/", classic: "/classic-villa/", royal: "/royal-villa/", suite: "/maharaja-suite/" };
const CURS = ["INR", "USD", "EUR"];
const C37 = ["/ayurveda-training-programme/", "/one-day-ayurveda-workshop-program-kerala/", "/three-day-short-term-ayurveda-certificate-program-tap-hv/", "/intensive-ayurveda-training-program-learn-practice-ayurveda/", "/level-one-advance-ayurveda-training-program-for-wellness-professionals-kerala-aatp-1-hv/", "/advanced-ayurveda-lifestyle-consultant-and-therapist-training-program-kerala-aalct-hv/", "/yoga-and-meditation-package/"];
const REF = SRC.reference;

const checks = [];
const add = (area, id, status, detail = {}) => { checks.push({ area, id, status, detail }); line(status, `${area} ${id}`, { ...detail, rows: undefined }); };
const run = { ...runContext(BASE), tool: "tools/hosted-rates-exact.mjs", at: nowIso(), ist: istStamp(), locales: LOCALES, viewports: VIEWPORTS, pages: PAGES, rateReference: REF };
console.log(`exact rates @ ${BASE}  (${run.note})`);
const locCur = (loc) => L[loc].currency;
const lp = (key, loc) => (loc === "en" ? key : (R[key] && R[key][loc])) || null;
const reverse = {}; for (const [k, v] of Object.entries(R)) for (const p of Object.values(v)) reverse[p] = k;
const keyOf = (href) => { try { const u = new URL(href, "https://x.invalid"); return reverse[u.pathname] || (RM[u.pathname] ? u.pathname : null); } catch { return null; } };

// ── 0. integrity of the approved source ─────────────────────────────────────────────────────────────────────
for (const f of SRC.sourceFiles) {
  const got = crypto.createHash("sha256").update(fs.readFileSync(path.join(FR, f.file))).digest("hex");
  add("source-hash", f.file, got === f.sha256 ? "PASS" : "FAIL", { expected: f.sha256, got });
}
{
  const drift = [];
  for (const [route, m] of Object.entries(RM)) for (const c of CURS) for (const v of VILLAS) {
    const want = m.family === "training" ? TRG.tables[v][c] : (m.family === "yoga" ? YOGA : AYU).editions[c].tables[m.group][v];
    if (JSON.stringify(want) !== JSON.stringify(m.tables[c][v])) drift.push(`${route} ${c} ${v}: route-map ${JSON.stringify(m.tables[c][v])} ≠ ${m.family} ${JSON.stringify(want)}`);
  }
  add("source-routemap", "route-map.json vs family files", drift.length ? "FAIL" : "PASS", { routes: Object.keys(RM).length, drift: drift.slice(0, 20) });
}

// ── expected builders ─────────────────────────────────────────────────────────────────────────────────────────
const homeAdmission = (c) => VILLAS.map((v) => ACC.editions[c].tables.APAI[v][0]);
const homeVilla = (c, v) => AYU.editions[c].tables.I[v][0];
const finderFrom = (key, c) => { const m = RM[key]; if (!m) return null; return m.tables[c].deluxe[0] * (m.family === "training" ? 1 : m.nights); };
const eqArr = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

/** Consume a token stream as consecutive rows. rows: [{label, want:{CUR:[...]}}]. allowed: currencies that may appear. */
function matchRows(tokens, rows, { allowed, require }) {
  const out = []; let i = 0; const problems = [];
  for (const row of rows) {
    const got = {}; const start = i;
    while (i < tokens.length) {
      const t = tokens[i]; const cap = (row.want[t.cur] || []).length || 2;
      if ((got[t.cur] || []).length >= cap) break;
      (got[t.cur] = got[t.cur] || []).push(t.value); i++;
    }
    const rp = [];
    for (const [c, vals] of Object.entries(got)) {
      if (!allowed.includes(c)) rp.push(`${c} shown but not allowed here (${vals.join(",")})`);
      else if (!row.want[c]) rp.push(`${c} has no approved value`);
      else if (!eqArr(vals, row.want[c])) rp.push(`${c} ${vals.join(",")} ≠ approved ${row.want[c].join(",")}`);
    }
    for (const c of require) if (!got[c]) rp.push(`${c} missing`);
    if (i === start) rp.push("no tokens");
    out.push({ row: row.label, got, want: Object.fromEntries(Object.entries(row.want).filter(([c]) => allowed.includes(c))), ok: rp.length === 0, problems: rp });
    problems.push(...rp.map((p) => `${row.label}: ${p}`));
  }
  return { ok: problems.length === 0, rows: out, problems, rest: tokens.slice(i) };
}

// ── initial-HTML helpers ──────────────────────────────────────────────────────────────────────────────────────
function verifyIdentity({ status, finalUrl, route, lang }, loc, key, expectedPath) {
  const problems = [];
  if (!L[loc]) return [`Unknown requested locale: ${loc}`];
  const target = lp(key, loc);
  if (!target || target !== expectedPath) problems.push(`Requested path is not mapped ${loc} route: ${expectedPath}`);
  let actualPath = null, actualOrigin = null; try { const actual = new URL(finalUrl); actualPath = actual.pathname; actualOrigin = actual.origin; } catch {}
  if (actualOrigin !== new URL(BASE).origin) problems.push(`Final origin ${actualOrigin} ≠ ${new URL(BASE).origin}`);
  if (status !== 200) problems.push(`HTTP status ${status} ≠ 200`);
  if (actualPath !== expectedPath) problems.push(`Final path ${actualPath} ≠ ${expectedPath}`);
  if (route !== key) problems.push(`Route ${route} ≠ ${key}`);
  const allowed = [L[loc].htmlLang, L[loc].lang].filter(Boolean).map(t => t.toLowerCase());
  if (!allowed.includes(String(lang || "").toLowerCase())) problems.push(`HTML lang ${lang} ≠ configured ${allowed.join("/")}`);
  return problems;
}
const cache = {};
async function initial(p, key, loc) {
  const cacheKey = JSON.stringify([p,key,loc]);
  if (cache[cacheKey]) return cache[cacheKey];
  const r = await stagingFetch(BASE + p, BASE);
  const id = identityFromHtml(r.html);
  const probs = [...wrongPageSigns(id, r.status), ...verifyIdentity({status:r.status, finalUrl:r.finalUrl, route:id.ahvRoute, lang:id.lang}, loc, key, p)];
  const fp = r.finalUrl ? new URL(r.finalUrl).pathname : null;
  if (fp !== p) probs.push(`final path ${fp} ≠ ${p}`);
  if (key && id.ahvRoute !== key) probs.push(`data-ahv-route ${id.ahvRoute} ≠ ${key}`);
  cache[cacheKey] = { ...r, id, probs, clean: stripNonContent(r.html) };
  return cache[cacheKey];
}
const idDetail = (x) => ({ url: BASE + (x.hops[0] ? new URL(x.hops[0].url).pathname : ""), status: x.status, finalUrl: x.finalUrl, title: x.id.title, h1: x.id.h1, ahvRoute: x.id.ahvRoute, ahvLocale: x.id.ahvLocale, tokenSent: x.hops.some((h) => h.tokenSent), identityProblems: x.probs });
/** Split HTML into text segments, starting a new segment at the first <a href> for each target href. */
function segmentsByLinks(html, hrefs) {
  const segs = {}; let cur = null; const seen = new Set();
  for (const part of html.split(/(<[^>]+>)/)) {
    if (part.startsWith("<")) { const m = /^<a\b[^>]*\bhref="([^"]+)"/i.exec(part); if (m) { const h = decodeEntities(m[1]); if (hrefs.includes(h) && !seen.has(h)) { seen.add(h); cur = h; segs[h] = ""; } } continue; }
    if (cur) segs[cur] += decodeEntities(part) + " ";
  }
  return segs;
}
const textOf = (frag) => decodeEntities(String(frag).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
const removeBlocks = (html, tag) => { let s = html, m; const re = new RegExp(`<${tag}\\b`, "i"); let guard = 0; while ((m = re.exec(s)) && guard++ < 50) { const el = findElement(s.slice(m.index), /./, tag); s = s.slice(0, m.index) + " " + s.slice(m.index + (el ? el.html.length : 5)); } return s; };

// ── homepage ──────────────────────────────────────────────────────────────────────────────────────────────────
function judgeHome(tag, cur, data) {
  const res = { cur, programmes: [], admission: null, villas: [] }; const probs = []; let matched = 0;
  for (const a of data.articles) {
    const key = keyOf(a.href); const want = key && RM[key] ? RM[key].tables[cur].deluxe[0] : null;
    const toks = priceTokens(a.text).filter((t) => t.cur === cur);
    const got = toks[0] ? toks[0].value : null;
    const ok = want != null && got === want && priceTokens(a.text).every((t) => t.cur === cur);
    if (ok) matched++; else probs.push(`programme ${a.href}: got ${got} want ${want} (tokens ${priceTokens(a.text).map((t) => t.raw).join(" ")})`);
    res.programmes.push({ href: a.href, key, want, got, ok });
  }
  if (data.articles.length !== 3) probs.push(`programme cards: ${data.articles.length} (expected 3)`);
  const adm = priceTokens(data.rest); const want = homeAdmission(cur);
  const got = adm.filter((t) => t.cur === cur).map((t) => t.value);
  const admOk = eqArr(got, want) && adm.every((t) => t.cur === cur);
  res.admission = { want, got, ok: admOk }; matched += want.filter((x, i) => got[i] === x).length; if (!admOk) probs.push(`admission ${got.join(",")} ≠ ${want.join(",")} (tokens ${adm.map((t) => t.raw).join(" ")})`);
  const secProbs = [];
  for (const v of VILLAS) {
    const seg = data.villas[v]; const w = homeVilla(cur, v);
    if (seg == null) { probs.push(`villa ${v}: card not found`); res.villas.push({ villa: v, want: w, got: null, ok: false }); continue; }
    const toks = priceTokens(seg); const prim = toks[0];
    const ok = !!prim && prim.cur === cur && prim.value === w;
    if (ok) matched++; else probs.push(`villa ${v}: primary ${prim ? prim.raw : "none"} ≠ ${CUR_SYM[cur]}${w}`);
    // secondary "from · $… · €…" line: every number must be the approved value for ITS currency (else FAIL);
    // showing the primary currency again / omitting one currency is presentation only (WARN)
    const sec = toks.slice(1);
    for (const t of sec) if (t.value !== homeVilla(t.cur, v)) probs.push(`villa ${v}: secondary ${t.raw} ≠ approved ${CUR_SYM[t.cur]}${homeVilla(t.cur, v)}`);
    const secWant = CURS.filter((c) => c !== cur).sort(); const secGot = [...new Set(sec.map((t) => t.cur))].sort();
    if (sec.length && !eqArr(secGot, secWant)) secProbs.push(`villa ${v}: secondary line shows ${sec.map((t) => t.raw).join(" ")} (currencies ${secGot.join("+")}) while ${cur} is primary — expected the other two (${secWant.join("+")})`);
    res.villas.push({ villa: v, want: w, got: prim ? `${prim.cur}:${prim.value}` : null, ok, secondary: sec.map((t) => t.raw) });
  }
  return { res, probs, matched, secProbs };
}
async function homeHydrated(ctx, loc, w) {
  const p = lp("/", loc); const pg = await ctx.newPage();
  let resp; try { resp = await pg.goto(BASE + p, { waitUntil: "networkidle", timeout: 120000 }); } catch (e) { add("home-hydrated", `${loc}@${w}`, "FAIL", { error: String(e.message).slice(0, 200) }); await pg.close(); return; }
  await pg.waitForTimeout(2500);
  const villaHrefs = VILLAS.map((v) => lp(VILLA_KEY[v], loc));
  const extract = () => pg.evaluate((villaHrefs) => {
    const vis = (e) => e && e.getClientRects().length > 0;
    const sec = [...document.querySelectorAll(".ahv-home-rates")].find(vis);
    const visText = (root, skip) => { let s = ""; const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { const el = n.parentElement; if (!vis(el) || (skip && skip.some((k) => k.contains(el)))) continue; s += n.textContent + " "; } return s; };
    const out = { found: !!sec, articles: [], rest: "", villas: {}, pressed: null, lang: document.documentElement.lang, route: document.getElementById("ahv-design-root")?.getAttribute("data-ahv-route"), stored: localStorage.getItem("ahv-cur") };
    if (sec) {
      const arts = [...sec.querySelectorAll("article")].filter(vis);
      out.articles = arts.map((a) => ({ href: a.querySelector("a[href]")?.getAttribute("href"), text: visText(a) }));
      const group = sec.querySelector('[role="group"]'); out.pressed = group ? (group.querySelector('[aria-pressed="true"]') || {}).innerText : null;
      out.rest = visText(sec, [...arts, group].filter(Boolean));
    }
    const first = [...document.querySelectorAll("a[href]")].filter((a) => villaHrefs.includes(a.getAttribute("href")) && vis(a) && /[₹$€]\s?\d/.test((a.closest("section") || {}).innerText || ""));
    const vsec = first[0] && first[0].closest("section");
    if (vsec) {
      const tw = document.createTreeWalker(vsec, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT); let n, cur = null; const seen = new Set();
      while ((n = tw.nextNode())) {
        if (n.nodeType === 1) { if (n.tagName === "A" && villaHrefs.includes(n.getAttribute("href")) && !seen.has(n.getAttribute("href")) && vis(n)) { cur = n.getAttribute("href"); seen.add(cur); out.villas[cur] = ""; } continue; }
        if (cur && vis(n.parentElement)) out.villas[cur] += n.textContent + " ";
      }
    }
    return out;
  }, villaHrefs);
  const toVillaIds = (d) => ({ ...d, villas: Object.fromEntries(VILLAS.map((v, i) => [v, d.villas[villaHrefs[i]] ?? null])) });
  let d = toVillaIds(await extract());
  const status = resp ? resp.status() : 0;
  const idOk = !verifyIdentity({status, finalUrl:pg.url(), route:d.route, lang:d.lang}, loc, "/", lp("/", loc)).length && d.found;
  add("home-identity", `${loc}@${w}`, idOk ? "PASS" : "FAIL", { status, finalUrl: pg.url(), lang: d.lang, ahvRoute: d.route, ratesSectionFound: d.found });
  if (!idOk) { await pg.close(); return; }
  const def = locCur(loc);
  add("home-default-currency", `${loc}@${w}`, (d.pressed || "").includes(def) ? "PASS" : "FAIL", { pressed: d.pressed, expected: def });
  let total = 0;
  for (const c of CURS) {
    const btn = pg.locator(".ahv-home-rates [role=group] button").filter({ visible: true }).filter({ hasText: c });
    if (!(await btn.count())) { add("home-values", `${loc}@${w} ${c}`, "FAIL", { error: `no visible ${c} button` }); continue; }
    await btn.first().click(); await pg.waitForTimeout(700);
    d = toVillaIds(await extract());
    const j = judgeHome(`${loc}@${w}`, c, d); total += j.matched;
    add("home-values", `${loc}@${w} ${c}`, j.probs.length ? "FAIL" : "PASS", { matched: `${j.matched}/11`, pressed: d.pressed, problems: j.probs, observed: j.res });
    if (j.secProbs.length) add("home-villa-secondary", `${loc}@${w} ${c}`, "WARN", { problems: j.secProbs, note: "every number shown is the approved value; the secondary line does not follow the selected currency" });
  }
  add("home-values-total", `${loc}@${w}`, total === 33 ? "PASS" : "FAIL", { matched: `${total}/33` });
  await pg.reload({ waitUntil: "networkidle" }); await pg.waitForTimeout(2000);
  d = toVillaIds(await extract());
  add("home-currency-persistence", `${loc}@${w}`, (d.pressed || "").includes("EUR") && d.stored === "EUR" ? "PASS" : "FAIL", { afterReloadPressed: d.pressed, storedAhvCur: d.stored, note: "last choice was EUR" });
  await pg.close();
}
async function homeInitial(loc) {
  const p = lp("/", loc); const x = await initial(p, "/", loc);
  if (x.probs.length) { add("home-initial", loc, "FAIL", { ...idDetail(x), note: "identity not proven — nothing extracted" }); return; }
  const sec = findElement(x.clean, /\bahv-home-rates\b/, "section");
  if (!sec) { add("home-initial", loc, "FAIL", { ...idDetail(x), error: "no .ahv-home-rates section in initial HTML" }); return; }
  const arts = [...sec.html.matchAll(/<article\b/gi)].map((m) => findElement(sec.html.slice(m.index), /./, "article").html);
  const articles = arts.map((a) => ({ href: decodeEntities((/href="([^"]+)"/.exec(a) || [])[1] || ""), text: textOf(a) }));
  let rest = sec.html; for (const a of arts) rest = rest.replace(a, " ");
  const villaHrefs = VILLAS.map((v) => lp(VILLA_KEY[v], loc));
  const firstIdx = Math.min(...villaHrefs.map((h) => { const i = x.clean.indexOf(`href="${h}"`); return i < 0 ? Infinity : i; }));
  const vsec = Number.isFinite(firstIdx) ? enclosing(x.clean, firstIdx, "section") : null;
  const segs = vsec ? segmentsByLinks(vsec.html, villaHrefs) : {};
  const data = { articles, rest: textOf(rest), villas: Object.fromEntries(VILLAS.map((v, i) => [v, segs[villaHrefs[i]] ?? null])) };
  const cur = locCur(loc);
  const j = judgeHome(loc, cur, data);
  add("home-initial", `${loc} ${cur}`, j.probs.length ? "FAIL" : "PASS", { ...idDetail(x), matched: `${j.matched}/11 (initial HTML shows the locale default ${cur})`, problems: j.probs, observed: j.res });
  if (j.secProbs.length) add("home-initial-villa-secondary", `${loc} ${cur}`, "WARN", { problems: j.secProbs, note: "every number shown is the approved value; the initial-HTML secondary line does not follow the locale's primary currency" });
}

// ── finder ────────────────────────────────────────────────────────────────────────────────────────────────────
function finderExpected() {
  const variants = ["desktop", "mobile"].map(side => {
    const view = readJson(`public/ahv/views/ahv-page-ayurvedic-treatments-${side}.json`);
    const dataMatch = /const DATASET = (\[[\s\S]*?\]);/.exec(view.logic);
    const catMatch = /state\s*=\s*\{\s*cat:\s*['"]([^'"]+)['"]/.exec(view.logic);
    if (!dataMatch || !catMatch) throw new Error("Cannot establish finder source dataset/default category");
    const data = JSON.parse(dataMatch[1]);
    const cards = data.filter(p => catMatch[1] === "A" || p.c.includes(catMatch[1]));
    if (new Set(cards.map(p => p.r)).size !== cards.length) throw new Error("Duplicate route in finder source");
    return cards.map(p => ({ route: p.r, priced: !!p.from })).sort((a,b) => a.route.localeCompare(b.route));
  });
  if (JSON.stringify(variants[0]) !== JSON.stringify(variants[1])) throw new Error("Finder variants disagree on expected cards");
  return variants[0];
}
const FINDER_EXPECTED = finderExpected();
function judgeFinder(cards, cur) {
  const rows = [], probs = [], seen = new Set(); let ok = 0, noTable = 0;
  const expected = new Map(FINDER_EXPECTED.map(p => [p.route, p]));
  for (const c of cards) {
    let pathname = null; try { pathname = new URL(c.href, "https://x.invalid").pathname; } catch {}
    const key = keyOf(c.href) || (expected.has(pathname) ? pathname : null);
    const spec = expected.get(key), toks = priceTokens(c.text);
    if (!spec) { probs.push(`Unexpected finder card: ${c.href}`); rows.push({ href:c.href, key, ok:false }); continue; }
    if (seen.has(key)) probs.push(`Duplicate finder card: ${key}`);
    seen.add(key);
    const want = spec.priced ? finderFrom(key, cur) : null;
    const good = spec.priced ? want != null && toks.length === 1 && toks[0].cur === cur && toks[0].value === want : toks.length === 0;
    if (good) ok++; else probs.push(`${key}: expected ${spec.priced ? `one ${cur} amount ${want}` : "no tariff amount"}; got ${toks.map(t=>t.raw).join(" ") || "none"}`);
    if (want == null) noTable++;
    rows.push({href:c.href,key,want,got:toks.map(t=>`${t.cur}:${t.value}`),ok:good});
  }
  for (const key of expected.keys()) if (!seen.has(key)) probs.push(`Missing finder card: ${key}`);
  return {rows,probs,ok,noTable};
}
async function finderHydrated(ctx, loc, w) {
  const p = lp("/ayurvedic-treatments/", loc); const pg = await ctx.newPage();
  let resp; try { resp = await pg.goto(BASE + p, { waitUntil: "networkidle", timeout: 120000 }); await pg.waitForTimeout(2500); } catch (e) { add("finder-hydrated", `${loc}@${w}`, "FAIL", { error: String(e.message).slice(0, 200) }); await pg.close(); return; }
  const d = await pg.evaluate(() => { const vis = (e) => e.getClientRects().length > 0; return { lang: document.documentElement.lang, route: document.getElementById("ahv-design-root")?.getAttribute("data-ahv-route"), cards: [...document.querySelectorAll("article")].filter(vis).filter((a) => a.querySelector("a[href]")).map((a) => ({ href: a.querySelector("h3 a[href], a[href]:not([aria-hidden])")?.getAttribute("href") || a.querySelector("a[href]").getAttribute("href"), text: a.innerText })) }; });
  const status = resp ? resp.status() : 0;
  const identityProblems = verifyIdentity({status, finalUrl:pg.url(), route:d.route, lang:d.lang}, loc, "/ayurvedic-treatments/", p);
  if (identityProblems.length) { add("finder-hydrated", `${loc}@${w}`, "FAIL", { status, finalUrl: pg.url(), ahvRoute: d.route, lang: d.lang, identityProblems, note: "identity not proven" }); await pg.close(); return; }
  const cur = locCur(loc); const j = judgeFinder(d.cards, cur);
  add("finder-hydrated", `${loc}@${w} ${cur}`, j.probs.length || !j.ok ? "FAIL" : "PASS", { status, finalUrl: pg.url(), lang: d.lang, cards: d.cards.length, matched: j.ok, noApprovedTable: j.noTable, problems: j.probs, observed: j.rows });
  await pg.close();
}
async function finderInitial(loc) {
  const p = lp("/ayurvedic-treatments/", loc); const x = await initial(p, "/ayurvedic-treatments/", loc);
  if (x.probs.length) { add("finder-initial", loc, "FAIL", { ...idDetail(x), note: "identity not proven — nothing extracted" }); return; }
  const cards = [...x.clean.matchAll(/<article\b/gi)].map((m) => findElement(x.clean.slice(m.index), /./, "article").html).map((a) => ({ href: decodeEntities((/<h3[\s\S]*?href="([^"]+)"/.exec(a) || /href="([^"]+)"/.exec(a) || [])[1] || ""), text: textOf(a) }));
  const cur = locCur(loc); const j = judgeFinder(cards, cur);
  add("finder-initial", `${loc} ${cur}`, j.probs.length || !j.ok ? "FAIL" : "PASS", { ...idDetail(x), cards: cards.length, matched: j.ok, noApprovedTable: j.noTable, problems: j.probs });
}

// ── training-course-fees ──────────────────────────────────────────────────────────────────────────────────────
const feeRows = () => [
  ...VILLAS.map((v) => ({ label: `tariff ${v}`, want: Object.fromEntries(CURS.map((c) => [c, TRG.tables[v][c]])) })),
  ...TRG.transfers.map((t) => ({ label: `transfer ${t.id}`, want: Object.fromEntries(CURS.map((c) => [c, t[c]])) })),
];
// Every displayed number must equal the approved value for its currency and position (FAIL otherwise). The tariff rows
// must include the locale currency; the transfer rows are judged on what they show, and a missing locale currency there
// is reported as a note (the page prints transfers in INR with a USD reference in every locale).
function judgeFees(tokens, loc) {
  const rows = feeRows(); const nT = VILLAS.length;
  const m = matchRows(tokens, rows, { allowed: CURS, require: [] });
  m.rows.forEach((r, i) => { if (i < nT && !r.got[locCur(loc)]) { r.ok = false; r.problems.push(`${locCur(loc)} missing`); m.problems.push(`${r.row}: ${locCur(loc)} missing`); } });
  m.notes = m.rows.slice(nT).filter((r) => !r.got[locCur(loc)]).map((r) => `${r.row}: shown in ${Object.keys(r.got).join("+")} only (approved ${locCur(loc)} value not displayed)`);
  if (m.rest.length) m.problems.push(`unexpected extra tokens: ${m.rest.map((t) => t.raw).join(" ")}`);
  return m;
}
async function feesHydrated(ctx, loc, w) {
  const p = lp("/training-course-fees/", loc); const pg = await ctx.newPage();
  let resp; try { resp = await pg.goto(BASE + p, { waitUntil: "networkidle", timeout: 120000 }); await pg.waitForTimeout(2000); } catch (e) { add("fees-hydrated", `${loc}@${w}`, "FAIL", { error: String(e.message).slice(0, 200) }); await pg.close(); return; }
  const d = await pg.evaluate(() => { const vis = (e) => e && e.getClientRects().length > 0; const root = document.getElementById("ahv-design-root") || document.body; const skip = [...root.querySelectorAll("header, footer, nav, [data-ahv-footer]")];
    let s = ""; const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { const el = n.parentElement; if (!vis(el) || skip.some((k) => k.contains(el))) continue; s += n.textContent + " "; }
    return { lang: document.documentElement.lang, route: root.getAttribute("data-ahv-route"), text: s }; });
  const status = resp ? resp.status() : 0;
  const identityProblems = verifyIdentity({status, finalUrl:pg.url(), route:d.route, lang:d.lang}, loc, "/training-course-fees/", p);
  if (identityProblems.length) { add("fees-hydrated", `${loc}@${w}`, "FAIL", { status, finalUrl: pg.url(), ahvRoute: d.route, lang: d.lang, identityProblems, note: "identity not proven" }); await pg.close(); return; }
  const m = judgeFees(priceTokens(d.text), loc);
  add("fees-hydrated", `${loc}@${w}`, m.problems.length ? "FAIL" : m.notes.length ? "WARN" : "PASS", { status, finalUrl: pg.url(), lang: d.lang, tokens: priceTokens(d.text).length, problems: m.problems, notes: m.notes, rows: m.rows });
  await pg.close();
}
async function feesInitial(loc) {
  const p = lp("/training-course-fees/", loc); const x = await initial(p, "/training-course-fees/", loc);
  if (x.probs.length) { add("fees-initial", loc, "FAIL", { ...idDetail(x), note: "identity not proven — nothing extracted" }); return; }
  const body = removeBlocks(removeBlocks(removeBlocks(x.clean, "header"), "footer"), "nav");
  const toks = priceTokens(textOf(body));
  const m = judgeFees(toks, loc);
  add("fees-initial", loc, m.problems.length ? "FAIL" : m.notes.length ? "WARN" : "PASS", { ...idDetail(x), tokens: toks.length, problems: m.problems, notes: m.notes, rows: m.rows });
}

// ── C-37 routes ───────────────────────────────────────────────────────────────────────────────────────────────
function judgeC37(key, tokens, loc) {
  const m0 = RM[key]; const cur = locCur(loc);
  const rows = VILLAS.map((v) => ({ label: v, want: { [cur]: m0.tables[cur][v] } }));
  const m = matchRows(tokens, rows, { allowed: [cur], require: [cur] });
  const rate = m0.tables[cur].deluxe[0];
  if (m.rest.length === 2) { const [a, b] = m.rest; if (!(a.cur === cur && b.cur === cur && a.value === rate * m0.nights && b.value === rate)) m.problems.push(`worked example ${a.raw} (${b.raw} × ${m0.nights}) ≠ ${CUR_SYM[cur]}${rate * m0.nights} (${CUR_SYM[cur]}${rate} × ${m0.nights})`); }
  else if (m.rest.length) m.problems.push(`unexpected tokens after the table: ${m.rest.map((t) => t.raw).join(" ")}`);
  return m;
}
async function c37Hydrated(ctx, key, loc, w) {
  const p = lp(key, loc); const tag = `${key} ${loc}@${w}`;
  if (!p) { add("c37-hydrated", tag, "FAIL", { error: "no locale route" }); return; }
  const pg = await ctx.newPage();
  let resp; try { resp = await pg.goto(BASE + p, { waitUntil: "networkidle", timeout: 120000 }); await pg.waitForTimeout(2000); } catch (e) { add("c37-hydrated", tag, "FAIL", { error: String(e.message).slice(0, 200) }); await pg.close(); return; }
  const d = await pg.evaluate(() => { const vis = (e) => e && e.getClientRects().length > 0; const root = document.getElementById("ahv-design-root") || document.body;
    const ref = [...document.querySelectorAll("[data-rate-reference]")].find(vis);
    const scope = ref || [...document.querySelectorAll("table")].filter(vis).find((t) => /[₹$€]\s?\d/.test(t.innerText));
    let s = ""; if (scope) { const tw = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) if (vis(n.parentElement)) s += n.textContent + " "; }
    return { lang: document.documentElement.lang, route: root.getAttribute("data-ahv-route"), scope: ref ? "[data-rate-reference]" : scope ? "table" : null, refAttr: ref ? ref.getAttribute("data-rate-reference") : null, text: s }; });
  const status = resp ? resp.status() : 0;
  const identityProblems = verifyIdentity({status, finalUrl:pg.url(), route:d.route, lang:d.lang}, loc, key, p);
  if (identityProblems.length) { add("c37-hydrated", tag, "FAIL", { status, finalUrl: pg.url(), ahvRoute: d.route, lang: d.lang, identityProblems, note: "identity not proven" }); await pg.close(); return; }
  if (!d.scope) { add("c37-hydrated", tag, "FAIL", { status, error: "no visible tariff section/table" }); await pg.close(); return; }
  const m = judgeC37(key, priceTokens(d.text), loc);
  add("c37-hydrated", tag, m.problems.length ? "FAIL" : "PASS", { status, finalUrl: pg.url(), lang: d.lang, scope: d.scope, problems: m.problems, rows: m.rows });
  if (d.refAttr) refAttrCheck(tag, d.refAttr, loc);
  await pg.close();
}
function refAttrCheck(tag, attr, loc) {
  const cur = locCur(loc); const lang = loc.toUpperCase();
  const ok = attr.includes(REF) && attr.includes(cur);
  add("c37-reference-attr", tag, ok ? "PASS" : "WARN", { attr, expectedToMention: [REF, cur], note: ok ? "" : `data-rate-reference names ${attr.split("/")[2] || "?"} while the ${lang} page shows ${cur} (label only; values judged separately)` });
}
async function c37Initial(key, loc) {
  const p = lp(key, loc); const tag = `${key} ${loc}`; if (!p) return;
  const x = await initial(p, key, loc);
  if (x.probs.length) { add("c37-initial", tag, "FAIL", { ...idDetail(x), note: "identity not proven — nothing extracted" }); return; }
  const ref = findElement(x.clean, /data-rate-reference=/);
  const scope = ref || findElement(x.clean, /./, "table");
  if (!scope) { add("c37-initial", tag, "FAIL", { ...idDetail(x), error: "no tariff element in initial HTML" }); return; }
  const m = judgeC37(key, priceTokens(textOf(scope.html)), loc);
  add("c37-initial", tag, m.problems.length ? "FAIL" : "PASS", { ...idDetail(x), scope: ref ? "[data-rate-reference]" : "table", problems: m.problems, rows: m.rows });
}

// ── run ───────────────────────────────────────────────────────────────────────────────────────────────────────
for (const loc of LOCALES) {
  if (PAGES.includes("home")) await homeInitial(loc);
  if (PAGES.includes("finder")) await finderInitial(loc);
  if (PAGES.includes("fees")) await feesInitial(loc);
  if (PAGES.includes("c37")) for (const k of C37) await c37Initial(k, loc);
}
const { chromium } = await playwright();
const browser = await chromium.launch();
for (const w of VIEWPORTS) for (const loc of LOCALES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, isMobile: w < 800, hasTouch: w < 800 });
  await attachStagingToken(ctx, BASE);
  if (PAGES.includes("home")) await homeHydrated(ctx, loc, w);
  // a fresh context for the other pages: the homepage run left a currency choice in localStorage
  const ctx2 = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, isMobile: w < 800, hasTouch: w < 800 });
  await attachStagingToken(ctx2, BASE);
  if (PAGES.includes("finder")) await finderHydrated(ctx2, loc, w);
  if (PAGES.includes("fees")) await feesHydrated(ctx2, loc, w);
  if (PAGES.includes("c37")) for (const k of C37) await c37Hydrated(ctx2, k, loc, w);
  await ctx.close(); await ctx2.close();
}
await browser.close();

const summary = {}; for (const c of checks) summary[c.status] = (summary[c.status] || 0) + 1;
writeJson(OUT, "rates-exact.json", { run, summary, checks });
const md = [`# Exact tariff values — ${run.ist}`, "", `Base: ${BASE} · ${run.note} · rate reference ${REF}`, "", `Summary: ${Object.entries(summary).map(([k, v]) => `${k} ${v}`).join(" · ")}`, "", "| status | area | id | matched / problems |", "|---|---|---|---|",
  ...checks.map((c) => `| ${c.status} | ${c.area} | ${c.id} | ${String(c.detail.matched ?? "")} ${JSON.stringify(c.detail.problems || c.detail.identityProblems || c.detail.error || c.detail.drift || "").slice(0, 200).replace(/\|/g, "/")} |`)].join("\n");
fs.writeFileSync(path.join(OUT, "rates-exact.md"), md + "\n");
console.log(`\nsummary: ${JSON.stringify(summary)}  → ${path.join(OUT, "rates-exact.json")}`);
process.exit(summary.FAIL ? 1 : 0);
