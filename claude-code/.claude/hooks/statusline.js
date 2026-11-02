#!/usr/bin/env node
// Status line: context zone + plan progress at the bottom of Claude Code.
// Example:  🟡 Context 52% (104K/200K) → finish task │ Plan 3/8 │ Next: F4 Customer ledger
const { readStdin, measure, k, ICON, planInfo, T } = require('./lib');

const input = readStdin();
const m = measure(input);
const projectDir = (input.workspace && input.workspace.project_dir) || input.cwd || process.cwd();
const plan = planInfo(projectDir);

const hint = { green: '', yellow: T.hintYellow, red: T.hintRed }[m.zone];
let out = `${ICON[m.zone]} Context ${m.pct}% (${k(m.used)}/${k(m.limit)})${hint}`;
if (plan) {
  out += ` │ Plan ${plan.done}/${plan.total}`;
  if (plan.next) out += ` │ Next: ${plan.next.slice(0, 40)}`;
}
process.stdout.write(out);
