import React from "react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ZariRule } from "@/components/ui/ledger";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "What I'm Doing Now | Abhilash K. Ramesh",
  description: "A summary of active priorities, operational focuses, and projects Abhilash is directing right now.",
  alternates: alternatesFor("now"),
  openGraph: {
    title: "What I'm Doing Now | Abhilash K. Ramesh",
    description: "A summary of active priorities, operational focuses, and projects Abhilash is directing right now.",
    url: `${SITE_URL}/now`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=What%20I%27m%20Doing%20Now&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Active%20Priorities`,
        width: 1200,
        height: 630,
        alt: "What I'm Doing Now — Abhilash Kalathil Ramesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "What I'm Doing Now | Abhilash K. Ramesh",
    description: "A summary of active priorities, operational focuses, and projects Abhilash is directing right now.",
    images: [`${SITE_URL}/api/og?title=What%20I%27m%20Doing%20Now&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Active%20Priorities`],
  },
};

export default function NowPage() {
  const currentDate = "August 2026";

  return (
    <div className="w-full bg-background text-foreground py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Breadcrumbs locale="en" pageKey="now" />
        
        {/* Header Section */}
        <div className="flex flex-col space-y-4 mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary">
            active priorities (/now)
          </div>
          <h1 className="font-display text-4xl md:text-5xl italic text-ink">
            What I&apos;m Doing Now
          </h1>
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-2xl">
            A real-time record of active priorities, operational focuses, and institutional directions. Updated monthly.
          </p>
        </div>

        <ZariRule className="mb-12" />

        {/* Current Focus List */}
        <section className="mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary mb-6">
            Active Focus Areas // Updated: {currentDate}
          </div>

          <ul className="flex flex-col space-y-8 font-sans text-sm text-ink leading-relaxed">
            <li className="border-l-2 border-primary pl-4">
              <strong className="block font-mono text-xs uppercase tracking-wider text-ink mb-1">
                1. Standardising Ayurvedic Hospital Operations
              </strong>
              Refining clinical charting workflows and operational pathways at Kairali – The Ayurvedic Healing Village in Palakkad, preparing clinical guidelines database structures for multilingual medical interfaces.
            </li>

            <li className="border-l-2 border-primary pl-4">
              <strong className="block font-mono text-xs uppercase tracking-wider text-ink mb-1">
                2. Operational Automation Integration
              </strong>
              Deploying secure LLM pipelines to summarize internal compliance requirements, botanicals sourcing ledgers, and institutional regulatory filings across KAPPL pharmaceutical operations.
            </li>

            <li className="border-l-2 border-primary pl-4">
              <strong className="block font-mono text-xs uppercase tracking-wider text-ink mb-1">
                3. Expanding Wellness Hospitality
              </strong>
              Optimizing coastal stay guest experiences and property services at Villa Raag in Goa, establishing organic kitchen supply-chains from local farmers.
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}
