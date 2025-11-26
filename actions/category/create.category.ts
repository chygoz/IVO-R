import { fetchAPI } from "../config";
import { CATEGORY_BASE_URL } from "./config";
import { CreateCategoryResponse } from "./types";

export const createCategory = async (data: {
  name: string;
}): Promise<CreateCategoryResponse> => {
  const res = await fetchAPI({
    url: `${CATEGORY_BASE_URL}`,
    method: "POST",
    body: data,
  });

  if (res?.error) {
    throw new Error(res.details);
  }

  return res;
};
