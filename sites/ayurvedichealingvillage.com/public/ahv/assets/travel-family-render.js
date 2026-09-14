// AHV T04 travel/media family — shared renderer for the five travel and media source datasets.
// Prototype binding only: no network, no provider activation, no analytics, no geolocation, no submit.
(function () {
  const A = 'https://ayurvedichealingvillage.com';

  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || null;
    if (!want) return null;
    const D = window.AHV_TRAVEL_FAMILY;
    return D ? (D.routes.find(r => r.path === want) || null) : null;
  }

  function applyHead(R) {
    const d = document, H = d.head, M = R.metadata;
    [...H.querySelectorAll('[data-ahv-head]')].forEach(n => n.remove());
    // The host page's own static head contract does not apply on a travel route, so its nodes are cleared
    // before the governed ones are written — otherwise two canonicals and two titles would coexist.
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

  // Inline runs: exact source text with source emphasis and exact link destinations. Links are inert in review.
  function inline(tree, keyBase, guard) {
    return (tree || []).map((n, i) => {
      const k = keyBase + '-' + i;
      if (n.k === 't') return n.v;
      if (n.tag === 'br') return React.createElement('br', { key: k });
      const kids = inline(n.c, k, guard);
      if (n.tag === 'a') {
        const href = (n.attrs && n.attrs.href) || '';
        const abs = /^(https?:|tel:|mailto:)/i.test(href) ? href : (A + href);
        return React.createElement('a', { key: k, href: abs, onClick: guard,
          'data-source-href': href, style: { textUnderlineOffset: '2px' } }, ...kids);
      }
      const tag = { b: 'strong', u: 'u', i: 'em' }[n.tag] || n.tag;
      return React.createElement(tag, { key: k }, ...kids);
    });
  }

  // Rich source blocks in exact source order: headings, paragraphs, text runs, lists, tables, captions, images.
  function sourceBlocks(list, keyBase, guard, onImage) {
    const T = { fontSize: '17.5px', lineHeight: 1.75, textWrap: 'pretty' };
    return (list || []).map((b, i) => {
      const k = keyBase + '-b' + i;
      if (b.kind === 'heading') return React.createElement(b.tag, { key: k, 'data-source-pointer': b.ptr,
        'data-source-tag': b.sourceTag || undefined,
        style: { fontFamily: "'Marcellus',serif", fontWeight: 400, lineHeight: 1.22, margin: '26px 0 10px',
          fontSize: b.tag === 'h2' ? 'clamp(24px,2.4vw,32px)' : b.tag === 'h3' ? '23px' : '19.5px' } },
        ...inline(b.tree, k, guard));
      if (b.kind === 'list') return React.createElement(b.ordered ? 'ol' : 'ul', { key: k, 'data-source-pointer': b.ptr,
        style: { margin: '0 0 16px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '76ch' } },
        ...b.items.map((it, j) => React.createElement('li', { key: k + '-' + j, 'data-source-pointer': it.ptr, style: T },
          ...inline(it.tree, k + '-' + j, guard))));
      if (b.kind === 'table') return React.createElement('div', { key: k, role: 'region', tabIndex: 0,
          'aria-label': 'Source table', style: { margin: '0 0 18px', overflowX: 'auto', border: '1px solid #E0D7C4', borderRadius: '4px', outlineOffset: '2px' } },
        React.createElement('table', { 'data-source-pointer': b.ptr, style: { borderCollapse: 'collapse', width: '100%', background: '#fff' } },
          React.createElement('tbody', null, ...b.rows.map((row, ri) => React.createElement('tr', { key: k + '-r' + ri, 'data-source-pointer': row.ptr },
            ...row.cells.map((c, ci) => React.createElement(c.tag === 'th' ? 'th' : 'td', { key: ci, 'data-source-pointer': c.ptr,
              scope: c.tag === 'th' ? 'col' : undefined,
              style: { border: '1px solid #D8CFBD', padding: '10px 12px', fontSize: '16.5px', lineHeight: 1.55,
                textAlign: 'left', verticalAlign: 'top', background: c.tag === 'th' ? '#EFE9DA' : '#fff',
                fontWeight: c.tag === 'th' ? 700 : 400 } }, ...inline(c.tree, k + '-r' + ri + '-' + ci, guard))))))));
      if (b.kind === 'navitem') return React.createElement('div', { key: k, 'data-source-pointer': b.ptr,
        'data-source-tag': b.sourceTag || undefined, 'data-nav-item': 'true',
        style: { margin: '0 0 6px', fontSize: '17px', lineHeight: 1.6, fontWeight: 700 } }, ...inline(b.tree, k, guard));
      if (b.kind === 'caption') return React.createElement('p', { key: k, 'data-source-pointer': b.ptr,
        style: { margin: '6px 0 16px', fontSize: '15.5px', lineHeight: 1.6, color: '#6B6256' } }, ...inline(b.tree, k, guard));
      if (b.kind === 'image') {
        // Full source image at its decoded original proportions — never cropped and never upscaled. Clicking
        // opens it in the shared viewer at full size.
        const img = React.createElement('img', { src: b.src, alt: b.alt || '', width: b.width, height: b.height,
          loading: 'lazy', 'data-source-pointer': b.ptr,
          style: { display: 'block', width: '100%', maxWidth: b.width + 'px', height: 'auto', borderRadius: '4px' } });
        if (!onImage) return React.createElement('div', { key: k, style: { margin: '0 0 18px' } }, img);
        return React.createElement('button', { key: k, type: 'button', 'data-travel-image': b.ptr,
          'aria-label': onImage.label(b), onClick: () => onImage.open(b),
          style: { display: 'block', width: '100%', maxWidth: b.width + 'px', margin: '0 0 18px', padding: 0,
            border: 0, background: 'none', cursor: 'pointer' } }, img);
      }
      return React.createElement('p', { key: k, 'data-source-pointer': b.ptr,
        'data-source-line': b.kind === 'line' ? 'true' : undefined,
        style: Object.assign({ margin: '0 0 14px', maxWidth: '76ch' }, T) }, ...inline(b.tree, k, guard));
    });
  }

  function travelVals(R, state, api, guard) {
    const imgs = [];
    R.components.forEach(c => c.blocks.forEach(b => { if (b.kind === 'image') imgs.push(b); }));
    const onImage = imgs.length ? {
      label: (b) => 'Open ' + R.h1 + ' image ' + (imgs.findIndex(x => x.ptr === b.ptr) + 1) + ' of ' + imgs.length + ' at full size',
      open: (b) => api.open(imgs.findIndex(x => x.ptr === b.ptr))
    } : null;
    const oi = state.tvImage;
    const cur = oi == null ? null : imgs[oi];
    return {
      hasTravel: true, T: R,
      // A governed rule may carry no breadcrumb at all (utility/duplicate routes). No ancestry is invented then.
      hasCrumbs: !!(R.crumbs && R.crumbs.length),
      crumbs: (R.crumbs || []).slice(0, -1).map(c => ({ label: c.label, url: A + c.path })),
      crumbLast: (R.crumbs && R.crumbs.length) ? R.crumbs[R.crumbs.length - 1].label : '',
      sections: R.components.map((c, ci) => ({
        key: 'c' + ci, component: c.component, ptr: c.ptr,
        isNav: c.component === 'travel-navigation', isSection: c.component !== 'travel-navigation',
        navLabel: R.h1 + ' — jump to a section of this page',
        el: sourceBlocks(c.blocks, 'c' + ci, guard, onImage)
      })),
      imageCount: imgs.length,
      // Viewer over this route's own source images, at full decoded size.
      viewerOpen: oi != null, viewerDisplay: oi != null ? 'flex' : 'none',
      viewerLabel: R.h1 + ' — full size image',
      viewerCounter: cur ? (R.h1 + ' — image ' + (oi + 1) + ' of ' + imgs.length) : '',
      viewerEl: cur ? React.createElement('img', { id: 'travel-expanded', src: cur.src, alt: cur.alt || '',
        width: cur.width, height: cur.height,
        style: { display: 'block', width: 'auto', height: 'auto', maxWidth: 'min(' + cur.width + 'px,100%)',
          maxHeight: 'calc(100vh - 210px)', objectFit: 'contain', margin: '18px 0', borderRadius: '4px' } }) : null,
      hasHeroVideo: !!R.heroVideo,
      heroVideoEl: R.heroVideo ? React.createElement('video', { id: 'travel-hero-video', src: R.heroVideo.src,
        controls: true, preload: 'metadata', playsInline: true, autoPlay: false, loop: false, muted: false,
        'aria-label': R.h1 + ' — source video, plays locally on request',
        'data-source-pointer': R.heroVideo.ptr,
        style: { display: 'block', width: '100%', maxWidth: R.heroVideo.width + 'px', height: 'auto', background: '#000' } }) : null,
      hasVideoCards: !!R.videoCards,
      videoCards: R.videoCards ? R.videoCards.items.map(v => ({
        key: 'v' + v.order, order: String(v.order), title: v.title, ptr: v.ptr,
        // Short functional label only. The exact destination, provider and activation gate stay in the private
        // dataset and the manifest — never as visitor-facing prose.
        inactiveLabel: 'Playback disabled in this preview'
      })) : [],
      videoCardCount: R.videoCards ? String(R.videoCards.count) : '0',
      hasMaps: !!(R.mapDestinations || R.mapReferences),
      mapGroups: [R.mapDestinations, R.mapReferences].filter(Boolean).map((g, gi) => ({
        key: 'mg' + gi,
        heading: 'Maps',
        items: g.items.map(m => ({ key: 'm' + gi + '-' + m.order, order: String(m.order),
          title: m.title || (R.h1 + ' — map ' + m.order), ptr: m.ptr || null,
          inactiveLabel: 'Map disabled in this preview' }))
      })),
      close: () => api.close(), prev: () => api.step(-1), next: () => api.step(1),
      viewerKey: (e) => {
        if (e.key === 'Escape') { e.preventDefault(); api.close(); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); api.step(-1); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); api.step(1); return; }
        if (e.key === 'Tab') {
          const f = [...e.currentTarget.querySelectorAll('button')];
          const first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
  }

  window.AHV_TRAVEL_RENDER = { resolveRoute, applyHead, travelVals, sourceBlocks, inline, A };
})();
