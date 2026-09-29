// Current-architecture equivalent of the WP-era gate tests/ktahv-critical-flows.spec.ts (that spec is NOT edited:
// its original red run is preserved evidence). Same requirements, re-expressed for the design-runtime site:
//   * routes resolved from l10n/routes.json (contact-us, online-consultation, how-to-reach × EN/DE/FR), not guessed;
//   * every page must prove HTTP 200 + its identity (final URL, <html lang>, #ahv-design-root data-ahv-route /
//     data-ahv-locale, a non-404 title and an H1) BEFORE any content assertion — a 404 or a sign-in wall can never pass;
//   * KTAHV language lock per locale (tools/lib/language-lock.mjs, allowlist printed in the report);
//   * locked facts (info@kairali.com, WhatsApp 919289838797, never …38777);
//   * the consultation form chosen by its fields and action (never the header search or the newsletter), its field
//     list, consent checkbox, privacy link and empty-submit validation — NEVER submitted (final submit never clicked,
//     and every non-GET request from the page is aborted and recorded while the form is exercised);
//   * hreflang cluster (raw HTML = the crawler's view, and the hydrated head), reciprocity and target identity;
//   * JSON-LD: the actual @type arrays and NAP as published; MedicalClinic presence reported, never faked;
//   * transport: only an https base can prove it; http:// subresources flagged;
//   * analytics: data-cta presence, and whether a click produced a real (non-consent) dataLayer entry — a destroyed
//     context or a rejected evaluate is NOT-PROVEN, never a pass. Consent state is recorded, never changed.
//
//   local:  node tools/current-critical-flows.mjs --base http://127.0.0.1:4471 --out /tmp/cf
//   hosted: vercel env run -- bash -c "cd sites/ayurvedichealingvillage.com && node tools/current-critical-flows.mjs --base https://ahv-final-staging.vercel.app --out <dir>"
// Options: --locales en,de,fr  --viewports 1440[,390]  --no-walk (do not advance the consultation steps)
//          --require-https (exit 3 unless the base is https — use on the final hosted run)
// Exit: 0 all PASS/WARN/INFO · 1 any FAIL · 2 no FAIL but something NOT-PROVEN / NOT-MET.
import path from "node:path";
import { attachStagingToken } from "./lib/staging-auth.mjs";
import { arg, flag, baseArg, outDir, readJson, writeJson, nowIso, istStamp, runContext, stagingFetch, identityFromHtml, wrongPageSigns, stripNonContent, line, playwright } from "./lib/verify-common.mjs";
import { scanLockedWords, allowlistForReport, wordsFor } from "./lib/language-lock.mjs";
import fs from "node:fs";

const BASE = baseArg();
const OUT = outDir("/tmp/ahv-critical-flows");
const PROD = "https://ayurvedichealingvillage.com";
const LOCALES = arg("locales", "en,de,fr").split(",");
const VIEWPORTS = arg("viewports", "1440").split(",").map(Number);
const WALK = !flag("no-walk");
const L = readJson("l10n/locales.json");
const R = readJson("l10n/routes.json").routes;
const KEYS = { contact: "/contact-us/", consult: "/online-consultation/", reach: "/how-to-reach/" };
// the WP-era spec's hard-coded paths, kept only to report what they do today (obsolete path vs redirect vs 404)
const SPEC_PATHS = {
  en: { consult: "/online-consultation/", reach: "/how-to-reach/", contact: "/contact/" },
  de: { consult: "/de/online-konsultation/", reach: "/de/anreise/", contact: "/de/kontakt/" },
  fr: { consult: "/fr/consultation-en-ligne/", reach: "/fr/comment-nous-rejoindre/", contact: "/fr/contact/" },
};
const EMAIL = "info@kairali.com", PRIYA = "919289838797", WRONG = "919289838777";
const TEST_DATA = { name: "QA verify - do not process", phone: "0000000000", email: "qa-verify@example.invalid", country: "Testland", concern: "QA verification only - do not process" };

