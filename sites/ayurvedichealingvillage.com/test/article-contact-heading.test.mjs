import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import { articleContactHeadingHtml } from '../app/(english)/_families/article-contact-heading.mjs';
test('all accepted locale snapshots change only the contact heading tag', () => {
  const files = ['english-candidate/prerender/ayurveda-treatment.html', ...['hi','de','fr','es','it','pt','nl','ru','ar','zh-Hans','ja','ko'].map(l => `l10n/prerender/${l}/ayurveda-treatment.html.gz`)];
  for (const file of files) {
    const raw=fs.readFileSync(file), html=(file.endsWith('.gz')?zlib.gunzipSync(raw):raw).toString();
    const block=html.match(/<h4\b[^>]*data-source-pointer="\/sections\/3\/c\/3\/c\/12"[^>]*>[\s\S]*?<\/h4>/g);
    assert.equal(block?.length,1,file);
    const fixed=articleContactHeadingHtml(html,'/ayurveda-treatment/');
    assert.equal(fixed,html.replace(block[0],block[0].replace(/^<h4/,'<h3').replace(/<\/h4>$/,'</h3>')));
    assert.equal(articleContactHeadingHtml(fixed,'/ayurveda-treatment/'),fixed);
    assert.equal(articleContactHeadingHtml(html,'/unrelated/'),html);
  }
});
