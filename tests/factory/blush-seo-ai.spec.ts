import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SITE_DIR = process.env.SITE ?? "sites/arogyakendra.com";
const config = JSON.parse(readFileSync(join(SITE_DIR, "site.config.json"), "utf8")) as {
  domain: string;
};
const isBlush = config.domain === "theblushlounge.com";

const SITE_URL = "https://theblushlounge.com";
const SITE_NAME = "Blush Lounge by Sneha";
const BUSINESS_ID = `${SITE_URL}/#business`;
const SNEHA_ID = `${SITE_URL}/#sneha`;
const SNEHA_PROFILE = "https://www.instagram.com/blushlounge_sneha/";
const SCHOOL_PROFILE = "https://www.instagram.com/blushschoolofbeauty/";
const SERVICE_AREAS = [
  "Delhi",
  "New Delhi",
  "Gurugram",
  "Faridabad",
  "Noida",
  "Ghaziabad",
  "Greater Noida",
];
const ROUTES = [
  "/",
  "/portfolio",
  "/services",
  "/academy",
  "/about",
  "/contact",
  "/journal",
  "/journal/makeup-colour-correction-guide",
  "/privacy",
  "/cookie-policy",
];

type JsonLdNode = Record<string, unknown> & { "@type"?: string; "@id"?: string };

async function jsonLdNodes(page: import("@playwright/test").Page): Promise<JsonLdNode[]> {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.flatMap((block) => {
    const parsed = JSON.parse(block) as JsonLdNode & { "@graph"?: JsonLdNode[] };
    return parsed["@graph"] ?? [parsed];
  });
}

test.describe("Blush factual SEO and AI-search contract", () => {
  test.skip(!isBlush, "Blush-only entity, crawler and citation contract");

  test("all index pages publish exact-brand social metadata with accessible images", async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page.locator('meta[property="og:site_name"]'), route).toHaveAttribute(
        "content",
        SITE_NAME,
      );
      await expect(page.locator('meta[property="og:image"]'), route).toHaveAttribute(
        "content",
        `${SITE_URL}/og.jpg`,
      );
      await expect(page.locator('meta[property="og:image:alt"]'), route).toHaveAttribute(
        "content",
        /Sneha Chowdhary/,
      );
      await expect(page.locator('meta[name="twitter:image"]'), route).toHaveAttribute(
        "content",
        `${SITE_URL}/og.jpg`,
      );
      await expect(page.locator('meta[name="twitter:image:alt"]'), route).toHaveAttribute(
        "content",
        /Sneha Chowdhary/,
      );
    }
  });

  test("Sneha is one consistent entity and each specialist page describes the right thing", async ({ page }) => {
    const personRoutes = [
      "/",
      "/portfolio",
      "/services",
      "/academy",
      "/about",
      "/contact",
      "/journal/makeup-colour-correction-guide",
    ];

    for (const route of personRoutes) {
      await page.goto(route);
      const person = (await jsonLdNodes(page)).find((node) => node["@type"] === "Person");
      expect(person, `${route} Person node`).toBeTruthy();
      expect(person?.["@id"]).toBe(SNEHA_ID);
      expect(person?.url).toBe(`${SITE_URL}/about`);
      expect(person?.sameAs).toEqual([SNEHA_PROFILE]);
      expect(person?.affiliation).toEqual({ "@id": BUSINESS_ID });
    }

    await page.goto("/");
    const homeNodes = await jsonLdNodes(page);
    const business = homeNodes.find((node) => node["@id"] === BUSINESS_ID);
    const website = homeNodes.find((node) => node["@type"] === "WebSite");
    expect(business?.["@type"]).toBe("Organization");
    expect(business?.areaServed).toEqual(SERVICE_AREAS);
    expect(website?.publisher).toEqual({ "@id": BUSINESS_ID });

    await page.goto("/services");
    const service = (await jsonLdNodes(page)).find((node) => node["@type"] === "Service");
    expect(service?.provider).toEqual({ "@id": SNEHA_ID });
    expect(service?.areaServed).toEqual(SERVICE_AREAS);

    await page.goto("/academy");
    const academyNodes = await jsonLdNodes(page);
    const school = academyNodes.find((node) => node["@id"] === `${SITE_URL}/academy#school`);
    const course = academyNodes.find((node) => node["@type"] === "Course");
    expect(school?.sameAs).toEqual([SCHOOL_PROFILE]);
    expect(course?.provider).toEqual({ "@id": `${SITE_URL}/academy#school` });

    await page.goto("/contact");
    const contactBusiness = (await jsonLdNodes(page)).find((node) => node["@id"] === BUSINESS_ID);
    expect(contactBusiness?.["@type"]).toBe("Organization");
    expect(contactBusiness?.name).toBe(SITE_NAME);
    expect(contactBusiness?.areaServed).toEqual(SERVICE_AREAS);
    expect(contactBusiness?.sameAs).toEqual([SNEHA_PROFILE]);
    expect(contactBusiness).not.toHaveProperty("address");
    await expect(page.locator("body")).not.toContainText("Shivalik");
    await expect(page.locator("body")).toContainText("no walk-in studio");
  });

  test("robots keeps AI search open while declining separately controlled training crawls", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();
    for (const agent of [
      "OAI-SearchBot",
      "ChatGPT-User",
      "Claude-SearchBot",
      "Claude-User",
      "PerplexityBot",
      "Perplexity-User",
      "Google-Extended",
    ]) {
      expect(body).toContain(`User-Agent: ${agent}`);
    }
    for (const agent of ["GPTBot", "ClaudeBot"]) {
      expect(body).toMatch(new RegExp(`User-Agent: ${agent}[\\s\\S]*?Disallow: /`));
    }
    expect(body).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });

  test("sitemap and llms.txt carry the complete current official surface", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect((sitemap.match(/<url>/g) ?? []).length).toBe(ROUTES.length);
    expect((sitemap.match(/<lastmod>2026-08-27/g) ?? []).length).toBe(ROUTES.length);
    expect(sitemap).not.toContain("<priority>");
    expect(sitemap).not.toContain("<changefreq>");
    for (const route of ROUTES) {
      expect(sitemap).toContain(`<loc>${SITE_URL}${route}</loc>`);
    }

    const llms = await (await request.get("/llms.txt")).text();
    expect(llms).toContain(`# ${SITE_NAME}`);
    expect(llms).toContain("no walk-in storefront");
    expect(llms).not.toContain("Shivalik");
    for (const area of SERVICE_AREAS) expect(llms).toContain(area);
    for (const route of [
      "/journal",
      "/journal/makeup-colour-correction-guide",
      "/privacy",
      "/cookie-policy",
    ]) {
      expect(llms).toContain(`${SITE_URL}${route}`);
    }

    const manifest = await (await request.get("/manifest.json")).json();
    expect(manifest.name).toBe(SITE_NAME);
  });
});
