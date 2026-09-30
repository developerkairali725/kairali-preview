// /weight-loss.html — Batch A. Layout and copy: the saved staging pages
//   desktop (700px and up): staging-pages/Effective Ayurvedic Weight Loss Treatments in Kerala, India.html
//   phone (under 700px):    staging-pages/(none)
// converted by scripts/dc_convert.py (staging.html, staging.mobile.html,
// meta.json), then corrected by scripts/edits/weight-loss.json. Every change is
// logged in docs/changes/weight-loss.md.
import DcPage, { dcMetadata } from "../../components/dc/DcPage";
import meta from "./meta.json";

const dir = "weight-loss.html";

export const metadata = dcMetadata(meta);

export default function Page() {
  return <DcPage meta={meta} dir={dir} />;
}
