// Rounded-corner audit in Chromium AND WebKit (Safari engine), desktop + mobile; includes native-control rendering.
import { chromium, webkit } from "playwright";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const BASE = process.env.BASE || "http://127.0.0.1:8774";
const OUT = fileURLToPath(new URL("../../evidence/rounded-audit/", import.meta.url));
fs.mkdirSync(OUT, { recursive: true });
const routes = ["/villa-raag.aspx", "/kairali-group-profile.aspx", "/ayurvedic-healing-village.aspx", "/ayurveda-treatments.aspx", "/enquiry-form.aspx", "/download-centre.aspx", "/kairali-group-awards.aspx", "/ayurvedic-hospitality-photo-library.aspx", "/ayurvedic-hospitality-video-library.aspx", "/"];
const report = [];
for (const [name, engine] of [["chromium", chromium], ["webkit", webkit]]) {
  const br = await engine.launch();
  for (const [vp, o] of [["desktop", { viewport: { width: 1440, height: 900 } }], ["mobile", { viewport: { width: 390, height: 844 }, isMobile: name === "chromium", hasTouch: true }]]) {
    const ctx = await br.newContext(o);
    const p = await ctx.newPage();
    for (const r of routes) {
      await p.goto(BASE + r, { waitUntil: "networkidle" });
      const res = await p.evaluate(() => {
        const round = [], imgs = [], css = [...document.styleSheets].map((s) => s.href).filter(Boolean);
        for (const el of document.querySelectorAll("body *")) {
          if (!el.getClientRects().length) continue;
          const cs = getComputedStyle(el);
          const r = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"].map((k) => cs[k]);
          if (r.some((v) => parseFloat(v) > 0) && !el.matches('input[type="radio"]')) round.push(`${el.tagName}.${String(el.className).slice(0, 30)} ${r.join("/")}`);
          if (cs.clipPath && cs.clipPath !== "none") round.push(`${el.tagName} clip-path ${cs.clipPath}`);
          if (cs.maskImage && cs.maskImage !== "none") round.push(`${el.tagName} mask ${cs.maskImage.slice(0, 40)}`);
          if (cs.appearance && cs.appearance !== "none" && ["SELECT", "INPUT", "BUTTON", "TEXTAREA"].includes(el.tagName) && !["radio", "checkbox"].includes(el.type)) round.push(`${el.tagName}[${el.type}] appearance:${cs.appearance}`);
        }
        for (const i of document.querySelectorAll("main img")) if (i.getClientRects().length && i.naturalWidth) imgs.push(i.currentSrc || i.src);
        return { round, imgs, css };
      });
      report.push({ engine: name, vp, route: r, rounded: res.round.length, sample: res.round.slice(0, 6), css: res.css });
      if (["/villa-raag.aspx", "/kairali-group-profile.aspx"].includes(r)) await p.screenshot({ path: `${OUT}${r.slice(1).replace(/\W+/g, "_")}__${name}__${vp}.png`, fullPage: false });
      if (name === "chromium" && vp === "desktop") report.push({ images: res.imgs, route: r });
    }
    await ctx.close();
  }
  await br.close();
}
fs.writeFileSync(OUT + "computed.json", JSON.stringify(report, null, 1));
for (const x of report) if (x.engine) console.log(x.engine, x.vp, x.route, x.rounded, x.sample.join(" | "));
