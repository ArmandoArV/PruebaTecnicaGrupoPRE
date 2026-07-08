import { findCategoryById } from "../src/services/find";
import { Category } from "../src/types/category";

const structure: Category = {
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

describe("findCategoryById", () => {
  it("búsqueda exitosa: devuelve nodo, path, depth, parentId, isLeaf", () => {
    expect(findCategoryById(structure, 5)).toEqual({
      node: { id: 5, name: "Laptops", active: true, subcategories: [] },
      path: "Electrónica/Computadoras/Laptops",
      depth: 2,
      parentId: 2,
      isLeaf: true,
    });
  });

  it("raíz: parentId null y depth 0", () => {
    const r = findCategoryById(structure, 1);
    expect(r?.parentId).toBeNull();
    expect(r?.depth).toBe(0);
    expect(r?.isLeaf).toBe(false);
  });

  it("sin resultado: devuelve null", () => {
    expect(findCategoryById(structure, 999)).toBeNull();
  });
});
