// Correct only reviewed article heading levels; retain every attribute, child and inline style.
export function articleContactHeadingHtml(html, route) {
  const rule = repairArticleContactHeading(null, route);
  if (!rule) return html;
  const [from, to, pointers] = rule;
  return html.replace(new RegExp('<' + from + '\\b([^>]*)>([\\s\\S]*?)<\\/' + from + '>', 'g'), (whole, attrs, inner) => {
    const pointer = /\bdata-source-pointer="\/sections\/3\/c\/3\/c\/(\d+)"/.exec(attrs);
    return !pointers || (pointer && pointers.includes(Number(pointer[1]))) ? '<' + to + attrs + '>' + inner + '</' + to + '>' : whole;
  });
}
// Self-contained: boot.ts serializes this function. Without a root it returns the route's reviewed rule,
// so the server snapshot and the live page share one table: [source tag, corrected tag, reviewed
// /sections/3/c/3/c/<n> pointers, or null for every heading of that tag]. The localized monsoon article
// (its English URL is the separate campaign page) carries no source pointers; its only H4s are the
// reason and condition cards directly under H2 sections.
export function repairArticleContactHeading(root, route) {
  const rules = {
    '/ayurveda-treatment/': ['h4', 'h3', [12]],
    '/why-get-training-in-ayurveda/': ['h4', 'h2', [4, 8, 12, 16, 20, 24, 28]],
    '/why-pick-a-yoga-or-yoga-retreat/': ['h4', 'h2', [4, 8, 12, 16, 20, 24, 28, 32, 36]],
    '/meditation/': ['h4', 'h2', [4, 8, 14, 20, 24]],
    '/new-to-ayurveda/': ['h3', 'h2', [2, 8, 16, 20, 24, 28]],
    '/new-to-yoga/': ['h3', 'h2', [2, 6, 12, 16, 20, 24, 28, 32, 36, 40]],
    '/yoga-retreats-for-everyone/': ['h4', 'h3', [4, 8]],
    '/ayurveda-workshop/': ['h4', 'h3', [4, 26]],
    '/karkidaka-chikitsha-or-monsoon-wellness.html': ['h4', 'h3', null],
    '/what-is-yoga/': ['h3', 'h2', [2, 8, 16, 26, 34, 38]],
    '/yoga-classes-practical/': ['h4', 'h3', [4, 8, 14, 20, 24, 28, 32]],
    '/yoga-classes-theory/': ['h4', 'h3', [4, 8, 12, 18, 24, 30, 34]],
  };
  const rule = Object.prototype.hasOwnProperty.call(rules, route) ? rules[route] : null;
  if (!rule) return;
  if (!root) return rule;
  const selector = rule[2] ? rule[2].map(n => rule[0] + '[data-source-pointer="/sections/3/c/3/c/' + n + '"]').join(',') : rule[0];
  const nodes = Array.from(root.querySelectorAll(selector));
  if (root.matches && root.matches(selector)) nodes.unshift(root);
  for (const old of nodes) {
    const replacement = old.ownerDocument.createElement(rule[1]);
    for (const attr of old.attributes) replacement.setAttribute(attr.name, attr.value);
    while (old.firstChild) replacement.appendChild(old.firstChild);
    old.replaceWith(replacement);
  }
}
