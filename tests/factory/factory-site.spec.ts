/**
 * FACTORY SITE SPEC TEMPLATE — Ship Gate A2 (+ the browser layer of A4)
 * v1.0 · 14 Jul 2026
 *
 * Runs against ANY Factory site. Point it at a site directory and a URL:
 *
 *   SITE=sites/<domain> pnpm exec playwright test tests/factory
 *     → playwright.config.ts starts `next start` for that site (local build)
 *   SITE=sites/<domain> BASE_URL=https://<preview>.vercel.app pnpm exec playwright test tests/factory
 *     → runs against a deployed preview instead
 *
 * What it verifies (A2): locked facts (info@kairali.com, +91 92898 38797,
 * …38777 absent) · forms render with consent + privacy link · locale
 * switcher + reciprocal hreflang on multi-locale sites · no mixed content.
 * Browser layer of A4 (static layer = packages/ui brand lint): touch
 * targets ≥44px on CTAs · visible focus ring. Plus: zero console errors
 * (A1) and ≥1 data-cta CTA (B4 wiring dependency).
 *
 * Rules (CLAUDE.md): never edit a test to make it pass — a red test is a
 * finding. Deterministic only — no AI calls here.
 */

import { test, expect, Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SITE_DIR = process.env.SITE ?? "sites/arogyakendra.com";
const config = JSON.parse(readFileSync(join(SITE_DIR, "site.config.json"), "utf8")) as {
  domain: string;
  entity: string;
  locales: string[];
  brand?: string;
};

// ── LOCKED FACTS (PROJECT_CONTEXT §3) ────────────────────────────────────────
const CONTACT_EMAIL = "info@kairali.com";
const PRIYA_WHATSAPP = "919289838797"; // +91 92898 38797, digits only
const WRONG_WHATSAPP_TAIL = "9289838777"; // known-bad — must never appear

const KAIRALI_ENTITIES = new Set(["group", "ktahv", "kappl", "raag", "product"]);
const isKairaliSurface = KAIRALI_ENTITIES.has(config.entity);

const consoleErrors: string[] = [];

test.beforeEach(async ({ page }) => {
  consoleErrors.length = 0;
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  await page.goto("/");
});

test.describe(`factory spec — ${config.domain} [${config.entity}]`, () => {
  test("A1: zero console errors on the home template", async () => {
    expect(consoleErrors, consoleErrors.join("\n")).toHaveLength(0);
  });

  test("A2 locked facts: known-bad WhatsApp number absent, any formatting", async ({ page }) => {
    const digits = (await page.content()).replace(/[^\d]/g, "");
    expect(digits).not.toContain(WRONG_WHATSAPP_TAIL);
  });

  test("A2 locked facts: kairali.com mailto links use the one public email", async ({ page }) => {
    const mailtos = await page.$$eval('a[href^="mailto:"]', (as) =>
      as.map((a) => (a as HTMLAnchorElement).href.replace(/^mailto:/, "").toLowerCase()),
    );
    for (const addr of mailtos.filter((a) => a.endsWith("@kairali.com"))) {
      expect(addr).toBe(CONTACT_EMAIL);
    }
  });

  test("A2 locked facts: WhatsApp CTAs point at the interim Priya number", async ({ page }) => {
    test.skip(!isKairaliSurface, "non-Kairali surface — group WhatsApp rule does not apply");
    const waLinks = await page.$$eval('a[href*="wa.me"], a[href*="api.whatsapp.com"]', (as) =>
      as.map((a) => (a as HTMLAnchorElement).href),
    );
    for (const href of waLinks) {
      expect(href.replace(/[^\d]/g, "")).toContain(PRIYA_WHATSAPP);
    }
  });

  test("A2: a Kairali surface offers a contact path (email or WhatsApp)", async ({ page }) => {
    test.skip(!isKairaliSurface, "non-Kairali surface");
    const contacts = await page
      .locator('a[href^="mailto:"], a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href^="tel:"]')
      .count();
    expect(contacts).toBeGreaterThan(0);
  });

  test("A2 forms: any form renders consent + privacy link (DPDP)", async ({ page }) => {
    const forms = page.locator("form");
    const n = await forms.count();
    test.skip(n === 0, "no forms on this template");
    for (let i = 0; i < n; i++) {
      const form = forms.nth(i);
      await expect(form.locator('input[type="checkbox"]').first()).toBeVisible();
      await expect(form.locator('a[href*="privacy"]').first()).toBeVisible();
    }
  });

  test("A7: multi-locale sites expose a locale switcher + complete reciprocal hreflang", async ({ page }) => {
    test.skip(config.locales.length < 2, "single-locale site — no hreflang cluster (A7 n/a)");
    // hreflang present for every declared locale + x-default
    const tags = await page.$$eval('link[rel="alternate"][hreflang]', (ls) =>
      ls.map((l) => ({ lang: l.getAttribute("hreflang"), href: l.getAttribute("href") })),
    );
    const langs = new Set(tags.map((t) => t.lang));
    for (const locale of config.locales) expect(langs, `hreflang missing ${locale}`).toContain(locale);
    expect(langs).toContain("x-default");
    // reciprocity: every alternate page carries the SAME cluster
    for (const tag of tags) {
      if (!tag.href || tag.lang === "x-default") continue;
      const res = await page.request.get(tag.href);
      expect(res.ok(), `${tag.href} fetch failed`).toBeTruthy();
      const html = await res.text();
      for (const locale of config.locales) {
        expect(html, `${tag.href} lacks reciprocal hreflang ${locale}`).toContain(`hreflang="${locale}"`);
      }
    }
    // a visible locale switcher exists
    const switcher = page.locator('[data-locale-switcher], nav [href^="/de"], nav [href^="/fr"], [aria-label*="language" i]');
    expect(await switcher.count()).toBeGreaterThan(0);
  });

  test("A2: no mixed content — every subresource and link is https", async ({ page }) => {
    // Same-origin http is the local `next start` transport, not mixed content;
    // in production the page origin is https so ANY http:// subresource fails.
    const pageOrigin = new URL(page.url()).origin;
    const insecure = (
      await page.$$eval(
        "img[src], script[src], link[href], iframe[src], video[src], source[src]",
        (els) =>
          els
            .map((el) => (el as HTMLImageElement).src || (el as HTMLLinkElement).href || "")
            .filter((u) => u.startsWith("http://")),
      )
    ).filter((u) => !u.startsWith(pageOrigin + "/"));
    expect(insecure, insecure.join("\n")).toHaveLength(0);
  });

  test("A4 (browser layer): every data-cta control is ≥44px touch target", async ({ page }) => {
    const ctas = page.locator("[data-cta]:visible");
    const n = await ctas.count();
    expect(n, "at least one data-cta CTA (B4 conversion wiring depends on it)").toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      const box = await ctas.nth(i).boundingBox();
      expect(box, `data-cta #${i} has no box`).toBeTruthy();
      expect(box!.height, `data-cta #${i} height ${box!.height}px < 44px`).toBeGreaterThanOrEqual(44);
      expect(box!.width, `data-cta #${i} width ${box!.width}px < 44px`).toBeGreaterThanOrEqual(44);
    }
  });

  test("A4 (browser layer): keyboard focus is visibly marked", async ({ page }) => {
    await page.keyboard.press("Tab");
    const marked = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return "nothing-focused";
      const cs = getComputedStyle(el);
      const hasOutline = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
      const hasShadow = cs.boxShadow !== "none" && cs.boxShadow !== "";
      return hasOutline || hasShadow ? "marked" : `unmarked (${el.tagName})`;
    });
    expect(marked).toBe("marked");
  });

  test("A6: title/description/canonical present and within limits", async ({ page }) => {
    const title = await page.title();
    expect(title.length, `title "${title}"`).toBeGreaterThan(0);
    expect(title.length, `title ${title.length}ch > 60`).toBeLessThanOrEqual(60);
    const desc = await page.getAttribute('meta[name="description"]', "content");
    expect(desc, "meta description missing").toBeTruthy();
    expect(desc!.length, `description ${desc!.length}ch > 155`).toBeLessThanOrEqual(155);
    const canonical = await page.getAttribute('link[rel="canonical"]', "href");
    expect(canonical, "canonical missing").toBeTruthy();
    expect(canonical).toContain(config.domain);
  });

  test("A8: JSON-LD parses and carries an Organization node", async ({ page }) => {
    test.skip(!isKairaliSurface, "non-Kairali surface — schema template varies");
    const blocks = await page.$$eval('script[type="application/ld+json"]', (ss) =>
      ss.map((s) => s.textContent ?? ""),
    );
    expect(blocks.length).toBeGreaterThan(0);
    const nodes = blocks.flatMap((b) => {
      const parsed = JSON.parse(b); // throws = red test, exactly right
      return parsed["@graph"] ?? [parsed];
    });
    expect(nodes.some((n: { "@type"?: string }) => n["@type"] === "Organization")).toBeTruthy();
  });
});
