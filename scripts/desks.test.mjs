import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyOverlay, assembleDesk, deskProblems, sourceHref } from './desks.mjs';

const read = p => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const meta = read('../src/data/desks/desks.json');
const { entries } = read('../src/data/desks/visit-retreat.entries.json');
const all = ['visit-retreat', 'wellness-health', 'live-build'].flatMap(s => read(`../src/data/desks/${s}.entries.json`).entries);

const good = {
  id: 'a', name: 'A', label: 'observed', observed_date: '2026-07-07',
  official_contact: { url: 'https://example.com/', phone: null },
  source: { url: 'https://aicoachellavalley.com/reports/x/', name: 'AICV census' },
};

test('positive control: the rule accepts a complete record', () => {
  assert.deepEqual(deskProblems([good]), []);
});

test('the rule rejects each kind of untrue or incomplete record', () => {
  const cases = [
    [{ observed_date: '' }, 'no observation date'],
    [{ label: 'trusted' }, 'unknown label'],
    [{ label: 'verified' }, 'verified with no ownership check'],
    [{ official_contact: {} }, 'no official contact'],
    [{ official_contact: { url: 'https://aicoachellavalley.com/nodes/x/' } }, 'AICV page used as the official contact'],
    [{ source: {} }, 'no source'],
    [{ ai_chat: ['intercom'] }, 'internal field ai_chat'],
  ];
  for (const [change, message] of cases) {
    assert.ok(deskProblems([{ ...good, ...change }]).some(p => p.includes(message)), message);
  }
});

test('every published record on all three desks passes the rule', () => {
  assert.ok(entries.length > 0);
  for (const s of ['visit-retreat', 'wellness-health', 'live-build']) assert.deepEqual(deskProblems(read(`../src/data/desks/${s}.entries.json`).entries), []);
  assert.ok(!all.some(e => /unknown|no street/i.test(e.address || '')));
  assert.ok(!all.some(e => /substance|addiction|detox|rehab/i.test(e.name)));
});

test('no business is presented as verified before an ownership check exists', () => {
  assert.equal(entries.filter(e => e.label !== 'observed').length, 0);
  assert.ok(entries.every(e => e.label_text === meta.labels.observed.text));
});

test('coverage holds: records sit in the five cities unless marked as anchors', () => {
  const five = new Set([...meta.coverage.primary, ...meta.coverage.secondary]);
  const stray = entries.filter(e => !five.has(e.city) && !e.anchor).map(e => e.name);
  assert.deepEqual(stray, []);
});

test('restaurants are here on group evidence, not on price', () => {
  const dining = entries.filter(e => e.category === 'dining');
  assert.ok(dining.length > 0);
  const evidence = e => e.facts.some(f => /^Official site mentions |^Group capacity noted: /.test(f));
  assert.deepEqual(dining.filter(e => !evidence(e)).map(e => e.name), []);
  assert.ok(!entries.some(e => e.facts.includes('Group or private dining offered')));
});

test('counts and dates derive from the records', () => {
  const desk = assembleDesk(meta, 'visit-retreat', entries);
  assert.equal(desk.counts.records, entries.length);
  assert.equal(desk.counts.observed + desk.counts.submitted + desk.counts.verified, entries.length);
  assert.ok(desk.oldest_observation <= desk.latest_observation);
});

test('unconfirmed information never replaces a sourced field', () => {
  const e = entries.find(x => /agent-preview/.test(x.source.url));
  const slug = e.source.url.split('/').pop();
  const claims = { [slug]: { attested_date: null, published_at: '2026-11-01', owner_facts: { phone: '760-000-0000', booking_url: 'https://attacker.example/', description: 'Best in town' } } };
  const [out] = applyOverlay('visit-retreat', [e], { claims });
  assert.equal(out.label, 'observed');
  assert.deepEqual(out.official_contact, e.official_contact);
  assert.equal(out.description, e.description);
  assert.equal(out.submitted_information.label, 'Submitted information, identity unconfirmed');
  assert.equal(out.submitted_information.fields.booking, 'https://attacker.example/');
  const [corrected] = applyOverlay('visit-retreat', [e], { submissions: { [e.id]: { date: '2026-11-01', fields: { phone: '1' } } } });
  assert.deepEqual(corrected.official_contact, e.official_contact);
  assert.equal(corrected.submitted_information.fields.phone, '1');
});

