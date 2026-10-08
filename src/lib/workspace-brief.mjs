import { decisionRequirements } from './decision-requirements.mjs';
export function workspaceBrief(input, option, comparedRequirements) {
  const requirements=comparedRequirements ?? decisionRequirements(input,input.group_size ?? null);
  const display=value=>value===null || value===undefined || value==='' ? 'Unspecified' : String(value);
  const enumDisplay=value=>display(value).replaceAll('_',' ').replaceAll('-',' ');
  const names=value=>value?.length ? value.join('; ') : 'None specified';
  const budget=requirements.budget_amount!==null && requirements.budget_amount!==undefined ? `${requirements.budget_amount} ${requirements.budget_currency ?? 'currency unresolved'} (${enumDisplay(requirements.budget_scope)})` : display(requirements.budget);
  return ['Workspace / founder-support inquiry — prepared only; nothing sent or reserved.',`Operator/program: ${option.name}`,`Original request: ${input.query}`,
    `Decision: ${enumDisplay(requirements.decision)}`,`Workspace type: ${enumDisplay(requirements.workspace_type)}`,
    `Location: ${display(requirements.location ?? (requirements.multiple_locations?requirements.query_locations.join('; '):null))}${requirements.location_basis==='service-geography'?' (service coverage; appointment location unconfirmed)':requirements.strict_city?' (strict city boundary)':requirements.nearby?' (regional anchor; proximity unverified)':''}`,
    `People: ${display(requirements.group_size)}`,`Duration: ${display(requirements.duration_hours)} hours; ${display(requirements.duration_days)} days`,
    `Budget: ${budget}; complete price unconfirmed`, `Working setup: ${display(requirements.working_setup)}`,
    `Access: ${enumDisplay(requirements.workspace_access)}`,`Privacy: ${display(requirements.privacy)}`,`Accessibility: ${display(requirements.accessibility)}`,
    `Requested entities: ${names(requirements.requested_entities)}`,`Excluded entities: ${names(requirements.excluded_entities)}`,`Required next step: ${enumDisplay(requirements.required_action)}`,
    ...(requirements.requirement_conflicts ?? []).map(text=>`Clarification required: ${text}`),
    ...(requirements.unresolved_quantities ?? []).map(text=>`Unresolved: ${text}`),
    'Please confirm product, date/time, capacity and working setup, eligibility and access, privacy/accessibility, complete itemized price, cancellation/refund terms, and the official booking/confirmation process.',`Published evidence checked: ${option.source_checked_at}; current availability unknown.`,`Official pathway: ${option.official_actions[0].url}`].join('\n');
}
