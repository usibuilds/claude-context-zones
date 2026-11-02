# CLAUDE.md — project rules (keep this file SHORT; it loads every turn)

## Workflow: top-down plan, bottom-up build
- Source of truth: `docs/PLAN.md` (what to build) + `docs/HANDOFF.md` (where we stopped).
- One feature per session. Start with `/resume` or `/feature F<n>`.
- Read only the files the current step needs. Never read the whole project "to understand it".
- When a feature passes its tests: tick it in PLAN.md, update HANDOFF.md, tell the user to `/clear`.

## Context hygiene
- If the Context Guardian says yellow: finish the current task, start nothing new.
- If it says red: write the handoff, then ask the user to `/clear` and `/resume`.
- Large docs (PDF/DOCX/XLSX): convert to Markdown first (`markitdown file.pdf -o file.md`) and read the .md.
- Logs: read only the last ~80 lines, never the whole file.

## Communication
- <your language preference, e.g. "Explain in English; keep code and file names in English">
- Short answers; explain the "why" in one line when you change something important.

## Project basics
- <stack, how to run, how to test — 3 to 6 lines>
