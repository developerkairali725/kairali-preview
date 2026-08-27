import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";
import { LegalPage } from "../_components/legal-page";
import { OG_IMAGE_ALT, SITE_NAME } from "../_lib/structured-data";

export const metadata = buildMetadata(siteConfig, {
  title: "Cookie Policy | Blush Lounge by Sneha",
  description:
    "The essential consent record and optional Google Analytics cookies used on the Blush Lounge website.",
  path: "/cookie-policy",
  siteName: SITE_NAME,
  ogImage: "/og.jpg",
  ogImageAlt: OG_IMAGE_ALT,
});

export default function CookiePolicyPage() {
  return (
    <LegalPage
      eyebrow="Cookies"
      title="Essential by default."
      summary="The site does not download Google Analytics until you deliberately choose Allow analytics."
    >
      <p className="legal-copy__updated">Last updated: 11 August 2026</p>

      <h2>Essential browser storage</h2>
      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>blush-analytics-consent-v1</code></td>
              <td>Remembers whether you allowed or declined Analytics. Stored only in your browser&rsquo;s local storage.</td>
              <td>Until you change the choice or clear site data.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Optional Analytics cookies</h2>
      <p>
        These can appear only after you choose Allow analytics. They are first-party cookies used by
        Google Analytics 4 for visit and session measurement; the site configures them for no more
        than 60 days.
      </p>
      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>_ga</code></td>
              <td>Distinguishes browser visits for aggregated site measurement.</td>
              <td>Up to 60 days.</td>
            </tr>
            <tr>
              <td><code>_ga_*</code></td>
              <td>Maintains session state for the Blush Lounge GA4 stream.</td>
              <td>Up to 60 days.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>No advertising cookies</h2>
      <p>
        Advertising storage, advertising user data, advertising personalisation, Google signals and
        user-provided data collection stay disabled. Allow analytics does not mean allow advertising.
      </p>

      <h2>Change your choice</h2>
      <p>
        Use the Cookie settings button in the footer. Selecting Essential only withdraws Analytics
        consent, stops the Analytics loader on future pages and removes accessible <code>_ga</code>
        cookies from this site. You can also clear or block site data in your browser.
      </p>

      <p>
        Read the <a href="/privacy">Privacy notice</a> for who controls the site, what optional Analytics measures and how to make a privacy request.
      </p>
    </LegalPage>
  );
}
