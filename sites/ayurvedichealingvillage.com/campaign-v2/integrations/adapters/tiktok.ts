import type { Adapter } from "./shared.ts";
import { js } from "./shared.ts";

/**
 * TikTok Pixel. generate_lead → SubmitForm (event_id = transaction_id), cta_click → ClickButton,
 * other events → custom events by catalogue name. Consent-gated in the EU/UK.
 * The base code is the vendor snippet rewritten without "<" (forEach instead of for-loops).
 */
export const tiktok: Adapter = {
  id: "tiktok",
  consentMode: false,
  enabled: (s) => !!s.tiktok.pixelId,
  load(s) {
    if (!s.tiktok.pixelId) return "";
    return "!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];"
      + "ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];"
      + "ttq.setAndDefer=function(o,m){o[m]=function(){o.push([m].concat(Array.prototype.slice.call(arguments,0)))}};"
      + "ttq.methods.forEach(function(m){ttq.setAndDefer(ttq,m)});"
      + "ttq.instance=function(id){var e=ttq._i[id]||[];ttq.methods.forEach(function(m){ttq.setAndDefer(e,m)});return e};"
      + "ttq.load=function(e,n){var r='https://analytics.tiktok.com/i18n/pixel/events.js';ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;"
      + "ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=d.createElement('script');o.type='text/javascript';o.async=!0;"
      + "o.src=r+'?sdkid='+encodeURIComponent(e)+'&lib='+t;var a=d.getElementsByTagName('script')[0];a.parentNode.insertBefore(o,a)};"
      + `ttq.load(${js(s.tiktok.pixelId)});ttq.page();}(window,document,'ttq');`;
  },
  send(event, params, s, w) {
    if (!s.tiktok.pixelId || !w.ttq || typeof w.ttq.track !== "function") return;
    if (event === "generate_lead") {
      const tid = typeof params.transaction_id === "string" ? params.transaction_id : undefined;
      w.ttq.track("SubmitForm", {}, tid ? { event_id: tid } : {});
      return;
    }
    w.ttq.track(event === "cta_click" ? "ClickButton" : event, params);
  },
};
