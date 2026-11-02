# Install in Claude Code

## Requirements
- Claude Code
- Node.js on your PATH (`node -v`) — the hooks are plain Node scripts with no npm dependencies

## Option A — installer (recommended)
```bash
./install.sh /path/to/your-project        # macOS / Linux / Git Bash on Windows
```
```powershell
.\install.ps1 C:\path\to\your-project     # Windows PowerShell
```
The installer:
1. copies `claude-code/.claude/` into your project (backs up an existing `settings.json` to `settings.backup.json`)
2. adds `docs/PLAN.md` and `docs/HANDOFF.md` **only if they don't exist**
3. installs both skills to your personal skills folder (`~/.claude/skills/`) so they work in every project
4. runs the status line once so you can see it works

If your project already has a `.claude/settings.json`, merge the `statusLine` and `hooks` blocks from the backup by hand.

## Option B — manual
1. Copy `claude-code/.claude/` into your project root.
2. Copy `skills/context-guardian` and `skills/feature-builder` into `~/.claude/skills/` (all projects) or `<project>/.claude/skills/` (this project only).
3. Copy `claude-code/docs/PLAN.md` + `HANDOFF.md` into `<project>/docs/` and edit PLAN.md for your project.
4. Add the rules from `claude-code/CLAUDE.md` to your project's CLAUDE.md (keep it short — it loads every turn).

## Check it works
Start `claude` in the project. You should see at the bottom:
```
🟢 Context 6% (12K/200K) │ Plan 1/8 │ Next: F1 Auth
```
If the status line is empty, use an absolute path in `.claude/settings.json`:
`"command": "node /full/path/to/project/.claude/hooks/statusline.js"` (on Windows use forward slashes: `C:/Users/me/project/...`).

## Commands
| Command | What it does |
|---|---|
| `/resume` | Reads PLAN.md + HANDOFF.md only, tells you where you are and the next 3 steps |
| `/feature F3` | One feature: mini-plan + acceptance tests → your OK → build → test → tick in PLAN.md |
| `/handoff` | Writes docs/HANDOFF.md, ready for `/clear` |
| `/bug <description>` | QA flow: failing test first → fix → green |
| `/context-guardian`, `/feature-builder` | The skills, if you want to call them directly |

## Settings
| Variable / constant | Default | Meaning |
|---|---|---|
| `CG_LANG` | `en` | `ur` = Roman Urdu alerts |
| `CONTEXT_LIMIT` | from Claude Code, else 200000 | Window size, e.g. `1000000` |
| `GREEN_MAX` / `YELLOW_MAX` in `lib.js` | 40 / 60 | Zone limits in % |

Alert state is stored in `~/.claude/context-guardian/` so each alert fires once per session.

## Uninstall
Delete the `statusLine` and `hooks` entries from `.claude/settings.json` (or the file), and `.claude/hooks/`.
