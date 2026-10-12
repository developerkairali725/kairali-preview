import type { DoctorRef, FilmRef, ImageRef } from "./types.ts";
import { IMAGES } from "../data/images.ts";
import { FILMS } from "../data/films.ts";
import { DOCTORS } from "../data/doctors.ts";

function pick<T>(table: Record<string, T>, id: string, kind: string): T {
  const v = table[id];
  if (!v) throw new Error(`Unknown ${kind} id: ${id}`);
  return v;
}
export const img = (id: string): ImageRef => pick(IMAGES, id, "image");
export const film = (id: string): FilmRef => pick(FILMS, id, "film");
export const doc = (id: string): DoctorRef => pick(DOCTORS, id, "doctor");
