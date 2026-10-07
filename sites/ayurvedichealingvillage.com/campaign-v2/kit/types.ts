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
  /**
   * How `photo` sits in a 4:5 card (production doctor cards): `position` = CSS object-position, then the photo is
   * enlarged `zoom` times about `origin`. Lets portraits framed differently (full-length vs head-and-shoulders) show
   * faces at a similar size and height. Absent = centred, top-weighted, not enlarged.
   */
  frame?: { position: string; origin: string; zoom: number };
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
/**
 * A live ad route's existing enquiry form, when it differs from the default production form. "family-retreat" = the
 * R10 form with familyFields (gender, country, preferred duration, "Any existing health conditions?").
 */
export type ProductionFormProfile = "family-retreat" | "pain-management";

// ── The designed production page (the live ad routes) ─────────────────────────────────────────────────────
// The reviewed copy of a live ad route, arranged by the production template (production/ProductionPage.tsx).
// Content only: which section shows it, in what order and how, is the template's decision.

/**
 * Copy with inline links: plain text in which "[label](href)" marks a link (kit/rich.ts). No other syntax and
 * no HTML; every href must pass kit/lint/body.ts safeHref.
 */
export type RichText = string;
export type PageLink = { label: string; href: string };
/** The opening argument: why this page, in the reader's terms. `points` = the concerns or situations it covers. */
export type PageLead = { heading: string; paragraphs: RichText[]; points?: string[] };
/** What the page offers, in one of three forms chosen for the content's shape. `kicker` = the section's overline. */
export type PageOffering = { kicker?: string } & (
  /** A few families of programmes or topics as cards; `programmeLinks` = the links are programme pages (diagnostics). */
  | { kind: "cards"; heading: string; intro?: RichText[]; cards: { title: string; links?: PageLink[]; paragraphs: RichText[] }[]; programmeLinks?: true }
  /** Named items completing a sentence, set as one numbered row (the five Panchakarma procedures). */
  | { kind: "row"; heading: string; lead: string; items: string[]; paragraphs: RichText[] }
  /** Many short topics as a numbered index of disclosures (family: each person's concern). */
  | { kind: "index"; heading: string; intro?: RichText[]; topics: { title: string; body: RichText }[] }
);
/** From the first conversation to the stay: two or three numbered steps. `image` is bound per route (bindings.ts). */
export type PagePathway = { heading: string; intro?: RichText[]; steps: { title: string; body: RichText }[]; image?: ImageRef };
/** The quiet band over the decorative stillness photograph. */
export type PageRest = { heading: string; paragraphs: string[] };
/** The village and its villas: copy, optional villa cards, then the photo mosaic and the full gallery. */
export type PagePlace = { heading: string; paragraphs: RichText[]; villas?: { name: string; body: string; link: PageLink }[] };
/** What a stay covers and how it is quoted (owner: no numeric prices; enquiry-only quotation). `extra` = charged separately. */
export type PageStay = { heading: string; paragraphs: RichText[]; lists: { heading?: string; items: string[]; extra?: true }[]; after?: RichText[] };
/** Patient films, as on the page this replaces: outbound YouTube links (no embedded player), with local thumbnails. */
export type PageStory = { title: string; href: string; thumb: { src: string; width: number; height: number } };
export type PageStories = { heading: string; body: string; films: PageStory[] };
/** The doctors section's own words; the roster and every fact on the cards come from data/doctors.ts. */
export type PageDoctors = { heading: string; intro: string };
/** The enquiry section's heading and invitation. */
export type PageClosing = { heading: string; paragraphs: RichText[] };
export type ProductionPage = {
  lead: PageLead; offering: PageOffering; pathway: PagePathway; rest: PageRest; place: PagePlace;
  stories?: PageStories; stay: PageStay; doctors: PageDoctors; faqHeading: string; closing: PageClosing;
};

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
    /** Optional responsive-image encoding quality; original media and desktop delivery stay unchanged. */
    mobileQuality?: number;
  };
  programDefault: string;
  tracking: { campaignName: string; trackId: string };
  admission: { heading: string; steps: { title: string; body: string }[] };
  included: string[];
  chargedSeparately: string[];
  stillness: { heading: string; body: string; image: ImageRef };
  /** Optional: a designed production page (`page`) carries its patient films as `page.stories` instead. */
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
  cta?: { primary: string; primarySupport?: string; secondary?: string };
  /** The route's existing lead identity (fields.form_variant, guide download, form profile), for the "ahv-production" adapter. */
  productionForm?: { formVariant: string; downloadGuide: boolean; profile?: ProductionFormProfile };
  /** Production surface only: false = no Step-1 ConsultBar (its program / month / 14–28-night questions are not this route's form). */
  consultBar?: false;
  /**
   * Production surface only: the designed page (production/ProductionPage.tsx). When present, `longForm` is empty and
   * the kit fields it supersedes (admission, included, chargedSeparately, village) mirror it for the shared kit code.
   */
  page?: ProductionPage;
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
