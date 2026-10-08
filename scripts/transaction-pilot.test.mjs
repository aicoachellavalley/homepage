import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockTransactionAdapter, MOCK_REQUEST, PILOT } from '../src/lib/transaction-pilot.mjs';

const fixedTime = Date.parse('2026-10-07T17:00:00Z');
function fixture(config = {}) {
  let time = fixedTime;
  const adapter = createMockTransactionAdapter({ now: () => time, ...config });
  return { a: adapter, advance: n => time += n };
}
function start(a, key = 'buyer-1', request = MOCK_REQUEST) {
  const offer = a.getOffer(request);
  const approval = a.approveOffer(offer.id, { explicit_approval: true, total_cents: offer.total_cents, currency: offer.currency, terms_version: offer.terms_version });
  const booking = a.executePayment(offer.id, approval.id, key);
  return { offer, approval, booking, id: booking.booking_id };
}
async function paid(a, id) { return a.verifyEvent(await a.makeSyntheticEvent(id)); }

test('real published base price remains separate from synthetic full quote and public capability', () => {
  const { a } = fixture(), o = a.getOffer(MOCK_REQUEST);
  assert.equal(PILOT.public_offer.total_cents, null);
  assert.equal(PILOT.public_offer.availability, 'unknown');
  assert.equal(PILOT.public_capability, 'official-handoff');
  assert.equal(o.total_cents, o.base_cents + o.tax_cents + o.fee_cents);
  assert.equal(o.pricing_classification, 'synthetic-complete-quote');
  assert.match(o.tax_note, /Invented/);
});
test('preserves exact structured request and refuses unsupported scope instead of erasing it', () => {
  const { a } = fixture(); assert.deepEqual(a.getOffer(MOCK_REQUEST).request, MOCK_REQUEST);
  for (const change of [{ people: 2 }, { private: true }, { private: 'false' }, { workspace_type: 'private-office' }, { overnight_rooms: 1 }, { start: '08:00' }, { timezone: 'UTC' }]) {
    assert.throws(() => a.getOffer({ ...MOCK_REQUEST, ...change }), /unsupported/);
  }
  assert.throws(() => a.getOffer({ ...MOCK_REQUEST, accessibility_required: true }), /accessibility-unverified/);
});
test('unknown availability, complete total or access blocks execution', () => {
  for (const config of [{ availabilityKnown: false }, { totalKnown: false }, { accessKnown: false }]) {
    const { a } = fixture(config); assert.throws(() => a.getOffer(MOCK_REQUEST), /unresolved-offer/);
  }
});
test('validates date, weekday, future visit and budget against complete total', () => {
  const { a } = fixture();
  for (const date of ['2026-02-30', 'not-a-date', '2026-11-08', '2026-10-06']) assert.throws(() => a.getOffer({ ...MOCK_REQUEST, date }));
  assert.throws(() => a.getOffer({ ...MOCK_REQUEST, budget_cents: 3000 }), /over-budget/);
  assert.throws(() => a.getOffer({ ...MOCK_REQUEST, budget_cents: -1 }), /invalid-budget/);
});
test('approval binds exact amount, currency, offer and terms with explicit consent', () => {
  const { a } = fixture(), o = a.getOffer(MOCK_REQUEST);
  const approval = { explicit_approval: true, total_cents: 3300, currency: 'USD', terms_version: 'mock-terms-v1' };
  for (const change of [{ explicit_approval: false }, { total_cents: 3000 }, { currency: 'EUR' }, { terms_version: 'other' }]) assert.throws(() => a.approveOffer(o.id, { ...approval, ...change }), /exact-approval/);
  assert.throws(() => a.executePayment(o.id, 'made-up', 'key'), /approval-required/);
  const r = a.approveOffer(o.id, approval), other = a.getOffer(MOCK_REQUEST);
  assert.throws(() => a.executePayment(other.id, r.id, 'key'), /approval-mismatch/);
});
test('caller cannot mutate stored offer or approval through returned snapshots', () => {
  const { a } = fixture(), o = a.getOffer(MOCK_REQUEST); o.total_cents = 1;
  assert.throws(() => a.approveOffer(o.id, { explicit_approval: true, total_cents: 1, currency: 'USD', terms_version: o.terms_version }), /exact-approval/);
  const consent = a.approveOffer(o.id, { explicit_approval: true, total_cents: 3300, currency: 'USD', terms_version: o.terms_version });
  consent.offer_snapshot = 'changed';
  assert.equal(a.executePayment(o.id, consent.id, 'key').offer.total_cents, 3300);
});
test('expired quote and expired approval cannot execute', () => {
  const { a, advance } = fixture(), o = a.getOffer(MOCK_REQUEST);
  const consent = a.approveOffer(o.id, { explicit_approval: true, total_cents: 3300, currency: 'USD', terms_version: o.terms_version });
  advance(300000);
  assert.throws(() => a.approveOffer(o.id, {}), /offer-expired/);
  assert.throws(() => a.executePayment(o.id, consent.id, 'key'), /offer-expired/);
  assert.equal(a.diagnostics().payment_sessions, 0);
});
test('retry preserves one reservation and one payment, including after original quote expiry', () => {
  const { a, advance } = fixture(), b = start(a);
  advance(301000);
  for (let n = 0; n < 4; n++) assert.equal(a.executePayment(b.offer.id, b.approval.id, 'buyer-1').booking_id, b.id);
  assert.equal(a.diagnostics().bookings, 1); assert.equal(a.diagnostics().payment_sessions, 1);
  assert.throws(() => a.executePayment(b.offer.id, 'other', 'buyer-1'), /idempotency-key-reused/);
  assert.throws(() => a.executePayment(b.offer.id, b.approval.id, 'different-key'), /offer-already-executed/);
});
test('inventory contention is checked at execution after two available quotes', () => {
  const { a } = fixture(), first = a.getOffer(MOCK_REQUEST), second = a.getOffer(MOCK_REQUEST);
  const approve = o => a.approveOffer(o.id, { explicit_approval: true, total_cents: 3300, currency: 'USD', terms_version: o.terms_version });
  const p1 = approve(first), p2 = approve(second);
  a.executePayment(first.id, p1.id, '1');
  assert.throws(() => a.executePayment(second.id, p2.id, '2'), /booking-conflict/);
  assert.equal(a.diagnostics().payment_sessions, 1);
});
test('browser success and operator confirmation alone cannot confirm a booking', () => {
  const { a } = fixture(), b = start(a);
  assert.equal(a.browserSuccess(b.id).confirmation, null);
  assert.equal(a.setMockOperatorStatus(b.id, 'confirmed').status, 'awaiting-verified-payment');
});
test('paid processor state without verified event cannot confirm', async () => {
  const { a } = fixture(), b = start(a); await a.makeSyntheticEvent(b.id);
  assert.equal(a.setMockOperatorStatus(b.id, 'confirmed').confirmation, null);
});
test('verified payment plus authoritative operator acceptance confirms once', async () => {
  const { a } = fixture(), b = start(a);
  assert.equal((await paid(a, b.id)).status, 'paid-awaiting-operator');
  assert.equal(a.setMockOperatorStatus(b.id, 'confirmed').status, 'confirmed-mock');
  assert.match(a.reconcileBooking(b.id).confirmation, /^MOCK-ONLY-/);
  assert.equal(a.diagnostics().bookings, 1);
});
test('operator acceptance before verified payment also reconciles safely', async () => {
  const { a } = fixture(), b = start(a); a.setMockOperatorStatus(b.id, 'confirmed');
  assert.equal((await paid(a, b.id)).status, 'confirmed-mock');
});
test('forged, changed-body and stale synthetic event signatures fail', async () => {
  const { a, advance } = fixture(), b = start(a), e = await a.makeSyntheticEvent(b.id);
  await assert.rejects(a.verifyEvent({ ...e, signature: '0'.repeat(64) }), /invalid-signature/);
  await assert.rejects(a.verifyEvent({ ...e, raw: e.raw + ' ' }), /invalid-signature/);
  advance(300001); await assert.rejects(a.verifyEvent(e), /invalid-event/);
  assert.equal(a.reconcileBooking(b.id).verified_payment, false);
});
test('duplicate and out-of-order notifications reconcile processor state without regression', async () => {
  const { a } = fixture(), b = start(a), pending = await a.makeSyntheticEvent(b.id, 'pending'), success = await a.makeSyntheticEvent(b.id, 'paid');
  await a.verifyEvent(success); a.setMockOperatorStatus(b.id, 'confirmed');
  assert.equal((await a.verifyEvent(success)).status, 'confirmed-mock');
  assert.equal((await a.verifyEvent(pending)).status, 'confirmed-mock');
  assert.equal((await a.verifyEvent(await a.makeSyntheticEvent(b.id, 'failed'))).status, 'confirmed-mock');
  assert.equal(a.diagnostics().payment_sessions, 1);
});
test('delayed pending notification does not fulfill; later success does', async () => {
  const { a } = fixture(), b = start(a);
  a.setMockOperatorStatus(b.id, 'confirmed');
  assert.equal((await a.verifyEvent(await a.makeSyntheticEvent(b.id, 'pending'))).confirmation, null);
  assert.equal((await paid(a, b.id)).status, 'confirmed-mock');
});
test('payment failure releases capacity; retry never charges a second session', async () => {
  const { a } = fixture(), b = start(a);
  assert.equal((await a.verifyEvent(await a.makeSyntheticEvent(b.id, 'failed'))).status, 'payment-failed');
  assert.equal(a.lookupAvailability(MOCK_REQUEST).availability, 'available-mock');
  assert.equal(a.executePayment(b.offer.id, b.approval.id, 'buyer-1').status, 'payment-failed');
  assert.equal(a.diagnostics().payment_sessions, 1);
});
test('hold expiry releases inventory and late success requires manual refund reconciliation', async () => {
  const { a, advance } = fixture(), b = start(a); advance(600000);
  assert.equal(a.reconcileBooking(b.id).status, 'expired');
  assert.equal(a.lookupAvailability(MOCK_REQUEST).availability, 'available-mock');
  assert.equal((await paid(a, b.id)).status, 'manual-review-refund-required');
  assert.throws(() => a.setMockOperatorStatus(b.id, 'confirmed'), /hold-not-active/);
});
test('operator conflict after payment cannot become a confirmed reservation', async () => {
  const { a } = fixture(), b = start(a); await paid(a, b.id);
  assert.equal(a.setMockOperatorStatus(b.id, 'conflict').status, 'manual-review-refund-required');
  assert.equal(a.reconcileBooking(b.id).confirmation, null);
});
test('cancellation and full mock refund are explicitly approved and idempotent', async () => {
  const { a } = fixture(), b = start(a); await paid(a, b.id); a.setMockOperatorStatus(b.id, 'confirmed');
  assert.throws(() => a.cancelBooking(b.id, {}), /cancellation-approval/);
  const c = { explicit_approval: true, idempotency_key: 'cancel-1' };
  const result = a.cancelBooking(b.id, c);
  assert.equal(result.status, 'cancelled-refunded'); assert.equal(result.refund.amount_cents, 3300);
  assert.deepEqual(a.cancelBooking(b.id, c), result); assert.equal(a.diagnostics().refunds, 1);
  assert.equal(a.lookupAvailability(MOCK_REQUEST).availability, 'available-mock');
  assert.equal((await a.verifyEvent(await a.makeSyntheticEvent(b.id, 'paid'))).status, 'cancelled-refunded');
});
test('unsupported cancellation and pending payment are explicit blockers', () => {
  let { a } = fixture({ cancellationSupported: false }), b = start(a);
  assert.throws(() => a.cancelBooking(b.id, { explicit_approval: true, idempotency_key: 'c' }), /unsupported/);
  ({ a } = fixture()); b = start(a);
  assert.throws(() => a.cancelBooking(b.id, { explicit_approval: true, idempotency_key: 'c' }), /payment-pending/);
});
test('paid expired/conflicting booking can be cancelled/refunded without new inventory', async () => {
  const { a, advance } = fixture(), b = start(a); advance(600001); await paid(a, b.id);
  const result = a.cancelBooking(b.id, { explicit_approval: true, idempotency_key: 'refund-expired' });
  assert.equal(result.status, 'cancelled-refunded'); assert.equal(result.confirmation, null);
});
test('Pacific local calendar preserves tomorrow visit when UTC already changed day', () => {
  const a = createMockTransactionAdapter({ now: () => Date.parse('2026-10-08T02:00:00Z') });
  assert.equal(a.getOffer({ ...MOCK_REQUEST, date: '2026-10-08' }).request.date, '2026-10-08');
});
test('completed cancellation retry remains idempotent after cancellation deadline', async () => {
  const { a, advance } = fixture(), b = start(a); await paid(a, b.id); a.setMockOperatorStatus(b.id, 'confirmed');
  const input = { explicit_approval: true, idempotency_key: 'cancel-fixed' };
  const result = a.cancelBooking(b.id, input); advance(40 * 86400000);
  assert.deepEqual(a.cancelBooking(b.id, input), result); assert.equal(a.diagnostics().refunds, 1);
});
test('mock cancellation closes at Pacific calendar midnight across DST', async () => {
  let time = Date.parse('2026-10-07T17:00:00Z');
  const a = createMockTransactionAdapter({ now: () => time });
  const b = start(a, 'dst', { ...MOCK_REQUEST, date: '2026-10-30' }); await paid(a, b.id); a.setMockOperatorStatus(b.id, 'confirmed');
  time = Date.parse('2026-10-30T07:30:00Z'); // 00:30 Pacific daylight time
  assert.throws(() => a.cancelBooking(b.id, { explicit_approval: true, idempotency_key: 'dst-cancel' }), /window-closed/);
});
