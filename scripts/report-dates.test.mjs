import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { reportDateModified, reportCopyDate } = require('./report-dates.cjs');

test('an untouched report keeps its publication date', () => {
  assert.equal(reportDateModified('an-untouched-report', { date: '2026-04-13' }), '2026-04-13');
});

test('a dated correction advances an otherwise untouched report', () => {
  assert.equal(reportDateModified('an-untouched-report', {
    date: '2026-04-13', correction: [{ date: '2026-08-28', summary: 'Correction' }],
  }), '2026-08-28');
});

test('a recorded copy edit advances crawl freshness while retaining the research date', () => {
  const data = { date: '2026-04-13' };
  assert.equal(reportCopyDate('state-of-ai-q1-2026'), '2026-09-30');
  assert.equal(reportDateModified('state-of-ai-q1-2026', data), '2026-09-30');
  assert.equal(data.date, '2026-04-13');
});

test('a later research correction takes precedence over the copy edit', () => {
  assert.equal(reportDateModified('state-of-ai-q1-2026', {
    date: '2026-04-13', correction: [{ date: '2026-10-01', summary: 'Later correction' }],
  }), '2026-10-01');
});
