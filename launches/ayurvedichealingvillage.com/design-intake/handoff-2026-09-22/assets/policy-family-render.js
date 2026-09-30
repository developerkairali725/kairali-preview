// AHV T09 legal-policy family — shared prototype renderer (Desktop + Mobile readers).
// Renders source-exact body trees from assets/policy-family-data.js; applies the per-route head contract
// (prototype binding only — the future Next.js implementation must emit these server-side per route).
(function () {
  const A = 'https://ayurvedichealingvillage.com';
  const DEFAULT_ROUTE = '/cancellation-and-refund-policy/';

  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || DEFAULT_ROUTE;
    const D = window.AHV_POLICY || { routes: [] };
    return D.routes.find(r => r.path === want || r.slug === want || r.path === '/' + want.replace(/^\/|\/$/g, '') + '/') || D.routes[0] || null;
  }

  function decodeEntities(s) { return String(s || '').replace(/&amp;/g, '&').replace(/&#039;/g, '’').replace(/&quot;/g, '"'); }

  function styles(tag, mobile, first) {
    const serif = "'Marcellus',serif";
    switch (tag) {
      case 'p': return { margin: '0 0 18px', fontSize: '17.5px', lineHeight: 1.7, color: '#2A2118', textWrap: 'pretty' };
      case 'h2': return { fontFamily: serif, fontWeight: 400, fontSize: mobile ? '25px' : 'clamp(25px,2.2vw,30px)', lineHeight: 1.25, margin: first ? '0 0 14px' : '40px 0 14px', color: '#2A2118', textWrap: 'balance', scrollMarginTop: '96px' };
      case 'h3': return { fontFamily: serif, fontWeight: 400, fontSize: '22px', lineHeight: 1.3, margin: first ? '0 0 10px' : '28px 0 10px', color: '#2A2118', scrollMarginTop: '96px' };
      case 'h4': return { fontWeight: 700, fontSize: '18px', lineHeight: 1.4, margin: first ? '0 0 8px' : '22px 0 8px', color: '#2A2118', scrollMarginTop: '96px' };
      case 'ul': return { margin: '0 0 18px', padding: '0 0 0 26px', listStyle: 'disc' };
      case 'ol': return { margin: '0 0 18px', padding: '0 0 0 28px', listStyle: 'decimal' };
      case 'li': return { margin: '0 0 8px', fontSize: '17.5px', lineHeight: 1.7, color: '#2A2118', textWrap: 'pretty' };
      case 'strong': return { fontWeight: 700 };
      case 'em': return { fontStyle: 'italic' };
      case 'a': return { color: '#006038', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 600 };
      default: return undefined;
    }
  }

  function renderTree(node, key, ctx, inHeading) {
    if (node.k === 't') return node.v;
    const tag = node.tag;
    const props = { key };
    const st = Object.assign({}, styles(tag, ctx.mobile, ctx.first) || {});
    if (tag === 'strong' && inHeading) st.fontWeight = 'inherit'; // Marcellus has no bold face; structure kept, no faux-bold
    if (tag === 'ul' && inHeading === 'li') st.margin = '8px 0 4px';
    if (node.attrs) {
      if (node.attrs.id) props.id = node.attrs.id;
      if (node.attrs.href) {
        const h = node.attrs.href;
        if (/^mailto:/i.test(h)) { props.href = h; }
        else if (h.startsWith('/')) { props.href = A + h; props.onClick = ctx.guard; }
        else { props.href = h; props.rel = 'noopener'; }
      }
      ['start', 'type', 'reversed'].forEach(k => { if (node.attrs[k] != null) props[k] = node.attrs[k]; });
    }
    if (Object.keys(st).length) props.style = st;
    const heading = /^h[2-4]$/.test(tag) ? true : (tag === 'li' ? 'li' : inHeading);
    const kids = (node.c || []).map((c, i) => renderTree(c, key + '-' + i, Object.assign({}, ctx, { first: false }), heading));
    return React.createElement(tag, props, ...kids);
  }

  // Groups consecutive li blocks by their list ancestry (sourceTreePath) — separate lists stay separate,
  // ol stays ol, nested ancestors nest. Returns an array of React elements in source order.
  function renderBody(R, opts) {
    const guard = opts.guard, mobile = !!opts.mobile;
    const out = [];
    let open = null; // { path, el: {tag, attrs, items: []}, stack }
    const flushList = () => { if (open) { out.push(buildList(open.root, 'L' + open.root.path)); open = null; } };
    const buildList = (L, key) => React.createElement(L.tag, Object.assign({ key, style: styles(L.tag, mobile) }, numbering(L.attrs)), ...L.items.map((it, i) => {
      if (it.sub) { return React.createElement('li', { key: key + '-' + i, style: styles('li', mobile) }, ...it.children, buildList(it.sub, key + '-' + i + 's')); }
      return it.el;
    }));
    const numbering = (attrs) => { const o = {}; ['start', 'type', 'reversed'].forEach(k => { if (attrs && attrs[k] != null) o[k] = attrs[k]; }); return o; };
    let first = true;
    R.blocks.forEach((blk, bi) => {
      const ctx = { guard, mobile, first: first && bi === 0 };
      if (blk.la && blk.la.length) {
        const rootA = blk.la[0];
        if (!open || open.root.path !== rootA.path) { flushList(); open = { root: { path: rootA.path, tag: rootA.tag, attrs: rootA.attrs, items: [] } }; }
        // descend nested ancestors (depth > 1)
        let target = open.root;
        for (let d = 1; d < blk.la.length; d++) {
          const anc = blk.la[d];
          let last = target.items[target.items.length - 1];
          if (!last) { last = { children: [], sub: null }; target.items.push(last); }
          if (!last.sub || last.sub.path !== anc.path) {
            if (last.el) { last = { children: last.el.props.children ? [].concat(last.el.props.children) : [], sub: null }; target.items[target.items.length - 1] = last; }
            last.sub = { path: anc.path, tag: anc.tag, attrs: anc.attrs, items: [] };
          }
          target = last.sub;
        }
        const el = renderTree(blk.tree, 'b' + blk.p, ctx, false);
        target.items.push({ el: React.cloneElement(el, { 'data-pos': blk.p }) });
      } else {
        flushList();
        const el = renderTree(blk.tree, 'b' + blk.p, ctx, false);
        const extra = { 'data-pos': blk.p };
        if (/^h[2-4]$/.test(blk.tag) && !el.props.id) extra.id = 'b' + blk.p;
        out.push(React.cloneElement(el, extra));
        first = false;
      }
    });
    flushList();
    return out;
  }

  function contents(R) {
    return R.blocks.filter(b => b.tag === 'h2').map(b => ({ id: (b.tree.attrs && b.tree.attrs.id) || ('b' + b.p), label: b.text }));
  }

  // Prototype head binding. Emits ONLY tags present in the source record; canonical is omitted when the
  // source has none (two noindex routes). Future Next.js metadata contract must reproduce this per route.
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
    // A route that carries its own governed BreadcrumbList emits it as a second ld+json; routes without the
    // field emit exactly what they emitted before.
    if (R.breadcrumbSchemaExpected) { const bc = add('script', { type: 'application/ld+json' }); bc.textContent = JSON.stringify(R.breadcrumbSchemaExpected); }
    const s = add('script', { type: 'application/ld+json' });
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'WebPage', '@id': A + R.path, url: A + R.path, name: M.title, description: M.description, isPartOf: { '@id': A + '/#website' }, inLanguage: M.htmlLang || 'en-US' }, { '@type': 'WebSite', '@id': A + '/#website', url: A + '/', name: 'Ayurvedic Healing Village', inLanguage: 'en-US' }] });
  }

  window.AHV_POLICY_RENDER = { resolveRoute, renderBody, contents, applyHead, A, DEFAULT_ROUTE, routeOptions: () => (window.AHV_POLICY ? window.AHV_POLICY.routes.map(r => r.path) : []) };
})();
