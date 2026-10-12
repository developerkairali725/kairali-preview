// N08: keep the accepted Package/Panchakarma locale titles after imported views write their English helmet.
const PATHS = new Set(['/ayurvedic-treatment-packages.html', '/panchkarma-treatment.html']);
const LOCALES = new Set(['hi','de','fr','es','it','pt','nl','ru','ar','zh-Hans','ja','ko']);
export function reviewedTitleFor(path, locale, title) {
  return PATHS.has(path) && LOCALES.has(locale) && typeof title === 'string' && title.trim() ? title : undefined;
}
// Self-contained: boot.ts injects this function into its existing head-mutation guard.
export function restoreReviewedHead(doc, title, canonical) {
  if (typeof title !== 'string' || !title.trim()) return false;
  let changed = false;
  let node = doc.head.querySelector('title');
  if (!node) { node = doc.createElement('title'); node.textContent = title; doc.head.appendChild(node); changed = true; }
  else if (node.textContent !== title) { node.textContent = title; changed = true; }
  if (typeof canonical === 'string' && canonical.startsWith('https://ayurvedichealingvillage.com/')) {
    let link = doc.head.querySelector('link[rel="canonical"]');
    if (!link) { link = doc.createElement('link'); link.setAttribute('rel', 'canonical'); link.setAttribute('href', canonical); doc.head.appendChild(link); changed = true; }
    else if (link.getAttribute('href') !== canonical) { link.setAttribute('href', canonical); changed = true; }
  }
  return changed;
}
