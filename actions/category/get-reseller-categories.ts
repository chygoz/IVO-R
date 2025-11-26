import { fetchAPI } from "../config";
import { CATEGORY_BASE_URL } from "./config";
import { CategoryResponse } from "./types";

export const getResellerCategories = async (
  businessId: string
): Promise<CategoryResponse> => {
  const res = await fetchAPI({
    url: `${CATEGORY_BASE_URL}/business/${businessId}`,
  });

  return res;
};
