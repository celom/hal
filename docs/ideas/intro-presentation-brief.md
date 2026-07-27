# Content brief — HAL introductory presentation

This brief specifies the content of an introductory presentation on HAL (Holonic Agentic Loop): the narrative order, each slide's single message, and the content elements each slide must carry. Visual language, layout, typography, and styling are the designer's decisions. The brief constrains structure, not rendering. It is self-contained: building the deck requires no other HAL document.

## Fixed parameters

These are decided. The deck must satisfy all of them.

- **Audience.** Engineering team.
- **Prior belief.** The audience already accepts that agentic development performs well on greenfield projects. No slide argues this; the deck states it once as shared ground and moves on.
- **Required outcome.** The audience leaves knowing exactly three things:
  1. The failure mode appears after the greenfield phase, when software must change.
  2. The cause is that agents hold context only for the duration of a session.
  3. HAL's response is to invert what is treated as durable — from code to a bundle of intent + contract + evals — carried by a unit called the holon.
- **Tone.** The diagnosis and the method are stated with confidence. The conditions the method depends on are stated alongside it. HAL is framed as a working practice that measures itself, not as a guaranteed solution. Plain declarative sentences; no hype vocabulary.

## Vocabulary discipline

Project-specific terms permitted on slides, each defined on the slide where it first appears: **holon, bundle, intent, contract, evals, implementation, durable, disposable, composition evals, renegotiation, cycle.**

Forbidden on slides: rule and default identifiers (R1, D1, and similar), the word "canon", internal file names, and note-taking or logging mechanics. Internal instrument names beyond the list above stay off slides; describe instruments in plain sentences instead. The speaker may use any vocabulary aloud.

**No numbers.** No performance claims, percentages, or cost figures anywhere in the deck. Cite only figures the logbook actually contains; a deck that leans on numbers invites an argument about the numbers instead of about the method.

## Through-line devices

Three devices recur across slides. The designer chooses how they look; the brief fixes what they mean.

1. **The two-layer code.** From slide 5 onward, every diagram distinguishes the durable layer (intent, contract, evals — human-owned) from the disposable layer (implementation — agent-owned). Establish one visual encoding for this distinction on slide 5 and reuse it unchanged on slides 6, 7, and 8. The encoding is the deck's central visual asset.
2. **Diagnosis vs method register.** Slides 2–4 are diagnosis; slides 5–9 are the method; slides 10–12 are evidence and ask. If the design marks sections at all, it marks these three, not the individual slides.
3. **The three-takeaway echo.** The three required-outcome statements appear once each as a slide's single message (slides 3, 4, 5–6) and reappear together, verbatim, on the closing slide. Nothing else in the deck is repeated.

## Slide sequence

Twelve slides. At ~2 minutes each this fills the 25-minute slot. Each entry gives the slide's single message (one sentence — the only claim the slide makes), the content elements it must carry, and where relevant, what stays spoken rather than shown.

### 1. Title

- **Message.** This is how software is delivered when agents do the building.
- **Elements.**
  - Statement: title — "HAL — Holonic Agentic Loop".
  - Statement: subtitle — one sentence positioning the session as an account of a method in use.

### 2. Shared ground

- **Message.** Agents build new software well; that is not in question today.
- **Elements.**
  - Statement: one sentence acknowledging the greenfield success the audience already believes.
- **Notes.** This slide exists only to set up the pivot on slide 3. No evidence, no examples. Ten seconds of speaking time.

### 3. The failure mode

- **Message.** The failure mode appears after the greenfield phase, when software must change. *(Takeaway 1.)*
- **Elements.**
  - Diagram: two phases of a software system's life — a build phase and a longer change phase (requirements shift, defects surface, parts are replaced). The diagram marks where agentic performance is established (build) and where it degrades (change).
  - Statement: change is where most of a system's life is spent; asserted as the ordinary experience of everyone in the room, without figures.
- **Notes.** Do not name causes yet. This slide locates the problem in time; slide 4 explains it.

### 4. The cause

- **Message.** The cause is that agents hold context only for a session. *(Takeaway 2.)*
- **Elements.**
  - Table: two columns contrasting the human developer and the agent as holders of knowledge about a system. Rows: how knowledge is acquired (accumulated over months of living in the codebase / assembled fresh per task); how long it persists (across the developer's tenure / until the session ends); where it lives between tasks (in the developer's head / nowhere).
  - Statement: traditional delivery process assumes a persistent knowledge-holder; agents remove that assumption, and the process built on it fails at change-time.
- **Notes.** The table must not read as a criticism of agents. The framing is structural: the process assumed something that is no longer true. Model quality is explicitly not the diagnosis; the speaker says so aloud.

### 5. The inversion

- **Message.** HAL's response is to invert what is treated as durable: the durable asset stops being code and becomes a bundle of intent, contract, and evals. *(Takeaway 3, first half.)*
- **Elements.**
  - Table: the durable/disposable split. Two rows. **Durable** — intent (why the piece exists: assertions, invariants, anti-goals), contract (its typed inputs and outputs), evals (executable acceptance checks — the only definition of done); owned and approved by humans. **Disposable** — the implementation; written by agents, regenerable at any time.
  - Statement: definition of **bundle** — the durable trio, intent + contract + evals; the implementation is never part of it.
- **Notes.** This slide is the centerpiece of the deck; the two-layer visual code is established here. If the audience remembers one image, it is this table.

### 6. The holon

- **Message.** The unit that carries a bundle is the holon: simultaneously a whole to its parts and a part to a larger whole. *(Takeaway 3, second half.)*
- **Elements.**
  - Statement: definition of **holon** as above, with the consequence spelled out: holons compose into holons, and contracts exist at every level, so "how big is a unit?" has no fixed answer — the pattern is the same at every scale.
  - Diagram: nested units, two or three levels deep. Each unit at each level shows the same four parts — bundle (three durable parts) plus implementation — rendered in the two-layer code. A composite holon's implementation is visibly its children plus glue, nothing more.
