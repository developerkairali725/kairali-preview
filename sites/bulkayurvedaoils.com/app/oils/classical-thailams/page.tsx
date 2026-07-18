// /oils/classical-thailams — category page (STRATEGY §1 row 3). The live bulk
// collection's four thailams [OWN-6], therapy-CONTEXT framing only (product-
// pharma register: classical practice, never disease/cure claims).
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, STORE_BULK_COLLECTION, PageIntro } from "../../_components/chrome";
import { THAILAMS, OIL_PACK } from "../../_components/catalog";
import siteConfig from "../../../site.config.json";

const SITE = "https://bulkayurvedaoils.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Ayurvedic Thailam Bulk — Classical Oils in 5 L | Kairali",
  description:
    "Four classical Kerala thailams in 5-litre bulk cans from WHO-GMP-certified KAPPL — wholesale supply for therapy practice, quoted direct.",
  path: "/oils/classical-thailams",
}) as Metadata;

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/oils/classical-thailams#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Oils & powders", url: `${SITE}/oils` },
      { name: "Classical thailams", url: `${SITE}/oils/classical-thailams` },
    ],
  }),
);

export default function ClassicalThailams() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="Oils & powders · Classical thailams"
          title="Classical thailams, by the 5-litre can"
          lede="The classical oils of Kerala practice — prepared to their traditional formulations on KAPPL's certified line, and supplied at the volumes abhyanga and Panchakarma programmes actually use."
        />

        <section className="section" aria-labelledby="range-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">The live range</p>
              <h2 id="range-heading">Four formulations, verified packs</h2>
              <p>
                These are the classical thailams the live wholesale collection
                carries today — each a named formulation of the Ayurvedic
                pharmacopoeia, used in professional therapy practice under the
                guidance of a qualified physician. Per-formulation depth pages
                follow as they are written; nothing ships as a thin stub.
              </p>
            </div>
            <div className="ledger-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th scope="col">Formulation</th>
                    <th scope="col">Form</th>
                    <th scope="col">Bulk pack</th>
                  </tr>
                </thead>
                <tbody>
                  {THAILAMS.map((t) => (
                    <tr key={t}>
                      <td>{t}</td>
                      <td>Classical thailam (oil)</td>
                      <td className="pack">{OIL_PACK}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="ledger-note">
              Retail-size listings of the classical range live on the{" "}
              <a href={STORE_BULK_COLLECTION} rel="noopener" data-cta="storefront-handoff">
                Kairali store
              </a>
              . Bulk cans are quoted direct from the factory — minimums and lead
              times confirmed per formulation in your quote.
            </p>
          </div>
        </section>

        <section className="rfq-band" id="rfq" aria-labelledby="rfq-heading">
          <div className="container">
            <p className="overline">Request a quote</p>
            <h2 id="rfq-heading">Quote classical thailams in bulk</h2>
            <p className="rfq-lede">
              Formulations, quantities, destination — the KAPPL desk replies
              with a direct quote and the documentation your purchase process needs.
            </p>
            <div className="rfq-grid">
              <div className="rfq-aside">
                <p className="rfq-fact"><strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></p>
                <p className="rfq-fact"><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a></p>
                <p className="rfq-fact"><strong>Pack:</strong> {OIL_PACK}</p>
                <p className="rfq-fact"><strong>Dispatch:</strong> India &amp; export markets</p>
              </div>
              <EnquiryForm
                site="bulkayurvedaoils.com"
                formType="rfq"
                subject="Bulk supply quote — classical thailams"
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
