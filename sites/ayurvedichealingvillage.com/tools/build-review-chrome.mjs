// One reviewed contact implementation, preserving each frozen locale's other
// chrome strings and behaviour. No translation catalogue or snapshot mutation.
import fs from 'node:fs';
const reviewed = fs.readFileSync('public/design/review-chrome.js','utf8');
const controls = reviewed.slice(reviewed.indexOf('  // Owner 5 Oct:'), reviewed.indexOf('  // OWNER-REG-02'));
const home = reviewed.slice(reviewed.indexOf('  function homeReviewRefinements()'), reviewed.indexOf('  function pass()'));
for (const locale of fs.readdirSync('public/ahv/l10n')) {
 const base = `public/ahv/l10n/${locale}/design`;
 if (!fs.existsSync(`${base}/chrome.js`)) continue;
 let source = fs.readFileSync(`${base}/chrome.js`,'utf8');
 const dictionary = JSON.parse(fs.readFileSync(`l10n/generated/${locale === "zh" ? "zh-Hans" : locale}.json`,'utf8'));
 const oldMarkup = JSON.parse(source.match(/controls\.innerHTML = (".*");/)[1]);
 const priya = oldMarkup.match(/class="ahv-contact-label">([^<]+)/)[1];
 const whatsApp = oldMarkup.match(/class="ahv-contact-wa"[^>]*aria-label="([^"]+)/)[1];
 const heading = source.match(/controls\.setAttribute\("aria-label", (".*")\);/);
 const escape = value => value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
 const labels = controls.replace(/controls\.innerHTML = '([^']*)';/, (_, markup) => {
  const close = escape(dictionary.Close || 'Close');
  markup = markup.replace('How would you like to chat?', escape(heading ? JSON.parse(heading[1]) : 'Contact Kairali'))
   .replace('WhatsApp us',escape(whatsApp)).replace('Chat with Priya',escape(priya))
   .replace('aria-label="Close chat choices">Close',`aria-label="${close}">${close}`);
  return `controls.innerHTML = ${JSON.stringify(markup)};`;
 });
 const start = source.indexOf('  // One shared pair'), end = source.indexOf('  // OWNER-REG-02', start);
 if (start < 0 || end < 0) throw new Error(`Contact insertion boundary missing: ${locale}`);
 source = source.slice(0,start) + labels + source.slice(end);
 source = source.replace('var chatPending = false, chatTimer = null, chatObserver = null;', 'var chatPending = false, contactChoiceTrigger = null, chatTimer = null, chatObserver = null;');
 source = source.replace('chatSnapshot(ev.currentTarget);','chatSnapshot(contactChoiceTrigger || ev.currentTarget);');
 source = source.replace('html.setAttribute("data-ahv-cta-bar-on", "");','html.setAttribute("data-ahv-cta-bar-on", "");\n      bar.appendChild(contactTrigger());');
 source = source.replace('  function pass() {',home + '  function pass() {');
 source = source.replace('      ctaBar();','      ctaBar();\n      homeReviewRefinements();');
 fs.writeFileSync(`${base}/review-chrome.js`, source);
}
console.log('Reviewed chrome generated for all locale layouts; frozen inputs unchanged.');
