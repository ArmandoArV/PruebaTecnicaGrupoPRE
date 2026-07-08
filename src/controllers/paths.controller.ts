import { Request, Response } from "express";
import { getActiveLeafPaths } from "../services/paths";
import { sampleStructure } from "../sampleStructure";
import { Category } from "../types/category";
import { HTTP_STATUS } from "../constants";

export const activeLeafPathsController = (
  req: Request,
  res: Response,
): void => {
  const structure = (
    req.body && req.body.id ? req.body : sampleStructure
  ) as Category;
  res.status(HTTP_STATUS.OK).json({ paths: getActiveLeafPaths(structure) });
};
