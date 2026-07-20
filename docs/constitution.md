# The HAL Constitution

> **v0 — pending ratification.** Ratification = a human committing this file. Amendments require a citation to a notebook entry (`docs/notebook/`). Origin and rationale are frozen in [the idea document](ideas/hal-holon-agentic-lifecycle.md).

## The Prime Axiom — the durable/disposable split

| Layer | Contents | Owner |
|---|---|---|
| **Durable** | intent, contract, evals | human-governed (ratified) |
| **Disposable** | implementation | agent-owned (regenerable) |

A **holon** is the unit: simultaneously a whole to its parts and a part to a larger whole. Holons compose into holons; contracts exist at every level.

## Rules

Every rule is falsifiable. Breaking one in practice is a finding, not a failure — log it, then amend.

- **R1 — The bundle.** Every holon ships four parts: `INTENT` (assertions, invariants, anti-goals — written for an agent reader), `CONTRACT` (typed inputs/outputs), `EVALS` (executable acceptance — the *only* definition of done), `IMPL` (disposable). No holon without all four.
- **R2 — Contracts only.** A holon may depend on other holons' contracts, never their implementations.
- **R3 — Replaceability invariant.** Any implementation that passes the holon's evals plus every ancestor's composition evals is a legal replacement. If a legal replacement breaks the system, the *evals* were wrong: fix the evals, log the escape.
- **R4 — Context budget.** A holon must be workable within a declared token budget: bundle + direct dependencies' contracts ≤ B. Exceeding B forces a split. Size is measured in cognition, not lines.
- **R5 — Recursive closure.** A composite holon's implementation *is* its children's bundles plus glue. Leaf cycles write code; composite cycles write child intents, contracts, and evals. Architecture emerges from the same cycle type as everything else.
- **R6 — Two legal outcomes.** A cycle returns either (a) an implementation passing evals, or (b) a **renegotiation**: a proposed change to the holon's own intent/contract/evals with rationale, escalated to the parent. Discovering the spec is wrong is a success outcome.
- **R7 — Homeostasis by convention.** Every cycle begins by running the full eval suite. Any red eval outranks new intent work. Intents no longer referenced by any parent trigger an apoptosis review — a cycle type whose legal outcome is deletion (or a reprieve with rationale).
- **R8 — Human as legislator, not laborer.** Humans ratify changes to the durable layer; humans do not write implementations. Agents draft everything, including proposed evals; ratification is the human checkpoint.
- **R9 — The notebook.** A cycle is not closed until logged: task, outcome (impl | renegotiation | deletion), failures observed, and failure location (**in-holon | seam | eval-escape**), plus accounting. The agent drafts the entry; entries are small and structured.
- **R10 — No tooling before convention.** Any tool must be preceded by the written rule it enforces, proven by manual adherence across cycles. No orchestrator until the convention has survived ~30 cycles.

## Adopted Defaults (amendable with evidence)

- **D1 — Context budget.** B = 50,000 tokens per holon (bundle + direct dependencies' contracts). Record actual consumption per cycle; amend with data.
- **D2 — Ratification mechanics.** Durable files (`INTENT.md`, `contract.ts`, `evals/**`, this constitution) change only in `ratify:`-prefixed commits, authored or approved by a human after review. Implementations merge on green evals in `cycle(NNNN):` commits. Repo meta-work (docs, scaffolding) is never mixed into a cycle commit.
- **D3 — Eval execution.** Every holon exposes an Nx target `eval`. `bun run evals` runs all of them; a session may not begin intent work while any eval is red (R7).
- **D4 — Minimum eval taxonomy.** Example-based evals per holon; composition evals per composite. Measured escapes decide what further kinds (property-based, budget, behavioral) become mandatory.

## Holon Anatomy (on-disk convention)

```
packages/<name>/
  INTENT.md         # why it exists: assertions, invariants, anti-goals;
                    # declared budget; parent holon; status (draft | ratified)
  src/contract.ts   # the ONLY importable surface: types + schemas
  evals/            # executable definition of done (Nx target: eval)
  src/              # disposable implementation
```

A composite holon's `src/` contains only glue; its real implementation is its children (R5), and its `evals/` are composition evals exercising the children together through its own contract.

## Amendment Log

*(empty — v0)*
