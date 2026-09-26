// Optional AI narrative (plan Phase 6a). Not built yet: the client falls back to the template summary.
// When built: call the Anthropic API (ANTHROPIC_MODEL, ANTHROPIC_API_KEY) with the engine JSON,
// 8-second timeout, and only use numbers present in that JSON.

export async function POST() {
  return Response.json({ narrative: null, reason: "not-implemented" }, { status: 501 });
}
