// /services/private-label — family-B head service page (STRATEGY §1 row 2).
// White/private label end-to-end: the published offer [OWN-5] — formulation
// development, raw-material sourcing, production, packaging, QA. Service
// schema (quote model, no offers/price). Product-pharma register.
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, service, faqPage, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../../_components/chrome";
import { CAPABILITIES, DOSAGE_FORMS } from "../../_components/facts";
import siteConfig from "../../../site.config.json";

const SITE = "https://bulkayurvedaproducts.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Private Label Ayurvedic Products Manufacturer | Kairali",
  description:
    "Launch your Ayurvedic line without building a plant — formulation, sourcing, production, packaging and QA on KAPPL's WHO-GMP line. Quoted per project.",
  path: "/services/private-label",
}) as Metadata;

const STAGES = [
  { h: "Formulation development", p: "Your brief meets our R&D — classical basis or proprietary concept, developed into a manufacturable formulation." },
  { h: "Raw-material sourcing", p: "Sourcing handled on our side, with an in-house herb-extraction unit feeding the line." },
  { h: "Production", p: "Manufactured at Pollachi under the published certifications, with in-house laboratories on the line." },
  { h: "Packaging", p: "Finished under your pack and label — dispatch-ready cartons, your brand on the shelf." },
  { h: "Quality assurance", p: "QA is part of the published offer, not an extra — every batch leaves a certified pharma line." },
];

const FAQS = [
  {
    q: "What can be private-labelled?",
    a: "The published capability: Ayurvedic oils, Ayurvedic and herbal cosmetics, Ayurvedic and herbal medicines, and shampoos and soaps — across the published dosage forms (capsules, tablets, syrups and tonics, churnam, kwath, avaleham/lehyam, balms, lotions, powders).",
  },
  {
    q: "What is the MOQ for private label?",
    a: "KAPPL publishes \"Low MOQs\"; the exact ladder is confirmed per project in the formulation discussion — this site prints no figure it cannot stand behind.",
  },
  {
    q: "How fast can a brand launch?",
    a: "\"Launch Your Own Brand in Just 30 Days\" — as published by KAPPL. Your project quote confirms the timeline for your specific formulation and pack.",
  },
  {
    q: "Do I need my own manufacturing licences?",
    a: "That is exactly what the engagement models solve: private-label and third-party runs manufacture under KAPPL's licensed line; if you hold (or want) your own product approvals, the loan-licence models cover it.",
  },
];

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/services/private-label#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Private label", url: `${SITE}/services/private-label` },
    ],
  }),
  service({
    id: `${SITE}/services/private-label#service`,
    name: "Private label Ayurvedic products manufacturing",
    description:
      "End-to-end private/white label manufacturing of Ayurvedic and herbal products: formulation development, raw-material sourcing, production, packaging and QA at KAPPL's WHO-GMP-certified Pollachi facility.",
    url: `${SITE}/services/private-label`,
    providerId: `${SITE}/#organization`,
    serviceType: "Private label manufacturing",
    areaServed: "India and export markets",
  }),
  faqPage({
    id: `${SITE}/services/private-label#faq`,
    questions: FAQS.map((f) => ({ question: f.q, answer: f.a })),
  }),
);

export default function PrivateLabel() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="Services · Private label"
          title="Your label. The whole line behind it."
          lede="Private label at KAPPL is the full published offer — formulation development, raw-material sourcing, production, packaging and QA — so your brand launches from a WHO-GMP pharma line without you building one."
        />

        <section className="section" aria-labelledby="stages-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">End to end</p>
              <h2 id="stages-heading">Five stages, one roof</h2>
            </div>
            <ol className="steps">
              {STAGES.map((s) => (
                <li className="step" key={s.h}>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </li>
              ))}
            </ol>
            <p className="step-claim">
              &ldquo;Low MOQs&rdquo; and &ldquo;Launch Your Own Brand in Just 30
              Days&rdquo; — as published by KAPPL; exact figures confirmed per
              project, never guessed here.
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="cap-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">What can carry your label</p>
              <h2 id="cap-heading">The published capability</h2>
            </div>
            <div className="cap-grid">
              {CAPABILITIES.map((c) => (
                <div className="cap-card" key={c.slug}>
                  <h3>{c.h}</h3>
                  <p>{c.p}</p>
                </div>
              ))}
            </div>
            <p className="cap-forms">Dosage forms as published: {DOSAGE_FORMS}.</p>
          </div>
        </section>

        <section className="section" aria-labelledby="faq-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Asked by every founder</p>
              <h2 id="faq-heading">Private-label questions, answered straight</h2>
            </div>
            <div className="faq">
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p className="faq-a">{f.a}</p>
                </details>
              ))}
            </div>
            <div className="cross-desk">
              Need ready-made stock instead of your own label?{" "}
              <a href="https://www.bulkayurvedaoils.com" rel="noopener" data-cta="cross-desk">
                The supply desk quotes classical oils and powders in bulk
              </a>
              .
            </div>
          </div>
        </section>

        <section className="rfq-band" id="start" aria-labelledby="start-heading">
          <div className="container">
            <p className="overline">Start your project</p>
            <h2 id="start-heading">Bring the desk your brand brief</h2>
            <p className="rfq-lede">
              Category, dosage form, scale — the KAPPL desk replies with the
              formulation conversation and a direct project quote.
            </p>
            <div className="rfq-grid">
              <div className="rfq-aside">
                <p className="rfq-fact"><strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></p>
                <p className="rfq-fact"><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a></p>
                <p className="rfq-fact"><strong>Offer:</strong> Formulation → sourcing → production → packaging → QA</p>
                <p className="rfq-fact"><strong>Facility:</strong> Pollachi, Tamil Nadu — WHO-GMP · ISO · FSSAI (as published)</p>
              </div>
              <EnquiryForm
                site="bulkayurvedaproducts.com"
                formType="project-intake"
                subject="Manufacturing project enquiry — private label"
                heading="Start your private-label project"
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
