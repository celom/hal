# Cycle 0001 — tickets — compose the ticket holarchy: draft child bundles

- date: 2026-07-21
- type: composite
- outcome: impl — per R5 the composite's implementation *is* its children: bundles drafted for `tickets` + `tickets-model`, `tickets-store`, `tickets-cli`; glue deferred to cycle 0005
- evals: pre green (vacuous — no `evals` targets exist) → post green (still vacuous — none wired, see findings)
- failures: none
- location: n/a
- accounting: context ~40k/50k · agent ~25m · approval pending
- lesson: drafting evals before any impl exists forces the contracts to say who owns ids, clocks, and child lookups — the seams got decided by writing tests, not diagrams.

## Decisions (this cycle, per pilot brief open questions)

- Storage: flat JSON file, single-user; path passed into the store, default owned by the CLI (`TICKETS_DB` → `./.tickets.json`).
- Nesting: explicit `parentId: string | null` (not name-derived).
- Layout: flat (conventions option B) — `packages/tickets`, `tickets-model`, `tickets-store`, `tickets-cli`.
- React/R3 trigger: core contracts stable for 3 post-MVP cycles.

## Findings

- **Eval-wiring bootstrap (deliberate):** all four holons' eval tests are drafted and runnable, but **no package got the `evals` script this cycle** — all 36 tests fail honestly on placeholder stubs, and wiring them now would turn the suite red and freeze cycles 0002–0004 under R7. Each holon wires its `evals` target in its own impl cycle; the composite wires its composition evals in the glue cycle (0005). Until then `bun run evals` is green by vacuity — a known gap, not a passing grade.
- Contract binding pattern: each `contract.ts` ends with a named re-export from `./src/index.ts` (the durable binding line); placeholder stubs that throw `not implemented` keep the line resolvable, so contracts import cleanly before impls exist.
- The façade has no field-edit call (set intent/criteria post-create) — composition evals had to create guarded tickets up front. If a real workflow needs editing a draft, that is a renegotiation of the `tickets` contract, not a workaround.
