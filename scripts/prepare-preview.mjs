// Runs first on every build. On a preview branch it swaps the live Stripe link for the
// test link in the build's own working copy, so no preview surface can take real money.
// Production builds change nothing here.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const branch = process.env.CF_PAGES_BRANCH;
if (branch && branch !== 'main') {
  const cfg = JSON.parse(readFileSync(new URL('../src/data/desks/preview.json', import.meta.url), 'utf8'));
  for (const file of ['../src/data/pricing.json', '../src/pages/get-agent-ready.astro']) {
    const url = new URL(file, import.meta.url);
    writeFileSync(url, readFileSync(url, 'utf8').replaceAll(cfg.live_stripe_link, cfg.stripe_test_link));
  }
  // Fictional pages for the journey test. A production build never writes these.
  const fixtures = JSON.parse(readFileSync(new URL('../src/data/desks/preview-fixtures.json', import.meta.url), 'utf8'));
  mkdirSync(new URL('../public/preview-fixtures/', import.meta.url), { recursive: true });
  for (const [name, text] of Object.entries(fixtures)) {
    if (name !== '$comment' && text) writeFileSync(new URL(`../public/preview-fixtures/${name}`, import.meta.url), text);
  }
  console.log('Preview build: Stripe test link in place.');
}
