import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/usage.js';

const request = (payload, headers = {}) => new Request('https://aicv.example/api/usage', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://aicv.example', ...headers }, body: JSON.stringify(payload),
});
test('usage records an allowed event without the request identity or body', async () => {
  const saved = console.info;
  const events = [];
  console.info = value => events.push(JSON.parse(value));
  try {
    const response = await onRequest({ request: request({ event: 'official_action_opened' }, { 'X-Forwarded-For': '192.0.2.1' }) });
    assert.equal(response.status, 204);
    assert.deepEqual(events, [{ event: 'official_action_opened', transport: 'website' }]);
  } finally { console.info = saved; }
});
test('usage rejects extra data, unknown events and a cross-origin request', async () => {
  for (const body of [{ event: 'official_action_opened', query: 'private plan' }, { event: 'booking_completed' }, null]) {
    assert.equal((await onRequest({ request: request(body) })).status, 400);
  }
  assert.equal((await onRequest({ request: request({ event: 'decision_answer_viewed' }, { Origin: 'https://outside.example' }) })).status, 403);
});
test('usage enforces byte length and JSON format', async () => {
  assert.equal((await onRequest({ request: request({ event: 'x'.repeat(200) }) })).status, 413);
  assert.equal((await onRequest({ request: new Request('https://aicv.example/api/usage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }) })).status, 400);
});
