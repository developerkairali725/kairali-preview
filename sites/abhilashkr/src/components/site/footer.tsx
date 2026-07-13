import React from "react";
import Link from "next/link";
import { ZariRule, LedgerList, LedgerRow } from "@/components/ui/ledger";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto bg-background">
      <ZariRule />
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Fact Table */}
        <div className="col-span-1 md:col-span-6">
          <LedgerList className="max-w-md">
            <LedgerRow label="Subject" value="Abhilash Kalathil Ramesh" />
            <LedgerRow label="Role" value="Executive Director, Kairali Group" />
            <LedgerRow label="Location" value="Delhi / Kerala, India" />
            <LedgerRow label="Lineage" value="Fourth Gen · Since 1908" />
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
            <Link href="/faq" className="text-ink-muted hover:text-primary transition-colors">
              Frequently Asked Questions
            </Link>
            <Link href="/now" className="text-ink-muted hover:text-primary transition-colors">
              Current Focus (/now)
            </Link>
          </div>

          <div className="flex flex-col md:items-end space-y-1">
            <div className="font-mono text-[9px] tracking-widest uppercase text-ink-muted">
              © {currentYear} ABHILASH K. RAMESH. ALL RIGHTS RESERVED.
            </div>
            <div className="font-mono text-[8px] tracking-widest uppercase text-ink-muted/50">
              Colophon: Instrument Serif · Instrument Sans · IBM Plex Mono. Built with Next.js.
            </div>
          </div>
        </div>
      </div>
      
      {/* Plausible/Umami Privacy-First Analytics Slot (No Cookies Banners Required) */}
      {/* <script defer data-domain="abhilashramesh.com" src="https://plausible.io/js/script.js"></script> */}
    </footer>
  );
}
