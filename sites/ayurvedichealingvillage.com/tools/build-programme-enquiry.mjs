/** Form-only reuse of the accepted enquiry family for active main programmes.
 * Keeps its translated copy, required fields and contact payload. No page head,
 * campaign classification or programme content is taken from the enquiry page.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const componentName = 'AHV Programme Enquiry';
// Digestive is held at its production baseline, with an external contact journey.
export const programmeViews = ['weight-loss-programme']
  .flatMap(name => ['desktop', 'mobile'].map(variant => `ahv-page-${name}-${variant}`));

export function programmeEnquiryComponent(enquiry) {
  const form = enquiry.template.match(/<form data-form="contact"[\s\S]*?<\/form>/)?.[0];
  if (!form) throw new Error('Canonical contact form missing');
  const method = name => {
    const line = enquiry.logic.split('\n').find(line => new RegExp(`^  (?:async )?${name}\\(`).test(line));
    if (!line) throw new Error(`Canonical contact method missing: ${name}`);
    return line;
  };
  const start = enquiry.logic.indexOf('      out.programmeOptions =');
  const end = enquiry.logic.indexOf("\n    }\n    if (R.variant === 'careers-apply')", start);
  if (start < 0 || end < 0) throw new Error('Canonical contact controller missing');
  const handlers = enquiry.logic.slice(start, end);
  // Match the released static contact controller's acknowledgement allowance.
  const transport = method('postLead').replace('controller.abort(), 10000)', 'controller.abort(), 45000)');
  if (transport === method('postLead')) throw new Error('Review canonical acknowledgement timeout before regenerating');
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head><body>
<x-dc>
<helmet><style>
#programme-enquiry{width:min(840px,94%);box-sizing:border-box;margin:0 auto;padding:40px 0;scroll-margin-top:120px}
#programme-enquiry input,#programme-enquiry select,#programme-enquiry textarea,#programme-enquiry button{font-family:'Mulish',sans-serif;font-size:17px;color:#2A2118}
#programme-enquiry input,#programme-enquiry select,#programme-enquiry textarea{width:100%;box-sizing:border-box;min-height:48px;padding:10px 14px;border:1px solid #75695A;border-radius:4px;background:#fff}
#programme-enquiry input[name=country_code],#programme-enquiry input[name=phone],#programme-enquiry input[name=email]{direction:ltr;text-align:left}
#programme-enquiry textarea{min-height:110px;resize:vertical}
#programme-enquiry [aria-invalid=true]{border-color:#A32D2D;border-width:2px}
#programme-enquiry form>div{min-width:0}
@media(max-width:767px){#programme-enquiry{width:100%;padding:32px 20px}#programme-enquiry form[data-form]{padding:24px 18px!important}}
</style></helmet>
<section id="programme-enquiry" aria-labelledby="programme-enquiry-heading">
<h2 id="programme-enquiry-heading" style="font-family:'Marcellus',serif;font-size:clamp(26px,2.4vw,34px);line-height:1.2;margin:0 0 8px">{{ C.form.h2 }}</h2>
<p style="margin:0 0 24px;font-size:17.5px;color:#514a3f">{{ C.form.sub }}</p>
${form}
</section>
</x-dc>
<script type="text/x-dc" data-dc-script data-props="{}">
class Component extends DCLogic {
  state = { cv: { fname: '', country_code: '', phone: '', programme: '', email: '', message: '' }, cErr: {}, cValid: false, cNotice: '', cPending: false };
${method('focusFirstInvalid')}
  tracking() { const campaign = window.AHV_LEAD_RECEIPT.attribution(); return Object.assign({}, campaign, { site_language: window.AHV_LEAD_RECEIPT.siteLanguage(), lead_source_url: location.href.slice(0, 500), referrer: (document.referrer || '').slice(0, 500) }); }
${transport}
${method('notConnected')}
${method('offerGuide')}
  renderVals() {
    const source = window.AHV_ENQUIRY.routes.find(route => route.path === '/enquiry-form/');
    const C = Object.assign({}, source, { form: Object.assign({}, source.form, { sub: window.AHV_LEAD_RECEIPT.contactIntro() }) });
    const V = window.AHV_ENQUIRY_RENDER.V, st = this.state, out = { C };
    const req = { fname: V.name(st.cv.fname), phone: V.phone(st.cv.phone), email: V.email(st.cv.email) };
${handlers}
    return out;
  }
}
</script>
</body></html>
`;
}

export function integrateProgrammeView(view) {
  if (['ahv-page-digestive-wellness-gut-health-desktop', 'ahv-page-digestive-wellness-gut-health-mobile'].includes(view.id)) {
    throw new Error('Digestive page is held at its production baseline');
  }
  const output = structuredClone(view);
  const marker = `<dc-import name="${componentName}"></dc-import>`;
  if (!output.template.includes(marker)) {
    const nav = '<nav aria-label="On this page"';
    if (!output.template.includes(nav)) throw new Error(`Programme navigation missing: ${view.id}`);
    output.template = output.template.replace(nav, marker + '\n' + nav);
  }
  output.template = output.template.replaceAll('href="https://ayurvedichealingvillage.com/enquiry-form/"', 'href="#programme-enquiry"');
  output.scripts = [...new Set([...(view.scripts || []), '/ahv/assets/enquiry-family-data.js', '/ahv/assets/enquiry-family-render.js'])];
  return output;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const read = file => JSON.parse(fs.readFileSync(path.join(SITE, file), 'utf8'));
  const write = (file, value) => {
    const filename = path.join(SITE, file);
    const indent = fs.readFileSync(filename, 'utf8').match(/\n( +)"/)?.[1] || '  ';
    fs.writeFileSync(filename, JSON.stringify(value, null, indent) + '\n');
  };
  fs.writeFileSync(path.join(SITE, 'public/ahv/components', componentName + '.dc.html'), programmeEnquiryComponent(read('public/ahv/views/ahv-page-enquiry-desktop.json')));
  for (const id of programmeViews) write(`public/ahv/views/${id}.json`, integrateProgrammeView(read(`public/ahv/views/${id}.json`)));
  const map = read('english-candidate/component-map.json');
  map.resources['./AHV%20Programme%20Enquiry.dc.html'] = '/ahv/components/AHV%20Programme%20Enquiry.dc.html';
  write('english-candidate/component-map.json', map);
  console.log(`Programme enquiry component and ${programmeViews.length} active programme views updated.`);
}
