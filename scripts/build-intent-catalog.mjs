#!/usr/bin/env node
// Derive an assistant retrieval view from existing public records. No network,
// source edits, paid ranking, invented business facts or freshness reset.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { nodeContent } = require('./node-content.cjs');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const deployed = read('src/data/previews-deployed.json');
const observations = read('src/data/local-intent-observations.json');
const retreat = read('src/data/retreat-options.json');
const counts = read('src/data/stats.json').counts;
const origin = 'https://aicoachellavalley.com';
const previews = deployed.segments.flatMap((segment) => {
  const manifest = read(`src/data/previews/previews-index-${segment}.json`);
  if (manifest.count !== manifest.entries.length) throw new Error(`Manifest count mismatch: ${segment}`);
  return manifest.entries.map((entry) => ({
    id: `${segment}/${entry.slug}`, name: entry.name, city: entry.city, segment,
    record_type: 'business-preview', source_url: entry.url, preview_url: entry.url,
    indexable: entry.indexable, measurement_date: manifest.generated,
    publication_verified_at: deployed.verified_at,
    summary: `Dated ${manifest.domain} preview. Open the source for its measured findings and current publication status.`,
    constraints: ['This manifest supplies identity and a preview link; it does not attest business facts, current access or availability.'],
    official_actions: [],
  }));
});
// All source records remain in the attributed snapshot; only non-node entries
// are added here. Existing canonical nodes are derived below from current MDX.
const local = observations.records.filter((r) => r.kind === 'entity').map((r) => ({
  id: `local/${r.id}`, name: r.name, city: 'Palm Desert', segment: 'local-observation',
  record_type: r.recordType, access_state: r.accessState, summary: r.summary,
  source_url: r.sourceUrl, source_checked_at: observations.snapshot_date,
  source_type: r.sourceType, local_observation: r.localSignal,
  fit_basis: [r.agentSignal], constraints: [r.constraints],
  best_for: r.bestFor, itinerary_eligible: r.itineraryEligible !== false,
  provenance: { repository: observations.source_repository, path: observations.source_path,
    commit: observations.source_commit, imported_at: observations.imported_at },
  official_actions: [{ url: r.sourceUrl, label: 'Check the official source',
    source_url: r.sourceUrl, checked_at: observations.snapshot_date }],
}));
function fm(source, key) {
  const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1];
  const value = front.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1]?.trim() ?? '';
  if (value === 'true' || value === 'false') return value === 'true';
  if (value.startsWith('[')) return JSON.parse(value);
  return value.replace(/^(["'])(.*)\1$/, '$2');
}
const nodes = readdirSync(resolve(root, 'src/content/nodes')).filter((f) => f.endsWith('.mdx')).map((file) => {
  const source = readFileSync(resolve(root, 'src/content/nodes', file), 'utf8');
  const slug = file.replace(/\.mdx$/, '');
  return { id: `node/${slug}`, slug, name: fm(source, 'title'), city: fm(source, 'city'),
    record_type: 'regional-node', summary: fm(source, 'agent_summary') || fm(source, 'description'),
    source_url: `${origin}/nodes/${slug}/`, source_checked_at: fm(source, 'last_updated'),
    editorial_verified: fm(source, 'verified'), subcategory: fm(source, 'subcategory'),
    agent_intent: fm(source, 'agent_intent'), content: nodeContent(source, counts) };
});
const catalog = {
  scope: 'Derived lookup of published business previews, attributed local observations and regional research. Inclusion is independent of payment.',
  source_counts: { published_previews: previews.length, additional_local_observations: local.length,
    regional_nodes: nodes.length, total_lookup_records: previews.length + local.length + nodes.length },
  source_dates_note: observations.date_note,
  previews: [...previews, ...local], nodes,
  retreat: { ...retreat, options: retreat.options.map((option) => ({ ...option,
    source_checked_at: retreat.checked_at })) },
};
const ids = [...catalog.previews, ...nodes].map((r) => r.id);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate stable retrieval ID');
writeFileSync(resolve(root, 'src/data/intent-catalog.json'), JSON.stringify(catalog) + '\n');
// The downloadable catalog excludes research bodies; /mcp uses the same source.
writeFileSync(resolve(root, 'public/business-previews.json'), JSON.stringify({
  scope: catalog.scope, source_counts: catalog.source_counts, source_dates_note: catalog.source_dates_note,
  records: catalog.previews,
}) + '\n');
console.log(`Intent catalog: ${previews.length} previews, ${local.length} additional local observations, ${nodes.length} regional nodes`);
