import { Metadata } from "@/types";
import { fetchAPI } from "./config";
import { Product } from "./types";
import { toQueryParams } from "./utils";

export interface ProductsResponse {
  data: {
    results: Product[];
    metadata: Metadata;
  };
}

const getProducts = async (params?: {
  p?: number;
  l?: number;
  q?: string;
  business?: string;
  category?: string;
  categorySlug?: string;
  status?: string;
}): Promise<ProductsResponse> => {
  const res = await fetchAPI({
    url: `/api/v1/products${toQueryParams(params || {})}`,
  });
  if (res?.error) {
    return {
      data: {
        results: [],
        metadata: {
          totalCount: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    };
  }
  return res;
};

export default getProducts;
