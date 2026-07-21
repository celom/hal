/**
 * Implementation — @hal/tickets-store (disposable, cycle 0003)
 *
 * Flat-JSON-file persistence. Owns ids (`T-<n>` sequential, never reused —
 * a lastId counter is persisted alongside the tickets), clocks (ISO stamps
 * on create), and bytes (write-then-rename). No domain rules: construction
 * is delegated to @hal/tickets-model's createTicket; everything else is
 * verbatim persistence of whatever well-formed Ticket the caller hands us.
 */
import { rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createTicket, type Ticket } from "@hal/tickets-model";
import type {
  CreateTicketInput,
  ListFilter,
  OpenStore,
  StoreResult,
  TicketStore,
} from "../contract.ts";

/** On-disk shape. lastId persists the id sequence so ids are never reused. */
interface StoreFile {
  lastId: number;
  tickets: Ticket[];
}

async function load(path: string): Promise<StoreFile> {
  const file = Bun.file(path);
  if (!(await file.exists())) return { lastId: 0, tickets: [] };
  const data = (await file.json()) as StoreFile;
  return {
    lastId: typeof data.lastId === "number" ? data.lastId : 0,
    tickets: Array.isArray(data.tickets) ? data.tickets : [],
  };
}

/** Atomic-enough for a single user: write a sibling temp file, then rename. */
async function save(path: string, data: StoreFile): Promise<void> {
  const tmp = join(dirname(path), `.${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`);
  await writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await rename(tmp, path);
}

export const openStore: OpenStore = (path: string): TicketStore => ({
  path,

  async create(input: CreateTicketInput): Promise<StoreResult<Ticket>> {
    const data = await load(path);
    const parentId = input.parentId ?? null;
    if (parentId !== null && !data.tickets.some((t) => t.id === parentId)) {
      return { ok: false, error: { code: "unknown_parent", parentId } };
    }
    const nextId = data.lastId + 1;
    const ticket = createTicket({
      id: `T-${nextId}`,
      title: input.title,
      intent: input.intent,
      acceptanceCriteria: input.acceptanceCriteria,
      parentId,
      at: new Date().toISOString(),
    });
    data.lastId = nextId;
    data.tickets.push(ticket);
    await save(path, data);
    return { ok: true, value: ticket };
  },

  async get(id: string): Promise<Ticket | null> {
    const data = await load(path);
    return data.tickets.find((t) => t.id === id) ?? null;
  },

  async list(filter?: ListFilter): Promise<Ticket[]> {
    const data = await load(path);
    let tickets = data.tickets;
    if (filter?.state !== undefined) {
      tickets = tickets.filter((t) => t.state === filter.state);
    }
    if (filter !== undefined && "parentId" in filter && filter.parentId !== undefined) {
      tickets = tickets.filter((t) => t.parentId === filter.parentId);
    }
    return tickets;
  },

  async update(ticket: Ticket): Promise<StoreResult<Ticket>> {
    const data = await load(path);
    const index = data.tickets.findIndex((t) => t.id === ticket.id);
    if (index === -1) {
      return { ok: false, error: { code: "not_found", id: ticket.id } };
    }
    data.tickets[index] = ticket;
    await save(path, data);
    return { ok: true, value: ticket };
  },
});
