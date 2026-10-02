import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { relayConfigProblem } from '../lib/form-relay.ts';
import { POST as leadPost } from '../app/api/lead/route.ts';
import { POST as uploadPost } from '../app/api/application-upload/route.ts';
import { validationProblem } from '../lib/lead-validation.ts';
import { guideDownloadUrl, guideLanguageCount } from '../lib/guide-download.ts';

const read = (relative) => fs.readFileSync(new URL(relative, import.meta.url), 'utf8');

test('the form relay is HTTPS-only with a strong key; there is no direct-database or plain-HTTP mode', () => {
  const good = { AHV_FORM_RELAY_URL: 'https://relay.example.test/ahv-form-relay/', AHV_FORM_RELAY_SECRET: 'x'.repeat(48) };
  assert.equal(relayConfigProblem({}), 'missing');
  assert.equal(relayConfigProblem(good), null);
  assert.equal(relayConfigProblem({ ...good, AHV_FORM_RELAY_URL: 'http://relay.example.test/ahv-form-relay/' }), 'insecure_transport');
  assert.equal(relayConfigProblem({ ...good, AHV_FORM_RELAY_URL: 'mysql://db.example.test:3306/' }), 'insecure_transport');
  assert.equal(relayConfigProblem({ ...good, AHV_FORM_RELAY_URL: 'https://user:pw@relay.example.test/' }), 'invalid_url');
  assert.equal(relayConfigProblem({ ...good, AHV_FORM_RELAY_SECRET: 'short' }), 'weak_secret');
  assert.equal(relayConfigProblem({ ...good, AHV_FORM_RELAY_KEY_ID: 'bad id!' }), 'invalid_key_id');
  for (const file of ['../lib/form-relay.ts', '../lib/lead-store.ts', '../app/api/lead/route.ts', '../app/api/application-upload/route.ts']) {
    const source = read(file);
    assert.doesNotMatch(source, /mysql2|AHV_DB_|rejectUnauthorized|NODE_TLS_REJECT_UNAUTHORIZED/, file);
  }
  assert.match(read('../lib/form-relay.ts'), /redirect: 'error'/);
});

test('server validation follows the real required fields and permits optional OPD email', () => {
  assert.equal(validationProblem('contact', { full_name: 'Test', countrycode: '+91', phone: '9999999999', email: 'test@example.com' }), null);
  assert.equal(validationProblem('contact', { full_name: 'Test', countrycode: '+91', phone: '', email: 'test@example.com' }), 'MISSING_REQUIRED_FIELDS');
  assert.equal(validationProblem('opd', { full_name: 'Test', age: '35', gender: 'Female', phone: '9999999999', email: '', symptoms: 'Test', consent: true }), null);
  assert.equal(validationProblem('opd', { full_name: 'Test', age: '35', gender: 'Female', phone: '9999999999', symptoms: 'Test', consent: false }), 'MISSING_REQUIRED_FIELDS');
  assert.equal(validationProblem('apply-now', { application_type: 'job-detail', full_name: 'Test', phone: '9999999999', email: 'test@example.com', cover_letter: 'Test', privacy_consent: true }), 'MISSING_REQUIRED_FIELDS');
  assert.equal(validationProblem('landing-page', { landing_page_path: '/panchkarma-treatment.html', email: 'test@example.com' }), null);
  assert.equal(validationProblem('landing-page', { landing_page_path: '', email: 'test@example.com' }), 'MISSING_REQUIRED_FIELDS');
});

test('unconfigured lead and upload routes fail closed before reading personal data', async () => {
  const keys = ['AHV_FORM_RELAY_URL', 'AHV_FORM_RELAY_SECRET', 'AHV_FORM_RELAY_KEY_ID', 'AHV_LEAD_SHEET_WEBHOOK_URL', 'AHV_LEAD_SHEET_WEBHOOK_SECRET'];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const key of keys) delete process.env[key];
  const leadRequest = new Request('https://example.test/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ fields: { email: 'private@example.test' } }) });
  const leadResponse = await leadPost(leadRequest);
  assert.equal(leadResponse.status, 503);
  assert.equal(leadRequest.bodyUsed, false);
  const uploadRequest = new Request('https://example.test/api/application-upload', { method: 'POST', headers: { 'content-type': 'multipart/form-data; boundary=x' }, body: '--x--' });
  const uploadResponse = await uploadPost(uploadRequest);
  assert.equal(uploadResponse.status, 503);
  assert.equal(uploadRequest.bodyUsed, false);
  for (const key of keys) previous[key] === undefined ? delete process.env[key] : process.env[key] = previous[key];
});

