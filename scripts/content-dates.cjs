/**
 * content-dates.cjs — modification dates for pages whose visible text changes
 * for a reason other than an edit to their own file. Shared by every surface
 * that states the date (sitemap.xml.ts, build-static-json.cjs, the node and
 * about pages) so they cannot disagree. Pure functions, no clock.
 *
 * WHY (2026-10-17). A sitemap lastmod is what tells crawlers, and our own AI
 * Search index, that a page changed. An audit of the deployed sitemap against
 * built snapshots found two kinds of drift, both in the direction of a page
 * claiming to be OLDER than it is:
 *
 *   1. Nodes. `last_updated` is the REVIEW date: the page displays it as "Last
 *      reviewed" and the 90-day verification window is computed from it, so it
 *      must not move unless the node is re-verified. Twelve nodes were edited
 *      after their review (copy passes on 07-31, 09-25, 09-30 and 10-07) and
 *      their lastmod stayed at the review date. `last_modified` records the
 *      later edit without pretending it was a re-verification.
 *   2. Pages that render live counts. /about/ and two nodes (Node Zero and the
 *      intelligence index) interpolate the brief and report counts, so they
 *      changed on 2026-10-01 when the Q3 report went live, and said nothing.
 *      Their lastmod now includes the newest publication in the counted set.
 *
 * The opposite failure — a date that moves without a visible change — is the
 * reason none of this reads the build clock or a file's mtime.
 */
'use strict';

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Latest of a set of ISO dates; '' when none is valid. */
function latest(dates) {
  return dates.filter((d) => typeof d === 'string' && ISO.test(d)).sort().at(-1) || '';
}

/** Newest publication among the records the site's counts tally: every brief,
 *  and every published report. A new one changes every rendered count. */
function countedSetDate(briefs, reports) {
  return latest([
    ...briefs.map((b) => b && b.date),
    ...reports.filter((r) => r && (r.status === undefined || r.status === 'published')).map((r) => r.date),
  ]);
}

/** True when a node body renders the live counts (`{stats.counts.*}`).
 *  Derived from the body itself, so a node that starts quoting a count is
 *  covered without anyone adding it to a list. */
function rendersCounts(body) {
  return /\{stats\.counts\./.test(body || '');
}

/** A node page's modification date: its review date, any later edit, and —
 *  when it renders counts — the newest counted publication. */
function nodeDateModified(fm, body, countsDate) {
  return latest([
    fm && fm.last_updated,
    fm && fm.last_modified,
    rendersCounts(body) ? countsDate : '',
  ]);
}

module.exports = { latest, countedSetDate, rendersCounts, nodeDateModified };
