// kairaliequipment.com — catalog data (single source for hub, category pages,
// PDP templates, sitemap and llms.txt).
//
// CONTENT LAW: category-level copy is REAL — the `mined` field is QUOTED
// VERBATIM from the legacy-site record (docs/group-inputs/
// kairaliequipment-org-inventory.md §4, Wayback capture 2015-09-07). Nothing
// below category level is real: SKUs/prices are owner-ordered placeholders
// (D-EQ-CATALOG) and every placeholder uses the EXACT grammar the lint scans
// for (SKU-PLACEHOLDER-0NN · ₹X,XXX / $X,XXX · "— awaiting catalog —").
// Vernacular rule (competitor research §2.2): every H1 pairs the vernacular
// term with its English gloss; spelling variants live in body copy.

export type Category = {
  slug: string;
  /** chip/short name */
  name: string;
  /** vernacular-paired H1 per CR §2.2 */
  h1: string;
  gloss: string;
  /** verbatim mined description — REAL, quoted from the legacy record */
  mined: string;
  /** builder copy grounded in the mined record (no invented facts) */
  copy: string;
  /** spelling variants covered in body copy, never doorway pages */
  variants: string[];
  img: { src: string; alt: string };
  /** real category-level spec rows; "— awaiting catalog —" marks the gaps */
  specs: Array<[string, string]>;
  /** STRATEGY §2 keywords (primary first) */
  keywords: string[];
  title: string;
  description: string;
  /** real Q&A only — answers say "shared at quote stage" where no data exists */
  faq: Array<{ question: string; answer: string }>;
};

