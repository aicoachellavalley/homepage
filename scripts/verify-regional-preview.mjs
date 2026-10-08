#!/usr/bin/env node
// Repeatable read-only real-network MCP check. SDK remains outside site dependencies.
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, token, i, all) => token.startsWith('--') ? [...pairs, [token.slice(2), all[i + 1]]] : pairs, []));
if (!args.endpoint || !args['sdk-path']) {
  console.error('Usage: node scripts/verify-regional-preview.mjs --endpoint https://<immutable-preview>/mcp --sdk-path /path/to/node_modules/@modelcontextprotocol/sdk');
  process.exit(2);
}
const sdk = resolve(args['sdk-path']);
const { McpError, ErrorCode } = await import(pathToFileURL(resolve(sdk, 'dist/esm/types.js')));
const { Client } = await import(pathToFileURL(resolve(sdk, 'dist/esm/client/index.js')));
const { StreamableHTTPClientTransport } = await import(pathToFileURL(resolve(sdk, 'dist/esm/client/streamableHttp.js')));
const client = new Client({ name: 'aicv-regional-preview-evaluator', version: '1.0.0' });
const transport = new StreamableHTTPClientTransport(new URL(args.endpoint));
const summary = { endpoint: args.endpoint, checked_at: new Date().toISOString(), transport: 'official MCP SDK Streamable HTTP', synthetic: true, discovery: {}, cases: [], limitations: ['Synthetic read-only retrieval, not an independent assistant account installation, organic discovery, live availability, operator attestation or booking.'] };
const scenarios = [
  ['executive', { query: 'Executive strategy retreat for 16 people, two nights and private working room', group_size: 16, nights: 2 }],
  ['shared-budget', { query: 'Practical strategy retreat for 16 people sharing rooms, $25,000 total, two nights', group_size: 16, shared_lodging: true, nights: 2, budget: '$25,000 total' }],
  ['wellness', { query: 'Wellness retreat for 16 people, yoga and mindfulness, two nights', group_size: 16, purpose: 'wellness', nights: 2 }],
  ['boutique', { query: 'Boutique hotel leadership retreat for 16 people', group_size: 16 }],
  ['private', { query: 'Private estate retreat for 16 people sharing rooms with chef and AV', group_size: 16, shared_lodging: true, privacy: 'exclusive-use' }],
  ['day-only', { query: 'Day-only team retreat for 16 people, no overnight stay', group_size: 16, day_only: true }],
  ['large', { query: 'Leadership retreat for 60 people', group_size: 60 }],
  ['accessibility', { query: 'Leadership retreat for 16 people', group_size: 16, accessibility: 'Two wheelchair users need step-free rooms and meeting routes' }],
  ['strict-city', { query: 'Leadership retreat in Palm Desert for 16 people', group_size: 16 }],
  ['nearby', { query: 'Leadership retreat near Palm Springs for 16 people', group_size: 16 }],
  ['Bermuda-Dunes', { query: 'Retreat at VenueTEN for 16 people', city: 'Bermuda Dunes', group_size: 16, shared_lodging: true }],
  ['unsupported-name', { query: 'Plan an overnight retreat at Palm Canyon Unrecorded Motel for 16 people', group_size: 16 }],
  ['outside-coverage', { query: 'Leadership retreat near San Diego for 16 people', group_size: 16 }],
  ['not-sharing', { query: 'Leadership retreat for 16 people. We are not sharing rooms', group_size: 16 }],
  ['overnight-with-meeting-day', { query: 'Leadership retreat for 16 people. Two nights with one day of strategy meetings', group_size: 16, shared_lodging: false }],
  ['explicit-nights-with-meeting-day', { query: 'Leadership retreat for 16 people. Two nights with one day of strategy meetings', group_size: 16, shared_lodging: false, nights: 2 }],
  ['exclude-Parker', { query: 'Leadership retreat for 16 people. Exclude Parker', group_size: 16 }],
  ['alternatives-to-Sensei', { query: 'Wellness retreat for 16 people; alternatives to Sensei', group_size: 16 }],
];
async function call(name, arguments_) {
  const value = await client.callTool({ name, arguments: arguments_ });
  assert.equal(value.isError, false);
  const text = value.content.find((c) => c.type === 'text');
  assert.ok(text); assert.ok(value.structuredContent);
  assert.deepEqual(JSON.parse(text.text), value.structuredContent);
  return value.structuredContent;
}
async function rejectedCall(name, arguments_) {
  try {
    await client.callTool({ name, arguments: arguments_ });
    assert.fail(`Expected server rejection for ${name}`);
  } catch (error) {
    assert.ok(error instanceof McpError, 'Expected an MCP JSON-RPC error, not a transport or client assertion failure');
    assert.equal(error.code, ErrorCode.InvalidParams);
    return { rejected: true, json_rpc_error_code: error.code, message: error.message };
  }
}
function assertNoTransactionClaims(value) {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    assert.ok(!['booking_id', 'reservation_id', 'confirmation_number', 'payment_id', 'payment_intent', 'charge_id', 'receipt_url'].includes(key), `Unexpected transaction evidence field ${key}`);
    if (['booked', 'reserved', 'reservation_confirmed', 'payment_completed', 'paid'].includes(key)) assert.notEqual(child, true, `Unexpected transaction completion ${key}`);
    assertNoTransactionClaims(child);
  }
}
try {
  await client.connect(transport);
  const tools = (await client.listTools()).tools;
  assert.deepEqual(tools.map((t) => t.name), ['resolve_local_intent', 'search_business_previews', 'get_business_preview']);
  const resolver = tools.find((t) => t.name === 'resolve_local_intent');
  const fields = ['rooms', 'shared_lodging', 'day_only', 'nights', 'purpose', 'budget', 'privacy', 'accessibility', 'nearby'];
  fields.forEach((field) => assert.ok(resolver.inputSchema.properties[field], `Missing input schema ${field}`));
  assert.ok(tools.every((t) => t.annotations?.readOnlyHint && !t.annotations?.destructiveHint && !t.annotations?.openWorldHint));
  summary.discovery = { server: client.getServerVersion(), capabilities: client.getServerCapabilities(), tool_names: tools.map((t) => t.name), resolver_fields: Object.keys(resolver.inputSchema.properties), read_only: true };
  for (const [label, parameters] of scenarios) {
    const r = await call('resolve_local_intent', parameters);
    if (['unsupported-name', 'outside-coverage'].includes(label)) { assert.equal(r.status, 'no_match'); assert.equal(r.results.length, 0); }
    else {
      assert.equal(r.intent, 'team-retreat'); assert.ok(r.results.length > 0 && r.results.length <= 5);
      r.results.forEach((v) => {
        assert.ok(v.source_checked_at); assert.ok(v.field_evidence); assert.equal(v.fit_assessment_type, 'judgment');
        assert.ok(v.unknowns.some((u) => /availability.*quote|quote.*availability/.test(u)));
        assert.ok(v.official_actions.length > 0);
        v.official_actions.forEach((a) => { assert.match(a.url, /^https:\/\//); assert.equal(a.checked_at, v.source_checked_at); });
      });
    }
    if (label === 'strict-city') assert.ok(r.results.every((v) => v.city === 'Palm Desert'));
    if (label === 'nearby') { assert.ok(r.results.some((v) => v.city !== 'Palm Springs')); assert.match(r.next_questions.join(' '), /drive time/); }
    if (label === 'shared-budget') { assert.equal(r.requirements.rooms, 8); assert.ok(r.results.every((v) => v.unknowns.some((u) => /Affordability.*unknown/.test(u)))); }
    if (label === 'wellness') assert.ok(r.results.some((v) => /Sensei|Two Bunch/.test(v.name)));
    if (label === 'Bermuda-Dunes') { assert.equal(r.results.length, 1); assert.equal(r.results[0].city, 'Bermuda Dunes'); }
    if (label === 'large') { assert.ok(r.results.some((v) => v.meeting_spaces.some((space) => space.capacity >= 60 && /conference|classroom|schoolroom|u.shape|boardroom/.test(space.layout)))); assert.ok(!r.results.some((v) => /sensei/i.test(v.name))); assert.ok(r.exclusions.some((v) => /sensei/i.test(v.name))); }
    if (label === 'not-sharing') { assert.equal(r.requirements.shared_lodging, false); assert.equal(r.requirements.rooms, 16); }
    if (label.endsWith('with-meeting-day')) { assert.equal(r.requirements.day_only, false); assert.equal(r.requirements.nights, 2); assert.equal(r.requirements.rooms, 16); }
    if (['exclude-Parker', 'alternatives-to-Sensei'].includes(label)) {
      const id = label === 'exclude-Parker' ? 'node/parker-palm-springs' : 'node/sensei-porcupine-creek';
      assert.ok(r.results.length >= 3 && r.results.every(v => v.id !== id));
      assert.ok(r.exclusions.some(v => v.id === id && v.reasons.some(reason => reason.evidence_type === 'caller_requirement')));
    }
    summary.cases.push({ label, status: r.status, requirements: r.requirements ?? null, selected: r.results.map((v) => ({ id: v.id, name: v.name, city: v.city, source_checked_at: v.source_checked_at, node_last_updated: v.node_last_updated, fit_reasons: v.fit_reasons, unknowns: v.unknowns, official_actions: v.official_actions })), exclusions: r.exclusions ?? [], unestablished_matches: r.unestablished_matches ?? [], supporting_services: r.supporting_services?.map((v) => ({ id: v.id, name: v.name, type: v.service_type, source_checked_at: v.source_checked_at, official_actions: v.official_actions })) ?? [], service_exclusions: r.service_exclusions ?? [], next_questions: r.next_questions, text_structured_agreement: true });
  }
  const workspaceCases=[
    ['day-pass',{query:'Find a coworking day pass in Palm Springs',workspace_access:'day-pass'}],
    ['strict-Palm-Desert-day',{query:'Find a coworking day pass in Palm Desert',workspace_access:'day-pass'}],
    ['comfortable-not-maximum',{query:'Meeting room at The Hive for 9 people for 1.5 hours',workspace_type:'meeting-room',group_size:9}],
    ['virtual-office',{query:'Find a virtual office in Palm Springs',workspace_type:'virtual-office'}],
    ['satellite-base',{query:'Evaluate a satellite base in Palm Desert',decision:'satellite-base'}],
    ['founder-support',{query:'Find founder support in Palm Desert',decision:'founder-support'}],
    ['exclude-Hive',{query:'Coworking day pass in Palm Springs; alternatives to The Hive',workspace_access:'day-pass'}],
    ['exact-Regus',{query:'Coworking day pass at Regus in Palm Springs',workspace_access:'day-pass'}],
    ['conflicting-structured',{query:'Coworking meeting room for 12 people for 2 hours with $100 total budget',group_size:8,duration_hours:4,budget_amount:200,budget_scope:'per-hour'}],
    ['transaction-boundary',{query:'Find coworking day pass in Palm Springs',required_action:'transaction'}],
    ['unknown-requested',{query:'Find a workspace',requested_entities:['Zzqx Unrecorded Workspace']}],
    ['mixed-negation',{query:'A coworking desk, not a private office, but confidential calls require privacy in Palm Springs.'}],
    ['physical-office',{query:'Find a physical office at Fusion Workplaces in Palm Desert for 2 days, budget $119 total',workspace_type:'office'}],
  ];
  summary.workspace_cases=[];
  for(const [label,parameters] of workspaceCases) {
    const r=await call('resolve_local_intent',parameters);
    if(['strict-Palm-Desert-day','unknown-requested'].includes(label)) {assert.equal(r.status,'no_match');assert.equal(r.results.length,0);}
    else {assert.ok(r.results.length>0&&r.results.length<=5);for(const o of r.results){assert.equal(o.action_capability,'official_handoff');assert.ok(o.field_evidence);assert.ok(o.unknowns.length);assert.ok(o.official_actions.every(a=>a.url.startsWith('https://')&&a.checked_at));}}
    if(label==='day-pass')assert.ok(r.results.some(o=>o.id==='workspace/regus-750-n-palm-canyon'));
    if(label==='comfortable-not-maximum'){assert.equal(r.requirements.duration_hours,1.5);assert.equal(r.results[0].id,'workspace/the-hive-coworking');assert.match(r.results[0].unknowns.join(' '),/9 attendees/);}
    if(label==='virtual-office')assert.ok(r.results.every(o=>o.purposes.includes('virtual-office')));
    if(label==='exclude-Hive'){assert.ok(r.results.every(o=>o.id!=='workspace/the-hive-coworking'));assert.ok(r.exclusions.some(o=>o.id==='workspace/the-hive-coworking'));}
    if(label==='exact-Regus'){assert.equal(r.results.length,1);assert.equal(r.results[0].id,'workspace/regus-750-n-palm-canyon');}
    if(label==='conflicting-structured'){assert.equal(r.requirements.group_size,8);assert.equal(r.requirements.duration_hours,4);assert.ok(r.requirement_conflicts.length>=3);}
    if(label==='transaction-boundary')assert.match(r.unresolved_constraints.join(' '),/exceeds official_handoff/);
    if(label==='mixed-negation'){assert.notEqual(r.requirements.workspace_type,'office');assert.ok(r.requirements.privacy);}
    if(label==='physical-office'){assert.equal(r.results[0].id,'workspace/fusion-workplaces-palm-desert');assert.match(r.results[0].unknowns.join(' '),/Virtual-office prices are not physical/);}
    assertNoTransactionClaims(r);
    summary.workspace_cases.push({label,parameters,status:r.status,intent:r.intent,requirements:r.requirements,requirement_conflicts:r.requirement_conflicts??[],selected:r.results.map(o=>({id:o.id,name:o.name,field_evidence:o.field_evidence,official_actions:o.official_actions,unknowns:o.unknowns})),exclusions:r.exclusions??[],unresolved_constraints:r.unresolved_constraints??[],text_structured_agreement:true});
  }
  const identity=await call('get_business_preview',{id:'local/entrepreneurship-resource-center'});
  assert.equal(identity.record.observation_date,'2026-09-01');assert.equal(identity.record.source_checked_at,'2026-10-07');
  summary.workspace_identity={id:identity.record.id,observation_date:identity.record.observation_date,source_checked_at:identity.record.source_checked_at};
  summary.workspace_negative_controls={malformed_entities:await rejectedCall('resolve_local_intent',{query:'Coworking',requested_entities:'Hive'}),invalid_budget_scope:await rejectedCall('resolve_local_intent',{query:'Coworking',budget_scope:'cheapest'}),unknown_action_tool:await rejectedCall('execute_workspace_payment',{})};
  // Synthetic clarification tightens a returned room-sharing/budget question.
  const followup = await call('resolve_local_intent', { query: 'Leadership strategy retreat near Palm Springs for 16 people', group_size: 16, rooms: 8, shared_lodging: true, nights: 2, budget: '$25,000 whole retreat', privacy: 'private-working-room' });
  assert.equal(followup.requirements.rooms, 8); assert.equal(followup.requirements.nights, 2);
  summary.followup = { kind: 'synthetic clarification; not actual assistant conversation', requirements: followup.requirements, selected_ids: followup.results.map((r) => r.id), next_questions: followup.next_questions };
  const missing = await call('get_business_preview', { id: 'local/nonexistent' }); assert.equal(missing.status, 'not_found');
  const coffee = await call('resolve_local_intent', { query: 'Find a quiet Palm Desert coffee shop near El Paseo' }); assert.equal(coffee.intent, 'local-business'); assert.ok(coffee.results.length);
  const transaction = await call('resolve_local_intent', { query: 'Book and pay for a leadership retreat at Hotel Paseo for 16 people', group_size: 16 });
  assert.equal(transaction.intent, 'team-retreat');
  assert.equal(transaction.status, 'needs_details');
  assert.match(transaction.limitations.join(' '), /read-only.*not live availability, prices or booking execution/i);
  assertNoTransactionClaims(transaction);
  assert.ok(transaction.results.every((v) => v.official_actions.every((a) => a.kind === 'official_group_proposal')));
  summary.transaction_boundary = { kind: 'synthetic unsupported booking/payment request', status: transaction.status, read_only_boundary: transaction.limitations.filter((line) => /read-only|booking execution/.test(line)), no_transaction_claims: true, selected_ids: transaction.results.map((v) => v.id), official_handoff_kinds: [...new Set(transaction.results.flatMap((v) => v.official_actions.map((a) => a.kind)))] };
  const unknownTool = await rejectedCall('book_and_pay_for_retreat', {});
  const invalidRooms = await rejectedCall('resolve_local_intent', { query: 'Leadership retreat', rooms: 0 });
  const invalidSharing = await rejectedCall('resolve_local_intent', { query: 'Leadership retreat', shared_lodging: 'yes' });
  summary.negative_controls = { unknown_record: missing.status, coffee_intent: coffee.intent, unknown_tool: unknownTool, malformed_rooms: invalidRooms, malformed_shared_lodging: invalidSharing };
  summary.passed = true;
} catch (error) {
  summary.passed = false; summary.error = error.message; process.exitCode = 1;
} finally {
  await client.close().catch(() => {});
  console.log(JSON.stringify(summary, null, 2));
}
