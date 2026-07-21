# The HAL Rulebook

> **Pending approval.** Approval = a human committing this file. Revisions require a citation to a notebook entry (`docs/notebook/`). Origin and rationale are frozen in [the idea document](ideas/hal-holon-agentic-lifecycle.md).

## The Prime Axiom — the durable/disposable split

| Layer | Contents | Owner |
|---|---|---|
| **Durable** | intent, contract, evals | human-owned (approved) |
| **Disposable** | implementation | agent-owned (regenerable) |

A **holon** is the unit: simultaneously a whole to its parts and a part to a larger whole. Holons compose into holons; contracts exist at every level.

## Rules

Every rule is falsifiable. Breaking one in practice is a finding, not a failure — log it, then revise.

- **R1 — The bundle.** Every holon ships four parts: `INTENT` (assertions, invariants, anti-goals — written for an agent reader), `CONTRACT` (typed inputs/outputs), `EVALS` (executable acceptance — the *only* definition of done), `IMPL` (disposable). The durable trio — `INTENT` + `CONTRACT` + `EVALS` — is the **bundle**; `IMPL` is never part of it. No holon without all four.
- **R2 — Contracts only.** A holon may depend on other holons' contracts, never their implementations.
- **R3 — Replaceability invariant.** Any implementation that passes the holon's evals plus every ancestor's composition evals is a valid replacement. If a valid replacement breaks the system, the *evals* were wrong: fix the evals, log the escape.
- **R4 — Context budget.** A holon must be workable within a declared token budget: bundle + implementation + direct dependencies' contracts ≤ B. Exceeding B forces a split. Size is measured in cognition, not lines.
- **R5 — Recursive closure.** A composite holon's implementation *is* its children plus glue. Leaf cycles write code; composite cycles write child intents, contracts, and evals. Architecture emerges from the same cycle type as everything else.
- **R6 — Valid outcomes.** A cycle returns either (a) an implementation passing evals, or (b) a **renegotiation**: a proposed change to the holon's own intent/contract/evals with rationale, escalated to the parent. Deletion-review cycles (R7) may instead return (c) a **deletion proposal**. Discovering the spec is wrong is a success outcome.
- **R7 — Steady state by convention.** Every cycle begins by running the full eval suite. Any red eval outranks new intent work. Intents no longer referenced by any parent trigger a **deletion review** — a cycle type whose valid outcomes are deletion or a reprieve with rationale.
- **R8 — Human as reviewer, not laborer.** Humans approve changes to the durable layer; humans do not write implementations. Agents draft everything, including proposed evals; approval is the human checkpoint.
- **R9 — The notebook.** A cycle is not closed until logged: task, type (**composite | leaf | fix | drill | deletion-review**), outcome (**impl | renegotiation | deletion**), failures observed, and failure location (**in-holon | seam | eval-escape**; n/a when none), plus accounting. The agent drafts the entry; entries are small and structured.
- **R10 — No tooling before convention.** Any tool must be preceded by the written rule it enforces, proven by manual adherence across cycles. No orchestrator until the convention has survived ~30 cycles.

## Adopted Defaults (revisable with evidence)

- **D1 — Context budget.** B = 50,000 tokens per holon. Record actual consumption per cycle; revise with data.
- **D2 — Approval mechanics.** Durable files (`INTENT.md`, `contract.ts`, `evals/**`, this rulebook) change only in `approve:`-prefixed commits, authored by a human after reviewing the agent's draft — agents draft content, never `approve:` commits. A durable file's status is derived from git — approved iff its last change landed in an `approve:` commit, draft otherwise — never declared in the file. Implementations merge on green evals in `cycle(NNNN):` commits. Repo meta-work (docs, scaffolding) is never mixed into a cycle commit.
- **D3 — Eval execution.** Every holon exposes an Nx target `evals`; `bun run evals` runs all of them.
- **D4 — Minimum eval taxonomy.** Example-based evals per holon; composition evals per composite. Measured escapes decide what further kinds (property-based, budget, behavioral) become mandatory.

## Holon Anatomy (on-disk convention)

```
packages/<name>/
  INTENT.md         # why it exists: assertions, invariants, anti-goals;
                    # routing summary (one line); declared budget.
                    # Parent and status are never declared — parent derives from
                    # the name (docs/conventions.md), status from git (D2)
  contract.ts       # durable; the ONLY importable surface: types + schemas
  evals/            # durable; executable definition of done (Nx target: evals)
  src/              # disposable implementation
```

A composite holon's `src/` contains only glue; its real implementation is its children (R5), and its `evals/` are composition evals exercising the children together through its own contract.
