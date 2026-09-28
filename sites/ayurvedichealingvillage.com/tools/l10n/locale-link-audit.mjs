// Read-only: render every page of a locale and classify each internal link against the route table
// (l10n/routes.json). BROKEN = a path under the locale prefix that is neither served nor redirected (a 404);
// LEAK = an English page that has an equivalent in this locale. Aliases/redirects and non-page assets are fine.
//   node tools/l10n/locale-link-audit.mjs --locale de [--base http://localhost:4471] [--concurrency 3] [--out file.json]
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const store = path.resolve("../../node_modules/.pnpm");
const pw = require(path.join(store, fs.readdirSync(store).find((d) => d.startsWith("playwright@")), "node_modules/playwright"));
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > -1 ? process.argv[i + 1] : d; };
const LOC = arg("locale", "de"), BASE = arg("base", "http://localhost:4471"), CONC = +arg("concurrency", "3"), OUT = arg("out", null);
const RJ = JSON.parse(fs.readFileSync("l10n/routes.json", "utf8"));
const EN_REDIRECTS = JSON.parse(fs.readFileSync("english-candidate/redirect-map.json", "utf8")).redirects;
const served = new Set(Object.values(RJ.routes).map((r) => r[LOC]).filter(Boolean));
const redirected = new Set(Object.keys(RJ.redirects));
const enToLoc = Object.fromEntries(Object.entries(RJ.routes).map(([en, r]) => [en, r[LOC]]));
const prefix = "/" + JSON.parse(fs.readFileSync("l10n/locales.json", "utf8"))[LOC].prefix + "/";
const norm = (p) => (/\.[a-z0-9]{2,5}$/i.test(p) ? p : p.replace(/\/?$/, "/"));
const pages = [...served];
let b = await pw.chromium.launch();
// shared machine: a renderer crash or a transient spawn EAGAIN relaunches the browser with backoff
const fresh = async () => {
  for (let tryN = 0; ; tryN++) {
    try { return await b.newContext({ viewport: { width: 1440, height: 900 } }); } catch (e) {
      if (tryN >= 6) throw e;
      try { await b.close(); } catch {}
      await new Promise((r) => setTimeout(r, 3000 * (tryN + 1)));
      try { b = await pw.chromium.launch(); } catch {}
    }
  }
};
const out = { locale: LOC, base: BASE, at: new Date().toISOString(), pages: pages.length, broken: {}, leaks: {} };
const q = [...pages];
const worker = async () => {
  let ctx = await fresh();
  for (let p = q.shift(); p; p = q.shift()) {
    let pg;
    // a crashed renderer takes its context with it: start a fresh context and retry the page once
    try { pg = await ctx.newPage(); } catch { try { await ctx.close(); } catch {} ctx = await fresh(); pg = await ctx.newPage(); }
    try {
      await pg.goto(BASE + p, { waitUntil: "load", timeout: 60000 }); await pg.waitForTimeout(2200);
      const hrefs = await pg.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => [a.getAttribute("href"), (a.innerText || a.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 50), a.hasAttribute("hreflang")]));
      for (const [h, text, hl] of hrefs) {
        if (hl) continue; // the language switcher links to other locales on purpose
        let u; try { u = new URL(h, BASE + p); } catch { continue; }
        if (!(u.origin === new URL(BASE).origin || /^(www\.)?ayurvedichealingvillage\.com$/.test(u.hostname))) continue;
        const path_ = norm(decodeURIComponent(u.pathname));
        if (/^\/(documents|ahv|_next|images|wp-content|api)\//.test(path_) || /\.(pdf|jpe?g|png|webp|mp4|xml|txt)$/i.test(path_)) continue;
        if (served.has(path_) || redirected.has(path_)) continue;
        const key = `${path_} ← "${text}"`;
        if (path_.startsWith(prefix)) (out.broken[key] = out.broken[key] || []).push(p);
        else if (enToLoc[path_] && enToLoc[path_] !== path_) (out.leaks[key] = out.leaks[key] || []).push(p);
        else if (EN_REDIRECTS[path_] && enToLoc[EN_REDIRECTS[path_].to]) (out.leaks[key + " (EN 301)"] = out.leaks[key + " (EN 301)"] || []).push(p);
      }
    } catch (e) { (out.broken["RENDER " + String(e).slice(0, 60)] = out.broken["RENDER " + String(e).slice(0, 60)] || []).push(p); }
    try { await pg.close(); } catch {}
  }
  try { await ctx.close(); } catch {}
};
await Promise.all(Array.from({ length: CONC }, worker));
await b.close();
const count = (o) => Object.values(o).reduce((s, v) => s + v.length, 0);
console.log(`${LOC}: ${out.pages} pages · broken link-instances ${count(out.broken)} (${Object.keys(out.broken).length} distinct) · leaks ${count(out.leaks)} (${Object.keys(out.leaks).length} distinct)`);
for (const [k, v] of Object.entries(out.broken).sort((a, c) => c[1].length - a[1].length).slice(0, 25)) console.log("  BROKEN", v.length, k, "e.g.", v[0]);
for (const [k, v] of Object.entries(out.leaks).sort((a, c) => c[1].length - a[1].length).slice(0, 15)) console.log("  LEAK  ", v.length, k, "e.g.", v[0]);
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
