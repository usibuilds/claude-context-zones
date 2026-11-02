#!/usr/bin/env node
// UserPromptSubmit hook: runs every time you send a message.
// When you ENTER a new zone (yellow or red) it alerts you once, and tells
// Claude what to do next (wrap up / write the handoff).
const { readStdin, measure, k, loadState, saveState, T } = require('./lib');

const input = readStdin();
const m = measure(input);
const state = loadState(input.session_id);
const rank = { green: 0, yellow: 1, red: 2 };
const last = state.alertedZone || 'green';

if (rank[m.zone] <= rank[last]) {
  // context went down (e.g. after /compact) → re-arm alerts
  if (rank[m.zone] < rank[last]) { state.alertedZone = m.zone; saveState(input.session_id, state); }
  process.exit(0);
}

state.alertedZone = m.zone;
saveState(input.session_id, state);

const userMsg = m.zone === 'yellow'
  ? T.yellow(m.pct, k(m.used), k(m.limit))
  : T.red(m.pct, k(m.used), k(m.limit));

const claudeNote = m.zone === 'yellow'
  ? `Context Guardian: the session is at ${m.pct}% of the context window (yellow zone). ` +
    `Focus on finishing the current task only. Do not start new features. ` +
    `At the end of your reply, add one short line telling the user the session is in the yellow zone.`
  : `Context Guardian: the session is at ${m.pct}% of the context window (red zone). ` +
    `Answer the user's current message briefly, then write the handoff: follow this project's ` +
    `/handoff command (.claude/commands/handoff.md) if it exists, otherwise write docs/HANDOFF.md ` +
    `(decisions, current status, files touched, open bugs, next steps). Then tell the user to ` +
    `run /clear and then /resume to continue in a fresh session.`;

process.stdout.write(JSON.stringify({
  systemMessage: userMsg,
  hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: claudeNote },
}));
