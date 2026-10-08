import { normalizeDecision as normalize, locationRequirements, entityRequirements, decisionRequirements, positiveRequirementText } from './decision-requirements.mjs';
export function workspaceIntent(input, q) {
  if (input.decision && input.decision !== 'team-retreat') return input.decision;
  if(input.decision === 'team-retreat') return null;
  if(input.workspace_type || input.workspace_access) return input.workspace_type==='founder-support'?'founder-support':'workspace';
  if(/\b(retreat|offsite|off site)\b/.test(q)) return null;
  if(/cowork|co work|day pass|day work|drop in desk|meeting room rental|rent (?:a )?meeting room|hourly meeting|virtual office|private office|physical office|office space|office lease|workspace/.test(q)) return 'workspace';
  if(/founder support|business counseling|business counselling|startup support|business mentoring|small business help|business resource|business assistance/.test(q)) return 'founder-support';
  if(/satellite|relocat(?:e|ion|ing)/.test(q)) return 'satellite-base';
  return null;
}
export function resolveWorkspace(input,catalog,base,q,city,group,intent) {
  const location=locationRequirements(input,city), requirements={...decisionRequirements(input,group),...location};
  const all=(catalog.workspace?.options ?? []).filter(o=>o.qualified===true);
  const entities=entityRequirements(input,all), exclusions=[...entities.exclusions];
  requirements.requirement_conflicts.push(...location.location_conflicts,...entities.conflicts);
  const positive=positiveRequirementText(q);
  const founder=intent==='founder-support';
  const requestedKind=input.workspace_type ?? (founder?'founder-support': /meeting room|conference room|boardroom/.test(positive)?'meeting-room':/virtual office/.test(positive)?'virtual-office':/private office|physical office|office lease|office space/.test(positive)?'office':null);
  requirements.workspace_type=requestedKind;
  const unresolved=[];
  if(entities.unknown_requested.length) return {...base,intent,status:'no_match',requirements,exclusions,next_questions:[`No qualified record establishes: ${entities.unknown_requested.join(', ')}. Provide the exact name or official URL.`],requirement_conflicts:requirements.requirement_conflicts};
  if(entities.unknown_excluded.length) unresolved.push(`Unrecognized exclusions retained for clarification: ${entities.unknown_excluded.join(', ')}.`);
  if(requirements.workspace_access && requirements.workspace_access!=='day-pass') unresolved.push(`Requested ${requirements.workspace_access} access needs operator confirmation of membership, eligibility and appointment terms.`);
  if(location.nearby) unresolved.push(`Nearby ${city} is a regional anchor; no distance or travel-time verification is established.`);
  if(location.distance_unverified) unresolved.push('Requested distance or drive time is unverified; no radius filter is inferred.');
  if(requirements.budget_amount !== null && !requirements.budget_scope) unresolved.push('Budget scope is unresolved: total, per person, per hour or per day?');
  if(['transaction','agent_assisted'].includes(requirements.required_action)) unresolved.push('Requested execution exceeds official_handoff capability. No live booking/payment adapter or operator permission is established.');
  const ranked=entities.candidates.map(o=>{
    const reasons=[],unknowns=[...o.unknowns],conflicts=[];
    const publishedCity=o.field_evidence.city.evidence_type==='published_fact';
    if(location.strict_city && (!publishedCity || normalize(o.city)!==normalize(city))) conflicts.push({reason:publishedCity?`Outside explicit ${city} city boundary.`:`No published physical ${city} location established; service-area evidence is insufficient.`,evidence_type:publishedCity?'published_fact':'unknown',source_url:o.field_evidence.city.source_url});
    const access=o.field_evidence.access.value ?? {}, purposes=o.purposes ?? [];
    if(founder && o.kind!=='founder-support' && !purposes.includes('founder-support')) conflicts.push({reason:'Not a sourced founder-support program.',evidence_type:'published_fact',source_url:o.primary_sources[0].url});
    if(intent==='satellite-base' && o.kind==='founder-support') conflicts.push({reason:'Founder support does not establish a physical satellite workspace.',evidence_type:'unknown',source_url:null});
    if(!founder && o.kind==='founder-support' && requestedKind!=='founder-support') conflicts.push({reason:'Support program access does not establish the requested workspace product.',evidence_type:'unknown',source_url:null});
    if(requestedKind==='virtual-office' && !purposes.includes('virtual-office')) conflicts.push({reason:'No sourced virtual-office product is established.',evidence_type:'unknown',source_url:null});
    if(requestedKind==='office' && !purposes.includes('small-team-office') && !purposes.includes('satellite-base')) conflicts.push({reason:'No sourced physical office product is established.',evidence_type:'unknown',source_url:null});
    if(requestedKind==='meeting-room' && !purposes.includes('meeting') && !access.meeting_room) conflicts.push({reason:'No sourced public meeting-room rental pathway.',evidence_type:'unknown',source_url:null});
    if(requirements.workspace_access==='day-pass' && !(access.day_pass===true || typeof access.day_pass==='string')) conflicts.push({reason:'Public day-pass access is not established. Membership, virtual address and program access do not establish a walk-in desk.',evidence_type:'unknown',source_url:o.field_evidence.access.source_url});
    if(conflicts.length) {exclusions.push({id:o.id,name:o.name,city:o.city,reasons:conflicts});return null;}
    let score=0;
    if(o.kind==='coworking')score+=10;
    if(founder && o.kind==='founder-support')score+=30;
    if(intent==='satellite-base' && purposes.includes('satellite-base'))score+=30;
    if(requestedKind==='meeting-room' && (purposes.includes('meeting')||access.meeting_room))score+=30;
    if(requestedKind==='office' && purposes.includes('small-team-office'))score+=30;
    if(requirements.workspace_access==='day-pass' && (access.day_pass===true || typeof access.day_pass==='string'))score+=30;
    if(city && normalize(o.city)===normalize(city))score+=5;
    reasons.push(...o.facts.map(f=>({reason:f.text,evidence_type:f.evidence_type,source_url:f.source_url,checked_at:f.checked_at})));
    if(group && requestedKind==='meeting-room') unknowns.push(`Confirm a named room and working layout for ${group} attendees; comfortable seating is not a contractual maximum or live availability.`);
    if(requirements.privacy)unknowns.push(`Requested privacy: ${requirements.privacy} Confirm acoustic privacy, dedicated access and other users.`);
    if(requirements.accessibility)unknowns.push(`Requested accessibility: ${requirements.accessibility} General facility claims do not establish this itinerary fits.`);
    if(requirements.budget_amount!==null)unknowns.push(`Affordability against ${requirements.budget_amount} USD (${requirements.budget_scope??'scope unresolved'}) is unknown until product, duration, taxes and fees are quoted. Virtual-office prices are not physical workspace prices.`);
    return {score,result:{...o,conditional_fit:'Candidate for an official inquiry; suitability and live availability remain unconfirmed.',fit_reasons:reasons,unknowns:[...new Set(unknowns)],action_capability:'official_handoff'}};
  }).filter(Boolean).sort((a,b)=>b.score-a.score||a.result.id.localeCompare(b.result.id));
  const results=ranked.slice(0,Math.min(input.limit??4,5)).map(r=>r.result);
  return {...base,intent,status:results.length?'needs_details':'no_match',requirements,results,exclusions,unresolved_constraints:unresolved,requirement_conflicts:requirements.requirement_conflicts,next_questions:['Confirm the product, proposed date/time, headcount and working setup.','Ask the operator for availability, complete price, eligibility, access and cancellation/refund terms.'],limitations:[...base.limitations,'Published prices identify scoped offers, not checkout totals. Official handoff does not imply AICV authority to reserve or pay.']};
}
