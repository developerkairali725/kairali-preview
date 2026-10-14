import copy from '../../../english-candidate/staff-experience-copy.json' with { type: 'json' };

// Fixed, documented lower bounds as of September 2026, not lifetime totals.
export function staffExperienceCopyFor(route, locale = 'en') {
  return route === '/' ? copy.locales[locale] || [] : [];
}

// Self-contained for the existing serialized desktop loader. Only exact three-line
// staff metadata is eligible; roles, languages, biographies and markup stay intact.
export function applyStaffExperienceHtml(html, edits) {
  const rules = (edits || []).filter(e => e.kind === 'staff-experience');
  if (!rules.length || !html) return html;
  const decode = s => s.replace(/&(?:amp|lt|gt|quot|apos|nbsp|ndash|mdash|rsquo|lsquo|rdquo|ldquo|#\d+|#x[\da-f]+);/gi, x => {
    const n = x.slice(1, -1);
    const names = {amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' ',ndash:'–',mdash:'—',rsquo:'’',lsquo:'‘',rdquo:'”',ldquo:'“'};
    return names[n] || (n[0] === '#' ? String.fromCodePoint(n[1].toLowerCase() === 'x' ? parseInt(n.slice(2), 16) : parseInt(n.slice(1), 10)) : x);
  });
  const normal = s => decode(s).replace(/\s+/g, ' ').trim();
  const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return html.replace(/<(script|style|svg|noscript|form)\b[^>]*>[\s\S]*?<\/\1>|(<div\b[^>]*>)([^<>]*)(<br\b[^>]*>)([^<>]*)(<br\b[^>]*>)([^<>]*)(<\/div>)/gi,
    (whole, excluded, open, first, br1, middle, br2, last, close) => {
      if (excluded) return whole;
      const key = normal(first) + '[[TAG_1]]' + normal(middle) + '[[TAG_2]]' + normal(last);
      const rule = rules.find(e => e.old === key);
      if (!rule) return whole;
      const next = rule.new.split(/\[\[TAG_[12]\]\]/);
      if (next.length !== 3 || next[0] !== normal(first) || next[2] !== normal(last)) return whole;
      return open + first + br1 + (middle.match(/^\s*/) || [''])[0] + escape(next[1]) + (middle.match(/\s*$/) || [''])[0] + br2 + last + close;
    });
}

// Reuses the family content-review observer; idempotent and no new observer.
export function applyStaffExperienceDom(root, edits) {
  const rules = (edits || []).filter(e => e.kind === 'staff-experience');
  if (!rules.length || !root) return;
  if (root.nodeType === 3) root = root.parentElement;
  if (!root) return;
  const nodes = root.querySelectorAll ? Array.from(root.querySelectorAll('div')) : [];
  if (root.nodeType === 1 && root.tagName === 'DIV') nodes.unshift(root);
  const normal = s => (s || '').replace(/\s+/g, ' ').trim();
  for (const el of nodes) {
    if (el.closest('script,style,svg,noscript,form')) continue;
    const n = Array.from(el.childNodes).filter(n => n.nodeType !== 8);
    if (n.length !== 5 || ![0,2,4].every(i => n[i].nodeType === 3) || n[1].nodeName !== 'BR' || n[3].nodeName !== 'BR') continue;
    const key = normal(n[0].nodeValue) + '[[TAG_1]]' + normal(n[2].nodeValue) + '[[TAG_2]]' + normal(n[4].nodeValue);
    const rule = rules.find(e => e.old === key);
    if (!rule) continue;
    const next = rule.new.split(/\[\[TAG_[12]\]\]/);
    if (next.length !== 3 || next[0] !== normal(n[0].nodeValue) || next[2] !== normal(n[4].nodeValue)) continue;
    n[2].nodeValue = (n[2].nodeValue.match(/^\s*/) || [''])[0] + next[1] + (n[2].nodeValue.match(/\s*$/) || [''])[0];
  }
}
