// AHV T10 confirmation family — shared prototype helpers (Desktop + Mobile readers). No analytics, no network, no submission.
(function () {
  const A = 'https://ayurvedichealingvillage.com';
  const DEFAULT_ROUTE = '/thanks/';
  function resolveRoute(propRoute) {
    // The route prop comes from the released manifest; a public query cannot change a confirmation family.
    let q = null; try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = propRoute || q || DEFAULT_ROUTE; const D = window.AHV_CONFIRM || { routes: [] };
    const route = D.routes.find(r => r.path === want || r.slug === want) || D.routes.find(r => r.path === DEFAULT_ROUTE) || null;
    const receipt = window.AHV_LEAD_RECEIPT && window.AHV_LEAD_RECEIPT.consume(location.pathname);
    return receipt ? window.AHV_LEAD_RECEIPT.personalize(route, receipt, D.images) : route;
  }
  // Only the one-use marker set after /api/lead/ acknowledges storage can show receipt state.
  // Query strings, direct visits and refreshes never establish a submission.
  function resolveReceipt() {
    return !!(window.AHV_LEAD_RECEIPT && window.AHV_LEAD_RECEIPT.current());
  }
  function decode(s) { return String(s || '').replace(/&#8217;/g, '’').replace(/&hellip;/g, '…').replace(/&amp;/g, '&'); }
  function applyHead(R) {
    const d = document, H = d.head, M = R.metadata;
    [...H.querySelectorAll('[data-ahv-head]')].forEach(n => n.remove());
    const add = (tag, attrs) => { const el = d.createElement(tag); Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); el.setAttribute('data-ahv-head', ''); H.appendChild(el); return el; };
    d.title = M.title; d.documentElement.lang = M.htmlLang || 'en-US';
    if (M.description) add('meta', { name: 'description', content: M.description });
    if (M.canonical) add('link', { rel: 'canonical', href: M.canonical });
    add('meta', { name: 'robots', content: M.robots });
    const og = M.og;
    add('meta', { property: 'og:locale', content: og.locale }); add('meta', { property: 'og:type', content: og.type }); add('meta', { property: 'og:title', content: og.title });
    if (og.description) add('meta', { property: 'og:description', content: decode(og.description) });
    add('meta', { property: 'og:url', content: og.url }); add('meta', { property: 'og:site_name', content: og.siteName });
    if (og.image) { add('meta', { property: 'og:image', content: og.image.url }); if (og.image.width) add('meta', { property: 'og:image:width', content: og.image.width }); if (og.image.height) add('meta', { property: 'og:image:height', content: og.image.height }); if (og.image.type) add('meta', { property: 'og:image:type', content: og.image.type }); }
    if (M.twitter && M.twitter.card) add('meta', { name: 'twitter:card', content: M.twitter.card });
    // Governed BreadcrumbList, exactly as the route record specifies; records without a chain emit none.
    if (R.breadcrumbSchemaExpected) { const bcs = add('script', { type: 'application/ld+json' }); bcs.textContent = JSON.stringify(R.breadcrumbSchemaExpected); }
    const s = add('script', { type: 'application/ld+json' });
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'WebPage', '@id': A + R.path, url: A + R.path, name: M.title, isPartOf: { '@id': A + '/#website' }, inLanguage: 'en-US' }, { '@type': 'WebSite', '@id': A + '/#website', url: A + '/', name: 'Ayurvedic Healing Village', inLanguage: 'en-US' }] });
  }
  window.AHV_CONFIRM_RENDER = { resolveRoute, resolveReceipt, applyHead, A, DEFAULT_ROUTE };
})();
