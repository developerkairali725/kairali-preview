import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tsxUnits } from '../tools/l10n/extras.mjs';

test('native translation extraction excludes executable style/script but retains surrounding visitor text', () => {
  const code = 'export default () => <main><h1>Video gallery</h1><noscript><style>{`.vg-layout > nav {display:grid !important}`}</style><p>Browse our films</p></noscript><script>{`console.log("Not visitor copy")`}</script><a aria-label="Contact our team">Contact us</a></main>';
  const units = tsxUnits(code).map((unit) => unit.source);
  assert.deepEqual(units.sort(), ['Video gallery', 'Browse our films', 'Contact our team', 'Contact us'].sort());
});

test('responsive image expressions remain technical while conditional accessible text is extracted', () => {
 const code = 'export default () => <img sizes={hero ? "(max-width:760px) calc(100vw - 36px), 960px" : "320px"} srcSet={hero ? "/hero.webp 960w" : "/small.webp 320w"} alt={hero ? "Paddy fields around Kairali" : "Villa garden"}/> ';
 assert.deepEqual(tsxUnits(code).map(u => u.source).sort(), ['Paddy fields around Kairali', 'Villa garden'].sort());
});
