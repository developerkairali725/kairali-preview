// /kairali-air-india-maharaja-club.html — Batch A. Layout and copy: the saved staging pages
//   desktop (700px and up): staging-pages/Kairali x Air India Maharaja Club - Premium Kerala Ayurveda Retreat.html
//   phone (under 700px):    staging-pages/(none)
// converted by scripts/dc_convert.py (staging.html, staging.mobile.html,
// meta.json), then corrected by scripts/edits/kairali-air-india-maharaja-club.json. Every change is
// logged in docs/changes/kairali-air-india-maharaja-club.md.
import DcPage, { dcMetadata } from "../../components/dc/DcPage";
import meta from "./meta.json";

const dir = "kairali-air-india-maharaja-club.html";

export const metadata = dcMetadata(meta);

export default function Page() {
  return <DcPage meta={meta} dir={dir} />;
}
