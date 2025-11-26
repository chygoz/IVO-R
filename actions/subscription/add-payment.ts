import { fetchAPI } from "../config";


const addPayment = async (id: string): Promise<{ data: any }> => {
    const res = await fetchAPI({ url: `/api/v1/subscriptions/${id}/payments` });

    if (res.error) {
        return { data: null };
    }
    console.log('categories', res)
    return res;
};

export default addPayment;