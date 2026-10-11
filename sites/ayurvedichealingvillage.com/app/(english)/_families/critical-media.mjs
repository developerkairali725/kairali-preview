/** Selected image variants; only phone templates/snapshots use these. */
export function phoneCriticalMedia(html, routePath = '') {
  if (routePath === '/offers/') html = html.split('/ahv/assets/img/commercial/775c5adec97f99fbd773ee36cf4903844f79ea13635db974cf00821263818e82.webp').join('/design/offers-hub-640.avif');
  for (var name of ['weight-loss', 'weight-history']) {
    html = html.split('/ahv/assets/img/' + name + '.webp').join('/ahv/assets/img/' + name + '-768.avif');
  }
  // Snapshot repair promoted this below-fold body image; retain its authored lazy/low intent.
  if (routePath === '/weight-loss-programme/') html = html.replace(/<img\b[^>]*>/gi, function (tag) {
    var src = tag.match(/\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    if (!src || (src[1] || src[2] || src[3]) !== '/ahv/assets/img/weight-loss-768.avif') return tag;
    var attrs = tag.slice(4, -1).replace(/\s(?:loading|fetchpriority)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    return '<img loading="lazy" fetchpriority="low"' + attrs + '>';
  });
  // Generic snapshot repair also promoted this below-fold Digestive body image; retain its authored lazy/low intent.
  if (routePath === '/digestive-wellness-gut-health-yoga-therapy/') html = html.replace(/<img\b[^>]*>/gi, function (tag) {
    var src = tag.match(/\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    if (!src || (src[1] || src[2] || src[3]) !== '/ahv/assets/img/YOGA-AND-MEDITATION-benefits-min.webp') return tag;
    var attrs = tag.slice(4, -1).replace(/\s(?:loading|fetchpriority)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    return '<img loading="lazy" fetchpriority="low"' + attrs + '>';
  });
  for (var name of ['weightloss', 'digestive']) {
    html = html.split('/ahv/assets/img/' + name + '.webp').join('/ahv/assets/img/' + name + '-768-hero.avif');
  }
  for (var name of ['ktahv-abhyanga-oil-therapy-2025', 'AHV-Enquiry-Garden-Banner', 'wx-welcome', 'kt-317', 'wx-yogahall', 'kt-106']) {
    html = html.split('/ahv/assets/img/' + name + '.webp').join('/ahv/assets/img/' + name + '-768.webp');
  }
  html = html.split('/ahv/assets/img/owner-approved-20260928/ahv-img-002.webp').join('/ahv/assets/img/owner-approved-20260928/ahv-img-002-768.webp');
  return html.split('/ahv/assets/img/wx-hero.webp').join('/ahv/assets/img/wx-hero-544.avif').split('/ahv/assets/img/wx-hero-544.webp').join('/ahv/assets/img/wx-hero-544.avif')
    .split('/ahv/assets/img/ktahv-abhyanga-oil-therapy-2025-768.webp').join('/ahv/assets/img/ktahv-abhyanga-oil-therapy-2025-544.webp');
}
/** Use the existing accessible award title for descriptive rendered link text.
 * No new content or translation: the title already belongs to this exact link.
 */
export function descriptiveAwardLinks(html, route = "") {
  // An older homepage capture carried a campaign-specific label on the
  // generic enquiry CTA. Keep the actual home action and its localized name.
  if (route === "/") html = html.replace(/<a\b([^>]*)>([\s\S]*?)<[/]a>/gi, (full, attrs, body) => {
    if (!/href="(?:\/[a-zA-Z-]+)?\/(?:contact-us|enquiry-form)\/"/i.test(attrs) || !/Karkidaka/i.test(attrs + body)) return full;
    const clean = attrs.replace(/\saria-label="[^"]*"/i, "");
    return '<a' + clean + '>' + body.replace(/<span class="ahv-link-context">[\s\S]*?<[/]span>/gi, '') + '</a>';
  });
  html = html.split('aria-label="{{ g.alt }}"').join('aria-label="{{ g.caption }}" aria-description="{{ g.alt }}"');
  return html.replace(/<a\b([^>]*)>([^<>]+)<[/]a>/gi, function (full, attrs, text) {
    var label = attrs.match(/aria-label="([^"]+)"/i);
    if (!label || label[1].indexOf(text.trim() + ' — ') !== 0) return full;
    var title = label[1].slice(text.trim().length);
    return '<a' + attrs + '>' + text + '<span class="ahv-link-context">' + title + '</span></a>';
  });
}

export function firstCriticalImage(html, routePath = '') {
  // N12 measured background LCPs: prioritize the existing approved hero only on its own route.
  var programmeHeroes = {'/treatment-for-bronchial-diseases/':'/ahv/assets/img/bronchial-hero-nasyam.webp','/holistic-treatment-for-rejuvenation-and-detoxification/':'/ahv/assets/img/ho-pizhichil.webp'};
  var programmeHero = programmeHeroes[routePath];
  if (programmeHero && html.indexOf(programmeHero) >= 0) return programmeHero;
  var paths = ['/design/offers-hub-640.avif', '/ahv/assets/img/wx-hero-544.avif', '/ahv/assets/img/owner-approved-20260928/ahv-img-002-768.webp', '/ahv/assets/img/wx-hero-544.webp', '/ahv/assets/img/ktahv-abhyanga-oil-therapy-2025-544.webp', '/ahv/assets/img/AHV-Enquiry-Garden-Banner-768.webp', '/ahv/assets/img/weightloss-768-hero.avif', '/ahv/assets/img/digestive-768-hero.avif'];
  return paths.filter(function (path) { return html.indexOf(path) >= 0; }).sort(function (a, b) { return html.indexOf(a) - html.indexOf(b); })[0] || null;
}

/** Home captures put three images at high priority; only its logo and hero are above the fold. */
export function deferHomeSnapshotImages(html) {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] || "";
    if (/\/(?:kairali-colorful-logo|wx-hero(?:-544)?)\.(?:webp|avif)$/.test(src)) return tag;
    const attrs = tag.slice(4, -1).replace(/\s(?:loading|fetchpriority)=["'][^"']*["']/gi, "");
    return '<img loading="lazy" fetchpriority="low"' + attrs + '>';
  });
}

