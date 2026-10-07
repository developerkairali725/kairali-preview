import type { FilmRef } from "../kit/types.ts";

const f = (youtubeId: string, title: string, kind: FilmRef["kind"], recordedYear: number): FilmRef => ({
  youtubeId, title, kind, consent: true, recordedYear, thumb: `/lp-v2/img/yt-${youtubeId}.jpg`,
});

export const FILMS: Record<string, FilmRef> = {
  iPARaMRASUs: f("iPARaMRASUs", "A day at the village", "property", 2019),
  "4x01PtWfNnk": f("4x01PtWfNnk", "Michaela & Jan", "patient", 2019),
  "3vWviQfW1Ug": f("3vWviQfW1Ug", "Supriya Agarwal", "patient", 2020),
  "07tVC2oXd8g": f("07tVC2oXd8g", "On Panchakarma", "treatment", 2018),
};
