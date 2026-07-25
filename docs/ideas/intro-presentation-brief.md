# Designer Brief — "HAL: An Introduction" presentation

## What this document is

A content brief for building an introductory presentation on HAL (Holonic Agentic Loop). It specifies the narrative, the per-slide messages, and the content elements each slide must carry. Visual language, layout, and styling are the designer's call — this brief only constrains *what* each slide says and *what kind* of element carries it (table, diagram, statement, list).

## Context and audience

- **Occasion:** a single introductory session, ~25 minutes plus discussion.
- **Audience:** mixed — engineering leads and C-level stakeholders in the same room. Every slide must survive both readings: technically credible to the leads, decision-relevant to the executives. Two slides near the end deliberately address one group each (slides 9 and 10).
- **What the audience already believes:** agentic (AI-driven) software development works impressively on new projects. No slide should spend time proving that.
- **What the presentation must land:** the failure mode appears *after* the greenfield, when software must change; the cause is that agents are ephemeral context-holders; HAL's answer is to invert what is treated as durable — from code to a bundle of intent + contract + evals — carried by a unit called the **holon**.
- **What this presentation is NOT:** a methodology deep-dive, a tooling pitch, or an adoption mandate. It introduces one concept and ends with a concrete, modest ask (a pilot). Internal rule numbers (R1–R10, D1–D4) from HAL's canon must not appear on slides — translate them into plain statements.

## Tone

Confident diagnosis, honest proposal. HAL is framed as a **falsifiable experiment with instruments**, not a silver bullet — for this audience, the ability to say "here is how we'd know if this is wrong" is a credibility asset. Avoid hype vocabulary ("revolutionary", "10x"). Prefer plain declarative sentences.

## The through-line device

One concrete change request, introduced on slide 1 and resolved on slide 8, traced through both worlds. Suggested scenario (final wording flexible, shape fixed):

> *Six months after launch, a business rule changes: "invoices over €10k now require a second approval." The change touches the API, the approval workflow, the UI, and a notification integration.*

Slide 1 shows this request entering a conventional agent-built codebase and going wrong. Slide 8 shows the same request entering a HAL codebase and going right. The scenario should be visually recognizable when it returns — same framing, different outcome.

## Narrative arc

Three acts:

- **Act I — The problem (slides 1–3):** agentic development degrades after the greenfield; the cause is ephemeral context, and the deepest casualty is intent.
- **Act II — The idea (slides 4–7):** the durable/disposable inversion, the holon as its unit, composition through contracts, replaceability as the payoff. This is the conceptual core — roughly half the talk's weight.
- **Act III — What it means (slides 8–12):** the change request resolved, one slide per audience, pre-emptive differentiation, honest close with the ask.

Slide 4 is the hinge of the entire presentation. If the audience remembers one image, it must be the durable/disposable table.

---

## Slide-by-slide

### 1 — Cold open: the day-2 problem

- **Beat:** disarm, then puncture. "The demo was real. The demo is not the product."
- **Key message:** agentic development shines on greenfield; the product is the next two years of change, and that is where it degrades.
- **Content elements:**
  - A short framing statement acknowledging greenfield success (one sentence, no hedging).
  - The change-request scenario, introduced as a concrete card/ticket the audience will see again.
  - A contrast: what the agent did brilliantly at month zero vs. what happens when the change request arrives at month six (subtle regressions, violated assumptions nobody wrote down, changes that pass tests and still break the business rule).
- **Visual concept:** a timeline from greenfield to month six, with the change request landing at the far end. The scenario card should be a reusable visual element (returns on slide 8).

### 2 — Diagnosis: the ephemeral context-holder

