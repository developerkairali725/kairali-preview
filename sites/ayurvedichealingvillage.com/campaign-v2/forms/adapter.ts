// Where a submitted enquiry goes. The default adapter posts to the site's own /api/lead/ (store first,
// then the Sheet mirror). To route a campaign elsewhere, add an adapter to ADAPTERS and set
// `form.adapterId` in the campaign file; no UI code changes.
//
// Contract: an adapter returns "received" ONLY when the backend confirmed the lead is stored. The
// shell fires generate_lead on that and nothing else, and never shows success otherwise.

import type { CampaignConfig, Channel, ProductionFormProfile, Variant } from "../kit/types.ts";
import { buildLeadPayload, type LeadAnswers, type PackedLine } from "../kit/lead.ts";
import { isChannel, DEFAULT_CHANNEL, CONSENT_FIELD, fullCampaignPhone, type FormValues, type ResolvedSchema } from "./schema.ts";

export type SubmitErrorCode = "not_configured" | "rate_limited" | "invalid" | "network" | "url" | "consent" | "email" | "honeypot";
export type SubmitResult =
  | { status: "received"; ref: string; token: string; /** Same-origin path to download, when the server sends one. */ guideUrl?: string }
  | { status: "error"; code: SubmitErrorCode; message: string; httpStatus?: number; /** The server's `code`, e.g. SHEET_SYNC_FAILED. */ serverCode?: string };

export type SubmitContext = {
  schema: ResolvedSchema;
  /** Only `tracking` is read (track_id, campaign_name), so the client needs no more of the campaign. */
  campaign: Pick<CampaignConfig, "tracking">;
  variant: Variant;
  locale: string;
  /** submissionToken (UUID). Reuse it on a retry of the same enquiry so the server can de-duplicate. */
  token: string;
  tracking: Record<string, string>;
  pageUrl: string;
  referrer: string;
  /** Visitor's ISO country from the edge (route.ts countryCode), for the lead row's `country`. */
  country?: string;
  /** Injected in tests; defaults to the global fetch. */
  fetch?: typeof fetch;
  /** Request timeout in ms (default 10 000, as the live form). Injected short in tests. */
  timeoutMs?: number;
  /** Live ad routes only (the "ahv-production" adapter): the existing form's identity on these routes. */
  production?: ProductionFormContext;
  /** Injected in tests; defaults to the browser's window / document. */
  env?: ProductionEnv;
};

/**
 * `formVariant` = the existing fields.form_variant of the route; `downloadGuide` = the route's existing guide download;
 * `profile` = the route's own form when it is not the default production form (absent on every other route).
 */
export type ProductionFormContext = { formVariant: string; downloadGuide: boolean; profile?: ProductionFormProfile };
export type ProductionEnv = {
  location: { origin: string; pathname: string; search: string };
  referrer: string;
  /** window.AHV_MEASUREMENT.attribution (consent-aware), when the runtime is present. */
  attribution?: () => Record<string, string>;
};
export const SUBMIT_TIMEOUT_MS = 10_000;

export type FormAdapter = { id: string; submit(values: FormValues, ctx: SubmitContext): Promise<SubmitResult> };

export const MSG_RATE_LIMITED = "Too many attempts. Please try again in a minute or WhatsApp us.";
/** Client-side rejection: the request was never made, so "Nothing was sent" is true. */
export const MSG_GENERIC = "Something went wrong. Nothing was sent. Please WhatsApp or email us.";
/** Server answered but did not confirm (the live campaign form's text). Whether anything was stored is unknown. */
export const MSG_RETRY = "We could not confirm your enquiry. Your details are still here; please retry or use WhatsApp.";
/** fetch threw (offline, blocked, timed out) — the live campaign form's text. */
export const MSG_NETWORK = "We could not confirm your enquiry. Check your connection and try again.";
const MSG_NOT_CONFIGURED_FALLBACK = "This form is not connected yet. Nothing has been saved or sent. Please email info@kairali.com.";

const str = (v: FormValues[string]) => (typeof v === "string" ? v.trim() : "");

/** The human-readable value for a field: the option label for selects/radios, else the trimmed text. */
function display(schema: ResolvedSchema, name: string, values: FormValues): string {
  const v = str(values[name]);
  for (const s of schema.steps) {
    const f = s.fields.find((x) => x.name === name);
    if (f) return f.options?.find((o) => o.value === v)?.label ?? v;
  }
  return v;
}

