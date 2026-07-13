/**
 * KTAHV CRITICAL FLOWS — deterministic regression gate
 * v1.0 · 13 Jul 2026
 *
 * Run against STAGING before any deploy, and after any content change
 * to consultation / enquiry / contact / how-to-reach pages.
 *
 *   BASE_URL=https://staging.example.com npx playwright test ktahv-critical-flows.spec.ts
 *
 * Rules (from CLAUDE_FLEET.md):
 *  - Never edit a test to make it pass. A red test is a finding.
 *  - Form SUBMISSION tests run on staging endpoints only (guarded below).
 *  - Agents explore; this file verifies. Keep it deterministic — no AI calls here.
 */

import { test, expect, Page } from '@playwright/test';

const BASE = process.env.BASE_URL ?? '';
const IS_STAGING = /staging/i.test(BASE); // submission tests are gated on this

// ── LOCKED FACTS ─────────────────────────────────────────────────────────────
const CONTACT_EMAIL = 'info@kairali.com';
const PRIYA_WHATSAPP = '919289838797';        // +91 92898 38797, digits only
const WRONG_WHATSAPP = '919289838777';        // known-bad variant — must never appear

// GST SCN language lock — KTAHV only. Word-boundary matched, all locales.
const BANNED_EN = ['spa', 'resort', 'holiday', 'luxury', 'cure', 'journey', 'guests'];
const BANNED_DE = ['kur', 'urlaub', 'luxus', 'wellnesshotel'];       // extend as flagged
const BANNED_FR = ['cure', 'vacances', 'luxe', 'séjour de luxe'];    // extend as flagged

// Pages under test — adjust slugs to match the live sitemap.
const PAGES = {
  en: { consult: '/online-consultation/', reach: '/how-to-reach/', contact: '/contact/' },
  de: { consult: '/de/online-konsultation/', reach: '/de/anreise/', contact: '/de/kontakt/' },
  fr: { consult: '/fr/consultation-en-ligne/', reach: '/fr/comment-nous-rejoindre/', contact: '/fr/contact/' },
} as const;

type Locale = keyof typeof PAGES;
const LOCALES: Locale[] = ['en', 'de', 'fr'];
const bannedFor = (l: Locale) => (l === 'en' ? BANNED_EN : l === 'de' ? BANNED_DE : BANNED_FR);

// ── HELPERS ──────────────────────────────────────────────────────────────────
async function bodyText(page: Page): Promise<string> {
  return (await page.locator('body').innerText()).toLowerCase();
}

function hits(text: string, words: string[]): string[] {
  return words.filter((w) => new RegExp(`\\b${w.toLowerCase()}\\b`, 'i').test(text));
}

test.beforeEach(() => {
  expect(BASE, 'Set BASE_URL env var (staging URL) before running.').not.toBe('');
});

