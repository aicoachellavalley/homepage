const allowedEvents = new Set(['official_action_opened', 'decision_answer_viewed', 'assistant_setup_opened']);

// Operational events only. Never accept a query, identity, business, URL or
// arbitrary payload. Hosting access logs are outside this application's scope.
export async function onRequest({ request }) {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return new Response(null, { status: 403 });
  if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) return new Response(null, { status: 415 });
  if (Number(request.headers.get('Content-Length') || 0) > 128) return new Response(null, { status: 413 });
  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.length > 128) return new Response(null, { status: 413 });
  let payload;
  try { payload = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { return new Response(null, { status: 400 }); }
  if (!payload || Object.keys(payload).length !== 1 || !allowedEvents.has(payload.event)) return new Response(null, { status: 400 });
  console.info(JSON.stringify({ event: payload.event, transport: 'website' }));
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}
