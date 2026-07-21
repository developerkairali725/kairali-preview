// FIXTURE — the NEGATION CORPUS. Every line here is real, honest copy from this
// repo. If a rule change makes any of it fail, the RULE is wrong, not the copy
// (MASTER_PIPELINE §0.6: a lint that punishes our best sentence teaches everyone
// to ignore it). Verbatim from sites/whatisayurveda.com.
import Link from "next/link";

export const EMAIL = "info@kairali.com";
export const WHATSAPP_URL = "https://wa.me/919289838797"; // Priya = the Chatbase AI ASSISTANT, NOT a physician
// (Abilash confirmed 15 Jul 2026). NEVER label this "ask a doctor" — on a YMYL
// health site that is a false medical claim. Disclose it as an AI assistant.
// The known-bad number is +91 92898 38777; the locked fact is +91 92898 38797.
// Neither this comment nor the one above is a violation: a comment explaining a
// ban is how the ban survives contact with the next engineer.

/* The previous code hardcoded `REVIEWED = "2026-07-14"` and stamped EVERY page —
   byline AND MedicalWebPage `lastReviewed` JSON-LD — under Dr. Deepu John's
   named BAMS credential, for reviews that never happened. The promise "every
   health page is physician-reviewed" is arithmetically undeliverable across
   ~3,400 pages by one doctor. */

// A launch date is not a medical claim.
const LAUNCH_DATE = "2026-07-14";

// Network counts render from @kairali/facts — the constants-rendered form is
// the CORRECT shape and must always pass the locked-count rule. "six doors"
// (a different noun; count corrected five→six 21 Jul, RPT-20260721-DEEPC
// C-SC-01) and digit-boundary neighbours like "195 countries" must
// never trip a countries/centres count ban. (Fixtures are scanned as text,
// never compiled, so the import below needs no resolution.)
import { CENTRES_COUNT, COUNTRIES_PHRASE } from "@kairali/facts";
export const NETWORK_LINE = `${CENTRES_COUNT} treatment centres across ${COUNTRIES_PHRASE}`;
export const SUMMARY = "One family, six doors: hospital, products, centres, training, Villa Raag, franchise.";
// The ruled 1908 split (21 Jul): family practice since 1908, manufacturing
// since 1948 — the corrected bulk-site forms must always pass.
export const HERITAGE = "A family practising Ayurveda since 1908 — manufacturing since 1948.";
export const LEDGER = "Four generations practising Ayurveda since 1908; Ayurvedic manufacturing since 1948.";
export const TRIVIA = "Ayurveda is practised in 195 countries today.";

// A regex literal containing `//` must not eat the rest of this line: /\/\//g
const PROTOCOL_RELATIVE = /^\/\//;

export function SiteFooter() {
  return (
    <footer>
      <p>
        Health pages reviewed by one of our Ayurvedic physicians are marked with
        that doctor&apos;s name and the date they approved it. For learning, not
        medical advice.
      </p>
      <p>
        Not every page is reviewed by a physician, and we say so on the ones that
        are not. We do not claim every page is reviewed.
      </p>
      {/* The truthed trust-strip tile (20 Jul 2026): the per-page rule stated as
          fact — participle-first, no quantifier. Must always pass. */}
      <p>Physician-Reviewed: Reviewed pages carry the doctor&apos;s name and date.</p>
      <ul>
        <li><a href={`mailto:${EMAIL}`} data-cta="email_click">{EMAIL}</a></li>
        <li><a href={WHATSAPP_URL} data-cta="whatsapp_click">WhatsApp +91 92898 38797</a></li>
        <li><Link href="/about">Medically reviewed by Dr. Deepu John (BAMS)</Link></li>
      </ul>
      <p>
        The information on whatisayurveda.com is educational and is not a
        substitute for professional medical advice, diagnosis, or treatment.
        Ayurvedic therapies and herbs should be used under the guidance of a
        qualified physician. Always consult a doctor before starting any
        treatment. Launched {LAUNCH_DATE}. {String(PROTOCOL_RELATIVE)}
      </p>
      <p>
        {/* The ruled 1908 forms (D-1908 / D-ROLLING-NUMBER): lineage-attached
            prose and a COMPUTED copyright year are the correct shapes. */}
        Kairali Ayurvedic Group · A family tradition since 1908 — founded 1989;
        a family practising Ayurveda since 1908. ©{" "}
        {new Date().getFullYear()} Kairali Ayurvedic Group.
      </p>
    </footer>
  );
}
