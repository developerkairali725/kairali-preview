// Evidence screenshots for launches/kairaliyoga.com/screens/ — run from the
// WORKTREE ROOT: node scripts/evidence-kairaliyoga.mjs
// Shots: desktop 1440 full · mobile 375 full · mobile first-paint WITH the
// consent banner · focus-ring settled-state read · og.jpg 1200×630 with
// consent pre-seeded (no banner baked into the share card).
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:4317";
const OUT = "launches/kairaliyoga.com/screens";
mkdirSync(OUT, { recursive: true });

const CONSENT_SEED = () =>
  localStorage.setItem(
    "kairali-consent-v1",
    JSON.stringify({ v: 1, granted: false, consent: {}, at: "2026-07-16T00:00:00Z" }),
  );

const browser = await chromium.launch();

/** Scroll through the page so loading="lazy" images actually load, then
 *  return to top and wait for every <img> to be complete. */
async function loadAllImages(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() =>
    Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
  );
  await page.waitForTimeout(300);
}

// ---------- 1. Desktop 1440 full page (consent pre-seeded: content evidence)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(CONSENT_SEED);
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(600); // hero fade settles (400ms) before the read
  await loadAllImages(page);
  await page.screenshot({ path: `${OUT}/home-desktop-1440-full.png`, fullPage: true });
  await ctx.close();
  console.log("desktop full OK");
}

// ---------- 2. Mobile 375 full page (consent pre-seeded)
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  await ctx.addInitScript(CONSENT_SEED);
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await loadAllImages(page);
  await page.screenshot({ path: `${OUT}/home-mobile-375-full.png`, fullPage: true });
  await ctx.close();
  console.log("mobile full OK");
}

// ---------- 3. Mobile FIRST PAINT with the consent banner (no seed)
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  // machine-check: h1 + primary CTA must not be 100% hidden behind the banner
  const check = await page.evaluate(() => {
    const banner = document.querySelector("[data-consent-banner]");
    const bannerTop = banner ? banner.getBoundingClientRect().top : Infinity;
    const h1 = document.querySelector("h1").getBoundingClientRect();
    const cta = document.querySelector('[data-cta="hero_enquire"]').getBoundingClientRect();
    return {
      bannerTop,
      h1Bottom: h1.bottom,
      ctaBottom: cta.bottom,
      h1Clear: h1.bottom < bannerTop,
      ctaClear: cta.bottom < bannerTop,
    };
  });
  console.log("first-paint check:", JSON.stringify(check));
  if (!check.h1Clear || !check.ctaClear) {
    console.error("FIRST-PAINT FAIL: critical content hidden behind the consent banner");
    process.exitCode = 1;
  }
  await page.screenshot({ path: `${OUT}/home-mobile-375-first-paint-banner.png` });
  await ctx.close();
}

// ---------- 4. Focus ring — SETTLED state (rings transition via box-shadow)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(CONSENT_SEED);
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  // Tab to the first selector door (wordmark → hero ctas → doors)
  const door = page.locator('[data-cta="door_practice"]');
  await door.focus();
  await page.waitForTimeout(500); // let the box-shadow transition SETTLE
  const ring = await page.evaluate(() => {
    const el = document.querySelector('[data-cta="door_practice"]');
    el.focus();
    const cs = getComputedStyle(el);
    return { boxShadow: cs.boxShadow.slice(0, 120), focused: document.activeElement === el };
  });
  console.log("focus ring (settled):", JSON.stringify(ring));
  await page.waitForTimeout(450);
  await door.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/focus-ring-door-settled.png` });
  // and the FAQ summary ring
  const summary = page.locator(".faq-list summary").first();
  await summary.focus();
  await page.waitForTimeout(450);
  await summary.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/focus-ring-faq-summary-settled.png` });
  await ctx.close();
}

// ---------- 5. og.jpg 1200×630 — consent PRE-SEEDED, banner must be absent
{
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 } });
  await ctx.addInitScript(CONSENT_SEED);
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(700); // fade fully settled
  const bannerOpen = await page.evaluate(() => !!document.querySelector("[data-consent-banner]"));
  console.log("og shot banner present:", bannerOpen);
  if (bannerOpen) {
    console.error("OG FAIL: consent banner visible in the share card");
    process.exitCode = 1;
  }
  await page.screenshot({
    path: "sites/kairaliyoga.com/public/og.jpg",
    type: "jpeg",
    quality: 88,
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  console.log("og.jpg OK");
  await ctx.close();
}

await browser.close();
