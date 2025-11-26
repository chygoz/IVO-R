import { fetchAPI } from "../config";
import { Subscription } from "./utils";

type SubscriptionResponse = {
    data: Subscription | null;
    error?: string;
};

const getUserSubscription = async (): Promise<SubscriptionResponse> => {
    try {
        const res = await fetchAPI({ url: `/api/v1/subscriptions/me` });
        console.log(res)

        if (res.error) {
            return { data: null, error: res.error };
        }

        return res
    } catch (error: any) {
        return {
            data: null,
            error: error?.message || "Failed to fetch subscription",
        };
    }
};

export default getUserSubscription;
