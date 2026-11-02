---
description: Build ONE feature from docs/PLAN.md — bottom-up, tested, then hand off
argument-hint: [feature number, e.g. F3]
---
We build feature **$ARGUMENTS** from `docs/PLAN.md` (if no number is given, take the first unchecked one).

Work in this order and stop for my OK after step 2:
1. Read only the feature's line in `docs/PLAN.md` plus the files it touches.
2. Propose a mini-plan: files to create/change, data changes, routes, and the **acceptance tests** (what "done" means, QA style: input → expected). Keep it short.
3. Build it in small steps. After each step run the relevant tests, or tell me exactly what to click to check it manually.
4. When every acceptance test passes:
   - tick the feature `[x]` in `docs/PLAN.md`
   - do the /handoff steps to update `docs/HANDOFF.md`
   - end with: `✅ FEATURE COMPLETE: <name>. Tested. Now /clear → /resume for the next feature.`

Rules: one feature per session. If you notice something for another feature, add it under "Later / Ideas" in PLAN.md instead of building it now.
