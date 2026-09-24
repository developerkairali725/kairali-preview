/** Refresh only the footer slots sourced from the live yearNow binding.
 * Historical dates, tariffs and review dates must remain untouched.
 */
export function computedFooterYear(html: string, year = new Date().getFullYear()): string {
  return html.replace(/((?:©|\b1908)\s*(?:[—–-]\s*)?<span class="sc-interp"(?: data-dc-computed="yearNow")?>)(?:19|20)\d{2}(<\/span>)/g,
    (_match, open: string, close: string) => `${open.replace('class="sc-interp">', 'class="sc-interp" data-dc-computed="yearNow">')}${year}${close}`);
}
