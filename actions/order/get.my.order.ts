import { fetchAPI } from "../config";
import { IOrder } from "@/types/orders";

const getMyOrder = async (
  id: string
): Promise<{
  data: IOrder | null;
}> => {
  const res = await fetchAPI({
    url: `/api/v1/orders/me/${id}`,
  });

  if (res.error) {
    return { data: null };
  }

  return res;
};

export default getMyOrder;
