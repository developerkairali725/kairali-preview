// /oils/therapy-powders-choornams — category page (STRATEGY §1 row 5).
// Seven verified powders [OWN-6]; the reserved real photograph
// (therapy-choornams.jpg, per IMAGE_MANIFEST) lands here as planned.
import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, STORE_BULK_COLLECTION, PageIntro } from "../../_components/chrome";
import { POWDERS, POWDER_PACK } from "../../_components/catalog";
import siteConfig from "../../../site.config.json";

const SITE = "https://bulkayurvedaoils.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Ayurvedic Powder Bulk — Choornams & Kizhi | Kairali",
  description:
    "Udwarthanam, kizhi and classical choornams in 500 g – 1 kg bulk packs — therapy-volume supply for panchakarma practice, quoted direct.",
  path: "/oils/therapy-powders-choornams",
}) as Metadata;

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/oils/therapy-powders-choornams#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Oils & powders", url: `${SITE}/oils` },
      { name: "Therapy powders & choornams", url: `${SITE}/oils/therapy-powders-choornams` },
    ],
  }),
);

export default function TherapyPowders() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="Oils & powders · Therapy powders"
          title="The powders that work alongside the oils"
          lede="Udwarthanam, kizhi and classical choornams — the dry preparations of Kerala therapy practice, milled and packed on the same certified line, in the 500 g – 1 kg packs the live collection carries."
        />

        <section className="section" aria-labelledby="powders-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">The live range</p>
              <h2 id="powders-heading">Seven preparations, verified packs</h2>
              <p>
                Each is a named preparation used in professional therapy
                practice — supplied for use under the guidance of a qualified
                physician, batch after batch.
              </p>
            </div>
            <div className="ledger-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th scope="col">Preparation</th>
                    <th scope="col">Form</th>
                    <th scope="col">Bulk pack</th>
                  </tr>
                </thead>
                <tbody>
                  {POWDERS.map((p) => (
                    <tr key={p}>
                      <td>{p}</td>
                      <td>Therapy powder / choornam</td>
                      <td className="pack">{POWDER_PACK}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="ledger-note">
              Retail listings live on the{" "}
              <a href={STORE_BULK_COLLECTION} rel="noopener" data-cta="storefront-handoff">
                Kairali store&rsquo;s wholesale collection
              </a>
              . Bulk packs are quoted direct — minimums confirmed per
              preparation in your quote.
            </p>
            <figure className="hero-photo" style={{ minHeight: 280, marginTop: 26 }}>
              <Image
                src="/images/therapy-choornams.jpg"
                alt="Kairali classical choornam jars — the therapy-powder range manufactured at Pollachi"
                width={1800}
                height={1200}
                sizes="(min-width: 1000px) 60vw, 100vw"
              />
              <figcaption>The classical choornam range — real product photography, Pollachi-manufactured.</figcaption>
            </figure>
          </div>
        </section>

        <section className="rfq-band" id="rfq" aria-labelledby="rfq-heading">
          <div className="container">
            <p className="overline">Request a quote</p>
            <h2 id="rfq-heading">Quote therapy powders in bulk</h2>
            <p className="rfq-lede">
              Preparations, quantities, destination — the KAPPL desk replies
              with a direct quote and the documentation your purchase process needs.
            </p>
            <div className="rfq-grid">
              <div className="rfq-aside">
                <p className="rfq-fact"><strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></p>
                <p className="rfq-fact"><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a></p>
                <p className="rfq-fact"><strong>Pack:</strong> {POWDER_PACK}</p>
                <p className="rfq-fact"><strong>Dispatch:</strong> India &amp; export markets</p>
              </div>
              <EnquiryForm
                site="bulkayurvedaoils.com"
                formType="rfq"
                subject="Bulk supply quote — therapy powders"
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
