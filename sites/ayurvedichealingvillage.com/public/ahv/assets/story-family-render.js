// AHV Our Story — thin resolver for the isolated own-source /our-story/ binding.
// Reuses the approved About Us composition: hero band, small lotus ornament, cloud-edge band, leaf accents,
// and card grids for the leadership portraits and certificates. Editorial blocks are drawn by the approved
// collection block renderer. Route-scoped only: no shared renderer, template or other dataset is affected.
(function () {
  const A = 'https://ayurvedichealingvillage.com';

  // Decoration roles, keyed by exact source pointer from this route's own capture.
  const ROLE = {
    '/sections/1/c/1/c/1': 'heroBand',
    '/sections/1/c/1/c/2/c/3/c/0': 'lotus',
    '/sections/1/c/3/c/0': 'cloudEdge',
    '/sections/5/c/1/c/0': 'leaf',
    '/sections/7/c/1/c/0/c/11/c/0': 'leaf'
  };
  const PORTRAIT = /\/sections\/9\//;      // leadership portraits
  const CERTIFICATE = /\/sections\/17\//;  // accreditation certificates

  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || null;
    if (!want) return null;
    const D = window.AHV_STORY_FAMILY;
    return D ? (D.routes.find(r => r.path === want) || null) : null;
  }
  function applyHead(R) { window.AHV_COLLECTION_RENDER.applyHead(R); }

  function img(b, key, style) {
    return React.createElement('img', {
      key, src: b.src, alt: b.alt || '', width: b.width, height: b.height,
      loading: 'lazy', decoding: 'async', 'data-source-pointer': b.ptr,
      'aria-hidden': (b.alt || '') ? undefined : 'true', style
    });
  }

  // One section's blocks composed the way About Us composes the same asset kinds.
  function composeSection(c, key, guard) {
    const P = window.AHV_COLLECTION_RENDER;
    const out = [];
    let run = [];              // editorial blocks awaiting the shared renderer
    let cards = [];            // leadership cards being assembled
    let certs = [];            // certificate images being assembled
    const flushRun = (i) => { if (run.length) { out.push(React.createElement('div', { key: key + '-r' + i, style: { minWidth: 0 } }, ...P.sourceBlocks(run, key + '-r' + i, guard))); run = []; } };
    const flushCards = (i) => {
      if (!cards.length) return;
      out.push(React.createElement('ul', { key: key + '-cards' + i, style: { listStyle: 'none', margin: '0 0 8px', padding: 0,
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,240px),1fr))', gap: '32px 28px', alignItems: 'start' } },
        ...cards.map((card, j) => React.createElement('li', { key: key + '-cd' + i + '-' + j, style: { minWidth: 0, display: 'flex', flexDirection: 'column', gap: '10px' } },
          card.image ? img(card.image, key + '-cd' + i + '-' + j + '-im', { display: 'block', width: '100%', maxWidth: card.image.width + 'px', height: 'auto', borderRadius: '4px' }) : null,
          ...P.sourceBlocks(card.blocks, key + '-cd' + i + '-' + j + '-b', guard)))));
      cards = [];
    };
    const flushCerts = (i) => {
      if (!certs.length) return;
      out.push(React.createElement('ul', { key: key + '-certs' + i, style: { listStyle: 'none', margin: '0 0 8px', padding: 0,
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(45%,180px),1fr))', gap: '20px', alignItems: 'start' } },
        ...certs.map((b, j) => React.createElement('li', { key: key + '-ct' + i + '-' + j, style: { minWidth: 0, width: '100%' } },
          img(b, key + '-ct' + i + '-' + j + '-im', { display: 'block', width: '100%', maxWidth: b.width + 'px', height: 'auto', borderRadius: '3px' }))))); 
      certs = [];
    };

    // About Us pairs one large editorial photograph with its text as two columns that stack on narrow
    // viewports. Same treatment here when a section holds exactly one such photograph.
    const editorial = (c.blocks || []).filter(b => b.kind === 'image' && !ROLE[b.ptr] && !PORTRAIT.test(b.ptr) && !CERTIFICATE.test(b.ptr) && (b.width || 0) >= 400);
    const pairImage = editorial.length === 1 ? editorial[0] : null;
    let pairSlot = null;

    (c.blocks || []).forEach((b, i) => {
      const role = ROLE[b.ptr];
      if (pairImage && b === pairImage) { flushRun(i); pairSlot = out.length; out.push(null); return; }
      if (b.kind === 'image' && role === 'heroBand') {
        flushRun(i);
        out.push(React.createElement('div', { key: key + '-hero', style: { margin: '0 0 0' } },
          img(b, key + '-hero-im', { display: 'block', width: '100%', maxWidth: b.width + 'px', height: 'auto', borderRadius: '4px' })));
        return;
      }
      if (b.kind === 'image' && role === 'lotus') {
        flushRun(i);
        out.push(React.createElement('div', { key: key + '-lotus', style: { display: 'flex', justifyContent: 'center', margin: '22px 0 6px' } },
          img(b, key + '-lotus-im', { width: '64px', height: 'auto', display: 'block' })));
        return;
      }
      if (b.kind === 'image' && role === 'cloudEdge') {
        flushRun(i);
        out.push(React.createElement('div', { key: key + '-cloud', style: { margin: '0 0 4px', lineHeight: 0, overflow: 'hidden', maxHeight: '72px' } },
          img(b, key + '-cloud-im', { display: 'block', width: '100%', height: 'auto' })));
        return;
      }
      if (b.kind === 'image' && role === 'leaf') {
        flushRun(i);
        out.push(React.createElement('div', { key: key + '-leaf' + i, style: { display: 'flex', justifyContent: 'flex-start', margin: '0 0 10px' } },
          img(b, key + '-leaf' + i + '-im', { width: 'min(112px,30%)', height: 'auto', display: 'block' })));
        return;
      }
      if (b.kind === 'image' && PORTRAIT.test(b.ptr)) { flushRun(i); flushCerts(i); cards.push({ image: b, blocks: [] }); return; }
      if (b.kind === 'image' && CERTIFICATE.test(b.ptr)) { flushRun(i); flushCards(i); certs.push(b); return; }
      if (cards.length && b.kind !== 'image') { cards[cards.length - 1].blocks.push(b); return; }
      flushCerts(i); flushCards(i);
      run.push(b);
    });
    flushRun('end'); flushCards('end'); flushCerts('end');
    if (pairImage && pairSlot != null) {
      // The photograph and the text that sits beside it in the approved About composition: two columns on
      // wide viewports, stacked in source order on narrow ones.
      const before = out.slice(0, pairSlot).filter(Boolean);
      const after = out.slice(pairSlot + 1).filter(Boolean);
      const figure = React.createElement('figure', { key: key + '-fig', style: { margin: 0, minWidth: 0, width: '100%', maxWidth: pairImage.width + 'px' } },
        img(pairImage, key + '-fig-im', { display: 'block', width: '100%', height: 'auto', borderRadius: '4px' }));
      const textSide = React.createElement('div', { key: key + '-txt', style: { minWidth: 0 } }, ...before.concat(after));
      // Source order decides which column comes first, so the narrow-screen stack matches the source: a
      // section whose photograph precedes its headings keeps the photograph first.
      const figureFirst = pairSlot === 0;
      return [React.createElement('div', { key: key + '-pair', style: { display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: '28px 48px', alignItems: 'center' } },
        ...(figureFirst ? [figure, textSide] : [textSide, figure]))];
    }
    return out.filter(Boolean);
  }

  function readerVals(R, guard) {
    return {
      hasReader6c: true, Z: R,
      hasCrumbs: !!(R.crumbs && R.crumbs.length),
      crumbs: (R.crumbs || []).slice(0, -1).map(c => ({ label: c.label, url: A + c.path })),
      crumbLast: (R.crumbs && R.crumbs.length) ? R.crumbs[R.crumbs.length - 1].label : '',
      sections: R.components.map((c, ci) => ({
        key: 'st' + ci, component: c.component, ptr: c.ptr,
        isNav: false, isSection: true,
        navLabel: R.h1 + ' \u2014 related pages',
        el: composeSection(c, 'st' + ci, guard)
      }))
    };
  }
  window.AHV_STORY_RENDER = { resolveRoute, applyHead, readerVals, A };
})();
