import React from "react";
import Image from "next/image";
import { ZariRule, LedgerList, LedgerRow } from "@/components/ui/ledger";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Professional Work & Operations | Abhilash K. Ramesh",
  description: "Explore the business footprint of Kairali Ayurvedic Group, KAPPL manufacturing, day-spas network, and Villa Raag wellness stays.",
  alternates: {
    canonical: `${SITE_URL}/work`,
  },
  openGraph: {
    title: "Professional Work & Operations | Abhilash K. Ramesh",
    description: "Explore the business footprint of Kairali Ayurvedic Group, KAPPL manufacturing, day-spas network, and Villa Raag wellness stays.",
    url: `${SITE_URL}/work`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=Professional%20Work%20%26%20Operations&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Operations%20%26%20Enterprise`,
        width: 1200,
        height: 630,
        alt: "Professional Work & Operations — Abhilash Kalathil Ramesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Work & Operations | Abhilash K. Ramesh",
    description: "Explore the business footprint of Kairali Ayurvedic Group, KAPPL manufacturing, day-spas network, and Villa Raag wellness stays.",
    images: [`${SITE_URL}/api/og?title=Professional%20Work%20%26%20Operations&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Operations%20%26%20Enterprise`],
  },
};

export default function WorkPage() {
  return (
    <div className="w-full bg-background text-foreground py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col space-y-4 mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary">
            operations & enterprise
          </div>
          <h1 className="font-display text-4xl md:text-5xl italic text-ink">
            Kairali Ayurvedic Group
          </h1>
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-2xl">
            Kairali Ayurvedic Group spans a 65-acre NABH-accredited Ayurvedic hospital (Kairali – The Ayurvedic Healing Village, Palakkad), WHO-GMP-certified Ayurvedic pharmaceutical manufacturing (KAPPL, Kerala & Tamil Nadu), a network of Ayurvedic day-spa and clinic centres (KAC), and boutique wellness hospitality (Villa Raag, Goa).
          </p>
        </div>

        <ZariRule className="mb-12" />

        {/* 1. KTAHV (Palakkad) - Clinical Division */}
        <section id="healthcare" className="mb-16">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary mb-2">
            Clinical Hospital Division
          </div>
          <h2 className="font-display text-3xl italic text-ink mb-4">
            Kairali – The Ayurvedic Healing Village, Palakkad
          </h2>

          {/* KTAHV Image */}
          <div className="relative w-full aspect-[3/2] mb-6 border border-border p-1 bg-card overflow-hidden">
            <div className="relative w-full h-full border border-primary/20 overflow-hidden">
              <Image
                src="/images/healing-village-grounds.jpg"
                alt="Kairali – The Ayurvedic Healing Village, a 65-acre NABH-accredited Ayurvedic hospital in Palakkad, Kerala."
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
                style={{ objectPosition: "center 40%" }}
              />
            </div>
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary" />
          </div>

          <p className="font-sans text-xs text-ink-muted leading-relaxed mb-6">
            A 65-acre NABH-accredited Ayurvedic hospital (since 2018) providing clinical treatments under the guidance of licensed Ayurvedic physicians. Operating with strict therapeutic protocols, we admit patients for long-term health management, clinical rehabilitation, and specialized program regimens. 
          </p>

          <LedgerList className="max-w-md mb-8">
            <LedgerRow label="Facility Status" value="NABH-Accredited Ayurvedic Hospital (since 2018)" />
            <LedgerRow label="Campus" value="65 acres, Palakkad, Kerala" />
            <LedgerRow label="Primary Focus" value="Clinical Treatments & Diagnostic Programs" />
            <LedgerRow label="Medical Custodians" value="Licensed Ayurvedic Physicians & Therapists" />
            <LedgerRow label="Patient Admissions" value="Specialized Inpatient Programs" />
          </LedgerList>
        </section>

        <ZariRule className="mb-16" />

        {/* 2. KAPPL - Pharmaceutical Manufacturing */}
        <section id="products" className="mb-16">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary mb-2">
            FMCG & Pharmaceutical Manufacturing
          </div>
          <h2 className="font-display text-3xl italic text-ink mb-4">
            Kairali Ayurvedic Products (KAPPL)
          </h2>

          {/* KAPPL Product Image */}
          <div className="relative w-full aspect-[3/2] mb-6 border border-border p-1 bg-card overflow-hidden">
            <div className="relative w-full h-full border border-primary/20 overflow-hidden">
              <Image
                src="/images/kappl-product-range.png"
                alt="Kairali WHO-GMP-certified Ayurvedic pharmaceutical and personal care products."
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
              />
            </div>
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary" />
          </div>

          <p className="font-sans text-xs text-ink-muted leading-relaxed mb-6">
            WHO-GMP-certified manufacturing division operating two production units across Kerala and Tamil Nadu. Focuses on FMCG and pharmaceutical production, including authentic Ayurvedic remedies, proprietary herbal formulations, and personal care products. We supply clinical-grade therapeutic formulations and support B2B lines including wholesale distribution, third-party contract manufacturing, and super-stockist networks. Certifications: WHO-GMP, ISO, FSSAI, FDA, GLP, CE.
          </p>

          <LedgerList className="max-w-md mb-8">
            <LedgerRow label="Production Facilities" value="Kerala & Tamil Nadu Units" />
            <LedgerRow label="Certifications" value="WHO-GMP · ISO · FSSAI · FDA · GLP · CE" />
            <LedgerRow label="B2B Operations" value="Contract Manufacturing · Wholesale · Super-stockist" />
            <LedgerRow label="Export Footprint" value="Global reach to 27+ countries" />
          </LedgerList>
        </section>

        <ZariRule className="mb-16" />

        {/* 3. KAC — Kairali Ayurvedic Centres */}
        <section id="centres" className="mb-16">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary mb-2">
            Clinics & Therapy Centres
          </div>
          <h2 className="font-display text-3xl italic text-ink mb-4">
            Kairali Ayurvedic Centres (KAC)
          </h2>

          {/* KAC Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative aspect-[3/2] border border-border p-1 bg-card overflow-hidden">
              <div className="relative w-full h-full border border-primary/20 overflow-hidden">
                <Image
                  src="/images/kac-therapy.jpg"
                  alt="Ayurvedic clinical therapy session (Abhyangam) at Kairali Ayurvedic Centre."
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="relative aspect-[3/2] border border-border p-1 bg-card overflow-hidden">
              <div className="relative w-full h-full border border-primary/20 overflow-hidden">
                <Image
                  src="/images/kac-centre.jpg"
                  alt="Kairali Ayurvedic Centre clinical reception."
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <p className="font-sans text-xs text-ink-muted leading-relaxed mb-6">
            A worldwide network of Ayurvedic clinics and therapy centres offering clinical consultations, Panchakarma treatments, and traditional therapeutic regimens under the supervision of qualified physicians. Operating across India and international markets.
          </p>

          <LedgerList className="max-w-md mb-8">
            <LedgerRow label="Format" value="Clinics & Therapy Centres" />
            <LedgerRow label="Services" value="Clinical Consultations · Panchakarma · Therapeutic Regimens" />
            <LedgerRow label="Website" value="kairalicenters.com" />
          </LedgerList>
        </section>

        <ZariRule className="mb-16" />

        {/* 4. Villa Raag - Boutique Wellness Stays */}
        <section id="hospitality" className="mb-16">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary mb-2">
            Boutique Hospitality
          </div>
          <h2 className="font-display text-3xl italic text-ink mb-4">
            Villa Raag, Goa
          </h2>

          {/* Villa Raag Images */}
          <div className="flex flex-col space-y-4 mb-6">
            <div className="relative w-full aspect-[21/9] border border-border p-1 bg-card overflow-hidden">
              <div className="relative w-full h-full border border-primary/20 overflow-hidden">
                <Image
                  src="/images/villa-raag-exterior.jpg"
                  alt="Villa Raag boutique wellness property terrace and pool overlooking Agonda Beach."
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative aspect-[3/2] border border-border p-1 bg-card overflow-hidden">
                <div className="relative w-full h-full border border-primary/20 overflow-hidden">
                  <Image
                    src="/images/villa-raag-1.webp"
                    alt="Restorative beachfront stay space at Villa Raag."
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative aspect-[3/2] border border-border p-1 bg-card overflow-hidden">
                <div className="relative w-full h-full border border-primary/20 overflow-hidden">
                  <Image
                    src="/images/villa-raag-2.webp"
                    alt="Organic wellness gastronomy dining area at Villa Raag."
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="font-sans text-xs text-ink-muted leading-relaxed mb-6">
            Villa Raag — a boutique wellness property on Agonda Beach, South Goa: six rooms, beachfront yoga spaces, and a pool. Combining clean organic nutrition with personalized wellness hospitality in a coastal setting.
          </p>

          <LedgerList className="max-w-md mb-8">
            <LedgerRow label="Location" value="Agonda Beach, South Goa" />
            <LedgerRow label="Classification" value="Boutique Wellness Property" />
            <LedgerRow label="Operations" value="Wellness Hospitality & Organic Gastronomy" />
          </LedgerList>
        </section>

        <ZariRule className="mb-16" />

        {/* 5. Policy Advocacy - AYUSHEXCIL */}
        <section id="policy" className="mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary mb-2">
            Policy Advocacy & Export
          </div>
          <h2 className="font-display text-3xl italic text-ink mb-4">
            AYUSHEXCIL Board Representation
          </h2>
          <p className="font-sans text-xs text-ink-muted leading-relaxed mb-6">
            Contributing as a founding board member of AYUSHEXCIL (Ayush Export Promotion Council) under the Ministry of AYUSH, Government of India, advising on export policy, international trade rules, and regulatory standardisation for botanical products.
          </p>

          <LedgerList className="max-w-md">
            <LedgerRow label="Institution" value="AYUSHEXCIL" />
            <LedgerRow label="Role" value="Founding Board Member" />
            <LedgerRow label="Regulatory Link" value="Ministry of AYUSH, Government of India" />
          </LedgerList>
        </section>

      </div>
    </div>
  );
}
