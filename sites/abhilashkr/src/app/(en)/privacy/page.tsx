import type { Metadata } from "next";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacy Notice | Abhilash K. Ramesh",
  description: "How optional analytics and contact enquiries are handled on abhilashkr.com.",
  alternates: alternatesFor("privacy"),
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Site notice</p>
      <h1 className="mt-4 font-display text-5xl text-ink">Privacy</h1>
      <div className="mt-10 space-y-8 font-sans leading-relaxed text-ink-muted">
        <section>
          <h2 className="font-display text-2xl text-ink">Optional analytics</h2>
          <p className="mt-2">
            Google Analytics is disabled until you select “Allow analytics”. If enabled, Google
            may process device, browser, approximate location and page-interaction data and may
            set analytics cookies. Selecting “Necessary only” keeps analytics disabled. Your
            choice is stored in this browser.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">Contact enquiries</h2>
          <p className="mt-2">
            The contact form prepares an email in your own email application. The website does
            not submit the form to a database. Any email you send is handled by the receiving
            organisation for the purpose of responding to your enquiry.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">Contact</h2>
          <p className="mt-2">
            Questions about this website may be sent to{" "}
            <a className="underline underline-offset-4" href="mailto:info@kairali.com">
              info@kairali.com
            </a>
            .
          </p>
        </section>
        <p className="font-mono text-xs uppercase tracking-widest">Last updated: 10 August 2026</p>
      </div>
    </article>
  );
}
