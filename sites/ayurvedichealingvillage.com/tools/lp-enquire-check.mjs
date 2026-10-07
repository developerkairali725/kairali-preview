#!/usr/bin/env node
// lp-enquire-check — at 390px, in Chromium AND WebKit (Safari has no scroll anchoring), every "Get free doctor
// consultation" jump lands on the enquiry form: the #enquiry heading must be inside the viewport after the click.
//
//   node tools/lp-enquire-check.mjs --base http://localhost:3400 [--slug panchakarma] [--variants A,B,C,D]
//
// Clicks the hero CTA (the hero's own link, or the hero card's submit on B/C/D phones) and the sticky mobile bar's consult CTA (the header has only call/WhatsApp links, no #enquiry
// link). Install the engines once with `pnpm exec playwright install chromium webkit`. Exit 1 on any miss.
import { chromium, webkit } from "@playwright/test";

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://localhost:3400").replace(/\/$/, "");
const SLUG = arg("slug", "panchakarma");
const VARIANTS = arg("variants", "A,B,C,D").split(",");
const CTAS = [
  ["hero CTA", ".lp-hero__cta:visible, .lp-hero .lp-consult__submit:visible", 0],
  ["mobile bar CTA", ".lp-bar__consult", 900],
];

let fail = 0;
for (const [name, engine] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await engine.launch();
  for (const v of VARIANTS) {
    for (const [label, sel, scrollY] of CTAS) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
      await page.goto(`${BASE}/lp-v2/${SLUG}/${v.toLowerCase()}/`, { waitUntil: "load" });
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(400);
      const cta = page.locator(sel).first();
      let note;
      if (!(await cta.isVisible())) note = label === "hero CTA" ? "skip (no hero CTA on this phone layout; the sticky bar carries it)" : "CTA not visible";
      else {
        await cta.click();
        await page.waitForTimeout(2500); // smooth scroll + any layout settling
        const r = await page.evaluate(() => {
          const h = document.getElementById("lp-enq-h")?.getBoundingClientRect();
          const f = document.getElementById("enquiry")?.getBoundingClientRect();
          return h && f ? { top: Math.round(h.top), bottom: Math.round(h.bottom), formTop: Math.round(f.top), vh: innerHeight } : null;
        });
        if (!r) note = "#enquiry heading missing";
        else if (!(r.top >= 0 && r.bottom <= r.vh)) note = `heading not in viewport (top ${r.top}, bottom ${r.bottom}, vh ${r.vh})`;
        else note = `ok (heading top ${r.top}px, section top ${r.formTop}px)`;
      }
      const ok = note.startsWith("ok") || note.startsWith("skip");
      if (!ok) fail++;
      console.log(`${note.startsWith("skip") ? "SKIP" : ok ? "PASS" : "FAIL"}  ${name.padEnd(8)} ${v} ${label.padEnd(15)} ${note}`);
      await page.close();
    }
  }
  await browser.close();
}
process.exit(fail ? 1 : 0);