- **Beat:** name the real cause, not the symptom.
- **Key message:** traditional SDLC is a process wrapped around a *persistent* context-holder — the human developer who accumulates horizontal knowledge over months. Agents invert this: context is assembled vertically per task, then discarded.
- **Content elements:**
  - Two contrasted profiles: **human developer** — deep horizontal spread, accumulated slowly, walks out the door when they leave; **agent** — deep vertical slice, assembled per session, gone at session end.
  - The two casualties of missing horizontal context, named separately: **impact** (what breaks if this changes — partially recoverable from code and tests) and **intent** (why it is this way, what must stay true — not recoverable at all).
  - Callback: this is *why* the slide-1 change went wrong.
- **Visual concept:** a vertical-vs-horizontal contrast diagram over a codebase. Keep the impact/intent distinction typographically prominent — slide 3 zooms into intent.

### 3 — Intent is the casualty

- **Beat:** the sharpest problem statement in the deck; also the burial of current workarounds.
- **Key message:** code records decisions, not reasons. Intent today lives in heads, chat threads, and PR descriptions — it is ephemeral by construction. Current context strategies re-inject it from the outside, per session, and drift.
- **Content elements:**
  - The line "code records decisions, not reasons" (or equivalent) as the anchor statement.
  - An inventory of where intent lives today: people's heads, Slack/chat threads, PR descriptions, tribal memory, stale docs — each labeled with how it decays (person leaves, thread scrolls away, doc drifts).
  - A survey of current bundling strategies — rules files (e.g. CLAUDE.md), RAG over docs, agent memory, spec documents — framed fairly but firmly: all inject context from *outside the deliverable*, per-session, with no guarantee of staying true to the code they describe. They patch the symptom.
- **Visual concept:** two groups — "where intent lives" (decaying) and "how we currently compensate" (external, drifting). The designer should make "outside the deliverable" spatially literal, setting up slide 5's "travels with the deliverable."

### 4 — The inversion (THE HINGE SLIDE)

- **Beat:** the single takeaway. Slow down; this slide gets the most airtime per element.
- **Key message:** HAL's prime axiom — flip what is treated as durable. Today code is the asset and intent is exhaust. HAL makes intent, contract, and evals the durable, human-owned asset, and the implementation disposable and agent-owned.
- **Content elements:** the table, essentially verbatim, as the dominant element:

  | Layer | Contents | Owner |
  |---|---|---|
  | **Durable** | intent, contract, evals | human-owned (approved) |
  | **Disposable** | implementation | agent-owned (regenerable) |

  - One supporting line beneath it: when the context-holder becomes ephemeral, durable knowledge must move out of heads and tangled code and into the deliverable itself.
  - Brief gloss of the trio, one phrase each: intent = the *why* (assertions, invariants, anti-goals); contract = the *shape* (typed inputs/outputs); evals = the *proof* (executable definition of done).
- **Visual concept:** the table is the slide. Nothing competes with it. The intent/contract/evals glosses may be secondary annotations.
- **Guardrail:** do not let this slide read as "write better specs." The evals row is what separates HAL from spec-writing — durability is enforced by executable proof, not by documentation discipline. If the slide can be misread as "documentation matters," it has failed.

### 5 — The holon

