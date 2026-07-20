// Shared header + footer for whatisayurveda.com. Group/educational register.
import Link from "next/link";
import { SocialLinks } from "@kairali/social";

export const EMAIL = "info@kairali.com";
export const WHATSAPP_URL = "https://wa.me/919289838797"; // Priya = the Chatbase AI ASSISTANT, NOT a physician
// (Abilash confirmed 15 Jul 2026). NEVER label this "ask a doctor" — on a YMYL
// health site that is a false medical claim. Disclose it as an AI assistant.

export const NAV = [
  { href: "/what-is-ayurveda", label: "What is Ayurveda" },
  { href: "/doshas", label: "Doshas" },
  { href: "/panchakarma", label: "Panchakarma" },
  { href: "/herbs", label: "Herbs" },
  { href: "/is-ayurveda-scientific", label: "The Evidence" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        {/* CARD-5 REDUCE (D-20260720-26): steward presence lives in footer +
            About only — the masthead leads with the site's own name. */}
        <Link className="logo-link" href="/" aria-label="What is Ayurveda — home">
          <span className="logo-name">What is Ayurveda</span>
        </Link>
        <nav className="site-nav" aria-label="Sections">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>{n.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="tagline">Understanding Ayurveda, honestly.</p>
        <div className="footer-grid">
          <div className="footer-col">
            <h4>About this site</h4>
            <p style={{ margin: "10px 0 0", maxWidth: "36ch" }}>
              Ayurveda has been our family&rsquo;s practice for four generations.
              We built this to explain it honestly — its evidence and its limits
              alike — as our way of giving back to a science that has given us so
              much. Published by the Kairali Ayurvedic Group. Health pages reviewed by one
              of our Ayurvedic physicians are marked with that doctor's name and
              the date they approved it. For learning, not
              medical advice.
            </p>
          </div>
          <div className="footer-col">
            <h4>Learn</h4>
            <ul>
              <li><Link href="/what-is-ayurveda">What is Ayurveda</Link></li>
              <li><Link href="/doshas">The three doshas</Link></li>
              <li><Link href="/panchakarma">Panchakarma</Link></li>
              <li><Link href="/herbs">Ayurvedic herbs</Link></li>
              <li><Link href="/is-ayurveda-scientific">Is Ayurveda scientific?</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>The Kairali Group</h4>
            <ul>
              <li><a href="https://www.ayurvedichealingvillage.com" rel="noopener">Healing Village hospital</a></li>
              <li><a href="https://www.kairaliproducts.com" rel="noopener">Ayurvedic products</a></li>
              <li><a href="https://www.kairali.com" rel="noopener">Kairali Group</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href={`mailto:${EMAIL}`} data-cta="email_click">{EMAIL}</a></li>
              <li><a href={WHATSAPP_URL} data-cta="whatsapp_click">WhatsApp +91 92898 38797</a></li>
            </ul>
          </div>
        </div>
        {/* D-20260718-04: the shared fleet social set — handles live in
            packages/social/src/config.ts ONLY (one-file true-up) */}
        <SocialLinks />
        <p className="footer-disclaimer">
          The information on whatisayurveda.com is educational and is not a
          substitute for professional medical advice, diagnosis, or treatment.
          Ayurvedic therapies and herbs should be used under the guidance of a
          qualified physician. Always consult a doctor before starting any
          treatment. © {new Date().getFullYear()} Kairali Ayurvedic Group.
        </p>
      </div>
    </footer>
  );
}