/** Only same-origin paths ("/x", never "//host" or "/\\host"), as the live form requires a leading "/". */
export function safeGuideUrl(v: unknown): string | undefined {
  return typeof v === "string" && /^\/(?![\/\\])/.test(v) && !/[\s\\]/.test(v) ? v : undefined;
}

/**
 * After an error, should an edit by the visitor keep the submission token? The live form drops it on any
 * edit (a changed enquiry is a new enquiry). Exceptions, where the outcome may be stored and the server
 * dedups by token: a network error or timeout (unknown outcome), and 502 SHEET_SYNC_FAILED (the row IS
 * stored, only the Sheet mirror failed; the retry must send the same token so the server reads it back).
 */
export function keepTokenAfterEdit(r: SubmitResult | null | undefined): boolean {
  if (!r || r.status !== "error") return false;
  return r.code === "network" || (r.httpStatus === 502 && r.serverCode === "SHEET_SYNC_FAILED");
}

/** Map schema values onto the lead row's answers. Exported for tests. */
export function toLeadAnswers(schema: ResolvedSchema, values: FormValues): { answers: LeadAnswers; extra: string[] } {
  const channelRaw = str(values.channel);
  const channel: Channel = isChannel(channelRaw) ? channelRaw : DEFAULT_CHANNEL;
  const a: LeadAnswers = {
    program: "", month: "", duration: "", party: "", channel,
    fullName: "", email: "", phone: "", country: "",
    consent: values[CONSENT_FIELD] === true, marketing: values.marketing === true, honeypot: str(values.honeypot),
  };
  // Fields packMessage() already writes (program/month/party/channel) are not repeated in `extra`.
  const PACKED: Record<string, "program" | "month" | "party"> = { program: "program", month: "month", party: "party" };
  const extra: string[] = [];
  const packed = new Set<PackedLine>(schema.marketingOptIn ? ["marketing"] : []);
  const text: string[] = [];
  for (const s of schema.steps) {
    for (const f of s.fields) {
      if (f.type === "channel") packed.add("channel");
      if (f.mapsTo === "message" && Object.hasOwn(PACKED, f.name)) packed.add(PACKED[f.name]);
      if (f.type === "textarea" && f.mapsTo === "message") {
        const t = typeof values[f.name] === "string" ? (values[f.name] as string).trim() : "";
        if (t) text.push(t);
        continue;
      }
      const val = display(schema, f.name, values);
      switch (f.mapsTo) {
        case "fname": a.fullName = val; break;
        case "email": a.email = val; break;
        case "phone": a.phone = val; break;
        case "country": a.country = val; break;
        case "duration": a.duration = val; break;
        case "message":
          if (f.type === "channel") break;
          if (Object.hasOwn(PACKED, f.name)) a[PACKED[f.name]] = val;
          else if (val) extra.push(`${f.label}: ${val}`);
          break;
        case "none": break;
      }
    }
  }
  if (schema.fullNameInFname) a.nameMode = "full";
  a.packed = [...packed];
  a.extra = extra;
  if (text.length) a.message = text.join("\n");
  return { answers: a, extra };
}

