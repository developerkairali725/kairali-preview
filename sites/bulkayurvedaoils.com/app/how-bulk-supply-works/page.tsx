// /how-bulk-supply-works — the guide/AEO page (STRATEGY §1 row 10).
// Question-form H2s + FAQPage schema, answered ONLY where a verified answer
// exists (niche brief §4 AEO layer; HARD GATE 6: no invented MOQs/lead times).
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, faqPage, serializeJsonLd } from "@kairali/schema";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../_components/chrome";
import { OIL_PACK, POWDER_PACK } from "../_components/catalog";
import siteConfig from "../../site.config.json";

const SITE = "https://bulkayurvedaoils.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "How to Buy Ayurvedic Oils in Bulk | Kairali KAPPL",
  description:
    "The bulk-supply process, honestly: enquiry, direct manufacturer quote, batch dispatch. Verified pack formats; MOQs confirmed per quote.",
  path: "/how-bulk-supply-works",
}) as Metadata;

const STEPS = [
  {
    h: "Send your requirement",
    p: "Formulations, quantities, destination. The RFQ form, WhatsApp, or info@kairali.com — whichever your desk prefers. No portal, no registration wall.",
  },
  {
    h: "Quote & documentation",
    p: "The KAPPL desk quotes direct from the Pollachi facility — pack formats, per-formulation minimums, and the documentation your purchase process needs, confirmed in writing.",
  },
  {
    h: "Batch dispatch",
    p: "Bulk packs dispatched to India and export markets. Lead times are part of your quote — real figures from the desk, never guessed on a webpage.",
  },
];

const FAQS = [
  {
    q: "What pack sizes do bulk Ayurvedic oils come in?",
    a: "The verified formats of the live wholesale collection: classical thailams in 5-litre cans; therapy powders and choornams in 500 g – 1 kg packs.",
  },
  {
    q: "What is the minimum order quantity (MOQ)?",
    a: "Minimums are confirmed per formulation in your quote. This site deliberately publishes no MOQ ladder it cannot stand behind — when the desk confirms the real figures, they will be printed here.",
  },
  {
    q: "Is there a price list?",
    a: "No. Bulk supply runs on the quote model: the desk answers a specific requirement with a direct manufacturer quote. No prices appear anywhere on this site by design.",
  },
  {
    q: "Who manufactures the oils, and where?",
    a: "Kairali Ayurvedic Products Pvt. Ltd. (KAPPL), at Pollachi, Tamil Nadu — with in-house laboratories and an in-house herb-extraction unit. Certifications as published: WHO-GMP, ISO, FSSAI.",
  },
  {
    q: "Do you supply outside India?",
    a: "Yes — dispatch covers India and export markets, quoted direct. Destination documentation is confirmed with your quote.",
  },
  {
    q: "Can I buy retail quantities instead?",
    a: "Retail listings live on the Kairali store's wholesale collection — this desk exists for bulk supply. If you need shelf-size packs, the store checkout is the right lane.",
  },
];

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/how-bulk-supply-works#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "How bulk supply works", url: `${SITE}/how-bulk-supply-works` },
    ],
  }),
  faqPage({
    id: `${SITE}/how-bulk-supply-works#faq`,
    questions: FAQS.map((f) => ({ question: f.q, answer: f.a })),
  }),
);

export default function HowBulkSupplyWorks() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="How it works"
          title="From enquiry to batch dispatch, honestly"
          lede="Three steps, no theatre: tell the desk what you need, get a direct manufacturer quote with real figures, receive the batch. Everything a webpage cannot verify — minimums, lead times, destination terms — arrives in the quote, in writing."
        />

        <section className="section" aria-labelledby="steps-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">The process</p>
              <h2 id="steps-heading">Three steps to a dispatched batch</h2>
            </div>
            <ol className="steps">
              {STEPS.map((s) => (
                <li className="step" key={s.h}>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" aria-labelledby="packs-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">The verified formats</p>
              <h2 id="packs-heading">Pack formats you can plan around</h2>
            </div>
            <div className="ledger-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Bulk pack</th>
                    <th scope="col">Minimums &amp; lead time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Classical thailams &amp; proprietary oils</td>
                    <td className="pack">{OIL_PACK}</td>
                    <td>Confirmed per formulation in your quote</td>
                  </tr>
                  <tr>
                    <td>Therapy powders &amp; choornams</td>
                    <td className="pack">{POWDER_PACK}</td>
                    <td>Confirmed per preparation in your quote</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="ledger-note">
              The blank cells this niche usually fakes — MOQ ladders, lead-time
              promises, export-country lists — stay blank here until the desk
              confirms real figures. Honest blanks beat confident guesses.
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="faq-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Asked before every first order</p>
              <h2 id="faq-heading">Bulk-supply questions, answered straight</h2>
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

        <section className="rfq-band" id="rfq" aria-labelledby="rfq-heading">
          <div className="container">
            <p className="overline">Step one</p>
            <h2 id="rfq-heading">Send the requirement</h2>
            <p className="rfq-lede">
              The whole process starts with one message — formulations,
              quantities, destination.
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
