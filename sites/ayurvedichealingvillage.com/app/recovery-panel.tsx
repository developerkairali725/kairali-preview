"use client";

import { useEffect, useState } from "react";

export type RecoveryLocale = {
  locale: string; prefix: string; name: string; htmlLang: string; dir: "ltr" | "rtl";
  copy: { title: string; message: string; language: string };
  links: Array<{ href: string; label: string }>;
};

export default function RecoveryPanel({ locales }: { locales: RecoveryLocale[] }) {
  const [locale, setLocale] = useState("en");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const prefix = window.location.pathname.split("/")[1];
    setLocale(locales.find((row) => row.prefix === prefix)?.locale ?? "en");
    setMounted(true);
  }, [locales]);
  const current = locales.find((row) => row.locale === locale) ?? locales[0];
  return <>
    <div id="recovery-language-control" className="language" hidden={!mounted}>
      <label id="recovery-language-label" htmlFor="recovery-language" lang={current.htmlLang} dir={current.dir}>{current.copy.language}</label>
      <select id="recovery-language" value={locale} onChange={(event) => setLocale(event.target.value)}>
        {locales.map((row) => <option key={row.locale} value={row.locale} lang={row.htmlLang}>{row.name}</option>)}
      </select>
    </div>
    {locales.map((row) => <section className="recovery" key={row.locale} data-recovery-locale={row.locale} data-current={row.locale === locale ? "" : undefined} lang={row.htmlLang} dir={row.dir}>
      <h2>{row.copy.title}</h2>
      <p>{row.copy.message}</p>
      <h3>{row.name}</h3>
      <nav aria-label={row.name}>{row.links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
    </section>)}
  </>;
}
