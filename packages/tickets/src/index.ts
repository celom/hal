/**
 * Disposable glue — @hal/tickets (root composite, cycle 0005).
 *
 * A composite's real implementation is its children (R5); this file only
 * wires them behind the TicketService façade:
 *   - store owns ids, clocks-on-create, and bytes;
 *   - model owns every guard and the transition itself;
 *   - the façade's one composition duty: on close, gather the ticket's
 *     children from the store and hand their states to the model's
 *     close-guard (open_children).
 *
 * The façade supplies the transition timestamp itself (same seam as the
 * CLI found in cycle 0004): no child exposes a transition-with-clock.
 */
import { transition } from "@hal/tickets-model";
import { openStore } from "@hal/tickets-store";
import type {
  CreateTicketService,
  ServiceResult,
  Ticket,
  TicketService,
} from "../contract.ts";

export const createTicketService: CreateTicketService = ({ dbPath }) => {
  const store = openStore(dbPath);

  const service: TicketService = {
    create: (input) => store.create(input),

    list: (filter) => store.list(filter),

    get: (id) => store.get(id),

    async transition(id, to, options): Promise<ServiceResult<Ticket>> {
      const ticket = await store.get(id);
      if (ticket === null) return { ok: false, error: { code: "not_found", id } };

      const childStates =
        to === "closed"
          ? (await store.list({ parentId: id })).map((child) => child.state)
          : undefined;

      const result = transition(ticket, to, {
        at: new Date().toISOString(),
        outcome: options?.outcome,
        note: options?.note,
        childStates,
      });
      if (!result.ok) return result;

      const persisted = await store.update(result.ticket);
      return persisted.ok ? { ok: true, value: persisted.value } : persisted;
    },

    async history(id) {
      const ticket = await store.get(id);
      if (ticket === null) return { ok: false, error: { code: "not_found", id } };
      return { ok: true, value: ticket.history };
    },
  };

  return service;
};
