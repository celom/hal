# Pilot: Ticket Core

## Problem Statement

How might we pick a first pilot for HAL that generates honest, compositionally interesting cycles — using a self-owned SDLC ticket domain whose schema mirrors HAL's own ontology, without becoming HAL tooling before R10 allows it?

## Recommended Direction

Build a **ticket lifecycle domain core** as HAL holons: a pure ticket model (types, state machine, invariants), a persistence holon, and a CLI presentation leaf. The ticket schema is HAL-shaped — a ticket carries an intent, acceptance criteria, and an outcome (`impl` | `renegotiation`), and tickets nest parent→child like holons. It keeps its **own store**; it never reads notebook entries, INTENT files, or git state.

Delivery is **CLI-first**. The React UI is deliberately deferred and reframed: when it comes, it is a *second implementation of the presentation contract* — a live test of R3's replaceability invariant. If the UI forces contract changes the CLI never needed, the contracts were presentation-biased, and that finding goes in the notebook.

The pilot succeeds on learning first: ~2–3 dozen logged cycles stress-testing R1–R5 and R9 against a real domain. The artifact staying useful is the bonus, and the HAL-shaped schema gives it a migration path — if HAL survives 30 cycles and R10 unlocks, this app is one adapter away from managing real HAL state.

## Key Assumptions to Validate

- [ ] The ticket domain is compositionally deep enough to force ≥1 composite holon and ≥1 R4-driven split — if ~10 cycles in everything is a shallow leaf, swap the pilot domain
- [ ] Contracts written CLI-first stay presentation-agnostic — validated (or falsified, which is equally valuable) by the React replaceability cycle
- [ ] Evals are cheap and honest for this domain (state machine + store + CLI) under `bun test` / Nx `evals` targets — validated by the first leaf cycle
- [ ] The "own store, no repo-reading" boundary holds under temptation — validated by it surviving as an anti-goal through all cycles

## MVP Scope

**In:**

- Root composite holon `tickets`; first cycle is a composite cycle drafting child bundles (per R5)
- Ticket model: HAL-shaped schema (intent, acceptance criteria, outcome), lifecycle state machine with guarded transitions, parent→child nesting
- Persistence: local single-user store
- CLI: create, list, show, transition; per-ticket history (traceability)
- Every cycle logged in the notebook — the cycles *are* the deliverable

**Out:** everything in "Not Doing."

## Not Doing (and Why)

- **React UI (now)** — deferred until the core is green; it enters later as the R3 replaceability experiment, not as scope
- **Reading HAL repo state** (notebook, INTENT files, git) — that's HAL tooling; R10 forbids it before ~30 cycles of manual convention. Explicit anti-goal in the root INTENT
- **Event sourcing** — traceability comes from a simple history log; don't test HAL on an architecture you wouldn't otherwise pick
- **Multi-user, auth, sync, deployment** — single developer, local-only; complexity floor stays down
- **Metrics/dashboards** — observability beyond ticket history waits until there's data worth observing
- **Pre-designing the holon tree** — beyond the root composite, children emerge from cycles (R5), not from this document

## Open Questions

- Storage for the ticket store: flat JSON file vs SQLite — decide in the persistence holon's first cycle, not before
- Should ticket nesting reuse HAL's parent-derives-from-name convention (`docs/conventions.md`) or use explicit parent IDs?
- What's the trigger for the React/R3 cycle — a cycle count, or "core contracts stable for N cycles"?
