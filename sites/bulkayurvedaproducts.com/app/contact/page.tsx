// /contact — locked contact only (STRATEGY §1 row 11; CLAUDE.md locked facts:
// info@kairali.com, interim WhatsApp +91 92898 38797 flagged for swap).
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../_components/chrome";
import siteConfig from "../../site.config.json";

const SITE = "https://bulkayurvedaproducts.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Contact the Manufacturing Desk | Kairali",
  description:
    "Reach the KAPPL manufacturing desk: info@kairali.com or WhatsApp +91 92898 38797. The intake form starts the project conversation.",
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
          lede="Every enquiry lands on the same KAPPL desk — pick the channel your workflow prefers. For a manufacturing project, the intake form carries everything the desk needs in one message."
        />

        <section className="section" aria-labelledby="channels-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Channels</p>
              <h2 id="channels-heading">Reach the desk</h2>
            </div>
            <div className="cap-grid">
              <div className="cap-card">
                <h3>Email</h3>
                <p>The group&rsquo;s one public address — enquiries answered by the KAPPL desk.</p>
                <p style={{ marginTop: 14 }}>
                  <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL} &rarr;</a>
                </p>
              </div>
              <div className="cap-card">
                <h3>WhatsApp</h3>
                <p>Message the desk directly — India&rsquo;s B2B channel of first resort.</p>
                <p style={{ marginTop: 14 }}>
                  <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797 &rarr;</a>
                </p>
              </div>
              <div className="cap-card">
                <h3>Start a project</h3>
                <p>Category, engagement model, scale — the structured way into the formulation conversation.</p>
                <p style={{ marginTop: 14 }}>
                  <a href="/start-your-project" data-cta="rfq-open">Open the intake &rarr;</a>
                </p>
              </div>
              <div className="cap-card">
                <h3>Corporate</h3>
                <p>The manufacturer behind the desk: KAPPL, Pollachi, Tamil Nadu — certificates published.</p>
                <p style={{ marginTop: 14 }}>
                  <a href="https://kappl.co.in" rel="noopener" data-cta="corporate-link">kappl.co.in &rarr;</a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="sticky-cta" aria-label="Contact">
        <a className="btn btn-secondary" href={WHATSAPP_URL} data-cta="whatsapp-click">WhatsApp</a>
        <a className="btn btn-primary" href="/start-your-project" data-cta="rfq-open">Start your project</a>
      </div>
    </>
  );
}
