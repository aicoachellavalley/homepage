'use strict';

// Preserve the research publication date. A copy edit is dated separately in
// the existing authored-page ledger; corrections retain their own dated notices.
// Pages, feeds, and the sitemap use this same derivation, never the build clock.
const pageDates = require('../src/data/page-dates.json');
const { briefDateModified } = require('./brief-dates.cjs');

function reportCopyDate(slug) {
  return pageDates[`/reports/${slug.replace(/\.mdx$/, '')}/`] || '';
}

function reportDateModified(slug, data) {
  return [briefDateModified(data), reportCopyDate(slug)].sort().at(-1) || '';
}

module.exports = { reportCopyDate, reportDateModified };
