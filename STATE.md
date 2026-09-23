# com/ operational state

> Operational state only. Strategic state lives in `aicv-playbook/STATE.md`.

## 2026-09-22 — APPROVED SOURCE RELEASE: /about/ + homepage JSON-LD de-stale

Released through `main` on Sat's go; Cloudflare production verification
follows the push.
New `/about/`: one-sentence definition, what AICV does, differentiators, who
it is for, founder, how engagement works, a `<dl>` key-facts list and a
6-question FAQ (one `faq` array → visible list + FAQPage JSON-LD). Identity
facts come from new `src/data/org.json`; prices from `pricing.json`; counts
use the homepage stat-bar derivations (13 reports, 178 briefs, 2,914 mapped).
Deliberately no competitor names, clients, customers-served or projects rows.

Wired: `page-dates.json` `/about/` = 2026-09-22, sitemap static entry, footer
NAV "About" (site-wide), one llms.txt line. New `scripts/about.test.mjs` fails
the build if index/get-agent-ready Organization JSON-LD disagrees with
org.json. 60 tests pass; build + ownership (304 pages), amendments and
node-content gates pass with IndexNow disabled. Browser-checked desktop and
375px: no horizontal overflow, 7 H2s, 15 facts, 6 FAQ items, JSON-LD parses.

