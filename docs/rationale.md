# HAL — Rationale

Why the [canon](canon.md) is shaped the way it is: the problem, the bet, and the instruments that judge it.

## Problem Statement

**How might we redesign the unit of software delivery so that all the context an agent needs — intent, contract, and verification — travels *with* the deliverable, making any piece of a system understandable, buildable, and replaceable within a single agent session, with no reliance on accumulated memory?**

Traditional SDLC is a process wrapped around a persistent context-holder: the human developer, who accumulates horizontal knowledge over months by iterating on a codebase. LLM agents invert this — knowledge is ephemeral, context is assembled vertically per task. When the context-holder becomes ephemeral, the durable knowledge must move out of heads-and-tangled-code and into the bundle itself.

**The prime axiom (the durable/disposable split):**

| Layer | Contents | Owner |
|---|---|---|
| **Durable** | intent, contract, evals | human-owned (approved) |
| **Disposable** | implementation | agent-owned (regenerable) |

A **holon** (Koestler) is the unit: simultaneously a whole to its parts and a part to a larger whole. Holons compose into holons — contracts at every level — which dissolves "how small is a unit?" into recursion.

## The Design

One program, three layers:

### 1. The Canon — a falsifiable rule set
A small set of hard rules (12-factor style) defining what a holon is and what may depend on what. Every rule is a claim that can break in practice; breaking one is a finding, not a failure. The rules live in [the canon](canon.md).

### 2. The Loop — how cycles run
Steady state, maintained **by convention, not by orchestrator**: every session begins by running evals; red evals outrank new intent work. Cycles have two valid outcomes — an implementation, or a *renegotiation* of the holon's own contract (the upward channel that prevents perfectly executed wrong specs). Deletion is a first-class cycle type. The per-session protocol lives in [CLAUDE.md](../CLAUDE.md).

### 3. The Lab — how we learn
Instruments woven into real work: a cycle notebook, a seam census (where do failures actually live?), and disposability drills (regenerate a stable holon blind; did evals catch what broke?). The notebook is the deliverable that makes HAL research rather than vibes.

Dev-time units, runtime-agnostic: holons are units of *regeneration*, not deployment. Distribution would contaminate the experiment with noise (partial failure, in-flight versioning) unrelated to the hypothesis. Replaceability is a property of contract discipline, not network topology; extraction to services later is mechanical if the discipline holds.

### The Loop, drawn

```mermaid
flowchart LR
    S([session start]) --> E[run all evals]
    E -->|red| F[fix cycle: red eval is the task]
    E -->|green| I[intent cycle: next durable task]
    F --> O{cycle outcome}
    I --> O
    O -->|impl passes evals| M[merge impl]
    O -->|contract is wrong| R[renegotiation → parent]
    O -->|intent is dead| A[deletion review]
    R --> H[human approves durable change]
    A --> H
    M --> N[notebook entry]
    H --> N
    N --> S
```

## The Instruments

