# HAL: Holonic Agentic Loop
## A Redesign of Software Delivery for Ephemeral Context

### Executive Summary

HAL is a methodology for software delivery in environments where the context-holder is not a persistent human developer but an ephemeral agentic agent. Traditional software development assumes a developer accumulates knowledge by living in a codebase; this permits durable knowledge to remain implicit in the implementer's mind. When agents handle implementation, context is assembled per task and discarded. Once the context-holder is ephemeral, the durable knowledge must move into the deliverable itself.

HAL solves this by:

1. **Splitting durable from disposable** - intent, contract, and evals are human-owned and permanent; implementation is agent-owned and regenerable.
2. **Introducing the holon as the unit** - simultaneously a whole (contains children) and part (contained in a parent), enabling recursive composition from leaf implementation to system architecture.
3. **Measuring what matters** - four continuous instruments (seam census, disposability drill, cycle accounting, replay drill) keep the methodology honest and enable revision with evidence.

The result is a delivery method where implementations are mechanically regenerable, specifications are enforceable at scale, and architectural decisions emerge from the same cycle mechanism as all work.

---

## Part I: The Problem and Premise

### The Ephemeral Context Problem

In traditional software development, the developer is the persistent context-holder. The developer reads a problem statement, loads prior related code, holds a mental model of design constraints, and implements a solution. Much of this context is implicit. The cost of this implicit context is acceptable because the developer persists; they remain available for follow-up questions, refinements, and handoff.

Agentic development inverts this. An LLM agent is spun up with a task, generates a solution within a limited context window, and is then discarded. The agent cannot hold implicit context across tasks. If knowledge is not explicit in what the agent can read, it is lost.

The immediate consequence is a requirement for specification. But specification alone is insufficient. Specifications can be misunderstood, incompletely specified, or correctly understood but incorrectly implemented. The agent needs three things to make correctness visible:

1. A specification of what it should do (intent and contract).
2. A proof that it did it (evals).
3. An architecture that bounds scope, enabling regeneration at a reasonable cost.

Traditional methodologies handle these as separate concerns. HAL unifies them as properties of the unit of delivery.

### The Foundational Principle

**Durable knowledge is human-owned and explicitly encoded in the deliverable. Disposable knowledge is agent-owned and regenerable.**

This split is not about what humans and agents prefer to do. It is about which pieces must survive task boundaries.

- **Intent** (why the component exists, its anti-goals, its token budget) must survive because it anchors renegotiation when specifications prove wrong.
- **Contract** (typed inputs and outputs) must survive because it is the only reliable surface between components; implementations change, contracts stabilize.
- **Evals** (executable proofs of correctness) must survive because they enable the regeneration invariant: any implementation passing them is valid.
- **Implementation** is disposable because a valid alternative implementation is indistinguishable from the original at the contract boundary.

Making this split visible forces the hard questions: What is the contract? What does correctness mean? Can we prove it? The act of making them explicit improves design; the ability to regenerate improves resilience.

---

## Part II: Core Concepts

### The Holon

HAL's unit of composition is the **holon** - Arthur Koestler's term for units that are simultaneously self-contained and composable. Concretely: a holon is either a leaf (an isolated implementation) or a composite (an adapter/facade orchestrating child holons through their contracts). Both carry the same four elements and nest recursively, so architectural structure emerges from the same decomposition rule as implementation.

#### The Four Elements

Every holon contains:

1. **INTENT** (durable): Why the holon exists. Records invariants, anti-goals, routing summary, and declared token budget.
2. **CONTRACT** (durable): What the holon requires and provides - inputs and outputs. The sole importable surface; implementation details are hidden.
3. **EVALS** (durable): Executable proof of correctness. Example-based for leaf holons; composition evals for parents validate children through the parent contract.
4. **IMPL** (disposable): How the holon operates. For leaves: implementation code. For composites: orchestration and glue only.

The durable trio - INTENT, CONTRACT, EVALS - is called the **bundle**.

