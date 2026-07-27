# HAL Canon

## Core Concepts

**Holon**: An organizational unit that is simultaneously whole (contains children) and part (contained in a parent). Holons compose recursively; each level maintains identical bundle structure.

**Durable layer**: Specification that persists across implementations. Comprises INTENT, CONTRACT, and EVALS. Human-approved, revision-controlled. Defines what a holon is and how correctness is verified.

**Disposable layer**: Implementation that achieves the durable specification. Agent-authored, regenerable. Any valid replacement passing evals is equivalent.

**Bundle**: The durable trio: INTENT, CONTRACT, EVALS. The specification and verification. Implementation is excluded.

**Cycle**: An atomic unit of work: one holon operating on one task. Begins by running full evals, executes toward an outcome, and logs its development process.

**Brief**: A frozen, verbatim snapshot of one unit of external product intent, taken when work begins on it. Briefs form an append-only, sequentially numbered log; product state is the fold over the log.

**Loop**: The outer delivery process. A brief enters; cycles run against it, one at a time; a human accepts the outcome or the brief blocks.

## Component Structure

Every holon contains four required components:

**INTENT** (durable): Why the holon exists. Specifies invariants, anti-goals, routing summary, and declared token budget. Parent and approval status are derived externally, never declared in-file.

**CONTRACT** (durable): What the holon requires and provides. Typed inputs and outputs. The sole importable surface; contains no implementation details.

**EVALS** (durable): Executable proof of correctness. Example-based per holon; composition evals per composite validate children through the parent contract.

**IMPL** (disposable): How the holon operates. For leaf holons: implementation code. For composites: orchestration and glue only; children contain actual implementation.

## Composition

**Dependency rule**: Holons import only contracts from other holons, never implementations.

**Replaceability invariant**: Any implementation passing both its own evals and all ancestor composition evals is a valid replacement. If a valid replacement breaks the system, evals were insufficient; correct the evals and log the escape.

**Composite structure**: A composite holon's implementation comprises only its children plus glue. Architecture emerges from the same cycle mechanism as all other work.

## Cycles

A cycle begins by running the full eval suite. Red evals outrank new work.

**Cycle types**:
- Leaf: Produces implementation code
- Composite: Produces child intents, contracts, evals
- Fix: Corrects a specific failure
- Drill: Strengthens a capability
- Deletion review: Evaluates whether a holon is still needed

**Valid outcomes**:
- (a) Implementation: Code passing evals
- (b) Renegotiation: Proposed change to holon's INTENT, CONTRACT, or EVALS with rationale, escalated to parent
- (c) Deletion: Holon removal (deletion-review cycles only)

Discovering the specification is wrong constitutes a successful outcome. Intents with no parent references trigger deletion reviews; outcomes are deletion or reprieve with rationale.

## Briefs

Every unit of external intent — issue, feature request, change request — enters as a brief in `docs/briefs/NNNN-<slug>.md`, numbered sequentially. The source tool is never the canonical record.

The log is append-only. A brief is frozen at ingestion. A change request against shipped work is a new brief.

A brief records its source, the source content verbatim, and acceptance criteria — verbatim from the source when present, drafted at ingestion otherwise. Ingestion is uniform across sizes.

Briefs are agent-drafted at ingestion and appended to the log by a `brief(NNNN):` commit on `main`; ingestion also creates the brief-branch. Status derives from branch state, never declared in-file.

## Resource Constraints

Each holon declares a token budget. Workable scope = bundle + implementation + direct-dependency contracts ≤ budget. Exceeding budget requires splitting.

Default budget: 50,000 tokens per holon. Record consumption per cycle; revise based on evidence.

## Governance

**Authority**: Humans review and approve all durable-layer changes; the review happens at merge. Agents draft all content: implementations, evals, and proposed changes to INTENT, CONTRACT, EVALS. Humans do not write implementations.

**Git flow** (trunk-based):
- `main` is the trunk. Durable content is approved iff it is on `main`.
- `brief/NNNN-<slug>`: one branch per brief, created off `main` at ingestion. A human merges it into `main`; the merge is the acceptance of the brief and the approval of every durable change it carries. Only humans merge into `main`.
- `cycle/NNNN-<slug>`: one branch per cycle, created off the brief-branch. It merges back mechanically — no human act — when evals are green and the cycle is logged; the merge is the cycle's approval.
- Internally triggered cycles (fix, drill, deletion review) branch off `main`. They merge mechanically when they touch only the disposable layer; a merge carrying durable changes is performed by a human.
- The brief log is exempt from the merge rule: a brief records external intent verbatim, so appending one is recording, not specification change, and lands directly on `main`.

**Commit prefixes**:
- `brief(NNNN):` — ingestion, appends a brief to the log on `main`
- `cycle(NNNN):` — work on a cycle-branch
- `meta:` — docs and scaffolding, never mixed with cycle work

**Status**: Derives from branch topology, never declared in-file. A brief is building while its branch is unmerged, accepted when merged, blocked when its branch head is tagged `blocked/NNNN-<slug>`. A cycle is approved when its branch is merged.

## Logging

Each cycle must be logged in a logbook entry to close. The agent drafts; the entry records:
- Task and cycle type
- Brief served
- Outcome
- Failure location if present (in-holon, seam, eval-escape)
- Accounting (context consumed, agent time, approval time)

## Directory Layout

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

## Operational Rules

**R1**: Every holon contains INTENT, CONTRACT, EVALS, and IMPL.

**R2**: Holons import contracts only, never implementations.

**R3**: Any implementation passing its evals and all ancestor evals is valid. Invalid replacements indicate insufficient evals.

**R4**: Composite implementations contain orchestration and child composition. Architecture emerges from the same cycle mechanism as all work.

**R5**: Holon scope is bounded: bundle + implementation + dependencies ≤ declared budget. Exceeding forces split.

**R6**: Valid outcomes are (a) passing implementation, (b) renegotiation, or (c) deletion.

**R7**: Cycles begin with full eval suite; red evals have priority. Unreferenced intents trigger deletion reviews.

**R8**: Agents draft all content. Durable-layer changes reach `main` only through a merge performed by a human; the merge is the approval. Brief-log appends are exempt.

**R9**: Cycles must be logged to close.

**R10**: Tooling follows convention. Manual adherence across ~30 cycles precedes automation.

**R11**: Every unit of external intent enters as a brief. Briefs are frozen at ingestion; the log is append-only. Change requests are new briefs.

**R12**: A brief closes only by a human merging its brief-branch into `main`, with all spawned cycles logged. A renegotiation escalating past the root holon blocks the brief: its branch head is tagged `blocked/NNNN-<slug>` and never merges; resolution is a new brief.

## Replayability

The brief log, the merge history, and the logbook form a totally ordered record: first-parent order on `main` gives the brief order; first-parent order on each brief-branch gives its cycle order. Replaying briefs 0001..n from this record yields a durable layer in the same eval-equivalence class. Cycles run one at a time; the total order makes replay well-defined.

## Revisability

All rules and defaults are revisable with evidence.
