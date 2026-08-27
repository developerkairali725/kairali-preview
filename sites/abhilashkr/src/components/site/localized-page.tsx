import Image from "next/image";
import Link from "next/link";

import { ZariRule } from "@/components/ui/ledger";
import { hrefFor, type LocalizedLocale, type PageKey } from "@/lib/i18n";
import { LOCALIZED_CONTENT, type LocalizedImage } from "@/lib/localized-content";
import { SITE_URL } from "@/lib/config";

type LocalizedPageProps = {
  locale: LocalizedLocale;
  pageKey: PageKey;
};

type ImageAspect = "portrait" | "square" | "wide" | "landscape";

const imageAspectClasses: Record<ImageAspect, string> = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  landscape: "aspect-[3/2]",
};

function FramedImage({
  image,
  aspect,
  priority = false,
  monochrome = false,
  sizes,
}: {
  image: LocalizedImage;
  aspect: ImageAspect;
  priority?: boolean;
  monochrome?: boolean;
  sizes: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden border border-border bg-card p-1 ${imageAspectClasses[aspect]}`}>
      <div className="relative size-full overflow-hidden border border-primary/20">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${monochrome ? "grayscale transition-all duration-700 ease-in-out hover:grayscale-0" : ""}`}
          style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
        />
      </div>
      <span aria-hidden="true" className="absolute left-0 top-0 size-3 border-l border-t border-primary" />
      <span aria-hidden="true" className="absolute right-0 top-0 size-3 border-r border-t border-primary" />
      <span aria-hidden="true" className="absolute bottom-0 left-0 size-3 border-b border-l border-primary" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 size-3 border-b border-r border-primary" />
    </div>
  );
}

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
        <div className={content.heroImage ? "grid grid-cols-1 items-center gap-10 lg:grid-cols-12" : ""}>
          <header className={`flex max-w-3xl flex-col space-y-4 ${content.heroImage ? "lg:col-span-7" : ""}`}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
              {content.eyebrow}
            </p>
            <h1 className="font-display text-4xl italic leading-tight text-ink md:text-6xl">
              {content.title}
            </h1>
            <p className="font-sans text-base leading-relaxed text-ink-muted">{content.intro}</p>
          </header>

          {content.heroImage ? (
            <div className="mx-auto w-full max-w-sm lg:col-span-5">
              <FramedImage
                image={content.heroImage}
                aspect={content.heroImage.aspect}
                priority
                monochrome
                sizes="(max-width: 1024px) 100vw, 400px"
              />
            </div>
          ) : null}
        </div>

        {content.bannerImage ? (
          <div className="mt-12">
            <FramedImage
              image={content.bannerImage}
              aspect="wide"
              priority={pageKey === "speaking"}
              monochrome={pageKey === "speaking"}
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        ) : null}

        <ZariRule className="my-12" />

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-label={content.title}>
          {content.sections.map((section) => {
            const isExternal = section.link?.href.startsWith("http");
            return (
              <article key={section.title} className="flex min-h-56 flex-col border border-border bg-card p-6">
                {section.images ? (
                  <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {section.images.map((image, index) => (
                      <div
                        key={image.src}
                        className={section.images?.length === 3 && index === 0 ? "md:col-span-2" : ""}
                      >
                        <FramedImage
                          image={image}
                          aspect="landscape"
                          sizes="(max-width: 768px) 100vw, 480px"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
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
