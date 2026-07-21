# Cycle 0004 — tickets-cli — implement the presentation CLI over model + store

- date: 2026-07-21
- type: leaf
- outcome: impl
- evals: pre green (model 12/12 + store 9/9; cli/composite not wired, known 0001 gap) → post green (model 12/12 + store 9/9 + cli 10/10)
- failures: none — all 10 cli evals passed on the first run after implementation
- location: n/a
- accounting: context ~15k/50k · agent ~10m · approval pending
- lesson: when the model owns every guard and the store owns every byte, the CLI reduces to argv parsing plus error formatting — even "closing requires --outcome" needed no CLI `if`; the model's missing_outcome guard already says it.

## Notes

- Implemented `runCli` in `src/index.ts`: dispatch over five commands (`create`, `list`, `show`, `transition`, `history`); plain argv loop, zero third-party deps (R2 — only `@hal/tickets-model` and `@hal/tickets-store` contracts imported). The same file is the executable via `import.meta.main` (`bun packages/tickets-cli/src/index.ts <cmd> …`), per the contract's binding comment.
- DB path: `env.TICKETS_DB || "./.tickets.json"`, constants taken from the holon's own `contract.ts` (same benign contract↔src module cycle as cycles 0002/0003 — call-time use only).
- No domain rules leaked in: the CLI's state vocabulary is derived from the model's `TICKET_TRANSITIONS` edge set (no hardcoded state list), transition legality and close guards come entirely from `transition()`, and the CLI's only close-specific act is gathering `childStates` via `store.list({parentId})` — exactly the job the INTENT assigns it.
- Exit codes: 0 success, 1 domain/store errors, 2 usage errors (contract only pins zero/non-zero). Every error is one stderr line; `runCli` wraps dispatch in a catch that renders unexpected exceptions as one line too — never a stack trace.
- The one place the CLI supplies a fact rather than routing one: `at: new Date().toISOString()` for transitions. The store owns clocks for create, but exposes no transition call, so the clock for transitions necessarily sits with whoever calls the model. Noting it as a seam observation (not a finding): if a second front-end ever needs consistent clocks, that pushes toward a `tickets` façade transition call owning the timestamp.
- Wired the `evals` target: added `"scripts": {"evals": "bun test evals"}` to `package.json` — third holon out of the 0001 vacuity gap (only the `tickets` composite remains, cycle 0005).
- Durable-draft edits: none — `INTENT.md`, `contract.ts`, and `evals/` implemented exactly as drafted in cycle 0001.
- Seam findings: none — both dependency contract surfaces were sufficient; neither holon's src/ was needed or looked at.
