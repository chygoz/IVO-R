import { fetchAPI } from "@/actions/config";


type MakePaymentPayload = {
    transactionId: string;
    paymentMethod: "payment_gateway";
    paymentDetails: {
      type: "transfer";
    };
  };
  
  const initiatePayment = async (orderId: string, payload: MakePaymentPayload): Promise<any> => {
    const res = await fetchAPI({
      url: `/api/v1/orders/${orderId}/payment`,
      method: "POST",
      body: payload,
    });
  
    if (res.error) throw new Error("Payment initiation failed");
  
    return res;
  };
  
  export default initiatePayment;
  