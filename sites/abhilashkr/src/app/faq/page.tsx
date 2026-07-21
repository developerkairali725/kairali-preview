import React from "react";
import { ZariRule } from "@/components/ui/ledger";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Abhilash K. Ramesh",
  description: "Answers to common questions about Abhilash Ramesh, Kairali Ayurvedic Group history, and wellness operations.",
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    title: "Frequently Asked Questions | Abhilash K. Ramesh",
    description: "Answers to common questions about Abhilash Ramesh, Kairali Ayurvedic Group history, and wellness operations.",
    url: `${SITE_URL}/faq`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=Frequently%20Asked%20Questions&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Factual%20Verification`,
        width: 1200,
        height: 630,
        alt: "Frequently Asked Questions — Abhilash Kalathil Ramesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Abhilash K. Ramesh",
    description: "Answers to common questions about Abhilash Ramesh, Kairali Ayurvedic Group history, and wellness operations.",
    images: [`${SITE_URL}/api/og?title=Frequently%20Asked%20Questions&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Factual%20Verification`],
  },
};

export default function FAQPage() {
  const faqs = [
    {
      q: "Who is Abhilash Kalathil Ramesh?",
      a: "Abhilash Kalathil Ramesh is the Executive Director of Kairali Ayurvedic Group, a founding board member of AYUSHEXCIL (the Ayush Export Promotion Council under the Ministry of AYUSH, Government of India), and an angel investor backing biotech and wellness innovations."
    },
    {
      q: "What is the Kairali Ayurvedic Group?",
      a: "Kairali Ayurvedic Group is a group of family-run enterprises founded by KV Ramesh and Gita Ramesh. It spans an NABH-accredited Ayurvedic hospital (Kairali – The Ayurvedic Healing Village in Palakkad), WHO-GMP-certified pharmaceutical manufacturing (KAPPL), a network of day-spas and clinics (KAC), and boutique wellness hospitality (Villa Raag in Goa)."
    },
    {
      q: "What is the history and lineage of Kairali?",
      a: "Kairali represents a fourth-generation family Ayurvedic lineage dating back to 1908. KV Ramesh and Gita Ramesh founded the Kairali Ayurvedic Group in 1989 with the first Kairali Ayurvedic Centre in South Delhi; Kairali — The Ayurvedic Healing Village opened in Palakkad in 1999."
    },
    {
      q: "What is AYUSHEXCIL?",
      a: "AYUSHEXCIL (Ayush Export Promotion Council) is an export Promotion council established by the Ministry of AYUSH, Government of India, to support and scale global exports of traditional herbs and holistic medicine. Abhilash Ramesh is a founding board member."
    },
    {
      q: "What is Kairali – The Ayurvedic Healing Village (KTAHV)?",
      a: "KTAHV is an NABH-accredited Ayurvedic hospital located in Palakkad, Kerala. It is a clinical facility managed by licensed Ayurvedic physicians. It is not a spa, resort, getaway, or luxury escape. All admissions are clinical health programs."
    },
    {
      q: "What is Villa Raag?",
      a: "Villa Raag is a boutique wellness hospitality sanctuary located in Agonda, Goa. It operates as a wellness stay for guests seeking organic food and restorative experiences."
    },
    {
      q: "What is Abhilash Ramesh's role in the family business?",
      a: "As Executive Director, he oversees global expansion, institutional relations, and the integration of artificial intelligence and operations automation into the legacy systems of the Kairali group."
    },
    {
      q: "What is Abhilash Ramesh's angel investing thesis?",
      a: "He backs early-stage startups in biotech formulations, clean consumer personal care, vertical botanical supply chains, and green hospitality infrastructure. He does not list portfolio company names publicly to maintain confidentiality."
    },
    {
      q: "What is the canonical address of WhyAyurveda?",
      a: "WhyAyurveda is a health resource and publication site. Its canonical URL is whyayurveda.org (never .com)."
    }
  ];

  return (
    <div className="w-full bg-background text-foreground py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col space-y-4 mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary">
            frequently asked questions
          </div>
          <h1 className="font-display text-4xl md:text-5xl italic text-ink">
            Frequently Asked Questions
          </h1>
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-2xl">
            Answers to common questions about Abhilash Ramesh and Kairali Ayurvedic Group.
          </p>
        </div>

        <ZariRule className="mb-12" />

        {/* FAQ List */}
        <section className="space-y-8">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-border p-6 bg-card flex flex-col space-y-3"
            >
              <h2 className="font-mono text-xs uppercase tracking-wider text-primary font-bold">
                Q: {faq.q}
              </h2>
              <p className="font-sans text-sm text-ink leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
