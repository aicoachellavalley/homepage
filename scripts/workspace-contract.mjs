const TYPES=['published_fact','observation','judgment','business_attestation','unknown'];
export function validateWorkspaceContract(data,{existing=[]}={}) {
  if(data.schema_version!==1 || !Array.isArray(data.options) || !data.options.length) throw new Error('Invalid workspace schema');
  const ids=new Set();
  const url=value=>{try{return new URL(value).protocol==='https:';}catch{return false;}};
  for(const o of data.options) {
    if(ids.has(o.id)||!o.id||!o.name||o.qualified!==true||o.action_capability!=='official_handoff') throw new Error('Invalid workspace identity or capability');
    ids.add(o.id);
    if(!/^(workspace|founder-support|local|node)\//.test(o.id)) throw new Error('Unknown workspace ID namespace');
    if(/^(local|node)\//.test(o.id) && !existing.some(r=>r.id===o.id)) throw new Error('Invented canonical identity');
    if(o.node_last_updated!==null && !existing.some(r=>r.id===o.id && r.source_checked_at===o.node_last_updated)) throw new Error('Historical node date changed');
    for(const key of ['city','access','capacity','price','duration','privacy','accessibility','eligibility','service_geography']) {
      const f=o.field_evidence?.[key];
      if(!f || !TYPES.includes(f.evidence_type)) throw new Error(`Missing typed ${key} evidence: ${o.id}`);
      if(f.evidence_type==='unknown') {if(f.value!==null)throw new Error('Unknown evidence must have null value');}
      else if(f.value===null || !url(f.source_url) || !/^\d{4}-\d{2}-\d{2}$/.test(f.checked_at)) throw new Error('Known evidence needs value/source/date');
    }
    const geography=o.field_evidence.service_geography;
    if(geography.evidence_type!=='unknown' && (!Array.isArray(geography.value.cities) || !geography.value.cities.length || geography.value.cities.some(c=>typeof c!=='string'||!c.trim()) || geography.value.physical_office_verified_by_coverage!==false))throw new Error('Service geography needs explicit cities and must not establish a physical office');
    if(!o.facts.length||!o.unknowns.length||!o.official_actions.length)throw new Error('Workspace facts, unknowns and actions required');
    for(const f of o.facts) if(!TYPES.includes(f.evidence_type)||!url(f.source_url)||!/^\d{4}-\d{2}-\d{2}$/.test(f.checked_at))throw new Error('Fact provenance missing');
    for(const a of o.official_actions) if(!url(a.url)||!url(a.source_url)||!/^\d{4}-\d{2}-\d{2}$/.test(a.checked_at))throw new Error('Action provenance missing');
  }
  return {options:ids.size};
}
