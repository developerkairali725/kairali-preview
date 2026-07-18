// /start-your-project — the project-intake page (STRATEGY §1 row 10). The one
// conversion. main.page-rfq triggers the chat-bubble hide state (chat-bubble
// law §4: form-heavy pages hide the bubble entirely).
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../_components/chrome";
import siteConfig from "../../site.config.json";

const SITE = "https://bulkayurvedaproducts.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Start Your Project — Manufacturing Enquiry | Kairali",
  description:
    "One message to the KAPPL desk: category, model, scale. Back come the formulation conversation, sampling path and a direct project quote.",
  path: "/start-your-project",
}) as Metadata;

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/start-your-project#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Start your project", url: `${SITE}/start-your-project` },
    ],
  }),
);

export default function StartYourProject() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top" className="page-rfq">
        <PageIntro
          overline="Start your project"
          title="Tell us what you want to build"
          lede="Category, engagement model, scale — the KAPPL desk replies with the formulation conversation, sampling path and a direct project quote."
        />

        <section className="rfq-band" id="start" aria-labelledby="start-heading" style={{ marginTop: 32 }}>
          <div className="container">
            <p className="overline">The project intake</p>
            <h2 id="start-heading">One message starts the build</h2>
            <p className="rfq-lede">
              Prefer another channel? Email and WhatsApp reach the same desk.
            </p>
            <div className="rfq-grid">
              <div className="rfq-aside">
                <p className="rfq-fact"><strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></p>
                <p className="rfq-fact"><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a></p>
                <p className="rfq-fact"><strong>Models:</strong> Third party ×2 · Loan licence ×2 (as published)</p>
                <p className="rfq-fact"><strong>Categories:</strong> Oils · Cosmetics · Medicines · Shampoos &amp; soaps</p>
                <p className="rfq-fact"><strong>Facility:</strong> Pollachi — WHO-GMP · ISO · FSSAI (as published)</p>
              </div>
              <EnquiryForm
                site="bulkayurvedaproducts.com"
                formType="project-intake"
                subject="Manufacturing project enquiry"
                heading="Start your project"
                submitLabel="Send project enquiry"
              />
            </div>
          </div>
        </section>
      </main>

      <div className="sticky-cta" aria-label="Contact">
        <a className="btn btn-secondary" href={WHATSAPP_URL} data-cta="whatsapp-click">WhatsApp</a>
        <a className="btn btn-primary" href="#start" data-cta="rfq-open">Start your project</a>
      </div>
    </>
  );
}
