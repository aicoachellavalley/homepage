import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveLocalIntent } from '../src/lib/local-intent.mjs';
import { workspaceBrief } from '../src/lib/workspace-brief.mjs';
// Independent decision scenarios use current source evidence with the retained
// historical context. Build/catalog derivation is a separate integration gate.
const read = name => JSON.parse(readFileSync(new URL(name, import.meta.url)));
const workspace = read('../src/data/workspace-options.json');
const catalog = { ...read('../src/data/intent-catalog.json'), workspace };
const ids = result => result.results.map(o => o.id);
const hiveId = 'workspace/the-hive-coworking';
const regusId = 'workspace/regus-750-n-palm-canyon';
const fusionId = 'workspace/fusion-workplaces-palm-desert';
const ercId = 'local/entrepreneurship-resource-center';

test('published day-pass comparison includes both operators without claiming a reservation', () => {
  const r = resolveLocalIntent({ query: 'Find a Palm Springs day pass', workspace_access: 'day-pass' }, catalog);
  assert.deepEqual(new Set(ids(r)), new Set([hiveId, regusId]));
  assert.equal(r.status, 'needs_details');
  for (const o of r.results) {
    assert.equal(o.availability.value, null);
    assert.equal(o.action_capability, 'official_handoff');
  }
  assert.match(r.results.find(o => o.id === hiveId).facts.map(f => f.text).join(' '), /first-come first-served/);
});
test('nine-person Hive room request remains conditional rather than inventing an eight-person legal maximum', () => {
  const r = resolveLocalIntent({ query: 'Rent a meeting room at The Hive for 9 people', workspace_type: 'meeting-room' }, catalog);
  assert.deepEqual(ids(r), [hiveId]);
  const o = r.results[0];
  assert.match(o.field_evidence.capacity.value.basis, /comfortable.*not maximum/);
  assert.match(o.unknowns.join(' '), /9 attendees.*comfortable seating is not a contractual maximum/);
  assert.equal(r.exclusions.some(o => o.id === hiveId), false);
});
test('Fusion virtual-address headline never establishes a physical workspace budget match', () => {
  const r = resolveLocalIntent({ query: 'Find a physical office at Fusion Workplaces in Palm Desert for 2 days, budget $119 total', workspace_type: 'office' }, catalog);
  assert.deepEqual(ids(r), [fusionId]);
  const o = r.results[0];
  assert.match(o.field_evidence.price.value.product, /virtual-office.*not coworking day pass/);
  assert.equal(o.field_evidence.price.value.scope, 'per-month');
  assert.match(o.unknowns.join(' '), /Affordability.*unknown.*Virtual-office prices are not physical workspace prices/);
  assert.equal(o.field_evidence.price.value.tax_included, null);
});
test('virtual-office requirement excludes operators with no sourced virtual product', () => {
  const r = resolveLocalIntent({ query: 'Find a virtual office in Palm Springs', workspace_type: 'virtual-office' }, catalog);
  assert.deepEqual(ids(r), [regusId]);
  assert.ok(r.exclusions.find(o => o.id === hiveId)?.reasons.some(x => /No sourced virtual-office/.test(x.reason)));
});
test('physical workspace and satellite decisions keep counseling programs out of the workspace shortlist', () => {
  for (const input of [{ query: 'Find coworking workspace in Palm Desert' }, { query: 'Evaluate a satellite base in Palm Desert', decision: 'satellite-base' }]) {
    const r = resolveLocalIntent(input, catalog);
    assert.ok(r.results.length);
    assert.equal(r.results.some(o => o.kind === 'founder-support'), false);
  }
});
test('ERC inquiry preserves operator conflicts and historical institutional-strain observation', () => {
  const r = resolveLocalIntent({ query: 'Evaluate Palm Desert ERC as a satellite base', decision: 'satellite-base' }, catalog);
  assert.deepEqual(ids(r), [ercId]);
  const o = r.results[0];
  assert.equal(o.field_evidence.capacity.value, null);
  assert.equal(o.field_evidence.access.value.hours_conflict, true);
  const observation = o.facts.find(f => f.evidence_type === 'observation');
  assert.match(observation.text, /institutional strain/);
  assert.equal(observation.checked_at, '2026-09-01');
  assert.equal(o.observation_date, '2026-09-01');
  assert.equal(o.source_checked_at, '2026-10-07');
});
test('structured headcount, hours and days take precedence while exposing conflicts', () => {
  const r = resolveLocalIntent({ query: 'Rent a meeting room for 12 people for 2 hours across 3 days', group_size: 8, duration_hours: 4, duration_days: 2 }, catalog);
  assert.equal(r.requirements.group_size, 8);
  assert.equal(r.requirements.duration_hours, 4);
  assert.equal(r.requirements.duration_days, 2);
  for (const key of ['group_size', 'duration_hours', 'duration_days']) assert.match(r.requirement_conflicts.join(' '), new RegExp(`Structured ${key} differs`));
});
test('simple negation does not become a positive privacy requirement', () => {
  const r = resolveLocalIntent({ query: 'Find a not private coworking desk in Palm Springs' }, catalog);
  assert.equal(r.requirements.privacy, null);
});
test('negated private-office product does not erase a separate confidential-call requirement', () => {
  const r = resolveLocalIntent({ query: 'A coworking desk, not a private office, but confidential calls require privacy in Palm Springs.' }, catalog);
  assert.notEqual(r.requirements.workspace_type, 'office');
  assert.ok(r.requirements.privacy || r.requirement_conflicts.length, 'Confidential calls require preserved privacy or explicit clarification.');
});
test('explicit retreat wording controls mixed free text while structured decision controls tool routing', () => {
  const query = 'Plan a team retreat with coworking workspace in Palm Desert';
  assert.equal(resolveLocalIntent({ query }, catalog).intent, 'team-retreat');
  assert.equal(resolveLocalIntent({ query, decision: 'workspace' }, catalog).intent, 'workspace');
});
test('aliases and requested omissions preserve identity and unknown names do not receive fallback', () => {
  const named = resolveLocalIntent({ query: 'Find a day pass at The Hive in Palm Springs' }, catalog);
  assert.deepEqual(ids(named), [hiveId]);
  const omitted = resolveLocalIntent({ query: 'Do not recommend The Hive. Compare Palm Springs day work' }, catalog);
  assert.equal(ids(omitted).includes(hiveId), false);
  assert.ok(omitted.exclusions.some(o => o.id === hiveId));
  const unknown = resolveLocalIntent({ query: 'Find a workspace', requested_entities: ['Unrecorded Desert Operator'] }, catalog);
  assert.equal(unknown.status, 'no_match');
  assert.deepEqual(unknown.results, []);
});
test('higher action request and generated brief preserve requirements while remaining official handoff', () => {
  const input = { query: 'Pay for a room at The Hive for 9 people, $200 total', decision: 'workspace', workspace_type: 'meeting-room', required_action: 'transaction', group_size: 9, duration_hours: 3, budget_amount: 200, budget_scope: 'total', privacy: 'confidential board discussion', accessibility: 'step-free route required' };
  const r = resolveLocalIntent(input, catalog);
  assert.deepEqual(ids(r), [hiveId]);
  assert.match(r.unresolved_constraints.join(' '), /execution exceeds official_handoff/);
  const brief = workspaceBrief(input, r.results[0], r.requirements);
  assert.match(brief, /prepared only; nothing sent or reserved/);
  assert.match(brief,/People: 9/);assert.match(brief,/Duration: 3 hours/);assert.match(brief,/Budget: 200 USD \(total\)/);assert.match(brief,/Privacy: confidential board discussion/);assert.match(brief,/Accessibility: step-free route required/);assert.match(brief,/Required next step: transaction/);
  assert.match(brief, /current availability unknown/);
  assert.equal(r.results[0].action_capability, 'official_handoff');
});

