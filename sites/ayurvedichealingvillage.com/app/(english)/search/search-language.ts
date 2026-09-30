/** Search result links use the reviewed locale table and preserve query and hash. */
export function mapSearchHref(href: string, localPath: (path: string) => string | null): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const cut = href.search(/[?#]/);
  const path = cut < 0 ? href : href.slice(0, cut);
  const mapped = localPath(path);
  return mapped ? mapped + (cut < 0 ? "" : href.slice(cut)) : href;
}

/** Only codes present in l10n/locales.json can select a search index. */
export function resolveSearchLocale(raw: unknown, locales: Record<string, unknown>): string {
  return typeof raw === "string" && Object.prototype.hasOwnProperty.call(locales, raw) ? raw : "en";
}

/** Every language menu option stays on the shareable results URL. */
export function searchLanguageHref(code: string, query: string): string {
  return `/search/?lang=${encodeURIComponent(code)}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
}

/** Adapt the existing English snapshot when locale snapshots are not built. */
export function localizeFallbackChrome(
  html: string,
  code: string,
  name: string,
  localPath: (path: string) => string | null,
  translate: (text: string) => string,
): string {
  const esc = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const translated = (source: string) => {
    // The accepted catalogue uses the full navigation label for this destination.
    const key = source === "Yoga & Training" ? "Yoga & Meditation Training" : source;
    const value = translate(key);
    return value === key ? source : value;
  };
  let out = html.replace(/\bhref="([^"]*)"/g, (tag, href) => {
    const decoded = href.replace(/&amp;/g, "&");
    const mapped = mapSearchHref(decoded, localPath);
    return mapped === decoded ? tag : `href="${esc(mapped)}"`;
  });
  out = out.replace(/>([^<>]+)</g, (whole, raw) => {
    const match = /^(\s*)(.*?)(\s*)$/s.exec(raw);
    if (!match || !match[2]) return whole;
    const source = match[2].replace(/&amp;/g, "&");
    const value = translated(source);
    return value === source ? whole : `>${match[1]}${esc(value)}${match[3]}<`;
  });
  out = out.replace(/\baria-label="([^"]*)"/g, (tag, value) => {
    const changed = translated(value);
    return changed === value ? tag : `aria-label="${esc(changed)}"`;
  });
  const label = `${translate("Choose language")} — ${translate("Current language")}: ${name}`;
  out = out.replace(/(<button\b[^>]*\bclass="ahv-lang-btn"[^>]*\baria-label=")[^"]*(")/g, (_, before, after) => `${before}${esc(label)}${after}`);
  const shortCode = code.split("-")[0].toUpperCase();
  out = out.replace(/(<button\b[^>]*\bclass="ahv-lang-btn"[^>]*>[\s\S]*?<span>)EN(<\/span>)/g, (_, before, after) => `${before}${shortCode}${after}`);
  return out;
}
