// Hosted: scrolled desktop homepage header screenshot (EF-04a proof). vc env run -- node tools/hosted-header-shot.mjs <base> <png>
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module"; import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const store = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../node_modules/.pnpm");
const pw = require(path.join(store, fs.readdirSync(store).find((d) => d.startsWith("playwright@")), "node_modules/playwright"));
const [BASE, OUT] = process.argv.slice(2);
const b = await pw.chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, extraHTTPHeaders: { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN } });
await ctx.addInitScript(() => { try { localStorage.setItem("ktahv-consent", "declined"); } catch (e) {} });
const pg = await ctx.newPage(); await pg.goto(BASE + "/", { waitUntil: "load", timeout: 90000 }); await pg.waitForTimeout(3500);
await pg.mouse.wheel(0, 1400); await pg.waitForTimeout(1500);
const vis = await pg.evaluate(() => [...document.querySelectorAll('a[href*="yoga-meditation-training"]')].filter((a) => { const r = a.getBoundingClientRect(); const c = getComputedStyle(a); return r.top >= 0 && r.bottom <= 120 && r.width > 0 && c.visibility !== "hidden" && +c.opacity > 0; }).map((a) => a.innerText.trim()));
await pg.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 1440, height: 160 } });
console.log("visible yoga link(s) in the top 120px after scroll:", JSON.stringify(vis));
await b.close();
