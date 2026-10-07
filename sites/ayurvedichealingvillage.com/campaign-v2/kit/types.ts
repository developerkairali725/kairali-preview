import type { FormSchema } from "../forms/schema.ts";

export type Variant = "A" | "B" | "C" | "D";
export const VARIANTS: readonly Variant[] = ["A", "B", "C", "D"];
export type Locale = "en" | "hi" | "ar" | "de" | "fr" | "es" | "it" | "pt" | "nl" | "ru" | "zh-Hans" | "ja" | "ko";
export type Currency = "INR" | "USD" | "EUR" | "GBP" | "AED";
export type Channel = "whatsapp" | "instagram" | "messenger" | "chat" | "call" | "email";
export type Pending = { readonly __pending: true; id: string; note: string };
export type Maybe<T> = T | Pending;

export type ImageRef = {
  id: string; src: string; width: number; height: number; alt: string;
  decorative: boolean; gccSafe: boolean; location: "palakkad" | "ho-centre" | "n/a";
  consent: "confirmed" | "pending" | "not-applicable";
};
export type FilmKind = "property" | "patient" | "treatment" | "yoga";
export type FilmRef = { youtubeId: string; title: string; kind: FilmKind; consent: boolean; recordedYear: number; thumb: string };
export type DoctorRef = {
  id: string; name: string; role: Maybe<string>; qualification: Maybe<string>;
  /** Only when a source states it; never derived from a joining year. Omitted = not shown. */
  yearsInPractice?: Maybe<number>;
  /** Verbatim tenure line from the approved source, e.g. "At Kairali since 2024". */
  tenure?: string;
  /** Verbatim focus line from the approved source. */
  focus?: string;
  languages: Maybe<string[]>; photo: ImageRef;
};
export type Money = Partial<Record<Currency, number>>;
export type FeeRow = { name: string; note: string; single: Money; twinEach: Money };
export type Fees = { source: string; validTo: string; nights: number; rows: FeeRow[] };
export type Offer = { name: string; headline: string; termsUrl: string; validFrom: string; validTo: string; source: string };
export type GalleryCategory = "Villas" | "Therapies" | "Grounds" | "Dining" | "Yoga";
export type WordingOverride = { term: string; approvedBy: "owner"; date: string; reason: string };
export type Translation = { locale: Locale; review: "approved" | "pending" };

/** Owner-approved hidden pricing (owner, 7 Oct 2026: campaign pages show no numeric prices or rate downloads). */
export type PricingPolicy = { display: "hidden"; approvedBy: "owner"; date: string; rule: string };
/** What replaces the fee table when pricing is hidden: an enquiry-only quotation block. */
export type FeePresentation = { mode: "enquiry-only"; heading: string; body: string; cta: string };

// Preserved source body (content contract of 7 Oct 2026, CONTENT-READY.json). `sourceSection` is an audit key
// (also the old page's anchor id), never public copy. Inline runs, when present, replace `text`.
export type BodyInline = { type: "text"; text: string } | { type: "link"; text: string; href: string };
export type BodyBlock =
  | { type: "h2" | "h3" | "p"; text: string; inline?: BodyInline[] }
  | { type: "quote"; text: string; attribution: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "programme"; label: string; href: string; sanskrit?: string }
  | { type: "videoLink"; href: string; label: string; thumbnail?: string; sourceSection?: string }
  | { type: "image"; src: string; alt: string; caption?: string; sourceWidth?: number; sourceHeight?: number }
  | { type: "link"; text: string; href: string };
export type BodySection = { sourceSection: string; blocks: BodyBlock[] };
export type SourceBody = { intro: string[]; sections: BodySection[]; closing: BodyBlock[] };
/** Owner rule: >=95% of the useful source copy survives. Replaces the generic long-form caps, measured by a test. */
export type SourcePreservation = { approvedBy: "owner"; date: string; rule: string; minRetention: number };

export type CampaignConfig = {
  slug: string;
  route: string;
  previewRoute: string;
  defaultVariant: Variant;
  variants: Variant[];
  index: false;
  locales: Locale[];
  translations: Translation[];
  modesty: "standard" | "gcc";
  wordingOverrides: WordingOverride[];
  production: boolean;
  seo: { title: string; description: string };
  adMatch: { keywords: string[]; adHeadlines: string[] };
  hero: {
    overline: string; h1: string; h1Accent?: string; standfirst: string;
    image: Record<Variant, ImageRef>; mobileImage: ImageRef;
  };
  programDefault: string;
  tracking: { campaignName: string; trackId: string };
  admission: { heading: string; steps: { title: string; body: string }[] };
  included: string[];
  chargedSeparately: string[];
  stillness: { heading: string; body: string; image: ImageRef };
  /** Optional: a production page with a preserved source body carries its films there instead. */
  films?: { featured: FilmRef; more: FilmRef[] };
  doctors: DoctorRef[];
  village: { heading: string; body: string };
  gallery: { category: GalleryCategory; image: ImageRef }[];
  /** null = no fee data at all; only valid with an owner-approved hidden `pricing` policy. */
  fees: Maybe<Fees> | null;
  offer: Offer | null | Pending;
  faq: { q: string; a: Maybe<string> }[];
  longForm: string;
  /** Production surface only (the live ad routes). Absent on /lp-v2 previews. */
  pricing?: PricingPolicy;
  feePresentation?: FeePresentation;
  cta?: { primary: string; primarySupport?: string; secondary?: string };
  /** The route's existing lead identity (fields.form_variant, guide download), for the "ahv-production" adapter. */
  productionForm?: { formVariant: string; downloadGuide: boolean };
  /** Preserved source body; when present, `longForm` is not rendered and must be empty. */
  body?: SourceBody;
  sourcePreservation?: SourcePreservation;
  /** House spelling for the lint. Default "en-US" (guide §8.1); "en-GB" only with a recorded reason. */
  spelling?: { locale: "en-US" } | { locale: "en-GB"; reason: string };
  /** Optional extra schema.org objects (SEO / AI-search), appended after the generated JSON-LD. See integrations/README.md. */
  extraJsonLd?: object[];
  /**
   * Optional enquiry form choice. Default: the live campaign enquiry form ("live-campaign").
   * `schemaId: "three-step"` switches to the 3-step channel form; `schema` (a custom FormSchema) wins over both.
   * `adapterId` picks the submit adapter. See forms/schema.ts and forms/adapter.ts.
   */
  form?: { schema?: FormSchema; schemaId?: "live-campaign" | "three-step"; adapterId?: string };
};
