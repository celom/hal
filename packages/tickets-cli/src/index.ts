// Disposable implementation — @hal/tickets-cli (cycle 0004).
// argv in, lines out. Every transition decision comes from the model,
// every byte of persistence from the store; this file only routes.
import {
  TICKET_TRANSITIONS,
  transition,
  type TicketOutcome,
  type TicketState,
  type TransitionError,
} from "@hal/tickets-model";
import {
  openStore,
  type ListFilter,
  type StoreError,
  type TicketStore,
} from "@hal/tickets-store";
import {
  DEFAULT_DB_PATH,
  TICKETS_DB_ENV,
  type CliIO,
  type RunCli,
} from "../contract.ts";

// The state vocabulary, derived from the model's edge set — the CLI holds
// no state list of its own.
const STATES: readonly string[] = [
  ...new Set(TICKET_TRANSITIONS.flatMap((edge) => edge)),
];

const USAGE: readonly string[] = [
  "usage: tickets <command> [args]",
  "  create <title> [--intent <s>] [--criterion <s>]... [--parent <id>]",
  "  list [--state <s>] [--parent <id>|--roots]",
  "  show <id>",
  "  transition <id> <to> [--outcome impl|renegotiation] [--note <s>]",
  "  history <id>",
];

// ---------------------------------------------------------------------------
// argv parsing — plain loop, zero dependencies
// ---------------------------------------------------------------------------

interface Parsed {
  pos: string[];
  flags: Map<string, string[]>;
  bools: Set<string>;
}

function parseArgs(
  args: string[],
  valued: readonly string[],
  boolean: readonly string[] = [],
): Parsed | { usage: string } {
  const pos: string[] = [];
  const flags = new Map<string, string[]>();
  const bools = new Set<string>();
  for (let i = 0; i < args.length; i++) {
    const a = args[i]!;
    if (!a.startsWith("--")) {
      pos.push(a);
      continue;
    }
    const name = a.slice(2);
    if (boolean.includes(name)) {
      bools.add(name);
      continue;
    }
    if (!valued.includes(name)) return { usage: `unknown flag: --${name}` };
    const value = args[++i];
    if (value === undefined) return { usage: `--${name} requires a value` };
    const list = flags.get(name) ?? [];
    list.push(value);
    flags.set(name, list);
  }
  return { pos, flags, bools };
}

function single(p: Parsed, name: string): string | undefined {
  return p.flags.get(name)?.at(-1);
}

// ---------------------------------------------------------------------------
// Error rendering — one line, never a stack trace
// ---------------------------------------------------------------------------

function transitionErrorLine(e: TransitionError): string {
  switch (e.code) {
    case "invalid_transition":
      return `error: invalid transition ${e.from} -> ${e.to}`;
    case "missing_intent":
      return "error: cannot mark ready: intent is empty";
    case "missing_acceptance_criteria":
      return "error: cannot mark ready: no acceptance criteria";
    case "missing_outcome":
      return "error: closing requires --outcome impl|renegotiation";
    case "open_children":
      return "error: cannot close: open children remain";
  }
}

function storeErrorLine(e: StoreError): string {
  switch (e.code) {
    case "not_found":
      return `error: no such ticket: ${e.id}`;
    case "unknown_parent":
      return `error: unknown parent: ${e.parentId}`;
  }
}

function usageError(io: CliIO, message: string): number {
  io.err(`error: ${message}`);
  return 2;
}