const checks = [];
const add = (area, id, status, detail = {}) => { checks.push({ area, id, status, detail }); line(status, `${area} ${id}`, detail); };
const run = { ...runContext(BASE), tool: "tools/current-critical-flows.mjs", at: nowIso(), ist: istStamp(), locales: LOCALES, viewports: VIEWPORTS, walkConsultationSteps: WALK };
console.log(`critical flows @ ${BASE}  (${run.note})`);
if (flag("require-https") && !run.https) { console.error("--require-https: refusing to run against a non-https base (transport cannot be proven)"); process.exit(3); }
console.log("language-lock allowlist (explicit):"); for (const a of allowlistForReport()) console.log(`  [${a.kind}] /${a.pattern}/${a.flags}`);

const expectedPath = (key, loc) => (R[key] && R[key][loc]) || null;
const normDigits = (s) => String(s).replace(/[\s\-()]/g, "");

// ── 0. what the WP-era spec paths do today (informational; the current routes are what is tested) ──────────────
for (const loc of LOCALES) for (const [name, p] of Object.entries(SPEC_PATHS[loc] || {})) {
  const r = await stagingFetch(BASE + p, BASE);
  const cur = expectedPath(KEYS[name], loc);
  const finalPath = r.finalUrl ? new URL(r.finalUrl).pathname : null;
  const status = r.status === 200 && finalPath === cur ? "INFO" : r.status === 404 ? "WARN" : "INFO";
  add("spec-path", `${loc}/${name}`, status, { specPath: p, currentRoute: cur, status: r.status, finalUrl: r.finalUrl, hops: r.hops.map((h) => `${h.status} ${h.url}`), note: finalPath === cur ? (r.hops.length > 1 ? "redirects to the current route" : "same as current route") : r.status === 404 ? "obsolete spec path — 404, no redirect (decide if one is required for inbound links)" : "does not land on the current route" });
}

// ── 1. raw HTML (crawler view): status, final URL, identity, hreflang, JSON-LD ───────────────────────────────
const raw = {};
for (const loc of LOCALES) for (const [name, key] of Object.entries(KEYS)) {
  const p = expectedPath(key, loc);
  if (!p) { add("route", `${loc}/${name}`, "FAIL", { key, error: "no route in l10n/routes.json" }); continue; }
  const r = await stagingFetch(BASE + p, BASE);
  const id = identityFromHtml(r.html);
  raw[`${loc}/${name}`] = { path: p, ...r, id };
}

function jsonLd(html) {
  const blocks = [...String(html).matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const nodes = []; let malformed = 0;
  for (const b of blocks) {
    let j; try { j = JSON.parse(b); } catch { malformed++; continue; }
    const walk = (n) => { if (Array.isArray(n)) return n.forEach(walk); if (n && typeof n === "object") { if (n["@graph"]) return walk(n["@graph"]); nodes.push(n); } };
    walk(j);
  }
  return { blocks: blocks.length, malformed, nodes };
}
const typesOf = (n) => [].concat(n["@type"] || []);
function nap(nodes) {
  const orgs = nodes.filter((n) => typesOf(n).some((t) => /Organization|Hospital|MedicalClinic|LocalBusiness|MedicalOrganization/.test(t)));
  return orgs.map((n) => ({
    types: typesOf(n), "@id": n["@id"] || null, name: n.name || null, telephone: n.telephone || null, email: n.email || null,
    address: n.address ? (typeof n.address === "string" ? n.address : { streetAddress: n.address.streetAddress, addressLocality: n.address.addressLocality, addressRegion: n.address.addressRegion, postalCode: n.address.postalCode, addressCountry: n.address.addressCountry }) : null,
    url: n.url || null,
  }));
}
function hreflangs(html) {
  const out = {};
  for (const m of String(html).matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0]; if (!/rel="alternate"/i.test(tag)) continue;
    const hl = (/hreflang="([^"]+)"/i.exec(tag) || [])[1]; const href = (/href="([^"]+)"/i.exec(tag) || [])[1];
    if (hl) (out[hl] = out[hl] || []).push(href);
  }
  return out;
}

