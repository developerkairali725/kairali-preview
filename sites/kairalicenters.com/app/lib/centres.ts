// Kairali treatment-centre network data — re-exported from @kairali/facts,
// the locked-fact constants package (single source of truth since 17 Jul
// 2026; canonical ruling: the KAC website's published figures are canonical
// for all properties, PROJECT_CONTEXT §12). The roster there is transcribed
// VERBATIM from the live kairalicenters.com /locations/ page (mined
// 2026-07-14, docs/group-inputs/kairalicenters-org-inventory.md); nothing is
// invented (CLAUDE.md rule 6). This site still asserts NO aggregate count in
// its own copy — wherever a site needs the network numbers, it renders the
// package's computed constants. Partner-branded centres stay marked
// `partner: true` pending the owned-vs-franchise ruling (Q-KC-PARTNERS).

export {
  CENTRES,
  INDIA_CENTRES,
  INTERNATIONAL_CENTRES,
  COUNTRIES,
  centreBySlug,
} from "@kairali/facts";
export type { Centre } from "@kairali/facts";
