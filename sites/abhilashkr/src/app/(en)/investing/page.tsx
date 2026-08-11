import React from "react";
import { ZariRule, LedgerList, LedgerRow } from "@/components/ui/ledger";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Angel Investing Thesis | Abhilash K. Ramesh",
  description: "Backing early-stage ventures in biotechnology formulations, clean personal care, botanical supply chains, and green hospitality.",
  alternates: alternatesFor("investing"),
  openGraph: {
    title: "Angel Investing Thesis | Abhilash K. Ramesh",
    description: "Backing early-stage ventures in biotechnology formulations, clean personal care, botanical supply chains, and green hospitality.",
    url: `${SITE_URL}/investing`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=Angel%20Investing%20Thesis&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Investment%20Allocation`,
        width: 1200,
        height: 630,
        alt: "Angel Investing Thesis — Abhilash Kalathil Ramesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Angel Investing Thesis | Abhilash K. Ramesh",
    description: "Backing early-stage ventures in biotechnology formulations, clean personal care, botanical supply chains, and green hospitality.",
    images: [`${SITE_URL}/api/og?title=Angel%20Investing%20Thesis&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Investment%20Allocation`],
  },
};

export default function InvestingPage() {
  return (
    <div className="w-full bg-background text-foreground py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col space-y-4 mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary">
            investment allocation
          </div>
          <h1 className="font-display text-4xl md:text-5xl italic text-ink">
            Angel Investing Thesis
          </h1>
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-2xl">
            Angel investor via Mumbai Angels Network since 2019, allocating early-stage capital (angel / pre-seed / seed) and distribution networks to founders building clean formulations, biotechnology, sustainable agriculture, and regenerative hospitality infrastructures.
          </p>
        </div>

        <ZariRule className="mb-12" />

        {/* Investment Pillars */}
        <section className="mb-16">
          <h3 className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-6">
            Core Target Sectors
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-border p-6 bg-card">
              <div className="font-mono text-[10px] text-primary uppercase mb-2">Formulation & Biotech</div>
              <h4 className="font-display text-xl italic text-ink mb-2">Clean-Label Sciences</h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Backing proprietary clinical research, zero-additive formulations, and plant-based botanical extracts with clear efficacy validation models.
              </p>
            </div>

            <div className="border border-border p-6 bg-card">
              <div className="font-mono text-[10px] text-primary uppercase mb-2">Regenerative Hospitality</div>
              <h4 className="font-display text-xl italic text-ink mb-2">Green Infrastructure</h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Investing in low-carbon boutique hospitality models, structural clean energy integrations, and sustainable real estate developments.
              </p>
            </div>

            <div className="border border-border p-6 bg-card">
              <div className="font-mono text-[10px] text-primary uppercase mb-2">Botanical Supply Chains</div>
              <h4 className="font-display text-xl italic text-ink mb-2">Organic Agriculture</h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Supporting vertical farming projects, transparent smallholder sourcing platforms, and supply-chain logistics that secure botanical identity.
              </p>
            </div>

            <div className="border border-border p-6 bg-card">
              <div className="font-mono text-[10px] text-primary uppercase mb-2">Technology Integration</div>
              <h4 className="font-display text-xl italic text-ink mb-2">Legacy Operations Scaling</h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Funding tools that automate operational workflows, compliance tracking, and supply chain logistics for legacy or physical-first enterprises.
              </p>
            </div>
          </div>
        </section>

        <ZariRule className="mb-16" />

        {/* Investment Details */}
        <section className="mb-16">
          <h3 className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-6">
            Allocation & Engagement Metrics
          </h3>
          
          <div className="max-w-md">
            <LedgerList>
              <LedgerRow label="Network" value="Mumbai Angels Network (since 2019)" />
              <LedgerRow label="Stage" value="Angel / Pre-Seed / Seed" />
              <LedgerRow label="Geography" value="Global (Focus on India, Europe, USA)" />
              <LedgerRow label="Engagement" value="Active distribution and regulatory guidance" />
            </LedgerList>
          </div>
        </section>

        <ZariRule className="mb-16" />

        {/* Named Holdings */}
        <section className="mb-12">
          <h3 className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-6">
            Selected Portfolio
          </h3>

          <div className="border border-border p-6 bg-card max-w-md mb-6">
            <div className="font-mono text-[10px] text-primary uppercase mb-2">Publicly Disclosed</div>
            <h4 className="font-display text-xl italic text-ink mb-2">Veda Naturals</h4>
            <p className="font-sans text-xs text-ink-muted leading-relaxed">
              Invested since December 2025. Botanical sourcing and standardisation partnership.
            </p>
          </div>

          <p className="font-sans text-xs text-ink-muted leading-relaxed">
            Other portfolio companies unnamed — selected portfolio shared on request.
          </p>
        </section>

      </div>
    </div>
  );
}
