/** Match the treatment finder's existing H2 snapshot without changing frozen source views. */
export function treatmentHeadingLevels(html, route) {
  if (route !== '/ayurvedic-treatments/') return html;
  // Four top-level desktop headings: programme cards and three search messages.
  // Leave a changed or unrelated template intact until its hierarchy is reviewed.
  if ((html.match(/<h3\b/g) || []).length !== 4 || (html.match(/<\/h3>/g) || []).length !== 4) return html;
  return html.replace(/<h3\b/g, '<h2').replace(/<\/h3>/g, '</h2>');
}
