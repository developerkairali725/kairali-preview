import { extra, type Page } from "@/lib/content";
import DownloadFilters from "./DownloadFilters";
import Prose from "./Prose";

export type Edition = { language?: string; currency: string; edition?: string; validity?: string; url: string; size?: string; label?: string; bytes?: number; period?: string; rates?: boolean; format?: string };
export type Collection = { id: string; property: string; propertyName?: string; title: string; status: "current" | "earlier"; editions: Edition[] };
const PROPERTY: Record<string, string> = { ahv: "The Ayurvedic Healing Village", "villa-raag": "Villa Raag", kappl: "Kairali Ayurvedic Products", centres: "Kairali Ayurvedic Centres", group: "Kairali Ayurvedic Group" };

// Source page (download-centre.aspx) copy is kept; the library below replaces its flat link list.
export default function DownloadCentre({ page }: { page: Page }) {
  const d = extra<{ portal: string; checked: string; current: Collection[]; earlier: Collection[] }>("downloads.json");
  const all = [...d.current, ...d.earlier].map((c) => ({ ...c, propertyName: c.propertyName || PROPERTY[c.property] || c.property }));
  const intro = page.sections.filter((s) => !s.form);
  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="container stack" style={{ gap: 40 }}>
        {intro.length > 0 && <details className="card"><summary style={{ cursor: "pointer", fontWeight: 500, minHeight: 44, display: "flex", alignItems: "center" }}>Downloads list as previously published on kairali.com</summary>{intro.map((s, i) => <Prose key={i} html={s.html} className="wide" />)}</details>}
        <DownloadFilters collections={all} portal={d.portal} checked={d.checked} />
      </div>
    </section>
  );
}
