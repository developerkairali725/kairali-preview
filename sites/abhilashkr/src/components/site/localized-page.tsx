import Link from "next/link";

import { ZariRule } from "@/components/ui/ledger";
import { hrefFor, type LocalizedLocale, type PageKey } from "@/lib/i18n";
import { LOCALIZED_CONTENT } from "@/lib/localized-content";
import { SITE_URL } from "@/lib/config";

type LocalizedPageProps = {
  locale: LocalizedLocale;
  pageKey: PageKey;
};

export function LocalizedPage({ locale, pageKey }: LocalizedPageProps) {
  const content = LOCALIZED_CONTENT[locale][pageKey];
  const isFaq = pageKey === "faq";
  const schema = isFaq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: locale,
        url: `${SITE_URL}${hrefFor(locale, pageKey)}`,
        mainEntity: content.sections.map((section) => ({
          "@type": "Question",
          name: section.title,
          acceptedAnswer: { "@type": "Answer", text: section.body },
        })),
      }
    : {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        inLanguage: locale,
        url: `${SITE_URL}${hrefFor(locale, pageKey)}`,
        mainEntity: { "@id": `${SITE_URL}/#person` },
      };

  return (
    <div className="w-full bg-background py-12 text-foreground md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto max-w-5xl px-6">
        <header className="flex max-w-3xl flex-col space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
            {content.eyebrow}
          </p>
          <h1 className="font-display text-4xl italic leading-tight text-ink md:text-6xl">
            {content.title}
          </h1>
          <p className="font-sans text-base leading-relaxed text-ink-muted">{content.intro}</p>
        </header>

        <ZariRule className="my-12" />

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-label={content.title}>
          {content.sections.map((section) => {
            const isExternal = section.link?.href.startsWith("http");
            return (
              <article key={section.title} className="flex min-h-56 flex-col border border-border bg-card p-6">
                <h2 className="font-display text-2xl italic text-ink">{section.title}</h2>
                <p className="mt-4 font-sans text-sm leading-relaxed text-ink-muted">{section.body}</p>
                {section.link ? (
                  <Link
                    href={section.link.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    data-cta={`localized-${pageKey}`}
                    className="mt-auto inline-flex min-h-11 w-fit items-center border-b border-primary pt-6 font-mono text-[10px] uppercase tracking-widest text-primary transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    {section.link.label} →
                  </Link>
                ) : null}
              </article>
            );
          })}
        </section>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href={hrefFor(locale, "contact")}
            data-cta="localized-contact"
            className="inline-flex min-h-11 items-center border border-primary bg-primary px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-background transition-colors hover:bg-transparent hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {locale === "de" ? "Kontakt aufnehmen" : "Prendre contact"}
          </Link>
          <Link
            href={hrefFor(locale, "home")}
            className="inline-flex min-h-11 items-center border border-border px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted transition-colors hover:border-primary hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {locale === "de" ? "Zur Startseite" : "Retour à l’accueil"}
          </Link>
        </div>
      </div>
    </div>
  );
}
