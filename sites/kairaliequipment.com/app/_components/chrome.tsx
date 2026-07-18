// Shared chrome for kairaliequipment.com — "The Foundry Ledger" (MODE B
// design direction, launches/kairaliequipment.com/DESIGN_DIRECTION.md).
// Group / B2B equipment register (Register A).
//
// WhatsApp COUNT LAW (owner option-c ruling, design-review/pass4-fixed-rulings.md §1):
// WhatsApp appears EXACTLY TWICE in the design system — the hero primary CTA
// (app/page.tsx) and the sticky MOBILE utility bar below. The header carries
// NONE and the footer carries NONE. Do not add a third entry.
//
// Interim WhatsApp number = fleet Priya line (LOCKED FACTS). The live site's
// +91-9555156156 is NOT in LOCKED FACTS and is never printed (HARD GATE 6).
// LOUD SWAP FLAG (STRATEGY §4): the pre-filled message text identifies the
// equipment site so Priya's line can triage until an equipment number lands.
import Link from "next/link";

export const EMAIL = "info@kairali.com"; // locked fact
export const WHATSAPP_URL =
  "https://wa.me/919289838797?text=Hello%20Kairali%20%E2%80%94%20equipment%20enquiry%20via%20kairaliequipment.com";

// Group social profiles — mined from the legacy Kairali group site footers
// (content-mined/arogyakendra.com/index.html:534-537), https-normalised.
// Nothing invented (HARD GATE 6).
export const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/pages/Kairaliayurvedicgroup/114901512030869" },
  { label: "X (Twitter)", href: "https://twitter.com/Kairali_Group" },
  { label: "YouTube", href: "https://www.youtube.com/user/kairaliayurvedagroup" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/kairali-ayurvedic-group" },
];

export const NAV = [
  { href: "/equipment", label: "Equipment" },
  { href: "/manufacturing", label: "Manufacturing" },
  { href: "/trade", label: "Trade & Export" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <Link className="lockup" href="/" aria-label="Kairali Equipment — home">
          <span className="lockup-name">
            Kairali Equipment
            <small>A family practising Ayurveda since 1908</small>
          </span>
        </Link>
        <nav className="site-nav" aria-label="primary">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>{n.label}</Link>
          ))}
        </nav>
        <div className="hdr-actions">
          <a className="btn btn-quote hdr-quote" href="/#request-a-quote" data-cta="quote-open">
            Request a Quote
          </a>
        </div>
      </div>
    </header>
  );
}

export function WhatsAppGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/** Sticky MOBILE utility bar — kairalicenters pattern; WhatsApp entry 2 of 2. */
export function StickyBar() {
  return (
    <nav className="utility-bar" aria-label="quick contact">
      <a className="u-quote" href="/#request-a-quote" data-cta="quote-open">Request a Quote</a>
      <a className="u-wa" href={WHATSAPP_URL} data-cta="whatsapp-click">
        <WhatsAppGlyph />
        WhatsApp us
      </a>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <p className="tagline">The equipment beneath the treatment.</p>
        <div className="footer-grid">
          <div className="footer-col">
            <h4>About</h4>
            <p className="footer-about">
              Kairali Equipment is the Ayurveda-equipment manufacturing division of
              the Kairali Ayurvedic Group — founded in 1989, a family practising
              Ayurveda since 1908, and the family group behind the NABH-accredited
              Kairali — The Ayurvedic Healing Village.
            </p>
          </div>
          <div className="footer-col">
            <h4>The catalogue</h4>
            <ul>
              <li><Link href="/equipment">Equipment lines</Link></li>
              <li><Link href="/manufacturing">Manufacturing</Link></li>
              <li><Link href="/certifications">Certifications</Link></li>
              <li><Link href="/trade">Trade &amp; export</Link></li>
              <li><Link href="/faq">Procurement FAQ</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>The Kairali Group</h4>
            <ul>
              <li><a href="https://www.kairali.com" rel="noopener">Kairali Group</a></li>
              <li><a href="https://www.ayurvedichealingvillage.com" rel="noopener">The Healing Village hospital</a></li>
              <li><a href="https://www.kairaliproducts.com" rel="noopener">Ayurvedic products</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></li>
              <li><Link href="/#request-a-quote">Request a quote</Link></li>
              <li><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <Link href="/cookie-policy">Cookies</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Follow</h4>
            <ul>
              {SOCIALS.map((s) => (
                <li key={s.label}><a href={s.href} rel="noopener">{s.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <p className="footer-disclaimer">
          Catalogue data on this preview carries owner-ordered placeholders (SKU / price
          lines) until the real catalogue lands — placeholder values are never real
          offers. © 1989–2026 Kairali Ayurvedic Group.
        </p>
      </div>
    </footer>
  );
}