- **Notes.** The recursion claim matters to the engineering leads (it is the architecture story) and can be stated to the C-level audience in one sentence: the same structure describes a function, a service, and the whole system.

### 7. What the split promotes

- **Message.** Any implementation that passes a holon's evals, and the composition evals of every holon above it, is a valid replacement — so implementations are regenerated, not maintained.
- **Elements.**
  - Statement: definition of **composition evals** — a composite holon's evals, which exercise its children working together through its own contract.
  - Diagram: one holon with a fixed bundle and its implementation being swapped for a new one; the evals sit between bundle and implementation as the gate the replacement must pass.
  - Statement: the honest corollary, stated on the slide, not hidden — this only holds if the evals are good enough to carry it; a replacement that passes the evals but breaks the system means the evals were wrong and must be fixed. Eval quality is the load-bearing wall of the whole design.
- **Notes.** Placing the corollary here, at the moment of the strongest claim, is deliberate: it is the first appearance of the method-with-conditions tone and it preempts the room's sharpest technical objection.

### 8. The cycle

- **Message.** Work proceeds in cycles — one holon, one task at a time — and a cycle that discovers the spec is wrong has succeeded, not failed.
- **Elements.**
  - Diagram: the cycle as a loop. Start: run all evals; a failing eval outranks any new work and becomes the task. The cycle then ends in one of two outcomes: an **implementation** that passes the evals, or a **renegotiation** — a proposed change to the holon's own intent, contract, or evals, with rationale, escalated to the level above. Both paths route through a human approval step for any change to the durable layer, then loop back.
  - Statement: the division of labor — agents draft everything, including proposed evals; humans approve changes to the durable layer and do not write implementations.
- **Notes.** Renegotiation is the deck's answer to "what stops an agent from perfectly building the wrong thing"; the speaker makes that connection aloud. Retiring a holon nobody references anymore is also a reviewed cycle outcome; mention it aloud, keep it off the diagram.

### 9. What this is not

- **Message.** The individual ideas exist elsewhere; the claim is the combination, held together by measurement.
- **Elements.**
  - Table: three rows, two columns (adjacent practice / what it lacks). Spec-driven development — stops at spec-to-code; no replacement guarantee, no lifecycle, no measurement. Test-driven development — function-sized, human-paced, refactors rather than regenerates. Microservices — a runtime answer to an organizational problem; HAL is a development-time answer to a context problem, with no claim about deployment.
  - Statement: what HAL combines — enforced limits on how much context a task may need, the replacement guarantee from slide 7, evals-first steady state, and built-in measurement.
- **Notes.** This slide serves the engineering leads; keep the table terse enough that it does not lose the C-level audience. One minute maximum.

### 10. What keeps it honest

- **Message.** The method measures its own load-bearing conditions and revises itself when one stops holding.
- **Elements.**
  - Table: three rows, three columns (condition / how it would break / how it is measured). Row 1: evals are strong enough to carry replacement — breaks if regenerated implementations break things the evals never caught — measured by periodically regenerating a stable holon from its bundle alone and diffing behavior; every uncaught break is recorded and the eval is fixed. Row 2: reviewing the durable layer is much cheaper than writing implementations — breaks if approving evals costs as much as writing code, restoring the human bottleneck — measured by recording approval time against implementation time per cycle. Row 3: bundle authoring cost pays back — breaks if bundles are written once and never reused, making HAL pure overhead — measured by tracking authoring cost against cycles that reuse or regenerate bundles.
  - Statement: one additional measurement, kept out of the table because it generates findings rather than a pass/fail verdict — every failure is classified by where it lived: inside a holon, at a boundary between holons, or as a gap in the evals. If most failures start living at the boundaries, per-holon evals are no longer where the effort belongs and the method changes shape. Prior unit-based paradigms struggled at the boundaries; this is the instrument watching for it.
- **Notes.** No reassurance talk. The confidence of this slide comes from the instrumentation, not from optimism. This is the slide that earns the ask on slide 11.

### 11. The ask

- **Message.** The next project runs on HAL, instrumented from the first cycle.
- **Elements.**
  - List: what makes a project a good fit — real stakes (something we actually want built); expected requirements change (change is the phenomenon the method is built for); enough internal boundaries between parts to make the failure-location measurement meaningful; small enough for one human plus agents.
  - List: scope fence — no retrofit of existing systems, no tooling or orchestration built ahead of proven need, one cycle at a time.
  - Statement: the instruments run from cycle one, so the method's cost on our own work is visible rather than argued about.
- **Notes.** The scope fence keeps the ask concrete; give it equal visual weight to the fit criteria.

### 12. Close

- **Message.** Three sentences, nothing else.
- **Elements.**
  - Statement ×3, verbatim from the required outcome: the failure mode appears after the greenfield phase, when software must change; the cause is that agents hold context only for a session; HAL's response is to invert what is treated as durable — from code to a bundle of intent + contract + evals, carried by the holon.
- **Notes.** This slide stays up during discussion. No contact details, no links, no "questions?" header — the three sentences are the residue the session is designed to leave.

## Timing summary

| Section | Slides | Target time |
|---|---|---|
| Diagnosis | 1–4 | ~7 min |
| Method | 5–9 | ~11 min |
| Evidence and ask | 10–12 | ~7 min |

If the presentation runs long, slide 9 is the only candidate for compression; slides 3, 4, 5, 6, and 12 carry the required outcome and cannot be cut or merged.
