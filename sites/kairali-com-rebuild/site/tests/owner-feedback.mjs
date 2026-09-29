// Owner feedback checks (29 Sep 2026): square edges, natural casing, mobile section navigation.
import { chromium } from "playwright";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const BASE = process.env.BASE || "http://127.0.0.1:8774";
const OUT = fileURLToPath(new URL("../../evidence/", import.meta.url));
const SHOTS = OUT + "screens/square-edges/";
const ACR = new Set("NABH ISO INR USD EUR EURO PDF CSR FICCI AYUSH KTAHV KAPPL BAMS MD CEO JMD DLX SUP JUN XML FAQS FAQ PPTX APAI SATA PATWA MICE ITB APSWC ITM SDF IFCCI ICUNR AEPTA BHU WHO XEL II III IV UK USA UAE TV PM AM".split(" "));
const results = []; const check = (n, ok, d = "") => { results.push({ name: n, ok: !!ok, detail: d }); console.log(`${ok ? "PASS" : "FAIL"} ${n}${d ? " — " + d : ""}`); };
const b = await chromium.launch();
const routes = ["/", "/villa-raag.aspx", "/sitemap.aspx", "/download-centre.aspx", "/kairali-group-awards.aspx", "/testimonials.aspx", "/svata-katerina-prague-czech-republic.aspx",
  "/detail.aspx?page=kairali-the-ayurvedic-healing-village-nominated-for-best-spa-and-wellness-resort-south", "/ayurveda-treatments.aspx", "/search-results.aspx?q=nabh"];
for (const [vp, w] of [["desktop", 1440], ["mobile", 390], ["mobile-360", 360]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 860 } });
  const p = await ctx.newPage();
  for (const r of routes) {
    await p.goto(BASE + r, { waitUntil: "networkidle" });
    await p.waitForTimeout(150);
    const a = await p.evaluate((acr) => {
      const ACR = new Set(acr);
      const upperCss = [], caps = [], rounded = [];
      for (const el of document.querySelectorAll("body *")) {
        if (!el.getClientRects().length) continue;
        const cs = getComputedStyle(el);
        if (cs.textTransform === "uppercase" && el.textContent.trim()) upperCss.push(el.tagName + "." + el.className);
        if (!el.matches('input[type="radio"], input[type="checkbox"], svg, svg *') && ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"].some((k) => parseFloat(cs[k]) > 0)) rounded.push(el.tagName + "." + el.className);
      }
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const t = n.textContent.trim();
        const letters = t.replace(/[^A-Za-z]/g, "");
        if (letters.length < 4 || letters !== letters.toUpperCase()) continue;
        if (n.parentElement.closest("script,style,.sr-only")) continue;
        const words = t.match(/[A-Za-z][A-Za-z'.]*/g) || [];
        if (words.every((x) => ACR.has(x.replace(/[.']/g, "").toUpperCase()))) continue;
        caps.push(t.slice(0, 60));
      }
      return { upperCss: upperCss.length, caps, rounded: rounded.length, overflow: document.documentElement.scrollWidth - innerWidth };
    }, [...ACR]);
    check(`${vp} ${r}: no uppercase CSS`, a.upperCss === 0, String(a.upperCss));
    check(`${vp} ${r}: no ALL-CAPS display text`, a.caps.length === 0, a.caps.slice(0, 3).join(" | "));
    check(`${vp} ${r}: no rounded corners`, a.rounded === 0, String(a.rounded));
    check(`${vp} ${r}: no horizontal overflow`, a.overflow <= 0, `${a.overflow}px`);
  }
  // Section navigation placement + anchors (shared rail layout)
  for (const r of ["/villa-raag.aspx", "/ayurveda-treatments.aspx", "/ayurvedic-medicine.aspx", "/partnerships-and-investment.aspx", "/ayurvedic-healing-village.aspx", "/locations.aspx"]) {
    await p.goto(BASE + r, { waitUntil: "networkidle" });
    const pos = await p.evaluate((mobile) => {
      const art = document.querySelector(".article article");
      const nav = mobile ? document.querySelector(".toc-mobile") : document.querySelector(".rail .toc");
      if (!art || !nav) return { missing: true };
      const artTop = art.getBoundingClientRect().top + scrollY, navTop = nav.getBoundingClientRect().top + scrollY;
      const desktopRailVisible = getComputedStyle(document.querySelector(".rail .toc")).display !== "none";
      const mobileTocVisible = getComputedStyle(document.querySelector(".toc-mobile")).display !== "none";
      return { artTop: Math.round(artTop), navTop: Math.round(navTop), desktopRailVisible, mobileTocVisible, dividers: document.querySelectorAll(".article article .divider").length };
    }, w < 1100);
    if (w < 1100) check(`${vp} ${r}: section nav is before the content`, !pos.missing && pos.navTop < pos.artTop && pos.mobileTocVisible && !pos.desktopRailVisible, JSON.stringify(pos));
    else check(`${vp} ${r}: desktop rail beside content, mobile toc hidden`, !pos.missing && pos.desktopRailVisible && !pos.mobileTocVisible, JSON.stringify(pos));
    if (w < 1100) {
      await p.click(".toc-mobile summary");
      const link = p.locator(".toc-mobile a").nth(1);
      const id = (await link.getAttribute("href")).slice(1);
      await link.click(); await p.waitForTimeout(400);
      const top = await p.evaluate((id) => { const h = document.getElementById(id); const hdr = document.querySelector(".site-header").getBoundingClientRect().bottom; return { top: Math.round(h.getBoundingClientRect().top), header: Math.round(hdr) }; }, id);
      check(`${vp} ${r}: anchor target clears sticky header`, top.top >= top.header && top.top < 300, JSON.stringify(top));
      if (r === "/villa-raag.aspx") await p.screenshot({ path: `${SHOTS}villa-raag-section-nav__${vp}.png` });
    }
  }
  if (vp !== "mobile-360") {
    await p.goto(BASE + "/sitemap.aspx", { waitUntil: "networkidle" });
    await p.screenshot({ path: `${SHOTS}sitemap__${vp}.png`, fullPage: true });
  }
  await ctx.close();
}
await b.close();
fs.writeFileSync(OUT + "owner-feedback-report.json", JSON.stringify(results, null, 1));
console.log(`\n${results.filter((r) => r.ok).length}/${results.length} passed`);
