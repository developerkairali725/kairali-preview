// /products/<category> ×4 — capability pages (STRATEGY §1 row 6), statically
// generated from the published capability register [OWN-5]. Per-category copy
// stays inside the published claims: the category sentence, the published
// dosage-form list (carried whole, "as published" — this desk does not invent
// a per-category mapping), the engagement models, and the intake RFQ.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, service, faqPage, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../../_components/chrome";
import { CAPABILITIES, DOSAGE_FORMS } from "../../_components/facts";
import siteConfig from "../../../site.config.json";

const SITE = "https://bulkayurvedaproducts.com";

// Per-category presentation (titles per STRATEGY §2 keyword map; copy stays
// on published claims — categories differ by capability sentence and angle,
// never by invented facts).
const DETAIL: Record<
  string,
  { title: string; description: string; overline: string; h1: string; lede: string; angle: string }
> = {
  oils: {
    title: "Ayurvedic Oil Manufacturer — Private Label | Kairali",
    description:
      "Private-label and third-party manufacturing of Ayurvedic oils — classical thailams and proprietary formulations on KAPPL's WHO-GMP line.",
    overline: "What we make · Ayurvedic oils",
    h1: "Oils, from the line that fills our own",
    lede: "Classical thailams and proprietary oil formulations, developed and filled on the same certified line that supplies Kairali's own retail range — under your label or ours.",
    angle:
      "Oil is where this factory started: the classical thailams of Kerala practice are prepared to their traditional formulations, and proprietary massage and hair oils are developed by the in-house R&D. If your brand needs an oil range, it launches from a line that already makes them every week.",
  },
  cosmetics: {
    title: "Ayurvedic Cosmetics Manufacturer — Private Label | Kairali",
    description:
      "Herbal and Ayurvedic cosmetics under your brand — skin and hair care on herbal actives, formulated and packed at KAPPL's Pollachi plant.",
    overline: "What we make · Cosmetics",
    h1: "Herbal cosmetics, pharma discipline",
    lede: "Skin and hair care built on herbal actives — formulation, stability and packing under one roof, on a line whose day job is pharmaceutical manufacture.",
    angle:
      "A cosmetics range is only as credible as the plant behind it. KAPPL brings the pharma line's habits — in-house laboratories, documented QA — to herbal skin and hair care, so a founder's cosmetic brief ships with manufacturing discipline most cosmetic contract shops cannot show.",
  },
  medicines: {
    title: "Ayurvedic Medicine Manufacturer — Third Party | Kairali",
    description:
      "Classical and proprietary Ayurvedic medicines manufactured third-party or loan-licence on KAPPL's licensed WHO-GMP line.",
    overline: "What we make · Medicines",
    h1: "Classical and proprietary medicines",
    lede: "Ayurvedic and herbal medicines across the published dosage forms, manufactured on a licensed pharma line — with the loan-licence lane for brands holding their own approvals.",
    angle:
      "Medicine manufacture is the strictest test of a contract partner: licences, laboratories and provenance. This is KAPPL's home ground — a licensed WHO-GMP line with in-house herb extraction, making classical preparations the way the pharmacopoeia writes them and proprietary formulations the way your approvals specify.",
  },
  "shampoos-soaps": {
    title: "Herbal Shampoo & Soap Private Label | Kairali KAPPL",
    description:
      "Herbal shampoos and soaps under your own brand — formulated and packed dispatch-ready at KAPPL's WHO-GMP Pollachi facility.",
    overline: "What we make · Shampoos & soaps",
    h1: "Cleansing ranges, brief to carton",
    lede: "Herbal shampoos and soaps from formulation brief to dispatch-ready cartons — the highest-volume category most Ayurvedic brands launch with.",
    angle:
      "Shampoos and soaps are the classic first SKU for a new herbal brand: familiar to buyers, fast to market. KAPPL takes the brief through formulation, production and packing on the certified line — your brand on the shelf without a factory behind your name.",
  },
};

