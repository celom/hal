# HAL — Holonic Agentic Loop

An exploration on redesigning the unit of software delivery for agentic development.

HAL's bet: when the context-holder is an ephemeral agent rather than a persistent developer, the durable knowledge must move into the deliverable itself. The canonical statement is in [rationale](docs/rationale.md); the split it produces:

| Layer | Contents | Owner |
|---|---|---|
| **Durable** | intent, contract, evals | human-owned (approved) |
| **Disposable** | implementation | agent-owned (regenerable) |

The unit is the **holon** — simultaneously a whole to its parts and a part to a larger whole. Every holon ships its intent, contract, evals, and a disposable implementation; any implementation that passes its evals — and its ancestors' composition evals — is a valid replacement.

## How it runs

- **The Canon** — a falsifiable [rule set](docs/canon.md). Every rule is a claim that can break in practice; breaking one is a finding, not a failure.
- **The Loop** — the brief-driven [outer process](docs/loop.md): external intent enters as a frozen brief in an append-only log, cycles build against it, a human accepts the outcome. The log plus git is a totally ordered record the product can be replayed from.
- **The Cycle** — the [per-cycle protocol](docs/cycle.md): evals first, one cycle at a time, renegotiation as a success outcome, humans as reviewers rather than laborers.
- **The Lab** — a cycle [logbook](docs/logbook/), a seam census, disposability drills, and replay drills. The measurements are the deliverable; this is research, not vibes.

The bet and the research protocol live in [rationale](docs/rationale.md); file layout and the holon catalog in [holons](docs/holons.md); the git binding in [gitflow](docs/gitflow.md); explorations beyond the base pattern in [ideas](docs/ideas/).
