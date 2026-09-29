// /panchkarma-treatment.html — Batch A. Layout and copy: the saved staging pages
//   desktop (700px and up): staging-pages/Panchakarma Treatment in Kerala _ Kairali Ayurvedic Healing Village.html
//   phone (under 700px):    staging-pages/(none)
// converted by scripts/dc_convert.py (staging.html, staging.mobile.html,
// meta.json), then corrected by scripts/edits/panchkarma-treatment.json. Every change is
// logged in docs/changes/panchkarma-treatment.md.
import DcPage, { dcMetadata } from "../../components/dc/DcPage";
import meta from "./meta.json";

const dir = "panchkarma-treatment.html";

export const metadata = dcMetadata(meta);

export default function Page() {
  return <DcPage meta={meta} dir={dir} />;
}
