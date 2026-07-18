// /request-a-quote — the RFQ page (STRATEGY §1 row 11). The one conversion.
// main.page-rfq triggers the chat-bubble hide state (chat-bubble law §4:
// form-heavy pages hide the bubble entirely).
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../_components/chrome";
import { OIL_PACK, POWDER_PACK } from "../_components/catalog";
import siteConfig from "../../site.config.json";

const SITE = "https://bulkayurvedaoils.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Request a Bulk Quote — Ayurvedic Oils | Kairali",
  description:
    "One form to the KAPPL desk — formulations, quantities, destination. A direct manufacturer quote comes back. No portal, no price games.",
  path: "/request-a-quote",
}) as Metadata;

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/request-a-quote#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Request a quote", url: `${SITE}/request-a-quote` },
    ],
  }),
);

export default function RequestAQuote() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top" className="page-rfq">
        <PageIntro
          overline="Request a quote"
          title="Tell us what your practice needs"
          lede="Formulations, quantities, destination — the KAPPL desk replies with a direct quote from the Pollachi factory and the documentation your purchase process needs."
        />

        <section className="rfq-band" id="rfq" aria-labelledby="rfq-heading" style={{ marginTop: 32 }}>
          <div className="container">
            <p className="overline">The RFQ</p>
            <h2 id="rfq-heading">One message starts the quote</h2>
            <p className="rfq-lede">
              Prefer another channel? Email and WhatsApp reach the same desk.
            </p>
            <div className="rfq-grid">
              <div className="rfq-aside">
                <p className="rfq-fact"><strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></p>
                <p className="rfq-fact"><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a></p>
                <p className="rfq-fact"><strong>Packs:</strong> {OIL_PACK} (oils) · {POWDER_PACK} (powders)</p>
                <p className="rfq-fact"><strong>Dispatch:</strong> India &amp; export markets — quoted direct</p>
                <p className="rfq-fact"><strong>Certifications:</strong> WHO-GMP · ISO · FSSAI (as published)</p>
              </div>
              <EnquiryForm
                site="bulkayurvedaoils.com"
                formType="rfq"
                subject="Bulk supply quote"
                heading="Request a bulk supply quote"
                submitLabel="Request a quote"
              />
            </div>
          </div>
        </section>
      </main>

      <div className="sticky-cta" aria-label="Contact">
        <a className="btn btn-secondary" href={WHATSAPP_URL} data-cta="whatsapp-click">WhatsApp</a>
        <a className="btn btn-primary" href="#rfq" data-cta="rfq-open">Get a bulk quote</a>
      </div>
    </>
  );
}
