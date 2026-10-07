// Shared build-time guard for retreat decision evidence. Does no network work.
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const TYPES = new Set(['published_fact', 'business_attestation', 'observation', 'judgment', 'unknown']);
const SERVICES = new Set(['transport', 'dining', 'facilitation', 'av', 'activities']);
const dated = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v ?? '') && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
const url = (v) => { try { return new URL(v).protocol === 'https:'; } catch { return false; } };
const fail = (message) => { throw new Error(`Retreat contract: ${message}`); };
function evidence(e, label) {
  if (!e || !TYPES.has(e.evidence_type)) fail(`${label} needs a recognized evidence_type`);
  if (!dated(e.checked_at)) fail(`${label} needs its own checked_at date`);
  if (['published_fact', 'business_attestation', 'observation'].includes(e.evidence_type)) {
    const sources = [e.source_url, ...(e.source_urls ?? [])].filter(Boolean);
    if (!sources.length || sources.some((s) => !url(s))) fail(`${label} needs valid source URLs`);
  }
  if (e.evidence_type === 'judgment' && !e.basis) fail(`${label} needs its judgment basis`);
}
export function validateRetreatContract(retreat, { nodes = [], previews = [] } = {}) {
  if (retreat.schema_version !== 2 || !Array.isArray(retreat.options) || !Array.isArray(retreat.services)) fail('schema_version 2/options/services required');
  const records = [...retreat.options, ...retreat.services];
  const ids = new Set();
  for (const r of records) {
    if (r.qualified !== true) fail(`${r.slug} must be explicitly qualified`);
    if (!r.slug || !r.name || !r.id || ids.has(r.id)) fail(`${r.slug} missing identity or duplicate ID`);
    ids.add(r.id);
    if (!dated(r.source_checked_at)) fail(`${r.id} missing source check date`);
    evidence(r.qualification_evidence, `${r.id}.qualification`);
    if (!url(r.action_url) || !dated(r.action_checked_at) || !url(r.action_source_url)) fail(`${r.id} official action requires URL and its check date`);
    if (!r.primary_sources?.length) fail(`${r.id} requires primary sources`);
    for (const s of r.primary_sources) if (!url(s.url) || !dated(s.checked_at)) fail(`${r.id} invalid primary source/date`);
    if (!r.field_evidence || !Object.keys(r.field_evidence).length) fail(`${r.id} requires field_evidence`);
    for (const [field, e] of Object.entries(r.field_evidence)) evidence(e, `${r.id}.${field}`);
    for (const field of ['identity', 'city', 'fit', 'facts', 'availability', 'affordability', 'action_url']) if (!r.field_evidence[field]) fail(`${r.id} missing ${field} evidence`);
    if (r.action_checked_at !== r.field_evidence.action_url.checked_at || r.action_source_url !== r.field_evidence.action_url.source_url) fail(`${r.id} action date/source differs from its evidence`);
    if (r.node_source) {
      const slug = r.node_source.match(/^\/nodes\/([^/]+)\/$/)?.[1];
      const node = nodes.find((n) => n.id === `node/${slug}`);
      if (!node || r.id !== node.id || r.node_last_updated !== node.source_checked_at) fail(`${r.id} invented node or mutated node date`);
    } else if (r.id.startsWith('node/')) fail(`${r.id} lacks an existing canonical node`);
    if (r.preview_reference) {
      const ref = r.preview_reference;
      const original = previews.find((p) => p.id === ref.id);
      if (!original || original.preview_url !== ref.url || original.manifest_generated_at !== ref.manifest_generated_at || original.city !== ref.recorded_city) fail(`${r.id} mutated historical preview reference`);
      if (!r.node_source && r.id !== ref.id) fail(`${r.id} must retain its existing preview ID`);
    } else if (!/^(node|retreat|service)\//.test(r.id)) fail(`${r.id} unsupported research-only ID`);
    if (r.service_type) {
      if (!SERVICES.has(r.service_type)) fail(`${r.id} invalid service_type`);
      for (const f of ['capacity_min', 'capacity_max']) if (r[f] != null) {
        if (!Number.isInteger(r[f]) || r[f] <= 0) fail(`${r.id}.${f} invalid group range`);
        evidence(r.field_evidence[f], `${r.id}.${f}`);
      }
      continue;
    }
    if (!r.lodging || !Array.isArray(r.lodging.room_configurations) || r.lodging.available_room_block !== null) fail(`${r.id} requires separate lodging inventory and unknown available block`);
    for (const f of ['room_count', 'bedrooms', 'guest_capacity', 'accommodation_units']) if (r.lodging[f] != null) {
      if (!Number.isInteger(r.lodging[f]) || r.lodging[f] <= 0) fail(`${r.id}.lodging.${f} invalid inventory`);
      const e = r.field_evidence[`lodging.${f}`];
      evidence(e, `${r.id}.lodging.${f}`);
      if (!['published_fact', 'business_attestation'].includes(e.evidence_type)) fail(`${r.id} inventory cannot be inferred from judgment`);
    }
    if (r.minimum_nights != null && (!r.minimum_nights_scope || r.field_evidence.minimum_nights?.evidence_type !== 'published_fact')) fail(`${r.id} minimum nights must have an applicable published scope`);
    for (const s of r.meeting_spaces ?? []) {
      if (!s.name || !s.layout || s.capacity != null && (!Number.isInteger(s.capacity) || s.capacity <= 0)) fail(`${r.id} invalid named meeting layout`);
      evidence(s, `${r.id}.meeting_spaces.${s.name}`);
    }
    for (const rule of r.exclusion_rules ?? []) {
      if (!rule.kind || !rule.reason || !url(rule.source_url) || !dated(rule.checked_at) || rule.evidence_type !== 'published_fact') fail(`${r.id} exclusion requires dated published restriction`);
    }
  }
  return { venues: retreat.options.length, services: retreat.services.length };
}
// A derived catalog must preserve the original records byte-for-byte in data
// terms. Build timestamps cannot become source, action or historical dates.
export function validateRetreatDerivation(catalog, source) {
  if (JSON.stringify(catalog.retreat) !== JSON.stringify(source)) fail('derived retreat data changed source records/dates');
  for (const r of [...source.options, ...source.services]) {
    const derived = catalog.researched_entities.find((e) => e.id === r.id);
    if (!derived) fail(`${r.id} missing exact retrieval record`);
    for (const [key, value] of Object.entries(r)) if (JSON.stringify(derived[key]) !== JSON.stringify(value)) fail(`${r.id}.${key} mutated in retrieval projection`);
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const read = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  const nodes = readdirSync(resolve(root, 'src/content/nodes')).filter((f) => f.endsWith('.mdx')).map((f) => ({ id: `node/${f.slice(0,-4)}`, source_checked_at: readFileSync(resolve(root, 'src/content/nodes', f), 'utf8').match(/^last_updated:\s*["']?(\d{4}-\d{2}-\d{2})/m)?.[1] }));
  const previews = read('src/data/previews-deployed.json').segments.flatMap((segment) => { const m = read(`src/data/previews/previews-index-${segment}.json`); return m.entries.map((e) => ({ id: `${segment}/${e.slug}`, preview_url: e.url, city: e.city, manifest_generated_at: m.generated })); });
  console.log('Retreat evidence contract:', validateRetreatContract(read('src/data/retreat-options.json'), { nodes, previews }));
}
