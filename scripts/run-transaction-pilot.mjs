import { createMockTransactionAdapter, MOCK_REQUEST } from '../src/lib/transaction-pilot.mjs';
// Fixed synthetic clock keeps this demo repeatable. This does not check availability.
const a = createMockTransactionAdapter({ now: () => Date.parse('2026-10-07T17:00:00Z') });
const o = a.getOffer(MOCK_REQUEST);
console.log('LOCAL/MOCK ONLY — no Stripe calls, no card details, no real booking or payment.');
console.log('Synthetic exact offer:', JSON.stringify(o, null, 2));
const approval = a.approveOffer(o.id, { explicit_approval: true, total_cents: o.total_cents, currency: o.currency, terms_version: o.terms_version });
const b = a.executePayment(o.id, approval.id, 'synthetic-buyer-1');
console.log('Browser success screen:', a.browserSuccess(b.booking_id).status);
await a.verifyEvent(await a.makeSyntheticEvent(b.booking_id));
console.log('Verified mock payment:', a.reconcileBooking(b.booking_id).status);
console.log('Authoritative MOCK operator acceptance:', a.setMockOperatorStatus(b.booking_id, 'confirmed').status);
a.executePayment(o.id, approval.id, 'synthetic-buyer-1');
console.log('Retry counts:', a.diagnostics());
console.log('Approved mock cancellation:', a.cancelBooking(b.booking_id, { explicit_approval: true, idempotency_key: 'synthetic-cancel-1' }).status);
