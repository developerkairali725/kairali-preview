// ---- LEGACY FALLBACK VIEW (schema-1 status-data.json) ---------------------
// Rendered whenever status-data.json does NOT declare schema: 2 — e.g. the
// generator hasn't been upgraded yet, or a rollback restored an old snapshot.
// This is the pre-v2 Fleet Pulse, kept intact but made defensive: every field
// is optional-chained and defaulted so a partial snapshot renders as honest
// dashes rather than crashing the board.

type Workstream = {
  name: string;
  status: string;
  next_milestone: string | null;
  due: string | null;
  tokens_spent: number | null;
  cost_inr: number | null;
  hours: number | null;
};
type Site = {
  name: string;
  entity: string;
  stage: string;
  owner: string | null;
  blocker: string | null;
  updated: string | null;
  preview_url?: string | null;
  live_url?: string | null;
};
type Snapshot1 = {
  meta?: { updated?: string; as_of_commit?: string; sprint?: string; sources?: string };
  stageOrder?: string[];
  stageCounts?: Record<string, number>;
  workstreams?: Workstream[];
  sites?: Site[];
};

// ---- brand palette (forest / ivory / marigold) ----------------------------
const INK = "#1A2E1A";
const IVORY = "#FFFDF7";
const LINE = "#E6E0CF";

// stage ramp: ideation (pale) -> live (forest). One accent, monotone progression.
const STAGE: Record<string, { bg: string; fg: string; label: string }> = {
  ideation: { bg: "#ECE7D8", fg: "#6B6350", label: "Ideation" },
  research: { bg: "#F4E6C6", fg: "#7A5A1F", label: "Research" },
  build: { bg: "#F0BF3E", fg: "#3A2E0A", label: "Build" },
  gates: { bg: "#DBE2C1", fg: "#495320", label: "Gates" },
  preview: { bg: "#C4D4A2", fg: "#38471A", label: "Preview" },
  human_audit: { bg: "#A6C28B", fg: "#243319", label: "Human audit" },
  ok_to_publish: { bg: "#8BB275", fg: "#14240E", label: "OK to publish" },
  live: { bg: "#003720", fg: "#EAF3EA", label: "Live" },
  monitoring: { bg: "#1A2E1A", fg: "#EAF3EA", label: "Monitoring" },
};

const STATUS_TONE: Record<string, { bg: string; fg: string }> = {
  active: { bg: "#DBE2C1", fg: "#38471A" },
  blocked: { bg: "#F3D9C7", fg: "#8A3D14" },
  planned: { bg: "#EDE8DA", fg: "#6B6350" },
};

const dash = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : String(v));

function SiteLinks({ site }: { site: Site }) {
  const live = site.live_url ?? null;
  const preview = site.preview_url ?? null;
  return (
    <div className="links">
      {live ? (
        <a className="lnk live" href={live} target="_blank" rel="noopener noreferrer">
          live&nbsp;↗
        </a>
      ) : null}
      {preview ? (
        <a className="lnk" href={preview} target="_blank" rel="noopener noreferrer">
          preview&nbsp;↗
        </a>
      ) : null}
      {!live && !preview ? <span className="localonly">local only</span> : null}
    </div>
  );
}

