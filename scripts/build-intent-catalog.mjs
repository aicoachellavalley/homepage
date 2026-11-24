#!/usr/bin/env node
// Derive an assistant retrieval view from existing public records. No network,
// source edits, paid ranking, invented business facts or freshness reset.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { validateRetreatContract, validateRetreatDerivation } from './retreat-contract.mjs';
const require = createRequire(import.meta.url);
const { nodeContent } = require('./node-content.cjs');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const deployed = read('src/data/previews-deployed.json');
const observations = read('src/data/local-intent-observations.json');
const retreat = read('src/data/retreat-options.json');
const workspace = read('src/data/workspace-options.json');
import { validateWorkspaceContract } from './workspace-contract.mjs';
const counts = read('src/data/stats.json').counts;
const origin = 'https://aicoachellavalley.com';
const validDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
};
const previews = deployed.segments.flatMap((segment) => {
  const manifest = read(`src/data/previews/previews-index-${segment}.json`);
  if (manifest.count !== manifest.entries.length) throw new Error(`Manifest count mismatch: ${segment}`);
  return manifest.entries.map((entry) => {
    const measurement = entry.measurement_date;
    if (entry.publication_status === 'under_review') {
      if (entry.indexable !== false || measurement !== null || entry.city !== null) throw new Error(`Unsafe held preview metadata: ${segment}/${entry.slug}`);
      return {
        id: `${segment}/${entry.slug}`, name: entry.name, city: null, segment,
        record_type: 'business-preview', source_url: entry.url, preview_url: entry.url,
        publication_status: 'under_review', indexable: false, measurement_date: null,
        measurement_date_note: 'Under review; no public website measurement is available.',
        summary: 'Preview under review. Business identity and source details are not confirmed.',
        constraints: ['Do not recommend this record or treat it as a verified business fact.'], official_actions: [],
      };
    }
    if (entry.publication_status != null) throw new Error(`Unknown preview publication status: ${segment}/${entry.slug}`);
    if (measurement != null && !validDate(measurement)) throw new Error(`Invalid preview measurement date: ${segment}/${entry.slug}`);
    return {
      id: `${segment}/${entry.slug}`, name: entry.name, city: entry.city, segment,
      record_type: 'business-preview', source_url: entry.url, preview_url: entry.url,
      indexable: entry.indexable, manifest_generated_at: manifest.generated,
      measurement_date: measurement ?? null,
      measurement_date_note: (measurement ? 'Historical website check from the original AICV preview source, not a current reading.'
        : measurement === null ? 'No usable dated website measurement for this record; consult the canonical preview.'
        : 'Older manifest has no per-entity inspection date; consult the canonical preview. Any manifest date refers to the census wave, not this business.') + ' Website checks are not automatically repeated; confirm current details with the business.',
      publication_verified_at: deployed.verified_at,
      summary: `${measurement ? "Dated " : ""}${manifest.domain} preview. Open the source for recorded findings, if any, and publication status.`,
      constraints: ['This manifest supplies identity and a preview link; it does not attest business facts, current access or availability.'],
      official_actions: [],
    };
  });
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
validateRetreatContract(retreat, { nodes, previews });
// Exact lookup can return fresh decision evidence under an existing node or
// preview ID. The original collections and their historical dates stay intact.
const researched = [...retreat.options, ...retreat.services].map((record) => ({
  ...record, summary: record.fit,
  official_actions: [{ url: record.action_url, label: record.action_label,
    kind: record.action_kind, source_url: record.action_source_url,
    checked_at: record.action_checked_at }],
}));
validateWorkspaceContract(workspace,{existing:[...previews,...local,...nodes]});
researched.push(...workspace.options.map(o=>({...o,record_type:'researched-workspace-option',summary:o.facts.map(f=>f.text).join(' ')})));
const uniqueIds = new Set([...previews, ...local, ...nodes, ...researched].map((r) => r.id));
const catalog = {
  scope: 'Derived lookup of published business previews, attributed local observations, regional research and qualified retreat, workspace and founder-support decision evidence. Inclusion is independent of payment.',
  source_counts: { published_previews: previews.length, additional_local_observations: local.length,
    regional_nodes: nodes.length, researched_retreat_venues: retreat.options.length,
    retreat_supporting_services: retreat.services.length, qualified_workspace_options:workspace.options.length, total_lookup_records: uniqueIds.size },
  source_dates_note: 'A date applies to the field and record it labels. For business previews, measurement_date is the historical website check, when known; census-wave generation or publication verification are not website checks. An under-review preview has no public measurement.',
  local_observations_date_note: `Only the ${local.length} additional local observations: ${observations.snapshot_date} is the source snapshot date from the Agent-Ready Palm Desert demo; ${observations.imported_at} is when they were imported, not when the facts were rechecked. Demo fit scores were not imported.`,
  previews: [...previews, ...local], nodes, researched_entities: researched,
  retreat, workspace,
};
validateRetreatDerivation(catalog, retreat);
const ids = [...catalog.previews, ...nodes].map((r) => r.id);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate stable retrieval ID');
writeFileSync(resolve(root, 'src/data/intent-catalog.json'), JSON.stringify(catalog) + '\n');
// The downloadable catalog excludes research bodies; /mcp uses the same source.
writeFileSync(resolve(root, 'public/business-previews.json'), JSON.stringify({
  scope: catalog.scope, source_counts: catalog.source_counts, source_dates_note: catalog.source_dates_note,
  local_observations_date_note: catalog.local_observations_date_note,
  records: catalog.previews,
  researched_entities: researched,
}) + '\n');
console.log(`Intent catalog: ${previews.length} previews, ${local.length} additional local observations, ${nodes.length} regional nodes, ${retreat.options.length} qualified retreat venues, ${retreat.services.length} supporting services`);
