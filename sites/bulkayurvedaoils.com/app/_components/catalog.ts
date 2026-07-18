// The verified bulk catalog — single source for every page on this site.
// HARD GATE 6 basis: the live wholesale collection's products.json [OWN-6]
// (docs/kappl-inputs/bulk-b2b-niche-brief.md §1). 11 SKUs, verified formats:
// classical thailams in 5000 ml cans · choornams/powders in 500–1000 g packs.
// Nothing is added here without an owner-published source. The proprietary-oils
// wholesale collection EXISTS as a published page [OWN-7] but its product list
// is not machine-verifiable today (products.json empty, checked 18 Jul 2026) —
// so that category page describes and links the collection, and names NOTHING.

export const THAILAMS = [
  "Balaguluchyadi Kera Thailam",
  "Chandhanadi Thailam",
  "Kayyunyadi Thailam",
  "Thriphaladi Kera Thailam",
] as const;

export const POWDERS = [
  "Udwarthanam Powder",
  "Kottamchukkadi Choornam",
  "Kizhi Powder",
  "Kolakulathadi Choornam",
  "Navara Rice",
  "Thriphaladi Choornam",
  "Jatamayadi Choornam",
] as const;

export const OIL_PACK = "5 L per can";
export const POWDER_PACK = "500 g – 1 kg";

export const STORE_PROPRIETARY_COLLECTION =
  "https://www.kairaliproducts.in/collections/proprietary-oils-wholesale-bulk-packaging";
