// Owner-reported local review repairs. Re-run after source imports; idempotent.
// No rates, medical claims, forms, or production configuration changes.
import fs from 'node:fs';
import vm from 'node:vm';

function view(name, change) {
  const file = `public/ahv/views/${name}.json`;
  const raw = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(raw);
  change(data);
  if (JSON.stringify(data) !== JSON.stringify(JSON.parse(raw))) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
    console.log(file);
  }
}
for (const variant of ['desktop', 'mobile']) {
  view(`ahv-page-gallery-${variant}`, data => {
    data.logic = data.logic.replace('guard: (e) => { e.preventDefault(); },', 'guard: () => {}, // real collection links retain native navigation');
  });
  view(`ahv-page-ayurveda-training-programme-${variant}`, data => {
    const section = data.template.match(/<section data-rate-reference=[\s\S]*?<\/section>/)?.[0];
    const faq = '<section id="faqs"';
    if (!section || !data.template.includes(faq)) throw new Error('Training tariff/FAQ anchor missing');
    const after = data.template.slice(data.template.indexOf(section) + section.length).trimStart();
    if (after.startsWith(faq)) return;
    data.template = data.template.replace(section, '').replace(faq, section + '\n' + faq);
  });
}
function dataset(name, route, change) {
  const file = `public/ahv/assets/${name}.js`;
  const raw = fs.readFileSync(file, 'utf8');
  const window = {};
  vm.runInNewContext(raw, { window });
  const key = Object.keys(window)[0];
  const data = window[key];
  const row = data.routes.find(r => r.path === route);
  if (!row) throw new Error(`Missing route ${route}`);
  const before = JSON.stringify(data);
  change(row);
  if (JSON.stringify(data) !== before) {
    fs.writeFileSync(file, `window.${key} = ${JSON.stringify(data)};\n`);
    console.log(file);
  }
}
dataset('policy-family-data', '/new-privacy-policy/', row => {
  row.h1 = 'Privacy Policy';
  if (row.metadata?.openGraph?.title === 'New Privacy Policy') row.metadata.openGraph.title = 'Privacy Policy';
});
dataset('enquiry-family-data', '/walk-in-ayurveda-treatment/', row => {
  const first = row.body[0];
  if (first?.text !== 'Kairali – The Ayurvedic Healing Village') return;
  if (!row.body[1]?.text.startsWith('Walk-In Ayurvedic OPD | Palakkad, Kerala')) throw new Error('Unexpected OPD heading structure');
  row.body.shift();
  const location = row.body[0];
  location.tag = 'h2';
  location.text = 'Walk-In Ayurvedic OPD | Palakkad, Kerala';
  location.tree = [{ k: 't', v: location.text }];
  // Keep the existing care heading; remove only the redundant promotional line.
});
// Reuse the approved partner-page artwork, not guessed or redrawn logos.
const partnerWindow = {};
vm.runInNewContext(fs.readFileSync('public/ahv/assets/our-partners-data.js', 'utf8'), { window: partnerWindow });
const partnerLogos = Object.values(partnerWindow)[0].logos;
for (const name of ['home-hi-fi-v4', 'home-mobile']) view(name, data => {
  const imageStyle = 'width:100%;max-width:180px;height:100px;object-fit:contain;display:block;margin:0 auto;background:#FFFFFF;border-radius:2px';
  for (const [label, id] of [['Lotus Travel', 'lotus-travel'], ['Air India', 'air-india']]) {
    const asset = partnerLogos.find(p => p.id === id);
    if (!asset || !fs.existsSync('public' + asset.src)) throw new Error('Missing approved partner artwork: ' + id);
    const placeholder = new RegExp('<span style="width:100%;aspect-ratio:400/250;[^\"]*">\\s*<span[^>]*>' + label + '</span>\\s*<span[^>]*></span>\\s*</span>', 'g');
    data.template = data.template.replace(placeholder, `<img src="${asset.src}" alt="${asset.alt}" width="180" height="100" style="${imageStyle}">`);
  }
  data.template = data.template.replace(/<img\b[^>]*src="\/ahv\/assets\/img\/partner-0[1-6]-[^\"]+"[^>]*>/g,
    tag => tag.replace(/style="[^"]*"/, `style="${imageStyle}"`));
});
