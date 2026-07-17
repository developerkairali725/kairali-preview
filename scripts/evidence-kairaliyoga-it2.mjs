// Iteration-2 evidence + machine checks for launches/kairaliyoga.com/screens/
// (design review it.1 fix pass) — run from the WORKTREE ROOT against a
// production build served on :4317:  node scripts/evidence-kairaliyoga-it2.mjs
//
// Machine-verifies the it.2 acceptance tests:
//   1. IAST law: Kurale display spans carry NO combining/precomposed macrons
//      (U+0100–017F); the exact IAST spellings render in the Lato/Asap
//      support faces (.programme-iast sublines + goal-rail hints).
//   2. Image economics: total image transfer at 375×812 ≤1.2MB (DPR 3,
//      touch, Android UA — the it.1 critic's own methodology; was 3,066KB),
//      hero request ≤220KB at mobile width. DPR-1 figure logged too.
//   3. First-paint law at 375×812 WITH the consent banner: h1, primary CTA,
//      the goal question and the ENTIRE first rail row clear the banner.
//   4. Focus ring settled-state (≥550ms after real Tab) on the new rail rows.
//   5. Legal pages: per-page canonical + own description, noindex,follow.
//   6. og.jpg re-shot (consent pre-seeded — hero-adjacent composition
//      changed when the rail replaced the overlapping doors).
import { chromium, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:4317";
const OUT = "launches/kairaliyoga.com/screens";
mkdirSync(OUT, { recursive: true });

const CONSENT_SEED = () =>
  localStorage.setItem(
    "kairali-consent-v1",
    JSON.stringify({ v: 1, granted: false, consent: {}, at: "2026-07-16T00:00:00Z" }),
  );

const IAST = {
  dhyana: "Dhyāna-Yoga Shibiram",
  agni: "Agni Dīpanam Yoga Chikitsa",
  prana: "Prāna Sāmya Yoga Chikitsa",
};
const ROMANIZED = {
  dhyana: "Dhyana-Yoga Shibiram",
  agni: "Agni Dipanam Yoga Chikitsa",
  prana: "Prana Samya Yoga Chikitsa",
};

let failures = 0;
const check = (ok, label, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
};

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

const browser = await chromium.launch();

// ---------- 1. Image transfer accounting at 375 — DPR 3 (critic methodology)
async function measureImages(dpr) {
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: dpr,
    isMobile: true,
    hasTouch: true,
    userAgent: devices["Pixel 7"].userAgent,
  });
  await ctx.addInitScript(CONSENT_SEED);
  const page = await ctx.newPage();
  const images = [];
  page.on("response", async (r) => {
    if (/\.(jpe?g|png|webp|avif|svg)(\?|$)/i.test(r.url())) {
      try {
        const body = await r.body();
        images.push({ url: r.url().replace(BASE, ""), kb: Math.round(body.byteLength / 1024) });
      } catch {}
    }
  });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200); // let lazy-margin fetches land
  const total = images.reduce((s, i) => s + i.kb, 0);
  const hero = images.find((i) => i.url.includes("round-stone-cottages-dawn"));
  console.log(`\nimage requests at 375×812 DPR ${dpr}:`);
  for (const i of images) console.log(`  ${i.kb} KB  ${i.url}`);
  console.log(`  TOTAL ${total} KB (${images.length} requests)`);
  await ctx.close();
  return { total, hero, count: images.length };
}
{
  const dpr3 = await measureImages(3);
  check(dpr3.total <= 1200, `image transfer 375 DPR3 ≤1200KB`, `${dpr3.total}KB across ${dpr3.count} requests (was 3,066KB)`);
  check(!!dpr3.hero && dpr3.hero.kb <= 220, `hero request ≤220KB at mobile width (DPR3)`, dpr3.hero ? `${dpr3.hero.kb}KB ${dpr3.hero.url}` : "hero request missing");
  const dpr1 = await measureImages(1);
  check(dpr1.total <= 1200, `image transfer 375 DPR1 ≤1200KB`, `${dpr1.total}KB`);
  check(!!dpr1.hero && dpr1.hero.kb <= 220, `hero request ≤220KB at mobile width (DPR1)`, dpr1.hero ? `${dpr1.hero.kb}KB ${dpr1.hero.url}` : "hero request missing");
}

