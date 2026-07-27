# Holons on disk — layout and catalog

How the four elements ([canon](canon.md), R1) map to files, and how holons are discovered. The layout sections are suggestions — pick one per workspace and stay consistent. The catalog section is binding.

## Element mapping

holon = one package:

```
packages/<name>/
  INTENT.md         Durable. Opens with catalog frontmatter (below).
  contract.ts       Durable. Sole importable surface: types and schemas only.
  evals/            Durable. Executable correctness proof; composition evals
                    per composite.
  src/              Disposable. Implementation; for composites, orchestration
                    and glue.
```

Every holon exposes an `evals` target; workspace-level `evals` runs all. Discovery is glob-based (`packages/**`), so both layouts below work. The dependency graph is flat either way — hierarchy lives in approved files and boundary rules, not in the graph.

## Layout A — nested (directory tree = holarchy)

A parent hosts its children as sibling directories of its `src/`:

```
packages/
  auth/                ← root holon
    session/           ← child holon: its own package
    tokens/
      refresh/         ← grandchild
```

A directory is either a package root or a container — never both. Parent = the containing package. Pro: a holon's bundle, `src/`, and children share one path prefix, so R5 context loading is a glob. Con: nested package roots are a flaky corner of many workspace tools.

## Layout B — flat (hierarchy by naming)

Every holon sits directly under `packages/`:

```
packages/
  auth/                ← root holon
  auth-session/        ← child holon
  auth-tokens-refresh/ ← grandchild
```

Parent = the name minus its final segment. Pro: no nesting edge cases. Con: the holarchy is invisible in the filesystem — bundle loading becomes a name query.

## Naming and boundaries (both layouts)

- Names are unique workspace-wide and encode hierarchy: `auth`, `auth-session`, `auth-tokens-refresh`.
- **Import surface (R2)**: each holon's `package.json` `exports` exposes only `contract.ts`; deep imports into `src/` fail at resolution.
- **Reachability**: dependency-boundary lint rules and tags (`scope:auth`, `visibility:internal`) so only the parent may depend on its children, and outsiders only on the parent's contract. Enforcement rides on tags, not directories — identical in both layouts.

## Catalog (binding)

How an agent discovers existing holons without walking the codebase. Two customers: routing (which holon does a task belong to — [loop](loop.md), "Route") and orphan detection (R7's deletion-review trigger).

Every `INTENT.md` opens with:

```yaml
---
summary: <one line, ≤120 chars>
budget: 50000
---
```

- `summary` is routing metadata: an agent must be able to decide relevance from this line alone. Hard cap one line, ≤120 characters; growth belongs in the INTENT body.
- No `name`, `parent`, or `status` field — all derived. Name = package name; parent = per layout above; status = git ([gitflow](gitflow.md), R13).
- Frontmatter is part of `INTENT.md`, hence durable: it changes only through the git flow.

The catalog is a query, never a materialized file — a stored copy is drift risk with no payoff:

```sh
rg '^summary:' --no-heading -g 'INTENT.md' packages/
```

- Run it at cycle open to route the task; its output counts toward the context budget (~1% of budget).
- When the query outgrows a one-liner (parent columns, orphan detection), it becomes a small on-demand script — still no stored artifact (R10). Materialize a file only when live derivation becomes a measured cost problem.
- Orphan detection is the same posture: a query at cycle close; findings go into the logbook entry.
- **Routing failures are findings.** If the index output alone routes a task to the wrong holon, record it in the logbook entry.
