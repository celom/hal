# The Brief Log

One file per unit of external product intent, numbered sequentially: `NNNN-<slug>.md` (copy `TEMPLATE.md`). Every issue, feature request, and change request enters here (R11) — the source tool is never the canonical record.

The log is append-only. A brief is frozen at ingestion; a change request against shipped work is a new brief, never an edit. Product state is the fold over the log.

Ingestion appends the brief to the trunk and spawns the brief-branch. Status (building | accepted | blocked) derives from git, never from the file; the branches, merges, and derivation rules are defined in [../gitflow.md](../gitflow.md).

Traceability: each logbook entry records the brief it serves — brief → cycles → commits.
