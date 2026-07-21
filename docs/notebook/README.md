# The Cycle Notebook

One file per cycle, numbered sequentially: `NNNN-<slug>.md` (copy `TEMPLATE.md`). A cycle is not closed until its entry exists (R9). Drills and deletion reviews are cycles too.

This notebook is the experiment. Two instruments read from it:

- **Seam census** — the running ratio of failure locations:
  `grep -h "location:" docs/notebook/[0-9]*.md | sort | uniq -c`
- **Cycle accounting** — authoring/approval overhead vs implementation, and context consumed vs budget:
  `grep -h "accounting:" docs/notebook/[0-9]*.md`

Entry discipline: small, structured, honest. A perfectly green entry with nothing learned is a valid entry. An entry that hides a failure poisons the census.
