// /services/loan-licence — the lane most competitors bury (STRATEGY §1 row 4).
// The two published Loan-Licence models, canonical wording [OWN-5]. Service
// schema, quote model.
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, service, faqPage, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../../_components/chrome";
import { MODELS } from "../../_components/facts";
import siteConfig from "../../../site.config.json";

const SITE = "https://bulkayurvedaproducts.com";
const LL_MODELS = MODELS.filter((m) => m.lane === "Loan licence");

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Loan Licence Ayurvedic Manufacturing | Kairali KAPPL",
  description:
    "Your approved Ayurvedic products manufactured on KAPPL's licensed WHO-GMP line — the two published loan-licence models. Quoted per project.",
  path: "/services/loan-licence",
}) as Metadata;

const FAQS = [
  {
    q: "What is loan-licence manufacturing?",
    a: "You hold (or are obtaining) your own product approvals; KAPPL's licensed WHO-GMP facility manufactures them for you. The published models: your products under your brand and packing, or your concept developed by our R&D into your brand's product.",
  },
  {
    q: "Who is the loan-licence lane for?",
    a: "Brands with their own formulations and approvals that need a certified plant — and founders whose concept needs R&D development before it can be approved and manufactured.",
  },
  {
    q: "What does KAPPL's side include?",
    a: "The licensed line at Pollachi with in-house laboratories, the in-house herb-extraction unit and R&D — production under the published certifications: WHO-GMP, ISO, FSSAI.",
  },
  {
    q: "What does it cost?",
    a: "Loan-licence engagements are quoted per project — scope, batch sizes and terms are settled in the project conversation. No prices are published on this site by design.",
  },
];

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/services/loan-licence#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Loan licence", url: `${SITE}/services/loan-licence` },
    ],
  }),
  service({
    id: `${SITE}/services/loan-licence#service`,
    name: "Loan-licence Ayurvedic manufacturing",
    description:
      "Manufacture of your approved Ayurvedic products on KAPPL's licensed WHO-GMP line — the two published loan-licence models: your products/your brand/your packing, and your concept/our R&D/your brand.",
    url: `${SITE}/services/loan-licence`,
    providerId: `${SITE}/#organization`,
    serviceType: "Loan-licence manufacturing",
    areaServed: "India and export markets",
  }),
  faqPage({
    id: `${SITE}/services/loan-licence#faq`,
    questions: FAQS.map((f) => ({ question: f.q, answer: f.a })),
  }),
);

export default function LoanLicence() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="Services · Loan licence"
          title="Your approvals. Our licensed line."
          lede="Most contract manufacturers bury this lane; KAPPL publishes it. If your products — or your concept — need a licensed WHO-GMP facility rather than a whole factory of your own, the two loan-licence models below are the published doors."
        />

        <section className="section" aria-labelledby="models-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">As published by KAPPL</p>
              <h2 id="models-heading">The two loan-licence models</h2>
            </div>
            <div className="model-grid">
              {LL_MODELS.map((m) => (
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
            <div className="cross-desk">
              No approvals of your own yet?{" "}
              <a href="/services/private-label" data-cta="cross-desk">
                Private label launches your brand on KAPPL&rsquo;s formulations and licences
              </a>
              .
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="faq-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">The lane explained</p>
              <h2 id="faq-heading">Loan-licence questions, answered straight</h2>
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
            <h2 id="start-heading">Bring your approvals — or your concept</h2>
            <p className="rfq-lede">
              Describe the products, the approvals you hold and the scale — the
              KAPPL desk replies with the compliance path and a direct quote.
            </p>
            <div className="rfq-grid">
              <div className="rfq-aside">
                <p className="rfq-fact"><strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></p>
                <p className="rfq-fact"><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a></p>
                <p className="rfq-fact"><strong>Models:</strong> Your products / your concept + our R&amp;D (as published)</p>
                <p className="rfq-fact"><strong>Facility:</strong> Pollachi — WHO-GMP · ISO · FSSAI (as published)</p>
              </div>
              <EnquiryForm
                site="bulkayurvedaproducts.com"
                formType="project-intake"
                subject="Manufacturing project enquiry — loan licence"
                heading="Start your loan-licence project"
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
