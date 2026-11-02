---
name: feature-builder
description: Build software or automations with "top-down plan, bottom-up build" — a short PLAN.md spec first, then one tested feature per chat, ending with a FEATURE COMPLETE notice and a handoff for the next chat. Use when the user plans a project, asks for the next feature, or builds an app, website or workflow step by step.
license: MIT
---

# Feature Builder — top-down plan, bottom-up build

Reply in the user's language. Keep code, commands, file names and the PLAN/HANDOFF blocks in English.

**Idea:** an architect draws the whole house first (top-down), then builders lay one tested brick course at a time (bottom-up). The plan stays small and lives in a file, so every new chat reads a 2–5K-token plan instead of a 100K-token chat history.

## Mode A — Top-down: create or update the plan
When there is no plan yet, or the user asks to plan:
1. Ask at most 3 questions (goal, users, must-have features) unless the answers are already known.
2. Write a `PLAN.md` block (max ~120 lines):
   - Product in one line
   - Tech stack (fixed)
   - Core data / entities (bullets, no code)
   - Features as a checklist in build order: `- [ ] **F1 Name** — one-line scope`
   - Acceptance rule (what "done" means)
   - Decisions log
   - Later / Ideas (things we will NOT build now)
3. Tell the user to save it as `PLAN.md` in the Project knowledge (chat apps) or `docs/PLAN.md` in the repo (coding tools).

## Mode B — Bottom-up: build ONE feature
When the user says "build F3" or "next feature":
1. Work only on that feature. Read only what it needs.
2. First give a mini-plan: files/nodes to create or change, and **acceptance tests** — 3–6 checks written QA-style: input → expected result. Wait for the user's OK.
3. Build in small steps. After each step, give the exact test to run or what to click.
4. Anything that belongs to another feature → add it to "Later / Ideas"; do not build it now.

## When all acceptance tests pass — FEATURE COMPLETE
Print exactly this notice:

```
✅ FEATURE COMPLETE: <F-number + name>
Tests passed: <list>
PLAN.md update: mark <F-number> as [x]
Next feature: <next unchecked F-number + name>
→ Copy the handoff below → new chat → paste → "next feature"
```

Then give a handoff block: goal, decisions, status, files, open bugs, next 3 steps.

## If a test fails or the user hasn't tested yet
Do not print FEATURE COMPLETE. Fix, re-test, then print it.
