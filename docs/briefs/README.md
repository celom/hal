# The Brief Log

One file per unit of external product intent, numbered sequentially: `NNNN-<slug>.md` (copy `TEMPLATE.md`). Every issue, feature request, and change request enters here (R11) — the source tool is never the canonical record.

The log is append-only. A brief is frozen at ingestion; a change request against shipped work is a new brief, never an edit. Product state is the fold over the log.

Ingestion lands the brief on `main` as a `brief(NNNN):` commit and creates `brief/NNNN-<slug>` off it. Status derives from branch state, never from the file:

- **building** — the brief-branch exists and is unmerged
- **accepted** — a human merged the brief-branch into `main` with all spawned cycles logged (R12)
- **blocked** — a renegotiation escalated past the root holon; the branch head is tagged `blocked/NNNN-<slug>` and never merges; resolution is a new brief, and the blocked brief stays in the log

Traceability: each logbook entry records the brief it serves — brief → cycles → commits.
