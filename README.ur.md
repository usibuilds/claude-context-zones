# Claude Context Zones — Roman Urdu guide 🟢🟡🔴

**Masla:** Claude har message par poori chat dobara parhta hai. Chat jitni lambi, utne zyada tokens jalte hain — aur research ke mutabiq jawab ki quality bhi girti hai ("context rot").

**Hal:** Traffic light system + saaf handoff + "pehle naqsha, phir ek ek eent".

| Zone | Range | Kya karein |
|---|---|---|
| 🟢 Green | 0–40% | Normal kaam |
| 🟡 Yellow | 40–60% | Current task khatam karein, nayi cheez shuru na karein |
| 🔴 Red | 60%+ | "handoff" likhein → nayi chat → paste |

## Do skills

| Skill | Kaam | Kaise chalayein |
|---|---|---|
| `context-guardian` | Context ka andaza, zone alert, handoff summary | Chat mein likhein: **"context check"** ya **"handoff"** |
| `feature-builder` | PLAN.md banana, ek chat = ek feature, ✅ FEATURE COMPLETE | **"feature-builder se mera app plan karo"**, phir **"F1 banao"** |

## claude.ai mein install
1. Settings → Capabilities → **Code execution and file creation** on
2. Skills → **Upload skill** → `dist/context-guardian.zip`, phir `dist/feature-builder.zip`
3. Dono ko on karein. Agar Claude skill khud na uthaye to naam lein: "context-guardian skill use karo"

## Claude Code mein install
```powershell
.\install.ps1 C:\path\to\aapka-project
```
Alerts Roman Urdu mein chahiye: PowerShell mein `$env:CG_LANG="ur"` (ya Windows environment variable `CG_LANG=ur` set karein), phir `claude` chalayein.

Rozana:
```
/resume → /feature F2 → plan + tests → OK → build → green
→ ✅ FEATURE COMPLETE → /handoff → /clear → /resume
```

## Farq kaise napein
`docs/MEASURE-RESULTS.md` dekhein — 3 sessions purane tareeqe se, 3 naye se, numbers likhein.

Banane wale: **Usaid Shahid Farooq (Usi)** — QA engineer, AI automation builder. License: MIT.
