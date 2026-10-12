import type { ReactNode } from "react";
import ProductionDocument from "../../campaign-v2/production/Document";

// Root layout of the German live ad route rebuilt on the campaign-v2 kit (/lp/behandlung-in-kerala/): the production document in German,
// with the site's own consent, measurement, lead receipt and chat, and the site's localized chrome.
export default function Layout({ children }: { children: ReactNode }) {
  return <ProductionDocument lang="de">{children}</ProductionDocument>;
}
