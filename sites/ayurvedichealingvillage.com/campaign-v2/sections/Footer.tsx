import Image from "next/image";
import type { SectionProps } from "./LandingPage";
import { contact, site } from "../../campaign-v110/lib/site.ts";
import { NABH_NO } from "./facts.ts";
import { pageUi } from "../production/ui.ts";
import { whatsappHref } from "../production/whatsapp.ts";

// Fixed wording (task brief): never edited per campaign.
// (production/ui.ts holds the same line, and its German and Russian wording for those routes.)

/**
 * Footer, shared by every variant (the A structure, skinned by --lp-* vars). Contact facts come from site.ts.
 * "Cookie preferences" renders only where consent is required (EU/EEA/UK/CH); data-ahv-cookie-choices is the
 * attribute the live site's consent re-open listens for.
 *
 * Production surface (the live ad routes): the site's own consent applies everywhere, so its re-open control
 * always shows; the cookie policy is the site route; the WhatsApp link carries data-ahv-whatsapp so the shared
 * chrome does not add a second one; id="contact" is a measured anchor of the site's consent runtime.
 */
export default function Footer({ c, req }: SectionProps) {
  const production = req.surface === "production";
  const f = pageUi(req).footer;
  const track = (cta: "call" | "whatsapp" | "email") => ({ "data-track": "cta_click", "data-track-cta": cta, "data-track-position": "footer" });
  return (
    <footer className="lp-foot" {...(production ? { id: "contact" } : {})}>
      <div className="lp-foot__grid">
        <div className="lp-foot__brand">
          <Image className="lp-foot__logo" src="/lp-v2/img/ktahv-logo-white.svg" alt={site.name} width={109} height={76} loading="lazy" />
          <p>{f.brand}</p>
        </div>
        <div className="lp-foot__col">
          <p className="lp-over lp-foot__label">{f.visit}</p>
          <address className="lp-foot__addr">{contact.address.map((line) => <span key={line}>{line}</span>)}</address>
        </div>
        <div className="lp-foot__col">
          <p className="lp-over lp-foot__label">{f.speak}</p>
          <a className="lp-foot__link" href={contact.phone.href} {...track("call")}>{contact.phone.display}</a>
          <a className="lp-foot__link" href={whatsappHref(c, req)} {...track("whatsapp")} {...(production ? { "data-ahv-whatsapp": "1" } : {})}>WhatsApp {contact.whatsapp.display}</a>
          <a className="lp-foot__link" href={`mailto:${contact.email}`} {...track("email")}>{contact.email}</a>
        </div>
        <div className="lp-foot__col">
          <p className="lp-over lp-foot__label">{f.accreditation}</p>
          <p><b>NABH</b> · {NABH_NO}</p>
        </div>
      </div>
      <p className="lp-foot__disc">{f.disclaimer}</p>
      <div className="lp-foot__base">
        <p>© {new Date().getFullYear()} {f.group}</p>
        <nav className="lp-foot__legal" aria-label="Legal">
          <a href={site.legal.privacy}>{f.privacy}</a>
          <a href={site.legal.terms}>{f.terms}</a>
          <a href={production ? "/cookie-policy/" : site.legal.cookies}>{f.cookiePolicy}</a>
          {production || req.consentRequired ? <button type="button" className="lp-foot__cookies" data-ahv-cookie-choices>{f.cookiePrefs}</button> : null}
          <a href={f.mainHref}>{f.main}</a>
        </nav>
      </div>
    </footer>
  );
}
