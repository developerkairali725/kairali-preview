import React from "react";
import Image from "next/image";
import { BioSelector } from "@/components/site/bio-selector";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ZariRule, LedgerList, LedgerRow } from "@/components/ui/ledger";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About Abhilash Kalathil Ramesh",
  description: "Biography, lineage, education, and professional background of Abhilash Kalathil Ramesh, Executive Director of Kairali Ayurvedic Group.",
  alternates: alternatesFor("about"),
  openGraph: {
    title: "About Abhilash Kalathil Ramesh",
    description: "Biography, lineage, education, and professional background of Abhilash Kalathil Ramesh, Executive Director of Kairali Ayurvedic Group.",
    url: `${SITE_URL}/about`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=About%20Abhilash%20Kalathil%20Ramesh&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Biography%20%26%20History`,
        width: 1200,
        height: 630,
        alt: "About Abhilash Kalathil Ramesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Abhilash Kalathil Ramesh",
    description: "Biography, lineage, education, and professional background of Abhilash Kalathil Ramesh, Executive Director of Kairali Ayurvedic Group.",
    images: [`${SITE_URL}/api/og?title=About%20Abhilash%20Kalathil%20Ramesh&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Biography%20%26%20History`],
  },
};

export default function AboutPage() {
  return (
    <div className="w-full bg-background text-foreground py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Breadcrumbs locale="en" pageKey="about" />
        
        {/* Header Section */}
        <div className="flex flex-col space-y-4 mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary">
            biography & history
          </div>
          <h1 className="font-display text-4xl md:text-5xl italic text-ink">
            Abhilash Kalathil Ramesh
          </h1>
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-2xl">
            Eldest scion of the fourth generation of a family dedicated to authentic Ayurvedic medicine since 1908. He serves as Executive Director at Kairali Ayurvedic Group, founding board member of AYUSHEXCIL, and an angel investor via Mumbai Angels Network.
          </p>
        </div>

        <ZariRule className="mb-12" />

        {/* Bio & Photo Grid */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Photo Column */}
          <div className="md:col-span-5 relative w-full aspect-square max-w-[360px] mx-auto border border-border p-2 bg-card">
            <div className="relative w-full h-full border border-primary/30 overflow-hidden">
              {/* Owner-supplied portrait; preserve crop and provenance. */}
              <Image
                src="/images/abhilash-portrait.png"
                alt="Abhilash Kalathil Ramesh — Executive Director, Kairali Ayurvedic Group."
                fill
                priority
                sizes="(max-width: 768px) 100vw, 360px"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                style={{ objectPosition: "center 20%" }}
              />
            </div>
            {/* Zari rule framed corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary" />
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 flex flex-col space-y-6">
            <div>
              <h2 className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-3">
                Details
              </h2>
              <LedgerList>
                <LedgerRow label="Education" value="FIU — Bachelor's, Civil Engineering (2000–2004)" />
                <LedgerRow 
                  label="Languages" 
                  value="Malayalam (native) · English (prof) · German (elem) · Chinese (elem)" 
                />
                <LedgerRow label="Affiliation" value="Kairali Ayurvedic Group" />
                <LedgerRow label="Role" value="Executive Director" />
              </LedgerList>
            </div>
          </div>
        </section>

        <ZariRule className="mb-12" />

        {/* Bio Copying Suite */}
        <section className="mb-16">
          <h2 className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-4">
            Press & Speaking Bios
          </h2>
          <BioSelector />
        </section>

        <ZariRule className="mb-16" />

        {/* Historical Timeline (Career-era only) */}
        <section className="mb-16">
          <h2 className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-6">
            Career Timeline
          </h2>
          
          <div className="flex flex-col space-y-8 font-mono text-xs border-l border-border pl-6 relative">
            
            {/* 1908 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-2 h-2 bg-primary rounded-full" />
              <div className="text-primary font-bold mb-1">1908 — LINEAGE ORIGINS</div>
              <p className="font-sans text-ink-muted text-xs leading-relaxed">
                The family Ayurveda lineage begins, establishing clinical herbal practice roots in Kerala.
              </p>
            </div>

            {/* 2000-2004 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-2 h-2 bg-primary rounded-full" />
              <div className="text-primary font-bold mb-1">2000–2004 — EDUCATION</div>
              <p className="font-sans text-ink-muted text-xs leading-relaxed">
                Bachelor&apos;s, Civil Engineering, Florida International University.
              </p>
            </div>

            {/* 2004 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-2 h-2 bg-primary rounded-full" />
              <div className="text-primary font-bold mb-1">2004 — ENTERPRISE JOIN</div>
              <p className="font-sans text-ink-muted text-xs leading-relaxed">
                Joins Kairali Ayurvedic Group as Director of Sales & Marketing.
              </p>
            </div>

            {/* 2008 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-2 h-2 bg-primary rounded-full" />
              <div className="text-primary font-bold mb-1">2008 — EXECUTIVE DIRECTORSHIP</div>
              <p className="font-sans text-ink-muted text-xs leading-relaxed">
                Assumes the role of Executive Director, standardizing global day-spas (KAC) and manufacturing pipelines (KAPPL).
              </p>
            </div>

            {/* 2018 NABH */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-2 h-2 bg-primary rounded-full" />
              <div className="text-primary font-bold mb-1">2018 — KTAHV NABH ACCREDITATION</div>
              <p className="font-sans text-ink-muted text-xs leading-relaxed">
                Kairali – The Ayurvedic Healing Village, a 65-acre Ayurvedic hospital in Palakkad, Kerala, obtains NABH accreditation.
              </p>
            </div>

            {/* 2019 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-2 h-2 bg-primary rounded-full" />
              <div className="text-primary font-bold mb-1">2019 — ANGEL INVESTING</div>
              <p className="font-sans text-ink-muted text-xs leading-relaxed">
                Begins early-stage angel investing, joining the Mumbai Angels Network.
              </p>
            </div>

            {/* 2022 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-2 h-2 bg-primary rounded-full" />
              <div className="text-primary font-bold mb-1">2022 — AYUSHEXCIL FOUNDING</div>
              <p className="font-sans text-ink-muted text-xs leading-relaxed">
                Becomes a founding board member of the AYUSH Export Promotion Council (AYUSHEXCIL) under the Ministry of AYUSH.
              </p>
            </div>

            {/* Dec 2025 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-2 h-2 bg-primary rounded-full" />
              <div className="text-primary font-bold mb-1">DEC 2025 — VEDA NATURALS</div>
              <p className="font-sans text-ink-muted text-xs leading-relaxed">
                Invests in Veda Naturals, a botanical sourcing and standardisation partnership.
              </p>
            </div>

            {/* Present */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-2 h-2 bg-primary rounded-full" />
              <div className="text-primary font-bold mb-1">PRESENT</div>
              <p className="font-sans text-ink-muted text-xs leading-relaxed">
                Scaling operational AI systems and multilingual diagnostic standardisation templates.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
