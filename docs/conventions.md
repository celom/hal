# Conventions — holons on disk

Suggestions, not prescriptions. Layout is a team choice: pick **nested** or **flat** per workspace and stay consistent. The holon catalog is not a suggestion; it is binding and lives in [indexing.md](indexing.md).

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

## Boundaries (R2 enforcement)

- **Import surface:** each holon's `package.json` `exports` exposes only `contract.ts` — deep imports into `src/` fail at resolution.
- **Reachability:** dependency-boundary lint rules + tags (`scope:auth`, `visibility:internal` on children) so:
  - only the parent may depend on its children;
  - outsiders may depend only on the parent's contract.
- Boundary enforcement is identical in both layouts — it rides on tags, not directories.
