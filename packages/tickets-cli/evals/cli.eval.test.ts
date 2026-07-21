/**
 * Evals — @hal/tickets-cli
 * Executable definition of done (R1). Drafted in cycle 0001; expected red
 * until the CLI's impl cycle. Wired as an Nx `evals` target in that cycle.
 *
 * The CLI is driven in-process through runCli with injected env + io —
 * asserting on captured lines and exit codes, not on process spawning.
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runCli, TICKETS_DB_ENV, type CliIO } from "@hal/tickets-cli";

let dir: string;
let dbPath: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "tickets-cli-eval-"));
  dbPath = join(dir, "tickets.json");
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

function capture() {
  const out: string[] = [];
  const err: string[] = [];
  const io: CliIO = { out: (l) => out.push(l), err: (l) => err.push(l) };
  const env = { [TICKETS_DB_ENV]: dbPath };
  const run = (...argv: string[]) => runCli(argv, { env, io });
  return { out, err, run };
}

async function seedReadyTicket(run: (...argv: string[]) => Promise<number>) {
  expect(await run("create", "First ticket", "--intent", "why", "--criterion", "it works")).toBe(0);
}

describe("create", () => {
  test("prints the new id and persists to the TICKETS_DB path", async () => {
    const { out, run } = capture();
    const code = await run("create", "First ticket", "--intent", "why", "--criterion", "it works");
    expect(code).toBe(0);
    expect(out.join("\n")).toContain("T-1");
    expect(await Bun.file(dbPath).exists()).toBe(true);
  });

  test("supports --parent", async () => {
    const { out, run } = capture();
    await seedReadyTicket(run);
    expect(await run("create", "Child", "--parent", "T-1")).toBe(0);
    expect(out.join("\n")).toContain("T-2");
    expect(await run("show", "T-2")).toBe(0);
    expect(out.join("\n")).toContain("T-1"); // parent visible on show
  });
});

describe("list / show", () => {
  test("list shows ids, states, and titles", async () => {
    const { out, run } = capture();
    await seedReadyTicket(run);
    await run("create", "Second");
    expect(await run("list")).toBe(0);
    const listed = out.join("\n");
    expect(listed).toContain("T-1");
    expect(listed).toContain("T-2");
    expect(listed).toContain("draft");
    expect(listed).toContain("First ticket");
  });

  test("show of an unknown id is one stderr line and a non-zero exit", async () => {
    const { out, err, run } = capture();
    const code = await run("show", "T-404");
    expect(code).not.toBe(0);
    expect(err.length).toBe(1);
    expect(err[0]).toContain("T-404");
    expect(out).toEqual([]);
  });
});

describe("transition", () => {
  test("walks the happy path draft→ready→in_progress→closed", async () => {
    const { out, run } = capture();
    await seedReadyTicket(run);
    expect(await run("transition", "T-1", "ready")).toBe(0);
    expect(await run("transition", "T-1", "in_progress")).toBe(0);
    expect(await run("transition", "T-1", "closed", "--outcome", "impl")).toBe(0);
    expect(await run("show", "T-1")).toBe(0);
    const shown = out.join("\n");
    expect(shown).toContain("closed");
    expect(shown).toContain("impl");
  });

  test("guard failures surface as stderr + non-zero exit, and change nothing", async () => {
    const { err, run } = capture();
    await run("create", "No intent yet");
    const code = await run("transition", "T-1", "ready");
    expect(code).not.toBe(0);
    expect(err.length).toBe(1);

    const { out: out2, run: run2 } = capture();
    expect(await run2("show", "T-1")).toBe(0);
    expect(out2.join("\n")).toContain("draft");
  });

  test("closing requires --outcome", async () => {
    const { err, run } = capture();
    await seedReadyTicket(run);
    await run("transition", "T-1", "ready");
    await run("transition", "T-1", "in_progress");
    expect(await run("transition", "T-1", "closed")).not.toBe(0);
    expect(err.join("\n")).toContain("outcome");
  });

  test("closing a parent with an open child fails until the child closes", async () => {
    const { run } = capture();
    await seedReadyTicket(run);
    await run(
      "create", "Child", "--parent", "T-1", "--intent", "child why", "--criterion", "child done",
    );
    await run("transition", "T-1", "ready");
    await run("transition", "T-1", "in_progress");
    expect(await run("transition", "T-1", "closed", "--outcome", "impl")).not.toBe(0);

    for (const step of [["T-2", "ready"], ["T-2", "in_progress"]] as const) {
      expect(await run("transition", ...step)).toBe(0);
    }
    expect(await run("transition", "T-2", "closed", "--outcome", "impl")).toBe(0);
    expect(await run("transition", "T-1", "closed", "--outcome", "impl")).toBe(0);
  });
});

describe("history", () => {
  test("prints one line per event in order", async () => {
    const { out, run } = capture();
    await seedReadyTicket(run);
    await run("transition", "T-1", "ready", "--note", "specced");
    out.length = 0;
    expect(await run("history", "T-1")).toBe(0);
    expect(out.length).toBe(2);
    expect(out[0]).toContain("created");
    expect(out[1]).toContain("ready");
    expect(out[1]).toContain("specced");
  });
});

describe("usage", () => {
  test("unknown command is stderr + non-zero, and never throws", async () => {
    const { err, run } = capture();
    const code = await run("frobnicate");
    expect(code).not.toBe(0);
    expect(err.length).toBeGreaterThan(0);
  });
});
