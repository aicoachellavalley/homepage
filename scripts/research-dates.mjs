/**
 * Corpus activity, not corpus-wide freshness. Derive only from dated authored
 * records, never stats.generated_at, file mtime, deployment time or today's date.
 * Both Get Agent Ready and its sitemap entry consume this build-time helper.
 * A new date means some published research changed, not that every entity or
 * preview was remeasured. Public previews retain their own measurement dates.
 */
import { briefDateModified } from './brief-dates.cjs';

function checkedDate(value) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid research date: ${String(value)}`);
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid research date: ${value}`);
  }
  return value;
}

export function latestDate(values) {
  return values.map(checkedDate).filter(Boolean).sort().at(-1) || null;
}

export function latestResearchDate({ briefs = [], nodes = [], reports = [], records = [] } = {}) {
  // `briefDateModified` also works for reports' dated correction notices.
  // Briefs and records have no draft status; nodes and reports do.
  return latestDate([
    ...briefs.map(entry => briefDateModified(entry.data)),
    ...nodes.filter(entry => entry.data.status === 'live').map(entry => entry.data.last_updated),
    ...reports.filter(entry => entry.data.status === 'published').map(entry => briefDateModified(entry.data)),
    ...records.flatMap(entry => [entry.data.datePublished, entry.data.dateModified]),
  ]);
}

export function formatResearchDate(value) {
  const date = checkedDate(value);
  return date ? new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  }) : '';
}
