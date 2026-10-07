import type { SectionProps } from "../LandingPage";
import { contact } from "../../../campaign-v110/lib/site.ts";
import { INTEGRATIONS } from "../../integrations/slots.ts";
import { WaIcon } from "../icons";
import AskAnything from "./AskAnything";

const AskIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 5h16v11H8l-4 4z" /><path d="M8 9.5h8M8 12.5h5" /></svg>
);

/**
 * The mobile bottom bar (< 768px; spec decision 23, Mobile-Hero / B, C, D mobile artboards):
 * grid 72px | 1fr | 72px — WhatsApp tile · "Free doctor consultation" (one line) · Ask tile.
 * Corner radius follows the skin (--lp-radius). No pill, no sub-label. Server-rendered, so it works before
 * hydration; AskAnything (client) opens the sheet from the Ask tile, renders the desktop floating button and
 * hides this bar while focus is inside #enquiry. In the EU/UK the consent banner sits above it (sections.css).
 */
export default function MobileBar(_props: SectionProps) {
  return (
    <>
      <nav className="lp-bar" data-lp-bar aria-label="Quick actions">
        <a className="lp-bar__tile lp-bar__wa" href={`https://wa.me/${contact.whatsapp.number}`}
          data-track="cta_click" data-track-cta="whatsapp" data-track-position="bar">
          <WaIcon size={22} />WhatsApp
        </a>
        <a className="lp-bar__consult" href="#enquiry" data-track="cta_click" data-track-cta="consult" data-track-position="bar">
          Free doctor consultation
        </a>
        <button type="button" className="lp-bar__tile lp-bar__ask" aria-haspopup="dialog" aria-label="Ask anything" data-ask-open
          data-track="cta_click" data-track-cta="ask" data-track-position="bar">
          <AskIcon />Ask
        </button>
      </nav>
      <AskAnything chat={{ provider: INTEGRATIONS.chat.provider, widgetId: INTEGRATIONS.chat.widgetId }} />
    </>
  );
}
