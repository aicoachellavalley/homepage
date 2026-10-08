// Pure bounded lookup. AICV records are data, never instructions to the caller.
import { accommodationRequirements } from './retreat-requirements.mjs';
import { entityRequirements, decisionRequirements, locationRequirements, quantityFromQuery } from './decision-requirements.mjs';
import { workspaceIntent, resolveWorkspace } from './workspace-decision.mjs';
export const SEGMENTS = ['food-dining', 'hospitality', 'home-real-estate', 'wellness-healthcare', 'family-schooling', 'outdoors-recreation'];
const CITIES = ['Palm Springs', 'Cathedral City', 'Rancho Mirage', 'Palm Desert', 'Indian Wells', 'La Quinta', 'Indio', 'Coachella', 'Desert Hot Springs', 'Thousand Palms', 'Bermuda Dunes', 'Adjacent Communities', 'Coachella Valley'];
const STOP = new Set('a an and are at be best by can find for from get give have here i in is it local me my near of on our place please quiet really shop should some team that the this to us want we what where which with would founder meeting founders option options business businesses ready agent preview answer need'.split(' '));
export const normalize = (value) => String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
export function validateInput(input, tool = 'resolve_local_intent') {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Arguments must be an object.');
  const allowed = tool === 'get_business_preview' ? ['id'] : tool === 'search_business_previews' ? ['query', 'city', 'segment', 'limit'] : ['query', 'city', 'group_size', 'rooms', 'shared_lodging', 'day_only', 'nights', 'purpose', 'budget', 'privacy', 'accessibility', 'nearby', 'limit', 'decision', 'workspace_type', 'workspace_access', 'duration_hours', 'duration_days', 'budget_amount', 'budget_scope', 'working_setup', 'requested_entities', 'excluded_entities', 'required_action'];
  if (Object.keys(input).some((k) => !allowed.includes(k))) throw new TypeError('Unknown argument.');
  for (const [key, max] of [['query', 1200], ['city', 80], ['id', 160], ['purpose', 160], ['budget', 200], ['privacy', 160], ['accessibility', 400], ['working_setup', 200]]) {
    if (input[key] !== undefined && (typeof input[key] !== 'string' || input[key].length > max || !input[key].trim())) throw new TypeError(`${key} must be a nonempty string of at most ${max} characters.`);
  }
  if (tool === 'resolve_local_intent' && !input.query) throw new TypeError('query is required.');
  if (tool === 'get_business_preview' && !input.id) throw new TypeError('id is required.');
  if (input.limit !== undefined && (!Number.isInteger(input.limit) || input.limit < 1 || input.limit > 20)) throw new TypeError('limit must be an integer from 1 to 20.');
  if (input.group_size !== undefined && (!Number.isInteger(input.group_size) || input.group_size < 1 || input.group_size > 10000)) throw new TypeError('group_size must be an integer from 1 to 10000.');
  for (const key of ['rooms', 'nights']) {
    if (input[key] !== undefined && (!Number.isInteger(input[key]) || input[key] < (key === 'nights' ? 0 : 1) || input[key] > (key === 'nights' ? 365 : 10000))) throw new TypeError(`${key} must be a bounded nonnegative integer (rooms at least 1).`);
  }
  for (const key of ['shared_lodging', 'day_only', 'nearby']) {
    if (input[key] !== undefined && typeof input[key] !== 'boolean') throw new TypeError(`${key} must be a boolean.`);
  }
  const enums = { decision:['team-retreat','workspace','satellite-base','founder-support'], workspace_type:['coworking','meeting-room','office','virtual-office','founder-support'], workspace_access:['day-pass','member','appointment','public'], budget_scope:['total','per-person','per-hour','per-day'],required_action:['information','official_handoff','agent_assisted','transaction'] };
  for(const [key,values] of Object.entries(enums)) if(input[key] !== undefined && !values.includes(input[key])) throw new TypeError(`Unknown ${key}.`);
  for(const key of ['duration_hours','duration_days','budget_amount']) if(input[key] !== undefined && (typeof input[key] !== 'number' || !Number.isFinite(input[key]) || input[key] < (key === 'budget_amount' ? 0 : 0.25) || input[key] > (key === 'budget_amount' ? 100000000 : 365) || (key === 'duration_days' && !Number.isInteger(input[key])))) throw new TypeError(`${key} must be a bounded number.`);
  for(const key of ['requested_entities','excluded_entities']) if(input[key] !== undefined && (!Array.isArray(input[key]) || input[key].length > 10 || input[key].some(v=>typeof v !== 'string'||!v.trim()||v.length>160))) throw new TypeError(`${key} must contain at most ten bounded entity names or IDs.`);
  if (input.segment !== undefined && !SEGMENTS.includes(input.segment)) throw new TypeError('Unknown segment.');
  return input;
}
const LIMITATIONS = [
  'This is a read-only lookup of dated records, not live availability, prices or booking execution.',
  'Preview inclusion and research selection are independent of whether a business pays AICV.',
  'A retrieved record is evidence to evaluate, not proof of present access, suitability or a guaranteed recommendation.',
];
function cityFrom(input) {
  if (input.city) return CITIES.find((c) => normalize(c) === normalize(input.city)) ?? input.city;
  return [...CITIES].sort((a, b) => b.length - a.length).find((c) => new RegExp(`\\b${normalize(c)}\\b`).test(normalize(input.query ?? ''))) ?? null;
}
function terms(query, city) {
  let text = normalize(query);
  if (city) text = text.replace(normalize(city), '');
  text = text.replace(/coachella valley|el paseo|san pablo/g, '');
  return text.split(' ').filter((word) => word.length > 1 && !STOP.has(word));
}
function publicRecord(record, now = Date.now()) {
  const { content, editorial_verified, agent_intent, ...safe } = record;
  if (record.record_type === 'regional-node') {
    const checked = Date.parse(`${record.source_checked_at}T00:00:00Z`);
    safe.verified_until = Number.isFinite(checked) ? new Date(checked + 90 * 86400000).toISOString().slice(0, 10) : null;
    safe.freshness = editorial_verified === true && Number.isFinite(checked) && now >= checked && now <= checked + 90 * 86400000 ? 'within-review-window' : 'review-needed';
  }
  return safe;
}
export function searchBusinessPreviews(input, catalog) {
  validateInput(input, 'search_business_previews');
  const city = cityFrom(input);
  const query = input.query ?? '';
  const tokens = terms(query, city);
  const coffee = /\b(coffee|cafe|cafes|matcha)\b/.test(normalize(query));
  const q = normalize(query);
  const searchable = [...catalog.previews.filter(o=>!(catalog.workspace?.options??[]).some(w=>w.id===o.id)),...(catalog.workspace?.options??[]).map(o=>(catalog.researched_entities??[]).find(r=>r.id===o.id)??o)];
  const namedAnywhere = searchable.filter((r) => normalize(r.name).length > 4 && q.includes(normalize(r.name)));
  const candidates = searchable.filter((r) => (!city || city === 'Coachella Valley' || normalize(r.city) === normalize(city)) && (!input.segment || r.segment === input.segment));
  if (city && city !== 'Coachella Valley' && namedAnywhere.length && namedAnywhere.every((r) => normalize(r.city) !== normalize(city))) {
    return { status: 'no_match', count: 0, total_matches: 0, city, results: [], catalog: catalog.source_counts,
      limitations: [...LIMITATIONS, 'The named record is not recorded in the requested city.'] };
  }
  const ranked = candidates.map((r) => {
    const name = normalize(r.name);
    const text = normalize(`${r.name} ${r.record_type} ${r.summary} ${r.local_observation ?? ''}`);
    if (coffee && !/\b(coffee|cafe|cafes|matcha)\b/.test(text)) return { r, score: -1 };
    const exact = q.includes(name) || (name.includes(q) && q.length > 2);
    let score = exact ? 120 : 0;
    for (const word of tokens) {
      if (name.split(' ').includes(word)) score += 20;
      else if (text.split(' ').includes(word)) score += 5;
    }
    if (coffee && r.segment === 'local-observation') score += 10;
    if (q.includes('el paseo') && text.includes('el paseo')) score += 15;
    if (q.includes('san pablo') && text.includes('san pablo')) score += 15;
    // Never attach "quiet" as a business fact. An attributed observation may
    // be surfaced, with current noise left unresolved by the decision tool.
    return { r, score };
  }).filter(({ score }) => !tokens.length ? score >= 0 : score > 0).sort((a, b) => b.score - a.score || a.r.id.localeCompare(b.r.id));
  const highest = ranked[0]?.score ?? 0;
  const matched = highest >= 120 ? ranked.filter(({ score }) => score >= 100) : ranked;
  const results = matched.slice(0, input.limit ?? 6).map(({ r }) => publicRecord(r));
  return { status: results.length ? 'matches' : 'no_match', count: results.length,
    total_matches: matched.length, city, results, catalog: catalog.source_counts,
    limitations: LIMITATIONS };
}
export function getBusinessPreview(input, catalog) {
  validateInput(input, 'get_business_preview');
  const record = (catalog.researched_entities ?? []).find((r) => r.id === input.id) ?? catalog.previews.find((r) => r.id === input.id) ?? catalog.nodes.find((r) => r.id === input.id);
  return { status: record ? 'found' : 'not_found', ...(record ? { record: publicRecord(record) } : {}), limitations: LIMITATIONS };
}
function nodeContext(catalog, slugs, city) {
  return catalog.nodes.filter((n) => slugs.includes(n.slug) && (!city || city === 'Coachella Valley' || n.city === city || n.city === 'Coachella Valley')).map((n) => publicRecord(n));
}
function isTeamRetreatQuestion(q) {
  // People describe the job they need done, not necessarily our page label.
  // Keep cafe meetings distinct and avoid treating an office search as a trip.
  if (/\b(coffee|cafe|cafes|matcha)\b/.test(q)) return false;
  if (/\b(retreat|offsite|off site)\b/.test(q)) return true;
  if (/\b(satellite|office|relocat(?:e|ion|ing))\b/.test(q)) return false;
  const workingGroup = /\b(team|teams|executive|executives|leadership|board|company|corporate)\b/.test(q);
  const overnightVenue = /\b(night|nights|overnight|stay|stays|resort|resorts|hotel|hotels|room|rooms)\b/.test(q);
  const workingGathering = /\b(working session|working sessions|workshop|workshops|meeting room|meeting rooms|team gathering|team building|reconnect|off property)\b/.test(q)
    || (/\b(venue|venues)\b/.test(q) && /\b(session|sessions|meeting|meetings|gathering|gatherings)\b/.test(q));
  return workingGroup && (overnightVenue || workingGathering);
}
export function resolveLocalIntent(input, catalog) {
  validateInput(input);
  const query = input.query;
  const q = normalize(query);
  const city = cityFrom(input);
  const base = { query, city, results: [], regional_context: [], unresolved_constraints: [], next_questions: [], limitations: [...LIMITATIONS] };
  if ((!city && /\b(san diego|san francisco|los angeles|new york|london|las vegas)\b/.test(q)) || (city && !CITIES.includes(city))) return { ...base, status: 'no_match', intent: 'outside-coverage', limitations: [...LIMITATIONS, 'The requested location is outside this catalog’s coverage.'] };
  const group = input.group_size ?? quantityFromQuery(input.query,'person|people|guests?|members?|attendees|employees');
  const workspace = workspaceIntent(input,q);
  if(workspace) {
    const result=resolveWorkspace(input,catalog,base,q,city,group,workspace);
    if(workspace==='satellite-base' || workspace==='founder-support') result.regional_context=nodeContext(catalog,['palm-desert-economic-development','coachella-valley-economic-development','cook-street-university-row','workforce-talent','innovation-economy','north-palm-desert-development-zone'],city);
    return result;
  }
  if (input.decision === 'team-retreat' || isTeamRetreatQuestion(q)) {
    return resolveRetreat(input, catalog, base, q, city, group);
  }
  if (/\b(satellite|relocat(?:e|ion|ing)|startup|workforce|econom(?:y|ic)|invest|investment|university|universities)\b/.test(q) && !/\b(coffee|cafe|restaurant)\b/.test(q)) {
    base.regional_context = nodeContext(catalog, ['palm-desert-economic-development', 'coachella-valley-economic-development', 'cook-street-university-row', 'workforce-talent', 'innovation-economy', 'north-palm-desert-development-zone'], city);
    base.unresolved_constraints = ['Office availability, incentives, eligibility and operating costs require direct confirmation.'];
    base.next_questions = ['What team size, operating needs and time horizon are you evaluating?'];
    return { ...base, status: base.regional_context.length ? 'matches' : 'no_match', intent: /satellite/.test(q) ? 'satellite-base' : 'regional-research' };
  }
  const search = searchBusinessPreviews({ query, ...(city ? { city } : {}), limit: input.limit ?? 6 }, catalog);
  base.results = search.results;
  base.limitations.push('The preview search matches recorded names and source text; it is not a complete suitability ranking.');
  if (/\bquiet|privacy|private|near|walking|walkable\b/.test(q)) base.unresolved_constraints.push('Current noise, privacy, distance and seating suitability are not established by this lookup; confirm them for the proposed visit.');
  if (/\b(book|pay|reserve|reservation|purchase|buy)\b/.test(q)) base.unresolved_constraints.push('No booking, payment or reservation has been made. Use the official endpoint after confirming the required details.');
  return { ...base, status: base.results.length ? (base.unresolved_constraints.length ? 'needs_details' : 'matches') : 'no_match', intent: 'local-business' };
}


