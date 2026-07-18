// /services/third-party-manufacturing — contract lane (STRATEGY §1 row 3).
// The two published Third-Party models lead with canonical wording [OWN-5]
// (guards-pinned). Service schema, quote model.
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, service, faqPage, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../../_components/chrome";
import { MODELS, DOSAGE_FORMS } from "../../_components/facts";
import siteConfig from "../../../site.config.json";

const SITE = "https://bulkayurvedaproducts.com";
const TP_MODELS = MODELS.filter((m) => m.lane === "Third party");

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Third Party Manufacturing Ayurvedic — KAPPL | Kairali",
  description:
    "Ayurvedic contract manufacturing on a WHO-GMP line — KAPPL's two published third-party models, ready for your market or your label. Quoted per project.",
  path: "/services/third-party-manufacturing",
}) as Metadata;

const FAQS = [
  {
    q: "What is third-party (contract) manufacturing at KAPPL?",
    a: "KAPPL manufactures on your behalf on its licensed WHO-GMP line at Pollachi. Two published models: our products in our packing (supplied ready for your market), or our products finished under your own pack and label.",
  },
  {
    q: "How is this different from private label?",
    a: "Third party runs on KAPPL's proven formulations; private label extends into your own brief — formulation development, sourcing, production, packaging and QA end-to-end. If you want your own approved products manufactured, that is the loan-licence lane.",
  },
  {
    q: "What is the minimum batch?",
    a: "KAPPL publishes \"Low MOQs\"; your quote confirms the real figure per product and pack — nothing is guessed on this page.",
  },
  {
    q: "Which product categories qualify?",
    a: "The published capability: oils, cosmetics, medicines, shampoos and soaps, across the published dosage forms.",
  },
];

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/services/third-party-manufacturing#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Third-party manufacturing", url: `${SITE}/services/third-party-manufacturing` },
    ],
  }),
  service({
    id: `${SITE}/services/third-party-manufacturing#service`,
    name: "Third-party (contract) manufacturing of Ayurvedic products",
    description:
      "Contract manufacturing on KAPPL's WHO-GMP-certified Pollachi line — the two published third-party models: our products/our packing and our products/your packing.",
    url: `${SITE}/services/third-party-manufacturing`,
    providerId: `${SITE}/#organization`,
    serviceType: "Contract manufacturing",
    areaServed: "India and export markets",
  }),
  faqPage({
    id: `${SITE}/services/third-party-manufacturing#faq`,
    questions: FAQS.map((f) => ({ question: f.q, answer: f.a })),
  }),
);

export default function ThirdParty() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="Services · Third-party manufacturing"
          title="A certified line, working as yours"
          lede="Contract manufacturing at KAPPL means your market gets pharma-line product without your capex: the two published third-party models below, quoted per project from the Pollachi facility."
        />

        <section className="section" aria-labelledby="models-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">As published by KAPPL</p>
              <h2 id="models-heading">The two third-party models</h2>
            </div>
            <div className="model-grid">
              {TP_MODELS.map((m) => (
                <div className="model-tile" key={m.name}>
                  <p className="m-lane">{m.lane}</p>
                  <h3>{m.name}</h3>
                  <p>{m.desc}</p>
                  <p className="m-go">
                    <a href="#start" data-cta="model-select">Start with this model &rarr;</a>
                  </p>
                </div>
              ))}
            </div>
            <p className="cap-forms">Dosage forms as published: {DOSAGE_FORMS}.</p>
            <div className="cross-desk">
              Hold your own product approvals?{" "}
              <a href="/services/loan-licence" data-cta="cross-desk">
                The loan-licence models manufacture YOUR products on our licensed line
              </a>
              .
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="faq-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Before the first batch</p>
              <h2 id="faq-heading">Contract-manufacturing questions, answered straight</h2>
            </div>
            <div className="faq">
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p className="faq-a">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="rfq-band" id="start" aria-labelledby="start-heading">
          <div className="container">
            <p className="overline">Start your project</p>
            <h2 id="start-heading">Name the products and the scale</h2>
            <p className="rfq-lede">
              Category, model, quantities — the KAPPL desk replies with sampling
              path and a direct project quote.
            </p>
            <div className="rfq-grid">
              <div className="rfq-aside">
                <p className="rfq-fact"><strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></p>
                <p className="rfq-fact"><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a></p>
                <p className="rfq-fact"><strong>Models:</strong> Our products · our packing / your packing (as published)</p>
                <p className="rfq-fact"><strong>Facility:</strong> Pollachi — WHO-GMP · ISO · FSSAI (as published)</p>
              </div>
              <EnquiryForm
                site="bulkayurvedaproducts.com"
                formType="project-intake"
                subject="Manufacturing project enquiry — third party"
                heading="Start your third-party project"
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
