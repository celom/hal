# Poly-agent holons

Use-case exploration: different holons worked by different coding agents — different vendors, different models — under one protocol. Companion to [polyglot holons](polyglot-holons.md), which varies the runtime; this varies the executor.

## Premise

The polyglot doc adds a `runtime` declaration to the bundle. That declaration is really an **executor** declaration, and execution has two orthogonal axes:

- **What runs the holon** — language, runtime, build. The polyglot axis.
- **What works the cycle** — the agent authoring implementations, proposals, notebook entries. The poly-agent axis.

Nothing in the protocol binds the second axis to a specific agent. The durable layer is files and git conventions. Any agent that can read files, run evals, and make commits can play. HAL is accidentally vendor-neutral; this doc makes it deliberate.

## The trust model that makes it work

The protocol never trusts the author — it checks the work.

- **Evals are the equalizer.** An implementation is valid because evals are green, not because a particular agent wrote it. Green is green regardless of who produced it.
- **The human is the only privileged role.** `approve:` commits anchor the durable layer, and that anchor is agent-independent by construction.
- **Everything else is authorship-blind.** Contracts, intents, notebook entries — judged by content and commit convention, never by origin.

This is the same move consumer-driven contract evals make cross-team (see polyglot doc): replace trust in a counterparty with a check you own. Poly-agent extends it from *teams you don't control* to *agents you didn't pick*.

What it reframes: HAL is not a workflow for one agent. It is an **interop protocol for agent-driven development** — the seam artifacts are the API between agents, not just between codebases. Teams choose agents the way they choose languages.

## What must change

**The loop must leave `CLAUDE.md`.** The operational loop currently lives in a vendor-specific file. Poly-agent requires the loop in an agent-neutral home (e.g. `AGENTS.md`), with per-vendor entry files reduced to thin shims: "read AGENTS.md, follow it." Any protocol content in a vendor file is a leak.

**The context budget needs a neutral denomination.** "50k tokens" varies by tokenizer. Bytes or words are cruder but comparable; alternatively, keep tokens and accept ±15% slop. Decide before comparing agents, not after.

**`TEMPLATE.md` carries more load.** Notebook entries are only comparable across agents if the template constrains structure hard. Free-form fields will drift into per-agent house styles and quietly destroy the dataset.

**`approve:` needs enforcement, not convention.** With one agent, "never author an `approve:` commit" is a promptable rule. With N agents of varying discipline, it should be mechanical: a hook or CI check that rejects `approve:` commits whose author isn't on the human allowlist.

## The experiment gets richer

The notebook's failure-location and accounting fields currently characterize *the methodology*. With multiple agents they also characterize *the agents*: does failure location correlate with executor? Does one agent produce more seam findings, more renegotiations, more eval-gaming attempts? Same holon reworked by a different agent after a reset is a direct A/B on intent-implementation fidelity.

Confound warning: agent × language × holon-difficulty are entangled. Without assignment discipline (swap agents across the same holon set, hold runtime constant) the data is anecdote, not measurement.

## Failure modes to watch

1. **Vendor convention leakage** — protocol content accreting in vendor files until one agent's environment is load-bearing. Mitigation: shims are one line; anything longer is a finding.
2. **Shim drift** — per-vendor entry files diverging in what they instruct. Mitigation: shims contain a pointer, never instructions.
3. **Notebook incomparability** — entries drifting into house styles. Mitigation: template tightness; treat "entry deviates from template" as a red eval on the cycle.
4. **Self-report variance** — accounting fields are the agent grading its own honesty. Cross-agent variance in candor is itself data, but it also corrupts the primary dataset. Spot-audit entries against diffs.
5. **Differential eval-gaming** — agents differ in willingness to overfit an eval rather than satisfy intent. The protocol's answer is more/better evals, but the *rate* should be tracked per agent in the notebook.

## Cheapest probe

Two agents, same repo, disjoint holon sets, identical runtime — run normal cycles, then swap sets. Everything needed already exists except three small changes: move the loop to a neutral file, add the second vendor shim, add the `approve:` authorship check. Compare notebook accounting across the swap.

Prediction to falsify: failure location is a property of the methodology, not the agent — i.e., the distributions look the same. If they don't, that difference is the most valuable data this repo has produced.