const actionFor = (o) => [{ url: o.action_url, label: o.action_label, kind: o.action_kind,
  source_url: o.action_source_url ?? o.field_evidence?.action_url?.source_url ?? o.action_url, checked_at: o.action_checked_at ?? o.field_evidence?.action_url?.checked_at ?? o.source_checked_at ?? null }];
const purposesFor = (o) => [...new Set([o.purpose, ...(o.purposes ?? [])].filter(Boolean))];
function workingSpaces(o) {
  return (o.meeting_spaces ?? []).flatMap((space) => {
    if (space.layout && Number.isFinite(space.capacity)) return [space];
    return Object.entries(space.capacities ?? {}).map(([layout, capacity]) => ({ ...space, layout, capacity }));
  }).filter((s) => /conference|boardroom|u[_ -]?shape|classroom|schoolroom|working/.test(normalize(s.layout)) && Number.isFinite(s.capacity));
}
function resolveRetreat(input, catalog, base, q, city, group) {
  const location=locationRequirements(input,city);
  const nearby=location.nearby,strictCity=location.strict_city,distanceRequest=location.distance_unverified;
  const lodgingRequirements = accommodationRequirements({ ...input, group_size: group });
  const { shared_lodging: shared, day_only: dayOnly, nights, rooms } = lodgingRequirements;
  const requestedRooms = lodgingRequirements.rooms_basis === 'explicit' ? rooms : null;
  const purposeText = normalize(input.purpose ?? q);
  const purpose = /wellness|mindfulness|yoga/.test(purposeText) ? 'wellness' : /strategy|executive|leadership|board/.test(purposeText) ? 'leadership' : input.purpose ? purposeText : 'team';
  const budget = input.budget ?? (input.budget_amount !== undefined ? `${input.budget_amount} USD (${input.budget_scope ?? 'scope unresolved'})` : null) ?? (input.query.match(/\$[\d,]+(?:\.\d{2})?(?:\s*(?:total|per person|per night))?/)?.[0] || (/\b(budget|affordable|economical|cost conscious|practical|inexpensive)\b/.test(q) ? 'budget-conscious; amount and scope unspecified' : null));
  const budgetSensitive = !!budget || /\b(practical|affordable|economical)\b/.test(q);
  const privacy = input.privacy ?? (/\b(exclusive|buyout|buy out|entire property|private (?:estate|property))\b/.test(q) ? 'exclusive-use' : /\b(private|privacy|confidential|quiet)\b/.test(q) ? 'private-working-room' : null);
  const exclusive = /exclusive|buyout|buy out|entire property|private estate/.test(normalize(privacy ?? ''));
  const accessibility = input.accessibility ?? (/\b(accessib(?:le|ility)|wheelchair|step free|mobility|ada)\b/.test(q) ? 'Accessibility requirements mentioned; specific needs unresolved.' : null);
  const boutique = /\b(boutique|intimate|small hotel)\b/.test(q);
  const privateProperty = /\b(private (?:estate|property|house)|villa|villas|estate|estates|shared house)\b/.test(q);
  const generalRequirements=decisionRequirements(input,group);
  const requirements = { ...generalRequirements,...lodgingRequirements, purpose, budget, privacy, accessibility, location: city, nearby: !!nearby && !strictCity };
  const excluded = [];
  let candidates = (catalog.retreat?.options ?? []).filter((o) => o.qualified === true);
  const names = (o) => [...new Set([o.name, o.name.split(/[,(]/)[0], o.slug, ...(o.aliases ?? [])].map(normalize).filter(s => s.length >= 4))];
  const entityRules=entityRequirements(input,candidates);
  const mentions=entityRules.candidates.map(o=>({o}));
  excluded.push(...entityRules.exclusions);
  candidates=entityRules.candidates;
  const named=entityRules.named;
  requirements.requirement_conflicts.push(...generalRequirements.requirement_conflicts,...location.location_conflicts,...entityRules.conflicts);
  const requestedName = q.match(/\b(?:named|called|at) (?:the )?(.+?)(?: in | near | around | for | with |$)/)?.[1];
  const genericTarget = requestedName && (CITIES.some((c) => normalize(c) === requestedName) || /^(?:a |an |our |least |most )/.test(requestedName) || /^(?:(?:small|private|boutique|luxury|practical|affordable) )?(?:hotel|resort|venue|property|estate|home|night)$/.test(requestedName));
  const requestedKnown = requestedName && (catalog.retreat?.options??[]).some(o => names(o).some(alias => new RegExp(`^${alias}\\b`).test(requestedName)));
  const namedUnknown = entityRules.unknown_requested.length > 0 || !named.length && (/\b(unrecorded|nonexistent|unknown venue|zzqx|zzq)\b/.test(q) || (requestedName && !genericTarget && !requestedKnown));
  if (namedUnknown) {
    return { ...base, status: 'no_match', intent: 'team-retreat', group_size: group, requirements, exclusions: [], supporting_services: [], next_questions: ['What is the exact venue name or its official group-planning URL?'], limitations: [...base.limitations, 'No qualified researched record establishes the named venue. No unrelated venue fallback is returned.'] };
  }
  const ranked = candidates.map((o) => {
    const conflicts = [], unknowns = [], reasons = [];
    let score = 0;
    const reject = (reason, source_url) => conflicts.push({ reason, evidence_type: 'published_fact', source_url: source_url ?? o.primary_sources?.[0]?.url ?? null });
    if (strictCity && !o.city) conflicts.push({ reason: `City is unresolved; no strict ${city} match can be established.`, evidence_type: 'unknown', source_url: null });
    else if (strictCity && normalize(o.city) !== normalize(city)) reject(`Outside the explicit ${city} city boundary.`, o.field_evidence?.city?.source_url);
    const lodging = o.lodging ?? {};
    const guestMax = lodging.guest_capacity ?? o.guest_capacity;
    const buyoutGuestMax = o.buyout?.guest_capacity_max;
    if (group && Number.isFinite(buyoutGuestMax) && group > buyoutGuestMax) reject(`Requested headcount exceeds the published ${buyoutGuestMax}-guest estate-buyout maximum.`, o.buyout?.source_url);
    if (!dayOnly && group && Number.isFinite(guestMax) && group > guestMax) reject(`Requested ${group} overnight attendees exceed the published ${guestMax}-guest lodging limit.`, lodging.source_url);
    if (group && !Number.isFinite(buyoutGuestMax) && o.slug === 'sensei-porcupine-creek' && group > 48) reject('Requested headcount exceeds the published 48-guest estate-buyout maximum.');
    if (dayOnly && o.day_use === 'unavailable') reject('The published policy does not support a day-only group visit.');
    if (!dayOnly && nights !== null && o.minimum_nights && nights < o.minimum_nights) reject(`Requested ${nights} night(s) conflict with the published ${o.minimum_nights}-night minimum.`);
    if (!dayOnly && rooms && Number.isFinite(lodging.room_count) && rooms > lodging.room_count) reject(`Requested ${rooms} separate rooms exceed the published ${lodging.room_count}-room property inventory. Inventory is not an available block.`, lodging.source_url);
    if (!dayOnly && rooms && o.category === 'private-lodging' && Number.isFinite(lodging.bedrooms ?? o.bedrooms) && rooms > (lodging.bedrooms ?? o.bedrooms)) reject(`Requested ${rooms} separate rooms exceed the published ${lodging.bedrooms ?? o.bedrooms} bedrooms.`, lodging.source_url);
    for (const rule of o.exclusion_rules ?? []) {
      if ((rule.kind === 'group_max' && group > rule.value) || (rule.kind === 'minimum_nights' && nights !== null && !dayOnly && nights < rule.value) || (rule.kind === 'day_only_unavailable' && dayOnly)) reject(rule.reason, rule.source_url);
    }
    if (conflicts.length) { excluded.push({ id: o.id ?? `retreat/${o.slug}`, name: o.name, city: o.city, reasons: conflicts }); return null; }
    const purposes = purposesFor(o).map(normalize);
    if (purposes.some((p) => purpose.includes(p) || p.includes(purpose))) { score += 24; reasons.push(`AICV's planning assessment identifies ${purpose} as a use case; this is a judgment based on the linked evidence.`); }
    if (dayOnly) {
      if (o.day_use === 'supported' || o.category === 'day-meeting') { score += 22; reasons.push('A documented meeting or day-use pathway supports asking about a day-only gathering.'); }
      else { score -= 8; unknowns.push('Day-only group access and any required lodging commitment need an official proposal.'); }
    } else if (o.category === 'day-meeting') { score -= 25; unknowns.push('Overnight accommodation is not established here; a separate lodging plan is required.'); }
    if (boutique && /boutique/.test(normalize(`${o.category} ${o.lodging_type} ${o.positioning} ${o.tags ?? []}`))) { score += 18; reasons.push('The documented property format matches the boutique preference.'); }
    if (privateProperty && o.category === 'private-lodging') { score += 26; reasons.push('A dedicated group-property pathway matches the private-property preference.'); }
    if (exclusive) {
      if (o.privacy === 'buyout' || o.exclusive_use === true) { score += 22; reasons.push('A published buyout or exclusive-use pathway exists; contracted exclusivity is unconfirmed.'); }
      else { score -= 10; unknowns.push('Exclusive use of the whole property is not established; a private meeting room is insufficient evidence of a buyout.'); }
    } else if (privacy) {
      if (o.privacy === 'private-room' || o.privacy === 'buyout') { score += 8; reasons.push('A documented private-room or buyout pathway supports the working-session requirement.'); }
      unknowns.push('Confirm acoustic privacy, dedicated room access and other guests during the proposed session.');
    }
    const spaces = workingSpaces(o);
    const adequate = group ? spaces.filter((s) => s.capacity >= group) : spaces;
    if (group && adequate.length) { score += 14; reasons.push(`Published working-layout evidence: ${adequate[0].name}, ${adequate[0].layout}, up to ${adequate[0].capacity}; confirm its availability and actual setup.`); }
    else unknowns.push(group ? `No sourced working-room layout establishes seating for all ${group} attendees. Ask for a named room and layout; theater/reception or lodging totals do not prove it.` : 'A named meeting room and working seating layout need confirmation.');
    if (o.slug === 'ritz-carlton' && group > 20 && !adequate.length) unknowns.push('Your group exceeds the published 20-person boardroom conference layout. Ask the resort to specify a different room and layout; the property is not excluded.');
    if (!dayOnly && rooms) unknowns.push(`A ${rooms}-room requirement does not establish an available room block; confirm dates, bed mix and shared-room acceptance.`);
    if (!dayOnly && shared) unknowns.push('Shared lodging remains conditional on the actual beds, occupancy rules and attendees’ consent; bedroom totals do not establish bed configurations.');
    const buyoutThreshold = o.buyout?.required_at_rooms ?? o.buyout_required_room_count ?? (o.slug === 'sensei-porcupine-creek' ? 10 : null);
    if (!dayOnly && rooms && buyoutThreshold && rooms >= buyoutThreshold) { score -= budgetSensitive ? 10 : 2; unknowns.push(`The published ${buyoutThreshold}-room threshold requires a buyout; obtain the full buyout proposal.`); }
    if (budgetSensitive) {
      if (/practical|meeting hotel|day.meeting/.test(normalize(`${o.positioning} ${o.category} ${o.tags ?? []}`))) { score += 8; reasons.push('The format supports comparing a simpler meeting or lodging scope; this is not a verified lower price.'); }
      unknowns.push(`Affordability for ${budget} is unknown. Request an itemized quote for lodging, meeting hire, food, AV, tax, fees and transport; no rates are inferred from positioning.`);
    }
    if (accessibility) {
      unknowns.push(`Required accessibility: ${accessibility} Confirm the exact guest rooms, step-free routes, restrooms, meeting setup and transport; a general accessibility statement does not prove this itinerary fits.`);
      if (o.field_evidence?.accessibility?.evidence_type === 'published_fact' || o.field_evidence?.accessibility?.type === 'published_fact') { reasons.push('Sourced accessibility information can frame a specific access check; suitability remains unconfirmed.'); }
    }
    if (!dayOnly && nights !== null && o.vacation_offer_minimum_nights && nights < o.vacation_offer_minimum_nights) unknowns.push(`The published vacation offer has a ${o.vacation_offer_minimum_nights}-night minimum; applicability to a corporate lodging contract is unknown and requires clarification.`);
    unknowns.push('Exact-date availability, total quote, cancellation terms and required setup remain with the operator.');
    return { o, score, reasons, unknowns: [...new Set(unknowns)] };
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.o.slug.localeCompare(b.o.slug));
  base.results = ranked.slice(0, Math.min(input.limit ?? 4, 5)).map(({ o, reasons, unknowns }) => ({
    id: o.id ?? `retreat/${o.slug}`, name: o.name, city: o.city, record_type: 'researched-retreat-option', category: o.category ?? 'resort', summary: o.fit,
    fit_basis: o.facts ?? [], fit_reasons: reasons, fit_assessment_type: 'judgment', constraints: o.constraints ?? [], conflicts: [], unknowns,
    meeting_spaces: o.meeting_spaces ?? [], lodging: o.lodging ?? null, field_evidence: o.field_evidence ?? {},
    source_url: o.node_source ? `https://aicoachellavalley.com${o.node_source}` : o.primary_sources?.[0]?.url ?? o.action_url,
    source_checked_at: o.source_checked_at ?? null, node_last_updated: o.node_last_updated ?? null,
    primary_sources: o.primary_sources ?? [], official_actions: actionFor(o) }));
  base.exclusions = excluded.filter((e) => e.reasons.some((r) => r.evidence_type !== 'unknown'));
  base.unestablished_matches = excluded.filter((e) => e.reasons.every((r) => r.evidence_type === 'unknown'));
  base.regional_context = nodeContext(catalog, ['retreat-economy', 'desert-season', 'aviation-gateway'], strictCity ? city : null);
  base.unresolved_constraints = ['Dates, current room availability, total budget, room configuration and required accessibility need confirmation with the property.'];
  if(['transaction','agent_assisted'].includes(requirements.required_action)) base.unresolved_constraints.push('Requested action exceeds the official handoff capability; no reservation, payment or request has been made.');
  if (nearby && !strictCity) {
    base.limitations.push(`The question uses ${city ?? 'the requested location'} as a nearby destination anchor. Options span the Coachella Valley; proximity and drive times have not been verified.`);
    if (distanceRequest) base.unresolved_constraints.push('The requested distance or drive-time boundary cannot be applied because sourced distances and travel times are absent.');
    base.next_questions.push(`What is the maximum acceptable drive time from ${city ?? 'your anchor location'}?`);
  }
  if (excluded.length) base.limitations.push(...excluded.map((e) => `${e.name} ${e.reasons.every((r) => r.evidence_type === 'unknown') ? 'match unestablished' : 'excluded'}: ${e.reasons.map((r) => r.reason).join(' ')}`));
  if (!group) base.next_questions.push('How many attendees need seats in the working session?');
  if (!dayOnly && !requestedRooms) base.next_questions.push(shared === false ? 'What room types and bed configurations are needed for the individual rooms?' : shared ? 'Can two attendees share, and what separate beds and room count are required?' : 'How many overnight rooms are required, and is room sharing acceptable?');
  if (nights === null) base.next_questions.push('What dates and number of nights should each operator quote?');
  else base.next_questions.push('What exact dates and flexibility should each operator evaluate?');
  if (budget) base.next_questions.push(`Does ${budget} cover the whole retreat or only lodging, and does it include food, meeting hire, AV, taxes, fees and transport?`);
  else base.next_questions.push('What total budget and included costs should the operators quote?');
  if (exclusive) base.next_questions.push('Is an entire-property buyout required, or would a dedicated private working room meet the privacy need?');
  if (accessibility) base.next_questions.push('Which mobility, hearing, vision or other access requirements must the venue verify for this itinerary?');
  const serviceTypes = [];
  if (/\b(transport|transfer|shuttle|airport|off property)\b/.test(q) || nearby) serviceTypes.push('transport');
  if (/\b(chef|chefs|catering|dining|dinner|meals|food)\b/.test(q) || privateProperty) serviceTypes.push('dining');
  if (/\b(facilitat|workshop)\w*\b/.test(q)) serviceTypes.push('facilitation');
  if (/\b(av|audio|video|projector|hybrid)\b/.test(q)) serviceTypes.push('av');
  if (/\b(activity|activities|hike|hiking|team building|wellness)\b/.test(q)) serviceTypes.push('activities');
  const serviceCandidates = (catalog.retreat?.services ?? []).filter((o) => o.qualified === true && serviceTypes.includes(o.service_type));
  base.service_exclusions = serviceCandidates.filter((o) => group && (Number.isFinite(o.capacity_max) && group > o.capacity_max || Number.isFinite(o.capacity_min) && group < o.capacity_min)).map((o) => ({ id: o.id ?? `service/${o.slug}`, name: o.name, reasons: [{ reason: `Requested ${group} attendees fall outside the published service group range (${o.capacity_min ?? 'unspecified minimum'}–${o.capacity_max ?? 'unspecified maximum'}). Ask the provider about another arrangement; it is not included in this service selection.`, evidence_type: 'published_fact', source_url: o.primary_sources?.[0]?.url ?? null }] }));
  base.supporting_services = serviceCandidates.filter((o) => !(group && (Number.isFinite(o.capacity_max) && group > o.capacity_max || Number.isFinite(o.capacity_min) && group < o.capacity_min)) && (!strictCity || !o.city || o.city === 'Coachella Valley' || o.city === city || (o.service_area ?? []).includes(city))).slice(0, 5).map((o) => ({
    id: o.id ?? `service/${o.slug}`, name: o.name, city: o.city, record_type: 'retreat-supporting-service', service_type: o.service_type,
    summary: o.fit, fit_basis: o.facts ?? [], constraints: o.constraints ?? [], source_checked_at: o.source_checked_at ?? null,
    primary_sources: o.primary_sources ?? [], field_evidence: o.field_evidence ?? {}, official_actions: actionFor(o) }));
  if (base.supporting_services.length) base.limitations.push('Supporting services are separate inquiry pathways, not a combined bookable package or confirmed availability.');
  return { ...base, status: base.results.length ? 'needs_details' : 'no_match', intent: 'team-retreat', group_size: group, requirements,
    requirement_conflicts:requirements.requirement_conflicts,
    selection_method: 'Payment-independent evidence and preference comparison; unknown requirements remain conditional. A published working-layout match is preferred; total inventory is not current availability.',
    qualified_candidates_considered: candidates.length };
}
