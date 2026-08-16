import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";
import { LegalPage } from "../_components/legal-page";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "../_components/chrome";

export const metadata = buildMetadata(siteConfig, {
  title: "Privacy Notice | Blush Lounge by Sneha",
  description:
    "How Blush Lounge by Sneha handles website analytics, consent choices and privacy requests.",
  path: "/privacy",
  siteName: "Blush Lounge — Makeup by Sneha",
  ogImage: "/og.jpg",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Clear, minimal measurement."
      summary="The website works without analytics. If you choose to allow measurement, we collect only what helps us understand which pages and contact routes are useful."
    >
      <p className="legal-copy__updated">Last updated: 11 August 2026</p>

      <h2>Who is responsible</h2>
      <p>
        Sneha Chowdhary, trading as Blush Lounge by Sneha, is the controller for this website. For a
        privacy request, contact Sneha through the confirmed WhatsApp number{" "}
        <a href={WHATSAPP_URL} rel="noopener">
          {WHATSAPP_DISPLAY}
        </a>
        .
      </p>

      <h2>What happens without analytics consent</h2>
      <p>
        Google Analytics does not load and no analytics request is sent. The site stores only your
        analytics choice in your own browser so it can remember whether you selected Essential only
        or Allow analytics. The website currently has no online enquiry form; contact links open
        third-party services such as WhatsApp or Instagram, whose own privacy terms then apply.
      </p>

      <h2>What we measure if you allow analytics</h2>
      <p>
        The site loads Google Analytics 4 to measure page views, referral source, broad geography,
        browser or device category, engagement and named interactions such as a WhatsApp or Instagram
        link click. We do not add your name, phone number, message text, email address or a customer
        identifier to Analytics.
      </p>
      <p>
        Google receives technical request data needed to provide Analytics, which can include an IP
        address, page URL and device or browser information. Google signals, user-provided data
        collection and ads personalisation are disabled for this property.
      </p>

      <h2>Why and how long</h2>
      <p>
        Analytics is used only with your consent to understand site performance and improve content
        and contact journeys. User- and event-level retention in the Blush Lounge Analytics property
        is set to two months and does not reset when a visitor returns. Google may retain aggregated
        standard reports separately. Analytics cookies are configured for no more than 60 days.
      </p>

      <h2>Service provider and international processing</h2>
      <p>
        Google provides the Analytics service and may process data in countries outside your own.
        Google&rsquo;s contractual and technical safeguards apply to that processing. The site does not
        link Analytics to an advertising account or sell website visitor data.
      </p>

      <h2>Your choices and requests</h2>
      <p>
        Choose Essential only to keep Analytics off. You can change or withdraw your choice at any
        time through Cookie settings in the footer; withdrawing consent stops future Analytics
        loading and removes accessible Google Analytics cookies from this site. You may also ask
        Sneha to explain, correct or delete personal data under her control using the WhatsApp contact
        above.
      </p>

      <p>
        For the exact browser storage and cookie names, read the <a href="/cookie-policy">Cookie policy</a>.
      </p>
    </LegalPage>
  );
}
