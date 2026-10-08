/** LOCAL/MOCK ONLY. No network, merchant keys, card data or real booking authority.
 * A future server adapter must replace every simulation, persist atomic inventory,
 * authenticate operator/buyer, and verify provider events with its official SDK.
 * Public browser use is an educational simulation, never a payment backend.
 */
export const PILOT = Object.freeze({
  mode: 'local-mock-only', entity_id: 'workspace/the-hive-coworking',
  public_capability: 'official-handoff', transaction_capability: 'mock-only',
  source_checked_at: '2026-10-07',
  public_offer: { description: 'The Hive drop-in shared desk, one day', base_cents: 3000, currency: 'USD',
    total_cents: null, availability: 'unknown', terms: 'unknown',
    source: 'https://www.thehivecoworking.com/memberships' },
  official_url: 'https://www.thehivecoworking.com/memberships',
});
const MOCK_KEY = 'public-fake-demo-key-not-a-credential';
const copy = value => structuredClone(value);
function fail(code) { throw new Error(code); }
function pacificDate(timestamp) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(timestamp));
  const part = type => parts.find(p => p.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
function hex(bytes) { return Array.from(new Uint8Array(bytes), n => n.toString(16).padStart(2, '0')).join(''); }
async function hmac(raw) {
  const key = await globalThis.crypto.subtle.importKey('raw', new TextEncoder().encode(MOCK_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  return hex(await globalThis.crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw)));
}

/** Adapter boundary: availability → exact quote → explicit approval → hold/payment
 * → verified event + authoritative operator status → reconcile/cancel/refund.
 * Synchronous mutations before any await make retries atomic only within ONE
 * in-memory instance. Restart, multi-process durability and real APIs unvalidated.
 */
export function createMockTransactionAdapter({ now = () => Date.now(), capacity = 1,
  availabilityKnown = true, totalKnown = true, accessKnown = true,
  cancellationSupported = true } = {}) {
  const offers = new Map(), approvals = new Map(), bookings = new Map(), sessions = new Map();
  const retries = new Map(), seenEvents = new Map();
  let counter = 0, eventCounter = 0;
  const id = prefix => `mock_${prefix}_${++counter}`;
  const slotUsed = date => [...bookings.values()].filter(b => b.offer.request.date === date && ['held', 'confirmed'].includes(b.inventory)).length;
  const getBooking = bookingId => bookings.get(bookingId) || fail('unknown-booking');
  function expire() {
    for (const b of bookings.values()) if (b.inventory === 'held' && now() >= b.hold_expires_at) {
      b.inventory = 'expired'; b.operator_status = 'expired';
    }
  }
  function validateRequest(request) {
    const supported = ['date', 'people', 'workspace_type', 'start', 'end', 'timezone', 'private', 'accessibility_required', 'budget_cents'];
    if (!request || Object.keys(request).some(k => !supported.includes(k))) fail('unsupported-requirement');
    const d = new Date(`${request.date}T12:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(request.date || '') || !Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== request.date) fail('invalid-date');
    if ([0, 6].includes(d.getUTCDay())) fail('outside-mock-hours');
    if (request.date <= pacificDate(now())) fail('date-not-future');
    if (request.people !== 1 || request.workspace_type !== 'shared-desk' || request.private !== false) fail('unsupported-working-setup');
    if (request.start !== '09:00' || request.end !== '17:00' || request.timezone !== 'America/Los_Angeles') fail('unsupported-duration');
    if (request.accessibility_required !== false) fail('accessibility-unverified');
    if (request.budget_cents != null && (!Number.isSafeInteger(request.budget_cents) || request.budget_cents < 0)) fail('invalid-budget');
  }
  function reconcile(bookingId) {
    expire();
    const b = getBooking(bookingId), p = sessions.get(b.session_id);
    let status;
    if (b.inventory === 'cancelled') status = p.status === 'refunded' ? 'cancelled-refunded' : 'cancelled';
    else if (p.status === 'paid' && b.verified_payment && b.inventory === 'held' && b.operator_status === 'confirmed') {
      b.inventory = 'confirmed'; status = 'confirmed-mock';
    } else if (b.inventory === 'confirmed') status = 'confirmed-mock';
    else if (p.status === 'paid' && ['expired', 'released'].includes(b.inventory)) status = 'manual-review-refund-required';
    else if (b.inventory === 'expired') status = 'expired';
    else if (b.inventory === 'released') status = p.status === 'failed' ? 'payment-failed' : 'operator-conflict';
    else status = b.verified_payment && p.status === 'paid' ? 'paid-awaiting-operator' : 'awaiting-verified-payment';
    return copy({ mode: PILOT.mode, booking_id: b.id, status, payment_status: p.status,
      verified_payment: b.verified_payment, operator_status: b.operator_status,
      confirmation: status === 'confirmed-mock' ? `MOCK-ONLY-${b.id}` : null,
      inventory: b.inventory, hold_expires_at: b.hold_expires_at,
      offer: b.offer, refund: b.refund || null });
  }
  return {
    mode: PILOT.mode,
    lookupAvailability(request) {
      validateRequest(request); expire();
      return { mode: PILOT.mode, request: copy(request), availability: availabilityKnown ? (slotUsed(request.date) < capacity ? 'available-mock' : 'unavailable-mock') : 'unknown',
        access: accessKnown ? 'synthetic-public-access' : 'unknown', capacity: availabilityKnown ? capacity : null };
    },
    getOffer(request) {
      const a = this.lookupAvailability(request);
      if (a.availability === 'unknown' || a.access === 'unknown' || !totalKnown) fail('unresolved-offer');
      if (a.availability !== 'available-mock') fail('booking-conflict');
      if (request.budget_cents != null && request.budget_cents < 3300) fail('over-budget');
      const offer = { mode: PILOT.mode, id: id('offer'), entity_id: PILOT.entity_id,
        description: 'FICTIONAL shared-desk day pass; no real entitlement', request: copy(request),
        currency: 'USD', base_cents: 3000, tax_cents: 300, fee_cents: 0, total_cents: 3300,
        pricing_classification: 'synthetic-complete-quote', tax_note: 'Invented fixture amount, not a tax calculation or operator tax claim',
        terms_version: 'mock-terms-v1', terms: 'FICTIONAL: cancel before the Pacific visit date begins (midnight) for a full mock refund; one person, shared desk, weekday 09:00–17:00 Pacific. No operator policy is established.',
        expires_at: now() + 300000 };
      offers.set(offer.id, copy(offer)); return offer;
    },
    approveOffer(offerId, { explicit_approval, total_cents, currency, terms_version } = {}) {
      const o = offers.get(offerId) || fail('unknown-offer');
      if (now() >= o.expires_at) fail('offer-expired');
      if (explicit_approval !== true || total_cents !== o.total_cents || currency !== o.currency || terms_version !== o.terms_version) fail('exact-approval-required');
      const approval = { id: id('approval'), offer_id: offerId, offer_snapshot: JSON.stringify(o), approved_at: now() };
      approvals.set(approval.id, approval); return copy(approval);
    },
    executePayment(offerId, approvalId, idempotencyKey) {
      if (typeof idempotencyKey !== 'string' || !idempotencyKey.trim() || idempotencyKey.length > 100) fail('idempotency-key-required');
      const fingerprint = JSON.stringify([offerId, approvalId]);
      const retry = retries.get(idempotencyKey);
      if (retry) { if (retry.fingerprint !== fingerprint) fail('idempotency-key-reused'); return reconcile(retry.booking_id); }
      const o = offers.get(offerId) || fail('unknown-offer'), approval = approvals.get(approvalId) || fail('approval-required');
      if (approval.offer_id !== offerId || approval.offer_snapshot !== JSON.stringify(o)) fail('approval-mismatch');
      if ([...bookings.values()].some(b => b.offer.id === offerId)) fail('offer-already-executed');
      if (now() >= o.expires_at) fail('offer-expired');
      expire(); if (slotUsed(o.request.date) >= capacity) fail('booking-conflict');
      const bookingId = id('booking'), sessionId = id('session');
      sessions.set(sessionId, { id: sessionId, booking_id: bookingId, status: 'pending', version: 0, total_cents: o.total_cents, currency: o.currency });
      bookings.set(bookingId, { id: bookingId, session_id: sessionId, offer: copy(o), inventory: 'held', operator_status: 'held', verified_payment: false, hold_expires_at: now() + 600000 });
      retries.set(idempotencyKey, { fingerprint, booking_id: bookingId });
      return reconcile(bookingId);
    },
    // Reaching a success screen is deliberately a pure read.
    browserSuccess(bookingId) { return reconcile(bookingId); },
    async makeSyntheticEvent(bookingId, outcome = 'paid') {
      if (!['pending', 'paid', 'failed'].includes(outcome)) fail('unsupported-event');
      const b = getBooking(bookingId), p = sessions.get(b.session_id);
      // Represents an authoritative mock processor read. Paid/refunded states do
      // not regress when older failure/pending notifications arrive later.
      if (!['paid', 'refunded'].includes(p.status)) { p.status = outcome; p.version++; }
      const event = { mode: PILOT.mode, id: `mock_event_${++eventCounter}`, session_id: p.id, booking_id: b.id,
        outcome, version: p.version, total_cents: p.total_cents, currency: p.currency, created_at: now() };
      const raw = JSON.stringify(event); return { raw, signature: await hmac(raw) };
    },
    async verifyEvent({ raw, signature } = {}) {
      if (typeof raw !== 'string' || typeof signature !== 'string' || signature.length !== 64) fail('invalid-signature');
      // Public fake HMAC verifies synthetic integrity only. This is not Stripe
      // signature verification, buyer authentication or real security.
      const expected = await hmac(raw); let difference = 0;
      for (let i = 0; i < expected.length; i++) difference |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
      if (difference) fail('invalid-signature');
      let e; try { e = JSON.parse(raw); } catch { fail('invalid-event'); }
      if (e.mode !== PILOT.mode || !e.id || !['pending', 'paid', 'failed'].includes(e.outcome) || !Number.isFinite(e.created_at) || Math.abs(now() - e.created_at) > 300000) fail('invalid-event');
      const b = getBooking(e.booking_id), p = sessions.get(b.session_id);
      if (e.session_id !== p.id || e.total_cents !== p.total_cents || e.currency !== p.currency) fail('event-context-mismatch');
      if (seenEvents.has(e.id)) {
        if (seenEvents.get(e.id) !== raw) fail('event-id-reused');
        return reconcile(b.id);
      }
      seenEvents.set(e.id, raw);
      // Read the authoritative mock processor, never trust event arrival order.
      if (p.status === 'paid') b.verified_payment = true;
      if (p.status === 'failed' && b.inventory === 'held') { b.inventory = 'released'; b.operator_status = 'released'; }
      return reconcile(b.id);
    },
    setMockOperatorStatus(bookingId, status) {
      expire(); const b = getBooking(bookingId);
      if (!['confirmed', 'conflict'].includes(status)) fail('unsupported-operator-status');
      if (b.inventory !== 'held') fail('hold-not-active');
      b.operator_status = status;
      if (status === 'conflict') b.inventory = 'released';
      return reconcile(bookingId);
    },
    reconcileBooking: reconcile,
    expireHolds() { expire(); return { mode: PILOT.mode, released: [...bookings.values()].filter(b => b.inventory === 'expired').length }; },
    cancelBooking(bookingId, { explicit_approval, idempotency_key } = {}) {
      const b = getBooking(bookingId), p = sessions.get(b.session_id);
      if (!cancellationSupported) fail('cancellation-refund-unsupported');
      if (explicit_approval !== true || !idempotency_key) fail('cancellation-approval-required');
      const fingerprint = JSON.stringify(['cancel', bookingId]), retry = retries.get(idempotency_key);
      if (retry && retry.fingerprint !== fingerprint) fail('idempotency-key-reused');
      if (retry) return reconcile(bookingId);
      if (pacificDate(now()) >= b.offer.request.date) fail('mock-cancellation-window-closed');
      if (p.status === 'pending') fail('payment-pending-requires-reconciliation');
      b.inventory = 'cancelled'; b.operator_status = 'cancelled';
      if (p.status === 'paid') { p.status = 'refunded'; b.refund = { id: id('refund'), amount_cents: p.total_cents, status: 'refunded-mock' }; }
      retries.set(idempotency_key, { fingerprint, booking_id: bookingId });
      return reconcile(bookingId);
    },
    diagnostics() { return { mode: PILOT.mode, offers: offers.size, bookings: bookings.size, payment_sessions: sessions.size, verified_events: seenEvents.size,
      refunds: [...bookings.values()].filter(b => b.refund).length }; },
  };
}

export const MOCK_REQUEST = Object.freeze({ date: '2026-11-09', people: 1, workspace_type: 'shared-desk', start: '09:00', end: '17:00', timezone: 'America/Los_Angeles', private: false, accessibility_required: false });
