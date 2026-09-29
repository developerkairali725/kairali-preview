// /pain-management.html — Batch A. Layout and copy: the saved staging pages
//   desktop (700px and up): staging-pages/Effective Pain Management with Ayurvedic Treatments in Kerala.html
//   phone (under 700px):    staging-pages/(none)
// converted by scripts/dc_convert.py (staging.html, staging.mobile.html,
// meta.json), then corrected by scripts/edits/pain-management.json. Every change is
// logged in docs/changes/pain-management.md.
import DcPage, { dcMetadata } from "../../components/dc/DcPage";
import meta from "./meta.json";

const dir = "pain-management.html";

export const metadata = dcMetadata(meta);

export default function Page() {
  return <DcPage meta={meta} dir={dir} />;
}
