import { fetchAPI } from "../config";
import { CategoryResponse } from "./types";

export const getCategories = async (): Promise<CategoryResponse> => {
  const res = await fetchAPI({
    url: `/api/v1/categories`,
  });

  return res;
};
