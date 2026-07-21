/**
 * Contract — @hal/tickets (root composite)
 *
 * The TicketService façade over the model/store/cli children, plus
 * re-exported core types. Consumers of the ticket domain import this
 * contract and nothing else (R2). Glue implementation arrives in the
 * composite's glue cycle; the children are the real implementation (R5).
 */
import type {
  Ticket,
  TicketEvent,
  TicketOutcome,
  TicketState,
  TransitionError,
  TransitionResult,
} from "@hal/tickets-model";
import type { CreateTicketInput, ListFilter, StoreError, StoreResult } from "@hal/tickets-store";

// Core types, re-exported so consumers never need the children directly.
export type {
  Ticket,
  TicketEvent,
  TicketOutcome,
  TicketState,
  TransitionError,
  TransitionResult,
  CreateTicketInput,
  ListFilter,
  StoreError,
  StoreResult,
};

// ---------------------------------------------------------------------------
// The façade
// ---------------------------------------------------------------------------

/** Any failure a service call can return — always a value, never an exception. */
export type ServiceError = TransitionError | StoreError;
export type ServiceResult<T> = { ok: true; value: T } | { ok: false; error: ServiceError };

export interface TransitionOptions {
  /** Required when `to` is "closed". */
  outcome?: TicketOutcome;
  note?: string;
}

export interface TicketService {
  /** New draft ticket; id and timestamps assigned by the store. */
  create(input: CreateTicketInput): Promise<ServiceResult<Ticket>>;

  list(filter?: ListFilter): Promise<Ticket[]>;

  /** Null when the id is unknown. */
  get(id: string): Promise<Ticket | null>;

  /**
   * Runs the model's guarded transition and persists the result.
   * Composition duty: when closing, loads the ticket's children and
   * passes their states to the model's close-guard — a parent cannot
   * close while any child is open.
   */
  transition(id: string, to: TicketState, options?: TransitionOptions): Promise<ServiceResult<Ticket>>;

  /** The ticket's append-only event log, oldest first. */
  history(id: string): Promise<ServiceResult<TicketEvent[]>>;
}

// ---------------------------------------------------------------------------
// Entry-point signature (durable)
// ---------------------------------------------------------------------------

export interface TicketServiceOptions {
  /** Path of the flat JSON store file. Choosing defaults is the CLI's job, not this one's. */
  dbPath: string;
}

export type CreateTicketService = (options: TicketServiceOptions) => TicketService;

// Binding: durable line; the glue behind it is disposable (glue cycle 0005+).
export { createTicketService } from "./src/index.ts";
