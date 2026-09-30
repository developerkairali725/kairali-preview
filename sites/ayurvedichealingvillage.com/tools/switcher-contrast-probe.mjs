// Read-only: language switcher text colour at page top and after scroll (hero vs paper header). node tools/switcher-contrast-probe.mjs [base]
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module"; import { fileURLToPath } from "node:url";
import { attachStagingToken } from "./lib/staging-auth.mjs";
const require = createRequire(import.meta.url);
const store = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../node_modules/.pnpm");
const pw = require(path.join(store, fs.readdirSync(store).find((d) => d.startsWith("playwright@")), "node_modules/playwright"));
const BASE = process.argv[2] || "http://localhost:4471"; const oidc = {};
const b = await pw.chromium.launch();
for (const [r, w] of [["/", 1440], ["/de/", 1440], ["/ar/", 1440], ["/legal-notice/", 1440], ["/", 390]]) {
  const pg = await b.newPage({ viewport: { width: w, height: 900 }, ...oidc }); await attachStagingToken(pg, BASE); await pg.goto(BASE + r, { waitUntil: "load", timeout: 90000 }); await pg.waitForTimeout(3000);
  const top = await pg.evaluate(() => [...document.querySelectorAll(".ahv-lang-btn")].filter((e) => { const x = e.getBoundingClientRect(); return x.width && x.top >= 0 && x.top < 120; }).map((e) => getComputedStyle(e).color + (e.closest("[data-ahv-lang-light]") ? " light" : "")));
  await pg.mouse.wheel(0, 1400); await pg.waitForTimeout(1200);
  const scrolled = await pg.evaluate(() => [...document.querySelectorAll(".ahv-lang-btn")].filter((e) => { const x = e.getBoundingClientRect(); return x.width && x.top >= 0 && x.top < 120; }).map((e) => getComputedStyle(e).color + (e.closest("[data-ahv-lang-light]") ? " light" : "")));
  console.log(r, w, "top:", JSON.stringify(top), "scrolled:", JSON.stringify(scrolled));
  if (r === "/" && w === 1440) { await pg.mouse.wheel(0, -3000); await pg.waitForTimeout(800); await pg.screenshot({ path: "/tmp/sw-fixed-top.png", clip: { x: 900, y: 0, width: 540, height: 110 } }); }
  await pg.close();
}
await b.close();
