// ---- FLEET PULSE v2.1 — precision mission control (schema-2) --------------
// D-20260719-32 built the board; D-20260720-03 is this beauty+taste pass.
//
// Design read (taste-skill §0.B): internal mission-control status board on
// dark ink; precision-instrument feel; the DATA is the hero; calm authority,
// zero marketing. Dials: VARIANCE 4 · MOTION 2 · DENSITY 6.
//
// Taste rules applied (Leonxlnx/taste-skill, D-20260720-01):
//   · Fraunces is on the skill's banned-serif list — display voice is now
//     Space Grotesk (geometric, technical) + JetBrains Mono for data. §4.1
//   · ONE accent (leaf #8E9D35 — the brand's accent-on-dark step); amber and
//     ember are SEMANTIC states (waiting / changes), forest fill = live only;
//     the old fourth voice (bronze) is retired. §4.2 color-consistency lock
//   · Radius scale LOCKED: cards 14 · inner surfaces 10 · pills full. §4.4
//   · Cards use the nested double-bezel architecture (outer hairline, inset
//     inner surface) instead of flat single-border boxes. Stat tiles lose
//     their card-per-number soup and become one hairline-divided instrument
//     band. §4.4 "cards only when elevation communicates hierarchy"
//   · Motion: 120ms state transitions only; prefers-reduced-motion honored.
//
// HARD GATE 6: everything rendered is machine-derived from status-data.json.
// A missing fact renders as its honest absence ("—", "unarmed", "none"),
// never a guess. STATUS.yaml is the truth; this board is a generated view.

import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import type { CSSProperties } from "react";
import type { Evidence, FrontGate, OsMilestone, Site2, Snapshot2 } from "./schema";

const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

// ---- palette (internal-dashboard look; brand accents sampled, not imported)
const BG = "#0C120E"; // ink surface
const CARD = "#131A15";
const CARD_IN = "#0F1511"; // inner bezel surface — sits BELOW the card
const CARD_UP = "#18211B";
const LINE = "rgba(242,240,230,0.10)";
const LINE_UP = "rgba(242,240,230,0.22)";
const TEXT = "#F2F0E6"; // ivory on ink — ~15:1
const MUTED = "#A9B4A6"; // ~7:1 on CARD
const FAINT = "#7E8A7C"; // ~4.6:1 on CARD — smallest text stays AA
const LEAF = "#8E9D35"; // THE accent — approved / done / counts
const FOREST = "#006038"; // semantic: live (fill)
const AMBER = "#F0BF3E"; // semantic: pending / waiting
const EMBER = "#E06A4A"; // semantic: changes-requested / blocked

// ---- lanes ----------------------------------------------------------------
const LANES: { id: string; label: string; hint: string; stages: string[] }[] = [
  { id: "to-build", label: "To build", hint: "ideation · research", stages: ["ideation", "research"] },
  { id: "building", label: "Building", hint: "build", stages: ["build"] },
  { id: "in-gates", label: "In gates", hint: "gates · preview", stages: ["gates", "preview"] },
  { id: "human-audit", label: "Human audit", hint: "human_audit · ok_to_publish", stages: ["human_audit", "ok_to_publish"] },
  { id: "live", label: "Live", hint: "live", stages: ["live"] },
  { id: "monitoring", label: "Monitoring", hint: "monitoring", stages: ["monitoring"] },
];

const STAGE_LABEL: Record<string, string> = {
  ideation: "ideation",
  research: "research",
  build: "build",
  gates: "gates",
  preview: "preview",
  human_audit: "human audit",
  ok_to_publish: "ok to publish",
  live: "live",
  monitoring: "monitoring",
};

const GATE_COLOR: Record<FrontGate["status"], string> = {
  approved: LEAF,
  pending: AMBER,
  changes: EMBER,
  none: "transparent",
};

const dash = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : String(v));

// ---- OS header strip ------------------------------------------------------

