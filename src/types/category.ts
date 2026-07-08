export interface Category {
  id: number;
  name: string;
  active: boolean;
  subcategories: Category[];
}

export interface FindResult {
  node: Category;
  path: string;
  depth: number;
  parentId: number | null;
  isLeaf: boolean;
}
