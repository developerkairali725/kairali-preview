import Image from "next/image";
import type { SectionProps } from "./LandingPage";
import { contact, site } from "../../campaign-v110/lib/site.ts";
import { NABH_NO } from "./facts.ts";

// Fixed wording (task brief): never edited per campaign.
const DISCLAIMER =
  "Ayurvedic programs at Kairali are supervised by qualified doctors and complement, not replace, the medical care you already receive. Individual experiences vary.";

/**
 * Footer, shared by every variant (the A structure, skinned by --lp-* vars). Contact facts come from site.ts.
 * "Cookie preferences" renders only where consent is required (EU/EEA/UK/CH); data-ahv-cookie-choices is the
 * attribute the live site's consent re-open listens for.
 *
 * Production surface (the live ad routes): the site's own consent applies everywhere, so its re-open control
 * always shows; the cookie policy is the site route; the WhatsApp link carries data-ahv-whatsapp so the shared
 * chrome does not add a second one; id="contact" is a measured anchor of the site's consent runtime.
 */
export default function Footer({ req }: SectionProps) {
  const production = req.surface === "production";
  const track = (cta: "call" | "whatsapp" | "email") => ({ "data-track": "cta_click", "data-track-cta": cta, "data-track-position": "footer" });
  return (
    <footer className="lp-foot" {...(production ? { id: "contact" } : {})}>
      <div className="lp-foot__grid">
        <div className="lp-foot__brand">
          <Image className="lp-foot__logo" src="/lp-v2/img/ktahv-logo-white.svg" alt={site.name} width={109} height={76} loading="lazy" />
          <p>A NABH-accredited Ayurvedic hospital of the Kairali Ayurvedic Group, in Palakkad, Kerala.</p>
        </div>
        <div className="lp-foot__col">
          <p className="lp-over lp-foot__label">Visit</p>
          <address className="lp-foot__addr">{contact.address.map((line) => <span key={line}>{line}</span>)}</address>
        </div>
        <div className="lp-foot__col">
          <p className="lp-over lp-foot__label">Speak to us</p>
          <a className="lp-foot__link" href={contact.phone.href} {...track("call")}>{contact.phone.display}</a>
          <a className="lp-foot__link" href={`https://wa.me/${contact.whatsapp.number}`} {...track("whatsapp")} {...(production ? { "data-ahv-whatsapp": "1" } : {})}>WhatsApp {contact.whatsapp.display}</a>
          <a className="lp-foot__link" href={`mailto:${contact.email}`} {...track("email")}>{contact.email}</a>
        </div>
        <div className="lp-foot__col">
          <p className="lp-over lp-foot__label">Accreditation</p>
          <p><b>NABH</b> · {NABH_NO}</p>
        </div>
      </div>
      <p className="lp-foot__disc">{DISCLAIMER}</p>
      <div className="lp-foot__base">
        <p>© {new Date().getFullYear()} Kairali Ayurvedic Group</p>
        <nav className="lp-foot__legal" aria-label="Legal">
          <a href={site.legal.privacy}>Privacy</a>
          <a href={site.legal.terms}>Terms</a>
          <a href={production ? "/cookie-policy/" : site.legal.cookies}>Cookie policy</a>
          {production || req.consentRequired ? <button type="button" className="lp-foot__cookies" data-ahv-cookie-choices>Cookie preferences</button> : null}
          <a href="/">Main website</a>
        </nav>
      </div>
    </footer>
  );
}
