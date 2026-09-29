// /preventive-rejuvenation-detoxification.html — Batch A. Layout and copy: the saved staging pages
//   desktop (700px and up): staging-pages/Preventive Rejuvenation & Detoxification in Kerala – Ayurveda Cure.html
//   phone (under 700px):    staging-pages/(none)
// converted by scripts/dc_convert.py (staging.html, staging.mobile.html,
// meta.json), then corrected by scripts/edits/preventive-rejuvenation-detoxification.json. Every change is
// logged in docs/changes/preventive-rejuvenation-detoxification.md.
import DcPage, { dcMetadata } from "../../components/dc/DcPage";
import meta from "./meta.json";

const dir = "preventive-rejuvenation-detoxification.html";

export const metadata = dcMetadata(meta);

export default function Page() {
  return <DcPage meta={meta} dir={dir} />;
}