// ── 2. browser pass ─────────────────────────────────────────────────────────────────────────────────────────
const { chromium } = await playwright();
const browser = await chromium.launch();
const hydrated = {};
for (const w of VIEWPORTS) {
  for (const loc of LOCALES) for (const [name, key] of Object.entries(KEYS)) {
    const tag = `${loc}/${name}@${w}`;
    const p = expectedPath(key, loc); if (!p) continue;
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, isMobile: w < 800, hasTouch: w < 800 });
    await attachStagingToken(ctx, BASE);
    // analytics recorder: copies dataLayer entries (and data-cta clicks) into sessionStorage every 100 ms and on
    // pagehide, so an entry pushed right before a navigation survives it (same-origin). Observes only.
    await ctx.addInitScript(() => {
      try {
        const K = "__ahvVerifyDL"; let seen = 0;
        const store = () => { try { const dl = window.dataLayer; if (!Array.isArray(dl)) return; const prev = JSON.parse(sessionStorage.getItem(K) || "[]"); for (; seen < dl.length; seen++) { let v; try { v = JSON.parse(JSON.stringify(dl[seen])); } catch { v = String(dl[seen]); } prev.push({ t: Date.now(), path: location.pathname, v }); } sessionStorage.setItem(K, JSON.stringify(prev)); } catch (e) {} };
        setInterval(store, 100); addEventListener("pagehide", store);
        document.addEventListener("click", (e) => { const c = e.target && e.target.closest && e.target.closest("[data-cta]"); if (!c) return; store(); try { const prev = JSON.parse(sessionStorage.getItem("__ahvVerifyClicks") || "[]"); prev.push({ t: Date.now(), cta: c.getAttribute("data-cta"), href: c.getAttribute("href") }); sessionStorage.setItem("__ahvVerifyClicks", JSON.stringify(prev)); } catch (e2) {} }, true);
      } catch (e) {}
    });
    const pg = await ctx.newPage();
    const reqs = [], consoleErrors = [], pageErrors = [], failed = [], blocked = [], httpErrors = [];
    pg.on("request", (q) => reqs.push({ url: q.url(), method: q.method(), type: q.resourceType() }));
    pg.on("console", (m) => { if (m.type() === "error") consoleErrors.push(`${m.text()} ${(m.location() || {}).url || ""}`.slice(0, 300)); });
    pg.on("response", (res) => { if (res.status() >= 400) httpErrors.push(`${res.status()} ${res.url()}`.slice(0, 300)); });
    pg.on("pageerror", (e) => pageErrors.push(String(e.message || e).slice(0, 300)));
    pg.on("requestfailed", (q) => failed.push(`${q.method()} ${q.url()} ${q.failure() ? q.failure().errorText : ""}`.slice(0, 300)));
    let resp, navErr = null;
    try { resp = await pg.goto(BASE + p, { waitUntil: "networkidle", timeout: 120000 }); await pg.waitForTimeout(1500); }
    catch (e) { navErr = String(e.message || e).slice(0, 200); }
    const status = resp ? resp.status() : 0;
    let id = {};
    try {
      id = await pg.evaluate(() => {
        const root = document.getElementById("ahv-design-root");
        return { lang: document.documentElement.lang, title: document.title, h1: [...document.querySelectorAll("h1")].filter((h) => h.getClientRects().length).map((h) => h.innerText.trim()).filter(Boolean)[0] || null,
          ahvRoute: root ? root.getAttribute("data-ahv-route") : null, ahvLocale: root ? root.getAttribute("data-ahv-locale") : null,
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || null };
      });
    } catch (e) { navErr = navErr || "identity evaluate rejected: " + String(e.message).slice(0, 150); }
    const finalUrl = pg.url(), finalPath = (() => { try { return new URL(finalUrl).pathname; } catch { return null; } })();
    const langWant = (L[loc].htmlLang || L[loc].lang || loc).toLowerCase().split("-")[0];
    const idProblems = [...wrongPageSigns(id, status)];
    if (navErr) idProblems.push(navErr);
    if (finalPath !== p) idProblems.push(`final path ${finalPath} ≠ expected ${p}`);
    if (id.ahvRoute !== key) idProblems.push(`data-ahv-route ${id.ahvRoute} ≠ ${key}`);
    if (loc !== "en" && id.ahvLocale !== loc) idProblems.push(`data-ahv-locale ${id.ahvLocale} ≠ ${loc}`);
    if (!String(id.lang || "").toLowerCase().startsWith(langWant)) idProblems.push(`<html lang> ${id.lang} ≠ ${langWant}*`);
    if (!id.h1) idProblems.push("no visible H1");
    const identityOk = idProblems.length === 0;
    add("identity", tag, identityOk ? "PASS" : "FAIL", { expectedPath: p, routeKey: key, status, finalUrl, lang: id.lang, title: id.title, h1: id.h1, ahvRoute: id.ahvRoute, ahvLocale: id.ahvLocale, problems: idProblems });
    const rec = { tag, loc, name, key, path: p, w, status, finalUrl, identity: id, identityOk };
    hydrated[tag] = rec;
    const gated = (area, idd) => add(area, idd, "NOT-PROVEN", { reason: "page identity not proven — content assertions are not evaluated on a page that may not be the page" });
    if (!identityOk) {
      for (const a of ["lock", "facts"]) gated(a, tag);
      if (name === "consult") gated("form", tag);
      gated("analytics", tag);
      await ctx.close(); continue;
    }

    // language lock — visible text and public metadata
    const texts = await pg.evaluate(() => ({ body: document.body.innerText, meta: [document.title, document.querySelector('meta[name="description"]')?.content, document.querySelector('meta[property="og:title"]')?.content, document.querySelector('meta[property="og:description"]')?.content].filter(Boolean).join(" \n ") }));
    const lb = scanLockedWords(texts.body, loc), lm = scanLockedWords(texts.meta, loc);
    add("lock", tag, lb.hits.length ? "FAIL" : "PASS", { words: wordsFor(loc).length, hits: lb.hits.map((h) => ({ word: h.word, match: h.match, context: h.context })), allowlisted: lb.allowlisted.map((a) => ({ word: a.word, kind: a.kind, phrase: a.phrase })) });
    add("lock-meta", tag, lm.hits.length ? "FAIL" : "PASS", { hits: lm.hits.map((h) => ({ word: h.word, context: h.context })), allowlisted: lm.allowlisted.map((a) => a.phrase) });

    // locked facts
    const html = await pg.content();
    const digits = normDigits(html);
    const f = { wrongPresent: digits.includes(WRONG), priyaPresent: digits.includes(PRIYA), emailPresent: html.includes(EMAIL), waLinks: (html.match(/wa\.me\/919289838797/g) || []).length, waWrongLinks: (html.match(/wa\.me\/919289838777/g) || []).length };
    const factsFail = f.wrongPresent || (name === "contact" && (!f.priyaPresent || !f.emailPresent));
    add("facts", tag, factsFail ? "FAIL" : "PASS", { ...f, required: name === "contact" ? "contact page: 919289838797 AND info@kairali.com present, …38777 absent" : "…38777 absent (presence of the others recorded)" });

    // consultation form
    if (name === "consult") await consultationForm(pg, ctx, tag, blocked);

    // analytics + consent (recorded, never changed)
    await analytics(pg, tag, name);

    // transport + console
    const httpSub = reqs.filter((q) => q.url.startsWith("http://"));
    if (run.https) add("transport", tag, httpSub.length || !finalUrl.startsWith("https://") ? "FAIL" : "PASS", { finalUrl, requests: reqs.length, httpSubresources: httpSub.map((q) => `${q.type} ${q.url}`) });
    else add("transport", tag, "NOT-PROVEN", { reason: "base is http — mixed content cannot be judged; run against the https staging deployment", httpRequestsSeen: httpSub.length });
    add("console", tag, pageErrors.length ? "FAIL" : consoleErrors.length || failed.length || httpErrors.length ? "WARN" : "PASS", { pageErrors, httpErrors: httpErrors.slice(0, 20), consoleErrors: consoleErrors.slice(0, 15), requestFailed: failed.filter((x) => !blocked.some((b) => x.includes(b))).slice(0, 15) });
    await ctx.close();
  }
}
await browser.close();

