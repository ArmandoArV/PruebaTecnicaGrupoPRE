import { analyzeStructure } from "../src/services/analyze";
import { ERROR_CODES } from "../src/types/analysis";

describe("analyzeStructure", () => {
  it("caso base válido: paths, counts y profundidad", () => {
    const structure = {
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
    const r = analyzeStructure(structure);
    expect(r.activeLeafPaths).toEqual([
      "Electrónica/Accesorios",
      "Electrónica/Celulares",
      "Electrónica/Computadoras/Laptops",
    ]);
    expect(r.totalNodes).toBe(6);
    expect(r.activeNodes).toBe(5);
    expect(r.inactiveNodes).toBe(1);
    expect(r.maxDepth).toBe(2);
    expect(r.anomalies).toEqual([]);
  });

  it("dato inválido: reporta anomalías sin romper el procesamiento", () => {
    const structure = {
      id: 1,
      name: "Root",
      active: true,
      subcategories: [
        null, // NULL_CHILD
        { id: "x", name: "  ", active: true, subcategories: {} }, // INVALID_ID + INVALID_NAME + INVALID_SUBCATEGORIES
        { id: 2, name: "Ok", active: true, subcategories: [] },
      ],
    };
    const r = analyzeStructure(structure);
    const codes = r.anomalies.map((a) => a.code);
    expect(codes).toContain(ERROR_CODES.NULL_CHILD);
    expect(codes).toContain(ERROR_CODES.INVALID_ID);
    expect(codes).toContain(ERROR_CODES.INVALID_NAME);
    expect(codes).toContain(ERROR_CODES.INVALID_SUBCATEGORIES);
    // el nodo válido igual se procesa
    expect(r.activeLeafPaths).toContain("Root/Ok");
  });

  it("ciclo por referencia: no entra en loop y reporta CYCLE_DETECTED", () => {
    const node: Record<string, unknown> = {
      id: 2,
      name: "Loop",
      active: true,
      subcategories: [],
    };
    (node.subcategories as unknown[]).push(node); // self-reference
    const structure = {
      id: 1,
      name: "Root",
      active: true,
      subcategories: [node],
    };
    const r = analyzeStructure(structure);
    expect(r.anomalies.map((a) => a.code)).toContain(ERROR_CODES.CYCLE_DETECTED);
  });

  it("IDs duplicados: reporta DUPLICATE_ID", () => {
    const structure = {
      id: 1,
      name: "Root",
      active: true,
      subcategories: [
        { id: 7, name: "A", active: true, subcategories: [] },
        { id: 7, name: "B", active: true, subcategories: [] },
      ],
    };
    const r = analyzeStructure(structure);
    const dup = r.anomalies.filter((a) => a.code === ERROR_CODES.DUPLICATE_ID);
    expect(dup).toHaveLength(1);
    expect(dup[0].id).toBe(7);
  });

  it("no desborda con árboles muy profundos (iterativo)", () => {
    let depth = 20000;
    let node: Record<string, unknown> = {
      id: depth,
      name: `n${depth}`,
      active: true,
      subcategories: [],
    };
    for (let i = depth - 1; i >= 1; i--) {
      node = { id: i, name: `n${i}`, active: true, subcategories: [node] };
    }
    const r = analyzeStructure(node);
    expect(r.maxDepth).toBe(depth - 1);
    expect(r.activeLeafPaths).toHaveLength(1);
  });
});
