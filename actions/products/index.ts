import { fetchAPI } from "../config";

const publishProduct = async (data: {
  productSlug: string;
  status: string;
}): Promise<{ data: any }> => {
  const res = await fetchAPI({
    method: "PUT",
    url: `/api/v1/products/${data.productSlug}/publish`,
    body: {
      status: data.status,
    },
  });

  return res;
};

export default publishProduct;
