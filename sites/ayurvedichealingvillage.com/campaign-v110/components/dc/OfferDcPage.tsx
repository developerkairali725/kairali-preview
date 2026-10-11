import DcPageCore, { type DcMeta } from "./DcPageCore";
import { offerStyles } from "./offer-styles";
export { dcMetadata } from "./DcPageCore";

// The three existing offer details use the same renderer and exact CSS, in the
// same cascade order. Inline delivery removes three blocking CSS round trips.
export default function OfferDcPage(props: { meta: DcMeta; dir: string }) {
  return <><style data-ahv-offer-styles dangerouslySetInnerHTML={{ __html: offerStyles }} /><DcPageCore {...props} /></>;
}
