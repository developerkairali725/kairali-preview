// /offers/defence-and-paramilitary/ — Batch A. Layout and copy: the saved staging pages
//   desktop (700px and up): staging-pages/Ayurvedic Wellness for Defence & Paramilitary Forces – Kairali.html
//   phone (under 700px):    staging-pages/(none)
// converted by scripts/dc_convert.py (staging.html, staging.mobile.html,
// meta.json), then corrected by scripts/edits/offers-defence-paramilitary.json. Every change is
// logged in docs/changes/offers-defence-paramilitary.md.
import DcPage, { dcMetadata } from "../../../components/dc/DcPage";
import meta from "./meta.json";

const dir = "offers/defence-and-paramilitary";

export const metadata = dcMetadata(meta);

export default function Page() {
  return <DcPage meta={meta} dir={dir} />;
}
