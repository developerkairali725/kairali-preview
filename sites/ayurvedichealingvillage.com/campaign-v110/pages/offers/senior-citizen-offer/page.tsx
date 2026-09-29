// /offers/senior-citizen-offer/ — Batch A. Layout and copy: the saved staging pages
//   desktop (700px and up): staging-pages/Senior Citizen Wellness Offer – Up to 20% Off at Kairali.html
//   phone (under 700px):    staging-pages/(none)
// converted by scripts/dc_convert.py (staging.html, staging.mobile.html,
// meta.json), then corrected by scripts/edits/offers-senior-citizen.json. Every change is
// logged in docs/changes/offers-senior-citizen.md.
import DcPage, { dcMetadata } from "../../../components/dc/DcPage";
import meta from "./meta.json";

const dir = "offers/senior-citizen-offer";

export const metadata = dcMetadata(meta);

export default function Page() {
  return <DcPage meta={meta} dir={dir} />;
}