- **Beat:** introduce the unit that makes the inversion practical; the concept the presentation is named for.
- **Key message:** a holon is simultaneously a whole to its parts and a part to a larger whole. Every holon ships a four-part bundle, so all the context an agent needs travels *with* the deliverable — nothing is reassembled from outside.
- **Content elements:**
  - Definition of holon (Koestler's term), with one non-software analogy for the mixed audience: a cell is a whole, and part of a tissue, which is part of an organ, which is part of a body.
  - The four-part anatomy: **INTENT** (why it exists: assertions, invariants, anti-goals — written for an agent reader), **CONTRACT** (the only importable surface: types and schemas), **EVALS** (executable acceptance — the *only* definition of done), **IMPL** (the disposable implementation). First three durable, fourth disposable — carry slide 4's durable/disposable distinction forward visually.
  - The consequence, stated plainly: any piece of the system is understandable, buildable, and replaceable within a single agent session, with no reliance on accumulated memory.
- **Visual concept:** an anatomy diagram of one holon (four labeled parts, durable trio visually grouped apart from IMPL) plus a small nesting motif (holons within holons) that slide 6 expands.

### 6 — Composition and seams

- **Beat:** answer the horizontal-context problem raised in Act I.
- **Key message:** holons compose into holons; dependencies flow through contracts only, never through implementations; contracts exist at every level. Impact is therefore bounded by contract surfaces, and a parent's evals exercise its children *together* — the seams are tested, not assumed.
- **Content elements:**
  - Statement: a holon may depend on another holon's contract, never its implementation.
  - Statement: a composite holon's implementation *is* its children plus glue; its evals are composition evals exercising the children through its own contract.
  - The payoff for the day-2 problem, explicit: "what breaks if I change this?" stops being archaeology — the blast radius of a change is its contract surface.
- **Visual concept:** a nested/recursive diagram — holons inside holons, dependency arrows terminating at contract boundaries (never reaching inside), composition evals shown wrapping each parent. This is the deck's most structurally demanding diagram; recursion (same shape at every scale) is the point.

### 7 — Replaceability

- **Beat:** the punchline of the axiom — where "disposable code" stops sounding reckless.
- **Key message:** any implementation that passes the holon's evals plus every ancestor's composition evals is a valid replacement. Disposability is not carelessness — it is a *verifiable property*.
- **Content elements:**
  - The replaceability statement, prominent.
  - The corollary, which lands the honesty theme early: if a valid replacement breaks the system, the *evals* were wrong — fix the evals, log the escape. (The system is designed to catch its own gaps.)
  - One sentence naming the hardest part candidly: the load-bearing wall of this whole approach is writing evals good enough to carry that guarantee.
- **Visual concept:** one holon with its implementation swapped out while the durable trio stays fixed — before/after or swap motif. The durable parts visually unchanged; only IMPL differs.

### 8 — The change request, revisited

- **Beat:** resolution of the through-line; the emotional payoff.
- **Key message:** the same month-six change request, in a HAL codebase, becomes a bounded, verifiable cycle instead of archaeology.
- **Content elements:** the scenario card from slide 1 returns, then a short walk through the loop:
  1. Run all evals first — any red eval outranks new work (the system's steady state is verified before touching anything).
  2. The change localizes to identifiable holons; impact is read off contract surfaces, not discovered in production.
  3. Intent files say what must stay true, so the agent knows the *reasons*, not just the code.
  4. Implementations are regenerated or modified; green evals — including parents' composition evals — are the definition of done.
  5. **Renegotiation is a success outcome:** if the agent discovers the requested change conflicts with an existing contract or intent, surfacing "the spec is wrong" to a human is the system *working*. Humans approve every change to the durable layer.
- **Visual concept:** the loop as a cycle diagram (evals → work → outcome → human approval → logged), with the scenario card flowing through it. Mirror slide 1's composition so the contrast is legible at a glance.

### 9 — For engineering leads: the discipline

- **Beat:** "there's real mechanics here" — credibility for the technical half of the room. Deliberately light; this is the trailer for a deep-dive session.
- **Key message:** HAL is a small set of hard, falsifiable rules — not a framework, not tooling. Convention precedes automation.
- **Content elements — four discipline statements, one line each:**
  - **Context budgets:** every holon must be workable within a declared token budget; exceeding it forces a split. Size measured in cognition, not lines.
  - **Contracts only:** cross-holon dependencies go through contracts, never implementations — mechanically enforceable.
  - **Evals are the only definition of done:** green evals merge; nothing else does.
  - **Humans review, agents labor:** agents draft everything (including proposed evals); humans approve changes to the durable layer and write no implementations.
  - Closing line: no tooling before convention — rules are proven by manual adherence before anything gets automated.
- **Visual concept:** a compact rule card / list. Restraint is the message: it should look like a discipline, not a product.

### 10 — For the C-level: what the organization owns

- **Beat:** the asset framing; the slide the executives take to their next meeting.
- **Key message:** today the organization owns code it cannot cheaply change, dependent on context in the heads of people who leave. Under HAL it owns intent and verification — durable, reviewable assets — and implementations become regenerable.
- **Content elements:**
  - The ownership contrast (today vs. under HAL), as a two-column or before/after statement.
  - The labor shift: human effort moves from writing implementations to reviewing and approving the durable layer — the human becomes the checkpoint, not the bottleneck.
  - Honest cost line: the methodology has real overhead (authoring intent, contracts, and evals), and that overhead is *measured*, not assumed away — cycle accounting prices it. This sentence buys credibility for everything else on the slide.
- **Visual concept:** ownership before/after. Avoid ROI theatrics or invented percentages — there are no numbers yet, and faking them would poison slide 12.

### 11 — "Isn't this just…?"

- **Beat:** pre-empt the three objections the technical audience is already forming.
- **Key message:** the pieces float around; the claim is the composition.
- **Content elements — three named comparisons, one dismissal each:**
  - **Spec-driven development:** stops at spec→code — no replaceability invariant, no lifecycle, no measurement.
  - **TDD:** function-grain, human-paced, refactor-not-regenerate.
  - **Microservices:** a *runtime* answer to an organizational problem; HAL is a *dev-time* answer to a context problem. Holons are units of regeneration, not deployment.
  - The composite claim, stated once: enforceable context budgets + a regeneration invariant + an evals-first steady state + built-in falsification. Individually familiar; together, new.
- **Visual concept:** three comparison rows plus a distinct composite statement. The composite must read as the point of the slide, not a footnote.

### 12 — The honest close, and the ask

- **Beat:** land the credibility position and convert it into a decision.
- **Key message:** HAL is an experiment designed to win either way — a working methodology, or a sharp, well-instrumented post-mortem. The ask is a pilot.
- **Content elements:**
  - The three dealbreaker assumptions, stated as testable claims: (1) evals can be made load-bearing at affordable cost; (2) approving the durable layer is much cheaper than writing implementations; (3) bundle-authoring cost amortizes across regeneration.
  - The instruments that test them, one line each: a **cycle notebook** (every unit of work logged, with honest accounting), a **seam census** (where do failures actually live — inside units, at seams, or past the evals?), and **disposability drills** (periodically regenerate a stable holon blind from its bundle alone; anything that breaks uncaught is a measured gap).
  - The ask: one pilot project. Selection criteria: real stakes, expected requirements churn, enough seams to be meaningful (UI + API + persistence + one external integration), small enough for one human plus agents.
  - Closing sentence, honesty as strength: "If the first drill breaks something the evals didn't catch, that's not the experiment failing — that's the experiment *reporting*."
- **Visual concept:** assumptions paired with their instruments (claim → how we test it), then the ask isolated as the final element. The last thing on screen should be the ask, not the risks.

---

## Global content rules

1. **Vocabulary discipline.** Terms used on slides: *holon, bundle, intent, contract, evals, implementation, durable, disposable, composition evals, renegotiation, cycle, pilot*. Terms that must NOT appear: rule/default numbers (R1…, D1…), "canon", "notebook entry" mechanics, internal file names (`INTENT.md`, `contract.ts`) — the four bundle parts appear by plain name (intent, contract, evals, implementation), not as file paths.
2. **The table on slide 4 is sacred.** Its wording may be lightly edited for typography but its structure (two layers × contents × owner) must survive intact. It is the artifact the audience should photograph.
3. **Numbers.** The deck contains no performance claims, percentages, or cost figures — none exist yet, and the close explicitly promises measurement. Any invented number undermines slide 12.
4. **Recurring elements.** The change-request card (slides 1 → 8) and the durable/disposable color- or shape-coding (slides 4 → 5 → 7 → 10) are the two continuity systems; the designer should treat both as first-class.
5. **Speaker-notes split.** Where a slide lists multiple statements (6, 9, 11, 12), on-slide text carries the short form; the elaborations in this brief go to speaker notes, not the slide.
