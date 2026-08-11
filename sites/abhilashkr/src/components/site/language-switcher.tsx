"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hrefFor, LOCALES, pageKeyForPath, type Locale } from "@/lib/i18n";

/**
 * Real English, German and French route switcher. It preserves the current
 * page's semantic equivalent through the central route map; an untranslated
 * essay intentionally falls back to the English writing index.
 */

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const pageKey = pageKeyForPath(pathname);

  return (
    <nav
      aria-label="Language"
      data-locale-switcher
      className="flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase"
    >
      {LOCALES.map((targetLocale, idx) => (
        <React.Fragment key={targetLocale}>
          {idx > 0 && <span className="text-border">/</span>}
          <Link
            href={hrefFor(targetLocale, pageKey)}
            hrefLang={targetLocale}
            lang={targetLocale}
            aria-current={locale === targetLocale ? "page" : undefined}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center transition-colors ${
              locale === targetLocale
                ? "text-primary font-bold"
                : "text-ink-muted hover:text-ink"
            }`}
            aria-label={`Switch language to ${targetLocale.toUpperCase()}`}
          >
            {targetLocale.toUpperCase()}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}
