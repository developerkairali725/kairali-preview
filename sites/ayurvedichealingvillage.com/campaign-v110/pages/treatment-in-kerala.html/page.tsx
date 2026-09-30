// /treatment-in-kerala.html — Batch A. Layout and copy: the saved staging pages
//   desktop (700px and up): staging-pages/Authentic Ayurvedic Treatments in Kerala for Holistic Wellness.html
//   phone (under 700px):    staging-pages/(none)
// converted by scripts/dc_convert.py (staging.html, staging.mobile.html,
// meta.json), then corrected by scripts/edits/treatment-in-kerala.json. Every change is
// logged in docs/changes/treatment-in-kerala.md.
import DcPage, { dcMetadata } from "../../components/dc/DcPage";
import meta from "./meta.json";

const dir = "treatment-in-kerala.html";

export const metadata = dcMetadata(meta);

export default function Page() {
  return <DcPage meta={meta} dir={dir} />;
}
