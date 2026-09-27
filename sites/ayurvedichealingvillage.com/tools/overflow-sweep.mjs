// Read-only: horizontal-overflow sweep across all 13 locales (local :4471). node tools/overflow-sweep.mjs [routes,csv] [width]
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const fs=require("fs"),p=require("path"); const s=p.resolve("../../node_modules/.pnpm"); const h=fs.readdirSync(s).find(d=>d.startsWith("playwright@")); const pw=require(p.join(s,h,"node_modules/playwright"));
const R = require("../l10n/routes.json").routes;
const routes = (process.argv[2] || "/,/all-programs/,/our-villas/,/contact-us/,/legal-notice/").split(",");
const b = await pw.chromium.launch(); const ctx = await b.newContext({ viewport: { width: Number(process.argv[3] || 390), height: 844 }, isMobile: true, hasTouch: true });
const bad = [];
for (const r of routes) for (const loc of ["en", "hi", "de", "fr", "es", "it", "pt", "nl", "ru", "ar", "zh-Hans", "ja", "ko"]) {
  const url = loc === "en" ? r : (R[r] && R[r][loc]); if (!url) continue;
  const pg = await ctx.newPage(); await pg.goto("http://localhost:4471" + url, { waitUntil: "load", timeout: 60000 }); await pg.waitForTimeout(2500);
  const m = await pg.evaluate(() => ({ iw: innerWidth, sw: document.documentElement.scrollWidth, culprit: [...document.querySelectorAll("button, a, span, h1, h2, h3, p, div")].filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && getComputedStyle(e).position !== "fixed" && !e.closest("svg") && !e.querySelector("img, video")).map(e => e.tagName + ":" + (e.innerText || "").replace(/\s+/g, " ").slice(0, 50)).slice(0, 2) }));
  if (m.iw > Number(process.argv[3] || 390) || m.sw > Number(process.argv[3] || 390)) bad.push(url + " iw=" + m.iw + " sw=" + m.sw + " " + m.culprit.join(" | "));
  await pg.close();
}
console.log(bad.length ? bad.join("\n") : "no horizontal overflow");
await b.close();
