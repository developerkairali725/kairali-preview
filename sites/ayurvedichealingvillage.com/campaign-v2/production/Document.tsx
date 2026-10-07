import type { ReactNode } from "react";
import Script from "next/script";
import { ChatbaseLoader } from "@kairali/chat";
import { ConsentScripts } from "../../components/ConsentScripts";
import SharedConsent from "../../campaign-v110/SharedConsent";
import { measurementForEnvironment } from "../../lib/measurement-config.mjs";
import analyticsConfig from "../../analytics.config.json";
import { display, body } from "./fonts";
import "../../campaign-v110/integration.css";
import "../../public/design/campaign-bundle.css";
import "../styles/base.css";
import "../sections/sections.css";
import "./production.css";

/**
 * The <html>/<body> shell of the two live ad routes: the current production campaign document
 * (campaign-v110/CampaignDocument.tsx) without the old pages' design CSS and fonts. Unchanged from it:
 * ConsentScripts (consent defaults, granular choices, GPC), lead-receipt.js (consented lead event and the
 * /ppc-thanks/ hand-off), SharedConsent with the environment's measurement IDs, the Chatbase loader (Priya) and
 * review-chrome.js (header Chat control, the WhatsApp / Priya / Instagram / Messenger choices, the phone CTA bar)
 * on body[data-ahv-campaign]. Not loaded: the /lp-v2 kit's tag loader, consent banner and geo default.
 *
 * The kit design is scoped to the page's .lp wrapper (production/ProductionPage.tsx); this document is only
 * used by app/(ppc-v2), so no other page receives these styles. data-lp-surface="production" switches the
 * kit's track() to the site's own measurement runtime (integrations/track.ts).
 */
export default function ProductionDocument({ children }: { children: ReactNode }) {
  const measurement = measurementForEnvironment(process.env, analyticsConfig);
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} data-lp-surface="production">
      <head>
        <ConsentScripts />
        <Script src="/design/lead-receipt.js" strategy="beforeInteractive" />
      </head>
      <body data-ahv-campaign="true">
        {children}
        <SharedConsent measurement={measurement} />
        <ChatbaseLoader />
        <Script src="/design/review-chrome.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
