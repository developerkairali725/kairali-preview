import { expect, test } from "@playwright/test";

const IS_BLUSH = (process.env.SITE ?? "").endsWith("sites/theblushlounge.com");
const GOOGLE_REQUEST = /(?:googletagmanager\.com|google-analytics\.com|analytics\.google\.com)/i;

test.describe("Blush privacy-minimal Analytics", () => {
  test.skip(!IS_BLUSH, "Blush-only consent and analytics contract");

  test("sends no Google request before consent or after Essential only", async ({ page }) => {
    const googleRequests: string[] = [];
    page.on("request", (request) => {
      if (GOOGLE_REQUEST.test(request.url())) googleRequests.push(request.url());
    });

    await page.goto("/");
    await expect(page.getByRole("dialog", { name: "Your privacy, your choice" })).toBeVisible();
    await expect(page.getByRole("link", { name: "privacy notice" })).toHaveAttribute("href", "/privacy");
    expect(googleRequests).toEqual([]);

    await page.getByRole("button", { name: "Essential only" }).click();
    await page.waitForTimeout(250);
    expect(googleRequests).toEqual([]);
    expect(await page.context().cookies()).not.toContainEqual(expect.objectContaining({ name: "_ga" }));

    await page.reload();
    await expect(page.locator("[data-consent-banner]")).toHaveCount(0);
    expect(googleRequests).toEqual([]);

    await page.getByRole("button", { name: "Cookie settings" }).click();
    await expect(page.getByRole("dialog", { name: "Your privacy, your choice" })).toBeVisible();
  });

  test("loads GA4 only after Allow analytics and keeps all ads uses denied", async ({ page }) => {
    const tagRequests: string[] = [];
    await page.route("https://www.googletagmanager.com/**", async (route) => {
      tagRequests.push(route.request().url());
      await route.fulfill({ status: 200, contentType: "application/javascript", body: "/* test tag */" });
    });

    await page.goto("/");
    expect(tagRequests).toEqual([]);
    await page.getByRole("button", { name: "Allow analytics" }).click();

    await expect.poll(() => tagRequests.length).toBe(1);
    await expect
      .poll(() =>
        page.evaluate(() =>
          (window.dataLayer ?? []).some((entry) => {
            const call = Array.from(entry as ArrayLike<unknown>);
            return call[0] === "config" && call[1] === "G-6K7HVLYXZQ";
          }),
        ),
      )
      .toBe(true);
    const calls = await page.evaluate(() =>
      (window.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>)),
    );
    expect(calls).toContainEqual([
      "consent",
      "update",
      expect.objectContaining({
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      }),
    ]);
    expect(calls).toContainEqual([
      "config",
      "G-6K7HVLYXZQ",
      expect.objectContaining({
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_expires: 5_184_000,
      }),
    ]);

    const stored = await page.evaluate(() => localStorage.getItem("blush-analytics-consent-v1"));
    expect(JSON.parse(stored ?? "{}")).toMatchObject({ v: 1, analytics: "granted" });
  });

  test("publishes the controller-specific privacy and cookie notices", async ({ request }) => {
    const privacy = await request.get("/privacy");
    expect(privacy.ok()).toBeTruthy();
    expect(await privacy.text()).toContain("Sneha Chowdhary");

    const cookies = await request.get("/cookie-policy");
    expect(cookies.ok()).toBeTruthy();
    expect(await cookies.text()).toContain("blush-analytics-consent-v1");
  });
});
