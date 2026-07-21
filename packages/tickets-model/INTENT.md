---
summary: Pure ticket domain — types, guarded lifecycle state machine, invariants. No IO, no clock, no ids.
budget: 50000
---

# tickets-model

## Assertions

- Defines the ticket record: `id`, `title`, `intent`, `acceptanceCriteria`, `outcome`, `state`, `parentId`, `history`, `createdAt`, `updatedAt`. The schema is HAL-shaped: a ticket carries an intent, acceptance criteria, and an outcome (`impl` | `renegotiation`), and tickets nest parent→child via an explicit `parentId`.
- Owns the lifecycle state machine: `draft → ready → in_progress → closed`, plus the single backout edge `in_progress → ready`. No other edges exist.
- Guards are enforced here and only here:
  - `draft → ready` requires a non-empty `intent` AND at least one acceptance criterion.
  - `in_progress → closed` requires `outcome` to be set (supplied with the transition).
  - Closing a ticket that has children requires every child to be `closed`. The model cannot see other tickets, so it exposes a **pure guard that takes the ticket plus its children's states**; callers that hold child data (store/composite) must supply them.
- `transition` is a pure function returning a typed result: on success a **new** ticket value with updated `state`, `updatedAt`, appended history event, and (on close) `outcome`; on failure a guard error **as a value**. `canTransition` answers the same question without producing a ticket.
- Construction is pure too: `createTicket` takes externally supplied `id` and timestamp and returns a ticket in `draft` with a `created` history event. Id assignment and clocks belong to callers.
- History events are append-only records: `{ at, type: "created" | "transition", from?, to?, note? }`.

## Invariants

- Purity: no IO, no filesystem, no environment access, no `Date.now()` — every timestamp is a parameter. Same inputs, same outputs.
- Inputs are never mutated; every returned ticket is a fresh value.
- Guard failures are returned values, never thrown exceptions.
- A ticket's `history` never shrinks; every successful transition appends exactly one event.
- A `closed` ticket has a non-null `outcome`; a non-`closed` ticket's `outcome` may be null.

## Anti-goals

- No persistence, id generation, or sequence counters — that is `tickets-store`.
- No presentation, formatting, or argv concerns — that is `tickets-cli`.
- No fetching of child tickets — child *states* are passed in by the caller; this holon never looks anything up.
- No exception-based control flow for domain rules.
