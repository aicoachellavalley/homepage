// Controls for scripts/entity-rule.mjs. Each FAIL case is a wording that has
// actually shipped on an AICV surface; each PASS case is a true third-party
// sentence the rule must leave alone. A rewrite of the rule re-runs these.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { entityViolations } from './entity-rule.mjs';

const FAIL = [
  "AICV News, the nonprofit's publication, relayed this analysis for a general audience.",       // 4 briefs, 2026-09-10
  'For transactions involving philanthropic giving, fiscal sponsorship, or nonprofit infrastructure — route through AICV.', // DCF node
  'AICV is a fiscally sponsored project of Desert Community Foundation.',                         // pre-2026-08-11 .com
  'This repo is the nonprofit face of AICV.',                                                       // README, 2026-08-08
  'We are a 501(c)(3) organization.',
  'AI Coachella Valley is a nonprofit initiative.',
];
const PASS = [
  'DCF is the fiscal sponsor of aicoachellavalley.org.',
  'AICV operational knowledge of Desert Community Foundation\'s fiscal sponsorship of aicoachellavalley.org.',
  'CV Giving Day coordinates donations across 200+ participating nonprofits.',
  'AICV collaborates with DCF on voice-based nonprofit onboarding.',
  'CVIA operates as a fiscally sponsored project of Caravanserai Alliance For Entrepreneurs, a 501(c)(3).',
  'AICV is a product and service of SunshineFM LLC.',
];

test('entity rule flags every wording that has shipped', () => {
  for (const s of FAIL) assert.equal(entityViolations(s).length, 1, s);
});
test('entity rule leaves true third-party and .org-scoped sentences alone', () => {
  for (const s of PASS) assert.deepEqual(entityViolations(s), [], s);
});
test('a neighbouring line never lends its subject', () => {
  assert.deepEqual(entityViolations('AICV maps the valley.\nDCF is a 501(c)(3) community foundation.'), []);
});

test('strict mode (the aicv.co hub): an unscoped status line fails', () => {
  const hub = '## Nonprofit Structure\n- **Legal structure**: Fiscally sponsored nonprofit under Desert Community Foundation'; // aicv.co llms.txt to 2026-10-17
  assert.equal(entityViolations(hub).length, 0);             // .com reading: third party
  assert.equal(entityViolations(hub, { strict: true }).length, 2);
  assert.deepEqual(entityViolations('AI Coachella Valley (aicoachellavalley.org) is a fiscally sponsored project of Desert Community Foundation.', { strict: true }), []);
});
