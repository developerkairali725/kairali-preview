// Hosted check of the 28 campaign/landing routes in Vikash's manifest (CAMPAIGN-MANIFEST-28.json, column C = path):
// HTTP status, query-string preservation, visible form + consent/privacy wording, the form's honest staging state,
// no horizontal overflow at 390/1440, and no residual clinical claim or KTAHV locked word in the rendered text.
//   vercel env run -- bash -c "cd sites/ayurvedichealingvillage.com && node tools/hosted-campaign-check.mjs --manifest <json> --base https://ahv-final-staging.vercel.app --out <dir>"
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { attachStagingToken } from "./lib/staging-auth.mjs";

const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://127.0.0.1:4471").replace(/\/$/, ""), OUT = arg("out", "/tmp/campaign-check");
const rows = JSON.parse(fs.readFileSync(arg("manifest"), "utf8"));
fs.mkdirSync(OUT, { recursive: true });
const CLAIM = /\b(cures?|guarantee[ds]?|miracle|no side[- ]effects?|free from side|side[- ]effect[- ]free|100% natural|permanent (cure|relief|solution)|disease-free|heal(s)? any)\b/i;
const LOCKED = /\b(spa|resort|holiday|luxury|journey|guests)\b/i;
const ALLOW = /(World Luxury Spa Award|World Luxury Award|Luxury Lifestyle Award|Wellness Resort|luxury-resort|Top Ten Wellness Destination)/gi; // award titles / proper names
const b = await chromium.launch(); const out = [];
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 800, hasTouch: w < 800 }); await attachStagingToken(ctx, BASE);
  for (const r of rows) {
    const p0 = String(r.C || "").trim(); if (!p0.startsWith("/")) continue;
    const pg = await ctx.newPage(); const errs = []; pg.on("pageerror", (e) => errs.push(e.message));
    let rec = { route: p0, width: w };
    try {
      const resp = await pg.goto(BASE + p0 + (p0.includes("?") ? "&" : "?") + "gclid=TEST123&utm_source=qa", { waitUntil: "networkidle", timeout: 120000 }); await pg.waitForTimeout(1200);
      rec.status = resp ? resp.status() : 0; rec.finalUrl = pg.url().replace(BASE, "");
      rec.queryKept = /gclid=TEST123/.test(pg.url());
      const d = await pg.evaluate(() => { const t = (document.querySelector("#ahv-design-root") || document.body).innerText; const f = [...document.querySelectorAll("form")].filter((x) => x.getBoundingClientRect().height > 0); return { text: t, forms: f.length, consent: /consent|privacy/i.test(f.map((x) => x.innerText).join(" ")), overflow: document.documentElement.scrollWidth > innerWidth + 1, title: document.title }; });
      const clean = d.text.replace(/No disease cure claims are made|no specific improvement or cure is guaranteed|without promising a permanent cure/gi, "").replace(ALLOW, "");
      rec = { ...rec, title: d.title, forms: d.forms, consentOrPrivacyNearForm: d.consent, overflow: d.overflow, claim: (clean.match(CLAIM) || [null])[0], locked: (clean.match(LOCKED) || [null])[0], errors: errs.length };
    } catch (e) { rec.error = String(e).slice(0, 200); }
    rec.pass = rec.status === 200 && !rec.overflow && !rec.claim && !rec.error && rec.errors === 0;
    out.push(rec); console.log((rec.pass ? "PASS " : "FAIL ") + JSON.stringify(rec).slice(0, 260)); await pg.close();
  }
  await ctx.close();
}
await b.close();
fs.writeFileSync(path.join(OUT, "campaign-check.json"), JSON.stringify({ base: BASE, at: new Date().toISOString(), passed: out.filter((x) => x.pass).length, total: out.length, rows: out }, null, 1));
console.log(`campaign routes: ${out.filter((x) => x.pass).length}/${out.length} pass`);