test('upload route rejects cross-origin, oversized and repeated requests before parsing multipart data', async () => {
  const values = {
    AHV_FORM_RELAY_URL: 'https://relay.example.test/ahv-form-relay/', AHV_FORM_RELAY_SECRET: 'r'.repeat(48),
    AHV_LEAD_SHEET_WEBHOOK_URL: 'https://script.google.com/macros/s/test/exec',
    AHV_LEAD_SHEET_WEBHOOK_SECRET: 'test-secret-that-is-at-least-24-characters',
  };
  const previous = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]));
  Object.assign(process.env, values);
  const makeRequest = (headers = {}) => new Request('https://preview.example.test/api/application-upload', {
    method: 'POST',
    headers: { 'content-type': 'multipart/form-data; boundary=x', 'content-length': '5', origin: 'https://preview.example.test', ...headers },
    body: '--x--',
  });
  const crossOrigin = makeRequest({ origin: 'https://attacker.example' });
  assert.equal((await uploadPost(crossOrigin)).status, 403);
  assert.equal(crossOrigin.bodyUsed, false);
  const oversized = makeRequest({ 'content-length': String(5 * 1024 * 1024) });
  assert.equal((await uploadPost(oversized)).status, 413);
  assert.equal(oversized.bodyUsed, false);
  for (let index = 0; index < 6; index += 1) {
    assert.equal((await uploadPost(makeRequest({ 'x-forwarded-for': '203.0.113.77' }))).status, 400);
  }
  const limited = makeRequest({ 'x-forwarded-for': '203.0.113.77' });
  assert.equal((await uploadPost(limited)).status, 429);
  assert.equal(limited.bodyUsed, false);
  for (const [key, value] of Object.entries(previous)) value === undefined ? delete process.env[key] : process.env[key] = value;
});

test('React form payloads await server acceptance and retain an error path', () => {
  for (const file of ['../public/ahv/views/ahv-page-enquiry-desktop.json', '../public/ahv/views/ahv-page-enquiry-mobile.json']) {
    const { logic, template } = JSON.parse(read(file));
    assert.match(logic, /out\.contactSubmit = async/);
    assert.match(logic, /await this\.postLead/);
    assert.doesNotMatch(logic, /fetch\('\/api\/lead\/'[\s\S]*?\.catch\(\(\) => \{\}\)/);
    assert.match(logic, /utm_source/);
    assert.match(logic, /uploadApplicationFile/);
    assert.match(logic, /data\.fileUrl/);
    assert.doesNotMatch(logic, /data\.fileRef/);
    assert.match(logic, /out\.cNotice = st\.cNotice/);
    assert.match(logic, /out\.aNotice = st\.aNotice/);
    assert.match(logic, /out\.jNotice = st\.jNotice/);
    assert.match(logic, /out\.oSubmitError = st\.oSubmitError/);
    assert.match(logic, /const timeout = setTimeout\(\(\) => controller\.abort\(\), 15000\)/);
    assert.match(logic, /out\.aGroupSet/);
    assert.match(logic, /site_language/);
    assert.match(logic, /offerGuide\(data\.guideUrl\)/);
    assert.match(template, /\{\{ cNotice \}\}/);
    assert.match(template, /\{\{ aNotice \}\}/);
    assert.match(template, /data-job-closed="true"/);
    assert.match(template, /\{\{ oSubmitError \}\}/);
    assert.match(template, /consultation request has been received/);
  }
});

test('OPD creates visible status feedback, preserves failures and resets only after success', () => {
  const script = read('../public/design/opd-form-submit.js');
  assert.match(script, /document\.createElement\('p'\)/);
  assert.match(script, /Your details are still here/);
  assert.match(script, /form\.reset\(\)/);
  assert.match(script, /submissionToken = null/);
  assert.match(script, /query\.get\('utm_source'\)/);
});

test('application files use the approved Drive folder with strict size and type limits', () => {
  const route = read('../app/api/application-upload/route.ts');
  const bridge = read('../lib/lead-sheet-bridge.ts');
  const receiver = read('../scripts/apps-script/lead-sheet.gs');
  const schema = read('../db/004-opd-optional-email.sql');
  const formData = read('../public/ahv/assets/enquiry-family-data.js');
  assert.match(route, /MAX_FILE_BYTES = 4 \* 1024 \* 1024/);
  assert.match(route, /MAX_MULTIPART_BYTES/);
  assert.match(route, /requestOriginAllowed/);
  assert.match(route, /uploadRateAllowed/);
  assert.ok(route.indexOf("request.headers.get('content-length')") < route.indexOf('request.formData()'));
  assert.ok(route.indexOf('uploadRateAllowed(request)') < route.indexOf('request.formData()'));
  assert.match(route, /\['\.pdf', '\.doc', '\.docx'\]/);
  assert.doesNotMatch(route, /export async function GET/);
  assert.match(route, /fileUrl: uploaded\.fileUrl/);
  assert.match(bridge, /uploadApplicationFileToDrive/);
  assert.match(receiver, /1GQS5u-y33Io8i7ofgvHczrJGB1j0-AlO/);
  assert.match(receiver, /folder\.createFile/);
  assert.match(receiver, /DriveApp\.Access\.PRIVATE/);
  assert.doesNotMatch(receiver, /error\.stack/);
  assert.match(receiver, /AHV_LEAD_WEBHOOK_SECRET/);
  assert.match(formData, /"name":"file-803"[\s\S]*?"accept":"\.jpg,\.jpeg,\.png,\.webp,image\/jpeg,image\/png,image\/webp"/);
  assert.match(formData, /"name":"file-809"[\s\S]*?"accept":"\.pdf,\.doc,\.docx,application\/pdf,application\/msword,application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document"/);
  assert.match(schema, /MODIFY COLUMN `email` varchar\(190\) NULL/);
});

test('lead route mirrors the stored database row to the scoped Sheet and waits for acknowledgement', () => {
  const route = read('../app/api/lead/route.ts');
  const store = read('../lib/lead-store.ts');
  const relay = read('../bridge/form-relay/relay-core.php');
  const bridge = read('../lib/lead-sheet-bridge.ts');
  const receiver = read('../scripts/apps-script/lead-sheet.gs');
  assert.match(route, /await deliverLeadToSheet\(table, stored\.row, submissionToken\)/);
  assert.match(route, /SHEET_SYNC_FAILED/);
  // The stored row the Sheet receives is the relay's read-back of the database row.
  assert.match(relay, /SELECT \* FROM/);
  assert.match(store, /row\.submission_token/);
  assert.match(bridge, /reply\.result !== 'success'/);
  assert.match(receiver, /1z3sN5rbYl18ECQXzNRTUdO4IuJQ2rXxX7RMDiqJDa54/);
  assert.match(receiver, /alreadyPresent\(mainSheet, mainHeaders, 'id', submissionToken\)/);
  assert.match(receiver, /safeCell/);
  assert.match(receiver, /'enquiry-form'/);
  assert.match(receiver, /'online-consultation'/);
  assert.match(receiver, /'landing-page'/);
  assert.match(receiver, /'exit-intent'/);
});

test('all landing page form families use the shared scoped destination', () => {
  const script = read('../public/design/landing-page-form-submit.js');
  const layout = read('../app/(english)/_families/site-document.tsx');
  const component = read('../app/(lp)/_components/campaign-enquiry-form.tsx');
  const schema = read('../db/003-landing-page.sql');
  const legacyRoutes = [...script.matchAll(/^\s{4}'(\/[^']+)',$/gm)].map((match) => match[1]);
  assert.equal(legacyRoutes.length, 17);
  assert.equal(new Set(legacyRoutes).size, 17);
  assert.match(script, /form: 'landing-page'/);
  assert.match(script, /utm_source/);
  assert.match(script, /lead_source_url/);
  assert.match(script, /response\.ok && data\.ok === true/);
  assert.match(layout, /landing-page-form-submit\.js/);
  assert.match(component, /form:'landing-page'/);
  assert.match(component, /submissionToken/);
  for (const column of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'lead_source_url', 'submit_time', 'submit_ip']) {
    assert.match(schema, new RegExp('`' + column + '`'));
  }
});

