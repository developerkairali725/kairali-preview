// Read-only: finder filter badge + Clear restore defaults (EN + AR), phone viewport, local :4471.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const fs=require("fs"),p=require("path"); const s=p.resolve("../../node_modules/.pnpm"); const h=fs.readdirSync(s).find(d=>d.startsWith("playwright@")); const pw=require(p.join(s,h,"node_modules/playwright"));
const b = await pw.chromium.launch(); const pg = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
for (const route of ["/all-programs/", "/ar/all-programs/"]) {
await pg.goto("http://localhost:4471" + route, { waitUntil: "load" }); await pg.waitForTimeout(3000);
const st = async (tag) => console.log(route, tag, JSON.stringify(await pg.evaluate(() => ({ bar: document.querySelector(".ahv-fh-filters").innerText, clear: !document.querySelector(".ahv-fh-clear").hidden, cards: [...document.querySelectorAll("article")].filter(a => a.offsetParent !== null).length, pressed: [...document.querySelectorAll('nav[data-ahv-fh-finder] [aria-pressed="true"]')].map(x => x.innerText.trim().slice(0, 18)) }))));
await st("default");
await pg.locator(".ahv-fh-filters").first().tap(); await pg.waitForTimeout(300);
const cat = pg.locator('[aria-label="Filter by category"] button, [role="group"]:last-of-type button'); 

await pg.locator('nav[data-ahv-fh-finder] [role="group"]').nth(3).locator("button").nth(1).tap(); await pg.waitForTimeout(300);
await pg.locator('nav[data-ahv-fh-finder] [role="group"]').nth(1).locator("button").nth(0).tap(); await pg.waitForTimeout(300);
await st("after category+budget+condition");
await pg.locator(".ahv-fh-clear").tap(); await pg.waitForTimeout(400);
await st("after clear");
}
await b.close();
