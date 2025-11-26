import { fetchAPI } from "../config";
import { IOrder } from "@/types/orders";
import { toQueryParams } from "../utils";

export const getMyOrder = async (params?:
    {
        status?: string;
        orderId?: string;

    }
): Promise<{
    data: IOrder | null;
}> => {
    const res = await fetchAPI({
        url: `/api/v1/orders${toQueryParams(params || {})}`,
    });

    if (res.error) {
        return { data: null };
    }
    console.log(res)
    return res;
};


export const getMyOrderDetail = async (
    orderId: string
): Promise<{
    data: IOrder | null
}> => {

    const res = await fetchAPI({ url: `/api/v1/orders/${orderId}` })

    if (res?.error) {
        return { data: null };
    }
    return res
}