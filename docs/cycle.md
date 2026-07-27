# The Cycle — per-session protocol

A cycle is the atomic unit of work: one holon, one task. This document is the protocol for running one. A session is a sequence of cycles run inside [the Loop](loop.md); most cycles serve a brief, while fix, drill, and deletion-review cycles may be internally triggered. Cycles run strictly one at a time — never in parallel — because replay is defined over the total order of cycles. Each new cycle re-enters this protocol from the top. The canon ([canon.md](canon.md)) wins on any conflict with this document.

The protocol has five phases, in execution order: open, load, work, land, close.

## 1. Open: run the evals

Run the full eval suite — the workspace `evals` target. Any red eval outranks new intent work (R7). A red eval *is* your task until it is green or renegotiated; only with a green suite do you proceed to the task you arrived with.

## 2. Load: context discipline

Load only the holon's bundle (`INTENT.md`, `contract.ts`, `evals/`), its implementation, and its direct dependencies' `contract.ts` files. The budget is 50k tokens (R5). If the task does not fit in that budget, the correct output of the cycle is a split proposal — not a bigger context.

## 3. Work: the dependency rule

Import only from other holons' `contract.ts` (R2). If making progress requires reading another holon's `src/`, that is a **seam finding**: the contract was insufficient. Record it in the logbook entry at close.

Every cycle ends in one of the valid outcomes (R6):

- **(a) Implementation** — code passing evals.
- **(b) Renegotiation** — a proposed change to the holon's own `INTENT.md`, `contract.ts`, or `evals/`, with rationale, escalated to the parent.
- **(c) Deletion proposal** — deletion-review cycles only.

Discovering that the spec is wrong is a success outcome. Say so — outcome (b) — instead of implementing around it.

## 4. Land: branches and merges

A cycle runs on its own branch: `cycle/NNNN-<slug>`, NNNN the cycle's logbook number, off the brief-branch — off `main` for internally triggered cycles. Commits on it use `cycle(NNNN):`.

Merging the cycle-branch is the cycle's approval and its last act: merge mechanically once evals are green and the logbook entry (§5) is committed on the branch. Durable files are drafted by agents and approved by a human merge into `main` (R8); a durable file is approved iff its content is on `main`, and draft otherwise. Never merge into `main` — those merges are human-only. An internally triggered cycle that changed durable files therefore also waits for a human merge.

## 5. Close: log the cycle

A cycle is not done until logged (R9); the entry lands on the cycle-branch before the merge in §4. Copy [logbook/TEMPLATE.md](logbook/TEMPLATE.md) to `logbook/NNNN-<slug>.md`, next number in sequence. Record the brief the cycle serves — `n/a` for internally triggered cycles — so traceability runs brief → cycles → commits. Fill the failure-location and accounting fields honestly; they are the experiment.
