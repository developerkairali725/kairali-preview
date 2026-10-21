// Group Profile layout. Every word, name, role and image below is read from the page's own source sections
// (content/pages.json), never retyped: this component only decides WHERE each source block sits.
// Source order of the Management Team section: four <li><img> portraits (alt = person), then repeating
// <p>name</p><p>role</p><p>biography</p> triples in the same order. If the source shape ever changes,
// parseProfile returns null and the caller falls back to the generic prose rendering.

type Img = { src: string; alt: string; width: string; height: string };
type Leader = { name: string; role: string; bio: string; img: Img };

const text = (h: string) => h.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const paras = (h: string) => [...h.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1].trim());
const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? "";
const imgs = (h: string): Img[] => [...h.matchAll(/<img\b[^>]*>/g)].map((m) => ({ src: attr(m[0], "src"), alt: attr(m[0], "alt"), width: attr(m[0], "width"), height: attr(m[0], "height") }));

export function parseProfile(sections: string[]) {
  const find = (needle: string) => sections.find((s) => text(s).includes(needle));
  const history = find("Key Milestones");
  const founder = find("Founder’s Message");
  const team = find("Management Team");
  const purpose = sections.find((s) => /<strong>Mission:<\/strong>/.test(s) && /<strong>Vision:<\/strong>/.test(s));
  if (!history || !founder || !team || !purpose) return null;

  const hp = paras(history);
  const fp = paras(founder);
  const tp = paras(team);
  const [portraitHtml, rest = ""] = team.split("</ol>");
  const portraits = imgs(portraitHtml);
  const after = paras(rest);
  if (portraits.length < 1 || after.length !== portraits.length * 3) return null;
  const leaders: Leader[] = portraits.map((img, i) => ({ img, name: after[i * 3], role: after[i * 3 + 1], bio: after[i * 3 + 2] }));
  // Each portrait's alt text must match the name that follows it; otherwise refuse to guess ownership.
  const key = (s: string) => text(s).toLowerCase().replace(/[^a-z]/g, "");
  // The source spells one director two ways (alt "Abhishek", name "Abishek"), so the image file name is accepted as a second witness.
  const stem = (src: string) => key((src.split("/").pop() || "").replace(/\.\w+$/, "").replace(/\d+/g, ""));
  const aligned = leaders.every((l) => {
    const a = key(l.img.alt).slice(0, 4), n = key(l.name).slice(0, 4), f = stem(l.img.src).slice(0, 4);
    return a === n || key(l.name).includes(a) || key(l.img.alt).includes(n) || (f.length === 4 && key(l.name).includes(f));
  });
  if (!aligned) return null;

  const purposeItems = [...purpose.matchAll(/<p><strong>(Mission|Vision):<\/strong>([\s\S]*?)<\/p>\s*(<img\b[^>]*>)/g)].map((m) => ({ label: m[1], body: m[2].trim(), img: imgs(m[3])[0] }));
  if (purposeItems.length !== 2 || hp.length < 2 || fp.length < 3 || tp.length < 2) return null;
  const portrait = imgs(founder)[0];
  if (!portrait) return null;

  return {
    history: { label: text(hp[0]), intro: hp[1], images: imgs(history) },
    founder: { label: text(fp[0]), portrait, quote: fp.slice(1, -1), attribution: fp[fp.length - 1] },
    team: { label: text(tp[0]), intro: tp[1], leaders },
    purpose: purposeItems,
  };
}

export default function ProfilePageSections({ sections }: { sections: string[] }) {
  const d = parseProfile(sections);
  if (!d) return null;
  const { history, founder, team, purpose } = d;
  return (
    <div className="profile-story">
      <section className="profile-history" aria-labelledby="key-milestones">
        <div className="profile-section-head">
          <h2 id="key-milestones">{history.label}</h2>
          <p className="lede" dangerouslySetInnerHTML={{ __html: history.intro }} />
        </div>
        <div className="profile-history-visuals">
          {history.images.map((im, i) => (
            <figure key={im.src} className={i === 0 ? "profile-history-main photo" : "profile-history-timeline"}>
              <img src={im.src} width={im.width} height={im.height} alt={im.alt} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
      </section>

      <section className="profile-founder" aria-labelledby="founder-message">
        <figure className="profile-founder-portrait">
          <img src={founder.portrait.src} width={founder.portrait.width} height={founder.portrait.height} alt={founder.portrait.alt} loading="lazy" decoding="async" />
        </figure>
        <div className="profile-founder-copy">
          <h2 id="founder-message">{founder.label}</h2>
          <blockquote>
            {founder.quote.map((q, i) => <p key={i} dangerouslySetInnerHTML={{ __html: q }} />)}
          </blockquote>
          <p className="profile-signature" dangerouslySetInnerHTML={{ __html: founder.attribution }} />
        </div>
      </section>

      <section className="profile-leadership" aria-labelledby="management-team">
        <div className="profile-section-head">
          <h2 id="management-team">{team.label}</h2>
          <p dangerouslySetInnerHTML={{ __html: team.intro }} />
        </div>
        <div className="profile-leader-list">
          {team.leaders.map((leader, index) => (
            <article className="profile-leader" key={leader.name}>
              <div className="profile-leader-photo">
                <img src={leader.img.src} width={leader.img.width} height={leader.img.height} alt={leader.img.alt} loading="lazy" decoding="async" />
              </div>
              <div className="profile-leader-copy">
                <span className="profile-leader-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3 dangerouslySetInnerHTML={{ __html: leader.name }} />
                <p className="profile-role" dangerouslySetInnerHTML={{ __html: leader.role }} />
                <p dangerouslySetInnerHTML={{ __html: leader.bio }} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="profile-purpose" aria-labelledby="mission-vision">
        <div className="profile-section-head">
          <h2 id="mission-vision">Mission &amp; vision</h2>
        </div>
        <div className="profile-purpose-grid">
          {purpose.map((p) => (
            <article className="profile-purpose-card" key={p.label}>
              <img src={p.img.src} width={p.img.width} height={p.img.height} alt={p.img.alt} loading="lazy" decoding="async" />
              <div><h3>{p.label}</h3><p dangerouslySetInnerHTML={{ __html: p.body }} /></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