function MilestoneRail({ milestones }: { milestones: OsMilestone[] }) {
  const dot: Record<OsMilestone["state"], CSSProperties> = {
    done: { background: LEAF, borderColor: LEAF, color: "#10150A" },
    "in-review": { background: "transparent", borderColor: AMBER, color: AMBER },
    next: { background: "transparent", borderColor: LINE_UP, color: MUTED, borderStyle: "dashed" },
    pending: { background: "transparent", borderColor: LINE, color: FAINT },
  };
  return (
    <ol className="rail" aria-label="OS milestones">
      {milestones.map((m, i) => (
        <li key={m.id} className="railstep" aria-label={`${m.id} ${m.label}: ${m.state}`}>
          {i > 0 ? <span className={`railseg ${m.state === "done" ? "railsegdone" : ""}`} aria-hidden="true" /> : null}
          <span className={`raildot ${grotesk.className}`} style={dot[m.state]}>
            {m.id}
          </span>
          <span className="raillabel">{m.label}</span>
          <span
            className={`railstate ${mono.className}`}
            style={{ color: m.state === "done" ? LEAF : m.state === "in-review" ? AMBER : m.state === "next" ? MUTED : FAINT }}
          >
            {m.state}
          </span>
        </li>
      ))}
    </ol>
  );
}

