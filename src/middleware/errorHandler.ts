import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res
    .status(HTTP_STATUS.INTERNAL_ERROR)
    .json({ error: err.message || "Internal Server Error" });
};
