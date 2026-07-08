import { Category, FindResult } from "../types/category";

/**
 * Fase 2: busca una categoría por ID a cualquier profundidad.
 * Devuelve el nodo con su path, profundidad (raíz = 0), parentId (raíz = null)
 * y si es hoja. Si no existe, devuelve null (contrato consistente para callers).
 */
export function findCategoryById(root: Category, id: number): FindResult | null {
  const recurse = (
    node: Category,
    trail: string[],
    depth: number,
    parentId: number | null
  ): FindResult | null => {
    const here = [...trail, node.name];
    if (node.id === id) {
      return {
        node,
        path: here.join("/"),
        depth,
        parentId,
        isLeaf: (node.subcategories ?? []).length === 0,
      };
    }
    for (const child of node.subcategories ?? []) {
      const hit = recurse(child, here, depth + 1, node.id);
      if (hit) return hit;
    }
    return null;
  };

  return recurse(root, [], 0, null);
}
