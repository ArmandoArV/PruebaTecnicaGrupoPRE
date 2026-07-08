import { Request, Response } from "express";
import { analyzeStructure } from "../services/analyze";
import { sampleStructure } from "../sampleStructure";
import { logger } from "../utils/logger";
import { HTTP_STATUS } from "../constants";

export const analyzeController = (req: Request, res: Response): void => {
  const structure = req.body && req.body.id ? req.body : sampleStructure;
  const report = analyzeStructure(structure);

  if (report.anomalies.length > 0) {
    logger.warn(
      `analyze detected ${report.anomalies.length} anomaly(ies)`,
      report.anomalies,
    );
  }

  res.status(HTTP_STATUS.OK).json(report);
};
