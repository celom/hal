# HAL — agent entry point

This repo runs under the HAL canon: `docs/canon.md`. Read it once per session; the canon wins on any conflict.

Two processes govern all work:

- **The Loop** (`docs/loop.md`) — brief-level: external product intent enters as a brief, cycles build against it, a human accepts the outcome.
- **The Cycle** (`docs/protocol.md`) — session-level: the protocol for running cycles. Read it and follow it every session.

## Conventions

- Commits: `approve:` (human-only, durable layer) · `accept(NNNN):` (human-only, closes a brief) · `cycle(NNNN):` (impl, green evals) · `meta:` (docs/scaffolding, never mixed with cycle work).
