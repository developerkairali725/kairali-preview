// /how-it-works — process + MOQ guide/AEO page (STRATEGY §1 row 9).
// The published 30-day claim carried as-is; FAQ answered only where verified
// (HARD GATE 6). Question-form H2s + FAQPage schema (the Herbal Hills/AEO play).
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, faqPage, serializeJsonLd } from "@kairali/schema";
import { EMAIL, WHATSAPP_URL, PageIntro, CONTRACT_PAGE } from "../_components/chrome";
import { DOSAGE_FORMS } from "../_components/facts";
import siteConfig from "../../site.config.json";

const SITE = "https://bulkayurvedaproducts.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "How to Launch an Ayurvedic Brand — Process | Kairali",
  description:
    "The process honestly staged: enquiry, formulation, sampling you approve, production, dispatch. The published 30-day claim; MOQs per quote.",
  path: "/how-it-works",
}) as Metadata;

const STEPS = [
  { h: "Enquire", p: "Category, models of interest, scale — the intake form or info@kairali.com. No portal, no gate." },
  { h: "Formulation discussion", p: "Our R&D and your brief meet: formulation, dosage form, packing and the compliance path for your market." },
  { h: "Sampling", p: "You approve the product before any batch is committed — the risk leaves the decision before money enters it." },
  { h: "Production", p: "Manufactured at Pollachi under the published certifications, with in-house labs on the line." },
  { h: "Dispatch", p: "Batches dispatched to India and export markets, with the documentation your market needs." },
];

const FAQS = [
  {
    q: "How long does it take to launch a brand?",
    a: "\"Launch Your Own Brand in Just 30 Days\" — as published by KAPPL. Your project quote confirms the timeline for your formulation, pack and compliance path.",
  },
  {
    q: "What is the private-label MOQ?",
    a: "KAPPL publishes \"Low MOQs\"; the exact ladder is confirmed per project in the formulation discussion. This page prints no number it cannot stand behind — when the desk confirms real figures, they appear here.",
  },
  {
    q: "Which engagement model should I pick?",
    a: "Four published models: third party (our products — our packing or yours) and loan licence (your products, or your concept with our R&D). If you are not sure, say so in the enquiry — matching the model is the desk's first job.",
  },
  {
    q: "What products and dosage forms are possible?",
    a: `The published capability: oils, cosmetics, medicines, shampoos and soaps — across ${DOSAGE_FORMS.replaceAll(" · ", ", ")}.`,
  },
  {
    q: "What does it cost?",
    a: "Engagements are quoted per project — formulation, pack and scale decide it. No prices are published on this site by design; the quote conversation is where real figures live.",
  },
  {
    q: "Can I see the published offer for myself?",
    a: "Yes — KAPPL's contract-manufacturing page on the Kairali store carries the published offer, counters and downloadable catalogue and presentation.",
  },
];

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/how-it-works#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "How it works", url: `${SITE}/how-it-works` },
    ],
  }),
  faqPage({
    id: `${SITE}/how-it-works#faq`,
    questions: FAQS.map((f) => ({ question: f.q, answer: f.a })),
  }),
);

export default function HowItWorks() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="How it works"
          title="From brief to dispatched batch, honestly"
          lede="Five stages, one desk. Sampling sits before production on purpose: you approve the product before any batch is committed, and every figure a webpage cannot verify arrives in your quote, in writing."
        />

        <section className="section" aria-labelledby="steps-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">The process</p>
              <h2 id="steps-heading">Five stages to your product</h2>
            </div>
            <ol className="steps">
              {STEPS.map((s) => (
                <li className="step" key={s.h}>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </li>
              ))}
            </ol>
            <p className="step-claim">
              &ldquo;Launch Your Own Brand in Just 30 Days&rdquo; — as published
              by KAPPL. Low MOQs as published; the exact ladder is confirmed per
              project, never guessed here.
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="faq-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Asked before every launch</p>
              <h2 id="faq-heading">The founder questions, answered straight</h2>
            </div>
            <div className="faq">
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p className="faq-a">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="ledger-note">
              The published offer, catalogue and presentation downloads live on{" "}
              <a href={CONTRACT_PAGE} rel="noopener" data-cta="catalogue-download">
                KAPPL&rsquo;s contract-manufacturing page
              </a>
              &nbsp;— carried there as published; this desk adds the specialised
              depth and the direct conversation.
            </p>
            <div className="cross-desk">
              Need ready-made stock while your brand builds?{" "}
              <a href="https://www.bulkayurvedaoils.com" rel="noopener" data-cta="cross-desk">
                The supply desk quotes the live bulk range
              </a>
              .
            </div>
          </div>
        </section>

        <section className="rfq-band" id="start" aria-labelledby="start-heading">
          <div className="container">
            <p className="overline">Stage one</p>
            <h2 id="start-heading">Send the brief</h2>
            <p className="rfq-lede">
              Category, model, scale — one message starts the formulation
              conversation.
            </p>
            <p style={{ marginTop: 24 }}>
              <a className="btn btn-primary" href="/start-your-project" data-cta="rfq-open">Start your project</a>
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
        <a className="btn btn-primary" href="/start-your-project" data-cta="rfq-open">Start your project</a>
      </div>
    </>
  );
}
