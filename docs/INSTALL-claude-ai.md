# Install in claude.ai

## Requirements
- A Pro, Max, Team or Enterprise plan (Skills are not on the free plan)
- **Code execution and file creation** turned on (Settings → Capabilities). On Enterprise, an owner must enable Skills and code execution in Admin settings first.

## Upload
1. Download `dist/context-guardian.zip` and `dist/feature-builder.zip` from this repo.
   Each ZIP contains one folder named exactly like the skill, with a `SKILL.md` inside — that's the format claude.ai expects.
2. Settings → Capabilities → **Skills** → **Upload skill** → choose the ZIP.
3. Toggle the skill on. Repeat for the second ZIP.

## Use
| Say this | What happens |
|---|---|
| `context check` | Zone + estimate + what uses the most space |
| `handoff` | Copy-ready summary for a new chat |
| `use feature-builder to plan <my app>` | Up to 3 questions, then a PLAN.md |
| `build F2` / `next feature` | Mini-plan + acceptance tests → build → ✅ FEATURE COMPLETE |

Claude picks skills automatically from their description. If it doesn't, name the skill in your message.

## Using it with Projects
- Save `PLAN.md` and the latest `HANDOFF.md` in **Project knowledge**. Replace the old handoff each time — don't stack ten of them.
- Keep knowledge files lean: knowledge is loaded into chats, so a 50-page PDF costs tokens every time. Convert PDFs to Markdown first (e.g. `markitdown file.pdf -o file.md`).

## Editing a skill
1. Edit `SKILL.md` locally.
2. Zip the folder again (the folder name must stay the same as `name:` in the file).
3. In Skills, remove the old version and upload the new ZIP.

## Limits to know
- claude.ai shows no exact context meter, so the skill **estimates** from what is in the chat. Treat it as a guide, not a gauge.
- Uploaded skills are private to your account.
