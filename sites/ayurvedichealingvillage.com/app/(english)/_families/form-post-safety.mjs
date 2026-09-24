/** Prevent pending legacy data-entry forms leaking named fields through GET or
 * posting to the old live PHP handlers before the design runtime is ready.
 * Search and the existing email-free guide-navigation fallback remain navigation.
 * This is a transport guard, not a delivery implementation or an abuse filter.
 */
export function formPostSafety(html) {
  return html.replace(/<form\b[^>]*>/gi, tag => {
    if (/\bdata-ahv-newsletter\b|\bdata-ahv-guide-form\b|\bdata-ahv-delivery-pending\b/.test(tag)) return tag;
    if (/\brole=["']search["']|\bid=["']u7-search["']/.test(tag)) return tag;
    const action = /\baction=["']([^"']*)["']/i.exec(tag)?.[1] || '';
    if (/^(?:https:\/\/(?:www\.)?ayurvedichealingvillage\.com)?\/search\/?(?:[?#]|$)/.test(action)) return tag;
    return tag.replace(/\s(?:action|method)=["'][^"']*["']/gi, '').replace(/>$/, ' action="/api/forms-unavailable" method="post" data-ahv-delivery-pending="1">');
  });
}
