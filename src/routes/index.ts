import { Router } from "express";
import { healthController } from "../controllers";
import { activeLeafPathsController } from "../controllers/paths.controller";

export const router = Router();

router.get("/health", healthController);
router.get("/active-leaf-paths", activeLeafPathsController);
router.post("/active-leaf-paths", activeLeafPathsController);
