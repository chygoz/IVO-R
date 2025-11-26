import { fetchAPI } from "../config";
import { IOrder } from "@/types/orders";

const getMyOrders = async (): Promise<{
  data: {
    results: IOrder[];
  };
}> => {
  const res = await fetchAPI({
    url: "/api/v1/orders/me",
  });

  if (res.error) {
    return {
      data: {
        results: [],
      },
    };
  }

  return res;
};

export default getMyOrders;
