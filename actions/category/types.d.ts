export interface Category {
  _id: string;
  name: string;
  slug: string;
  gallery: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryResponse {
  data: {
    results: Category[];
  };
}

export interface SingleCategoryResponse {
  data: Category;
}

export interface CreateCategoryResponse {
  data: Category;
}
