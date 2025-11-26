import { Product } from "@/types/product";
import { fetchAPI } from "./config";

const getProduct = async (id: string): Promise<{ data: Product | null }> => {
  const res = await fetchAPI({ url: `/api/v1/products/${id}` });

  if (res.error) {
    return { data: null };
  }

  return res;
};

export default getProduct;
