// /offers/olympics-and-paralympics-offer/ — Batch A. Layout and copy: the saved staging pages
//   desktop (700px and up): staging-pages/Exclusive Ayurveda Retreat Offer for Olympic & Paralympic Athletes.html
//   phone (under 700px):    staging-pages/(none)
// converted by scripts/dc_convert.py (staging.html, staging.mobile.html,
// meta.json), then corrected by scripts/edits/offers-olympics-paralympics.json. Every change is
// logged in docs/changes/offers-olympics-paralympics.md.
import DcPage, { dcMetadata } from "../../../components/dc/DcPage";
import meta from "./meta.json";

const dir = "offers/olympics-and-paralympics-offer";

export const metadata = dcMetadata(meta);

export default function Page() {
  return <DcPage meta={meta} dir={dir} />;
}