async function consultationForm(pg, ctx, tag, blocked) {
  // candidates: every <form>; excluded with a reason when it is search / newsletter / not a data-entry form
  const cands = await pg.evaluate(() => [...document.querySelectorAll("form")].map((f, i) => {
    const fields = [...f.elements].filter((e) => e.tagName !== "BUTTON" && e.type !== "hidden" && e.type !== "submit").map((e) => ({ tag: e.tagName.toLowerCase(), type: e.type, name: e.name || e.id, required: e.required || e.getAttribute("aria-required") === "true", label: (e.labels && e.labels[0] ? e.labels[0].innerText : e.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 60) }));
    const action = f.getAttribute("action") || "";
    const vis = f.getClientRects().length > 0 && f.getBoundingClientRect().height > 0;
    let exclude = null;
    if (f.matches("[data-ahv-newsletter], .ahv-newsletter") || /newsletter/i.test(action)) exclude = "newsletter";
    else if (f.getAttribute("role") === "search" || /\/search/.test(action) || f.id === "u7-search" || f.closest("header")) exclude = "search/header";
    else if (!fields.some((x) => x.type === "email") || !fields.some((x) => /name/i.test(x.name))) exclude = "no name+email fields";
    else if (!vis) exclude = "not visible";
    return { index: i, action, step: f.getAttribute("data-step"), inFormArea: !!f.closest("#ktahv-oc-formArea"), deliveryPending: f.hasAttribute("data-ahv-delivery-pending"), vis, fields, exclude };
  }));
  const chosen = cands.find((c) => !c.exclude && c.inFormArea) || cands.find((c) => !c.exclude);
  if (!chosen) { add("form", tag, "FAIL", { error: "no consultation form found", candidates: cands.map((c) => ({ index: c.index, action: c.action, exclude: c.exclude })) }); return; }
  const form = pg.locator("form").nth(chosen.index);
  const detail = { chosenIndex: chosen.index, action: chosen.action, step: chosen.step, deliveryState: chosen.deliveryPending ? "delivery pending (data-ahv-delivery-pending — staging transport guard, no delivery)" : "action as published", fieldsStep1: chosen.fields, candidates: cands.map((c) => ({ index: c.index, action: c.action, step: c.step, exclude: c.exclude })) };
  // any non-GET request while the form is exercised is aborted and recorded (belt and braces: never submit)
  await pg.route("**/*", (route) => { const q = route.request(); if (q.method() !== "GET" && q.method() !== "HEAD") { blocked.push(q.url()); return route.abort(); } return route.fallback(); });
  // empty submit on the first step
  const urlBefore = pg.url();
  const submit = form.locator('button[type="submit"], input[type="submit"]').first();
  let empty = {};
  try {
    await submit.click({ timeout: 8000 }); await pg.waitForTimeout(900);
    empty = await pg.evaluate((i) => { const f = document.querySelectorAll("form")[i]; const area = document.getElementById("ktahv-oc-formArea") || (f && f.parentElement) || document.body;
      return { stillSameStep: !!(f && f.isConnected && f.getAttribute("data-step") === "1") || !document.querySelector('#ktahv-oc-formArea form[data-step="2"]'), ariaInvalid: area.querySelectorAll('[aria-invalid="true"]').length, alerts: [...area.querySelectorAll('[role="alert"]')].map((a) => a.innerText.trim()).filter(Boolean).slice(0, 6), invalidNative: f ? [...f.elements].filter((e) => e.willValidate && !e.checkValidity()).length : 0, focused: document.activeElement ? (document.activeElement.id || document.activeElement.name || document.activeElement.tagName) : null }; }, chosen.index);
  } catch (e) { empty.error = String(e.message).slice(0, 200); }
  empty.urlUnchanged = pg.url() === urlBefore;
  empty.postsBlocked = blocked.length;
  const emptyOk = !empty.error && empty.urlUnchanged && empty.stillSameStep && (empty.ariaInvalid > 0 || empty.alerts.length > 0 || empty.invalidNative > 0);
  add("form-empty-submit", tag, emptyOk ? "PASS" : "FAIL", empty);

  // consent + privacy: on a multi-step flow they live on the review step; walk there with inert test data
  let consent = { walked: false };
  const consentHere = await form.locator('input[type="checkbox"]').count();
  if (!consentHere && WALK && chosen.inFormArea) {
    try {
      await pg.fill("#ktahv-oc-fName", TEST_DATA.name); await pg.fill("#ktahv-oc-fPhone", TEST_DATA.phone); await pg.fill("#ktahv-oc-fEmail", TEST_DATA.email); await pg.fill("#ktahv-oc-fCountry", TEST_DATA.country);
      await pg.click("#ktahv-oc-toStep2"); await pg.waitForSelector('#ktahv-oc-formArea form[data-step="2"]', { timeout: 8000 });
      const s2 = await pg.evaluate(() => [...document.querySelector('#ktahv-oc-formArea form[data-step="2"]').elements].filter((e) => e.type !== "hidden").map((e) => `${e.tagName.toLowerCase()}:${e.type}:${e.name || e.id || e.getAttribute("data-chip") || ""}`));
      await pg.fill("#ktahv-oc-fConcern", TEST_DATA.concern); await pg.click("#ktahv-oc-toReview"); await pg.waitForSelector('#ktahv-oc-formArea form[data-step="review"]', { timeout: 8000 });
      consent = { walked: true, step2Fields: s2, ...(await reviewConsent(pg, '#ktahv-oc-formArea form[data-step="review"]')) };
    } catch (e) { consent = { walked: false, error: String(e.message).slice(0, 200) }; }
  } else {
    consent = { walked: false, ...(await reviewConsent(pg, `form >> nth=${chosen.index}`, chosen.index)) };
  }
  consent.finalSubmitClicked = false;
  consent.nonGetRequestsAborted = [...blocked];
  const consentOk = consent.checkbox && consent.checkbox.present && consent.checkbox.visible && consent.privacyLink;
  add("form-consent", tag, consentOk ? "PASS" : (consent.error ? "NOT-PROVEN" : "FAIL"), consent);
  add("form-delivery", tag, "NOT-PROVEN", { reason: "delivery is never exercised by this tool (no submission). " + detail.deliveryState, ...detail });
  await pg.unroute("**/*");
}
async function reviewConsent(pg, sel, index) {
  return pg.evaluate(({ sel, index }) => {
    const f = index != null ? document.querySelectorAll("form")[index] : document.querySelector(sel);
    if (!f) return { error: "form not found" };
    const cb = f.querySelector('input[type="checkbox"]');
    const lab = cb ? (cb.closest("label") || (cb.id && f.querySelector(`label[for="${cb.id}"]`))) : null;
    const scope = lab || f;
    const priv = [...scope.querySelectorAll("a[href]"), ...f.querySelectorAll("a[href]")].find((a) => /privacy|datenschutz|confidentialit|politique|privacidad|riservatezza|privacidade|privacybeleid/i.test(a.getAttribute("href") + " " + a.innerText));
    return { step: f.getAttribute("data-step"), checkbox: cb ? { present: true, id: cb.id, name: cb.name, visible: cb.getClientRects().length > 0, checkedByDefault: cb.checked, required: cb.required || cb.getAttribute("aria-required") === "true" } : { present: false },
      label: lab ? lab.innerText.replace(/\s+/g, " ").trim().slice(0, 300) : null, privacyLink: priv ? { href: new URL(priv.getAttribute("href"), location.href).href, text: priv.innerText.trim().slice(0, 60) } : null,
      submitButton: (f.querySelector('button[type="submit"]') || {}).innerText || null };
  }, { sel, index });
}

