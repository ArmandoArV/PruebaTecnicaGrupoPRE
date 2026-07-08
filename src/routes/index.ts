import { Router } from "express";
import { healthController } from "../controllers";

export const router = Router();

router.get("/health", healthController);
