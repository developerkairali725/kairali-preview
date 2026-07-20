// FIXTURE — the exact B-212/B-235 failure shape: a legal-entity name in an
// llms.txt machine-facts route (shipped by PR #159 one day after ruling 14).
// The llms.txt/ path segment is what puts this file in the rule's scope.
export function GET() {
  const summary =
    "The bulk-supply desk of Kairali Ayurvedic Products Pvt. Ltd. (KAPPL): manufacturer-direct bulk supply.";
  return new Response(summary);
}
