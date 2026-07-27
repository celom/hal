# Indexing — the holon catalog

Binding. How an agent, session, or query discovers existing holons and their intent without walking the codebase. Two customers: routing (R5's unstated step zero — *which* holon does a task belong to?) and orphan detection (R7's deletion-review trigger is a catalog query).

## Source of truth: `INTENT.md` frontmatter

Every `INTENT.md` opens with a frontmatter block:

```yaml
---
summary: <one line, ≤120 chars>
budget: 50000
---
```

- **`summary` is routing metadata, not documentation.** The test: an agent deciding whether this holon is relevant to a task must be able to decide from this line alone. Hard cap: one line, ≤120 characters. If it wants to grow, the growth belongs in the INTENT body.
- **No `name`, no `parent`, no `status` field — all derived.** Name = the package name; parent = the name minus its final segment (`auth-tokens-refresh` → `auth-tokens`); status = git (R13, [gitflow.md](gitflow.md)).
- Frontmatter is part of `INTENT.md`, hence **durable**: it changes only through the git flow, with the rest of the file.

## The index is a query, not a file

The catalog is never materialized — deriving it is one command, so a stored copy is drift risk with no payoff:

```sh
rg '^summary:' --no-heading -g 'INTENT.md' packages/
# path gives the holon name; parent = name minus its final segment;
# status comes from git (gitflow.md)
```

- **Fresh by construction.** No refresh ritual, nothing that can disagree with the INTENT files — the query output *is* the index.
- **R10 discipline:** when the query outgrows a one-liner (parent columns, orphan detection), it becomes a small script run on demand — still no stored artifact. Materialize a file only when reading the durable layer live becomes a *measured* context or cost problem.
- **Orphan detection (R7)** is the same posture: a query run at cycle close (which holon names appear in no parent's children?); findings go into the logbook entry, not a stored file.

## Use

- Run the index query at session start to route the task to a holon ([loop.md](loop.md), "Route"); its output counts toward the context budget (it should cost ~1% of the budget).
- **Routing failures are findings.** If a task is routed to the wrong holon *from the index output alone*, record it in the cycle's logbook entry. If these accumulate, that is evidence the failure-location taxonomy (in-holon | seam | eval-escape) needs a fourth category — an R9 revision with citations.
