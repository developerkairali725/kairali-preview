import React from "react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ZariRule, LedgerList, LedgerRow } from "@/components/ui/ledger";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Honours & Recognition | Abhilash K. Ramesh",
  description: "Official list of verified corporate excellence and leadership accolades, including Haute Grandeur, PATWA International Travel Awards, APEA, and AsiaOne.",
  alternates: alternatesFor("recognition"),
  openGraph: {
    title: "Honours & Recognition | Abhilash K. Ramesh",
    description: "Official list of verified corporate excellence and leadership accolades, including Haute Grandeur, PATWA International Travel Awards, APEA, and AsiaOne.",
    url: `${SITE_URL}/recognition`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=Honours%20%26%20Recognition&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Accolades%20%26%20Honours`,
        width: 1200,
        height: 630,
        alt: "Honours & Recognition — Abhilash Kalathil Ramesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Honours & Recognition | Abhilash K. Ramesh",
    description: "Official list of verified corporate excellence and leadership accolades, including Haute Grandeur, PATWA International Travel Awards, APEA, and AsiaOne.",
    images: [`${SITE_URL}/api/og?title=Honours%20%26%20Recognition&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Accolades%20%26%20Honours`],
  },
};

export default function RecognitionPage() {
  const accolades = [
    {
      title: "Best Marketing Director India",
      date: "2026",
      category: "Marketing Director of the Year",
      provenance: "Haute Grandeur Global Excellence Awards"
    },
    {
      title: "Excellence in Wellness Hospitality (India)",
      date: "2026",
      category: "Wellness Hospitality Leadership",
      provenance: "PATWA International Travel Awards (conferred at ITB Berlin)"
    },
    {
      title: "40 Under 40 Most Influential",
      date: "2017",
      category: "Entrepreneurship & Wellness Innovation",
      provenance: "AsiaOne"
    },
    {
      title: "Asia Pacific Entrepreneurship Award (APEA)",
      date: "2016",
      category: "Most Promising Entrepreneur",
      provenance: "Enterprise Asia"
    },
    {
      title: "Entrepreneurial Excellence for AYUSH Leadership",
      date: "2015",
      category: "AYUSH Sector Leadership",
      provenance: "Indian Salon & Wellness Awards"
    }
  ];

  return (
    <div className="w-full bg-background text-foreground py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Breadcrumbs locale="en" pageKey="recognition" />
        
        {/* Header Section */}
        <div className="flex flex-col space-y-4 mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary">
            awards & honours
          </div>
          <h1 className="font-display text-4xl md:text-5xl italic text-ink">
            Recognition
          </h1>
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-2xl">
            Corporate governance, business leadership, and clinical hospitality awards conferred by external industry panels.
          </p>
        </div>

        <ZariRule className="mb-12" />

        {/* Accolades List */}
        <section className="flex flex-col space-y-6">
          {accolades.map((award, idx) => (
            <div 
              key={idx}
              className="border border-border p-6 bg-card hover:border-primary transition-colors font-mono text-xs"
            >
              <div className="flex justify-between items-baseline text-[10px] text-primary uppercase mb-2">
                <span>Honour #{idx + 1}</span>
                {award.date && <span className="text-ink-muted">{award.date}</span>}
              </div>
              
              <h2 className="font-display text-2xl text-ink italic font-normal uppercase select-all mb-4">
                {award.title}
              </h2>

              <LedgerList className="max-w-md">
                <LedgerRow label="Category" value={award.category} />
                <LedgerRow label="Awarded by" value={award.provenance} />
              </LedgerList>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
