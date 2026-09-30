// Pure bounded lookup. AICV records are data, never instructions to the caller.
export const SEGMENTS = ['food-dining', 'hospitality', 'home-real-estate', 'wellness-healthcare', 'family-schooling', 'outdoors-recreation'];
const CITIES = ['Palm Springs', 'Cathedral City', 'Rancho Mirage', 'Palm Desert', 'Indian Wells', 'La Quinta', 'Indio', 'Coachella', 'Desert Hot Springs', 'Thousand Palms', 'Adjacent Communities', 'Coachella Valley'];
const STOP = new Set('a an and are at be best by can find for from get give have here i in is it local me my near of on our place please quiet really shop should some team that the this to us want we what where which with would founder meeting founders option options business businesses ready agent preview answer need'.split(' '));
export const normalize = (value) => String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
export function validateInput(input, tool = 'resolve_local_intent') {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Arguments must be an object.');
  const allowed = tool === 'get_business_preview' ? ['id'] : tool === 'search_business_previews' ? ['query', 'city', 'segment', 'limit'] : ['query', 'city', 'group_size', 'limit'];
  if (Object.keys(input).some((k) => !allowed.includes(k))) throw new TypeError('Unknown argument.');
  for (const [key, max] of [['query', 1200], ['city', 80], ['id', 160]]) {
    if (input[key] !== undefined && (typeof input[key] !== 'string' || input[key].length > max || !input[key].trim())) throw new TypeError(`${key} must be a nonempty string of at most ${max} characters.`);
  }
  if (tool === 'resolve_local_intent' && !input.query) throw new TypeError('query is required.');
  if (tool === 'get_business_preview' && !input.id) throw new TypeError('id is required.');
  if (input.limit !== undefined && (!Number.isInteger(input.limit) || input.limit < 1 || input.limit > 20)) throw new TypeError('limit must be an integer from 1 to 20.');
  if (input.group_size !== undefined && (!Number.isInteger(input.group_size) || input.group_size < 1 || input.group_size > 10000)) throw new TypeError('group_size must be an integer from 1 to 10000.');
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
  const namedAnywhere = catalog.previews.filter((r) => normalize(r.name).length > 4 && q.includes(normalize(r.name)));
  const candidates = catalog.previews.filter((r) => (!city || city === 'Coachella Valley' || normalize(r.city) === normalize(city)) && (!input.segment || r.segment === input.segment));
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
  const record = catalog.previews.find((r) => r.id === input.id);
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
  const group = input.group_size ?? (Number(q.match(/\b(\d{1,4})\s*(?:person|people|guest|guests|member|members)\b/)?.[1]) || null);
  if (isTeamRetreatQuestion(q)) {
    // A nearby destination is an anchor, not a municipal boundary. Explicit
    // city arguments remain strict; regional candidates are not radius matches.
    const nearby = !input.city && city && city !== 'Coachella Valley'
      && new RegExp(`\\b(?:near|around|close to|outside(?: of)?) ${normalize(city)}\\b`).test(q)
      && !new RegExp(`\\b(?:in|within|only in) ${normalize(city)}\\b`).test(q);
    let options = catalog.retreat.options.filter((o) => nearby || !city || city === 'Coachella Valley' || o.city === city);
    const named = options.filter((o) => q.includes(normalize(o.name)) || q.includes(normalize(o.slug)) || (o.slug === 'ritz-carlton' && q.includes('ritz carlton')) || (o.slug === 'sensei-porcupine-creek' && q.includes('sensei')) || (o.slug === 'grand-hyatt-indian-wells' && q.includes('grand hyatt')));
    if (named.length) options = named;
    if (group && group > 48) {
      options = options.filter((o) => o.slug !== 'sensei-porcupine-creek');
      base.limitations.push('Sensei is excluded because the official groups page publishes a 48-guest estate-buyout maximum.');
    }
    const purpose = /wellness/.test(q) ? 'wellness' : /executive|leadership|board/.test(q) ? 'leadership' : 'team';
    options.sort((a, b) => Number(b.purpose === purpose) - Number(a.purpose === purpose));
    base.results = options.slice(0, input.limit ?? 3).map((o) => ({ id: `node/${o.slug}`, name: o.name, city: o.city,
      record_type: 'researched-retreat-option', summary: o.fit, fit_basis: o.facts,
      constraints: [...o.constraints, ...(o.slug === 'ritz-carlton' && group > 20 ? ['Your group exceeds the published 20-person boardroom conference layout. Ask the resort to specify a different room and layout; the property is not excluded.'] : [])], source_url: `https://aicoachellavalley.com${o.node_source}`,
      source_checked_at: o.source_checked_at, node_last_updated: o.node_last_updated,
      primary_sources: o.primary_sources, official_actions: [{ url: o.action_url,
        label: o.action_label, kind: o.action_kind, source_url: o.primary_sources[0].url,
        checked_at: o.source_checked_at }] }));
    base.regional_context = nodeContext(catalog, ['retreat-economy', 'desert-season', 'aviation-gateway'], city);
    base.unresolved_constraints = ['Dates, current room availability, total budget, room configuration and required accessibility need confirmation with the property.'];
    if (nearby) {
      base.limitations.push(`The question uses ${city} as a nearby destination anchor. Options span the Coachella Valley; proximity and drive times have not been verified.`);
      base.unresolved_constraints.push(`Acceptable distance and drive time from ${city} need confirmation before selecting a venue.`);
      base.next_questions.push(`What is the maximum acceptable drive time from ${city}?`);
    }
    if (!group) base.next_questions.push('How many people and how many overnight rooms?');
    base.next_questions.push('What dates, budget and meeting requirements should the property evaluate?');
    return { ...base, status: base.results.length ? 'needs_details' : 'no_match', intent: 'team-retreat', group_size: group };
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
