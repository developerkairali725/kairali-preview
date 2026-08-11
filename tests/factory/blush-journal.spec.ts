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
});