// ---------- 2. IAST law: romanized Kurale display, exact IAST in support faces
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 3 });
  await ctx.addInitScript(CONSENT_SEED);
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  const audit = await page.evaluate(() => {
    const macron = /[Ā-ſ̀-ͯ]/;
    const read = (sel) =>
      Array.from(document.querySelectorAll(sel)).map((el) => ({
        text: el.textContent.trim(),
        font: getComputedStyle(el).fontFamily,
        hasMacron: macron.test(el.textContent),
      }));
    return {
      display: read(".programme-sanskrit"),
      iast: read(".programme-iast"),
      hints: read(".path-hint"),
    };
  });
  check(
    audit.display.length === 3 && audit.display.every((d) => !d.hasMacron && /Kurale/i.test(d.font)),
    "Kurale display h3 ×3: romanized (zero U+0100–017F), face = Kurale",
    audit.display.map((d) => `"${d.text}"`).join(" · "),
  );
  const iastTexts = audit.iast.map((d) => d.text);
  check(
    audit.iast.length === 3 &&
      Object.values(IAST).every((s) => iastTexts.includes(s)) &&
      audit.iast.every((d) => d.hasMacron && /Lato/i.test(d.font)),
    "IAST sublines ×3: reckoner-exact spellings, face = Lato",
    iastTexts.map((t) => `"${t}"`).join(" · "),
  );
  const hintText = audit.hints.map((h) => h.text).join(" | ");
  check(
    audit.hints.some((h) => h.text === IAST.dhyana && /Asap/i.test(h.font)) &&
      audit.hints.some((h) => h.hasMacron && h.text.includes("Dīpanam") && h.text.includes("Sāmya")),
    "goal-rail hints carry IAST in Asap (incl. the bound chikitsa pair)",
    hintText,
  );
  const html = await page.content();
  check(
    Object.values(ROMANIZED).every((s) => html.includes(s)) && Object.values(IAST).every((s) => html.includes(s)),
    "rendered HTML carries BOTH string sets (romanized display + exact IAST)",
  );
  // evidence: the three programme names at DPR 3 + the rail
  for (const id of ["dhyana", "agni", "prana"]) {
    const el = page.locator(`#${id}`);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await el.screenshot({ path: `${OUT}/it2-sanskrit-${id}.png` });
  }
  const rail = page.locator(".paths-rail");
  await rail.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await page.locator(".paths").screenshot({ path: `${OUT}/it2-goal-rail-desktop.png` });
  await ctx.close();
}

// ---------- 3. First-paint law at 375×812 WITH the consent banner
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const fp = await page.evaluate(() => {
    const banner = document.querySelector("[data-consent-banner]");
    const bannerTop = banner ? banner.getBoundingClientRect().top : Infinity;
    const b = (sel) => document.querySelector(sel)?.getBoundingClientRect().bottom ?? Infinity;
    return {
      bannerTop,
      h1: b("h1"),
      cta: b('[data-cta="hero_enquire"]'),
      question: b(".paths-question"),
      firstRow: b('[data-cta="goal_deepen"]'),
      overflow: document.documentElement.scrollWidth,
    };
  });
  console.log("first-paint:", JSON.stringify(fp));
  check(fp.h1 < fp.bannerTop && fp.cta < fp.bannerTop, "first-paint law: h1 + primary CTA clear the banner", `h1 ${fp.h1.toFixed(1)} · cta ${fp.cta.toFixed(1)} vs banner ${fp.bannerTop.toFixed(1)}`);
  check(fp.question < fp.bannerTop && fp.firstRow < fp.bannerTop, "first-paint parity: question + ENTIRE first rail row clear the banner", `question ${fp.question.toFixed(1)} · row ${fp.firstRow.toFixed(1)} vs banner ${fp.bannerTop.toFixed(1)}`);
  check(fp.overflow === 375, "no horizontal overflow at 375", `scrollWidth ${fp.overflow}`);
  await page.screenshot({ path: `${OUT}/it2-mobile-375-firstpaint-consent.png` });
  await ctx.close();
}

