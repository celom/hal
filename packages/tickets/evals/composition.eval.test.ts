/**
 * Composition evals — @hal/tickets (root composite)
 *
 * Exercise the children *together* through the composite's own contract
 * (D4): a full ticket lifecycle via the TicketService façade, the
 * parent/child close-guard across the model↔store seam, and one
 * end-to-end CLI smoke. Child internals are the children's evals' job.
 *
 * Drafted in cycle 0001; deliberately NOT wired as an Nx `evals` target
 * until the glue cycle (0005), so the suite stays green during child
 * impl cycles.
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createTicketService, type Ticket } from "@hal/tickets";
import { runCli, TICKETS_DB_ENV, type CliIO } from "@hal/tickets-cli";

let dir: string;
let dbPath: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "tickets-composition-eval-"));
  dbPath = join(dir, "tickets.json");
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

function unwrap<T>(r: { ok: true; value: T } | { ok: false; error: { code: string } }): T {
  if (!r.ok) throw new Error(`expected ok, got ${r.error.code}`);
  return r.value;
}

describe("full lifecycle through the façade", () => {
  test("create → guarded draft→ready → in_progress → closed, with history", async () => {
    const svc = createTicketService({ dbPath });

    // Draft without intent/criteria: the model's guard must surface untouched.
    const bare = unwrap(await svc.create({ title: "Ship the pilot" }));
    expect(bare.id).toBe("T-1");
    expect(bare.state).toBe("draft");
    const blocked = await svc.transition("T-1", "ready");
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.error.code).toBe("missing_intent");

    // A guarded ticket (intent + criteria at create) walks the happy path.
    // Its id also proves the sequence continues under the façade.
    const t = unwrap(
      await svc.create({
        title: "Guarded",
        intent: "validate the lifecycle",
        acceptanceCriteria: ["walks all states"],
      }),
    );
    expect(t.id).toBe("T-2");
    const id = t.id;

    expect(unwrap(await svc.transition(id, "ready")).state).toBe("ready");
    expect(unwrap(await svc.transition(id, "in_progress")).state).toBe("in_progress");

    // Backout edge, then forward again.
    expect(unwrap(await svc.transition(id, "ready", { note: "backed out" })).state).toBe("ready");
    expect(unwrap(await svc.transition(id, "in_progress")).state).toBe("in_progress");

    // Close requires an outcome.
    const noOutcome = await svc.transition(id, "closed");
    expect(noOutcome.ok).toBe(false);
    if (!noOutcome.ok) expect(noOutcome.error.code).toBe("missing_outcome");

    const closed = unwrap(await svc.transition(id, "closed", { outcome: "impl", note: "done" }));
    expect(closed.state).toBe("closed");
    expect(closed.outcome).toBe("impl");

    // History: created + every transition, oldest first.
    const events = unwrap(await svc.history(id));
    expect(events[0]!.type).toBe("created");
    expect(events.filter((e) => e.type === "transition").map((e) => e.to)).toEqual([
      "ready",
      "in_progress",
      "ready",
      "in_progress",
      "closed",
    ]);
  });

  test("service state survives re-instantiation over the same dbPath", async () => {
    const first = createTicketService({ dbPath });
    unwrap(await first.create({ title: "persisted" }));

    const second = createTicketService({ dbPath });
    const all = await second.list();
    expect(all.map((t: Ticket) => t.id)).toEqual(["T-1"]);
  });
});

describe("parent/child close-guard across the seam", () => {
  test("a parent cannot close while a child is open; can once all children close", async () => {
    const svc = createTicketService({ dbPath });
    const parent = unwrap(
      await svc.create({ title: "Parent", intent: "compose", acceptanceCriteria: ["children close first"] }),
    );
    const child = unwrap(
      await svc.create({
        title: "Child",
        parentId: parent.id,
        intent: "be closed",
        acceptanceCriteria: ["closes"],
      }),
    );

    for (const id of [parent.id, child.id]) {
      unwrap(await svc.transition(id, "ready"));
      unwrap(await svc.transition(id, "in_progress"));
    }

    const early = await svc.transition(parent.id, "closed", { outcome: "impl" });
    expect(early).toEqual({ ok: false, error: { code: "open_children" } });

    unwrap(await svc.transition(child.id, "closed", { outcome: "impl" }));
    const late = unwrap(await svc.transition(parent.id, "closed", { outcome: "impl" }));
    expect(late.state).toBe("closed");
  });

  test("unknown ids surface the store's error as a value", async () => {
    const svc = createTicketService({ dbPath });
    const r = await svc.transition("T-404", "ready");
    expect(r).toEqual({ ok: false, error: { code: "not_found", id: "T-404" } });
    expect(await svc.get("T-404")).toBeNull();
  });
});

describe("end-to-end CLI smoke", () => {
  test("a ticket created via the CLI is visible to the service, and vice versa", async () => {
    const out: string[] = [];
    const io: CliIO = { out: (l) => out.push(l), err: (l) => out.push(l) };
    const env = { [TICKETS_DB_ENV]: dbPath };

    expect(
      await runCli(
        ["create", "From the CLI", "--intent", "smoke", "--criterion", "round-trips"],
        { env, io },
      ),
    ).toBe(0);

    const svc = createTicketService({ dbPath });
    const viaService = await svc.get("T-1");
    expect(viaService?.title).toBe("From the CLI");

    unwrap(await svc.transition("T-1", "ready"));

    out.length = 0;
    expect(await runCli(["show", "T-1"], { env, io })).toBe(0);
    expect(out.join("\n")).toContain("ready");
  });
});