test('contract rejects an invented canonical ERC identity instead of replacing the historical record', async () => {
  const { validateWorkspaceContract } = await import('./workspace-contract.mjs');
  const existing = [...catalog.previews, ...catalog.nodes];
  assert.deepEqual(validateWorkspaceContract(workspace, { existing }), { options: 7 });
  const corrupted = structuredClone(workspace);
  corrupted.options.find(o => o.id === ercId).id = 'local/unrecorded-erc-copy';
  assert.throws(() => validateWorkspaceContract(corrupted, { existing }), /Invented canonical identity/);
});
test('contract rejects legacy room inventory masquerading as a current unknown capacity', async () => {
  const { validateWorkspaceContract } = await import('./workspace-contract.mjs');
  const corrupted = structuredClone(workspace);
  corrupted.options.find(o => o.id === ercId).field_evidence.capacity.value = { meeting_room: 10 };
  assert.throws(() => validateWorkspaceContract(corrupted, { existing: [...catalog.previews, ...catalog.nodes] }), /Unknown evidence must have null value/);
});

test('half-hour shorthand and explicit decimal duration survive comparison and brief', () => {
  for (const text of ['.5 hours', '0.5 hours']) {
    const input = { query: `Meeting room at The Hive for ${text}` };
    const r = resolveLocalIntent(input, catalog);
    assert.equal(r.requirements.duration_hours, 0.5, text);
    assert.ok(workspaceBrief(input, r.results[0], r.requirements).includes('Duration: 0.5 hours')); 
  }
});
test('numeric ranges, negative durations and malformed headcounts do not acquire an invented exact value', () => {
  for (const text of ['1-2 hours', '-1.5 hours']) {
    const r = resolveLocalIntent({ query: `Coworking desk for ${text}` }, catalog);
    assert.equal(r.requirements.duration_hours, null, text);
  }
  const malformed = resolveLocalIntent({ query: 'Meeting room for 12,34 people' }, catalog);
  assert.equal(malformed.requirements.group_size, null);
});