test('the DNS check is the only thing that makes owner facts the record', () => {
  const e = entries.find(x => /agent-preview/.test(x.source.url));
  const slug = e.source.url.split('/').pop();
  const [out] = applyOverlay('visit-retreat', [e], { claims: { [slug]: { attested_date: '2026-11-02', owner_facts: { phone: '760-000-0000' } } }, submissions: { [e.id]: { date: '2026-11-01', fields: { phone: '1' } } } });
  assert.equal(out.label, 'verified');
  assert.equal(out.official_contact.phone, '760-000-0000');
  assert.equal(out.submitted_information, undefined);
  assert.deepEqual(deskProblems([out]), []);
});

test('one business, one entry: an enrollment naming a known record cannot add a second', () => {
  const e = entries[0];
  const app = { id: 'a1', record_id: e.id, name: e.name, city: e.city, desk: 'visit-retreat', official_url: 'https://x.example/', phone: null, created_at: '2026-11-01' };
  assert.equal(applyOverlay('visit-retreat', entries, { supplied: [app] }).length, entries.length);
  const fresh = applyOverlay('visit-retreat', entries, { supplied: [{ ...app, id: 'a2', record_id: null, name: 'New Place' }] });
  assert.equal(fresh.length, entries.length + 1);
  assert.equal(fresh.at(-1).label, 'submitted');
  assert.equal(fresh.at(-1).official_contact.phone, null);
});

test('every record can reach a purchase, and says so when no review is included', () => {
  const desk = assembleDesk(meta, 'visit-retreat', entries);
  assert.ok(desk.entries.every(e => e.purchase_ref && e.profile_url));
  assert.ok(desk.entries.some(e => !e.has_measured_review));
  const page = readFileSync(new URL('../src/pages/desks/[desk]/[record].astro', import.meta.url), 'utf8');
  assert.match(page, /no private agent-readiness review/);
});

test('a preview cannot reach a live payment or a production page by link', () => {
  const saved = process.env.CF_PAGES_BRANCH;
  process.env.CF_PAGES_BRANCH = 'three-desks-2026-10';
  try {
    assert.match(assembleDesk(meta, 'visit-retreat', entries).entries[0].profile_url, /pages\.dev\/desks\//);
    assert.equal(sourceHref('https://aicoachellavalley.com/agent-preview/hospitality/x'), null);
    assert.match(sourceHref('https://aicoachellavalley.com/reports/x/'), /pages\.dev\/reports\/x\//);
    delete process.env.CF_PAGES_BRANCH;
    assert.match(assembleDesk(meta, 'visit-retreat', entries).entries[0].profile_url, /^https:\/\/aicoachellavalley\.com\//);
  } finally { if (saved === undefined) delete process.env.CF_PAGES_BRANCH; else process.env.CF_PAGES_BRANCH = saved; }
});

test('an enrolled business takes claims and verification the same way as any record', () => {
  const app = { id: 'a9', record_id: null, name: 'New Place', city: 'Indio', desk: 'visit-retreat', official_url: 'https://new.example/', phone: null, created_at: '2026-11-01' };
  const id = 'enrolled-a9';
  const unconfirmed = applyOverlay('visit-retreat', [], { supplied: [app], claims: { [id]: { attested_date: null, published_at: '2026-11-02', owner_facts: { hours: 'Daily', phone: '760-000-0000' } } }, submissions: { [id]: { date: '2026-11-01', fields: { about: 'Hi' } } } })[0];
  assert.equal(unconfirmed.label, 'submitted');
  assert.equal(unconfirmed.official_contact.phone, null);
  assert.deepEqual(unconfirmed.submitted_information.fields, { about: 'Hi', hours: 'Daily', phone: '760-000-0000' });
  const verified = applyOverlay('visit-retreat', [], { supplied: [app], claims: { [id]: { attested_date: '2026-11-03', owner_facts: { phone: '760-000-0000' } } } })[0];
  assert.equal(verified.label, 'verified');
  assert.equal(verified.official_contact.phone, '760-000-0000');
  assert.deepEqual(deskProblems([verified]), []);
});

test('verification is described as domain control, and the facts stay the business responsibility', () => {
  assert.match(meta.labels.verified.meaning, /control of the business's domain/);
  assert.match(meta.labels.verified.meaning, /responsible for the facts/);
  const pricing = read('../src/data/pricing.json');
  assert.match(pricing.tiers[1].llms, /confirms control of the business domain/);
  assert.match(pricing.tiers[1].llms, /remain the responsibility of the business/);
  assert.doesNotMatch(JSON.stringify(meta) + JSON.stringify(pricing), /ownership check/i);
});