async function readJson(res: Response): Promise<Record<string, unknown>> {
  try {
    const j = await res.json();
    return j && typeof j === "object" ? (j as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export const leadApiAdapter: FormAdapter = {
  id: "lead-api",
  async submit(values, ctx) {
    const { answers } = toLeadAnswers(ctx.schema, values);
    if (!answers.country && ctx.country) answers.country = ctx.country;
    const built = buildLeadPayload(answers, {
      campaign: ctx.campaign as CampaignConfig, variant: ctx.variant, token: ctx.token, locale: ctx.locale,
      tracking: ctx.tracking, pageUrl: ctx.pageUrl, referrer: ctx.referrer, formId: ctx.schema.id,
    });
    if (!built.ok) return { status: "error", code: built.reason, message: MSG_GENERIC };
    const doFetch = ctx.fetch ?? globalThis.fetch;
    let res: Response;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      // Abort at the timeout (10 s, as the live form); the race also covers a fetch that ignores the signal.
      const timedOut = new Promise<never>((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(new Error("timeout")); }, ctx.timeoutMs ?? SUBMIT_TIMEOUT_MS);
      });
      res = await Promise.race([
        doFetch("/api/lead/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(built.body),
          credentials: "same-origin",
          signal: controller.signal,
        }),
        timedOut,
      ]);
    } catch {
      return { status: "error", code: "network", message: MSG_NETWORK };
    } finally {
      clearTimeout(timer);
    }
    const body = await readJson(res);
    if (res.status === 200 && body.status === "received") {
      const guideUrl = safeGuideUrl(body.guideUrl);
      return { status: "received", ref: built.ref, token: ctx.token, ...(guideUrl ? { guideUrl } : {}) };
    }
    if (res.status === 503) {
      const text = typeof body.error === "string" && body.error.trim() ? body.error : MSG_NOT_CONFIGURED_FALLBACK;
      return { status: "error", code: "not_configured", message: text, httpStatus: 503 };
    }
    if (res.status === 429) return { status: "error", code: "rate_limited", message: MSG_RATE_LIMITED, httpStatus: 429 };
    // 502 = the route stored nothing (STORE_FAILED) or stored the row but the Sheet mirror failed
    // (SHEET_SYNC_FAILED, "Your details were saved…"). Its text is truthful, so show it verbatim; the generic
    // "Nothing was sent" would be false for the second case. Still an error: no success, no generate_lead.
    // The shell reuses the same submissionToken on retry, so the server reads the already-stored row back
    // and only retries the Sheet; edits the visitor made after a partial save are NOT re-applied
    // (keepTokenAfterEdit: the shell keeps the token through edits after 502 SHEET_SYNC_FAILED, not STORE_FAILED,
    // and after a network error/timeout; every other error drops it on the next edit).
    if (res.status === 502) {
      const text = typeof body.error === "string" && body.error.trim() ? body.error : MSG_RETRY;
      const serverCode = typeof body.code === "string" ? body.code : undefined;
      return { status: "error", code: "invalid", message: text, httpStatus: 502, ...(serverCode ? { serverCode } : {}) };
    }
    return { status: "error", code: "invalid", message: MSG_RETRY, httpStatus: res.status };
  },
};

// ── The live ad routes ─────────────────────────────────────────────────────────────────────────────────
// Byte-for-byte the current production request of app/(campaign)/ayurvedic-treatment-packages.html/
// EnquiryForm.tsx: same body keys, the same consent-aware attribution (window.AHV_MEASUREMENT.attribution,
// else the same allow-listed URL values), lead_source_url = origin + path + those values only, referrer =
// origin only, the kit honeypot sent as `company` for the API's own guard, and the same success rule
// (200 + ok:true + status "received"). public/design/lead-receipt.js observes that response and owns the
// consented lead event and the /ppc-thanks/ hand-off; the kit fires nothing for a lead here.

/** The existing production form's messages, word for word. */
export const PRODUCTION_MESSAGES = {
  notConnected: "This form is not connected yet. Nothing has been sent. Please use WhatsApp or email info@kairali.com.",
  retry: "Please wait before trying again. Your details are still here.",
  unconfirmed: "We could not confirm your enquiry. Your details are still here; please retry or use WhatsApp.",
  network: "We could not confirm your enquiry. Check your connection and try again.",
} as const;

