// Hosted check of the 28 campaign/landing routes in Vikash's manifest (CAMPAIGN-MANIFEST-28.json, column C = path):
// HTTP status + page identity, query-string preservation, a visible DATA-ENTRY form (never the newsletter or search
// form), consent/privacy near that form, the form's honest staging state, no horizontal overflow at 390/1440, and no
// residual clinical claim or KTAHV locked word in the rendered text.
//
// PASS requires ALL of: status 200 · identity (title, not a 404/sign-in page) · no navigation error · no page errors ·
// no overflow · no clinical claim · a visible data-entry form · consent/privacy near it · no locked word outside the
// explicit allowlist (tools/lib/language-lock.mjs — award titles, proper names, negating disclaimers; printed below and
// in the JSON). Nothing is submitted. Every link on the page is kept with its FULL URL.
// (29 Sep 2026 fix — PARENT-CAMPAIGN-R14-REVIEW: forms, consent and locked words used to be recorded but not judged,
// and the newsletter form's privacy line counted as "consent near the form".)
//   vercel env run -- bash -c "cd sites/ayurvedichealingvillage.com && node tools/hosted-campaign-check.mjs --manifest <json> --base https://ahv-final-staging.vercel.app --out <dir>"
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { attachStagingToken } from "./lib/staging-auth.mjs";
import { scanLockedWords, allowlistForReport } from "./lib/language-lock.mjs";
import { runContext, istStamp, wrongPageSigns } from "./lib/verify-common.mjs";

