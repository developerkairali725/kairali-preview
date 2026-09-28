// Hosted: default tariff currency per locale on /ayurvedic-treatments/ (approved table selection, never conversion). vc env run -- node tools/hosted-currency-check.mjs
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module"; import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const store = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../node_modules/.pnpm");
const pw = require(path.join(store, fs.readdirSync(store).find((d) => d.startsWith("playwright@")), "node_modules/playwright"));
const R = JSON.parse(fs.readFileSync("l10n/routes.json", "utf8")).routes;
const b = await pw.chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, extraHTTPHeaders: { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN } });
for (const l of ["en", "hi", "de", "fr", "es", "it", "pt", "nl", "ru", "ar", "zh-Hans", "ja", "ko"]) {
  const pg = await ctx.newPage(); await pg.goto("https://ahv-final-staging.vercel.app" + R["/ayurvedic-treatments/"][l], { waitUntil: "load", timeout: 90000 }); await pg.waitForTimeout(3500);
  const r = await pg.evaluate(() => { const t = [...document.querySelectorAll("article")].map((a) => a.innerText).join(" "); const sym = (t.match(/[₹$€]/g) || []); const c = {}; for (const s of sym) c[s] = (c[s] || 0) + 1; const pressed = [...document.querySelectorAll('[aria-label] button[aria-pressed="true"], [role="group"] button[aria-pressed="true"]')].map((x) => x.innerText.trim()).filter((x) => /^[₹$€]$/.test(x)); return { symbols: c, pressedCurrency: pressed[0] || null, lang: document.documentElement.lang }; });
  console.log(l, JSON.stringify(r)); await pg.close();
}
await b.close();
