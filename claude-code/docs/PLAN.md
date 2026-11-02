# PLAN — Example: small shop billing app

> The "blueprint". Every new session starts from this file. Keep it short (max ~150 lines).
> No code here — only decisions.

## Product in one line
Billing and stock app for small shops, usable on a phone.

## Tech stack (fixed — don't change without a decision)
<e.g. Laravel + MySQL + Tailwind, or Next.js + Postgres>

## Core data (high level)
- shops → users (owner, staff)
- products → stock per location
- customers (with balance owed)
- sales → sale_items
- payments

## Features (build order — one session = one feature)
- [x] **F0 Setup** — project scaffold, database, first migration
- [ ] **F1 Auth** — sign up, log in, every query scoped to the user's shop
- [ ] **F2 Products** — create/edit/list, price, unit
- [ ] **F3 Stock** — stock in/out per location
- [ ] **F4 Customers** — list + balance owed
- [ ] **F5 Billing** — create bill, reduce stock, print/share
- [ ] **F6 Reports** — daily sales, top products, low stock
- [ ] **F7 Deploy** — hosting, environment, backups

## Acceptance rule (what "done" means)
A feature is done only when its tests pass (or manual test steps are listed and passed),
no other shop's data is ever visible, and HANDOFF.md is updated.

## Decisions log
- (date) decision — reason

## Later / Ideas (not now)
-
