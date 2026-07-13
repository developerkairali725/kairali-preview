"use client";

import React from "react";

/**
 * Language switcher component — visible and built, ready for locale expansion.
 * Currently only English is available. Adding a locale requires:
 *   1. Add a translated messages file (e.g. src/messages/de.json)
 *   2. Add the locale to the LOCALES array below
 *   3. Wire next-intl or Next.js i18n routing to serve the locale
 *
 * TODO(i18n): priority languages are German and French (DACH/France audiences),
 * then optionally Japanese (Yokohama/Beppu). These ship as real translated
 * routes with human review — do NOT use Google Translate over clinical content.
 */

const LOCALES = [
  { code: "en", label: "EN", available: true },
  { code: "de", label: "DE", available: false },
  { code: "fr", label: "FR", available: false },
  // { code: "ja", label: "JA", available: false },
] as const;

export function LanguageSwitcher() {
  const currentLocale = "en"; // TODO(i18n): read from router/context when next-intl is wired

  return (
    <div className="flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase">
      {LOCALES.map((locale, idx) => (
        <React.Fragment key={locale.code}>
          {idx > 0 && <span className="text-border">/</span>}
          {locale.available ? (
            <button
              className={`cursor-pointer transition-colors ${
                currentLocale === locale.code
                  ? "text-primary font-bold"
                  : "text-ink-muted hover:text-ink"
              }`}
              aria-label={`Switch to ${locale.label}`}
              disabled={currentLocale === locale.code}
            >
              {locale.label}
            </button>
          ) : (
            <span
              className="text-ink-muted/40 cursor-not-allowed"
              title={`${locale.label} — coming soon`}
            >
              {locale.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
