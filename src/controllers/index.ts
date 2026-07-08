import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants";

export const healthController = (_req: Request, res: Response): void => {
  res.status(HTTP_STATUS.OK).json({ status: "ok" });
};