#### Regeneration and Composition

An implementation is **regenerable** if it can be rewritten from its bundle and produce an equivalent result. Equivalence is defined by passing the eval suite and all ancestor composition evals.

A composite holon's implementation contains only orchestration: wiring together child holons' contracts. This property (R4) ensures that architectural structure emerges from the same cycle mechanism as leaf implementation - there is no separate design phase. Architecture is what you get when you apply the unit discipline consistently.

### The Durable/Disposable Split

The split is the enabling constraint:

- **Durable**: Stable, human-reviewed, carries forward across cycles. Includes intent, contract, evals, and the logbook.
- **Disposable**: Regenerable, agent-authored, safe to discard. Implementations and intermediate work products.

The contract boundary is sharp: holons import contracts only, never implementations (R2). Importing implementation creates undeclared dependencies on implementation details; when that implementation is regenerated, hidden assumptions break.

---

## Part III: The Three Processes

HAL defines three nested protocols: the Canon (rules), the Loop (spec delivery process), and the Cycle (holon's implementation protocol).

### The Canon: Rule Set

The canon contains 13 rules (R1–R13) plus definitions and defaults. Rules are normative; everything else is context and exemplar.

#### Core Rules

**R1**: Every holon contains INTENT, CONTRACT, EVALS, and IMPL.

**R2**: Holons import contracts only, never implementations.

**R3**: Any implementation passing its own evals and all ancestor composition evals is a valid replacement. If a valid replacement breaks the system, the evals were insufficient - correct the evals and log the escape.

**R4**: Composite implementations contain orchestration and child composition only. Architecture emerges from the same cycle mechanism as all work.

**R5**: Holon scope is bounded: bundle + implementation + direct-dependency contracts ≤ declared token budget . Exceeding forces a split.

**R6**: Valid cycle outcomes are: (a) implementation passing evals; (b) renegotiation - a proposed change to the holon's INTENT, CONTRACT, or EVALS, with rationale, escalated to the parent; (c) deletion. Discovering the specification is wrong is a successful outcome.

**R7**: Cycles begin with the full eval suite; red evals outrank new work. Unreferenced intents trigger deletion reviews.

**R8**: Agents draft all content; humans write no implementations. A durable-layer change is approved only by a human-performed merge into the trunk; the merge is the approval.

**R9**: Cycles must be logged to close. The entry follows a standardized template.

**R10**: Tooling follows convention.

**R11**: Every unit of external intent enters as a brief in `docs/briefs/`, numbered sequentially. Briefs are immutable; the repo is canonical, not the source tool. Change requests are new briefs.

**R12**: A brief closes only by a human merging its brief-branch into the trunk, with all spawned cycles logged.

**R13**: Approval, acceptance, and status are recorded in git, never declared in-file.

#### Revisability

All rules and defaults are revisable with evidence (canon, "Revisability"). A rule that breaks in practice is a revision, not a failure. Revisions are justified by measurements from the instruments (see "Part IV").

### The Loop: Brief-Driven Delivery

The Loop is the outer delivery process. External intent enters as a frozen brief, cycles run against it sequentially, and a human accepts the outcome or the brief blocks.

#### Lifecycle

```
external intent → ingest → decompose → implement (cycles) → accept | blocked
```

**Ingest**: Capture the external item (issue, feature request, change request) verbatim into the next `docs/briefs/NNNN-<slug>.md`, append it to the trunk, and spawn the brief-branch. Work starts immediately; no approval gate precedes it.

**Decompose**: The catalog query maps the brief to a target holon. If the brief fits in a leaf holon, it routes there. If it exceeds one holon's budget, it routes to a composite cycle, which decomposes it into child bundles (R4). The artifact of this stage is the bundle(s): INTENT, CONTRACT, and EVALS for each holon that will handle the brief. If a necessary composite holon doesn't exist, the agent authors its bundle (R8), adds it to the catalog, and proceeds to Implement; the human approves the new holon when merging. Renegotiation is reserved for discovering the brief itself is wrong, not for architecture discovery. Decomposition plus composite-cycle machinery is the planning stage; the Loop defines no separate planner.

**Implement**: A sequence of cycles serving the brief, run per the Cycle protocol, one at a time, each on its own cycle-branch off the brief-branch. Each cycle produces an implementation (IMPL) that conforms to the bundle authored in Decompose.

**Accept**: The human merges the brief-branch into the trunk; the merge is the acceptance. Red evals are not an acceptance question — a red eval is already the next cycle's task.

**Blocked**: A renegotiation escalating past the root holon means the brief itself is wrong. The brief-branch is marked blocked; resolution is a new brief drafted for the human.

#### Replayability

The brief log plus git history forms a totally ordered record. Replaying briefs 0001..n from this record yields a durable layer in the same eval-equivalence class. Cycles run one at a time; single-threading makes replay well-defined.

### The Cycle: Per-Cycle Protocol

A cycle is the atomic unit of work: one holon, one task. Most cycles serve a brief; fix, drill, and deletion-review cycles may be internally triggered. Cycles run strictly one at a time.

#### Five Phases

**1. Open**: Run the full eval suite. A red eval outranks new work and is the task until green or renegotiated. Only with a green suite do you proceed to the task you arrived with.

**2. Load**: Load only the holon's bundle, its implementation, and its direct dependencies' contracts. The budget is the holon's declared budget. If the task does not fit, the correct output is a split proposal, not a bigger context.

**3. Work**: Import only from other holons' contracts. If progress requires reading another holon's implementation, that is a seam finding — the contract was insufficient. Record it in the logbook entry.

**4. Land**: Merge the cycle-branch per gitflow. The logbook entry is committed on the branch before the merge.

**5. Close**: Log the cycle to a standardized template. Record the brief served, failure location (seam, inside holon, eval-escape), and token consumption. Traceability runs brief → cycles → commits.

---

## Part IV: Measurement and Revision

HAL depends on four continuous measurements to keep rules from decaying into ritual. Each can contradict a rule, and a contradiction revises the rule.

### 1. Seam Census

From R9's failure-location field, track the running ratio of failures at seams (contract boundaries) versus inside holons versus eval-escapes. Every componentized paradigm — objects, SOA, microservices — nailed the unit and struggled at seams. A rising seam ratio signals that unit evals have stopped carrying their weight and composition evals need to move down a level (e.g., split a holon or tighten a contract).

### 2. Disposability Drill

Periodically regenerate a stable holon blind from its bundle alone; diff the behavior. Anything broken that evals didn't catch is a measured eval-escape. The fix is the eval, not the implementation (R3). The running escape rate locates the disposability threshold — the eval coverage level above which regeneration is safe.

### 3. Cycle Accounting

Per cycle, record authoring time (intent, contract, evals), implementation time, and approval time. Prices the methodology's overhead honestly. If reviewing evals costs as much as writing code, the split has collapsed; if regeneration never happens, the authoring cost is amortized over zero cycles.

### 4. Replay Drill

Replay a prefix of the brief log blind and diff the resulting durable layer against the original. The diff measures how much of the outcome is carried by the log versus by the agent. Model and agent drift between runs is part of what the drill measures. If most of the outcome lives in the agent rather than the log, the record is not the product's source of truth.

---

## Part V: Why HAL

### Differentiation from Existing Methodologies

**Spec-driven development**: Stops at spec→code. No replaceability invariant, no lifecycle, no measurement. Specifications rot when implementations diverge.

**Test-driven development (TDD)**: Function-grain, human-paced, refactor-not-regenerate. Excellent for human developers; does not address the ephemeral-context problem or supply an architecture discipline.

**Microservices**: A runtime answer to an organizational problem (team scaling). HAL is a dev-time answer to a context problem (agent scaffolding). Orthogonal concerns; a holon is not a service (holons are units of regeneration, not deployment).

### What Distinguishes HAL

The composite is what matters: **enforceable context budgets + regeneration invariant + steady-state trigger + built-in falsification**. Individual pieces are common (specs, tests, decomposition); the composition is the method. The composition creates:

1. **Enforceable scope**: Budgets force splits before contexts explode.
2. **Measurable regenerability**: Disposability drills prove evals carry the load.
3. **Automatic architecture**: Structure emerges from unit discipline, not planning.
4. **Built-in falsification**: The instruments contradict rules; rules revise against evidence.

---

## Part VI: Conditions for Success

HAL pays for itself when:

1. **Evals are load-bearing**: Whatever evals do not pin down, dependents depend on anyway (Hyrum's law). Eval quality is the ceiling on the durable/disposable split. *Watch: eval-escapes per disposability drill.*

2. **Approving the durable layer is cheaper than writing implementations**: This is where the savings come from. If reviewing evals costs as much as writing code, the split has collapsed. *Watch: cycle accounting — approval time vs implementation time.*

3. **Bundle authoring amortizes**: A codebase that never regenerates pays the authoring cost without collecting the return. *Watch: cumulative authoring overhead vs cycles that reuse or regenerate bundles.*

4. **Renegotiation rate stays moderate**: Near-zero means evals too loose to notice wrong specs; dominant means the human is a full-time judge. *Watch: outcome ratios in the logbook.*

5. **The context budget holds**: Declared budgets must not be regularly exceeded. *Watch: tokens consumed per cycle vs declared budget.*

6. **Composition evals catch seam failures**: Unit evals are necessary but not sufficient. *Watch: the seam census.*

7. **Replayed brief prefixes yield eval-equivalent durable layers**: If most outcome lives in the agent rather than the log, the record is not the source of truth. *Watch: replay drills.*

A project fits HAL best when it has real stakes, expected requirements churn (which exercises renegotiation as a success outcome), enough architectural seams (UI + API + persistence + integration) for a meaningful census, and a scope one human plus agents can hold.

---

## Part VII: Implementation Roadmap

### Adoption Steps

In order:

1. **Commit the canon**: Decide the rules are binding until explicitly revised.
2. **Decompose via composites**: Represent the product architecture as composite holons; R4 ensures they are purely orchestration.
3. **Run cycles and log them**: Execute the Cycle protocol; fill the logbook with measured failure locations and token consumption.
4. **Run the first disposability drill**: Once a holon is stable, regenerate it blind from its bundle and diff. This is the earliest check that evals are load-bearing.
5. **Run instruments continuously**: Seam census, cycle accounting, replay drills. Revise the canon against findings.

### Automation Threshold

~30 manual cycles (default, R10). Manual discipline precedes tooling; tooling codifies what works. Threshold is revisable with evidence.

---

## Part VIII: Open Questions

Two questions are deliberately left unanswered, pending evidence:

1. **Prescribed context vs. free exploration**: Do cycles with prescriptive context windows (constrained scope) outperform free-form agent exploration on cycle success and cost?

2. **Cross-project registry**: Are eval-defined holons tradeable across projects? Can a bundle from one product be reused in another?

---

## Conclusion

HAL is a methodology for agentic development where the context-holder is ephemeral. It solves this by making durable knowledge explicit in the deliverable and enabling regeneration through the holon — a recursive unit that embodies intent, contract, evals, and disposable implementation.

The method is not a new framework or technology. It is a set of 13 rules plus measurement discipline. It scales from a single implementer to a team because holons compose recursively. It enables regeneration because contracts are enforced. It stays honest because four instruments continuously measure whether the rules are earning their keep.

HAL is designed for projects with real stakes, architectural seams, and teams where one human can hold the scope. It is revisable with evidence — a rule that breaks in practice is revised, not defended. The goal is not to apply a fixed methodology but to build delivery infrastructure that remains sound as agents, models, and teams evolve.
