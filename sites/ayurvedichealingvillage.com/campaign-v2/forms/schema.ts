// The enquiry form, as data. A campaign (or the team / a later AI) can swap fields by setting
// `form.schema` in its campaign file; Enquiry renders whatever is here. Validation, error copy,
// honeypot, consent and the measurement events stay in the shell (sections/interactive/EnquiryForm).
//
// Rules for any schema:
//   - New schemas do not ask for health data. The existing family route retains its optional health field
//     and existing lead handling through its explicit production profile; do not extend that exception.
//   - `mapsTo` decides where a value lands in the existing lead row (see kit/lead.ts). Anything that is
//     not an existing column goes into `message` (packed as "Label: value" lines).
//   - The last step always gets the consent checkbox, the optional marketing box and the honeypot.
//   - A "textarea" mapped to `message` is the visitor's own text: it lands verbatim at the end of the
//     packed message (after the Ref line), not as a "Label: value" line.
//
// Which schema a campaign gets: `form.schema` (a custom one) wins, else `form.schemaId` picks from FORMS,
// else DEFAULT_SCHEMA_ID ("live-campaign": the live campaign enquiry form, owner decision 7 Oct 2026).
//
// Erasable TypeScript only (node --test runs this file directly).

import type { CampaignConfig, Channel } from "../kit/types.ts";
import { CAMPAIGN_PHONE_PATTERN, normaliseCampaignPhone, validCampaignPhone } from "../../lib/campaign-phone.ts";

export type FieldType = "select" | "radio" | "text" | "email" | "tel" | "channel" | "textarea";
export type LeadColumn = "fname" | "email" | "phone" | "country" | "duration";
export type Option = { value: string; label: string };
export type OptionContext = { campaign: Pick<CampaignConfig, "programDefault">; locale: string; now: Date };

export type Field = {
  name: string;
  type: FieldType;
  /** Label when the field is required (or always, when it never is). */
  label: string;
  /** true / false, or the reply channels for which it is required (e.g. phone for whatsapp and call). */
  required: boolean | readonly Channel[];
  /** Label used while a channel-dependent field is optional. */
  optionalLabel?: string;
  /** Static options, or a function evaluated at render on the server (months, the campaign's program). */
  options?: readonly Option[] | ((ctx: OptionContext) => Option[]);
  /** Default value; a function is evaluated at render. Selects without one start on their first option. */
  defaultValue?: string | ((ctx: OptionContext) => string);
  autocomplete?: string;
  placeholder?: string;
  /** Short helper line under the field. */
  hint?: string;
  /** Maximum length in characters (also the input's maxLength). */
  maxLength?: number;
  /** HTML pattern the whole (trimmed) value must match, e.g. the live form's phone pattern. */
  pattern?: string;
  /** "tel" only: fewest digits accepted (default 7). A country-code field sets 1. */
  minDigits?: number;
  /**
   * Extra check. "campaign-phone": the number, joined to the step's `dialCode` value unless it already starts
   * with "+", must pass lib/campaign-phone.ts validCampaignPhone — the same rule /api/lead/ enforces for the
   * live ad routes, so the visitor sees the error before anything is sent.
   */
  check?: "campaign-phone";
  /** Rows for a textarea. */
  rows?: number;
  mapsTo: LeadColumn | "message" | "none";
};

/** `short` labels the progress bar ("1 · Program"); defaults to the title. `intro` is a line under the title. */
export type FormStep = { id: string; title: string; short?: string; intro?: string; fields: Field[] };

export type FormSchema = {
  id: string;
  steps: FormStep[];
  /** Submit button label (default "Send"). */
  submitLabel?: string;
  /** Text of the privacy link under the consent box (default "Privacy notice"). */
  privacyLabel?: string;
  /** The Enquiry section's lede next to the form (default: the three-step lede). */
  lede?: string;
  /** When set, the success screen shows this line plus the "Or continue on" channel buttons only. */
  successText?: string;
  /** The consent checkbox label, naming the chosen reply channel (WhatsApp Business opt-in rules). */
  consentLabel: (channelName: string) => string;
  /** Show the optional, unticked marketing checkbox on the last step. */
  marketingOptIn: boolean;
  /** Send the whole trimmed name in `fname` and `lname` empty (the live campaign form). Default: split first / rest. */
  fullNameInFname?: boolean;
  /**
   * false = no generic "No medical details needed" line under the first step. Only for a form that asks an optional
   * health question (the family route); its own note is then that field's `hint`. Default: the line is shown.
   */
  genericNote?: false;
};

