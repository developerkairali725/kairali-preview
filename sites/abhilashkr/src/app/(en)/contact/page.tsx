import React from "react";
import { ZariRule, LedgerList, LedgerRow } from "@/components/ui/ledger";
import ContactForm from "./contact-form";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Direct Connect & Routing | Abhilash K. Ramesh",
  description: "Get in touch directly for institutional operations, speaking engagements, or investment proposals.",
  alternates: alternatesFor("contact"),
  openGraph: {
    title: "Direct Connect & Routing | Abhilash K. Ramesh",
    description: "Get in touch directly for institutional operations, speaking engagements, or investment proposals.",
    url: `${SITE_URL}/contact`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=Direct%20Connect%20%26%20Routing&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Contact%20Coordinates`,
        width: 1200,
        height: 630,
        alt: "Direct Connect & Routing — Abhilash Kalathil Ramesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Direct Connect & Routing | Abhilash K. Ramesh",
    description: "Get in touch directly for institutional operations, speaking engagements, or investment proposals.",
    images: [`${SITE_URL}/api/og?title=Direct%20Connect%20%26%20Routing&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Contact%20Coordinates`],
  },
};

export default function ContactPage() {
  return (
    <div className="w-full bg-background text-foreground py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Left Side: Contact Coordinates */}
        <div className="md:col-span-5 flex flex-col space-y-6">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary">
            contact coordinates
          </div>
          <h1 className="font-display text-4xl md:text-5xl italic text-ink">
            Direct Connect
          </h1>
          <p className="font-sans text-xs text-ink-muted leading-relaxed">
            For institutional partnerships, speaking requests, or investment pitches, connect via the channels listed below.
          </p>

          <ZariRule />

          <div className="pt-2">
            <LedgerList>
              <LedgerRow label="Primary Email" value="info@kairali.com" />
              <LedgerRow label="Phone (IVR)" value="+91-9555-156-156" />
              <LedgerRow label="LinkedIn" value="Abhilash Ramesh" />
              <LedgerRow label="Kairali HQ" value="New Delhi, India" />
            </LedgerList>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <ContactForm />

      </div>
    </div>
  );
}