function OsStrip({ os }: { os: Snapshot2["os"] }) {
  const stats: { n: string; label: string; zero: boolean; sub?: string }[] = [
    { n: String(os.strict_residues), label: "strict residues", zero: os.strict_residues === 0 },
    { n: String(os.unacked_directives), label: "unacked directives", zero: os.unacked_directives === 0 },
    { n: String(os.open_questions), label: "open questions", zero: os.open_questions === 0 },
    { n: String(os.decisions), label: "decisions", zero: os.decisions === 0 },
    { n: os.tests ? `${os.tests.pass}/${os.tests.total}` : "—", label: "tests", zero: !os.tests, sub: os.tests ? undefined : "no run recorded" },
  ];
  return (
    <section className="osstrip" aria-label="OS status">
      <MilestoneRail milestones={os.milestones} />
      <div className="band" role="list">
        {stats.map((s) => (
          <div key={s.label} className="stat" role="listitem">
            <span className={`statnum ${grotesk.className} ${s.zero ? "statzero" : ""}`}>{s.n}</span>
            <span className={`statlabel ${mono.className}`}>{s.label}</span>
            {s.sub ? <span className="statsub">{s.sub}</span> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

// ---- site card pieces -----------------------------------------------------

function GateDots({ gates }: { gates: FrontGate[] }) {
  if (gates.length === 0) {
    // No approvals.yaml ledger — the front gate is UNARMED for this site.
    // Hollow dashed dots are presentation; "unarmed" is the fact.
    return (
      <span className="gates" title="no approvals.yaml ledger — front gates unarmed">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="dot unarmed" aria-hidden="true" />
        ))}
        <span className={`gatesnote ${mono.className}`}>unarmed</span>
      </span>
    );
  }
  const approved = gates.filter((g) => g.status === "approved").length;
  return (
    <span className="gates" role="img" aria-label={`front gates: ${gates.map((g) => `${g.gate} ${g.status}`).join(", ")}`}>
      {gates.map((g) => (
        <span
          key={g.gate}
          className={`dot ${g.status === "none" ? "hollow" : ""}`}
          style={g.status === "none" ? undefined : { background: GATE_COLOR[g.status], borderColor: GATE_COLOR[g.status] }}
          title={`${g.gate}: ${g.status}`}
        />
      ))}
      <span className={`gatesnote ${mono.className}`}>
        {approved}/{gates.length} approved
      </span>
    </span>
  );
}

function EvidencePips({ e }: { e: Evidence }) {
  const pips: { label: string; title: string; value: string; zero: boolean }[] = [
    { label: "go", title: `go-science evidence files: ${e.go_science}`, value: String(e.go_science), zero: e.go_science === 0 },
    { label: "beauty", title: `beauty evidence files: ${e.beauty}`, value: String(e.beauty), zero: e.beauty === 0 },
    {
      label: "dr",
      title: `design review passes — pre-content: ${e.design_review_pre}, post-build: ${e.design_review_post}`,
      value: `${e.design_review_pre}·${e.design_review_post}`,
      zero: e.design_review_pre === 0 && e.design_review_post === 0,
    },
    { label: "audits", title: `audit files: ${e.audits}`, value: String(e.audits), zero: e.audits === 0 },
    { label: "checklists", title: e.checklists ? "filled launch checklists present" : "no filled launch checklists", value: e.checklists ? "✓" : "—", zero: !e.checklists },
  ];
  return (
    <span className="pips">
      {pips.map((p) => (
        <span key={p.label} className={`pip ${mono.className} ${p.zero ? "pipzero" : ""}`} title={p.title}>
          {p.label}&thinsp;{p.value}
        </span>
      ))}
    </span>
  );
}

function SiteLinks({ site }: { site: Site2 }) {
  const live = site.live_url ?? null;
  const preview = site.preview_url ?? null;
  return (
    <span className="links">
      {live ? (
        <a className="lnk lnklive" href={live} target="_blank" rel="noopener noreferrer">
          live&nbsp;↗
        </a>
      ) : null}
      {preview ? (
        <a className="lnk" href={preview} target="_blank" rel="noopener noreferrer">
          preview&nbsp;↗
        </a>
      ) : null}
      {!live && !preview ? <span className="localonly">local only</span> : null}
    </span>
  );
}

function SiteCard({ site }: { site: Site2 }) {
  const v = site.vector;
  return (
    <article className="site">
      <header className="siterow">
        <h4 className={`sitename ${grotesk.className}`}>{site.name}</h4>
        {site.phase !== null ? (
          <span className={`phase ${mono.className}`} title={`lifecycle phase ${site.phase} of 0–8`}>
            P{site.phase}
            <span className="phaseof">/8</span>
          </span>
        ) : null}
      </header>

      <div className="chiprow">
        <span className={`chip entity ${mono.className}`}>{site.entity}</span>
        <span className={`chip stage ${mono.className}`}>{STAGE_LABEL[site.stage] ?? site.stage}</span>
      </div>

      {site.waiting_on.length > 0 ? (
        <div className="waitrow">
          <span className={`waitlabel ${mono.className}`}>waiting on</span>
          {site.waiting_on.map((w) => (
            <span key={w} className="waitchip">
              {w}
            </span>
          ))}
        </div>
      ) : null}

      <div className="meta">
        <GateDots gates={site.front_gates} />
        <EvidencePips e={site.evidence} />
        <div className="sitefoot">
          <span className={`upd ${mono.className}`} title="last updated in STATUS.yaml">
            upd {dash(site.updated)}
          </span>
          <SiteLinks site={site} />
        </div>
      </div>

      <details className="detail">
        <summary className={mono.className}>details</summary>
        <dl className="dl">
          <dt className={mono.className}>owner</dt>
          <dd>{dash(site.owner)}</dd>
          <dt className={mono.className}>vector</dt>
          <dd>
            {v ? (
              <>
                {v.site_class} · {v.business_model} · {v.asset_situation} · {v.entity_register} · {v.platform}
              </>
            ) : (
              "— not classified yet"
            )}
          </dd>
          <dt className={mono.className}>phase</dt>
          <dd>{site.phase !== null ? `${site.phase} of 0–8` : "—"}</dd>
          <dt className={mono.className}>evidence</dt>
          <dd>
            go-science {site.evidence.go_science} · beauty {site.evidence.beauty} · design review {site.evidence.design_review_pre} pre /{" "}
            {site.evidence.design_review_post} post · audits {site.evidence.audits} · checklists {site.evidence.checklists ? "present" : "absent"}
          </dd>
          <dt className={mono.className}>blocker</dt>
          <dd className="blocker">{site.blocker ?? "none"}</dd>
        </dl>
      </details>
    </article>
  );
}

// ---- the board ------------------------------------------------------------

export default function FleetPulse({ data }: { data: Snapshot2 }) {
  const { os, sites } = data;

  const laneOf = (s: Site2) => LANES.find((l) => l.stages.includes(s.stage));
  const unmapped = sites.filter((s) => !laneOf(s));

  const stageIndex = (stage: string) => {
    for (const l of LANES) {
      const i = l.stages.indexOf(stage);
      if (i !== -1) return i;
    }
    return 99;
  };
  const sortSites = (list: Site2[]) =>
    [...list].sort((a, b) => {
      const d = stageIndex(a.stage) - stageIndex(b.stage);
      if (d !== 0) return d;
      return String(b.updated ?? "").localeCompare(String(a.updated ?? ""));
    });

  return (
    <main className="fp">
      <style>{CSS}</style>

      <header className="hd">
        <div>
          <p className={`eyebrow ${mono.className}`}>Kairali Web Factory — internal</p>
          <h1 className={grotesk.className}>Fleet Pulse</h1>
        </div>
        <div className="hdmeta">
          <p className="hdnow">
            <span className="hddot" aria-hidden="true" />
            now: <b>{os.milestone}</b>
          </p>
          <p className={`hdstamp ${mono.className}`}>generated {data.generated}</p>
        </div>
      </header>

      <OsStrip os={os} />

      <section aria-label="pipeline board">
        {LANES.map((lane) => {
          const laneSites = sortSites(sites.filter((s) => lane.stages.includes(s.stage)));
          return (
            <section key={lane.id} className="lane" aria-label={`${lane.label} — ${laneSites.length} sites`}>
              <header className="lanehd">
                <h2 className={grotesk.className}>{lane.label}</h2>
                <span className={`lanecount ${grotesk.className}`}>
                  {laneSites.length}
                  <span className="laneof">/{sites.length}</span>
                </span>
                <span className={`lanehint ${mono.className}`}>{lane.hint}</span>
                <span className="lanerule" aria-hidden="true" />
              </header>
              {laneSites.length > 0 ? (
                <div className="lanegrid">
                  {laneSites.map((s) => (
                    <SiteCard key={s.name} site={s} />
                  ))}
                </div>
              ) : (
                <p className={`laneempty ${mono.className}`}>none</p>
              )}
            </section>
          );
        })}

        {unmapped.length > 0 ? (
          <section className="lane" aria-label={`Unmapped stage — ${unmapped.length} sites`}>
            <header className="lanehd">
              <h2 className={grotesk.className}>Unmapped stage</h2>
              <span className={`lanecount ${grotesk.className}`}>{unmapped.length}</span>
              <span className={`lanehint ${mono.className}`}>stage value not in the lane map — shown, not hidden</span>
              <span className="lanerule" aria-hidden="true" />
            </header>
            <div className="lanegrid">
              {unmapped.map((s) => (
                <SiteCard key={s.name} site={s} />
              ))}
            </div>
          </section>
        ) : null}
      </section>

      <footer className={`pgfoot ${mono.className}`}>
        <p>
          generated {data.generated} <span className="sep">·</span> {data.generated_utc} UTC
        </p>
        <p>
          <code>STATUS.yaml</code> is the truth; this board is a generated view. Internal · noindex.
        </p>
      </footer>
    </main>
  );
}

// ---- styles ---------------------------------------------------------------
// Radius scale LOCKED (taste-skill §4.4): cards 14 · inner surfaces 10 ·
// pills 999 · code 6. Nothing else.

const CSS = `
  body { background: ${BG}; }
  .fp { max-width: 1180px; margin: 0 auto; padding: 0 18px 72px; color: ${TEXT};
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        font-size: 15px; line-height: 1.5; }
  .fp code { font-size: 0.85em; background: rgba(242,240,230,0.07); padding: 1px 6px; border-radius: 6px; }
  .fp :focus-visible { outline: 2px solid ${AMBER}; outline-offset: 2px; border-radius: 6px; }
  .fp * { transition: border-color 120ms ease, background 120ms ease, color 120ms ease, transform 120ms ease; }
  @media (prefers-reduced-motion: reduce) { .fp * { transition: none; } }

  /* header */
  .hd { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between;
        gap: 12px 24px; padding: 46px 0 24px; }
  .eyebrow { margin: 0; letter-spacing: 0.22em; font-size: 0.66rem; text-transform: uppercase; color: ${LEAF}; }
  .hd h1 { margin: 6px 0 0; font-size: 2.7rem; font-weight: 700; letter-spacing: -0.03em; color: ${TEXT}; line-height: 1; }
  .hdmeta { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; margin: 0; text-align: right; }
  .hdnow { margin: 0; font-size: 0.85rem; color: ${MUTED}; display: flex; align-items: center; gap: 8px; }
  .hdnow b { color: ${TEXT}; font-weight: 650; }
  .hddot { width: 8px; height: 8px; border-radius: 999px; background: ${LEAF}; flex: none; }
  .hdstamp { margin: 0; font-size: 0.7rem; color: ${FAINT}; }

  /* OS strip — instrument band */
  .osstrip { display: grid; gap: 18px; padding: 20px 0 26px; border-top: 1px solid ${LINE};
             border-bottom: 1px solid ${LINE}; }
  .rail { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 2px 0; list-style: none;
          margin: 0; padding: 0; }
  .railstep { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 78px;
              position: relative; }
  .railseg { position: absolute; top: 20px; right: calc(50% + 22px); width: calc(100% - 44px);
             height: 1.5px; background: ${LINE}; }
  .railsegdone { background: rgba(142,157,53,0.55); }
  .raildot { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px;
             border-radius: 999px; border: 1.5px solid; font-size: 0.82rem; font-weight: 600;
             font-variant-numeric: tabular-nums; }
  .raillabel { font-size: 0.66rem; color: ${MUTED}; max-width: 110px; text-align: center; line-height: 1.25; }
  .railstate { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.08em; }

  .band { display: flex; border: 1px solid ${LINE}; border-radius: 14px; background: ${CARD};
          overflow: hidden; width: fit-content; }
  .stat { display: flex; flex-direction: column; gap: 1px; padding: 12px 22px 10px; min-width: 108px; }
  .stat + .stat { border-left: 1px solid ${LINE}; }
  .statnum { font-size: 1.9rem; font-weight: 600; color: ${TEXT}; line-height: 1.1;
             font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
  .statzero { color: ${FAINT}; }
  .statlabel { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.12em; color: ${MUTED}; }
  .statsub { font-size: 0.62rem; color: ${FAINT}; font-style: italic; }

  /* lanes */
  .lane { margin-top: 36px; }
  .lanehd { display: flex; align-items: baseline; gap: 12px; margin-bottom: 14px; }
  .lanehd h2 { margin: 0; font-size: 1.2rem; font-weight: 600; letter-spacing: -0.01em; color: ${TEXT};
               white-space: nowrap; }
  .lanecount { font-size: 1.2rem; font-weight: 600; color: ${LEAF}; font-variant-numeric: tabular-nums; }
  .laneof { font-size: 0.72rem; color: ${FAINT}; font-weight: 500; }
  .lanehint { font-size: 0.66rem; color: ${FAINT}; white-space: nowrap; }
  .lanerule { flex: 1; height: 1px; background: ${LINE}; align-self: center; min-width: 40px; }
  .laneempty { margin: 0; padding: 10px 16px; border: 1px dashed ${LINE}; border-radius: 14px;
               color: ${FAINT}; font-size: 0.74rem; width: fit-content; }
  .lanegrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 12px; }

  /* site card — double bezel: hairline shell, inset meta surface */
  .site { border: 1px solid ${LINE}; border-radius: 14px; padding: 14px 15px 12px; background: ${CARD}; }
  .site:hover { border-color: ${LINE_UP}; transform: translateY(-1px); }
  .siterow { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
  .sitename { margin: 0; font-weight: 600; font-size: 1.02rem; letter-spacing: -0.01em;
              word-break: break-word; color: ${TEXT}; }
  .phase { flex: none; font-size: 0.85rem; font-weight: 600; color: ${LEAF};
           font-variant-numeric: tabular-nums; }
  .phaseof { font-size: 0.66rem; color: ${FAINT}; }
  .chiprow { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
  .chip { display: inline-block; padding: 1px 9px; border-radius: 999px; font-size: 0.64rem;
          font-weight: 600; letter-spacing: 0.02em; white-space: nowrap; }
  .chip.entity { background: rgba(242,240,230,0.07); color: ${MUTED}; }
  .chip.stage { background: transparent; border: 1px solid rgba(142,157,53,0.5); color: ${LEAF}; }

  /* waiting-on — semantic amber, sits with the card body, not the meta band */
  .waitrow { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; margin-top: 10px; }
  .waitlabel { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: ${FAINT}; }
  .waitchip { padding: 0 8px; border-radius: 999px; border: 1px solid rgba(240,191,62,0.55);
              color: ${AMBER}; font-size: 0.7rem; font-weight: 600; }

  /* meta band — the inner bezel */
  .meta { margin-top: 12px; padding: 10px 12px 9px; background: ${CARD_IN};
          border: 1px solid rgba(242,240,230,0.06); border-radius: 10px;
          display: flex; flex-direction: column; gap: 7px; }

  /* gate dots */
  .gates { display: flex; align-items: center; gap: 5px; }
  .dot { width: 11px; height: 11px; border-radius: 999px; border: 1.5px solid ${LINE_UP}; flex: none; }
  .dot.hollow { background: transparent; }
  .dot.unarmed { background: transparent; border-style: dashed; border-color: ${LINE_UP}; }
  .gatesnote { margin-left: 4px; font-size: 0.62rem; color: ${FAINT}; }

  /* evidence pips */
  .pips { display: flex; flex-wrap: wrap; gap: 4px 6px; }
  .pip { font-size: 0.62rem; padding: 1px 7px; border-radius: 999px;
         background: rgba(242,240,230,0.06); color: ${MUTED}; }
  .pip.pipzero { color: ${FAINT}; background: transparent; border: 1px dashed ${LINE}; }

  /* card footer + links */
  .sitefoot { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;
              gap: 6px 12px; padding-top: 7px; border-top: 1px solid rgba(242,240,230,0.06); }
  .upd { font-size: 0.64rem; color: ${FAINT}; }
  .links { display: flex; flex-wrap: wrap; gap: 6px; }
  .lnk { display: inline-block; padding: 2px 11px; border-radius: 999px; font-size: 0.7rem;
         font-weight: 600; white-space: nowrap; text-decoration: none; color: ${TEXT};
         border: 1px solid ${LINE_UP}; background: transparent; }
  .lnk:hover { background: ${TEXT}; color: ${BG}; border-color: ${TEXT}; }
  .lnk:active { transform: translateY(1px); }
  .lnklive { background: ${FOREST}; border-color: ${FOREST}; color: #EAF3EA; }
  .lnklive:hover { background: #007A48; border-color: #007A48; color: #EAF3EA; }
  .localonly { font-size: 0.7rem; font-style: italic; color: ${FAINT}; }

  /* detail disclosure */
  .detail { margin-top: 10px; }
  .detail summary { cursor: pointer; list-style: none; padding: 6px 0 2px;
                    font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.12em; color: ${FAINT}; }
  .detail summary::-webkit-details-marker { display: none; }
  .detail summary::before { content: "▸ "; color: ${LEAF}; }
  .detail[open] summary::before { content: "▾ "; }
  .detail summary:hover { color: ${MUTED}; }
  .detail[open] { background: ${CARD_UP}; margin: 10px -15px -12px; padding: 0 15px 12px;
                  border-radius: 0 0 14px 14px; border-top: 1px solid ${LINE}; }
  .dl { margin: 6px 0 0; display: grid; grid-template-columns: max-content 1fr; gap: 6px 12px; }
  .dl dt { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: ${FAINT};
           padding-top: 2px; }
  .dl dd { margin: 0; font-size: 0.8rem; color: ${MUTED}; overflow-wrap: anywhere; }
  .dl dd.blocker { white-space: pre-wrap; color: #D9CBB0; }

  /* footer */
  .pgfoot { margin-top: 56px; padding-top: 18px; border-top: 1px solid ${LINE};
            font-size: 0.68rem; color: ${FAINT}; line-height: 1.8; }
  .pgfoot p { margin: 0 0 4px; }
  .pgfoot .sep { margin: 0 6px; }

  @media (max-width: 720px) {
    .hd { padding-top: 30px; }
    .hd h1 { font-size: 2.1rem; }
    .hdmeta { align-items: flex-start; text-align: left; }
    .railstep { min-width: 62px; }
    .raillabel { display: none; } /* phone: id + state carry the meaning */
    .railseg { right: calc(50% + 20px); width: calc(100% - 40px); }
    .band { display: grid; grid-template-columns: repeat(2, 1fr); width: 100%; }
    .stat + .stat { border-left: none; }
    .stat:nth-child(even) { border-left: 1px solid ${LINE}; }
    .stat:nth-child(n+3) { border-top: 1px solid ${LINE}; }
    .lanehint { display: none; }
    .lanegrid { grid-template-columns: 1fr; }
  }
`;
