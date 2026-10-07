import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { img, film, doc } from "../campaign-v2/kit/registry.ts";
import { IMAGES } from "../campaign-v2/data/images.ts";
import { FILMS } from "../campaign-v2/data/films.ts";

test("resolvers return registered entries", () => {
  assert.equal(img("kt-199").width, 1600);
  assert.equal(film("iPARaMRASUs").kind, "property");
  assert.equal(doc("deepu-john").name, "Dr. Deepu John");
});

test("resolvers throw on unknown ids", () => {
  assert.throws(() => img("nope"), /Unknown image id: nope/);
  assert.throws(() => film("nope"), /Unknown film id: nope/);
  assert.throws(() => doc("nope"), /Unknown doctor id: nope/);
});

test("every registered image and film thumbnail exists in public/", () => {
  for (const i of Object.values(IMAGES)) assert.ok(existsSync(new URL(`../public${i.src}`, import.meta.url)), i.src);
  for (const f of Object.values(FILMS)) assert.ok(existsSync(new URL(`../public${f.thumb}`, import.meta.url)), f.thumb);
});

test("decorative images have empty alt; informative images have 60-125 char alt", () => {
  for (const i of Object.values(IMAGES)) {
    if (i.decorative) assert.equal(i.alt, "", i.id);
    else assert.ok(i.alt.length >= 20 && i.alt.length <= 125, `${i.id}: ${i.alt.length}`);
  }
});
