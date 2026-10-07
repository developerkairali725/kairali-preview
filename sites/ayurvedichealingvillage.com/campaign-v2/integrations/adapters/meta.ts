import type { Adapter } from "./shared.ts";
import { js } from "./shared.ts";

/**
 * Meta Pixel. generate_lead → standard "Lead" with eventID = transaction_id (the submission token), so a
 * later server-side CAPI event can de-duplicate against it. Every other catalogue event → trackCustom.
 * Not Consent-Mode aware: in the EU/UK it loads and receives events only after a granted choice.
 */
export const meta: Adapter = {
  id: "meta",
  consentMode: false,
  enabled: (s) => !!s.meta.pixelId,
  load(s) {
    if (!s.meta.pixelId) return "";
    return "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};"
      + "if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;"
      + "s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');"
      + `fbq('init',${js(s.meta.pixelId)});fbq('track','PageView');`;
  },
  send(event, params, s, w) {
    if (!s.meta.pixelId || typeof w.fbq !== "function") return;
    if (event === "generate_lead") {
      const tid = typeof params.transaction_id === "string" ? params.transaction_id : undefined;
      w.fbq("track", "Lead", {}, tid ? { eventID: tid } : {});
      return;
    }
    w.fbq("trackCustom", event, params);
  },
};
