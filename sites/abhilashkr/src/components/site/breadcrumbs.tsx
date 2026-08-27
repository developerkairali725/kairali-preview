import Link from "next/link";

import { JsonLd } from "@/components/site/json-ld";
import { SITE_URL } from "@/lib/config";
import { hrefFor, NAV_LABELS, type Locale, type PageKey } from "@/lib/i18n";
import { getPageSchema } from "@/lib/schema";

type BreadcrumbsProps = {
  locale: Locale;
  pageKey: PageKey;
  currentLabel?: string;
  currentPath?: string;
  parentKey?: PageKey;
  pageType?: "WebPage" | "ProfilePage" | "ContactPage" | "CollectionPage";
};

const ARIA_LABELS: Record<Locale, string> = {
  en: "Breadcrumb",
  de: "Brotkrümelnavigation",
  fr: "Fil d’Ariane",
};

function absoluteUrl(path: string) {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

export function Breadcrumbs({
  locale,
  pageKey,
  currentLabel,
  currentPath,
  parentKey,
  pageType,
}: BreadcrumbsProps) {
  const labels = NAV_LABELS[locale];
  const homePath = hrefFor(locale, "home");
  const pagePath = currentPath ?? hrefFor(locale, pageKey);
  const pageLabel = currentLabel ?? labels[pageKey] ?? pageKey;
  const items = [
    {
      label: labels.home ?? "Home",
      href: homePath,
      url: absoluteUrl(homePath),
    },
  ];

  if (parentKey) {
    const parentPath = hrefFor(locale, parentKey);
    items.push({
      label: labels[parentKey] ?? parentKey,
      href: parentPath,
      url: absoluteUrl(parentPath),
    });
  }

  if (pagePath !== homePath) {
    items.push({ label: pageLabel, href: pagePath, url: absoluteUrl(pagePath) });
  }

  const schema = getPageSchema({
    locale,
    pageKey,
    name: pageLabel,
    url: absoluteUrl(pagePath),
    breadcrumbItems: items.map(({ label, url }) => ({ name: label, url })),
    pageType,
  });

  return (
    <>
      <JsonLd data={schema} />
      {items.length > 1 ? (
        <nav aria-label={ARIA_LABELS[locale]} className="mb-8 font-mono text-[10px] uppercase tracking-widest">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {items.map((item, index) => {
              const isCurrent = index === items.length - 1;
              return (
                <li key={item.url} className="flex min-w-0 items-center gap-x-2">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-primary/70">
                      /
                    </span>
                  ) : null}
                  {isCurrent ? (
                    <span aria-current="page" className="break-words text-ink">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="inline-flex min-h-11 items-center text-ink-muted transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}
    </>
  );
}
