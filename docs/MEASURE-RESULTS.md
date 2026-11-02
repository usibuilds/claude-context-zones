# Measure the results (QA protocol)

Claims are cheap. Run this test and keep the numbers — they are also great proof for a post or video.

## Setup
- Same project, similar-sized tasks (e.g. three small features before, three after).
- Write numbers in the table right after each session.

## Metrics
| # | Metric | How to read it |
|---|---|---|
| M1 | Context % right after the session's first reply | Status line, or `/context` |
| M2 | Messages until 🔴 (or until the session felt "confused") | Count your messages |
| M3 | Cost / usage for the feature | `/cost` (API) or the usage view on subscriptions |
| M4 | Re-work: how often Claude broke or redid something | Count |
| M5 | Bugs found after you called it done | Count over the next week |

## Table
| Session | Method | M1 start % | M2 msgs to 🔴 | M3 cost | M4 re-work | M5 bugs |
|---|---|---|---|---|---|---|
| 1 | Before | | | | | |
| 2 | Before | | | | | |
| 3 | Before | | | | | |
| 4 | After (/resume + /feature) | | | | | |
| 5 | After | | | | | |
| 6 | After | | | | | |

## What "better" looks like
- M1 lower (a lean start instead of re-reading a huge progress file or old chat)
- M2 higher or not needed (features finish inside green/yellow)
- M4 and M5 lower (acceptance tests agreed before coding)

## Quick wins to check first
- Is any file read every session bigger than ~20K characters? Split it into a slim "current status" file + a grep-only archive.
- Are PDFs in project knowledge? Convert them to Markdown.
- Does CLAUDE.md contain history or long explanations? Move them out — it loads every turn.
