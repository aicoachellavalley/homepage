// One machine-readable list of what AICV sells, from the same source as the page.
import { readFileSync, writeFileSync } from 'node:fs';
const { tiers, updated } = JSON.parse(readFileSync(new URL('../src/data/pricing.json', import.meta.url), 'utf8'));
const offers = tiers.map(t => ({
  id: t.id, name: t.name, description: t.llms,
  price: t.onetime ? { amount: t.onetime, currency: 'USD', cadence: 'one-time' } : (t.id === 'agent-visibility' ? { amount: 0, currency: 'USD' } : null),
  ...(t.id === 'agent-ready' ? { checkout_url: t.url, checkout_note: 'Add ?client_reference_id=<purchase_ref from the desk record> to match the payment to one business. AICV does not sell a place on a desk.' } : {}),
  ...(t.id === 'consulting' ? { contact_url: t.url, self_serve: false } : {}),
  ...(t.id === 'agent-visibility' ? { eligibility_url: 'https://aicoachellavalley.com/desks/join/' } : {}),
}));
writeFileSync(new URL('../public/offers.json', import.meta.url), JSON.stringify({ updated, offers, note: 'These three offers are the complete list. A person or assistant still approves any purchase.' }, null, 2) + '\n');
