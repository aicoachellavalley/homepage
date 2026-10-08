# Bounded workspace transaction pilot — October 7, 2026

**Status: runnable LOCAL/MOCK ONLY. Provisional operator candidate; real-provider activation blocked.** No business was contacted, no account created, no payment or booking performed, and no external agreement accepted. This implementation does not demonstrate compatibility with any operator's actual booking API.

## Selection and consequential gaps

The regional specialist first audited existing nodes and six preview manifests. The existing canonical Entrepreneurial Resource Center identity is reused as `local/entrepreneurship-resource-center`; its current source conflicts with legacy workspace material and supplies no complete current purchasable day-pass offer. Details and source receipts remain in `workspace-evidence-2026-10-07.md` and the shared workspace records rather than being re-researched broadly. The transaction specialist's direct fetch of the current ERC page was unavailable; that is a retrieval limitation, not proof the centre is unavailable.

| Candidate | Official offer/path evidence | Missing for a transaction | Decision |
| --- | --- | --- | --- |
| Existing ERC identity | Current official rental/contact pathway, legacy coworking material | Current bounded offer, current space, access, complete price, inventory, API authority and fulfillment | Preserve inquiry capability; do not choose an instant purchase from stale evidence |
| The Hive, Palm Springs | $30 shared-desk drop-in/day; weekdays 9am–5pm; first-come or call to reserve; official membership page links booking portal | Full tax/fee total, date-specific desks, cancellation/refund terms, agent API, authorized merchant integration, booking confirmation | Strongest provisional one-person day-pass candidate for a mock adapter |
| Fusion Palm Desert | Office/coworking/meeting offerings and official Yardi Kube room portal | Standalone day-desk/room quote, room capacity, exact access, full terms, API authority | Useful official handoff; published virtual-office monthly price is a different product |
| Regus 750 N Palm Canyon | Official day-pass/meeting pathways; cowork day price starts at $85/day | Final offer, availability, hours/access and authorization | Useful alternative; starting price cannot serve as exact purchase approval |

The Hive is selected for the explicit one-person/day product and the supported hours and next step. Price does not alter regional eligibility or ranking; there is no payment to AICV. The shared identity is `workspace/the-hive-coworking`, matching `src/data/workspace-options.json`. The narrower shared-desk fixture avoids interpreting the Hive's comfortable seating for eight as a maximum occupancy or guaranteeing a private meeting room.