async function analytics(pg, tag, name) {
  const st = await pg.evaluate(() => {
    let cfg = null; try { cfg = JSON.parse(document.getElementById("ahv-route-config")?.textContent || "null"); } catch (e) {}
    const dl = Array.isArray(window.dataLayer) ? window.dataLayer : [];
    const consentCmds = dl.map((e) => { try { return JSON.parse(JSON.stringify(e)); } catch { return null; } }).filter((e) => e && e[0] === "consent").map((e) => ({ cmd: e[1], analytics_storage: e[2] && e[2].analytics_storage, ad_storage: e[2] && e[2].ad_storage }));
    let fleet = null; try { fleet = JSON.parse(localStorage.getItem("kairali-consent-v1") || "null"); } catch (e) {}
    return { ctas: [...document.querySelectorAll("[data-cta]")].map((e) => ({ cta: e.getAttribute("data-cta"), tag: e.tagName, href: e.getAttribute("href"), visible: e.getClientRects().length > 0 })).slice(0, 30),
      consent: { noticeVisible: !!(document.getElementById("ahv-consent") && document.getElementById("ahv-consent").getClientRects().length), ktahvConsent: localStorage.getItem("ktahv-consent"), fleetGranted: fleet ? fleet.granted : null, consentCommands: consentCmds },
      measurementConfigured: !!(cfg && cfg.measurement), dataLayerLength: dl.length,
      tagsLoaded: performance.getEntriesByType("resource").map((r) => r.name).filter((u) => /googletagmanager|google-analytics|clarity\.ms|connect\.facebook/.test(u)).length };
  });
  const base = { consent: st.consent, measurementConfigured: st.measurementConfigured, tagsLoaded: st.tagsLoaded, note: "tracking is consent-gated and switched off on staging by owner ruling 15 Sep 2026 (AHV_ANALYTICS unset) — recorded, not changed" };
  const visible = st.ctas.filter((c) => c.visible);
  if (!st.ctas.length) { add("analytics", tag, "NOT-MET", { ...base, dataCta: 0, reason: "no [data-cta] element on this page — the spec's click-to-dataLayer requirement has nothing to act on (data-cta exists only on /lp/ pages in this build)" }); return; }
  if (!visible.length) { add("analytics", tag, "NOT-PROVEN", { ...base, dataCta: st.ctas.length, reason: "data-cta elements exist but none is visible" }); return; }
  const readQa = () => pg.evaluate(() => ({ dl: JSON.parse(sessionStorage.getItem("__ahvVerifyDL") || "[]"), clicks: JSON.parse(sessionStorage.getItem("__ahvVerifyClicks") || "[]"), path: location.pathname }));
  let before; try { before = await readQa(); } catch (e) { add("analytics", tag, "NOT-PROVEN", { ...base, reason: "evaluate rejected before the click: " + String(e.message).slice(0, 120) }); return; }
  const t0 = Date.now(); const urlBefore = pg.url();
  const target = pg.locator("[data-cta]").filter({ visible: true }).first();
  const clicked = await target.getAttribute("data-cta").catch(() => null);
  try { await target.click({ timeout: 5000, noWaitAfter: true }); } catch (e) { add("analytics", tag, "NOT-PROVEN", { ...base, dataCta: st.ctas.length, clicked, reason: "click failed: " + String(e.message).slice(0, 120) }); return; }
  await pg.waitForTimeout(1500);
  let after; try { after = await readQa(); } catch (e) { add("analytics", tag, "NOT-PROVEN", { ...base, dataCta: st.ctas.length, clicked, urlBefore, urlAfter: pg.url(), reason: "evaluate rejected after the click (context destroyed / cross-origin) — no event evidence: " + String(e.message).slice(0, 120) }); return; }
  const fresh = after.dl.filter((e) => e.t >= t0 && !(Array.isArray(e.v) ? e.v[0] === "consent" : e.v && e.v[0] === "consent"));
  const clickSeen = after.clicks.some((c) => c.t >= t0);
  add("analytics", tag, fresh.length ? "PASS" : "NOT-PROVEN", { ...base, dataCta: st.ctas.length, clicked, clickRecorded: clickSeen, urlBefore, urlAfter: pg.url(), newNonConsentEntries: fresh.slice(0, 5), reason: fresh.length ? "click produced a dataLayer entry" : "no non-consent dataLayer entry after the click (expected while measurement is off on staging)" });
}

