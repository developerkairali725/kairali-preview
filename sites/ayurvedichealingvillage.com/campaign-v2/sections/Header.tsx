import Image from "next/image";
import { contact, site } from "../../campaign-v110/lib/site.ts";
import LocaleSwitcher from "./interactive/LocaleSwitcher";
import type { SectionProps } from "./LandingPage";
import { PhoneIcon, WaIcon } from "./icons";
import { pageUi } from "../production/ui.ts";
import { whatsappHref } from "../production/whatsapp.ts";

// One header for every variant; sections.css shapes it per [data-variant] (A: overlay on the dark hero,
// B: floating island, C: editorial rule, D: white pill). A sits over the hero photo, so it carries the top scrim
// (`lp-scrim`, sections.css "Text over photos") that keeps its links readable on any photo.
//
// Production surface (the live ad routes, English only): no language switcher; the logo goes to the main site
// (an in-page "#top" would leave a hash the consent runtime does not measure); the actions sit in a <nav>, which
// is where the site's shared chrome (public/design/review-chrome.js) adds its existing "Chat" control. After the
// <nav> comes the route's consultation CTA, shown only once the header is pinned on desktop (owner, 8 Oct 2026:
// production/StickyHeader.tsx + production.css), so the hero keeps its single CTA and the DOM order is the visual order.
export default function Header({ c, v, req }: SectionProps) {
  const dark = v === "A";
  const production = req.surface === "production";
  const Actions = production ? "nav" : "div";
  const ui = pageUi(req);
  return (
    <header className={dark ? "lp-header lp-scrim" : "lp-header"} data-tone={dark ? "dark" : "light"}>
      <div className="lp-header__bar">
        <a className="lp-header__home" href={production ? "/" : "#top"} aria-label={site.name}>
          <Image
            src={dark ? "/lp-v2/img/ktahv-logo-white.svg" : "/lp-v2/img/ktahv-logo-color.svg"}
            alt="" width={109} height={76} loading="eager" fetchPriority="low" className="lp-header__logo"
          />
        </a>
        <span className="lp-header__rule" aria-hidden="true" />
        <Actions className="lp-header__actions" {...(production ? { "aria-label": ui.header.contact } : {})}>
          {production ? null : <LocaleSwitcher locales={c.locales} locale={req.locale} currency={req.currency} />}
          <a className="lp-header__phone" href={contact.phone.href} data-track="cta_click" data-track-cta="call" data-track-position="header">{contact.phone.display}</a>
          <a className="lp-header__wa" href={whatsappHref(c, req)} data-track="cta_click" data-track-cta="whatsapp" data-track-position="header">
            <WaIcon />{ui.header.whatsapp}
          </a>
          <a className="lp-header__call" href={contact.phone.href} data-track="cta_click" data-track-cta="call" data-track-position="header" aria-label={`${ui.header.callAria} ${contact.phone.display}`}>
            <PhoneIcon /><span className="lp-header__call-text">{ui.header.call}</span>
          </a>
        </Actions>
        {production ? (
          <a className="lp-btn lp-btn--primary lp-header__consult" href="#enquiry" data-track="cta_click" data-track-cta="consult" data-track-position="header">
            {c.cta?.primary ?? "Get free doctor consultation"}
          </a>
        ) : null}
      </div>
    </header>
  );
}
