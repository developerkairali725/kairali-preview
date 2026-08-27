import { expect, test } from "@playwright/test";

const IS_ABHILASH = (process.env.SITE ?? "").endsWith("sites/abhilashkr");

const LOCALIZED_ROUTES = [
  "/de",
  "/de/ueber-mich",
  "/de/arbeit",
  "/de/investitionen",
  "/de/texte",
  "/de/medien",
  "/de/auszeichnungen",
  "/de/vortraege",
  "/de/kontakt",
  "/de/fragen",
  "/de/aktuell",
  "/de/datenschutz",
  "/fr",
  "/fr/a-propos",
  "/fr/travail",
  "/fr/investissements",
  "/fr/ecrits",
  "/fr/medias",
  "/fr/distinctions",
  "/fr/conferences",
  "/fr/contact",
  "/fr/questions",
  "/fr/maintenant",
  "/fr/confidentialite",
] as const;

const EXPECTED_IMAGE_COUNTS: Partial<Record<(typeof LOCALIZED_ROUTES)[number], number>> = {
  "/de": 2,
  "/de/ueber-mich": 1,
  "/de/arbeit": 7,
  "/de/vortraege": 1,
  "/fr": 2,
  "/fr/a-propos": 1,
  "/fr/travail": 7,
  "/fr/conferences": 1,
};

test.describe("Abhilash localized media and contact routing", () => {
  test.skip(!IS_ABHILASH, "Abhilash-only localized media and contact contract");

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "abhilashkr-analytics-consent",
        JSON.stringify({ v: 1, analytics: "denied" }),
      );
    });
  });

  test("keeps all 24 translated routes live and restores approved image parity", async ({ page }) => {
    for (const route of LOCALIZED_ROUTES) {
      const response = await page.goto(route);
      expect(response?.status(), `${route} should return HTTP 200`).toBe(200);
      await expect(page.locator("img"), `${route} image count`).toHaveCount(
        EXPECTED_IMAGE_COUNTS[route] ?? 0,
      );
    }
  });

  test("renders all seven approved enterprise images in both translated work pages", async ({ page }) => {
    for (const route of ["/de/arbeit", "/fr/travail"]) {
      await page.goto(route);
      const imageSources = await page.locator("img").evaluateAll((images) =>
        images.map((image) => decodeURIComponent(image.getAttribute("src") ?? "")),
      );

      for (const asset of [
        "/images/healing-village-grounds.jpg",
        "/images/kappl-product-range.png",
        "/images/kac-therapy.jpg",
        "/images/kac-centre.jpg",
        "/images/villa-raag-exterior.jpg",
        "/images/villa-raag-1.webp",
        "/images/villa-raag-2.webp",
      ]) {
        expect(imageSources.some((source) => source.includes(asset)), `${route} should render ${asset}`).toBe(true);
      }
    }
  });

  test("makes the contact coordinates actionable in all three languages", async ({ page }) => {
    const linkedinHref =
      "https://www.linkedin.com/in/abhilashkramesh-ayurvedicmedicine-ayurvedicherbalproducts/";

    await page.goto("/contact");
    await expect(page.getByRole("link", { name: "info@kairali.com", exact: true }).first()).toHaveAttribute(
      "href",
      "mailto:info@kairali.com",
    );
    await expect(page.getByRole("link", { name: "+91-9555-156-156" })).toHaveAttribute("href", "tel:+919555156156");
    await expect(page.getByRole("link", { name: "Abhilash Ramesh" })).toHaveAttribute("href", linkedinHref);

    for (const localizedContact of [
      {
        route: "/de/kontakt",
        emailName: "info@kairali.com schreiben",
        emailHref: "mailto:info@kairali.com?subject=abhilashkr.com%20%E2%80%94%20Anfrage",
        linkedinName: "Abhilash Ramesh auf LinkedIn",
        disclosure: "Sie müssen die Nachricht dort selbst senden",
      },
      {
        route: "/fr/contact",
        emailName: "Écrire à info@kairali.com",
        emailHref: "mailto:info@kairali.com?subject=abhilashkr.com%20%E2%80%94%20Demande",
        linkedinName: "Abhilash Ramesh sur LinkedIn",
        disclosure: "vous devez ensuite envoyer vous-même le message",
      },
    ]) {
      await page.goto(localizedContact.route);
      await expect(page.getByRole("link", { name: localizedContact.emailName })).toHaveAttribute(
        "href",
        localizedContact.emailHref,
      );
      await expect(page.getByRole("link", { name: "+91-9555-156-156" })).toHaveAttribute("href", "tel:+919555156156");
      await expect(page.getByRole("link", { name: localizedContact.linkedinName })).toHaveAttribute(
        "href",
        linkedinHref,
      );
      await expect(page.getByText(localizedContact.disclosure, { exact: false })).toBeVisible();
    }
  });

  test("states before and after form use that the site only prepares an email draft", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.locator("[data-form-delivery-note]")).toContainText(
      "This form does not send or store your message",
    );
    await expect(page.getByRole("button", { name: "Prepare Email Draft" })).toBeVisible();

    await page.getByLabel("Your Name").fill("Test Visitor");
    await page.getByLabel("Email Address").fill("visitor@example.com");
    await page.getByLabel("Message Details").fill("Preview verification only.");
    await page.getByRole("button", { name: "Prepare Email Draft" }).click();

    await expect(page.getByRole("heading", { name: "Email Draft Ready" })).toBeVisible();
    await expect(page.getByText("Nothing has been sent or stored by this website")).toBeVisible();
    await expect(page.getByRole("link", { name: "Email info@kairali.com directly" })).toHaveAttribute(
      "href",
      "mailto:info@kairali.com",
    );
  });
});
