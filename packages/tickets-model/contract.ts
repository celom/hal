/**
 * Contract — @hal/tickets-model
 *
 * Pure ticket domain: types, guarded lifecycle state machine, invariants.
 * No IO, no clock, no id generation — timestamps and ids are parameters.
 * Guard failures are returned values, never exceptions.
 */

// ---------------------------------------------------------------------------
// Core types
// ---------------------------------------------------------------------------

/** Lifecycle states. Edges: draft→ready, ready→in_progress, in_progress→closed, in_progress→ready (backout). */
export type TicketState = "draft" | "ready" | "in_progress" | "closed";

/** HAL-shaped cycle outcome; required to close a ticket. */
export type TicketOutcome = "impl" | "renegotiation";

/** Append-only history entry. `from`/`to` are present iff type is "transition". */
export interface TicketEvent {
  at: string; // ISO-8601
  type: "created" | "transition";
  from?: TicketState;
  to?: TicketState;
  note?: string;
}

export interface Ticket {
  /** Store-assigned, sequential: `T-<n>`. The model never generates ids. */
  id: string;
  title: string;
  /** Why this ticket exists. Must be non-empty before draft→ready. */
  intent: string;
  /** Definition of done. Must have ≥1 entry before draft→ready. */
  acceptanceCriteria: string[];
  /** Set on in_progress→closed; null until then. */
  outcome: TicketOutcome | null;
  state: TicketState;
  /** Explicit nesting; null for root tickets. */
  parentId: string | null;
  /** Append-only event log; starts with one "created" event. */
  history: TicketEvent[];
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

/** The complete edge set. Anything not listed is invalid_transition. */
export const TICKET_TRANSITIONS: ReadonlyArray<
  readonly [from: TicketState, to: TicketState]
> = [
  ["draft", "ready"],
  ["ready", "in_progress"],
  ["in_progress", "closed"],
  ["in_progress", "ready"], // backout
];

/** Guard failures — values, not exceptions. */
export type TransitionError =
  | { code: "invalid_transition"; from: TicketState; to: TicketState }
  | { code: "missing_intent" } // draft→ready with empty/blank intent
  | { code: "missing_acceptance_criteria" } // draft→ready with no criteria
  | { code: "missing_outcome" } // in_progress→closed without an outcome
  | { code: "open_children" }; // closing while any supplied child state ≠ "closed"

/** Caller-supplied facts the pure guards need. */
export interface TransitionContext {
  /** Timestamp for the transition; stamps `updatedAt` and the history event. */
  at: string;
  /** Required when `to` is "closed". */
  outcome?: TicketOutcome;
  /** Optional note recorded on the history event. */
  note?: string;
  /**
   * States of the ticket's children, supplied by whoever holds them
   * (store/composite). Closing requires every entry to be "closed".
   * Omitted or empty means "no children" — the guard passes.
   */
  childStates?: readonly TicketState[];
}

export type TransitionResult =
  | { ok: true; ticket: Ticket }
  | { ok: false; error: TransitionError };

// ---------------------------------------------------------------------------
// Construction
// ---------------------------------------------------------------------------

export interface CreateTicketParams {
  id: string;
  title: string;
  intent?: string; // default ""
  acceptanceCriteria?: string[]; // default []
  parentId?: string | null; // default null
  at: string; // ISO-8601; becomes createdAt, updatedAt, and the "created" event's at
}

// ---------------------------------------------------------------------------
// Entry-point signatures (durable)
// ---------------------------------------------------------------------------

/** New ticket in "draft" with outcome null and a single "created" event. */
export type CreateTicket = (params: CreateTicketParams) => Ticket;

/** Pure guard check; null means the transition would succeed. */
export type CanTransition = (
  ticket: Ticket,
  to: TicketState,
  ctx: TransitionContext,
) => TransitionError | null;

/**
 * Never mutates its input. On ok: fresh ticket with the new state,
 * updatedAt = ctx.at, exactly one appended "transition" event, and
 * outcome set when closing.
 */
export type Transition = (
  ticket: Ticket,
  to: TicketState,
  ctx: TransitionContext,
) => TransitionResult;

// Binding: this durable line decides where the entry points live;
// what's behind it is disposable (impl cycle 0002+).
export { createTicket, canTransition, transition } from "./src/index.ts";
