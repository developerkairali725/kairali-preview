import test from 'node:test';
import assert from 'node:assert/strict';
import {youtubeNewTabs} from '../app/(english)/_families/youtube-links.ts';

test('YouTube hosts open separately and preserve existing rel values',()=>{
 for(const host of ['www.youtube.com','m.youtube.com','youtu.be','www.youtube-nocookie.com']) {
  const out=youtubeNewTabs(`<a href="https://${host}/watch?v=abc" target="_self" rel="nofollow">Video</a>`);
  assert.match(out,/target="_blank"/);assert.match(out,/rel="nofollow noopener noreferrer"/);
  assert.equal(youtubeNewTabs(out),out);
 }
});
test('Internal links, unrelated hosts, images and iframe embeds remain unchanged',()=>{
 const html='<a href="/gallery/">Gallery</a><a href="https://youtube.com.example.com/">Other</a><img src="https://youtube.com/x"><iframe src="https://www.youtube.com/embed/abc"></iframe>';
 assert.equal(youtubeNewTabs(html),html);
});