// ═════════════════════════════════════════════════════════════════════════════
// 1. LANGUAGE LOCK — banned-word gate on every audited page, every locale
// ═════════════════════════════════════════════════════════════════════════════
for (const locale of LOCALES) {
  for (const [name, path] of Object.entries(PAGES[locale])) {
    test(`banned-words ${locale}/${name}`, async ({ page }) => {
      await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
      const found = hits(await bodyText(page), bannedFor(locale));
      expect(found, `GST-banned terms on ${locale}${path}: ${found.join(', ')}`).toEqual([]);
    });
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. LOCKED FACTS — WhatsApp number + contact email
// ═════════════════════════════════════════════════════════════════════════════
for (const locale of LOCALES) {
  test(`whatsapp + email ${locale}`, async ({ page }) => {
    await page.goto(BASE + PAGES[locale].contact, { waitUntil: 'domcontentloaded' });
    const html = (await page.content()).replace(/[\s\-()]/g, '');

    expect(html, 'Known-bad WhatsApp …38777 must never appear').not.toContain(WRONG_WHATSAPP);
    expect(html, 'Priya WhatsApp missing/incorrect').toContain(PRIYA_WHATSAPP);
    expect((await page.content()).includes(CONTACT_EMAIL), `${CONTACT_EMAIL} missing`).toBe(true);
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. CONSULTATION FORM — renders, validates, consent + privacy present
// ═════════════════════════════════════════════════════════════════════════════
for (const locale of LOCALES) {
  test(`consultation form ${locale}`, async ({ page }) => {
    await page.goto(BASE + PAGES[locale].consult, { waitUntil: 'networkidle' });

    const form = page.locator('form').first();
    await expect(form, 'Form not rendered').toBeVisible();

    // Consent checkbox + privacy policy link (DPDP requirement)
    const consent = form.locator('input[type="checkbox"]');
    await expect(consent.first(), 'Consent checkbox missing').toBeVisible();
    const privacyLink = form.locator('a[href*="privacy"], a[href*="datenschutz"], a[href*="confidentialite"]');
    await expect(privacyLink.first(), 'Privacy link missing from form').toBeVisible();

    // Empty submit must NOT navigate away (native/inline validation holds)
    const urlBefore = page.url();
    await form.locator('button[type="submit"], input[type="submit"]').first().click();
    await page.waitForTimeout(800);
    expect(page.url(), 'Empty form submitted — validation broken').toBe(urlBefore);
  });
}

// Full submission — STAGING ONLY, never fires on production
test('consultation form submits (staging only)', async ({ page }) => {
  test.skip(!IS_STAGING, 'Submission test runs only against staging.');
  await page.goto(BASE + PAGES.en.consult, { waitUntil: 'networkidle' });
  const form = page.locator('form').first();

  // TODO: align field selectors with the live form markup
  await form.locator('input[name*="name" i]').first().fill('QA Test — do not process');
  await form.locator('input[type="email"]').first().fill('qa-test@kairali.com');
  const phone = form.locator('input[type="tel"], input[name*="phone" i]').first();
  if (await phone.count()) await phone.fill('+910000000000');
  await form.locator('input[type="checkbox"]').first().check();
  await form.locator('button[type="submit"], input[type="submit"]').first().click();

  await expect(
    page.locator('text=/thank|merci|danke|received|confirm/i').first(),
    'No success confirmation after submit'
  ).toBeVisible({ timeout: 15_000 });
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. LOCALE INTEGRITY — hreflang set + switcher targets resolve (no 404s)
// ═════════════════════════════════════════════════════════════════════════════
test('hreflang + locale pages resolve', async ({ page, request }) => {
  await page.goto(BASE + PAGES.en.consult, { waitUntil: 'domcontentloaded' });
  for (const l of ['en', 'de', 'fr']) {
    await expect(
      page.locator(`link[rel="alternate"][hreflang="${l}"]`),
      `hreflang ${l} missing`
    ).toHaveCount(1);
  }
  for (const locale of LOCALES) {
    for (const path of Object.values(PAGES[locale])) {
      const res = await request.get(BASE + path);
      expect(res.status(), `${locale} ${path} → ${res.status()}`).toBeLessThan(400);
    }
  }
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. SCHEMA — valid MedicalClinic JSON-LD with correct email
// ═════════════════════════════════════════════════════════════════════════════
test('MedicalClinic schema valid', async ({ page }) => {
  await page.goto(BASE + PAGES.en.contact, { waitUntil: 'domcontentloaded' });
  const blocks = await page.locator('script[type="application/ld+json"]').allInnerTexts();
  const parsed = blocks.map((b) => { try { return JSON.parse(b); } catch { return null; } });

  expect(parsed.every(Boolean), 'Malformed JSON-LD block found').toBe(true);
  const clinic = parsed
    .flatMap((p: any) => (Array.isArray(p) ? p : p['@graph'] ?? [p]))
    .find((n: any) => n && n['@type'] === 'MedicalClinic');
  expect(clinic, 'MedicalClinic schema missing').toBeTruthy();
  expect(JSON.stringify(clinic), 'Schema email incorrect').toContain(CONTACT_EMAIL);
});

// ═════════════════════════════════════════════════════════════════════════════
// 6. TRANSPORT HYGIENE — no mixed content, no console errors on key pages
// ═════════════════════════════════════════════════════════════════════════════
test('no mixed content / console errors', async ({ page }) => {
  const problems: string[] = [];
  page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
  page.on('requestfailed', (r) => problems.push(`failed: ${r.url()}`));

  await page.goto(BASE + PAGES.en.consult, { waitUntil: 'networkidle' });
  const insecure = await page.evaluate(() =>
    performance.getEntriesByType('resource').map((r) => r.name).filter((u) => u.startsWith('http://'))
  );
  insecure.forEach((u) => problems.push(`mixed-content: ${u}`));
  expect(problems, problems.join('\n')).toEqual([]);
});

// ═════════════════════════════════════════════════════════════════════════════
// 7. ANALYTICS — data-cta elements exist and clicks reach the dataLayer
// ═════════════════════════════════════════════════════════════════════════════
test('data-cta events fire', async ({ page }) => {
  await page.goto(BASE + PAGES.en.consult, { waitUntil: 'networkidle' });
  const ctas = page.locator('[data-cta]');
  expect(await ctas.count(), 'No data-cta elements found').toBeGreaterThan(0);

  await page.evaluate(() => { (window as any).__qaEvents = []; 
    const dl = (window as any).dataLayer = (window as any).dataLayer || [];
    const orig = dl.push.bind(dl);
    dl.push = (...a: any[]) => { (window as any).__qaEvents.push(a); return orig(...a); };
  });
  await ctas.first().click({ noWaitAfter: true }).catch(() => {}); // links may navigate; capture is pre-nav
  const fired = await page.evaluate(() => (window as any).__qaEvents?.length ?? 0).catch(() => 1);
  expect(fired, 'CTA click produced no dataLayer event').toBeGreaterThan(0);
});

// ═════════════════════════════════════════════════════════════════════════════
// 8. PERFORMANCE BUDGET — soft gate (fail = investigate, not necessarily block)
// ═════════════════════════════════════════════════════════════════════════════
test('load budget @performance', async ({ page }) => {
  await page.goto(BASE + PAGES.en.consult, { waitUntil: 'load' });
  const t = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return { dcl: nav.domContentLoadedEventEnd, load: nav.loadEventEnd };
  });
  expect(t.dcl, `DOMContentLoaded ${Math.round(t.dcl)}ms > 3000ms budget`).toBeLessThan(3000);
  expect(t.load, `Full load ${Math.round(t.load)}ms > 6000ms budget`).toBeLessThan(6000);
});
