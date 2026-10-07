import type { Adapter } from "./shared.ts";
import { js } from "./shared.ts";

/** Microsoft Advertising UET. Events go out as custom UET events (event action = catalogue name). Consent-gated in the EU/UK. */
export const bing: Adapter = {
  id: "bing",
  consentMode: false,
  enabled: (s) => !!s.bing.uetTagId,
  load(s) {
    if (!s.bing.uetTagId) return "";
    return "(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:" + js(s.bing.uetTagId) + ",enableAutoSpaTracking:true};"
      + "o.q=w[u],w[u]=new UET(o),w[u].push('pageLoad')},n=d.createElement(t),n.src=r,n.async=1,"
      + "n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=='loaded'&&s!=='complete'||(f(),n.onload=n.onreadystatechange=null)},"
      + "i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,'script','https://bat.bing.com/bat.js','uetq');";
  },
  send(event, params, s, w) {
    if (!s.bing.uetTagId || !w.uetq || typeof w.uetq.push !== "function") return;
    w.uetq.push("event", event, { event_category: "lp", event_label: String(params.cta ?? params.channel ?? params.form_id ?? "") });
  },
};