const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://127.0.0.1:4471").replace(/\/$/, ""), OUT = arg("out", "/tmp/campaign-check");
const rows = JSON.parse(fs.readFileSync(arg("manifest"), "utf8"));
const ONLY = arg("routes") ? new Set(arg("routes").split(",")) : null;
fs.mkdirSync(OUT, { recursive: true });
const CLAIM = /\b(cures?|guarantee[ds]?|miracle|no side[- ]effects?|free from side|side[- ]effect[- ]free|100% natural|permanent (cure|relief|solution)|disease-free|heal(s)? any)\b/i;
const CLAIM_DISCLAIMERS = /No disease cure claims are made|no specific improvement or cure is guaranteed|without promising a permanent cure/gi;
const run = { ...runContext(BASE), tool: "tools/hosted-campaign-check.mjs", at: new Date().toISOString(), ist: istStamp() };
console.log(`campaign check @ ${BASE} (${run.note})\nlocked-word allowlist (explicit):`); for (const a of allowlistForReport()) console.log(`  [${a.kind}] /${a.pattern}/${a.flags}`);
const b = await chromium.launch(); const out = [];
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 800, hasTouch: w < 800 }); await attachStagingToken(ctx, BASE);
  for (const r of rows) {
    const p0 = String(r.C || "").trim(); if (!p0.startsWith("/")) continue;
    if (ONLY && !ONLY.has(p0)) continue;
    const pg = await ctx.newPage(); const errs = []; pg.on("pageerror", (e) => errs.push(e.message));
    // never submit: any non-GET request the page makes is aborted and recorded
    const blocked = []; await pg.route("**/*", (rt) => { const q = rt.request(); if (q.method() !== "GET" && q.method() !== "HEAD") { blocked.push(`${q.method()} ${q.url()}`); return rt.abort(); } return rt.fallback(); });
    let rec = { route: p0, width: w };
    try {
      const url = BASE + p0 + (p0.includes("?") ? "&" : "?") + "gclid=TEST123&utm_source=qa";
      const resp = await pg.goto(url, { waitUntil: "networkidle", timeout: 120000 }); await pg.waitForTimeout(1200);
      rec.status = resp ? resp.status() : 0; rec.requestedUrl = url; rec.finalUrl = pg.url();
      rec.queryKept = /gclid=TEST123/.test(pg.url());
      const d = await pg.evaluate(() => {
        const vis = (e) => e.getClientRects().length > 0 && e.getBoundingClientRect().height > 0;
        const all = [...document.querySelectorAll("form")].map((f) => {
          const action = f.getAttribute("action") || ""; const fields = [...f.elements].filter((e) => e.type !== "hidden" && e.tagName !== "BUTTON" && e.type !== "submit");
          let kind = "data-entry";
          if (f.matches("[data-ahv-newsletter], .ahv-newsletter") || /newsletter/i.test(action)) kind = "newsletter";
          else if (f.getAttribute("role") === "search" || /\/search/.test(action) || f.id === "u7-search") kind = "search";
          else if (!fields.some((e) => e.type === "email" || e.type === "tel" || /mail|phone|tel/i.test(e.name || e.id))) kind = "other (no contact field)";
          // consent/privacy NEAR the form: inside it, or in its own wrapper (the form's parent), never elsewhere on the page
          const near = f.parentElement || f;
          const cb = f.querySelector('input[type="checkbox"]');
          const privacyLink = [...near.querySelectorAll("a[href]")].find((a) => /privacy|datenschutz|confidentialit|politique/i.test(a.getAttribute("href") + " " + a.innerText));
          const text = near.innerText || "";
          return { kind, visible: vis(f), action, deliveryPending: f.hasAttribute("data-ahv-delivery-pending"), fields: fields.map((e) => `${e.type}:${e.name || e.id}${e.required ? "*" : ""}`),
            consentCheckbox: cb ? { name: cb.name || cb.id, required: cb.required || cb.getAttribute("aria-required") === "true", label: (cb.closest("label") || {}).innerText?.slice(0, 160) || null } : null,
            privacyLink: privacyLink ? new URL(privacyLink.getAttribute("href"), location.href).href : null, consentText: /consent|privacy|datenschutz|einwillig|confidentialit|consentement/i.test(text) };
        });
        const root = document.querySelector("#ahv-design-root") || document.body;
        const links = [...new Set([...document.querySelectorAll("a[href]")].map((a) => { try { return new URL(a.getAttribute("href"), location.href).href; } catch { return a.getAttribute("href"); } }))];
        return { text: root.innerText, forms: all, links, overflow: document.documentElement.scrollWidth > innerWidth + 1, title: document.title, h1: (document.querySelector("h1") || {}).innerText || null, lang: document.documentElement.lang };
      });
      const entry = d.forms.filter((f) => f.kind === "data-entry" && f.visible);
      const consentNear = entry.some((f) => f.consentCheckbox || f.privacyLink || f.consentText);
      const lock = scanLockedWords(d.text, (d.lang || "en").slice(0, 2));
      const claimText = d.text.replace(CLAIM_DISCLAIMERS, "");
      const claim = claimText.match(CLAIM);
      rec = { ...rec, title: d.title, h1: d.h1, lang: d.lang, identityProblems: wrongPageSigns({ title: d.title, h1: d.h1 }, rec.status),
        formsAll: d.forms.map((f) => ({ kind: f.kind, visible: f.visible, action: f.action, deliveryPending: f.deliveryPending })), dataEntryForms: entry.length, formDetail: entry,
        consentOrPrivacyNearForm: consentNear, overflow: d.overflow,
        claim: claim ? { match: claim[0], context: claimText.slice(Math.max(0, claim.index - 60), claim.index + 60).replace(/\s+/g, " ") } : null,
        locked: lock.hits.map((x) => ({ word: x.word, match: x.match, context: x.context })), allowlisted: lock.allowlisted.map((x) => ({ word: x.word, kind: x.kind, phrase: x.phrase })),
        links: d.links, errors: errs.length, pageErrors: errs.slice(0, 5), nonGetAborted: blocked };
    } catch (e) { rec.error = String(e).slice(0, 200); }
    const why = [];
    if (rec.status !== 200) why.push(`status ${rec.status}`);
    if (rec.identityProblems && rec.identityProblems.length) why.push(...rec.identityProblems.map((x) => "identity: " + x));
    if (rec.error) why.push("error");
    if (rec.errors) why.push(`${rec.errors} page errors`);
    if (rec.overflow) why.push("horizontal overflow");
    if (rec.claim) why.push(`claim "${rec.claim.match}"`);
    if (!rec.error && !rec.dataEntryForms) why.push("no visible data-entry form");
    if (!rec.error && rec.dataEntryForms && !rec.consentOrPrivacyNearForm) why.push("no consent/privacy near the form");
    if (rec.locked && rec.locked.length) why.push(`locked words: ${[...new Set(rec.locked.map((x) => x.match.toLowerCase()))].join(", ")}`);
    rec.pass = why.length === 0; rec.failReasons = why;
    out.push(rec);
    console.log((rec.pass ? "PASS " : "FAIL ") + `${w} ${p0}  status=${rec.status} forms=${rec.dataEntryForms ?? "?"} consentNear=${rec.consentOrPrivacyNearForm ?? "?"} locked=${(rec.locked || []).length} allowlisted=${(rec.allowlisted || []).length}${why.length ? "  ← " + why.join("; ") : ""}`.slice(0, 400));
    await pg.close();
  }
  await ctx.close();
}
await b.close();
fs.writeFileSync(path.join(OUT, "campaign-check.json"), JSON.stringify({ run, base: BASE, at: new Date().toISOString(), allowlist: allowlistForReport(), passPredicate: "status 200 & identity & no error & no page errors & no overflow & no claim & visible data-entry form & consent/privacy near it & no non-allowlisted locked word", passed: out.filter((x) => x.pass).length, total: out.length, rows: out }, null, 1));
console.log(`campaign routes: ${out.filter((x) => x.pass).length}/${out.length} pass`);
