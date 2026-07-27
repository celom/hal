# Rationale — why the canon is shaped this way

The reasoning behind the [canon](canon.md), and the instruments that keep it honest in daily use.

## The premise

Traditional SDLC wraps process around a persistent context-holder: the human developer, who accumulates knowledge by living in a codebase. LLM agents invert this — context is assembled per task and discarded. Once the context-holder is ephemeral, the durable knowledge must move into the deliverable itself. Hence the prime axiom — intent, contract, and evals are durable and human-owned; the implementation is disposable and agent-owned — and the holon (Koestler's term) as the unit, because recursive composition dissolves "how small is a unit?".

Holons are units of *regeneration*, not deployment. Distribution adds noise — partial failure, in-flight versioning — orthogonal to the replaceability the unit exists to provide. Replaceability is a property of contract discipline, not network topology; extraction to services later is mechanical if the discipline holds.

## Differentiation

- Spec-driven development stops at spec→code: no replaceability invariant, no lifecycle, no measurement.
- TDD is function-grain, human-paced, refactor-not-regenerate.
- Microservices are a runtime answer to an organizational problem; HAL is a dev-time answer to a context problem.

The composite is what distinguishes HAL: **enforceable context budgets + regeneration invariant + steady-state trigger + built-in falsification.** The individual pieces are common; the composition is the method.

## The instruments

Four measurements run continuously. They are what keeps rules from decaying into ritual: each one can contradict a rule, and a contradiction revises the rule (canon, "Revisability").

1. **Seam census** (from R9's failure-location field): the running ratio of failures at seams vs inside holons vs eval-escapes. Every componentized paradigm — objects, SOA, microservices — nailed the unit and struggled at the seams. A rising seam ratio is the signal that unit evals have stopped carrying their weight and composition evals need to move down a level.
2. **Disposability drill**: periodically regenerate a stable holon blind from its bundle alone; diff behavior. Anything broken that evals didn't catch is a measured eval-escape, and the fix is the eval, not the implementation (R3). The running escape rate locates the **disposability threshold** — the eval-coverage level above which regeneration is safe.
3. **Cycle accounting**: per cycle, time authoring durable parts vs implementing, and approval time. Prices the methodology's overhead honestly.
4. **Replay drill**: replay a prefix of the brief log blind and diff the resulting durable layer against the original. The diff measures how much of the outcome is carried by the log versus by the agent. Model and agent drift between runs is part of what the drill measures, not a defect of it.

Replay is the regeneration invariant one level up: implementations regenerate from bundles; bundles regenerate from the brief log plus recorded decisions. This requires every choice point to be in the record, and it makes single-threaded cycles load-bearing — parallel cycles would turn the record into a DAG needing a serialization rule.

## What the method depends on

Conditions under which HAL pays for itself. Each is measurable from the instruments above; a project that violates one should expect the corresponding cost.

- **Evals are load-bearing.** Hyrum's law applies to evals: whatever they don't pin down, dependents depend on anyway. Eval quality is the ceiling on the durable/disposable split. → *Watch: eval-escapes per disposability drill.*
- **Approving the durable layer is cheaper than writing implementations.** This is where the saving comes from; if reviewing evals costs as much as writing code, the split has collapsed. → *Watch: cycle accounting — approval time vs implementation time.*
- **Bundle authoring amortizes.** A codebase that never regenerates pays the authoring cost without collecting the return. → *Watch: cumulative authoring overhead vs cycles that reuse or regenerate bundles.*
- **Renegotiation rate stays moderate.** Near-zero means evals too loose to notice wrong specs; dominant means the human is a full-time judge. → *Watch: outcome ratios in the logbook.*
- **The context budget holds.** → *Watch: tokens consumed per cycle vs declared budget (R5).*
- **Composition evals at parent grain catch seam failures.** → *Watch: the seam census.*
- **A replayed brief prefix yields an eval-equivalent durable layer.** If most of the outcome lives in the agent rather than the log, the record is not the product's source of truth. → *Watch: replay drills.*

Two questions are still open and deliberately unanswered: whether prescribed context manifests beat free exploration on cycle success and cost, and whether eval-defined holons are tradeable across projects (the registry horizon).

## Adopting HAL on a project

In order: commit the canon; decompose the product via R4 composite cycles; run cycles and log them; run the first disposability drill once a holon is stable — it is the earliest check that the evals are load-bearing. From there the instruments run continuously and the canon is revised against them, with citations to logbook entries.

A project fits HAL best with real stakes, expected requirements churn (which exercises R6), enough seams for a meaningful census (UI + API + persistence + at least one external integration), and a scope one human plus agents can hold.
