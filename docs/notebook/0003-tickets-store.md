# Cycle 0003 — tickets-store — implement flat-JSON-file persistence

- date: 2026-07-21
- type: leaf
- outcome: impl
- evals: pre green (model 12/12; store/cli/composite not wired, known 0001 gap) → post green (model 12/12 + store 9/9, both wired)
- failures: none — all 9 store evals passed on the first run after implementation
- location: n/a
- accounting: context ~15k/50k · agent ~10m · approval pending
- lesson: persisting the id counter (`lastId`) instead of deriving it from max(ids) makes "never reused" a stored fact rather than a recomputation that breaks the moment a ticket is ever removed.

## Notes

- Implemented `openStore` in `src/index.ts`: stateless handle over the file — every operation is read-modify-write against disk, so reopen-persistence and multi-handle coherence fall out for free; no in-memory cache to invalidate.
- On-disk shape: `{ lastId, tickets }`, pretty-printed JSON (2-space indent). `lastId` persists the id sequence per the INTENT invariant that deletion/closing never causes reuse.
- Atomic-enough writes: serialize to a sibling temp file, then `rename` over the target (write-then-rename per INTENT).
- Reads never create the file: `load` returns an empty store when the file is missing; only `create`/`update` write.
- Construction delegated to the model's `createTicket` (draft state, `created` event); the store adds only id, clock, and parent-existence check — no domain rules, per anti-goals.
- Wired the `evals` target: added `"scripts": {"evals": "bun test evals"}` to `package.json` — second holon out of the 0001 vacuity gap (cli + composite remain).
- Durable-draft edits: none — `INTENT.md`, `contract.ts`, and `evals/` implemented exactly as drafted in cycle 0001.
- Seam findings: none — `@hal/tickets-model`'s contract surface (`createTicket`, `Ticket`) was sufficient; its src/ was never needed.