export const CATEGORIES: Category[] = [
  {
    slug: "pathi",
    name: "Pathi / Droni",
    h1: "Pathi — the wooden Panchakarma massage bed (Droni · Dharapathi)",
    gloss: "Droni · Dharapathi",
    mined:
      "8.5 X 3 feet with 3 inches thickness. These massage beds are made of Medicated wood and have brass decorative works and rose wood finish. Every massage bed we supply includes a stand and steel support for complete stability.",
    copy:
      "The traditional Panchakarma table — written pathi or patti, droni or dhroni depending on where in Kerala you learned it. Medicated wood, brass decorative work, rose-wood finish, on a stand with steel support.",
    variants: ["pathi", "patti", "droni", "dhroni", "dharapathi"],
    img: { src: "/images/wooden-massage-bed.jpg", alt: "Pathi wooden massage bed in medicated wood with brass fittings" },
    specs: [
      ["Dimensions", "8.5 × 3 ft (2591 × 914 mm)"],
      ["Slab thickness", "3 in (76 mm)"],
      ["Material", "Medicated wood · brass work · rose-wood finish"],
      ["Support", "Stand + steel support"],
    ],
    keywords: ["wooden massage table ayurveda", "droni", "dharapathi", "pathi massage bed", "panchakarma table manufacturer", "abhyanga table"],
    title: "Pathi / Droni Wooden Massage Beds — 8.5 × 3 ft",
    description:
      "Traditional Pathi (Droni) Panchakarma massage beds: 8.5 × 3 ft, 3 in slab, medicated wood with brass work, stand and steel support. Quote-first.",
    faq: [
      {
        question: "What is a droni (pathi) made of?",
        answer:
          "The record's spec: medicated wood with brass decorative works and a rose-wood finish, 8.5 × 3 feet with a 3-inch-thick slab, supplied with a stand and steel support.",
      },
      {
        question: "What sizes are available, and what is the price?",
        answer:
          "The reference spec is 8.5 × 3 ft (2591 × 914 mm). Model-level options and prices are shared at quote stage — nothing is published on this site.",
      },
    ],
  },
  {
    slug: "shirodhara-stand",
    name: "Shirodhara stands",
    h1: "Shirodhara Stand — the dhara apparatus, with brass pot",
    gloss: "Dhara stand · brass pot",
    mined:
      "We offer a wide range of Shirodhara Stands. Precisely designed and developed, these stands are available in various attractive designs and finish following the exact demands and specifications of clients.",
    copy:
      "The chain-hung brass Shirodhara pot on its stand — the continuous-stream apparatus of the classical dhara treatments, built to the buyer's exact demands and specifications.",
    variants: ["shirodhara", "dhara"],
    img: { src: "/images/shirodhara-stand.jpg", alt: "Brass Shirodhara stand arm with hanging chains and wooden holders" },
    specs: [
      ["Pot", "Brass, chain-hung"],
      ["Designs & finish", "Built to client specification (per the record)"],
      ["Height & flow set", "— awaiting catalog —"],
    ],
    keywords: ["shirodhara stand", "shirodhara equipment", "brass shirodhara pot", "shirodhara table + stand set"],
    title: "Shirodhara Stands with Brass Pots — Kairali Equipment",
    description:
      "Shirodhara stands with chain-hung brass pots, designed and finished to the buyer's specification. From the group's own facility. Quote-first.",
    faq: [
      {
        question: "Can a Shirodhara stand be made to my centre's specification?",
        answer:
          "Yes — the record states stands are designed and developed following the exact demands and specifications of clients. Send the specification with your quote request.",
      },
      {
        question: "Is the pot included with the stand?",
        answer:
          "The classical set pairs the chain-hung brass pot with its stand. Configurations and set contents are confirmed at quote stage.",
      },
    ],
  },
  {
    slug: "steam-box",
    name: "Steam boxes",
    h1: "Steam Box — the swedana chamber, in teak",
    gloss: "Swedana chamber",
    mined:
      "Sitting-style steam box with foot rest. These aesthetically designed Steam Box are available in Teak wood with stainless steel bottom and tank and have automatic controls.",
    copy:
      "The sitting-style swedana chamber with foot rest — teak body, stainless-steel bottom and tank, automatic controls. Built for daily treatment-room duty.",
    variants: ["swedana", "steam bath"],
    img: { src: "/images/steam-bath.jpg", alt: "Upright wooden steam bath chamber with brass-trimmed panels" },
    specs: [
      ["Style", "Sitting, with foot rest"],
      ["Material", "Teak wood · stainless-steel bottom + tank"],
      ["Controls", "Automatic"],
      ["Chamber size", "— awaiting catalog —"],
    ],
    keywords: ["ayurvedic steam bath chamber", "steam box ayurveda", "swedana yantra", "sitting steam bath wooden"],
    title: "Ayurvedic Steam Boxes (Swedana) — Teak, Steel Tank",
    description:
      "Sitting-style Ayurvedic steam boxes: teak wood, stainless-steel bottom and tank, automatic controls, foot rest. Made in our own facility. Quote-first.",
    faq: [
      {
        question: "How is an Ayurvedic steam box different from a sauna?",
        answer:
          "A swedana chamber steams the seated body while the head stays outside the chamber — the classical fomentation posture. The record's build is teak with a stainless-steel tank and automatic controls; it is treatment-room apparatus, not a leisure sauna cabin.",
      },
      {
        question: "What are the chamber dimensions?",
        answer: "Chamber sizes are shared at quote stage — the published record carries the material and control spec, not dimensions.",
      },
    ],
  },
  {
    slug: "urlis",
    name: "Urlis",
    h1: "Urlis — traditional brass & bell-metal vessels (Uruli)",
    gloss: "Uruli · brass & bell metal",
    mined: "Beautiful and aesthetically designed Urlis in traditional brass and bell metal.",
    copy:
      "Urli or uruli — the wide treatment vessel of the Kerala tradition, cast in brass and bell metal for oils, choornams and preparation work.",
    variants: ["urli", "uruli"],
    img: { src: "/images/ayurvedic-spa-equipments-oil.jpg", alt: "Brass vessels holding medicated oil and herbal powders" },
    specs: [
      ["Material", "Traditional brass · bell metal"],
      ["Sizes", "— awaiting catalog —"],
    ],
    keywords: ["brass urli", "uruli vessels", "bell metal urli", "ayurvedic bronze vessels", "treatment vessels"],
    title: "Urlis — Brass & Bell-Metal Treatment Vessels",
    description:
      "Traditional urlis (uruli) in brass and bell metal for Ayurveda treatment rooms — oils, choornams, preparations. From our own facility. Quote-first.",
    faq: [
      {
        question: "What metals are the urlis cast in?",
        answer: "Traditional brass and bell metal, per the record.",
      },
      {
        question: "What sizes are available?",
        answer: "Sizes and set options are shared at quote stage — the record does not publish a size table.",
      },
    ],
  },
  {
    slug: "accessories",
    name: "Accessories",
    h1: "Accessories — pots, sets & steps",
    gloss: "Pots · sets · steps",
    mined:
      "We also have a wide range of other Ayurveda Spa Equipment like Shirodhara pot, Shirodhara equipment set, Droni step and much more.",
    copy:
      "The named accessory line from the legacy catalogue: the Shirodhara pot, the Shirodhara equipment set, and the Droni step — the pieces that complete a treatment room.",
    variants: [],
    img: { src: "/images/droni-step.jpg", alt: "Three-tier wooden Droni step with brass scrollwork frame" },
    specs: [
      ["Named items", "Shirodhara pot · Shirodhara equipment set · Droni step"],
      ["Further items", "— awaiting catalog —"],
    ],
    keywords: ["ayurveda treatment accessories", "shirodhara pot", "droni step", "panchakarma set"],
    title: "Ayurveda Treatment Accessories — Pots, Sets & Steps",
    description:
      "Treatment-room accessories from the Kairali catalogue: Shirodhara pot, Shirodhara equipment set, Droni step. Made in our own facility. Quote-first.",
    faq: [
      {
        question: "Which accessories are in the catalogue?",
        answer:
          "The record names the Shirodhara pot, the Shirodhara equipment set and the Droni step; the full accessory list lands with the real catalogue.",
      },
    ],
  },
];

