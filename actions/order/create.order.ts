import { fetchAPI } from "../config";
import { IOrder } from "@/types/orders";

const createOrder = async (data: {
  shippingId: string;
  businessId: string;
  idempotencyKey?: string;
}): Promise<{
  success: boolean;
  order: IOrder;
  message: string;
}> => {
  const { businessId, ...rest } = data;
  const res = await fetchAPI({
    method: "POST",
    url: `/api/v1/orders?businessId=${businessId}`,
    body: rest,
  });

  if (res.error) {
    new Error(res.details);
  }

  return res;
};

export default createOrder;
