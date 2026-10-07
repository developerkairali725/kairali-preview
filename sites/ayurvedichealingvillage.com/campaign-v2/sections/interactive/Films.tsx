"use client";

// Films (Main.dc.html section 6 / Mobile-Full "Films"): one featured film and a VERTICAL list (mobile rows are
// a 150px | 1fr grid; nothing scrolls sideways). Each film is a click-to-play facade: a <button> with the
// thumbnail. YouTube (youtube-nocookie) is requested only after the press. In the EU/UK, without a granted
// consent record, the press first asks "This film is hosted on YouTube. Play it?".

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { FilmKind, FilmRef, Variant } from "../../kit/types.ts";
import { track } from "../../integrations/track.ts";
import { consentAllowsNonCm } from "../../integrations/consent.ts";
import { SectionHead } from "../head";

const KIND: Record<FilmKind, string> = {
  property: "Property film", patient: "Patient story", treatment: "Treatment film", yoga: "Yoga film",
};

const Play = ({ size }: { size: number }) => (
  <span className="lp-film__play" aria-hidden="true">
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
  </span>
);

type State = "idle" | "ask" | "play";

function Film({ f, featured }: { f: FilmRef; featured: boolean }) {
  const [state, setState] = useState<State>("idle");
  const facade = useRef<HTMLButtonElement>(null);
  const playBtn = useRef<HTMLButtonElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const prevState = useRef<State>("idle");

  useEffect(() => {
    if (state === "ask") playBtn.current?.focus();
    if (state === "play") frame.current?.focus();
    if (state === "idle" && prevState.current === "ask") facade.current?.focus();
    prevState.current = state;
  }, [state]);

  const play = () => {
    setState("play");
    track("film_play", { kind: f.kind, youtube_id: f.youtubeId });
  };
  const press = () => {
    let ok = false;
    try { ok = consentAllowsNonCm(window as unknown as Parameters<typeof consentAllowsNonCm>[0]); } catch { ok = false; }
    if (ok) play(); else setState("ask");
  };

  const cls = featured ? "lp-film lp-film--featured" : "lp-film";
  if (state === "play") {
    return (
      <div className={`${cls} lp-film--playing`}>
        <div className="lp-film__frame">
          <iframe
            ref={frame}
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(f.youtubeId)}?autoplay=1&rel=0`}
            title={f.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <p className="lp-film__title">{f.title} <span className="lp-film__kind">· {KIND[f.kind]}</span></p>
      </div>
    );
  }
  return (
    <div className={cls}>
      {state === "ask" ? (
        <div className="lp-film__ask" role="group" aria-label={`Play film: ${f.title}`}>
          <p>This film is hosted on YouTube. Play it?</p>
          <div className="lp-film__ask-btns">
            <button type="button" ref={playBtn} className="lp-film__ask-play" onClick={play}>Play</button>
            <button type="button" className="lp-film__ask-cancel" onClick={() => setState("idle")}>Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" ref={facade} className="lp-film__facade" onClick={press}>
          <span className="lp-film__thumb">
            <Image src={f.thumb} alt="" width={480} height={360} loading="lazy"
              sizes={featured ? "(max-width: 767px) 100vw, 58vw" : "(max-width: 767px) 150px, 200px"} />
            <Play size={featured ? 28 : 14} />
          </span>
          <span className={featured ? "lp-film__text lp-scrim" : "lp-film__text"}>
            <span className="lp-film__title"><span className="lp-sr">Play film: </span>{f.title}</span>
            <span className="lp-film__kind">{KIND[f.kind]}</span>
          </span>
        </button>
      )}
    </div>
  );
}

export default function Films({ films, v }: { films: { featured: FilmRef; more: FilmRef[] }; v: Variant }) {
  return (
    <section className="lp-sec lp-films" aria-labelledby="lp-films-h">
      <div className="lp-films__top">
        <SectionHead v={v} kicker="See it, hear it" title="A day at the village, and the patients who came." id="lp-films-h" />
      </div>
      <div className="lp-films__grid">
        <Film f={films.featured} featured />
        <ul className="lp-films__list">
          {films.more.map((f) => <li key={f.youtubeId}><Film f={f} featured={false} /></li>)}
        </ul>
      </div>
      <p className="lp-films__note">Films play only when you press play. Individual experiences vary.</p>
    </section>
  );
}