// ── Channels ────────────────────────────────────────────────────────────────

export const CHANNELS: readonly { id: Channel; label: string; name: string }[] = [
  { id: "whatsapp", label: "WhatsApp", name: "WhatsApp" },
  { id: "instagram", label: "Instagram", name: "Instagram" },
  { id: "messenger", label: "Messenger", name: "Messenger" },
  { id: "chat", label: "Chat here", name: "chat on this page" },
  { id: "call", label: "Phone call", name: "phone" },
  { id: "email", label: "Email", name: "email" },
];
export const DEFAULT_CHANNEL: Channel = "whatsapp";

export function isChannel(v: unknown): v is Channel {
  return typeof v === "string" && CHANNELS.some((c) => c.id === v);
}
export function channelName(ch: Channel): string {
  return CHANNELS.find((c) => c.id === ch)?.name ?? "WhatsApp";
}

// ── Shared option lists (ConsultBar uses the same values, so its answers prefill step 1) ─────────

export const ADVISE = "advise";
export const FLEXIBLE = "flexible";
export const LENGTHS: readonly Option[] = [
  { value: "14", label: "14 nights" }, { value: "21", label: "21 nights" },
  { value: "28", label: "28 nights" }, { value: ADVISE, label: "Doctor to advise" },
];
export const PARTIES: readonly Option[] = [
  { value: "solo", label: "Just me" }, { value: "two", label: "Two patients" }, { value: "companion", label: "Patient + companion" },
];

export function programOptions(ctx: OptionContext): Option[] {
  return [{ value: ctx.campaign.programDefault, label: ctx.campaign.programDefault }, { value: ADVISE, label: "Not sure — advise me" }];
}

/** The next six calendar months (value YYYY-MM, label in the page locale), then "Flexible". */
export function monthOptions(ctx: Pick<OptionContext, "locale" | "now">): Option[] {
  let fmt: Intl.DateTimeFormat;
  try {
    fmt = new Intl.DateTimeFormat(ctx.locale, { month: "long", year: "numeric", timeZone: "UTC" });
  } catch {
    fmt = new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" });
  }
  const now = ctx.now;
  const out: Option[] = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1 + i, 1));
    return { value: `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`, label: fmt.format(d) };
  });
  out.push({ value: FLEXIBLE, label: "Flexible" });
  return out;
}

// ── The three-step channel form (canvas Form-Flow.dc.html) — opt-in via form.schemaId "three-step" ──

export const THREE_STEP_FORM: FormSchema = {
  id: "lp-v2-3step",
  marketingOptIn: true,
  lede: "Three short steps. No medical details needed here — your doctor asks for those privately at consultation.",
  consentLabel: (name) =>
    name === "phone" || name === "email"
      ? "I agree that Kairali may contact me about this enquiry by phone or email."
      : `I agree that Kairali may contact me about this enquiry by ${name}, phone or email.`,
  steps: [
    {
      id: "program",
      title: "Your free doctor consultation",
      short: "Program",
      fields: [
        { name: "program", type: "select", label: "Program", required: true, options: programOptions, defaultValue: (ctx) => ctx.campaign.programDefault, mapsTo: "message" },
        { name: "month", type: "select", label: "Preferred month", required: true, options: monthOptions, defaultValue: FLEXIBLE, mapsTo: "message" },
      ],
    },
    {
      id: "stay",
      title: "Your stay, and how we reply",
      short: "Stay & reply",
      fields: [
        { name: "length", type: "select", label: "Length", required: true, options: LENGTHS, defaultValue: "14", mapsTo: "duration" },
        { name: "party", type: "select", label: "Who is coming", required: true, options: PARTIES, mapsTo: "message" },
        {
          name: "channel", type: "channel", label: "Where would you like us to reply?", required: true,
          options: CHANNELS.map((c) => ({ value: c.id, label: c.label })), defaultValue: DEFAULT_CHANNEL, mapsTo: "message",
          hint: "Our AI assistant replies first; a member of the patient team follows up.",
        },
      ],
    },
    {
      id: "contact",
      title: "Your details",
      short: "Contact",
      fields: [
        { name: "fullName", type: "text", label: "Full name", required: true, autocomplete: "name", mapsTo: "fname" },
        { name: "email", type: "email", label: "Email", required: true, autocomplete: "email", mapsTo: "email" },
        {
          name: "phone", type: "tel", label: "WhatsApp / phone with country code", optionalLabel: "Phone with country code (optional)",
          required: ["whatsapp", "call"], autocomplete: "tel", placeholder: "+44 7700 900000", mapsTo: "phone",
        },
      ],
    },
  ],
};

