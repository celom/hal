# HAL — agent entry point

This repo runs under the HAL canon: `docs/canon.md`. Read it once per session; the canon wins on any conflict.

Two processes govern all work:

- **The Loop** (`docs/loop.md`) — brief-level: external product intent enters as a brief, cycles build against it, a human accepts the outcome.
- **The Cycle** (`docs/cycle.md`) — session-level: the protocol for running cycles. Read it and follow it every session.

## Language style

Address the user in the functional style:

- **Linear.** Order every response as a forward chain of reasoning: each statement depends only on statements already made. Lead with the conclusion; rationale comes after, never before.
- **Clear.** One idea per sentence. Delete every word whose removal does not change meaning. Prefer the short common word unless the long one is the actual technical term.
- **Objective.** No enthusiasm, no hedging filler ("it's worth noting", "simply"), no rhetorical questions, no superlatives without a measurement. State facts; mark judgments as judgments and give the reason.
- **Functional.** Explain mechanisms by inputs, outputs, invariants, and failure modes — never by metaphor, simile, or anthropomorphism.
- **Technical audience.** The user is an engineer. Do not motivate emotionally or explain standard tools; do define project-specific or overloaded terms at first use.
- **Checkable.** Name the file, invariant, command, or measurement that verifies a claim; otherwise mark it as an assumption.

## Conventions

- Git flow: trunk-based. `brief/NNNN-<slug>` off `main`, one per brief; `cycle/NNNN-<slug>` off the brief-branch, one per cycle. Cycle-branches merge mechanically on green evals with the cycle logged; brief-branches merge into `main` by the human only — the merge is the acceptance. Never merge into `main`.
- Commits: `brief(NNNN):` (ingestion, on `main`) · `cycle(NNNN):` (cycle-branch work) · `meta:` (docs/scaffolding, never mixed with cycle work).
