/**
 * brief-dates.cjs — ONE derivation of a brief's modification date, shared by
 * every surface that publishes one.
 *
 * Consumers (all three must agree, so all three call this):
 *   scripts/build-static-json.cjs   → briefs.json `date_modified`
 *   src/pages/briefs/[slug].astro   → JSON-LD `dateModified`, visible "Updated" line
 *   src/pages/sitemap.xml.ts        → <lastmod>
 *
 * WHY DERIVED AND NOT A FIELD. Before 2026-09-14 both JSON-LD dateModified and
 * sitemap lastmod reused the publication date, so an amended brief advertised
 * itself as untouched since the day it was filed. A hand-maintained
 * `date_modified` would fix that once and then drift — the person adding a
 * correction has to remember a second edit. The amendment records already
 * carry dates, so the modification date is simply the latest date the record
 * holds: publication, or any correction, or any supersession notice. There is
 * nothing to forget.
 *
 * Same pattern as scripts/claimed-members.cjs: a .cjs required by the build
 * script and imported by Astro pages, so the two cannot compute different
 * answers. Pure function, no I/O, no dates from the clock.
 */
'use strict';

function amendmentDates(fm) {
  const out = [];
  for (const key of ['correction', 'supersession']) {
    const arr = fm && fm[key];
    if (!Array.isArray(arr)) continue;
    for (const entry of arr) {
      if (entry && typeof entry.date === 'string' && entry.date) out.push(entry.date);
    }
  }
  return out;
}

/** ISO date (YYYY-MM-DD) of the latest event on the record. Falls back to
 *  `date` when the record carries no amendment; never earlier than `date`. */
function briefDateModified(fm) {
  const base = (fm && typeof fm.date === 'string') ? fm.date : '';
  return [base, ...amendmentDates(fm)].reduce((a, b) => (b > a ? b : a), base);
}

/** True when the record has been amended after publication. */
function briefIsAmended(fm) {
  return briefDateModified(fm) !== ((fm && fm.date) || '');
}

module.exports = { briefDateModified, briefIsAmended, amendmentDates };
