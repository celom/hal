/**
 * Evals — @hal/tickets-model
 * Executable definition of done (R1). Drafted in cycle 0001; expected red
 * until the model's impl cycle. Wired as an Nx `evals` target in that cycle.
 */
import { describe, expect, test } from "bun:test";
import {
  canTransition,
  createTicket,
  transition,
  TICKET_TRANSITIONS,
  type Ticket,
} from "@hal/tickets-model";

const T0 = "2026-01-01T00:00:00.000Z";
const T1 = "2026-01-02T00:00:00.000Z";

function readyTicket(): Ticket {
  return createTicket({
    id: "T-1",
    title: "A ticket",
    intent: "because reasons",
    acceptanceCriteria: ["it works"],
    at: T0,
  });
}

function at(state: Ticket["state"]): Ticket {
  // Walk a fully guarded ticket to the requested state through real transitions.
  let t = readyTicket();
  const walk: Array<Ticket["state"]> =
    state === "draft"
      ? []
      : state === "ready"
        ? ["ready"]
        : state === "in_progress"
          ? ["ready", "in_progress"]
          : ["ready", "in_progress", "closed"];
  for (const to of walk) {
    const r = transition(t, to, { at: T1, outcome: to === "closed" ? "impl" : undefined });
    if (!r.ok) throw new Error(`setup walk failed at →${to}: ${r.error.code}`);
    t = r.ticket;
  }
  return t;
}

describe("createTicket", () => {
  test("creates a draft with defaults and a single created event", () => {
    const t = createTicket({ id: "T-7", title: "t", at: T0 });
    expect(t.id).toBe("T-7");
    expect(t.state).toBe("draft");
    expect(t.intent).toBe("");
    expect(t.acceptanceCriteria).toEqual([]);
    expect(t.outcome).toBeNull();
    expect(t.parentId).toBeNull();
    expect(t.createdAt).toBe(T0);
    expect(t.updatedAt).toBe(T0);
    expect(t.history).toEqual([{ at: T0, type: "created" }]);
  });

  test("keeps supplied intent, criteria, parentId", () => {
    const t = createTicket({
      id: "T-8",
      title: "child",
      intent: "why",
      acceptanceCriteria: ["a", "b"],
      parentId: "T-7",
      at: T0,
    });
    expect(t.intent).toBe("why");
    expect(t.acceptanceCriteria).toEqual(["a", "b"]);
    expect(t.parentId).toBe("T-7");
  });
});

describe("edge set", () => {
  test("only the four declared edges are valid on fully guarded tickets", () => {
    const states: Array<Ticket["state"]> = ["draft", "ready", "in_progress", "closed"];
    for (const from of states) {
      for (const to of states) {
        const declared = TICKET_TRANSITIONS.some(([f, t]) => f === from && t === to);
        const err = canTransition(at(from), to, { at: T1, outcome: "impl" });
        if (declared) expect(err).toBeNull();
        else expect(err).toEqual({ code: "invalid_transition", from, to });
      }
    }
  });
});

describe("guards", () => {
  test("draft→ready requires non-empty intent", () => {
    const t = createTicket({ id: "T-1", title: "t", acceptanceCriteria: ["x"], at: T0 });
    expect(canTransition(t, "ready", { at: T1 })).toEqual({ code: "missing_intent" });
    const blank = createTicket({ id: "T-1", title: "t", intent: "   ", acceptanceCriteria: ["x"], at: T0 });
    expect(canTransition(blank, "ready", { at: T1 })).toEqual({ code: "missing_intent" });
  });

  test("draft→ready requires ≥1 acceptance criterion", () => {
    const t = createTicket({ id: "T-1", title: "t", intent: "why", at: T0 });
    expect(canTransition(t, "ready", { at: T1 })).toEqual({ code: "missing_acceptance_criteria" });
  });

  test("in_progress→closed requires an outcome", () => {
    const t = at("in_progress");
    const r = transition(t, "closed", { at: T1 });
    expect(r).toEqual({ ok: false, error: { code: "missing_outcome" } });
  });

  test("closing with open children is rejected; all-closed children pass", () => {
    const t = at("in_progress");
    const rejected = transition(t, "closed", {
      at: T1,
      outcome: "impl",
      childStates: ["closed", "in_progress"],
    });
    expect(rejected).toEqual({ ok: false, error: { code: "open_children" } });

    const accepted = transition(t, "closed", {
      at: T1,
      outcome: "renegotiation",
      childStates: ["closed", "closed"],
    });
    expect(accepted.ok).toBe(true);
  });
});

describe("transition results", () => {
  test("success returns a fresh ticket; input is not mutated", () => {
    const before = at("draft");
    const snapshot = structuredClone(before);
    const r = transition(before, "ready", { at: T1 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.ticket).not.toBe(before);
    expect(before).toEqual(snapshot);
    expect(r.ticket.state).toBe("ready");
    expect(r.ticket.updatedAt).toBe(T1);
  });

  test("each success appends exactly one transition event with from/to/note", () => {
    const t = at("ready");
    const r = transition(t, "in_progress", { at: T1, note: "picked up" });
    if (!r.ok) throw new Error(r.error.code);
    expect(r.ticket.history.length).toBe(t.history.length + 1);
    expect(r.ticket.history.at(-1)).toEqual({
      at: T1,
      type: "transition",
      from: "ready",
      to: "in_progress",
      note: "picked up",
    });
  });

  test("backout in_progress→ready works and preserves outcome null", () => {
    const r = transition(at("in_progress"), "ready", { at: T1 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.ticket.state).toBe("ready");
    expect(r.ticket.outcome).toBeNull();
  });

  test("closing sets the outcome; closed tickets always carry one", () => {
    const r = transition(at("in_progress"), "closed", { at: T1, outcome: "renegotiation" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.ticket.state).toBe("closed");
    expect(r.ticket.outcome).toBe("renegotiation");
  });

  test("failure returns the error as a value and never throws", () => {
    const t = at("closed");
    expect(() => transition(t, "draft", { at: T1 })).not.toThrow();
    const r = transition(t, "draft", { at: T1 });
    expect(r.ok).toBe(false);
  });
});
