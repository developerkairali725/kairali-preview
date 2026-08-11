import React from "react";
import Link from "next/link";
import { getAllEssays } from "@/lib/mdx";
import { ZariRule } from "@/components/ui/ledger";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Editorial Essays & Columns | Abhilash K. Ramesh",
  description: "Read selected commentary and publications on Ayurvedic clinical standardisation, heritage business scaling, and natural formulations policy.",
  alternates: alternatesFor("writing"),
  openGraph: {
    title: "Editorial Essays & Columns | Abhilash K. Ramesh",
    description: "Read selected commentary and publications on Ayurvedic clinical standardisation, heritage business scaling, and natural formulations policy.",
    url: `${SITE_URL}/writing`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=Editorial%20Essays%20%26%20Columns&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Essays%20%26%20Publications`,
        width: 1200,
        height: 630,
        alt: "Editorial Essays & Columns — Abhilash Kalathil Ramesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Editorial Essays & Columns | Abhilash K. Ramesh",
    description: "Read selected commentary and publications on Ayurvedic clinical standardisation, heritage business scaling, and natural formulations policy.",
    images: [`${SITE_URL}/api/og?title=Editorial%20Essays%20%26%20Columns&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Essays%20%26%20Publications`],
  },
};

export default function WritingIndexPage() {
  const essays = getAllEssays();

  return (
    <div className="w-full bg-background text-foreground py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col space-y-4 mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary">
            essays & publications
          </div>
          <h1 className="font-display text-4xl md:text-5xl italic text-ink">
            Editorial Essays
          </h1>
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-2xl">
            Selected notes on standardizing Ayurvedic healthcare, operational technology inside legacy business, policy structures, and investment theses.
          </p>
        </div>

        <ZariRule className="mb-12" />

        {/* Essays List */}
        <section className="flex flex-col space-y-6">
          {essays.length === 0 ? (
            <div className="text-center py-12 text-xs font-mono text-ink-muted border border-border bg-card">
              No essays published at this time.
            </div>
          ) : (
            essays.map((essay) => (
              <Link 
                key={essay.slug}
                href={`/writing/${essay.slug}`} 
                className="block border border-border p-6 bg-card hover:border-primary transition-colors group"
              >
                <div className="flex justify-between items-start md:items-center text-[10px] font-mono text-primary uppercase mb-2">
                  <div className="flex flex-wrap gap-2">
                    {essay.tags.map((tag) => (
                      <span key={tag} className="border border-primary/20 px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-ink-muted">{essay.readingTime} · {essay.datePublished}</span>
                </div>
                
                <h2 className="font-display text-2xl text-ink group-hover:text-primary transition-colors italic mb-2">
                  {essay.title}
                </h2>
                
                <p className="font-sans text-xs text-ink-muted leading-relaxed mb-4">
                  {essay.description}
                </p>

                <div className="font-mono text-[10px] tracking-widest uppercase text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read full document</span>
                  <span>→</span>
                </div>
              </Link>
            ))
          )}
        </section>

        <ZariRule className="my-16" />

        {/* Selected writing on WhyAyurveda */}
        <section className="mb-16">
          <h3 className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-6">
            Selected writing on WhyAyurveda
          </h3>

          <div className="flex flex-col space-y-6">
            <a 
              href="https://whyayurveda.org/about-the-author-abhilash-k-ramesh/"
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-border p-6 bg-card hover:border-primary transition-colors group"
            >
              <div className="flex justify-between items-center text-[10px] font-mono text-primary uppercase mb-2">
                <span>Authored Column</span>
                <span className="text-ink-muted">whyayurveda.org</span>
              </div>
              <h4 className="font-display text-xl text-ink group-hover:text-primary transition-colors italic mb-2">
                Abhilash K. Ramesh — Author Profile
              </h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Canonical author archive and column repository for natural formulation standards and Ayurvedic policy commentary.
              </p>
            </a>

            <a 
              href="https://whyayurveda.org/abhilash-k-ramesh-expanding-ayurveda-globally/"
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-border p-6 bg-card hover:border-primary transition-colors group"
            >
              <div className="flex justify-between items-center text-[10px] font-mono text-primary uppercase mb-2">
                <span>Flagship Column</span>
                <span className="text-ink-muted">whyayurveda.org</span>
              </div>
              <h4 className="font-display text-xl text-ink group-hover:text-primary transition-colors italic mb-2">
                Expanding Ayurveda Globally, Without Diluting Its Integrity
              </h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Detailing the clinical standardisation models, regulatory safety frameworks, and identity preservation guidelines required for global wellness exports.
              </p>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
