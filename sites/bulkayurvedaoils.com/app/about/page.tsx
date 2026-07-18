// /about — the KAPPL story (STRATEGY §1 row 12). 1908/1989 framing EXACTLY as
// published (D-1908 / D-LIN-1989-WORDING canonical forms); product-pharma
// register; locked contact only.
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../_components/chrome";
import siteConfig from "../../site.config.json";

const SITE = "https://bulkayurvedaoils.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "About the KAPPL Bulk Supply Desk | Kairali",
  description:
    "The bulk-supply desk of Kairali Ayurvedic Products Pvt. Ltd. — the group's WHO-GMP manufacturer at Pollachi. Practising since 1908, founded 1989.",
  path: "/about",
}) as Metadata;

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/about#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "About", url: `${SITE}/about` },
    ],
  }),
);

export default function About() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="About"
          title="A supply desk with a factory behind it"
          lede="bulkayurvedaoils.com is the bulk-supply desk of Kairali Ayurvedic Products Pvt. Ltd. (KAPPL) — the Kairali Ayurvedic Group's WHO-GMP-certified manufacturer at Pollachi, Tamil Nadu."
        />

        <section className="section" aria-labelledby="story-heading">
          <div className="container">
            <div className="prose">
              <h2 id="story-heading">Four generations of Ayurvedic manufacture</h2>
              <p>
                The Kairali family has practised Ayurveda since 1908; the group
                was formally founded in 1989. What began as a physician&rsquo;s
                practice is today a group spanning treatment, hospitality and
                manufacture — with KAPPL as its pharmaceutical arm: a certified
                production line, in-house laboratories, an in-house
                herb-extraction unit and R&amp;D on one Pollachi campus.
              </p>
              <p>
                This desk exists for one job: putting that line&rsquo;s classical
                thailams, proprietary oils and therapy powders into the hands of
                the businesses that use them at volume — spas and hotels,
                panchakarma centres and clinics, distributors and importers —
                without a trading layer in between. Certifications are carried
                exactly as KAPPL publishes them: WHO-GMP, ISO, FSSAI.
              </p>
              <p>
                Retail buyers are best served by the Kairali store; brand
                builders by the group&rsquo;s manufacturing desk at
                bulkayurvedaproducts.com. Bulk buyers start here, with a quote.
              </p>
            </div>
            <div className="cross-desk">
              The wider group:{" "}
              <a href="https://kappl.co.in" rel="noopener" data-cta="corporate-link">KAPPL corporate</a>
              {" · "}
              <a href="https://www.kairali.com" rel="noopener">Kairali Ayurvedic Group</a>
              {" · "}
              <a href="https://www.bulkayurvedaproducts.com" rel="noopener" data-cta="cross-desk">Private label &amp; contract manufacturing</a>
            </div>
          </div>
        </section>

        <section className="rfq-band" id="rfq" aria-labelledby="rfq-heading">
          <div className="container">
            <p className="overline">Work with the desk</p>
            <h2 id="rfq-heading">Start with a quote</h2>
            <p className="rfq-lede">
              Formulations, quantities, destination — a direct quote comes back.
            </p>
            <p style={{ marginTop: 24 }}>
              <a className="btn btn-primary" href="/request-a-quote" data-cta="rfq-open">Get a bulk quote</a>
            </p>
            <p className="rfq-fact" style={{ marginTop: 18 }}>
              <strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a>
              &ensp;·&ensp;
              <strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a>
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
