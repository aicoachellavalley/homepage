import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const page = readFileSync(new URL('../src/pages/get-agent-ready.astro', import.meta.url), 'utf8');
const script = [...page.matchAll(/<script is:inline>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('const WORKER_BASE'));
const fixture = () => ({ business_name: 'Example Business', domain: 'business.example', reviewed_date: 'September 15, 2026', verdict: 'Visible', active_rung: 3, summary: 'Content is clear.', dimensions: {}, fixes: [], agent_access: {
  checked_url: 'https://business.example/', checked_at: '2026-09-15T18:00:00Z', state: 'observed', summary: 'Page reachable by our checker; SAT settings remain unverified.',
  http: { note: 'HTTP 200 for our checker only.' }, robots: { note: 'Robots preferences, not enforced access.', crawlers: [{ agent: 'GPTBot', purpose: 'training', policy: 'disallowed' }] },
  edge_policy: { note: 'Owner review required.' }, content_signals: [{ source: 'robots.txt', agents: ['*'], preferences: { 'ai-train': 'no' } }], next_step: 'Review with your site manager.',
} });

function harness() {
  const elements = new Map();
  let copied = '';
  const element = id => {
    if (!elements.has(id)) elements.set(id, { value: '', innerHTML: '', textContent: '', disabled: false,
      classList: { add() {}, remove() {} }, addEventListener() {}, scrollIntoView() {} });
    return elements.get(id);
  };
  const context = vm.createContext({
    URL, console, setTimeout() {}, setInterval() {}, clearInterval() {},
    document: { getElementById: element, addEventListener() {}, querySelectorAll: () => [] },
    navigator: { clipboard: { writeText: async text => { copied = text; } } },
  });
  vm.runInContext(script, context);
  return { context, element, copied: () => copied,
    render: r => { context.input = r; return vm.runInContext('renderReview(input)', context); },
    copy: (r, format) => { context.input = r; vm.runInContext(`lastResult = input; copyReport('${format}');`, context); return copied; } };
}

test('positive control: complete card includes visible SAT caveat', () => {
  const html = harness().render(fixture());
  assert.match(html, /Visible — content only/);
  assert.match(html, /Search: UNVERIFIED · Agent: UNVERIFIED · Training: UNVERIFIED/);
  assert.match(html, /GPTBot/);
});
test('sensitivity control: access-only response renders no invented content verdict', () => {
  const r = { ...fixture(), review_status: 'access-only' };
  const html = harness().render(r);
  assert.match(html, /Content not assessed/);
  assert.doesNotMatch(html, /aicv-verdict|aicv-ladder|aicv-dims/);
});
test('access data is HTML escaped', () => {
  const r = fixture();
  r.agent_access.http.note = '<img src=x onerror=alert(1)>';
  const html = harness().render(r);
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /&lt;img/);
});
test('older backend is explicitly unverified, not silently open', () => {
  const r = fixture(); delete r.agent_access;
  assert.match(harness().render(r), /not returned by this diagnostic version/);
});
for (const format of ['md', 'text', 'json']) {
  test(`${format} export retains access observations and unverified SAT`, () => {
    const output = harness().copy(fixture(), format);
    assert.match(output, /unverified|UNVERIFIED/);
    assert.match(output, /ai-train/);
    assert.match(output, /content only/);
    if (format === 'json') assert.deepEqual(JSON.parse(output).agent_access, fixture().agent_access);
  });
  test(`${format} export supports access-only result`, () => {
    const r = { ...fixture(), review_status: 'access-only' }; delete r.verdict; delete r.dimensions;
    const output = harness().copy(r, format);
    assert.match(output, /not assessed|NOT ASSESSED/);
    assert.doesNotMatch(output, /undefined/);
  });
}
test('form submits and displays complete result', async () => {
  const h = harness(); h.element('urlInput').value = 'business.example';
  h.context.fetch = async (url, options) => {
    assert.equal(url, 'https://aicv-api.sunshinefm.workers.dev/analyze');
    assert.equal(JSON.parse(options.body).url, 'https://business.example/');
    return { ok: true, json: async () => fixture() };
  };
  await vm.runInContext('runAnalysis()', h.context);
  assert.match(h.element('reviewCard').innerHTML, /Agent Access/);
  assert.equal(h.element('analyzeBtn').disabled, false);
});
test('form submits and displays access-only result', async () => {
  const h = harness(); h.element('urlInput').value = 'business.example';
  h.context.fetch = async () => ({ ok: true, json: async () => ({ ...fixture(), review_status: 'access-only' }) });
  await vm.runInContext('runAnalysis()', h.context);
  assert.match(h.element('reviewCard').innerHTML, /Content not assessed/);
  assert.equal(h.element('aioErr').textContent, '');
});
test('network error still re-enables form', async () => {
  const h = harness(); h.element('urlInput').value = 'business.example';
  h.context.fetch = async () => { throw new Error('offline'); };
  await vm.runInContext('runAnalysis()', h.context);
  assert.equal(h.element('analyzeBtn').disabled, false);
  assert.equal(h.element('aioErr').textContent, 'offline');
});
test('merchant scope stays explicit and free tool no longer advertises a score', () => {
  assert.match(page, /owner-assisted SAT review/);
  assert.match(page, /\$500 Agent Ready profile purchase does not include a Cloudflare account audit/);
  assert.doesNotMatch(page.match(/tooldescription="[^"]*"/)[0], /returns an agent-readiness score/);
  assert.match(page, /id="agent-access"/);
});
