/** The treatment finder has no H2 wrapper above its cards or search messages. */
export function treatmentHeadingLevels(view) {
  if (view.id !== 'ahv-page-ayurvedic-treatments-desktop') return view;
  const opens = view.template.match(/<h3\b/g) || [];
  const closes = view.template.match(/<\/h3>/g) || [];
  if (!opens.length && !closes.length) return view;
  if (opens.length !== 4 || closes.length !== 4) throw new Error('Treatment desktop heading anchors changed');
  view.template = view.template.replace(/<h3\b/g, '<h2').replace(/<\/h3>/g, '</h2>');
  return view;
}
