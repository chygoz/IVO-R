// {{IVO_API}}/api/v1/orders?businessId=6764e660939808bee1cfd3c0

import { fetchAPI } from "@/actions/config";
import { IOrder } from "@/types/orders";

interface CreateOrderPayload {
    shippingId: string;
    paymentMethod: string;
    amount: number | string;
    referenceId?: string;
    cartItems: Array<{
        productId: string;
        quantity: number;
        price: number;
        color?: string;
        size?: string;
    }>;
}


const createResellerOrder = async (
    businessId: string,
    payload: CreateOrderPayload
): Promise<{ data: IOrder }> => {
    try {
        console.log("Sending payload to create order:", payload);

        const res = await fetchAPI({
            url: `/api/v1/orders?businessId=${businessId}`,
            body: payload,
            method: "POST",
        });

        console.log("Raw response from server:", res);

        if (res.error) {
            throw new Error(res.message || "Failed to create order");
        }

        return res;
    } catch (error: any) {
        console.error("Checkout failed", error?.response ?? error?.message ?? error);
        throw new Error(error?.message || "An unexpected error occurred");
    }
};


export default createResellerOrder;