export function generateStaticParams() {
  return CAPABILITIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await props.params;
  const d = DETAIL[category];
  if (!d) return {};
  return buildMetadata(siteConfig, {
    title: d.title,
    description: d.description,
    path: `/products/${category}`,
  }) as Metadata;
}

export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
  const { category } = await props.params;
  const cap = CAPABILITIES.find((c) => c.slug === category);
  const d = DETAIL[category];
  if (!cap || !d) notFound();

  const jsonLd = graph(
    breadcrumbList({
      id: `${SITE}/products/${cap.slug}#breadcrumb`,
      items: [
        { name: "Home", url: SITE },
        { name: "What we manufacture", url: `${SITE}/products` },
        { name: cap.h, url: `${SITE}/products/${cap.slug}` },
      ],
    }),
    service({
      id: `${SITE}/products/${cap.slug}#service`,
      name: `${cap.h} — contract and private-label manufacturing`,
      description: d.description,
      url: `${SITE}/products/${cap.slug}`,
      providerId: `${SITE}/#organization`,
      serviceType: "Contract manufacturing",
      areaServed: "India and export markets",
    }),
    faqPage({
      id: `${SITE}/products/${cap.slug}#faq`,
      questions: [
        {
          question: `Which engagement models cover ${cap.h.toLowerCase()}?`,
          answer:
            "All four published models: third party (our products, our or your packing) and loan licence (your products, or your concept with our R&D). The desk recommends the fit in the first conversation.",
        },
        {
          question: "Which dosage forms are available?",
          answer: `The published list, carried whole: ${DOSAGE_FORMS.replaceAll(" · ", ", ")}. The forms your category and formulation actually need are mapped in the formulation discussion.`,
        },
        {
          question: "What is the MOQ?",
          answer:
            'KAPPL publishes "Low MOQs"; the exact figure is confirmed per product and pack in your project quote — never guessed on this page.',
        },
      ],
    }),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro overline={d.overline} title={d.h1} lede={d.lede} />

        <section className="section" aria-labelledby="angle-heading">
          <div className="container">
            <div className="prose">
              <h2 id="angle-heading">{cap.h}, on a certified line</h2>
              <p>{d.angle}</p>
              <p>
                Manufacture runs at Pollachi, Tamil Nadu — in-house
                laboratories, an in-house herb-extraction unit and R&amp;D on
                one campus, under the certifications KAPPL publishes: WHO-GMP,
                ISO, FSSAI. Engagements are quoted per project; sampling comes
                before any committed batch.
              </p>
            </div>
            <p className="cap-forms">Dosage forms as published: {DOSAGE_FORMS}.</p>
            <div className="cross-desk">
              Need ready-made stock in this category instead?{" "}
              <a href="https://www.bulkayurvedaoils.com" rel="noopener" data-cta="cross-desk">
                The supply desk quotes the live bulk range
              </a>
              .
            </div>
          </div>
        </section>

        <section className="rfq-band" id="start" aria-labelledby="start-heading">
          <div className="container">
            <p className="overline">Start your project</p>
            <h2 id="start-heading">Bring the desk your {cap.h.toLowerCase()} brief</h2>
            <p className="rfq-lede">
              Model, dosage form, scale — the KAPPL desk replies with the
              formulation conversation and a direct project quote.
            </p>
            <div className="rfq-grid">
              <div className="rfq-aside">
                <p className="rfq-fact"><strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></p>
                <p className="rfq-fact"><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a></p>
                <p className="rfq-fact"><strong>Category:</strong> {cap.h}</p>
                <p className="rfq-fact"><strong>Facility:</strong> Pollachi — WHO-GMP · ISO · FSSAI (as published)</p>
              </div>
              <EnquiryForm
                site="bulkayurvedaproducts.com"
                formType="project-intake"
                subject={`Manufacturing project enquiry — ${cap.h}`}
                heading="Start your project"
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
