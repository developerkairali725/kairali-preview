// N08: keep the accepted reviewed programme and training locale titles after imported views write their English helmet.
const PATHS = new Set(["/ananda-lahari-yoga-and-ayurveda-retreat/", "/archive-yoga-retreat/", "/ashtanga-yoga-and-ayurveda-retreat/", "/all-programs/", "/ayurveda-training-programme/", "/ayurvedic-treatment-packages.html", "/panchkarma-treatment.html", "/weight-loss-programme/", "/digestive-wellness-gut-health-yoga-therapy/", "/holistic-treatment-for-rejuvenation-and-detoxification/", "/treatment-for-bronchial-diseases/", "/treatment-for-hypertension/", "/treatment-for-paralysis/", "/treatment-for-skin-diseases/", "/personalized-customized-healing-program/", "/advanced-ayurveda-lifestyle-consultant-and-therapist-training-program-kerala-aalct-hv/", "/intensive-ayurveda-training-program-learn-practice-ayurveda/", "/level-one-advance-ayurveda-training-program-for-wellness-professionals-kerala-aatp-1-hv/", "/new-to-yoga-teacher-training/", "/one-day-ayurveda-workshop-program-kerala/", "/three-day-short-term-ayurveda-certificate-program-tap-hv/"]);
const LOCALES = new Set(['hi','de','fr','es','it','pt','nl','ru','ar','zh-Hans','ja','ko']);
// The archive catalogue already has approved localized OG headings but no title field.
// Reuse that accepted wording only for this reviewed archive route.
export function reviewedCatalogueTitle(path, metadata) {
  return metadata?.title ?? (path === '/archive-yoga-retreat/' ? metadata?.ogTitle : undefined);
}
export function reviewedTitleFor(path, locale, title) {
  return PATHS.has(path) && LOCALES.has(locale) && typeof title === 'string' && title.trim() ? title : undefined;
}
// Self-contained: boot.ts injects this function into its existing head-mutation guard.
export function restoreReviewedHead(doc, title, canonical) {
  let changed = false;
  if (typeof title === 'string' && title.trim()) {
    let node = doc.head.querySelector('title');
    if (!node) { node = doc.createElement('title'); node.textContent = title; doc.head.appendChild(node); changed = true; }
    else if (node.textContent !== title) { node.textContent = title; changed = true; }
  }
  if (typeof canonical === 'string' && canonical.startsWith('https://ayurvedichealingvillage.com/')) {
    let link = doc.head.querySelector('link[rel="canonical"]');
    if (!link) { link = doc.createElement('link'); link.setAttribute('rel', 'canonical'); link.setAttribute('href', canonical); doc.head.appendChild(link); changed = true; }
    else if (link.getAttribute('href') !== canonical) { link.setAttribute('href', canonical); changed = true; }
  }
  return changed;
}
