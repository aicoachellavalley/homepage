import test from 'node:test';
import assert from 'node:assert/strict';
import { latestDate, latestResearchDate, formatResearchDate } from './research-dates.mjs';

const entry = data => ({ data });

test('published research advances on a new brief, live node, report or standing record', () => {
  const corpus = { briefs: [entry({ date: '2026-09-10' })] };
  assert.equal(latestResearchDate(corpus), '2026-09-10');
  corpus.nodes = [entry({ status: 'live', last_updated: '2026-09-11' })];
  assert.equal(latestResearchDate(corpus), '2026-09-11');
  corpus.reports = [entry({ status: 'published', date: '2026-09-12' })];
  assert.equal(latestResearchDate(corpus), '2026-09-12');
  corpus.records = [entry({ datePublished: '2026-09-01', dateModified: '2026-09-13' })];
  assert.equal(latestResearchDate(corpus), '2026-09-13');
});

test('corrections and supersessions count as dated research updates', () => {
  assert.equal(latestResearchDate({ briefs: [entry({ date: '2026-09-01', correction: [{ date: '2026-09-12' }], supersession: [{ date: '2026-09-14' }] })] }), '2026-09-14');
  assert.equal(latestResearchDate({ reports: [entry({ status: 'published', date: '2026-07-01', correction: [{ date: '2026-09-15' }] })] }), '2026-09-15');
});

test('drafts, planned nodes and a fresh build timestamp cannot create research activity', () => {
  const corpus = {
    generated_at: '2099-01-01T12:00:00Z',
    briefs: [entry({ date: '2026-09-10', generated_at: '2099-01-01' })],
    nodes: [entry({ status: 'planned', last_updated: '2099-01-01' }), entry({ status: 'under construction', last_updated: '2099-01-02' }), entry({ status: 'live' })],
    reports: [entry({ status: 'draft', date: '2099-01-01' })],
  };
  assert.equal(latestResearchDate(corpus), '2026-09-10');
  corpus.generated_at = '2100-01-01T12:00:00Z';
  assert.equal(latestResearchDate(corpus), '2026-09-10');
  assert.equal(latestResearchDate(), null);
});

test('page modification tracks either copy edits or research, without inventing a date', () => {
  assert.equal(latestDate(['2026-09-19', '2026-09-14']), '2026-09-19');
  assert.equal(latestDate(['2026-09-19', '2026-09-20']), '2026-09-20');
  assert.equal(latestDate([null, undefined, '']), null);
  assert.equal(formatResearchDate('2026-09-14'), 'September 14, 2026');
  assert.equal(formatResearchDate(null), '');
  assert.throws(() => latestDate(['2026-02-30']), /Invalid research date/);
  assert.throws(() => latestDate(['not-a-date']), /Invalid research date/);
});
