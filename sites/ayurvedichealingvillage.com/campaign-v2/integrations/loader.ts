// The inline boot script for /lp-v2. Rendered by Document only when INTEGRATIONS.enabled, AFTER the
// geo consent default (kit/consent-region.ts), so window.gtag, Consent Mode defaults and
// window.__ahvConsentRequired already exist.
//
// - Hands the browser-needed slots to the page as window.__lpSlots (browserSlots(): IDs only, never
//   meta.capiEndpoint or verification tokens). track() reads them; the browser never reads env.
// - gtag.js loads once when GA4 or Google Ads is set, with a config call for each (Consent Mode governs them).
// - GTM loads when its container is set.
// - Meta, Clarity, Bing, LinkedIn and TikTok load only when their slot is set. Inside the EU/UK they wait for
//   a granted stored choice (checked now, then every 1s until any choice exists). FAIL CLOSED: consent is
//   treated as required unless window.__ahvConsentRequired === false. Outside, a stored explicit denial
//   still blocks them.
// - Every interpolated value goes through js(): JSON with "<" escaped. The output contains no raw "<".

import type { BrowserSlots, Slots } from "./slots.ts";
import { js } from "./adapters/shared.ts";
import { ADAPTERS } from "./adapters/index.ts";
import { CONSENT_STORAGE_KEY } from "@kairali/consent/core";

function gtagBlock(s: Slots): string {
  const tagId = s.ga4.measurementId || s.googleAds.conversionId;
  if (!tagId) return "";
  const configs = ADAPTERS.filter((a) => a.consentMode).map((a) => a.load(s)).join("");
  return "(function(){var d=document,g=d.createElement('script');g.async=true;"
    + `g.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(${js(tagId)});d.head.appendChild(g);})();`
    + "gtag('js',new Date());" + configs;
}

function gtmBlock(s: Slots): string {
  if (!s.gtm.containerId) return "";
  return "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});"
    + "var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;"
    + "j.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(i);f.parentNode.insertBefore(j,f);})"
    + `(window,document,'script','dataLayer',${js(s.gtm.containerId)});`;
}

function gatedBlock(s: Slots): string {
  const body = ADAPTERS.filter((a) => !a.consentMode).map((a) => a.load(s)).filter(Boolean).join("\n");
  if (!body) return "";
  return "(function(){var w=window,done=false;"
    + "function rec(){try{return JSON.parse(localStorage.getItem(" + js(CONSENT_STORAGE_KEY) + ")||'null');}catch(e){return null;}}"
    + "function run(){if(done)return;done=true;\n" + body + "\n}"
    + "var r=rec();"
    + "if(w.__ahvConsentRequired===false){if(!(r&&r.granted===false))run();return;}"
    + "if(r){if(r.granted===true)run();return;}"
    + "var t=setInterval(function(){var c=rec();if(c){clearInterval(t);if(c.granted===true)run();}},1000);"
    + "})();";
}

/** Pure allow-list of what the browser needs. Add a field here only if an adapter reads it client-side. */
export function browserSlots(s: Slots): BrowserSlots {
  return {
    enabled: s.enabled,
    gtm: { containerId: s.gtm.containerId },
    ga4: { measurementId: s.ga4.measurementId },
    googleAds: { conversionId: s.googleAds.conversionId, labels: { ...s.googleAds.labels } },
    meta: { pixelId: s.meta.pixelId },
    clarity: { projectId: s.clarity.projectId },
    bing: { uetTagId: s.bing.uetTagId },
    linkedin: { partnerId: s.linkedin.partnerId },
    tiktok: { pixelId: s.tiktok.pixelId },
    chat: { provider: s.chat.provider, widgetId: s.chat.widgetId, openOnLoad: s.chat.openOnLoad },
  };
}

/** The full inline script for the given slots. Pure; empty slots → only window.__lpSlots, no third-party URL. */
export function loaderSnippet(slots: Slots): string {
  const parts = [
    `window.__lpSlots=${js(browserSlots(slots))};`,
    "window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};",
    gtagBlock(slots),
    gtmBlock(slots),
    gatedBlock(slots),
  ];
  return parts.filter(Boolean).join("\n");
}
