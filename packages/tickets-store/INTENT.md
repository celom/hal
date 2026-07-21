---
summary: Ticket persistence — flat JSON file store; assigns T-<n> ids, stamps timestamps, create/get/list/update.
budget: 50000
---

# tickets-store

## Assertions

- Persists tickets in a **single flat JSON file** whose path is passed in by the caller (`openStore(path)`). This holon never decides the path — defaults are the CLI's business.
- Owns everything the pure model refuses to own: id assignment (`T-<n>`, sequential, never reused), clocks (ISO timestamps on create), and reading/writing bytes.
- `create` builds the ticket via the model's `createTicket` (draft state, `created` history event), assigns the next id, and persists it.
- `get` returns a ticket or null; `list` returns all tickets, optionally filtered by `state` and/or `parentId`; `update` persists a full replacement of an existing ticket (the model produces the new value — e.g. via `transition`).
- The file is human-readable JSON. A missing file means an empty store; the file is created on first write.
- Writes are atomic-enough for a single user: write-then-rename (or equivalent), so a crash never leaves a truncated store.

## Invariants

- Ids are unique and strictly sequential per store file; deleting or closing tickets never causes id reuse.
- A round-trip (save, reopen, load) preserves every ticket byte-for-byte semantically: same ids, states, history, timestamps.
- `update` of an unknown id is an error value, not a silent insert; `create` is the only way tickets enter the store.
- The store never runs domain rules: it will happily persist any well-formed `Ticket` the caller hands it. Guards live in the model; orchestration lives in the composite.

## Anti-goals

- No SQLite, no event sourcing, no multi-user locking, no sync — single developer, local file (pilot brief "Not Doing").
- No state-machine logic, no transition validation — that is `tickets-model` (this holon imports only its contract, R2).
- No environment variables, no default paths, no argv — that is `tickets-cli`.
- Never reads HAL repo state (notebook, INTENT files, git) — the store's file is its entire world.
