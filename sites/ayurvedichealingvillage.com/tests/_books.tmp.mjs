import { chromium } from "@playwright/test";
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } }); const p = await ctx.newPage();
await p.goto("http://localhost:4321/books/", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
const d = await p.evaluate(() => { const nav = [...document.querySelectorAll("#ahv-design-root main nav")].find(n => n.querySelectorAll("a").length >= 3 && n.getAttribute("aria-label") !== "Breadcrumb"); const out = []; for (const a of nav.querySelectorAll("a")) { const r = a.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + 20, r.top + r.height / 2); const hitA = hit && hit.closest("a"); out.push(`${a.textContent.trim().slice(0, 22).padEnd(22)} y=${Math.round(r.top)} h=${Math.round(r.height)} hit→${hitA ? hitA.textContent.trim().slice(0, 22) : (hit && hit.tagName)}`); } const open = nav.outerHTML.slice(0, 900); return { out, open, navParent: nav.parentElement.outerHTML.slice(0, 300) }; });
console.log(d.out.join("\n")); console.log("\nNAV:", d.open.replace(/\s+/g, " ")); console.log("\nPARENT:", d.navParent.replace(/\s+/g, " "));
await b.close();
