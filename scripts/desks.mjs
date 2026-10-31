// Shared by the desk page, llms.txt, the sitemap and build-desks.mjs, so every
// surface reports the same counts. Dates derive from the records, never the
// build clock: a rebuild with no new observation must not look like a refresh.
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const AICV = /(^|\.)(aicoachellavalley\.com|aicoachellavalley\.org|aicv\.co|aicv\.news)$/;
const INTERNAL = /^ai_|outreach/;

export function hostname(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

export function deskProblems(entries) {
  const problems = [];
  const ids = new Set();
  for (const e of entries) {
    const at = e.id || e.name;
    if (ids.has(e.id)) problems.push(`${at}: duplicate id`);
    ids.add(e.id);
    if (!['observed', 'submitted', 'verified'].includes(e.label)) problems.push(`${at}: unknown label`);
    if (!ISO.test(e.observed_date || '')) problems.push(`${at}: no observation date`);
    if (e.label === 'verified' && !e.verification?.method) problems.push(`${at}: verified with no ownership check`);
    const { url, phone } = e.official_contact || {};
    if (!url && !phone) problems.push(`${at}: no official contact`);
    if (url && AICV.test(hostname(url))) problems.push(`${at}: AICV page used as the official contact`);
    if (!e.source?.url) problems.push(`${at}: no source`);
    if (e.site_check && !ISO.test(e.site_check.date || '')) problems.push(`${at}: undated site check`);
    for (const key of Object.keys(e)) if (INTERNAL.test(key)) problems.push(`${at}: internal field ${key} in public data`);
  }
  return problems;
}

/* What the desks service reports since the last deploy. The committed file is the
 * fallback when it cannot be read, so a build never fails on it or invents a check.
 *
 * ONE BUSINESS, ONE ID. A preview slug, a desk record and an enrollment all resolve
 * to one entry. Unconfirmed information never overwrites a sourced field: it sits in
 * submitted_information until the DNS check clears, and only then is it the record. */
const SUBMITTED = 'Submitted information, identity unconfirmed';
const previewSlug = e => /\/agent-preview\/[^/]+\/([^/?#]+)/.exec(e.source?.url || '')?.[1];

export function applyOverlay(slug, entries, overlay = {}) {
  const obs = overlay.observations || {};
  const claims = overlay.claims || {};
  const submissions = overlay.submissions || {};
  const known = new Set(entries.map(e => e.id));
  const merged = entries.map(e => {
    const out = { ...e };
    const o = obs[e.id];
    if (o) {
      out.site_check = { date: o.date, result: o.result, changed_since_last_check: Boolean(o.changed) };
      if (o.closed_signal) out.note = 'The official page may say this business has closed. Confirm directly.';
    }
    const submission = submissions[e.id];
    if (submission) out.submitted_information = { label: SUBMITTED, date: submission.date, fields: submission.fields };
    const claim = claims[previewSlug(e)] || claims[e.id];
    if (claim) {
      const f = claim.owner_facts || {};
      const fields = Object.fromEntries(Object.entries({ about: f.description, address: f.address, hours: f.hours, phone: f.phone, booking: f.booking_url || f.booking }).filter(([, v]) => v));
      if (claim.attested_date) {
        out.label = 'verified';
        out.label_text = 'Verified by the business';
        out.verification = { method: 'dns', date: claim.attested_date };
        out.observed_date = claim.attested_date;
        if (fields.about) out.description = fields.about;
        if (fields.address) out.address = fields.address;
        if (fields.booking) out.official_contact = { ...out.official_contact, url: fields.booking };
        if (fields.phone) out.official_contact = { ...out.official_contact, phone: fields.phone };
        if (fields.hours) out.facts = [`Hours: ${fields.hours}`, ...out.facts];
        delete out.submitted_information;
      } else if (Object.keys(fields).length) {
        out.submitted_information = { label: SUBMITTED, date: String(claim.published_at || e.observed_date).slice(0, 10), fields };
      }
    }
    return out;
  });
  const enrolled = (overlay.supplied || [])
    .filter(a => a.desk === slug && !known.has(a.record_id))
    .map(a => {
      const submitted = submissions[`enrolled-${a.id}`];
      return {
        id: `enrolled-${a.id}`, name: a.name, city: a.city, address: null, category: 'enrolled', anchor: false,
        label: 'submitted', label_text: SUBMITTED, observed_date: String(a.created_at).slice(0, 10),
        official_contact: { url: a.official_url, phone: null },
        source: { url: 'https://aicoachellavalley.com/desks/join/', name: 'Submitted through AICV self-service enrollment. AICV confirmed its own website names this business and city' },
        description: null, facts: [], site_check: null,
        ...(a.phone || submitted ? { submitted_information: { label: SUBMITTED, date: (submitted?.date || String(a.created_at).slice(0, 10)), fields: { ...(a.phone ? { phone: a.phone } : {}), ...(submitted?.fields || {}) } } } : {}),
      };
    });
  return [...merged, ...enrolled];
}

// Preview builds talk to the preview service; production uses its own origin.
export const previewBranch = () => { const b = process.env.CF_PAGES_BRANCH; return Boolean(b && b !== 'main'); };
const PROD_ORIGIN = 'https://aicoachellavalley.com';
const PREVIEW_ORIGIN = 'https://three-desks-2026-10.aicoachellavalley-homepage.pages.dev';
export const siteOrigin = () => previewBranch() ? (process.env.PREVIEW_SITE_ORIGIN || PREVIEW_ORIGIN) : PROD_ORIGIN;
/* Agent Preview pages are served only by production and carry a live buy button, so a
 * preview names them as a source but never links out to them. */
export const sourceHref = url => {
  if (!previewBranch()) return url;
  if (/\/agent-preview\//.test(url || '')) return null;
  return String(url || '').replace(PROD_ORIGIN, siteOrigin());
};
export const desksApiBase = () => previewBranch() ? (process.env.PREVIEW_DESKS_API || 'https://aicv-desks-preview.sunshinefm.workers.dev') : '';
// Cloudflare's published always-pass test key, only ever on a preview branch.
export const turnstileSiteKey = meta => previewBranch() ? '1x00000000000000000000AA' : (meta.turnstile_site_key || '');

export function assembleDesk(meta, slug, entries) {
  const desk = meta.desks.find(d => d.slug === slug);
  if (!desk) throw new Error(`Unknown desk ${slug}`);
  const count = label => entries.filter(e => e.label === label).length;
  const withLinks = entries.map(e => {
    const slug = previewSlug(e);
    return { ...e, profile_url: `${siteOrigin()}/desks/${desk.slug}/${e.id}/`, purchase_ref: slug || e.id, has_measured_review: Boolean(slug) };
  });
  const dates = entries.flatMap(e => [e.observed_date, e.site_check?.date]).filter(Boolean).sort();
  return {
    schema_version: 1,
    desk: {
      slug: desk.slug, title: desk.title, scope: desk.scope,
      url: `${siteOrigin()}/desks/${desk.slug}/`,
      categories: [...desk.categories, { id: 'enrolled', title: 'Enrolled businesses' }], topics: desk.topics,
    },
    coverage: meta.coverage,
    labels: meta.labels,
    not_provided: meta.not_provided,
    other_desks: meta.other_desks,
    handling: 'Contact each business through its official_contact. AICV never takes bookings or payments.',
    counts: { records: entries.length, observed: count('observed'), submitted: count('submitted'), verified: count('verified') },
    oldest_observation: dates[0] || null,
    latest_observation: dates.at(-1) || null,
    entries: withLinks,
  };
}

export function formatDate(iso) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
