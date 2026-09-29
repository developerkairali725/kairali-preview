// /lp/ayurvedic-hospital-kerala/ — layout and copy from the saved staging page; see content.ts.
import LpPage from "../../../components/lp/LpPage";
import { lpMetadata } from "../../../lib/lp-metadata";
import content from "./content";

export const metadata = lpMetadata(content);

export default function Page() {
  return <LpPage content={content} />;
}
