# The Cycle Logbook

One file per cycle (R9), numbered sequentially: `NNNN-<slug>.md` (copy `TEMPLATE.md`). Drills and deletion reviews are cycles too.

This logbook is the experiment. Two instruments read from it:

- **Seam census** — the running ratio of failure locations:
  `grep -h "location:" docs/logbook/[0-9]*.md | sort | uniq -c`
- **Cycle accounting** — authoring/approval overhead vs implementation, and context consumed vs budget:
  `grep -h "accounting:" docs/logbook/[0-9]*.md`

Entry discipline: small, structured, honest. A perfectly green entry with nothing learned is a valid entry. An entry that hides a failure poisons the census.
