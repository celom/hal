# Git flow — authority and status in git

The binding of the canon's authority model (R8, R11, R12) to git. The canon states the invariants; this document states how git records them. It is binding, not a suggestion — revising it is a mechanism change the invariants must survive.

## Trunk

`main` is the trunk and the durable record. Content is **approved iff it is on `main`**.

Who may merge into `main`:

- a merge carrying durable-layer changes is performed by a human — the merge is the approval act (R8);
- a brief-branch merge is performed by a human regardless of content — acceptance is a human judgment (R12);
- the only mechanical merges into `main` are internally triggered cycles that touched nothing durable.

Two commit classes land on `main` directly, without a merge:

- brief ingestion — a brief records external intent verbatim; appending it is recording, not specification change (the R8 exemption);
- `meta:` commits — docs and scaffolding.

## Branches

| Branch | One per | Off | Merges into | Merged by | Merge conditions |
|---|---|---|---|---|---|
| `brief/NNNN-<slug>` | brief, at ingestion | `main` | `main` | human | outcome meets the brief's acceptance criteria; workspace evals green; every spawned cycle logged (R12) |
| `cycle/NNNN-<slug>` | cycle, at open | its brief-branch | the brief-branch | mechanical — no human act | evals green; logbook entry committed on the branch (R9) |
| `cycle/NNNN-<slug>` (internally triggered: fix, drill, deletion review) | cycle, at open | `main` | `main` | mechanical if only disposable files changed; human otherwise | same as cycle-branches |

NNNN is the brief number for brief-branches and the cycle's logbook number for cycle-branches.

Merge semantics:

- merging a cycle-branch **approves the cycle**;
- merging a brief-branch **accepts the brief** and approves every durable change it carries, in one act.

## Blocked

A renegotiation that escalates past the root holon blocks the brief. Tag the brief-branch head `blocked/NNNN-<slug>`; the branch never merges and may then be deleted — the tag is the durable marker. The brief file stays in the log on `main`, unedited.

## Commit prefixes

- `brief(NNNN):` — ingestion; appends a brief to the log on `main`
- `cycle(NNNN):` — work on a cycle-branch
- `meta:` — docs and scaffolding, never mixed with cycle work

## Status derivation

Status is never declared in-file — a declared status is a second source of truth that can drift. Derive:

- **Brief**: *building* while `brief/NNNN-<slug>` is unmerged · *accepted* when merged into `main` · *blocked* when its head is tagged `blocked/NNNN-<slug>`.
- **Cycle**: *approved* when its branch is merged.
- **Durable file**: *approved* iff its content is on `main`; *draft* otherwise.

## The replay order

The totally ordered record that replay depends on (canon, "Replayability"):

- brief order = first-parent history of `main` — ingestion commits interleaved with acceptance merges;
- cycle order within a brief = first-parent history of its brief-branch.

Cycles run one at a time, so first-parent order is total. Parallel cycles would break this; the constraint is load-bearing.

## Enforcement

Convention first (R10): manual adherence across ~30 cycles precedes automation. The eventual mechanical form is branch protection on `main` (human allowlist for durable-carrying merges) plus a merge check on cycle-branches for green evals and a committed logbook entry.
