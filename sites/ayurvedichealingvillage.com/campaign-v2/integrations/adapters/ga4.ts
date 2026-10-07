import type { Adapter } from "./shared.ts";
import { js } from "./shared.ts";

/**
 * GA4 via gtag.js. Events are sent 1:1 (same name, same params), addressed to the measurement ID only.
 * gtag.js itself is loaded once by loader.ts (shared with Google Ads); load() only adds the config call.
 */
export const ga4: Adapter = {
  id: "ga4",
  consentMode: true,
  enabled: (s) => !!s.ga4.measurementId,
  load: (s) => (s.ga4.measurementId ? `gtag('config',${js(s.ga4.measurementId)});` : ""),
  send(event, params, s, w) {
    if (!s.ga4.measurementId || typeof w.gtag !== "function") return;
    w.gtag("event", event, { ...params, send_to: s.ga4.measurementId });
  },
};
