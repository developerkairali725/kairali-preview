// AHV T04 source-article reader — shared renderer for the eleven editorial routes (Desktop + Mobile).
// Renders source-exact article items, the source context navigation and the per-route head contract from
// assets/article-family-data.js. Prototype binding only: no network, no submit, no tracking, no persistence.
(function () {
  const A = 'https://ayurvedichealingvillage.com';
  const DEFAULT_ROUTE = '/ayurvedic-products/';

  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || DEFAULT_ROUTE;
    const D = window.AHV_ARTICLE || { routes: [] };
    return D.routes.find(r => r.path === want || r.slug === want) ||
           D.routes.find(r => r.path === '/' + String(want).replace(/^\/|\/$/g, '') + '/') ||
           D.routes.find(r => r.path === DEFAULT_ROUTE) || null;
  }


  // Source inline runs → React. Internal hrefs become governed absolute URLs; every link is default-prevented
  // in review. Strong/em/br and inline anchors are preserved exactly as the source tree carries them.
  function inline(tree, key, guard) {
    return (tree || []).map((n, i) => {
      if (n.k === 't') return n.v;
      const k = key + '-' + i;
      if (n.tag === 'br') return React.createElement('br', { key: k });
      if (n.tag === 'a') {
        const h = n.attrs.href || '';
        const props = { key: k, href: /^https?:/i.test(h) ? h : (A + h), onClick: guard,
          style: { color: '#006038', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 600 } };
        if (n.attrs.rel) props.rel = n.attrs.rel;
        if (/^https?:/i.test(h)) props.rel = n.attrs.rel || 'noopener';
        return React.createElement('a', props, ...inline(n.c, k, guard));
      }
      const st = n.tag === 'strong' ? { fontWeight: 700 } : (n.tag === 'em' ? { fontStyle: 'italic' } : undefined);
      return React.createElement(n.tag, { key: k, style: st }, ...inline(n.c, k, guard));
    });
  }
  // Source list → React ol/ul with original grouping, order, numbering and nesting.
  function listEl(L, key, guard) {
    const pad = { margin: '0 0 18px', paddingLeft: L.ordered ? '26px' : '22px', display: 'flex', flexDirection: 'column', gap: '8px' };
    const nestPad = { margin: '8px 0 0', paddingLeft: L.ordered ? '24px' : '20px', display: 'flex', flexDirection: 'column', gap: '6px' };
    return React.createElement(L.ordered ? 'ol' : 'ul',
      { key: key, style: L.depth ? nestPad : pad, 'data-source-pointer': L.ptr },
      ...L.items.map((it, i) => React.createElement('li',
        { key: key + '-i' + i, 'data-source-pointer': it.ptr, style: { fontSize: '17.5px', lineHeight: 1.7, textWrap: 'pretty', listStyle: L.ordered ? 'decimal' : 'disc' } },
        ...inline(it.tree, key + '-i' + i, guard),
        ...(it.nested || []).map((n, j) => listEl(n, key + '-i' + i + '-n' + j, guard)))));
  }

  // Source table → React. Row/column order, header cells, scope and colspan/rowspan are preserved exactly;
  // the table is never clipped, columns are never hidden and text is never shrunk. Narrow viewports keep the
  // same semantic table inside a labelled, keyboard-focusable scroll region with a visible focus ring.
  function tableEl(T, key, guard, label) {
    const cell = (c, ck, rowSection) => {
      const isHead = c.tag === 'th';
      const style = { border: '1px solid #D8CFBD', padding: '10px 12px', fontSize: '16.5px', lineHeight: 1.55,
        textAlign: 'left', verticalAlign: 'top', minWidth: '120px',
        background: isHead ? '#EFE9DA' : '#fff', fontWeight: isHead ? 700 : 400, textWrap: 'pretty' };
      const props = { key: ck, style: style, 'data-source-pointer': c.ptr };
      if (c.colspan) props.colSpan = c.colspan;
      if (c.rowspan) props.rowSpan = c.rowspan;
      if (isHead) props.scope = c.scope || (rowSection === 'head' ? 'col' : 'row');
      return React.createElement(isHead ? 'th' : 'td', props, ...inline(c.tree, ck, guard));
    };
    const rowEl = (r2, ri) => React.createElement('tr', { key: key + '-r' + ri, 'data-source-pointer': r2.ptr },
      ...r2.cells.map((c, ci) => cell(c, key + '-r' + ri + '-c' + ci, r2.section)));
    const head = T.rows.filter(r2 => r2.section === 'head');
    const body = T.rows.filter(r2 => r2.section !== 'head');
    const parts = [];
    if (head.length) parts.push(React.createElement('thead', { key: key + '-h' }, ...head.map((r2, i) => rowEl(r2, i))));
    parts.push(React.createElement('tbody', { key: key + '-b' }, ...body.map((r2, i) => rowEl(r2, head.length + i))));
    const table = React.createElement('table',
      { key: key + '-t', 'data-source-pointer': T.ptr,
        style: { borderCollapse: 'collapse', width: '100%', minWidth: Math.max(320, (T.columns || 1) * 150) + 'px', background: '#fff' } },
      ...parts);
    return React.createElement('div',
      { key: key, role: 'region', 'aria-label': label, tabIndex: 0,
        style: { margin: '0 0 22px', overflowX: 'auto', WebkitOverflowScrolling: 'touch',
          border: '1px solid #E0D7C4', borderRadius: '4px', outlineOffset: '2px' } },
      table);
  }
  // Article items → template values. Source order is preserved exactly; every item keeps its source pointer.
  function articleVals(R, state, setGroup, guard) {
    const open = (state && state.navOpen) || null;
    const out = {};
    out.items = (R.items || []).map((it, i) => {
      const o = Object.assign({}, it, { key: 'it-' + i });
      o.isList = it.kind === 'list';
      o.isDownload = it.kind === 'download';
      o.isTable = it.kind === 'table';
      if (it.kind === 'table') {
        const label = (R.h1 || 'Table') + ' — ' + (it.columns || 0) + ' columns, ' + it.rows.length + ' rows (scrollable)';
        o.tableEl = tableEl(it, 'it-' + i, guard, label);
      }
      // Source <hr> block boundary (e.g. offer body → terms). Rendered as a real separator, never as copy.
      o.isRule = it.kind === 'rule';
      o.isCard = it.kind === 'card';
      o.isJob = it.kind === 'job';
      if (it.kind === 'download') { o.href = it.localPath; o.implementationHref = it.implementationHref; }
      if (it.kind === 'card') {
        const im = it.image || null;
        // Source image scale is preserved: the card image renders at its own source width, never upscaled.
        o.cardImage = im ? Object.assign({}, im, { maxWidth: (im.width || 100) + 'px' }) : null;
        o.cardBodyInline = it.body ? inline(it.body.tree, 'it-' + i + '-b', guard) : null;
        o.hasCardBody = !!(it.body && it.body.tree);
        o.cardCta = it.cta ? { text: it.cta.text, href: /^https?:/i.test(it.cta.href || '') ? it.cta.href : (A + it.cta.href), ptr: it.cta.ptr || '' } : null;
        o.cardBodyPtr = (it.body && it.body.ptr) || '';
        o.cardTitlePtr = it.titlePtr || it.ptr;
        o.hasCta = !!it.cta;
        // A source card title is a link only where the source carries a real destination. Recorded
        // non-interactive labels (the 24 package '#' anchors) stay text; their original href is private data.
        o.cardTitleLinked = !!(it.titleHref && !it.titleNoninteractive);
        o.cardTitlePlain = !o.cardTitleLinked;
        o.cardTitleHref = o.cardTitleLinked ? (/^https?:/i.test(it.titleHref) ? it.titleHref : (A + it.titleHref)) : null;
        // Image-only card links take their accessible name from their own adjacent card label.
        o.cardImageLinked = !!(im && im.linkHref && !im.noninteractive);
        o.cardImagePlain = !o.cardImageLinked;
        o.cardImageHref = o.cardImageLinked ? (/^https?:/i.test(im.linkHref) ? im.linkHref : (A + im.linkHref)) : null;
        o.cardImageAria = (im && im.accessibleName) || null;
        o.hasMoreLink = !!(it.more && it.more.href && !it.more.noninteractive);
        o.hasMoreLabel = !!(it.more && it.more.noninteractive);
        o.cardMore = it.more ? { text: it.more.text, ptr: it.more.ptr || '',
          href: it.more.href ? (/^https?:/i.test(it.more.href) ? it.more.href : (A + it.more.href)) : null } : null;
      }
      if (it.kind === 'job') {
        o.jobImage = it.image || null;
        o.jobHref = it.link ? (A + it.link.href) : null;
        o.jobMore = it.more ? { text: it.more.text, href: A + it.more.href, ptr: it.more.ptr || '' } : null;
        o.jobLinkPtr = (it.link && it.link.ptr) || '';
        o.hasMore = !!it.more;
      }
      if (it.tree) o.inline = inline(it.tree, 'it-' + i, guard);
      if (it.kind === 'list') o.listEl = listEl(it, 'it-' + i, guard);
      o.isH2 = it.kind === 'heading' && it.tag === 'h2';
      o.isH3 = it.kind === 'heading' && it.tag === 'h3';
      o.isH4 = it.kind === 'heading' && it.tag === 'h4';
      o.isH5 = it.kind === 'heading' && it.tag === 'h5';
      o.isH6 = it.kind === 'heading' && it.tag === 'h6';
      o.isPara = it.kind === 'para';
      o.isLi = it.kind === 'li';
      o.isFigure = it.kind === 'figure';
      o.isLink = it.kind === 'link';
      if (it.kind === 'figure') {
        o.hasLink = !!it.linkHref;
        o.href = it.linkHref ? (it.linkHref.charAt(0) === '/' ? A + it.linkHref : it.linkHref) : null;
        o.ariaLabel = it.accessibleName || null;
        o.maxWidth = (it.width || 0) + 'px';
      }
      if (it.kind === 'link') {
        o.href = /^https?:/i.test(it.sourceHref || '') ? it.sourceHref : (A + it.sourceHref);
        o.rel = it.rel || (it.external ? 'noopener' : null);
        o.externalNote = it.external ? 'External business website — separately labelled source link. Availability and ownership are not asserted here.' : null;
      }
      return o;
    });
    // Context navigation: source group order and item order preserved; groups are keyboard disclosures.
    out.nav = { heading: (R.nav || {}).heading || '' };
    out.navGroups = ((R.nav || {}).groups || []).map((g, gi) => {
      const isOpen = open === null ? gi === 0 : open === gi;
      return {
        id: 'nav-g' + gi, panelId: 'nav-p' + gi, title: g.title,
        expanded: isOpen ? 'true' : 'false', hidden: !isOpen, display: isOpen ? 'block' : 'none',
        marker: isOpen ? '\u2212' : '+',
        toggle: () => setGroup(isOpen ? -1 : gi),
        items: g.items.map(it => ({
          text: it.text,
          // Source items without an anchor render as plain text — no destination is guessed.
          linked: !it.unlinked, unlinked: !!it.unlinked,
          href: it.unlinked ? null : (it.inReader ? ('?route=' + encodeURIComponent(it.sourceHref)) : (A + it.sourceHref)),
          inReader: it.inReader, current: it.sourceHref === R.path,
          ariaCurrent: it.sourceHref === R.path ? 'page' : null
        }))
      };
    });
    // Governed breadcrumb chain: exact labels and hrefs, Home → /.
    out.variation = R.variation || 'article';
    out.isDirectory = R.variation === 'directory';
    out.isGallery = R.variation === 'gallery';
    out.isCardHub = R.variation === 'card-hub';
    out.crumbs = (R.crumbs || []).slice(0, -1).map(c => ({ label: c.label, url: A + c.path }));
    out.crumbLast = (R.crumbs || []).length ? R.crumbs[R.crumbs.length - 1].label : '';
    return out;
  }

  // Grouped FAQ: exact source category order, exact question text, complete answer trees. Each question is a
  // native button linked to its panel by aria-controls/aria-expanded; panels start collapsed and any number may
  // stay open. Answers keep their source paragraphs, lists, emphasis and links, never clipped or summarised.
  function faqBlocks(list, keyBase, guard) {
    const T = { fontSize: '17.5px', lineHeight: 1.75, textWrap: 'pretty' };
    return (list || []).map((b, i) => {
      const k = keyBase + '-b' + i;
      if (b.kind === 'list') return listEl(b, k, guard);
      if (b.kind === 'heading') return React.createElement(b.tag, { key: k, 'data-source-pointer': b.ptr, 'data-source-tag': b.sourceTag || undefined,
        style: { fontFamily: "'Marcellus',serif", fontWeight: 400, lineHeight: 1.3, margin: b.tag === 'h2' ? '0 0 12px' : '14px 0 8px',
          fontSize: b.tag === 'h2' ? 'clamp(24px,2.5vw,32px)' : '20px' } }, ...inline(b.tree, k, guard));
      return React.createElement('p', { key: k, 'data-source-pointer': b.ptr,
        style: Object.assign({ margin: i === 0 ? '0 0 14px' : '0 0 14px', maxWidth: '74ch' }, T) }, ...inline(b.tree, k, guard));
    });
  }
  function faqVals(R, state, toggle, guard) {
    const F = R.faq, openSet = (state && state.faqOpen) || {};
    const frame = (list, kb) => faqBlocks(list, kb, guard);
    return {
      hasFaq: true,
      faqIntroEl: frame(F.intro, 'faq-intro'),
      faqClosingEl: frame(F.closing, 'faq-close'),
      faqGroups: F.groups.map((g, gi) => ({
        key: 'faq-g' + gi, label: g.label, ptr: g.ptr, headingId: 'faq-cat-' + gi,
        pairs: g.pairs.map((p, pi) => {
          const id = 'faq-' + gi + '-' + pi, open = !!openSet[id];
          return { key: id, btnId: id + '-btn', panelId: id + '-panel',
            question: p.question, questionPtr: p.questionPtr, itemPtr: p.itemPtr, answerPtr: p.answerPtr,
            expanded: open ? 'true' : 'false', hidden: !open, display: open ? 'block' : 'none',
            marker: open ? '\u2212' : '+',
            // Native <button> — Enter and Space activate it with no extra key handling, and focus stays put.
            toggle: () => toggle(id),
            answerEl: frame(p.answer, id) };
        })
      }))
    };
  }

  function applyHead(R) {
    const d = document, H = d.head, M = R.metadata;
    [...H.querySelectorAll('[data-ahv-head]')].forEach(n => n.remove());
    const add = (tag, attrs) => { const el = d.createElement(tag); Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); el.setAttribute('data-ahv-head', ''); H.appendChild(el); return el; };
    d.title = M.title;
    d.documentElement.lang = M.htmlLang || 'en-US';
    if (M.description) add('meta', { name: 'description', content: M.description });
    add('link', { rel: 'canonical', href: M.canonical });
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
    // Governed BreadcrumbList, emitted exactly as the route rules specify.
    if (R.breadcrumbSchemaExpected && !R.breadcrumbProvisional) { const bc = add('script', { type: 'application/ld+json' }); bc.textContent = JSON.stringify(R.breadcrumbSchemaExpected); }
    // Minimal WebPage/WebSite graph only — no FAQ, Offer, Product or Review schema is invented.
    const s = add('script', { type: 'application/ld+json' });
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', '@id': M.canonical, url: M.canonical, name: M.title, description: M.description, isPartOf: { '@id': A + '/#website' }, inLanguage: 'en-US' },
      { '@type': 'WebSite', '@id': A + '/#website', url: A + '/', name: 'Ayurvedic Healing Village', inLanguage: 'en-US' }] });
  }

  window.AHV_ARTICLE_RENDER = { resolveRoute, articleVals, faqVals, applyHead, inline, listEl, tableEl, A, DEFAULT_ROUTE };
})();
