// /for/panchakarma-centres-clinics — segment lane (STRATEGY §1 row 7).
// Therapeutic-volume repeat buyers; product-pharma register (classical-use
// framing, physician-guidance line, never treatment promises).
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, faqPage, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../../_components/chrome";
import { OIL_PACK, POWDER_PACK } from "../../_components/catalog";
import siteConfig from "../../../site.config.json";

const SITE = "https://bulkayurvedaoils.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Ayurvedic Oils for Panchakarma Centres | Kairali KAPPL",
  description:
    "Repeat therapeutic-volume supply for physician-led practice — classical thailams and therapy powders from one certified manufacturer.",
  path: "/for/panchakarma-centres-clinics",
}) as Metadata;

const FAQS = [
  {
    q: "Can a clinic order the same formulations every month?",
    a: "Yes — repeat therapeutic-volume supply is what this desk exists for. The live bulk range covers four classical thailams (5 L cans) and seven therapy powders (500 g – 1 kg); your quote confirms per-formulation minimums and the reorder terms.",
  },
  {
    q: "Are these the classical formulations, or house blends?",
    a: "Both ranges exist and are labelled as what they are: named classical formulations of the pharmacopoeia (Balaguluchyadi Kera, Chandhanadi, Kayyunyadi, Thriphaladi Kera thailams) and Kairali's own proprietary oils — nothing is passed off as the other.",
  },
  {
    q: "What quality documentation comes with a batch?",
    a: "Certifications are carried exactly as KAPPL publishes them — WHO-GMP, ISO, FSSAI — and the documentation set for your purchase process is confirmed with your quote. This page will not promise a document the desk has not confirmed it issues.",
  },
  {
    q: "Is there a published price list?",
    a: "No — bulk supply runs on the quote model: formulations, quantities and destination in; a direct manufacturer quote out.",
  },
];

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/for/panchakarma-centres-clinics#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Panchakarma centres & clinics", url: `${SITE}/for/panchakarma-centres-clinics` },
    ],
  }),
  faqPage({
    id: `${SITE}/for/panchakarma-centres-clinics#faq`,
    questions: FAQS.map((f) => ({ question: f.q, answer: f.a })),
  }),
);

export default function PanchakarmaLane() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="For your business · Panchakarma centres & clinics"
          title="Therapeutic volume, batch after batch"
          lede="A physician-led practice cannot run on uncertain stock. This desk supplies classical thailams and therapy powders at clinical volume — manufactured to their traditional formulations on KAPPL's certified Pollachi line, and quoted direct to your centre."
        />

        <section className="section" aria-labelledby="fit-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Built for repeat supply</p>
              <h2 id="fit-heading">One certified source for the whole dispensary</h2>
              <p>
                Oils for abhyanga and dhara, powders for udwarthanam and kizhi —
                one manufacturer, one paper trail, one desk to reorder from.
                Every certification claim is carried as published: WHO-GMP, ISO,
                FSSAI.
              </p>
            </div>
            <div className="lane-grid">
              <div className="lane-card">
                <h3>Classical thailams</h3>
                <p>Four live formulations in {OIL_PACK} — prepared to tradition, supplied for professional use under a qualified physician&rsquo;s guidance.</p>
              </div>
              <div className="lane-card">
                <h3>Therapy powders</h3>
                <p>Seven preparations in {POWDER_PACK} — udwarthanam, kottamchukkadi, kizhi and classical choornams from the same line.</p>
              </div>
              <div className="lane-card">
                <h3>Manufacturer-direct terms</h3>
                <p>Minimums and lead times confirmed per formulation in your quote — real figures from the desk, never guessed on a webpage.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="faq-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Asked by clinical buyers</p>
              <h2 id="faq-heading">Straight answers for the dispensary desk</h2>
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
            <h2 id="rfq-heading">Tell us what your practice needs</h2>
            <p className="rfq-lede">
              Formulations, monthly volumes, destination — the KAPPL desk
              replies with a direct quote and the documentation your process needs.
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
                subject="Bulk supply quote — panchakarma centre / clinic"
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
