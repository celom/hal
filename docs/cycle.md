# The Cycle — per-cycle protocol

A cycle is the atomic unit of work: one holon, one task. Most cycles serve a brief in [the Loop](loop.md); fix, drill, and deletion-review cycles may be internally triggered. Cycles run strictly one at a time — never in parallel (canon, "Replayability"). Each cycle enters this protocol from the top.

Five phases, in order: open, load, work, land, close.

## 1. Open: run the evals

Run the full eval suite — the workspace `evals` target. A red eval outranks new work and *is* the task until green or renegotiated (R7); only with a green suite do you proceed to the task you arrived with.

## 2. Load: context discipline

Load only the holon's bundle, its implementation, and its direct dependencies' contracts. The budget is the holon's declared budget (R5). If the task does not fit, the correct output of the cycle is a split proposal — not a bigger context.

## 3. Work: the dependency rule

Import only from other holons' contracts (R2). If progress requires reading another holon's implementation, that is a **seam finding**: the contract was insufficient. Record it in the logbook entry at close.

Every cycle ends in a valid outcome (R6). Never implement around a wrong spec — renegotiate: outcome (b).

## 4. Land: merge per the git flow

A cycle lands by merging its cycle-branch per [gitflow](gitflow.md); the logbook entry (§5) is committed on the branch before the merge. Gitflow defines which merges are mechanical and which are human-only — follow it exactly.

## 5. Close: log the cycle

A cycle is not done until logged (R9). Copy [logbook/TEMPLATE.md](logbook/TEMPLATE.md) to `logbook/NNNN-<slug>.md`, next number in sequence. Record the brief served — `n/a` for internally triggered cycles — so traceability runs brief → cycles → commits. Fill the failure-location and accounting fields honestly; they are the experiment.
