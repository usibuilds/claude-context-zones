---
description: QA-style bug fix — reproduce with a failing test first, then fix, then green
argument-hint: [what is wrong, e.g. "cart total ignores discount"]
---
Bug: **$ARGUMENTS**

Follow a QA workflow (no guess-fixes):

1. **Bug report table:** Steps to reproduce · Expected · Actual · Environment/role. Ask me at most 3 questions for anything missing.
2. **Evidence:** read only the last 80 lines of the app log (never the whole file).
3. **Reproduce:** write a test that **fails** because of the bug. Run it and show it is red.
4. **Fix** with the smallest change that works.
5. Run that test (green), then its test file, then the full suite.
6. Add a 3-line note to `docs/HANDOFF.md` (bug, cause, test name).

Finish with: `🐞→✅ Bug fixed: <1 line>. Test: <test name>.`