1. **Seam census** (from R9's failure-location field): the running ratio of failures at seams vs inside holons vs eval-escapes. Every componentized paradigm — objects, SOA, microservices — nailed the unit and died at the seams. If most failures are seam failures, unit evals are theater and HAL must become seam-first.
2. **Disposability drill**: periodically pick a stable holon and regenerate it blind from its bundle alone. Diff behavior. Anything broken that evals didn't catch is a measured eval-escape. Over time this traces the **disposability threshold** — the eval-coverage level above which regeneration is safe. The single most publishable finding available.
3. **Cycle accounting**: per cycle, time spent authoring durable parts vs implementing, and approval time. This prices the methodology's overhead honestly.

## The Case

- **Value.** For the researcher: converts a conviction into an experiment that wins either way (working method or sharp post-mortem). For the field: the seam census and disposability threshold don't exist publicly; even small-n numbers are contributions.
- **Feasibility.** Near-zero tooling cost: module-boundary linting, git, an agent CLI, and folder conventions suffice. Time-to-value: first cycle within days of picking a pilot. The hardest part, and the load-bearing wall: **writing evals good enough to carry the replaceability invariant**.
- **Differentiation.** Spec-driven development stops at spec→code: no replaceability invariant, no lifecycle, no measurement. TDD is function-grain, human-paced, refactor-not-regenerate. Microservices are a runtime answer to an organizational problem; HAL is a dev-time answer to a context problem. The novel composite: **enforceable context budgets + regeneration invariant + steady-state trigger + built-in falsification.** (Individual pieces float around — spec-driven tooling, eval-driven chatter, disposable-software essays. Claim the composition, not the pieces.)

## Key Assumptions to Validate

### Must be true (dealbreakers)
- [ ] **Evals can be made load-bearing at affordable cost.** Hyrum's law applies to evals: whatever they don't pin down, dependents depend on anyway. If eval quality is economically unreachable, the durable/disposable split collapses. → *Test: disposability drills early (after ~10 cycles, not months in); track eval-escapes per drill.*
- [ ] **Approving the durable layer is much cheaper than writing implementations.** If reviewing evals is as hard as writing code, nothing was saved and the human bottleneck returns. → *Test: cycle accounting — approval time vs estimated implementation time.*
- [ ] **Bundle authoring cost amortizes.** For a project that never regenerates, HAL is pure overhead vs letting agents read code. → *Test: cumulative authoring overhead vs cycles that reuse/regenerate bundles.*

### Should be true (important)
- [ ] **Renegotiation rate is moderate.** Near-zero means evals are too loose to notice wrong specs; dominant means autonomy is dead and the human is a full-time judge. → *Test: outcome ratios in the notebook.*
- [ ] **A workable context budget B exists and is discoverable.** → *Test: record tokens actually consumed per cycle vs declared B; adjust.*
- [ ] **Composition evals at parent grain catch most seam failures.** → *Test: seam census — escapes that composition evals missed.*

### Might be true (defer)
- [ ] Prescribed context manifests beat free exploration on cycle success and cost (A/B on same holons — deferred).
- [ ] Eval-defined holons are tradeable across projects (the registry horizon — parked).

## Milestones

The MVP of a methodology is the canon plus evidence it was lived:

- The canon committed.
- A pilot chosen (see Open Questions) and decomposed via R5 cycles.
- **First cycles logged** in the notebook, then the **first disposability drill** — riskiest assumption first.
- Enough cycles and drills for a seam census worth citing and a canon revised with citations to notebook entries — plus an honest verdict on the bundle hypothesis.

If the first drill regenerates a holon and nothing outside the evals' coverage breaks, the core bet has its first data point. If it breaks, the escape gets logged and the eval taxonomy grows. Both outcomes are progress.

## Not Doing (and Why)

- **Orchestrator / CLI / framework code** — R10. A tool built before its rule is understood automates a misunderstanding.
- **Runtime service topology** — distribution noise (partial failure, versioning in flight) would contaminate the experiment. Replaceability is contract discipline; extraction later is mechanical.
- **Retrofit / legacy story** — greenfield lab first. Retrofitting is a different (bigger) product with its own research questions.
- **Multi-agent parallel cycles** — confounds every measurement. One cycle at a time until a baseline exists.
- **Context-manifest A/B** — a real experiment, but it adds authoring overhead before the basics are proven. Revisit after ~30 cycles.
- **Registry / marketplace of holons** — the 10x horizon that makes the methodology matter beyond one repo. Named, parked.
- **Community / adoption push** — evidence first, evangelism later. 12-factor was distilled from lived practice at Heroku, not announced ahead of it.

## Open Questions

1. **The pilot project** — the one genuinely open decision. Criteria: something you actually want (real stakes), expected requirements churn (stresses R6), enough seams to make the census meaningful (a UI + an API + persistence + one external integration), small enough for one human plus agents.
2. **Initial context budget B** — proposal: start at 50k tokens per holon, measure actual consumption, amend R4 with data.
3. **Approval mechanics** — proposal: durable files (`INTENT`, contract surface, evals) change only via reviewed PR; implementations merge on green evals without review. Is that discipline sustainable solo?
4. **Minimum eval taxonomy per holon** — proposal: example-based evals + parent composition evals to start; let measured escapes tell us what kinds are missing (property-based, budget, behavioral).
5. **When does the steady-state loop get automated?** — R10 says ~30 cycles. Is N=30 right, or should automation wait for a stable escape rate instead of a cycle count?