Primary sources directly checked October 7: [Hive memberships](https://www.thehivecoworking.com/memberships), [Hive room description](https://www.thehivecoworking.com/conference-room-rentals), [Fusion Palm Desert](https://www.fusionworkplaces.com/locations/palm-desert-ca/), [specific Regus centre](https://www.regus.com/en/us/6794). Hive's membership page contains placeholder paragraphs; reconfirm the published price and access before a live pilot. Published operator claims are not an inspection or attestation. A login portal link establishes an official handoff, not an agent-callable API or reservation.

## Directory and payment research receipt

Applied the installed Stripe Directory, Stripe best-practices and Stripe docs skills, including the local payment/security reference files. `which stripe` returned `stripe not found`. Read current agent-facing [Stripe Directory documentation](https://stripe.directory) on October 7 using its documented public Markdown response. It describes the CLI Directory plugin and `stripe directory search`; no usable installed CLI/plugin or callable Directory connector is available in this session. **No Directory provider lookup completed; no operator is claimed present or absent in Directory.** CLI/plugin installation and authentication remain a separate prerequisite for a future provider lookup. No installation, login, provisioning, profile or public listing was performed. Existing regional evidence supplies this provisional research candidate.

Read the current [Stripe agentic commerce primer](https://stripe.com/guides/agentic-commerce-primer). It distinguishes discovery, fraud, checkout and payments, and describes multiple checkout surfaces. This does not establish Hive support for Stripe, agent checkout or shared payment tokens. Operator authorization and its actual supported interface determine activation. AICV need not be merchant of record and must not use its own unrelated merchant account to sell another operator's inventory.

The already-connected Stripe documentation search was used for [Checkout fulfillment](https://docs.stripe.com/checkout/fulfillment?payment-ui=stripe-hosted), [webhook management and signature handling](https://docs.stripe.com/events/manage-webhook-endpoints), and [limited inventory/session expiration](https://docs.stripe.com/payments/checkout/managing-limited-inventory?payment-ui=stripe-hosted). Search did not retrieve the requested idempotency page, so official [idempotent request documentation](https://docs.stripe.com/api/idempotent_requests) was read through public browsing. No Stripe account metadata, products, payments, keys or customer data were read or changed. The docs connector's accepted authentication does not grant authority to book Hive inventory.

Design implications: fulfill from verified events and server-read session/payment state; handle delayed success/failure; deduplicate events and execution; reconcile booking and payment independently. Keep provider signing secrets server-side and verify the raw event body using its SDK. Include a verified expiry/release workflow. An operator's inventory hold must remain consistent with payment/session expiration and asynchronous payment eligibility. A Stripe payment link alone cannot reserve a desk. For an authorized Stripe integration, favor Checkout Sessions with hosted payment collection, least-privilege restricted keys in a server secret store, isolated authorized sandboxes, dynamic payment methods and an explicit API/SDK version verified at activation. No actual Stripe SDK/API is introduced here.

## Runnable mock and adapter boundary

Run from the repository:

```sh
node scripts/run-transaction-pilot.mjs
node --test scripts/transaction-pilot.test.mjs
```

Browser demo: `/action-pilot/`, linked from the workspace decision page and marked `noindex`. Both clients import `src/lib/transaction-pilot.mjs`; there are no dependencies, network calls, remote action tools, WebMCP transaction registrations or raw card inputs. The CLI uses a fixed fictional clock/date for repeatability. The browser uses its local clock, accepts a fictional future weekday, and can advance the mock clock. Reset/reload loses all state.

**Real published offer:** $30 base/day; taxes, fees, total, inventory and full terms unknown. **Synthetic complete quote:** $30 base + invented $3 test tax + $0 fees = $33 USD, one fictional desk, one person, 09:00–17:00 America/Los_Angeles. The tax is neither a calculation nor an operator claim. Fictional cancellation terms allow a full mock refund before the Pacific visit date begins at midnight. Neither the complete quote nor policy is attributed to Hive.

| Adapter boundary | Demonstrated in mock | Required real counterpart |
| --- | --- | --- |
| `lookupAvailability` / `getOffer` | Preserve exact supported requirements; known synthetic inventory/access/complete price; reject unknowns, unsupported scope, inaccessible assumptions and excess budget | Operator inventory/access check, exact dated offer, complete tax/fees and versioned terms |
| `approveOffer` | Explicit approval of date/scope/total/currency/terms, bound to immutable internal quote | Authenticated buyer approval record, CSRF protection, authorization and expiring server offer |
| `executePayment` | Atomic in-instance hold before one payment session; same-key retries and offer reuse protection | Durable atomic inventory reservation and one operator-owned checkout session with stable idempotency key |
| `verifyEvent` | Raw synthetic payload HMAC, context match, deduplication; processor state read handles out-of-order notifications | Official provider SDK raw-body signature verification, timestamp rules, event identity/account/livemode validation and durable processing ledger |
| `setMockOperatorStatus` / `reconcileBooking` | Confirm only with verified paid state AND authoritative mock operator acceptance; success-screen read cannot confirm | Authenticated operator booking API/status lookup and fulfillment reference independently reconciled with provider payment |
| `expireHolds` | Release synthetic expired inventory; late payment requires manual refund review | Coordinated operator hold/session expiration and recovery worker with durable reconciliation |
| `cancelBooking` | Explicit approved cancellation; one full fictional refund; retries remain idempotent past original deadline; unsupported/pending cases block | Operator cancellation support/terms; authorized provider refund and observed final status, or explicit unsupported action |

The HMAC key is a **public fake fixture**, deliberately shipped to the browser. It proves only synthetic message integrity inside the demo. It does not authenticate a buyer/operator, securely verify Stripe events or make this safe for real transactions. `setMockOperatorStatus` and `makeSyntheticEvent` are simulation controls. All IDs and confirmations start with mock labels; they confer no entitlement. The five-minute quote and ten-minute hold are fictional fixture values, not claimed provider-supported TTLs. Atomicity applies only to one in-memory instance, not multiple processes or restarts. Persistent inventory, provider failures during ambiguous execution, real payment-method timing, live tax, browser SDK checkout and operator fulfillment remain unvalidated.

## Validation and limitations

25 focused Node tests passed after the independent regional evaluator found two omissions despite the original 22 passing tests: Pacific date handling across a UTC midnight and a completed cancellation retry after its original policy deadline. Repairs use Pacific calendar dates and return completed idempotent cancellations before checking a new cancellation deadline. A third regression checks daylight-saving midnight. Approved policy wording was aligned with that midnight cutoff.

The tests cover unknown price/access/availability, complete-price budget checks, immutable exact approval, unsupported setup, quote/hold expiry, contention at execution, duplicate execution/event delivery, delayed payment, payment failure, out-of-order notifications, invalid signatures, browser-success non-confirmation, paid-without-operator, operator conflict, late payment/manual refund, approved cancellation/refund and unsupported cancellation. The CLI ran the full quote→approval→hold→verified payment→operator confirmation→retry→cancellation flow. These are synthetic tests, not provider sandbox observations. Browser execution and full repository/build/deployed checks are recorded by the lead's integration receipt; source inspection alone is not browser QA.

## Exact activation review checklist

1. Sat reviews this provisional operator/product selection and approves the **unsent outreach draft** below if operator engagement is desired. No outreach is authorized merely by this checklist.
2. Obtain the operator's written permission identifying the entity, exact product, booking authority, supported booking/payment platform and any permitted agent actions. Confirm the operator owns inventory, merchant account, customer relationship and fulfillment; clarify AICV's role.
3. Obtain date-specific inventory rules, holds/expiry/conflict behavior, complete price/tax/fees, public/member access, hours, accommodations, cancellation/refund/change policies, support/escalation and a booking confirmation/reference contract. Resolve placeholder/stale public copy.
4. Complete Directory lookup with an authorized CLI/plugin if applicable; inspect the actual operator-supported API/browser pathway without bypassing authentication. Do not select a replacement payment system based solely on this mock. If no supported booking API exists, keep official handoff capability.
5. Operator supplies access to an already-authorized isolated sandbox, its scoped least-privilege server credentials/signing material via a secure secret store, booking API documentation and operator test inventory. No secrets in chat, source, URLs or logs; no new accounts/costs without separate authorization.
6. Implement a server adapter behind authenticated buyer/operator approval. Persist quote/approval, reservation, payment and refund identities; use atomic inventory operations, durable idempotency/event ledgers and reconciliation/recovery. Verify merchant context, offer identity, amount/currency/terms and session state. Prevent pending/cancelled/expired states from fulfilling accidentally.
7. Run the failure matrix in the real operator sandbox: competing reservations, delayed/failed payment, duplicate/out-of-order events, session/hold expiry, stale quote, wrong context/signature, ambiguous network execution/retry, operator rejection after payment, refund failure/pending state, restart and concurrent processing. Align holds with provider session/payment timing rather than copying mock TTLs.
8. Observe operator-issued booking confirmation and access instructions; verify cancellation/refund in both systems. Record exact sandbox receipts and unresolved provider constraints. Advertise `agent-assisted-action` or `agent-completable-transaction` per entity only when authority and tested behavior support it. Keep payment-independent eligibility/ranking and personal data out of aggregate analytics.
9. Request Sat's explicit approval of the tested activation implementation, merchant context, support obligations and production/publication changes. Real checkout, booking/payment execution, account creation, agreement acceptance or live tools remain outside current authorization.

## Unsent operator outreach draft

**Subject:** Review request: a bounded, operator-controlled day-pass booking pilot

Hello Hive team,

AICV helps founders compare Coachella Valley workspace using attributed regional evidence and official operator pathways. Your public site lists a $30 drop-in day desk. We have built a clearly fictional local demonstration; it has no connection to your inventory, booking portal or payment account and has made no bookings or charges.

Would you be open to reviewing a one-person weekday day-pass pilot where you retain inventory, pricing, payments, fulfillment and the customer relationship? Before proposing any live activation, we would need your current access and complete price/fee terms; hold/availability rules; confirmation and cancellation/refund process; the booking platform's supported integration route; and your written authorization. If you already have an authorized sandbox, we could test there with your chosen interface and test inventory. Please do not send credentials by email; any later credential access would use a secure approved route.

No commitment or public partnership announcement is proposed by this draft. We would share the exact workflow and test results for your approval, and retain an ordinary official handoff if a supported integration is unavailable.

Thank you,
Sat / AI Coachella Valley

**Draft only. Not sent.**
