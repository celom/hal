/**
 * Contract — @hal/tickets-cli
 *
 * Presentation leaf: argv in, lines out. Depends only on the model and
 * store contracts (R2). The store path comes from env TICKETS_DB, falling
 * back to "./.tickets.json"; nothing else is configurable.
 *
 * Commands:
 *   create <title> [--intent <s>] [--criterion <s>]... [--parent <id>]
 *   list [--state <s>] [--parent <id>|--roots]
 *   show <id>
 *   transition <id> <to> [--outcome impl|renegotiation] [--note <s>]
 *   history <id>
 */

// ---------------------------------------------------------------------------
// IO seam — evals drive the CLI in-process through this
// ---------------------------------------------------------------------------

export interface CliIO {
  /** One line to stdout (no trailing newline needed). */
  out(line: string): void;
  /** One line to stderr. */
  err(line: string): void;
}

export interface CliOptions {
  /** Environment; only TICKETS_DB is read. Defaults to process.env. */
  env?: Record<string, string | undefined>;
  /** Output sink. Defaults to console-backed IO. */
  io?: CliIO;
}

/** Env var naming the store file; fallback when absent. */
export const TICKETS_DB_ENV = "TICKETS_DB";
export const DEFAULT_DB_PATH = "./.tickets.json";

// ---------------------------------------------------------------------------
// Entry-point signature (durable)
// ---------------------------------------------------------------------------

/**
 * Runs one command. argv excludes the runtime and script name
 * (i.e. process.argv.slice(2)). Returns the exit code: 0 on success,
 * non-zero on usage, guard, or store errors. Never throws on domain
 * errors; never calls process.exit.
 */
export type RunCli = (argv: string[], options?: CliOptions) => Promise<number>;

// Binding: durable line; what's behind it is disposable (impl cycle 0004+).
// src/index.ts doubles as the executable: `bun .../src/index.ts <cmd> ...`.
export { runCli } from "./src/index.ts";
