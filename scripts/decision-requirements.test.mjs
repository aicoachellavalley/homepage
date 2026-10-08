import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { quantityFromQuery } from '../src/lib/decision-requirements.mjs';
import { resolveLocalIntent } from '../src/lib/local-intent.mjs';
import { workspaceBrief } from '../src/lib/workspace-brief.mjs';
const catalog=JSON.parse(readFileSync(new URL('../src/data/intent-catalog.json',import.meta.url)));
test('fractional meeting duration survives shared comparison and prepared inquiry',()=>{
  const input={query:'Meeting room at The Hive for 9 people for 1.5 hours, $100 total'};
  const r=resolveLocalIntent(input,catalog);
  assert.equal(r.requirements.duration_hours,1.5);
  const brief=workspaceBrief(input,r.results[0],r.requirements);
  assert.ok(brief.includes('Duration: 1.5 hours'));
  assert.ok(workspaceBrief(input,r.results[0]).includes('Duration: 1.5 hours'));
});
test('fractional duration conflict preserves structured value and reports source discrepancy',()=>{
  const r=resolveLocalIntent({query:'Coworking room for 1.5 hours',duration_hours:2},catalog);
  assert.equal(r.requirements.duration_hours,2);
  assert.match(r.requirement_conflicts.join(' '),/duration_hours differs/);
});
test('formatted integer quantities preserve headcount and individual lodging room estimate',()=>{
  const r=resolveLocalIntent({query:'Team retreat for 1,600 people. We are not sharing rooms'},catalog);
  assert.equal(r.requirements.group_size,1600);
  assert.equal(r.requirements.rooms,1600);
  assert.equal(quantityFromQuery('1.5 people','people'),null);
});
test('structured location conflicts remain visible instead of silently replacing the question',()=>{
  const r=resolveLocalIntent({query:'Coworking in Palm Springs',city:'Palm Desert'},catalog);
  assert.match(r.requirement_conflicts.join(' '),/Palm Desert differs.*Palm Springs/);
  assert.equal(r.requirements.strict_city,true);
  assert.ok(r.results.every(o=>o.city==='Palm Desert'));
});

test('zero-night free-text retreat stays day-only without inventing lodging',()=>{
  const r=resolveLocalIntent({query:'Team retreat for 16 people, 0 nights'},catalog);
  assert.equal(r.requirements.day_only,true);assert.equal(r.requirements.nights,0);assert.equal(r.requirements.rooms,null);
});
test('an unrecorded explicitly named workspace receives no unrelated fallback',()=>{
  const r=resolveLocalIntent({query:'Find a meeting room at Zzqx Unrecorded Workspace in Palm Springs'},catalog);
  assert.equal(r.status,'no_match');assert.deepEqual(r.results,[]);
  assert.match(r.next_questions.join(' '),/zzqx unrecorded workspace/);
});
test('sub-hour decimals survive and ranges, signs and malformed grouping stay unresolved',()=>{
  for(const text of ['.5 hours','0.5 hours','0.25 hours']) assert.equal(resolveLocalIntent({query:'Coworking room for '+text},catalog).requirements.duration_hours,Number(text.split(' ')[0]));
  for(const text of ['1-2 hours','1–2 hours','-1.5 hours','between 1 and 2 hours','1 to 2 hours','1 - 2 hours','- 1.5 hours','up to 2 hours']) {
    const r=resolveLocalIntent({query:'Coworking room for '+text},catalog);
    assert.equal(r.requirements.duration_hours,null,text);assert.match(r.unresolved_constraints.join(' '),/No exact supported hour duration/);
  }
  assert.equal(quantityFromQuery('12,34 people','people'),null);
});

test('a two-city satellite comparison retains both municipalities and flags explicit narrowing',()=>{
  const input={query:'Compare Palm Desert and Palm Springs as a startup satellite base'};
  const r=resolveLocalIntent(input,catalog);
  assert.equal(r.intent,'satellite-base');assert.equal(r.requirements.strict_city,false);
  assert.deepEqual(new Set(r.requirements.query_locations),new Set(['Palm Desert','Palm Springs']));
  assert.ok(r.results.some(o=>o.city==='Palm Desert'));assert.ok(r.results.some(o=>o.city==='Palm Springs'));
  assert.match(workspaceBrief(input,r.results[0],r.requirements),/Location: Palm Springs; Palm Desert/);
  const partial=resolveLocalIntent({query:'Compare Palm Desert and Indio workspaces'},catalog);
  assert.ok(partial.results.every(o=>['Palm Desert','Indio'].includes(o.city)));assert.match(partial.unresolved_constraints.join(' '),/No qualified physical workspace record was established for Indio/);
  const narrow=resolveLocalIntent({...input,city:'Palm Desert'},catalog);
  assert.ok(narrow.results.every(o=>o.city==='Palm Desert'));assert.match(narrow.requirement_conflicts.join(' '),/multiple locations/);
});
