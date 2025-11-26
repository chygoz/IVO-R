import { fetchAPI } from "../config";
import { IOrder } from "@/types/orders";

const getOrder = async (
  orderId: string
): Promise<{
  data: IOrder | null;
}> => {
  const res = await fetchAPI({
    url: `/api/v1/orders/user/${orderId}`,
  });

  if (res.error) {
    return { data: null };
  }

  return { data: res };
};

export default getOrder;
