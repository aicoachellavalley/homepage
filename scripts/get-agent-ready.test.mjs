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
const commerceRoadmap = vm.runInNewContext(page.match(/const commerceRoadmap = ("[^\n]+?");/)[1]);
const faq = vm.runInNewContext(`(${faqSource})`, { commerceRoadmap });

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
  assert.match(hero, /Minimum Viable Agent \(MVA\)/);
  assert.match(hero, /profile/);
  assert.doesNotMatch(hero, /Cloudflare|Stripe|Muse|<script|<iframe/);
  assert.equal(section('outcomes'), undefined);
});

test('pricing choices continue to use the shared ladder', () => {
  const cards = section('tiers');
  assert.equal([...cards.matchAll(/class="gar-v2-tier-name"/g)].length, tiers.length);
  for (const [index, tier] of tiers.entries()) {
    assert.ok(cards.includes(`>${tier.name}</div>`));
    assert.ok(cards.includes(`{pricing.tiers[${index}].price_amount}`));
    assert.ok(cards.includes(`{pricing.tiers[${index}].blurb}`));
    assert.ok(tier.blurb.split(/\s+/).length <= 24, `${tier.name} card should stay brief`);
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

test('purchase matching note sits below all four cards and remains associated with checkout', () => {
  const offer = section('tiers');
  const note = offer.indexOf('<p class="purchase-match-note"');
  assert.ok(note > offer.indexOf('id="agentReadyPurchase"'));
  assert.ok(note > offer.indexOf("document.getElementById('inc-premium')"));
  assert.ok(note < offer.indexOf('class="gar-v2-tier-note"'));
  assert.equal((offer.match(/id="purchase-match-note"/g) || []).length, 1);
  assert.match(offer, /id="agentReadyPurchase"[^>]+aria-describedby="purchase-match-note"/);
  assert.match(offer, /Buying the \$500 MVA\?/);
  assert.match(offer, /Without a confirmed match, our team must match your purchase/);
  assert.match(offer, /before your MVA and private review are released/);
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

test('agent purchases depend on compatible systems and customer approval, not membership', () => {
  const answer = faq.find(item => item.q === 'Can customers book and pay through AI?').a;
  assert.match(answer, /where their assistant works with your booking or checkout system/);
  assert.match(answer, /doesn't manage availability, confirm appointments or take payments itself/);
  assert.match(answer, /Purchases still need the customer's approval/);
  assert.match(answer, /don't need AICV membership/);
  assert.match(answer, /Muse testing is planned, not yet completed/);
});

test('booking roadmap is shared with both membership panels, not sold as an included feature', () => {
  assert.equal(faq.find(item => item.q === "What's next for Business and Premium?").a, commerceRoadmap);
  assert.match(commerceRoadmap, /planned next step for Business and Premium, not included today/);
  assert.match(commerceRoadmap, /test what works with your existing systems/);
  assert.match(commerceRoadmap, /agree the work and cost with you before offering it/);
  assert.match(commerceRoadmap, /Premium has priority for integration planning/);
  for (const tier of ['business', 'premium']) {
    const panel = body.split(`id="inc-${tier}"`)[1].split('<div class="tos-overlay"')[0];
    assert.match(panel, /Looking ahead: let customers book and buy through AI/);
    assert.match(panel, /<p>\{commerceRoadmap\}<\/p>/);
  }
  assert.doesNotMatch(section('tiers'), /commerceRoadmap/);
  assert.doesNotMatch(page, /"description": commerceRoadmap/);
});

test('payment matching and purchase terms remain explicit', () => {
  assert.match(body, /[Oo]nce your purchase is matched to your business/);
  assert.match(body, /We match your purchase to your business, then your page publishes/);
  assert.match(body, /href="\/terms\/#agent-ready"/);
  assert.match(body, /href="\/terms\/#agent-access"/);
});

test('sales benefits promise publication, not outside indexing or first-read priority', () => {
  const visible = body.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ');
  assert.match(page, /const readyDescription = '[^']*public, agent-readable business profile on the AICV network[^']*We confirm which business your purchase is for before publishing/);
  assert.match(visible, /We match your purchase to your business, then your page publishes/);
  assert.match(visible, /Each AI service decides what it reads, cites or recommends/);
  assert.doesNotMatch(visible, /indexed, agent-readable|index agents read first|list it reads before anything else/);
});

test('three visual example cards use inert miniature pages and one full-page link each', () => {
  const example = body.slice(body.indexOf('<div class="gar-example"'), body.indexOf('<!-- CONDENSED PERSUASION'));
  assert.match(example, /role="region" aria-labelledby="profile-example-title"/);
  assert.match(example, /<h2 id="profile-example-title">/);
  assert.match(example, /See what \{pricing\.tiers\[1\]\.price_amount\} builds/);
  assert.match(example, /fictional Sample Bistro details/);
  assert.match(example, /not a customer or a live booking/);
  assert.match(example, /existing booking or ordering page/);
  assert.match(example, /your current systems handle the appointment or sale/);
  assert.match(example, /Your website stays as it is/);
  assert.doesNotMatch(example, /purchase-to-business matching|not a chatbot|does not fix/);
  assert.doesNotMatch(example, /<script|<form|<details|<summary|application\/ld\+json|buy\.stripe\.com/);
  const cards = [...example.matchAll(/<article class="gar-example-card">([\s\S]*?)<\/article>/g)];
  assert.equal(cards.length, 3);
  for (const [index, name] of ['published', 'preview', 'review'].entries()) {
    const card = cards[index][1];
    assert.doesNotMatch(card, /<p\b|<ul\b|<li\b/);
    assert.equal([...card.matchAll(/<iframe\b/g)].length, 1);
    assert.match(card, /class="gar-example-miniature" aria-hidden="true" inert/);
    assert.ok(card.includes(`src="/get-agent-ready/examples/${name}.html"`));
    assert.match(card, /loading="lazy" sandbox="" tabindex="-1" scrolling="no"/);
    assert.equal([...card.matchAll(/<a\b/g)].length, 1);
    assert.ok(card.includes(`href="/get-agent-ready/examples/${name}.html"`));
    assert.match(card, /target="_blank" rel="noopener" aria-label="[^"]+\(new tab\)"/);
    assert.match(card, />Open the full page ↗<\/a>/);
  }
  assert.ok(example.indexOf('examples/published.html') < example.indexOf('examples/preview.html'));
  assert.match(example, /href="\/agent-preview"/);
  assert.match(example, /not customer testimonials/);
  assert.match(example, /The MVA before activation/);
  assert.match(faq.find(item => item.q.includes('example of the Agentic Review')).a, /Each card links to the full page/);
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
  assert.doesNotMatch(section('tiers') + JSON.stringify(tiers), /gets you cited/);
  assert.match(tiers[3].blurb, /deeper AI-readiness review/);
  assert.match(tiers[3].blurb, /12-month action plan/);
});

test('human offer details and agent Service descriptions share the same copy', () => {
  for (const key of ['previewDescription', 'readyDescription', 'businessDescription', 'premiumDescription']) {
    assert.ok(page.includes(`"description": ${key}`));
    assert.ok(body.includes(`<p>{${key}}</p>`));
  }
  assert.match(page, /"description": pageDescription/);
  assert.doesNotMatch(page, /LLM-favored|discoverable and citable from day one|nothing for you to do/);
  assert.match(tiers[1].llms, /publication follows purchase-to-business matching/);
  assert.match(tiers[1].llms, /private agent-readiness review/);
  assert.match(tiers[1].llms, /no annual fee/);
  assert.match(tiers[2].llms, /configuration changes separately scoped/);
});

test('activation explanation does not sell a separate page or a transactional chatbot', () => {
  const answer = faq.find(item => item.q === 'What changes when I activate a preview?').a;
  assert.match(answer, /same business page/);
  assert.match(answer, /Some previews are already public and readable by agents/);
  assert.match(answer, /follow your contact or booking links/);
  assert.match(answer, /Your website stays as it is/);
  assert.match(body, /\$500 purchase does not include owner verification/);
});
