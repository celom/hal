# HAL Canon

## Definitions

**Holon**: An organizational unit that is simultaneously whole (contains children) and part (contained in a parent). Holons compose recursively; each level maintains identical contract structure.

**Durable layer**: Specification that persists across implementations. Comprises intent, contract, and evals. Human-approved, revision-controlled. Defines what a holon is and how correctness is verified.

**Disposable layer**: Implementation that achieves the durable specification. Agent-authored, regenerable. Any valid replacement passing evals is equivalent.

**Bundle**: The durable trio: INTENT + CONTRACT + EVALS. The specification and proof. Implementation is excluded.

**Cycle**: An atomic unit of work: one holon operating on one task. Enters the protocol loop, executes, produces an outcome, logs itself.

## Structure

Every holon contains four required components.

**INTENT** (durable): Why the holon exists. Asserts invariants and anti-goals. Specifies routing summary and declared token budget. Parent and approval status are derived externally, never declared in-file.

**CONTRACT** (durable): What the holon requires and provides. Typed inputs and outputs. The sole importable surface; contains no implementation details.

**EVALS** (durable): Executable proof of correctness. Example-based per holon; composition evals per composite, exercising children through the parent contract.

**IMPL** (disposable): How the holon operates. For leaf holons: implementation code. For composites: orchestration and glue only; children contain actual implementation.

## Composition

Dependency rule: Holons import only contracts from other holons, never implementations.

Replaceability invariant: Any implementation passing both its own evals and all ancestor composition evals is a valid replacement. If a valid replacement breaks the system, evals were insufficient; correct the evals and log the escape.

Composite structure: A composite holon's implementation comprises only its children plus glue. Architecture emerges from the same cycle mechanism as all other work.

## Work Cycles

A cycle begins by running the full eval suite. Red evals outrank new work.

Cycle types:
- **Leaf**: Produces implementation code
- **Composite**: Produces child intents, contracts, evals
- **Fix**: Corrects a specific failure
- **Drill**: Strengthens a capability
- **Deletion review**: Evaluates whether a holon is still needed

Valid outcomes for any cycle:
- **(a) Implementation**: Code passing evals
- **(b) Renegotiation**: Proposed change to holon's INTENT, CONTRACT, or EVALS with rationale, escalated to parent
- **(c) Deletion**: Holon removal (deletion-review cycles only)

Discovering the specification is wrong constitutes a successful outcome.

Intents with no parent references trigger deletion reviews. Outcomes are deletion or reprieve with rationale.

## Capacity

Each holon declares a token budget. Workable scope = bundle + implementation + direct-dependency contracts ≤ budget. Exceeding budget requires splitting.

Default budget: 50,000 tokens per holon. Record consumption per cycle; revise based on evidence.

## Authority

Humans review and approve durable-layer changes. Humans do not write implementations.

Agents draft all content: implementations, evals, and proposed changes to INTENT, CONTRACT, EVALS.

Durable-layer changes occur only in `approve:`-prefixed commits, authored by humans after reviewing agent drafts. Implementations merge on green evals in `cycle(NNNN):`-prefixed commits. Meta-work uses `meta:` commits and never mixes with cycle work.

Approval status derives from git: a durable file is approved iff its last change landed in an `approve:` commit. Status is never declared in-file.

## Logging

Each cycle is logged in a notebook entry. The agent drafts; the entry records:
- Task and cycle type
- Outcome
- Failure location if present (in-holon, seam, eval-escape)
- Accounting (context consumed, agent time, approval time)

A cycle is not complete until logged.

## Operational Rules

**R1**: Every holon contains INTENT, CONTRACT, EVALS, and IMPL.

**R2**: Holons import contracts only, never implementations.

**R3**: Any implementation passing its evals and all ancestor evals is valid. Invalid replacements indicate insufficient evals.

**R4**: Composite implementations contain orchestration and child composition. Architecture emerges from the same cycle mechanism as all work.

**R5**: Holon scope is bounded: bundle + implementation + dependencies ≤ declared budget. Exceeding forces split.

**R6**: Valid outcomes are (a) passing implementation, (b) renegotiation, or (c) deletion.

**R7**: Cycles begin with full eval suite; red evals have priority. Unreferenced intents trigger deletion reviews.

**R8**: Humans approve durable-layer changes. Agents draft all content.

**R9**: Cycles must be logged to close.

**R10**: Tooling follows convention. Manual adherence across ~30 cycles precedes automation.

## On-Disk Convention

Each holon occupies a directory:

```
packages/<name>/
  INTENT.md         Durable. Why it exists, assertions, invariants,
                    anti-goals, routing summary, declared budget.
  
  contract.ts       Durable. Sole importable surface: types and
                    schemas only.
  
  evals/            Durable. Executable correctness proof. Composition
                    evals per composite.
  
  src/              Disposable. Implementation. For composites:
                    orchestration and glue.
```

Every holon exposes an `evals` target. Workspace-level `evals` runs all.

## Revision

All rules and defaults are revisable with evidence.