// ── 3. hreflang + JSON-LD (raw HTML), per page, plus cluster reciprocity ───────────────────────────────────────
const clusters = {};
for (const [tag, r] of Object.entries(raw)) {
  const [loc, name] = tag.split("/"); const key = KEYS[name];
  const id = r.id; const probs = [...wrongPageSigns(id, r.status)];
  if (new URL(r.finalUrl).pathname !== r.path) probs.push(`final path ${new URL(r.finalUrl).pathname} ≠ ${r.path}`);
  if (id.ahvRoute !== key) probs.push(`data-ahv-route ${id.ahvRoute} ≠ ${key}`);
  add("raw-identity", tag, probs.length ? "FAIL" : "PASS", { url: BASE + r.path, status: r.status, finalUrl: r.finalUrl, title: id.title, h1: id.h1, lang: id.lang, ahvRoute: id.ahvRoute, ahvLocale: id.ahvLocale, hops: r.hops.map((h) => `${h.status} ${h.url}${h.tokenSent ? " [token]" : ""}`), problems: probs });
  if (probs.length) { add("hreflang", tag, "NOT-PROVEN", { reason: "raw identity not proven" }); add("jsonld", tag, "NOT-PROVEN", { reason: "raw identity not proven" }); continue; }
  const hl = hreflangs(r.html);
  const want = Object.fromEntries(Object.entries(R[key]).map(([l, pth]) => [l === "zh-Hans" ? "zh-Hans" : l, PROD + pth]));
  const hp = [];
  for (const l of ["en", "de", "fr"]) { const got = hl[l] || []; if (got.length !== 1) hp.push(`hreflang ${l}: ${got.length} tags`); else if (got[0] !== want[l]) hp.push(`hreflang ${l} → ${got[0]} ≠ ${want[l]}`); }
  for (const [l, u] of Object.entries(want)) if (!hl[l] || hl[l][0] !== u) hp.push(`hreflang ${l} missing/different (want ${u}, got ${(hl[l] || []).join(",") || "none"})`);
  if (!hl["x-default"]) hp.push("x-default missing"); else if (hl["x-default"][0] !== want.en) hp.push(`x-default → ${hl["x-default"][0]} ≠ ${want.en}`);
  const self = hl[loc === "en" ? "en" : loc]?.[0];
  if (id.canonical && self && id.canonical !== self) hp.push(`canonical ${id.canonical} ≠ self hreflang ${self}`);
  clusters[key] = clusters[key] || {}; clusters[key][loc] = JSON.stringify(Object.keys(hl).sort().map((k) => [k, hl[k]]));
  add("hreflang", tag, hp.length ? "FAIL" : "PASS", { canonical: id.canonical, selfHreflang: self, tags: Object.keys(hl).length, problems: hp });
  const ld = jsonLd(r.html);
  const all = ld.nodes.map((n) => typesOf(n));
  const flat = all.flat();
  const naps = nap(ld.nodes);
  const emails = naps.map((n) => n.email).filter(Boolean);
  add("jsonld", tag, ld.malformed ? "FAIL" : "PASS", { blocks: ld.blocks, malformed: ld.malformed, typeArrays: all, nap: naps });
  add("jsonld-medicalclinic", tag, flat.includes("MedicalClinic") ? "PASS" : "NOT-MET", { medicalClinic: flat.includes("MedicalClinic"), hospital: flat.includes("Hospital"), note: flat.includes("MedicalClinic") ? "" : "MedicalClinic is not in the published schema (types above). Adding it is a schema/clinical decision for the owner and Dr. Deepu John — not faked here." });
  add("jsonld-email", tag, emails.length && emails.every((e) => e === EMAIL) ? "PASS" : emails.length ? "FAIL" : "NOT-MET", { emails, required: EMAIL });
}
for (const [key, byLoc] of Object.entries(clusters)) {
  const vals = Object.values(byLoc);
  add("hreflang-cluster", key, vals.every((v) => v === vals[0]) ? "PASS" : "FAIL", { locales: Object.keys(byLoc), note: "the alternate set must be identical on every member of the cluster (reciprocity)" });
}

