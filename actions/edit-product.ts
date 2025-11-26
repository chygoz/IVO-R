import { fetchAPI } from "./config";
// import { PRODUCT_BASE_URL } from "./config";
import { CreateProductInput } from "./types";

export const editProduct = async (data: CreateProductInput): Promise<any> => {
  const res = await fetchAPI({
    url: '/api/v1/submissions',
    method: "POST",
    body: {...data, category: "edit" },
  });

  if (res?.error) {
    throw new Error(res.details);
  }

  return res || [];
};