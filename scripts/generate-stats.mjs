#!/usr/bin/env node
// Generates src/data/stats.json and public/stats.json with current
// collection counts. Runs as the `prebuild` npm script.
//
// Reads:
//   src/content/nodes/*.mdx
//   src/content/briefs/*.mdx
//   src/content/reports/*.mdx
//
// Writes:
//   src/data/stats.json         (imported by MDX + page components)
//   public/stats.json           (observability endpoint)

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const countByExt = (dir, ext) =>
  readdirSync(resolve(repoRoot, dir)).filter((f) => f.endsWith(ext)).length;

// Counts .mdx files whose frontmatter `status:` equals the target value.
// The homepage bar labels nodes "Regional Nodes" and reports "Published", so
// the number must reflect only what is actually live/published — never a raw
// file count that would silently over-report a draft report or planned node.
// Node status enum: live | under construction | planned.
// Report status enum: published | draft.
// briefs have no status field, so they stay a raw count (every file
// is, by existence, published).
const countByStatus = (dir, status) =>
  readdirSync(resolve(repoRoot, dir))
    .filter((f) => f.endsWith('.mdx'))
    .filter((f) => {
      const src = readFileSync(resolve(repoRoot, dir, f), 'utf8');
      const m = src.match(/^status:\s*["']?([^"'\r\n]+?)["']?\s*$/m);
      return m !== null && m[1].trim() === status;
    }).length;

const stats = {
  $schema: 'https://aicoachellavalley.com/schemas/stats-v1.json',
  generated_at: new Date().toISOString(),
  generator: 'scripts/generate-stats.mjs',
  counts: {
    nodes:     countByStatus('src/content/nodes', 'live'),
    briefs:    countByExt('src/content/briefs', '.mdx'),
    reports:   countByStatus('src/content/reports', 'published'),
  },
};

const json = JSON.stringify(stats, null, 2) + '\n';

const targets = [
  resolve(repoRoot, 'src/data/stats.json'),
  resolve(repoRoot, 'public/stats.json'),
];

for (const target of targets) {
  const dir = dirname(target);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(target, json);
  console.log(`wrote ${target}`);
}

console.log('counts:', stats.counts);
