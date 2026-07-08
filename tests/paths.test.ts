import { getActiveLeafPaths } from "../src/services/paths";
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

describe("getActiveLeafPaths", () => {
  it("caso base: devuelve hojas activas ordenadas", () => {
    expect(getActiveLeafPaths(structure)).toEqual([
      "Electrónica/Accesorios",
      "Electrónica/Celulares",
      "Electrónica/Computadoras/Laptops",
    ]);
  });

  it("rama inactiva: poda todos los descendientes", () => {
    const withInactiveBranch: Category = {
      id: 1,
      name: "Root",
      active: true,
      subcategories: [
        {
          id: 2,
          name: "Off",
          active: false,
          subcategories: [
            { id: 3, name: "Hidden", active: true, subcategories: [] },
          ],
        },
        { id: 4, name: "On", active: true, subcategories: [] },
      ],
    };
    expect(getActiveLeafPaths(withInactiveBranch)).toEqual(["Root/On"]);
  });
});