export const ATTRIBUTION_KEYS = ["gclid", "gbraid", "wbraid", "fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/** The existing form's URL fallback when the consent runtime is absent: first valid value per allow-listed key. */
export function urlAttribution(search: string): Record<string, string> {
  const incoming = new URLSearchParams(search);
  const out: Record<string, string> = {};
  for (const k of ATTRIBUTION_KEYS) {
    const pattern = k.startsWith("utm_") ? /^[a-zA-Z0-9_.~ &-]{1,120}$/ : /^[a-zA-Z0-9_.~-]{1,120}$/;
    const value = incoming.getAll(k).find((v) => pattern.test(v));
    if (value) out[k] = value;
  }
  return out;
}

function browserEnv(): ProductionEnv {
  const w = globalThis as unknown as { location: Location; document: Document; AHV_MEASUREMENT?: { attribution?: () => Record<string, string> } };
  const bridge = w.AHV_MEASUREMENT;
  return {
    location: { origin: w.location.origin, pathname: w.location.pathname, search: w.location.search },
    referrer: w.document.referrer,
    ...(bridge && typeof bridge.attribution === "function" ? { attribution: () => bridge.attribution!() } : {}),
  };
}

/** The family form's gender radio: one of its two values, else empty (an unanswered radio, as the R10 form sent it). */
export function familyGender(v: FormValues[string]): string {
  return v === "Male" || v === "Female" ? v : "";
}

/**
 * The family form's message, exactly as the R10 form with familyFields built it:
 * "Country: <country>\nPreferred duration: <duration>\n" followed by the visitor's own (optional) health text. Pure.
 */
export function familyMessage(values: FormValues): string {
  return `Country: ${str(values.country)}\nPreferred duration: ${str(values.duration)}\n${str(values.message)}`;
}

/**
 * The campaign enquiry form's messages (app/(lp)/_components/campaign-enquiry-form.tsx), word for word, per page
 * language. German is that form's own German copy; Russian is this page's translation of the same lines.
 */
export const CAMPAIGN_ENQUIRY_MESSAGES: Record<"en" | "de" | "ru", Record<keyof typeof PRODUCTION_MESSAGES, string>> = {
  en: PRODUCTION_MESSAGES,
  de: {
    notConnected: "Dieses Formular ist derzeit nicht verbunden. Es wurde nichts gesendet. Bitte nutzen Sie WhatsApp oder schreiben Sie an info@kairali.com.",
    retry: "Bitte warten Sie, bevor Sie es erneut versuchen. Ihre Angaben bleiben im Formular.",
    unconfirmed: "Wir konnten den Eingang Ihrer Anfrage nicht bestätigen. Ihre Angaben bleiben im Formular; bitte versuchen Sie es erneut oder nutzen Sie WhatsApp.",
    network: "Wir konnten den Eingang Ihrer Anfrage nicht bestätigen. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
  },
  ru: {
    notConnected: "Эта форма пока не подключена. Ничего не отправлено. Пожалуйста, напишите нам в WhatsApp или на info@kairali.com.",
    retry: "Пожалуйста, подождите перед повторной попыткой. Ваши данные сохранены в форме.",
    unconfirmed: "Нам не удалось подтвердить получение вашего запроса. Ваши данные сохранены в форме; попробуйте ещё раз или напишите в WhatsApp.",
    network: "Нам не удалось подтвердить получение вашего запроса. Проверьте подключение и попробуйте ещё раз.",
  },
};
const enquiryMessages = (locale: string) => CAMPAIGN_ENQUIRY_MESSAGES[locale === "de" || locale === "ru" ? locale : "en"];

/** The consent-aware attribution, as both live forms read it. */
function attributionOf(env: ProductionEnv): Record<string, string> {
  try {
    return env.attribution?.() || urlAttribution(env.location.search);
  } catch {
    return urlAttribution(env.location.search);
  }
}

/**
 * The campaign enquiry form's request body (profile "campaign-enquiry"), key for key as
 * app/(lp)/_components/campaign-enquiry-form.tsx builds it: no honeypot key, no campaign_name / utm_keyword /
 * rdogender, the phone as typed (optional), form_variant = the route's own value (its path). Exported for tests.
 */
export function buildCampaignEnquiryLead(values: FormValues, ctx: Pick<SubmitContext, "token" | "locale"> & { production: ProductionFormContext; env: ProductionEnv }): Record<string, unknown> {
  const campaign = attributionOf(ctx.env);
  const query = new URLSearchParams(campaign).toString();
  const sourceUrl = ctx.env.location.origin + ctx.env.location.pathname + (query ? `?${query}` : "");
  let referrer = "";
  try { referrer = new URL(ctx.env.referrer).origin + "/"; } catch { /* no or opaque referrer */ }
  return {
    form: "landing-page",
    submissionToken: ctx.token,
    site_language: ctx.locale,
    lead_source_url: sourceUrl,
    referrer,
    ...campaign,
    fields: {
      landing_page_path: ctx.env.location.pathname,
      form_variant: ctx.production.formVariant,
      fname: str(values.fullName),
      email: str(values.email),
      phone: str(values.phone),
      message: str(values.message),
      consent: values[CONSENT_FIELD] === true,
    },
  };
}

/** The request body. Exported for tests. `env` = where the visitor is; nothing else from the URL is read. */
export function buildProductionLead(values: FormValues, ctx: Pick<SubmitContext, "token" | "locale"> & { production: ProductionFormContext; env: ProductionEnv }): Record<string, unknown> {
  // Preserve the optional gender on both batch-2 routes; only the family profile packs extra message fields.
  const family = ctx.production.profile === "family-retreat";
  let campaign: Record<string, string> = {};
  try {
    campaign = ctx.env.attribution?.() || urlAttribution(ctx.env.location.search);
  } catch {
    campaign = urlAttribution(ctx.env.location.search);
  }
  const query = new URLSearchParams(campaign).toString();
  const sourceUrl = ctx.env.location.origin + ctx.env.location.pathname + (query ? `?${query}` : "");
  let referrer = "";
  try { referrer = new URL(ctx.env.referrer).origin + "/"; } catch { /* no or opaque referrer */ }
  return {
    form: "landing-page",
    company: str(values.honeypot),
    submissionToken: ctx.token,
    site_language: ctx.locale,
    lead_source_url: sourceUrl,
    referrer,
    ...campaign,
    fields: {
      landing_page_path: ctx.env.location.pathname,
      form_variant: ctx.production.formVariant,
      campaign_name: campaign.utm_campaign || "",
      utm_keyword: campaign.utm_term || "",
      fname: str(values.fullName),
      rdogender: family || ctx.production.profile === "pain-management" || ctx.production.profile === "r10" ? familyGender(values.rdogender) : "",
      email: str(values.email),
      phone: fullCampaignPhone(values),
      message: family ? familyMessage(values) : str(values.message),
      consent: values[CONSENT_FIELD] === true,
    },
  };
}

export const productionLeadAdapter: FormAdapter = {
  id: "ahv-production",
  async submit(values, ctx) {
    if (!ctx.production) return { status: "error", code: "invalid", message: PRODUCTION_MESSAGES.unconfirmed };
    const enquiry = ctx.production.profile === "campaign-enquiry";
    const msg = enquiry ? enquiryMessages(ctx.locale) : PRODUCTION_MESSAGES;
    // The campaign enquiry form sends nothing when its honeypot is filled (a bot); nor does this.
    if (enquiry && str(values.honeypot)) return { status: "error", code: "honeypot", message: msg.unconfirmed };
    let body: Record<string, unknown>;
    try {
      const bctx = { token: ctx.token, locale: ctx.locale, production: ctx.production, env: ctx.env ?? browserEnv() };
      body = enquiry ? buildCampaignEnquiryLead(values, bctx) : buildProductionLead(values, bctx);
    } catch {
      return { status: "error", code: "url", message: MSG_GENERIC };
    }
    const doFetch = ctx.fetch ?? globalThis.fetch;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let res: Response;
    let result: Record<string, unknown>;
    try {
      const timedOut = new Promise<never>((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(new Error("timeout")); }, ctx.timeoutMs ?? SUBMIT_TIMEOUT_MS);
      });
      res = await Promise.race([
        doFetch("/api/lead/", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(body),
        }),
        timedOut,
      ]);
      // Receiving headers does not complete a submission: also bound a stalled response body.
      result = await Promise.race([readJson(res), timedOut]);
      if (controller.signal.aborted) throw new Error("timeout");
    } catch {
      return { status: "error", code: "network", message: msg.network };
    } finally {
      clearTimeout(timer);
    }
    const serverCode = typeof result.code === "string" ? result.code : undefined;
    if (res.status === 503 && /_NOT_CONFIGURED$/.test(serverCode ?? "")) {
      return { status: "error", code: "not_configured", message: msg.notConnected, httpStatus: 503, serverCode };
    }
    // The campaign enquiry form's success rule is ok === true; the R10 form also requires status "received".
    if (!res.ok || result.ok !== true || (!enquiry && result.status !== "received")) {
      return {
        status: "error",
        code: res.status === 429 ? "rate_limited" : "invalid",
        message: res.status === 429 ? msg.retry : msg.unconfirmed,
        httpStatus: res.status,
        ...(serverCode ? { serverCode } : {}),
      };
    }
    const guideUrl = ctx.production.downloadGuide && typeof result.guideUrl === "string" ? safeGuideUrl(result.guideUrl) : undefined;
    return { status: "received", ref: "", token: ctx.token, ...(guideUrl ? { guideUrl } : {}) };
  },
};

export const ADAPTERS: Record<string, FormAdapter> = { "lead-api": leadApiAdapter, "ahv-production": productionLeadAdapter };

/** The adapter for an id; unknown ids fall back to lead-api (never a silent no-op). */
export function getAdapter(id?: string): FormAdapter {
  return (id && Object.hasOwn(ADAPTERS, id) ? ADAPTERS[id] : undefined) ?? leadApiAdapter;
}
