export const ERROR_CODES = {
  INVALID_NODE: "INVALID_NODE",
  INVALID_ID: "INVALID_ID",
  DUPLICATE_ID: "DUPLICATE_ID",
  INVALID_NAME: "INVALID_NAME",
  INVALID_SUBCATEGORIES: "INVALID_SUBCATEGORIES",
  NULL_CHILD: "NULL_CHILD",
  CYCLE_DETECTED: "CYCLE_DETECTED",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export interface Anomaly {
  code: ErrorCode;
  id?: number;
  path?: string;
  detail: string;
}

export interface AnalysisReport {
  activeLeafPaths: string[];
  totalNodes: number;
  activeNodes: number;
  inactiveNodes: number;
  maxDepth: number;
  anomalies: Anomaly[];
}
