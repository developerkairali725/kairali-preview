/** Read-only: render a page and list every link inside <main> (text, href, HTTP status of internal targets, clickable size).
 *   node tools/links-probe.mjs <base> <path> [width] */
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module";
const require_ = createRequire(import.meta.url);
let dir = process.cwd(), store; for (let i = 0; i < 6 && !store; i++) { const s = path.join(dir, "node_modules", ".pnpm"); if (fs.existsSync(s)) store = s; dir = path.dirname(dir); }
const { chromium } = require_(path.join(store, fs.readdirSync(store).find((d) => d.startsWith("playwright@")), "node_modules", "playwright"));
const [,, base, route, w = "1440"] = process.argv;
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: +w, height: 900 } })).newPage();
await p.goto(base + route, { waitUntil: "load" }); await p.waitForTimeout(3000);
const links = await p.evaluate(() => [...document.querySelectorAll("main a[href], #ahv-design-root main a[href]")].map((a) => { const r = a.getBoundingClientRect(); return { text: (a.innerText || a.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 90), href: a.getAttribute("href"), w: Math.round(r.width), h: Math.round(r.height) }; }));
const imgs = await p.evaluate(() => [...document.querySelectorAll("main img")].map((i) => ({ src: i.currentSrc || i.src, alt: i.alt, nw: i.naturalWidth, w: Math.round(i.getBoundingClientRect().width), h: Math.round(i.getBoundingClientRect().height), broken: i.complete && i.naturalWidth === 0 })));
const seen = new Map();
for (const l of links) {
  let u; try { u = new URL(l.href, base + route); } catch { l.status = "bad-url"; continue; }
  const internal = /ayurvedichealingvillage\.com$/.test(u.hostname) || u.origin === new URL(base).origin;
  if (!internal || !/^https?:/.test(u.protocol)) { l.status = "external"; continue; }
  const local = base + u.pathname + u.search;
  if (!seen.has(local)) { try { const r = await fetch(local, { redirect: "manual" }); seen.set(local, r.status + (r.headers.get("location") ? "→" + r.headers.get("location") : "")); } catch (e) { seen.set(local, "ERR"); } }
  l.status = seen.get(local);
}
console.log(JSON.stringify({ route, links, imgs }, null, 1));
await b.close();
