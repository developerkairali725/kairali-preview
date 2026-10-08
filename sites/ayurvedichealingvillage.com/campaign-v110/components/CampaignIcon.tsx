/** Original, consistent line artwork for the existing feature/process labels.
 * Decorative symbols only; no accreditation or clinical imagery is recreated. */
export default function CampaignIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    nature: <><path d="M32 52V28M32 40C13 42 12 23 13 15c16 0 25 8 19 25ZM32 33c-2-17 9-24 22-24 0 14-5 25-22 24Z"/><path d="M16 54h32"/></>,
    modern: <><path d="m8 27 24-17 24 17M14 27v27h36V27M8 54h48M26 54V36h12v18M18 28h28"/><path d="M20 21h24"/></>,
    trained: <><circle cx="25" cy="20" r="8"/><path d="M10 51v-7c0-9 7-15 15-15 4 0 8 2 11 5M39 35l7-4 7 4v10c0 6-7 10-7 10s-7-4-7-10Z"/><path d="m42 41 3 3 5-6"/></>,
    local: <><path d="M12 39h40l-5 14H17ZM18 39V28M32 39V17M45 39V25M32 27c-10 0-13-6-13-12 10 0 13 6 13 12ZM33 23c9 0 13-6 13-12-10 0-13 6-13 12Z"/></>,
    strict: <><path d="M9 34h46c-1 13-9 21-23 21S10 47 9 34ZM17 58h30M31 34V18M31 26C18 26 17 15 18 9c12 0 18 7 13 17ZM32 26c13 0 16-9 15-16-12 0-16 7-15 16Z"/></>,
    inhouse: <><path d="M21 21h22v34H21ZM25 10h14v11H25ZM21 31h22M21 45h22"/><path d="M32 43V34m0 6c-5 0-7-3-7-6 5 0 7 3 7 6Zm0-1c5 0 7-3 7-6-5 0-7 3-7 6Z"/></>,
    nopr: <><path d="M25 11h14M28 11v16L16 49c-2 4 1 6 5 6h22c4 0 7-2 5-6L36 27V11M22 39h20"/><path d="m11 12 43 43"/></>,
    nore: <><path d="M32 11v42M14 21l36 22M14 43l36-22M26 15l6 6 6-6M26 49l6-6 6 6M14 28l9-2-1-9M42 47l-1-9 9-2M14 36l9 2-1 9M42 17l-1 9 9 2"/><path d="m9 9 46 46"/></>,
    organic: <><path d="M8 50c10-5 15-5 24 0s15 5 24 0M8 57c10-5 15-5 24 0s15 5 24 0M32 47V25M32 37c-16 0-20-11-19-21 16 0 23 10 19 21ZM32 31c-1-13 8-19 20-19 1 12-7 21-20 19Z"/></>,
    connect: <><path d="M10 14h44v31H30L18 54v-9h-8ZM19 24h26M19 33h19"/></>,
    appointment: <><rect x="12" y="16" width="40" height="38" rx="3"/><path d="M12 27h40M22 10v13M42 10v13m-21 18 7 7 16-16"/></>,
    checklist: <><path d="M23 13h-8v42h34V13h-8M23 9h18v11H23ZM28 31h13M28 43h13m-9-4 2 2 3-4m-5-8 2 2 3-4"/></>,
    consultation: <><circle cx="20" cy="19" r="7"/><circle cx="45" cy="19" r="7"/><path d="M8 52V40c0-8 5-12 12-12 4 0 7 2 9 5M56 52V40c0-8-5-12-11-12-4 0-7 2-9 5M23 43h19M20 52h25"/></>,
    treatment: <><path d="M10 45h44v10H10ZM18 43V26h28v17M25 26V14h14v12M25 14V9h14v5M25 33h14"/></>,
  };
  return <svg className="campaign-feature-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] || paths.nature}</svg>;
}