Homepage JSON-LD (same release, separate commit): the Service block offered
two FREE services that no longer exist ("Get Included" node profiles, "Submit
a Brief"); it now describes Get Agent Ready with offers derived from
pricing.json. FAQ: dropped "(formerly the AIO Tool)"; the "how does a
business get included" answer now says research inclusion needs no
application and is never for sale, and names Agent Ready + price from
pricing.json. "AIO tool" in two dated 2026 briefs is the published record, left as is.

POSITIONING (same day, Sat's call): AICV is a DECISION ENGINE. One
Organization description now lives in `src/data/org.json` `description`;
index, get-agent-ready and about JSON-LD all read it (test-enforced). It
replaces the homepage's unsourced "the intelligence network AI uses to
evaluate..." and get-agent-ready's "intelligence network" line. About hero,
FAQ and Type row lead with it. `/get-agent-ready/` page date bumped to
2026-09-22. CARRIED THROUGH (same day): llms.txt blockquote now renders
org.description, with a line naming the Intelligence Network as the
structured data the decision engine runs on; footer identity line reads
"Decision Engine · Est. 2025" (6 full-footer pages). KEPT: nav/footer link
label "Intelligence Network" -> /nodes/ (it names the nodes product). NOT
changed: the .org site, aicv.news.
After deploy: `npx wrangler@latest ai-search jobs create aicv-com-corpus`.

## 2026-09-21 — APPROVED SOURCE RELEASE: MVA example order

This release supersedes the local-only entry immediately below. The two visual
examples now follow their real sequence across the page: MVA before activation
on the left, activated MVA on the right. No copy, price, checkout, service
scope or business logic changed. Source is being released through `main`;
Cloudflare production verification follows the push.

## 2026-09-21 — LOCAL ONLY: MVA example order

Working tree is one layout correction ahead of `7b06a7d`; no commit, push or
deployment. The two examples now read left to right in their natural sequence:
MVA before activation, then activated MVA. No copy, pricing, checkout, service
scope or logic changed.

54 tests pass. The 306-page build and ownership, amendment and node-content
gates pass with IndexNow disabled. Rendered browser check at 532px confirms
the preview MVA is left, the activated MVA is right, and there is no horizontal
overflow. Not committed, pushed or deployed.

## 2026-09-21 — APPROVED SOURCE RELEASE: simpler MVA journey

This approved source release supersedes the local-only entry immediately below.
The customer-facing example is a two-state before/after MVA story, without
fictional-example framing or extra destinations. Sales-page copy now focuses on
what customers gain, while the external-platform limitation remains in the
linked Terms section. The new assistant FAQ names the current major systems
without promising traffic, recommendation or sales from any of them.

No price, Stripe checkout destination, matching behavior, Terms text,
Cloudflare account setting, booking/payment integration or corpus content
changed. Source is being released through `main`; Cloudflare production
verification follows the push.

## 2026-09-21 — LOCAL ONLY: simplify the MVA before/after story

Working tree is one copy/layout revision ahead of `41ae3ea`; no commit, push or
deployment. The example is now two non-interactive, side-by-side MVA views:
before activation and activated. Removed the private-review card, fictional
Sample Bistro disclaimer and full-page links; the private review remains an
included, private deliverable rather than a public example.

The $500 purchase-match note is now a simple invitation to run the free check
and confirm the business. The external-platform outcome limitation was removed
from the sales page and remains on the linked What Visibility Means Terms
section. Simplified the Cloudflare and agent-payment wording as requested.

Replaced the agentic-internet section with the approved urgency copy, without a
research-date badge. Added a shared visible/JSON-LD FAQ naming the current
assistant set: ChatGPT, Claude/Anthropic, Gemini, Grok, Muse and Perplexity.
No service scope, pricing, checkout, business matching, Terms, agent/payment
integration or crawler-access configuration changed.

54 tests pass. The 306-page build and ownership, amendment and node-content
gates pass with IndexNow disabled and the public news feed available. Browser
QA at the active 532px width: two example cards, no per-card links, no stale
copy, 13 rendered FAQ items and no horizontal overflow. Not committed, pushed
or deployed.

## 2026-09-21 — APPROVED SOURCE RELEASE: human-first Get Agent Ready

This approved release supersedes the local-only working notes immediately below.
It combines the human-first copy pass, pricing-card alignment, three visual MVA
examples and the honest booking/buying roadmap. It makes no change to pricing,
the Stripe destination, activation/matching logic, owner verification, hours
policy, corpus, account settings or a customer's booking/payment systems.

The MVA is now described in customer language: a public business profile that
helps people and AI assistants understand the business and reach its existing
website, phone, booking or ordering path. Business and Premium describe direct
agent booking/buying as a planned, separately agreed integration direction, not
an included capability. Cloudflare SAT remains owner-assisted in Business and
Premium. All older local-only notes document the incremental work that this
release carries forward.

Final source gate: 53 tests pass, with pricing consistency and matching guards.
Previous full build: 306 pages plus ownership, amendment and node-content gates
passed with IndexNow disabled. Browser QA confirmed no horizontal overflow on
the edited page, matching visible/JSON-LD FAQs, aligned tier actions and the
unchanged Stripe URL. Cloudflare deploys this repository from the pushed main
branch; production verification belongs in the next receipt.

## 2026-09-19 — LOCAL ONLY: explain bookings without underselling the MVA

Working tree remains at `294d761`; no commit, push or deployment. Replaced the
example's negative chatbot/website disclaimer with the customer benefit: clear
business facts and links to existing booking/ordering systems. Simplified the
$500 detail copy and activation FAQ. Purchase matching, private review,
unchanged website, Cloudflare tier boundaries and prices remain unchanged.

Added a shared, explicitly planned booking/buying direction to the Business and
Premium detail panels and FAQ. It is not an included Service description or
new entitlement: testing, separately agreed work/cost and Premium planning
priority remain explicit. Muse testing is described as planned, not completed.
Checked actual MVA booking-link/ReserveAction output against Google's WebMCP
guide and Stripe's service-booking documentation. Links/structured actions are
not proof of an implemented calendar or payment connection. No integration,
account setting, appointment or payment was created.

53 tests, 306 pages and all four gates pass with IndexNow disabled. Rebuilt with
the public news feed reachable; known upstream directive warnings remain.
Browser QA: Business panel opens on desktop, Premium panel opens on 390px
mobile without horizontal overflow, both close. No observed console warnings
or errors. All 12 visible FAQ answers match JSON-LD; both roadmap paragraphs
match; Stripe destination and three miniature examples are unchanged.
Preview: `http://127.0.0.1:4323/get-agent-ready/#profile-example`.

## 2026-09-19 — LOCAL ONLY: clearer human/agent sales copy

Working tree on main at `294d761`; no commit, push or deployment. Tightened the
Get Agent Ready hero, tier descriptions, next steps, example introduction,
access explanation, FAQs and offer-detail panels. MVA is defined up front as
a business profile. Retained agentic-internet/economy language, Choose Your
Future, Who's already asking, the visual miniatures and pricing-card alignment.
No design, backend, pricing, checkout destination, hours policy or corpus change.
Legal Terms and the detailed Cloudflare checklist were not rewritten.

Four card descriptions now use pricing.json directly (13–17 words each).
All four Service descriptions share text with their human-facing detail panels;
metadata shares the page description. Updated the shared llms.txt offer copy
and removed stale citation/day-one-discovery promises. Added an honest FAQ on
preview versus activated MVA. FAQ answers total 471 words across 11 questions,
down from 547 across 10 before this pass. Matching, no-owner-verification,
outside-citation limits, private review and separately scoped account work
remain explicit. No new service entitlement or payment capability promised.

52 tests, 306-page build and all four gates pass; IndexNow disabled. Existing
upstream directive warnings remain. Compared all pricing fields to HEAD: equal.
Browser QA at 1440px/390px: no overflow, broken images or observed console
warnings/errors; desktop rules/prices/buttons align. All 11 rendered FAQ
answers exactly match JSON-LD; all four Service descriptions match their
detail panels. The $500 detail panel opens/closes with correct copy; checkout
retains the unchanged base URL. Built llms.txt carries the updated offer scope.
Preview: `http://127.0.0.1:4323/get-agent-ready/`.

## 2026-09-19 — LOCAL ONLY: visual MVA miniatures

Working tree remains on main at `294d761`. Replaced the descriptive paragraphs
and bullets inside the three example cards with scaled-down views of the actual
fictional example HTML. Captions are now activated MVA, MVA before activation,
and private review; the FAQ identifies the first two as states of the same MVA.
Each card retains one full-page link, also clickable over the miniature.

This supersedes the preceding iteration's iframe removal: these are bounded,
lazy-loaded, sandboxed, inert miniature views, not full-size scrolling embeds.
They have no keyboard stop or pointer interaction of their own; readable captions
and named full-page links remain accessible. No JavaScript/dependency or screenshot
maintenance pipeline added. Full examples and provenance hashes are unchanged.

50 tests, 306 pages and all four build gates pass (`AICV_NO_INDEXNOW=1`); known
upstream directive warnings remain. Browser QA: actual 1440px and 846px widths
show three aligned visual cards; 630px and 390px stack without horizontal
overflow. All three miniature pages visibly render, no observed console errors
or warnings. Clicking the first miniature opens the correct full published
example; the other full-page destinations are unchanged from prior verification.
Local preview: `http://127.0.0.1:4323/get-agent-ready/#profile-example`.
Not committed, pushed or deployed; prior local pricing alignment is preserved.

## 2026-09-19 — LOCAL ONLY: three open MVA example cards

Working tree on main at `294d761`, retaining the local pricing alignment below.
Replaced the outer example disclosure and two nested disclosures with three
compact, always-visible cards: published MVA, original preview, private review.
Each has one accessible full-page link. Removed all three embedded iframes;
full examples and their provenance hashes are unchanged. Updated the shared
visible/schema FAQ to describe the cards. Fictional-example labeling, purchase
matching and service-scope caveats remain explicit. No new JavaScript or packages.

50 tests, 306-page build and all four gates pass with `AICV_NO_INDEXNOW=1`.
Existing upstream directive warnings remain. Browser checks at 1440px and 820px
show three equal-height cards with aligned links; at 390px they stack without
horizontal overflow. No observed console warnings/errors. All three links open
the expected fictional pages; read-only HTTP checks return 200 and expected
titles/content. Viewport reset. Preview remains available at
`http://127.0.0.1:4323/get-agent-ready/#profile-example`.
Not committed, pushed or deployed. Pricing, checkout and full example files
were not changed by this iteration.

## 2026-09-19 — LOCAL ONLY: pricing-card alignment

Moved the $500 purchase-matching explanation below the four pricing cards;
its scope and manual-match warning remain explicit, with `aria-describedby`
connecting it to the unchanged Stripe CTA. Shared grid rows align the dashed
rules, prices, buttons and details links even when text wraps. Card names can
wrap instead of overflowing. No prices, offer scope or payment logic changed.

50 tests, 306-page build and all four content gates pass. Final build used
`AICV_NO_INDEXNOW=1`. Existing upstream directive warnings remain unchanged.
Browser QA at actual CSS viewport widths 984px (four columns), 846px (two)
and 390px (one): corresponding rows align, no horizontal overflow, and no
observed console warnings/errors. The matching note follows the final card.
Local preview: `http://127.0.0.1:4323/get-agent-ready/#tiers`.
Not committed, pushed or deployed. Hours and collection-selection questions
were investigated only; no hours policy, corpus or curation data was changed.

## 2026-09-19 — LIVE: dependency fixes and confirmed-business checkout

Approved source `032f6cd` is merged/pushed to main. GitHub Site and dependency
gates passed. Git-connected Pages deployment
`5c1f9d85-4b15-4ba9-94e5-18697d54b8c5` completed successfully at 21:29:44 UTC,
after the required activation availability endpoint was deployed and verified.
No manual Pages upload. Final registry audit: zero reported vulnerabilities.
49 tests, 306 pages and all four content gates pass; upstream directive warnings
remain recorded below rather than suppressed.

Live QA: homepage, service page and Terms plus 24 distinct same-origin link/asset
targets respond successfully. Stripe still returns 200 at the unchanged base
destination. Public host-map bytes are unchanged (SHA-256
`744369e479931f8bf3ab2c09edafffdf14863fdcf8972e00fd663d2629005d48`).

A real public Brandini diagnostic returned both Palm Springs and Rancho Mirage
choices. Before confirmation the link carried no slug; selecting Palm Springs
passed the live availability check and added exactly
`client_reference_id=brandini-toffee-palm-springs`. Analyze-another cleared the
selection and restored the base link. No checkout was opened or completed;
no ownership claim was persisted. Desktop and 390px mobile: no horizontal
overflow, broken images, or observed console warnings/errors. Viewport restored.
Local fixture tests additionally cover all 8 Fantasy Springs choices, shared
host refusal, stale-response races and safe URL editing/reset behavior.

Mirage's corpus/map entry stays intact, but the backend refuses its purchase
and its preview shows an under-review notice; see mva/STATE.md and the recovery
runbook. Outstanding monitoring/corpus/maintenance items remain in the debt
register. This receipt supersedes the pre-release status immediately below.

## 2026-09-19 — LOCAL: dependency security and confirmed-business checkout

Branch `codex/gar-debt-sept19`, base `382083d`; founder approved commit/push/deploy
on September 19. This entry records pre-release checks, not a deployment receipt.
Astro 7.3.3 / MDX 8.0.1 / markdown-remark 7.3.1 replace the vulnerable lockfile.
Unified Markdown and HTML compression are explicit to preserve existing copy
and spacing. Fresh `npm ci` and registry audit: zero reported vulnerabilities.
49 tests, 306-page build and all four content gates pass in both the working
checkout and a clean-source, freshly installed snapshot. Local IndexNow was
disabled. Upstream Astro/Rolldown emits 274 unsuppressed directive warnings;
recorded as residual maintenance, not a page failure or zero-debt claim.

The diagnostic lazily loads the unchanged host map after successful analysis,
shows name/city and all ambiguous/tie-break candidates, and requires an explicit
choice plus current Worker availability before adding `client_reference_id` to
the unchanged Stripe URL. No silent host→consent conversion, fuzzy matching or
automatic navigation. Shared platforms are refused. URL edits/reset invalidate
consent and stale responses; slower earlier choices cannot overwrite later ones.
Unconfirmed purchases retain the honest manual-match fallback. No extra frontend
dependency, accounts, customer storage or SDK. Mobile navigation now has two rows
instead of squeezing the brand and links together; desktop design is unchanged.

Compared all 309 HTML outputs including examples to the pre-upgrade baseline:
visible-copy differences only on Get Agent Ready. Comparator identical-input
and injected-heading controls pass. Desktop and 390px browser QA: no horizontal
overflow, broken images or observed console errors; Fantasy Springs shows all
8 choices, Brandini both cities, Yelp refuses, chosen slug reaches the link,
editing the URL clears it. These used a visibly labeled synthetic diagnostic
and availability fixture, not model calls or checkout. Production is unchanged.

Release order: mva additive migration and activation Worker first, then review /
merge / push com main through Git-connected Pages only. The new availability
endpoint must be live before the UI. See `../../mva/activate/RECOVERY.md` and
`../playbook/TECHNICAL-DEBT.md`; live alert proof and Mirage corpus disposition
remain separate gates. Existing production receipt follows.

## 2026-09-19 — Approved release: human homepage and truthful MVA sales examples

**Released and verified:** implementation `48f524e`, build-order correction
`af41b8e`, Cloudflare Pages deployment
`d1babd6f-8053-4821-97b4-80c733ab229d` succeeded. Fresh public verification at
20:14 UTC: homepage, Get Agent Ready and Terms return 200 with the new content;
all 23 same-origin link/asset targets extracted from those pages respond
successfully. All three demo HTML files and both hero WebPs match the committed
public assets byte-for-byte. Each demo has noindex/nofollow and the intended
script/form-blocking CSP. Stripe remains
`https://buy.stripe.com/6oUfZhcZN0hBcEa1we8k801`. Research date is September 14,
2026, derived from published research, not today's build date.

Live browser QA: desktop/phone layouts have no horizontal overflow or broken
images; homepage service CTA and native example disclosure work; observed
console warnings/errors are empty. The legacy Terms modal was also checked
locally and opens correctly. Diagnostic preflight returns 200 with the com
origin allowed; no paid analysis or checkout was run. The August 21 Terms retain
their dated text; the September 19 visibility section explicitly clarifies that
outside visitation/indexing/citation/recommendation is not guaranteed.

The corrected build also passes from a clean tracked-file export with no
pre-existing stats (existing installed dependencies reused): 39 tests, 306-page
build and all four gates. The separate com dependency advisory scan found 10
flagged packages (1 critical, 8 high, 1 low), not demonstrated exploits; versions,
deployment-context limits and upgrade acceptance criteria are GAR-08 in the
playbook debt register. No package upgrade was attempted inside this release.

**First cloud build held, then corrected:** commit `48f524e` failed before
deployment because this session put tests before generation of ignored
`src/data/stats.json`. Existing local generated data masked that dependency.
Cloudflare kept the previous production build. Generation now runs in
`pretest`; prebuild checks pricing and invokes that lifecycle. Tests stay
mandatory rather than being bypassed. A clean tracked-file export is the
additional verification for the correction.

Supersedes the LOCAL status of the three design/example entries below. Sat
approved committing, pushing and releasing the accumulated work; the receipt
above confirms the Git-connected deployment, not just the push.

Final cleanup removes “indexed” and “the index agents read first” from the
offer; the matching activation Worker copy is released separately from mva.
The controlled promise is a public, agent-readable page after business matching,
not outside indexing/citation priority. Stripe destination and payment logic
are unchanged. The approved homepage layout/copy, real-template fictional
examples, Terms clarification and derived research date are included.

All 39 tests and the 306-page build pass, including pricing, ownership,
amendments and complete-node-content gates. IndexNow was disabled locally.
Tests now run automatically in prebuild (including Git-connected deployments).
Desktop/mobile browser checks: no overflow, broken images or console errors;
homepage service CTA and example disclosure work. Existing upstream Vite
unused-import warning remains. The stale com CLAUDE instruction to upload the
org repo root with Wrangler was corrected to the canonical push-only procedure.

Technical debt and closure criteria now live in
`core/playbook/TECHNICAL-DEBT.md`, linked from its sole Forward Queue. In
particular, presentation gates do not cover away the pre-existing payment
recovery defects reproduced in mva. No claim of zero debt or fresh paid E2E
verification is made. No private customer data, fleet seed or purchase changed.

## 2026-09-19 — LOCAL follow-on: human reading path through the homepage

Sat found the widened agent-intent paragraph/list visually unhelpful for human
buyers. Replaced that section with “The search is agentic. The decision is human.”
and three visible scenarios: plan a visit/retreat, find a home, build a business.
Each pairs an explicitly illustrative assistant question with the local business
types involved. Condensed five examples to three; the visit example now reads
like a visitor's question rather than a founder's research prompt. A concluding
invitation links to `/get-agent-ready/`, not directly to checkout. No promise of
recommendations, leads or citations was added. The section now follows the MVA
explanation, before briefs/news, rather than sitting near the footer.

The desktop rail remains 80% (90rem cap): measured 1,140px of 1,425px usable
width in a 1,440px browser. Three columns become labeled rows on tablets and a
single reading column on phones. Semantic headings/list and all examples remain
in ordinary visible HTML; no new JavaScript, dependencies or imagery. Other
homepage copy and earlier local changes remain intact. This supersedes the
earlier entry's unchanged-copy statement for this one section only.

Verified: 38 tests pass, 306-page build and all four gates pass, existing public
news feed loads, IndexNow disabled. Compared 309 built HTML files (including
the three demos) against the previous local build: only `index.html` changed.
Schema/frontmatter and scripts unchanged; all prior links retained plus one
service-page link. Browser QA at nine widths (320–1920px) found no horizontal
overflow; desktop/phone visual checks, service CTA and return navigation passed;
browser errors empty. Existing upstream Vite warning only. Local review:
`http://127.0.0.1:4322/#what-agents-use`. No commit, push, deploy or purchase.

## 2026-09-19 — LOCAL homepage layout and landscape treatment; awaiting review

Sat's screenshots identified the com homepage: wide headings, narrow body copy,
an underused green CTA card and stacked section padding. Existing copy, all href
destinations, frontmatter/schema and client scripts are unchanged. Desktop
sections now share an 80%-width rail (capped at 90rem). The hero's lead paragraph
spans the rail, with its two supporting paragraphs side by side; mobile stacks
them. The green card puts the action beside its copy on desktop. Stats and the
MVA explanation use tighter vertical spacing. Existing section titles are h2s.

The .org sunrise WebPs were copied byte-for-byte into com as
`public/hero-network-{960,1920}.webp` (27,318 and 83,744 bytes). A CSS-only dark
pine overlay and subtle grid give the landscape a more technical treatment;
no generated imagery, canvas, live-traffic visualization or new frontend JS.
The .org site was not changed. The homepage phone header now keeps both actions
on one line and its full brand name accessible to screen readers. Reduced-motion
users see hero text immediately rather than through the existing entrance effect.

Verified locally: all 35 tests pass; the 306-page production build passes pricing,
ownership, amendment and complete-node-content gates. Public news feed loaded;
IndexNow disabled. Source comparison proves homepage words, links and schema
unchanged. Browser QA of the production build at 11 widths from 320–1920px found
no horizontal overflow; mobile/desktop hero images load and browser errors are
empty. Desktop and phone layouts visually reviewed. Existing upstream Vite
unused-import warning remains. No commits, pushes, deployments or purchases.

Review the built site at `http://127.0.0.1:4322/` (`npm run preview`, not HMR).
Earlier local Get Agent Ready, Terms and mva work remains intact and uncommitted.

## 2026-09-19 — LOCAL follow-on: research activity date is derived, not hardcoded

Supersedes the hardcoded September 19 context note described below. Sat requested
automatic freshness tied to ongoing corpus work. The evergreen agentic-internet
paragraph remains; its caption now says “Latest published research update,”
derived at build time from brief publication/correction/supersession dates,
live-node last_updated, published-report publication/corrections, and standing
record publication/modification dates. It explicitly says individual business
reviews carry their own dates. No current-time, deploy-time, stats.generated_at
or file-mtime fallback. Draft reports and non-live nodes do not advance it.

The shared pure helper is `scripts/research-dates.mjs`. Get Agent Ready JSON-LD
and sitemap lastmod both use the later of this activity date and the authored
page-copy date. No frontend JS, polling or per-visitor request. Publication of
dated corpus changes updates the caption on the normal com build/deploy path;
rebuilding unchanged research leaves it unchanged. Terms effective dates and
existing preview measurement dates remain fixed. This does NOT start, schedule
or verify a daily research pipeline, nor consume unpublished/private workflow
runs or the separate news feed. Latest qualifying local corpus date is currently
September 14, 2026, not September 19. Local only; no commit, push or deployment.

Verified: 35 com tests and all build gates pass (306 pages). Built caption is
September 14; WebPage.dateModified and sitemap both remain September 19 because
that is the later authored page revision. Controls prove new research advances
the date while draft/planned content and rebuild timestamps cannot. No external
research job or automation was added.

## 2026-09-19 — LOCAL: actual MVA examples and scoped visibility promise

Base HEAD `d888eff`. Sat approved replacing the generic $500 card with the
existing MVA format, retaining the page's look and lightweight frontend. The
optional example shows the published MVA first, with separate native disclosures
for the original preview and a fictional private review, plus the real preview
directory link. Three lazy, sandboxed static documents are generated from
`mva/src/preview-page.js` and the existing allowlisted Sample Bistro fixture by
`mva/scripts/render-sales-examples.mjs --write`. No real customer review is used.
The generated `provenance.json` records renderer, fixture, generator and asset
hashes; run the same script with `--check` before release. com builds independently
of mva. The demo strips entity schema, scripts and active links, carries noindex,
and stays out of sitemap, llms-full, nodes and host-map. Header policy is scoped
only to `/get-agent-ready/examples/*`; Astro dev does not apply Pages headers.

Visibility wording is now explicit in the offer, shared FAQ/JSON-LD and an
ADDED dated Terms clarification: a public, accessible, agent-readable page on
the AICV network after purchase matching, not guaranteed visits, indexing,
citations, recommendations or customers. Original website/Cloudflare work stays
separate. The September 19 note describes the agentic internet still forming;
it does not refresh the dates of the existing preview measurements.

Verification: 31 com tests + 7 focused mva tests pass; 306 Astro pages built;
pricing, ownership, amendment and complete-node-content gates pass. Only Get
Agent Ready and Terms changed among existing HTML pages. Diagnostic scripts and
Stripe destinations are byte-identical. All three local sample routes and Terms
return 200. No new frontend JS/dependencies, no purchase or paid diagnostic.
Local build disables IndexNow. The final network-enabled build loaded the
existing public news feed; only the prior Vite unused-import warning remains.
Browser visual/interaction QA was not rerun in this pass; Sat is reviewing locally.

Review: `http://127.0.0.1:4322/get-agent-ready/#profile-example` (4321 was already
occupied). No commits, pushes or deployments. Also local in mva: tier/state-aware
private-review next-step wording. Before any release, approve the visual draft;
commit mva source/generator and com assets/copy, then push com and deploy only
`aicv-activate` for the delivery-copy fix. No fleet rebuild, reseed or previews
Worker deployment is needed: public rendering is unchanged.

## 2026-09-19 — DEPLOYED and verified: Get Agent Ready + complete node records

Source commit `70ff923`, pushed to homepage/main. Git-triggered Pages deployment
`1f5265d8-684e-48a7-966e-059c4337ec3d` succeeded. All 79 live node JSON records
match the local build exactly; live Get Agent Ready and Terms HTML also match.
Real Chrome checks at 1440, 390 and 320px passed: no overflow open/closed,
native example toggle works, images load, Stripe URL unchanged, zero console or
HTTP errors. No production analysis or purchase submitted.

The dependent MCP Worker is now deployed (see its STATE). Both live cards agree
with the service. Existing aggregate edge metrics can inspect `/nodes/*.json`:
the post-release read returned 17 sampled path/status groups, all HTTP 200,
87 reported requests from 18:04:28–18:09:33 UTC. Includes this release's probes;
not a count of customers or proof of external demand. No new tracker was added.

## 2026-09-19 — Release preflight record

Sat authorized commit, push and deployment. The LOCAL entries below preserve
the pre-release review record; this entry supersedes their approval status.
Fresh release check: 29 tests, 306 HTML pages, all pricing/ownership/amendment/
node-content gates passed. All 79 complete records agree with rendered content.
Public feed access succeeded on the final network-enabled build; IndexNow was
disabled for local verification. No payment or production analysis was run.
Deploy com by Git first; verify node JSON before deploying the dependent MCP
Worker. Release hashes and live checks will be recorded after deployment.

## 2026-09-19 — Proof example and complete agent records. LOCAL follow-on; no commit/deploy.

Builds on the local page revision below, without discarding it. Added one native,
initially collapsed “See what $500 builds” example under the tiers; explicitly
fictional, no customer/entity schema, no live booking or private review exposed.
Premium promises an assessment/roadmap rather than guaranteed citations. The
hero, Choose Your Future, Who's already asking, wider layout and lower Cloudflare
guide remain. No price, Stripe/calendar destination, Terms or client-script change.

Agent fix: `/nodes/[slug].json` emits complete readable Markdown, canonical URL
and original content date from the same node collection/stats build as the human
page. Unknown authoring expressions fail rather than leak. The node sections of
`llms-full.txt` use the same adapter; reports/briefs retain their existing paths.
`nodes.json` remains the unchanged lightweight metadata index. The MCP Worker
will consume these records after release; see `../mcp/STATE.md` for the dependency
order. Public agent instructions/llms index document the new route and remove the
false 406 claim. No new frontend dependencies or JavaScript.

Verification: 29 com tests pass. Production build: 306 HTML pages plus generated
node JSON records; pricing, ownership, amendment and the new node-content gate
pass. All 79 node bodies match rendered human text and bulk export; largest record
13,630 bytes. Controls: valid comparison passes; injected wrong text fails. Node
Zero is complete at 12,820 characters, not the former 2,000-character excerpt.

Browser: nine widths 320–1920px, zero overflow with the example both closed and
open; native keyboard and JavaScript-disabled toggles work. Existing modals,
anchor navigation, three diagnostic fixtures and export pass; no unexpected
console errors. Existing hero/tool/card/CTA styles and scripts match the earlier
baseline. Only Get Agent Ready changes among HTML pages; Terms byte-identical.
HTML comparison controls: identical=0, injected Terms=1 localized change.

Evidence: `/private/tmp/gar-proof.Jnn7UM/` holds the pre-follow-on build and
example screenshots; the prior `/private/tmp/gar-before.4v8Ri2/qa-wide.mjs` harness
also passed. Existing upstream Vite/import and unavailable news-feed warnings
remain; they are not newly established production outages. Metrics read was
403/unavailable; the private product baseline records that and the still-unrun
assistant/Muse tests. Sampled Sensei editorial staleness is queued separately;
matching exports does not certify the authored facts are current.

Review locally at `http://127.0.0.1:4321/get-agent-ready/`. Nothing committed,
pushed or deployed. The earlier “no Worker deployment needed” statement below
applies only to that earlier copy pass, not this dependent backend repair.

## 2026-09-19 — Get Agent Ready copy/layout revision and capability register. LOCAL; not committed or deployed.

Base HEAD: `68cf500`. Revised after Sat reviewed the first local draft: use the
existing site's voice, not an outcome-first rewrite. Restored the agentic-internet
hero framing, Choose Your Future, Why networks win and Who's already asking;
removed the added three-outcome strip. The copy addresses business owners as
people ready to engage with AI agents and assistants. The internal three-outcome
framework remains in the capability register, not a compulsory sales template.

Existing pricing cards, tokens, type, diagnostic and purchase destinations remain.
The Cloudflare guide moved below the offer without losing `#agent-access`, the
optional checklist or scope limits. Desktop section containers use 80% of the
viewport from 1100px upward; the old FAQ 72ch and access-guide 85ch caps are gone.
Mobile keeps the existing gutters/stacking. FAQ answers are shorter, visible and
shared with JSON-LD. They remain open because the recorded rendered-text search
dependency has not been superseded by an indexing test of collapsed answers.
Muse is qualified as planned testing, not a delivered merchant integration. The
Business description still shares one string between visible copy and Service
schema. The page/sitemap modification date is September 19.

The internal home is `../playbook/GET-AGENT-READY.md`, linked from MVA.md,
AGENT-ACCESS.md and CLAUDE.md. It separates Watching / Testing / Offered, names
evidence, delivery boundaries and the decision owner, and records a bounded
Muse/Stripe pilot as proposed, not started. No new price, contractual entitlement,
customer account connection or backend implementation was introduced.

Verification, September 19:

- `npm --prefix /Users/sunshinefm/AICV/core/com test`: 23 passed (existing
  diagnostic tests plus approved-copy/order/scope/FAQ regression checks).
- `AICV_NO_INDEXNOW=1 npm --prefix /Users/sunshinefm/AICV/core/com run build`:
  306 pages; pricing, ownership and amendment gates passed. IndexNow disabled
  deliberately for local verification. Corpus counts unchanged: 79 nodes,
  178 briefs, 14 report endpoint entries.
- Fresh pre-edit versus post-edit builds: only `get-agent-ready/index.html`
  changed among HTML pages. Comparison controls on the new build: identical
  inputs = 0; injected Terms change = exactly 1 localized change. Terms stayed
  byte-identical. Page HTML 66,197 → 63,300 bytes; non-JSON-LD client scripts
  byte-identical. Stripe and calendar destinations unchanged. No new dependencies.
- Rendered FAQ answers equal FAQPage answers; visible Business description equals
  Service description; JSON-LD and sitemap dates agree; local links/anchors resolve.
- Browser checks at 1920, 1440, 1100, 1024, 900, 768, 560, 390 and 320px found
  no horizontal overflow. FAQ width measures 80% of the viewport on desktop
  (1100px+). FAQ answer text is 471 words versus 695 in the pre-edit build,
  measured from rendered paragraphs. Existing hero/tool/card/CTA/nav colors,
  fonts, padding and radii match
  the baseline. Desktop/mobile screenshots inspected. The native checklist,
  included-scope Close buttons, Terms modal, access anchor and diagnostic focus
  work. Existing behavior retained: Escape closes Terms, not the included-scope
  modals; this was confirmed on the pre-edit baseline, not introduced here.
- Normal, access-only and service-error diagnostic responses were exercised with
  local fixtures; JSON export retains access evidence. No production diagnostic,
  reservation, payment or account-setting changes. No unexpected browser errors.

Both before/after local builds had the same upstream Vite unused-import warning
and unavailable aicv.news feed warning in this environment. Neither is a new
regression; the homepage output compared identical. This is not a production
availability finding.

Local QA evidence: `/private/tmp/gar-before.4v8Ri2/` (baseline, `wide-*.png`
screenshots and `qa-wide.mjs` comparison/browser harness). The preview server is
localhost-only on port 4321. Sat explicitly requested local-only review; no
commit, push or deploy is authorized by this revision.

Commit/deploy gate: review and approve the com edits and playbook edits separately.
Push com only after approval (Git-triggered Pages deployment), verify the page,
then update release evidence. No Worker deployment is needed. The playbook had
one pre-existing unpushed commit (`a7c965d`); it was preserved and not pushed by
this session. September 15 below is a historical entry, not current edit status.

## 2026-09-15 — Agent Access diagnostic and owner-assisted SAT scope. LOCAL; awaiting commit/deploy approval.

Base HEAD read from disk: `fa6c95f`. Changes are uncommitted and not deployed.
The result card and Markdown/Text/JSON exports distinguish observable access
from unverified Cloudflare Search/Agent/Training settings. Blocked/unreadable
pages can return an access-only report; content-only verdicts carry the access
limitation. The public checklist is `get-agent-ready/#agent-access`; a dated
scope supplement is at `terms/#agent-access`. Business/Premium include an
owner-assisted review where Cloudflare applies; the $500 profile purchase does
not include an account audit or configuration work. Existing paid terms,
Stripe link, purchase matching and activation code are unchanged. FAQ visible
copy and JSON-LD share one array; Business description also shares one string.

Verified September 15: `npm test` 14 passed; production build 306 pages, pricing,
ownership and amendment gates all passed. Built-output comparison versus a
fresh pre-edit build: only `get-agent-ready/index.html` and `terms/index.html`
changed among HTML pages; the page stylesheet was replaced, sitemap date was
updated, and stats/content-dump differences were generation timestamps only.
Comparison harness controls: identical input = 0 changes; injected Terms hash
change = exactly 1 localized change. Stripe URLs compare identical. Corpus
counts unchanged: 79 nodes, 178 briefs, 14 reports.

Browser QA used a localhost fixture server with the real result renderer, not
the production paid diagnostic: normal, blocked/access-only and missing-robots
cases behaved as expected, guide/Terms link worked, and no console warnings or
errors were observed. Model calls, production rate limits and customer account
settings were not used or changed. Backend tests/dry-run/live-public-fetch
evidence live in `../api/STATE.md`; owner checklist in `../playbook/AGENT-ACCESS.md`.

Commit/deploy order after approval: API source/push + Worker deploy first; com
source/push (auto-deploy only) next; playbook docs/push. Verify live behavior and
record deployment IDs before replacing this LOCAL status. A fresh public fetch
alone cannot verify SAT; that remains owner-assisted by design.

## 2026-09-14 — Agent-payment language reconciled with the Sept 10 Stripe Link brief; `supersession` becomes a record field. DEPLOYED — com `238c735` (Pages deployment `46f0f75b`, live within 60 s of push), mcp `b0a3f75` (worker version `0aff2a73`), playbook `cf522c0`.

**Verified on production, 2026-09-14 (Sat's go).** Two consecutive clean
whole-sweeps (per the fleet-deploy rule): all six amended brief pages carry their
notices, the Updated line and truthful JSON-LD dates; `/get-agent-ready/` serves
the rewritten FAQ and `dateModified` 2026-09-14; `briefs.json` = 178 entries,
6 amended, all supersessions carry `successor_url`; `llms-full.txt` = 178
brief sections, 3 with supersession and 4 with correction lines; `sitemap.xml`
= 279 locs with the six lastmods. The live desk (`get_regional_brief`) now
returns `correction`/`supersession`/`date_modified` on amended briefs and
nothing extra on unamended ones. **AI Search `aicv-com-corpus` is STALE**: a
query on the old assertion returns the 05-17 and Shopify pages with pre-deploy
wording (top chunk score 0.999, stale=true, fresh=false). Query access works;
resync access does not (the shell token is zone-scoped, wrangler has no
AutoRAG command) → **open item: trigger a re-crawl from the dashboard, then
re-query.** Wayback Save Page Now returns 401 today; the Stripe URL still has
only a 307 capture (2026-09-13) → open.

**Trap met while verifying:** zsh does not word-split an unquoted `$var`, so
`node desk.mjs $r` passed "2026-09-10 2026-09-10" as ONE argument and the desk
looked broken (empty, then unfiltered). The desk was fine. Split explicitly
(`${R% *}` / `${R#* }`) or quote each argument.

**Why.** Stripe's September 8 announcement (Muse pays via Link; a single-use
virtual card scoped to the approved purchase everywhere Link is not accepted)
displaced a reading three 2026 briefs carried as fact: that a merchant must wire
an agent checkout to be paid by an agent. The Sept 10 brief (`2ee7bf3`) said
"this supersedes the May 2026 reading" in its own Agent Signal — which labels
nothing on the May record. A note in the successor does not mark the
predecessor; an agent reading the May brief alone still got the old conclusion,
and `/get-agent-ready/` still sold agent-payable endpoints as the road to
agent-mediated payment.

**Convention (first use of the field).** OPERATING-RULES §5.3 already
distinguishes the two events; the briefs collection now carries both as
frontmatter, so the page and the feed cannot disagree:

- `correction: [{date, summary}]` — a claim that was WRONG when published. Fixed
  in place under the dated note. (Existing since 2026-08-29.)
- `supersession: [{date, summary, successor_url}]` — a reading that was
  defensible when taken and has been DISPLACED by a later development. The body
  is NOT edited; the notice is claim-scoped (names the section and the
  conclusion) and `successor_url` is required. (New today.)
- **Modification date is DERIVED, never authored:** `scripts/brief-dates.cjs`
  returns the latest of publication + every amendment date. One function, three
  consumers — JSON-LD `dateModified`, sitemap `<lastmod>`, and `briefs.json`
  `date_modified` (present only on amended records, so 173 of 178 feed entries
  are byte-identical to the pre-patch build). Before today both dateModified and
  lastmod reused the publication date, so the T&W census brief corrected on
  2026-08-28 told every machine reader it was untouched since June. That is
  fixed by the same derivation (`2026-06-14 → 2026-08-28`).
- Rendered: `.supersession-note` (teal rule, links the successor) is visually
  distinct from `.correction-note` (gold rule); an "Updated <date>" line sits
  under the dateline on any amended brief. Raw frontmatter reaches
  `llms-full.txt` as before, so the notice and successor URL are in the dump.

**Amended records (6).**
- `2026-05-17-stripe-collison-agentic-commerce` — supersession, scoped to the
  Context "four requirements" and the Agent Signal prerequisite; AND a
  **correction** (Sat's go, 2026-09-14): "invisible regardless of how well they
  rank" (Context) and "not findable via compliant agentic discovery paths" (Agent
  Signal) conflated payment with discovery and were unsupported when published.
  Both sentences revised in place to "harder to evaluate and to transact with
  through protocol-native paths"; originals quoted in the note.
- `2026-03-09-agent-web-liz-reid` — **correction** (Sat's go, 2026-09-14): "not
  findable by agents regardless of their web presence quality" contradicted the
  brief's own Signal (Autobrowse, Mariner operate ordinary sites) and the census
  method. Revised in place; original quoted in the note. Not a Stripe
  supersession.
- `2026-03-03-shopify-agentic-commerce` — supersession, scoped to "either the AI
  can transact with you, or it moves on" and the agentic-transaction use case.
  Shopify channel reporting and the dated forecast stand. Body untouched.
- `2026-03-03-qualcomm-year-of-agents` — supersession, scoped to the
  agent-to-agent commerce use case only. Body untouched.
- `2026-09-10-stripe-link-agent-wallet-single-use-cards` — **correction**, and
  revised in place: "can take a card today can be paid by an agent today", "any
  card-accepting merchant" and "legibility becomes the whole of it" went beyond
  Stripe's text (US consumers, Meta's Muse, an approved purchase, a checkout the
  agent can complete). Now scoped; adds that a card establishes a payment route
  and not availability, eligibility, checkout accessibility or fulfillment, and
  that census-measured constraints (inquiry-only booking, invitation-only,
  undisclosed price) stand regardless of payment. Direct Stripe newsroom URL
  added to Context so the primary source is in the record, not only AICV News.
  Re-verified on the wire 2026-09-14: Stripe's page also says the wallet was
  introduced "earlier this year" and "helps power payments for Grok Bot and
  Instinct" — added to Context. NOT added, because they are not on Stripe's page
  and TechCrunch (2026-04-30) does not carry them either: the $5,000/request,
  $5,000/day, $20,000/month limits, the 12-hour card validity and 10-minute
  approval window, and "Link purchase protections" that secondary blogs report.
  Unverified against a primary source → not in the record.
- `2026-06-14-agent-mapped-talent-workforce-census` — no text change; gains the
  truthful derived `date_modified` from its existing 2026-08-28 correction.

**Reviewed, deliberately unchanged.** `2026-09-10-mastercard-…` ("payment
without merchant integration" is Stripe's mechanism stated accurately, inside a
forecast-vs-measurement framing that stands). `2026-07-30-…settlement-layer`
(discovery/payment separation is the point this update confirms; activation
details are dated history, not tier promises). `2026-05-19-google-gemini-spark`
(AP2 scope is architectural, not a merchant gate). `/minimum-viable-agent/`
line 121 lists future capabilities without making them a precondition.

**`/get-agent-ready/` FAQ.** The agent-payment answer (JSON-LD FAQPage, entry
10) no longer frames Premium agent-payable MCP endpoints as the route to
agent-mediated payment. It now says: a dedicated integration is not always
required; supported agents can pay through existing checkout and card routes
subject to user approval and checkout compatibility; AICV's work is upstream
(understanding + official action path); the Premium roadmap commitment
(agent-payable MCP endpoints, capability planning, priority deployment) is
preserved verbatim in intent and labelled a separate capability, not a
prerequisite; membership is not a condition of an agent recommending or paying
a business. Page `dateModified` 2026-05-28 → 2026-09-14.
⚠️ **Pre-existing, NOT fixed here:** the whole FAQPage has had no visible
counterpart since V2 (`624f71d`, 2026-05-07) — ten agent-only Q&As; and entry 9
("What ships this summer?") is stale in September. Both need a founder call.

**Gates.** `AICV_NO_INDEXNOW=1 npm run build` green. Counts unchanged
(79 nodes / 178 briefs / 14 reports / 306 pages / 279 sitemap locs). New
`scripts/check-amendments.mjs` runs in `postbuild` after check-ownership: per
brief, derived from frontmatter (no slug list), asserts page ∧ briefs.json ∧
llms-full.txt ∧ JSON-LD ∧ sitemap agree, unamended records carry no amendment
keys, successor URLs were built, counts reconcile. Proven against the pre-patch
build via `--dist/--public`: **39 failures there, 0 here.** Independent
frontmatter reading (js-yaml) cross-checks the hand parser.

**Cross-repo work applied on Sat's go (each UNCOMMITTED in its own repo).**
- **aicv-mcp `get_regional_brief`** dropped every amendment: it returned
  slug/title/description/date/tags + a 1,000-char body excerpt with frontmatter
  stripped, so neither `correction` (since August) nor `supersession` reached a
  desk reader. `~/AICV/core/mcp/worker.js` now spreads `correction`,
  `supersession`, `date_modified` through from the briefs.json entry it already
  holds; unamended briefs return exactly what they did. Order: com deploy first
  (the keys must exist on the live feed), then commit → `wrangler deploy` →
  verify with a `get_regional_brief` call on the 05-17 slug.
- **Playbook `CLAUDE.md`** Intelligence Brief schema now documents both optional
  amendment fields, the one-line-JSON rule, and that the modification date is
  derived, never stored.
- **AI Search `aicv-com-corpus`** indexes sitemap locs; the amended pages need a
  re-crawl before a query on the old assertion returns the scoped answer. Open
  verification item post-deploy (SURFACE-INVENTORY Class H).
- **AICV News (not touched — other desk).** The live field note's standfirst says
  "if a customer can pay you with a card today, Stripe says, an agent can too."
  Stripe does not say that; it is the same overreach corrected in the 09-10
  brief, attributed to Stripe. Handed to the news desk, not edited here.

**Founder decisions.** Items 1 and 2 (Liz Reid correction; 05-17 discovery
correction) APPLIED on Sat's go 2026-09-14 — see amended records.
**"What ships this summer?" DELETED (Sat's "get up to date", 2026-09-14).** It
promised a public Ask AICV chat interface, an AICV Network member directory and
member-scoped query access; none of the three exists on the site (grep of
src/pages and llms.txt: zero pages), so there was nothing truthful to restate
and a September page cannot carry a summer promise. FAQPage is now 8 Questions.
Fix by deleting the claim, never by substituting one.
**VISIBLE FAQ SECTION ADDED (Sat, 2026-09-14, "so AI Search can index it").**
One `faq` array in the page frontmatter now drives BOTH the FAQPage JSON-LD
`mainEntity` and a rendered "Frequently asked." section (`#faq`, matching the
FAQPage `@id` fragment) — the records collection's pattern, so the two
surfaces cannot drift; proven in dist: 8 visible h3/p pairs == 8 JSON-LD
Questions, equal in order. Answers are OPEN (h3 + p), not `<details>`: text
indexers read rendered text and a closed `<details>` is not rendered. One
deletion in the copy while making it visible: "at the Free AICV Listed tier"
(a tier name that exists nowhere else on the page since the 2026-08-20
restructure) removed from the lapse answer; nothing substituted. ⚠️ That
answer ("What happens if we stop paying?") and its neighbours still use
pre-restructure vocabulary (Agentic Review portal, Deployment Fee, Tier 4,
"economic-development platform") — approved copy, now human-visible, needs
Sat's read against the 2026-08-20 Terms. **AI Search must be re-synced from
the dashboard before the FAQ appears in the corpus.**
**AI Search re-synced by Sat from the dashboard, re-queried 2026-09-14 — CLOSED
with two findings.** Chunk text lives in `chunk.text` (the first probe read
`content` and saw nothing). On the old-assertion query the top 05-17 chunk is
the September 14 notice + revised Context (score 0.999); on a query for the
notices themselves the Qualcomm, 05-17 and Shopify notice chunks rank 0.999;
the Liz Reid page returns its correction at 1.000. Every "stale" phrase that
co-occurs with fresh wording is a correction note QUOTING the withdrawn sentence
— by design.
1. **Body chunks of SUPERSEDED briefs still carry the original sentence, alone.**
   Shopify "cannot participate" (0.640) and Qualcomm "cannot complete the sale"
   (0.430) surface as body chunks without the notice, which sits in the page's
   first chunk. Supersession does not edit the body, so this is the §7.18
   atomicity limit at chunk level, not a stale index: the notice outranks the
   body chunk on every query tried, but a retriever that lifts one chunk lifts
   it without the caveat. Recorded, not fixed; fixing means either editing
   superseded bodies (convention forbids) or a chunk-level marker (design call).
2. ~~**The FAQPage is invisible to AI Search entirely.**~~ **WRONG — corrected
   the same day.** After the SECOND dashboard sync, FAQ-shaped queries returned
   a `/get-agent-ready/` chunk that IS the FAQPage JSON-LD as text (it carries
   `"@type":"Question"` and `acceptedAnswer`), so AI Search does index script
   JSON-LD; my payments query simply had not surfaced that chunk. The chunk
   was STALE, and that is the real finding: it still held the old payment
   answer (replaced 10:30), "Free AICV Listed tier" and the deleted "What ships
   this summer?" entry — the page as it was before this morning's first
   deploy — and the homepage chunk lacked the "Latest from AICV News" band
   deployed 14:17. **Two dashboard syncs re-fetched every brief and no static
   page.** The one difference: briefs carry a sitemap `<lastmod>` (moved to
   2026-09-14 by the amendments), static pages carried none. The corpus did
   hold the 2026-08-20 tier copy, so static pages were re-fetched at some
   point between Aug 20 and today — not by a dashboard sync since.
   **FIX:** `src/data/page-dates.json` is now the single source for a
   hand-written page's modification date, read by the page's own JSON-LD
   `dateModified` AND by `sitemap.xml.ts` `<lastmod>` (pricing.json pattern);
   index pages derive lastmod from their newest entry; the homepage from the
   newest of those. MVA and how-we-do-this were hand-set 2026-05-20 /
   2026-07-17 while git shows both rendered pages last changed 2026-08-10 —
   set to what git proves. `/cvep-what-happened/` has no date claim and gets
   none. **Hypothesis, not yet proven: a dashboard sync re-fetches on a moved
   lastmod.** Sat's THIRD sync tests it; if the visible FAQ and the homepage
   band then appear, it holds. If not, the crawler's re-fetch trigger is
   something else and the still-stale static pages become the open item.
   The visible FAQ section (above) stands on its own merits either way.
   **PROVEN, same day — and the third dashboard sync was not the proof.**
   `npx wrangler@latest ai-search jobs list aicv-com-corpus` shows ONLY
   scheduled jobs, one every ~6 h 10 min; **none of Sat's three dashboard
   clicks created a job.** The 18:10 UTC scheduled job (40 min after the
   briefs deploy) re-embedded exactly the 6 amended briefs; a job I triggered
   with `jobs create` (`4b01d319`, 25 s) after the lastmod fix re-embedded
   exactly 5 — the pages whose new lastmod is newer than the 2026-08-08 index
   (/, /briefs/, /get-agent-ready/, /minimum-viable-agent/, /how-we-do-this/);
   nodes/ and reports/ carry July dates and were skipped. A minute later the
   visible FAQ heading and the new payment answer were in the corpus and the
   old answer, "AICV Listed" and the summer entry were gone. **Convention from
   here:** bump `src/data/page-dates.json` whenever a hand-written page's
   rendered content changes, then either wait ≤6 h or run
   `npx wrangler@latest ai-search jobs create aicv-com-corpus`. Mechanics
   recorded in playbook SURFACE-INVENTORY Class H (`c5f39f0`, scoped in the
   follow-up commit). **Scope of the proof, so it is not over-read:** a moved
   lastmod is a SUFFICIENT trigger (two jobs, exact sets). It is not the only
   one — the 05:50 UTC scheduled job re-embedded 4 files with no lastmod moved,
   mechanism unidentified. **Homepage caveat:** its corpus copy carries the
   Sept 10 briefs strip (so it was re-fetched today, by inference in that
   05:50 job) but NOT the 14:17 "Latest from AICV News" band; the 21:46 job
   skipped it because its new lastmod (2026-09-14) is not newer than a
   same-day stored date. Expected to arrive on the next day's cycle or the
   next lastmod move; not worth forcing — the band is outbound to aicv.news.
   Job history for the record (UTC, embeds): 09-10 e6c7e6c7 → 4 (the four
   new briefs; 275→279 files); 09-11..13 → 0; 09-14 05:50 → 4; 12:00 → 0;
   18:10 → 6 (amended briefs); 21:46 user → 5 (static pages with a newer
   lastmod). `wrangler ai-search jobs logs` gives counts, never names.
Playbook §7.18 (the other session's rule) committed as `4738fa9` on the same
instruction.

Journal: sealed since 2026-08-10 — no line item, by design.

## 2026-08-20 — Tier restructure copy: the $500 stops promising verification. BUILT, NOT DEPLOYED.

**Founder ruling (2026-08-20).** The $500 Agent Ready tier is a HOSTED PAGE, not
an attestation. Owner-verification moved UP to $2,500 and $10,000, where
onboarding starts with a call. mva shipped the code in session 1 (`c3125b3`,
`47cc5d9`, `6fd7800`, `e9fe86f`) — **this repo is the blocker on that deploy**,
because .com currently promises a verification step the tier no longer has.

**⚠️ ORDER IS LOAD-BEARING: com ships FIRST.** mva's workers must not go live
while Terms still says "Your page goes Live only after you verify that you own or
represent the business."

**FOUR SURFACES CORRECTED.**
- `/get-agent-ready/` "what's included" modal — the owner-verified bullet is
  DELETED, not substituted. Two real deliverables that were never listed take
  its place (facts in machine-readable form; named in the index agents read).
- `/terms/#agent-ready` — effective date **July 25 → August 20, 2026**; the
  entire "What you must do: verify ownership" section deleted; Timing rewritten
  (page Live on payment, no queue); Refunds replaced. **"business profile page"
  is now a DEFINED TERM**, scoped in "What you get" to the one page this tier
  publishes — not the free preview, not any other page AICV writes. Removal now
  states that `remove@aicv.co` covers the free preview too.
- `llms.txt` + `llms-full.txt` — member section SPLIT into two named groups.
- mva `activate` worker — activation page and success page (own repo).

**THE REFUND PROMISE IS NOW UNCONDITIONAL WITHIN 14 DAYS**, where it was
conditional ("if your page can't go live, or you change your mind before
verification"). Deliberate expansion, founder-accepted at current volume.

⚠️ **"EVERY" WAS DROPPED FROM THE REFUND LINE BEFORE IT SHIPPED.** The approved
wording read "the free preview we publish about **every** business in our
census". We do not: builds exclude rows (food-dining 453 in → 441 published), the
Outdoors roster excluded 90 non-commercial entities, and the standing
home-daycare privacy ruling excludes 46. Harmless in place — anyone reading that
sentence necessarily HAS a preview, since you can only buy the upgrade to a page
that exists — but it was going into operative Terms, and a universal quantifier
in operative terms is the kind of word that gets quoted back. Now "…about
businesses in our census", on all four surfaces.

The unrelated "every business" claims on `/how-we-do-this/` and in the category
reports were left alone deliberately: those are about COUNTING a category
exhaustively, which the censuses do, not about publishing a page for each.

⚠️ **"WE'LL TAKE YOUR PAGE DOWN" MEANS THE CLAIMED PAGE, NOT THE URL.** Traced
before the wording was set: refund and `/api/admin/removal` both do
`retractClaim()` + `status='private'` and nothing else. The URL keeps serving —
it reverts to the unclaimed preview, which is public and, for 1,364 of 1,568
published pages, indexable. The only true removal is `exclusions.json` →
`drift_held`, a manual build-time act. Terms therefore defines the term rather
than implying a takedown the code cannot perform.

**WHY THE MEMBER SECTION IS SPLIT AND NOT NEUTRALLY WORDED.** Neutral wording
true of both classes has to drop verification entirely — safe, but it erases what
the upper tiers buy, on the surface agents read first. The risk is asymmetric in
TIME: self-serve members appear first and automatically (payment publishes),
attested members need a call. Neutral wording would read fine for months, then
silently under-sell the first premium customer. `previews-claimed.json` gained an
ADDITIVE `tiers` map — `slugs` remains the contract, so `resolveMembers()`'s
hard-fail guard is untouched and an absent tier reads as self-serve (the weaker
claim). Grouping is shared via `partitionMembers()` so the two surfaces cannot
describe the same member differently.

**BUYER SURFACES DO NOT NAME `llms.txt`** (founder ruling). "Agent Ready" is the
promise; a filename invites "what's that?" at the moment the buyer should feel
the outcome. Terms keeps the concrete version WITH the filenames — a vague
promise is harder to defend than a specific one, and Terms is where specific
belongs.

**VERIFIED LOCALLY, positive control first.** Built from HEAD with the changes
stashed, then rebuilt: **4 of 346 files differ — `get-agent-ready/index.html`,
`terms/index.html`, and two build TIMESTAMPS** (`stats.json` `generated_at`,
`llms-full.txt` `# Generated:`), both byte-identical with the stamp line
excluded. 2 of 302 HTML pages changed, exactly the two intended. `llms.txt`
unchanged (zero members). Pricing gate ok — 4 tiers, JSON-LD consistent, 10
identity surfaces clean. Ownership gate ok — 299 non-exempt pages. Corpus sweep
for residual $500 verification promises: clean.

**llms AGREEMENT PROVEN WITH A FIXTURE, three shapes** — one of each class,
attested-only, and self-serve-only. Same groups, same members, no member in two
groups, each named once. The self-serve-only shape emits **zero** occurrences of
"Owner-verified", which is the false-attestation guard. Fixture removed; the
committed file is back to zero members.

## 2026-08-10 — Brief filed: the Agent Preview audit piece. Live and edge-verified.

Brief `2026-08-10-agent-preview-audit-1566-pages` filed, pushed (commit
`6a94918`, range `a9ee3bd..6a94918`) and **edge-verified agent-visible**. Push of
the `.mdx` alone published every surface; the data artifacts are gitignored and
CF regenerated them in-cloud, so no `content(data)` commit exists. Local
`npm run build` passed at **307 pages** before the push, per the build-verification
rule.

**Verified on the wire, by content and not by status code, polled rather than
read once.** The deploy took roughly two minutes: four polls returned 404 with
`briefs.json` at 173, the fifth showed `briefs.json` 174 while the page was still
404, the sixth was consistent. Then four consecutive stable reads: HTTP 200,
correct `<title>`, and the distinctive marker "43 is a floor, not a total"
present twice. `briefs.json` **173 → 174** · `/sitemap.xml` **279 → 280** with
the brief present · `llms-full.txt` carries the title · JSON-LD `NewsArticle`
with `datePublished`/`dateModified` `2026-08-10`, canonical url and publisher
correct · all three Related Nodes return 200.

**The piece leads with the correction, not the completion.** 1,566 pages across
six merchant categories, 1,362 sitemapped, from 1,744 roster entries. The audit
found 43 pages that had measured a web address the business does not control and
called it their website — 27 same-day, **16 wrong since the day their own
category shipped**, because the audit that found them did not exist yet. "43 is
a floor, not a total" appears three times by design; `attribution.json` states it
as `_recall_is_a_floor` and says do not cite 43 as complete.

**Deliberately omitted: a corpus-wide crawler-refused rate.** The 2026-08-08
finding is that `agent_visibility_class` is partly a function of probe cadence on
AI-throttling hosts, so a headline rate would assert precision the corpus itself
disputes. The per-category reports carry their own rates with their own
denominators.

**No brief-count anchor was bumped, and none should be.** Every count in this
file and in playbook `STATE.md` sits inside a dated entry, and the live figure is
derived by `generate-stats.mjs` counting `src/content/briefs/*.mdx` at build
time. The canon step "update the brief count" is satisfied by this entry.

**Side effect worth knowing: `/sitemap.xml` is now 280, matching AI Search's
indexed item count exactly. That is a coincidence, not a reconciliation.** The
279-vs-280 delta was explained and closed on its own merits earlier the same day
by querying the instance directly. Recorded in playbook `HANDOFF.md` (`c2fadd4`)
so a future session does not read the matching numbers as a fix.

**DEFERRED, not done: the journal line item.** The briefs canon calls for a
journal entry in `sunshine-fm/journal/index.html` using the documented marker.
That is a different repo with no auto-deploy — it needs its own build and
`wrangler` deploy — and it was outside the authorised scope of this run. It is
the one open side effect from this publish.

## 2026-08-08 — Vocabulary sweep, part 1: the product is "Agent Preview". One name.

**FOUNDER RULING.** The free diagnostic had **four** names — `Agent Preview`
(canonical in `pricing.json` and `llms.txt`), `Agent-Readiness Review` (12
occurrences), `AIO Visibility Report` / `AIO Visibility Grade` / `AICV AIO Tool`
(6), and the retired `AIO Tool`. All 18 non-`terms.astro` occurrences are now
**Agent Preview**.

**The map that made this rulable — seven of eight things were already clean.**
The whole problem was one thing with four names, plus two collisions:

- **`agent-readiness review` lowercase is a DIFFERENT PRODUCT** — the $500
  Agent Ready private deliverable, released on payment, never published. It
  differed from the free tool's alias **only by capitalisation**. A
  case-insensitive find-and-replace would have renamed a paid deliverable into
  the free one, in four places. **This is why the sweep was scoped by product,
  not by string.**
- **`Agentic Review`** is the Premium tier's LLM Council deliverable, canonical
  in `pricing.json:53`. One hyphen from the swept term. **Untouched.**

**APPROVED NAME, LANDING DEFERRED — "Your Agent Ready Report".** The $500
deliverable gets a name derived from its TIER, not from the tool: it tells a
buyer which purchase produced it, and "Report" vs "Preview" is a distinction
that survives without a glossary. **Not written in this commit** — two of its
three instances are in parked `terms.astro`, and renaming only the storefront
would leave the TOS and the site naming the same deliverable differently.
**The TOS revision session inherits this name rather than re-deciding it**, and
lands all three together.

**`terms.astro` KEEPS the old vocabulary — knowing, not oversight.** Its four
`Agent-Readiness Review` instances include a section HEADING that defines a
governed legal scope; renaming it changes what the section is about, not just
what it is called. So the TOS names the tool differently from the rest of the
site until it is revised with counsel.

**Also fixed:** `get-agent-ready.astro` said "Your Agentic Review portal
**(Tier 2)**" — Agentic Review is Premium, the fourth tier. The parenthetical
is **dropped rather than corrected to "(Tier 4)"**: a hard-coded ordinal is an
anchor that breaks if the ladder is ever reordered, the same failure mode as a
pinned count. The sentence already names the product.

### FINDING — the homepage diagnostic is ~180 lines of orphaned dead JavaScript

Recon into whether the retired grading posture had leaked into the export path
answered a different question. **The homepage widget's MARKUP was removed
(2026-04-27, `472a47c`) and its JavaScript was never deleted.**

Evidence: `aio-input`, `aio-result`, `aio-section` and `id="diagnostic"` exist
**nowhere in the built homepage — not even inside the JS**. Meanwhile
`scoreGrade`, `aio-copy` and `Enter any public URL` exist **only inside the
JS**, never in markup. So `document.getElementById('scoreGrade')` resolves to
**null**, and the next line assigns `.textContent` on it — the render function
would throw before displaying anything. **No user can reach this output.**

**So the de-verdicting did NOT miss the export path.** It reached the live
tool: `get-agent-ready.astro:1032` still carries the note *"Score/grade/gauge
styles removed — the tool no longer renders a verdict."* The homepage grade
code was already orphaned when that ruling landed, which is why nothing swept
it. **Dead code does not appear in a scope list drawn from live surfaces.**

The AIO strings there were renamed anyway, per the ruling — harmless, and they
do ship in the JS bundle where a scraper could read them. **But the real fix is
DELETION of the orphaned block, not renaming it.** Not done here: it is a
~180-line removal on a page outside this sweep's scope, and it wants its own
gate. `/get-agent-ready/` remains the one live diagnostic.

---

## DONE 2026-09-16 — deleted the orphaned homepage diagnostic widget (opened 2026-08-08)

**Cleared in `index.astro` (commit this session).** The single orphaned `<script is:inline>` block (197 lines) was removed; the homepage now ships no JS and loads with zero console errors (verified in a browser on production). The original QUEUED note is kept below for the record.


**~180 lines of dead JavaScript on `index.astro`.** The widget's MARKUP was
removed on **2026-04-27 (`472a47c`)** when the diagnostic moved to
`/get-agent-ready/`; **the JS was never deleted.** It currently calls
`document.getElementById('scoreGrade')` — an element that exists nowhere in the
page — and assigns `.textContent` on the null result, so the render function
would throw before displaying anything. **No user can reach it.**

Evidence on disk: `aio-input`, `aio-result`, `aio-section`, `id="diagnostic"`
appear **nowhere in the built homepage, not even inside the JS**, while
`scoreGrade`, `aio-copy` and `Enter any public URL` appear **only** inside the
JS. Markup gone, handlers left.

**Deletion supersedes the 2026-08-08 rename.** The AIO strings there were
renamed to Agent Preview for consistency and because they ship in the JS bundle
where a scraper can read them — but the block should go, not be relabelled.

**Its own session and its own gate.** Low risk by nature (dead code, one page),
but it is a homepage change, the block is large, and the boundary between
orphaned and merely-unused code wants deliberate reading rather than a grep.
`/get-agent-ready/` remains the one live diagnostic and is not affected.

---

## OPEN QUESTION — /get-agent-ready/ has nine FAQPage questions and no visible FAQ (found 2026-08-08)

`get-agent-ready.astro` emits a **`FAQPage` block carrying nine questions** —
pricing objections, the Deployment Fee, "Does AICV touch our website?", "What
happens if we stop paying?", "Who owns AICV?", and more — and **none of them
render anywhere on the page**. Verified by stripping every `ld+json` block from
the built HTML and searching the remainder: zero matches, and the page has no
FAQ section at all.

**This is a rich-results exposure.** Google's FAQPage guidelines require the
marked-up Q&A to reflect content visible to users on that page. Nine
questions of structured data with no visible counterpart is the shape that
gets rich results suppressed, and potentially the surface flagged.

**The fix is probably to RENDER them, not to remove the markup.** These read as
questions a human buyer genuinely has — the fee split, what happens on
cancellation, whether AICV modifies your site. Rendering them resolves the
exposure *and* improves the storefront; deleting the markup resolves the
exposure and loses nine good answers. **Needs a founder ruling on which
questions render and in what form** (full accordion, a subset, or a link to a
dedicated FAQ page).

**Not a defect introduced by the entity work** — the block predates it. Found
while confirming that the "Who owns AICV?" header had no visible counterpart to
keep in sync, which it does not: on this page that question is JSON-LD only,
unlike the `aiqna` FAQ where both halves exist and must move together.

---

## 2026-08-08 — .com is commercial. Four passes to say so, and the scope lesson that cost.

**FOUNDER RULING, reversing prior canon.** Neither domain is a legal entity.
**SunshineFM LLC** (a real California LLC) owns **aicoachellavalley.com** as a
commercial sub-brand — Stripe account and all charge descriptors are the LLC.
**Desert Community Foundation** (501(c)(3)) fiscally sponsors
**aicoachellavalley.org**. AICV is a brand appearing on both sides of that
ledger; legally it owns nothing and is nothing.

Five commits, **UNPUSHED at time of writing** — `6aa26d1` (machine surfaces),
`e243b6e` (FAQ structured data), `0b00c90` (visible copy + corpus),
`b6cb0a7` (DCF nodes scoped to .org), `b20d887` (node retirement).
Production is uniformly pre-correction, so **there is no public window where
the layers disagree** — that only becomes true if part of the stack ships
without the rest. Push them together.

**THE SCOPE LESSON — the reason this took four passes.** Every scope drawn was
narrower than the actual defect surface:

- **Aug 7** removed *"AICV is a nonprofit"* but deliberately PRESERVED *"AICV
  is fiscally sponsored"* as true and compliant. Correct against the canon it
  had; wrong the moment the founder ruling landed.
- **Piece 1** scoped to entity **NODES**. Entity **CLAIMS** in FAQ structured
  data — same JSON-LD payload, same page — fell outside it, so each page told
  an agent two incompatible things.
- **Piece 1's file list** named `get-agent-ready` and `aiqna`.
  **`index.astro`'s JSON-LD fell in the seam between two scopes** — the
  homepage `Organization` node, the most-consumed entity claim on the site,
  was nearly the last thing still asserting DCF.
- **Piece 2's file list** missed six corpus instances and three frontmatter
  fields.

**The generalisation: on .com the boundary is "what an agent can read and
conclude," and that boundary has been wider than every file list drawn against
it. Scope by governing test, not by enumeration.** A list is a record of what
was known when it was written; the test survives contact with what wasn't.

**FOUR BLIND SPOTS, and they are structural rather than careless.** Each one is
invisible to a particular *kind* of scope:

1. **Frontmatter** — invisible to a scope drawn over body prose. It ships to
   `nodes.json` / `briefs.json` on its own path and survives every body fix.
2. **Generated artifacts** — invisible to a scope drawn over source. `dist/`,
   `llms-full.txt` and the JSON feeds carry corrections downstream only if the
   build actually re-runs.
3. **The seam between file lists** — invisible to *both* adjacent scopes.
   `index.astro`'s JSON-LD sat between "piece 1: get-agent-ready + aiqna" and
   "piece 2: visible copy" and belonged to neither.
4. **Dead code** — invisible to a scope drawn from LIVE SURFACES. The orphaned
   homepage widget could not appear in any list built by asking "what does the
   site serve," because it serves nothing. Found only by asking why a string
   existed at all.

**The generalisation past all four: every scope is drawn against something, and
its complement is invisible BY CONSTRUCTION, not by oversight.** The useful
question when scoping is therefore not "what did I miss" — which cannot be
answered from inside the scope — but "**what kind of thing would this scope be
unable to see?**" Ask it before the sweep, not after the fourth pass.

**BODY PROSE AND FRONTMATTER ARE SEPARATE DISTRIBUTION PATHS.** Frontmatter
ships to `nodes.json` and `briefs.json` regardless of every body fix — an
`agent_summary` reaches agents directly and survives a clean-looking prose
sweep silently. Three frontmatter fields were still asserting AICV sponsorship
*after* every body instance was corrected (`desert-community-foundation`
description + agent_summary, `cook-street-university-row` agent_summary).
**Any sponsorship or identity sweep must check both paths, and the check must
be SHOWN, not asserted** — a "none" reported here was wrong because it
generalised from a narrow check, and was only correct after an explicit
field-by-field scan of the shipped feeds printed its results. Both feeds now
report zero.

**Two corrections worth keeping** (both premises were plausible and both were
wrong, caught only by checking): `node-zero.mdx` was prioritised as
highest-risk on a misattribution — it asserts nothing and never did, the
string belonged to `coachella-valley-ai-events`. And the belief that the site
was publicly self-contradicting was false: piece 1 was never pushed.

**FIRST NODE RETIREMENT — pattern C1**, recorded inline in `public/_redirects`:
delete the `.mdx`, **301 BOTH URL FORMS — canonical trailing-slash first, bare
form alongside** — and repoint every in-corpus link rather than leaning on the
redirect. **A link that works only because of a redirect is a latent break.**
C3 (unpublish via frontmatter) is not available — nothing filters nodes by
`status` except `generate-stats.mjs`. Counts are derived and fell 81 → 80 with
no anchors to bump.

**PATH-EXACT RULES MUST BE WRITTEN AGAINST THE CANONICAL FORM — the lesson
that generalises past redirects.** This site's canonical node URL is the
**trailing-slash** form: `/nodes/x` 308-redirects to `/nodes/x/`. The first
retirement shipped a `_redirects` rule for the *bare* form only, because that
is the shape it was typed as. Result: the bare form 301'd correctly while the
**canonical form — the one every inbound link, sitemap entry and indexed URL
actually uses — returned 200 and served the retired page**, complete with the
"fiscally sponsored project under Desert Community Foundation" text the same
deploy had just corrected everywhere else. `?cb=<unique>` returned 404, proving
the asset was gone from the build and the 200 was a ~23-hour stale edge entry.

**A rule written for the shape you type is not a rule for the shape the site
serves.** Any path-exact rule — `_redirects`, AI Search path filters, worker
routes — must be written against the canonical form, **verified live, and
checked in BOTH forms**. Note also that a redirect rule is evaluated *before*
asset serving, so the correct rule masks a stale edge entry rather than leaving
it to expire.

**QUEUED FOR THE VOCABULARY SWEEP — two items, both recorded with their real
shape:**

1. **Three names, one product, one retired.** The diagnostic is **Agent
   Preview** in `pricing.json` and `llms.txt`, **Agent-Readiness Review** in
   ~12 places, and **"AIO Visibility Report" / "AIO VISIBILITY GRADE"** in
   three downloadable JS export strings in `index.astro`. **The export strings
   are agent-reachable — a user downloads them** — so this is not merely
   internal drift. The last *visible* "AIO" on a rendered page was removed in
   `b6cb0a7`; these are not visible but they ship.
2. **"AICV" now slides between the BRAND and the .org PROGRAMS inside single
   sentences written before the split** — e.g. *"DCF is the fiscal sponsor of
   aicoachellavalley.org, providing the infrastructure under which **AICV**
   operates its AI workforce…"*. **Scoping objects cannot fix ambiguous
   subjects; those sentences need rewriting. That is the sweep's actual job**,
   not a find-and-replace.

**STILL PARKED, deliberately:** `terms.astro` (dated legal doc), the four
indemnity clauses naming DCF's officers and volunteers (likely REQUIRED by the
sponsorship agreement — a legal act, not an editorial one), and the
`37023 Cook Street` PostalAddress blocks (canon says that is DCF's address, so
it may be a residual affiliation asserted in structured form). Also flagged,
not fixed: the 2026-03-26 Mirage brief calls SunshineFM Startup Studios *"one
of our own"* — AICV vouching for its own owner in third-person editorial.

---

## 2026-08-07 — AICV is not a nonprofit. Twenty-eight surfaces said it was.

Commit `cd2ecaf` (17 files) + `0dcd994` (this entry). **PUSHED AND
EDGE-VERIFIED LIVE** — `be74163..0dcd994`, deploy landed ~60s after push.
Verified by a 26-assertion whole-sweep across every corrected surface: all ten
`llms.txt` lines, both `.well-known` identity files, seven report pages, AIQnA,
four node pages, `nodes.json`, and `llms-full.txt`.

**The first sweep reported 3 failures that were not real** — `llms.txt`'s
community-facing line, the Business tier line, and the food-dining report all
came back stale on one request each and clean seconds later. Before calling
them transient, the checker's own logic was self-tested against fixtures
(present/absent/must-not-contain/dollar-and-em-dash escaping) to rule out a
script bug. **Then swept until TWO CONSECUTIVE fully clean passes** — 26/26,
26/26. This is the third time the "one CDN sweep lies" rule has paid for
itself; a single sweep would have sent someone hunting a defect that did not
exist, and a single *clean* sweep would have proven nothing.

**AICV is a fiscally sponsored project of Desert Community Foundation. The
501(c)(3) belongs to DCF, never to AICV.** `llms.txt` — the file agents read
first — asserted the opposite four times, including *"AICV (AI Coachella Valley)
is a nonprofit initiative, not a commercial platform"* on a site whose primary
product is a four-tier paid ladder.

**This was a DELETION pass, and that was the governing ruling.** Where a
nonprofit claim appeared it was *removed*, leaving the smallest true sentence —
the locked fiscal-sponsorship strings were **not** inserted anywhere. Inserting
canon would have been the intuitive fix and the wrong one: it grows the diff,
re-asserts identity on surfaces that had no business asserting it, and buries
the deletion in new prose. Word-level census of the whole commit: 16 bare
`nonprofit` deletions, 6 `nonprofit`→`project`, 2 `a nonprofit`→`an`, 4 whole
clauses/headers. That reconciles to exactly 28 — no instance unaccounted for,
none extra.

**Where the 28 were:** `llms.txt.ts` ×5 · report boilerplate ×12 (the *"Both
surfaces operate as a single nonprofit initiative"* footer, 6 files) · node
corpus ×6 · AIQnA ×2 (JSON-LD **and** visible HTML — they must move together or
the page contradicts its own schema) · `.well-known/skills/**/SKILL.md` and
`.well-known/mcp/server-card.json` ×2. **The two `.well-known` files are the
easy ones to miss** — they are agent-facing identity copy that ships from
`public/`, and no content workflow touches them.

**Tier lines now state how each tier is bought**, from `pricing.json`'s `llms`
field (still the single source): `free diagnostic, self-serve` ·
`$500 one-time, self-serve` · `$1,000 setup + $2,500/yr, starts with a call` ·
`$5,000 setup + $10,000/yr, starts with a call`. Verified against the
storefront's real CTAs — Stripe link for $500, calendar link for both serviced
tiers. **No price digit changed.**

**NEW STANDING GATE — `check-pricing.mjs` now fails the build if any identity
surface calls AICV a nonprofit.** Scans `llms.txt.ts`, `server-card.json`, and
every globbed `SKILL.md`. **The trap it had to avoid: the canonical string
"AICV is a fiscally sponsored project of Desert Community Foundation, a
501(c)(3) nonprofit organization" contains both "AICV" and "nonprofit" eleven
words apart and is CORRECT.** A proximity rule would fail the build on canon
itself. Method is *neutralise the legitimate carriers first, then match what is
left* — strip the DCF-attached and third-party phrasings, then run the banned
patterns. Proven both directions before commit: each of the five old strings
reintroduced individually → build fails with the right label; five correct
strings including the locked one → all pass.

**Gate scope is the three identity surfaces, NOT the content corpus.** Extending
it would false-positive on legitimate third-party nonprofits — the Living
Desert, McCallum, the eight workforce-development nonprofits in the Talent
census. The corpus stays under editorial review, not a regex.

**Verification method worth reusing:** the generated `dist/llms.txt` was checked
by stashing the working set, building a true HEAD baseline, restoring,
rebuilding, and diffing the two artifacts — 9 changed lines, all intended, zero
unrelated. Not by reading the file and judging it. (A first false-positive test
run was silently broken — an env var never reached the injector, so nothing was
actually tested and everything "passed." The rerun asserts the injection landed
before judging the result. **A test that cannot fail is not evidence.**)

Counts unchanged and still derived: 81 nodes / 173 briefs / 13 reports +
methodology. `stash@{0}` (parked AIQnA WIP, base `fd5c437`) verified intact.

**Deliberately untouched, available for a later ruling:** the
`get-agent-ready.astro` FAQ header *"Is AICV a nonprofit?"* (a question, with a
compliant answer) · `founder-infrastructure.mdx:138` (501(c)(3) correctly
attached to DCF, but calls AICV "a research and media property" — a fourth
identity vocabulary in play) · `desert-community-foundation.mdx:29/62`
("nonprofit infrastructure" / "nonprofit anchor", both attached to DCF).

**STILL QUEUED — the vocabulary half of the 2026-07-17 sweep**, deliberately not
folded in: `Base.astro` default description ("structured intelligence layer"),
`get-agent-ready` copy ("regional intelligence layer", short/varied fiscal
strings), `minimum-viable-agent` ("the Valley" ×2, "AIO Visibility Tool" in its
TOS modal), and the site-wide TOS modal fiscal wording (dated legal doc — revise
deliberately).

**`aicoachellavalley.org/llms.txt` was checked and is already clean** — its only
nonprofit reference is the LEGAL/FULL string correctly attached to DCF. Nothing
to fix there.

---

## 2026-08-07 — The preview corpus became discoverable. It was published but unlinked.

Two files: `src/data/previews/previews-index-food-dining.json` (new, synced) and
`src/pages/llms.txt.ts` (+4 output lines). **No content counts changed** —
briefs / nodes / reports untouched; this made existing pages findable, not new
ones.

**`/sitemap-index.xml` was missing food-dining, so 406 indexable pages were off
the discovery chain.** Food & Dining deployed from mva on 2026-08-07 (440 pages,
406 sitemapped). Its sitemap was live and served 200 with every URL — and
**nothing anywhere linked to it.** The chain is `robots.txt` →
`/sitemap-index.xml` → per-tranche sitemap, and this repo owns the middle link.

**Neither the generator nor the sync tool was at fault, and that is the
interesting part.** `src/pages/sitemap-index.xml.ts` derives from
`import.meta.glob('../data/previews/previews-index-*.json')` and is correct —
its own comment reads *"ship a tranche, sync the manifest, and it appears here."*
`scripts/sync-previews-manifest.mjs` auto-discovers every tranche and validates
six required fields plus `entries.length === count`; it needed no change and
picked dining up on first run. **What was missing was any instruction to run
it.** `mva/previews/README.md` documented publishing as four acts ending at
`deploy`; the fifth act lives in this repo and was written down nowhere. All
four documented acts ran correctly. Fixed on the mva side — five acts now, with
a "STEP 5 IS NOT OPTIONAL" section and two `curl` assertions.

Re-syncing also confirmed **zero drift**: hospitality and outdoors-recreation
came back byte-identical, so only dining was ever missing.

**`llms.txt` never mentioned the preview corpus at all.** The one file whose job
is telling an agent what exists here listed nodes, briefs, reports and snapshots
and omitted **707 published pages**. Now carries one `## Intelligence Network`
bullet and three per-tranche endpoints under `## Static Machine-Readable
Endpoints`.

**Counts are DERIVED, from the same committed manifests `/sitemap-index.xml`
uses** — so the two surfaces cannot disagree about what is published, and there
is no hardcoded number to bump when a tranche ships. Sorted largest-first
because `import.meta.glob` key order is not a contract.

**⚠️ CAUGHT AT THE PUSH GATE: the first draft mixed two bases, unlabelled.** The
headline read `707 published` (the `count` field) while the three endpoint lines
read `406 · 134 · 73` (the `indexable` field) — **three numbers summing to 613
sitting directly under a headline of 707**, with nothing saying why. On the file
agents read first, that is an arithmetic contradiction in the one thing AICV
sells: numbers you can trust. It was a Sat call to hold the push and run the
check before shipping, and the check found it. **Ten minutes held against a
self-refuting manifest in production on our most legible surface.**

Fixed by labelling the basis everywhere rather than picking one: the headline
now states `613 of the 707 are sitemapped` and names the other 94 as
deliberately noindexed (dead/hijacked/parked domains, and businesses with no
website on record — nothing was measured, so nothing is offered for indexing);
each endpoint line reads `N of M … (sitemapped; the rest are noindexed by
policy)`. **The gap is a real editorial policy, so it explains itself instead of
being hidden.** Per `previews/README.md`, that split is canon and predates this.

Verified against the BUILT ARTIFACT, not the source — six assertions parsed back
out of `dist/llms.txt`: published 707 == Σ counts · sitemapped 613 == Σ
indexable · headline self-consistent · withheld 94 == 707−613 · 3 categories ==
3 endpoint lines · every line `indexable ≤ count`. Per tranche: 406/440,
134/192, 73/75; withheld 34 + 58 + 2 = 94.

**The five nonprofit characterizations were deliberately NOT touched** (lines 3,
61, 63, 65, 74) — separate wording pass. Provable rather than asserted: the
diff of the built `llms.txt` against the live one is **4 added lines and zero
modifications.**

**Why this mattered, measured not assumed.** Cloudflare zone analytics recorded
**ClaudeBot crawling the Outdoors tranche on 2026-08-05 — 219 distinct paths,
267 requests — after fetching `sitemap-previews-outdoors-recreation.xml`.** That
sitemap was in the index. Dining's was not, and organic AI traffic to dining is
zero. Full audit and AICV's own measured agent-visibility class
(`open_with_schema`, 15 surfaces, zero blocked) in `mva/STATE.md`, same date.

## 2026-08-04 — TOS modal colours scoped to `--tos-*` (naming defect closed)

HEAD **`469906b`**. One file, `src/pages/get-agent-ready.astro`, +47/−18. **No content
counts changed** — briefs 172 / nodes 81 / reports.json 14 all unchanged; this was a
rename, not a publish.

Closes the naming defect recorded in `playbook/BRAND.md` §3. "sage" and "forest" were
informal words in a code comment that read like `tokens.css` entries and were once
misread as such. Four page-scoped names now carry their scope: `--tos-panel-bg`
`#E2EDD4` (1 use), `--tos-panel-bd` `#C6D6B4` (1), `--tos-text` `#234233` (**12**),
`--tos-close-hover` `#DFFF40` (1).

**Declared on `.tos-panel`, NOT `:root`** — and that distinction is the whole point.
This `<style>` block is `is:global`, so a `:root` declaration would have made these
document-wide, which is the opposite of the ruling that they are not brand tokens.
Every consumer is `.tos-panel` or a descendant, so inheritance covers them. `tokens.css`
untouched; `--tos-*` appears in no other file.

**The comment now attaches both measured figures to the value they belong to.** Both are
`#DFFF40` pairs, not `--volt`: `#DFFF40` on `--tos-panel-bg` = 1.07:1, `--tos-text` on
`#DFFF40` = 9.75:1. The trap values are carried forward too (`--volt` on the panel is
1.05:1, `--tos-text` on the panel is 9.11:1) so a future reader checking the wrong pair
does not conclude the ruling is broken — which happened once, in the session that
verified it.

**Verified rename, not restyle.** 16 built CSS rules before and after; resolving the
vars back to literals reproduces the baseline byte for byte. Computed styles confirmed
in-browser across all five `.tos-*` modals on the page, including the `:hover` state
painting `rgb(223,255,64)`. Homepage `.tos-panel` still `rgb(30,30,30)` gunmetal with a
volt top border and zero `--tos-*` vars resolved. Build clean, 307 pages, no console errors.

**Three findings recorded in `playbook/BRAND.md` §3** — the block styles five modals not
one; `.tos-*` exists on four pages with two different treatments; `#3A5648` is a fifth
one-off left deliberately unnamed. See that file before touching this block again.

## 2026-07-30 — Brief filed: Agent Preview pages become transactable (briefs 171 → 172)

Live at `/briefs/2026-07-30-agent-preview-pages-transactable-stripe-settlement-layer/`
(commit `b11b175`, range `b4df220..b11b175`). `briefs.json` **171 → 172**; nodes 81 and
`reports.json` 14 unchanged — this publish added a brief only. **No hand-edits anywhere:**
the stat bar and `llms.txt` are both build-time derived (`All ${briefs.length} intelligence
briefs`), so pushing the `.mdx` alone moved every surface. IndexNow resubmitted on build
(200, the 5 endpoint URLs; key file `a0637c…txt` serves 200).

**Verified on the wire:** brief HTTP 200 with `NewsArticle` JSON-LD · homepage stat bar
**172** · `briefs.json` 172 / `nodes.json` 81 / `reports.json` 14 · `/briefs/` index carries
the slug · `llms.txt` 81 nodes + 172 briefs.

**⚠️ `llms.txt` served a cached `171` on the bare URL** while cache-busted and
`Cache-Control: no-cache` fetches already returned 172 — `cache-control: public, max-age=0,
must-revalidate`, `cf-cache-status: DYNAMIC`. It converged in **10 s**. Worth chasing rather
than reporting the first read, because this brief *publicly asserts* that llms.txt counts
match the live endpoints exactly. Same propagation shape as the aicv-previews deploy earlier
today. **Standing note: after a content push, re-read `llms.txt` cache-busted before believing
a count mismatch.**

**Content notes.** Editorial subject is the 2026-07-30 mva go-live (`5092ad2`) paired with
Stripe's agent-payment rails. Three claims from the brief-writing prompt were **dropped as
unverifiable** rather than published: a NYC-butcher/small-business MPP anecdote (no source
found); "same season" framing for the Agentic Commerce Suite (actually announced 2025-12-11);
and structured data as part of Stripe's field-guide opening checklist (that section covers
`robots.txt`/firewall, server-side rendering, `/llms.txt`, product feed syndication). Census
figures were derived from disk — `src/data/corpus.json` `businesses_mapped: 2914`, whose own
comment reads *"NEVER label this number 'measured'"*, so the brief says **mapped**.

**Self-audit published as a receipt** (all four passed on the wire before being claimed):
`robots.txt` allows all + names ten agent UAs with an affirmative `Content-Signal`; `/llms.txt`
live and current; preview pages, briefs, reports and homepage all readable with every `<script>`
block stripped; JSON-LD on all six surfaces checked. Precision kept out of the copy: **ClaudeBot
and Google-Extended are not named** in `robots.txt` — they pass under the wildcard;
`Claude-SearchBot` and `Claude-User` *are* named.

**Journal 📡 line DEFERRED, not dropped** — a dedicated sunshine-fm session is handling that
repo and will file it there. Second deferral on the same surface (see the 2026-07-22 entry,
which deferred for a stale hardcoded path in `refresh_journal.py`).

## 2026-07-29 (later) — Thirteenth Report published: Agent-Mapped Founder Infrastructure

Live. `reports.json` **13 → 14**; 304 pages built (**+1**); nodes 81 and briefs 171 unchanged —
this publish added a report only.

**No hand-edits were needed anywhere, and that is the notable operational fact.** The homepage
stat bar is build-time derived; the surface-health report anchor has been **runtime-derived since
the 2026-07-17 un-pin**, so the three-way agreement (site ↔ `reports.json` ↔ MCP desk)
re-established itself with no literal to bump. `get_report`'s cap is 50, so 14 needs no change.
IndexNow resubmitted on build. This is the first census-series publish since the un-pin that
required **zero** count maintenance — exactly the payoff that change was made for.

**`report_type: agent-readiness`**, and it is deliberately **not** counted as a category census —
complete category censuses stay at **7**. This is an enrichment pass organized on a question
(*can a funded person build here?*), and the report's own text says so.

**Gates, all upstream of the push:** local `npm run build` **before** any push per the Build
Verification rule (304 pages, 0 validation warnings); ship-day freshness re-check of every
dormancy claim (**17 live checks, 0 status changes**); §5.2/§5.3 on the final text (**55
assertions, 0 fail** — every prose figure reproduces from the committed `stats.json`). Both
§5.3-killed claims appear only as their required negations in a dedicated *"What We Are Not
Claiming"* section. Reproducible scripts live in the playbook run's `verification/`.

**Internal links out of this report:** the three econ-dev nodes repaired earlier today
(`coachella-valley-economic-development`, `ai-economy-coachella-valley`,
`riverside-county-economic-development`), the seven prior series entries, the methodology page,
and the data-centers civic report. The CVEP bankruptcy is cited to **KNews (via The Desert Sun)
plus its Wayback capture `20260729183104`** — the same citation chain repaired in the nodes this
morning, so report and nodes now agree to the link.

**Convention confirmed:** run dirs never retain a report MDX. The draft was `_`-prefixed in the
playbook run dir until Gate 1 approval, then **moved** (not copied) to
`src/content/reports/agent-mapped-founder-infrastructure-coachella-valley.mdx`, and the banked
gate re-pointed at this published path so it stays runnable against canon.

## 2026-07-29 — CVEP Chapter 7 citation repair (6 nodes) + archive-at-publish practice

Live (`69e57bf`), deployed and edge-verified. Node count unchanged at **81** — this was a
content repair, no nodes added or removed.

**THIS WAS A CITATION REPAIR, NOT A RETRACTION.** The Chapter 7 claim is true. What was broken
was the citation chain: the only source cited was a Desert Sun URL sitting behind a Gannett SSO
redirect loop with no usable Wayback capture, which is exactly why the 2026-07-29 verification
audit could not verify it and flagged it unsupported. Sat located readable reporting — **KNews
94.3/104.7, "Desert non-profit tasked with growing local businesses now bankrupt," May 27 2026,
reporting The Desert Sun.**

**NEW STANDING PRACTICE — load-bearing news citations get ARCHIVED AT PUBLISH TIME.** The KNews
URL was saved to the Wayback Machine and the capture verified to contain the full article body
*before* any file was edited: `web.archive.org/web/20260729183104`. Both the live link and the
archive link now ship in the node. **Rationale: a claim is only as durable as its most fragile
link, and a paywalled URL with no capture is indistinguishable from a fabricated one to anyone
auditing later — which is precisely the failure this repair exists to undo.** Apply to every
future node or brief that rests on a news citation.

**Claim conformed to what the source actually supports:** filed Chapter 7 on **March 28, 2026**;
nearly **\$300,000** owed, most of it **SBA loans from 2020 and 2021**. Case disposition and
creditor outcome are **deliberately not asserted** — they appear in no reachable source and are
queued for docket verification separately. Timeline conformed across all touched nodes: board
voted to shutter (reported May 2025, three confidential sources, **exact vote date not publicly
established**); CEO departed March 2025; past tense throughout for CVEP as an operating entity.

**13 locations across 6 nodes — five MORE than the prior session's proposal inventoried.** The
extra five were body prose in `riverside-county` and `ai-economy` asserting "voted to end
operations May 2025" with no citation attached. They were missed because the original inventory
searched for the Desert Sun URL and the string "Chapter 7"; they were found here by sweeping for
stale *date-claim patterns* instead. **Operating lesson: inventory a claim by what it asserts,
not by the string it cites.**

| Node | Action |
|---|---|
| `coachella-valley-economic-development` | repaired — agent_summary, comment, body, key facts, agent signal, provenance |
| `ai-economy-coachella-valley` | repaired — agent_summary, body, key facts, agent signal, provenance |
| `riverside-county-economic-development` | repaired — comment, body, 2 key facts, agent signal, provenance |
| `indian-wells-economic-development` | **was listing CVEP as a CURRENT partner organization, present tense** — corrected |
| `north-palm-desert-development-zone` | "officially disbanded May 2025" conformed |
| `node-zero` | dissolution date conformed |
| `cotino`, `visit-greater-palm-springs` | audited, **no change needed** |

**Agent-surface note worth keeping:** `nodes.json` is **frontmatter-only** by design — it never
carried the citation and still doesn't. The citation lives in `llms-full.txt` (knewsradio ×5,
archive ×5, "March 28, 2026" ×20). The field agents lift most often is **`agent_summary`**, so
that is where claim accuracy matters most; both summaries carrying the claim were corrected.

**Verified live** (not just in the repo): all 6 node pages serve the corrected text with both
the live and archive links; `nodes.json` serves 81 nodes with corrected `agent_summary` and
`last_updated: 2026-07-29`; `llms-full.txt` carries the citation. No stale "formally dissolving"
or "voted to end operations" strings survive on any live surface. Local build gate passed first
(303 pages, 81 nodes, 0 validation warnings) per the Build Verification rule.

**Out of scope, flagged not fixed:** two briefs dated 2026-03-23
(`ai-education-gap-coachella-valley`, `cv-startup-gap`) still say "CVEP dissolved in May 2025."
Both **predate** the March 28 filing and briefs are timestamped signal, not living documents —
left true-to-their-time deliberately.

## 2026-07-26 — Tier cards restored + "What's included" disclosure modals

Live (`98c6e40`).

**RESTORE.** The 2026-07-25 buy-button commit had appended a bullet list and two
fine-print paragraphs to the Agent Ready card *only*, breaking the four-card
height parity the grid depends on. Card bodies are now byte-identical to their
pre-2026-07-26 state, recovered from git (`a10d1ff^`), not rewritten. Proof: the
full diff of the tier block against that parent is exactly ONE line pair — the
CTA href/label swap that was meant to survive. Business and Premium remain on
the calendar; volt CTA still on the $500 tier.

**DISCLOSURE.** Each card gained one identical "What's included" line under its
button, opening a modal on this page's existing `#tosModal` pattern. Content is
in the RENDERED HTML and hidden by CSS (`.tos-overlay{display:none}`) — never
injected on click, so agents and no-JS readers get it. Escape closes whichever
overlay is open.

**Copy provenance (no new promises):** Agent Ready from the approved activation
page (`mva/activate` `activationPage()`); the other three from this page's own
published JSON-LD Service descriptions.
- ⚠️ **Agent Preview has nothing beyond its card description** — its modal
  restates the published Service description and links the free-tool terms.
- ⚠️ **One sentence is NOT from existing copy** and needs Sat's ruling: *"Scope
  is confirmed on a call before anything is billed."* on the Business and
  Premium modals. It describes the consultative process accurately but was
  authored here — remove it or bless it.

**Verified live:** desktop card heights 462/462/462/462 (spread 0), all four
CTAs and links inside their cards; phone (375px) is single-column so cards stack
— no horizontal overflow, spread is inherent to content and unchanged by this
work since every card gained the same element. All four modals open (`flex`) and
close (`none`) on the live page; $500 → Stripe, Business/Premium → calendar.

Also removed the `.gar-v2-tier-gets/-fine/-terms` rules the restore orphaned.

## 2026-07-25 (later) — $500 buy button live + addressable purchase terms

Live (`a10d1ff`). Selling is now possible from the storefront.

**Agent Ready ($500) CTA → Stripe.** Destination changed from the Google
Calendar booking URL to `buy.stripe.com/6oUfZhcZN0hBcEa1we8k801`, relabelled
"Get Agent Ready — $500 →" so it reads as a purchase, not a booking.
**Business and Premium deliberately still point at the calendar** — those tiers
are consultative; do not "fix" them to checkout links.

Card now carries the approved activation-page copy (adapted from
`mva/activate/worker.js` `activationPage()`): the three unlocks, "We never
touch your website" with the two no-touch verification paths, and the refund
line to billing@aicv.co. The activation page's parenthetical about AICV's
email **sending rail was deliberately NOT carried over** — internal roadmap
state, not customer copy.

**NEW `/terms/` page — the Stripe Terms of service URL is
`https://aicoachellavalley.com/terms/`.** Created because AICV's terms existed
only inside a JS modal on /get-agent-ready/, and a modal has no URL a payment
processor can point at. Two separately dated sections:
- **Agent Ready (paid tier) — Effective July 25, 2026**: what's delivered, what
  the buyer must do (DNS record or census-detail challenge), timing (review
  released promptly after payment; page goes Live once verification clears —
  **no date promised**, because the step is the buyer's), refunds, never-touch,
  no outcome guarantee, owner-supplied facts, removal via remove@aicv.co.
- **Agent-Readiness Review (free diagnostic) — March 6, 2026**, reproduced
  **verbatim** from the modal; verified byte-identical across all 7 clauses.

**DATED-SECTION DISCIPLINE (standing):** the TOS is a legal document. Future
changes ADD a dated section; they never silently rewrite an existing clause.
The modal gained one additive pointer to /terms/#agent-ready; the diff removed
zero lines from the TOS body.

**Verified live:** $500 → Stripe (link itself 200) · Business/Premium → calendar
· all card copy renders · /terms/ 200 with both dated sections and the
`#agent-ready` anchor.

**Follow-up, not done (out of bounded scope):** `/terms/` is not yet listed in
`sitemap.xml.ts` staticPages, and no footer links to it besides the modal
pointer.

## 2026-07-25 — Preview-fleet integration + derived stats + single-source pricing

Live (`3f3f44e`, auto-deployed). Three queued preview-fleet items plus a stats
audit and two ruled commercial-copy calls.

**Stat bar is now four derived cells** — Briefs 171 · Reports 12 · Coachella
Valley Businesses Mapped **2,914** · Businesses with a live Agent Preview **75**.
The old "3 / Agentic Reviews" cell is gone: it counted three retired Snapshot
files under a label naming the *private* LLM-Council artifact. Nodes left the
headline bar (internal vocabulary) and keep their page and nav.

- **"Mapped" is the ruled verb for 2,914** — canon rows across the six merchant
  censuses. It is NOT "measured": only the subset with a reachable site of its
  own was ever probed (1,632). Never relabel without re-deriving.
- **Reports show 12, `reports.json` still serves 13.** Display-time filter on
  `report_type !== 'methodology'` only — the surface-health monitor asserts
  three-way agreement on that feed and must not be disturbed.
- **Phone overflow fixed, bounded to the stat bar.** `1fr` is minmax(auto,1fr),
  so "2,914" (~171px) exceeded its ~91px content box and widened its track.
  Inside the existing ≤768 block: `repeat(2, minmax(0,1fr))`, cell padding
  2rem/2.25rem → 1.5rem/0.85rem, numerals 2.75rem → 1.9rem. At 375px: 136px box
  for a 118px number, 18px headroom. **Sat verifies on a real phone** — the
  agent browser pane reported innerWidth 671 against a 375px capture and was
  not trusted for this.

**Pricing has a single source: `src/data/pricing.json`.** get-agent-ready
(visible cards + JSON-LD offers) and llms.txt all read from it.
`scripts/check-pricing.mjs` runs in `prebuild` and FAILS the build if a JSON-LD
price diverges or the retired "AIO" reappears. llms.txt had been advertising
"two tiers" and the AIO diagnostic; it now renders the four-tier ladder.
(No $99 promo exists anywhere — the only $99 strings are editorial briefs about
Microsoft's pricing.)

**Founding-member FAQ entry DELETED** (with its orphaned `.gar-founding-counter`
CSS). It promised "the first ten Tier 2 members" and "standard pricing begins at
member eleven" — a retired tier name, backed by no ledger, invisible to humans
while readable by agents and rich results. **If a founding offer happens later
it will be written fresh, not resurrected.**

**Cross-repo data: derive-first, committed fallback, no network at build time.**
`scripts/sync-previews-manifest.mjs` (from sibling mva) and
`scripts/sync-corpus.mjs` (from sibling playbook canon) validate then write
`src/data/previews/` and `src/data/corpus.json`; absent a sibling checkout the
committed copies stand, so a Pages build can never fail on a remote blip.

**`/sitemap-index.xml`** lists `/sitemap.xml` plus each tranche's preview
sitemap, derived from the manifests. `/sitemap.xml` unchanged; robots.txt
already had a Sitemap line and now carries the index alongside it.

**Report → preview block** on census reports only, via explicit
`src/data/report-preview-map.json` (never slug inference). Renders 75 pages and
75 links, derived — it self-corrected 78 → 75 when the mva canon gate dropped
three duplicates. Numeric-honesty copy: a census row exists for every entity
found; a preview page needs a reachable site of its own.

**Verified live** on the real URLs: stat bar 171/12/2,914/75 · llms.txt ladder
(AIO 0) · sitemap-index → tranche sitemap (73 urls) → a preview page 200 ·
founding claim 0 · JSON-LD parses.

## 2026-07-22 — Measured Twice drift brief filed + published

Brief `2026-07-22-coachella-valley-business-data-drift-remeasurement` filed, pushed (commit `5fd82ea`, range `d65bf47..5fd82ea`), and edge-verified **agent-visible** within ~1 min of push: HTML (`/briefs/2026-07-22-coachella-valley-business-data-drift-remeasurement/`, HTTP 200 on both the plain path and a cache-busted fetch — no stale-edge repeat of the 07-20 episode), `briefs.json` (now **171 briefs**), and `llms-full.txt` (title present). Live JSON-LD verified: `NewsArticle`, `datePublished`/`dateModified` `2026-07-22`, canonical url + author/publisher correct. Push of the `.mdx` alone published every surface, same as the 07-13 and 07-08 briefs; no `content(data)` commit exists. (IndexNow is the documented auto-deploy behavior; not separately verified this run.)

- **Announces the Measured Twice report** (`793a73a`, published 2026-07-17): 536 businesses re-measured across dining + hospitality, 11.2% drift within roughly a week.
- **SCOPE GUARD held — W1+W2 published figures ONLY.** Every figure in the brief traces to the live report. Zero W3/W4 wave figures (no 11.8%, no 14.8%, no 323/224, no 450/419/318, no license or credential counts), zero census-repair (`89e350b`) figures, zero restated census denominators. Verified by string scan pre-push; the one loose-pattern hit (`65 `) was `165`, the published dining completable count.
- **Three Related Nodes, all `status: live` re-verified before build:** `coachella-valley-intelligence-index`, `node-zero`, `ai-economy-coachella-valley`. Link text `Coachella Valley Intelligence Index` follows established brief precedent (wellness + dining census briefs) rather than the node's own `title:` field (`AICV Index`) — precedent, not invention.
- **Inline report link used** — house pattern supports it (9 prior briefs inline-link a `/reports/` page). Deviation from precedent: those briefs append a closing "Full findings … are published at [path](path)" sentence to Context; here the existing phrase *Measured Twice* in the Signal was wrapped instead, to keep the approved copy verbatim (no words added or removed).
- **Filing-date discipline held:** `date: 2026-07-22` (filing date, from `date +%Y-%m-%d`) drives `datePublished`; the July 17 report-publication date and the July 16 repair date live in the prose.
- **MDX dollar rule: N/A this brief** — body contains zero `$` characters (verified pre-push), so no escaping was required.
- **Local build gate passed** before push: 302 pages (301 → 302), per the standing build-verification rule.
- **Journal 📡 line NOT added this run** — deferred to a sunshine-fm session (same posture as the 2026-07-13 and 2026-06-30 entries).
- **Node back-link question — answered, no edits made.** The reciprocity rule (playbook CLAUDE.md, *How to Add a Node* step 9) is scoped to **node→node** links when adding a **node**; the *How to Add an Intelligence Brief* workflow has no back-link step, and com/CLAUDE.md side-effects list only the journal line + STATE update. Practice matches: the 07-13 brief was never added to `workforce-talent` or `civic-infrastructure`. Separate pre-existing debt surfaced while checking — node `## Intelligence Briefs` sections have drifted badly (`workforce-talent` newest listed brief is 2026-04-14; `civic-infrastructure` lists none). Not touched here.

---

## 2026-07-20 — Save-card PNG export shipped on the Agent Preview result card

Commit `b1afcbd` (pushed 2026-07-19 ~17:06 PT) **live-verified 2026-07-20 ~08:15 PT**: "⬇ Save card"
button in the result actions row downloads the full card (attribution footer + reviewed date) as a
2x PNG, `agent-preview-<domain>-<date>.png`, "Saved ✓" confirmation flash. html-to-image from cdnjs
(SRI-pinned, lazy-loaded on first tap); card serialized to SVG with fonts embedded, rasterized to
canvas via `Image.onload` — NOT the library's `toPng`, whose `Image.decode()` path hangs/flakes on
SVG payloads in some engines (Safari included). Copy JSON/MD/Text exports untouched. Local build
passed pre-push (301 pages).

- **Deploy propagation was slow (~overnight) + one stale edge copy** — a 08:05 recon read the old
  build on the plain path while a cache-busted fetch served the new one; both paths confirmed
  current by ~08:10. Not a failed build.
- **Tripwire CORRECTION:** `2ed92b3` (ladder rung Cited → Discoverable) did NOT ship with this
  push — it has been **live since 2026-07-17**, carried by the How We Do This push (`793a73a..
  e0becd3` sit on top of it). The playbook STATE tripwire and the b1afcbd commit-message NOTE
  ("this push also ships 2ed92b3") are both stale on this point; production ladder verified
  reading "Discoverable", zero "Cited".
- **Verification evidence (2026-07-19 Stage 4):** four full-size PNG captures inspected — real
  Visible (aicoachellavalley.com), real Partly visible ×2 (iwcoffeeandchai.com, ritzcarlton.com),
  plus a clearly-labeled SYNTHETIC Invisible (Sat-approved: same DOM/CSS/pipeline, payload-only
  difference). Fonts correct, footer + reviewed date present. Production code path exercised
  end-to-end on the live page 2026-07-20 ("Saved ✓" on deployed code, real result payload
  injected — the analysis slot budget was spent).
- **Rate-limit accounting:** worker caps 5 analyses per **rolling 24h window** per IP
  (`checkRateLimit`, worker.js:209 — window starts at first analysis, not midnight). This iMac
  spent 5/5 on 2026-07-19 ~16:45–17:00 PT (incl. one CORS-probe mistake and one consumed by
  molecomida's error response — the limiter increments before the target fetch). Sat's
  "limit of 5 free analyses" message was the designed response, not an error.
- **FOLLOW-UP (not a gate, per Sat):** after the window resets (~16:45 PT 2026-07-20), run ONE
  real production analysis end-to-end incl. a real Save-card download, and attempt a real
  Invisible-verdict capture (candidates must be fetchable-but-unreadable; blocked sites return
  the tool's error, not a card).

---

## 2026-07-17 — How We Do This page + org-identity wording fixes shipped

Commit `b6cc1bd` (range `793a73a..b6cc1bd`) pushed and **edge-verified live**: new plain-language method page `/how-we-do-this/` (HTTP 200, five beats, Gate B amendment passage verbatim), both index.astro JSON-LD wording fixes confirmed in the live homepage (org description layer→network + legal fiscal string; Q3 FAQ AIO Tool→Agent Preview + same string — zero occurrences of the old strings remain), foot-links live on index / get-agent-ready / minimum-viable-agent, methodology-page pointer live, sitemap entry live. IndexNow: 200, 5 URLs.

- **Five-stage gates held** (Recon STOP → Propose STOP → Draft/Gate B STOP → Build+Verify STOP → Canon Gate). Voice sweep clean: zero "the Valley" alone, zero "cited", fiscal string exact ("AICV is a fiscally sponsored project of Desert Community Foundation, a 501(c)(3) nonprofit organization").
- **New page's footer brand block** intentionally carries the full legal string (site-wide footers still say the short form — queued sweep below).
- **QUEUED (future session): vocabulary + nonprofit-boilerplate sweep** — Base.astro default description ("structured intelligence layer"), get-agent-ready copy ("regional intelligence layer", short/varied fiscal strings), ~5 report MDX boilerplates ("single nonprofit initiative", "layer"), minimum-viable-agent tier copy ("the Valley" ×2, lines ~108/145) + its TOS modal ("AIO Visibility Tool"), and the site-wide TOS modal fiscal wording ("the Desert Community Foundation", no 501(c)(3) — dated legal doc, revise deliberately).

---

## 2026-07-13 — OpenAI ChatGPT Work / GPT-5.6 agent-race brief filed + published

Brief `2026-07-13-openai-chatgpt-work-gpt-5-6-agent-race` filed, pushed (commit `bc93678`), and edge-verified **agent-visible** ~60s after push: HTML (`/briefs/2026-07-13-openai-chatgpt-work-gpt-5-6-agent-race/`, HTTP 200), `briefs.json` (now 170 briefs), and `llms-full.txt`. CF auto-deploy regenerated the gitignored data artifacts in-cloud via `build-static-json.cjs` — push of the `.mdx` alone published every surface and fired IndexNow; no `content(data)` commit exists.

- **Two Related Nodes, both live-verified before build:** `workforce-talent`, `civic-infrastructure`. A visitor-economy/agent-readiness node was checked per the deck's instruction and **does not exist** in the 81-node corpus — dropped, not invented.
- **Filing-date discipline held:** `date: 2026-07-13` (filing date, from `date +%Y-%m-%d`) drives `datePublished` in the NewsArticle schema; the July 9, 2026 ChatGPT Work / GPT-5.6 release date lives in the Signal prose.
- **MDX dollar rule applied:** body pricing (`\$5/\$30` etc.) escaped per briefs/CLAUDE.md; live page render verified clean (no backslash leak).
- **Journal 📡 line deferred** to a sunshine-fm session (same posture as the 2026-06-30 entry) — not added this run.

---

## 2026-07-08 — California adopts Claude brief filed + published

Brief `2026-07-08-california-adopts-claude-state-local-government` filed, pushed (commit `991db84`), and edge-verified **agent-visible** ~60s after push: HTML (`/briefs/2026-07-08-california-adopts-claude-state-local-government/`, HTTP 200), `briefs.json` (now 169 briefs), and `llms-full.txt`. CF auto-deploy regenerated the gitignored data artifacts in-cloud via `build-static-json.cjs` — push of the `.mdx` alone published every surface and fired IndexNow; no `content(data)` commit exists.

- **Three Related Nodes, all live-verified before build:** `riverside-county-economic-development`, `civic-infrastructure`, `workforce-talent`.
- **Filing-date discipline:** `date: 2026-07-08` (today's filing date) drives `datePublished`/`dateModified` in the NewsArticle schema; the June 29, 2026 announcement date lives in the Signal prose, not the schema — a citable source states its true publication date, not the event date.
- **Journal 📡 line reconciled, not deferred:** the sunshine-fm `📡` line was added (commit `20e3f62`, wrangler-deployed) and **closed the +1 brief-counter drift** flagged in the 2026-06-30 entry — actual `📡` lines 168→169 now equal the `169 briefs` span; the counter was left untouched, not bumped.

---

## 2026-07-05 — Cross-thread tangle RESOLVED (reconciled + shipped)

The weekend's parallel-thread stack on com main is cleared: **origin/main = `949993f`, production matches canon.** The Q2 report (`a25e497`) and the nav cleanup (`d17de7a`) were pushed and are live; the git↔production divergence is healed. The AIQnA `llms.txt.ts` WIP remains parked in `stash@{0}` for its own thread — **untouched; do not `stash drop`/`pop`.** *(Retires the earlier "⚠️ PUSH BLOCKED" note — it did its job over the weekend and is no longer true.)*

**Root cause fixed:** the divergence traced to a canon contradiction — `ARCHITECTURE.md` said com deploys via git push while `CLAUDE.md` node-step-12 (and com/CLAUDE.md Key-commands) told sessions to `wrangler pages deploy` com. Reconciled 2026-07-05: com deploys **only** via git push; the wrangler-deploy-com instruction was removed. Deploy discipline now lives, un-contradicted, in ARCHITECTURE.md → Deployment notes.

## 2026-06-30 — Homepage stats bar made status-aware (commit `bf0bd3e`)

`scripts/generate-stats.mjs` (the `prebuild` step that writes `stats.json`, which the homepage bar reads at build time) now counts by frontmatter status — `nodes` = `status: live`, `reports` = `status: published` — instead of raw `.mdx` file count. `briefs`/`snapshots` have no status field and stay raw counts. Output is identical today (81/163/8/3 — zero drafts/non-live), so this is a drift guard, not a number change: a future `draft` report or `planned`/`under construction` node can no longer silently inflate the bar above what its "Published" / "Regional Nodes" labels claim. Confirm the bar anytime with `curl -s https://aicoachellavalley.com/stats.json` — check the counts and `generated_at` (should be ≥ the last content deploy).

---

## 2026-06-30 — Social cards shipped to Base layout; two items parked (hw-card non-bug, detail-page cards)

**Shipped — `feat(seo): og:image + twitter cards in Base.astro` (commit `81558bc`).** Base-using pages (homepage, get-agent-ready, minimum-viable-agent, founding-111, 404, and the index/listing pages) emitted no social card unless they passed `ogImage` — only the homepage did, so most pages shared as naked links. Base now sets a default `ogImage`, expands it to an absolute URL via `new URL(ogImage, Astro.site)` (no hardcoded domain — uses the `site` config), and always emits `og:image` + `og:type` / `og:site_name` / `og:image:alt` + the `twitter:*` card block. Backward-compatible: an absolute `ogImage` (the homepage's) passes through `new URL()` unchanged. High-effort `/code-review`: no blockers; low findings folded into the follow-up below.

**Parked — Fix 1 was a non-bug (closed, nothing shipped).** The long-parked "320px `.gar-v2-hw-card` ~29px horizontal overflow" is a **preview-emulator artifact, not a real layout bug.** At the 320 emulation, `innerWidth`/`docScrollWidth` report 349 while the real viewport (`clientWidth`/`visualViewport`) is 320, content fits, and the page **cannot scroll horizontally** (`scrollX` locked at 0); toggling every clip (body/section/scroller) changed docScrollWidth not at all; at 360 everything is clean (`innerWidth==clientWidth==scrollWidth`). An `overflow-x: clip` one-liner was tried, confirmed to change nothing, and **reverted** — tree clean, no commit. Close this item.

**Follow-up — the real social-card work (high-leverage SEO, not housekeeping).** Content detail pages — `briefs/[slug]`, `nodes/[slug]`, `reports/[slug]`, `aiqna/index`, `aiqna/[slug]`, `snapshots/[slug]` — each roll their own `<head>` and emit **zero** `og:image`/`twitter:*`. These are the per-item citation pages: the most-shared URLs and the core of the agent-native intelligence layer. The Base.astro commit covered only the landing/index subset; this is the set that actually gets shared. Right fix is a **shared head partial (one source of truth)**, not the tag block repeated six times. Design notes for when picked up: (a) the partial needs an `ogType` prop defaulting to `website`, with detail pages passing `article` — preserves the `og:type: article` they already set; this is the prop-default shape the phantom og:type conflict implied (conflict wasn't real, design is); (b) add an `ogImageAlt` prop — alt should describe the image, not the page (Base currently sets `alt={title}`, which mismatches the fixed default image); (c) make the default robust to empty-string `ogImage` (`new URL(ogImage || '/…png', Astro.site)` — `''` currently resolves to the site root, not an image).

**Parked — `index.astro` hardcodes the full domain (latent one-source-of-truth violation).** `index.astro` writes the full domain longhand in its `ogImage`/`canonicalUrl` instead of letting the build expand a relative path against the `site` config. If the site ever moves, that string gets forgotten. Fix by passing a relative path or dropping the prop. Independent of the social-card partial above — don't let it get swallowed when that work is cleared.

---

## 2026-06-30 — Shops at Palm Desert redevelopment brief filed + published

Brief `2026-06-30-shops-palm-desert-redevelopment-status` filed, pushed (commit `79f0100`), and edge-verified **agent-visible on all three surfaces** ~40s after push: HTML (`/briefs/2026-06-30-shops-palm-desert-redevelopment-status/`), `briefs.json` (now 163 briefs), and `llms-full.txt`. CF auto-deploy regenerated the gitignored data artifacts in-cloud via `build-static-json.cjs` — push of the `.mdx` alone published every surface; no `content(data)` commit exists.

- **Two Related Nodes, both live-verified before build:** `north-palm-desert-development-zone`, `palm-desert-economic-development`.
- **Provenance:** derived from an LLM Council run, but the council's search **missed the city's Sears-parcel Surplus Land Act notice** — the brief's most material unresolved fact. Brief was rebuilt from verified City of Palm Desert / trade-press sources rather than council output; verified-facts standard held over council convenience.
- **Journal 📡 line deferred** to a dedicated sunshine-fm session: `refresh_journal.py` hardcodes a stale `/Users/macmini/Projects/com/dist/briefs` path (wrong machine + pre-`~/AICV` layout), and the journal brief counter reads 163 vs 162 actual 📡 lines — needs deliberate reconciliation, not a blind bump.

---

## 2026-06-11 — Dining report shipped + agent-discovery recon (two gaps logged)

Report `agent-mapped-food-dining-coachella-valley` is published and wired into every in-repo agent-discovery surface (commit `63c454d`). Recon across all surfaces:

- **Inherited automatically (no per-report work needed):** `/reports/` index, `sitemap.xml`, `reports.json` (+ `.well-known/api-catalog`, IndexNow), `llms-full.txt` — all dynamic via `getCollection('reports')` / `build-static-json.cjs` since the 2026-06-05 work. JSON-LD is a shared layout (`reports/[slug].astro`) emitting `@type: ['Article','Report']` + the full field set — verified byte-identical to the visitor-economy report.
- **Fixed this session:** the curated `/llms.txt` summary now advertises `reports.json` in both its Intelligence Network and Static Machine-Readable Endpoints lists (it previously omitted the entire reports collection — a 06-05 oversight; `api-catalog` already carried it).

Two gaps surfaced by the recon, logged here as **prioritized future work — neither built this session:**

**GAP 1 — ✅ CLOSED 2026-06-11 — MCP report retrieval shipped.**
- The `mcp.aicoachellavalley.com` worker (**repo: `aicv-mcp`, OUT OF THIS REPO**) exposes tools `query_venues`, `get_node`, `get_regional_brief`, `get_economic_context`, `route_query`. No report tool or resource.
- **Why it matters:** agents querying the canonical MCP "desk" cannot retrieve AICV's long-form reports — directly contradicts the agent-to-agent north star. Humans can read reports on the web; agents through the desk cannot.
- **✅ Closed 2026-06-11 (same day logged):** built and deployed in `aicv-mcp` — commits `ce42b68`→`4eca8ed`. The desk now serves **6 tools** incl. `get_report` (browse/filter + full-body modes); `route_query` routes report-shaped intent to it; `scripts/smoke-test.mjs` covers it. `get_report` reads `reports.json` via the same fetch pattern as nodes/briefs. Verified disk + live (`tools/list`) June 11 — **zero drift**. The open questions resolved as: ONE tool (`get_report`), slug-presence selecting browse vs. full-body (not two tools); the data surface was already ready — only the MCP tool layer was missing.

**GAP 2 — CORPUS ENRICHMENT — LOWER PRIORITY — no node↔report cross-links.**
- No node links to any report and no report links to any node, anywhere in the corpus (category-wide, affects all 4 reports). Agent graph traversal cannot move between entity nodes and the reports about their category.
- **Next step (own session, NOT here):** establish a node↔report cross-link pattern (e.g. food nodes `el-paseo` / `gardens-on-el-paseo` ↔ the dining report) and apply corpus-wide. No existing pattern to replicate → it is a net-new convention, so design it deliberately before applying.

---

## 2026-06-11 — Food & Dining census report + three standing report conventions

- **New report published:** `src/content/reports/agent-mapped-food-dining-coachella-valley.mdx`
  - `report_type: "agent-readiness"`, `period: "Q2 2026"`, label-style `sections` identifiers (continues the 2026-06-05 convention below).
  - Second entry in the recurring agent-readiness series; first to map a single category end to end (ground-up establishment census of 1,423 + an agent-visibility sample of 377 independents).

- **THREE STANDING CONVENTIONS for every AICV category report** (apply to reports #3–#13 and beyond — the dining report is the worked example, so report #2 onward inherit these instead of re-deriving them on review):

  1. **House voice — mark interpretation, state data plainly.** Interpretive / strategic claims are prefixed `According to AICV, …`; measured data is stated without the prefix. The construction deliberately separates AICV's interpretation from the numbers it measured. Lead each `### What This Means for the Coachella Valley` subsection with it, and attach it to standalone strategic claims (e.g. the closing thesis); do NOT attach it to pure data statements — overuse defeats the marker. (Matches the visitor-economy report's usage.)

  2. **Every report closes with three elements, in order, before the italic publisher footer:** (a) **free-diagnostic CTA** pointing to `/get-agent-ready/` — "free, immediate, no AICV engagement required"; (b) **recurring-series framing** — which entry this is, which verticals come next, and the baseline this report puts on the record; (c) the **institutional publisher/footer block** — org-published declaration + methodology transparency hook + .com/.org surface clarification + Desert Community Foundation fiscal-sponsor mention + "nodes, briefs, and reports are available at aicoachellavalley.com" callout (the institutional closing pattern from the 2026-06-05 entry).

  3. **Cross-report number hygiene.** When a new report's figures touch a category a prior report already covered, reconcile the numbers explicitly (2–3 sentences, cite the prior report by name) rather than letting two figures stand unexplained and read as a contradiction. Worked example: the dining report reconciles its ground-up census (1,423 establishments / 924 independents) against the visitor-economy report's directory-sourced scored subset (Dining = 956, mean 3.01, 5.5% Tier A) — the difference is scope/method, not a conflict or correction.

- **Pointer:** a terse author checklist of these three (plus the frontmatter + editorial-link conventions) lives at `src/content/reports/README.md`; this STATE.md entry is canonical. The README is `.md`, so the reports glob loader (`**/*.mdx`) ignores it as a content entry.

---

## 2026-06-05 — Q2 2026 agent-readiness report + editorial link convention + sitemap fix

- **New report published:** `src/content/reports/state-cv-visitor-economy-agent-readiness-q2-2026.mdx`
  - `report_type: "agent-readiness"`, `period: "Q2 2026"`
  - First entry in a recurring agent-readiness report series. Subsequent reports will follow the same `report_type` for category continuity.
  - Section identifiers are label-style (matches `data-centers-ai-infrastructure-coachella-valley` precedent, not the slug-style used by `state-of-ai-q1-2026`).

- **Sitemap fix:** `src/pages/sitemap.xml.ts` now includes a reports loop parallel to the existing nodes/briefs loops, and the `staticPages` array now includes `/reports/`, `/get-agent-ready/`, and `/minimum-viable-agent/`. The reports loop filters on `status === 'published'` to match the index page and `[slug].astro` behavior. Three pre-existing static pages were missing from the sitemap; this is a back-fix.

- **Editorial link convention (new, applies to all future reports and the visitor-economy landing page):**
  - First mention: `[AICV (AI Coachella Valley)](https://aicoachellavalley.com)` — expand and link in body prose on first use; bylines stay plain.
  - `aicoachellavalley.com` — link on first body mention and in the closing italicized note.
  - `aicoachellavalley.org` — link on first body mention.
  - `Desert Community Foundation` — link to `https://desertcommunityfoundation.org` on first mention; repeat in closing note if relevant.
  - Internal program/framework names — link to canonical page on first mention: `[Get Agent Ready program](/get-agent-ready/)`, `[Minimum Viable Agent framework](/minimum-viable-agent/)`.
  - Prior reports — link to canonical URL on first mention: `[State of AI — Q1 2026](/reports/state-of-ai-q1-2026/)`, `[The Server Farm Next Door](/reports/data-centers-ai-infrastructure-coachella-valley/)`.
  - Standard markdown link syntax. No special MDX components.
  - **This convention departs from earlier reports** (state-of-ai and data-centers use plain-text mentions for AICV and aicoachellavalley.com in the body). The new convention is more agent-readable and more navigable; it becomes the going-forward standard. Earlier reports are not back-fixed.

- **Closing italicized note — institutional pattern.** Reports authored under AICV's institutional voice use the institutional closing pattern: organization-published declaration + methodology transparency hook + .com/.org surface clarification + DCF fiscal-sponsor mention + "nodes, briefs, and reports are available at aicoachellavalley.com" callout. The data-centers report's bylined closing remains valid for personal-voice essays from Sat Singh; institutional reports use the institutional pattern.

---

## 2026-05-02 — Background color swap: sand → paper (#FAFAF7)

- **Commit:** `690dc4a` — style: swap sand background to paper (#FAFAF7) across five files
- `--sand` #E8E2D0 → #FAFAF7 (body background)
- `--sand-light` #F2EDE0 → #FFFFFF (elevated surfaces)
- `--sand-dark` #D4CCBA → #E8E5DD (borders/dividers)
- Variable names (`--sand`, `--sand-light`, `--sand-dark`) unchanged — Option B, rename deferred
- **Files touched (5):** `src/styles/tokens.css`, `src/pages/briefs/[slug].astro`, `src/pages/nodes/[slug].astro`, `src/pages/reports/[slug].astro`, `src/pages/snapshots/[slug].astro`
- **Intentionally untouched:** Grade color maps in `snapshots/[slug].astro` lines 57–110 (`gradeBg`, `gradeBorder`, `gradeLightBg`, `findingHeaderBorderColor`) — these use old sand hex values as semantic indicators for D/F grade tiers, not background colors. **Dead code post-postcard migration — delete in cleanup pass after postcards ship.**

---

## 2026-04-27 — Column 2 & 3 headline and description update

- **Commit:** `f6b549c` — feat(homepage): update column 2 and 3 headlines and descriptions to ladder into new CTAs
- Col 2: "Track What AI Sees About the Valley" / "Daily intelligence on how AI systems read and cite the valley." → Read the Briefs →
- Col 3: "Explore the Valley's Regional Map" / "A growing map of regional nodes…" → Explore the Nodes →; no hardcoded counts

---

## 2026-04-27 — Focal block + CTA update

- **Commit:** `6468bfc` — feat(homepage): combine stats + blueprint into focal block; update CTAs
- Stats, "Updated" date (repositioned above stats), and blueprint image merged into single `<section class="focal-block">`; CTAs updated: "Join the Network →" (/get-agent-ready/#diagnostic), "Read the Briefs →" (/briefs/), "Explore the Nodes →" (/nodes/); column 2/3 headlines held pending copy approval

---

## 2026-04-27 — TOS modal generalized to AICV Terms of Use

- **Commit:** `a3e0bc4` — chore(homepage): generalize TOS modal to AICV Terms of Use (was AIO Tool — Terms of Use)
- Title, date, No Legal Recourse, and Changes section generalized; five tool-specific clauses flagged for Sat's legal review (not changed): intro paragraph, "No Account..." data handling, "How It Works" pipeline, "For Informational..." body, "Acceptable Use" URL submission sentences
- CLAUDE.md (`aicv-playbook`, commit `8969fa2`) updated with TOS modal scope clarification rule

---

## 2026-04-27 — Homepage AIO Tool section removed; image-CTA bridge

- **Commit:** `472a47c` — refactor(homepage): replace AIO Tool section with image-CTA bridge to /get-agent-ready/
- AIO Tool embed fully removed from homepage (`id="aio"`, input, results, loading, error divs, submit button)
- Replaced with `.img-cta-section`: `<a href="/get-agent-ready/">` wrapping `<img src="/gar-banner.svg">` (placeholder — drop file in `public/` to activate)
- Nav button updated: "Free AIO Tool ↓" `#aio` → "Get Agent Ready →" `/get-agent-ready/#diagnostic`
- Footer "AIO Tool" link updated: `#aio` → `/get-agent-ready/#diagnostic`
- **Canonical AIO Tool instance:** `/get-agent-ready/#diagnostic` only
- **Orphaned JS retained** (not removed — separate decision needed): `WORKER_BASE`, `resetTool`, `showErr`, `gradeFromScore`, `runAnalysis`, `copyReport` — all in `<script is:inline>` block
- **TOS modal retained** (not removed — separate decision needed): `id="tosModal"`, triggered by footer "Terms of Use" link; title still reads "AIO Tool — Terms of Use"
- Build: 248 pages, no errors, 4.35s

### Follow-up — `6759def` — blueprint asset wired
- `public/learn-to-get-agent-ready-blueprint.png` added (2172×724px, 1.1 MB, Retina-safe); placeholder `/gar-banner.svg` replaced; `width`/`height` attributes added for CLS prevention
- `src/learn-to-get-agent-ready-blueprint.png` intentionally NOT committed (working copy, no Astro role)
- `public/learn-to-get-agent-ready-blueprint.webp` added (71 KB, ~94% smaller); `<picture>` element wraps `<img>` with WebP preferred source and PNG fallback

---

## 2026-04-27 — /get-agent-ready FAQ 10th entry (agent-payment)

- **Commit:** `7944eec` — feat(get-agent-ready): add agent-payment FAQ entry (Reviewed-tier roadmap commitment)
- FAQ now has 10 entries (schema and HTML in sync); new entry covers x402, ACP, agent-payable MCP endpoints as a Reviewed-tier future commitment for hospitality/dining/wellness/retail

---

## 2026-04-27 — Homepage Get Included CTA fix

- **Commit:** `1126352` — fix(homepage): repoint Get Included CTA to V7.7 diagnostic anchor
- `#aio` → `/get-agent-ready/#diagnostic` (one-line change, `src/pages/index.astro` line 363)
- Submit a Brief `mailto:sat@aicv.co` unchanged — mailto is correct, AIO Tool inability to verify mailto is a known tool limitation (codified in aicv-playbook CLAUDE.md)
- Homepage MED-tier nav finding from 2026-04-27 AIO scan addressed; will confirm at next routine homepage scan (no dedicated re-verification scheduled)

---

## 2026-04-27 — /get-agent-ready Phase 2 schema additions

- **Commit:** `2ccc65a` — feat(get-agent-ready): Phase 2 schema additions (Organization, LocalBusiness, ContactPoint)
- **Deploy:** Cloudflare Pages auto-deploy on push to main
- **Scope:** schema-only — no visible copy changes, no AIO widget changes, no TOS modal changes
- **@graph now contains 7 entries:** WebPage, BreadcrumbList, Service (AICV Ready), Service (AICV Reviewed), FAQPage, Organization, LocalBusiness
- **Organization schema:** @id `#organization`, founder Sat Singh, parentOrganization Desert Community Foundation (fiscal sponsor), contactPoint (email-only, general inquiries, English), sameAs mirrored from homepage (`x.com/CoachellaAI`, `github.com/aicoachellavalley`, `sunshinefm.beehiiv.com`), logo `logo.png`, foundingDate 2025-01-19
- **LocalBusiness schema:** @id `#localbusiness`, verified address 37023 Cook Street Palm Desert CA 92211, parentOrganization @id reference, email sat@aicv.co — addresses Local Signals warn from 2026-04-27 AIO analysis
- **Service ×2 provider:** simplified to `{ "@id": "https://aicoachellavalley.com/#organization" }` @id-only reference — no duplication of Organization properties
- **dateModified:** 2026-04-26 → 2026-04-27
- **No phone field added:** AICV operates email-only; phone was AIO LOW-tier generic suggestion, not a content gap
- **Build check:** 248 pages, no errors, 4.00s

### Deferred verifications — 2026-04-28

- **AIO Tool grade on `/get-agent-ready/`** — Phase 2 directly addresses both MED-tier Top Fixes from 2026-04-27 analysis (Organization entity block, LocalBusiness with street address). Target: Grade A (90+). Note: rate-limit budget consumed on 2026-04-27; do not run today.
- **Google Rich Results revalidation** — confirm all 7 schema types parse cleanly; verify LocalBusiness and Organization render correctly; confirm no regression on WebPage, BreadcrumbList, Service×2, FAQPage. Note: LocalBusiness and Organization are not Google Rich Result types (no visual enhancement), but must validate without errors.
- **Cloudflare scan:** not needed — schema additions do not affect API/Auth/MCP/Skill Discovery category; infrastructure score unchanged.

---

## 2026-04-27 — /get-agent-ready V7.7 copy replacement

- **Commit:** `1e85313` — feat(get-agent-ready): V7.7 final copy — proof strip, streamlined sections, agentic-internet thesis
- **Deploy:** Cloudflare Pages auto-deploy on push to main; live at `https://aicoachellavalley.com/get-agent-ready/`
- **Scope:** full visible-content replacement; schema, AIO widget, TOS modal, JS preserved exactly
- **dateModified:** updated to 2026-04-26
- **Dynamic proof strip:** `{nodeCount}+` / `{briefCount}+` imported from `public/nodes.json` and `public/briefs.json` at build time (80 nodes, 136 briefs as of this build)
- **Sections added:** Proof Strip (new), Why This Matters Now, Why Networks Win (network statements two-up), Members Only (25-min session), About AICV (with address — Local Signals improvement), Final Close (dual CTAs)
- **Sections removed:** Section 6 Deployment (7-step sequence), Section 9 Booking (standalone calendar section)
- **New CSS:** `.gar-proof-strip`, `.gar-light-list`, `.gar-dark-list`, `.gar-network-statements`, `.gar-about-wrap`, `.gar-close-ctas`, `.gar-hero-note`
- **Build check:** 248 pages, no errors, 4.33s

### Deferred verifications — schedule 2026-04-28

- **AIO Tool grade on `/get-agent-ready/`** — V7.7 adds address (Local Signals fix) and About AICV entity block. Run after deploy propagation (~24h). Target: clear Local Signals warn from Phase 1, assess Entity Clarity and Content Completeness improvements.
- **Google Rich Results** — confirm dateModified=2026-04-26 reflected, all 4 schema types still valid after description update.
- **Homepage regression check** — confirm unchanged (200 OK, stat blocks present, no CSS bleed from gar-* additions).

---

## 2026-04-23 — /get-agent-ready Phase 1 launch

- **Commit:** `32b6981` — feat: add /get-agent-ready commercial positioning page (Phase 1 — widget copied, homepage unchanged)
- **Deploy:** Cloudflare Pages auto-deploy on push to main; live at `https://aicoachellavalley.com/get-agent-ready/`
- **Scope:** new standalone page, 9 sections, AIO Tool widget copied verbatim from homepage, `@graph` JSON-LD (WebPage, BreadcrumbList, Service×2, FAQPage, UnitPriceSpecification), TOS modal + Escape handler copied, footer adds "Get Agent Ready" + Terms of Use trigger
- **Homepage regression check:** 200 OK, 30,859 bytes, `aio-section` + `id="aio"` present — unchanged
- **llms.txt:** Commercial Tier section added pointing to new page
- **IndexNow:** submitted manually (GET 202) — `build-static-json.cjs` only auto-submits the 4 JSON endpoints
- **Pricing locked:** AICV Ready $1,000 deploy + $2,500/yr; AICV Reviewed Founding $2,500 deploy + $5,000/yr (first 10 only); AICV Reviewed Standard $5,000 deploy + $7,500/yr
- **CSS namespace:** `gar-*` prefix to avoid homepage selector collision
- **Widget bundle verified separate:** homepage `index@_@astro.C3DEf_kG.css` vs new page `get-agent-ready@_@astro.Brs_PR_K.css`

### Phase 1 Verification Baselines — 2026-04-25

Verifications originally scheduled 2026-04-24; run 2026-04-25 due to prior session rate-limit deferral.

**AIO Tool — `/get-agent-ready/`** (run 2026-04-25)
- Score: **82 / Grade B** — target Grade A (90+) not met; 8 points short
- Pass (4): AI Crawler Access, Structured Data, Local Signals, Content Freshness
- Warn (3): Entity Clarity (sales-page framing obscures standalone entity description), Content Completeness (no leadership names, no street address, no client testimonials), Hallucination Risk (80-node/133-brief claims not directly verifiable from page)
- All warns are content additions, not structural issues — addressable in Phase 2

**Cloudflare Agent-Readiness — `/get-agent-ready/`** (2026-04-25)
- isitagentready.com has no public API; page-specific scan not automatable
- Domain infrastructure verified manually: robots.txt ✓, llms.txt ✓, sitemap.xml ✓, .well-known/api-catalog ✓, .well-known/mcp/server-card.json ✓, Markdown for Agents (text/markdown) ✓, all Link headers present ✓
- Domain-level score unchanged → **75 / Level 5 Agent-Native** (inherited from homepage baseline)
- Manual browser scan on isitagentready.com recommended to confirm; all infrastructure checks expected to pass identically

**Google Rich Results — `/get-agent-ready/`** (2026-04-25)
- JSON-LD: 1 block, **valid JSON, no parse errors**
- All 4 target schema types confirmed:
  - WebPage ✓ (dateModified=2026-04-23, URL matches canonical)
  - BreadcrumbList ✓ (2 items: Home → Get Agent Ready; position/name/item all present)
  - Service × 2 ✓ (AICV Ready: 2 offers; AICV Reviewed: 4 offers; areaServed on both)
  - FAQPage ✓ (9 Q&A pairs, all acceptedAnswer.text fields populated)
- Note: Service schema is valid schema.org but not a Google Rich Result type; FAQPage and BreadcrumbList are Google Rich Result-eligible

**Homepage AIO regression check** (run 2026-04-25)
- Score: **89 / Grade B** — no regression; improved from 2026-04-23 Grade B baseline
- Pass (6): AI Crawler Access, Structured Data, Content Completeness, Local Signals, Content Freshness, Hallucination Risk
- Warn (1): Entity Clarity only (first 100 words don't define business type in plain English)
- 1 point from Grade A; Entity Clarity warn is the sole gap. Phase 1 commercial/organizational separation working as intended.

**Known debt from Phase 1 verification**
- AIO Grade A not achieved on `/get-agent-ready/` — content additions needed (Organization entity block, proof-of-execution links to MCP server, contact method in page copy). Scope for Phase 2.
- Homepage 1 point from Grade A — single Entity Clarity warn; first-100-words copy fix would likely push to 90+.
- aicv-playbook STATE.md recorded "Grade A" for homepage (anticipatory); actual 2026-04-25 result is 89/Grade B — update playbook in next strategic review.
- **IndexNow key file** `/aicv-indexnow-2026.txt` returns 404 at public root; API accepts submissions (202). Worth confirming whether Bing actually fetches the key or swallows silently.

### AIO Tool Truncation Bug — Found and Fixed (2026-04-25)

**Bug:** `worker.js` was silently capping cleaned page content at `6000` chars before sending to Haiku. Long-form pages (pitch pages, FAQ pages, multi-section sales pages) were being evaluated with a fraction of their content, producing suppressed scores and false warns.

**Root cause:** `fetchPageContent` line 143 — `.slice(0, 6000)`. The `/get-agent-ready/` page produces 14,669 chars of cleaned text; worker was sending 6,000 (41%). Truncation point was mid-sentence: "Deployment is a sequence, not an event. Every s[top]." JSON-LD schema was unaffected — it arrives via a separate regex extraction path.

**Fix deployed:** `aicv-api` commit, deployed 2026-04-25.
- Content cap raised from 6,000 to 12,000 chars
- Word-boundary slice: `cleaned.lastIndexOf(' ', 12000)` to avoid mid-word cuts
- Truncation marker appended when truncation occurs: `[Note: page content truncated at ~12000 chars; full page is N chars]` — Haiku can adjust confidence accordingly

**Re-scored after fix (2026-04-25):**

| Page | Pre-fix | Post-fix | Check delta |
|---|---|---|---|
| `/get-agent-ready/` | 82 / Grade B, 3 warns | **78 / Grade C, 1 warn** | Entity Clarity ✓, Content Completeness ✓, Hallucination Risk ✓ resolved; Local Signals newly warned |
| `/` (homepage) | 89 / Grade B, 1 warn | **86 / Grade B, 0 warns** | Entity Clarity warn resolved; all 7 checks now pass |

**Interpretation of results:**
- `/get-agent-ready/` page score (78 vs 82): check quality improved (3 → 1 warn) but raw score dipped due to Haiku model variance and a more accurate Local Signals warn (missing LocalBusiness schema with street address — previously masked by truncation). The 78 is a more honest assessment.
- The new Local Signals warn is legitimate: the page references "Rancho Mirage, California" in footer text only, not in LocalBusiness structured data. Scope for Phase 2.
- Grade A target still requires: LocalBusiness schema + Organization entity block + contact detail in structured data (as flagged in fixes). All are content additions.
- Homepage: 7/7 checks now pass. Score variance (89→86) is expected Haiku run-to-run variation; all warns cleared is the signal.
- **Prior AIO grades on long pages may have been suppressed** — any page with >6000 chars of cleaned text received artificially low scores before this fix.

---

## 2026-04-22 — Tier 4 agent-readiness achieved

- **Cloudflare Pro** upgrade on aicoachellavalley.com zone
- **Markdown for Agents** enabled at CDN edge — agents requesting `Accept: text/markdown` get edge-converted markdown with `Content-Signal: ai-train=yes, search=yes, ai-input=yes` response header
- **aicoachellavalley.com now at Tier 4** of the four-tier agent-readiness framework (see aicv-playbook CLAUDE.md)
- **81 nodes, 147 briefs, 3 snapshots, 2 reports** as of 2026-05-21

### Agent discovery endpoints (as of 2026-04-22)

- `/robots.txt` — Content-Signal directive
- `/llms.txt` — human-readable content summary
- `/nodes.json`, `/briefs.json`, `/snapshots.json`, `/reports.json` — structured data
- `/_headers` — 6 Link headers on homepage, Content-Type rule for api-catalog
- `/.well-known/api-catalog` — RFC 9727 linkset (application/linkset+json)
- `/.well-known/mcp/server-card.json` — SEP-2127 draft MCP Server Card advertising mcp.aicoachellavalley.com with 5 tools

### Commits

- **35c1464** — feat: add FAQPage schema, expand WebSite description
- **41cc994** — feat: agent discovery — Content Signals, Link headers, API catalog, MCP Server Card

### Known debt

Layer 2 work (bidirectional node references, explicit relationship types from four-layer framework, temporal structure in briefs, aggregation surfaces) is the next major architectural build — see aicv-playbook CLAUDE.md "Collective signal vision." No near-term tactical debt queued.

---

## 2026-04-19 — Stats pipeline + Phase 3 completion

- **Commit range:** `612354b..f15da21` (6 commits)
- **Deployed to:** `origin/main` via Cloudflare Pages
- **Framework:** Astro static build
- **Deploy trigger:** Cloudflare Pages invokes `npm run build`, which
  runs the prebuild hook (`scripts/generate-stats.mjs`) before
  `astro build`

## Verified live URLs (all green as of 2026-04-19)

- <https://aicoachellavalley.com/briefs/> — 131 briefs
- <https://aicoachellavalley.com/nodes/node-zero/> — "80 nodes across
  nine cities and adjacent communities"
- <https://aicoachellavalley.com/llms.txt> — dynamic counts (Astro
  endpoint)
- <https://aicoachellavalley.com/sitemap.xml> — 3 snapshots enumerated
  dynamically
- <https://aicoachellavalley.com/stats.json> — valid JSON, current
  timestamp and counts

## Stats pipeline

A prebuild hook runs `scripts/generate-stats.mjs` before every
`astro build`. The script reads the content collections and writes
computed counts to `public/stats.json` and `src/data/stats.json`. All
surfaces that display counts import from those files rather than
hardcoding values. Cloudflare Pages triggers this chain automatically
on push to `origin/main`.

---

## Agent-Readiness Baselines — 2026-04-23

Recorded after Cloudflare Pro + Markdown for Agents +
.well-known discovery deployment (commits 35c1464, 41cc994).

**Cloudflare Agentic Readability** (isitagentready.com):
- Score: 75 / Level 5 "Agent-Native" (highest tier)
- Discoverability: 3/3 ✓
- Content: 1/1 ✓
- Bot Access Control: 2/2 ✓
- API, Auth, MCP & Skill Discovery: 3/6

**AICV AIO Tool** (self-grade of aicoachellavalley.com):
- Grade: B
- Warning: Entity Clarity — homepage conflates AICV's
  organizational mission with AIO Tool product narrative.
  To be addressed via /get-agent-ready page launch (separate
  session), not via homepage rewrite.
- All other checks passing.

## Agent-Readiness Items Intentionally Deferred

- **OAuth/OIDC discovery** (/.well-known/openid-configuration)
  — not applicable. AICV has no protected APIs. All endpoints
  are public-read by design.

- **OAuth Protected Resource Metadata**
  (/.well-known/oauth-protected-resource) — same rationale.

- **WebMCP** (navigator.modelContext.provideContext()) —
  deferred to dedicated session. Worth implementing; mirrors
  existing MCP server tool set for browser-native agents.

- **Phone number in Organization schema contactPoint** —
  deferred pending Twilio routing project.
