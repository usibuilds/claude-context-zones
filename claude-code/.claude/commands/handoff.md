---
description: Save a handoff summary to docs/HANDOFF.md before starting a fresh session
---
Write (overwrite) `docs/HANDOFF.md` using the template already in that file. Keep it under 60 lines. Fill in:

1. **Feature in progress** — which F-number from `docs/PLAN.md`, and its status
2. **Decisions made** this session (and why, in one line each)
3. **Files created/changed** (paths only)
4. **What works / what is tested** (tests or manual checks that passed)
5. **Open bugs / known issues**
6. **Next 3 steps** — concrete and small
7. **Watch out** — anything a fresh session could get wrong

If a feature is fully done and tested, tick it `[x]` in `docs/PLAN.md`.
Do not paste code into the handoff — reference file paths instead.
Finish with exactly one line: `✅ Handoff saved. Now run /clear, then /resume.`