// ---------- 4. Focus ring — SETTLED state on the new rail rows
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(CONSENT_SEED);
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  // real Tab walk: wordmark → hero primary → hero ghost → first rail row
  for (let i = 0; i < 4; i++) await page.keyboard.press("Tab");
  await page.waitForTimeout(600); // settle past the box-shadow transition
  const ring = await page.evaluate(() => {
    const el = document.activeElement;
    return {
      cta: el?.getAttribute("data-cta"),
      boxShadow: getComputedStyle(el).boxShadow.slice(0, 140),
    };
  });
  console.log("rail focus (settled):", JSON.stringify(ring));
  // ring law: a painted 3px spread in a color function (Chromium serializes
  // the token's color-mix as color(srgb …), not rgba())
  const ringPaints = (s) => /(rgba?|color)\(/.test(s) && /0px 0px 0px 3px/.test(s);
  check(ring.cta === "goal_deepen" && ringPaints(ring.boxShadow), "settled focus ring paints on the rail row (real Tab)", ring.boxShadow);
  await page.locator(".paths-rail").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.locator(".paths").screenshot({ path: `${OUT}/it2-focus-rail-settled.png` });
  // FAQ summary ring still healthy after the two-column change
  const summary = page.locator(".faq-list summary").first();
  await summary.focus();
  await page.waitForTimeout(600);
  const faqRing = await page.evaluate(() => getComputedStyle(document.activeElement).boxShadow.slice(0, 140));
  check(ringPaints(faqRing), "settled focus ring paints on FAQ summary", faqRing);
  await ctx.close();
}

// ---------- 5. Legal pages: per-page canonical + description, noindex,follow
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  for (const path of ["/privacy", "/terms", "/cookie-policy"]) {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    const meta = await page.evaluate(() => ({
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      robots: document.querySelector('meta[name="robots"]')?.content,
      description: document.querySelector('meta[name="description"]')?.content,
    }));
    check(meta.canonical === `https://kairaliyoga.com${path}`, `${path} canonical is its own`, meta.canonical);
    check(/noindex/.test(meta.robots ?? "") && /follow/.test(meta.robots ?? "") && !/nofollow/.test(meta.robots ?? ""), `${path} robots noindex,follow`, meta.robots);
    check(!!meta.description && meta.description.length <= 155 && !meta.description.startsWith("Private sunrise yoga"), `${path} own description ≤155`, `${meta.description?.length} chars`);
  }
  await ctx.close();
}

// ---------- 6. Content evidence set (desktop + mobile fulls, sections)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(CONSENT_SEED);
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await loadAllImages(page);
  await page.screenshot({ path: `${OUT}/it2-desktop-1440-full.png`, fullPage: true });
  const shoot = async (sel, name) => {
    const el = page.locator(sel);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await el.screenshot({ path: `${OUT}/${name}` });
  };
  await shoot(".timeline li:nth-child(3)", "it2-timeline-midday-therapy.png");
  await shoot(".timeline li:nth-child(4)", "it2-timeline-mealtimes.png");
  await shoot(".timeline li:nth-child(2)", "it2-timeline-morning-checkin.png");
  await shoot("#voices .container", "it2-guestbook-desktop.png");
  await page.locator(".faq-list details").first().click();
  await page.waitForTimeout(300);
  await shoot("#faq .container", "it2-faq-two-col-open.png");
  await shoot("#enquire .container", "it2-ladder-kurale-words.png");
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  await ctx.addInitScript(CONSENT_SEED);
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await loadAllImages(page);
  await page.screenshot({ path: `${OUT}/it2-mobile-375-full.png`, fullPage: true });
  await ctx.close();
}

// ---------- 7. og.jpg re-shoot — consent PRE-SEEDED, banner must be absent
{
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 } });
  await ctx.addInitScript(CONSENT_SEED);
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const bannerOpen = await page.evaluate(() => !!document.querySelector("[data-consent-banner]"));
  check(!bannerOpen, "og shot: consent banner absent");
  await page.screenshot({
    path: "sites/kairaliyoga.com/public/og.jpg",
    type: "jpeg",
    quality: 88,
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  console.log("og.jpg re-shot (hero-adjacent composition changed in it.2)");
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? "\nALL MACHINE CHECKS PASS" : `\n${failures} CHECK(S) FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
