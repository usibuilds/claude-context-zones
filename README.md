# Claude Context Zones 🟢🟡🔴

**Keep long Claude sessions sharp and cheap: a traffic-light context meter, one-time zone alerts, clean handoffs, and a "top-down plan, bottom-up build" workflow with a ✅ FEATURE COMPLETE signal.**

Works in **claude.ai** (as two Skills) and in **Claude Code** (as Skills + a status line + hooks + slash commands).

```
🟢 Context 18% (36K/200K) │ Plan 3/8 │ Next: F4 Customers
🟡 CONTEXT 47% (94K/200K) — Yellow zone. Finish the current task; start nothing new here.
🔴 CONTEXT 63% (126K/200K) — Red zone! Next: /handoff → /clear → /resume
✅ FEATURE COMPLETE: F3 Stock (4/8 done). Tested? Then: /handoff → /clear → /resume → next: F4 Customers
```

> Built by **Usaid Shahid Farooq (Usi)** — QA engineer turned AI-automation builder — while building a real multi-tenant SaaS with Claude Code.
> 🇵🇰 Roman Urdu guide: [README.ur.md](README.ur.md)

---

## The problem

1. **Every message re-reads the whole chat.** A 150K-token conversation costs ~150K tokens of reading on *every* reply, so usage limits disappear fast.
2. **Long context makes answers worse ("context rot").** Research across many frontier models found accuracy degrades as input grows — well before the window is full — and details buried in the middle are recalled worst ([Chroma, 2025](https://research.trychroma.com/context-rot); "Lost in the Middle", Liu et al., TACL 2024).
3. **Starting a new chat loses everything** — unless you hand off properly.

## The solution

| Piece | What it does |
|---|---|
| **Zones** | 🟢 0–40% normal · 🟡 40–60% finish the current task · 🔴 60%+ hand off and start fresh |
| **One-time alerts** | You're told once when you *enter* a zone — no spam on every message |
| **Handoff** | A ≤60-line summary (decisions, status, files, bugs, next 3 steps) that a fresh chat continues from |
| **Top-down plan** | A short `PLAN.md` (features as a checklist) — the blueprint every session reads |
| **Bottom-up build** | One feature per session, with QA-style acceptance tests agreed *before* coding |
| **✅ FEATURE COMPLETE** | Fires when a feature is ticked done → handoff → fresh session for the next one |

A fresh session reads `PLAN.md` + `HANDOFF.md` (~2–5K tokens) instead of an old 100K+ chat history.

---

## What's inside

```
skills/
  context-guardian/SKILL.md   ← zones, alerts, handoff (claude.ai + Claude Code)
  feature-builder/SKILL.md    ← top-down plan, bottom-up build, FEATURE COMPLETE
claude-code/
  .claude/settings.json       ← status line + hooks
  .claude/hooks/              ← statusline.js, context-alert.js, feature-done.js, lib.js (Node, no npm deps)
  .claude/commands/           ← /resume, /feature, /handoff, /bug
  docs/PLAN.md, docs/HANDOFF.md, CLAUDE.md   ← templates
dist/                         ← ready-to-upload ZIPs for claude.ai
docs/                         ← install guides, how it works, how to measure results
install.ps1 / install.sh      ← one-command Claude Code install into any project
```

## Quick start

### claude.ai (Pro, Max, Team, Enterprise)
1. Settings → Capabilities → make sure **Code execution and file creation** is on.
2. In **Skills**, click **Upload skill** → upload `dist/context-guardian.zip`. Repeat for `dist/feature-builder.zip`.
3. Toggle both on. In a long chat, type **"context check"** or **"handoff"**. To plan a project: **"use feature-builder to plan my app"**.

Full guide: [docs/INSTALL-claude-ai.md](docs/INSTALL-claude-ai.md)

> In claude.ai there is no exact token meter, so the skill **estimates**. Claude Code gives exact numbers.

### Claude Code
```bash
# from this repo, install into your project:
./install.sh /path/to/your-project            # macOS / Linux / Git Bash
.\install.ps1 C:\path\to\your-project         # Windows PowerShell
```
Restart Claude Code in the project. Daily loop:
```
/resume → /feature F2 → (mini-plan + tests → OK → build → green) → ✅ FEATURE COMPLETE → /handoff → /clear → /resume
```
Full guide: [docs/INSTALL-claude-code.md](docs/INSTALL-claude-code.md)

**Options:** `CG_LANG=ur` for Roman Urdu alerts · `CONTEXT_LIMIT=1000000` for 1M-context models · zone limits in `.claude/hooks/lib.js` (`GREEN_MAX`, `YELLOW_MAX`).

The plan reader understands two formats: a checklist (`- [x] **F1 Auth**`) in `docs/PLAN.md`, or a Markdown table with a **Status** column (e.g. a `PROGRESS.md` where rows say `Done`).

---

## Does it actually help? Measure it

Don't trust claims — test it like QA. [docs/MEASURE-RESULTS.md](docs/MEASURE-RESULTS.md) has a 3-sessions-before / 3-sessions-after protocol (context % at session start, messages until 🔴, `/cost` per feature, re-work count).

Real example from the author's Laravel SaaS: the progress file every session read was **~117K characters (~33K tokens)**. Splitting it into a slim tracker (~4.6K chars, ~1.3K tokens) plus a grep-only archive cut that per-session cost by roughly **96%**.

## How it works

[docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) — how the hooks read token usage from the session transcript, why alerts fire once, and what each skill tells Claude.

## Prior art & credit

Watching context and writing handoffs is a common practice, and other community skills exist with similar goals (including one also named "context guardian", focused on preserving data before auto-compaction). Claude Code also ships `/context`, `/compact` and auto-compaction. This project's own contribution is the specific combination: **traffic-light zones + one-time alerts + plan-aware status line + FEATURE COMPLETE signal + a QA-style one-feature-per-session workflow**, packaged for both claude.ai and Claude Code.

Research: Chroma — *Context Rot* (2025); Liu et al. — *Lost in the Middle* (TACL 2024).

## Roadmap
- [ ] Claude Code plugin / marketplace install
- [ ] More languages for alerts
- [ ] Optional cost estimate in the status line

## License
MIT — see [LICENSE](LICENSE). Use it, fork it, improve it; a link back is appreciated.
