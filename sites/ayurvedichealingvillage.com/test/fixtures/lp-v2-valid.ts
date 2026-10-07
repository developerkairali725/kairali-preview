import type { CampaignConfig } from "../../campaign-v2/kit/types.ts";
import { img, film, doc } from "../../campaign-v2/kit/registry.ts";

export function validConfig(): CampaignConfig {
  return {
    slug: "fixture", route: "/fixture.html", previewRoute: "/lp-v2/fixture", defaultVariant: "A",
    variants: ["A", "B", "C", "D"], index: false, locales: ["en"], translations: [{ locale: "en", review: "approved" }],
    modesty: "standard", wordingOverrides: [], production: false,
    seo: { title: "Panchakarma in Kerala | Kairali Healing Village", description: "A physician-led Panchakarma admission at a NABH-accredited Ayurvedic hospital in Kerala, with therapy, prescribed diet and rest." },
    adMatch: { keywords: ["panchakarma treatment kerala"], adHeadlines: ["Panchakarma in Kerala"] },
    hero: {
      overline: "NABH-accredited Ayurvedic hospital · Kerala", h1: "Panchakarma, practiced the way it was meant to be.",
      h1Accent: "meant to be.", standfirst: "A doctor-led stay in a quiet Kerala village. Therapy, a diet set by your doctor and deep rest are planned around you.",
      image: { A: img("kt-199"), B: img("kt-199"), C: img("kt-190"), D: img("kt-202") }, mobileImage: img("kt-190"),
    },
    programDefault: "Panchakarma", tracking: { campaignName: "panchakarma", trackId: "" },
    admission: { heading: "One doctor. One plan. Written for you.", steps: [
      { title: "Before you arrive", body: "A free video visit with an Ayurvedic doctor. The doctor reads your records first." },
      { title: "During admission", body: "Daily therapies, a diet set by your doctor, gentle yoga and rest. Meals come from the hospital kitchen." },
      { title: "After discharge", body: "You leave with a written plan for home. A doctor follows up with you, so the routine goes with you." },
    ]},
    included: ["Doctor consultations", "Prescribed therapies", "All meals, prescribed diet", "Private villa"],
    chargedSeparately: ["Medicines", "Laboratory tests"],
    stillness: { heading: "Stillness is part of the prescription.", body: "Warm oil, quiet rooms and monsoon light through tall windows. Nothing is asked of you here.", image: img("gal-post-therapy-stillness-wakem") },
    films: { featured: film("iPARaMRASUs"), more: [film("4x01PtWfNnk"), film("3vWviQfW1Ug")] },
    doctors: [doc("deepu-john"), doc("akhila-oommen")],
    village: { heading: "Private villas among palms and paddy fields.", body: "Private villas sit among palms and paddy fields. The hospital kitchen cooks to your prescription." },
    gallery: [
      { category: "Villas", image: img("kt-116") }, { category: "Villas", image: img("kt-314") },
      { category: "Grounds", image: img("wx-hero") }, { category: "Grounds", image: img("gal-poolside-rest-palakkad-2026") },
      { category: "Dining", image: img("wx-dining") }, { category: "Therapies", image: img("kt-202") },
    ],
    fees: { source: "https://kairali-documents.vercel.app/ tariff p.3", validTo: "2027-03-31", nights: 14, rows: [
      { name: "Deluxe villa", note: "Garden-facing villa", single: { INR: 400000, USD: 4800 }, twinEach: { INR: 310000, USD: 3700 } },
    ]},
    offer: null,
    faq: [
      { q: "Is the doctor consultation really free?", a: "Yes. Before you book, a qualified Ayurvedic doctor speaks with you by video at no charge. The doctor will advise you whether an admission suits you." },
      { q: "Can a companion stay with me?", a: "Yes. A companion can share your villa. Tell us when you enquire, and we will include their meals and their stay in your fee plan for you." },
      { q: "How do I reach Palakkad?", a: "Coimbatore and Kochi are the usual airports for Palakkad. Our patient team will share transfer options and timings with you when you enquire with us." },
      { q: "What should I bring?", a: "Bring your medical records, your current medicines and comfortable cotton clothes. Therapy garments are provided for your treatments during the stay, so you need not pack them." },
    ],
    longForm: "## About Panchakarma\n\n" + "Panchakarma is a classical Ayurvedic program of therapies planned by a physician. ".repeat(40),
  };
}
