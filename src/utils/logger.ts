type Level = "info" | "warn" | "error";

function emit(level: Level, msg: string, meta?: unknown): void {
  const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${msg}`;
  const sink =
    level === "error"
      ? console.error
      : level === "warn"
        ? console.warn
        : console.log;
  if (meta === undefined) sink(line);
  else sink(line, meta);
}

export const logger = {
  info: (msg: string, meta?: unknown) => emit("info", msg, meta),
  warn: (msg: string, meta?: unknown) => emit("warn", msg, meta),
  error: (msg: string, meta?: unknown) => emit("error", msg, meta),
};
