
export interface CategoryCreate {
  name: string;
  slug: string;
  type: "CLASS" | "BOARD" | "TYPE";
  parentId?: string;
}

export interface CategoryUpdate {
  name?: string;
  slug?: string;
  type?: "CLASS" | "BOARD" | "TYPE";
  parentId?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: "CLASS" | "BOARD" | "TYPE";
  parentId?: string;
  createdAt?: string;
  updatedAt?: string;
}
 
