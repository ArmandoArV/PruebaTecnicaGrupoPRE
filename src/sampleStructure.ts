import { Category } from "./types/category";

export const sampleStructure: Category = {
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
