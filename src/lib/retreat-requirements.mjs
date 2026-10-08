// Shared by server comparison and browser briefs; structured fields take
// precedence, and meeting-day descriptions cannot erase an overnight stay.
export function accommodationRequirements(input) {
  const q = String(input.query ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const count = (nouns) => Number(q.match(new RegExp(`\\b(\\d{1,4})\\s*(?:${nouns})\\b`))?.[1]) || null;
  const words = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7 };
  const duration = input.nights ?? count('nights?') ?? words[q.match(/\b(one|two|three|four|five|six|seven) nights?\b/)?.[1]] ?? null;
  const dayOnly = input.day_only ?? (duration === 0 || (duration === null && /\b(day only|day retreat|one day|single day|no overnight|without (?:a )?(?:stay|lodging)|meeting only)\b/.test(q)));
  const individual = /\b(single occupancy|own rooms?|individual rooms?|no room sharing|(?:not|no|never|without|do not|don t|will not|won t|cannot|can t) (?:be )?shar(?:e|ed|ing))\b/.test(q);
  const shared = input.shared_lodging ?? (individual ? false : /\b(shar(?:e|ed|ing) (?:rooms?|accommodation|lodging)|double occupancy|two (?:people|per) (?:per )?room)\b/.test(q) ? true : null);
  const group = input.group_size ?? count('person|people|guests?|members?|attendees|employees');
  const explicitRooms = input.rooms ?? count('rooms?|bedrooms?');
  const rooms = dayOnly ? null : explicitRooms ?? (group && shared !== null ? Math.ceil(group / (shared ? 2 : 1)) : null);
  const conflicts=[];
  const queryDuration=count('nights?') ?? words[q.match(/\b(one|two|three|four|five|six|seven) nights?\b/)?.[1]] ?? null;
  if(input.nights !== undefined && queryDuration !== null && input.nights !== queryDuration) conflicts.push('Structured nights differ from the query; clarify before requesting a quote.');
  if(input.day_only === true && (duration ?? 0)>0) conflicts.push('Day-only and overnight nights conflict; day-only is selected by the explicit field, but clarification is required.');
  if(input.shared_lodging === true && individual) conflicts.push('Sharing allowed conflicts with the request for individual rooms; structured sharing is selected, but clarification is required.');
  return { requirement_conflicts:conflicts, group_size: group, rooms, rooms_basis: dayOnly ? null : explicitRooms ? 'explicit' : rooms ? shared ? 'planning estimate: two attendees per room; bed configuration unverified' : 'planning estimate: one attendee per room' : null,
    shared_lodging: shared, day_only: dayOnly, nights: dayOnly ? 0 : duration };
}
