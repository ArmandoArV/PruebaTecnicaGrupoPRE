import { Request, Response } from "express";
import { findCategoryById } from "../services/find";
import { sampleStructure } from "../sampleStructure";
import { Category } from "../types/category";
import { AppError } from "../errors/AppError";
import { HTTP_STATUS } from "../constants";

export const findCategoryController = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw AppError.badRequest("INVALID_ID", "id must be an integer");
  }

  const structure = (
    req.body && req.body.id ? req.body : sampleStructure
  ) as Category;

  const result = findCategoryById(structure, id);
  if (!result) {
    throw AppError.notFound("CATEGORY_NOT_FOUND", `category ${id} not found`);
  }

  res.status(HTTP_STATUS.OK).json({ found: true, ...result });
};
