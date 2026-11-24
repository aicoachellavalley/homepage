import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { latestBriefPublicationDate } = require('./brief-dates.cjs');
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');

test('an amendment never becomes an archive publication date', () => {
  assert.equal(latestBriefPublicationDate([]),'');
  assert.equal(latestBriefPublicationDate([
    {date:'2026-09-10'}, {date:'2026-07-06', correction:[{date:'2026-10-17'}]}, {date:'2026-09-01',date_modified:'2026-10-20'}
  ]),'2026-09-10');
});

test('published reports retain the historical/no-usable-evidence distinction for their preview tranche', () => {
  const template=read('src/pages/reports/[slug].astro');
  assert.match(template,/dated website check, including checks where access was blocked/);
  assert.match(template,/no usable dated website measurement/);
  assert.match(template,/not the census denominator/);
  assert.doesNotMatch(template,/a preview page requires a reachable site/);
  const evidence=JSON.parse(read('src/data/report-evidence-notes.json'));
  for (const slug of ['food-dining','home-realestate','family-schooling','talent-workforce']) {
    assert.ok(evidence['agent-mapped-'+slug+'-coachella-valley'].links.some(x=>x.href==='/briefs/2026-07-06-agent-readability-remeasured/'));
  }
  assert.match(evidence['agent-mapped-wellness-healthcare-coachella-valley'].summary,/not part of/);
});

test('a desk labels automated website checks separately from recorded facts', () => {
 const desk=read('src/pages/desks/index.astro');
 assert.match(desk,/Most recent recorded facts/);
 assert.match(desk,/Most recent automated website check/);
 assert.match(desk,/Website checks do not update recorded facts/);
 assert.doesNotMatch(desk,/Latest check/);
});
