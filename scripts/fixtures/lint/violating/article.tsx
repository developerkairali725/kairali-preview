// FIXTURE — every string in this file is a real failure we shipped. Never copy it.
// It is the regression corpus for scripts/banned-string-lint.mjs.
import Link from "next/link";

// Failure #5, verbatim shape: a build-time constant emitted as lastReviewed
// under a named BAMS physician on every page, for reviews that never happened.
const REVIEWED = "2026-07-14";

// Not a medical claim — a launch date. This line MUST NOT be flagged.
const LAUNCH_DATE = "2026-07-14";

export const WHATSAPP_URL = "https://wa.me/919289838777";

// The emitted JSON-LD shape: a literal review date bound to a review key in
// code asserts a review no physician performed.
const schema = { "@type": "MedicalWebPage", lastReviewed: "2026-07-14" };

export function Article({ page }: { page: { title: string } }) {
  return (
    <article>
      <h1>{page.title}</h1>
      <p>Every health page is reviewed by a registered Ayurvedic physician before it is published.</p>
      <p>Reviewed by Deepu John on {REVIEWED}. Questions? Write to reservations@kairali.com.</p>
      <a className="btn" href={WHATSAPP_URL}>Ask a doctor on WhatsApp</a>
      <Link href="/contact">Call us on +91 92898 38777</Link>
      <p>Published {LAUNCH_DATE}.</p>
    </article>
  );
}
