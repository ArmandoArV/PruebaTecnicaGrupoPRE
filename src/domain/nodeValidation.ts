import { ERROR_CODES, ErrorCode } from "../types/analysis";

export interface NodeInspection {
  id?: number;
  name?: string;
  active: boolean;
  children: unknown[];
  issues: { code: ErrorCode; detail: string }[];
}

/*
  Valida los campos de un nodo (ya garantizado como objeto no-nulo).
*/
export function inspectNode(raw: Record<string, unknown>): NodeInspection {
  const issues: { code: ErrorCode; detail: string }[] = [];

  const rawId = raw.id;
  let id: number | undefined;
  if (typeof rawId === "number" && Number.isInteger(rawId)) {
    id = rawId;
  } else {
    issues.push({
      code: ERROR_CODES.INVALID_ID,
      detail: `invalid id: ${JSON.stringify(rawId)}`,
    });
  }

  const rawName = raw.name;
  let name: string | undefined;
  if (typeof rawName === "string" && rawName.trim().length > 0) {
    name = rawName.trim();
  } else {
    issues.push({
      code: ERROR_CODES.INVALID_NAME,
      detail: `invalid name: ${JSON.stringify(rawName)}`,
    });
  }

  const active = raw.active === true;

  let children: unknown[] = [];
  const subs = raw.subcategories;
  if (subs === undefined) {
    children = []; // faltante -> hoja vacía (supuesto documentado)
  } else if (Array.isArray(subs)) {
    children = subs;
  } else {
    issues.push({
      code: ERROR_CODES.INVALID_SUBCATEGORIES,
      detail: `subcategories is not an array (${subs === null ? "null" : typeof subs})`,
    });
    children = [];
  }

  return { id, name, active, children, issues };
}
