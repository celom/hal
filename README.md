# HAL — Holonic Agentic Loop

An experiment in redesigning the unit of software delivery for agentic development.

Traditional SDLC wraps process around a persistent context-holder: the human developer, who accumulates knowledge by living inside a codebase. LLM agents invert this — context is assembled per task and discarded. HAL's bet is that when the context-holder becomes ephemeral, the durable knowledge must move out of heads and tangled code and into the deliverable itself:

| Layer | Contents | Owner |
|---|---|---|
| **Durable** | intent, contract, evals | human-owned (approved) |
| **Disposable** | implementation | agent-owned (regenerable) |

The unit is the **holon** — simultaneously a whole to its parts and a part to a larger whole. Every holon ships its intent, contract, evals, and a disposable implementation; any implementation that passes its evals — and its ancestors' composition evals — is a valid replacement.

## How it runs

- **The Rules** — a falsifiable [rulebook](docs/rulebook.md). Every rule is a claim that can break in practice; breaking one is a finding, not a failure.
- **The Loop** — the per-session protocol in [CLAUDE.md](CLAUDE.md): evals first, one cycle at a time, renegotiation as a success outcome, humans as reviewers rather than laborers.
- **The Lab** — a cycle [notebook](docs/notebook/), a seam census, and disposability drills. The measurements are the deliverable; this is research, not vibes.

## Status

Methodology-first, tested greenfield, judged by **validated learning** — target Dec 2026: ≥30 logged cycles, ≥5 disposability drills, a seam census worth citing, and a rulebook revised with citations to notebook entries. Provenance and rationale are frozen in the [idea document](docs/ideas/hal-holon-agentic-lifecycle.md); workspace mechanics live in [conventions](docs/conventions.md).
