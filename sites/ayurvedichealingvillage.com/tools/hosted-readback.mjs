// Hosted readback for the owner's acceptance points (EF-04a / EF-04 / EF-25), read-only.
// Against protected staging run it under `vc env run --` so the short-lived development OIDC token rides
// as the Trusted-Sources header (never printed or written):
//   vc env run -- node sites/ayurvedichealingvillage.com/tools/hosted-readback.mjs \
//     --base https://ahv-final-staging.vercel.app --out <evidence dir>
// Per page × viewport it records: the Yoga link labels in every header / menu / footer, family-header mode,
// cookie notice vs contact controls / header overlap on a FRESH visit (no stored consent), console errors,
// and a top-of-page screenshot (plus the opened phone menu on the homepage).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { attachStagingToken } from "./lib/staging-auth.mjs";

const require = createRequire(import.meta.url);
const store = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../node_modules/.pnpm");
const pw = require(path.join(store, fs.readdirSync(store).find((d) => d.startsWith("playwright@")), "node_modules/playwright"));
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://localhost:4471");
const OUT = arg("out", "/tmp/hosted-readback");
const PAGES = (arg("pages", "/,/legal-notice/,/all-programs/,/yoga-meditation-training/,/video-gallery/,/de/,/ar/legal-notice/")).split(",");
const VPS = [{ w: 1440, h: 900 }, { w: 390, h: 844 }];
fs.mkdirSync(OUT, { recursive: true });
const oidc = /^https:/.test(BASE) && process.env.VERCEL_OIDC_TOKEN ? { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN } : undefined;

const b = await pw.chromium.launch();
const rows = [];
for (const vp of VPS) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.w < 800, hasTouch: vp.w < 800 }); if (oidc) await attachStagingToken(ctx, BASE);
  for (const route of PAGES) {
    const p = await ctx.newPage();
    const errs = [];
    p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
    p.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 160)); });
    const row = { route, vp: `${vp.w}x${vp.h}` };
    try {
      const resp = await p.goto(BASE + route, { waitUntil: "load", timeout: 90000 });
      row.status = resp.status();
      row.protectionPage = /vercel\.com\/(login|sso)|Deployment Protection/i.test(await p.title()) || /_vercel_sso|vercel-auth/i.test(p.url());
      await p.waitForTimeout(3500);
      row.data = await p.evaluate(() => {
        const yoga = (sel) => [...document.querySelectorAll(sel)].flatMap((n) => [...n.querySelectorAll('a[href*="yoga-meditation-training"]')]).map((a) => ({ text: a.innerText.replace(/\s+/g, " ").trim(), visible: a.getClientRects().length > 0 && getComputedStyle(a).visibility !== "hidden" }));
        const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return cs.display === "none" || cs.visibility === "hidden" || !r.width || !r.height ? null : { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right) }; };
        const overlap = (a, c) => !!(a && c && a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom);
        const consent = rect(document.getElementById("ahv-consent"));
        const contacts = rect(document.getElementById("ahv-contact-controls"));
        const sticky = rect(document.querySelector("[data-ahv-fh-sticky]") || document.querySelector("header"));
        return {
          lang: document.documentElement.lang, dir: document.documentElement.dir,
          familyMode: document.documentElement.getAttribute("data-ahv-fh"),
          robots: (document.querySelector('meta[name="robots"]') || {}).content || null,
          yogaInHeaders: yoga("header"), yogaInMenus: yoga("[data-ahv-drawer], [data-ahv-sc-panel], dialog, .ahv-fh-panel"), yogaInFooters: yoga("footer"),
          longYogaLabelAnywhereInChrome: /Dhyāna|Abhyāsa/.test([...document.querySelectorAll("header, footer, [data-ahv-drawer], [data-ahv-sc-panel]")].map((n) => n.textContent).join(" ")),
          consentVisible: !!consent, consentOverlapsContacts: overlap(consent, contacts), consentOverlapsHeader: overlap(consent, sticky),
        };
      });
      const slug = route.replace(/[\/?=]+/g, "_").replace(/^_|_$/g, "") || "home";
      await p.screenshot({ path: path.join(OUT, `${slug}-${vp.w}.png`) });
      if (route === "/" && vp.w < 800) {
        const burger = p.locator("header button").filter({ has: p.locator("span") }).last();
        if (await burger.count()) { await burger.click().catch(() => {}); await p.waitForTimeout(700); await p.screenshot({ path: path.join(OUT, `home-${vp.w}-menu-open.png`) }); }
      }
    } catch (e) { row.error = String(e).slice(0, 200); }
    row.errors = errs;
    rows.push(row);
    console.log(JSON.stringify({ route: row.route, vp: row.vp, status: row.status, protection: row.protectionPage, fam: row.data && row.data.familyMode, yogaHeader: row.data && row.data.yogaInHeaders.filter((y) => y.visible).map((y) => y.text), long: row.data && row.data.longYogaLabelAnywhereInChrome, consent: row.data && [row.data.consentVisible, row.data.consentOverlapsContacts, row.data.consentOverlapsHeader], errors: errs.length, err: row.error }));
    await p.close();
  }
  await ctx.close();
}
await b.close();
fs.writeFileSync(path.join(OUT, "readback.json"), JSON.stringify({ base: BASE, at: new Date().toISOString(), rows }, null, 1));
