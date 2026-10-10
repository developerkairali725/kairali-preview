import type { ReactNode } from "react";
import Script from "next/script";
import { ChatbaseLoader } from "@kairali/chat";
import { ConsentScripts } from "../../components/ConsentScripts";
import SharedConsent from "../../campaign-v110/SharedConsent";
import { measurementForEnvironment } from "../../lib/measurement-config.mjs";
import analyticsConfig from "../../analytics.config.json";
import type { PageLocale } from "../kit/types.ts";
import { display, body, instrument } from "./fonts";
import "../../campaign-v110/integration.css";
import "../../public/design/campaign-bundle.css";
import "../styles/base.css";
import "../sections/sections.css";
import "./production.css";

/** The site's shared chrome per page language: the localized copies the site already serves (as the German campaign
 *  document did for /lp/behandlung-in-kerala/). Dedicated DE/RU campaign bundles preserve snapshot-bound chrome elsewhere. */
const CHROME: Record<PageLocale, string> = {
  en: "/design/review-chrome.js",
  de: "/ahv/l10n/de/design/campaign-review-chrome.js",
  ru: "/ahv/l10n/ru/design/campaign-review-chrome.js",
};

/** Villa details dialog (DEC-VILLA-POPUP, WOPS-AHV-VILLA-POPUP-20261010-001): English documents only, and only on the
 *  14 scoped routes — every other path loads nothing. public/design/villa-dialog.js re-checks the same list. */
const VILLA_DIALOG_LOADER =
  '(function(){var r=["/pain-management.html","/family-ayurvedic-retreat-kerala.html","/ayurveda-retreat-kerala.html","/kairali-cleansing-centre.html","/treatment-in-kerala.html","/Ayurveda_Treatment_Neo_S.India_Cities.html","/weight-loss.html","/lp/ayurvedic-hospital-kerala/","/lp/kairali-cleansing-centre/","/lp/pain-management/","/karkidaka-chikitsha-or-monsoon-wellness.html","/preventive-rejuvenation-detoxification.html","/wellness-resort-kerala.html","/Kairali_Brand_and_Competition_Neo-original.html"];if(r.indexOf(location.pathname)<0)return;var s=document.createElement("script");s.src="/design/villa-dialog.js";s.async=true;document.body.appendChild(s)})();';

/**
 * The <html>/<body> shell of the live ad routes: the current production campaign document
 * (campaign-v110/CampaignDocument.tsx) without the old pages' design CSS and fonts. Unchanged from it:
 * ConsentScripts (consent defaults, granular choices, GPC), lead-receipt.js (consented lead event and the
 * /thanks/ hand-off), SharedConsent with the environment's measurement IDs, the Chatbase loader (Priya) and
 * review-chrome.js (header Chat control, the WhatsApp / Priya / Instagram / Messenger choices, the phone CTA bar)
 * on body[data-ahv-campaign]. Not loaded: the /lp-v2 kit's tag loader, consent banner and geo default.
 *
 * `lang` (default English) sets <html lang> and picks the site's own localized chrome; consent, measurement and lead
 * handling are identical in every language. The kit design is scoped to the page's .lp wrapper
 * (production/ProductionPage.tsx); this document is only used by the app/(ppc-v2*) route groups, so no other page
 * receives these styles. data-lp-surface="production" switches the kit's track() to the site's own measurement
 * runtime (integrations/track.ts).
 */
export default function ProductionDocument({ children, lang = "en" }: { children: ReactNode; lang?: PageLocale }) {
  const measurement = measurementForEnvironment(process.env, analyticsConfig);
  return (
    <html lang={lang} className={`${display.variable} ${body.variable} ${instrument.variable}`} data-lp-surface="production">
      <head>
        <ConsentScripts />
        <Script src="/design/lead-receipt.js" strategy="beforeInteractive" />
      </head>
      <body data-ahv-campaign="true">
        {children}
        <SharedConsent measurement={measurement} />
        <ChatbaseLoader />
        <Script src={CHROME[lang]} strategy="afterInteractive" />
        {lang === "en" ? <Script id="ahv-villa-dialog-loader" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: VILLA_DIALOG_LOADER }} /> : null}
      </body>
    </html>
  );
}
