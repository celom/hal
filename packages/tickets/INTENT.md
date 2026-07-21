---
summary: Root composite — SDLC ticket lifecycle domain; TicketService façade over model + store + CLI children.
budget: 50000
---

# tickets

## Assertions

- Root holon of the pilot (docs/ideas/pilot-ticket-core.md): a self-owned SDLC ticket domain whose schema mirrors HAL's ontology — every ticket carries an `intent`, `acceptanceCriteria`, and an `outcome` (`impl` | `renegotiation`), and tickets nest parent→child via explicit `parentId`, like holons.
- Composite (R5): its real implementation is its children plus glue —
  - `tickets-model` — pure types, state machine, invariants;
  - `tickets-store` — flat-JSON-file persistence, id assignment;
  - `tickets-cli` — presentation leaf, first implementation of the presentation seam.
- Its contract is the `TicketService` façade — create / list / get / transition / history — plus re-exported core types, so consumers never need the children directly.
- The façade's `transition` is where composition earns its keep: it gathers the ticket's children from the store and feeds their states to the model's pure close-guard. A parent cannot close while any child is open.
- Composition evals exercise a full ticket lifecycle through the façade and one end-to-end CLI smoke — they test the children *together*, not re-test their internals.

## Invariants

- Consumers import only this contract (R2); the children remain reachable individually for their own consumers, but nothing outside the family imports their `src/`.
- Guard semantics through the façade are identical to the model's: same errors as values, no exceptions for domain failures.
- One store file is the entire persisted state; the service is handed its path (`dbPath`) and touches nothing else on disk.

## Anti-goals

- **Never reads HAL repo state: not the notebook, not INTENT files, not git.** Tickets live in the ticket store only. This is the R10 boundary — the pilot must not become HAL tooling before ~30 manual cycles; any temptation to cross it is a finding for the notebook, not a feature.
- No pre-designed holon tree below the three children — further splits emerge from cycles (R5/R4), not from this file.
- No React UI in scope: when it comes, it is a second implementation of the presentation contract — an R3 replaceability experiment (trigger: core contracts stable for 3 post-MVP cycles).
- No multi-user, auth, sync, deployment, metrics, or event sourcing (pilot brief "Not Doing").
