# Conventions — holons on disk

Suggestions, not prescriptions. Layout is a team choice: pick **nested** or **flat** per workspace and stay consistent.

## Mapping

- **holon = one package.** Discovery is glob-based (`packages/**`), so both layouts below work out of the box.
- The dependency graph is flat either way — hierarchy lives in approved files + boundary rules, not in the graph.

## Layout option A — nested (directory tree = holarchy)

- A parent holon hosts its children as subfolders:

  ```
  packages/
    auth/                ← root holon: a package (INTENT.md, contract.ts, evals/, src/)
      session/           ← child holon: its own package
      tokens/
        refresh/         ← grandchild: just another package
  ```

- **Parent code stays in `src/`; child roots are siblings of `src/`**, never inside it. A directory is either a package root or a container — not ambiguously both.
- Pros: holon co-location — a holon's bundle + `src/` + children are one path prefix, so R5 context loading is a trivial glob.
- Cons: nested package roots are a flaky corner of many workspace tools; needs the disjointness rule above.

## Layout option B — flat (hierarchy by naming + tags only)

- Every holon sits directly under `packages/`; hierarchy is expressed in names and tags:

  ```
  packages/
    auth/                ← root holon
    auth-session/        ← child holon
    auth-tokens-refresh/ ← grandchild
  ```

- Pros: zero nesting edge cases; simplest tooling story.
- Cons: holarchy is invisible in the filesystem — R5 bundle loading becomes a tag/name query instead of a path prefix.

## Naming (both layouts)

- Names are unique workspace-wide. Encode hierarchy in the name: `auth`, `auth-session`, `auth-tokens-refresh`.

## Indexing — the holon catalog

How the system (an agent, a session, a query) discovers existing holons and their intent without walking the codebase. Two customers from the canon: routing (R5's unstated step zero — *which* holon does this task belong to?) and orphan detection (R7's deletion-review trigger is a catalog query).

### Source of truth: `INTENT.md` frontmatter

Every `INTENT.md` opens with a frontmatter block:

```yaml
---
summary: <one line, ≤120 chars>
budget: 50000
---
```

- **`summary` is routing metadata, not documentation.** The test: an agent deciding whether this holon is relevant to a task must be able to decide from this line alone. Hard cap: one line, ≤120 characters. If it wants to grow, the growth belongs in the INTENT body.
- **No `name`, no `parent`, no `status` field — all derived.** Name = the package name; parent = the name minus its final segment (`auth-tokens-refresh` → `auth-tokens`); status = git (approved iff the file's last change landed in an `approve:` commit — D2). Declaring any of them in frontmatter would create a second source of truth that can drift.
- Frontmatter is part of `INTENT.md`, hence **durable**: it changes only via `approve:` commits, with the rest of the file.

### The index is a query, not a file

The catalog is never materialized — deriving it is one command, so a stored copy is drift risk with no payoff:

```sh
rg '^summary:' --no-heading -g 'INTENT.md' packages/
# path gives the holon name; parent = name minus its final segment;
# status comes from git (approve: commits — D2)
```

- **Fresh by construction.** No refresh ritual, nothing that can disagree with the INTENT files — the query output *is* the index.
- **R10 discipline:** when the query outgrows a one-liner (parent columns, orphan detection), it becomes a small script run on demand — still no stored artifact. Materialize a file only when reading the durable layer live becomes a *measured* context or cost problem.
- **Orphan detection (R7)** is the same posture: a query run at cycle close (which holon names appear in no parent's children?); findings go into the notebook entry, not a stored file.

### Use in the Loop

- Run the index query at session start to route the task to a holon; its output counts toward the context budget (it should cost ~1% of B).
- **Routing failures are findings.** If a task is routed to the wrong holon *from the index output alone*, record it in the cycle's notebook entry. If these accumulate, that is evidence the failure-location taxonomy (in-holon | seam | eval-escape) needs a fourth category — an R9 revision with citations.

## Boundaries (R2 enforcement)

- **Import surface:** each holon's `package.json` `exports` exposes only `contract.ts` — deep imports into `src/` fail at resolution.
- **Reachability:** dependency-boundary lint rules + tags (`scope:auth`, `visibility:internal` on children) so:
  - only the parent may depend on its children;
  - outsiders may depend only on the parent's contract.
- Boundary enforcement is identical in both layouts — it rides on tags, not directories.