// ── summary ──────────────────────────────────────────────────────────────────────────────────────────────────
const summary = {}; for (const c of checks) summary[c.status] = (summary[c.status] || 0) + 1;
const report = { run, allowlist: allowlistForReport(), summary, checks };
writeJson(OUT, "critical-flows.json", report);
const md = [`# Current critical flows — ${run.ist}`, "", `Base: ${BASE} · ${run.note}`, "", `Summary: ${Object.entries(summary).map(([k, v]) => `${k} ${v}`).join(" · ")}`, "", "| status | area | id | key detail |", "|---|---|---|---|",
  ...checks.map((c) => `| ${c.status} | ${c.area} | ${c.id} | ${JSON.stringify(c.detail.problems || c.detail.hits || c.detail.reason || c.detail.error || "").slice(0, 160).replace(/\|/g, "/")} |`),
  "", "Language-lock allowlist (explicit):", ...allowlistForReport().map((a) => `- [${a.kind}] \`/${a.pattern}/${a.flags}\``)].join("\n");
fs.writeFileSync(path.join(OUT, "critical-flows.md"), md + "\n");
console.log(`\nsummary: ${JSON.stringify(summary)}  → ${path.join(OUT, "critical-flows.json")}`);
process.exit(summary.FAIL ? 1 : summary["NOT-PROVEN"] || summary["NOT-MET"] ? 2 : 0);
