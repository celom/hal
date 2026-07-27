# The Loop — brief-driven delivery

The Loop is the outer process: how a unit of external product intent becomes a shipped, accepted outcome. Intent enters as a **brief**; the Loop runs [Cycles](cycle.md) against it; cycles touch holons. The Loop owns what happens around cycles — ingestion, routing, acceptance. Everything inside a cycle belongs to the Cycle protocol and is not respecified here.

## The brief

A brief is the frozen, verbatim snapshot of one unit of external product intent — an issue, feature request, or change request — taken at the moment work begins on it. The external tool (e.g. Linear) is a source, never the canonical record; the repo stays self-contained.

Briefs form an append-only, sequentially numbered log: `docs/briefs/NNNN-<slug>.md` (copy [briefs/TEMPLATE.md](briefs/TEMPLATE.md)). A brief is never edited after ingestion; a change request against previously shipped work is a new brief. Product state is the fold over the brief log.

A brief records its source, the source content verbatim, and acceptance criteria — verbatim from the source when it has them, drafted at ingestion otherwise ([briefs/TEMPLATE.md](briefs/TEMPLATE.md)).

Every unit of external intent enters as a brief, uniformly: a one-line bugfix and a major feature take the same path (R11), so ingestion ceremony is near-zero for small briefs.

Briefs are agent-drafted at ingestion and appended directly to the trunk — recording external intent, not changing specification, so no human act precedes it (R8). Status derives from git (R13).

## Lifecycle

A brief moves through four stages: **ingested → routed → building → accepted | blocked**.

```mermaid
flowchart LR
    X([external intent]) --> I[ingest: append brief NNNN, spawn brief-branch]
    I --> R[route: index query → target holon]
    R --> B[build: cycle-branches, one at a time]
    B -->|human merges brief-branch| A[accepted]
    B -->|renegotiation past root holon| K[blocked: branch never merges]
    A --> D([done])
    K -->|resolution| N([new brief]) --> I
```

### Ingest

Snapshot the external item into the next `docs/briefs/NNNN-<slug>.md`, append it to the trunk, and spawn the brief-branch ([gitflow.md](gitflow.md)). Work starts immediately; no approval gate precedes it.

### Route

The holon-index query ([indexing.md](indexing.md)) maps the brief to a target holon. A brief too large for one holon routes to a composite cycle, which decomposes it into child bundles (R4). Routing plus the composite-cycle machinery is the planning stage; the Loop defines no separate planner.

### Build

A sequence of cycles serving the brief, run per [cycle.md](cycle.md), one at a time. Each cycle runs on its own cycle-branch off the brief-branch and lands per [gitflow.md](gitflow.md).

### Accept

The human merges the brief-branch into the trunk; the merge is the acceptance (conditions and semantics: [gitflow.md](gitflow.md)). Red evals are not an acceptance question — a red eval is already the next cycle's task (R7).

### Blocked

A cycle can end in a renegotiation escalated to its parent (R6). The brief is the terminus of that escalation chain: a renegotiation that escalates past the root holon means the brief itself is wrong. The brief-branch is marked blocked ([gitflow.md](gitflow.md)). Resolution is a new brief — drafted for the human and flowed back to the source tool.

## Replayability

Replay equivalence is eval-equivalence, not bit-equivalence — same equivalence class, possibly a different member — the same criterion as a valid implementation replacement (R3). This is the regeneration bet one level up: implementations regenerate from bundles; bundles regenerate from the brief log plus recorded decisions (canon, "Replayability").

Replayability requires every choice point to be in the record.

The total order is a design commitment, not a lab convenience. Single-threaded cycles began as measurement hygiene; replayability makes them load-bearing — the total order is what makes replay well-defined. Parallel cycles would turn the record into a DAG and require a serialization rule.

The instrument is the **replay drill**: replay a prefix of the brief log blind and diff the resulting durable layer against the original. The diff measures how much of the outcome is carried by the log versus by the agent. Model and agent drift between the original run and the replay is part of what the drill measures, not a defect of it.
