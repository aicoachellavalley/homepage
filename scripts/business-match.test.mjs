import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {hostKey,lookup,createMatchState,mountBusinessMatch} from '../src/scripts/business-match.mjs';
const map=JSON.parse(readFileSync(new URL('../public/host-map.json',import.meta.url)));
const base='https://buy.stripe.com/6oUfZhcZN0hBcEa1we8k801';
test('positive control: exact normalized host only, no suffix/subdomain/fuzzy match',()=>{
  const [host,row]=Object.entries(map.matchable).find(([,r])=>!r.tie_broken);
  assert.equal(lookup(map,`https://www.${host}/some/path`).candidates[0].slug,row.slug);
  assert.equal(lookup(map,`${host}.evil.example`).candidates.length,0);
  assert.equal(lookup(map,`other.${host}`).candidates.length,0);
  assert.equal(hostKey(`https://${host}:8443/`),`${host}:8443`);
  assert.equal(hostKey(`https://user@${host}`),null);
});
test('all map candidates are valid and both withdrawn slugs are absent',()=>{
  for(const host of Object.keys(map.matchable).concat(Object.keys(map.ambiguous))){
    const result=lookup(map,host);
    assert.notEqual(result.state,'unavailable',host);
    assert.ok(result.candidates.length);
    for(const c of result.candidates) assert.ok(!['inn-at-palm-springs','fantasy-springs-resort-casino'].includes(c.slug));
  }
});
test('Brandini ambiguity and Fantasy Springs root tie-break show every candidate without choosing',()=>{
  const brandini=lookup(map,'www.brandinitoffee.com');
  assert.equal(brandini.state,'ambiguous');assert.ok(brandini.candidates.length>1);
  const resort=lookup(map,'fantasyspringsresort.com');
  assert.equal(resort.state,'tie-broken');assert.equal(resort.candidates.length,8);
});
test('shared platforms are refused, including single-row Yelp',()=>{
  for(const host of Object.keys(map.denied)) assert.deepEqual(lookup(map,host).candidates,[]);
  assert.equal(lookup(map,'yelp.com').state,'denied');
});
test('lookup alone never creates a checkout reference; only explicit candidate confirmation can',async()=>{
  const updates=[];const model=createMatchState(async()=>map,(r,c)=>updates.push({r,c}));
  await model.analyzeComplete('fantasyspringsresort.com');
  assert.equal(model.checkout(base),base);
  assert.equal(model.confirm('some-other-business'),false);
  const candidate=updates.at(-1).r.candidates[3];
  assert.equal(model.confirm(candidate.slug),true);
  assert.equal(new URL(model.checkout(base)).searchParams.get('client_reference_id'),candidate.slug);
  model.unconfirm();assert.equal(model.checkout(base),base);
  model.confirm(candidate.slug);model.reset();assert.equal(model.checkout(base),base);
});
test('stale or failed lookup cannot restore a previous business confirmation',async()=>{
  let resolve;const updates=[];
  const model=createMatchState(()=>new Promise(r=>resolve=r),(r,c)=>updates.push({r,c}));
  const run=model.analyzeComplete('brandinitoffee.com');
  model.reset();resolve(map);await run;
  assert.equal(updates.at(-1).r,null);assert.equal(model.checkout(base),base);
  const failed=createMatchState(async()=>{throw Error('offline');},(r,c)=>updates.push({r,c}));
  await failed.analyzeComplete('brandinitoffee.com');
  assert.equal(updates.at(-1).r.state,'unavailable');assert.equal(failed.checkout(base),base);
});
test('mounting has zero catalog fetches until a successful diagnostic event',()=>{
  let calls=0;const listeners={};
  const panel={}; const purchase={href:base};
  mountBusinessMatch({getElementById:id=>({businessMatch:panel,agentReadyPurchase:purchase})[id],addEventListener:(n,fn)=>listeners[n]=fn},()=>{calls++;});
  assert.equal(calls,0);assert.ok(listeners['aicv:diagnostic-complete']);
});
test('malformed or unsafe catalog entries are refused',()=>{
  assert.equal(lookup({...map,version:2},'brandinitoffee.com').state,'unavailable');
  assert.equal(lookup({version:1,matchable:{'example.com':{slug:'evil',name:'Test',city:'City',path:'//evil.example/'}}},'example.com').state,'unavailable');
});
test('availability failure or a changed diagnostic cannot attach a stale reference',async()=>{
  const results=[];const m=createMatchState(async()=>map,(r,c)=>results.push({r,c}));
  await m.analyzeComplete('fantasyspringsresort.com');
  const slug=results.at(-1).r.candidates[0].slug;
  assert.equal(await m.confirmAvailable(slug,async()=>false),false);
  assert.equal(m.checkout(base),base);
  let finish;const pending=m.confirmAvailable(slug,()=>new Promise(r=>finish=r));
  m.reset();finish(true);assert.equal(await pending,false);
  assert.equal(m.checkout(base),base);
});
test('a slow first confirmation cannot overwrite a later business choice',async()=>{
  const results=[];const m=createMatchState(async()=>map,(r,c)=>results.push({r,c}));
  await m.analyzeComplete('brandinitoffee.com');
  const [a,b]=results.at(-1).r.candidates;
  let finish;const first=m.confirmAvailable(a.slug,()=>new Promise(r=>finish=r));
  assert.equal(await m.confirmAvailable(b.slug,async()=>true),true);
  finish(true);assert.equal(await first,false);
  assert.equal(new URL(m.checkout(base)).searchParams.get('client_reference_id'),b.slug);
  m.unconfirm();assert.equal(m.checkout(base),base);
});
