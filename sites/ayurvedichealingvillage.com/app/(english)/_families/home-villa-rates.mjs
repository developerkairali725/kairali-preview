/** Remove rates only from the homepage villa showcase, including localized snapshots. */
export function removeHomeVillaRates(html, route) {
  if (route !== '/' || !html) return html;
  return html.replace(/<section\b[^>]*>[\s\S]*?<\/section>/gi, section => {
    if (!section.includes('data-ahv-villa-summary=')) return section;
    const stack = [], nodes = [], amounts = [];
    const tokens = /<!--[\s\S]*?-->|<[^>]*>|[^<]+/g;
    let match;
    while ((match = tokens.exec(section))) {
      const token = match[0];
      const close = token.match(/^<\/([\w-]+)/);
      const open = token.match(/^<([\w-]+)/);
      if (close) {
        const index = stack.map(node => node.tag).lastIndexOf(close[1].toLowerCase());
        if (index >= 0) {
          stack[index].end = tokens.lastIndex;
          stack.length = index;
        }
      } else if (open) {
        const node = {tag: open[1].toLowerCase(), start: match.index, end: 0, parent: stack.at(-1), children: []};
        if (node.parent) node.parent.children.push(node);
        nodes.push(node);
        if (!/\/\s*>$/.test(token) && !/^(?:img|br|hr|input|meta|link|source|area|wbr)$/.test(node.tag)) stack.push(node);
      } else if (!token.startsWith('<') && /\{\{\s*rate\.(?:suite|royal|classic|deluxe)(?:Alt)?\s*\}\}|[₹$€]\s*[\d٠-٩۰-۹]/.test(token)) {
        if (stack.length) amounts.push(stack.at(-1));
      }
    }
    // A rate wrapper contains only spans. Stop before the villa title/details row.
    const spansOnly = node => node.children.every(child => child.tag === 'span' && spansOnly(child));
    const removals = new Set();
    for (let node of amounts) {
      while (node.parent && /^(?:div|span)$/.test(node.parent.tag) && spansOnly(node.parent)) node = node.parent;
      if (node.end && /^(?:div|span)$/.test(node.tag)) removals.add(node);
    }
    const ranges = [...removals].filter(node => ![...removals].some(other => other !== node && other.start <= node.start && other.end >= node.end));
    for (const node of ranges.sort((a, b) => b.start - a.start)) section = section.slice(0, node.start) + section.slice(node.end);
    return section;
  });
}
