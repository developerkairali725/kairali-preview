import type { ReactNode } from "react";
import ProductionDocument from "../../campaign-v2/production/Document";

// Root layout of the live ad routes rebuilt on the campaign-v2 kit (batch 1: /ayurvedic-treatment-packages.html
// and /panchkarma-treatment.html). Same URLs as before; the production document keeps the site's consent,
// measurement, lead receipt and chat, and confines the kit design to these pages.
export default function Layout({ children }: { children: ReactNode }) {
  return <ProductionDocument>{children}</ProductionDocument>;
}
