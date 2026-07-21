/**
 * Contract — @hal/tickets-store
 *
 * Flat-JSON-file persistence for tickets. Owns ids (`T-<n>` sequential),
 * clocks, and bytes; owns no domain rules (those are @hal/tickets-model).
 * Store errors are returned values, never exceptions, mirroring the model.
 */
import type { Ticket, TicketState } from "@hal/tickets-model";

// ---------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------

export interface CreateTicketInput {
  title: string;
  intent?: string; // default ""
  acceptanceCriteria?: string[]; // default []
  parentId?: string | null; // default null; must reference an existing ticket
}

export interface ListFilter {
  state?: TicketState;
  /** Filter by parent; pass null to list only root tickets. */
  parentId?: string | null;
}

// ---------------------------------------------------------------------------
// Errors as values
// ---------------------------------------------------------------------------

export type StoreError =
  | { code: "not_found"; id: string } // get/update of unknown id → update error, get returns null
  | { code: "unknown_parent"; parentId: string }; // create with a parentId not in the store

export type StoreResult<T> = { ok: true; value: T } | { ok: false; error: StoreError };

// ---------------------------------------------------------------------------
// The store
// ---------------------------------------------------------------------------

export interface TicketStore {
  /** Absolute or relative path of the backing JSON file, as given to openStore. */
  readonly path: string;

  /**
   * Assigns the next sequential id (T-1, T-2, …), stamps createdAt/updatedAt
   * and the "created" history event with the current time, persists, and
   * returns the new draft ticket.
   */
  create(input: CreateTicketInput): Promise<StoreResult<Ticket>>;

  /** Null when the id is unknown. */
  get(id: string): Promise<Ticket | null>;

  /** All tickets (insertion order), optionally filtered. */
  list(filter?: ListFilter): Promise<Ticket[]>;

  /**
   * Persists a full replacement of an existing ticket (matched by ticket.id).
   * The caller produces the new value — typically via the model's transition.
   * Unknown id → not_found; never a silent insert.
   */
  update(ticket: Ticket): Promise<StoreResult<Ticket>>;
}

// ---------------------------------------------------------------------------
// Entry-point signature (durable)
// ---------------------------------------------------------------------------

/**
 * Opens (lazily) the store at `path`. A missing file is an empty store;
 * the file is created on first write. Writes are atomic-enough for a
 * single user (write-then-rename or equivalent).
 */
export type OpenStore = (path: string) => TicketStore;

// Binding: durable line; what's behind it is disposable (impl cycle 0003+).
export { openStore } from "./src/index.ts";
