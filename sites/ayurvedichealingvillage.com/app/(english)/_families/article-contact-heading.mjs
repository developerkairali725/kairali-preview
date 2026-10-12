// Correct only the reviewed contact block; retain every attribute, child and inline style.
export function articleContactHeadingHtml(html, route) {
  if (route !== '/ayurveda-treatment/') return html;
  return html.replace(/<h4\b([^>]*\bdata-source-pointer="\/sections\/3\/c\/3\/c\/12"[^>]*)>([\s\S]*?)<\/h4>/g, '<h3$1>$2</h3>');
}
export function repairArticleContactHeading(root, route) {
  if (route !== '/ayurveda-treatment/') return;
  const selector = 'h4[data-source-pointer="/sections/3/c/3/c/12"]';
  const nodes = Array.from(root.querySelectorAll(selector));
  if (root.matches && root.matches(selector)) nodes.unshift(root);
  for (const old of nodes) {
    const replacement = old.ownerDocument.createElement('h3');
    for (const attr of old.attributes) replacement.setAttribute(attr.name, attr.value);
    while (old.firstChild) replacement.appendChild(old.firstChild);
    old.replaceWith(replacement);
  }
}
