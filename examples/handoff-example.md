# HANDOFF — Shop billing app — 2026-10-27

**Feature in progress:** F3 Stock — testing
**Status:** in progress

## Decisions made
- Stock changes only through sale / purchase / return / adjustment — keeps one audit trail
- Quantity can be decimal (kg), money is whole numbers — matches how the shop works

## Files created / changed
- app/Models/StockMovement.php
- app/Services/StockService.php
- tests/Feature/StockMovementTest.php

## What works (tested)
- Stock in from purchase (test_purchase_adds_stock ✅)
- Stock out from sale (test_sale_reduces_stock ✅)

## Open bugs / known issues
- Return of a partly returned bill allows over-return (test written, red)

## Next 3 steps
1. Cap return quantity at sold − already returned
2. Make test_cannot_over_return green, run full suite
3. Tick F3 in PLAN.md

## Watch out
- Don't edit stock columns directly anywhere — always go through StockService
