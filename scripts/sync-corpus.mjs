#!/usr/bin/env node
/**
 * sync-corpus.mjs — derive corpus scale from the REPAIRED census canon.
 *
 * Same contract as sync-previews-manifest.mjs: derive from a sibling playbook
 * checkout when present, otherwise leave the committed copy alone. No network.
 *
 * "mapped" is the only honest verb for this number: a canon row means AICV
 * found and recorded the entity. It is NOT "measured" — only the subset with a
 * reachable site of its own was ever probed. Do not relabel without re-deriving.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../src/data/corpus.json');
const runs = resolve(here, '../../playbook/data/workflow-runs');

const CENSUSES = {
  'Food & Dining':          'cv-food-dining-enrich-2026-06-11/dining-segmented-v2.json',
  'Hospitality & Retreat Venues': 'cv-hospitality-2026-07-07/cv-hospitality-census-final.json',
  'Home & Real Estate':     'cv-home-realestate-2026-06-12/cv-hre-census-final.json',
  'Wellness & Healthcare':  'cv-wellness-healthcare-2026-07-06/cv-wellness-healthcare-census-final.json',
  'Family & Schooling':     'cv-family-schooling-2026-06-12/cv-family-schooling-census-final.json',
  'Outdoors & Recreation':  'cv-outdoors-2026-07-07/cv-outdoors-census-final.json',
};

if (!existsSync(runs)) {
  console.log('sync-corpus: no sibling playbook checkout — using committed corpus.json');
  process.exit(0);
}

const by = {};
let total = 0;
for (const [name, rel] of Object.entries(CENSUSES)) {
  const doc = JSON.parse(readFileSync(resolve(runs, rel), 'utf8'));
  const rows = Array.isArray(doc) ? doc : doc.rows;
  by[name] = rows.length;
  total += rows.length;
}
writeFileSync(out, JSON.stringify({
  $comment: 'Derived by scripts/sync-corpus.mjs from repaired census canon. "mapped" = a canon row exists. NEVER label this number "measured".',
  updated: new Date().toISOString().slice(0, 10),
  merchant_censuses: by,
  businesses_mapped: total,
}, null, 2) + '\n');
console.log(`sync-corpus: ${total} businesses mapped across ${Object.keys(by).length} merchant censuses`);
