// FIXTURE — the CTA exactly as it shipped on every article of whatisayurveda.com
// before DECISIONS.md 15 Jul 18:31:07 ruled it a FALSE MEDICAL CLAIM. The href
// reaches the Priya Chatbase AI assistant. Never copy this.
import Link from "next/link";

const WHATSAPP_URL = "https://wa.me/919289838797";

export default function Page() {
  return (
    <main>
      {/* The sticky CTA as it was: a bot, labelled as a doctor. */}
      <div className="sticky-cta">
        <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_click">
          Ask an Ayurvedic doctor
        </a>
      </div>

      {/* An arrow function in the attrs — the `>` in `=>` must not break parsing. */}
      <a href={WHATSAPP_URL} onClick={() => track("cta")}>Talk to our physicians now</a>

      {/* The claim hidden in aria-label rather than the visible text. */}
      <a href={WHATSAPP_URL} aria-label="Ask a doctor on WhatsApp">
        <WhatsAppIcon />
      </a>

      {/* A literal href, no binding to resolve. */}
      <Link href="https://wa.me/919289838797" title="Speak to a clinician">Chat</Link>
    </main>
  );
}
