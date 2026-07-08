import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { logger } from "../utils/logger";

// Express identifies the error handler by its 4-argument arity, so _next must stay.
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isApp = err instanceof AppError;
  const rawStatus = (err as { status?: unknown; statusCode?: unknown }).status
    ?? (err as { statusCode?: unknown }).statusCode;
  const clientStatus =
    typeof rawStatus === "number" && rawStatus >= 400 && rawStatus < 500
      ? rawStatus
      : undefined;

  const status = isApp ? err.status : clientStatus ?? 500;
  const code = isApp ? err.code : status === 500 ? "INTERNAL_ERROR" : "BAD_REQUEST";

  logger.error(`${req.method} ${req.originalUrl} -> ${status} ${code}: ${err.message}`);

  res.status(status).json({ error: { code, message: err.message } });
};
