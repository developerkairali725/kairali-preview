// Every tag / analytics / ads / chat / verification slot for /lp-v2, EMPTY by default.
//
// To switch a tool on, set its env var (NEXT_PUBLIC_LP_<TOOL>_<FIELD>, e.g. NEXT_PUBLIC_LP_GA4_MEASUREMENTID)
// in Vercel, or fill the default below in a reviewed PR. Nothing else in the page code changes.
// Nothing loads at all unless the master switch is on: AHV_ANALYTICS=1 AND AHV_STAGING=0.
//
// NEVER commit real IDs here for staging builds. Known live IDs are listed in integrations/README.md
// ("fill at go-live"); they are intentionally NOT active in code.

export type AdsLabelKey = "generate_lead" | "whatsapp_click" | "call_click" | "chat_start" | "channel_handoff" | "consult_cta";

export type Slots = {
  enabled: boolean;
  gtm: { containerId: string };
  ga4: { measurementId: string };
  googleAds: { conversionId: string; labels: Record<AdsLabelKey, string> };
  meta: { pixelId: string; capiEndpoint: string };
  clarity: { projectId: string };
  bing: { uetTagId: string };
  linkedin: { partnerId: string };
  tiktok: { pixelId: string };
  chat: { provider: string; widgetId: string; openOnLoad: boolean };
  verification: { google: string; bing: string; facebook: string };
};

/**
 * The subset the browser receives as window.__lpSlots: tag/pixel/project IDs, the GTM container, Google Ads
 * conversion ID + labels, and the chat widget settings. Never server-side values (meta.capiEndpoint) or
 * verification tokens (those render as <meta> on the server).
 */
export type BrowserSlots = {
  enabled: boolean;
  gtm: { containerId: string };
  ga4: { measurementId: string };
  googleAds: { conversionId: string; labels: Record<AdsLabelKey, string> };
  meta: { pixelId: string };
  clarity: { projectId: string };
  bing: { uetTagId: string };
  linkedin: { partnerId: string };
  tiktok: { pixelId: string };
  chat: { provider: string; widgetId: string; openOnLoad: boolean };
};

/** The empty containers. Each comment says where the value comes from. */
export const DEFAULT_SLOTS: Slots = {
  enabled: false,
  // GTM-XXXXXXX. Google Tag Manager > Admin > Container ID. Every track() event is also pushed to
  // window.dataLayer, so GTM can own all tags; if it does, leave the per-tool slots below empty.
  gtm: { containerId: "" },
  // G-XXXXXXXXXX. GA4 > Admin > Data streams > Web > Measurement ID.
  ga4: { measurementId: "" },
  // AW-XXXXXXXXX. Google Ads > Goals > Conversions > (action) > Tag setup > "Use Google tag" (send_to = AW-…/label).
  // One label per conversion action; a conversion fires only when its label is filled.
  googleAds: {
    conversionId: "",
    labels: { generate_lead: "", whatsapp_click: "", call_click: "", chat_start: "", channel_handoff: "", consult_cta: "" },
  },
  // Meta Events Manager > Data sources > Pixel ID. capiEndpoint is reserved for the server-side (CAPI) follow-up.
  meta: { pixelId: "", capiEndpoint: "" },
  // Microsoft Clarity > Settings > Overview > Project ID.
  clarity: { projectId: "" },
  // Microsoft Advertising > Tools > UET tag > Tag ID.
  bing: { uetTagId: "" },
  // LinkedIn Campaign Manager > Analyze > Insight Tag > Partner ID.
  linkedin: { partnerId: "" },
  // TikTok Ads Manager > Assets > Events > Web events > Pixel ID.
  tiktok: { pixelId: "" },
  // Chat vendor (e.g. "chatbase") and its widget/bot ID. The vendor's callbacks call integrations/chat.ts.
  // NOT behind the `enabled` master switch: chat is user-initiated (it loads only when the visitor taps
  // "Chat here now", after an EU/UK ask-first prompt), so it works on staging and with analytics off.
  chat: { provider: "", widgetId: "", openOnLoad: false },
  // Search Console (google-site-verification), Bing Webmaster (msvalidate.01), Meta Business (facebook-domain-verification).
  verification: { google: "", bing: "", facebook: "" },
};

type Env = Record<string, string | undefined>;

const str = (env: Env, name: string, fallback: string): string => {
  const v = env[`NEXT_PUBLIC_LP_${name}`];
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
};
const bool = (env: Env, name: string, fallback: boolean): boolean => {
  const v = env[`NEXT_PUBLIC_LP_${name}`];
  return v === undefined || v === "" ? fallback : v === "1" || v === "true";
};

/** Pure: defaults overlaid with NEXT_PUBLIC_LP_<TOOL>_<FIELD> env values (the env var wins). */
export function buildSlots(env: Env, d: Slots = DEFAULT_SLOTS): Slots {
  const labels = {} as Record<AdsLabelKey, string>;
  for (const k of Object.keys(d.googleAds.labels) as AdsLabelKey[]) {
    labels[k] = str(env, `GOOGLEADS_LABELS_${k.toUpperCase()}`, d.googleAds.labels[k]);
  }
  return {
    // Master switch: never on in staging or preview.
    enabled: env.AHV_ANALYTICS === "1" && env.AHV_STAGING === "0",
    gtm: { containerId: str(env, "GTM_CONTAINERID", d.gtm.containerId) },
    ga4: { measurementId: str(env, "GA4_MEASUREMENTID", d.ga4.measurementId) },
    googleAds: { conversionId: str(env, "GOOGLEADS_CONVERSIONID", d.googleAds.conversionId), labels },
    meta: { pixelId: str(env, "META_PIXELID", d.meta.pixelId), capiEndpoint: str(env, "META_CAPIENDPOINT", d.meta.capiEndpoint) },
    clarity: { projectId: str(env, "CLARITY_PROJECTID", d.clarity.projectId) },
    bing: { uetTagId: str(env, "BING_UETTAGID", d.bing.uetTagId) },
    linkedin: { partnerId: str(env, "LINKEDIN_PARTNERID", d.linkedin.partnerId) },
    tiktok: { pixelId: str(env, "TIKTOK_PIXELID", d.tiktok.pixelId) },
    chat: {
      provider: str(env, "CHAT_PROVIDER", d.chat.provider),
      widgetId: str(env, "CHAT_WIDGETID", d.chat.widgetId),
      openOnLoad: bool(env, "CHAT_OPENONLOAD", d.chat.openOnLoad),
    },
    verification: {
      google: str(env, "VERIFICATION_GOOGLE", d.verification.google),
      bing: str(env, "VERIFICATION_BING", d.verification.bing),
      facebook: str(env, "VERIFICATION_FACEBOOK", d.verification.facebook),
    },
  };
}

/**
 * Server-side source of truth (read per request in the dynamic /lp-v2 layout). The browser never reads
 * process.env: the loader hands the filled slots to the page as window.__lpSlots.
 */
export const INTEGRATIONS: Slots = buildSlots(typeof process !== "undefined" ? (process.env as Env) : {});
