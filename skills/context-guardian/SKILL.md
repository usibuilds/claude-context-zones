---
name: context-guardian
description: Track how full the current chat's context window is (green/yellow/red zones), alert once when a zone is crossed, and write a copy-ready handoff so work continues in a fresh chat without losing context. Use in long working chats, or when the user says "context check", "handoff" or "summary for a new chat".
license: MIT
---

# Context Guardian

Goal: the user never loses context, and never wastes tokens and quality on an overloaded chat.
Reply in the user's language. Keep the handoff block in English (or the language of the project) so any chat can use it.

## Why this matters
Every new message makes the model re-read the whole conversation, so long chats burn usage limits faster.
Research on "context rot" shows answer quality also drops as context grows, and details in the middle of a long context are recalled worst. Working in short, focused chats with clean handoffs avoids both problems.

## 1. Estimate the context (every reply in a working chat)
Chat apps usually show no exact meter, so estimate:
- Count everything in this chat: all messages, your replies, pasted text, attached files, tool results and project knowledge files.
- Rough rule: 1 token ≈ 4 characters of English, ≈ 3 characters of code or non-English text written in Latin script. A full PDF page ≈ 500–800 tokens. An image ≈ 1,500 tokens.
- Assume a 200K-token window unless the user says otherwise.
- Be honest that this is an estimate. Round to the nearest 5%.

| Zone | Range | Meaning |
|---|---|---|
| 🟢 Green | 0–40% | Normal work |
| 🟡 Yellow | 40–60% | Finish the current task, start nothing new |
| 🔴 Red | 60%+ | Write the handoff, move to a new chat |

## 2. Alerts
- Do NOT print a meter on every reply while in green.
- The first time the chat enters yellow, put this at the TOP of your reply (in the user's language):
  `🟡 Context ~<n>% — finish the current task here; start new topics in a new chat.`
- The first time it enters red, put this at the TOP:
  `🔴 Context ~<n>% — say "handoff" and I'll write a summary for a fresh chat.`
- After that, one short line at the end of each reply is enough (e.g. `🔴 ~70%`).
- When the user says "context check", give the zone, the estimate, and the biggest items (e.g. "2 PDFs ≈ 30K").

## 3. Handoff (when the user says "handoff", or after a feature is done)
Produce ONE copy-ready block, max ~50 lines:

```
# HANDOFF — <project / task> — <date>
## Goal
## Decisions made (with 1-line reason)
## Current status (done / in progress / not started)
## Key facts & numbers to keep
## Files / links involved
## Open questions / bugs
## Next 3 steps
## Instructions for the new chat
Continue from this handoff. Do not ask me to repeat context. Start with step 1.
```

Then tell the user: copy it → open a new chat (same Project if they use Projects) → paste → continue.
In a Project, suggest saving it as `HANDOFF.md` in the project knowledge, replacing the previous one rather than adding a new file each time.

## 4. Token-saving nudges (only when relevant, max one per reply)
- A big PDF/DOCX/XLSX was attached → suggest converting it to Markdown (e.g. Microsoft's MarkItDown) and attaching the .md next time.
- The user starts an unrelated topic in a long chat → suggest a new chat for it.
- The same long file was pasted twice → point it out.
