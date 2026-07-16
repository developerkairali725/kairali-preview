// FIXTURE — honest CTAs, verbatim from the live repo. All must PASS.
// The discrimination this gate exists to make: clinical language is FALSE on the
// bot's href and TRUE on the hospital's line. The words alone decide nothing.
import Link from "next/link";

const WHATSAPP_URL = "https://wa.me/919289838797"; // Priya, the AI assistant
const CLINIC_LINE = "tel:+914923224444"; // reaches the NABH hospital's front desk

export default function Page() {
  return (
    <main>
      {/* The honest replacement — page.tsx:130. Discloses the bot. */}
      <div className="sticky-cta" aria-label="Ask a question">
        <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_click">
          Ask Priya, our AI assistant
        </a>
      </div>

      {/* kairali.com:187 and kairalicenters.com:104 — no clinical claim. */}
      <a className="btn" href={WHATSAPP_URL} data-cta="whatsapp_click">Chat With Us on WhatsApp</a>
      <a className="btn" href={WHATSAPP_URL} data-cta="whatsapp_click">Book on WhatsApp</a>
      <a href={WHATSAPP_URL} onClick={() => track("cta")}>WhatsApp Us</a>

      {/* TRUE: this href reaches real physicians, so it may say so. A blunt
          string ban would forbid this line and would be wrong. */}
      <a href={CLINIC_LINE}>Speak to a physician</a>
      <Link href="/consultation">Book a consultation with our doctors</Link>

      {/* "consultation" on the bot's href is allowed: a human fulfils a booking. */}
      <a href={WHATSAPP_URL}>Request a consultation</a>
    </main>
  );
}
