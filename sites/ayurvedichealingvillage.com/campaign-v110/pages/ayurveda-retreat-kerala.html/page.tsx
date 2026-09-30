// /ayurveda-retreat-kerala.html — Batch A. Layout and copy: the saved staging pages
//   desktop (700px and up): staging-pages/Luxury Ayurveda Retreat in Kerala _ Kairali Healing Village.html
//   phone (under 700px):    staging-pages/(none)
// converted by scripts/dc_convert.py (staging.html, staging.mobile.html,
// meta.json), then corrected by scripts/edits/ayurveda-retreat-kerala.json. Every change is
// logged in docs/changes/ayurveda-retreat-kerala.md.
import DcPage, { dcMetadata } from "../../components/dc/DcPage";
import meta from "./meta.json";

const dir = "ayurveda-retreat-kerala.html";

export const metadata = dcMetadata(meta);

export default function Page() {
  return <DcPage meta={meta} dir={dir} />;
}
