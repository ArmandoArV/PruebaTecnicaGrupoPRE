import { Category } from "../types/category";

/*
  Fase 1: rutas completas de las hojas activas.
  Una rama se elimina por completo si el nodo o cualquier ancestro está inactivo.
  Rutas ordenadas alfabéticamente.
 */
export function getActiveLeafPaths(root: Category): string[] {
  const paths: string[] = [];

  const walk = (node: Category, trail: string[]): void => {
    if (!node.active) return; // nodo-ancestor inactivo -> removemos la rama
    const here = [...trail, node.name];
    const kids = node.subcategories ?? [];
    if (kids.length === 0) {
      paths.push(here.join("/")); // hoja activa
      return;
    }
    for (const child of kids) walk(child, here);
  };

  walk(root, []);
  return paths.sort((a, b) => a.localeCompare(b));
}
