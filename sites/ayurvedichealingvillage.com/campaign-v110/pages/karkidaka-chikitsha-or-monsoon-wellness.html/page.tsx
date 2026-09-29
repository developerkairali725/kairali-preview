// /karkidaka-chikitsha-or-monsoon-wellness.html — Batch A. Layout and copy: the saved staging pages
//   desktop (700px and up): staging-pages/Monsoon Ayurvedic Treatment Kerala _ Karkidaka Chikitsa Reset _ Kairali.html
//   phone (under 700px):    staging-pages/(none)
// converted by scripts/dc_convert.py (staging.html, staging.mobile.html,
// meta.json), then corrected by scripts/edits/karkidaka-chikitsha-or-monsoon-wellness.json. Every change is
// logged in docs/changes/karkidaka-chikitsha-or-monsoon-wellness.md.
import DcPage, { dcMetadata } from "../../components/dc/DcPage";
import meta from "./meta.json";

const dir = "karkidaka-chikitsha-or-monsoon-wellness.html";

export const metadata = dcMetadata(meta);

export default function Page() {
  return <DcPage meta={meta} dir={dir} />;
}
