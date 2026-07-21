/**
 * Evals — @hal/tickets-store
 * Executable definition of done (R1). Drafted in cycle 0001; expected red
 * until the store's impl cycle. Wired as an Nx `evals` target in that cycle.
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openStore } from "@hal/tickets-store";

let dir: string;
let dbPath: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "tickets-store-eval-"));
  dbPath = join(dir, "tickets.json");
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("openStore", () => {
  test("a missing file is an empty store; no file is created by reads", async () => {
    const store = openStore(dbPath);
    expect(store.path).toBe(dbPath);
    expect(await store.list()).toEqual([]);
    expect(await Bun.file(dbPath).exists()).toBe(false);
  });
});

describe("create", () => {
  test("assigns sequential T-<n> ids and returns draft tickets with stamped history", async () => {
    const store = openStore(dbPath);
    const a = await store.create({ title: "first" });
    const b = await store.create({ title: "second", intent: "why", acceptanceCriteria: ["done"] });
    if (!a.ok || !b.ok) throw new Error("create failed");

    expect(a.value.id).toBe("T-1");
    expect(b.value.id).toBe("T-2");
    expect(a.value.state).toBe("draft");
    expect(a.value.outcome).toBeNull();
    expect(a.value.history).toHaveLength(1);
    expect(a.value.history[0]!.type).toBe("created");
    expect(Date.parse(a.value.createdAt)).not.toBeNaN();
    expect(a.value.createdAt).toBe(a.value.updatedAt);
    expect(b.value.intent).toBe("why");
    expect(b.value.acceptanceCriteria).toEqual(["done"]);
  });

  test("accepts a parentId that exists and rejects one that does not", async () => {
    const store = openStore(dbPath);
    const parent = await store.create({ title: "parent" });
    if (!parent.ok) throw new Error("create failed");

    const child = await store.create({ title: "child", parentId: parent.value.id });
    expect(child.ok).toBe(true);
    if (child.ok) expect(child.value.parentId).toBe("T-1");

    const orphan = await store.create({ title: "orphan", parentId: "T-99" });
    expect(orphan).toEqual({ ok: false, error: { code: "unknown_parent", parentId: "T-99" } });
  });

  test("writes a human-readable JSON file", async () => {
    const store = openStore(dbPath);
    await store.create({ title: "first" });
    const raw = await readFile(dbPath, "utf8");
    expect(() => JSON.parse(raw)).not.toThrow();
    expect(raw).toContain("T-1");
  });
});

describe("get / list", () => {
  test("get returns the ticket or null", async () => {
    const store = openStore(dbPath);
    await store.create({ title: "first" });
    const hit = await store.get("T-1");
    expect(hit?.title).toBe("first");
    expect(await store.get("T-404")).toBeNull();
  });

  test("list preserves insertion order and honors filters", async () => {
    const store = openStore(dbPath);
    await store.create({ title: "root a" });
    await store.create({ title: "root b" });
    await store.create({ title: "child", parentId: "T-1" });

    const all = await store.list();
    expect(all.map((t) => t.id)).toEqual(["T-1", "T-2", "T-3"]);

    const roots = await store.list({ parentId: null });
    expect(roots.map((t) => t.id)).toEqual(["T-1", "T-2"]);

    const children = await store.list({ parentId: "T-1" });
    expect(children.map((t) => t.id)).toEqual(["T-3"]);

    const drafts = await store.list({ state: "draft" });
    expect(drafts).toHaveLength(3);
    expect(await store.list({ state: "closed" })).toEqual([]);
  });
});

describe("update", () => {
  test("persists a full replacement of an existing ticket", async () => {
    const store = openStore(dbPath);
    const created = await store.create({ title: "first" });
    if (!created.ok) throw new Error("create failed");

    const edited = { ...created.value, intent: "now with intent", acceptanceCriteria: ["ac1"] };
    const updated = await store.update(edited);
    expect(updated.ok).toBe(true);

    const back = await store.get("T-1");
    expect(back?.intent).toBe("now with intent");
    expect(back?.acceptanceCriteria).toEqual(["ac1"]);
  });

  test("unknown id is not_found, never a silent insert", async () => {
    const store = openStore(dbPath);
    const created = await store.create({ title: "first" });
    if (!created.ok) throw new Error("create failed");

    const ghost = { ...created.value, id: "T-99" };
    expect(await store.update(ghost)).toEqual({
      ok: false,
      error: { code: "not_found", id: "T-99" },
    });
    expect(await store.list()).toHaveLength(1);
  });
});

describe("persistence", () => {
  test("a reopened store sees the same tickets and keeps the id sequence", async () => {
    const first = openStore(dbPath);
    await first.create({ title: "a" });
    await first.create({ title: "b" });

    const second = openStore(dbPath);
    const all = await second.list();
    expect(all.map((t) => t.id)).toEqual(["T-1", "T-2"]);

    const c = await second.create({ title: "c" });
    if (!c.ok) throw new Error("create failed");
    expect(c.value.id).toBe("T-3");
  });
});
