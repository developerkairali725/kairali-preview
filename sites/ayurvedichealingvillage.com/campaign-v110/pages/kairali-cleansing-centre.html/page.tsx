// /kairali-cleansing-centre.html — Batch A. Layout and copy: the saved staging pages
//   desktop (700px and up): staging-pages/Kairali Cleansing Centre _ Best Ayurvedic Hospital Kerala.html
//   phone (under 700px):    staging-pages/(none)
// converted by scripts/dc_convert.py (staging.html, staging.mobile.html,
// meta.json), then corrected by scripts/edits/kairali-cleansing-centre.json. Every change is
// logged in docs/changes/kairali-cleansing-centre.md.
import DcPage, { dcMetadata } from "../../components/dc/DcPage";
import meta from "./meta.json";

const dir = "kairali-cleansing-centre.html";

export const metadata = dcMetadata(meta);

export default function Page() {
  return <DcPage meta={meta} dir={dir} />;
}