function fail(io: CliIO, line: string): number {
  io.err(line);
  return 1;
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

async function cmdCreate(args: string[], store: TicketStore, io: CliIO): Promise<number> {
  const p = parseArgs(args, ["intent", "criterion", "parent"]);
  if ("usage" in p) return usageError(io, p.usage);
  if (p.pos.length !== 1) return usageError(io, "create takes exactly one <title>");
  const res = await store.create({
    title: p.pos[0]!,
    intent: single(p, "intent"),
    acceptanceCriteria: p.flags.get("criterion"),
    parentId: single(p, "parent") ?? null,
  });
  if (!res.ok) return fail(io, storeErrorLine(res.error));
  io.out(res.value.id);
  return 0;
}

async function cmdList(args: string[], store: TicketStore, io: CliIO): Promise<number> {
  const p = parseArgs(args, ["state", "parent"], ["roots"]);
  if ("usage" in p) return usageError(io, p.usage);
  if (p.pos.length > 0) return usageError(io, "list takes no positional arguments");
  if (p.bools.has("roots") && p.flags.has("parent")) {
    return usageError(io, "--parent and --roots are mutually exclusive");
  }
  const state = single(p, "state");
  if (state !== undefined && !STATES.includes(state)) {
    return usageError(io, `unknown state: ${state}`);
  }
  const filter: ListFilter = {};
  if (state !== undefined) filter.state = state as TicketState;
  if (p.bools.has("roots")) filter.parentId = null;
  else if (p.flags.has("parent")) filter.parentId = single(p, "parent")!;
  for (const t of await store.list(filter)) {
    io.out(`${t.id}\t${t.state}\t${t.title}`);
  }
  return 0;
}

async function cmdShow(args: string[], store: TicketStore, io: CliIO): Promise<number> {
  const p = parseArgs(args, []);
  if ("usage" in p) return usageError(io, p.usage);
  if (p.pos.length !== 1) return usageError(io, "show takes exactly one <id>");
  const id = p.pos[0]!;
  const t = await store.get(id);
  if (!t) return fail(io, `error: no such ticket: ${id}`);
  io.out(`id: ${t.id}`);
  io.out(`title: ${t.title}`);
  io.out(`state: ${t.state}`);
  io.out(`parent: ${t.parentId ?? "(none)"}`);
  io.out(`intent: ${t.intent === "" ? "(none)" : t.intent}`);
  for (const c of t.acceptanceCriteria) io.out(`criterion: ${c}`);
  io.out(`outcome: ${t.outcome ?? "(none)"}`);
  io.out(`created: ${t.createdAt}`);
  io.out(`updated: ${t.updatedAt}`);
  return 0;
}

async function cmdTransition(args: string[], store: TicketStore, io: CliIO): Promise<number> {
  const p = parseArgs(args, ["outcome", "note"]);
  if ("usage" in p) return usageError(io, p.usage);
  if (p.pos.length !== 2) return usageError(io, "transition takes <id> <to>");
  const [id, to] = p.pos as [string, string];
  if (!STATES.includes(to)) return usageError(io, `unknown state: ${to}`);
  const outcome = single(p, "outcome");
  if (outcome !== undefined && outcome !== "impl" && outcome !== "renegotiation") {
    return usageError(io, "--outcome must be impl or renegotiation");
  }
  const ticket = await store.get(id);
  if (!ticket) return fail(io, `error: no such ticket: ${id}`);
  // Parent-close guard data: gather the children's states for the model.
  const childStates =
    to === "closed"
      ? (await store.list({ parentId: ticket.id })).map((c) => c.state)
      : undefined;
  const res = transition(ticket, to as TicketState, {
    at: new Date().toISOString(),
    outcome: outcome as TicketOutcome | undefined,
    note: single(p, "note"),
    childStates,
  });
  if (!res.ok) return fail(io, transitionErrorLine(res.error));
  const saved = await store.update(res.ticket);
  if (!saved.ok) return fail(io, storeErrorLine(saved.error));
  io.out(`${ticket.id} ${ticket.state} -> ${res.ticket.state}`);
  return 0;
}

async function cmdHistory(args: string[], store: TicketStore, io: CliIO): Promise<number> {
  const p = parseArgs(args, []);
  if ("usage" in p) return usageError(io, p.usage);
  if (p.pos.length !== 1) return usageError(io, "history takes exactly one <id>");
  const id = p.pos[0]!;
  const t = await store.get(id);
  if (!t) return fail(io, `error: no such ticket: ${id}`);
  for (const e of t.history) {
    const what = e.type === "created" ? "created" : `${e.from} -> ${e.to}`;
    io.out(`${e.at} ${what}${e.note ? ` (${e.note})` : ""}`);
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export const runCli: RunCli = async (argv, options) => {
  const env = options?.env ?? process.env;
  const io: CliIO = options?.io ?? {
    out: (line) => console.log(line),
    err: (line) => console.error(line),
  };
  try {
    const [command, ...rest] = argv;
    if (!command) {
      io.err("error: missing command");
      for (const line of USAGE) io.err(line);
      return 2;
    }
    const store = openStore(env[TICKETS_DB_ENV] || DEFAULT_DB_PATH);
    switch (command) {
      case "create":
        return await cmdCreate(rest, store, io);
      case "list":
        return await cmdList(rest, store, io);
      case "show":
        return await cmdShow(rest, store, io);
      case "transition":
        return await cmdTransition(rest, store, io);
      case "history":
        return await cmdHistory(rest, store, io);
      default:
        io.err(`error: unknown command: ${command}`);
        for (const line of USAGE) io.err(line);
        return 2;
    }
  } catch (e) {
    io.err(`error: ${e instanceof Error ? e.message : String(e)}`);
    return 1;
  }
};

if (import.meta.main) {
  runCli(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
