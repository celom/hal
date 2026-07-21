/**
 * Implementation — @hal/tickets-model (disposable, cycle 0002).
 *
 * Pure ticket domain: construction and the guarded lifecycle state machine.
 * No IO, no clock, no id generation — timestamps and ids are parameters.
 * Guard failures are returned values; nothing here throws for domain rules.
 */
import {
  TICKET_TRANSITIONS,
  type CanTransition,
  type CreateTicket,
  type TicketEvent,
  type TicketState,
  type Transition,
} from "../contract.ts";

const isDeclaredEdge = (from: TicketState, to: TicketState): boolean =>
  TICKET_TRANSITIONS.some(([f, t]) => f === from && t === to);

export const createTicket: CreateTicket = (params) => ({
  id: params.id,
  title: params.title,
  intent: params.intent ?? "",
  acceptanceCriteria: [...(params.acceptanceCriteria ?? [])],
  outcome: null,
  state: "draft",
  parentId: params.parentId ?? null,
  history: [{ at: params.at, type: "created" }],
  createdAt: params.at,
  updatedAt: params.at,
});

export const canTransition: CanTransition = (ticket, to, ctx) => {
  if (!isDeclaredEdge(ticket.state, to)) {
    return { code: "invalid_transition", from: ticket.state, to };
  }
  if (ticket.state === "draft" && to === "ready") {
    if (ticket.intent.trim().length === 0) {
      return { code: "missing_intent" };
    }
    if (ticket.acceptanceCriteria.length === 0) {
      return { code: "missing_acceptance_criteria" };
    }
  }
  if (to === "closed") {
    if (ctx.outcome === undefined) {
      return { code: "missing_outcome" };
    }
    if ((ctx.childStates ?? []).some((s) => s !== "closed")) {
      return { code: "open_children" };
    }
  }
  return null;
};

export const transition: Transition = (ticket, to, ctx) => {
  const error = canTransition(ticket, to, ctx);
  if (error !== null) {
    return { ok: false, error };
  }
  const event: TicketEvent = {
    at: ctx.at,
    type: "transition",
    from: ticket.state,
    to,
  };
  if (ctx.note !== undefined) {
    event.note = ctx.note;
  }
  return {
    ok: true,
    ticket: {
      ...ticket,
      state: to,
      // The guard above guarantees ctx.outcome is set whenever to === "closed".
      outcome: to === "closed" ? ctx.outcome! : ticket.outcome,
      acceptanceCriteria: [...ticket.acceptanceCriteria],
      history: [...ticket.history, event],
      updatedAt: ctx.at,
    },
  };
};
