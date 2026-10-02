import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('static main-page snapshots retain every image source', () => {
  for (const file of ['english-candidate/prerender/index.html', 'public/ahv/static/index.html', 'public/ahv/static/panchakarma-therapy.html', 'public/ahv/static/contact-us.html']) {
    const images = readFileSync(file, 'utf8').match(/<img\b[^>]*>/g) || [];
    assert.ok(images.length > 0, `${file}: contains images`);
    for (const image of images) {
      assert.match(image, /\bsrc="[^"\s]+"/, `${file}: image source missing: ${image}`);
      assert.doesNotMatch(image, /\bsrc="https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\//, `${file}: must not ship build-machine origin`);
    }
  }
});
