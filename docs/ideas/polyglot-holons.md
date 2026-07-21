# Polyglot holons

Use-case exploration: each holon is created — or mandated — by developers working in different languages and runtimes. One holon in Python, its neighbor in Go, another in TypeScript. Same rulebook, same loop, heterogeneous implementations.

## Premise

Nothing in the HAL protocol is language-bound except one artifact: `contract.ts`. The rulebook, the cycle loop, the approval mechanism, the notebook — all language-neutral. If the contract artifact is generalized, the entire methodology applies to a polyglot system unchanged.

## Why this strengthens the pattern

**R2 becomes physics, not discipline.** Today "import only from `contract.ts`" is enforced by convention; an agent *can* reach into a neighbor's `src/` and must confess via seam finding. Across a runtime boundary, reaching in is impossible. The hardest-to-verify rule becomes self-enforcing.

**Contracts are forced honest.** A language-neutral contract cannot lean on shared types as a covert channel. Everything crossing the seam must be serializable and behaviorally specified. The constraint that looks like a cost is a forcing function for exactly the contract quality R2 assumes.

**Evals go black-box.** Cross-runtime, an eval cannot import the implementation. It must spawn the holon and exercise its surface — which is the truer test of "does this holon satisfy its intent." Single-runtime evals can cheat; polyglot evals cannot.

## What changes

### Contract: `contract.ts` → IDL

The contract becomes an interface definition in a neutral format. Candidates, in rough order of fit:

- **WIT (WebAssembly component model)** — near-isomorphic to the holon concept: sealed polyglot unit, typed interface, structurally incapable of seeing inside neighbors. Toolchain still maturing.
- **Protobuf / gRPC** — mature, typed, codegen for every runtime. Pulls toward service-shaped seams.
- **JSON Schema + OpenAPI** — lowest barrier, weakest typing, human-diffable (matters for `approve:` commits).

Each holon codegens its own binding from the IDL. The IDL file is the durable artifact; bindings are derived, never hand-edited, never approved.

### Evals: function calls → invocation surface

`bun run evals` becomes an orchestrator over heterogeneous toolchains. Every holon must expose a uniform invocation surface — one of:

- CLI: `<holon> run --input <json>` → JSON on stdout
- HTTP: local server, contract-defined routes
- Wasm: host runtime calls exported functions

Pick one convention repo-wide. The eval harness knows the convention, not the language.

### Bundle: one more file

The holon bundle gains a `runtime` declaration (language, build command, invocation surface). Context budget rule (R4/D1) is unchanged — the agent loads the bundle, the implementation, and dependencies' *contracts*. It never needs a dependency's language.

## The org-shaped use-case

Where this earns its keep: cross-team systems where stack choice is already fragmented and non-negotiable.

- Data science team mandates a holon in Python.
- Systems team mandates a holon in Rust or Go.
- Product team mandates the UI holon in TypeScript.

Each team owns its holon's durable layer: `INTENT.md`, contract, evals. `approve:` commits map to per-owner sign-off. The notebook is the shared cross-team record — where seam findings between teams' holons surface as data instead of Slack arguments.

HAL stops being a single-repo methodology and becomes the coordination protocol between teams that delegate implementation to agents in their own stacks. The contract IDL is the treaty; the evals are the treaty's enforcement; the notebook is the diplomatic record.

A second, agent-shaped variant: the agent itself picks the runtime best suited to each holon's task (numerics → Python, concurrency → Go, parsing → Rust). Same mechanics, choice moved from team mandate to cycle outcome. Plausible but speculative; the org-shaped case is the one with existing demand.

## Protocol gaps the org-shaped case exposes

Two mechanisms the rulebook lacks. Both are multi-owner problems, not polyglot problems — but the org-shaped case is where they become unavoidable.

### Two-key approval

Renegotiation (R6b) escalates to the parent. A peer seam between two team-owned holons has no shared parent to escalate to — the contract is a **bilateral artifact**. Its approval rule must extend accordingly: a change to a bilateral contract is approved iff each owner has landed an `approve:` commit for it (one commit co-signed by both, or one per owner). The current single-owner model is the degenerate case: both keys in one hand. The mechanism is small — the approval definition already keys on commits; two-key only changes *whose* commit counts per artifact.

### Consumer-driven contract evals

Cross-team, you never watch the neighbor's evals run; you trust their green. The industry answer (Pact-style consumer-driven contracts) maps directly: the **consumer** holon authors evals against the provider's contract, and those evals run in the **provider's** loop — where R7 makes a red one outrank the provider's intent work.

This gives seam findings a formal destination. Instead of logging "the contract was insufficient" in the notebook and hoping, the consumer contributes a failing eval: the complaint becomes executable, and mechanically becomes the provider's next task. A consumer eval is a renegotiation proposal in test form.

## Costs

- **Toolchain surface multiplies.** N languages = N build systems, N test runners, N CI paths. Each holon's `runtime` declaration must be sufficient for a fresh agent to build and run it inside the context budget.
- **Contract expressiveness drops.** No generics, no rich union types, no shared type narrative. Everything is data at the seam. Likely the first thing to crack.
- **Boundary tax.** Cross-process seams add serialization, latency, and failure modes in-process imports don't have. Holons must be coarse enough to amortize the tax — which conveniently aligns with the 50k-token bundle budget. Too-fine holons hurt on both axes; the two pressures agree on granularity.
- **Agent fluency.** An agent working a Python holon against Go-owned contracts needs the IDL plus one language, not two — *if* the contract discipline holds. Every leak through the seam now costs double.

## Failure modes to watch

1. **IDL drift** — a holon's binding diverges from the IDL because regeneration wasn't forced. Mitigation: bindings are build artifacts, never committed.
2. **Seam bypass via side channels** — shared database, shared files, environment variables. The runtime boundary blocks imports, not ambient state. The rulebook's seam-finding discipline still carries this load.
3. **Eval harness monoculture** — the orchestrator itself becomes a privileged holon written in one language, quietly re-centralizing what the pattern decentralized. Acceptable, but name it.

## Cheapest probe

Consistent with methodology-first: keep the system single-runtime except **one** holon in a second language. Run normal cycles. The notebook entries will show where the seams actually strain — contract expressiveness, eval orchestration, or context budget — before committing to an IDL migration.

The same probe can exercise both protocol mechanisms without any IDL work: designate one seam bilateral (two-key approval on its contract) and have the consumer holon author one eval that runs in the provider's loop. Both are commit-convention and file-placement changes only.

Prediction to falsify: contract expressiveness cracks first.
