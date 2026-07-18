// /faq — procurement FAQ, the AEO surface (STRATEGY §1/§2; legacy
// customer-query-faq MERGES here, though its body copy was never recovered —
// so every answer below is built ONLY from the mined record or says "shared
// at quote stage" (§2† rule: MOQ/lead-time questions ship WITHOUT invented
// figures). FAQPage schema mirrors the real on-page Q&A exactly.
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, faqPage, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../site.config.json";
import { CATEGORIES, SITE_URL } from "../_lib/catalog";
import { PageHead, RfqBand } from "../_components/page-chrome";

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Procurement FAQ — Ayurveda Equipment",
    description:
      "What a droni is made of, how the steam box is built, what an equipment list for a Panchakarma centre covers — and what is shared at quote stage.",
    path: "/faq",
    siteName: "Kairali Equipment",
  }) as Metadata),
  keywords: ["what is a droni made of", "ayurveda steam bath vs sauna", "panchakarma centre equipment list", "ayurveda equipment MOQ lead time"],
};

const FAQ = [
  {
    question: "What is a droni (pathi) made of?",
    answer:
      "The record's spec: medicated wood with brass decorative works and a rose-wood finish, 8.5 × 3 feet with a 3-inch-thick slab, supplied with a stand and steel support for complete stability.",
  },
  {
    question: "How is an Ayurvedic steam bath different from a sauna?",
    answer:
      "A swedana chamber steams the seated body while the head stays outside — the classical fomentation posture. The catalogue build is a sitting-style box with foot rest, in teak with a stainless-steel bottom and tank and automatic controls; treatment-room apparatus, not a leisure cabin.",
  },
  {
    question: "What equipment does a Panchakarma centre need?",
    answer:
      "The catalogue's five lines cover the treatment room: Pathi (Droni) massage beds, Shirodhara stands with brass pots, steam boxes, urlis in brass and bell metal, and the accessory line (Shirodhara pot, equipment set, Droni step). The spa-setup consultancy lane maps the exact list to your rooms and treatments.",
  },
  {
    question: "What is the MOQ, and what are the lead times?",
    answer:
      "Both are shared at quote stage for your exact configuration — no blanket figures are published on this site.",
  },
  {
    question: "Do you publish prices?",
    answer:
      "No. Every project is quoted — prices, lead times and export terms are shared in the quote reply from info@kairali.com. No obligation attaches to a quote.",
  },
  {
    question: "Do you export, and to which markets?",
    answer:
      "Worldwide export and alliance relationships are carried from the group's record; specific markets and terms are discussed per project with the sales and distributor teams.",
  },
  {
    question: "Do you offer contract or OEM manufacturing?",
    answer:
      "Yes — OEM builds run on the group's own factory floor to your specification. Start with the contract-manufacturing lane and send drawings or reference photographs with the enquiry.",
  },
  {
    question: "Which equipment lines perform best?",
    answer:
      "No category ranking is published — performance varies by market and buyer type, and the distributor team shares what moves where in the one-to-one discussion, grounded in the group's own export record.",
  },
  {
    question: "What support do distributors and partners get?",
    answer:
      "The group's record carries product and equipment support for its alliances; marketing and localisation support are scoped per partner at quote stage. Nothing is promised that is not on record.",
  },
  {
    question: "Who makes this equipment?",
    answer:
      "Kairali Equipment is the Ayurveda-equipment manufacturing division of the Kairali Ayurvedic Group — founded in 1989, a family practising Ayurveda since 1908, and the family group behind the NABH-accredited Kairali — The Ayurvedic Healing Village.",
  },
];

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE_URL}/faq#breadcrumb`,
    items: [
      { name: "Home", url: SITE_URL },
      { name: "FAQ", url: `${SITE_URL}/faq` },
    ],
  }),
  faqPage({ id: `${SITE_URL}/faq#faq`, questions: FAQ }),
);

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main>
        <PageHead
          overline="Procurement FAQ"
          title="Asked before the quote"
          lede="Straight answers at the record's granularity — and an honest 'shared at quote stage' where no public figure exists."
          trail={[{ name: "FAQ" }]}
        />
        <section className="section container">
          <div className="faq-list">
            {FAQ.map((f) => (
              <details key={f.question}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
          <p className="lane-after">
            Per-line questions live on the category pages:{" "}
            {CATEGORIES.map((c, i) => (
              <span key={c.slug}>
                {i > 0 ? " · " : ""}
                <a href={`/equipment/${c.slug}`}>{c.name}</a>
              </span>
            ))}
          </p>
        </section>
        <RfqBand context="A question the FAQ does not answer?" />
      </main>
    </>
  );
}
