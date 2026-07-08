import { Request, Response } from "express";
import { findCategoryById } from "../services/find";
import { sampleStructure } from "../sampleStructure";
import { Category } from "../types/category";
import { HTTP_STATUS } from "../constants";

const NOT_FOUND = 404;

export const findCategoryController = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: "id must be an integer" });
    return;
  }
  const structure = (req.body && req.body.id ? req.body : sampleStructure) as Category;
  const result = findCategoryById(structure, id);
  if (!result) {
    res.status(NOT_FOUND).json({ found: false });
    return;
  }
  res.status(HTTP_STATUS.OK).json({ found: true, ...result });
};
