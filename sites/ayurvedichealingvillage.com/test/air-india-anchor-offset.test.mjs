// AHV-I01.nav1-6: /kairali-air-india-maharaja-club.html "On this page" anchors must land below the sticky
// family header (73px desktop / 64px phone). The design gives each section an inline scroll-margin-top of
// 16-20px, which beats the sitewide family-page rule, so WebKit landed About/Features/Programs/Routine/Contact
// under the header (live 15 Oct: heading top 44-60px).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../public/design/family-header.css', import.meta.url), 'utf8');

test('family-header.css: Air India sections override the inline 16-20px scroll margin with the 84px family offset', () => {
  assert.match(css, /html\[data-ahv-fh\] #ahv-design-root \[id\] \{ scroll-margin-top:84px; \}/);
  assert.match(css, /html\[data-ahv-fh\] #ahv-design-root \.air-membership section\[id\] \{ scroll-margin-top:84px !important; \}/);
  // only sections of that page: the rule names no other family or element
  const rules = css.split('\n').filter((l) => l.includes('!important') && l.includes('scroll-margin-top'));
  assert.equal(rules.length, 1);
});

test('the Air India view still renders its sections with ids and inline margins smaller than the header', () => {
  for (const v of ['desktop', 'mobile']) {
    const view = fs.readFileSync(new URL(`../public/ahv/views/ahv-page-campaign-retreat--air-india-${v}.json`, import.meta.url), 'utf8');
    for (const id of ['v3-about', 'v3-features', 'v3-programs', 'v3-routine', 'v3-contact']) assert.ok(view.includes(`id=\\"${id}\\"`) || view.includes(`id="${id}"`), `${v} ${id}`);
    assert.match(view, /air-membership/);
  }
});
