# Cycle 0005 — tickets — implement the composite glue and wire the composition evals

- date: 2026-07-21
- type: composite
- outcome: impl
- evals: pre green (model 12/12 + store 9/9 + cli 10/10; composite not wired — last of the 0001 gap) → post green (model 12/12 + store 9/9 + cli 10/10 + tickets 5/5; 4/4 projects)
- failures: none — all 5 composition evals passed on the first run after implementation
- location: n/a
- accounting: context ~14k/50k · agent ~5m · approval pending
- lesson: when the children's contracts already name who owns ids, clocks, guards, and bytes, composite glue is a page — every façade method is one store call, one model call, or one of each.

## Notes

- Implemented `createTicketService` in `src/index.ts`: `create`/`list`/`get` delegate straight to the store; `transition` loads the ticket, gathers `childStates` via `store.list({parentId})` only when closing, runs the model's `transition()`, and persists via `store.update`; `history` reads the ticket's append-only log. No domain logic in the glue — every guard (missing_intent, missing_outcome, open_children, invalid_transition) surfaces from the model untouched, and `not_found` uses the store's error shape.
- R2 held: imports are exactly the two children's contracts (`@hal/tickets-model`, `@hal/tickets-store`); the CLI child is exercised only through its contract in the composition evals. No child `src/` was needed or looked at.
- **Seam finding (same seam as cycle 0004):** the façade supplies the transition timestamp itself (`at: new Date().toISOString()`) because no child exposes a transition-with-clock — the store owns clocks for create only. Two callers (CLI in 0004, façade now) have independently re-supplied this fact; that is evidence, not coincidence. If clock consistency ever matters (testing determinism, audit ordering), the renegotiation target is the store or model contract growing a clock seam — until then both call sites carry it.
- Note the composition consequence of that seam: a ticket transitioned through the CLI and one transitioned through the façade get timestamps from two different call sites. Harmless single-user, but it is the same fact owned twice.
- Wired the `evals` target: `"scripts": {"evals": "bun test evals"}` in `package.json` — fourth and final holon out of the cycle-0001 eval-wiring vacuity gap. `bun run evals` now runs all four holons; **green is no longer vacuous anywhere**.
- This closes the MVP scope of the pilot brief (docs/ideas/pilot-ticket-core.md): model, store, CLI, and composite façade all implemented, all evals green, 36 tests across 4 projects.
- Composition evals confirmed the seam decisions from 0001 end-to-end: store-assigned ids continue across façade instantiations over the same `dbPath`, the parent/child close-guard works across the model↔store seam, and a ticket created via the CLI is visible to the service (and vice versa) through the shared store file. Eval tests use OS temp dirs only; no repo artifacts.
- Durable-draft edits: none — `INTENT.md`, `contract.ts`, and `evals/` implemented exactly as drafted in cycle 0001.
