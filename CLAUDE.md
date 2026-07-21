# HAL — agent session protocol

This repo runs under the HAL rulebook: `docs/rulebook.md`. Read it once per session. This file is the operational loop; the rulebook wins on any conflict.

## The Loop (every cycle)

1. **Start by running `bun run evals`.** Any red eval outranks new intent work (R7). A red eval *is* your task until green or renegotiated.
2. **One cycle at a time.** A cycle = one holon + one task. A session is a sequence of cycles; every cycle re-enters this loop at step 1. No parallel cycles.
3. **Valid outcomes (R6):** (a) an implementation passing evals, or (b) a **renegotiation** — a proposed change to the holon's own `INTENT.md`/`contract.ts`/`evals/` with rationale, escalated to the parent. Deletion-review cycles may additionally end in a deletion proposal. "The spec is wrong" is a success outcome — say so instead of implementing around it.
4. **Context discipline (R4/D1):** load only the holon's bundle + its implementation + its direct dependencies' `contract.ts`. Budget: 50k tokens. If the task doesn't fit, the correct output is a split proposal, not a bigger context.
5. **Dependencies (R2):** import only from other holons' `contract.ts`. If you find yourself needing another holon's `src/` to make progress, that is a **seam finding** — log it in the notebook entry; the contract was insufficient.
6. **Approval (R8/D2):** durable files are drafted by you, approved by the human — a durable file is approved iff its last change landed in an `approve:` commit, draft otherwise; status is never declared in the file. Never author an `approve:` commit — those are human-only. Implementation lands as `cycle(NNNN): <summary>` only when evals are green.
7. **Close the cycle (R9):** draft the notebook entry — copy `docs/notebook/TEMPLATE.md` to `docs/notebook/NNNN-<slug>.md`, next number in sequence. A cycle is not done until logged. Fill the failure-location and accounting fields honestly; they are the experiment.

## Conventions

- Commits: `approve:` (human-only, durable layer) · `cycle(NNNN):` (impl, green evals) · `meta:` (docs/scaffolding, never mixed with cycle work).
