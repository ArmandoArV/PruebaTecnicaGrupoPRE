import { Router } from "express";
import { healthController } from "../controllers";
import { activeLeafPathsController } from "../controllers/paths.controller";
import { findCategoryController } from "../controllers/category.controller";

export const router = Router();

router.get("/health", healthController);
router.get("/active-leaf-paths", activeLeafPathsController);
router.post("/active-leaf-paths", activeLeafPathsController);
router.get("/category/:id", findCategoryController);
router.post("/category/:id", findCategoryController);
