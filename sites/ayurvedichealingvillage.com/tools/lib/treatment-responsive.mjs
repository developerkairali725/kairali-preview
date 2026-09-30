// Narrow mobile treatment-finder delivery; desktop and other finder routes stay byte-identical.
export function treatmentResponsive(view) {
  if (view.id !== 'ahv-page-ayurvedic-treatments-mobile') return view;
  if (view.template.includes('srcset="{{ p.trainingSrcset }}"')) return view;
  const img = '<img src="{{ p.i }}" width="1920"';
  const row = 'h: HOST_URL + p.r, t: p.t, s: p.s, i: p.i, fw: p.fw,';
  if (view.template.split(img).length !== 2 || view.logic.split(row).length !== 2) throw new Error('Treatment responsive anchors changed');
  if (!view.template.includes('width:min(1220px,92%)') || !view.template.includes('grid-template-columns:1fr;gap:20px')) throw new Error('Treatment mobile sizing needs review');
  view.template = view.template.replace(img, '<img src="{{ p.i }}" srcset="{{ p.trainingSrcset }}" sizes="{{ p.trainingSizes }}" width="1920"');
  view.logic = view.logic.replace(row, row + '\n        trainingSrcset: p.i === "/ahv/assets/img/ayurveda-training.webp" ? "/ahv/assets/img/ayurveda-training-768.webp 768w, /ahv/assets/img/ayurveda-training.webp 1920w" : "",\n        trainingSizes: p.i === "/ahv/assets/img/ayurveda-training.webp" ? "(min-width: 1327px) 1218px, calc(92vw - 2px)" : "",');
  return view;
}
