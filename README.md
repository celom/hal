# HAL — Holonic Agentic Loop

An experiment in redesigning the unit of software delivery for agentic development.

Traditional SDLC wraps process around a persistent context-holder: the human developer, who accumulates knowledge by living inside a codebase. LLM agents invert this — context is assembled per task and discarded. HAL's bet is that when the context-holder becomes ephemeral, the durable knowledge must move out of heads and tangled code and into the deliverable itself:

| Layer | Contents | Owner |
|---|---|---|
| **Durable** | intent, contract, evals | human-owned (approved) |
| **Disposable** | implementation | agent-owned (regenerable) |

The unit is the **holon** — simultaneously a whole to its parts and a part to a larger whole. Every holon ships its intent, contract, evals, and a disposable implementation; any implementation that passes its evals — and its ancestors' composition evals — is a valid replacement.

## How it runs

- **The Canon** — a falsifiable [rule set](docs/canon.md). Every rule is a claim that can break in practice; breaking one is a finding, not a failure.
- **The Loop** — the per-session protocol in [CLAUDE.md](CLAUDE.md): evals first, one cycle at a time, renegotiation as a success outcome, humans as reviewers rather than laborers.
- **The Lab** — a cycle [logbook](docs/logbook/), a seam census, and disposability drills. The measurements are the deliverable; this is research, not vibes.

The reasoning behind the design lives in [rationale](docs/rationale.md); workspace mechanics in [conventions](docs/conventions.md); explorations beyond the base pattern in [ideas](docs/ideas/).
