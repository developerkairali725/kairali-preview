// Shared header + footer for bulkayurvedaoils.com — KAPPL's bulk-supply desk.
// Product-pharma register. "The Batch Ledger" direction, warm pole.
import Link from "next/link";
import type { ReactNode } from "react";
import { SocialLinks } from "@kairali/social";

export const EMAIL = "info@kairali.com"; // locked fact (CLAUDE.md)
// INTERIM number per the 13-Jul ruling ("until a group number is provided") —
// FLAGGED FOR SWAP: the B2B desk number is niche-brief §7 ask #3.
export const WHATSAPP_URL = "https://wa.me/919289838797";
export const STORE_BULK_COLLECTION =
  "https://www.kairaliproducts.in/collections/ayurvedic-herbal-products-wholesaler-bulk-supplier";

// Full-site nav (Phase-1 build): the golden page's section anchors graduated
// into the strategy's real routes — labels unchanged, targets now pages.
export const NAV = [
  { href: "/oils", label: "Oils & powders" },
  { href: "/for/spas-hotels-resorts", label: "For your business" },
  { href: "/quality", label: "Quality" },
  { href: "/how-bulk-supply-works", label: "How it works" },
  { href: "/about", label: "About" },
];

/** Compact subpage header — the ledger register carried onto every later page
 *  (GOLDEN PAGE law: every page matches the approved homepage's system). */
export function PageIntro({
  overline,
  title,
  lede,
  children,
}: {
  overline: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-head" aria-labelledby="page-heading">
      <div className="container">
        <p className="overline">{overline}</p>
        <h1 id="page-heading">{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
        {children}
        <div className="accent-rule" aria-hidden="true" />
      </div>
    </section>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container bar">
        <Link className="logo-link" href="/" aria-label="Bulk Ayurveda Oils — home">
          <img src="/images/kairali-icon.svg" alt="Kairali Ayurvedic Group" width="56" height="39" />
          <span className="logo-name">
            Bulk Ayurveda Oils
            <small>A KAPPL supply desk · Kairali Ayurvedic Group</small>
          </span>
        </Link>
        {/* pass-2 fix (auditor): ONE primary CTA per surface — the header action
            is a ghost; the spec-card button is the page's single primary. */}
        <a className="btn btn-secondary header-cta" href="/#rfq" data-cta="rfq-open">
          Get a bulk quote
        </a>
      </div>
      {/* pass-2 fix (auditor): a VISIBLE mobile nav affordance. Desktop keeps the
          visible-nav pattern (never a desktop hamburger); on mobile the same nav
          renders as a scrollable pill row — always on screen, no menu to find. */}
      <nav className="site-nav" aria-label="Sections">
        <div className="container nav-row">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <p className="tagline">Classical Ayurvedic oils, by the batch.</p>
        <div className="footer-grid">
          <div className="footer-col about-col">
            <h4>The supply desk</h4>
            <p>
              bulkayurvedaoils.com is the bulk-supply desk of Kairali Ayurvedic
              Products Pvt. Ltd. (KAPPL) — the Kairali Ayurvedic Group&rsquo;s
              WHO-GMP-certified manufacturer in Pollachi, Tamil Nadu. Trusted
              since 1908 — four generations of Ayurvedic manufacture.
            </p>
          </div>
          <div className="footer-col">
            <h4>This desk</h4>
            <ul>
              <li><Link href="/oils">Bulk oils &amp; powders</Link></li>
              <li><Link href="/for/spas-hotels-resorts">Spas, hotels &amp; resorts</Link></li>
              <li><Link href="/for/panchakarma-centres-clinics">Panchakarma centres &amp; clinics</Link></li>
              <li><Link href="/for/distributors-importers">Distributors &amp; importers</Link></li>
              <li><Link href="/quality">Quality</Link></li>
              <li><Link href="/how-bulk-supply-works">How bulk supply works</Link></li>
              <li><Link href="/request-a-quote">Request a quote</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>The Kairali Group</h4>
            <ul>
              <li><a href="https://kappl.co.in" rel="noopener">KAPPL — the manufacturer</a></li>
              <li><a href={STORE_BULK_COLLECTION} rel="noopener" data-cta="storefront-handoff">Retail &amp; bulk store</a></li>
              <li><a href="https://www.bulkayurvedaproducts.com" rel="noopener">Private label &amp; contract manufacturing</a></li>
              <li><a href="https://www.kairali.com" rel="noopener">Kairali Ayurvedic Group</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></li>
              <li><a href={WHATSAPP_URL} data-cta="whatsapp-click">WhatsApp +91 92898 38797</a></li>
              <li><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <Link href="/cookie-policy">Cookies</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Follow Kairali</h4>
            {/* D-20260718-04: the shared fleet social set — handles live in
                packages/social/src/config.ts ONLY (canonical true-up D-20260720-39) */}
            <SocialLinks />
          </div>
        </div>
        <p className="footer-disclaimer">
          Certifications shown as published by KAPPL. Classical formulations are
          supplied for professional therapy use; Ayurvedic preparations should be
          used under the guidance of a qualified physician. ©{" "}
          {new Date().getFullYear()} Kairali Ayurvedic Group.
        </p>
      </div>
    </footer>
  );
}
