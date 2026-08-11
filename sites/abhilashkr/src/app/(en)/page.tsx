import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ZariRule, LedgerList, LedgerRow } from "@/components/ui/ledger";
import { ArrowUpRight, BookOpen, Award } from "lucide-react";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { getEssayBySlug } from "@/lib/mdx";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Abhilash Kalathil Ramesh | Executive Director",
  description: "Abhilash Kalathil Ramesh: Executive Director of Kairali Ayurvedic Group, AYUSHEXCIL founding board member, and angel investor.",
  alternates: alternatesFor("home"),
  openGraph: {
    title: "Abhilash Kalathil Ramesh | Executive Director",
    description: "Executive Director of Kairali Ayurvedic Group, AYUSHEXCIL founding board member, and angel investor.",
    url: SITE_URL,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=Abhilash%20Kalathil%20Ramesh&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Entity%20Verification%20Ledger`,
        width: 1200,
        height: 630,
        alt: "Abhilash Kalathil Ramesh — Executive Director, Kairali Ayurvedic Group",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhilash Kalathil Ramesh | Executive Director",
    description: "Executive Director of Kairali Ayurvedic Group, AYUSHEXCIL founding board member, and angel investor.",
    images: [`${SITE_URL}/api/og?title=Abhilash%20Kalathil%20Ramesh&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Entity%20Verification%20Ledger`],
  },
};

export default function HomePage() {
  const panchakarmaEssay = getEssayBySlug("panchakarma-clinical-protocol-not-a-holiday");
  const readingTime = panchakarmaEssay ? panchakarmaEssay.readingTime : "4 min read";

  return (
    <div className="w-full bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Hero Left Content */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary">
            entity profile // abhilash kalathil ramesh
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05] text-ink">
            A 118-year Ayurveda house, <br />
            <span className="italic text-primary">run on modern systems.</span>
          </h1>

          <p className="font-sans text-base text-ink-muted leading-relaxed max-w-xl">
            Eldest scion of the fourth generation of a family dedicated to authentic Ayurvedic medicine since 1908. As Executive Director of Kairali Ayurvedic Group, he integrates operational AI and modern enterprise structures to scale traditional therapeutics across 27+ countries.
          </p>

          <div className="max-w-md pt-4">
            <LedgerList>
              <LedgerRow label="Title" value="Executive Director, Kairali Group" />
              <LedgerRow label="Lineage" value="Fourth Generation · since 1908" />
              <LedgerRow label="Advocacy" value="Founding Board Member, AYUSHEXCIL" />
              <LedgerRow label="Focus Areas" value="Ayush Policy · Clean Biotech · AI Ops" />
            </LedgerList>
          </div>

          <div className="flex flex-wrap gap-4 pt-6">
            <Link 
              href="/contact" 
              data-cta="contact"
              className="inline-flex min-h-11 items-center justify-center border border-primary bg-primary px-6 py-3 font-mono text-xs uppercase tracking-widest text-background transition-colors hover:bg-transparent hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              Inquire & Connect
            </Link>
            <Link 
              href="/work" 
              className="inline-flex items-center justify-center px-6 py-3 font-mono text-xs tracking-widest uppercase border border-border hover:border-primary transition-colors cursor-pointer"
            >
              Explore Enterprise
            </Link>
          </div>
        </div>

        {/* Hero Right — Event Portrait */}
        <div className="lg:col-span-5 relative w-full aspect-[4/5] max-w-sm mx-auto border border-border p-2 bg-card">
          <div className="relative w-full h-full border border-primary/30 overflow-hidden">
            <Image
              src="/images/abhilash-ramesh-event.jpg"
              alt="Abhilash Kalathil Ramesh at an international hospitality event."
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
              style={{ objectPosition: "60% 30%" }}
            />
          </div>
          {/* Double hairline gold accent overlay */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
        </div>

      </section>

      <ZariRule />

      {/* Atmospheric Band — Healing Village */}
      <section className="relative w-full h-[420px] md:h-[560px] overflow-hidden">
        <Image
          src="/images/healing-village-property.jpg"
          alt="Kairali – The Ayurvedic Healing Village, an NABH-accredited Ayurvedic hospital set in gardens in Palakkad, Kerala."
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        {/* Fixed dark duotone overlay matching Night Ledger palette to guarantee readability in both light/dark themes */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--night-overlay)]/50 via-[var(--night-overlay)]/20 to-[var(--night-overlay)]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--night-overlay)]/85 via-[var(--night-overlay)]/40 to-transparent" />
        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 max-w-lg z-10">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[var(--night-ink)]/90">
            Palakkad, Kerala · 65 acres
          </p>
          <p className="font-display text-2xl italic text-[var(--night-ink)] md:text-3xl">
            Kairali – The Ayurvedic Healing Village
          </p>
          <p className="mt-2 font-sans text-xs text-[var(--night-ink)]/75">
            NABH-accredited Ayurvedic hospital · since 2018
          </p>
        </div>
      </section>

      <ZariRule />

      {/* Core Pillars Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-mono text-[10px] tracking-widest uppercase text-ink-muted mb-8">
          operating divisions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <div className="border border-border p-6 bg-card flex flex-col justify-between group hover:border-primary transition-colors min-h-[220px]">
            <div>
              <h3 className="font-display text-2xl text-ink mb-3 italic">Ayurvedic Healthcare</h3>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Directing Kairali – The Ayurvedic Healing Village in Palakkad, a 65-acre NABH-accredited Ayurvedic hospital offering clinical treatments, alongside a worldwide network of clinics.
              </p>
            </div>
            <Link href="/work#healthcare" className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-primary mt-6 group-hover:translate-x-1 transition-transform">
              <span>View details</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* Pillar 2 */}
          <div className="border border-border p-6 bg-card flex flex-col justify-between group hover:border-primary transition-colors min-h-[220px]">
            <div>
              <h3 className="font-display text-2xl text-ink mb-3 italic">Policy & Export</h3>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Founding board member of AYUSHEXCIL, establishing export promotion frameworks and global botanical supply standards in alignment with the Ministry of AYUSH.
              </p>
            </div>
            <Link href="/work#policy" className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-primary mt-6 group-hover:translate-x-1 transition-transform">
              <span>View details</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* Pillar 3 */}
          <div className="border border-border p-6 bg-card flex flex-col justify-between group hover:border-primary transition-colors min-h-[220px]">
            <div>
              <h3 className="font-display text-2xl text-ink mb-3 italic">Angel Investing</h3>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Backing early-stage founders via Mumbai Angels Network in clean-label consumer formulations, agricultural supply chains, green boutique hospitality, and biotech ventures.
              </p>
            </div>
            <Link href="/investing" className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-primary mt-6 group-hover:translate-x-1 transition-transform">
              <span>View thesis</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

        </div>
      </section>

      <ZariRule />

      {/* Highlights & Ledger Split */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Recent Essays */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          <h2 className="font-mono text-[10px] tracking-widest uppercase text-ink-muted">
            essays // latest
          </h2>
          
          <div className="flex flex-col space-y-4">
            <Link href="/writing/panchakarma-clinical-protocol-not-a-holiday" className="block border border-border p-5 bg-card hover:border-primary transition-colors">
              <div className="flex justify-between items-center text-[10px] font-mono text-primary uppercase mb-2">
                <span>Clinical Standards</span>
                <span>{readingTime}</span>
              </div>
              <h3 className="font-display text-xl text-ink italic mb-2">
                Panchakarma Is a Clinical Protocol, Not a Holiday
              </h3>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Why we treat Panchakarma as physician-led clinical care, not a spa package — and why the distinction is the whole point of running an accredited Ayurvedic hospital.
              </p>
            </Link>
          </div>

          <Link href="/writing" className="inline-flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase text-primary hover:underline">
            <BookOpen size={14} />
            <span>Browse all essays</span>
          </Link>
        </div>

        {/* Right Side: Awards */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          <div className="font-mono text-[10px] tracking-widest uppercase text-ink-muted">
            awards & honours
          </div>

          <div className="flex flex-col space-y-4">
            <div className="border border-border p-5 bg-card font-mono text-xs flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-primary font-bold">HAUTE GRANDEUR 2026</span>
                <span className="text-ink-muted">Winner</span>
              </div>
              <p className="text-[11px] text-ink-muted leading-normal uppercase">
                Best Marketing Director India
              </p>
            </div>

            <div className="border border-border p-5 bg-card font-mono text-xs flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-primary font-bold">ASIAONE 2017</span>
                <span className="text-ink-muted">Honouree</span>
              </div>
              <p className="text-[11px] text-ink-muted leading-normal uppercase">
                40 Under 40 Most Influential
              </p>
            </div>

            <div className="border border-border p-5 bg-card font-mono text-xs flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-primary font-bold">INDIA SALON & WELLNESS AWARDS</span>
                <span className="text-ink-muted">2017</span>
              </div>
              <p className="text-[11px] text-ink-muted leading-normal uppercase">
                Entrepreneurial Excellence Award for AYUSH Leadership
              </p>
            </div>
          </div>

          <Link href="/recognition" className="inline-flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase text-primary hover:underline">
            <Award size={14} />
            <span>View all honours</span>
          </Link>
        </div>

      </section>
    </div>
  );
}