/** @deprecated The default is now LIVE_CAMPAIGN_FORM; use THREE_STEP_FORM. Kept so older imports still work. */
export const DEFAULT_FORM: FormSchema = THREE_STEP_FORM;

// ── The live campaign enquiry form (app/(lp)/_components/campaign-enquiry-form.tsx) — the DEFAULT ──
// Same fields, labels, constraints and consent as the live form. Differences, by owner decision: the submit
// label, the kit honeypot name (lp_hp_ref), and the "Or continue on" channel buttons on success.

export const LIVE_PHONE_PATTERN = "[+0-9() .-]{7,30}";
export const LIVE_CAMPAIGN_FORM: FormSchema = {
  id: "lp-v2-live-campaign",
  marketingOptIn: false,
  fullNameInFname: true,
  submitLabel: "Get free doctor consultation",
  privacyLabel: "Privacy policy",
  lede: "One short form. No medical details needed here — your doctor asks for those privately at consultation.",
  successText: "Thank you. Your enquiry has been received.",
  consentLabel: () => "I agree to be contacted about my enquiry.",
  steps: [
    {
      id: "enquiry",
      title: "Request a consultation",
      intro: "Tell us how to reach you. Our patient care team can help you plan your visit.",
      fields: [
        { name: "fullName", type: "text", label: "Your name", required: true, autocomplete: "name", maxLength: 120, mapsTo: "fname" },
        { name: "email", type: "email", label: "Email", required: true, autocomplete: "email", maxLength: 254, mapsTo: "email" },
        {
          name: "phone", type: "tel", label: "Phone / WhatsApp (optional, include country code)", required: false,
          autocomplete: "tel", placeholder: "+91 …", maxLength: 30, pattern: LIVE_PHONE_PATTERN, mapsTo: "phone",
        },
        { name: "message", type: "textarea", label: "How can we help? (optional)", required: false, rows: 3, maxLength: 3000, mapsTo: "message" },
      ],
    },
  ],
};

// ── The live ad routes' enquiry form (production surface) ─────────────────────────────────────────────
// The current production form contract (app/(campaign)/ayurvedic-treatment-packages.html/EnquiryForm.tsx and
// /api/lead/): name, email and a phone with its country code are required on these routes (the API rejects
// them without a valid phone), the message is optional, consent is required. The phone pair keeps that form's
// own labels and +91 default; the other labels are the live campaign form's above. Submitted by the
// "ahv-production" adapter (forms/adapter.ts), never by lead-api.

