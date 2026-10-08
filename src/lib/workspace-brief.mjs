import { decisionRequirements } from './decision-requirements.mjs';
export function workspaceBrief(input, option, comparedRequirements) {
  const requirements=comparedRequirements ?? decisionRequirements(input,input.group_size ?? null);
  return ['Workspace / founder-support inquiry — prepared only; nothing sent or reserved.',`Operator/program: ${option.name}`,`Original request: ${input.query}`,`Requirements: ${JSON.stringify(requirements)}`,'Please confirm product, date/time, capacity and working setup, eligibility and access, privacy/accessibility, complete itemized price, cancellation/refund terms, and the official booking/confirmation process.',`Published evidence checked: ${option.source_checked_at}; current availability unknown.`,`Official pathway: ${option.official_actions[0].url}`].join('\n');
}
