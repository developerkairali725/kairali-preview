// The canonical event catalogue. track() drops any event not listed here and any param not declared
// for that event. To add an event: add it here, then put data-track="<name>" (plus data-track-<param>)
// on the element, or call track() from the component. NEVER put personal or health data in params.

export type EventSpec = { readonly params: readonly string[]; readonly description: string };

export const EVENTS = {
  cta_click: {
    params: ["cta", "position"],
    description: "Any CTA click. cta: consult|whatsapp|ask|call|offer|email|instagram|messenger; position: header|hero|bar|section|sticky|footer|lightbox|ask (ask = a row in the Ask anything sheet)",
  },
  form_start: { params: ["form_id", "variant"], description: "First interaction with the enquiry form" },
  form_step_complete: { params: ["form_id", "step"], description: "Each step's Continue" },
  form_error: { params: ["form_id", "field", "code"], description: "A validation error is shown (field name and error code only, never the value)" },
  form_submit_attempt: { params: ["form_id"], description: "Send pressed with valid data" },
  generate_lead: {
    params: ["form_id", "transaction_id", "ref"],
    description: "ONLY after the form adapter confirms the lead is stored. transaction_id = submissionToken",
  },
  form_submit_failed: { params: ["form_id", "status"], description: "4xx/5xx/network failure" },
  channel_select: { params: ["channel"], description: "The reply channel is chosen" },
  channel_handoff: { params: ["channel", "ref"], description: "The success-screen channel button is tapped" },
  chat_open: { params: ["source"], description: "The chat widget opens. source: ask_sheet|floating|success" },
  chat_message: { params: ["role"], description: "A visitor sends a chat message (vendor callback). role: user" },
  chat_lead: { params: ["ref"], description: "The chat vendor reports a captured lead (ref optional)" },
  film_play: { params: ["kind", "youtube_id"], description: "A film facade is clicked" },
  gallery_open: { params: ["category"], description: "The gallery opens" },
  currency_change: { params: ["to"], description: "The currency switcher is used" },
  locale_change: { params: ["to"], description: "The language switcher is used" },
  scroll_depth: { params: ["percent"], description: "Scroll depth reached. percent: 50|90, once each" },
} as const satisfies Record<string, EventSpec>;

export type EventName = keyof typeof EVENTS;
export type ParamValue = string | number | boolean;
export type EventParams = Record<string, ParamValue | undefined>;

export function isEventName(name: unknown): name is EventName {
  return typeof name === "string" && Object.hasOwn(EVENTS, name);
}
