# Pilot: Forex Trader

> Decision record, 2026-07-20. **Status: draft — input to cycle 0001, not yet ratified.** The pilot exists to validate HAL (see `constitution.md`); it is not a promise of a profitable trading system.

## Why this pilot passes the criteria

- **Real stakes** — a system you actually want, with money-shaped consequences kept safe by scope (paper only).
- **Requirements churn** — strategies decay with market regimes, so renegotiation (R6) and apoptosis (R7) will fire constantly. A domain whose specs never move would leave HAL's riskiest rules untested.
- **Seams** — market data feed, broker API, persistence, risk engine, dashboard: enough boundaries for the seam census to mean something.
- **Native homeostasis** — trading already lives by continuous numeric evals (P&L, drawdown, risk limits). The Loop matches the domain's own shape; strategy modules are literally "molecules that subsist while useful and are replaced when the system demands it."

## The trap this domain sets — and the design answer

Backtests are the most gameable evals in software: an overfit strategy aces its evals and is still garbage (Goodhart). This collides with R3 (*anything passing evals is a legal replacement*) and creates a confound — "the strategies lose money" must never be read as "HAL failed," nor vice versa.

**Design answer: a two-layer holarchy.**

| Layer | Holons (expected) | Eval character | Role in the experiment |
|---|---|---|---|
| **Platform** | data ingestion, risk engine, order execution, ledger, (later) dashboard | deterministic, non-gameable: idempotent orders, position/risk invariants, staleness halts, ledger consistency | **the HAL verdict rides here** |
| **Strategy** | signal generators behind one shared contract | statistical: backtest / walk-forward thresholds | churn fuel — expected to die; exercises R6/R7, not the proof of HAL |

The **risk engine is the constitutional court**: hard invariants no strategy may cross, and the strongest non-gameable eval material in the system. A strategy holon can only ever *propose* orders; the risk contract decides what reaches execution.

## Scope proposal (ratify before cycle 0001)

- [ ] **Paper trading only** for the whole pilot. No live-capital code paths. Live money, if ever, is a post-verdict decision.
- [ ] **One broker with a practice API** — candidate: OANDA practice account (REST, well-documented). Confirm or substitute.
- [ ] **Pairs:** start EUR/USD only; expand to at most 2–3 majors when a second strategy holon exists.
- [ ] **Success = HAL metrics** (≥30 cycles, ≥5 drills, seam census, constitution v1) — explicitly *not* strategy profitability.
- [ ] **Two-layer principle** above adopted as the pilot's architectural axiom.
- [ ] This monorepo hosts the pilot's packages (the repo is the lab bench).

## Cycle 0001 preview

Composite cycle at the root (R5): draft the root holon's `INTENT.md`, thin `contract.ts`, and composition evals; draft first child bundles (likely: `market-data`, `risk`, `execution`, `ledger`, `strategy-contract`). All drafts land as `status: draft` for ratification. Runs under the full Loop; notebook entry `0001`.
