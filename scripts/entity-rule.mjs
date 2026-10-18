/**
 * entity-rule.mjs — the ONE statement of who AICV is, as a check over text.
 *
 * CANON (founder rulings 2026-08-07 → 2026-08-11, restated 2026-10-17):
 * aicoachellavalley.com is "a product and service of SunshineFM LLC". Fiscal
 * sponsorship by Desert Community Foundation belongs to aicoachellavalley.org
 * ONLY. Nothing on .com, and nothing on the aicv.co hub, may attach nonprofit
 * or sponsorship status to AICV, to .com, to SunshineFM, or to "us".
 *
 * WHY A NEW RULE (2026-10-17). check-pricing.mjs's zero-tolerance gate is
 * correct for what it reads — eleven SOURCE files that describe the publisher —
 * and it was clean while four briefs on this site said "AICV News, the
 * nonprofit's publication", a node routed "fiscal sponsorship" transactions
 * "through AICV", and aicv.co's hub llms.txt carried a "Nonprofit Structure"
 * section naming no property. Every miss was in a surface the list did not
 * name: brief bodies, node bodies, the generated llms-full.txt and feeds, and a
 * different repository. The scope was hardcoded (OPERATING-RULES §7.6).
 *
 * THIS RULE IS SCOPED BY THE TEXT, NOT BY A FILE LIST. The runner hands it
 * everything that ships. A sentence fails when it carries a sponsorship or
 * nonprofit-STATUS term AND names AICV, .com, SunshineFM or the first person,
 * AND does not name aicoachellavalley.org. That last clause is what lets the
 * true third-party facts through ("DCF is the fiscal sponsor of
 * aicoachellavalley.org") without a whitelist of sentences.
 *
 * Third-party usage that is not about AICV — "200+ nonprofits", "nonprofit
 * onboarding" — never reaches the subject test, because STATUS matches only
 * the singular status noun and its entity forms (see STATUS below), measured
 * against the full build at adoption.
 *
 * MENTION IS NOT USE. A correction notice that quotes removed wording is the
 * record of a fix, not a claim; runners strip notice text before checking.
 */

/* Status terms. "nonprofit" is matched only as a status (a/an/the/our
 * nonprofit, the nonprofit's, nonprofit initiative/organization/project/...)
 * — not as a modifier of someone else's activity. Fiscal sponsorship, 501(c)
 * and NGO are status in every form. */
export const STATUS = new RegExp([
  String.raw`fiscal(?:ly)?[\s-]+sponsor\w*`,
  String.raw`\b501\s*\(\s*c\s*\)`,
  String.raw`\bNGO\b`,
  String.raw`\b(?:a|an|the|our|its)\s+non-?profit\b`,
  String.raw`\bnon-?profit(?:'s|’s)`,
  String.raw`\bnon-?profit\s+(?:initiative|organi[sz]ation|project|entity|arm|face|side|status|corporation|structure|site|surface|program|programme|org)\b`,
].join('|'), 'i');

/* Who the sentence is about. */
export const SUBJECT = /\bAICV\b|\bAI Coachella Valley\b|aicoachellavalley\.com|\bSunshineFM\b|\bsunshine\.fm\b|\bthis site\b|\b(?:we|our|us)\b/i;

/* The one property sponsorship may describe. */
export const ORG_SCOPE = /aicoachellavalley\.org|\bthe \.org\b/i;

/** Split text into sentence-sized units. Lines are units too, so a list item
 *  or a JSON value never borrows the subject of its neighbour. */
export function sentences(text) {
  return text.split(/\n+|(?<=[.!?])\s+(?=[A-Z0-9"“(])/).map((s) => s.trim()).filter(Boolean);
}

/** Sentences in `text` that attach sponsorship/nonprofit status to AICV.
 *  `strict` is for a surface whose whole subject is AICV (the aicv.co hub):
 *  there a status sentence that names no one is about the hub, so it must
 *  name aicoachellavalley.org to pass. On .com, which reports on many other
 *  organizations, a subject-less status sentence is about a third party. */
export function entityViolations(text, { strict = false } = {}) {
  return sentences(text).filter((s) => STATUS.test(s) && (strict || SUBJECT.test(s)) && !ORG_SCOPE.test(s));
}

/** Remove quoted notice text (corrections, supersessions) before checking. */
export function stripMentions(text, mentions) {
  let out = text;
  for (const m of mentions) if (m) out = out.split(m).join(' ');
  return out;
}
