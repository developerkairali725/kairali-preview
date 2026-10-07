import type { ReactNode } from "react";
import type { Variant } from "../kit/types.ts";

type Chaptered = "admission" | "doctors" | "village";

// C (Editorial) numbers its story chapters, per the C artboard: "01 The method → 02 Your doctors → 03 The village".
const CHAPTERS: Partial<Record<Variant, Record<Chaptered, string>>> = {
  C: { admission: "01", doctors: "02", village: "03" },
};

/** Overline + h2 for the lower sections. In C the overline becomes a numbered chapter label. */
export function SectionHead({ v, section, kicker, title, id, children }:
  { v: Variant; section?: Chaptered; kicker: string; title: string; id: string; children?: ReactNode }) {
  const no = section ? CHAPTERS[v]?.[section] : undefined;
  return (
    <div className="lp-head">
      {no ? (
        <p className="lp-chapter"><span className="lp-chapter__no" aria-hidden="true">{no}</span><span className="lp-chapter__label">{kicker}</span></p>
      ) : (
        <p className="lp-over lp-kicker">{kicker}</p>
      )}
      <h2 id={id} className="lp-h2">{title}</h2>
      {children}
    </div>
  );
}
