#!/usr/bin/env node
// Generates src/data/stats.json and public/stats.json with current
// collection counts. Runs as the `prebuild` npm script.
//
// Reads:
//   src/content/nodes/*.mdx
//   src/content/briefs/*.mdx
//   src/content/reports/*.mdx
//   src/data/snapshots/*.json
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

const stats = {
  $schema: 'https://aicoachellavalley.com/schemas/stats-v1.json',
  generated_at: new Date().toISOString(),
  generator: 'scripts/generate-stats.mjs',
  counts: {
    nodes:     countByExt('src/content/nodes', '.mdx'),
    briefs:    countByExt('src/content/briefs', '.mdx'),
    reports:   countByExt('src/content/reports', '.mdx'),
    snapshots: countByExt('src/data/snapshots', '.json'),
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
