// /for/distributors-importers — segment lane (STRATEGY §1 row 8). The KAPPL
// distribution lanes EXACTLY as published on kappl.co.in [OWN-4]: Retail ·
// Wholesale · Exclusive regional/country · PCD/franchise. Nothing added.
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, faqPage, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../../_components/chrome";
import siteConfig from "../../../site.config.json";

const SITE = "https://bulkayurvedaoils.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Ayurvedic Oils Distributor & Importer Desk | Kairali",
  description:
    "Become a Kairali distributor or importer — retail, wholesale, exclusive and PCD lanes as published by KAPPL. Public RFQ, no gated portal.",
  path: "/for/distributors-importers",
}) as Metadata;

// The four published distribution lanes [OWN-4] — carried as published.
const LANES = [
  { h: "Retail distribution", p: "Carry the Kairali range into retail and pharmacy shelves in your territory." },
  { h: "Wholesale distribution", p: "Volume supply for wholesalers serving clinics, spas and retailers." },
  { h: "Exclusive agreements", p: "Exclusive regional or country agreements, as KAPPL publishes them." },
  { h: "PCD / franchise basis", p: "The published PCD lane — franchise-model distribution for pharma-style networks." },
];

const FAQS = [
  {
    q: "How do I become a Kairali distributor?",
    a: "Raise your hand through the form on this page (or info@kairali.com / WhatsApp) with your territory, channel and scale. The KAPPL desk replies with the lane that fits — retail, wholesale, exclusive or PCD, as published — and the terms conversation starts from there.",
  },
  {
    q: "Do I need to register on a portal to see prices?",
    a: "No portal, no gate: this desk runs a public RFQ and answers with a direct manufacturer quote. Terms are settled in conversation, not behind a login.",
  },
  {
    q: "Which markets can import the range?",
    a: "Dispatch covers India and export markets, quoted direct. Destination-specific eligibility and documentation are confirmed in your quote — this page will not print a country list the desk has not verified.",
  },
  {
    q: "Who stands behind the product?",
    a: "Kairali Ayurvedic Products Pvt. Ltd. — the group's WHO-GMP-certified manufacturer at Pollachi, Tamil Nadu (certifications as published: WHO-GMP, ISO, FSSAI), practising Ayurveda since 1908 and formally founded in 1989.",
  },
];

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/for/distributors-importers#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Distributors & importers", url: `${SITE}/for/distributors-importers` },
    ],
  }),
  faqPage({
    id: `${SITE}/for/distributors-importers#faq`,
    questions: FAQS.map((f) => ({ question: f.q, answer: f.a })),
  }),
);

export default function DistributorsLane() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="For your business · Distributors & importers"
          title="Distribute a range the factory stands behind"
          lede="KAPPL publishes four distribution lanes — retail, wholesale, exclusive regional agreements and PCD. This desk is the public door to all four: a straight RFQ, a direct quote, and a certified manufacturer on the other end."
        />

        <section className="section" aria-labelledby="lanes-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">As published by KAPPL</p>
              <h2 id="lanes-heading">Four distribution lanes</h2>
            </div>
            <div className="lane-grid lane-grid-2">
              {LANES.map((l) => (
                <div className="lane-card" key={l.h}>
                  <h3>{l.h}</h3>
                  <p>{l.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="faq-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Before you sign anywhere</p>
              <h2 id="faq-heading">The distribution questions, answered straight</h2>
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
              Building your own brand rather than distributing ours?{" "}
              <a href="https://www.bulkayurvedaproducts.com" rel="noopener" data-cta="cross-desk">
                The manufacturing desk handles private label and contract manufacturing
              </a>
              .
            </div>
          </div>
        </section>

        <section className="rfq-band" id="rfq" aria-labelledby="rfq-heading">
          <div className="container">
            <p className="overline">Request a quote</p>
            <h2 id="rfq-heading">Open the distribution conversation</h2>
            <p className="rfq-lede">
              Territory, channel, scale — the KAPPL desk replies with the lane
              that fits and a direct quote basis.
            </p>
            <div className="rfq-grid">
              <div className="rfq-aside">
                <p className="rfq-fact"><strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></p>
                <p className="rfq-fact"><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a></p>
                <p className="rfq-fact"><strong>Lanes:</strong> Retail · Wholesale · Exclusive · PCD (as published)</p>
                <p className="rfq-fact"><strong>Dispatch:</strong> India &amp; export markets</p>
              </div>
              <EnquiryForm
                site="bulkayurvedaoils.com"
                formType="rfq"
                subject="Bulk supply quote — distributor / importer"
                heading="Request a distribution quote"
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
