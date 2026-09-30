// AHV T04 collection/hub family — shared renderer for the seven collection datasets.
// Prototype binding only: no network, no submit, no buying/booking, no providers, no tracking.
(function () {
  const A = 'https://ayurvedichealingvillage.com';

  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || null;
    if (!want) return null;
    const D = window.AHV_COLLECTION_FAMILY;
    return D ? (D.routes.find(r => r.path === want) || null) : null;
  }

  function applyHead(R) {
    const d = document, H = d.head, M = R.metadata;
    [...H.querySelectorAll('[data-ahv-head]')].forEach(n => n.remove());
    // The host page's static head contract does not apply on a collection route; clear it first so exactly one
    // canonical, title and schema applies.
    [...H.querySelectorAll('link[rel="canonical"]:not([data-ahv-head]), meta[name="robots"]:not([data-ahv-head]), meta[name="description"]:not([data-ahv-head]), meta[property^="og:"]:not([data-ahv-head]), meta[name^="twitter:"]:not([data-ahv-head]), script[type="application/ld+json"]:not([data-ahv-head])')].forEach(n => n.remove());
    const add = (tag, attrs, text) => {
      const el = d.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => { if (v != null) el.setAttribute(k, v); });
      if (text != null) el.textContent = text;
      el.setAttribute('data-ahv-head', '');
      H.appendChild(el);
      return el;
    };
    d.title = M.title;
    d.documentElement.lang = M.htmlLang || 'en-US';
    if (M.description) add('meta', { name: 'description', content: M.description });
    add('link', { rel: 'canonical', href: R.governance.effectiveCanonical });
    add('meta', { name: 'robots', content: M.robots });
    const og = M.og;
    if (og) {
      add('meta', { property: 'og:locale', content: og.locale });
      add('meta', { property: 'og:type', content: og.type });
      add('meta', { property: 'og:title', content: og.title });
      add('meta', { property: 'og:description', content: og.description });
      add('meta', { property: 'og:url', content: og.url });
      add('meta', { property: 'og:site_name', content: og.siteName });
      if (og.image) {
        add('meta', { property: 'og:image', content: og.image.sourceUrl });
        add('meta', { property: 'og:image:width', content: og.image.width });
        add('meta', { property: 'og:image:height', content: og.image.height });
        add('meta', { property: 'og:image:type', content: og.image.type });
      }
    }
    if (M.twitter && M.twitter.card) add('meta', { name: 'twitter:card', content: M.twitter.card });
    if (R.breadcrumbSchemaExpected) {
      const s = add('script', { type: 'application/ld+json' });
      s.textContent = JSON.stringify(R.breadcrumbSchemaExpected);
    }
  }

  // Inline runs: exact source text, source emphasis, exact link destinations. Links are inert in review.
  // An anchor with no source href renders as plain text — no destination is invented.
  // asAction is set only for a source action group (a block whose own sourceClass marks it as one), so prose
  // links elsewhere are untouched.
  const ACTION_A = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '52px', padding: '0 24px', border: '1px solid #5A4420', borderRadius: '4px',
    background: '#fff', color: '#2A2118', fontFamily: "'Mulish',sans-serif", fontWeight: 700,
    fontSize: '16px', lineHeight: 1.3, textDecoration: 'none', textAlign: 'center',
    overflowWrap: 'anywhere', outlineOffset: '3px' };
  function inline(tree, keyBase, guard, asAction) {
    return (tree || []).map((n, i) => {
      const k = keyBase + '-' + i;
      // Inside an action group the source's whitespace between anchors is layout, not content — the gap
      // provides the separation, so the raw whitespace run is not emitted as adjoining text.
      if (n.k === 't') return asAction && !n.v.trim() ? null : n.v;
      if (n.tag === 'br') return React.createElement('br', { key: k });
      const kids = inline(n.c, k, guard, asAction);
      if (n.tag === 'a') {
        const href = (n.attrs && n.attrs.href) || null;
        if (!href) return React.createElement('span', { key: k, 'data-source-anchor': 'no-href' }, ...kids);
        const abs = /^(https?:|tel:|mailto:)/i.test(href) ? href : (A + href);
        // overflowWrap lets a long unbroken source token (a bare URL used as link text) wrap at 320px
        // instead of overflowing. No source text is altered.
        return React.createElement('a', { key: k, href: abs, onClick: guard,
          'data-source-href': href, 'data-source-action': asAction ? 'true' : undefined,
          style: asAction ? ACTION_A : { textUnderlineOffset: '2px', overflowWrap: 'anywhere' } }, ...kids);
      }
      const tag = { b: 'strong', u: 'u', i: 'em' }[n.tag] || n.tag;
      return React.createElement(tag, { key: k }, ...kids);
    });
  }

  // A source image at its recorded original proportions — never square-cropped, never upscaled. When the source
  // wrapped it in an anchor, the image stays a real link with that exact destination.
  function imageEl(im, k, guard, extraStyle) {
    const img = React.createElement('img', { src: im.src, alt: im.alt || '', width: im.width, height: im.height,
      loading: 'lazy', 'data-source-pointer': im.ptr,
      // Capped at the recorded original width so a small source illustration (an icon beside a list item) is
      // never upscaled by its container. Larger illustrations are unaffected.
      style: Object.assign({ display: 'block', width: '100%', maxWidth: im.width ? im.width + 'px' : 'none',
        height: 'auto', borderRadius: '4px' }, extraStyle || {}) });
    if (!im.linkHref) return React.createElement('div', { key: k, style: { minWidth: 0 } }, img);
    const abs = /^https?:/i.test(im.linkHref) ? im.linkHref : (A + im.linkHref);
    return React.createElement('a', { key: k, href: abs, onClick: guard, 'data-source-href': im.linkHref,
      'data-source-pointer': im.linkPtr || undefined, style: { display: 'block', minWidth: 0 } }, img);
  }

  // A source list renders recursively: each item shows its own inline lead and its own illustrations, then its
  // child lists as real nested ul/ol. Nesting is never faked with text or CSS.
  function listBlock(b, k, guard, depth) {
    const T = { fontSize: '17.5px', lineHeight: 1.75, textWrap: 'pretty' };
    const d = depth || 0;
    const illustrated = b.items.some(it => (it.images || []).length);
    if (illustrated && d === 0) return React.createElement('ul', { key: k, 'data-source-pointer': b.ptr, 'data-collection': 'cards',
      style: { listStyle: 'none', margin: '0 0 20px', padding: 0, display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,280px),1fr))', gap: '24px' } },
      ...b.items.map((it, j) => React.createElement('li', { key: k + '-' + j, 'data-source-pointer': it.ptr,
          style: { minWidth: 0, display: 'flex', flexDirection: 'column', gap: '10px' } },
        ...(it.images || []).map((im, m) => imageEl(im, k + '-' + j + '-i' + m, guard)),
        it.text ? React.createElement('div', { key: k + '-' + j + '-t', style: T }, ...inline(it.tree, k + '-' + j, guard)) : null,
        ...(it.children || []).map((c, ci) => listBlock(c, k + '-' + j + '-n' + ci, guard, d + 1)))));
    return React.createElement(b.ordered ? 'ol' : 'ul', { key: k, 'data-source-pointer': b.ptr,
      'data-list-depth': String(d),
      style: { margin: d === 0 ? '0 0 16px' : '8px 0 2px', paddingLeft: '24px',
        display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '76ch',
        listStyleType: d === 0 ? (b.ordered ? 'decimal' : 'disc') : (b.ordered ? 'lower-alpha' : 'circle') } },
      ...b.items.map((it, j) => React.createElement('li', { key: k + '-' + j, 'data-source-pointer': it.ptr, style: T },
        ...inline(it.tree, k + '-' + j, guard),
        ...(it.images || []).map((im, m) => imageEl(im, k + '-' + j + '-i' + m, guard)),
        ...(it.children || []).map((c, ci) => listBlock(c, k + '-' + j + '-n' + ci, guard, d + 1)))));
  }

  function sourceBlocks(list, keyBase, guard) {
    const T = { fontSize: '17.5px', lineHeight: 1.75, textWrap: 'pretty' };
    return (list || []).map((b, i) => {
      const k = keyBase + '-b' + i;
      if (b.kind === 'heading') return React.createElement(b.tag, { key: k, 'data-source-pointer': b.ptr,
        'data-source-tag': b.sourceTag || undefined,
        style: { fontFamily: "'Marcellus',serif", fontWeight: 400, lineHeight: 1.22, margin: '26px 0 10px',
          fontSize: b.tag === 'h2' ? 'clamp(24px,2.4vw,32px)' : b.tag === 'h3' ? '23px' : '19.5px' } },
        ...inline(b.tree, k, guard));
      if (b.kind === 'list') return listBlock(b, k, guard);
      if (b.kind === 'table') return React.createElement('div', { key: k, role: 'region', tabIndex: 0,
          'aria-label': 'Source table', style: { margin: '0 0 18px', overflowX: 'auto', border: '1px solid #E0D7C4', borderRadius: '4px', outlineOffset: '2px' } },
        React.createElement('table', { 'data-source-pointer': b.ptr, style: { borderCollapse: 'collapse', width: '100%', background: '#fff' } },
          React.createElement('tbody', null, ...b.rows.map((row, ri) => React.createElement('tr', { key: k + '-r' + ri, 'data-source-pointer': row.ptr },
            ...row.cells.map((c, ci) => React.createElement(c.tag === 'th' ? 'th' : 'td', { key: ci, 'data-source-pointer': c.ptr,
              // Source spans, carried verbatim. A header that spans columns heads a column group; a header that
              // spans rows, or a row-label header in a body row, heads that row group.
              rowSpan: c.rowSpan || undefined, colSpan: c.colSpan || undefined,
              scope: c.tag !== 'th' ? undefined
                : (c.colSpan > 1 ? 'colgroup' : (c.rowSpan > 1 ? 'col' : (ci === 0 && ri > 0 ? 'row' : 'col'))),
              style: { border: '1px solid #D8CFBD', padding: '10px 12px', fontSize: '16.5px', lineHeight: 1.55,
                textAlign: 'left', verticalAlign: 'top', background: c.tag === 'th' ? '#EFE9DA' : '#fff',
                fontWeight: c.tag === 'th' ? 700 : 400 } }, ...inline(c.tree, k + '-r' + ri + '-' + ci, guard))))))));
      if (b.kind === 'cardgrid') return React.createElement('ul', { key: k, 'data-collection': 'cards',
        style: { listStyle: 'none', margin: '0 0 22px', padding: 0, display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,282px),1fr))', gap: '26px', alignItems: 'start' } },
        ...b.cards.map((c, j) => React.createElement('li', { key: k + '-c' + j, 'data-source-card': c.ptr,
            style: { minWidth: 0, display: 'flex', flexDirection: 'column', gap: '10px' } },
          ...sourceBlocks(c.blocks, k + '-c' + j, guard))));
      if (b.kind === 'card') {
        // An exact source card: its own image(s) and the text the source pairs with them, in source order.
        return React.createElement('div', { key: k, 'data-source-card': b.ptr,
          style: { minWidth: 0, display: 'flex', flexDirection: 'column', gap: '10px' } },
          ...sourceBlocks(b.blocks, k, guard));
      }
      if (b.kind === 'caption') return React.createElement('p', { key: k, 'data-source-pointer': b.ptr,
        style: { margin: '6px 0 16px', fontSize: '15.5px', lineHeight: 1.6, color: '#6B6256' } }, ...inline(b.tree, k, guard));
      // Capped at the recorded original width so the illustration is never upscaled, and left at its own
      // aspect ratio so it is never square-cropped.
      if (b.kind === 'image') return React.createElement('div', { key: k,
        style: { margin: '0 0 14px', maxWidth: b.width + 'px', minWidth: 0 } },
        imageEl(b, k + '-im', guard));
      // A source action group (its own sourceClass says so) lays out as a wrapping row of distinct, separately
      // focusable actions. Labels, destinations and order come straight from the source and are unchanged.
      if (/(^|\s)(hero-btns|invite-btns)(\s|$)/.test(b.sourceClass || ''))
        return React.createElement('div', { key: k, 'data-source-pointer': b.ptr, 'data-source-action-group': 'true',
          'data-source-class': b.sourceClass,
          style: { display: 'flex', flexWrap: 'wrap', gap: '14px', margin: '4px 0 20px', minWidth: 0 } },
          ...inline(b.tree, k, guard, true));
      return React.createElement('p', { key: k, 'data-source-pointer': b.ptr,
        'data-source-line': b.kind === 'line' ? 'true' : undefined,
        style: Object.assign({ margin: '0 0 14px', maxWidth: '76ch' }, T) }, ...inline(b.tree, k, guard));
    });
  }

  // Consecutive source cards become one responsive grid in source order; everything else stays in flow.
  function groupCards(blocks) {
    const out = [];
    let run = null;
    (blocks || []).forEach(b => {
      if (b.kind === 'cardgrid') return React.createElement('ul', { key: k, 'data-collection': 'cards',
        style: { listStyle: 'none', margin: '0 0 22px', padding: 0, display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,282px),1fr))', gap: '26px', alignItems: 'start' } },
        ...b.cards.map((c, j) => React.createElement('li', { key: k + '-c' + j, 'data-source-card': c.ptr,
            style: { minWidth: 0, display: 'flex', flexDirection: 'column', gap: '10px' } },
          ...sourceBlocks(c.blocks, k + '-c' + j, guard))));
      if (b.kind === 'card') { if (!run) { run = { kind: 'cardgrid', cards: [] }; out.push(run); } run.cards.push(b); return; }
      run = null; out.push(b);
    });
    return out;
  }

  function collectionVals(R, guard) {
    return {
      hasCollection: true, C: R,
      hasCrumbs: !!(R.crumbs && R.crumbs.length),
      crumbs: (R.crumbs || []).slice(0, -1).map(c => ({ label: c.label, url: A + c.path })),
      crumbLast: (R.crumbs && R.crumbs.length) ? R.crumbs[R.crumbs.length - 1].label : '',
      cardCount: R.cardCollections ? String(R.cardCollections.count) : '0',
      sections: R.components.map((c, ci) => ({
        key: 'c' + ci, component: c.component, ptr: c.ptr,
        el: sourceBlocks(groupCards(c.blocks), 'c' + ci, guard)
      }))
    };
  }

  window.AHV_COLLECTION_RENDER = { resolveRoute, applyHead, collectionVals, sourceBlocks, inline, A };
})();
