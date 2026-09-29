// /offers/new/ — the offers index (manifest row 15). One card per offer page,
// using only that offer's own title and the first sentence of its own meta
// description, linked to its route. The shared enquiry form is the #consult
// target of the header, mobile bar and cards.
import type { Metadata } from "next";
import EnquiryForm from "../../../components/EnquiryForm";
import PageShell from "../../../components/PageShell";
import s from "../../../components/lp/lp.module.css";
import { ENQUIRY_ID } from "../../../lib/site";
import defence from "../defence-and-paramilitary/meta.json";
import olympics from "../olympics-and-paralympics-offer/meta.json";
import senior from "../senior-citizen-offer/meta.json";

const OFFERS = [defence, olympics, senior].map((m) => ({
  href: m.route,
  title: m.head.title,
  line: (m.head.description ?? "").split(/(?<=\.)\s/)[0],
}));

const CANONICAL = "https://ayurvedichealingvillage.com/offers/new/";

export const metadata: Metadata = {
  title: "Offers",
  alternates: { canonical: CANONICAL },
  openGraph: { title: "Offers", url: CANONICAL, siteName: "Kairali – The Ayurvedic Healing Village", type: "website" },
};

export default function OffersIndex() {
  return (
    <PageShell>
      <section className={s.section} aria-labelledby="offers-title">
        <div className="container">
          <h1 id="offers-title">Offers</h1>
          <ul className={s.stepGrid}>
            {OFFERS.map((o) => (
              <li key={o.href} className={s.stepCard}>
                <h2 className={s.offerTitle}>
                  <a href={o.href}>{o.title}</a>
                </h2>
                <p>{o.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section id={ENQUIRY_ID} className={`${s.section} ${s.alt}`} aria-label="Enquiry">
        <div className="container">
          <div className={s.formWrap}>
            <EnquiryForm
              pagePath="/offers/new/"
              whatsappText="Hello, I would like to enquire about Kairali's offers (/offers/new/)."
              headingLevel={2}
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
