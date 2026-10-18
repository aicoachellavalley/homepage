// content-dates — a published page may never claim to be older than its last
// visible edit. Added 2026-10-17 after twelve nodes were found edited after
// their sitemap date (see scripts/content-dates.cjs for the account).
//
// SCOPE IS DERIVED, not listed: every MDX file under the three collections the
// sitemap dates from frontmatter (nodes, briefs, reports). A new file is
// covered the day it lands.
//
// WHAT COUNTS AS AN EDIT: any changed line in the file except the date fields
// themselves (last_updated, last_modified) and the verification flag, and
// except changes confined to MDX source comments ({/* ... */}), which never
// render. Everything else — body, description, agent_summary, a correction
// notice — is visible somewhere (page, feed, llms-full) and must be dated.
//
// THE FIX WHEN THIS FAILS is never to move a review or publication date:
//   node   → set `last_modified` to the edit date
//   brief  → add a `correction` (or `supersession`) record dated that day
//   report → add a correction, or set its copy date in src/data/page-dates.json
//
// Needs git history. On a shallow clone (some CI builders) it skips with a
// printed notice rather than guessing; local builds, which the deploy rules
// require before every push, run it in full.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { latest, countedSetDate, rendersCounts, nodeDateModified } = require('./content-dates.cjs');
const { briefDateModified } = require('./brief-dates.cjs');
const { reportDateModified } = require('./report-dates.cjs');
const yaml = require('js-yaml');

const ROOT = new URL('../', import.meta.url).pathname;
const COLLECTIONS = ['nodes', 'briefs', 'reports'];
const IGNORED_KEY = /^(last_updated|last_modified|verified)\s*:/;
const COMMENT = /\{\/\*[\s\S]*?\*\/\}/g;
// Briefs keep their publication date (founder ruling); a later edit must carry
// a dated correction. Measured at adoption: 131 of 178 briefs had been edited after
// publication with no notice, 100 of them on 2026-04-06 (the Content Collections migration and two link repairs).
// Those dates stand. The rule binds edits from the adoption day on.
const BRIEFS_RULE_FROM = '2026-10-17';

test('content-dates helpers', () => {
  assert.equal(latest(['2026-01-02', '', undefined, '2026-03-04', 'not-a-date']), '2026-03-04');
  assert.equal(countedSetDate([{ date: '2026-09-10' }], [{ date: '2026-10-01', status: 'published' }, { date: '2026-11-01', status: 'draft' }]), '2026-10-01');
  assert.equal(rendersCounts('There are {stats.counts.nodes} nodes.'), true);
  assert.equal(rendersCounts('There are 79 nodes.'), false);
  assert.equal(nodeDateModified({ last_updated: '2026-09-25' }, 'plain', '2026-10-01'), '2026-09-25');
  assert.equal(nodeDateModified({ last_updated: '2026-09-25' }, '{stats.counts.reports}', '2026-10-01'), '2026-10-01');
  assert.equal(nodeDateModified({ last_updated: '2026-09-25', last_modified: '2026-10-07' }, '', ''), '2026-10-07');
});

/** Is a removed/added line pair a real edit? Strip ignored keys and comments,
 *  then compare what is left as multisets so a moved comment is not an edit. */
export function visibleChange(lines) {
  const keep = lines.filter((l) => !IGNORED_KEY.test(l.slice(1).trim()));
  const norm = (sign) => keep.filter((l) => l[0] === sign)
    .map((l) => l.slice(1).replace(COMMENT, '').trim()).filter(Boolean).sort();
  const removed = norm('-'), added = norm('+');
  return removed.length !== added.length || removed.some((l, i) => l !== added[i]);
}

test('visibleChange controls', () => {
  assert.equal(visibleChange(['-last_updated: "2026-07-29"', '+last_updated: "2026-09-25"']), false);
  assert.equal(visibleChange(['-A fact. {/* source: a */}', '+A fact. {/* source: b, read 2026-09-25 */}']), false);
  assert.equal(visibleChange(['-A fact.', '+A different fact.']), true);
  assert.equal(visibleChange(['+A new line.']), true);
});

/** path -> author date (YYYY-MM-DD) of the newest commit that changed it visibly. */
function lastVisibleEdits() {
  const out = execFileSync('git', ['log', '-p', '-U0', '--no-renames', '--format=@@COMMIT %as',
    '--', ...COLLECTIONS.map((c) => `src/content/${c}`)], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 30 });
  const edits = new Map();
  let date = '', file = '', lines = [];
  const flush = () => {
    if (file && !edits.has(file) && visibleChange(lines)) edits.set(file, date);
    lines = [];
  };
  for (const line of out.split('\n')) {
    if (line.startsWith('@@COMMIT ')) { flush(); file = ''; date = line.slice(9).trim(); }
    else if (line.startsWith('diff --git ')) { flush(); file = line.split(' b/')[1] || ''; }
    else if (line.startsWith('+++') || line.startsWith('---')) continue;
    else if (line[0] === '+' || line[0] === '-') lines.push(line);
  }
  flush();
  return edits; // git log is newest first, so the first visible edit wins
}

const shallow = (() => {
  try {
    return execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: ROOT, encoding: 'utf8' }).trim() !== 'false';
  } catch { return true; }
})();

test('no node, brief or report is older than its last visible edit', { skip: shallow && 'no full git history here; run a local build' }, () => {
  const edits = lastVisibleEdits();
  const stale = [];
  for (const c of COLLECTIONS) {
    for (const f of readdirSync(`${ROOT}src/content/${c}`).filter((n) => n.endsWith('.mdx'))) {
      const path = `src/content/${c}/${f}`;
      const raw = readFileSync(`${ROOT}${path}`, 'utf8');
      const fm = yaml.load(raw.match(/^---\n([\s\S]*?)\n---/)[1]);
      if (c === 'reports' && fm.status !== 'published') continue;
      const claimed = c === 'nodes' ? nodeDateModified(fm, '', '')
        : c === 'briefs' ? briefDateModified(fm)
        : reportDateModified(f, fm);
      const edited = edits.get(path);
      if (c === 'briefs' && edited && edited < BRIEFS_RULE_FROM) continue;
      if (edited && claimed < edited) stale.push(`${path}: dated ${claimed}, last visible edit ${edited}`);
    }
  }
  assert.deepEqual(stale, [], `pages older than their last edit:\n  ${stale.join('\n  ')}`);
});
