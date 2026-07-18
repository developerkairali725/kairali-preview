// /for/spas-hotels-resorts — segment lane (STRATEGY §1 row 6). The store
// already speaks to this lane ("Hotel, Resort & Spa Supply" page [OWN-7]);
// FAQ answers carry ONLY verified register facts.
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, faqPage, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../../_components/chrome";
import { OIL_PACK, POWDER_PACK } from "../../_components/catalog";
import siteConfig from "../../../site.config.json";

const SITE = "https://bulkayurvedaoils.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Massage Oil Supplier for Spas, Hotels & Resorts | Kairali",
  description:
    "Provision abhyanga and shirodhara programmes at therapy volume — classical oils in 5 L cans, manufacturer-direct from WHO-GMP-certified KAPPL.",
  path: "/for/spas-hotels-resorts",
}) as Metadata;

const FAQS = [
  {
    q: "What pack formats do treatment programmes get?",
    a: "Classical thailams come in 5-litre cans; therapy powders and choornams in 500 g – 1 kg packs — the formats published on the live wholesale collection. Minimums are confirmed per formulation in your quote, never guessed here.",
  },
  {
    q: "Who actually manufactures the oils?",
    a: "Kairali Ayurvedic Products Pvt. Ltd. (KAPPL) manufactures at Pollachi, Tamil Nadu, with in-house laboratories and an in-house herb-extraction unit. Certifications — WHO-GMP, ISO, FSSAI — are carried exactly as KAPPL publishes them.",
  },
  {
    q: "Do you ship outside India?",
    a: "Yes — dispatch covers India and export markets, quoted direct. Destination-specific terms and documentation are confirmed in your quote.",
  },
  {
    q: "Is there a published price list?",
    a: "No — bulk supply runs on the quote model. Tell the desk your formulations, quantities and destination, and it replies with a direct manufacturer quote.",
  },
];

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/for/spas-hotels-resorts#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Spas, hotels & resorts", url: `${SITE}/for/spas-hotels-resorts` },
    ],
  }),
  faqPage({
    id: `${SITE}/for/spas-hotels-resorts#faq`,
    questions: FAQS.map((f) => ({ question: f.q, answer: f.a })),
  }),
);

export default function SpasLane() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="For your business · Spas, hotels & resorts"
          title="Provision your treatment menu from the manufacturer"
          lede="Abhyanga, shirodhara, udwarthanam — a spa menu runs on oils and powders at volume. This desk supplies the same classical formulations the Kairali group manufactures, in 5-litre cans and kilogram packs, quoted direct. No trading layer, no repacked stock."
        />

        <section className="section" aria-labelledby="fit-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Why manufacturer-direct</p>
              <h2 id="fit-heading">One certified line behind every treatment</h2>
              <p>
                Provisioning through traders means unclear provenance and stock
                that arrives repacked. Buying from the manufacturer means every
                batch traces to one certified line — WHO-GMP, ISO and FSSAI as
                published — with the documentation your purchasing process needs.
              </p>
            </div>
            <div className="lane-grid">
              <div className="lane-card">
                <h3>Therapy-volume packs</h3>
                <p>{OIL_PACK} for classical thailams; {POWDER_PACK} for udwarthanam, kizhi and choornam powders — formats sized for treatment programmes, not retail shelves.</p>
              </div>
              <div className="lane-card">
                <h3>Classical formulations</h3>
                <p>Named formulations of the Ayurvedic pharmacopoeia, prepared to tradition on a pharma-certified line — for professional use under a qualified physician&rsquo;s guidance.</p>
              </div>
              <div className="lane-card">
                <h3>Quoted direct</h3>
                <p>The KAPPL desk quotes from the Pollachi factory: formulations, quantities, destination in — direct quote and documentation out.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="faq-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Asked before every first order</p>
              <h2 id="faq-heading">The procurement questions, answered straight</h2>
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
            <p className="overline">Request a quote</p>
            <h2 id="rfq-heading">Tell us what your treatment menu needs</h2>
            <p className="rfq-lede">
              Formulations, monthly volumes, destination — the KAPPL desk
              replies with a direct quote for your programme.
            </p>
            <div className="rfq-grid">
              <div className="rfq-aside">
                <p className="rfq-fact"><strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></p>
                <p className="rfq-fact"><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a></p>
                <p className="rfq-fact"><strong>Packs:</strong> {OIL_PACK} · {POWDER_PACK}</p>
                <p className="rfq-fact"><strong>Dispatch:</strong> India &amp; export markets</p>
              </div>
              <EnquiryForm
                site="bulkayurvedaoils.com"
                formType="rfq"
                subject="Bulk supply quote — spa / hotel / resort"
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
