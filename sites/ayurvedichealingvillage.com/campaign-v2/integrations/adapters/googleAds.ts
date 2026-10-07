import type { AdsLabelKey, BrowserSlots as Slots } from "../slots.ts";
import type { EventName } from "../events.ts";
import type { Adapter, CleanParams, LpWindow } from "./shared.ts";
import { js } from "./shared.ts";
import { createSeenStore } from "./seen-store.ts";
import { mayPersist } from "../consent.ts";

/**
 * Which googleAds.labels key a catalogue event converts on (undefined → never a conversion).
 * cta_click splits by cta so WhatsApp, call and consult clicks can be separate conversion actions.
 */
export function adsLabelKey(event: EventName, params: CleanParams): AdsLabelKey | undefined {
  switch (event) {
    case "generate_lead": return "generate_lead";
    case "channel_handoff": return "channel_handoff";
    case "chat_open": return "chat_start";
    case "cta_click":
      if (params.cta === "whatsapp") return "whatsapp_click";
      if (params.cta === "call") return "call_click";
      if (params.cta === "consult" || params.cta === "offer") return "consult_cta";
      return undefined;
    default: return undefined;
  }
}

/**
 * De-dupe store for generate_lead. It writes to localStorage (shared "ktahv-lead-conversions" key with the main
 * site) only when consent is not required or a granted choice is stored; otherwise it de-dupes in memory for
 * this page view (createSeenStore(null) is memory-only).
 */
let memoryStore: ReturnType<typeof createSeenStore> | null = null;
const seenFor = (w: LpWindow) => {
  if (mayPersist(w)) return createSeenStore((w.localStorage ?? null) as unknown as Storage | null);
  memoryStore = memoryStore ?? createSeenStore(null);
  return memoryStore;
};

export const googleAds: Adapter = {
  id: "googleAds",
  consentMode: true,
  enabled: (s: Slots) => !!s.googleAds.conversionId,
  load: (s) => (s.googleAds.conversionId ? `gtag('config',${js(s.googleAds.conversionId)});` : ""),
  send(event, params, s, w) {
    const key = adsLabelKey(event, params);
    const label = key ? s.googleAds.labels[key] : "";
    if (!s.googleAds.conversionId || !label || typeof w.gtag !== "function") return;
    const payload: Record<string, unknown> = { send_to: `${s.googleAds.conversionId}/${label}` };
    if (event === "generate_lead") {
      // A lead conversion needs the server-confirmed submission token, and fires once per token.
      const tid = typeof params.transaction_id === "string" ? params.transaction_id : "";
      if (!tid) return;
      const seen = seenFor(w);
      if (seen.has(tid)) return;
      seen.add(tid);
      payload.transaction_id = tid;
    }
    w.gtag("event", "conversion", payload);
  },
};