export const DIAL_CODE_PATTERN = String.raw`\+[1-9][0-9]{0,2}`;
export const PRODUCTION_CAMPAIGN_FORM: FormSchema = {
  id: "lp-v2-live-campaign",
  marketingOptIn: false,
  fullNameInFname: true,
  submitLabel: LIVE_CAMPAIGN_FORM.submitLabel,
  privacyLabel: LIVE_CAMPAIGN_FORM.privacyLabel,
  lede: LIVE_CAMPAIGN_FORM.lede,
  successText: LIVE_CAMPAIGN_FORM.successText,
  consentLabel: () => "I have read and agree to the privacy policy and terms",
  steps: [
    {
      id: "enquiry",
      title: "Request a consultation",
      intro: "Tell us how to reach you. Our patient care team can help you plan your visit.",
      fields: [
        { name: "fullName", type: "text", label: "Your name", required: true, autocomplete: "name", maxLength: 120, mapsTo: "fname" },
        { name: "email", type: "email", label: "Email", required: true, autocomplete: "email", maxLength: 254, mapsTo: "email" },
        {
          name: "dialCode", type: "tel", label: "Country code", required: true, autocomplete: "tel-country-code",
          defaultValue: "+91", maxLength: 4, minDigits: 1, pattern: DIAL_CODE_PATTERN, mapsTo: "none",
        },
        {
          name: "phone", type: "tel", label: "Phone / WhatsApp", required: true, autocomplete: "tel-national",
          maxLength: 30, pattern: CAMPAIGN_PHONE_PATTERN, hint: "Change +91 for your country.", check: "campaign-phone", mapsTo: "phone",
        },
        { name: "message", type: "textarea", label: "How can we help? (optional)", required: false, rows: 3, maxLength: 3000, mapsTo: "message" },
      ],
    },
  ],
};

// ── The family route's existing enquiry form (production surface, opt-in per route) ───────────────────────
// The R10 form with familyFields (app/(campaign)/ayurvedic-treatment-packages.html/EnquiryForm.tsx, as rendered on
// /family-ayurvedic-retreat-kerala.html): the production form above plus its own fields, constraints and labels —
// gender (optional radio), country (required, max 100), preferred duration (optional, empty default; form choices,
// not clinical minimums), an optional preferred month (empty default; FAMILY_MONTH_FIELD) and the optional "Any
// existing health conditions?" text (max 2700, so the packed message stays within the API's 3000). The "ahv-production" adapter packs them as that form did (forms/adapter.ts). The
// copy's own note on the optional health field is its hint; the generic "No medical details" lede and line are not
// shown, because this form asks that question. Selected only by a route's productionForm.profile "family-retreat".

export const FAMILY_GENDERS: readonly Option[] = [{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }];
export const FAMILY_DURATIONS: readonly Option[] = [
  { value: "", label: "Select duration" }, { value: "7 days", label: "7 days" },
  { value: "14 days", label: "14 days" }, { value: "21 days", label: "21 days" },
];
export const FAMILY_COUNTRY_MAX = 100;
export const FAMILY_HEALTH_MAX = 2700;
/**
 * The family form's optional preferred month (owner decision DEC-OPTIONAL-STAY-SELECTORS: optional only): an empty
 * default, so no preference is assumed, then the shared next six months + Flexible. A picked month is one extra line in
 * the packed message (forms/adapter.ts familyMessage); unanswered, the request is unchanged.
 */
export const FAMILY_MONTH_FIELD = "preferredMonth";
export function familyMonthOptions(ctx: Pick<OptionContext, "locale" | "now">): Option[] {
  return [{ value: "", label: "Select month" }, ...monthOptions(ctx)];
}

/** Preserve the pain route's existing optional, initially unanswered gender radios. */
export const PRODUCTION_PAIN_FORM: FormSchema = {
  ...PRODUCTION_CAMPAIGN_FORM,
  id: "lp-v2-production-pain",
  steps: PRODUCTION_CAMPAIGN_FORM.steps.map((step, i) => i === 0 ? {
    ...step,
    fields: step.fields.flatMap((field): Field[] => field.name === "fullName" ? [
      field,
      { name: "rdogender", type: "radio", label: "Gender", required: false, options: FAMILY_GENDERS, mapsTo: "none" },
    ] : [field]),
  } : step),
};

/** The R10 form of the specialist routes (monsoon, detox, retreat): the same fields as the pain route's form. */
export const PRODUCTION_R10_FORM: FormSchema = { ...PRODUCTION_PAIN_FORM, id: "lp-v2-production-r10" };

// ── The campaign enquiry form (app/(lp)/_components/campaign-enquiry-form.tsx), production profile "campaign-enquiry" ──
// The form of the established DcPage routes and every /lp/ route: name and email required, phone optional (no country
// code field, the same pattern and +91 placeholder), message optional, consent. Same labels and consent wording per
// language (German = that form's own German copy; Russian = this page's translation of the same labels).

