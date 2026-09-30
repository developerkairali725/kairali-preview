// AHV T04 attractions family — shared prototype renderer (Desktop + Mobile readers).
// Reads assets/attractions-family-data.js; renders source-exact inline trees; applies the per-route head contract
// (prototype binding only — Next.js must emit the same head server-side per route).
(function () {
  const A = 'https://ayurvedichealingvillage.com';
  const DEFAULT_ROUTE = '/attractions-under-10kms/';

  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || DEFAULT_ROUTE;
    const D = window.AHV_ATTRACTIONS || { routes: [] };
    return D.routes.find(r => r.path === want || r.slug === want || r.path === '/' + String(want).replace(/^\/|\/$/g, '') + '/') || D.routes[0] || null;
  }

  function decodeEntities(s) { return String(s || '').replace(/&amp;/g, '&').replace(/&#039;/g, '’').replace(/&quot;/g, '"'); }

  // Inline-only renderer: p / strong / em / a inside an attraction body. Block styling is owned by the caller.
  function inline(node, key, guard, inHeading) {
    if (node.k === 't') return node.v;
    const props = { key };
    const st = {};
    if (node.tag === 'strong') st.fontWeight = inHeading ? 'inherit' : 700; // Marcellus has no bold face; structure kept
    if (node.tag === 'em') st.fontStyle = 'italic';
    if (node.tag === 'a' && node.attrs && node.attrs.href) {
      const h = node.attrs.href;
      Object.assign(st, { color: '#006038', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 600 });
      if (/^mailto:/i.test(h)) props.href = h; else if (h.startsWith('/')) { props.href = A + h; props.onClick = guard; } else { props.href = h; props.rel = 'noopener'; }
    }
    if (Object.keys(st).length) props.style = st;
    const kids = (node.c || []).map((c, i) => inline(c, key + '-' + i, guard, inHeading));
    return React.createElement(node.tag === 'p' ? React.Fragment : node.tag, node.tag === 'p' ? { key } : props, ...kids);
  }

  // Heading content (children of the source h2) — keeps <strong> wrappers without faux-bold.
  function headingContent(sec, guard) { return (sec.heading.c || []).map((c, i) => inline(c, 'h' + sec.id + '-' + i, guard, true)); }

  // Body paragraphs for one attraction, in source order. The strong-wrapped distance line keeps its <strong>.
  function bodyBlocks(sec, guard, mobile) {
    return sec.blocks.map((b, i) => {
      const isDistance = /^\s*Distance from/.test(textOf(b));
      const style = isDistance
        ? { margin: i === 0 ? 0 : '14px 0 0', fontSize: '16px', lineHeight: 1.6, color: '#5A4420', letterSpacing: '.2px' }
        : { margin: i === 0 ? 0 : '16px 0 0', fontSize: mobile ? '17px' : '17.5px', lineHeight: 1.7, color: '#2A2118', textWrap: 'pretty' };
      const props = { key: sec.id + '-p' + i, style, 'data-pos': b.p };
      if (b.standalone) props['data-source-standalone'] = 'true';
      return React.createElement('p', props, ...(b.c || []).map((c, j) => inline(c, sec.id + '-p' + i + '-' + j, guard, false)));
    });
  }
  function introBlocks(R, guard, mobile) {
    return R.intro.map((b, i) => React.createElement('p', { key: 'intro' + i, 'data-pos': b.p, style: { margin: i === 0 ? 0 : '16px 0 0', fontSize: mobile ? '18px' : 'clamp(19px,1.5vw,22px)', lineHeight: 1.65, color: '#2A2118', textWrap: 'pretty' } }, ...(b.c || []).map((c, j) => inline(c, 'intro' + i + '-' + j, guard, false))));
  }
  function textOf(n) { return n.k === 't' ? n.v : (n.c || []).map(textOf).join(''); }

  // Context navigation: 22 captured links in source order. Groups follow the source sidebar order — the first link of
  // groups 1 and 2 is itself the parent page ("In Healing Village", "In Kerala"); group 3 is the four distance pages
  // (derived label "Attractions by distance" — logged in notes/attractions-family-page.md).
  function navGroups(D, R) {
    const L = D.contextNav.map(l => ({ text: l.text, href: A + l.href, path: l.href, current: l.href === R.path }));
    return [
      { id: 'ctx-property', parent: L[0], items: L.slice(1, 8) },
      { id: 'ctx-kerala', parent: L[8], items: L.slice(9, 18) },
      { id: 'ctx-distance', label: 'Attractions by distance', items: L.slice(18, 22) }
    ];
  }

  function contents(R) { return R.sections.map(s => ({ id: s.id, label: s.title })); }

  // Prototype head binding — emits only what the source record carries (all four routes: canonical, robots index,
  // og:*, one og:image, twitter card). BreadcrumbList mirrors the governed visible chain.
  function applyHead(R) {
    const d = document; const M = R.metadata; const H = d.head;
    [...H.querySelectorAll('[data-ahv-head]')].forEach(n => n.remove());
    const add = (tag, attrs) => { const el = d.createElement(tag); Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); el.setAttribute('data-ahv-head', ''); H.appendChild(el); return el; };
    d.title = M.title;
    d.documentElement.lang = M.htmlLang || 'en-US';
    add('meta', { name: 'description', content: M.description });
    if (M.canonical) add('link', { rel: 'canonical', href: M.canonical });
    add('meta', { name: 'robots', content: M.robots });
    const og = M.openGraph || {};
    add('meta', { property: 'og:locale', content: og.locale });
    add('meta', { property: 'og:type', content: og.type });
    add('meta', { property: 'og:title', content: decodeEntities(og.title) });
    add('meta', { property: 'og:description', content: og.description });
    add('meta', { property: 'og:url', content: og.url });
    add('meta', { property: 'og:site_name', content: og.siteName });
    (og.images || []).forEach(im => { add('meta', { property: 'og:image', content: im.url }); add('meta', { property: 'og:image:width', content: im.width }); add('meta', { property: 'og:image:height', content: im.height }); add('meta', { property: 'og:image:type', content: im.type }); });
    if (M.twitter && M.twitter.card) add('meta', { name: 'twitter:card', content: M.twitter.card });
    Object.entries(M.hreflang || {}).forEach(([lang, href]) => add('link', { rel: 'alternate', hreflang: lang, href }));
    const s = add('script', { type: 'application/ld+json' });
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', '@id': A + R.path, url: A + R.path, name: M.title, description: M.description, isPartOf: { '@id': A + '/#website' }, inLanguage: M.htmlLang || 'en-US', breadcrumb: { '@id': A + R.path + '#breadcrumb' } },
      { '@type': 'BreadcrumbList', '@id': A + R.path + '#breadcrumb', itemListElement: R.breadcrumb.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.label, item: b.canonical })) },
      { '@type': 'WebSite', '@id': A + '/#website', url: A + '/', name: 'Ayurvedic Healing Village', inLanguage: 'en-US' }
    ] });
  }

  window.AHV_ATTRACTIONS_RENDER = { resolveRoute, headingContent, bodyBlocks, introBlocks, navGroups, contents, applyHead, A, DEFAULT_ROUTE, routeOptions: () => (window.AHV_ATTRACTIONS ? window.AHV_ATTRACTIONS.routes.map(r => r.path) : []) };
})();
