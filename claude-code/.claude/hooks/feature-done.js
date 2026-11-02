#!/usr/bin/env node
// Stop hook: runs when Claude finishes a reply.
// If a new feature was ticked [x] in docs/PLAN.md (or a PROGRESS.md row turned "Done"),
// you get a "✅ FEATURE COMPLETE → new chat" notification.
const { readStdin, loadState, saveState, planInfo, T } = require('./lib');
const path = require('path');

const input = readStdin();
if (input.stop_hook_active) process.exit(0);

const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const plan = planInfo(projectDir);
if (!plan) process.exit(0);

// one state file per project, so switching projects never fires a false alert
const key = 'plan-' + require('crypto').createHash('md5').update(path.resolve(projectDir)).digest('hex').slice(0, 10);
const state = loadState(key);
const before = new Set(state.doneTitles || plan.doneTitles); // first run: no alert
const newlyDone = plan.doneTitles.filter(t => !before.has(t));
state.doneTitles = plan.doneTitles;
saveState(key, state);

if (!newlyDone.length) process.exit(0);

process.stdout.write(JSON.stringify({
  systemMessage: T.done(newlyDone.join(', '), plan.done, plan.total, plan.next),
}));
