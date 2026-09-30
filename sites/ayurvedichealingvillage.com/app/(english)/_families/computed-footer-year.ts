/** Refresh copyright only inside footers; historical dates and tariffs stay unchanged. */
export function computedFooterYear(html: string, year = new Date().getFullYear()): string {
  return html.replace(/(<footer\b[^>]*>)([\s\S]*?)(<\/footer>)/gi, (_match, open, body, close) => {
    const clean = body.replace(/(Ayurvedic Healing Village · Palakkad)\s*·\s*1908\s*[—–-]\s*(?:<span[^>]*>\d{4}<\/span>|\d{4})/g, "$1");
    return open + clean.replace(/(©\s*(?:(?:19|20)\d{2}\s*[—–-]\s*)?)(?:<span\b[^>]*>\s*(?:19|20)\d{2}\s*<\/span>|(?:19|20)\d{2})/g,
      (_m: string, prefix: string) => `${prefix}<span class="sc-interp" data-dc-computed="yearNow">${year}</span>`) + close;
  }).replace(/(©\s*(?:(?:19|20)\d{2}\s*[—–-]\s*)?<span class="sc-interp"(?: data-dc-computed="yearNow")?>)(?:19|20)\d{2}(<\/span>)/g,
    (_match, open, close) => `${open.replace('class="sc-interp">', 'class="sc-interp" data-dc-computed="yearNow">')}${year}${close}`);
}
