// Shared helpers for Context Guardian (Claude Code hooks + statusline)
// Works on Windows, macOS, Linux. Needs only Node.js (no npm packages).
const fs = require('fs');
const path = require('path');
const os = require('os');

// ---- Settings you can change ------------------------------------------
// Zones as % of the context window (same as our "practical system")
const GREEN_MAX = 40;   // 0-40%  -> green
const YELLOW_MAX = 60;  // 40-60% -> yellow, 60%+ -> red
// Default window size. Override with env var CONTEXT_LIMIT (e.g. 1000000).
const DEFAULT_LIMIT = 200000;
// ------------------------------------------------------------------------

function readStdin() {
  try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); }
  catch { return {}; }
}

function contextLimit(input) {
  if (process.env.CONTEXT_LIMIT) return Number(process.env.CONTEXT_LIMIT);
  const cw = input && input.context_window;
  if (cw && Number(cw.context_window_size)) return Number(cw.context_window_size);
  const id = String((input && input.model && (input.model.id || input.model)) || '');
  if (/\[1m\]|1m/i.test(id)) return 1000000;
  return DEFAULT_LIMIT;
}

// Current context size = tokens the model read on its LAST turn.
// That number lives in the transcript (JSONL) as message.usage.
function usedTokens(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return 0;
  const lines = fs.readFileSync(transcriptPath, 'utf8').trim().split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    let row;
    try { row = JSON.parse(lines[i]); } catch { continue; }
    if (row.isSidechain) continue; // ignore subagent turns
    const u = row.message && row.message.usage;
    if (!u) continue;
    const total = (u.input_tokens || 0) + (u.cache_read_input_tokens || 0)
      + (u.cache_creation_input_tokens || 0) + (u.output_tokens || 0);
    if (total > 0) return total;
  }
  return 0;
}

function zoneOf(pct) {
  if (pct < GREEN_MAX) return 'green';
  if (pct < YELLOW_MAX) return 'yellow';
  return 'red';
}

const ICON = { green: '🟢', yellow: '🟡', red: '🔴' };

function measure(input) {
  const limit = contextLimit(input);
  let used = 0;
  const cw = input && input.context_window;
  if (cw && Number(cw.used_percentage) >= 0 && cw.used_percentage !== undefined) {
    used = Math.round(limit * Number(cw.used_percentage) / 100);
  } else {
    used = usedTokens(input.transcript_path);
  }
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  return { used, limit, pct, zone: zoneOf(pct) };
}

function k(n) { return n >= 1000 ? Math.round(n / 1000) + 'K' : String(n); }

// Small per-session state file so we alert once per zone, not every message.
function stateFile(sessionId) {
  const dir = path.join(os.homedir(), '.claude', 'context-guardian');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `state-${sessionId || 'default'}.json`);
}
function loadState(sessionId) {
  try { return JSON.parse(fs.readFileSync(stateFile(sessionId), 'utf8')); }
  catch { return {}; }
}
function saveState(sessionId, s) {
  try { fs.writeFileSync(stateFile(sessionId), JSON.stringify(s)); } catch {}
}

const clean = t => t.replace(/\*\*/g, '').replace(/\*\([^)]*\)\*/g, '').replace(/\*/g, '')
  .split(' — ')[0].trim();

// Format 1: checklist  "- [x] **F1 Name** — scope"
function parseChecklist(text) {
  const items = [...text.matchAll(/^\s*-\s*\[( |x|X)\]\s*(.+)$/gm)]
    .map(m => ({ done: m[1].toLowerCase() === 'x', title: clean(m[2]) }));
  const features = items.filter(i => /^F\d+/i.test(i.title));
  return features.length ? features : items;
}

// Format 2: markdown table with a "Status" column, e.g. PROGRESS.md
// | # | Session | ... | Status | Note |   → done when Status starts with Done/Final/✅
function parseStatusTable(text) {
  const lines = text.split('\n');
  const rows = [];
  let statusIdx = -1, titleIdx = 1;
  const cells = l => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!l.trim().startsWith('|')) { if (!l.trim()) continue; else { /* text between tables */ } continue; }
    const next = lines[i + 1] || '';
    if (/^\s*\|[\s:|-]+\|\s*$/.test(next)) {           // header row
      const h = cells(l);
      statusIdx = h.findIndex(c => /status/i.test(c));
      const t = h.findIndex(c => /session|feature|kaam|task/i.test(c));
      titleIdx = t >= 0 ? t : 1;
      i++; continue;
    }
    if (statusIdx < 0) continue;
    const c = cells(l);
    if (c.length <= statusIdx) continue;
    const done = /^[*\s]*(done|final|✅)/i.test(c[statusIdx]);
    rows.push({ done, title: clean(`${c[0]} ${c[titleIdx]}`) });
  }
  return rows;
}

// Reads the project plan and returns progress + the next open feature/session.
// Looks for docs/PLAN.md, PLAN.md, then PROGRESS.md (table format).
function planInfo(projectDir) {
  const dir = projectDir || process.cwd();
  for (const rel of [['docs', 'PLAN.md'], ['PLAN.md'], ['PROGRESS.md']]) {
    const p = path.join(dir, ...rel);
    if (!fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, 'utf8');
    let list = parseChecklist(text);
    if (!list.length) list = parseStatusTable(text);
    if (!list.length) continue;
    const done = list.filter(i => i.done);
    const next = list.find(i => !i.done);
    return {
      file: rel.join('/'),
      done: done.length,
      total: list.length,
      doneTitles: done.map(i => i.title),
      next: next ? next.title : null,
    };
  }
  return null;
}

// Alert language: CG_LANG=en (default) or CG_LANG=ur (Roman Urdu)
const LANG = (process.env.CG_LANG || 'en').toLowerCase().startsWith('ur') ? 'ur' : 'en';
const T = {
  en: {
    hintYellow: ' → finish task',
    hintRed: ' → /handoff + new chat',
    yellow: (p, u, l) => `🟡 CONTEXT ${p}% (${u}/${l}) — Yellow zone. Finish the current task; start nothing new here.`,
    red: (p, u, l) => `🔴 CONTEXT ${p}% (${u}/${l}) — Red zone! Next: /handoff → /clear → /resume`,
    done: (f, d, t, n) => `✅ FEATURE COMPLETE: ${f} (${d}/${t} done). Tested? Then: /handoff → /clear → /resume`
      + (n ? ` → next: ${n}` : ' → 🎉 plan finished!'),
  },
  ur: {
    hintYellow: ' → task khatam karein',
    hintRed: ' → /handoff + nayi chat',
    yellow: (p, u, l) => `🟡 CONTEXT ${p}% (${u}/${l}) — Yellow zone. Current task khatam karein, nayi cheez shuru na karein.`,
    red: (p, u, l) => `🔴 CONTEXT ${p}% (${u}/${l}) — Red zone! Next: /handoff → /clear → /resume`,
    done: (f, d, t, n) => `✅ FEATURE COMPLETE: ${f} (${d}/${t} done). Tested? Phir: /handoff → /clear → /resume`
      + (n ? ` → next: ${n}` : ' → 🎉 plan khatam!'),
  },
}[LANG];

module.exports = { T, readStdin, measure, k, ICON, loadState, saveState, planInfo, GREEN_MAX, YELLOW_MAX };
