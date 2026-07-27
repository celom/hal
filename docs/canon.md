# HAL Canon

Rules R1–R13 are the sole normative statements; the other sections are definitions and defaults. The canon wins on any conflict with any other document.

## Definitions

**Holon**: An organizational unit that is simultaneously whole (contains children) and part (contained in a parent). Holons compose recursively; every level has the same four elements.

The four elements (R1):

- **INTENT** (durable): Why the holon exists — invariants, anti-goals, routing summary, declared token budget.
- **CONTRACT** (durable): What the holon requires and provides — typed inputs and outputs. The sole importable surface; no implementation detail.
- **EVALS** (durable): Executable proof of correctness. Example-based per holon; composition evals per composite validate children through the parent contract.
- **IMPL** (disposable): How the holon operates. Leaf holons: implementation code. Composites: orchestration and glue only.

**Bundle**: The durable trio — INTENT, CONTRACT, EVALS. Human-approved; defines what a holon is and how correctness is verified. The implementation is excluded: agent-authored, regenerable, and any replacement passing evals is equivalent.

**Cycle**: The atomic unit of work — one holon, one task. Types: leaf, composite, fix, drill, deletion review. Run per `cycle.md`.

**Brief**: A frozen, verbatim snapshot of one unit of external product intent, taken when work begins on it. Briefs form an append-only, sequentially numbered log; product state is the fold over the log.

**Loop**: The outer delivery process — a brief enters, cycles run against it one at a time, a human accepts the outcome or the brief blocks. Run per `loop.md`.

## Rules

**R1**: Every holon contains INTENT, CONTRACT, EVALS, and IMPL.

**R2**: Holons import contracts only, never implementations.

**R3**: Any implementation passing its own evals and all ancestor composition evals is a valid replacement. If a valid replacement breaks the system, the evals were insufficient: correct the evals and log the escape.

**R4**: Composite implementations contain orchestration and child composition only. Architecture emerges from the same cycle mechanism as all work.

**R5**: Holon scope is bounded: bundle + implementation + direct-dependency contracts ≤ declared budget. Exceeding forces a split.

**R6**: Valid cycle outcomes: (a) implementation passing evals; (b) renegotiation — a proposed change to the holon's own INTENT, CONTRACT, or EVALS, with rationale, escalated to the parent; (c) deletion (deletion-review cycles only). Discovering the specification is wrong is a successful outcome: (b).

**R7**: Cycles begin with the full eval suite; red evals outrank new work. Unreferenced intents trigger deletion reviews; outcomes are deletion or reprieve with rationale.

**R8**: Agents draft all content; humans write no implementations. A durable-layer change is approved only by a human-performed merge into the trunk; the merge is the approval. Brief-log appends are exempt.

**R9**: Cycles must be logged to close. The entry follows `logbook/TEMPLATE.md`.

**R10**: Tooling follows convention. Manual adherence across ~30 cycles precedes automation.

**R11**: Every unit of external intent enters as a brief in `docs/briefs/`, numbered sequentially; the source tool is never the canonical record. Briefs are frozen at ingestion; the log is append-only. Change requests are new briefs.

**R12**: A brief closes only by a human merging its brief-branch into the trunk, with all spawned cycles logged. A renegotiation escalating past the root holon blocks the brief; a blocked brief never merges, and resolution is a new brief.

**R13**: Approval, acceptance, and status are recorded in git, never declared in-file. The binding — trunk, branches, merges, tags, commit prefixes, status derivation, replay order — is `gitflow.md`.

## Defaults

Budget: 50,000 tokens per holon (R5). Record consumption per cycle; revise with evidence.

How the four elements map to files is workspace convention: `holons.md`.

## Replayability

The brief log, the merge history, and the logbook form a totally ordered record; the order is defined in `gitflow.md`. Replaying briefs 0001..n from this record yields a durable layer in the same eval-equivalence class. Cycles run one at a time; the total order makes replay well-defined.

## Revisability

All rules and defaults are revisable with evidence.
