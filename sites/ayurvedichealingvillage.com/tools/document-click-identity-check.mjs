// Owner OPD PDF regression (28 Sep 2026): proves the VISIBLE, hydrated rates link — clicked, then again after a
// reload — lands on this deployment and serves the approved document, byte-identical to its manifest entry
// (public/documents/manifest.json, SHA-256). Raw HTML and the EF sweep missed the original defect, so this checks
// the rendered link a visitor actually clicks. OIDC header for protected staging from the env, never printed.
//   node tools/document-click-identity-check.mjs --base <url> [--out file.json]
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url)), SITE = path.resolve(HERE, "..");
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://localhost:4471").replace(/\/$/, ""), OUT = arg("out", null);
let dir = HERE, pw = null;
while (!pw && dir !== "/") { const s = path.join(dir, "node_modules/.pnpm"); if (fs.existsSync(s)) { const d = fs.readdirSync(s).find((x) => x.startsWith("playwright@")); if (d) pw = require(path.join(s, d, "node_modules/playwright")); } dir = path.dirname(dir); }
// manifest: files[].{screen,print}.{path,sha256}, paths relative to /documents/
const man = JSON.parse(fs.readFileSync(path.join(SITE, "public/documents/manifest.json"), "utf8"));
const approved = new Map();
for (const f of man.files || []) for (const k of ["screen", "print"]) if (f[k] && f[k].path && f[k].sha256) approved.set("/documents/" + f[k].path, { sha256: f[k].sha256, ref: f.ref, language: f.language, currency: f.currency });
const CASES = [
  ["/walk-in-ayurveda-treatment/", 1440, "Outpatient"], ["/walk-in-ayurveda-treatment/", 390, "Outpatient"],
  ["/de/walk-in-ayurveda-treatment/", 1440, "Outpatient"], ["/ar/walk-in-ayurveda-treatment/", 390, "Outpatient"],
];
const oidc = /^https/.test(BASE) && process.env.VERCEL_OIDC_TOKEN ? { extraHTTPHeaders: { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN } } : {};
const b = await pw.chromium.launch(); const rows = [];
for (const [route, w] of CASES) {
  const cx = await b.newContext({ viewport: { width: w, height: w < 700 ? 844 : 900 }, acceptDownloads: true, ...oidc });
  await cx.addInitScript(() => { try { localStorage.setItem("ktahv-consent", "declined"); } catch (e) {} });
  const p = await cx.newPage(); const row = { route, width: w, passes: [] };
  await p.goto(BASE + route, { waitUntil: "load" });
  for (const pass of ["first-load", "after-reload"]) {
    if (pass === "after-reload") await p.reload({ waitUntil: "load" });
    await p.waitForTimeout(3000);
    const link = p.locator('a[href*="/documents/pdf/outpatient-day-treatment-rates/"] >> visible=true').first();
    const r = { pass };
    try {
      r.href = await link.getAttribute("href"); r.resolved = await link.evaluate((a) => a.href);
      await link.scrollIntoViewIfNeeded();
      // a PDF click either downloads or navigates: capture the request the click actually made, then read the bytes
      // served at exactly that URL (a download event carries no response body)
      const [resp] = await Promise.all([cx.waitForEvent("response", (x) => /\/documents\/pdf\/outpatient-day-treatment-rates\//.test(x.url()), { timeout: 30000 }), link.click().catch(() => {})]);
      r.url = resp.url(); r.status = resp.status(); r.type = resp.headers()["content-type"];
      const got = await cx.request.get(r.url, { maxRedirects: 0 });
      const body = Buffer.from(await got.body()); r.bytes = body.length; r.sha256 = crypto.createHash("sha256").update(body).digest("hex");
      const a = approved.get(new URL(r.url).pathname) || {}; r.approvedSha256 = a.sha256 || null; r.ref = a.ref || null; r.language = a.language || null; r.currency = a.currency || null;
      r.ok = new URL(r.url).origin === new URL(BASE).origin && r.status === 200 && got.status() === 200 && /pdf/.test(r.type || "") && body.slice(0, 4).toString() === "%PDF" && !!r.approvedSha256 && r.sha256 === r.approvedSha256;
    } catch (e) { r.error = String(e).slice(0, 200); r.ok = false; }
    row.passes.push(r);
    if (p.url() !== BASE + route && !p.url().startsWith(BASE + route)) await p.goto(BASE + route, { waitUntil: "load" });
  }
  row.ok = row.passes.every((x) => x.ok); rows.push(row);
  console.log(row.ok ? "PASS" : "FAIL", route, w, row.passes.map((x) => `${x.pass}: ${x.status} ${x.url ? new URL(x.url).pathname.split("/").pop() : x.error} ${x.ref || ""} sha=${(x.sha256 || "").slice(0, 12)} approved=${(x.approvedSha256 || "").slice(0, 12)}`).join(" | "));
  await cx.close();
}
await b.close();
if (OUT) fs.writeFileSync(OUT, JSON.stringify({ base: BASE, at: new Date().toISOString(), rows }, null, 1));
process.exit(rows.every((r) => r.ok) ? 0 : 1);
