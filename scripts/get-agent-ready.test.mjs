import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const page = read('../src/pages/get-agent-ready.astro');
const tiers = JSON.parse(read('../src/data/pricing.json')).tiers;
const body = page.split('\n---\n')[1];
const section = id => body.match(new RegExp(`<section[^>]*id="${id}"[^>]*>([\\s\\S]*?)</section>`))?.[1];
const faqSource = page.match(/const faq = (\[[\s\S]*?\n\]);/)[1];
const faq = vm.runInNewContext(`(${faqSource})`);

test('positive control: sales copy retains the approved invitation', () => {
  assert.match(section('tiers'), /CHOOSE YOUR FUTURE/);
  assert.match(section('tiers'), /Start free\. Build when you're ready\./);
  assert.match(body, /Who's already asking/);
});

test('sensitivity control: section reader cannot mistake a sibling for the offer', () => {
  assert.equal(section('not-a-real-section'), undefined);
  assert.doesNotMatch(section('agent-access'), /CHOOSE YOUR FUTURE/);
});

test('technical access guidance follows the offer and network story', () => {
  assert.ok(body.indexOf('id="tiers"') < body.indexOf('id="agent-access"'));
  assert.ok(body.indexOf('class="gr-why"') < body.indexOf('id="agent-access"'));
  assert.match(section('agent-access'), /<details>\s*<summary>/);
  assert.doesNotMatch(section('agent-access'), /<details[^>]*\bopen\b/);
});

test('hero keeps agentic language without adding a vendor sales panel', () => {
  const hero = body.match(/<div class="gr-hero">([\s\S]*?)<div class="gr-stats">/)[1];
  assert.match(hero, /agentic internet/);
  assert.match(hero, /AI agents and assistants/);
  assert.doesNotMatch(hero, /Cloudflare|Stripe|Muse|<script|<iframe/);
  assert.equal(section('outcomes'), undefined);
});

test('pricing choices continue to use the shared ladder', () => {
  const cards = section('tiers');
  assert.equal([...cards.matchAll(/class="gar-v2-tier-name"/g)].length, tiers.length);
  for (const [index, tier] of tiers.entries()) {
    assert.ok(cards.includes(`>${tier.name}</div>`));
    assert.ok(cards.includes(`{pricing.tiers[${index}].price_amount}`));
  }
});

test('shared FAQ stays plain text and renders visibly and in JSON-LD', () => {
  assert.ok(faq.length > 0);
  assert.equal(new Set(faq.map(item => item.q)).size, faq.length);
  for (const { q, a } of faq) {
    assert.ok(q && a);
    assert.doesNotMatch(q + a, /<[^>]+>/);
  }
  assert.match(page, /"mainEntity": faq\.map/);
  assert.match(section('faq'), /faq\.map/);
  assert.doesNotMatch(section('faq'), /<details/);
});

test('Cloudflare caveats remain adjacent to the offer and in the FAQ', () => {
  const access = section('agent-access');
  assert.match(access, /cannot verify private Cloudflare settings/);
  assert.match(access, /does not test bookings or make purchases/);
  assert.match(access, /\$500 Agent Ready profile purchase does not include a Cloudflare account audit/);
  assert.match(access, /Keep WAF, DDoS protection, authentication and private areas protected/);
  const answer = faq.find(item => item.q.includes('Cloudflare')).a;
  assert.match(answer, /Training is a separate owner choice/);
  assert.match(answer, /changes are separately scoped/);
});

test('Muse is qualified as planned testing, not an included merchant integration', () => {
  const answer = faq.find(item => item.q.includes('checkout')).a;
  assert.match(answer, /subject to the checkout's compatibility/);
  assert.match(answer, /testing is planned, not an included integration or compatibility guarantee/);
  assert.match(answer, /membership is not required/);
});

test('payment matching and purchase terms remain explicit', () => {
  assert.match(body, /once your purchase is matched to your business/);
  assert.match(body, /We match your purchase to your business, then your page publishes/);
  assert.match(body, /href="\/terms\/#agent-ready"/);
  assert.match(body, /href="\/terms\/#agent-access"/);
});

test('sales benefits promise publication, not outside indexing or first-read priority', () => {
  const visible = body.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ');
  assert.match(visible, /publicly accessible, agent-readable, published on the AICV network once your purchase is matched to your business/);
  assert.match(visible, /Each AI service decides what it reads, cites or recommends/);
  assert.doesNotMatch(visible, /indexed, agent-readable|index agents read first|list it reads before anything else/);
});

test('example is optional, fictional and does not impersonate a customer or checkout', () => {
  const example = body.slice(body.indexOf('<details class="gar-example"'), body.indexOf('<!-- CONDENSED PERSUASION'));
  assert.match(example, /See what \{pricing\.tiers\[1\]\.price_amount\} builds/);
  assert.match(example, /Published MVA · fictional business/);
  assert.match(example, /not a customer or a live booking/);
  assert.match(example, /not a chatbot that takes appointments or payments/);
  assert.match(example, /Publication follows purchase-to-business matching/);
  assert.match(example, /Cloudflare review belong to Business or Premium/);
  assert.doesNotMatch(example, /<script|<form|application\/ld\+json|buy\.stripe\.com/);
  assert.doesNotMatch(body, /<details class="gar-example"[^>]*\bopen\b/);
  assert.equal([...example.matchAll(/<iframe /g)].length, 3);
  assert.equal([...example.matchAll(/loading="lazy" sandbox=""/g)].length, 3);
  assert.ok(example.indexOf('examples/published.html') < example.indexOf('examples/preview.html'));
  assert.match(example, /href="\/agent-preview"/);
  assert.match(example, /not customer testimonials/);
});

test('guaranteed visibility is scoped consistently in visible copy, FAQ/schema and dated Terms', () => {
  const answer = faq.find(item => item.q.includes('guaranteed visibility')).a;
  const terms = read('../src/pages/terms.astro');
  for (const surface of [body, answer, terms]) {
    assert.match(surface, /We guarantee visibility to agents on the AICV network/);
    assert.match(surface, /visit, index, cite or recommend/);
    assert.match(surface, /purchase is matched to your business/);
  }
  assert.match(terms, /id="agent-visibility"/);
  assert.match(terms, /Effective September 19, 2026/);
  assert.match(body, /<time datetime=\{researchDate\}>\{formatResearchDate\(researchDate\)\}<\/time>/);
  assert.match(body, /Latest published research update/);
  assert.match(body, /Individual business reviews carry their own dates/);
  assert.doesNotMatch(body, /<time datetime="2026-09-19">/);
  assert.match(body, /still forming beneath our feet/);
});

test('generated examples are traceable and fictional, with no callable actions or entity markup', () => {
  const manifest = JSON.parse(read('../public/get-agent-ready/examples/provenance.json'));
  assert.equal(manifest.synthetic, true);
  for (const name of ['published.html', 'preview.html', 'review.html']) {
    const html = read(`../public/get-agent-ready/examples/${name}`);
    assert.equal(createHash('sha256').update(html).digest('hex'), manifest.files[name]);
    assert.match(html, /fictional business/);
    assert.match(html, /noindex,nofollow/);
    assert.doesNotMatch(html, /<script\b|<form\b|<a\b|application\/ld\+json|rel="canonical"|buy\.stripe\.com|[?&]token=/);
  }
  const headers = read('../public/_headers');
  assert.match(headers, /\/get-agent-ready\/examples\/\*\n  X-Robots-Tag: noindex, nofollow/);
});

test('Premium describes work delivered, not a promised citation', () => {
  assert.doesNotMatch(section('tiers'), /gets you cited/);
  assert.match(section('tiers'), /a deeper assessment and a practical roadmap/);
});
