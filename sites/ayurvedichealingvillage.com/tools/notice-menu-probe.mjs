// Read-only: cookie notice vs the homepage phone menu (open / closed) per locale, local :4471.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const fs=require("fs"),p=require("path"); const s=p.resolve("../../node_modules/.pnpm"); const h=fs.readdirSync(s).find(d=>d.startsWith("playwright@")); const pw=require(p.join(s,h,"node_modules/playwright"));
const b = await pw.chromium.launch();
for (const route of ["/", "/de/", "/fr/", "/ar/"]) {
const pg = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await pg.goto("http://localhost:4471" + route, { waitUntil: "load" }); await pg.waitForTimeout(3500);
const hit = () => pg.evaluate(() => [620, 700, 760, 820].map((y) => { const e = document.elementFromPoint(195, y); const n = e && e.closest('[data-ahv-notice-under-menu], #ahv-consent'); const cook = [...document.querySelectorAll("body *")].some(x => x.contains(e) && x !== document.body && x !== document.documentElement && getComputedStyle(x).position === "fixed" && (x.querySelector('a[href*="privacy-policy"]') || (window.AHV_LOCAL_PATHS && x.querySelector('a[href$="' + window.AHV_LOCAL_PATHS['/privacy-policy/'] + '"]'))) && x.querySelectorAll("button").length >= 2); return cook ? "NOTICE" : "menu/page"; }));
const before = await hit();
await pg.locator("header button").filter({ has: pg.locator("span") }).last().click(); await pg.waitForTimeout(800);
const open = await hit();
await pg.screenshot({ path: `/tmp/home-menu-${route.replace(/\//g, "") || "en"}.png` });
const tog = pg.locator("header button[aria-expanded=\"true\"]").first(); console.log("expanded buttons while open:", await pg.locator("header button[aria-expanded=\"true\"]").count()); await pg.mouse.click(route === "/ar/" ? 46 : 344, 42); await pg.waitForTimeout(2000); console.log("expanded after close:", await pg.locator("header button[aria-expanded=\"true\"]").count(), "under-menu marks:", await pg.locator("[data-ahv-notice-under-menu]").count()); await pg.screenshot({ path: `/tmp/home-closed-${route.replace(/\//g, "") || "en"}.png` });

const after = await hit();
console.log(route, "closed:", before.join(","), "| menu open:", open.join(","), "| after close:", after.join(","));
await pg.close(); }
await b.close();