type EnquiryCopy = {
  title: string; intro: string; lede: string; name: string; email: string; phone: string; message: string;
  consent: string; privacy: string; success: string;
};
export const CAMPAIGN_ENQUIRY_COPY: Record<"en" | "de" | "ru", EnquiryCopy> = {
  en: {
    title: "Request a consultation", intro: "Tell us how to reach you. Our patient care team can help you plan your visit.",
    lede: LIVE_CAMPAIGN_FORM.lede ?? "", name: "Your name", email: "Email", phone: "Phone / WhatsApp (optional, include country code)",
    message: "How can we help? (optional)", consent: "I agree to be contacted about my enquiry.", privacy: "Privacy policy",
    success: "Thank you. Your enquiry has been received.",
  },
  de: {
    title: "Kostenlose ärztliche Erstberatung", intro: "Teilen Sie uns mit, wie wir Sie erreichen können. Unser Patientenservice hilft Ihnen bei der Planung Ihres Aufenthalts.",
    lede: "Ein kurzes Formular. Medizinische Angaben sind hier nicht nötig – Ihr Arzt fragt diese vertraulich in der Beratung ab.",
    name: "Ihr Name", email: "E-Mail", phone: "Telefon / WhatsApp (optional, mit Ländervorwahl)", message: "Wie können wir helfen? (optional)",
    consent: "Ich stimme zu, zu meiner Anfrage kontaktiert zu werden.", privacy: "Datenschutzerklärung (EN)",
    success: "Vielen Dank. Ihre Anfrage ist eingegangen.",
  },
  ru: {
    title: "Бесплатная консультация врача", intro: "Сообщите, как с вами связаться. Служба сопровождения пациентов поможет спланировать ваш визит.",
    lede: "Короткая форма. Медицинские сведения здесь не нужны — врач спросит о них конфиденциально во время консультации.",
    name: "Ваше имя", email: "Эл. почта", phone: "Телефон / WhatsApp (необязательно, с кодом страны)", message: "Чем мы можем помочь? (необязательно)",
    consent: "Я согласен(на), чтобы со мной связались по поводу моего запроса.", privacy: "Политика конфиденциальности (EN)",
    success: "Спасибо. Ваш запрос получен.",
  },
};

export function campaignEnquiryForm(locale: string): FormSchema {
  const k = locale === "de" || locale === "ru" ? locale : "en";
  const t = CAMPAIGN_ENQUIRY_COPY[k];
  return {
    id: "lp-v2-campaign-enquiry",
    marketingOptIn: false,
    fullNameInFname: true,
    submitLabel: LIVE_CAMPAIGN_FORM.submitLabel,
    privacyLabel: t.privacy,
    lede: t.lede,
    successText: t.success,
    consentLabel: () => t.consent,
    steps: [{
      id: "enquiry",
      title: t.title,
      intro: t.intro,
      fields: [
        { name: "fullName", type: "text", label: t.name, required: true, autocomplete: "name", maxLength: 120, mapsTo: "fname" },
        { name: "email", type: "email", label: t.email, required: true, autocomplete: "email", maxLength: 254, mapsTo: "email" },
        { name: "phone", type: "tel", label: t.phone, required: false, autocomplete: "tel", placeholder: "+91 …", maxLength: 30, pattern: LIVE_PHONE_PATTERN, mapsTo: "phone" },
        { name: "message", type: "textarea", label: t.message, required: false, rows: 3, maxLength: 3000, mapsTo: "message" },
      ],
    }],
  };
}

