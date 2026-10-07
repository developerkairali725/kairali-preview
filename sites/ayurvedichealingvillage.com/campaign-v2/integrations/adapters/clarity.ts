import type { Adapter } from "./shared.ts";
import { js } from "./shared.ts";

/** Microsoft Clarity. Events become Clarity custom events (filterable in recordings). Consent-gated in the EU/UK. */
export const clarity: Adapter = {
  id: "clarity",
  consentMode: false,
  enabled: (s) => !!s.clarity.projectId,
  load(s) {
    if (!s.clarity.projectId) return "";
    return "(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;"
      + "t.src='https://www.clarity.ms/tag/'+encodeURIComponent(i);y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})"
      + `(window,document,'clarity','script',${js(s.clarity.projectId)});`;
  },
  send(event, _params, s, w) {
    if (!s.clarity.projectId || typeof w.clarity !== "function") return;
    w.clarity("event", event);
  },
};
