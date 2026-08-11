import React from "react";
import Link from "next/link";
import { ZariRule, LedgerList, LedgerRow } from "@/components/ui/ledger";
import { hrefFor, NAV_LABELS, type Locale } from "@/lib/i18n";

const FOOTER_FACTS: Record<Locale, { role: string; location: string; lineage: string; rights: string; analytics: string }> = {
  en: {
    role: "Executive Director, Kairali Group",
    location: "Delhi / Kerala, India",
    lineage: "Fourth Gen · Since 1908",
    rights: "ALL RIGHTS RESERVED.",
    analytics: "Analytics settings",
  },
  de: {
    role: "Executive Director, Kairali Group",
    location: "Delhi / Kerala, Indien",
    lineage: "Vierte Generation · Seit 1908",
    rights: "ALLE RECHTE VORBEHALTEN.",
    analytics: "Analyse-Einstellungen",
  },
  fr: {
    role: "Directeur exécutif, Kairali Group",
    location: "Delhi / Kerala, Inde",
    lineage: "Quatrième génération · Depuis 1908",
    rights: "TOUS DROITS RÉSERVÉS.",
    analytics: "Préférences de mesure",
  },
};

export function Footer({ locale = "en" }: { locale?: Locale }) {
  const currentYear = new Date().getFullYear();
  const facts = FOOTER_FACTS[locale];

  return (
    <footer className="w-full mt-auto bg-background">
      <ZariRule />
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Fact Table */}
        <div className="col-span-1 md:col-span-6">
          <LedgerList className="max-w-md">
            <LedgerRow label="Subject" value="Abhilash Kalathil Ramesh" />
            <LedgerRow label={locale === "de" ? "Rolle" : locale === "fr" ? "Fonction" : "Role"} value={facts.role} />
            <LedgerRow label={locale === "de" ? "Ort" : locale === "fr" ? "Lieu" : "Location"} value={facts.location} />
            <LedgerRow label={locale === "de" ? "Linie" : locale === "fr" ? "Lignée" : "Lineage"} value={facts.lineage} />
            <LedgerRow label="Contact" value="info@kairali.com" />
          </LedgerList>

        </div>

        {/* Right Side: Navigation & Socials */}
        <div className="col-span-1 md:col-span-6 flex flex-col md:items-end justify-between h-full md:min-h-[120px] space-y-6 md:space-y-0">
          <div className="flex flex-col md:items-end space-y-2 text-xs font-mono tracking-widest uppercase">
            <a 
              href="https://www.linkedin.com/in/abhilashkramesh-ayurvedicmedicine-ayurvedicherbalproducts/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-ink-muted hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>LinkedIn</span>
            </a>
            <Link href={hrefFor(locale, "faq")} className="text-ink-muted hover:text-primary transition-colors">
              {NAV_LABELS[locale].faq}
            </Link>
            <Link href={hrefFor(locale, "now")} className="text-ink-muted hover:text-primary transition-colors">
              {NAV_LABELS[locale].now}
            </Link>
            <Link href={hrefFor(locale, "privacy")} className="text-ink-muted hover:text-primary transition-colors">
              {NAV_LABELS[locale].privacy}
            </Link>
            <button
              type="button"
              data-analytics-settings
              className="min-h-11 text-ink-muted hover:text-primary transition-colors md:self-end"
            >
              {facts.analytics}
            </button>
          </div>

          <div className="flex flex-col md:items-end space-y-1">
            <div className="font-mono text-[9px] tracking-widest uppercase text-ink-muted">
              © {currentYear} ABHILASH K. RAMESH. {facts.rights}
            </div>
            <div className="font-mono text-[9px] tracking-widest uppercase text-ink-muted">
              Colophon: Instrument Serif · Instrument Sans · IBM Plex Mono. Built with Next.js.
            </div>
          </div>
        </div>
      </div>
      
    </footer>
  );
}
