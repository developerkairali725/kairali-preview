// /ayurvedic-treatment-packages.html — Batch A. Layout and copy: the saved staging pages
//   desktop (700px and up): staging-pages/Ayurvedic Treatment Program _ Kairali Ayurvedic Healing Village Kerala.html
//   phone (under 700px):    staging-pages/(none)
// converted by scripts/dc_convert.py (staging.html, staging.mobile.html,
// meta.json), then corrected by scripts/edits/ayurvedic-treatment-packages.json. Every change is
// logged in docs/changes/ayurvedic-treatment-packages.md.
import DcPage, { dcMetadata } from "../../components/dc/DcPage";
import meta from "./meta.json";

const dir = "ayurvedic-treatment-packages.html";

export const metadata = dcMetadata(meta);

export default function Page() {
  return <DcPage meta={meta} dir={dir} />;
}