/** The family enquiry form; `healthNote` is the copy's note shown under the optional health-conditions field. */
export function productionFamilyForm(healthNote: string): FormSchema {
  const { lede: _lede, ...base } = PRODUCTION_CAMPAIGN_FORM;
  const field = (name: string): Field => {
    const f = PRODUCTION_CAMPAIGN_FORM.steps[0].fields.find((x) => x.name === name);
    if (!f) throw new Error(`productionFamilyForm: no ${name} field in the production form`);
    return f;
  };
  return {
    ...base,
    id: "lp-v2-production-family",
    genericNote: false,
    steps: [
      {
        ...PRODUCTION_CAMPAIGN_FORM.steps[0],
        fields: [
          field("fullName"),
          { name: "rdogender", type: "radio", label: "Gender", required: false, options: FAMILY_GENDERS, mapsTo: "none" },
          field("email"),
          field("dialCode"),
          field("phone"),
          { name: "country", type: "text", label: "Country", required: true, autocomplete: "country-name", maxLength: FAMILY_COUNTRY_MAX, mapsTo: "country" },
          { name: "duration", type: "select", label: "Preferred duration", required: false, options: FAMILY_DURATIONS, defaultValue: "", mapsTo: "duration" },
          { name: FAMILY_MONTH_FIELD, type: "select", label: "Preferred month", required: false, options: familyMonthOptions, defaultValue: "", mapsTo: "message" },
          { name: "message", type: "textarea", label: "Any existing health conditions?", required: false, rows: 3, maxLength: FAMILY_HEALTH_MAX, hint: healthNote, mapsTo: "message" },
        ],
      },
    ],
  };
}

/** The number the lead API receives: the visitor's own "+…" number, else dial code + number, normalised. Pure. */
export function fullCampaignPhone(values: FormValues): string {
  const phone = typeof values.phone === "string" ? values.phone.trim() : "";
  const dial = typeof values.dialCode === "string" ? values.dialCode.trim() : "";
  return normaliseCampaignPhone(phone.startsWith("+") ? phone : `${dial} ${phone}`);
}

// ── Registry ────────────────────────────────────────────────────────────────

export const FORMS = { "live-campaign": LIVE_CAMPAIGN_FORM, "three-step": THREE_STEP_FORM } as const;
export type FormSchemaId = keyof typeof FORMS;
export const DEFAULT_SCHEMA_ID: FormSchemaId = "live-campaign";

/** The schema a campaign renders: a custom `schema` first, then `schemaId`, else the live campaign form. */
export function formSchemaFor(form?: { schema?: FormSchema; schemaId?: string } | null): FormSchema {
  if (form?.schema) return form.schema;
  const id = form?.schemaId;
  return id && Object.hasOwn(FORMS, id) ? FORMS[id as FormSchemaId] : FORMS[DEFAULT_SCHEMA_ID];
}

// ── Resolution (server) — functions → plain data, so the schema can cross into the client component ──

export type ResolvedField = Omit<Field, "options" | "defaultValue"> & { options?: Option[]; defaultValue: string };
export type ResolvedSchema = {
  id: string;
  steps: { id: string; title: string; short: string; intro?: string; fields: ResolvedField[] }[];
  consentLabels: Record<Channel, string>;
  marketingOptIn: boolean;
  submitLabel: string;
  privacyLabel: string;
  lede?: string;
  successText?: string;
  fullNameInFname?: boolean;
  genericNote?: false;
};

export function resolveSchema(schema: FormSchema, ctx: OptionContext): ResolvedSchema {
  const consentLabels = {} as Record<Channel, string>;
  for (const c of CHANNELS) consentLabels[c.id] = schema.consentLabel(c.name);
  return {
    id: schema.id,
    marketingOptIn: schema.marketingOptIn,
    consentLabels,
    submitLabel: schema.submitLabel ?? "Send",
    privacyLabel: schema.privacyLabel ?? "Privacy notice",
    ...(schema.lede ? { lede: schema.lede } : {}),
    ...(schema.successText ? { successText: schema.successText } : {}),
    ...(schema.fullNameInFname ? { fullNameInFname: true } : {}),
    ...(schema.genericNote === false ? { genericNote: false as const } : {}),
    steps: schema.steps.map((s) => ({
      id: s.id,
      title: s.title,
      short: s.short ?? s.title,
      ...(s.intro ? { intro: s.intro } : {}),
      fields: s.fields.map((f) => {
        const options = typeof f.options === "function" ? f.options(ctx) : f.options ? [...f.options] : undefined;
        const dv = typeof f.defaultValue === "function" ? f.defaultValue(ctx) : f.defaultValue;
        const { options: _o, defaultValue: _d, ...rest } = f;
        return { ...rest, options, defaultValue: dv ?? (f.type === "select" && options?.length ? options[0].value : "") };
      }),
    })),
  };
}

