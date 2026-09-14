// AHV T04 gallery family — shared renderer for the eight source gallery datasets.
// Prototype binding only: no network, no submit, no tracking, no persistence, no gallery plugin.
(function () {
  const A = 'https://ayurvedichealingvillage.com';

  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || null;
    if (!want) return null;
    const D = window.AHV_GALLERY_FAMILY;
    if (!D) return null;
    return D.routes.find(r => r.path === want) || null;
  }

  // Head contract: source strings verbatim, governed canonical/robots, governed BreadcrumbList.
  function applyHead(R) {
    const d = document, H = d.head, M = R.metadata;
    [...H.querySelectorAll('[data-ahv-head]')].forEach(n => n.remove());
    // The pair's own <helmet> carries the approved Ayurveda Gallery head contract. On a source-gallery route that
    // contract does not apply, so its static nodes are removed before the governed ones are written; otherwise two
    // canonicals and two titles would coexist and the first (Ayurveda) would win. The Ayurveda view is a separate
    // load with no route parameter, so its own head is untouched there.
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

  // One reusable grid/viewer with an optional source-defined slider. Each group keeps its own source order
  // and its own counter; the slider and grid roles are never merged or deduplicated.
  function galleryVals(R, state, api, guard) {
    const openGroup = state.gi == null ? null : state.gi;
    const groups = R.groups.map((g, gi) => {
      const slide = (state.slide && state.slide[gi]) || 0;
      return {
        key: 'g' + gi, gi: gi, role: g.role, isSlider: g.role === 'slider', isGrid: g.role === 'grid',
        ptr: g.ptr, count: g.count,
        headingId: 'grp-h' + gi,
        label: g.role === 'slider' ? R.h1 + ' — slider, ' + g.count + ' images'
                                   : R.h1 + ' — grid, ' + g.count + ' images',
        current: slide,
        items: g.items.map((it, i) => ({
          key: 'g' + gi + '-i' + i, gi: gi, i: i,
          src: it.src, alt: it.alt || '', ptr: it.ptr,
          width: it.width, height: it.height,
          maxWidth: it.width + 'px',
          // Blank source alt keeps the image blank-alt inside a named control.
          controlName: it.alt ? ('Open ' + (it.alt.length > 60 ? it.alt.slice(0, 60) : it.alt)) : it.accessibleName,
          caption: it.caption || null, hasCaption: !!it.caption,
          isCurrent: i === slide,
          display: g.role === 'slider' ? (i === slide ? 'block' : 'none') : 'block',
          open: () => api.open(gi, i)
        })),
        bullets: g.items.map((it, i) => ({
          key: 'g' + gi + '-b' + i,
          label: 'Show ' + R.h1 + ' slider image ' + (i + 1) + ' of ' + g.count,
          current: i === slide ? 'true' : 'false',
          bg: i === slide ? '#006038' : 'transparent',
          fg: i === slide ? '#F7F4EA' : '#2A2118',
          n: String(i + 1),
          go: () => api.slide(gi, i)
        })),
        sliderStatus: 'Image ' + (slide + 1) + ' of ' + g.count,
        prevSlide: () => api.slide(gi, (slide - 1 + g.count) % g.count),
        nextSlide: () => api.slide(gi, (slide + 1) % g.count)
      };
    });
    const g = openGroup == null ? null : R.groups[openGroup];
    const idx = state.ii || 0;
    const cur = g ? g.items[idx] : null;
    return {
      hasGallery: true, G: R, groups: groups,
      hasHero: !!R.heroImage,
      crumbs: R.crumbs.slice(0, -1).map(c => ({ label: c.label, url: A + c.path })),
      crumbLast: R.crumbs[R.crumbs.length - 1].label,
      hasIntro: !!R.intro, intro: R.intro || { text: '', ptr: '' },
      hasSectionHeading: !!R.sectionHeading, sectionHeading: R.sectionHeading || { text: '', ptr: '' },
      hasCaptions: !!(R.captions && R.captions.length), captions: R.captions || [],
      hasContextTrail: !!(R.contextTrail && R.contextTrail.length),
      // Only actual source anchors render as links; plain source text stays plain.
      contextTrail: (R.contextTrail || []).map(c => ({ text: c.text, ptr: c.ptr,
        isLink: !!c.isLink, isText: !c.isLink,
        href: c.isLink ? (A + c.href) : null, sourceHref: c.sourceHref || null,
        anchorPtr: c.anchorPtr || null })),
      hasCaptionsHeading: !!R.captionsHeading,
      captionsHeading: R.captionsHeading || { text: '', ptr: '', sourceTag: '' },
      dlgOpen: openGroup != null,
      dlgDisplay: openGroup != null ? 'flex' : 'none',
      dlgLabel: g ? (R.h1 + ' — ' + g.role) : R.h1,
      // The approved viewer markup reads cur.image; the same object also carries src for the grid.
      cur: cur ? Object.assign({}, cur, { image: cur.src }) : { image: '', src: '', alt: '', width: 1280, height: 720 },
      curCaption: (cur && cur.caption) || null, curHasCaption: !!(cur && cur.caption),
      counter: g ? (R.h1 + ' ' + g.role + ' — image ' + (idx + 1) + ' of ' + g.count) : ''
    };
  }

  window.AHV_GALLERY_RENDER = { resolveRoute, applyHead, galleryVals, A };
})();
