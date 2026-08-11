import { expect, test } from "@playwright/test";

const IS_ABHILASH = (process.env.SITE ?? "").endsWith("sites/abhilashkr");
const GOOGLE_REQUEST = /(?:googletagmanager\.com|google-analytics\.com|analytics\.google\.com)/i;

test.describe("Abhilash privacy-minimal Analytics", () => {
  test.skip(!IS_ABHILASH, "Abhilash-only consent and analytics contract");

  test("sends no Google request before consent or after Necessary only", async ({ page }) => {
    const googleRequests: string[] = [];
    page.on("request", (request) => {
      if (GOOGLE_REQUEST.test(request.url())) googleRequests.push(request.url());
    });

    await page.goto("/");
    await expect(page.getByRole("dialog", { name: "Your privacy, your choice" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Privacy notice" })).toHaveAttribute("href", "/privacy");
    expect(googleRequests).toEqual([]);

    await page.getByRole("button", { name: "Necessary only" }).click();
    await page.waitForTimeout(250);
    expect(googleRequests).toEqual([]);
    expect(await page.context().cookies()).not.toContainEqual(expect.objectContaining({ name: "_ga" }));

    await page.reload();
    await expect(page.locator("[data-consent-banner]")).toHaveCount(0);
    expect(googleRequests).toEqual([]);

    await page.getByRole("button", { name: "Analytics settings" }).click();
    await expect(page.getByRole("dialog", { name: "Your privacy, your choice" })).toBeVisible();
  });

  test("loads only the approved GA4 stream and keeps advertising uses denied", async ({ page }) => {
    const tagRequests: string[] = [];
    await page.route("https://www.googletagmanager.com/**", async (route) => {
      tagRequests.push(route.request().url());
      await route.fulfill({ status: 200, contentType: "application/javascript", body: "/* test tag */" });
    });

    await page.goto("/");
    expect(tagRequests).toEqual([]);
    await page.getByRole("button", { name: "Allow analytics" }).click();

    await expect.poll(() => tagRequests).toEqual([
      "https://www.googletagmanager.com/gtag/js?id=G-SQR9PY0KZL",
    ]);
    await expect
      .poll(() =>
        page.evaluate(() =>
          (window.dataLayer ?? []).some((entry) => {
            const call = Array.from(entry as ArrayLike<unknown>);
            return call[0] === "config" && call[1] === "G-SQR9PY0KZL";
          }),
        ),
      )
      .toBe(true);
    const calls = await page.evaluate(() =>
      (window.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>)),
    );
    const queuedCommandShapes = await page.evaluate(() =>
      (window.dataLayer ?? []).map((entry) => ({
        isArray: Array.isArray(entry),
        tag: Object.prototype.toString.call(entry),
      })),
    );
    expect(queuedCommandShapes.length).toBeGreaterThan(0);
    expect(queuedCommandShapes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ isArray: false, tag: "[object Arguments]" }),
      ]),
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
      "G-SQR9PY0KZL",
      expect.objectContaining({
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_expires: 5_184_000,
      }),
    ]);

    await page.getByRole("button", { name: "Analytics settings" }).click();
    await page.getByRole("button", { name: "Necessary only" }).click();
    const stored = await page.evaluate(() => localStorage.getItem("abhilashkr-analytics-consent"));
    expect(JSON.parse(stored ?? "{}")).toMatchObject({ v: 1, analytics: "denied" });
    expect(await page.context().cookies()).not.toContainEqual(expect.objectContaining({ name: "_ga" }));
  });

  test("publishes current localized privacy notices", async ({ request }) => {
    const english = await request.get("/privacy");
    expect(english.ok()).toBeTruthy();
    expect(await english.text()).toContain("Abhilash Kalathil Ramesh controls");

    const german = await request.get("/de/datenschutz");
    expect(german.ok()).toBeTruthy();
    expect(await german.text()).toContain("Google Analytics bleibt ausgeschaltet");

    const french = await request.get("/fr/confidentialite");
    expect(french.ok()).toBeTruthy();
    expect(await french.text()).toContain("Google Analytics reste désactivé");
  });
});
