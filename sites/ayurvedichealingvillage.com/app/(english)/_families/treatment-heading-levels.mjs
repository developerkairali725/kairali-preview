/** Match the treatment finder's existing H2 snapshot without changing frozen source views. */
export function treatmentHeadingLevels(html, route, variant) {
  if (route !== '/ayurvedic-treatments/' && route !== '/all-programs/') return html;
  // Desktop has programme cards and three messages; mobile cards already use H2.
  // Leave a changed or unrelated template intact until its hierarchy is reviewed.
  const expected = variant === 'desktop' ? 4 : variant === 'mobile' ? 3 : 0;
  if (!expected || (html.match(/<h3\b/g) || []).length !== expected || (html.match(/<\/h3>/g) || []).length !== expected) return html;
  return html.replace(/<h3\b/g, '<h2').replace(/<\/h3>/g, '</h2>');
}
