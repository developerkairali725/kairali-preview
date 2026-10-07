// The reviewed copy of every live ad route, by production slug (production/load.ts binds each to its route).
// Erasable TypeScript only (node --test imports it).
import type { ProductionCopy } from "../copy.ts";
import type { ProductionSlug } from "../bindings.ts";
import treatmentPackages from "./treatment-packages.ts";
import panchakarma from "./panchakarma.ts";
import painManagement from "./pain-management.ts";
import familyRetreat from "./family-ayurvedic-retreat.ts";

export const COPY: Record<ProductionSlug, ProductionCopy> = {
  "treatment-packages": treatmentPackages,
  panchakarma,
  "pain-management": painManagement,
  "family-ayurvedic-retreat": familyRetreat,
};
