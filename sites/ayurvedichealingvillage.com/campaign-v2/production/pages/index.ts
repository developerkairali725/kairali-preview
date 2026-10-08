// The reviewed copy of every live ad route, by production slug (production/load.ts binds each to its route).
// Erasable TypeScript only (node --test imports it).
import type { ProductionCopy } from "../copy.ts";
import type { ProductionSlug } from "../bindings.ts";
import treatmentPackages from "./treatment-packages.ts";
import panchakarma from "./panchakarma.ts";
import painManagement from "./pain-management.ts";
import familyRetreat from "./family-ayurvedic-retreat.ts";
// Remaining 20 (8 Oct 2026), in their four review batches.
import monsoonWellness from "./monsoon-wellness.ts";
import rejuvenationDetox from "./rejuvenation-detox.ts";
import ayurvedaRetreat from "./ayurveda-retreat.ts";
import wellnessKerala from "./wellness-kerala.ts";
import cleansingCentre from "./cleansing-centre.ts";

export const COPY: Record<ProductionSlug, ProductionCopy> = {
  "treatment-packages": treatmentPackages,
  panchakarma,
  "pain-management": painManagement,
  "family-ayurvedic-retreat": familyRetreat,
  "monsoon-wellness": monsoonWellness,
  "rejuvenation-detox": rejuvenationDetox,
  "ayurveda-retreat": ayurvedaRetreat,
  "wellness-kerala": wellnessKerala,
  "cleansing-centre": cleansingCentre,
};