test('successful non-newsletter forms receive the final language-matched Healing Secrets guide', () => {
  const manifest = JSON.parse(read('../public/documents/manifest.json'));
  const languages = ['en', 'hi', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'ru', 'ar', 'zh', 'ja', 'ko'];
  assert.equal(guideLanguageCount(), 13);
  for (const language of languages) {
    const url = guideDownloadUrl(language === 'en' ? 'en-US' : language);
    assert.match(url, new RegExp(`^/documents/pdf/healing-secrets/${language}/`));
    const record = manifest.files.find((file) => file.doc === 'healing-secrets' && file.lang === language && file.status === 'final');
    assert.equal(url, `/documents/${record.screen.path}`);
  }
  assert.equal(guideDownloadUrl('unsupported'), guideDownloadUrl('en'));
  assert.match(read('../app/api/lead/route.ts'), /guideUrl: guideDownloadUrl\(body\.site_language\)/);
  assert.match(read('../public/design/opd-form-submit.js'), /data\.guideUrl/);
  assert.match(read('../public/design/landing-page-form-submit.js'), /data\.guideUrl/);
  assert.match(read('../app/(lp)/_components/campaign-enquiry-form.tsx'), /result\.guideUrl/);
  assert.doesNotMatch(read('../public/design/newsletter.js'), /guideUrl|healing-secrets/i);
});

test('R10 lead cannot bypass name, phone or contact consent on the server',()=>{
 const valid={landing_page_path:'/ayurvedic-treatment-packages.html',fname:'QA',phone:'+919999999999',email:'qa@example.com',consent:true};
 assert.equal(validationProblem('landing-page',valid),null);
 for(const override of [{fname:''},{phone:''},{consent:false},{consent:'true'}])assert.equal(validationProblem('landing-page',{...valid,...override}),'MISSING_REQUIRED_FIELDS');
});
