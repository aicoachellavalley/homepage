// Public catalog lookup is a suggestion, never ownership verification.
// A name + city confirmation is required even for a single national-brand row.
export function hostKey(value) {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    return url.host.toLowerCase().replace(/^www\./, '');
  } catch { return null; }
}
function safeCandidate(row) {
  return row && typeof row.name === 'string' && row.name && typeof row.city === 'string'
    && /^[a-z0-9-]+$/.test(row.slug)
    && new RegExp(`^/agent-preview/[a-z0-9-]+/${row.slug}$`).test(row.path);
}
export function lookup(map, input) {
  const host = hostKey(input);
  if (!host || map.version !== 1) return { state: 'unavailable', candidates: [] };
  if (Object.hasOwn(map.denied || {}, host)) return { state: 'denied', host, candidates: [] };
  const direct = Object.hasOwn(map.matchable || {}, host) ? map.matchable[host] : null;
  const ambiguous = Object.hasOwn(map.ambiguous || {}, host) ? map.ambiguous[host] : null;
  if ((direct?.tie_broken && !Array.isArray(direct.candidates)) || (ambiguous && !Array.isArray(ambiguous))) return { state: 'unavailable', host, candidates: [] };
  const candidates = direct ? (direct.tie_broken ? [direct, ...direct.candidates] : [direct]) : (ambiguous || []);
  if (!candidates.every(safeCandidate)) return { state: 'unavailable', host, candidates: [] };
  const unique = [...new Map(candidates.map(c => [c.slug, c])).values()];
  return { state: ambiguous ? 'ambiguous' : direct?.tie_broken ? 'tie-broken' : direct ? 'single' : 'none', host, candidates: unique };
}

export function createMatchState(fetchMap, publish) {
  let generation = 0, selection = 0, result = null, confirmed = null;
  return {
    reset() { generation++; result = null; confirmed = null; publish(null, null); },
    async analyzeComplete(input) {
      const current = ++generation;
      result = null; confirmed = null;
      publish({ state: 'loading', candidates: [] }, null);
      try {
        const found = lookup(await fetchMap(), input);
        if (current !== generation) return;
        result = found; publish(result, null);
      } catch {
        if (current === generation) publish({ state: 'unavailable', candidates: [] }, null);
      }
    },
    confirm(slug) {
      const candidate = result?.candidates.find(c => c.slug === slug);
      if (!candidate) return false;
      selection++;
      confirmed = candidate;
      publish(result, confirmed);
      return true;
    },
    async confirmAvailable(slug, check) {
      const current = generation;
      const choice = ++selection;
      const candidate = result?.candidates.find(c => c.slug === slug);
      if (!candidate || !await check(candidate) || current !== generation || choice !== selection) return false;
      return this.confirm(slug);
    },
    unconfirm() { selection++; confirmed = null; publish(result, null); },
    checkout(base) {
      const url = new URL(base);
      url.searchParams.delete('client_reference_id');
      if (confirmed) url.searchParams.set('client_reference_id', confirmed.slug);
      return url.href;
    },
  };
}

export function mountBusinessMatch(document, fetcher = fetch) {
  const panel = document.getElementById('businessMatch');
  const purchase = document.getElementById('agentReadyPurchase');
  if (!panel || !purchase) return;
  const base = purchase.href;
  let mapPromise;
  const matcher = createMatchState(() => {
    // Intentionally no fetch on load: only after a successful diagnostic.
    mapPromise ||= fetcher('/host-map.json').then(r => {
      if (!r.ok) throw new Error('Catalog unavailable');
      return r.json();
    }).catch(e => { mapPromise = null; throw e; });
    return mapPromise;
  }, (result, confirmed) => {
    purchase.href = base;
    purchase.textContent = 'Get Agent Ready — $500 →';
    panel.replaceChildren();
    panel.hidden = !result;
    if (!result) return;
    const add = (tag, text) => { const e=document.createElement(tag);e.textContent=text;panel.append(e);return e; };
    if (result.state === 'loading') { add('p','Checking for your business on the AICV network…');return; }
    if (confirmed) {
      purchase.href = matcher.checkout(base);
      add('h3', `${confirmed.name} · ${confirmed.city}`);
      add('p','You confirmed this is your business. Your purchase will carry this page to checkout. This confirmation is not an ownership attestation.');
      const buy=add('a','Activate this business — $500 →');buy.href=purchase.href;buy.className='btn btn-primary';
      const change=add('button','Choose a different business');change.type='button';change.addEventListener('click',()=>matcher.unconfirm());
      return;
    }
    if (!result.candidates.length) {
      add('h3','Let’s make sure we have the right business');
      add('p',result.state==='denied'
        ? 'That website serves more than one business, so we cannot safely identify yours from its address.'
        : 'We could not safely identify a published preview for this website.');
      add('p','You can still purchase below. A person will match your business before publication and private-review delivery; it will not happen instantly. Questions? billing@aicv.co');
      return;
    }
    add('h3',result.candidates.length===1 ? 'Is this your business?' : `We found ${result.candidates.length} businesses at this website. Which is yours?`);
    add('p','Check the name and city, then open the preview if you want to take a closer look. We will not choose for you.');
    const list=add('div','');list.className='business-match-options';
    for (const c of result.candidates) {
      const item=document.createElement('div');item.className='business-match-option';
      const name=document.createElement('strong');name.textContent=`${c.name} · ${c.city}`;item.append(name);
      const preview=document.createElement('a');preview.textContent='Read this preview';preview.href=c.path;preview.target='_blank';preview.rel='noopener';item.append(preview);
      const button=document.createElement('button');button.type='button';button.textContent=`Yes, ${c.name} in ${c.city} is my business`;
      button.addEventListener('click',async()=>{
        button.disabled=true;
        try {
          const confirmed=await matcher.confirmAvailable(c.slug,async candidate=>{
            const response=await fetcher(`/activate/availability?slug=${encodeURIComponent(candidate.slug)}`);
            if (!response.ok) return false;
            const status=await response.json();
            return status.available===true && status.path===candidate.path;
          });
          if (!confirmed && button.isConnected) add('p','We could not confirm that this preview is available to activate. Please contact billing@aicv.co before purchasing it. No business has been attached to checkout.');
        } catch {
          if (button.isConnected) add('p','We could not check this preview’s availability. Please try again or contact billing@aicv.co. No business has been attached to checkout.');
        } finally { button.disabled=false; }
      });item.append(button);list.append(item);
    }
    add('p','Not yours? Do not confirm it. You can still purchase with a manual match, or contact billing@aicv.co first.');
  });
  document.addEventListener('aicv:diagnostic-complete', e => { void matcher.analyzeComplete(e.detail.url); });
  document.addEventListener('aicv:diagnostic-reset', () => matcher.reset());
  document.getElementById('urlInput')?.addEventListener('input', () => matcher.reset());
}
