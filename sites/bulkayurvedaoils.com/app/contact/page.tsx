// /contact — locked contact only (STRATEGY §1 row 12; CLAUDE.md locked facts:
// info@kairali.com, interim WhatsApp +91 92898 38797 flagged for swap).
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../_components/chrome";
import siteConfig from "../../site.config.json";

const SITE = "https://bulkayurvedaoils.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Contact the Bulk Supply Desk | Kairali",
  description:
    "Reach the KAPPL bulk-supply desk: info@kairali.com or WhatsApp +91 92898 38797. For bulk quotes, the RFQ form gets a direct reply.",
  path: "/contact",
}) as Metadata;

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/contact#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Contact", url: `${SITE}/contact` },
    ],
  }),
);

export default function Contact() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="Contact"
          title="Two channels, one desk"
          lede="Every enquiry lands on the same KAPPL desk — pick the channel your workflow prefers. For a bulk quote, the RFQ form carries everything the desk needs in one message."
        />

        <section className="section" aria-labelledby="channels-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Channels</p>
              <h2 id="channels-heading">Reach the desk</h2>
            </div>
            <div className="lane-grid">
              <div className="lane-card">
                <h3>Email</h3>
                <p>The group&rsquo;s one public address — enquiries answered by the KAPPL desk.</p>
                <p className="lane-go">
                  <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL} &rarr;</a>
                </p>
              </div>
              <div className="lane-card">
                <h3>WhatsApp</h3>
                <p>Message the desk directly — the channel most bulk buyers in this niche reach for first.</p>
                <p className="lane-go">
                  <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797 &rarr;</a>
                </p>
              </div>
              <div className="lane-card">
                <h3>Request a quote</h3>
                <p>Formulations, quantities, destination — the structured way to a direct manufacturer quote.</p>
                <p className="lane-go">
                  <a href="/request-a-quote" data-cta="rfq-open">Open the RFQ &rarr;</a>
                </p>
              </div>
            </div>
            <p className="ledger-note">
              The manufacturer: Kairali Ayurvedic Products Pvt. Ltd., Pollachi,
              Tamil Nadu — corporate depth at{" "}
              <a href="https://kappl.co.in" rel="noopener" data-cta="corporate-link">kappl.co.in</a>.
            </p>
          </div>
        </section>
      </main>

      <div className="sticky-cta" aria-label="Contact">
        <a className="btn btn-secondary" href={WHATSAPP_URL} data-cta="whatsapp-click">WhatsApp</a>
        <a className="btn btn-primary" href="/request-a-quote" data-cta="rfq-open">Get a bulk quote</a>
      </div>
    </>
  );
}
