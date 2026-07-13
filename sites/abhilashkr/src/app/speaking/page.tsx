import React from "react";
import Image from "next/image";
import { ZariRule, LedgerList, LedgerRow } from "@/components/ui/ledger";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Public Speaking & Keynotes | Abhilash K. Ramesh",
  description: "Speaker portfolio and media resources on traditional medicine global policy, operational AI standardisation, and botanical formulations.",
  alternates: {
    canonical: `${SITE_URL}/speaking`,
  },
  openGraph: {
    title: "Public Speaking & Keynotes | Abhilash K. Ramesh",
    description: "Speaker portfolio and media resources on traditional medicine global policy, operational AI standardisation, and botanical formulations.",
    url: `${SITE_URL}/speaking`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=Public%20Speaking%20%26%20Keynotes&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Speaking%20%26%20Keynotes`,
        width: 1200,
        height: 630,
        alt: "Public Speaking & Keynotes — Abhilash Kalathil Ramesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Public Speaking & Keynotes | Abhilash K. Ramesh",
    description: "Speaker portfolio and media resources on traditional medicine global policy, operational AI standardisation, and botanical formulations.",
    images: [`${SITE_URL}/api/og?title=Public%20Speaking%20%26%20Keynotes&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Speaking%20%26%20Keynotes`],
  },
};

export default function SpeakingPage() {
  return (
    <div className="w-full bg-background text-foreground py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col space-y-4 mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary">
            speaking & press
          </div>
          <h1 className="font-display text-4xl md:text-5xl italic text-ink">
            Public Speaking & Press Kit
          </h1>
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-2xl">
            Keynotes, panel discussions, and lectures on globalising heritage medicine, operational scaling with AI, and international wellness trade policies.
          </p>
        </div>

        {/* Featured Speaking Image */}
        <div className="relative w-full aspect-[21/9] mb-12 border border-border p-1 bg-card overflow-hidden">
          <div className="relative w-full h-full border border-primary/20 overflow-hidden">
            <Image
              src="/images/abhilash-speaking.jpg"
              alt="Abhilash Kalathil Ramesh speaking at an international industry conference."
              fill
              sizes="100vw"
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
              style={{ objectPosition: "center 25%" }}
            />
          </div>
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary" />
        </div>

        <ZariRule className="mb-12" />

        {/* Core Topics Ledger */}
        <section className="mb-16">
          <h3 className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-6">
            Core Topics & Selected Speeches
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border p-6 bg-card flex flex-col justify-between">
              <h4 className="font-display text-xl italic text-ink mb-2">
                Globalising Ayurveda Without Dilution
              </h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Bridging East and West by scaling heritage clinical medicine internationally while preserving core therapeutic standards and lineages.
              </p>
            </div>

            <div className="border border-border p-6 bg-card flex flex-col justify-between">
              <h4 className="font-display text-xl italic text-ink mb-2">
                Futuristic Ayurveda Applications
              </h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Harnessing AI, machine learning, and structured data systems to standardise legacy workflows and clinical diagnostic recording.
              </p>
            </div>

            <div className="border border-border p-6 bg-card flex flex-col justify-between">
              <h4 className="font-display text-xl italic text-ink mb-2">
                Medical Tourism & Insurance integration
              </h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Structuring clinical precision, evidence-based integrative protocols, and safety standards to align with international health insurance frameworks.
              </p>
            </div>

            <div className="border border-border p-6 bg-card flex flex-col justify-between">
              <h4 className="font-display text-xl italic text-ink mb-2">
                Wellness Startup Ecosystems
              </h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Advising and investing in clean-label botanical formulations, organic agricultural supply chains, and regenerative hospitality models.
              </p>
            </div>
          </div>
        </section>

        <ZariRule className="mb-16" />

        {/* Media Kit Section */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-6">
            <h3 className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-4">
              Speaker Assets
            </h3>
            <div className="flex flex-col space-y-3 font-mono text-xs">
              <a 
                href="/images/abhilash-portrait.png" 
                download 
                className="inline-flex items-center justify-between p-3 border border-border bg-card text-ink hover:border-primary transition-colors cursor-pointer"
              >
                <span>Download Portrait Headshot</span>
                <span className="text-[10px] text-primary">PNG</span>
              </a>
              <a 
                href="/about" 
                className="inline-flex items-center justify-between p-3 border border-border bg-card text-ink hover:border-primary transition-colors cursor-pointer"
              >
                <span>Navigate to Copyable Bios</span>
                <span className="text-[10px] text-primary">20W / 100W / 400W</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-6">
            <h3 className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-4">
              Identification
            </h3>
            <LedgerList>
              <LedgerRow label="Full Name" value="Abhilash Kalathil Ramesh" />
              <LedgerRow label="Affiliation" value="Executive Director, Kairali Group" />
            </LedgerList>
          </div>

        </section>

      </div>
    </div>
  );
}