/** Thumbnail selection; the expanded villa viewer always keeps the original. Self-contained for boot injection. */
export function villaImageAttributes(src, id = "") {
  if (/^\/ahv\/assets\/img\/owner-approved-20260928\/ahv-img-002(?:-768)?\.webp$/.test(src)) return {
    srcset: '/ahv/assets/img/owner-approved-20260928/ahv-img-002-768.webp 768w, /ahv/assets/img/owner-approved-20260928/ahv-img-002.webp 1600w',
    sizes: '(max-width:699px) calc(100vw - 24px), 1600px',
  };
  if (id === "villa-expanded" || !/^\/ahv\/assets\/img\/AHV-OurVillas-(?:Hero|(?:Maharaja|Royal|Deluxe|Classic)-[0-9]+)\.webp$/.test(src)) return null;
  const base = src.slice(0, -5), hero = /-Hero\.webp$/.test(src);
  return {
    srcset: hero ? base + '-768-hero.avif 768w, ' + src + ' 1024w' : base + '-384.webp 384w, ' + base + '-768.webp 768w, ' + src + ' 1400w',
    sizes: hero ? '(max-width:699px) calc(100vw - 24px), 1024px' : '(max-width:699px) calc((100vw - 36px)/2), 320px',
  };
}
export function responsiveVillaImages(html) {
  return html.replace(/<img\b[^>]*>/gi, tag => {
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] || '';
    const id = tag.match(/\bid=["']([^"']+)["']/i)?.[1] || '';
    const attrs = villaImageAttributes(src, id);
    if (!attrs) return tag;
    const clean = tag.slice(4,-1).replace(/\s(?:srcset|sizes)=["'][^"']*["']/gi, '');
    return '<img srcset="' + attrs.srcset + '" sizes="' + attrs.sizes + '"' + clean + '>';
  });
}
