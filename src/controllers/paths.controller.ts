import { Request, Response } from "express";
import { getActiveLeafPaths } from "../services/paths";
import { Category } from "../types/category";
import { HTTP_STATUS } from "../constants";

const sample: Category = {
  id: 1,
  name: "Electrónica",
  active: true,
  subcategories: [
    {
      id: 2,
      name: "Computadoras",
      active: true,
      subcategories: [
        { id: 5, name: "Laptops", active: true, subcategories: [] },
        { id: 6, name: "Desktops", active: false, subcategories: [] },
      ],
    },
    { id: 3, name: "Celulares", active: true, subcategories: [] },
    { id: 4, name: "Accesorios", active: true, subcategories: [] },
  ],
};

export const activeLeafPathsController = (
  req: Request,
  res: Response,
): void => {
  const structure = (req.body && req.body.id ? req.body : sample) as Category;
  res.status(HTTP_STATUS.OK).json({ paths: getActiveLeafPaths(structure) });
};
