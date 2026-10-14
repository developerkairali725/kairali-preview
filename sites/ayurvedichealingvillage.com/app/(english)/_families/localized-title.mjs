// N08: keep the accepted reviewed programme and training locale titles after imported views write their English helmet.
// N08 batch 4: home, about, yoga, archive and culinary routes already serve reviewed locale titles; the yoga package also keeps its own
// server title in English instead of the helmet its imported template carries from /yoga-meditation-program/.
const PATHS = new Set(["/", "/about-us/", "/yoga-and-meditation-package/", "/yoga-based-stress-energy-reset-program/", "/yoga-meditation-program/", "/yoga-meditation-training/", "/ayurvedic-new-year-yala-2018/", "/ayuryoga/", "/back-to-roots/", "/lakshya-yoga/", "/wellness-programs/", "/yoga-meditation-programs/", "/beauty-care-and-eye-care/", "/de-addiction-and-rehabilitation-from-alcohol-drugs-tobacco/", "/immunity-enhancement-executive-health-assessment-therapy/", "/revitalizing-and-strengthening/", "/womens-hormonal-balance-endocrine-therapy/", "/treatment-for-arthritis-and-spondylitis/", "/treatment-for-cervical-spondylosis/", "/treatment-for-chronic-back-pain/", "/treatment-for-diabetes/", "/treatment-for-facial-paralysis/", "/treatment-for-nervous-disability/", "/treatment-for-psoriasis/", "/treatment-for-sinusitis-and-migraine/", "/treatment-for-slip-disc/", "/treatment-for-spondylitis/", "/treatment-to-remove-stress-and-strain/", "/panchakarma-therapy/", "/post-pregnancy-health-programme/", "/preventive-and-regenerative-treatment/", "/panchakarma/", "/mindfulness-retreat/", "/ananda-lahari-yoga-and-ayurveda-retreat/", "/archive-yoga-retreat/", "/ashtanga-yoga-and-ayurveda-retreat/", "/all-programs/", "/ayurveda-training-programme/", "/ayurvedic-treatment-packages.html", "/panchkarma-treatment.html", "/weight-loss-programme/", "/digestive-wellness-gut-health-yoga-therapy/", "/holistic-treatment-for-rejuvenation-and-detoxification/", "/treatment-for-bronchial-diseases/", "/treatment-for-hypertension/", "/treatment-for-paralysis/", "/treatment-for-skin-diseases/", "/personalized-customized-healing-program/", "/advanced-ayurveda-lifestyle-consultant-and-therapist-training-program-kerala-aalct-hv/", "/intensive-ayurveda-training-program-learn-practice-ayurveda/", "/level-one-advance-ayurveda-training-program-for-wellness-professionals-kerala-aatp-1-hv/", "/new-to-yoga-teacher-training/", "/one-day-ayurveda-workshop-program-kerala/", "/three-day-short-term-ayurveda-certificate-program-tap-hv/"]);
const LOCALES = new Set(['hi','de','fr','es','it','pt','nl','ru','ar','zh-Hans','ja','ko']);
// The archive catalogue already has approved localized OG headings but no title field.
// Reuse that accepted wording only for this reviewed archive route.
export function reviewedCatalogueTitle(path, metadata) {
  return metadata?.title ?? (path === '/archive-yoga-retreat/' ? metadata?.ogTitle : undefined);
}
export function reviewedTitleFor(path, locale, title) {
  return PATHS.has(path) && (LOCALES.has(locale) || (['/panchakarma/', '/archive-yoga-retreat/', '/yoga-and-meditation-package/'].includes(path) && locale === 'en')) && typeof title === 'string' && title.trim() ? title : undefined;
}
// Self-contained: boot.ts injects this function into its existing head-mutation guard.
export function restoreReviewedHead(doc, title, canonical, description, shareDescription) {
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
  if (typeof description === 'string' && description.trim()) {
    let node = doc.head.querySelector('meta[name="description"]');
    if (!node) { node = doc.createElement('meta'); node.setAttribute('name', 'description'); node.setAttribute('content', description); doc.head.appendChild(node); changed = true; }
    else if (node.getAttribute('content') !== description) { node.setAttribute('content', description); changed = true; }
  }
  if (typeof shareDescription === 'string' && shareDescription.trim()) {
    for (const [attribute, key] of [['property', 'og:description'], ['name', 'twitter:description']]) {
      let node = doc.head.querySelector('meta[' + attribute + '="' + key + '"]');
      if (!node) { node = doc.createElement('meta'); node.setAttribute(attribute, key); node.setAttribute('content', shareDescription); doc.head.appendChild(node); changed = true; }
      else if (node.getAttribute('content') !== shareDescription) { node.setAttribute('content', shareDescription); changed = true; }
    }
  }
  return changed;
}
