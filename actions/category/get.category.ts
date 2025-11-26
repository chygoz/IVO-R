import { fetchAPI } from "../config";
import { CATEGORY_BASE_URL } from "./config";
import { SingleCategoryResponse } from "./types";

export const getCategory = async (
  id: string
): Promise<SingleCategoryResponse | null> => {
  try {
    const res = await fetchAPI({
      url: `${CATEGORY_BASE_URL}/${id}`,
    });

    return res;
  } catch (error) {
    return null;
  }
};
