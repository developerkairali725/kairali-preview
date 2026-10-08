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
import treatmentKerala from "./treatment-kerala.ts";
import southIndiaCities from "./south-india-cities.ts";
import brand from "./brand.ts";
import weightManagement from "./weight-management.ts";
import lpSouthIndia from "./lp-south-india.ts";
import lpHospitalKerala from "./lp-hospital-kerala.ts";
import lpBrand from "./lp-brand.ts";
import lpCleansingCentre from "./lp-cleansing-centre.ts";
import lpPainManagement from "./lp-pain-management.ts";
import lpPanchakarma from "./lp-panchakarma.ts";
import lpTreatmentKerala from "./lp-treatment-kerala.ts";
import lpTreatmentPackages from "./lp-treatment-packages.ts";
import lpWeightManagement from "./lp-weight-management.ts";
import lpBehandlungKerala from "./lp-behandlung-kerala.ts";
import lpTreatmentKeralaRu from "./lp-treatment-kerala-ru.ts";

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
  "treatment-kerala": treatmentKerala,
  "south-india-cities": southIndiaCities,
  brand,
  "weight-management": weightManagement,
  "lp-south-india": lpSouthIndia,
  "lp-hospital-kerala": lpHospitalKerala,
  "lp-brand": lpBrand,
  "lp-cleansing-centre": lpCleansingCentre,
  "lp-pain-management": lpPainManagement,
  "lp-panchakarma": lpPanchakarma,
  "lp-treatment-kerala": lpTreatmentKerala,
  "lp-treatment-packages": lpTreatmentPackages,
  "lp-weight-management": lpWeightManagement,
  "lp-behandlung-kerala": lpBehandlungKerala,
  "lp-treatment-kerala-ru": lpTreatmentKeralaRu,
};
