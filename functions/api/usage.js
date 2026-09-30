const allowedEvents = new Set(['official_action_opened', 'decision_answer_viewed', 'assistant_setup_opened']);

// Operational events only. Never accept a query, identity, business, URL or
// arbitrary payload. Hosting access logs are outside this application's scope.
export async function onRequest({ request }) {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return new Response(null, { status: 403 });
  if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) return new Response(null, { status: 415 });
  if (Number(request.headers.get('Content-Length') || 0) > 128) return new Response(null, { status: 413 });
  const reader = request.body?.getReader();
  if (!reader) return new Response(null, { status: 400 });
  const chunks = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 128) { await reader.cancel(); return new Response(null, { status: 413 }); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let payload;
  try { payload = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { return new Response(null, { status: 400 }); }
  if (!payload || Object.keys(payload).length !== 1 || !allowedEvents.has(payload.event)) return new Response(null, { status: 400 });
  console.info(JSON.stringify({ event: payload.event, transport: 'website' }));
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}
