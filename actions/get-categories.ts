import { fetchAPI } from "./config";
import { CategoryFilter } from "./types";

const getCategories = async (
  id: string
): Promise<{ data: CategoryFilter | null }> => {
  const res = await fetchAPI({ url: `/api/v1/categories/business/${id}` });

  if (res.error) {
    return { data: null };
  }
  return res;
};

export default getCategories;
