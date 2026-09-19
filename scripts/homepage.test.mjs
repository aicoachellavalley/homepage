import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
const section = page.match(/<section class="agent-use-wrap"[\s\S]*?<\/section>/)?.[0];

test('homepage connects three human decisions to local businesses in visible HTML', () => {
  assert.ok(section);
  assert.match(section, /aria-labelledby="agent-use-title"/);
  assert.match(section, /id="agent-use-title"/);
  for (const title of ['Plan a visit or retreat', 'Find a place to call home', 'Build a business here']) {
    assert.ok(section.includes(`<h3>${title}</h3>`));
  }
  assert.equal([...section.matchAll(/class="agent-use-scenario"/g)].length, 3);
  assert.equal([...section.matchAll(/class="agent-use-relevance"/g)].length, 3);
  assert.doesNotMatch(section, /<script|<details|<iframe|\shidden(?:\s|=|>)|role="tab/);
});

test('illustrative questions are not presented as customer testimonials or guaranteed leads', () => {
  assert.match(section, /For example, someone might ask their assistant/);
  assert.equal([...section.matchAll(/class="agent-use-question"/g)].length, 3);
  assert.doesNotMatch(section, /<em>|guarantee|will recommend|will cite/);
});

test('human reading path leads to the service explanation, not a payment action', () => {
  assert.ok(page.indexOf('id="what-agents-use"') < page.indexOf('<!-- ─── LATEST BRIEFS'));
  assert.match(section, /href="\/get-agent-ready\/"/);
  assert.match(section, /Explore Get Agent Ready/);
  assert.match(section, /start with the free check/);
  assert.doesNotMatch(section, /buy\.stripe\.com|<form|onclick=/);
});
