import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { handleMcp } from '../src/lib/mcp-handler.mjs';
const catalog = JSON.parse(readFileSync(new URL('../src/data/intent-catalog.json', import.meta.url)));
const options = catalog.retreat.options;
const bySlug = (slug) => options.find((o) => o.slug === slug);
const byResult = (result, slug) => result.results.find((r) => r.id === bySlug(slug)?.id);
const cases = [
  ['executive', { query: 'Executive leadership strategy retreat for 16 people, two nights, private working room', group_size: 16, nights: 2 }],
  ['shared-budget', { query: 'Practical strategy retreat for 16 people sharing rooms, two nights, $25,000 total', group_size: 16, shared_lodging: true, nights: 2, budget: '$25,000 total' }],
  ['wellness', { query: 'Wellness retreat for 16 people, two nights, mindfulness and yoga', group_size: 16, nights: 2, purpose: 'wellness' }],
  ['boutique', { query: 'Boutique hotel leadership retreat for 16 people', group_size: 16 }],
  ['private', { query: 'Private estate retreat for 16 people sharing rooms with chef and AV', group_size: 16, shared_lodging: true, privacy: 'exclusive-use' }],
  ['day-only', { query: 'Day-only team retreat for 16 people, no overnight lodging', group_size: 16, day_only: true }],
  ['large', { query: 'Leadership retreat for 60 people', group_size: 60 }],
  ['accessibility', { query: 'Leadership retreat for 16 people', group_size: 16, accessibility: 'Two wheelchair users need step-free rooms and meeting routes' }],
  ['strict-city', { query: 'Leadership retreat in Palm Desert for 16 people', group_size: 16 }],
  ['nearby', { query: 'Leadership retreat near Palm Springs for 16 people', group_size: 16 }],
  ['unsupported-name', { query: 'Plan an overnight retreat at Palm Canyon Unrecorded Motel for 16 people', group_size: 16 }],
  ['outside-coverage', { query: 'Leadership retreat near San Diego for 16 people', group_size: 16 }],
];
async function call(args, name = 'resolve_local_intent') {
  const response = await handleMcp(new Request('https://example.com/mcp', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-11-25' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
  }), catalog);
  assert.equal(response.status, 200);
  const envelope = await response.json();
  assert.equal(envelope.error, undefined, JSON.stringify(envelope.error));
  assert.equal(envelope.result.isError, false);
  assert.deepEqual(JSON.parse(envelope.result.content.find((c) => c.type === 'text').text), envelope.result.structuredContent);
  return envelope.result.structuredContent;
}
const results = new Map();
for (const [label, args] of cases) test(`synthetic MCP benchmark: ${label}`, async () => {
  const result = await call(args); results.set(label, result);
  if (label === 'unsupported-name' || label === 'outside-coverage') {
    assert.equal(result.status, 'no_match'); assert.deepEqual(result.results, []); return;
  }
  assert.equal(result.intent, 'team-retreat');
  assert.ok(result.results.length > 0 && result.results.length <= 5);
  assert.equal(result.requirements.group_size, 16 === args.group_size ? 16 : 60);
  for (const r of result.results) {
    const source = options.find((o) => o.id === r.id);
    assert.equal(source?.qualified, true, `Unqualified result ${r.id}`);
    assert.equal(r.source_checked_at, source.source_checked_at);
    assert.deepEqual(r.field_evidence, source.field_evidence);
    assert.equal(r.fit_assessment_type, 'judgment');
    assert.ok(r.unknowns.some((u) => /availability.*quote|quote.*availability/.test(u)));
    assert.ok(r.official_actions.every((a) => /^https:\/\//.test(a.url) && a.checked_at === source.source_checked_at));
    assert.equal(r.node_last_updated, source.node_last_updated ?? null);
    assert.equal(r.price, undefined); assert.equal(r.available, undefined);
  }
  if (label === 'strict-city') assert.ok(result.results.every((r) => r.city === 'Palm Desert'));
  if (label === 'nearby') {
    assert.ok(result.results.some((r) => r.city !== 'Palm Springs'));
    assert.match(result.limitations.join(' '), /drive times have not been verified/);
    assert.match(result.next_questions.join(' '), /maximum acceptable drive time/);
  }
  if (label === 'large') {
    assert.ok(result.results.some((r) => r.meeting_spaces.some((space) => space.capacity >= 60 && /conference|classroom|schoolroom|u.shape|boardroom/.test(space.layout))));
    assert.equal(byResult(result, 'sensei-porcupine-creek'), undefined);
    assert.ok(result.exclusions.some((e) => e.id === bySlug('sensei-porcupine-creek').id && e.reasons.some((r) => /48/.test(r.reason))));
  }
  if (label === 'shared-budget') {
    assert.equal(result.requirements.rooms, 8);
    assert.match(result.next_questions.join(' '), /25,000.*whole retreat/);
    assert.ok(result.results.every((r) => r.unknowns.some((u) => /Affordability.*unknown/.test(u))));
  }
  if (label === 'wellness') assert.ok(result.results.some((r) => bySlug('sensei-porcupine-creek').id === r.id || bySlug('two-bunch-palms').id === r.id));
  if (label === 'private') {
    assert.ok(result.results.some((r) => r.category === 'private-lodging'));
    assert.ok(result.supporting_services.some((r) => r.service_type === 'dining'));
    assert.ok(result.supporting_services.every((r) => !result.results.some((v) => v.id === r.id)));
  }
  if (label === 'day-only') { assert.equal(result.requirements.nights, 0); assert.equal(result.requirements.rooms, null); }
  if (label === 'accessibility') {
    assert.ok(result.results.every((r) => r.unknowns.some((u) => /Required accessibility/.test(u))));
    assert.match(result.next_questions.join(' '), /mobility.*access requirements/);
  }
});
test('preferences produce different evidence choices or follow-up burdens; accessibility alone does not imply fit', async () => {
  const answers = await Promise.all(cases.slice(0, 10).map(async ([label, args]) => [label, await call(args)]));
  const map = new Map(answers); const ids = (label) => map.get(label).results.map((r) => r.id).join('|');
  assert.notEqual(ids('executive'), ids('private'));
  assert.notEqual(ids('executive'), ids('wellness'));
  assert.notEqual(ids('executive'), ids('shared-budget'));
  const plain = await call({ query: 'Leadership retreat for 16 people', group_size: 16 });
  assert.deepEqual(map.get('accessibility').results.map((r) => r.id), plain.results.map((r) => r.id));
});
test('named properties preserve real layout, inventory and policy scopes', async () => {
  const ritz = await call({ query: 'Leadership retreat at Ritz-Carlton for 60 people', group_size: 60 });
  assert.ok(byResult(ritz, 'ritz-carlton'));
  assert.ok(ritz.results[0].meeting_spaces.some((s) => s.capacity >= 60) || ritz.results[0].unknowns.some((u) => /60|20-person/.test(u)));
  const hotel = await call({ query: 'Leadership retreat at Hotel Paseo for 16 people', group_size: 16 });
  assert.equal(hotel.results.length, 1);
  assert.match(hotel.results[0].fit_reasons.join(' '), /Paseo A.*conference|Paseo A.*u.shape/);
  assert.doesNotMatch(hotel.results[0].fit_reasons.join(' '), /Palm Boardroom.*up to 16/);
  const villa = bySlug('venueten-casa-del-lujo-estate-lujo-villa');
  const own = await call({ query: 'Retreat at VenueTEN for 16 people', group_size: 16, rooms: 16 });
  assert.ok(own.exclusions.some((e) => e.id === villa.id && e.reasons.some((r) => /12.*bedrooms/.test(r.reason))));
  const shared = await call({ query: 'Retreat at VenueTEN for 16 people sharing rooms', group_size: 16, shared_lodging: true });
  assert.ok(byResult(shared, villa.slug)); assert.match(shared.results[0].unknowns.join(' '), /beds.*occupancy|bed.*configuration/);
  const short = await call({ query: 'Retreat at Sensei for 16 people for one night', group_size: 16, nights: 1 });
  assert.equal(short.status, 'no_match'); assert.ok(short.exclusions.some((e) => e.reasons.some((r) => /2-night|two-night/.test(r.reason))));
});
test('municipal arguments remain strict and distance wording stays an unsupported regional anchor', async () => {
  const strict = await call({ query: 'Leadership retreat near Palm Springs for 16 people', city: 'Palm Springs', nearby: true, group_size: 16 });
  assert.ok(strict.results.every((r) => r.city === 'Palm Springs'));
  const distance = await call({ query: 'Leadership retreat within 10 miles of Palm Springs for 16 people', group_size: 16 });
  assert.ok(distance.results.some((r) => r.city !== 'Palm Springs'));
  assert.match(distance.limitations.join(' '), /distance|proximity|drive times.*not.*verified/);
});
test('unknown locations do not become published incompatibility and services keep capacity separate', async () => {
  const old = bySlug('the-old-polo-estate');
  const result = await call({ query: 'Private estate retreat in Indio for 16 people', group_size: 16, rooms: 8 });
  const conflict = result.unestablished_matches.find((e) => e.id === old.id);
  assert.ok(conflict); assert.ok(conflict.reasons.some((r) => r.evidence_type === 'unknown' || r.evidence_type === 'unresolved'));
  assert.equal(conflict.reasons.some((r) => r.evidence_type === 'published_fact' && /city|boundary/.test(r.reason)), false);
  const big = await call({ query: 'Private estate retreat for 60 people with chef and airport transport', group_size: 60 });
  assert.equal(big.supporting_services.some((r) => /No Worries/.test(r.name)), false);
  assert.ok(big.service_exclusions.some((r) => /No Worries/.test(r.name)));
});
test('retreat tool rejects ill-typed expanded constraints through actual MCP adapter', async () => {
  for (const invalid of [{ rooms: 0 }, { nights: -1 }, { day_only: 'true' }, { shared_lodging: 'yes' }, { nearby: 1 }, { accessibility: '' }]) {
    const res = await handleMcp(new Request('https://example.com/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'resolve_local_intent', arguments: { query: 'team retreat', ...invalid } } }) }), catalog);
    assert.equal((await res.json()).error.code, -32602);
  }
});
test('only explicitly qualified records enter retreat comparison and targeted dates survive the adapter', async () => {
  const copy = structuredClone(catalog);
  const original = copy.retreat.options.find((o) => o.slug === 'courtyard-palm-desert');
  original.source_checked_at = '2026-10-06';
  original.field_evidence.meeting_spaces.checked_at = '2026-10-05';
  original.action_checked_at = '2026-10-04';
  const unqualified = structuredClone(original);
  Object.assign(unqualified, { id: 'retreat/unqualified-probe', slug: 'unqualified-probe', name: 'Unqualified Probe', qualified: false });
  copy.retreat.options.push(unqualified);
  const response = await handleMcp(new Request('https://example.com/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'resolve_local_intent', arguments: { query: 'Retreat at Courtyard Palm Desert for 16 people', group_size: 16 } } }) }), copy);
  const r = (await response.json()).result.structuredContent;
  const record = r.results.find((v) => v.id === original.id);
  assert.ok(record); assert.equal(record.source_checked_at, '2026-10-06');
  assert.equal(record.field_evidence.meeting_spaces.checked_at, '2026-10-05');
  assert.equal(record.official_actions[0].checked_at, '2026-10-04');
  assert.equal(r.results.some((v) => v.id === unqualified.id), false);
  for (const record of [...options, ...catalog.retreat.services]) {
    const fetched = await call({ id: record.id }, 'get_business_preview');
    assert.equal(fetched.status, 'found'); assert.equal(fetched.record.id, record.id);
    assert.equal(fetched.record.source_checked_at, record.source_checked_at);
  }
});
test('Bermuda Dunes is a known location with the separately sourced VenueTEN inquiry', async () => {
  const result = await call({ query: 'Retreat at VenueTEN for 16 people', city: 'Bermuda Dunes', group_size: 16, shared_lodging: true });
  assert.equal(result.intent, 'team-retreat'); assert.equal(result.status, 'needs_details');
  assert.equal(result.results.length, 1); assert.equal(result.results[0].city, 'Bermuda Dunes');
});

test('caller regression: "We are not sharing rooms" preserves individual rooms for 16 people', async () => {
  const r = await call({ query: 'Leadership retreat for 16 people. We are not sharing rooms', group_size: 16 });
  assert.equal(r.requirements.shared_lodging, false);
  assert.equal(r.requirements.rooms, 16);
  assert.match(r.requirements.rooms_basis, /one attendee per room/);
  assert.doesNotMatch(r.next_questions.join(' '), /is room sharing acceptable|Can two attendees share/);
});
test('caller regression: "Two nights with one day of strategy meetings" retains overnight lodging', async () => {
  for (const structured of [{}, { nights: 2 }]) {
    const r = await call({ query: 'Leadership retreat for 16 people. Two nights with one day of strategy meetings', group_size: 16, shared_lodging: false, ...structured });
    assert.equal(r.requirements.day_only, false);
    assert.equal(r.requirements.nights, 2);
    assert.equal(r.requirements.rooms, 16);
  }
});
test('caller regression: "Exclude Parker" returns alternatives and a caller-request exclusion', async () => {
  const r = await call({ query: 'Leadership retreat for 16 people. Exclude Parker', group_size: 16 });
  assert.ok(r.results.length >= 3);
  assert.ok(r.results.every(v => v.id !== 'node/parker-palm-springs'));
  assert.ok(r.exclusions.some(v => v.id === 'node/parker-palm-springs' && v.reasons.some(reason => reason.evidence_type === 'caller_requirement')));
});
test('caller regression: "alternatives to Sensei" does not select Sensei', async () => {
  const r = await call({ query: 'Wellness retreat for 16 people; alternatives to Sensei', group_size: 16 });
  assert.ok(r.results.length >= 3);
  assert.ok(r.results.every(v => v.id !== 'node/sensei-porcupine-creek'));
  assert.ok(r.exclusions.some(v => v.id === 'node/sensei-porcupine-creek' && v.reasons.some(reason => reason.evidence_type === 'caller_requirement')));
});
test('positive named selections survive exclusions, and coordinated exclusions do not become selections', async () => {
  const mixed = await call({ query: 'Leadership retreat for 16 people at Hotel Paseo; exclude Parker', group_size: 16 });
  assert.deepEqual(mixed.results.map(v => v.id), ['node/hotel-paseo']);
  const both = await call({ query: 'Leadership retreat for 16 people; exclude Parker and Sensei', group_size: 16 });
  assert.ok(both.results.length >= 3);
  assert.ok(both.results.every(v => !['node/parker-palm-springs', 'node/sensei-porcupine-creek'].includes(v.id)));
  assert.equal(both.exclusions.filter(v => v.reasons.some(r => r.evidence_type === 'caller_requirement')).length, 2);
});
test('structured lodging instructions override text, and genuine day-only requests stay day-only', async () => {
  const explicit = await call({ query: 'Leadership retreat for 16 people. We are not sharing rooms', group_size: 16, shared_lodging: true, nights: 2 });
  assert.equal(explicit.requirements.rooms, 8);
  const day = await call({ query: 'Day-only leadership retreat for 16 people', group_size: 16, day_only: true, nights: 2, rooms: 16 });
  assert.equal(day.requirements.day_only, true);
  assert.equal(day.requirements.nights, 0);
  assert.equal(day.requirements.rooms, null);
});
