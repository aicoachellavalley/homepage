import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveLocalIntent, searchBusinessPreviews, getBusinessPreview } from '../src/lib/local-intent.mjs';
import { handleMcp, handleIntentHttp } from '../src/lib/mcp-handler.mjs';
const catalog = JSON.parse(readFileSync(new URL('../src/data/intent-catalog.json', import.meta.url)));
const query = 'Find a quiet Palm Desert coffee shop for a founder meeting near El Paseo.';
const request = (message, headers = {}) => new Request('https://aicoachellavalley.com/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-11-25', ...headers }, body: JSON.stringify(message) });
const rpc = (method, params = {}, id = 1) => ({ jsonrpc: '2.0', id, method, params });

test('catalog exposes all deployed previews, attributed observations and regional nodes without resetting source dates', () => {
  assert.equal(catalog.source_counts.published_previews, 1568);
  assert.equal(catalog.source_counts.regional_nodes, 79);
  assert.equal(catalog.previews.filter((r) => r.segment === 'local-observation').length, 9);
  const preview = catalog.previews.find((r) => r.record_type === 'business-preview');
  assert.equal(preview.measurement_date, null);
  assert.match(preview.manifest_generated_at, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(preview.publication_verified_at, '2026-08-19');
  assert.match(preview.measurement_date_note, /no per-entity inspection date/);
  const rutina = getBusinessPreview({ id: 'local/rutina-coffee' }, catalog).record;
  assert.equal(rutina.source_checked_at, '2026-09-01');
  assert.equal(rutina.provenance.imported_at, '2026-09-30');
  assert.equal('fit' in rutina, false);
});
test('coffee decision returns local choices instead of regional economic context and leaves quietness unresolved', () => {
  const result = resolveLocalIntent({ query }, catalog);
  assert.equal(result.intent, 'local-business');
  assert.equal(result.status, 'needs_details');
  assert.deepEqual(result.regional_context, []);
  assert.ok(result.results.some((r) => r.id === 'local/sottovoce-cafe'));
  assert.ok(result.results.some((r) => r.id === 'local/rutina-coffee'));
  assert.ok(result.results.every((r) => r.city === 'Palm Desert'));
  assert.match(result.unresolved_constraints.join(' '), /noise.*not established/);
  assert.equal(result.results.some((r) => r.quiet === true || r.verified === true), false);
});
test('named coffee lookup is selective and exact stable record retrieval does not invent records', () => {
  const result = searchBusinessPreviews({ query: 'Rutina Coffee Palm Desert agent preview' }, catalog);
  assert.deepEqual(result.results.map((r) => r.id), ['local/rutina-coffee']);
  assert.equal(getBusinessPreview({ id: 'local/nonexistent' }, catalog).status, 'not_found');
  assert.equal(searchBusinessPreviews({ city: 'Palm Desert', segment: 'hospitality' }, catalog).status, 'matches');
});
test('unknown name and outside city queries return no matches rather than unrelated fallback', () => {
  assert.equal(searchBusinessPreviews({ query: 'Zzqx UnrecordedEntity', city: 'Palm Desert' }, catalog).status, 'no_match');
  const outside = resolveLocalIntent({ query: 'Find a San Diego coffee shop' }, catalog);
  assert.equal(outside.status, 'no_match');
  assert.deepEqual(outside.regional_context, []);
  assert.equal(resolveLocalIntent({ query: 'Coffee', city: 'Los Angeles' }, catalog).status, 'no_match');
  assert.equal(resolveLocalIntent({ query: 'Find a San Francisco coffee shop' }, catalog).status, 'no_match');
  assert.equal(resolveLocalIntent({ query: 'Find Rutina Coffee in Rancho Mirage' }, catalog).status, 'no_match');
});
test('team retreat uses sourced options, preserves narrow capacity scopes and excludes known 48-person buyout limit', () => {
  const sixteen = resolveLocalIntent({ query: 'A leadership team retreat for 16 people', group_size: 16 }, catalog);
  assert.equal(sixteen.intent, 'team-retreat');
  assert.ok(sixteen.results.length >= 3 && sixteen.results.length <= 5);
  const namedRitz = resolveLocalIntent({ query: 'Leadership retreat at Ritz-Carlton for 16 people', group_size: 16 }, catalog);
  assert.ok(namedRitz.results.some((r) => r.id === 'node/ritz-carlton'));
  assert.match(namedRitz.results[0].constraints.join(' '), /Boardroom|working|layout/);
  assert.ok(sixteen.results.every((r) => r.official_actions[0].checked_at === r.source_checked_at));
  const sixty = resolveLocalIntent({ query: 'A team retreat for 60 people', limit: 20 }, catalog);
  assert.equal(sixty.group_size, 60);
  assert.equal(sixty.results.some((r) => r.id === 'node/sensei-porcupine-creek'), false);
  const namedLarge = resolveLocalIntent({ query: 'Leadership retreat at Ritz-Carlton for 60 people', group_size: 60 }, catalog);
  assert.ok(namedLarge.results.length === 1);
  assert.ok(namedLarge.results[0].meeting_spaces.some((s) => s.capacity >= 60) || namedLarge.results[0].unknowns.some((u) => /60|20-person/.test(u)));
  assert.match(sixty.limitations.join(' '), /48-guest/);
  assert.ok(resolveLocalIntent({ query: 'A team retreat in Palm Desert' }, catalog).results.every((r) => r.city === 'Palm Desert'));
  assert.ok(resolveLocalIntent({ query: 'A team retreat in Palm Desert' }, catalog).results.length > 0);
});
test('near Palm Springs retreat question includes regional candidates without claiming verified proximity', () => {
  const question = 'Plan a November leadership retreat for 16 people near Palm Springs.';
  const result = resolveLocalIntent({ query: question }, catalog);
  assert.equal(result.intent, 'team-retreat');
  assert.equal(result.status, 'needs_details');
  assert.equal(result.city, 'Palm Springs');
  assert.equal(result.group_size, 16);
  assert.ok(result.results.length >= 3 && result.results.length <= 5);
  assert.ok(result.results.some((r) => r.city !== 'Palm Springs'));
  assert.match(result.limitations.join(' '), /proximity and drive times have not been verified/);
  assert.match(result.next_questions.join(' '), /maximum acceptable drive time/);
  for (const strict of [
    { query: question, city: 'Palm Springs' },
    { query: 'Plan a leadership retreat for 16 people in Palm Springs.' },
    { query: 'Plan a leadership retreat within Palm Springs, near Palm Springs airport.' },
    { query: 'Plan a leadership retreat near San Diego.' },
  ]) {
    const answer = resolveLocalIntent(strict, catalog);
    if (strict.query.includes('San Diego')) assert.equal(answer.status, 'no_match');
    else { assert.ok(answer.results.length > 0); assert.ok(answer.results.every((r) => r.city === 'Palm Springs')); }
  }
  assert.ok(resolveLocalIntent({ query: 'Plan a leadership retreat around Palm Desert.' }, catalog).results.some((r) => r.city !== 'Palm Desert'));
});
test('the actual retreat form default resolves the work and overnight trip without requiring the retreat keyword', () => {
  const page = readFileSync(new URL('../src/pages/plan-team-retreat.astro', import.meta.url), 'utf8');
  const defaultQuery = page.match(/<textarea\b[^>]*\bid="retreat-query"[^>]*>([\s\S]*?)<\/textarea>/)?.[1];
  assert.ok(defaultQuery, 'The shipped form must supply a default decision question.');
  // Keep the originally observed browser regression even if page copy evolves.
  const regressionQuery = 'We’re bringing a leadership team to the Coachella Valley for two nights. We need a private working session and time to reconnect. Which venues should we compare?';
  for (const decision of [defaultQuery, regressionQuery,
    'Where can our executive team stay overnight and have a private working session in the Coachella Valley?',
    'Compare venues for a corporate team gathering with meeting rooms in the Coachella Valley.']) {
    const result = resolveLocalIntent({ query: decision, group_size: 16 }, catalog);
    assert.equal(result.intent, 'team-retreat');
    assert.ok(result.results.length > 0);
    assert.ok(result.results.every((r) => catalog.retreat.options.some((o) => o.id === r.id && o.qualified === true)));
    assert.ok(result.results.length >= 3 && result.results.length <= 5);
    assert.ok(result.results.every((r) => r.record_type === 'researched-retreat-option' && r.official_actions.length === 1 && r.official_actions[0].kind === 'official_group_proposal'));
  }
  const coffee = resolveLocalIntent({ query: 'Find a coffee shop for our leadership team meeting in Palm Desert near El Paseo.' }, catalog);
  assert.equal(coffee.intent, 'local-business');
  assert.ok(coffee.results.some((r) => r.id === 'local/sottovoce-cafe'));
  const office = resolveLocalIntent({ query: 'Our leadership team needs a satellite office with meeting rooms in Palm Desert.' }, catalog);
  assert.equal(office.intent, 'satellite-base');
});
test('satellite decision routes research deliberately and calculates freshness at request time', () => {
  const result = resolveLocalIntent({ query: 'Is Palm Desert a satellite office option?' }, catalog);
  assert.equal(result.intent, 'satellite-base');
  assert.ok(result.regional_context.some((r) => r.id === 'node/cook-street-university-row'));
  assert.ok(result.regional_context.every((r) => typeof r.freshness === 'string'));
  assert.ok(result.results.length > 0);
  assert.ok(result.results.every(r=>r.action_capability==='official_handoff'));
});
test('MCP handshake, initialized notification, tool schemas and all three tools work in stable JSON transport', async () => {
  const init = await handleMcp(request(rpc('initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'aicv-test', version: '1' } })), catalog);
  assert.equal(init.status, 200);
  const hello = await init.json();
  assert.equal(hello.result.protocolVersion, '2025-11-25');
  assert.equal(hello.result.capabilities.tools.listChanged, false);
  assert.equal(init.headers.has('MCP-Session-Id'), false);
  const notified = await handleMcp(request({ jsonrpc: '2.0', method: 'notifications/initialized' }), catalog);
  assert.equal(notified.status, 202);
  assert.equal(await notified.text(), '');
  const list = await (await handleMcp(request(rpc('tools/list')), catalog)).json();
  assert.deepEqual(list.result.tools.map((t) => t.name), ['resolve_local_intent', 'search_business_previews', 'get_business_preview']);
  assert.ok(list.result.tools.every((t) => t.annotations.readOnlyHint && !t.annotations.openWorldHint));
  for (const [name, args] of [['resolve_local_intent', { query }], ['search_business_previews', { query: 'Rutina' }], ['get_business_preview', { id: 'local/rutina-coffee' }]]) {
    const result = await (await handleMcp(request(rpc('tools/call', { name, arguments: args })), catalog)).json();
    assert.equal(result.result.isError, false);
    assert.deepEqual(JSON.parse(result.result.content[0].text), result.result.structuredContent);
  }
});
test('MCP rejects unsupported operations, bad protocol/origin/arguments, large bodies and streaming GET', async () => {
  const unknown = await (await handleMcp(request(rpc('tools/call', { name: 'delete_business', arguments: {} })), catalog)).json();
  assert.equal(unknown.error.code, -32602);
  assert.equal((await handleMcp(request(rpc('ping'), { 'MCP-Protocol-Version': '2099-01-01' }), catalog)).status, 400);
  assert.equal((await handleMcp(request(rpc('ping'), { Origin: 'http://evil.example' }), catalog)).status, 403);
  assert.equal((await handleMcp(request(rpc('ping'), { Origin: 'https://chatgpt.com' }), catalog)).status, 200);
  const bad = await (await handleMcp(request(rpc('tools/call', { name: 'resolve_local_intent', arguments: { query, group_size: -1 } })), catalog)).json();
  assert.equal(bad.error.code, -32602);
  assert.equal((await handleMcp(request(rpc('tools/call', { name: 'resolve_local_intent', arguments: { query: 'x'.repeat(17000) } })), catalog)).status, 413);
  assert.equal((await handleMcp(new Request('https://aicoachellavalley.com/mcp'), catalog)).status, 405);
  const wrongType = new Request('https://aicoachellavalley.com/mcp', { method: 'POST', headers: { Accept: 'application/json' }, body: '{}' });
  assert.equal((await handleMcp(wrongType, catalog)).status, 415);
});
test('HTTP doorway returns same result and operational logs contain no queries, names or client data', async () => {
  const logs = []; const original = console.info; console.info = (line) => logs.push(JSON.parse(line));
  try {
    const response = await handleIntentHttp(request({ query }), catalog);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), resolveLocalIntent({ query }, catalog));
    assert.equal(logs.length, 1);
    assert.deepEqual(Object.keys(logs[0]).sort(), ['event', 'outcome', 'result_count', 'tool', 'transport']);
    assert.equal(JSON.stringify(logs).includes('Palm Desert'), false);
    assert.equal(JSON.stringify(logs).includes('Rutina'), false);
    assert.equal(JSON.stringify(logs).includes(query), false);
    const satelliteQuery = 'Is Palm Desert a satellite office option?';
    const satellite = await handleIntentHttp(request({ query: satelliteQuery }), catalog);
    const satelliteResult = await satellite.json();
    assert.equal(logs[1].result_count, satelliteResult.results.length + satelliteResult.regional_context.length);
    assert.ok(logs[1].result_count > 0);
    assert.equal(JSON.stringify(logs).includes(satelliteQuery), false);
  } finally { console.info = original; }
});
test('transaction requests return an explicit no-execution boundary', () => {
  const result = resolveLocalIntent({ query: 'Book Rutina Coffee Palm Desert for a private meeting' }, catalog);
  assert.match(result.unresolved_constraints.join(' '), /No booking, payment or reservation has been made/);
  assert.match(result.limitations.join(' '), /not live availability/);
});
