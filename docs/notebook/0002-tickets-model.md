# Cycle 0002 — tickets-model — implement the guarded lifecycle state machine

- date: 2026-07-21
- type: leaf
- outcome: impl
- evals: pre green (vacuous — no `evals` targets wired, known 0001 gap) → post green (12/12, first non-vacuous run)
- failures: none — all 12 evals passed on the first run after implementation
- location: n/a
- accounting: context ~12k/50k · agent ~10m · approval pending
- lesson: a leaf whose contract pre-decides ids, clocks, and child lookups as parameters implements in one pass — the guards reduce to a table check plus three predicates.

## Notes

- Implemented `createTicket`, `canTransition`, `transition` in `src/index.ts`; `transition` is `canTransition` + a spread with a fresh history array, so the two can never disagree.
- Guard order in `canTransition`: edge validity → draft→ready content guards (intent, then criteria) → close guards (outcome, then children). Only the first two orderings are pinned by evals; the rest is an impl choice.
- Wired the `evals` target: added `"scripts": {"evals": "bun test evals"}` to `package.json` (Nx script-target inference). `bun run evals` now runs this holon's suite for real — first holon out of the 0001 vacuity gap.
- Durable-draft edits: none — `INTENT.md`, `contract.ts`, and `evals/` were implemented exactly as drafted in cycle 0001.
- Seam findings: none — no other holon's contract or src was needed; the value import of `TICKET_TRANSITIONS` from the holon's own `contract.ts` creates a benign module cycle with the contract's binding re-export (usage is call-time only, so ESM resolves it fine).
