import { AnalysisReport, Anomaly, ERROR_CODES } from "../types/analysis";
import { inspectNode } from "../domain/nodeValidation";

interface Frame {
  raw: unknown;
  trail: string[];
  depth: number;
  activeAncestors: boolean;
}

/*
 Fase 3: analiza una estructura potencialmente inválida y devuelve un reporte.
*/
export function analyzeStructure(root: unknown): AnalysisReport {
  const report: AnalysisReport = {
    activeLeafPaths: [],
    totalNodes: 0,
    activeNodes: 0,
    inactiveNodes: 0,
    maxDepth: 0,
    anomalies: [],
  };

  const seenIds = new Set<number>();
  const visited = new Set<object>();
  const stack: Frame[] = [
    { raw: root, trail: [], depth: 0, activeAncestors: true },
  ];

  while (stack.length > 0) {
    const { raw, trail, depth, activeAncestors } = stack.pop() as Frame;
    const parentPath = trail.length ? trail.join("/") : undefined;

    if (raw === null || raw === undefined) {
      report.anomalies.push({
        code: ERROR_CODES.NULL_CHILD,
        path: parentPath,
        detail: "null/undefined child",
      });
      continue;
    }

    if (typeof raw !== "object" || Array.isArray(raw)) {
      report.anomalies.push({
        code: ERROR_CODES.INVALID_NODE,
        path: parentPath,
        detail: `expected object, got ${Array.isArray(raw) ? "array" : typeof raw}`,
      });
      continue;
    }

    if (visited.has(raw as object)) {
      const maybeId = (raw as { id?: unknown }).id;
      report.anomalies.push({
        code: ERROR_CODES.CYCLE_DETECTED,
        id: typeof maybeId === "number" ? maybeId : undefined,
        path: parentPath,
        detail: "node already visited (shared reference / cycle)",
      });
      continue;
    }
    visited.add(raw as object);

    const insp = inspectNode(raw as Record<string, unknown>);
    const segment = insp.name ?? `#${insp.id ?? "?"}`;
    const here = [...trail, segment];
    const herePath = here.join("/");

    for (const issue of insp.issues) {
      report.anomalies.push({
        code: issue.code,
        id: insp.id,
        path: herePath,
        detail: issue.detail,
      });
    }

    if (insp.id !== undefined) {
      if (seenIds.has(insp.id)) {
        report.anomalies.push({
          code: ERROR_CODES.DUPLICATE_ID,
          id: insp.id,
          path: herePath,
          detail: `duplicate id ${insp.id}`,
        });
      } else {
        seenIds.add(insp.id);
      }
    }

    report.totalNodes++;
    if (insp.active) report.activeNodes++;
    else report.inactiveNodes++;
    if (depth > report.maxDepth) report.maxDepth = depth;

    const activeChain = activeAncestors && insp.active;
    if (activeChain && insp.children.length === 0 && insp.name) {
      report.activeLeafPaths.push(herePath);
    }

    // push in reverse so children are processed left-to-right (order irrelevant: we sort paths)
    for (let i = insp.children.length - 1; i >= 0; i--) {
      stack.push({
        raw: insp.children[i],
        trail: here,
        depth: depth + 1,
        activeAncestors: activeChain,
      });
    }
  }

  report.activeLeafPaths.sort((a, b) => a.localeCompare(b));
  return report;
}

// runnable self-check: node src/services/analyze.ts (via ts-node) — asserts cycle + dup handling.
export function __demo(): void {
  const a: Record<string, unknown> = {
    id: 1,
    name: "A",
    active: true,
    subcategories: [],
  };
  (a.subcategories as unknown[]).push(a); // cycle
  const r = analyzeStructure({
    id: 1,
    name: "Root",
    active: true,
    subcategories: [
      a,
      { id: 1, name: "Dup", active: true, subcategories: [] },
      null,
    ],
  });
  const codes = r.anomalies.map((x: Anomaly) => x.code);
  if (!codes.includes(ERROR_CODES.CYCLE_DETECTED))
    throw new Error("cycle not detected");
  if (!codes.includes(ERROR_CODES.DUPLICATE_ID))
    throw new Error("dup not detected");
  if (!codes.includes(ERROR_CODES.NULL_CHILD))
    throw new Error("null child not detected");
  console.log("analyze __demo ok");
}
