import Image from "next/image";
import type { PageStories } from "../../kit/types.ts";
import { SectionHead } from "../../sections/head";

/**
 * Patient films, as the page this replaces offered them: each a link to the film on YouTube, opening in a new tab,
 * with its local thumbnail. No player is embedded and nothing is requested from YouTube until the visitor follows a
 * link, so the page's consent posture is unchanged. A night band, as the kit's Films (variant A).
 */
export default function Stories({ s }: { s: PageStories }) {
  return (
    <section className="lp-sec lp-pstories" aria-labelledby="lp-pstories-h">
      <div className="lp-pstories__top">
        <SectionHead v="A" kicker="In their words" title={s.heading} id="lp-pstories-h" />
        <p className="lp-pstories__body">{s.body}</p>
      </div>
      <ul className="lp-pstories__list">
        {s.films.map((f) => (
          <li key={f.href}>
            <a className="lp-pstory" href={f.href} target="_blank" rel="noopener noreferrer">
              <span className="lp-pstory__thumb">
                <Image src={f.thumb.src} alt="" width={f.thumb.width} height={f.thumb.height}
                  sizes="(max-width: 767px) 150px, 30vw" loading="lazy" />
                <span className="lp-pstory__play" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </span>
              </span>
              <span className="lp-pstory__text">
                <span className="lp-pstory__title">{f.title}</span>
                <span className="lp-pstory__where">YouTube<span className="lp-sr"> (opens in a new tab)</span> <span aria-hidden="true">↗</span></span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
