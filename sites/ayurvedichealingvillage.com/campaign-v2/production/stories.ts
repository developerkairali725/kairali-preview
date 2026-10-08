// Consented patient and property films (data/films.ts), as production story links: an outbound YouTube link with the
// registry's own local thumbnail. The film list and consent come from the registry only; the page writes the title.
//
// Erasable TypeScript only (node --test imports this file).

import type { PageStory } from "../kit/types.ts";
import { FILMS } from "../data/films.ts";

/** A registry film as a story card. Throws on a film that is not in the consented registry. */
export function story(youtubeId: string, title: string): PageStory {
  const f = FILMS[youtubeId];
  if (!f || !f.consent) throw new Error(`production/stories: ${youtubeId} is not a consented registry film`);
  return { title, href: `https://www.youtube.com/watch?v=${youtubeId}`, thumb: { src: f.thumb, width: 480, height: 360 } };
}
