// AHV /accreditations/ — article block renderer (p / h2 / ol / ul / li with strong, br, a). Data: assets/accreditations-data.js.
(function () {
  const A = 'https://ayurvedichealingvillage.com';
  function inline(node, key, guard, inHeading) {
    if (node.k === 't') return node.v;
    if (node.tag === 'br') return React.createElement('br', { key });
    const props = { key }; const st = {};
    if (node.tag === 'strong') st.fontWeight = inHeading ? 'inherit' : 700;
    if (node.tag === 'em') st.fontStyle = 'italic';
    if (node.tag === 'a' && node.attrs && node.attrs.href) {
      const h = node.attrs.href; Object.assign(st, { color: '#006038', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 600 });
      if (h.startsWith('/')) { props.href = A + h; props.onClick = guard; } else { props.href = h; props.rel = 'noopener'; }
    }
    if (Object.keys(st).length) props.style = st;
    return React.createElement(node.tag, props, ...(node.c || []).map((c, i) => inline(c, key + '-' + i, guard, inHeading)));
  }
  function blocks(D, guard, mobile) {
    const serif = "'Marcellus',serif";
    return D.body.map((b, i) => {
      const key = 'b' + b.p; const extra = { 'data-pos': b.p, key };
      if (b.correction) extra['data-correction'] = b.correction;
      if (b.tag === 'h2') return React.createElement('h2', Object.assign(extra, { id: (b.attrs && b.attrs.id) || key, style: { fontFamily: serif, fontWeight: 400, fontSize: mobile ? '25px' : 'clamp(25px,2.2vw,30px)', lineHeight: 1.25, margin: i === 0 ? '0 0 14px' : '40px 0 14px', color: '#2A2118', textWrap: 'balance', scrollMarginTop: '96px' } }), ...(b.c || []).map((c, j) => inline(c, key + '-' + j, guard, true)));
      if (b.tag === 'p') return React.createElement('p', Object.assign(extra, { style: { margin: '0 0 18px', fontSize: mobile ? '17px' : '17.5px', lineHeight: 1.7, color: '#2A2118', textWrap: 'pretty' } }), ...(b.c || []).map((c, j) => inline(c, key + '-' + j, guard, false)));
      if (b.tag === 'ol' || b.tag === 'ul') return React.createElement(b.tag, Object.assign(extra, { style: { margin: '0 0 18px', padding: '0 0 0 ' + (b.tag === 'ol' ? '28px' : '26px'), listStyle: b.tag === 'ol' ? 'decimal' : 'disc' } }),
        ...(b.c || []).filter(li => li.k === 'e').map((li, j) => React.createElement('li', { key: key + '-li' + j, style: { margin: '0 0 12px', fontSize: mobile ? '17px' : '17.5px', lineHeight: 1.7, color: '#2A2118', textWrap: 'pretty' } }, ...(li.c || []).map((c, k) => inline(c, key + '-li' + j + '-' + k, guard, false)))));
      return null;
    });
  }
  function contents(D) { return D.body.filter(b => b.tag === 'h2').map(b => ({ id: (b.attrs && b.attrs.id) || ('b' + b.p), label: (b.c || []).map(function t(n) { return n.k === 't' ? n.v : (n.c || []).map(t).join(''); }).join('').trim() })); }
  window.AHV_ACCREDITATIONS_RENDER = { blocks, contents, A };
})();
