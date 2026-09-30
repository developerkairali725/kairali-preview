// /Ayurveda_Treatment_Neo_S.India_Cities.html — Batch A. Layout and copy: the saved staging pages
//   desktop (700px and up): staging-pages/Ayurvedic Treatment in South India _ Holistic Healing Packages.html
//   phone (under 700px):    staging-pages/(none)
// converted by scripts/dc_convert.py (staging.html, staging.mobile.html,
// meta.json), then corrected by scripts/edits/Ayurveda_Treatment_Neo_S.India_Cities.json. Every change is
// logged in docs/changes/Ayurveda_Treatment_Neo_S.India_Cities.md.
import DcPage, { dcMetadata } from "../../components/dc/DcPage";
import meta from "./meta.json";

const dir = "Ayurveda_Treatment_Neo_S.India_Cities.html";

export const metadata = dcMetadata(meta);

export default function Page() {
  return <DcPage meta={meta} dir={dir} />;
}
