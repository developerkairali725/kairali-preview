// /request-a-quote — THE money page (STRATEGY §1/§4). Full structured RFQ per
// the signed integrations plan: name · company/organisation · business email ·
// phone with country code · country · category of interest (multi-select,
// hidden pre-fill from ?category=) · project type · quantity/scale · message ·
// visible consent checkbox. Store-first via @kairali/forms; notification lane
// info@kairali.com (LOCKED FACT). No prices, no invented response promises.
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import siteConfig from "../../site.config.json";
import { CATEGORIES, SITE_URL } from "../_lib/catalog";
import { Crumbs } from "../_components/page-chrome";
import { EMAIL } from "../_components/chrome";

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Request a Quote — Ayurveda Equipment",
    description:
      "Describe the project — a hospital wing, a resort spa, a new centre, a container order — and the sales team replies with specifications and a quote.",
    path: "/request-a-quote",
    siteName: "Kairali Equipment",
  }) as Metadata),
  keywords: ["ayurveda equipment quote", "panchakarma equipment price enquiry", "bulk order ayurvedic equipment"],
};

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE_URL}/request-a-quote#breadcrumb`,
    items: [
      { name: "Home", url: SITE_URL },
      { name: "Request a quote", url: `${SITE_URL}/request-a-quote` },
    ],
  }),
);

export default async function RequestAQuote({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const sp = await searchParams;
  const preset = (Array.isArray(sp.category) ? sp.category : sp.category ? [sp.category] : []).filter((c) =>
    CATEGORIES.some((cat) => cat.name === c),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main>
        <section className="page-head">
          <div className="container">
            <Crumbs trail={[{ name: "Request a quote" }]} />
            <p className="overline">Request a quote</p>
            <h1>Tell us what you are equipping</h1>
            <p className="lede">
              A hospital wing, a resort spa, a new centre, a container order —
              describe the project and the team will come back with
              specifications, dimensions and a quote.
            </p>
          </div>
        </section>
        <section className="rfq" style={{ marginTop: 0, borderTop: 0 }}>
          <div className="container rfq-grid">
            <div>
              <p className="after-note" style={{ marginTop: 0 }}>
                <strong>What happens next:</strong> your enquiry reaches the sales
                team at {EMAIL}. Prices, lead times and export terms are shared at
                quote stage — nothing is published or invented on this site. No
                obligation attaches to a quote.
              </p>
              <p className="rfq-email">
                Prefer your own mail client?{" "}
                <a href={`mailto:${EMAIL}`} data-cta="email-click">Write to {EMAIL}</a>
              </p>
              <p className="grid-note" style={{ maxWidth: "38em" }}>
                Consent note: the form stores your details only to answer this
                enquiry (see the <a href="/privacy">privacy policy</a>); the
                consent box is required, and nothing is sent without it.
              </p>
            </div>
            <EnquiryForm
              site="kairaliequipment.com"
              formType="rfq"
              privacyHref="/privacy"
              subject="Equipment RFQ — kairaliequipment.com"
              heading="Request a quote"
              submitLabel="Request a quote"
              submitCta="quote-request-submit"
              rfq={{
                organisation: true,
                country: true,
                categoryOptions: CATEGORIES.map((c) => c.name),
                defaultCategories: preset,
                projectTypeOptions: [
                  "Hospital / clinic",
                  "Resort / hotel spa",
                  "Wellness centre",
                  "Distributor / importer",
                  "Other",
                ],
                scale: true,
              }}
            />
          </div>
        </section>
      </main>
    </>
  );
}
