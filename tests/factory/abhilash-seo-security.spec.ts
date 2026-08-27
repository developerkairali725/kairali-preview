import { expect, test, type APIRequestContext } from "@playwright/test";

const IS_ABHILASH = (process.env.SITE ?? "").endsWith("sites/abhilashkr");
const HOME_ROUTES = new Set(["/", "/de", "/fr"]);

const BREADCRUMB_LABELS = {
  en: "Breadcrumb",
  de: "Brotkrümelnavigation",
  fr: "Fil d’Ariane",
} as const;

type JsonLdNode = {
  "@type"?: string | string[];
  "@id"?: string;
  url?: string;
  breadcrumb?: { "@id"?: string };
  itemListElement?: Array<{ position?: number; name?: string; item?: string }>;
  "@graph"?: JsonLdNode[];
};

function localeForRoute(route: string): keyof typeof BREADCRUMB_LABELS {
  if (route === "/de" || route.startsWith("/de/")) return "de";
  if (route === "/fr" || route.startsWith("/fr/")) return "fr";
  return "en";
}

function normalizedUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

async function sitemapRoutes(request: APIRequestContext) {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBeTruthy();
  const xml = await response.text();
  return [...xml.matchAll(/<loc>https:\/\/abhilashkr\.com([^<]*)<\/loc>/g)].map(
    (match) => match[1] || "/",
  );
}

test.describe("Abhilash technical SEO and security closure", () => {
  test.skip(!IS_ABHILASH, "Abhilash-only SEO and security contract");

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "abhilashkr-analytics-consent",
        JSON.stringify({ v: 1, analytics: "denied" }),
      );
    });
  });

  test("publishes a stable entity graph and localized breadcrumbs on every sitemap route", async ({ page, request }) => {
    test.setTimeout(90_000);
    const routes = await sitemapRoutes(request);
    expect(routes).toHaveLength(37);

    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), `${route} should return HTTP 200`).toBe(200);

      const nodes = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
        scripts.flatMap((script) => {
          const parsed = JSON.parse(script.textContent ?? "{}") as JsonLdNode;
          return parsed["@graph"] ? parsed["@graph"] : [parsed];
        }),
      );

      expect(
        nodes.some((node) => node["@type"] === "Person" && node["@id"] === "https://abhilashkr.com/#person"),
        `${route} Person entity`,
      ).toBe(true);
      expect(
        nodes.some((node) => node["@type"] === "WebSite" && node["@id"] === "https://abhilashkr.com/#website"),
        `${route} WebSite entity`,
      ).toBe(true);
      expect(
        nodes.some(
          (node) =>
            node["@type"] === "Organization" &&
            node["@id"] === "https://www.kairali.com/#organization",
        ),
        `${route} Organization entity`,
      ).toBe(true);

      const expectedUrl = normalizedUrl(new URL(route, "https://abhilashkr.com").href);
      const pageNode = nodes.find(
        (node) =>
          node["@id"]?.endsWith("#webpage") &&
          node.url &&
          normalizedUrl(node.url) === expectedUrl,
      );
      expect(pageNode, `${route} WebPage graph node`).toBeTruthy();

      const locale = localeForRoute(route);
      const breadcrumb = page.getByRole("navigation", { name: BREADCRUMB_LABELS[locale] });

      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1"), `${route} primary heading`).toHaveCount(1);
      await expect(page.locator("img:not([alt])"), `${route} image alternative contract`).toHaveCount(0);
      const headingLevels = await page.locator("h1, h2, h3, h4, h5, h6").evaluateAll((headings) =>
        headings.map((heading) => Number(heading.tagName.slice(1))),
      );
      for (let index = 1; index < headingLevels.length; index += 1) {
        expect(
          headingLevels[index],
          `${route} heading level after h${headingLevels[index - 1]}`,
        ).toBeLessThanOrEqual(headingLevels[index - 1] + 1);
      }

      if (HOME_ROUTES.has(route)) {
        await expect(breadcrumb, `${route} should not show a redundant home breadcrumb`).toHaveCount(0);
        continue;
      }

      await expect(breadcrumb, `${route} visible breadcrumb`).toBeVisible();
      await expect(breadcrumb.locator('[aria-current="page"]')).toHaveCount(1);
      const homeHref = locale === "en" ? "/" : `/${locale}`;
      await expect(breadcrumb.getByRole("link").first()).toHaveAttribute("href", homeHref);

      const homeLinkBox = await breadcrumb.getByRole("link").first().boundingBox();
      expect(homeLinkBox?.height ?? 0, `${route} breadcrumb touch target`).toBeGreaterThanOrEqual(44);

      const breadcrumbNode = nodes.find((node) => node["@type"] === "BreadcrumbList");
      expect(breadcrumbNode, `${route} BreadcrumbList`).toBeTruthy();
      expect(pageNode?.breadcrumb?.["@id"]).toBe(breadcrumbNode?.["@id"]);
      expect(breadcrumbNode?.itemListElement?.length ?? 0).toBeGreaterThanOrEqual(2);
      expect(breadcrumbNode?.itemListElement?.map((item) => item.position)).toEqual(
        breadcrumbNode?.itemListElement?.map((_, index) => index + 1),
      );
      expect(normalizedUrl(breadcrumbNode?.itemListElement?.at(-1)?.item ?? "")).toBe(expectedUrl);

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(hasHorizontalOverflow, `${route} should not overflow horizontally`).toBe(false);
    }
  });

  test("serves the hardened policy without browser policy violations", async ({ page, request }) => {
    const response = await request.get("/about");
    const headers = response.headers();
    const csp = headers["content-security-policy"] ?? "";

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("script-src 'self' 'unsafe-inline' https://www.googletagmanager.com");
    expect(csp).toContain("connect-src 'self' https://www.google-analytics.com");
    expect(headers["cross-origin-opener-policy"]).toBe("same-origin-allow-popups");
    expect(headers["origin-agent-cluster"]).toBe("?1");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");

    const policyErrors: string[] = [];
    page.on("console", (message) => {
      if (/content security policy|refused to (?:load|execute|connect)/i.test(message.text())) {
        policyErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => policyErrors.push(error.message));

    for (const route of [
      "/",
      "/about",
      "/contact",
      "/de/ueber-mich",
      "/fr/travail",
      "/writing/panchakarma-clinical-protocol-not-a-holiday",
    ]) {
      const navigation = await page.goto(route);
      expect(navigation?.status(), `${route} policy smoke`).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
    }

    expect(policyErrors).toEqual([]);
  });
});
