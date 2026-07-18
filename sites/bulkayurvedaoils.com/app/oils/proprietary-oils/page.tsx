// /oils/proprietary-oils — category page (STRATEGY §1 row 4). HARD GATE 6
// honesty: the store PUBLISHES a proprietary-oils wholesale-bulk collection
// [OWN-7], but its product list is not machine-verifiable today (products.json
// empty, checked 18 Jul 2026) — so this page describes and links the published
// collection and names NO SKUs. The ledger fills when verified names land.
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../../_components/chrome";
import { STORE_PROPRIETARY_COLLECTION } from "../../_components/catalog";
import siteConfig from "../../../site.config.json";

const SITE = "https://bulkayurvedaoils.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Ayurvedic Massage Oil Bulk — Proprietary Oils | Kairali",
  description:
    "Kairali's proprietary Ayurvedic oils in wholesale bulk packaging — massage oil supply for spas and clinics, quoted direct from Pollachi.",
  path: "/oils/proprietary-oils",
}) as Metadata;

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/oils/proprietary-oils#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Oils & powders", url: `${SITE}/oils` },
      { name: "Proprietary oils", url: `${SITE}/oils/proprietary-oils` },
    ],
  }),
);

export default function ProprietaryOils() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="Oils & powders · Proprietary oils"
          title="Kairali's own oils, in wholesale bulk packaging"
          lede="Alongside the classical pharmacopoeia, Kairali develops and manufactures its own proprietary oil formulations — massage and abhyanga oils supplied to spas, hotels and clinics in bulk packaging, from the same certified Pollachi line."
        />

        <section className="section" aria-labelledby="prop-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">The published collection</p>
              <h2 id="prop-heading">The store already sells this range wholesale</h2>
              <p>
                The Kairali store publishes a dedicated collection —
                &ldquo;Ayurvedic Proprietary Oils, Wholesale Bulk
                Packaging&rdquo; — and this desk quotes the same range direct
                from the manufacturer. An honest note: we list formulation names
                here only once they are verified against the live collection,
                so this ledger states the category, not a guessed inventory.
                Tell the desk what your practice uses and it will quote against
                the current range.
              </p>
            </div>
            <p className="ledger-note">
              Browse the published range on the{" "}
              <a href={STORE_PROPRIETARY_COLLECTION} rel="noopener" data-cta="storefront-handoff">
                store&rsquo;s proprietary-oils wholesale collection
              </a>
              &nbsp;— then quote it in bulk here, direct from the factory.
            </p>
            <div className="cross-desk">
              Want a proprietary formulation under your OWN brand?{" "}
              <a href="https://www.bulkayurvedaproducts.com" rel="noopener" data-cta="cross-desk">
                The manufacturing desk develops private-label oils
              </a>
              &nbsp;— formulation to dispatch.
            </div>
          </div>
        </section>

        <section className="rfq-band" id="rfq" aria-labelledby="rfq-heading">
          <div className="container">
            <p className="overline">Request a quote</p>
            <h2 id="rfq-heading">Quote proprietary oils in bulk</h2>
            <p className="rfq-lede">
              Name the oils your programme uses, or describe the therapy need —
              the KAPPL desk replies with the current range and a direct quote.
            </p>
            <div className="rfq-grid">
              <div className="rfq-aside">
                <p className="rfq-fact"><strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></p>
                <p className="rfq-fact"><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a></p>
                <p className="rfq-fact"><strong>Range:</strong> As published on the store&rsquo;s wholesale collection</p>
                <p className="rfq-fact"><strong>Dispatch:</strong> India &amp; export markets</p>
              </div>
              <EnquiryForm
                site="bulkayurvedaoils.com"
                formType="rfq"
                subject="Bulk supply quote — proprietary oils"
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
