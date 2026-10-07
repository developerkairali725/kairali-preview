import { defineCampaign } from "../kit/define.ts";
import { pending } from "../kit/pending.ts";
import { img, film, doc } from "../kit/registry.ts";

const P = (id: string) => pending(id, "fill from sources") as unknown as string;

export default defineCampaign({
  slug: "_template", route: "/<ad-route>", previewRoute: "/lp-v2/_template", defaultVariant: "A",
  variants: ["A", "B", "C", "D"], index: false, locales: ["en"], translations: [{ locale: "en", review: "approved" }],
  modesty: "standard", wordingOverrides: [], production: false,
  seo: { title: P("seo.title"), description: P("seo.description") },
  adMatch: { keywords: [], adHeadlines: [] },
  hero: { overline: P("hero.overline"), h1: P("hero.h1"), standfirst: P("hero.standfirst"),
    image: { A: img("kt-199"), B: img("kt-199"), C: img("kt-190"), D: img("kt-202") }, mobileImage: img("kt-190") },
  programDefault: P("programDefault"), tracking: { campaignName: P("tracking.campaignName"), trackId: "" },
  admission: { heading: P("admission.heading"), steps: [
    { title: P("s1.title"), body: P("s1.body") }, { title: P("s2.title"), body: P("s2.body") }, { title: P("s3.title"), body: P("s3.body") } ] },
  included: [P("i1"), P("i2"), P("i3"), P("i4")], chargedSeparately: [P("c1")],
  stillness: { heading: P("stillness.heading"), body: P("stillness.body"), image: img("gal-post-therapy-stillness-wakem") },
  films: { featured: film("iPARaMRASUs"), more: [film("4x01PtWfNnk"), film("3vWviQfW1Ug")] },
  doctors: [doc("deepu-john"), doc("akhila-oommen")],
  village: { heading: P("village.heading"), body: P("village.body") },
  gallery: [],
  fees: pending("C2", "14-night totals from tariff"), offer: null,
  faq: [{ q: P("faq.q"), a: pending("faq", "answer") }],
  longForm: "",
});
