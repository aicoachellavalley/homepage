import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const org = JSON.parse(read('../src/data/org.json'));
const page = read('../src/pages/about.astro');
const pageDates = JSON.parse(read('../src/data/page-dates.json'));
const sitemap = read('../src/pages/sitemap.xml.ts');

/* /about/ renders identity from org.json; index.astro and get-agent-ready.astro
 * still carry the same facts as JSON-LD literals. Until those pages read the
 * file too, this is what stops the visible page and the structured data from
 * disagreeing about who AICV is. */
for (const file of ['index.astro', 'get-agent-ready.astro']) {
  test(`${file} Organization JSON-LD agrees with org.json`, () => {
    const src = read(`../src/pages/${file}`);
    assert.ok(src.includes(`"foundingDate": "${org.foundingDate}"`), 'foundingDate');
    assert.ok(src.includes(`"name": "${org.founder.name}"`), 'founder');
    assert.ok(src.includes(`"email": "${org.email}"`), 'email');
    assert.ok(src.includes(`"streetAddress": "${org.headquarters.streetAddress}"`), 'streetAddress');
    assert.ok(src.includes(`"name": "${org.owner}"`), 'owner');
  });
}

test('about page is dated and sitemapped from the single date source', () => {
  assert.match(pageDates['/about/'], /^\d{4}-\d{2}-\d{2}$/);
  assert.match(sitemap, /aicoachellavalley\.com\/about\/'.*pd\['\/about\/'\]/);
  assert.match(page, /"dateModified": pageDates\["\/about\/"\]/);
});

test('key facts are a definition list and the FAQ has one source', () => {
  assert.match(page, /<dl class="ab-facts">/);
  assert.match(page, /"mainEntity": faq\.map/);
  assert.match(page, /\{faq\.map\(\(f\) =>/);
});

test('prices come from pricing.json, never a literal', () => {
  const body = page.split('---').slice(2).join('---');
  assert.doesNotMatch(body, /\$\d/, 'no hard-coded dollar figure in the rendered template');
  assert.doesNotMatch(page.match(/const faq = \[[\s\S]*?\n\];/)[0], /\$\d/);
});

test('no unbacked or retired identity claims', () => {
  assert.doesNotMatch(page, /non-?profit|fiscal(ly)? sponsor|501\(c\)/i);
  // Rendered template + FAQ only: the frontmatter comment names these rows to say why they are absent.
  const rendered = page.split('---').slice(2).join('---') + page.match(/const faq = \[[\s\S]*?\n\];/)[0];
  assert.doesNotMatch(rendered, /Notable Clients|Customers Served|Projects Delivered|founding member/i);
  assert.doesNotMatch(page, /\bmeasured\b.*businesses_mapped|businesses_mapped.*\bmeasured\b/);
});
