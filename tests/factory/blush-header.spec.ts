import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SITE_DIR = process.env.SITE ?? "sites/arogyakendra.com";
const config = JSON.parse(readFileSync(join(SITE_DIR, "site.config.json"), "utf8")) as { domain: string };
const isBlush = config.domain === "theblushlounge.com";

test.describe("Blush responsive page header", () => {
  test.skip(!isBlush, "Blush-only page-header contract");

  test("keeps a compact two-tier header across phone widths", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-375", "Phone-width matrix runs once in the mobile project");

    await page.setViewportSize({ width: 320, height: 915 });
    await page.goto("/contact", { waitUntil: "domcontentloaded" });

    for (const width of [320, 375, 412, 480]) {
      await page.setViewportSize({ width, height: 915 });
      await expect(page.locator(".pagehead")).toBeVisible();

      const geometry = await page.evaluate(() => {
        const header = document.querySelector<HTMLElement>(".pagehead");
        const brand = document.querySelector<HTMLElement>(".pagehead .brand");
        const whatsapp = document.querySelector<HTMLElement>(".pagehead__wa");
        const links = [...document.querySelectorAll<HTMLElement>(".pagehead__nav a")];
        const rowCounts = links.reduce<Record<number, number>>((counts, link) => {
          const top = Math.round(link.getBoundingClientRect().top);
          counts[top] = (counts[top] ?? 0) + 1;
          return counts;
        }, {});

        return {
          headerHeight: header?.getBoundingClientRect().height ?? 0,
          brandCenter: brand ? brand.getBoundingClientRect().top + brand.getBoundingClientRect().height / 2 : 0,
          whatsappCenter: whatsapp
            ? whatsapp.getBoundingClientRect().top + whatsapp.getBoundingClientRect().height / 2
            : 0,
          whatsappHeight: whatsapp?.getBoundingClientRect().height ?? 0,
          minimumNavHeight: Math.min(...links.map((link) => link.getBoundingClientRect().height)),
          rowCounts: Object.values(rowCounts),
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          compactLabelVisible:
            getComputedStyle(document.querySelector<HTMLElement>(".pagehead__wa-label--compact")!).display !== "none",
        };
      });

      expect(geometry.scrollWidth, `${width}px header overflow`).toBeLessThanOrEqual(geometry.viewportWidth);
      expect(geometry.headerHeight, `${width}px header height`).toBeLessThan(200);
      expect(Math.abs(geometry.brandCenter - geometry.whatsappCenter), `${width}px first-row alignment`).toBeLessThan(2);
      expect(geometry.whatsappHeight).toBeGreaterThanOrEqual(44);
      expect(geometry.minimumNavHeight).toBeGreaterThanOrEqual(44);
      expect(geometry.rowCounts).toEqual([3, 3]);
      expect(geometry.compactLabelVisible).toBeTruthy();
      await expect(page.getByRole("link", { name: "WhatsApp Sneha", exact: true }).first()).toBeVisible();
    }
  });

  test("retains the full desktop header treatment", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1280", "Desktop header contract runs once in the desktop project");

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/contact");

    const navRows = await page.locator(".pagehead__nav a").evaluateAll((links) => [
      ...new Set(links.map((link) => Math.round(link.getBoundingClientRect().top))),
    ]);

    await expect(page.locator(".pagehead__wa-label--wide")).toBeVisible();
    await expect(page.locator(".pagehead__wa-label--compact")).toBeHidden();
    expect(navRows).toHaveLength(1);
    await expect(page.getByRole("link", { name: "WhatsApp Sneha", exact: true }).first()).toHaveCSS(
      "min-height",
      "44px",
    );
  });
});
