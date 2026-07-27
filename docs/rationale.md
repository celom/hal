# Rationale — the bet and how it is judged

Why the [canon](canon.md) is shaped the way it is, and the research protocol that judges it.

## The bet

Traditional SDLC wraps process around a persistent context-holder: the human developer, who accumulates knowledge by living in a codebase. LLM agents invert this — context is assembled per task and discarded. HAL's bet: once the context-holder is ephemeral, the durable knowledge must move into the deliverable itself. Hence the prime axiom — intent, contract, and evals are durable and human-owned; the implementation is disposable and agent-owned — and the holon (Koestler's term) as the unit, because recursive composition dissolves "how small is a unit?".

Holons are units of *regeneration*, not deployment. Distribution would contaminate the experiment with noise (partial failure, in-flight versioning) unrelated to the hypothesis. Replaceability is a property of contract discipline, not network topology; extraction to services later is mechanical if the discipline holds.

## Differentiation

- Spec-driven development stops at spec→code: no replaceability invariant, no lifecycle, no measurement.
- TDD is function-grain, human-paced, refactor-not-regenerate.
- Microservices are a runtime answer to an organizational problem; HAL is a dev-time answer to a context problem.

The novel composite: **enforceable context budgets + regeneration invariant + steady-state trigger + built-in falsification.** Individual pieces float around; claim the composition, not the pieces.

## The instruments

1. **Seam census** (from R9's failure-location field): the running ratio of failures at seams vs inside holons vs eval-escapes. Every componentized paradigm — objects, SOA, microservices — nailed the unit and died at the seams. If most failures are seam failures, unit evals are theater and HAL must become seam-first.
2. **Disposability drill**: periodically regenerate a stable holon blind from its bundle alone; diff behavior. Anything broken that evals didn't catch is a measured eval-escape. Over time this traces the **disposability threshold** — the eval-coverage level above which regeneration is safe. The single most publishable finding available.
3. **Cycle accounting**: per cycle, time authoring durable parts vs implementing, and approval time. Prices the methodology's overhead honestly.
4. **Replay drill**: replay a prefix of the brief log blind and diff the resulting durable layer against the original. The diff measures how much of the outcome is carried by the log versus by the agent. Model and agent drift between runs is part of what the drill measures, not a defect of it.

Replay is the regeneration bet one level up: implementations regenerate from bundles; bundles regenerate from the brief log plus recorded decisions. This requires every choice point to be in the record, and it makes single-threaded cycles load-bearing — parallel cycles would turn the record into a DAG needing a serialization rule.

## Assumptions to validate

### Must be true (dealbreakers)

- [ ] **Evals can be made load-bearing at affordable cost.** Hyrum's law applies to evals: whatever they don't pin down, dependents depend on anyway. If eval quality is economically unreachable, the durable/disposable split collapses. → *Test: disposability drills early (after ~10 cycles); track eval-escapes per drill.*
- [ ] **Approving the durable layer is much cheaper than writing implementations.** If reviewing evals is as hard as writing code, nothing was saved. → *Test: cycle accounting — approval time vs estimated implementation time.*
- [ ] **Bundle authoring cost amortizes.** For a project that never regenerates, HAL is pure overhead. → *Test: cumulative authoring overhead vs cycles that reuse/regenerate bundles.*

### Should be true (important)

- [ ] **Renegotiation rate is moderate.** Near-zero means evals too loose to notice wrong specs; dominant means the human is a full-time judge. → *Test: outcome ratios in the logbook.*
- [ ] **A workable context budget exists and is discoverable.** → *Test: tokens consumed per cycle vs declared budget.*
- [ ] **Composition evals at parent grain catch most seam failures.** → *Test: seam census — escapes composition evals missed.*
- [ ] **Replaying a brief prefix yields an eval-equivalent durable layer.** If most of the outcome lives in the agent rather than the log, the record is not the product's source of truth. → *Test: replay drills.*

### Might be true (defer)

- [ ] Prescribed context manifests beat free exploration on cycle success and cost (A/B on same holons — deferred).
- [ ] Eval-defined holons are tradeable across projects (the registry horizon — parked).

## Milestones

The MVP of a methodology is the canon plus evidence it was lived. In order: commit the canon; choose a pilot and decompose it via R4 cycles; log the first cycles, then run the first disposability drill — riskiest assumption first. The endpoint is enough cycles and drills for a seam census worth citing, and a canon revised with citations to logbook entries.

If the first drill regenerates a holon and nothing outside eval coverage breaks, the core bet has its first data point. If it breaks, the escape gets logged and the eval taxonomy grows. Both outcomes are progress.


## Open questions

1. **The pilot project** — the one genuinely open decision. Criteria: real stakes, expected requirements churn (stresses R6), enough seams for a meaningful census (UI + API + persistence + one external integration), small enough for one human plus agents.
2. **When does automation start?** R10 defers the threshold to the canon's Defaults, currently a cycle count. Is a fixed count right, or should automation wait for a stable escape rate instead?
