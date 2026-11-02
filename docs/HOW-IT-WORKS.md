# How it works

## Analogy
The context window is a whiteboard. Every message, file and answer is written on it, and before every reply Claude re-reads the **whole** board. A fuller board means more tokens per reply, and more clutter to find the important line in.

## Claude Code: where the numbers come from
- Claude Code passes JSON to the status line and hooks on stdin, including `transcript_path` (the session's JSONL log) and, in newer versions, a `context_window` object.
- If `context_window.used_percentage` is present, it is used directly.
- Otherwise `lib.js` reads the transcript backwards and takes the last main-thread assistant turn's `usage`: `input_tokens + cache_read_input_tokens + cache_creation_input_tokens + output_tokens`. That is how much the model read on its last turn, which is a close approximation of the current context. Subagent turns (`isSidechain`) are ignored.
- `/context` in Claude Code gives the official detailed breakdown if you ever doubt the number.

## The three scripts
| Script | Event | Behaviour |
|---|---|---|
| `statusline.js` | status line refresh | Prints `🟢 Context 18% (36K/200K) │ Plan 3/8 │ Next: F4 …` |
| `context-alert.js` | `UserPromptSubmit` | When you move **up** into yellow or red, shows you a one-time `systemMessage` and adds a note to Claude's context (finish the task / write the handoff). Moving down (after `/compact` or `/clear`) re-arms the alerts. |
| `feature-done.js` | `Stop` | Compares PLAN.md's done items with the last run; a newly ticked feature triggers ✅ FEATURE COMPLETE. The first run only records state, so installing never fires a false alarm. |

## Projects with `"type": "module"`
Many projects (Laravel + Vite, most modern JS apps) set `"type": "module"` in their root `package.json`, which makes Node treat every `.js` file as an ES module, so `require()` fails. `.claude/hooks/package.json` contains `{"type": "commonjs"}` so the hooks always run as CommonJS, whatever the project uses.

## Plan formats
- **Checklist** in `docs/PLAN.md` or `PLAN.md`: `- [x] **F1 Auth** — …` (items starting with F + number are treated as features).
- **Status table** in `PROGRESS.md`: any Markdown table with a `Status` column; a row is done when the status starts with `Done`, `Final` or `✅`.

## The skills
- **context-guardian** — in claude.ai it estimates tokens (≈4 chars per English token, ≈500–800 tokens per PDF page) and follows the same zones; it writes a fixed-format handoff.
- **feature-builder** — Mode A writes the plan (top-down), Mode B builds one feature with acceptance tests agreed first (bottom-up), and prints FEATURE COMPLETE only after the tests pass.

## Why top-down + bottom-up?
| | Top-down only | Bottom-up only | Combined |
|---|---|---|---|
| Strength | Clear structure | Fast, tested progress | Both |
| Weakness | Plan can be wrong; slow start | Parts may not fit together | — |
| Context cost | Big planning chats | Re-work burns tokens | Small plan file + small sessions |

## Research
- Chroma, *Context Rot: How Increasing Input Tokens Impacts LLM Performance* (2025) — 18 models, accuracy drops as input grows, even on simple tasks.
- Liu et al., *Lost in the Middle* (TACL 2024) — U-shaped recall: start and end strong, middle weak.