export const CATEGORY_BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));

/** D-EQ-CATALOG placeholder PDP rows — 2 per category, UNMISTAKABLE, noindex,
 *  out of the sitemap, NO Product schema (nothing fake enters the graph). */
export const PLACEHOLDER_SKUS = ["sku-placeholder-001", "sku-placeholder-002"] as const;

export type Lane = {
  slug: string;
  name: string;
  h1: string;
  copy: string;
  cta: string;
  keywords: string[];
  title: string;
  description: string;
};

export const TRADE_LANES: Lane[] = [
  {
    slug: "contract-manufacturing",
    name: "Contract manufacturing",
    h1: "Contract manufacturing — OEM builds on our own factory floor",
    copy: "Your specification, our craft: OEM equipment manufacturing inside the group's own facility, with its own quality control and R&D.",
    cta: "Start an OEM enquiry",
    keywords: ["contract manufacturing ayurveda equipment", "OEM spa equipment India", "private label ayurveda equipment"],
    title: "Contract Manufacturing — OEM Ayurveda Equipment",
    description:
      "OEM and contract manufacturing of Ayurveda equipment on Kairali's own factory floor — your specification, our craft, QC and R&D. Quote-first.",
  },
  {
    slug: "hotel-resort-spa-supply",
    name: "Hotels, resorts & spas",
    h1: "Hotels, resorts & spas — equipment from a group that runs its own",
    copy: "Treatment-room equipment for wellness properties, supplied by the family group that operates its own NABH-accredited Ayurveda hospital.",
    cta: "Discuss a property fit-out",
    keywords: ["spa equipment for hotels and resorts", "resort spa setup India", "wellness hotel equipment supplier"],
    title: "Spa Equipment for Hotels & Resorts — Fit-Outs",
    description:
      "Ayurveda treatment-room equipment for hotels, resorts and spa developers — from the family group behind the NABH-accredited Healing Village.",
  },
  {
    slug: "spa-consultancy",
    name: "Spa-setup consultancy",
    h1: "Spa-setup consultancy — equip a new centre end-to-end",
    copy: "Planning, equipment and know-how for a new Ayurveda centre — the consultancy lane the group's record has carried for years, from room planning to the equipment list.",
    cta: "Plan a new centre",
    keywords: ["ayurveda spa setup consultant", "spa equipment planner", "panchakarma centre setup requirements"],
    title: "Ayurveda Spa-Setup Consultancy — Centre Planning",
    description:
      "End-to-end Ayurveda centre setup: planning, equipment selection and know-how from the Kairali Ayurvedic Group's own operating experience.",
  },
  {
    slug: "distributors-importers",
    name: "Distributors & importers",
    h1: "Distributors & importers — join the alliance network",
    copy: "The worldwide alliance and export relationships carried from the group's record — territories and terms discussed one-to-one with the distributor team.",
    cta: "Start a distributor enquiry",
    keywords: ["ayurveda equipment distributor", "import ayurvedic equipment", "spa equipment importer partnership"],
    title: "Become a Distributor — Kairali Ayurveda Equipment",
    description:
      "Distribute or import Kairali Ayurveda equipment: the worldwide alliance network carried from the group's export record. Terms discussed one-to-one.",
  },
];

export const LANE_BY_SLUG = new Map(TRADE_LANES.map((l) => [l.slug, l]));

export const SITE_URL = "https://kairaliequipment.com";