// ── Validation (pure) ───────────────────────────────────────────────────────

export type FormValues = Record<string, string | boolean | undefined>;
export type ErrorCode = "required" | "email" | "phone" | "consent" | "too_long";
export type FieldError = { field: string; code: ErrorCode; message: string };

type FieldLike = Pick<Field, "name" | "type" | "required"> & Partial<Pick<Field, "maxLength" | "pattern" | "minDigits" | "check">> & { options?: readonly Option[] | ((ctx: OptionContext) => Option[]) };
type SchemaLike = { steps: readonly { fields: readonly FieldLike[] }[] };

export const CONSENT_FIELD = "consent";
export const MESSAGES = {
  program: "Please choose a program.",
  email: "Please enter an email like name@example.com.",
  consent: "Please tick the first box so we can reply to you.",
  phone: "Please enter your WhatsApp or phone number with the country code, like +44 7700 900000.",
  name: "Please enter your name.",
  choose: "Please choose an option.",
  /** The family form's required country (its R10 original relied on the browser's own required message). */
  country: "Please enter your country.",
} as const;

export const tooLongMessage = (n: number) => `Please keep this to ${n.toLocaleString("en")} characters or fewer.`;

/** Full-match test of an HTML pattern attribute (browsers anchor it the same way). Bad patterns never block. */
function matchesPattern(pattern: string, v: string): boolean {
  try {
    return new RegExp(`^(?:${pattern})$`, "u").test(v);
  } catch {
    return true;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isRequired(f: Pick<Field, "required">, channel: Channel): boolean {
  return Array.isArray(f.required) ? f.required.includes(channel) : f.required === true;
}

function requiredMessage(f: FieldLike): string {
  if (f.name === "program") return MESSAGES.program;
  if (f.name === "country" && f.type === "text") return MESSAGES.country;
  if (f.type === "email") return MESSAGES.email;
  if (f.type === "tel") return MESSAGES.phone;
  if (f.type === "text") return MESSAGES.name;
  return MESSAGES.choose;
}

/**
 * Errors for one step, in field order (so the first one is where focus goes). Pure.
 * The last step also checks the consent box (values.consent === true).
 */
export function validateStep(schema: SchemaLike, stepIndex: number, values: FormValues, channel: Channel): FieldError[] {
  const step = schema.steps[stepIndex];
  if (!step) return [];
  const errors: FieldError[] = [];
  for (const f of step.fields) {
    const raw = values[f.name];
    const v = typeof raw === "string" ? raw.trim() : "";
    const required = isRequired(f, channel);
    if (!v) {
      if (required) errors.push({ field: f.name, code: f.type === "email" ? "email" : f.type === "tel" ? "phone" : "required", message: requiredMessage(f) });
      continue;
    }
    if (typeof f.maxLength === "number" && v.length > f.maxLength) errors.push({ field: f.name, code: "too_long", message: tooLongMessage(f.maxLength) });
    else if (f.type === "email" && !EMAIL_RE.test(v)) errors.push({ field: f.name, code: "email", message: MESSAGES.email });
    else if (f.type === "tel" && (v.replace(/\D/g, "").length < (f.minDigits ?? 7) || (f.pattern !== undefined && !matchesPattern(f.pattern, v)))) errors.push({ field: f.name, code: "phone", message: MESSAGES.phone });
    // A bad country code is reported once, on its own field, unless the number brings its own "+code".
    else if (f.check === "campaign-phone" && (v.startsWith("+") || !errors.some((e) => e.field === "dialCode")) && !validCampaignPhone(fullCampaignPhone(values))) errors.push({ field: f.name, code: "phone", message: MESSAGES.phone });
    else if (Array.isArray(f.options) && (f.type === "select" || f.type === "radio" || f.type === "channel") && !f.options.some((o) => o.value === v)) {
      errors.push({ field: f.name, code: "required", message: requiredMessage(f) });
    }
  }
  if (stepIndex === schema.steps.length - 1 && values[CONSENT_FIELD] !== true) {
    errors.push({ field: CONSENT_FIELD, code: "consent", message: MESSAGES.consent });
  }
  return errors;
}
