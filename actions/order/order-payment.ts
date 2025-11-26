import { IOrder } from "@/types/orders";
import { fetchAPI } from "../config";

export type ProcessPaymentInput = {
  orderId: string;
  transactionId: string;
  businessId: string;
};

const orderPayment = async (
  data: ProcessPaymentInput
): Promise<{
  success: boolean;
  data?: IOrder;
  message: string;
}> => {
  console.log("pro");
  const res = await fetchAPI({
    method: "POST",
    url: `/api/v1/orders/${data.orderId}/payment?businessId=${data.businessId}`,
    body: { transactionId: data.transactionId },
  });

  if (res.error) {
    return { success: false, message: res.details };
  }

  return res;
};

export default orderPayment;
