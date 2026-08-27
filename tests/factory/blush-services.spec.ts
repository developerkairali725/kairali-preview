import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SITE_DIR = process.env.SITE ?? "sites/arogyakendra.com";
const config = JSON.parse(readFileSync(join(SITE_DIR, "site.config.json"), "utf8")) as { domain: string };
const isBlush = config.domain === "theblushlounge.com";

test.describe("Blush services visual presentation", () => {
  test.skip(!isBlush, "Blush-only services imagery contract");

  test("uses three responsive, optimized and meaningfully described service images", async ({ page }) => {
    const responses: string[] = [];
    page.on("response", (response) => {
      if (response.url().includes("/_next/image") && response.url().includes("portfolio-")) {
        responses.push(response.headers()["content-type"] ?? "");
      }
    });

    await page.goto("/services");

    const gallery = page.locator(".services-page-hero__gallery");
    await expect(gallery).toBeVisible();
    await expect(gallery.locator("img")).toHaveCount(3);
    await expect(gallery.locator("figcaption")).toHaveText(["Bridal", "Occasion", "Editorial"]);

    const images = gallery.locator("img");
    for (let index = 0; index < 3; index += 1) {
      const image = images.nth(index);
      await expect(image).toHaveAttribute("alt", /\S+/);
      await expect(image).toHaveAttribute("sizes", /vw/);
      await expect(image).toHaveAttribute("srcset", /q=(65|68)/);
    }

    await expect(images.first()).toHaveAttribute("fetchpriority", "high");
    await expect(images.first()).toHaveAttribute("srcset", /w=480/);
    expect(await images.first().getAttribute("loading")).not.toBe("lazy");
    expect(responses.some((type) => type.includes("image/avif"))).toBeTruthy();
  });

  test("keeps the gallery and service content inside the mobile and desktop viewport", async ({ page }) => {
    await page.goto("/services");

    const geometry = await page.evaluate(() => {
      const gallery = document.querySelector<HTMLElement>(".services-page-hero__gallery");
      const headings = [...document.querySelectorAll<HTMLElement>(".svc h2")];
      const links = [...document.querySelectorAll<HTMLElement>(".svc [data-cta='whatsapp_click']")];
      const galleryBox = gallery?.getBoundingClientRect();

      return {
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        galleryWidth: galleryBox?.width ?? 0,
        galleryHeight: galleryBox?.height ?? 0,
        headingCount: headings.length,
        minimumCtaHeight: Math.min(...links.map((link) => link.getBoundingClientRect().height)),
      };
    });

    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.viewportWidth);
    expect(geometry.galleryWidth).toBeGreaterThan(250);
    expect(geometry.galleryHeight).toBeGreaterThan(350);
    expect(geometry.headingCount).toBe(5);
    expect(geometry.minimumCtaHeight).toBeGreaterThanOrEqual(44);
  });
});
