import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SITE_DIR = process.env.SITE ?? "sites/arogyakendra.com";
const config = JSON.parse(readFileSync(join(SITE_DIR, "site.config.json"), "utf8")) as { domain: string };
const isBlush = config.domain === "theblushlounge.com";

test.describe("Blush legacy-blog SEO migration", () => {
  test.skip(!isBlush, "Blush-only redirect and Article-schema contract");

  test("legacy URLs permanently reach the closest current content", async ({ request }) => {
    const cases = [
      ["/blog", "/journal"],
      ["/blog/blushlounge-by-sneha/", "/journal/makeup-colour-correction-guide"],
      ["/blog/bridal-makeup/", "/services#bridal"],
      ["/blog/our-services/", "/services"],
    ] as const;

    for (const [source, destination] of cases) {
      const response = await request.get(source, { maxRedirects: 0 });
      expect(response.status(), source).toBe(308);
      expect(response.headers().location, source).toBe(destination);
    }

    const ordinaryTrailingSlash = await request.get("/about/", { maxRedirects: 0 });
    expect(ordinaryTrailingSlash.status()).toBe(308);
    expect(ordinaryTrailingSlash.headers().location).toBe("/about");
  });

  test("current guide is indexable, canonical and structurally described", async ({ page, request }) => {
    await page.goto("/journal/makeup-colour-correction-guide");

    await expect(page.getByRole("heading", { level: 1, name: "A Simple Guide to Makeup Colour Correction" })).toBeVisible();
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toContainText("Journal");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://theblushlounge.com/journal/makeup-colour-correction-guide",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index/);

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const nodes = blocks.flatMap((block) => {
      const parsed = JSON.parse(block);
      return parsed["@graph"] ?? [parsed];
    });
    expect(nodes.some((node: { "@type"?: string }) => node["@type"] === "Article")).toBeTruthy();
    expect(nodes.some((node: { "@type"?: string }) => node["@type"] === "BreadcrumbList")).toBeTruthy();

    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("https://theblushlounge.com/journal");
    expect(sitemap).toContain("https://theblushlounge.com/journal/makeup-colour-correction-guide");
  });

  test("Journal breadcrumb text shares one visual centre", async ({ page }) => {
    await page.goto("/journal");

    const centres = await page.locator(".breadcrumbs li > *").evaluateAll((items) =>
      items.map((item) => {
        const box = item.getBoundingClientRect();
        return box.top + box.height / 2;
      }),
    );

    expect(centres).toHaveLength(2);
    expect(Math.abs(centres[0] - centres[1])).toBeLessThan(1);
  });

  test("mobile floating WhatsApp appears only when inline contact controls leave the viewport", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-375", "mobile-only sticky contact control");

    await page.goto("/journal");
    await page.getByRole("button", { name: "Essential only" }).click();

    const floating = page.locator(".floating-whatsapp");
    await expect(floating).toBeHidden();

    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(floating).toBeVisible();
    await expect(floating).toHaveAttribute("href", /wa\.me\/918826921110/);
    await expect(floating).toHaveAttribute("data-cta", "whatsapp_click");

    const box = await floating.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);

    await page.locator('footer [data-cta="whatsapp_click"]').scrollIntoViewIfNeeded();
    await expect(floating).toBeHidden();
  });
});

test.describe("Blush homepage LCP contract", () => {
  test.skip(!isBlush, "Blush-only homepage image-delivery contract");

  test("discovers the responsive hero immediately at the tuned delivery quality", async ({ page }) => {
    const heroResponse = page.waitForResponse((response) =>
      response.url().includes("/_next/image") && response.url().includes("hero-cocktail-glam.jpg"),
    );
    await page.goto("/");

    const hero = page.locator(".hero__img");
    await expect(hero).toHaveAttribute("fetchpriority", "high");
    expect(await hero.getAttribute("loading")).not.toBe("lazy");
    await expect(hero).toHaveAttribute("sizes", "(max-width: 900px) 100vw, 53vw");
    await expect(hero).toHaveAttribute("srcset", /q=70/);

    const preload = page.locator('link[rel="preload"][as="image"]');
    await expect(preload).toHaveAttribute("imagesrcset", /q=70/);
    expect((await heroResponse).headers()["content-type"]).toContain("image/avif");
  });
});
