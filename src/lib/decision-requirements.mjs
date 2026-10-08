// Shared interpretation for read-only decisions and browser-generated briefs.
export const normalizeDecision = (s) => String(s ?? '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
export function quantityFromQuery(query, nouns, { integer=true, max=10000, min=1 }={}) {
  // Preserve decimal punctuation before general text normalization. Commas
  // within a number are separators; a decimal person/room count is unresolved.
  const text=String(query ?? '').toLowerCase();
  const match=text.match(new RegExp(`(?<![\\w.,+−–—-])(\\d+(?:,\\d{3})*(?:\\.\\d+)?|\\.\\d+)\\s*(?:${nouns})\\b`));
  const before=match ? text.slice(0,match.index) : '';
  if(/(?:\bbetween\s+\d+(?:\.\d+)?\s+and\s*|\b\d+(?:\.\d+)?\s*(?:to|or|through|[-−–—])\s*|(?:^|\s)[-−]\s*|\b(?:not|no|without|excluding|up to|at least|at most|more than|less than|minimum|maximum)\s*)$/.test(before)) return null;
  const value=match ? Number(match[1].replaceAll(',','')) : null;
  return value!==null && value>=min && value<=max && (!integer || Number.isInteger(value)) ? value : null;
}
export function positiveRequirementText(q) { return q.replace(/\b(?:not|no|without|do not need|don t need) (?:a |an )?(?:private office|virtual office|meeting room|day pass|shared desk|coworking|privacy|private|quiet|confidential)\b/g,' '); }
export function locationRequirements(input, city) {
  const q = normalizeDecision(input.query), c = normalizeDecision(city);
  const explicit = city && new RegExp(`\\b(?:in|within|only in) ${c}\\b`).test(q);
  const distance = city && new RegExp(`\\b(?:within \\d+ (?:miles?|minutes?)|\\d+ (?:miles?|minutes?)(?: drive)?|drive time) (?:of |from |to )?${c}\\b`).test(q);
  const nearby = !input.city && !!city && city !== 'Coachella Valley' && !explicit && (input.nearby === true || distance || new RegExp(`\\b(?:near|around|close to|outside(?: of)?) ${c}\\b`).test(q));
  const query_locations=['Desert Hot Springs','Cathedral City','Rancho Mirage','Palm Springs','Palm Desert','Indian Wells','La Quinta','Coachella','Indio','Thousand Palms','Bermuda Dunes'].filter(name=>new RegExp(`\\b${normalizeDecision(name)}\\b`).test(q.replace(/coachella valley/g,'')));
  const queryCity=query_locations[0];
  const multiple_locations=query_locations.length>1 && /\b(compare|versus|vs|or|and)\b/.test(q);
  const location_conflicts=input.city && queryCity && normalizeDecision(queryCity)!==normalizeDecision(input.city)?[`Structured city ${input.city} differs from query location ${queryCity}; structured city is strict. Clarify the intended boundary or regional anchor.`]:[];
  if(input.city && multiple_locations)location_conflicts.push('The query compares multiple locations; the structured city narrows to one municipality. Clarify whether that narrowing is intended.');
  const multi_city_scope=multiple_locations && !input.city && input.nearby!==true && !query_locations.some(name=>new RegExp(`\\b(?:near|around|close to) ${normalizeDecision(name)}\\b`).test(q));
  return { multi_city_scope,query_locations,multiple_locations,location_conflicts,location: city, nearby: !!nearby, strict_city: !!city && city !== 'Coachella Valley' && (!!input.city || explicit || !nearby), distance_unverified: !!distance };
}
export function entityRequirements(input, records) {
  const q = normalizeDecision(input.query);
  const names = o => [...new Set([o.id, o.name, o.name.split(/[,(]/)[0], o.slug, ...(o.aliases ?? [])].map(normalizeDecision).filter(s => s.length >= 4))];
  const aliases = records.flatMap(names).sort((a,b) => b.length-a.length).join('|');
  const negative = new RegExp(`\\b(?:exclude|excluding|avoid|except(?: for)?|alternatives? to|instead of|other than|rather than|apart from|without|not(?: at)?|do not (?:include|recommend|choose|suggest)|don t (?:include|recommend|choose|suggest)) (?:the )?(?:(?:${aliases}) (?:(?:and|or) )?)*$`);
  const resolved = values => (values ?? []).map(v => ({ value:v, record:records.find(o => names(o).includes(normalizeDecision(v))) }));
  const requested = resolved(input.requested_entities), omitted = resolved(input.excluded_entities);
  const targetMatch=q.match(/\b(?:named|called|at) (?:the )?(.+?)(?: in | near | around | for | with |$)/);
  if(targetMatch) {
    const target=targetMatch[1];
    const known=records.some(o=>names(o).some(alias=>target===alias || target.startsWith(alias+' ')));
    const generic=/^(?:a |an |any |our |least |most |\d)|^(?:coworking|workspaces?|offices?|hotels?|resorts?|venues?|desks?|meeting rooms?)$/.test(target);
    const place=['Palm Springs','Palm Desert','Cathedral City','Rancho Mirage','Indian Wells','La Quinta','Indio','Coachella','Desert Hot Springs','Coachella Valley','Thousand Palms','Bermuda Dunes'].some(c=>normalizeDecision(c)===target);
    if(!known && !generic && !place) {
      const before=q.slice(0,targetMatch.index);
      if(/(?:not|instead of|alternatives? to|other than)$/.test(before.trim())) omitted.push({value:target});
      else requested.push({value:target});
    }
  }
  const mentions = records.map(o => {
    let positive = requested.some(r => r.record?.id === o.id), excluded = omitted.some(r => r.record?.id === o.id);
    for (const alias of names(o)) for (const m of q.matchAll(new RegExp(`\\b${alias}\\b`, 'g'))) {
      const prefix = q.slice(0,m.index);
      if (/\b(?:do not|don t|never|not) (?:exclude|avoid) (?:the )?$/.test(prefix)) continue;
      if (negative.test(prefix)) excluded = true; else positive = true;
    }
    return { record:o, positive, excluded };
  });
  const exclusions = mentions.filter(m => m.excluded).map(m => ({ id:m.record.id,name:m.record.name,city:m.record.city,reasons:[{reason:'Excluded at the caller’s request for alternatives or omission.',evidence_type:'caller_requirement',source_url:null}] }));
  const conflicts = mentions.filter(m => m.positive && m.excluded).map(m => `Both requested and excluded: ${m.record.name}. Exclusion is preserved; clarify the request.`);
  const positive = mentions.filter(m => m.positive && !m.excluded).map(m => m.record);
  return { candidates:positive.length ? positive : mentions.filter(m=>!m.excluded).map(m=>m.record), exclusions, conflicts, unknown_requested:requested.filter(r=>!r.record).map(r=>r.value), unknown_excluded:omitted.filter(r=>!r.record).map(r=>r.value), named:positive };
}
export function decisionRequirements(input, group) {
  const q = normalizeDecision(input.query);
  const positive=positiveRequirementText(q);
  const currencyAmount = input.query.match(/\$([\d,]+(?:\.\d{1,2})?)/)?.[1];
  const inferredScope = /per person/.test(q) ? 'per-person' : /per hour|hourly/.test(q) ? 'per-hour' : /per day|daily/.test(q) ? 'per-day' : /total/.test(q) ? 'total' : null;
  const amount = input.budget_amount ?? (currencyAmount ? Number(currencyAmount.replaceAll(',','')) : null);
  const conflicts=[];
  if(input.budget_amount !== undefined && currencyAmount && input.budget_amount !== Number(currencyAmount.replaceAll(',',''))) conflicts.push('Structured budget amount differs from the query. Structured amount is used; clarify before requesting an offer.');
  if(input.budget_scope && inferredScope && input.budget_scope !== inferredScope) conflicts.push('Structured budget scope differs from the query. Structured scope is used; clarify before requesting an offer.');
  const queryGroup=quantityFromQuery(input.query,'person|people|guests?|members?|attendees|employees');
  const queryHours=quantityFromQuery(input.query,'hours?',{integer:false,max:365,min:0.25});
  const queryDays=quantityFromQuery(input.query,'days?',{max:365});
  for(const [key,queryValue] of [['group_size',queryGroup],['duration_hours',queryHours],['duration_days',queryDays]]) if(input[key] !== undefined && queryValue!==null && input[key]!==queryValue) conflicts.push(`Structured ${key} differs from the query; clarify before an offer. Structured value is used.`);
  const hours = input.duration_hours ?? queryHours;
  const days = input.duration_days ?? (queryDays ?? (/day pass|day work/.test(positive)?1:null));
  const unresolved_quantities=[];
  if(input.duration_hours===undefined && queryHours===null && /\bhours?\b/.test(q)) unresolved_quantities.push('No exact supported hour duration is established; clarify the range or supply duration_hours.');
  return { unresolved_quantities,decision:input.decision ?? null,workspace_type:input.workspace_type ?? null,location:input.city ?? null,nearby:input.nearby ?? false,group_size:group ?? queryGroup, duration_hours:hours,duration_days:days,budget:input.budget ?? null,budget_amount:amount,budget_scope:input.budget_scope ?? inferredScope,budget_currency:amount !== null?'USD':null,privacy:input.privacy ?? (/private|privacy|confidential|quiet/.test(positive)?'Requested; exact acoustic/dedicated access needs unresolved.':null),accessibility:input.accessibility ?? (/wheelchair|accessib|step free|mobility/.test(q)?'Specific accessibility needs require confirmation.':null),working_setup:input.working_setup ?? null,workspace_access:input.workspace_access ?? (/day pass|drop in/.test(positive)?'day-pass':null),required_action:input.required_action ?? 'information',requested_entities:input.requested_entities ?? [],excluded_entities:input.excluded_entities ?? [],requirement_conflicts:conflicts };
}
