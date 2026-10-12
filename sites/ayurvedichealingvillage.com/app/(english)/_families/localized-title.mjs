// N08: keep the accepted Package/Panchakarma locale titles after imported views write their English helmet.
const PATHS = new Set(['/ayurvedic-treatment-packages.html', '/panchkarma-treatment.html']);
const LOCALES = new Set(['hi','de','fr','es','it','pt','nl','ru','ar','zh-Hans','ja','ko']);
export function reviewedTitleFor(path, locale, title) {
  return PATHS.has(path) && LOCALES.has(locale) && typeof title === 'string' && title.trim() ? title : undefined;
}
// Self-contained: boot.ts injects this function into its existing head-mutation guard.
export function restoreReviewedTitle(doc, title) {
  if (typeof title !== 'string' || !title.trim()) return false;
  let node = doc.head.querySelector('title');
  if (!node) { node = doc.createElement('title'); node.textContent = title; doc.head.appendChild(node); return true; }
  if (node.textContent === title) return false;
  node.textContent = title;
  return true;
}
