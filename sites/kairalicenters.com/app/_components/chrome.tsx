// Shared header + footer for kairalicenters.com. Group register.
import Link from "next/link";

export const EMAIL = "info@kairali.com";
export const WHATSAPP_URL = "https://wa.me/919289838797"; // interim Priya number (DECISIONS 2026-07-13)

export const NAV = [
  { href: "/#india", label: "India Centres" },
  { href: "/#international", label: "International" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <Link className="logo-link" href="/" aria-label="Kairali Ayurvedic Centres — home">
          <img src="/images/kairali-logo.png" alt="Kairali Ayurvedic Group" width="46" height="46" />
          <span className="logo-name">
            Kairali Ayurvedic Centres
            <small>Health through ayurveda · since 1908</small>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Sections">
          {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        </nav>
        <a className="btn btn-primary header-cta" href={WHATSAPP_URL} data-cta="whatsapp_click">
          WhatsApp
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <p className="tagline">Classical Ayurvedic care, close to you.</p>
        <div className="footer-grid">
          <div className="footer-col">
            <h4>About</h4>
            <p style={{ margin: "10px 0 0", maxWidth: "34ch" }}>
              Kairali Ayurvedic Centres are part of the Kairali Ayurvedic Group —
              a family of Ayurvedic physicians since 1908, with an NABH-accredited
              hospital and a WHO-GMP-certified pharmacy in Kerala.
            </p>
          </div>
          <div className="footer-col">
            <h4>The Kairali Group</h4>
            <ul>
              <li><a href="https://www.ayurvedichealingvillage.com" rel="noopener">The Healing Village hospital</a></li>
              <li><a href="https://www.kairaliproducts.com" rel="noopener">Ayurvedic products</a></li>
              <li><a href="https://www.kairali.com" rel="noopener">Kairali Group</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href={`mailto:${EMAIL}`} data-cta="email_click">{EMAIL}</a></li>
              <li><a href={WHATSAPP_URL} data-cta="whatsapp_click">WhatsApp +91 92898 38797</a></li>
              <li><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
        <p className="footer-disclaimer">
          Ayurvedic treatment should be taken under the guidance of a qualified
          physician. Centre timings and details may change — please call the
          centre before visiting. © 1908–2026 Kairali Ayurvedic Group.
        </p>
      </div>
    </footer>
  );
}