function StageChip({ stage }: { stage: string }) {
  const s = STAGE[stage] ?? { bg: "#EEE", fg: "#333", label: stage };
  return (
    <span className="chip" style={{ background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}

export default function LegacyView({ data }: { data: unknown }) {
  const snap = (typeof data === "object" && data !== null ? data : {}) as Snapshot1;
  const meta = snap.meta ?? {};
  const stageOrder = Array.isArray(snap.stageOrder) ? snap.stageOrder : [];
  const stageCounts = snap.stageCounts ?? {};
  const workstreams = Array.isArray(snap.workstreams) ? snap.workstreams : [];
  const sites = Array.isArray(snap.sites) ? snap.sites : [];

  // site view: order by pipeline stage, latest-updated first within a stage
  const sorted = [...sites].sort((a, b) => {
    const d = stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage);
    if (d !== 0) return d;
    return String(b.updated).localeCompare(String(a.updated));
  });

  return (
    <main>
      <style>{CSS}</style>

      <header className="hd">
        <p className="eyebrow">Kairali Web Factory</p>
        <h1>Fleet Pulse</h1>
        <p className="sub">{meta?.sprint ? meta.sprint : "Internal status surface"}</p>
        <p className="stamp">
          as&nbsp;of&nbsp;<code>{dash(meta?.as_of_commit)}</code> · updated {dash(meta?.updated)} · source of
          truth: <code>STATUS.yaml</code> · legacy snapshot (schema&nbsp;1)
        </p>
      </header>

      {/* ---------------- SYSTEM VIEW ---------------- */}
      <section className="wrap">
        <h2 className="sech">System view · workstreams</h2>

        {/* desktop table */}
        <div className="tablewrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Workstream</th>
                <th>Status</th>
                <th>Next milestone</th>
                <th>Due</th>
                <th className="num">Tokens</th>
                <th className="num">₹ cost</th>
                <th className="num">Hours</th>
              </tr>
            </thead>
            <tbody>
              {workstreams.map((w) => {
                const tone = STATUS_TONE[w.status] ?? STATUS_TONE.planned;
                return (
                  <tr key={w.name}>
                    <td className="strong">{w.name}</td>
                    <td>
                      <span className="chip" style={{ background: tone.bg, color: tone.fg }}>
                        {w.status}
                      </span>
                    </td>
                    <td>{dash(w.next_milestone)}</td>
                    <td className="mono">{dash(w.due)}</td>
                    <td className="num mono muted">{dash(w.tokens_spent)}</td>
                    <td className="num mono muted">{dash(w.cost_inr)}</td>
                    <td className="num mono muted">{dash(w.hours)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* mobile cards */}
        <div className="cards">
          {workstreams.map((w) => {
            const tone = STATUS_TONE[w.status] ?? STATUS_TONE.planned;
            return (
              <div className="card" key={w.name}>
                <div className="cardtop">
                  <span className="strong">{w.name}</span>
                  <span className="chip" style={{ background: tone.bg, color: tone.fg }}>
                    {w.status}
                  </span>
                </div>
                <p className="cardline">{dash(w.next_milestone)}</p>
                <p className="cardmeta">
                  Due {dash(w.due)} · tokens {dash(w.tokens_spent)} · ₹ {dash(w.cost_inr)} · hrs{" "}
                  {dash(w.hours)}
                </p>
              </div>
            );
          })}
        </div>
        <p className="foot">
          Budget-burn columns (tokens · ₹ · hours) are intentionally blank — no per-session
          token/cost/duration ledger exists yet. They fill in once instrumented (roadmap Prompt&nbsp;6).
        </p>
      </section>

      {/* ---------------- SITE VIEW ---------------- */}
      <section className="wrap">
        <h2 className="sech">Site view · pipeline stage</h2>

        <div className="legend">
          {stageOrder.map((st) => (
            <span className="legitem" key={st}>
              <StageChip stage={st} />
              <b>{stageCounts[st] ?? 0}</b>
            </span>
          ))}
        </div>

        <div className="sitelist">
          {sorted.map((s) => (
            <div className="site" key={s.name}>
              <div className="siterow">
                <span className="sitename">{s.name}</span>
                <StageChip stage={s.stage} />
              </div>
              <div className="sitemeta">
                <span className="tag">{s.entity}</span>
                <span className="owner">owner: {dash(s.owner)}</span>
                <span className="upd">upd {dash(s.updated)}</span>
              </div>
              <SiteLinks site={s} />
              {s.blocker ? <p className="blk">⚠ {s.blocker}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <footer className="pgfoot">
        Fleet Pulse renders <code>/STATUS.yaml</code>. Every session ends by updating it
        (CLAUDE.md rule) then <code>node scripts/status-build.mjs</code>. Internal · noindex.
      </footer>
    </main>
  );
}

const CSS = `
  main { max-width: 1080px; margin: 0 auto; padding: 0 16px 64px;
         color: ${INK}; background: ${IVORY};
         font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
  body { background: ${IVORY}; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.85em;
         background: #00000008; padding: 1px 5px; border-radius: 4px; }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums; }

  .hd { padding: 40px 0 24px; border-bottom: 3px solid ${INK}; }
  .eyebrow { margin: 0; letter-spacing: 0.22em; font-size: 0.7rem; text-transform: uppercase; opacity: 0.6; }
  .hd h1 { margin: 6px 0 4px; font-size: 2.4rem; letter-spacing: -0.02em; }
  .sub { margin: 0; font-size: 0.95rem; opacity: 0.8; }
  .stamp { margin: 10px 0 0; font-size: 0.78rem; opacity: 0.65; }

  .wrap { margin-top: 40px; }
  .sech { font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.14em;
          opacity: 0.55; margin: 0 0 16px; font-weight: 600; }

  .chip { display: inline-block; padding: 2px 10px; border-radius: 999px;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.01em; white-space: nowrap; }

  .tablewrap { overflow-x: auto; border: 1px solid ${LINE}; border-radius: 12px; }
  .tbl { width: 100%; border-collapse: collapse; font-size: 0.9rem; min-width: 720px; }
  .tbl th { text-align: left; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em;
            opacity: 0.55; padding: 12px 14px; border-bottom: 1px solid ${LINE}; background: #00000004; }
  .tbl td { padding: 13px 14px; border-bottom: 1px solid ${LINE}; vertical-align: top; }
  .tbl tr:last-child td { border-bottom: none; }
  .tbl .num { text-align: right; }
  .strong { font-weight: 650; }
  .muted { opacity: 0.4; }

  .cards { display: none; }
  .card { border: 1px solid ${LINE}; border-radius: 12px; padding: 14px; margin-bottom: 10px; }
  .cardtop { display: flex; justify-content: space-between; gap: 10px; align-items: flex-start; }
  .cardline { margin: 8px 0 6px; font-size: 0.9rem; }
  .cardmeta { margin: 0; font-size: 0.76rem; opacity: 0.6;
              font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

  .foot { font-size: 0.76rem; opacity: 0.6; margin: 14px 2px 0; line-height: 1.5; }

  .legend { display: flex; flex-wrap: wrap; gap: 8px 14px; margin-bottom: 20px; }
  .legitem { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; }
  .legitem b { font-variant-numeric: tabular-nums; }

  .sitelist { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .site { border: 1px solid ${LINE}; border-radius: 12px; padding: 14px; background: #fff; }
  .siterow { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
  .sitename { font-weight: 650; font-size: 0.95rem; word-break: break-word; }
  .sitemeta { display: flex; flex-wrap: wrap; gap: 6px 12px; margin-top: 8px;
              font-size: 0.75rem; opacity: 0.7; }
  .tag { background: #00000008; padding: 1px 8px; border-radius: 6px; }

  .links { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
  .lnk { display: inline-block; padding: 2px 11px; border-radius: 999px; font-size: 0.72rem;
         font-weight: 600; letter-spacing: 0.01em; white-space: nowrap; text-decoration: none;
         color: ${INK}; border: 1px solid ${INK}; background: transparent; }
  .lnk:hover { background: ${INK}; color: ${IVORY}; }
  .lnk.live { background: #003720; border-color: #003720; color: #EAF3EA; }
  .lnk.live:hover { background: #1A2E1A; border-color: #1A2E1A; }
  .localonly { font-size: 0.72rem; font-style: italic; opacity: 0.45; padding: 3px 0; }

  .blk { margin: 10px 0 0; font-size: 0.78rem; color: #8A3D14; line-height: 1.45; }

  .pgfoot { margin-top: 48px; padding-top: 18px; border-top: 1px solid ${LINE};
            font-size: 0.75rem; opacity: 0.6; line-height: 1.6; }

  @media (max-width: 720px) {
    .tablewrap { display: none; }
    .cards { display: block; }
    .sitelist { grid-template-columns: 1fr; }
    .hd h1 { font-size: 2rem; }
  }
`;
