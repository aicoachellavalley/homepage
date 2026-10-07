import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateRetreatContract, validateRetreatDerivation } from './retreat-contract.mjs';
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const source = read('../src/data/retreat-options.json');
const catalog = read('../src/data/intent-catalog.json');
const context = { nodes: catalog.nodes, previews: catalog.previews };
const mutation = (label, mutate, pattern) => test(`retreat evidence guard rejects ${label}`, () => {
  const copy = structuredClone(source); mutate(copy);
  assert.throws(() => validateRetreatContract(copy, context), pattern);
});
test('current dated retreat source and derived lookup satisfy evidence contract', () => {
  assert.deepEqual(validateRetreatContract(source, context), { venues: 15, services: 5 });
  assert.doesNotThrow(() => validateRetreatDerivation(catalog, source));
});
mutation('an unqualified record', (s) => { s.options[0].qualified = false; }, /explicitly qualified/);
mutation('an invented canonical node', (s) => { s.options[0].id = 'node/invented'; s.options[0].node_source = '/nodes/invented/'; }, /invented node/);
mutation('a guessed lodging inventory', (s) => {
  const o = s.options.find((r) => r.slug === 'courtyard-palm-desert');
  o.lodging.room_count = 999;
  o.field_evidence['lodging.room_count'] = { evidence_type: 'judgment', checked_at: '2026-10-07', basis: 'Guessed from photos' };
}, /inventory cannot be inferred/);
mutation('a reset historical preview date', (s) => { s.options.find((r) => r.preview_reference).preview_reference.manifest_generated_at = '2026-10-07'; }, /mutated historical preview/);
mutation('a reset broader node date', (s) => { s.options.find((r) => r.node_source).node_last_updated = '2026-10-07'; }, /mutated node date/);
mutation('an undated official action', (s) => { s.options[0].action_checked_at = null; }, /official action requires/);
test('derivation guard rejects a global source-date reset', () => {
  const derived = structuredClone(catalog);
  derived.retreat.options.forEach((r) => { r.source_checked_at = '2026-10-08'; });
  assert.throws(() => validateRetreatDerivation(derived, source), /changed source records\/dates/);
});
test('derivation guard rejects a field date reset in the exact retrieval record', () => {
  const derived = structuredClone(catalog);
  derived.researched_entities[0].field_evidence.meeting_spaces.checked_at = '2026-10-08';
  assert.throws(() => validateRetreatDerivation(derived, source), /mutated in retrieval projection/);
});
