# The Brief Log

One file per unit of external product intent, numbered sequentially: `NNNN-<slug>.md` (copy `TEMPLATE.md`). Every issue, feature request, and change request enters here (R11) — the source tool is never the canonical record.

The log is append-only. A brief is frozen at ingestion; a change request against shipped work is a new brief, never an edit. Product state is the fold over the log.

Status derives from git, never from the file:

- **draft** — last change did not land in an `approve:` commit
- **open** — landed via `approve:`, no `accept(NNNN):` commit yet
- **accepted** — closed by a human `accept(NNNN):` commit with all spawned cycles logged (R12)
- **blocked** — a renegotiation escalated past the root holon; resolution is a new brief, and the blocked brief stays in the log

Traceability: each logbook entry records the brief it serves — brief → cycles → commits.
