/** Quick read-only render probe: node tools/pwcheck.mjs <url> <w> <h> [screenshot|""] [css selector] — prints innerText of matches + console errors (Playwright Chromium). */
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module";
const require_ = createRequire(import.meta.url);
let dir = process.cwd(), store; for (let i = 0; i < 6 && !store; i++) { const s = path.join(dir, "node_modules", ".pnpm"); if (fs.existsSync(s)) store = s; dir = path.dirname(dir); }
const { chromium } = require_(path.join(store, fs.readdirSync(store).find((d) => d.startsWith("playwright@")), "node_modules", "playwright"));
const [,, url, w, h, shot, sel] = process.argv;
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: +w, height: +h }, isMobile: +w < 800, hasTouch: +w < 800, deviceScaleFactor: 1 });
const p = await ctx.newPage(); const errs = []; p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 150))); p.on("pageerror", (e) => errs.push("PAGEERROR " + String(e).slice(0, 150)));
await p.goto(url, { waitUntil: "load" }); await p.waitForTimeout(3000);
const out = await p.evaluate((sel) => [...document.querySelectorAll(sel || "body")].map((e) => e.innerText.replace(/\s+/g, " ").trim()).filter(Boolean).slice(0, 40), sel);
if (shot) await p.screenshot({ path: shot, fullPage: false });
console.log(JSON.stringify(out, null, 1).slice(0, 4000)); console.log("console errors:", errs.length, errs.slice(0, 5));
await b.close();
