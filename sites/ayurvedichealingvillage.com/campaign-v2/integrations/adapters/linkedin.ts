import type { Adapter } from "./shared.ts";
import { js } from "./shared.ts";

/**
 * LinkedIn Insight Tag (page views + matched audiences). LinkedIn conversions need a per-action
 * conversion_id that has no slot yet, so send() is deliberately a no-op; add a `conversions` map to
 * the linkedin slot and call w.lintrk('track', { conversion_id }) here when the team has them.
 * Consent-gated in the EU/UK.
 */
export const linkedin: Adapter = {
  id: "linkedin",
  consentMode: false,
  enabled: (s) => !!s.linkedin.partnerId,
  load(s) {
    if (!s.linkedin.partnerId) return "";
    const id = js(s.linkedin.partnerId);
    return `window._linkedin_partner_id=${id};window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];`
      + `window._linkedin_data_partner_ids.push(${id});`
      + "(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}"
      + "var s=document.getElementsByTagName('script')[0];var b=document.createElement('script');b.type='text/javascript';b.async=true;"
      + "b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';s.parentNode.insertBefore(b,s);})(window.lintrk);";
  },
  send() { /* no per-event mapping yet; see the comment above */ },
};
