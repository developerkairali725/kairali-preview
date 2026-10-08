/** Owner-approved catalogue identities, 7 October 2026. No tariff values are changed. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(site, 'public/ahv/assets/all-programs-data.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
const data = context.window.AHV_FINDER;
const hubs = new Set(['/yoga-meditation-training/', '/ayurveda-training-programme/']);
const yoga = new Set(['/yoga-and-meditation-package/', '/digestive-wellness-gut-health-yoga-therapy/', '/yoga-based-stress-energy-reset-program/']);
data.programmes = data.programmes.filter(p => !hubs.has(p.route));
for (const p of data.programmes) {
  if (yoga.has(p.route)) p.categories = ['Yoga & Meditation'];
  if (p.route === '/digestive-wellness-gut-health-yoga-therapy/') p.sanskrit = 'Agni Dīpanam Yoga Chikitsa';
  p.availability = p.from?.INR != null ? 'current' : 'enquiry_only';
  p.bookable = p.availability === 'current';
}
for (const [route, name, summary, aliases] of [
  ['/yoga-meditation-program/', 'Yoga Training for Personal Practice — Coming Soon', 'A forthcoming course for personal yoga practice. Enrolment is not currently open.', ['yoga training', 'personal practice', 'learn yoga', 'coming soon']],
  ['/new-to-yoga-teacher-training/', 'Professional Yoga Teacher Training — Coming Soon', 'A forthcoming professional teacher-training track. Enrolment is not currently open.', ['yoga teacher training', 'professional yoga training', 'coming soon']],
]) {
  const p = { route, name, sanskrit: null, categories: ['Training'], minimumNights: null, from: null, validFrom: null, validTo: null, sourceRef: 'WOPS-AHV-CONSOLIDATED-RELEASE-20261007-001: owner-approved Coming Soon identities', cardSummary: summary, durationDisplay: 'Coming Soon', priceBasisNote: null, aliases, availability: 'coming_soon', bookable: false };
  const existing = data.programmes.findIndex(x => x.route === route);
  if (existing < 0) data.programmes.push(p); else data.programmes[existing] = p;
}
data.counts = { unique: data.programmes.length, priced: data.programmes.filter(p => p.from?.INR != null).length };
for (const category of ['Treatment', 'Wellness', 'Yoga & Meditation', 'Training']) data.counts[category] = data.programmes.filter(p => p.categories.includes(category)).length;
data.counts.ayurveda = data.programmes.filter(p => p.categories.includes('Treatment') && p.from?.INR != null).length;
data.counts.yoga = data.programmes.filter(p => yoga.has(p.route)).length;
data.counts.courses = data.programmes.filter(p => p.categories.includes('Training') && p.from?.INR != null).length;
data.counts.comingSoon = data.programmes.filter(p => p.availability === 'coming_soon').length;
if (data.counts.priced !== 35 || data.counts.ayurveda !== 27 || data.counts.yoga !== 3 || data.counts.courses !== 5 || data.counts.comingSoon !== 2) throw Error('Approved catalogue counts do not match');
fs.writeFileSync(file, 'window.AHV_FINDER = ' + JSON.stringify(data) + ';\n');
console.log('Approved catalogue: 35 priced (27 Ayurveda, 3 yoga, 5 courses), one enquiry-only, two Coming Soon.');
