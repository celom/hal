---
summary: Ticket CLI — create/list/show/transition/history over the store; plain argv, TICKETS_DB path, no deps.
budget: 50000
---

# tickets-cli

## Assertions

- Presentation leaf: turns argv into store/model calls and results into lines on stdout/stderr. Commands:
  - `create <title> [--intent <s>] [--criterion <s>]... [--parent <id>]`
  - `list [--state <s>] [--parent <id>|--roots]`
  - `show <id>`
  - `transition <id> <to> [--outcome impl|renegotiation] [--note <s>]` (`--outcome` required to close)
  - `history <id>`
- Owns the store-path decision the store refuses to make: env `TICKETS_DB`, falling back to `./.tickets.json` (cwd-relative).
- The entry point is a pure-ish function `runCli(argv, { env, io })` returning an exit code — 0 on success, non-zero on any error — so evals can drive it in-process; the executable `src/index.ts` is a thin wrapper over it.
- Parent-close guard data is the CLI's job to gather here: before a `closed` transition it loads the ticket's children from the store and passes their states to the model's guard.
- Errors (guard failures, unknown ids, bad usage) are one clear line on stderr and a non-zero exit code; they are never stack traces.

## Invariants

- Plain argv parsing — **zero third-party dependencies**; only `@hal/tickets-model` and `@hal/tickets-store` contracts (R2).
- No domain rules: every transition decision comes from the model, every byte of persistence from the store. If the CLI needs an `if` about ticket states beyond routing output, the seam is wrong — log it.
- Output is stable and line-oriented (greppable); ids always appear as `T-<n>`.
- `runCli` never calls `process.exit` and never throws on domain errors — it returns the exit code.

## Anti-goals

- No React/TUI/colors/spinners — this is the first implementation of the presentation seam; the React UI arrives later as an R3 replaceability experiment against the same contracts.
- No config files, no flags for storage engines — `TICKETS_DB` is the entire configuration surface.
- No reading of HAL repo state (notebook, INTENT files, git) — tickets live in the ticket store only.
