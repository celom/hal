# The Cycle — per-session protocol

A cycle is the atomic unit of work: one holon, one task. This document is the protocol for running one. A session is a sequence of cycles run inside [the Loop](loop.md); most cycles serve a brief, while fix, drill, and deletion-review cycles may be internally triggered. Cycles run strictly one at a time — never in parallel (canon, "Replayability"). Each new cycle re-enters this protocol from the top.

The protocol has five phases, in execution order: open, load, work, land, close.

## 1. Open: run the evals

Run the full eval suite — the workspace `evals` target. Any red eval outranks new intent work (R7). A red eval *is* your task until it is green or renegotiated; only with a green suite do you proceed to the task you arrived with.

## 2. Load: context discipline

Load only the holon's bundle (`INTENT.md`, `contract.ts`, `evals/`), its implementation, and its direct dependencies' `contract.ts` files. The budget is the holon's declared budget (R5). If the task does not fit in that budget, the correct output of the cycle is a split proposal — not a bigger context.

## 3. Work: the dependency rule

Import only from other holons' `contract.ts` (R2). If making progress requires reading another holon's `src/`, that is a **seam finding**: the contract was insufficient. Record it in the logbook entry at close.

Every cycle ends in one of the valid outcomes (R6). Never implement around a wrong spec — renegotiate: outcome (b).

## 4. Land: merge per the git flow

A cycle lands by merging its cycle-branch per [gitflow.md](gitflow.md); the logbook entry (§5) is committed on the branch before the merge. Gitflow defines which merges are mechanical and which are human-only — follow it exactly.

## 5. Close: log the cycle

A cycle is not done until logged (R9). Copy [logbook/TEMPLATE.md](logbook/TEMPLATE.md) to `logbook/NNNN-<slug>.md`, next number in sequence. Record the brief the cycle serves — `n/a` for internally triggered cycles — so traceability runs brief → cycles → commits. Fill the failure-location and accounting fields honestly; they are the experiment.
